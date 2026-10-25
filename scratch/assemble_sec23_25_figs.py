import os
from PIL import Image

ch_dir = r'd:\IT sandbox\Starley-CS-Library\books\cardiac-echo\eacvi-echo-handbook\chapters\chapter-02'
img_dir = os.path.join(ch_dir, 'images')

def save_fig(fig_name, img):
    p1 = os.path.join(img_dir, fig_name)
    p2 = os.path.join(ch_dir, fig_name)
    img.save(p1, quality=95)
    img.save(p2, quality=95)
    print(f"Saved {fig_name}: {img.size}")

def stitch_h(img_files, spacing=10):
    images = []
    for f in img_files:
        p = os.path.join(img_dir, f)
        if os.path.exists(p):
            images.append(Image.open(p))
    if not images:
        return None
    max_h = max(im.height for im in images)
    resized = []
    for im in images:
        if im.height != max_h:
            new_w = int(im.width * (max_h / im.height))
            im_r = im.resize((new_w, max_h), Image.LANCZOS)
            resized.append(im_r)
        else:
            resized.append(im)
    tot_w = sum(im.width for im in resized) + spacing * (len(resized) - 1)
    combined = Image.new('RGB', (tot_w, max_h), (255, 255, 255))
    x_offset = 0
    for im in resized:
        combined.paste(im, (x_offset, 0))
        x_offset += im.width + spacing
    return combined

# Section 2.3: Functional Echo
# p73: Velocity, displacement, strain principles
im_2_3_1 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p73_')])
if im_2_3_1: save_fig('fig-02-31.jpg', im_2_3_1)

# p74-75: Tissue Doppler principles & wall filters
im_2_3_4 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p74_') or f.startswith('p75_')])
if im_2_3_4: save_fig('fig-02-32.jpg', im_2_3_4)

# p76: TDI sample volume position & settings
im_2_3_6 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p76_')][:6])
if im_2_3_6: save_fig('fig-02-33.jpg', im_2_3_6)

# p81-82: Speckle tracking feature tracking & verification
im_2_3_10 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p81_') or f.startswith('p82_')])
if im_2_3_10: save_fig('fig-02-34.jpg', im_2_3_10)

# p83: Twist, torsion, and global longitudinal strain (GLS)
im_2_3_11 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p83_')])
if im_2_3_11: save_fig('fig-02-35.jpg', im_2_3_11)

# p84-85: Timing of cardiac events, strain amplitude & post-systolic shortening
im_2_3_12 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p84_') or f.startswith('p85_')])
if im_2_3_12: save_fig('fig-02-36.jpg', im_2_3_12)

# Section 2.4: 3D Echo
# p91-93: 3D artefacts (stitching, dropout) & cropping
im_2_4_1 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p91_') or f.startswith('p93_')][:4])
if im_2_4_1: save_fig('fig-02-37.jpg', im_2_4_1)

# p94: 3D volume rendering, MV anatomy, RV diastole/systole
im_2_4_8 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p94_')][:4])
if im_2_4_8: save_fig('fig-02-38.jpg', im_2_4_8)

# p95-96: Multi-slice display & tri-plane imaging
im_2_4_14 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p95_') or f.startswith('p96_')][:4])
if im_2_4_14: save_fig('fig-02-39.jpg', im_2_4_14)

# p107-108: 3D quantification (MVA, LVOT, LV & RV volumes and EF)
im_2_4_50 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p107_') or f.startswith('p108_')][:4])
if im_2_4_50: save_fig('fig-02-40.jpg', im_2_4_50)

# Section 2.5: Contrast Echo
# p115: Contrast cardiography & end-diastolic/systolic volumes
im_2_5_3 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p115_')])
if im_2_5_3: save_fig('fig-02-41.jpg', im_2_5_3)

# p119: Three-way tap cannula & injection site
im_2_5_9 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p117_') or f.startswith('p119_')])
if im_2_5_9: save_fig('fig-02-42.jpg', im_2_5_9)

# p121: Contrast artefacts (attenuation, blooming, swirling)
im_2_5_11 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p121_')][:4])
if im_2_5_11: save_fig('fig-02-43.jpg', im_2_5_11)

print("Sections 2.3, 2.4, 2.5 figures assembled successfully!")
