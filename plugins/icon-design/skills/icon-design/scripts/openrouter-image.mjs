#!/usr/bin/env node
// Optional OpenRouter adapter. No dependencies; credentials enter only through env.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

export async function loadReference(file) {
  const info=await fs.stat(file);
  if (!info.isFile() || info.size>10*1024*1024) throw new Error('invalid_reference');
  const bytes=await fs.readFile(file);
  const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpeg=bytes[0]===255 && bytes[1]===216 && bytes[2]===255;
  if (!png && !jpeg) throw new Error('invalid_reference');
  return {url:`data:image/${png?'png':'jpeg'};base64,${bytes.toString('base64')}`,sha256:createHash('sha256').update(bytes).digest('hex')};
}

export function decodeImage(data) {
  const item = data?.data?.[0];
  if (!item?.b64_json) throw new Error('missing_inline_image');
  const bytes = Buffer.from(item.b64_json, 'base64');
  if (!bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw new Error('not_png');
  return bytes;
}

export async function generate({prompt, quality='low', key, reference, fetchImpl=fetch}) {
  if (!key) throw new Error('missing_key');
  if (!['low','medium','high'].includes(quality)) throw new Error('invalid_quality');
  if (reference && !/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/.test(reference.url ?? '')) throw new Error('invalid_reference');
  const res = await fetchImpl('https://openrouter.ai/api/v1/images', {
    method:'POST', redirect:'error', signal:AbortSignal.timeout(240000),
    headers:{Authorization:`Bearer ${key}`, 'Content-Type':'application/json'},
    body:JSON.stringify({model:'openai/gpt-image-2',prompt,aspect_ratio:'1:1',quality,n:1,
      ...(reference?{input_references:[{type:'image_url',image_url:{url:reference.url}}]}:{})}),
  });
  // Never return provider error bodies, URLs, headers or request contents.
  if (!res.ok) throw new Error(`http_${res.status}`);
  const data=await res.json();
  const cost=data.usage?.cost;
  return {bytes:decodeImage(data),cost:typeof cost==='number' && Number.isFinite(cost) ? cost : null};
}

async function main() {
  const args=process.argv.slice(2);
  if(args.length<2 || args.includes('--help')) {
    console.log('node openrouter-image.mjs PROMPT.txt OUTPUT.png [low|medium|high] [--reference IMAGE.png]\nOptional local PNG/JPEG is sent to OpenRouter as a reference. Requires OPENROUTER_API_KEY; one paid request, no automatic retries.');return;
  }
  const [promptFile,output,...options]=args;
  const quality=options[0] && !options[0].startsWith('--')?options.shift():'low';
  if (options.length!==0 && (options.length!==2 || options[0]!=='--reference')) throw new Error('invalid_arguments');
  const referenceFile=options[1];
  const reference=referenceFile?await loadReference(referenceFile):undefined;
  await fs.mkdir(path.dirname(output),{recursive:true});
  const handle=await fs.open(output,'wx'); // Never overwrite a previous paid result.
  try {
    const prompt=await fs.readFile(promptFile,'utf8');
    const {bytes,cost}=await generate({prompt,quality,key:process.env.OPENROUTER_API_KEY,reference});
    await handle.writeFile(bytes);
    const status={ok:true,model:'openai/gpt-image-2',quality,cost_usd:cost,
      ...(reference?{reference_sha256:reference.sha256}:{}),reference_count:reference?1:0};
    await fs.writeFile(output+'.json',JSON.stringify(status,null,2)+'\n');
    console.log(JSON.stringify(status));
  } catch(e) {
    await fs.unlink(output).catch(()=>{});
    const code=/^(missing_key|invalid_quality|http_\d{3}|missing_inline_image|not_png)$/.test(e.message)?e.message:'generation_failed';
    await fs.writeFile(output+'.json',JSON.stringify({ok:false,code})+'\n');
    console.error(JSON.stringify({ok:false,code}));process.exitCode=1;
  } finally {await handle.close();}
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  main().catch(e=>{const code=['invalid_arguments','invalid_reference'].includes(e.message)?e.message:'local_io_error';console.error(JSON.stringify({ok:false,code}));process.exitCode=1;});
}
