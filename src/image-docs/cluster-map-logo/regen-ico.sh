#!/bin/bash
# Requires inkscape, imagemagick, and pngquant
set -ex

svg=$1

size=(16 32 24 48 72 96 144 152 192 196)

mkdir -p out

echo Making bitmaps from your svg...

for i in "${size[@]}"; do
  inkscape $svg -o "out/$i.png" -w $i -h $i
done

echo Compressing...

## Replace with your favorite (e.g. pngquant)
# optipng -o7 "$out/*.png"
pngquant -f --ext .png --posterize 4 --speed 1 out/*.png

echo Converting to favicon.ico...

magick out/*.png favicon.ico

# Clean-up
rm -rf out/

echo Done