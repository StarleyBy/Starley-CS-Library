import os
import shutil
from PIL import Image

ch_dir = r'd:\IT sandbox\Starley-CS-Library\books\cardiac-echo\eacvi-echo-handbook\chapters\chapter-01'
img_dir = os.path.join(ch_dir, 'images')

def save_fig(fig_name, img):
    # Save in both img_dir and ch_dir for maximum resilience
    p1 = os.path.join(img_dir, fig_name)
    p2 = os.path.join(ch_dir, fig_name)
    img.save(p1, quality=95)
    img.save(p2, quality=95)
    print(f"Saved {fig_name}: {img.size}")

def stitch_horizontal(img_files, spacing=10):
    images = [Image.open(os.path.join(img_dir, f)) for f in img_files]
    max_h = max(im.height for im in images)
    # Rescale or pad to max_h
    resized = []
    for im in images:
        if im.height != max_h:
            # scale preserving aspect ratio
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

# Fig 1.1.1: Cardiac & Abdominal presets
im_1_1 = stitch_horizontal(['p25_img0_55.jpeg', 'p25_img1_56.jpeg'])
save_fig('fig-01-01.jpg', im_1_1)

# Fig 1.1.2: Acoustic power (low vs high)
im_1_2 = Image.open(os.path.join(img_dir, 'p26_img0_60.jpeg'))
save_fig('fig-01-02.jpg', im_1_2)

# Fig 1.1.3: Effect of gain on SNR
im_1_3 = Image.open(os.path.join(img_dir, 'p27_img0_65.jpeg'))
save_fig('fig-01-03.jpg', im_1_3)

# Fig 1.1.4: Effects of increased gain on 2D image
im_1_4 = Image.open(os.path.join(img_dir, 'p27_img1_67.jpeg'))
save_fig('fig-01-04.jpg', im_1_4)

# Fig 1.1.5: Manual adjustment of depth gain settings
im_1_5 = Image.open(os.path.join(img_dir, 'p27_img2_68.jpeg'))
save_fig('fig-01-05.jpg', im_1_5)

# Fig 1.1.6: Transmit frequency (2.0 vs 3.5 MHz)
im_1_6 = stitch_horizontal(['p28_img0_75.jpeg', 'p28_img1_76.jpeg'])
save_fig('fig-01-06.jpg', im_1_6)

# Fig 1.1.7: Lowering frequency & harmonic imaging
im_1_7 = stitch_horizontal(['p28_img2_77.jpeg', 'p28_img3_78.jpeg'])
save_fig('fig-01-07.jpg', im_1_7)

# Fig 1.1.8: Position of focal point
im_1_8 = Image.open(os.path.join(img_dir, 'p29_img0_86.jpeg'))
save_fig('fig-01-08.jpg', im_1_8)

# Fig 1.1.9: Simulated pressure field (F=50, 90, 130mm)
im_1_9 = stitch_horizontal(['p29_img1_87.jpeg', 'p29_img2_88.jpeg', 'p29_img3_89.jpeg'])
save_fig('fig-01-09.jpg', im_1_9)

# Fig 1.1.10: Frame rate and spatial resolution (43.3 vs 79.2 fps)
im_1_10 = stitch_horizontal(['p30_img0_95.jpeg', 'p30_img1_96.jpeg'])
save_fig('fig-01-10.jpg', im_1_10)

# Fig 1.1.11: Doppler recording alignment
im_1_11 = Image.open(os.path.join(img_dir, 'p30_img2_97.jpeg'))
save_fig('fig-01-11.jpg', im_1_11)

# Fig 1.1.12: Doppler velocity scale
im_1_12 = Image.open(os.path.join(img_dir, 'p31_img1_103.jpeg'))
save_fig('fig-01-12.jpg', im_1_12)

# Fig 1.1.13: Sample position
im_1_13 = stitch_horizontal(['p31_img0_102.jpeg', 'p31_img3_104.jpeg'])
save_fig('fig-01-13.jpg', im_1_13)

# Fig 1.1.14: Sample size (SV 10.1, 5.1, 1.0 mm)
im_1_14 = Image.open(os.path.join(img_dir, 'p32_img0_108.jpeg'))
save_fig('fig-01-14.jpg', im_1_14)

# Fig 1.1.15: Wall filter (too low, appropriate, too high)
im_1_15 = Image.open(os.path.join(img_dir, 'p33_img0_115.jpeg'))
save_fig('fig-01-15.jpg', im_1_15)

# Fig 1.1.16: Sweep speed (100 mm/s vs 33 mm/s)
im_1_16 = Image.open(os.path.join(img_dir, 'p33_img1_116.jpeg'))
save_fig('fig-01-16.jpg', im_1_16)

# Fig 1.1.17: Velocity scale in colour Doppler
im_1_17 = Image.open(os.path.join(img_dir, 'p33_img2_117.jpeg'))
save_fig('fig-01-17.jpg', im_1_17)

# Fig 1.1.18: Colour box size
im_1_18 = Image.open(os.path.join(img_dir, 'p34_img0_122.jpeg'))
save_fig('fig-01-18.jpg', im_1_18)

# Fig 1.1.19: Myocardial velocity imaging (TDI)
im_1_19 = Image.open(os.path.join(img_dir, 'p34_img1_123.jpeg'))
save_fig('fig-01-19.jpg', im_1_19)

# Fig 1.1.20: Speckle tracking 2D strain
im_1_20 = Image.open(os.path.join(img_dir, 'p35_img0_127.jpeg'))
save_fig('fig-01-20.jpg', im_1_20)

# Fig 1.1.21: 3D imaging
im_1_21 = Image.open(os.path.join(img_dir, 'p36_img0_131.jpeg'))
save_fig('fig-01-21.jpg', im_1_21)

print('All 21 figures assembled successfully!')
