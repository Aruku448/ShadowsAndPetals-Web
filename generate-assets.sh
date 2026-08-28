#!/usr/bin/env bash
set -euo pipefail

mkdir -p assets

magick -size 320x180 gradient:'#d9b38c-#73867f' \
  -fill '#eee5cf' -draw 'circle 255,36 272,36' \
  -fill '#a68270' -draw 'polygon 0,91 42,57 81,89 118,48 162,92 202,62 248,94 282,55 320,88 320,180 0,180' \
  -fill '#59615c' -draw 'polygon 0,112 28,79 60,105 93,73 130,107 174,76 208,111 250,76 286,108 320,85 320,180 0,180' \
  -fill '#303936' -draw 'polygon 0,126 36,103 73,116 110,94 147,123 186,96 225,118 268,91 320,116 320,180 0,180' \
  -fill '#171b1a' -draw 'polygon 0,142 42,126 91,137 137,117 181,137 225,123 274,140 320,124 320,180 0,180' \
  -fill '#111413' -draw 'rectangle 132,54 151,133 rectangle 190,54 209,133 rectangle 132,54 209,72' \
  -fill '#39413d' -draw 'polygon 132,54 141,47 160,47 151,54 polygon 190,54 199,47 218,47 209,54 polygon 151,54 160,47 218,47 209,54' \
  -fill '#a9f3df' -draw 'rectangle 153,70 188,128' \
  -fill '#43a8a4' -draw 'rectangle 158,75 183,128' \
  -fill '#d7fff5' -draw 'rectangle 161,78 180,121' \
  -fill '#df5028' -draw 'polygon 0,164 53,153 91,162 130,151 174,158 215,149 258,161 320,145 320,180 0,180' \
  -fill '#ffb33b' -draw 'polygon 0,170 56,160 95,168 133,158 174,165 216,156 260,168 320,153 320,180 0,180' \
  -fill '#ffe074' -draw 'polygon 0,176 59,166 97,174 137,164 178,171 218,162 263,174 320,159 320,180 0,180' \
  -fill '#242927' -draw 'rectangle 22,127 48,151 rectangle 52,133 73,158 rectangle 239,130 264,155 rectangle 270,123 296,151' \
  -fill '#6d7c6c' -draw 'rectangle 25,124 51,128 rectangle 55,130 76,134 rectangle 242,127 267,131 rectangle 273,120 299,124' \
  -filter point -resize 1920x1080 assets/hero-ashfall.png

magick -size 240x150 gradient:'#a8d7ce-#d9e6bd' \
  -fill '#f2dda0' -draw 'circle 194,27 207,27' \
  -fill '#517761' -draw 'polygon 0,78 28,54 50,74 79,46 111,79 143,49 178,76 207,52 240,71 240,150 0,150' \
  -fill '#244c3c' -draw 'polygon 0,93 31,71 62,89 92,65 126,91 163,68 196,91 222,69 240,83 240,150 0,150' \
  -fill '#14372c' -draw 'rectangle 12,61 20,122 rectangle 39,72 46,127 rectangle 184,58 192,124 rectangle 212,69 219,129' \
  -fill '#2e6d45' -draw 'rectangle 4,49 29,72 rectangle 31,58 54,82 rectangle 173,45 202,71 rectangle 202,56 229,80' \
  -fill '#5ea85a' -draw 'rectangle 8,43 25,52 rectangle 35,51 50,61 rectangle 177,39 197,49 rectangle 208,50 225,59' \
  -fill '#4aa9a8' -draw 'polygon 0,116 45,108 83,119 123,105 166,115 205,104 240,112 240,150 0,150' \
  -fill '#79d3c4' -draw 'polygon 0,125 47,116 86,126 125,113 168,123 207,112 240,120 240,150 0,150' \
  -fill '#d8fbdf' -draw 'polygon 28,126 76,119 105,126 64,129' \
  -fill '#24372b' -draw 'rectangle 102,78 136,110' \
  -fill '#9cc550' -draw 'rectangle 106,74 132,81' \
  -filter point -resize 1440x900 assets/feature-ecology.png

magick -size 240x150 gradient:'#4b4a4a-#171b1c' \
  -fill '#282e2f' -draw 'rectangle 0,102 240,150 rectangle 0,20 240,29' \
  -stroke '#6b7472' -strokewidth 2 -fill none -draw 'line 0,38 240,38 line 0,64 240,64 line 0,91 240,91 line 34,0 34,150 line 203,0 203,150' \
  -stroke none -fill '#141819' -draw 'rectangle 55,32 185,137' \
  -fill '#727a76' -draw 'rectangle 61,38 179,131' \
  -fill '#272d2c' -draw 'rectangle 70,47 170,122' \
  -fill '#be3d23' -draw 'circle 120,84 157,84' \
  -fill '#f26c31' -draw 'circle 120,84 148,84' \
  -fill '#ffd35b' -draw 'circle 120,84 136,84' \
  -fill '#fff2a6' -draw 'circle 120,84 127,84' \
  -fill '#899490' -draw 'rectangle 104,31 136,47 rectangle 104,121 136,137 rectangle 52,68 70,99 rectangle 170,68 188,99' \
  -fill '#b7c1bc' -draw 'polygon 104,31 111,25 143,25 136,31 polygon 136,31 143,25 143,41 136,47' \
  -fill '#9ae8dd' -draw 'rectangle 82,54 91,60 rectangle 149,54 158,60 rectangle 82,108 91,114 rectangle 149,108 158,114' \
  -fill '#e4502c' -draw 'rectangle 15,114 47,121 rectangle 193,114 225,121' \
  -filter point -resize 1440x900 assets/feature-machinery.png

magick -size 240x150 gradient:'#918ca3-#d7d4db' \
  -fill '#dfe9ed' -draw 'polygon 0,103 39,52 73,91 112,38 151,95 185,55 240,106 240,150 0,150' \
  -fill '#a5b4bc' -draw 'polygon 0,113 41,65 73,99 113,49 152,104 186,68 240,116 240,150 0,150' \
  -fill '#eff8f7' -draw 'polygon 35,71 41,65 73,99 63,92 112,49 126,74 113,64 89,96 152,104 143,91 186,68 198,80 187,77 168,104 240,116 240,150 0,150' \
  -fill '#40505c' -draw 'rectangle 87,92 151,130' \
  -fill '#202a31' -draw 'polygon 81,92 119,71 158,92 151,99 119,81 87,99' \
  -fill '#5d737c' -draw 'polygon 151,99 158,92 158,124 151,130' \
  -fill '#f0c64c' -draw 'rectangle 112,101 125,115' \
  -fill '#91e2eb' -draw 'rectangle 93,99 105,109 rectangle 133,99 145,109' \
  -stroke '#ffffff' -strokewidth 1 -draw 'line 8,19 27,35 line 43,9 68,30 line 90,10 111,31 line 141,8 161,28 line 188,14 213,36 line 220,5 239,23 line 15,52 30,65 line 58,44 75,61 line 166,43 181,58 line 209,49 227,66' \
  -filter point -resize 1440x900 assets/feature-weather.png

magick -size 64x64 canvas:'#111111' -fill '#ddfd5a' -draw 'rectangle 10,10 28,28 rectangle 36,10 54,28 rectangle 10,36 28,54' assets/favicon.png

magick -size 240x150 gradient:'#3b3c3c-#111313' \
  -fill '#263330' -draw 'polygon 0,101 31,76 62,103 93,61 127,101 161,69 198,104 228,76 240,86 240,150 0,150' \
  -fill '#48736d' -draw 'polygon 0,115 36,91 67,113 99,81 130,116 163,90 201,117 231,95 240,102 240,150 0,150' \
  -fill '#14221f' -draw 'rectangle 67,74 175,129 rectangle 77,66 165,74' \
  -fill '#d56d33' -draw 'rectangle 84,82 99,117 rectangle 143,82 158,117' \
  -fill '#a4edca' -draw 'rectangle 103,84 139,119' \
  -fill '#54c9a5' -draw 'rectangle 109,90 133,113' \
  -fill '#f8d364' -draw 'circle 194,42 205,42 circle 218,55 226,55' \
  -fill '#798b81' -draw 'rectangle 20,123 53,130 rectangle 185,126 220,133' \
  -filter point -resize 1440x900 assets/news-cavern.png

magick -size 240x150 gradient:'#d7c8ac-#818a78' \
  -fill '#5d695d' -draw 'polygon 0,99 31,72 63,103 92,64 124,99 163,58 198,102 224,75 240,94 240,150 0,150' \
  -fill '#39463d' -draw 'polygon 0,113 32,88 69,111 98,81 130,114 165,76 198,115 225,95 240,106 240,150 0,150' \
  -fill '#252d29' -draw 'rectangle 30,82 51,133 rectangle 58,91 83,138 rectangle 175,78 197,132 rectangle 205,90 226,139' \
  -fill '#bb8b59' -draw 'rectangle 79,87 92,129 rectangle 148,85 162,127' \
  -fill '#8ed0ab' -draw 'circle 117,73 140,73 circle 141,67 158,67' \
  -fill '#dff5bd' -draw 'circle 116,68 130,68' \
  -fill '#c7d4c7' -draw 'rectangle 98,111 109,136 rectangle 133,108 145,136' \
  -filter point -resize 1440x900 assets/about-team.png

magick -size 240x150 gradient:'#232b2e-#0e1517' \
  -stroke '#405357' -strokewidth 2 -fill none -draw 'line 0,34 240,34 line 0,72 240,72 line 0,109 240,109 line 39,0 39,150 line 198,0 198,150' \
  -stroke none -fill '#1d292b' -draw 'rectangle 50,28 190,130' \
  -fill '#42585a' -draw 'rectangle 59,37 181,122' \
  -fill '#0f1719' -draw 'rectangle 70,48 170,112' \
  -fill '#e45d2d' -draw 'circle 120,80 151,80' \
  -fill '#f7bd4c' -draw 'circle 120,80 140,80' \
  -fill '#e9f8cf' -draw 'circle 120,80 128,80' \
  -fill '#9fe4d4' -draw 'rectangle 77,59 89,71 rectangle 151,59 163,71 rectangle 77,96 89,108 rectangle 151,96 163,108' \
  -fill '#87a2a0' -draw 'rectangle 101,29 139,40 rectangle 101,120 139,131' \
  -filter point -resize 1440x900 assets/research-lab.png

magick -size 240x150 gradient:'#a6cbd0-#e5e4c8' \
  -fill '#508375' -draw 'polygon 0,95 35,54 64,91 96,46 130,96 164,58 199,97 227,68 240,90 240,150 0,150' \
  -fill '#2c5b51' -draw 'polygon 0,111 37,71 69,107 101,62 132,110 165,77 200,112 228,88 240,102 240,150 0,150' \
  -fill '#183d37' -draw 'rectangle 79,83 159,137' \
  -fill '#a8d66e' -draw 'rectangle 92,92 106,119 rectangle 132,92 146,119' \
  -fill '#e7f8c4' -draw 'rectangle 109,95 129,126' \
  -fill '#f3d15b' -draw 'circle 189,34 204,34' \
  -fill '#d7fff1' -draw 'rectangle 27,122 72,128 rectangle 168,125 212,131' \
  -filter point -resize 1440x900 assets/sustainability-world.png

# Reusable material maps. These remain neutral so CSS blend modes can tint them.
magick -size 512x512 canvas:'gray(50%)' \
  -attenuate 0.34 +noise Gaussian -colorspace Gray -blur 0x0.28 -depth 8 -strip \
  assets/texture-grain.png

magick -size 1024x1024 canvas:black \
  -fill 'gray(92%)' -draw 'ellipse 310,250 360,225 0,360' \
  -blur 0x125 -level 7%,93% -depth 8 -strip \
  assets/texture-highlight.png

magick -size 512x512 plasma:fractal -colorspace Gray \
  -blur 0x10 -auto-level -evaluate multiply 0.38 -evaluate add 31% -depth 8 -strip \
  assets/texture-glass.png
