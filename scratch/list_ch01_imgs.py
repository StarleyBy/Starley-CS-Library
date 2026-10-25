import os
from PIL import Image

img_dir = r'd:\IT sandbox\Starley-CS-Library\books\cardiac-echo\eacvi-echo-handbook\chapters\chapter-01\images'
files = sorted([f for f in os.listdir(img_dir) if f.endswith('.jpeg')])
for f in files:
    path = os.path.join(img_dir, f)
    im = Image.open(path)
    print(f"{f}: size={im.size}")
