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

# List of figures to assemble from section 2.2
# Page 47: LV inflow/outflow PW/CW
im_2_2_1 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p47_')])
if im_2_2_1: save_fig('fig-02-12.jpg', im_2_2_1)

# Page 48: CW cursor & HOCM
im_2_2_5 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p48_')])
if im_2_2_5: save_fig('fig-02-13.jpg', im_2_2_5)

# Page 49: Colour turbulence & abnormal flow
im_2_2_9 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p49_')])
if im_2_2_9: save_fig('fig-02-14.jpg', im_2_2_9)

# Page 50: Dense velocity & trace curve
im_2_2_11 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p50_')])
if im_2_2_11: save_fig('fig-02-15.jpg', im_2_2_11)

# Page 51: LVOT diameter & velocity
im_2_2_13 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p51_')])
if im_2_2_13: save_fig('fig-02-16.jpg', im_2_2_13)

# Page 52: Mitral stenosis assessment
im_2_2_17 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p52_')])
if im_2_2_17: save_fig('fig-02-17.jpg', im_2_2_17)

# Page 53: Alignment & diastolic reversal
im_2_2_20 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p53_')])
if im_2_2_20: save_fig('fig-02-18.jpg', im_2_2_20)

# Page 54: MR & TR envelopes
im_2_2_22 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p54_')])
if im_2_2_22: save_fig('fig-02-19.jpg', im_2_2_22)

# Page 55: Subvalvular stenosis ABCD
im_2_2_25 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p55_')])
if im_2_2_25: save_fig('fig-02-20.jpg', im_2_2_25)

# Page 56: PISA radius and MVA
im_2_2_26 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p56_')])
if im_2_2_26: save_fig('fig-02-21.jpg', im_2_2_26)

# Page 57: AR jet area & width
im_2_2_29 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p57_')])
if im_2_2_29: save_fig('fig-02-22.jpg', im_2_2_29)

# Page 58: AR vena contracta & PISA
im_2_2_33 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p58_')])
if im_2_2_33: save_fig('fig-02-23.jpg', im_2_2_33)

# Page 59: Eccentric MR jet
im_2_2_36 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p59_')])
if im_2_2_36: save_fig('fig-02-24.jpg', im_2_2_36)

# Page 60: TR vena contracta & timing
im_2_2_38 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p60_')])
if im_2_2_38: save_fig('fig-02-25.jpg', im_2_2_38)

# Page 61: TR PISA & colour M-mode
im_2_2_43 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p61_')])
if im_2_2_43: save_fig('fig-02-26.jpg', im_2_2_43)

# Page 65-66: Hepatic veins, SVC & shunt calculation
im_2_2_51 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p65_') or f.startswith('p66_')])
if im_2_2_51: save_fig('fig-02-27.jpg', im_2_2_51)

# Page 68: Right heart pressures & PA pressures
im_2_2_57 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p68_')])
if im_2_2_57: save_fig('fig-02-28.jpg', im_2_2_57)

# Page 69: Myocardial contractility dP/dt
im_2_2_60 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p69_')])
if im_2_2_60: save_fig('fig-02-29.jpg', im_2_2_60)

# Page 70-71: Coronary artery flow (LAD & PDA)
im_2_2_61 = stitch_h([f for f in os.listdir(img_dir) if f.startswith('p70_') or f.startswith('p71_')])
if im_2_2_61: save_fig('fig-02-30.jpg', im_2_2_61)

print("Section 2.2 figures assembled successfully!")
