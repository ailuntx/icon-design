#!/usr/bin/env python3
"""Prepare raster layers and legacy macOS icons. Requires Pillow; no network."""
import argparse
import json
import subprocess
from collections import deque
from pathlib import Path
from PIL import Image, ImageDraw


def remove_white_matte(image):
    """Opt-in near-white exterior flood fill; preserves enclosed white artwork.

    Not segmentation: pale objects touching the matte can be lost. Review on
    dark backgrounds. Prefer native alpha for new generation when supported.
    """
    im = image.convert('RGBA')
    w, h = im.size
    px = im.load()
    seen = bytearray(w*h)
    q = deque([(x, 0) for x in range(w)] + [(x, h-1) for x in range(w)] +
              [(0, y) for y in range(h)] + [(w-1, y) for y in range(h)])
    while q:
        x, y = q.popleft()
        k = y*w+x
        if seen[k]:
            continue
        seen[k] = 1
        r, g, b, a = px[x, y]
        if a == 0 or (min(r, g, b) >= 240 and max(r, g, b)-min(r, g, b) <= 12):
            px[x, y] = (r, g, b, 0)
            q.extend((nx, ny) for nx, ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)) if 0<=nx<w and 0<=ny<h)
    # Estimate coverage only along the exterior boundary, not across the mark.
    original = im.copy().load()
    for y in range(1, h-1):
        for x in range(1, w-1):
            r,g,b,a = original[x,y]
            if a == 255 and any(original[nx,ny][3]==0 for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1))):
                if min(r,g,b)>170:
                    alpha=max(1,255-min(r,g,b))
                    rgb=tuple(max(0,min(255,round((c-255*(1-alpha/255))/(alpha/255)))) for c in (r,g,b))
                    px[x,y]=(*rgb,alpha)
    return im


def prepare(source, out, white_matte=False):
    if out.exists():
        raise ValueError('output_directory_exists')
    im = Image.open(source).convert('RGBA')
    if im.size != (1024,1024):
        raise ValueError('expected_1024_square_do_not_silently_upscale')
    if white_matte:
        if im.getchannel('A').getextrema()[0] < 255:
            raise ValueError('already_has_alpha_use_without_white_matte')
        im = remove_white_matte(im)
    if im.getchannel('A').getextrema()[0] == 255:
        raise ValueError('foreground_needs_transparent_exterior')
    bbox=im.getchannel('A').getbbox()
    if bbox is None:
        raise ValueError('empty_foreground')
    out.mkdir(parents=True)
    im.save(out/'01-foreground.png')
    for name,color in [('light','#f2f3f7'),('dark','#191b26')]:
        bg=Image.new('RGBA',im.size,color)
        Image.alpha_composite(bg,im).convert('RGB').save(out/f'preview-{name}.png')
    report={'size':list(im.size),'alpha_bbox':list(bbox),'white_matte_extraction':white_matte,
            'review_required':['dark-edge halo','pale details','16px silhouette'],
            'layers':['01-foreground.png'],'background':'Set color or gradient in Icon Composer',
            'native_icon':False}
    (out/'assets.json').write_text(json.dumps(report,indent=2)+'\n')
    return report


def legacy(source,out,name):
    """Input must be a flattened macOS export with approved mask and padding."""
    if not name or not all(c.isalnum() or c in '-_' for c in name):
        raise ValueError('unsafe_name')
    if out.exists():
        raise ValueError('output_directory_exists')
    im=Image.open(source).convert('RGBA')
    if im.size!=(1024,1024):
        raise ValueError('expected_1024_square')
    iconset=out/(name+'.iconset');iconset.mkdir(parents=True)
    for size in [16,32,128,256,512]:
        for scale in [1,2]:
            filename=f'icon_{size}x{size}'+('@2x' if scale==2 else '')+'.png'
            im.resize((size*scale,size*scale),Image.Resampling.LANCZOS).save(iconset/filename)
    subprocess.run(['iconutil','-c','icns',str(iconset),'-o',str(out/(name+'.icns'))],check=True)


def main():
    p=argparse.ArgumentParser(description=__doc__)
    sub=p.add_subparsers(dest='command',required=True)
    a=sub.add_parser('prepare');a.add_argument('source',type=Path);a.add_argument('out',type=Path);a.add_argument('--white-matte',action='store_true')
    a=sub.add_parser('legacy');a.add_argument('source',type=Path);a.add_argument('out',type=Path);a.add_argument('--name',default='AppIcon')
    args=p.parse_args()
    if args.command=='prepare': print(json.dumps(prepare(args.source,args.out,args.white_matte)))
    else: legacy(args.source,args.out,args.name)


if __name__=='__main__': main()
