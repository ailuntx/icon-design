import importlib.util
import tempfile
import unittest
from pathlib import Path
from PIL import Image,ImageDraw

SCRIPT=Path(__file__).resolve().parents[1]/'plugins/icon-design/skills/icon-design/scripts/icon-assets.py'
spec=importlib.util.spec_from_file_location('assets',SCRIPT)
assets=importlib.util.module_from_spec(spec);spec.loader.exec_module(assets)

class AssetsTests(unittest.TestCase):
    def test_exterior_matte_preserves_enclosed_white(self):
        im=Image.new('RGB',(64,64),'white');d=ImageDraw.Draw(im)
        d.rectangle((10,10,54,54),fill='#0055cc');d.rectangle((20,20,44,44),fill='white')
        result=assets.remove_white_matte(im)
        self.assertEqual(result.getpixel((0,0))[3],0)
        self.assertEqual(result.getpixel((32,32)),(255,255,255,255))
        self.assertEqual(result.getpixel((12,12)),(0,85,204,255))
    def test_preparation_preserves_source_alpha_and_refuses_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);source=root/'input.png';out=root/'layers'
            im=Image.new('RGBA',(1024,1024));ImageDraw.Draw(im).ellipse((200,200,800,800),fill='#0077ff');im.save(source)
            before=source.read_bytes();assets.prepare(source,out)
            self.assertEqual(source.read_bytes(),before)
            self.assertEqual(Image.open(out/'01-foreground.png').tobytes(),im.tobytes())
            with self.assertRaisesRegex(ValueError,'exists'):assets.prepare(source,out)
    def test_legacy_icon_roundtrip(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);source=root/'input.png';Image.new('RGBA',(1024,1024),'blue').save(source)
            assets.legacy(source,root/'legacy','Demo')
            with Image.open(root/'legacy/Demo.icns') as im:
                im.load();self.assertEqual(im.size,(1024,1024))
            self.assertEqual(len(list((root/'legacy/Demo.iconset').glob('*.png'))),10)

if __name__=='__main__':unittest.main()
