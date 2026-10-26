#!/usr/bin/env python3
"""見出し用フォントのサブセット再生成。

Shippori Mincho SemiBold（SIL OFL 1.1）から、サイト本文に現れる文字だけを
抜き出した単一 woff2 (src/fonts/shippori-mincho-subset.woff2) を作る。
コピーを大きく変えたら再実行すること。

使い方:
  curl -sL -o /tmp/ShipporiMincho-SemiBold.ttf \
    https://github.com/google/fonts/raw/main/ofl/shipporimincho/ShipporiMincho-SemiBold.ttf
  python3 scripts/build-fonts.py  # 要: fonttools, brotli / ビルド済み _site を参照
"""
import re
import pathlib
import subprocess
import sys

root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "_site" / "index.html").read_text()
html = re.sub(r"<style.*?</style>", "", html, flags=re.S)
html = re.sub(r"<script.*?</script>", "", html, flags=re.S)
text = re.sub(r"<[^>]+>", " ", html)
chars = set(text)
for cp in range(0x20, 0x7F):
    chars.add(chr(cp))
for cp in range(0x3000, 0x30FF):
    chars.add(chr(cp))
chars |= set("¥〒・—–「」『』※●／＠：")
unicodes = ",".join(f"U+{ord(c):04X}" for c in sorted(chars))
tmp = pathlib.Path("/tmp/subset-unicodes.txt")
tmp.write_text(unicodes)
out = root / "src" / "fonts" / "shippori-mincho-subset.woff2"
out.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(
    [
        sys.executable, "-m", "fontTools.subset",
        "/tmp/ShipporiMincho-SemiBold.ttf",
        f"--output-file={out}",
        "--flavor=woff2",
        f"--unicodes-file={tmp}",
        "--layout-features=palt,kern,vert,vrt2",
        "--desubroutinize",
    ],
    check=True,
)
print(f"wrote {out} ({out.stat().st_size // 1024} KB, {len(chars)} chars)")
