# Specialized Echocardiography Applications

<details class="med-details"><summary>

## Executive Summary</summary><div class="details-content">

### Three-Dimensional Echocardiography (3DE)
- **Image acquisition modes:** Real-time narrow sector (rapid, familiar planes, but narrow field); real-time zoom (surgical views, lower resolution); full-volume gated (high spatial/temporal resolution, quantitation of LV volumes/EF, but stitch artifacts with patient/respiratory motion); simultaneous multiplane 2D (highest resolution, only two planes); 3D color Doppler (low frame rate).
- **Recommendations for image orientation:** Aortic valve – right coronary cusp at 6 o’clock; Mitral valve – aortic valve at top, anterior leaflet superior; LV – apex at top, LV on right; Interatrial septum – from LA side, right upper pulmonary vein at 1 o’clock; from RA side, SVC at 11 o’clock.
- **Quantitation:** 3D LV volumes and EF are more accurate and reproducible than 2D. Trabeculations and papillary muscles included in chamber. 3D planimetry of mitral valve area recommended (especially for asymmetric commissural fusion).
- **Clinical utility (ASE/EACVI guidelines):** Routine use for LV volumes/EF, mitral valve anatomy (area in stenosis), guidance of transcatheter procedures. Also helpful for myxomatous mitral disease, atrial septal defects, paravalvular regurgitation localization.

### Myocardial Mechanics
- **Definitions:** Displacement (cm), velocity (cm/s), strain (% change in length), strain rate (1/s), rotation (°), twist (absolute difference base-apex, °), torsion (gradient, °/cm).
- **Tissue Doppler strain rate:** SR = (V₂ – V₁)/D. Angle dependent, requires careful alignment. Peak systolic strain rate reflects contractility, less load-dependent.
- **Speckle tracking strain (STE):** Angle independent, direct measurement of strain from myocardial speckles. Measures longitudinal, circumferential, radial strain. Can be performed after image acquisition.
- **Clinical utility:** Tissue Doppler E′ is standard for diastolic function. STE more sensitive for early myocardial involvement (amyloidosis, diabetes, HCM). Dyssynchrony, twist, torsion currently not recommended for routine clinical use.

### Contrast Echocardiography
- **Agents:** Agitated saline (right heart, large microbubbles, trapped in lungs) – for detecting right-to-left shunts. Left heart agents (fluorocarbon gas, stabilized microbubbles 1–5 μm) – for LV opacification and myocardial perfusion.
- **LV opacification:** Improves endocardial border definition when image quality poor (rest or stress). Enhances detection of LV thrombus. Requires low mechanical index (~0.5), lower frequency, increased gain.
- **Safety:** Contraindications: acute coronary syndromes, unstable heart failure, intracardiac shunts, serious arrhythmias, respiratory failure, pulmonary hypertension, hypersensitivity to perflutren. Monitor BP and ECG for 30 minutes in high-risk patients.

### Intracardiac Echocardiography (ICE)
- **Probe:** 5–10 MHz, 10-French, 90-cm disposable catheter, inserted via femoral vein. Single-plane imaging, pulsed and color Doppler.
- **Primary applications:** Guiding ASD/PFO closure, electrophysiology procedures (transseptal puncture, pulmonary vein isolation, ablation), transcatheter valve procedures, LAA closure.
- **Advantages over TEE:** No general anesthesia, interventional cardiologist can perform imaging, continuous monitoring.
- **Limitations:** Cost, invasive, single-plane (biplane would be better).

</div></details>

<details class="med-details"><summary>

## Introduction</summary><div class="details-content">

All echocardiographic imaging depends on digital image processing. Ultrasound systems start with raw information (pixels) that are then used for two-dimensional (2D) or three-dimensional (3D) images using intensity, textures, and gradients to highlight edges and structures, thereby creating anatomic-type images of cardiac structures ([Fig. 4.1](#fig-4-1)). Automated image analysis is central to display and analysis of 3D images, calculation of 3D LV volumes with semiautomated edge detection, and speckle tracking strain imaging. Currently, image interpretation is primarily based on visual inspection by expert clinicians. In the future, it is likely that imaging systems will offer most complex and accurate computer analysis and interpretation (see Suggested Reading).

<span id="fig-4-1"></span>![](_page_1_Figure_3.jpeg)

**FIGURE 4.1** The image interpretation pyramid. Image interpretation depends on a series of steps shown conceptually as a pyramid with a complex overlay of layers starting with the raw pixel values used to generate the image to the final interpretation. *(From Bosch JG. Digital image processing and automated image analysis in echocardiography. In Otto CM, editor:* The Practice of Clinical Echocardiography, *ed 5, Philadelphia, 2017, Elsevier, pp 166–181.)*

</div></details>

<details class="med-details"><summary>

## THREE-DIMENSIONAL ECHOCARDIOGRAPHY</summary><div class="details-content">

The term *3D echocardiography* refers broadly to several approaches for the acquisition and display of cardiac ultrasound images. Different 3D approaches are similar in that cardiac structures are shown in relation to one another in all three spatial dimensions and can be rotated or viewed from different orientations, even after image acquisition. One of the challenges of 3D echocardiography is optimizing image resolution in all three dimensions, given the constraints of ultrasound physics and transducer design. Another challenge is ensuring temporal, as well as spatial, resolution.

<details class="med-details"><summary>

### Image Acquisition</summary><div class="details-content">

3D imaging uses a complex multiarray transducer that simultaneously acquires ultrasound data from a 3D pyramidal volume. Rapid parallel image processing provides ultrasound images that can be viewed in real time in any orientation on the screen ([Fig. 4.2](#fig-4-2)). These matrix array transducers typically include about 3000 piezoelectric elements with a transmission frequency of 2 to 4 MHz for transthoracic echocardiography (TTE) and 5 to 7 MHz for transesophageal echocardiography (TEE). Several approaches exist to the acquisition of echocardiographic data using a 3D matrix array transducer ([Table 4.1](#table-4-1)):

- *Real-time narrow 3D section:* A beat-by-beat view with a wider image plane than standard 2D imaging that can be rotated to view from different perspectives. It looks like a “thick” tomographic image.
- *Real-time 3D-zoom volume-rendered images:* A full-volume image of an enlarged area of interest that is rotated to show the structure of interest in a “surgical” view. These images are displayed with a perspective-type image similar to a photographic view from inside the heart.
- *Full-volume gated acquisition volume-rendered images:* Multiple-beat volumetric imaging stitches together narrow volumes of data over several cardiac cycles to provide a full volume of data that can be rotated and cropped to show the structures of interest.
- *Simultaneous multiplane mode:* This simultaneous display of two 2D image planes has the ability to adjust the rotation angle, tilt, and elevation of the second image plane.
- *3D color Doppler imaging:* This uses real-time or full-volume color Doppler data acquisition, but at frame rates lower than for imaging data.

<span id="fig-4-2"></span>![](_page_1_Figure_5.jpeg)

**FIGURE 4.2** 3D echocardiography. *(Left)* 3D echocardiographic images are acquired using a fully sampled matrix array transducer. 2D imaging focuses the transducer beam on a single tomographic slice with optimal temporal and spatial resolution. Different 2D image planes are obtained by manually moving, rotating, and tilting the transducer. *(Center)* 3D real-time narrow sector imaging uses a matrix array transducer to display a 300 × 600 pyramidal volume, which maintains high temporal resolution within this narrow volume image. Real-time imaging also can be enlarged to include the entire anatomic structure in “zoom” mode at the expense of decreased spatial and temporal resolution. *(Right)* Full-volume imaging stitches together volumetric image data from more than one cardiac cycle (typically four beats, as shown here) to provide higher temporal and spatial resolution while including the entire cardiac anatomy in the field of view.

Advantages of real-time narrow sector imaging are rapid image capture, familiar image planes, and evaluation of complex anatomy; however, only a narrow field of view is seen ([Fig. 4.3](#fig-4-3)). With focused wide section or real-time “zoom” mode, the entire structure (e.g., the mitral valve) is included in the image, but spatial resolution and temporal resolution are poor, and the image must be rotated and gain carefully adjusted to display the internal cardiac anatomy ([Fig. 4.4](#fig-4-4)). Full-volume gated images look similar to real-time zoom-mode images but have better spatial and temporal resolution. Full-volume images also can be analyzed after acquisition to provide additional views. Simultaneous multiplane imaging shows only a few (typically two) tomographic images but provides the highest temporal and spatial resolution within these image planes ([Fig. 4.5](#fig-4-5)). The use of 3D color Doppler imaging is helpful for showing the spatial distribution of a flow disturbance, such as prosthetic paravalvular regurgitation or an intracardiac shunt, but it currently has very low temporal resolution.

<span id="fig-4-3"></span>![](_page_3_Figure_3.jpeg)

**FIGURE 4.3** Real-time 3D narrow section volume-rendered imaging. *(Top)* A standard 2D parasternal long-axis view has a frame rate of 50 Hz, which drops to 5 Hz in the *(bottom)* 3D mode.

<span id="fig-4-4"></span>![](_page_3_Figure_14.jpeg)

**FIGURE 4.4** Effect of gain on 3D imaging. Real-time zoom 3D images of the (A–C) aortic and (D–F) mitral valves show the effect of gain on the image display. Low gain results in echo dropout, whereas excess gain decreases resolution and obscures the structure of interest. (A) and (D) Dropout of the cusps and leaflets due to low gain. (B) and (E) Normal anatomy without dropout or excess gain. (C) The cusps are obscured by the excess gain. (F) Leaflet visualization is unclear due to excess gain. *(From Tsang W, Lang RO: 3D echocardiography: principles of image acquisition, display and analysis. In Otto CM, editor:* The Practice of Clinical Echocardiography, *ed 5, Philadelphia, 2017, Elsevier, pp 18–36.)*

<span id="fig-4-5"></span>![](_page_4_Figure_3.jpeg)

**FIGURE 4.5** Biplane imaging. On a TEE transgastric view, both the long-axis and short-axis views of the left ventricle can be recorded on the same cardiac cycles.

During the acquisition of 3D images, transducer position is adjusted to optimize visualization of the structure of interest, for example, by imaging the mitral valve from the left atrial (LA) side on TEE imaging with the ultrasound beam perpendicular to the closed mitral leaflets. Next, gain and compression are set in the mid-range (about 50 units), and the time-gain compensation (TGC) curve is adjusted so the image is slightly “overgained” to avoid echo dropout appearing as “holes” in anatomic structures. With real-time imaging, transducer position and gain can be adjusted iteratively to improve image quality and to center the structure of interest in the image. My practice is to optimize position and gain on a zoomed real-time 3D view before the acquisition of a four-beat gated full-volume data set from the same transducer position. Postprocessing, gain, and compression then can be adjusted after image acquisition. With full-volume gated acquisitions, any change in heart position from beat to beat results in a vertical line across the image with misregistration of the image data on both sides of this “stitch” artifact. Causes of a stitch artifact include patient movement, respiratory motion, and an irregular heart rhythm.

<details class="med-details"><summary>

#### TABLE 4.1: 3D Imaging Modalities</summary><div class="details-content">

<span id="table-4-1"></span>
| Modality | Advantages | Limitations |
|----------|------------|-------------|
| Real-time 3D mode—narrow section, volume-rendered images | • Rapid acquisition, familiar image planes<br>• Image can be rotated; helpful with complex cardiac anatomy | Narrow sector; entire structure does not fit in imaging plane. |
| Real-time “zoom” volume-rendered cropped images | • Shows anatomy in “surgical” views<br>• Enlarged 3D image of structure of interest | A wider field of view decreases spatial and temporal resolution. |
| Full-volume gated acquisition for volume-rendered cropped images | • High spatial resolution<br>• High temporal resolution<br>• Quantitation of LV volumes and ejection fraction<br>• Provides 3D LV shape and dyssynchrony | May be difficult to optimize image quality for all structures in the field of view. “Stitch” artifacts occur because of patient and respiratory motion. |
| Full-volume gated acquisition for multiple 2D tomographic slices | • Accurate measurements of cardiac dimensions<br>• More objective and less operator dependent than standard 2D imaging<br>• Visualization of all myocardial segments simultaneously | Endocardial definition may be suboptimal depending on transducer position. |
| Simultaneous multiplane 2D imaging | • Simultaneous images in two defined planes<br>• Highest spatial resolution<br>• Highest temporal resolution | Only two planes are visualized. |
| 3D color Doppler | • Visualization of 3D geometry of vena contracta and proximal isovelocity surface area for regurgitant lesions<br>• Location of paravalvular prosthetic leaks and intracardiac shunts | This has a slow frame rate with low temporal resolution. |

</div></details>

</div></details>

<details class="med-details"><summary>

### Image Display</summary><div class="details-content">

There are currently several types of 3D echocardiographic image displays, including:
- Volume-rendered 3D images
- Surface-rendered images
- Wireframe images
- Simultaneous display of multiple 2D images
- Graphic displays of 3D parameters versus time

In both the real-time 3D zoom mode and in full-volume imaging, the display is “cropped” to show different views of the interior structures of the heart. For example, the mitral valve can be viewed from the perspective of the LA; this provides a compelling view of prolapsing segments of the valve in patients with myxomatous mitral valve disease (see Fig. 12.29). The image can then be rotated and recropped to show a long-axis–type image of the mitral valve or to view the valve from the left ventricular (LV) side. Similarly, the aortic valve can be viewed en face from the perspective of the aorta, a view that correlates closely with the surgical view of valve anatomy, from the LV side of the valve or in a long-axis orientation. Real-time 3D images are cropped and rotated as the images are acquired. Full-volume gated acquisitions can be cropped and rotated during the exam but also can be reevaluated later because the full-volume data set is saved digitally.

Surface-rendered images or wireframe displays are based on identifying the boundaries of a cardiac structure, either by using semiautomated methods or by tracing the boundaries on multiple 2D images. For example, the LV endocardial surface is shown as a 3D solid structure with contraction shown by a sequence of 3D volumes over the cardiac cycle, so the rendered volume appears to beat on the display screen ([Fig. 4.6](#fig-4-6)). Alternatively, a wireframe-type display can be used. A graphic display also is helpful with time on the horizontal axis and with either LV volume or the position of each myocardial segment shown on the vertical axis.

<span id="fig-4-6"></span>![](_page_4_Figure_8.jpeg)

**FIGURE 4.6** Surface-rendered volumetric imaging. The apical window was used to acquire a full-volume 3D image of the LV. Using three orthogonal planes through the data set for guidance, endocardial borders were traced using semiautomated border detection to provide a surface-rendered image of the ventricular chamber, with color coding for myocardial regions. The graphic curve shows LV volume over a single cardiac cycle.

The 3D echocardiographic data set also can be used for simultaneous display of multiple-image 2D planes ([Fig. 4.7](#fig-4-7)). The ability to acquire LV images in multiple planes simultaneously speeds image acquisition during stress echocardiography, thus potentially improving diagnostic accuracy. In addition, the ability to “move through” a 3D data set in any 2D image plane allows better appreciation of cardiac anatomy in patients with complex structural heart disease and allows precise localization of abnormalities.

<span id="fig-4-7"></span>![](_page_5_Figure_3.jpeg)

**FIGURE 4.7** Multiple simultaneous 2D image planes. The 3D full-volume image of the LV recorded from the apical window is displayed as multiple tomographic short-axis views spanning the ventricle from apex *(top left)* to base *(lower right)*.

</div></details>

<details class="med-details"><summary>

### Examination Protocol</summary><div class="details-content">

With TTE imaging, only limited 3D imaging is performed to complement a full 2D study, depending on the patient’s diagnosis and the reason for the study. Examples of 3D imaging on transthoracic imaging include quantitation of LV volumes and ejection fraction in a patient with heart failure (see Fig. 9.4), 3D measurement of mitral orifice area in a patient with mitral stenosis, or 3D short-axis images of the aortic valve in a patient with calcific aortic valve disease (see Fig. 11.6). With TEE imaging, a systematic approach to 3D image acquisition and display is recommended, with additional views as needed depending on the specific pathology ([Table 4.2](#table-4-2)).

Recommendations for volume-rendered 3D image displays ([Fig. 4.8](#fig-4-8)) are:
- *Aortic valve:* The right coronary cusp is located inferiorly (at the 6 o’clock position) for both aortic and LV views of the valve (see Fig. 3.21).
- *Mitral valve:* The aortic valve is located at the top of the image so the anterior mitral leaflet is superior to the posterior leaflet for both LA and LV views of the valve (see Fig. 3.23).
- *LV*: 3D TTE views of the LV are oriented like standard 2D images in either an apical four-chamber view (apex at the top of the image, LV on the right side of the screen) or a short-axis view.
- *Right ventricle (RV):* A four-chamber view or short-axis view is oriented with the LA superior (12 o’clock position).
- *Pulmonic valve:* The anterior valve cusp is located superiorly (12 o’clock position) for both the pulmonary artery and RV sides of valve.
- *Tricuspid valve*: The ventricular septum is placed inferiorly for both the right atrial (RA) and RV views of the valve.
- *Interatrial septum:* From the LA side, the right upper pulmonary vein is shown in the 1 o’clock position. From the RA side, the superior vena cava is at the 11 o’clock position.
- *LA appendage*: This display shows the LA appendage en face from the LA perspective with the pulmonary veins shown superiorly or longitudinally.

<span id="fig-4-8"></span>![](_page_7_Figure_3.jpeg)

**FIGURE 4.8** American Society of Echocardiography and European Association of Echocardiography recommendations for image orientation of cardiac valves. The 3D TEE *(3DE)* images of cardiac valves should be recorded in standard orientations as shown in the right column and in [Table 4.1](#table-4-1). First, the valve is centered in a 2D TEE *(2DE)* view of the valve as shown in the first column. Next, real-time 3D is used to optimize gain settings for visualization of valve anatomy. Then a full-volume image is acquired and is rotated around the x- or y-plane as shown followed by rotation in the image plane (except for the aortic valve) to show the valve in the standard display format. Aortic, mitral, and pulmonic valves are best imaged on TEE as shown. Tricuspid valve 3D TTE imaging is recommended using the TTE views shown. *(From Lang RM, Badano LP, Tsang W, et al: EAE/ASE recommendations for image acquisition and display using 3D echocardiography,* J Am Soc Echocardiogr *25[1]:3–46, 2012.)*

<details class="med-details"><summary>

#### TABLE 4.2: American Society of Echocardiography and European Association of Echocardiography Recommendations for a Systematic 3D Study</summary><div class="details-content">

<span id="table-4-2"></span>
| Structure | TTE Image Acquisition | TEE Image Acquisition | Sequence for TEE Full-Volume Image Orientation (See Fig. 4.8) |
|-----------|----------------------|----------------------|------------------------------------------------|
| Aortic valve | PLAX with and without color, narrow angle and zoomed* | 60° mid-esophageal short-axis with and without color, zoomed or full-volume<br>120° mid-esophageal long-axis with and without color, zoomed or full-volume | 2D views at 60° and 120° with aortic valve centered in acquisition boxes<br>Live 3D to optimize gain<br>Full-volume acquisition, and then rotated 90° clockwise around y-axis |
| Mitral valve | PLAX with and without color, narrow angle and zoomed<br>A4C with and without color, narrow angle and zoomed | 0–120° mid-esophageal with and without color, zoomed | 2D views at 90° and 120° with mitral valve centered in acquisition boxes<br>Full-volume acquisition, rotated 90° counterclockwise around x-axis and then 90° counterclockwise in plane so aortic valve is superior |
| Left ventricle | A4C, narrow and wide angle | 0–120° mid-esophageal view including entire LV, full-volume | Full-volume acquisition for quantitation of LV volumes, ejection fraction, and regional wall motion<br>Data displayed as a moving 3D surface-rendered image with color coding and as a time graph |
| Right ventricle | A4C with image tilted to put RV in center of image | 0–120° mid-esophageal view, tilted to put RV in center of image, full-volume | – |
| Atrial septum | A4C, narrow angle and zoomed | 0° with probe rotated toward atrial septum, zoomed or full-volume | – |
| Pulmonic valve | RV outflow view with and without color, narrow angle and zoomed | 90° high-esophageal view with and without color, zoomed<br>120° mid-esophageal three-chamber view with and without color, zoomed | 2D high-esophageal view at 0° with pulmonic valve centered in acquisition box<br>Full-volume acquisition, rotated 90° counterclockwise around x-axis, then rotate in plane 180° counterclockwise so anterior leaflet is superior |
| Tricuspid valve | A4C with and without color, narrow angle and zoomed<br>RV inflow view with and without color, narrow angle and zoomed | 0–30° mid-esophageal four-chamber view with and without color, zoomed<br>40° transgastric view with anteflexion with or without color, zoomed | TTE†<br>2D views in off-axis A4C view with tricuspid valve centered in acquisition boxes<br>Full-volume acquisition, rotated 90° counterclockwise around x-axis and then rotated 45° in plane so septal leaflet is in 6 o’clock position |

\*Zoomed, real-time volume-rendered 3D imaging rotated to intracardiac views.
†3D images of the tricuspid valve are best obtained from TTE, not TEE, imaging.
*A4C,* Apical four-chamber view; *PLAX,* parasternal long-axis view.

</div></details>

</div></details>

<details class="med-details"><summary>

### Quantitation From 3D Images</summary><div class="details-content">

In addition to volume-rendered images of each chamber and valve, surface-rendered images of the LV are derived from a gated full-volume acquisition with the transducer positioned at the LV apex (for TTE imaging) or in a TEE four-chamber view. A 2D image is used to ensure optimal positioning of the transducer with the entire LV included in the sector scan. Gain and transducer frequency are adjusted to optimize endocardial definition. Acquisition of the gated full-volume data set is guided by a split screen display of orthogonal views, and the patient is asked to suspend respiration to minimize stitch artifacts. Once the full-volume data is acquired, the LV apex and mitral annulus are used as landmarks to initiate the edge detection process. The operator then can adjust the automated tracings as needed to follow the endocardial border accurately. As for 2D measures of LV volumes, trabeculations and the papillary muscles are included in the LV chamber to avoid underestimation of LV volumes. The surface-rendered image data then is used for quantitation of:
- LV end-diastolic and end-systolic volumes
- LV ejection fraction
- LV regional wall motion

Each of these parameters can be displayed on a 3D perspective color-coded LV shape or as a graph over the cardiac cycle (see Fig. 8.7).

Compared with 2D approaches, 3D quantitation of LV function avoids geometric assumptions and is more accurate and reproducible and thus is recommended when technically feasible (see Chapter 6). The 3D measures of LV mass, regional strain, curvature, and wall stress are more complicated and are currently investigational approaches.

Other quantitative measurements from 3D data sets are in evolution. Standard 3D volume-rendered image displays show the cutaway view of the heart as a solid structure using shading and lighting to provide the impression of a 3D perspective on a 2D viewing screen. This display is not conducive to quantitative measurements because only two of the three dimensions are shown. Advances in display and digital processing should alleviate this problem by allowing accurate measurement of distances and areas.

Potentially other 3D measurements have advantages compared with 2D measurements for nonplanar structures, such as a stenotic valve. For example, although experienced operators can accurately measure mitral valve area from 2D images aligned at the minimal orifice area in patients with rheumatic mitral stenosis, inexperienced operators show improved accuracy with 3D imaging, which reliably shows the stenotic orifice and is less dependent on transducer position or image plane positioning. For planimetry of mitral valve area, the 3D volume is acquired, and then a 2D plane is aligned at the minimal orifice with the valve opening traced in mid-diastole ([Fig. 4.9](#fig-4-9)). In research applications, more complex structures, such as the mitral leaflets and annulus, can be reconstructed in 3D by tracing the structure in a series of 2D image planes within the 3D volumetric data set ([Fig. 4.10](#fig-4-10)).

<span id="fig-4-9"></span>![](_page_8_Figure_3.jpeg)

**FIGURE 4.9** 3D measurement of mitral valve area. A full-volume image of the mitral valve was acquired (same patient as Fig. 11.10) in a patient with mitral stenosis and asymmetric fusion of the commissures. For measurement of the mitral valve area, off-line analysis of the 3D volume used three orthogonal planes (x, y, z) shown in red, green, and blue to align an image plane at the tips of the stenotic valve. The resulting tomographic image at the minimal orifice area in diastole *(lower left)* was traced to determine mitral valve area.

<span id="fig-4-10"></span>![](_page_8_Figure_12.jpeg)

**FIGURE 4.10** Mitral valve models. Mitral valve models with color-encoded parametric maps of leaflet displacement above the mitral annular plane into the left atrium. (A) and (B) When the valve is normal and no leaflet displacement is present, the leaflets remain blue. (C) When prolapse or flail is present, the distance of the leaflet from the mitral annular plane toward the left atrium is indicated by color gradations from yellow (mild) to red (severe). This is an example of a prolapsed P3 scallop. (D) In this model, tenting of the leaflets is appreciated from the profile view. *Ao,* Aorta; *P,* posterior leaflet. *(From Tsang W, Lang RO: 3D echocardiography: principles of image acquisition, display and analysis. In Otto CM, editor:* The Practice of Clinical Echocardiography, *ed 5, Philadelphia, 2017, Elsevier, pp 18–36.)*

</div></details>

<details class="med-details"><summary>

### Clinical Utility</summary><div class="details-content">

The clinical role of 3D echocardiography will continue to evolve as this technology matures. In addition to providing more detailed anatomic relationships and more accurate quantitation, 3D images are more intuitive than 2D images, thus allowing quicker appreciation of cardiac anatomy by more health care providers ([Table 4.3](#table-4-3)). Potentially, 3D echocardiography could be faster than 2D scanning and could reduce variability in image acquisition. However, because instrumentation is in development, 3D echocardiography is not yet a routine part of the clinical examination at all centers and typically is used to supplement the 2D study in selected patients, with imaging focused on a specific anatomic structure. The use of 3D imaging is more widespread for intraoperative and intraprocedural imaging because of the improved image quality and the additive value of the 3D perspective in these clinical settings (see Chapter 18).

The American Society of Echocardiography and European Association of Echocardiography guidelines recommend routine use of 3D imaging for:
- Quantitation of LV volumes and ejection fraction
- Evaluation of mitral valve anatomy (valve area in mitral stenosis)
- Guidance of transcatheter procedures

It is likely that other quantitative applications will become available in the near future, including quantitation of RV volumes and ejection fraction and 3D evaluation of aortic valve, outflow tract, and aortic sinus anatomy in adults with valvular aortic stenosis. Further studies are needed for other potential applications including 3D dyssynchrony, strain imaging, and the evaluation of prosthetic valves.

The use of 3D volume-rendered imaging has proved to be helpful in several clinical settings, both for facilitating communication with other physicians and for providing more detailed anatomic information about shape, size, and 3D anatomic relationships of structures. The benefits of 3D echocardiography for specific clinical settings include:
- Myxomatous mitral valve disease: Evaluation of the number and severity of prolapsed or flail segments and identification of chordal rupture is used for planning surgical repair (see Fig. 12.29).
- Atrial septal defects: Visualization of the location, size, and suitability is used for transcatheter closure (see Figs. 17.19 and 17.20).
- Transcatheter interventions: 3D imaging is used for guidance during procedures, evaluation of procedural results, and detection of complications (see Fig. 18.24).

The 3D color Doppler applications are challenging because of the low frame rates with this modality. Currently, 3D color Doppler is helpful in identifying the location of paravalvular regurgitation. Other potential clinical applications of 3D imaging, such as quantitation of valvular regurgitation based on 3D visualization of proximal jet geometry, require further validation.

<details class="med-details"><summary>

#### TABLE 4.3: Clinical Applications of 3D Echocardiography</summary><div class="details-content">

<span id="table-4-3"></span>
| Application | 3D Approach | Comments |
|-------------|-------------|----------|
| LV function | • Surface-rendered LV volumes, ejection fraction, and regional wall motion derived from gated full-volume 3D acquisition | • 3D echo underestimates LV volumes compared with CMR data.<br>• Trabeculations and papillary muscles are included in the LV chamber. |
| RV function | • Volume-rendered images allow visualization of entire RV.<br>• Surface-rendered images may allow measurement of volumes and ejection fraction. | • 3D measurement of RV volumes and ejection fraction requires further validation but is a promising approach. |
| Mitral valve | • Volume-rendered images show mitral valve anatomy en face from the LA or LV side of the valve.<br>• Accurate measurement of valve area in mitral stenosis occurs using 3D-guided 2D image planes.<br>• Annular shape and dimensions are obtained from volumetric images.<br>• 3D color Doppler shows jet origin and direction. | • 3D TEE is recommended for guidance of interventional mitral valve procedures.<br>• 3D TTE or TEE is recommended for clinical evaluation of mitral valve pathology. |
| Aortic valve and sinuses | • Volume-rendered images obtained from TTE parasternal or TEE high-esophageal views provide optimal spatial resolution.<br>• Planimetry of aortic valve area is possible on 2D images derived from the 3D full-volume data set.<br>• 3D images demonstrate the oval shape of the aortic annulus. | • 3D imaging may be helpful in determining the mechanism of aortic regurgitation and defining the number of valve leaflets.<br>• 3D imaging is recommended for guidance of transcatheter aortic valve implantation. |
| Pulmonic valve and pulmonary artery | • The pulmonic valve can be imaged using biplane or real-time 3D imaging. | • Routine 3D pulmonic valve imaging is not recommended. |
| Tricuspid valve | • 3D volume-rendered images of the tricuspid valve are acquired in a fashion similar to those for the mitral valve. | • 3D views of the tricuspid valve may be helpful in determining the mechanism of valve regurgitation. |
| LA and RA | • 3D volume-rendered images of the atrial septum are helpful for defining the location, size, and shape of atrial septal defects and for guiding transcatheter closure procedures. | • 3D imaging may improve assessment of LA volume but is not a routine measurement. |
| LA appendage | • 3D volume-rendered images are helpful in guiding transcatheter LA appendage closure. | • Biplane imaging of the LA appendage is useful in evaluating for LA thrombus. |
| 3D stress echocardiography | • 3D imaging provides simultaneous evaluation of wall motion in all myocardial segments, improved visualization of the LV apex, and rapid image acquisition at peak stress. | • Disadvantages of 3D stress imaging include lower frame rates and spatial resolution compared with 2D imaging.<br>• Not all 3D systems allow side-by-side review of rest and stress images. |

*CMR,* Cardiac magnetic resonance. *Summarized from Lang RM, Badano LP, Tsang W, et al: EAE/ASE recommendations for image acquisition and display using three-dimensional echocardiography. J Am Soc Echocardiogr 25(1):3–46, 2012.*

</div></details>

</div></details>

<details class="med-details"><summary>

### Limitations</summary><div class="details-content">

Although 3D imaging has greatly expanded the capability of echocardiography for the visualization of complex heart disease, this approach does have some limitations. Acquisition of 3D images can be time-consuming, particularly because 3D imaging currently serves as an adjunct, not a replacement, for 2D imaging. However, 3D imaging modalities likely will become more integrated into the standard clinical exam when the instrument interface allows effortless transitions between 2D and 3D imaging and more intuitive approaches to image manipulation. Current display formats attempt to show 3D images on 2D displays; this limitation should be resolved as 3D display systems become more widely available. As with all ultrasound modalities, the direction of the ultrasound beam relative to the structure of interest affects image quality; resolution is optimal in the axial direction for structures perpendicular to the ultrasound beam. In addition, ultrasound artifacts, such as shadowing, reverberations, and poor penetration affect the image, as with any ultrasound modality. Many patients with suboptimal 2D images also have poor 3D images. TEE 3D imaging tends to be much more useful than TTE 3D imaging. Finally, both spatial and temporal resolutions of 3D imaging are inferior to those of 2D imaging, so both modalities are needed for a full imaging study.

</div></details>

</div></details>

<details class="med-details"><summary>

## MYOCARDIAL MECHANICS</summary><div class="details-content">

LV function is a complex event that is only partially described by clinical measures of ejection fraction, qualitative changes in regional wall motion, and measures of diastolic filling. Ventricular contraction occurs in the longitudinal direction (the base moves toward the apex), the radial direction (walls thicken), and the circumferential direction (cavity size decreases perpendicular to the long axis of the chamber). In addition, the apex and base rotate in opposite directions during contraction, resulting in a twisting motion called torsion. Several promising approaches to a more complete and quantitative description of myocardial mechanics are used, including:
- *Displacement:* the distance a cardiac structure or myocardial element moves between two consecutive image frames, measured as a distance (cm)
- *Velocity:* the speed (displacement per time unit) of movement of a cardiac structure or myocardial element, reported as velocity (cm/s)
- *Strain:* the fractional change in length of a myocardial segment; a unitless measure of myocardial deformation, reported as a positive or negative percentage
- *Strain rate*: the rate of change in strain with units of 1 per second
- *Rotation:* the circular motion of the LV myocardium around its long axis, measured in degrees
- *Twist:* the absolute difference in rotation between the LV base and apex (degrees)
- *Torsion:* the gradient in rotation angle from base to apex, measured as degrees per cm

Displacement and velocity are vectors with direction in addition to magnitude. Strain and strain rate also are vectors with direction and magnitude and can be measured for regions of the myocardium or averaged over the entire ventricle (global strain) in either the longitudinal or circumferential direction ([Table 4.4](#table-4-4)).

<details class="med-details"><summary>

### Tissue Doppler Strain and Strain Rate</summary><div class="details-content">

Doppler blood flow velocity measurements are based on backscatter of low-amplitude, high-velocity signals from moving blood cells ([Fig. 4.11](#fig-4-11)). In contrast, Doppler tissue velocity measurements are based on the high-amplitude, low-velocity signals reflected from the myocardium. Thus these signals are easily separated by adjusting the gain, wall filters, and velocity scale of the Doppler spectral or color display.

<span id="fig-4-11"></span>![](_page_11_Figure_3.jpeg)

![](_page_11_Figure_4.jpeg)

**FIGURE 4.11** Myocardial velocities and blood flow. Principle for separation of myocardial velocities from blood flow velocities: *(Left)* The difference in velocity and amplitude between myocardial and blood velocities. The myocardium is moving at much lower speed than blood, and therefore Doppler frequencies are lower. Furthermore, the amplitude of myocardial signals is much higher than for blood. *(Right)* A recording in the LV outflow tract that samples both myocardial and blood flow velocities. The *red arrow* points to the high-intensity signals from the myocardium, and the *white arrow* points to the low-intensity, but high-velocity signals from the blood. *(From Smiseth OA, Edvardsen T, Torp H: Myocardial mechanics: velocities, strain, strain rate, cardiac synchrony, and twist. In Otto CM, editor:* The Practice of Clinical Echocardiography, *ed 5, Philadelphia, 2017, Elsevier, pp 128–146.)*

*Tissue Doppler* velocity recording at a specific intracardiac site is analogous to pulsed Doppler blood flow velocity recordings. Tissue velocity measurements depend on a parallel alignment between the ultrasound beam and the direction of myocardial motion; in other words, motion is measured only in the direction toward and away from the transducer. For example, a component in evaluation of diastolic function is the tissue Doppler signal recorded in the apical four-chamber view with a 2-mm sample volume positioned about 1 cm apical from the septal side of the mitral annulus ([Fig. 4.12](#fig-4-12)). The spectral display is recorded at a velocity range of ±0.2 m/s, using very low gain and wall filter setting. The Doppler velocities show systolic motion of the myocardium toward the apex, corresponding to the apical motion of the annulus in systole seen on 2D imaging. In diastole, an early diastolic motion away from the apex *(E′)* occurs, corresponding to the early phase of diastolic filling, and a late diastolic motion away from the apex *(A′)* occurs, corresponding to the atrial phase of ventricular filling.

<span id="fig-4-12"></span>![](_page_12_Figure_3.jpeg)

**FIGURE 4.12** Tissue Doppler velocities. (A) Tissue Doppler imaging *(TDI)* for diastolic function is recorded from the apical window using a 2-mm sample volume positioned in the myocardium about 1 cm from the mitral annulus. (B) A tissue Doppler signal showing that in systole *(S′),* the myocardium moves toward the apex. In diastole, the myocardial velocity is directed away from the transducer first with early diastolic filling *(E′)* and then with atrial contraction *(A′).* Myocardial velocities are higher at the base than the apex.

*Strain rate imaging* is based on the difference in tissue Doppler velocity *(V)* between sample volumes divided by the distance (D) between them ([Fig. 4.13](#fig-4-13)). This measures the rate of change in myocardial length, normalized to the original length. Strain rate *(SR)* then is:

$$SR = (V_2 - V_1)/D \tag{Eq. 4.1}$$

The units of strain are seconds⁻¹ (or /s) because the velocity measured in centimeters per second is divided by the distance in centimeters. Typically, strain rate is measured in the apical-base direction, in the apical four-chamber view with three sample volumes placed in the septal or lateral wall myocardium about 12 mm apart. The tissue Doppler mean velocity curves are examined to ensure a clear signal without excessive noise, lack of aliasing, and avoidance of blood pool signals (see [Fig. 4.12](#fig-4-12)). The instrument calculates strain rate from these velocity curves for each time point and displays strain rate in seconds⁻¹ as a function of time. The strain rate curve looks like a vertical mirror image of the velocity curve because myocardial shortening is a negative strain and myocardial lengthening is a positive strain. Strain rate provides data on relative timing of myocardial motion and peak systolic and diastolic strain rates. Peak systolic strain rate is a measure of ventricular contractile function that is insensitive to changes in loading conditions.

*Strain* is a measure of deformation of a material, defined as the difference between the final length (*l*) and the original length (*l₀*), divided by the original length. Thus strain can be thought of as the percentage change in length:

$$\text{Strain} = [(l - l₀)/l₀] \times 100\% \tag{Eq. 4.2}$$

Strain can be estimated from the tissue Doppler strain rate by integrating the curve over time.

Thus strain is analogous to ejection fraction (i.e., change in volume normalized to initial volume) with the advantage that spatial localization and temporal localization are possible. In fact, a graph of strain over the cardiac cycle ([Fig. 4.14](#fig-4-14)) looks similar to a ventricular volume curve. Because strain is relative to the baseline length, end-diastole is considered zero strain. During systole strain decreases rapidly until end-systole is reached. Isovolumetric relaxation and contraction result in a slight flattening of the curve just before and after systole. In diastole, a rapid increase in strain occurs during the early phase of diastolic filling *(E)*, followed by a plateau during diastasis and then another increase with atrial contraction *(A)* back to the baseline at end-diastole. Peak systolic strain is a measure of regional ventricular function. However, like ejection fraction, strain varies with preload.

<span id="fig-4-13"></span>![](_page_13_Figure_3.jpeg)

**FIGURE 4.13** Derivation of strain rate and strain from myocardial tissue velocities. From the apical view, at least three Doppler sample volumes are positioned in the myocardium about 12 mm apart. The three graphs on the right show one cardiac cycle, matched for timing as shown by the electrocardiogram *(ECG)* at the top. The tissue Doppler tracings show mean velocity versus time with the line colors corresponding to each sample volume position. Strain rate *(SR)* is calculated for each time point as the change in velocity *(V)* between each two sample volume positions, divided by the distance *(D)* between them. Strain is determined by integration of the strain rate to generate a curve similar to an LV volume curve with a rapid decrease in strain during ejection (end-diastole *[ED]* to end-systole *[ES]*) and a rapid increase in strain in early diastole *(E)* with another increase in late diastole after atrial contraction *(A). 4C,* Four-chamber; *T,* transducer.

Accurate measurements of Doppler strain rate and strain require careful attention to technical aspects of data recording. The sample volumes must fit within the myocardium at an adequate distance from each other. In addition, velocity is measured only in the direction toward and away from the transducer. Signal quality is enhanced by the use of harmonic imaging, an adequate pulse repetition frequency, a high frame rate, and by tracking the sample volume to the ventricular wall. The Suggested Reading section provides further details about data acquisition and interpretation.

<span id="fig-4-14"></span>![](_page_14_Figure_3.jpeg)

**FIGURE 4.14** Myocardial mechanics: normal compared with acute myocardial infarction. Recordings from a healthy individual *(left)* and from a patient with posterior myocardial infarction (*right;* be aware of different scales). All tissue Doppler modalities are sampled from three identical levels along the LV lateral wall (healthy individual) and posterior wall (patient with myocardial infarction). In ischemic myocardium, systolic velocities and displacement are typically reduced *(right upper panels),* and there are reductions in systolic strain rate and strain *(right lower panels). (From Smiseth OA, Edvardsen T, Torp H: Myocardial mechanics: velocities, strain, strain rate, cardiac synchrony and twist. In Otto CM, editor:* The Practice of Clinical Echocardiography, *ed 5, Philadelphia, 2017, Elsevier, pp 128–146.)*

</div></details>

<details class="med-details"><summary>

### Speckle Tracking Strain Imaging</summary><div class="details-content">

Strain imaging also can be based on tracking the motion of small bright spots in the myocardium (speckles) on the gray-scale image as they move during the cardiac cycle. Speckles are natural acoustic markers because of interference patterns caused by backscattered signals from small structures (less than a wavelength) in the myocardium. The advantages of speckle tracking compared with Doppler tissue velocities are: (1) simpler data acquisition, (2) lack of angle dependence, (3) direct measurement of strain, (4) multiple simultaneous measurements in the image plane, and (5) the ability to perform the analysis after image acquisition. The ultrasound system tracks speckles and determines the distance between two markers in a defined myocardial region and then plots this distance over the cardiac cycle ([Fig. 4.15](#fig-4-15)). Thus speckle tracking provides a direct measure of strain—the change in length of the myocardium relative to the original length. In addition, circumferential strain can be measured from short-axis views, radial strain in multiple segments, and longitudinal strain in long-axis views. Strain rate is the first derivative, or slope, of the graph of strain over the cardiac cycle.

<span id="fig-4-15"></span>![](_page_15_Figure_3.jpeg)

**FIGURE 4.15** Speckle tracking strain imaging. The figure demonstrates a typical strain pattern from a normal LV. The colors in each strain trace correspond to the colorized LV segments in the 2D display at the *upper left panel*. *ANT,* Anterior; *EDV,* end-diastolic volume; *EF,* ejection fraction; *ESV,* end-systolic volume; *Fx,* function; *HR,* heart rate; *INF,* inferior; *LAT,* lateral; *SEPT,* septum. *(From Smiseth OA, Edvardsen T: Myocardial mechanics: velocity, strain, strain rate, cardiac synchrony, and twist. In Otto CM, editor:* The Practice of Clinical Echocardiography, *ed 4, Philadelphia, 2012, Saunders, pp 177–196.)*

</div></details>

<details class="med-details"><summary>

### Clinical Utility</summary><div class="details-content">

Tissue Doppler imaging now is a standard element in the clinical evaluation of diastolic function (see Chapter 7). Other measures of myocardial mechanics have improved our understanding of disease pathophysiology but are not yet routine. For example, Doppler strain rate and strain imaging techniques have been shown to be more sensitive than conventional echocardiographic measurements for the detection of early myocardial involvement in amyloidosis, diabetes, and hypertrophic cardiomyopathy. However, the sensitivity and specificity of these approaches for the detection of subclinical cardiac involvement await further validation. Strain imaging and strain rate imaging have also been proposed as potentially useful for the detection of myocardial ischemia during stress testing and for the diagnosis of myocardial viability, but they are not currently part of a standard stress echocardiographic study (see Fig. 8.10).

</div></details>

<details class="med-details"><summary>

### Dyssynchrony, Twist, and Torsion</summary><div class="details-content">

The term *dyssynchrony* describes a pattern of ventricular contraction in which some areas contract before other areas in an irregular spatial and temporal pattern. Dyssynchrony is primarily seen in patients with a reduced ejection fraction, either from cardiomyopathy or due to ischemic disease, and it may be appreciated on 2D imaging in some cases. Attempts to measure the amount of dyssynchrony have used imaging, conventional Doppler, and tissue Doppler approaches. M-mode echocardiography has been used to measure the time interval from the QRS complex on the electrocardiogram to maximum inward motion of the ventricular wall, by comparing the septum to the posterior wall. This approach is limited by the many other causes of changes in septal motion. Interventricular dyssynchrony has been measured as the difference between LV and RV preejection periods, measured from the QRS complex to the onset of aortic or pulmonic flow, respectively, with abnormal defined as a difference in these measurements >40 ms.

With pulsed tissue Doppler, the variation in time to peak systolic velocity at different locations in the myocardium also provides a measure of dyssynchrony. Tissue Doppler mean velocity data displayed using a color scale superimposed on the 2D image are analogous to color Doppler flow imaging data. With a normal pattern of ventricular contraction, a uniform pattern of red in systole and blue in diastole is present. This can also be displayed using a color M-line display. In contrast, dyssynchrony results in a chaotic pattern of red-blue because different areas of the myocardium contract at different times and rates (see Fig. 9.11).

Abnormalities in LV twist and torsion have been described in patients with heart failure and with coronary, valve, and pericardial disease, but currently these measurements are not recommended for clinical use.

<details class="med-details"><summary>

#### TABLE 4.4: Cardiac Mechanics: Approaches and Clinical Applications</summary><div class="details-content">

<span id="table-4-4"></span>
| Modality | Methodology | Clinical Applications |
|----------|-------------|----------------------|
| Tissue Doppler imaging | Measurement of the velocity (cm/s) of motion of the myocardium either as a single point with pulsed Doppler or over an image plane with color Doppler | • Tissue Doppler myocardial velocities are standard measures of LV diastolic function. |
| Tissue Doppler strain rate (SR) and strain imaging | Tissue Doppler velocities at several sites or color Doppler across the image are used to measure SR:<br>SR = (V₂ − V₁) / D | • SR is a measure of ventricular contractility.<br>• SR is integrated to determine strain, a measure of regional myocardial function.<br>• The utility of tissue color Doppler is limited by angle dependence and high signal noise for derived SR and strain. |
| Myocardial speckle tracking strain (STE) | Strain is measured directly from the motion of myocardial speckles across the 2D image or in 3D as:<br>[(L − L₀) / L₀] × 100% | • Myocardial STE is angle independent.<br>• STE analysis can be performed after image acquisition.<br>• STE strain and SR may improve evaluation of LV diastolic function, but further validation is needed.<br>• STE strain and SR can improve accuracy of stress echocardiography by experts. |
| Myocardial dyssynchrony | Multiple 2D, pulsed Doppler, and tissue Doppler methods | • The degree of dyssynchrony may predict the response to biventricular pacer therapy. |
| LV rotation, twist, and torsion | Rotation is the circular motion of the LV myocardium around its long axis, measured in degrees, using STE.<br>Twist is the absolute difference in rotation between the LV base and apex (degrees).<br>Torsion is the gradient in rotation angle from base to apex, measured as degrees per centimeter. | • STE-measured abnormalities in LV rotation, twist, and torsion have been described in patients with heart failure and coronary, valve, and pericardial disease.<br>• Limitations of these measurements include lack of standardization of imaging planes and a need to define normal values.<br>• Clinical use of this methodology is not currently recommended. |
| LV dyssynchrony | Approaches to measuring interventricular dyssynchrony include M-mode, 2D tissue Doppler, STE, and 3D echo. | • Currently there is no clear role for echocardiographic measures of ventricular dyssynchrony in the management of patients with heart failure. |

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## CONTRAST ECHOCARDIOGRAPHY</summary><div class="details-content">

Contrast echocardiography refers to the injection into the bloodstream of an agent that results in increased echogenicity of the blood or myocardium on ultrasound imaging, thus producing opacification of the cardiac chambers or an increase in echo density of the myocardium. Ultrasound “contrast” is generated by the presence of microbubbles in the ultrasound field. At low ultrasound power outputs, microbubbles scatter ultrasound at the gas-liquid interface and result in the detection of a strong signal by the transducer. Fundamental ultrasound imaging is based on detection of this signal reflected from the gas-liquid interface. In addition, ultrasound causes compression and expansion (i.e., oscillation) of microbubbles, with the resonant frequency of a microbubble inversely related to its diameter. Harmonic imaging detects this nonlinear resonant signal. However, at higher power outputs, ultrasound results in microbubble destruction. Thus careful adjustment of instrument power outputs is needed during contrast imaging.

<details class="med-details"><summary>

### Contrast Agents</summary><div class="details-content">

Two types of echo-contrast agents are used, those that opacify the:
- Right heart
- Left heart and myocardium

Depending on the size of the microbubbles relative to the lung capillary diameter, the microbubbles are trapped in the pulmonary capillaries so that no contrast material is seen in the left heart in the absence of an intracardiac right-to-left communication ([Fig. 4.16](#fig-4-16)). Microbubbles in the 1- to 5-μm size range traverse the pulmonary bed; microbubbles in this size range resonate at a frequency of 1.5 to 7 MHz, corresponding to clinical transducer frequencies.

<span id="fig-4-16"></span>![](_page_17_Figure_3.jpeg)

**FIGURE 4.16** Right heart contrast study. TEE view showing dense opacification of the RA following a peripheral venous injection *(INJ)* of agitated saline solution, which does not pass through the pulmonary vascular bed. A small amount of contrast *(arrow)* has entered the LA through a patent foramen ovale. *Ao,* Aorta.

The most widely used agent for contrast of the right heart is agitated saline. A simple approach is rapidly to push 5 mL of sterile saline, with a small amount (about 0.2 mL) of air, between two syringes connected with a three-way stopcock. This results in the production of large microbubbles that do not pass through the pulmonary vascular bed. When the saline appears opaque, it is injected rapidly into a peripheral vein during echocardiographic imaging, with the total volume and rate of injection adjusted based on image quality. The contrast effect may be enhanced by following the contrast injection with 10 mL of nonagitated saline. Care should be taken to ensure that no visible free air is present in the injection system. In addition, agitated saline should not be used in patients with known significant right-to-left shunts.

Commercially available contrast agents for the left heart consist of air or low-solubility fluorocarbon gas in stabilized microbubbles encapsulated with denatured albumin, monosaccharides, or other formulations. These agents typically are prepared just before injection with specific directions for the preparation and use of each agent. Some require resuspension before each bolus intravenous injection. Others are diluted and given as a continuous infusion. Microbubbles are fragile, so careful handling and infusion techniques are needed for diagnostic results. The optimal volume and rate of infusion depend on the specific contrast agent used, with the objectives being to provide full opacification while minimizing attenuation due to excess microbubble density.

Instrument settings are adjusted to optimize image quality during contrast opacification of the LV, including a decrease in the overall power output (usually to a mechanical index of about 0.5), a focal depth setting at the middle or near field, a lower transducer frequency, and an increase in overall gain and dynamic range.

</div></details>

<details class="med-details"><summary>

### Applications</summary><div class="details-content">

Contrast echocardiography has four proposed diagnostic applications ([Table 4.5](#table-4-5)):
- Detection of intracardiac shunts
- Enhancement of Doppler signals
- LV opacification
- Myocardial perfusion

Right heart contrast allows for the detection of right-to-left intracardiac shunts by the appearance of contrast in the left heart within one to two beats of contrast appearance in the right heart. With a patent foramen ovale, right-to-left shunting may be present only after Valsalva maneuver because of the transient increase in RA, compared with LA, pressure (see Figs. 15.26 and 15.28). Even with predominant left-to-right shunts (e.g., with an atrial septal defect), a small amount of right-to-left shunting usually occurs when the pressures on both sides of the defect are similar, thus allowing for the detection of shunting with right heart contrast. Other examples of the utility of right heart contrast include identification of a persistent left superior vena cava or identification of the systemic venous inflow pathway in complex congenital heart disease.

Contrast has been used at some centers to increase Doppler signal strength, for example, the tricuspid regurgitant jet. However, the effect of contrast on the Doppler signal varies with instrument parameters, and this approach has not gained widespread use.

LV opacification in situations that result in poor image quality, either on resting studies or during stress echocardiography, enhances the recognition of segmental wall motion abnormalities and overall LV systolic function ([Fig. 4.17](#fig-4-17)). Contrast enhancement improves the accuracy of echocardiographic stress studies when endocardial definition is suboptimal. Recognition of LV thrombus also is improved with opacification of the LV (see Fig. 9.10).

<span id="fig-4-17"></span>![](_page_18_Figure_17.jpeg)

**FIGURE 4.17** Left heart echo-contrast. In this patient with suboptimal image quality on apical views *(left),* opacification of the LV using left-sided echo contrast enhances endocardial border identification, thus allowing accurate measurement of ejection fraction and evaluation of regional wall motion. *A4C,* Apical four-chamber.

Assessment of myocardial perfusion with contrast echocardiography is technically challenging and rarely used in clinical practice. Only about 6% of the stroke volume perfuses the myocardium, so the relative number of microbubbles in the coronary circulation is small. Mechanical and ultrasound destruction of microbubbles further limits the contrast effect. Thus special imaging modes, such as intermittent imaging, pulse inversion, or power modulation imaging are needed for myocardial contrast imaging. Myocardial contrast perfusion imaging might improve detection of coronary disease on stress studies and allow identification of impaired coronary perfusion at rest. However, other approaches for the evaluation of myocardial viability and perfusion, including nuclear perfusion imaging, cardiac magnetic resonance imaging, and positron emission tomography are superior and are the current clinical standard.

<details class="med-details"><summary>

#### TABLE 4.5: Indications for Contrast Echocardiography</summary><div class="details-content">

<span id="table-4-5"></span>
**Right heart contrast (e.g., agitated saline)**
- Detection of atrial septal defects and patent foramen ovale
- Documentation of persistent left superior vena cava

**Left heart contrast (intravenous agents with transpulmonary passage)**
- Enhancement of contrast between LV chamber and endocardium (improved border recognition)
- Myocardial perfusion

**Intracoronary contrast**
- Opacification of myocardium perfused by injected vessel (e.g., during catheter ablation for hypertrophic cardiomyopathy)

</div></details>

</div></details>

<details class="med-details"><summary>

### Limitations and Safety</summary><div class="details-content">

Right heart contrast to detect large intracardiac shunts is needed infrequently given the sensitivity and specificity of color Doppler and TEE imaging. The primary use of right heart contrast is for the detection of a patent foramen ovale. A small ventricular septal defect usually will not be detected with a right heart contrast injection because little right-to-left shunting occurs.

The use of left heart contrast requires considerable experience to judge the infusion rate and volume needed to opacify the LV optimally. When the microbubble density is too high, an excessive contrast effect at the apex results in attenuation of the signal or “shadowing” of the rest of the LV. A swirling appearance is seen with too little contrast or in low-flow states. Bubble destruction due to a high mechanical index also results in a swirling pattern with inadequate ventricular opacification.

The addition of a contrast injection to the echocardiographic examination increases the cost and risk of the procedure. In addition, the added time and personnel needed for placement of an intravenous line during a standard echocardiographic examination or exercise stress study make this approach impractical in many laboratories. Although major adverse reactions to left-sided contrast agents are rare, patients may experience nausea, vomiting, headache, flushing, or dizziness. Hypersensitivity reactions can occur.

Adverse effects of contrast agents for opacification of the left heart have been reported. Contraindications to the use of left-sided contrast include acute coronary syndromes, acute myocardial infarction, worsening or clinically unstable heart failure, intracardiac shunts, serious ventricular arrhythmias, respiratory failure, pulmonary hypertension, or a history of hypersensitivity to perflutren. Thus use of pharmacologic contrast requires a physician’s order, is restricted to studies where improved endocardial definition is necessary, and should be avoided in high-risk patients. Blood pressure and electrocardiographic monitoring for 30 minutes after the contrast injection is recommended in high-risk patients.

</div></details>

</div></details>

<details class="med-details"><summary>

## INTRACARDIAC ECHOCARDIOGRAPHY</summary><div class="details-content">

<details class="med-details"><summary>

### Instrumentation</summary><div class="details-content">

Intracardiac echocardiography uses a catheter-like ultrasound probe that is passed into the right heart chambers from the femoral vein ([Fig. 4.18](#fig-4-18)). The transducer frequency is variable from 5 to 10 MHz to provide adequate penetration to image structures at distances up to 10 cm from the transducer and to provide optimal image resolution. Current devices provide single-plane imaging and pulsed and color Doppler, with a steerable probe connected to a standard ultrasound imaging system.

<span id="fig-4-18"></span>![](_page_19_Picture_8.jpeg)

**FIGURE 4.18** Intracardiac echocardiography. A probe is advanced from the inferior vena cava to the RA. The probe is retroflexed to image the interatrial septum *(IAS). SVC,* Superior vena cava. *(From Bartel T, Muller S, Caspari G, et al: Intracardiac and intraluminal echocardiography: indications and standard approaches,* Ultrasound Med Biol *28[8]:997–1003, 2002.)*

</div></details>

<details class="med-details"><summary>

### Technique</summary><div class="details-content">

Typically, the 10-French 90-cm-long, disposable probe is inserted through a venous sheath as part of an invasive cardiac procedure in the cardiac catheterization or electrophysiology laboratory. The physician performing the interventional or electrophysiologic procedure also acquires the cardiac images because expertise in intracardiac manipulation of catheters is needed for this procedure. Fluoroscopy is used for placement of the probe because it does not accommodate a guidewire. The tip of the probe can be tilted and flexed using dials at the base of the probe, and the image plane also can be adjusted by advancing, withdrawing, or rotating the probe, similar to a single-plane TEE transducer. The transducer can be positioned in the:
- Inferior vena cava
- RA
- RV

The RA location is most useful for monitoring invasive procedures.

From the inferior vena cava the transducer is turned to visualize the abdominal aorta. From the RA position, the following views are obtained:
- Short-axis aortic valve
- Tricuspid valve and RV
- Mitral valve and LV
- Interatrial septum
- LA and left pulmonary veins

The interatrial septum is visualized from an RA position with the catheter retroflexed to show the fossa ovalis, septum primum, and RA and LA. The aortic valve is visualized by straightening and slightly anteflexing the probe and turning it toward the aorta. The tricuspid valve and RV are best visualized by anteflexing the probe after positioning the tip superiorly in the RA. From this position, turning the probe posteriorly allows for visualization of the mitral valve and LV. The left pulmonary veins are visualized by angulation from the atrial septal view inferiorly to image the LA appendage and then the pulmonary veins. From this position, the probe is turned clockwise and advanced superiorly in the atrium to visualize the two right pulmonary veins. These views allow diameter measurements and pulsed and color Doppler interrogations of all four pulmonary veins.

From the RV, a view of the outflow tract and pulmonary artery can be achieved. The LV also can be evaluated, but care in interpretation of wall motion is needed if the catheter is moving in the RV.

</div></details>

<details class="med-details"><summary>

### Applications</summary><div class="details-content">

Intracardiac echocardiography is primarily used for monitoring invasive procedures, although the diagnostic potential of this modality has not been fully evaluated ([Table 4.6](#table-4-6)). In a patient undergoing an invasive cardiac procedure, image quality is usually inadequate on TTE imaging, and TEE imaging typically requires general anesthesia, given the length of the procedure. Intracardiac echocardiography is well tolerated, provides accurate information, and provides continuous imaging data to the physician performing the procedure.

The primary applications of intracardiac echocardiography include:
- Guiding device closure of interatrial communications ([Fig. 4.19](#fig-4-19))
- Monitoring percutaneous LA appendage closure
- Guiding radiofrequency pulmonary vein ablation
- Monitoring transcatheter valve implantation
- Peri-interventional imaging of the aorta
- Peri-interventional imaging of the mitral valve

<span id="fig-4-19"></span>![](_page_21_Figure_3.jpeg)

**FIGURE 4.19** Intracardiac echocardiographic guidance during placement of an atrial septal closure device. The catheter is guided across the atrial septal defect *(top left),* and the LA side of the device is deployed first *(top right),* followed by deployment of the RA side of the device *(bottom left).* When the device is correctly positioned, the guiding catheter is detached and the two sides of the device are flattened to close the atrial septal defect *(bottom right). (Images courtesy Steve Goldberg, MD.)*

In the cardiac catheterization laboratory, intracardiac echocardiography at baseline before closure of an atrial septal defect allows evaluation of the atrial septal defect size and position and identification of adjacent structures including the pulmonary veins and coronary sinus. During the procedure, intracardiac imaging allows optimal positioning of the device at each stage of the procedure. After the device is deployed, color flow intracardiac imaging allows evaluation for any residual shunt. Advantages of intracardiac echocardiography compared with TEE are that the interventional cardiologist can perform the imaging during the procedure and general anesthesia is not needed.

For electrophysiology procedures, intracardiac echocardiography is used to monitor:
- Transseptal puncture
- Detailed evaluation of LA and pulmonary vein anatomy
- Placement of the radiofrequency ablation probe with optimal probe-tissue contact
- Development of spontaneous contrast during the ablation
- Detection of any complications of the procedure

The transseptal catheter produces “tenting” of the atrial septum when correctly positioned, improving the safety of this procedure. Potential complications that can be detected immediately with intracardiac echocardiography include intracardiac thrombus formation, pericardial effusion, and pulmonary vein obstruction.

<details class="med-details"><summary>

#### TABLE 4.6: Clinical Applications of Intracardiac Echocardiography</summary><div class="details-content">

<span id="table-4-6"></span>
| Primary Role in Procedure Guidance | Supplemental or Evolving Role in Procedure Guidance | Investigational Role as Primary Guidance Modality |
|------------------------------------|------------------------------------------------------|---------------------------------------------------|
| Closure of interatrial communications (ASD, PFO) | TAVI | Mitral valve clip |
| Electrophysiology procedures (PVI, CTI, VT ablation) | Less common shunt closure procedures (VSD and PDA) | LAA closure devices |
| Transseptal catheterization | Transcatheter mitral valve procedures | PVL closure |
| Percutaneous balloon mitral valvuloplasty | Alcohol septal ablation in hypertrophic cardiomyopathy | LAA thrombus assessment |

*ASD,* Atrial septal defect; *CTI,* cavotricuspid isthmus; *LAA,* left atrial appendage; *PDA,* patent ductus arteriosus; *PFO,* patent foramen ovale; *PVI,* pulmonary vein isolation; *PVL,* paravalvular leak; *TAVI,* transcatheter aortic valve implantation; *VSD,* ventricular septal defect; *VT,* ventricular tachycardia. *From Silvestry FE: Intracardiac echocardiography. In Otto CM, editor:* The Practice of Clinical Echocardiography, *ed 5, Philadelphia, 2017, Elsevier, pp 79–90.*

</div></details>

</div></details>

<details class="med-details"><summary>

### Limitations and Safety</summary><div class="details-content">

The major limitations of intracardiac echocardiography are cost and the risks of an invasive procedure. However, because most patients undergo intracardiac echocardiography as part of an invasive therapeutic procedure, little additional risk is incurred. The current cost of the disposable catheter is substantial, which limits use of this technology for diagnostic purposes. The single-plane probe design is adequate, but a biplane or multiplane probe would improve image acquisition.

</div></details>

</div></details>

<details class="med-details"><summary>

## THE ECHO EXAM</summary><div class="details-content">

<details class="med-details"><summary>

#### Specialized Echo Applications</summary><div class="details-content">

| Modality | Instrumentation | Clinical Utility | Special Training |
|----------|----------------|------------------|------------------|
| 3D echo | Volume-rendered images<br>Surface-rendered LV volumes<br>Simultaneous 2D images | • LV volumes, EF, and regional wall motion<br>• Mitral valve anatomy<br>• Procedural guidance | • Image acquisition and analysis |
| Tissue Doppler strain rate and strain | Tissue Doppler and 2D imaging are used to measure strain rate:<br>SR = (V₂ − V₁) / D | • Strain rate is a measure of ventricular contractility.<br>• Strain rate is integrated to determine strain, a measure of regional myocardial function. | • Data acquisition and analysis<br>• Clinical interpretation of data |
| Myocardial speckle tracking | Strain is measured directly from the motion of myocardial speckles as:<br>[(L − L₀) / L₀] × 100% | • Myocardial speckle tracking is angle independent.<br>• Analysis can be performed after image acquisition. | • Data acquisition and analysis<br>• Clinical interpretation of data |
| Myocardial dyssynchrony | Multiple 2D pulsed Doppler and tissue Doppler methods | • The degree of dyssynchrony is altered in various disease states. | • Data acquisition and analysis<br>• Clinical interpretation of data |
| Contrast echo | Microbubbles for right or left heart contrast | • Detection of patent foramen ovale<br>• LV endocardial definition | • Intravenous administration of contrast agents<br>• Knowledge of potential risks |
| Intracardiac echo (ICE) | 5–10-MHz catheter-like intracardiac probe | • Interventional procedures (ASD closure)<br>• EP procedures | • Invasive cardiology training and experience |
| Point-of-care ultrasound study (POCUS) | Small, inexpensive ultrasound instruments | • Bedside evaluation by physician for pericardial effusion, LV global function, and LV regional function | • At least level 1 echo training |
| Procedural guidance | Complete TEE and/or TTE ultrasound system | • Intraoperative evaluation of structural heart disease immediately before and after the procedure<br>• Procedural guidance of transcatheter procedures for structural heart disease | • Echocardiography training (often performed by cardiac anesthesiologists) |

*ASD,* Atrial septal defect; *EF,* ejection fraction; *EP,* electrophysiology.

</div></details>

</div></details>