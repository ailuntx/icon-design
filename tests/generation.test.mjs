import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {generate,decodeImage} from '../plugins/icon-design/skills/icon-design/scripts/openrouter-image.mjs';
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lxoAAAAASUVORK5CYII=','base64');
test('requests one low-quality image and keeps credential only in headers',async()=>{
 let calls=0;
 const result=await generate({prompt:'a dock',key:'test-only-secret',fetchImpl:async(url,opts)=>{
  calls++; assert.equal(url,'https://openrouter.ai/api/v1/images');assert.equal(opts.redirect,'error');
  assert.equal(opts.headers.Authorization,'Bearer test-only-secret');
  const body=JSON.parse(opts.body);assert.equal(body.n,1);assert.equal(body.quality,'low');
  assert.ok(!opts.body.includes('test-only-secret'));
  return {ok:true,json:async()=>({data:[{b64_json:png.toString('base64')}],usage:{cost:.007}})};
 }});
 assert.equal(calls,1);assert.deepEqual(result.bytes,png);assert.equal(result.cost,.007);
});
test('authentication error omits raw response body and does not retry',async()=>{
 let calls=0;
 await assert.rejects(generate({prompt:'x',key:'test-only-secret',fetchImpl:async()=>{calls++;return {ok:false,status:401,json:()=>{throw Error('must not consume secret-bearing body');}};}}),{message:'http_401'});
 assert.equal(calls,1);
});
test('rejects absent keys and unsupported image responses',async()=>{
 await assert.rejects(generate({prompt:'x'}),{message:'missing_key'});
 assert.throws(()=>decodeImage({data:[{url:'https://untrusted.example/image'}]}),/missing_inline_image/);
 assert.throws(()=>decodeImage({data:[{b64_json:Buffer.from('not an image').toString('base64')}]}),/not_png/);
});
test('sends the supplied reference inline and rejects remote reference URLs before a request',async()=>{
 const reference={url:'data:image/png;base64,'+png.toString('base64')};
 let calls=0;
 await generate({prompt:'use shape language, not the exact mark',key:'test-key',reference,fetchImpl:async(url,opts)=>{
  calls++;assert.deepEqual(JSON.parse(opts.body).input_references,[{type:'image_url',image_url:{url:reference.url}}]);
  assert.ok(!opts.body.includes('test-key'));
  return {ok:true,json:async()=>({data:[{b64_json:png.toString('base64')}]})};
 }});
 assert.equal(calls,1);
 await assert.rejects(generate({prompt:'x',key:'test-key',reference:{url:'https://example.com/private.png'},fetchImpl:()=>{throw Error('must not fetch');}}),{message:'invalid_reference'});
});
test('CLI accepts reference with default quality and rejects non-images without a paid request',async()=>{
 const root=await mkdtemp(join(tmpdir(),'icon-reference-test-'));
 try {
  const prompt=join(root,'prompt.txt'),ref=join(root,'reference.png'),output=join(root,'output.png');
  await writeFile(prompt,'an original icon');await writeFile(ref,png);
  const script=fileURLToPath(new URL('../plugins/icon-design/skills/icon-design/scripts/openrouter-image.mjs',import.meta.url));
  const env={...process.env,OPENROUTER_API_KEY:''};
  const result=spawnSync(process.execPath,[script,prompt,output,'--reference',ref],{env,encoding:'utf8'});
  assert.equal(result.status,1);
  assert.equal(JSON.parse(await readFile(output+'.json','utf8')).code,'missing_key');
  await writeFile(ref,'this is not an image');
  const invalid=spawnSync(process.execPath,[script,prompt,output,'--reference',ref],{env,encoding:'utf8'});
  assert.equal(invalid.status,1);assert.equal(JSON.parse(invalid.stderr).code,'invalid_reference');
  assert.ok(!invalid.stderr.includes(ref));
 } finally {await rm(root,{recursive:true,force:true});}
});
