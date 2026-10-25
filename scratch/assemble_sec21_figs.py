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
    images = [Image.open(os.path.join(img_dir, f)) for f in img_files]
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

# Figures 2.1.1 to 2.1.4: Patient Positions (Stitched 2x2 or 4x1)
im_2_1_1 = stitch_h(['p40_img0_38526.jpeg', 'p40_img1_38527.jpeg', 'p40_img2_38528.jpeg', 'p40_img3_38529.jpeg'])
save_fig('fig-02-01.jpg', im_2_1_1)

# Fig. 2.1.5: Right parasternal approach
im_2_1_5 = stitch_h(['p41_img0_38517.jpeg', 'p41_img1_38518.png'])
save_fig('fig-02-02.jpg', im_2_1_5)

# Fig. 2.1.6: PTLAX
im_2_1_6 = Image.open(os.path.join(img_dir, 'p42_img0_39092.jpeg'))
save_fig('fig-02-03.jpg', im_2_1_6)

# Fig. 2.1.7: M-mode tracings (A, B, C, D)
im_2_1_7 = stitch_h(['p42_img1_39093.jpeg', 'p42_img2_39094.jpeg', 'p42_img3_39095.jpeg', 'p42_img4_39096.jpeg'])
save_fig('fig-02-04.jpg', im_2_1_7)

# Fig. 2.1.8: PTSAX views
im_2_1_8 = stitch_h(['p43_img0_39078.jpeg', 'p43_img1_39079.jpeg', 'p43_img2_39080.jpeg', 'p43_img3_39081.jpeg'])
save_fig('fig-02-05.jpg', im_2_1_8)

# Fig. 2.1.9: RV outflow and inflow
im_2_1_9 = stitch_h(['p43_img4_39082.jpeg', 'p43_img5_39083.jpeg'])
save_fig('fig-02-06.jpg', im_2_1_9)

# Fig. 2.1.10: Standard apical window
im_2_1_10 = Image.open(os.path.join(img_dir, 'p44_img0_39069.jpeg'))
save_fig('fig-02-07.jpg', im_2_1_10)

# Fig. 2.1.11: 4CV
im_2_1_11 = Image.open(os.path.join(img_dir, 'p44_img1_39070.png'))
save_fig('fig-02-08.jpg', im_2_1_11)

# Fig. 2.1.12: Apical views (5CV, 2CV, 3CV, RV)
im_2_1_12 = stitch_h(['p45_img0_39050.png', 'p45_img1_39051.png', 'p45_img2_39052.png', 'p45_img3_39053.png'])
save_fig('fig-02-09.jpg', im_2_1_12)

# Fig. 2.1.13 - 2.1.15: Subcostal views (4CV, short-axis, IVC)
im_2_1_13 = stitch_h(['p46_img0_39025.png', 'p46_img1_39026.png', 'p46_img2_39027.png', 'p46_img3_39028.png'])
save_fig('fig-02-10.jpg', im_2_1_13)

# Fig. 2.1.16: Suprasternal view
im_2_1_16 = stitch_h(['p46_img4_39029.png', 'p46_img5_39030.jpeg'])
save_fig('fig-02-11.jpg', im_2_1_16)

print("Section 2.1 figures assembled successfully!")
