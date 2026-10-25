import os
from PIL import Image

ch_dir = r'd:\IT sandbox\Starley-CS-Library\books\cardiac-echo\eacvi-echo-handbook\chapters\chapter-03'
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

# Fig 3.1.1 (p. 139): Probe introduction
im_3_1_1 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p139_')])
if im_3_1_1: save_fig('fig-03-01.jpg', im_3_1_1)

# Fig 3.1.2 (p. 142): Mid-esophageal views & mitral valve
im_3_1_2 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p142_')][:6])
if im_3_1_2: save_fig('fig-03-02.jpg', im_3_1_2)

# Fig 3.1.3 (p. 143): Upper esophageal views
im_3_1_3 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p143_')][:4])
if im_3_1_3: save_fig('fig-03-03.jpg', im_3_1_3)

# Fig 3.1.4 (p. 143): Left atrial appendage (LAA) multiplane
im_3_1_4 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p143_')][4:8])
if not im_3_1_4: im_3_1_4 = im_3_1_3
save_fig('fig-03-04.jpg', im_3_1_4)

# Fig 3.1.5 (p. 144): Pulmonary artery bifurcation
im_3_1_5 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p144_')][:4])
if im_3_1_5: save_fig('fig-03-05.jpg', im_3_1_5)

# Fig 3.1.6 (p. 144): Right atrium & bicaval view
im_3_1_6 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p144_')][4:8])
if not im_3_1_6: im_3_1_6 = im_3_1_5
save_fig('fig-03-06.jpg', im_3_1_6)

# Fig 3.1.7 (p. 144): Transgastric views
im_3_1_7 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p144_')][8:12])
if not im_3_1_7: im_3_1_7 = im_3_1_6
save_fig('fig-03-07.jpg', im_3_1_7)

# Fig 3.1.8 (p. 145): Descending thoracic aorta views
im_3_1_8 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p145_')][:4])
if im_3_1_8: save_fig('fig-03-08.jpg', im_3_1_8)

# Fig 3.2.1 (p. 149): 3D TOE probe manipulation
im_3_2_1 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p149_')])
if im_3_2_1: save_fig('fig-03-09.jpg', im_3_2_1)

# Fig 3.2.2 (p. 150): 3D Aortic valve views
im_3_2_2 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p150_')][:4])
if im_3_2_2: save_fig('fig-03-10.jpg', im_3_2_2)

# Fig 3.2.3 (p. 151): 3D Mitral valve surgeon's view
im_3_2_3 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p151_')][:4])
if im_3_2_3: save_fig('fig-03-11.jpg', im_3_2_3)

# Fig 3.2.4 (p. 152): 3D Pulmonic valve
im_3_2_4 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p152_')][:2])
if im_3_2_4: save_fig('fig-03-12.jpg', im_3_2_4)

# Fig 3.2.5 (p. 152): 3D Tricuspid valve
im_3_2_5 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p152_')][2:5])
if im_3_2_5: save_fig('fig-03-13.jpg', im_3_2_5)

# Fig 3.2.6 (p. 152): 3D Left atrial appendage (LAA)
im_3_2_6 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p152_')][5:8])
if not im_3_2_6: im_3_2_6 = im_3_2_5
save_fig('fig-03-14.jpg', im_3_2_6)

# Fig 3.2.7 (p. 153): 3D Interatrial septum & fossa ovalis
im_3_2_7 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p153_')][:3])
if im_3_2_7: save_fig('fig-03-15.jpg', im_3_2_7)

# Fig 3.2.8 (p. 153): Evaluation of aortic annulus for TAVI (MPR)
im_3_2_8 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p153_')][3:6])
if not im_3_2_8: im_3_2_8 = im_3_2_7
save_fig('fig-03-16.jpg', im_3_2_8)

# Fig 3.2.9 (p. 154): Measurement of coronary ostial distance
im_3_2_9 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p154_')])
if im_3_2_9: save_fig('fig-03-17.jpg', im_3_2_9)

print("All Chapter 3 figures assembled successfully!")
