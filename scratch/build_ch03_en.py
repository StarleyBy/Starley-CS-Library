import os

ch_dir = r'd:\IT sandbox\Starley-CS-Library\books\cardiac-echo\eacvi-echo-handbook\chapters\chapter-03'
os.makedirs(ch_dir, exist_ok=True)

md = r"""# Chapter 3. The Standard Transoesophageal Examination

##### Comprehensive EACVI practical guide to standard transoesophageal echocardiographic (TOE) probe manipulation, multiplane 2D views, comprehensive 3D matrix assessment, transcatheter procedural guidance, and standardized reporting protocols.

<details class="med-details"><summary>

## Executive Summary</summary><div class="details-content">

### Indications & Procedural Safety
* **Primary Indications:** Unexplained embolic stroke, suspected infective endocarditis (native valve vegetations $< 5\text{ mm}$, perivalvular abscesses, prosthetic valve dehiscence), precise mitral valve repair planning, assessment of the thoracic aorta (dissection, complex atheroma), guidance of transcatheter structural interventions (TAVI, MitraClip, LAA closure, ASD/PFO closure), and cardioversion guidance in atrial fibrillation/flutter.
* **Absolute Contraindications:** Esophageal pathology with perforation risk (strictures, active esophagitis, esophageal diverticulum/Zenker's, esophageal varices with recent bleeding, esophageal tumor), recent upper gastrointestinal surgery ($< 6\text{ weeks}$), active gastrointestinal bleeding, and unstable cervical spine trauma.
* **Safety Protocols:** Fasting for $\ge 6\text{ hours}$ for solids and $2\text{ hours}$ for clear fluids. Topical pharyngeal anesthesia with lidocaine spray. Conscious sedation (e.g., midazolam $1\text{–}3\text{ mg}$ IV) with continuous monitoring of pulse oximetry, ECG, and non-invasive blood pressure. Always unlock deflection wheels during probe advancement and withdrawal.

### Systematic Multiplane 2D Anatomy
* **Probe Manipulations:** Five degrees of freedom: insertion/withdrawal (depth), rotation (clockwise/counterclockwise), anteflexion/retroflexion (large wheel), lateral flexion (small wheel), and electronic multiplane angle rotation ($0^\circ\text{ to }180^\circ$).
* **Core Interrogation Levels:**
  * *Upper Esophageal ($20\text{–}25\text{ cm}$):* Aortic arch, pulmonary artery bifurcation, superior vena cava.
  * *Mid-Esophageal ($30\text{–}35\text{ cm}$):* Standard 4-chamber ($0^\circ$), mitral commissural ($60^\circ$), 2-chamber ($90^\circ$), long-axis ($120^\circ\text{–}140^\circ$), aortic valve short/long axis ($30^\circ\text{–}45^\circ / 120^\circ$), LAA multi-angle sweeps ($0^\circ, 45^\circ, 90^\circ, 135^\circ$), and bicaval view ($90^\circ\text{–}110^\circ$).
  * *Transgastric ($40\text{–}45\text{ cm}$):* Basal and mid-papillary short axis ($0^\circ$), two-chamber ($90^\circ$), long-axis ($120^\circ$), and deep transgastric ($0^\circ\text{–}20^\circ$ with anteflexion) for coaxial aortic valve continuous-wave Doppler alignment.
  * *Descending Thoracic Aorta:* Systematic pullback from diaphragm to distal arch, assessing wall thickness, ulcerations, and mobile atheromatous debris.

### Advanced 3D Matrix TOE
* **Mitral Valve "Surgeon's View":** Standardized en-face perspective from the left atrium with the aortic valve anteriorly at 11–12 o'clock, the left atrial appendage at 9 o'clock, and the coronary sinus/posterior leaflet at 6 o'clock. Enables precise localization of prolapsing or flail scallops (A1, A2, A3; P1, P2, P3).
* **Multi-Planar Reconstruction (MPR) for Interventions:** Orthogonal slicing of 3D full-volume datasets to measure true minimal and maximal diameters, perimeter, and area of the aortic annulus, distance from annulus to coronary ostia for TAVI, and landing zone dimensions for LAA occluders.

</div></details>

<details class="med-details"><summary>

## 3.1 Transoesophageal Echocardiography (TOE)</summary><div class="details-content">

Transoesophageal echocardiography (TOE) positions a high-frequency transducer ($5.0\text{–}7.0\text{ MHz}$) in the esophagus and stomach immediately posterior to the left atrium, eliminating chest wall attenuation and delivering exceptional spatial resolution.

<details class="med-details"><summary>

#### Patient Preparation, Indications, and Contraindications</summary><div class="details-content">

* **Indications:**
  1. *Infective Endocarditis:* Superior sensitivity ($> 95\%$ vs $60\%$ for TTE) for vegetations, root abscesses, pseudoaneurysms, and fistulae.
  2. *Cardioembolic Source & Cardioversion:* Exclusion of LAA thrombi prior to electrical or chemical cardioversion or catheter ablation.
  3. *Valvular Heart Disease:* Comprehensive anatomical evaluation of native and prosthetic valves, mechanism of regurgitation, and candidacy for repair.
  4. *Aortic Pathology:* Acute aortic syndromes (dissection flap, intramural hematoma, penetrating ulcer) and source of embolic atheroma.
  5. *Intraoperative and Interventional Monitoring:* Real-time guidance of transcatheter procedures (TAVI, TEER/MitraClip, LAA closure, percutaneous paravalvular leak closure).
* **Contraindications:**
  * *Absolute:* Known esophageal stricture, web, diverticulum (Zenker's), esophageal carcinoma, active upper GI hemorrhage, suspected or confirmed esophageal perforation, unstable cervical spine injury.
  * *Relative:* Asymptomatic esophageal varices (low grade), hiatal hernia, history of radiation therapy to the mediastinum, severe coagulopathy or thrombocytopenia (platelets $< 50,000/\mu\text{L}$), uncooperative patient unable to swallow safely.
* **Probe Introduction:**
  * Lubricate the probe tip thoroughly with acoustic gel.
  * Ensure both deflection lock mechanisms are completely disengaged.
  * Guide the probe gently along the posterior pharyngeal wall in the midline while the patient swallows actively ([Fig. 3-1](#fig-03-01)). Never apply excessive force.

<span id="fig-03-01"></span>![](fig-03-01.jpg)

**FIGURE 3-1** Technique of transoesophageal echocardiography probe introduction. Patient positioned in the left lateral decubitus position with neck slightly flexed and bite-guard in place.

</div></details>

<details class="med-details"><summary>

#### Multiplane Probe Manipulation and Standard Positions</summary><div class="details-content">

A multiplane TOE probe provides comprehensive volumetric coverage through five coordinated mechanical and electronic adjustments:
1. **Depth Manipulation:** Advancing the probe deeper into the esophagus/stomach or withdrawing it proximally.
2. **Shaft Rotation:** Rotating the shaft clockwise (to inspect right-sided structures) or counterclockwise (to inspect left-sided and posterior structures).
3. **Anteflexion and Retroflexion:** Operated by the large control wheel on the probe handle to angle the tip anteriorly or posteriorly.
4. **Lateral Deflection:** Operated by the small control wheel to angle the tip to the left or right.
5. **Electronic Multiplane Steering:** Rotating the active transducer array electronically from $0^\circ$ (transverse plane) through $90^\circ$ (longitudinal plane) up to $180^\circ$ (inverted transverse plane).

</div></details>

<details class="med-details"><summary>

#### Mid-Esophageal Standard Views</summary><div class="details-content">

Positioned at approximately $30\text{–}35\text{ cm}$ from the incisors, the mid-esophageal acoustic window lies immediately adjacent to the left atrium ([Fig. 3-2](#fig-03-02)):

* **Mid-Esophageal 4-Chamber View ($0^\circ\text{–}20^\circ$):** Shows the left atrium, mitral valve (scallops A2/A1 and P2/P1), left ventricle, interatrial septum, right atrium, and tricuspid valve.
* **Mid-Esophageal Mitral Commissural View ($50^\circ\text{–}70^\circ$):** Transects the mitral valve through both commissures, displaying P3, A2, and P1 scallops from left to right; essential for segmental prolapse localization.
* **Mid-Esophageal 2-Chamber View ($80^\circ\text{–}100^\circ$):** Isolates the left atrium, left atrial appendage, anterior mitral leaflet (A1/A2), posterior leaflet (P3), and the LV anterior and inferior walls.
* **Mid-Esophageal Long-Axis View ($120^\circ\text{–}140^\circ$):** Visualizes the LVOT, aortic valve (RCC and NCC), ascending aorta, anterior mitral leaflet (A2), posterior leaflet (P2), and the anteroseptal and inferolateral LV walls.

<span id="fig-03-02"></span>![](fig-03-02.jpg)

**FIGURE 3-2** Standard mid-esophageal multiplane views for systematic mitral and aortic valve assessment across $0^\circ, 60^\circ, 90^\circ,$ and $130^\circ$.

</div></details>

<details class="med-details"><summary>

#### Upper Esophageal and Left Atrial Appendage (LAA) Interrogation</summary><div class="details-content">

* **Upper Esophageal Views ($20\text{–}25\text{ cm}$):**
  * *Aortic Valve Short-Axis ($30^\circ\text{–}50^\circ$):* Cross-section of all three aortic cusps (left, right, non-coronary), coronary ostia origins, and surrounding right ventricular outflow tract ([Fig. 3-3](#fig-03-03)).
  * *Ascending Aorta & Pulmonary Artery ($60^\circ\text{–}90^\circ$):* Displays the tubular ascending aorta, main pulmonary artery (MPA), and the right pulmonary artery (RPA) coursing posterior to the ascending aorta ([Fig. 3-5](#fig-03-05)).
* **Left Atrial Appendage (LAA) Protocol:**
  * Systematic electronic multiplane rotation must be performed from $0^\circ$ to $135^\circ$ (specifically at $0^\circ, 45^\circ, 90^\circ, 135^\circ$) to evaluate all lobes, identify chicken-wing, cactus, windsock, or cauliflower morphologies, and distinguish pectinate muscles from thrombi ([Fig. 3-4](#fig-03-04)).
  * Pulsed-wave Doppler placed $1\text{ cm}$ within the LAA orifice records emptying and filling velocities: peak emptying velocity $< 20\text{ cm/s}$ indicates severe stasis and high risk of thromboembolism.

<span id="fig-03-03"></span>![](fig-03-03.jpg)

**FIGURE 3-3** Upper esophageal views: aortic valve short-axis plane showing three aortic cusps and coronary ostia origins.

<span id="fig-03-04"></span>![](fig-03-04.jpg)

**FIGURE 3-4** Multiplane systematic evaluation of the left atrial appendage (LAA) across $0^\circ, 45^\circ, 90^\circ,$ and $135^\circ$ for thrombus exclusion and morphology grading.

<span id="fig-03-05"></span>![](fig-03-05.jpg)

**FIGURE 3-5** Upper esophageal view focusing on the main pulmonary artery and bifurcation into right (RPA) and left (LPA) pulmonary arteries.

</div></details>

<details class="med-details"><summary>

#### Right Atrium, Interatrial Septum, and Bicaval View</summary><div class="details-content">

Rotating the probe clockwise from the mid-esophageal 4-chamber view at an angle of $90^\circ\text{–}110^\circ$ yields the **Bicaval View** ([Fig. 3-6](#fig-03-06)):

* **Anatomical Visualizations:** Displays the right atrium, superior vena cava (SVC) entering superiorly, inferior vena cava (IVC) entering inferiorly, Eustachian valve, Chiari network, and the thin flap-like fossa ovalis of the interatrial septum.
* **Patent Foramen Ovale (PFO) & ASD Assessment:**
  * Colour Doppler at Nyquist scale $30\text{–}40\text{ cm/s}$ to detect left-to-right shunting across the fossa ovalis.
  * **Agitated Saline Contrast Study:** $9\text{ mL}$ isotonic saline mixed with $1\text{ mL}$ air agitated between two syringes and injected rapidly into an antecubital vein. Passage of microbubbles into the left atrium within 3 cardiac cycles following right atrial opacification (especially after release of a calibrated Valsalva maneuver) confirms a patent foramen ovale or intrapulmonary shunt.

<span id="fig-03-06"></span>![](fig-03-06.jpg)

**FIGURE 3-6** Bicaval view ($90^\circ\text{–}110^\circ$) visualizing the superior vena cava (SVC), inferior vena cava (IVC), right atrium, and fossa ovalis.

</div></details>

<details class="med-details"><summary>

#### Transgastric and Aortic Views</summary><div class="details-content">

* **Transgastric Views ($40\text{–}45\text{ cm}$):**
  * Advanced into the stomach and anteflexed against the gastric fundus ([Fig. 3-7](#fig-03-07)):
    * *Transgastric Basal SAX ($0^\circ$):* Mitral valve orifice from below.
    * *Transgastric Mid-Papillary SAX ($0^\circ$):* Circular LV cross-section displaying both papillary muscles, reference plane for regional ischemia in all three coronary territories.
    * *Deep Transgastric View ($0^\circ\text{–}20^\circ$):* Probe advanced to the gastric apex with maximal anteflexion, looking upward through the LV apex toward the aortic valve; delivers optimal coaxial alignment with the LVOT and aortic valve for continuous-wave Doppler measurement of aortic stenosis gradients when TTE windows are inadequate.
* **Thoracic Aorta Assessment:**
  * Rotating the probe counterclockwise to face posteriorly identifies the descending thoracic aorta ([Fig. 3-8](#fig-03-08)).
  * Stepwise withdrawal from the gastroesophageal junction to the aortic arch reveals:
    * Grade 1: Normal or minimal intimal thickening ($< 2\text{ mm}$).
    * Grade 2: Extensive intimal thickening ($2\text{–}3\text{ mm}$).
    * Grade 3: Atheroma $> 4\text{ mm}$ without mobile elements.
    * Grade 4: Large atheroma $> 4\text{ mm}$ with ulceration or mobile protruding components (high embolic potential).

<span id="fig-03-07"></span>![](fig-03-07.jpg)

**FIGURE 3-7** Transgastric views: mid-papillary short-axis plane, two-chamber view, and deep transgastric coaxial alignment.

<span id="fig-03-08"></span>![](fig-03-08.jpg)

**FIGURE 3-8** Transoesophageal evaluation of the descending thoracic aorta in long-axis (left) and short-axis (right) displaying complex ulcerated atherosclerotic plaque.

</div></details>

</div></details>

<details class="med-details"><summary>

## 3.2 The Standard Transoesophageal 3D Echo Examination</summary><div class="details-content">

Matrix-array 3D TOE probes contain over 2,500 independent elements, permitting real-time volumetric rendering and live biplane/triplane interrogation of complex intracardiac anatomy.

<details class="med-details"><summary>

#### Matrix Probe Manipulation and 3D Modes</summary><div class="details-content">

* **Probe Handling:** Matrix 3D TOE probes feature thumb-controlled rotary switches and buttons on the handle to toggle between Live 3D, 3D Zoom, and multi-beat Full-Volume modes ([Fig. 3-9](#fig-03-09)).
* **Acquisition Modes:**
  * *Live 3D:* Unstitched volume at $20\text{–}30\text{ Hz}$ for real-time catheter guidance.
  * *3D Zoom:* High-density volume centered on a specific valve orifice with maximum spatial detail.
  * *Multi-Beat Gated 3D:* Stitches 4 to 6 beats during suspended respiration to maximize volume rate ($> 50\text{ Hz}$) for chamber quantification.

<span id="fig-03-09"></span>![](fig-03-09.jpg)

**FIGURE 3-9** Three-dimensional matrix-array transoesophageal probe controls, electronic steering wheels, and handle activation switches.

</div></details>

<details class="med-details"><summary>

#### 3D Aortic Valve and Root Assessment</summary><div class="details-content">

From the upper-mid-esophageal window at $30^\circ\text{–}60^\circ$, 3D zoom yields true en-face views of the aortic valve from both aortic and ventricular perspectives ([Fig. 3-10](#fig-03-10)):

* **Morphological Analysis:** Verifies tricuspid versus bicuspid configuration (type 0, 1, or 2 according to Sievers classification), raphe orientation, cusp calcification distribution, and commissural fusion.
* **Coronary Ostia:** Visualizes left main and right coronary artery origins relative to cusp insertion lines.

<span id="fig-03-10"></span>![](fig-03-10.jpg)

**FIGURE 3-10** Three-dimensional rendering of the aortic valve viewed en-face from the aortic root perspective (**A**) and in longitudinal cross-section (**B**).

</div></details>

<details class="med-details"><summary>

#### 3D Mitral Valve "Surgeon's View"</summary><div class="details-content">

The EACVI standard for 3D mitral valve display is the en-face **"Surgeon's View"** ([Fig. 3-11](#fig-03-11)):

* **Standardized Orientation:**
  * The mitral valve is viewed from the left atrium looking down toward the left ventricle.
  * The aortic valve is rotated to the **11–12 o'clock** position (anterior).
  * The left atrial appendage is oriented at **9 o'clock** (lateral).
  * The interatrial septum is positioned at **3 o'clock** (medial).
  * The posterior leaflet (P1, P2, P3 scallops) is located inferiorly at **5–7 o'clock**.
* **Pathology Localization:** Allows unambiguous discrimination between P2 prolapse, commissural flail, leaflet clefts, perforation, and annular calcification.

<span id="fig-03-11"></span>![](fig-03-11.jpg)

**FIGURE 3-11** Three-dimensional en-face "surgeon's view" of the mitral valve from the left atrium (**A**) and corresponding ventricular view (**B**), illustrating scallop segmentation (A1-A3, P1-P3).

</div></details>

<details class="med-details"><summary>

#### 3D Tricuspid, Pulmonic, and Appendage Anatomy</summary><div class="details-content">

* **Tricuspid Valve:** From the mid-esophageal or transgastric window, 3D zoom visualizes all three tricuspid leaflets (anterior, posterior, septal) simultaneously, resolving leaflet tethering and prolapse ([Fig. 3-13](#fig-03-13)).
* **Pulmonic Valve:** Visualized from high upper-esophageal views, defining cusp mobility and infundibular geometry ([Fig. 3-12](#fig-03-12)).
* **Left Atrial Appendage (LAA) 3D Volumetry:** En-face and endoluminal rendering displays true orifice shape (frequently elliptical), maximum and minimum landing zone diameters, depth, and trabecular lobes for percutaneous occluder device selection ([Fig. 3-14](#fig-03-14)).
* **Interatrial Septum:** En-face 3D rendering of the fossa ovalis defines aneurysm dimensions, multifenestrated ASDs, and guides safe transseptal puncture in the postero-inferior sector ([Fig. 3-15](#fig-03-15)).

<span id="fig-03-12"></span>![](fig-03-12.jpg)

**FIGURE 3-12** Three-dimensional transoesophageal view of the pulmonic valve.

<span id="fig-03-13"></span>![](fig-03-13.jpg)

**FIGURE 3-13** Three-dimensional en-face rendering of the tricuspid valve viewed from the right atrium and right ventricle.

<span id="fig-03-14"></span>![](fig-03-14.jpg)

**FIGURE 3-14** Three-dimensional volumetric reconstruction of left atrial appendage lobar anatomy.

<span id="fig-03-15"></span>![](fig-03-15.jpg)

**FIGURE 3-15** Three-dimensional en-face visualization of the interatrial septum and fossa ovalis from the right atrial perspective.

</div></details>

<details class="med-details"><summary>

#### Multi-Planar Reconstruction (MPR) for Transcatheter Interventions</summary><div class="details-content">

Multi-Planar Reconstruction (MPR) slices 3D datasets along user-defined orthogonal planes for transcatheter procedure planning ([Fig. 3-16](#fig-03-16) and [Fig. 3-17](#fig-03-17)):

1. **Aortic Annulus Sizing for TAVI:**
   * The basal ring is defined by the nadirs of the three aortic cusp insertion lines.
   * MPR aligns two orthogonal longitudinal views to identify the true anatomical cross-sectional plane.
   * Planimetry directly measures:
     * Area ($CSA_{\text{annulus}}$)
     * Perimeter ($P_{\text{annulus}}$)
     * Derived perimeter diameter ($D_P = P / \pi$)
     * Annulus eccentricity index: $1 - (D_{\text{min}} / D_{\text{max}})$
2. **Coronary Ostia Height:**
   * Calibrated measurement of vertical distance from the annular plane to the left main and right coronary ostia ([Fig. 3-17](#fig-03-17)). A height $< 10\text{ mm}$ alerts to significant risk of acute coronary obstruction during transcatheter valve deployment.

<span id="fig-03-16"></span>![](fig-03-16.jpg)

**FIGURE 3-16** Multi-Planar Reconstruction (MPR) for aortic annulus quantification prior to TAVI, displaying orthogonal alignment planes and true anatomical annular planimetry.

<span id="fig-03-17"></span>![](fig-03-17.jpg)

**FIGURE 3-17** Measurement of vertical coronary ostial take-off heights relative to the virtual aortic annular plane.

</div></details>

</div></details>

<details class="med-details"><summary>

## 3.3 Storage, Archiving, and Standardized Reporting on TOE</summary><div class="details-content">

Digital storage of TOE examinations must follow rigorous standardized protocols to ensure data integrity and complete legal reproducibility.

<details class="med-details"><summary>

#### Minimal Dataset for 2D and 3D Digital Archiving</summary><div class="details-content">

The EACVI recommends routine acquisition and archival of a standardized 28-view multiplane dataset in all comprehensive diagnostic TOE procedures:

<details class="med-details"><summary>

#### <span id="table-03-01"></span>TABLE 3-1: Minimal Basic Dataset for 2D Transoesophageal Echocardiography Archiving</summary><div class="details-content">

| View / Level | Multiplane Angle | Primary Diagnostic Structures Interrogated |
|---|---|---|
| **ME 4-Chamber** | $0^\circ\text{–}20^\circ$ | Mitral valve (A2/P2, A1/P1), tricuspid valve, right heart chambers, LV lateral wall |
| **ME Mitral Commissural** | $50^\circ\text{–}70^\circ$ | Mitral scallops P3, A2, P1; subvalvular chords and papillary muscle heads |
| **ME 2-Chamber** | $80^\circ\text{–}100^\circ$ | LV anterior and inferior walls, LAA, left superior pulmonary vein, P3/A2 |
| **ME Long-Axis** | $120^\circ\text{–}140^\circ$ | LVOT, aortic valve (RCC/NCC), A2/P2, anteroseptum, inferolateral wall |
| **ME Aortic Valve SAX** | $30^\circ\text{–}50^\circ$ | All 3 aortic cusps, coronary ostia origins, RVOT, main pulmonary artery |
| **ME Aortic Valve LAX** | $120^\circ\text{–}140^\circ$ | Aortic root dimensions (annulus, sinuses, sinotubular junction), ascending aorta |
| **ME Bicaval View** | $90^\circ\text{–}110^\circ$ | SVC, IVC, right atrium, fossa ovalis, Eustachian valve, Chiari network |
| **LAA Multiplane Sweeps** | $0^\circ, 45^\circ, 90^\circ, 135^\circ$ | Systematic thrombus exclusion, pectinate muscles, PW Doppler emptying velocity |
| **Pulmonary Veins** | $0^\circ\text{ and }90^\circ$ | PW Doppler in right superior and left superior pulmonary veins |
| **TG Mid-Papillary SAX** | $0^\circ$ | LV cross-section with both papillary muscles; all 3 coronary artery territories |
| **Deep TG Long-Axis** | $0^\circ\text{–}20^\circ$ (anteflexed) | Coaxial continuous-wave Doppler alignment across the aortic valve and LVOT |
| **Descending Aorta** | $0^\circ\text{ and }90^\circ$ | Cross-sectional and longitudinal atheroma screening from diaphragm to distal arch |

</div></details>

<details class="med-details"><summary>

#### <span id="table-03-02"></span>TABLE 3-2: Recommendations for 3D Dataset Acquisition and Display</summary><div class="details-content">

| Structure | Recommended 3D Mode | Display Orientation Standard |
|---|---|---|
| **Mitral Valve** | 3D Zoom (live or 2-beat) | Surgeon's View: Aorta at 11–12 o'clock, LAA at 9 o'clock |
| **Aortic Valve** | 3D Zoom / MPR | En-face from aorta; align orthogonal planes for planimetry |
| **Tricuspid Valve** | 3D Zoom from ME or TG | View from RA with septum at 6 o'clock; or from RV cavity |
| **LAA Orifice** | 3D Zoom and MPR | En-face cross-section at circumflex artery level; landing zone planimetry |
| **Interatrial Septum** | Full-Volume with Colour | En-face view from RA and LA for defect localization and sizing |

</div></details>

</div></details>

<details class="med-details"><summary>

#### Standardized TOE Written Report Structure</summary><div class="details-content">

Every clinical TOE report must be structured according to international quality standards:

<details class="med-details"><summary>

#### <span id="table-03-03"></span>TABLE 3-3: Standardized Adult Clinical TOE Report Modules</summary><div class="details-content">

| Module | Core Content & Mandatory Data Elements |
|---|---|
| **1. Demographics & Administration** | Full patient name, identifier, age, gender, date, referring physician, specific clinical indication, operator name, patient consent confirmation. |
| **2. Sedation & Technical Execution** | Topical anesthetic agent, IV sedation medications and total doses (midazolam, fentanyl), tolerance of procedure, complications (hypotension, desaturation, bleeding, laryngospasm). |
| **3. Mitral Valve Assessment** | Native vs prosthetic; leaflet thickening, prolapse/flail with specific scallop localization (A1–A3, P1–P3), commissural involvement, perforation, vegetation size and mobility, calcification severity. Stenosis gradients and area; regurgitation mechanism (Carpentier I, II, IIIa, IIIb), vena contracta width, and PISA metrics. |
| **4. Aortic Valve & Root** | Cusp number and morphology (tricuspid, bicuspid), calcification, vegetation, abscess or pseudoaneurysm formation. Stenosis gradients ($v_{\text{max}}, \Delta P_{\text{mean}}, AVA$); regurgitation severity and jet origin. Dimensions of annulus, sinuses of Valsalva, sinotubular junction, and tubular ascending aorta. |
| **5. Left Atrium & LAA** | Cavity dilation, spontaneous echo contrast (SEC / smoke) grade ($0\text{–}4+$), presence or absence of thrombus. LAA morphology, number of lobes, and peak PW emptying velocity ($cm/s$). Interatrial septum: aneurysm, PFO with agitated saline bubble count, or ASD defect diameter. |
| **6. Right Heart & Tricuspid/Pulmonic** | RA and RV dimensions, TV leaflet anatomy, TR severity, estimated PASP, pulmonary valve morphology and PR. |
| **7. Left Ventricle & Pericardium** | Cavity size, wall thickness, regional wall motion abnormalities, global ejection fraction, presence of pericardial effusion or tamponade physiology. |
| **8. Thoracic Aorta** | Plaque thickness, mobile atheromatous debris, ulceration, presence and extent of dissection flap, true/false lumen entry tears, intramural hematoma. |
| **9. Final Diagnostic Conclusion** | Clear, concise synthesis directly answering the clinical indication. Immediate communication of critical life-threatening findings (e.g., aortic dissection, root abscess, large mobile thrombus). |

</div></details>

</div></details>

</div></details>
"""

with open(os.path.join(ch_dir, 'chapter-03.md'), 'w', encoding='utf-8') as f:
    f.write(md.strip() + '\n')

print("chapter-03.md written successfully!")
