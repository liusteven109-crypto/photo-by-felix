"""Prepare uncropped web copies: python3 _tools/prepare_landscapes.py PHOTO_LIBRARY."""
from pathlib import Path
from PIL import Image, ImageOps
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'window-light'
library = Path(sys.argv[1])
catalog = OUT / 'photos.js'
photos = json.loads(catalog.read_text().removeprefix('const PHOTOS = ').strip().removesuffix(';'))
by = {p['id']: p for p in photos}
additions = json.loads((ROOT / '_tools/landscape_additions.json').read_text())
for item in additions:
    with Image.open(library / item['source']) as original:
        photo = ImageOps.exif_transpose(original).convert('RGB')
    for edge, quality in [(900, 84), (1800, 88)]:
        target = OUT / f"images/{item['id']}-landscape-{edge}.webp"
        if not target.exists():
            copy = photo.copy()
            copy.thumbnail((edge, edge))
            copy.save(target, quality=quality, method=6)
    by[item['id']] = {
        'id': item['id'], 'title': item['title'], 'description': item['description'],
        'src': f"images/{item['id']}-landscape-1800.webp",
        'thumb': f"images/{item['id']}-landscape-900.webp",
        'original_width': photo.width, 'original_height': photo.height,
        'category': 'landscape', 'chapter': 'landscape'
    }
catalog.write_text('const PHOTOS = ' + json.dumps(list(by.values()), ensure_ascii=False, indent=2) + ';\n')
print(f'Prepared {len(additions)} additional landscape photographs.')
