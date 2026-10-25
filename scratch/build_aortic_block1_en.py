# -*- coding: utf-8 -*-
"""
Builder for Chapter 15 - Block 1 (English)
2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease
Executive Summary, Sections 1 to 5 (pages 1 - 35)
"""

from aortic_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Executive Summary: Top 10 Take-Home Messages
    parts.append(r'''<details class="med-details"><summary>

## Executive Summary: Top 10 Take-Home Messages</summary><div class="details-content">

1. **Multidisciplinary Aortic Teams:** Clinical outcomes for patients with complex thoracic and abdominal aortic disease are significantly enhanced at high-volume specialized aortic centers with multidisciplinary aortic teams (cardiac surgeons, vascular surgeons, interventional cardiologists/radiologists, imaging specialists, anesthesiologists, and geneticists) who determine the timing and modality of intervention.
2. **Shared Decision-Making:** Clinicians and patients should engage in collaborative shared decision-making to determine optimal medical, endovascular, and open surgical strategies, particularly regarding diameter thresholds for elective repair, athletic participation, and maternal-fetal risks before and during pregnancy.
3. **Standardized Aortic Imaging and Reporting:** Contrast-enhanced CT angiography (CTA), MR angiography (MRA), and echocardiography must adhere to rigorous acquisition protocols with orthogonal true-short-axis diameter measurements perpendicular to the blood flow centerline, systematic reporting of landing zones, and protocolized long-term post-repair surveillance.
4. **Lowered Surgical Threshold for Root and Ascending Aneurysms:** At centers with Multidisciplinary Aortic Teams and documented low operative mortality ($< 1\%$), the surgical threshold for elective repair of sporadic aortic root and ascending aortic aneurysms has been lowered from $5.5\text{ cm}$ to **$5.0\text{ cm}$** in selected low-risk patients, and even lower ($4.0\text{ to }4.5\text{ cm}$) in specific heritable thoracic aortic diseases (Loeys-Dietz, Marfan).
5. **Revised Surgical Threshold for Bicuspid Aortic Valve (BAV) Aortopathy:** In patients with BAV and ascending aortic dilation, the threshold for prophylactic surgery without high-risk features has been updated to **$5.0\text{ cm}$** at experienced multidisciplinary aortic centers ($5.5\text{ cm}$ at non-specialized centers).
6. **Routine Genetic Evaluation for Heritable Thoracic Aortic Disease (HTAD):** In patients with thoracic aortic aneurysm or dissection presenting at age $< 60$ years, or with a family history of aortic disease, genetic counseling and comprehensive multi-gene panel testing are recommended to guide tailored surgical thresholds and initiate cascade family screening.
7. **Refined Indications for TEVAR in Uncomplicated Acute Type B Dissection:** In uncomplicated acute Type B aortic dissection (TBAD), thoracic endovascular aortic repair (TEVAR) should be considered in patients with high-risk clinical or radiological features (refractory pain, recurrent hypertension, false lumen diameter $\ge 22\text{ mm}$, entry tear size $\ge 10\text{ mm}$, or aortic diameter $\ge 40\text{ mm}$) to promote false lumen thrombosis and prevent late aneurysmal degeneration.
8. **Emergency Endovascular Repair for Complicated Acute Type B AAS:** TEVAR is the first-line intervention of choice for acute complicated Type B aortic dissection (malperfusion syndrome, rupture, rapid expansion) and for acute Type B intramural hematoma (IMH) or penetrating atherosclerotic ulcer (PAU) with refractory pain or rupture.
9. **Conservative Management for Low-Grade Blunt Traumatic Injury:** Grade I (intimal tear) blunt traumatic thoracic aortic injuries (BTTAI) should be managed conservatively with serial imaging and blood pressure control; Grade II to IV injuries require prompt TEVAR.
10. **Updated Screening and Surveillance for Abdominal Aortic Aneurysm (AAA):** Ultrasound screening is recommended for men aged 65 to 75 who have ever smoked, and reasonable for first-degree relatives of patients with AAA. Elective repair is indicated at $\ge 5.5\text{ cm}$ in men or $\ge 5.0\text{ cm}$ in women, or for rapid expansion $\ge 0.5\text{ cm}$ in 6 months.

#### Table 1: Associated Guidelines and Relevant Statements
* 2020 ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease
* 2021 ACC/AHA/SCAI Guideline for Coronary Artery Revascularization
* 2018 SVS/AATS Clinical Practice Guidelines for the Care of Patients With Abdominal Aortic Aneurysms
* 2020 SVS/STS Reporting Standards for Type B Aortic Dissection
* 2021 AATS Expert Consensus Document on Surgical Treatment of Acute Type A Aortic Dissection
* 2014 ESC Guidelines on the Diagnosis and Treatment of Aortic Diseases

</div></details>

<details class="med-details"><summary>

## 1. Introduction: Methodology, Scope, and Recommendation Framework</summary><div class="details-content">

### 1.1 Methodology and Evidence Review
This clinical practice guideline provides a comprehensive, evidence-based synthesis for the diagnosis, genetic evaluation, medical management, open surgical repair, endovascular intervention, and lifelong surveillance of patients with aortic disease.

### 1.2 Class of Recommendation and Level of Evidence

#### Table 2: Applying ACC/AHA Class of Recommendation and Level of Evidence
* **Class 1 (Strong):** Benefit >>> Risk. The procedure/treatment SHOULD be performed/administered.
* **Class 2a (Moderate):** Benefit >> Risk. The procedure/treatment is REASONABLE.
* **Class 2b (Weak):** Benefit $\ge$ Risk. The procedure/treatment MAY BE CONSIDERED.
* **Class 3: No Benefit (Moderate):** Benefit = Risk. The procedure/treatment is NOT recommended (no clinical efficacy).
* **Class 3: Harm (Strong):** Risk > Benefit. The procedure/treatment causes HARM and should NOT be performed.

**Levels of Evidence (LOE):**
* **Level A:** High-quality evidence from $> 1$ randomized controlled trial (RCT) or meta-analyses.
* **Level B-R (Randomized):** Moderate-quality evidence from 1 or more RCTs.
* **Level B-NR (Nonrandomized):** Moderate-quality evidence from well-designed observational studies or registries.
* **Level C-LD (Limited Data):** Observational or registry studies with design limitations.
* **Level C-EO (Expert Opinion):** Consensus of expert opinion based on clinical practice.

### 1.3 Abbreviations
* **AAA:** Abdominal Aortic Aneurysm
* **AAS:** Acute Aortic Syndrome
* **ADD-RS:** Aortic Dissection Detection Risk Score
* **BAAI:** Blunt Abdominal Aortic Injury
* **BAV:** Bicuspid Aortic Valve
* **BTTAI:** Blunt Traumatic Thoracic Aortic Injury
* **CMR / MRA:** Cardiovascular Magnetic Resonance / Magnetic Resonance Angiography
* **COR:** Class of Recommendation
* **CTA:** Computed Tomography Angiography
* **DTAA:** Descending Thoracic Aortic Aneurysm
* **EVAR:** Endovascular Aortic Repair (Abdominal)
* **FL:** False Lumen
* **HTAD:** Heritable Thoracic Aortic Disease
* **IMH:** Intramural Hematoma
* **IVUS:** Intravascular Ultrasound
* **LDS:** Loeys-Dietz Syndrome
* **LOE:** Level of Evidence
* **MFS:** Marfan Syndrome
* **PAU:** Penetrating Atherosclerotic Ulcer
* **TAA:** Thoracic Aortic Aneurysm
* **TAAA:** Thoracoabdominal Aortic Aneurysm
* **TEVAR:** Thoracic Endovascular Aortic Repair
* **TL:** True Lumen
* **vEDS:** Vascular Ehlers-Danlos Syndrome

</div></details>

<details class="med-details"><summary>

## 2. Normal Anatomy, Landing Zones, and Definitions</summary><div class="details-content">

### 2.1 Normal Aortic Anatomy and Histology
The aorta is the primary conduit delivering oxygenated blood from the left ventricle to the systemic circulation. It is anatomically divided into five segments: aortic root (annulus, sinuses of Valsalva, sinotubular junction), ascending aorta, aortic arch, descending thoracic aorta, and abdominal aorta:

![Figure 1: Anatomy of the Aorta and Its Main Branches](images/fig01_anatomy_aorta_branches.jpg)

![Figure 2: Key Histologic Features of the Aortic Wall](images/fig02_histologic_features_aorta.jpg)

### 2.2 Aortic Landing Zones (Zones 0 Through 10)
Standardized reporting of endovascular repair utilizes an 11-zone classification (Zones 0 to 10) defined by major branch vessels:
* **Zone 0:** Ascending aorta (proximal to brachiocephalic trunk).
* **Zone 1:** Between brachiocephalic and left common carotid arteries.
* **Zone 2:** Between left common carotid and left subclavian arteries.
* **Zone 3:** Proximal descending thoracic aorta (first $2\text{ cm}$ distal to left subclavian artery).
* **Zone 4:** Mid-descending thoracic aorta.
* **Zone 5:** Distal descending thoracic aorta (above celiac axis).
* **Zone 6:** Visceral segment (celiac artery to superior mesenteric artery).
* **Zone 7:** Renal artery segment (SMA to lowest renal artery).
* **Zone 8:** Infrarenal aorta (lowest renal artery to aortic bifurcation).
* **Zone 9:** Common iliac arteries.
* **Zone 10:** External iliac arteries.

![Figure 3: Classification of Aortic Anatomic Segments by 11 Landing Zones](images/fig03_eleven_landing_zones.jpg)

### 2.3 Definitions of Aortic Dilation, Ectasia, and Aneurysm
* **Ectasia:** Mild dilation exceeding normal reference limits for age and body size but $< 50\%$ above normal diameter.
* **Aneurysm:** Permanent localized dilation of the aorta with a diameter **$\ge 50\%$ greater** than the expected normal diameter for that anatomic segment (or $> 1.5\times$ normal reference).
* In the ascending aorta, a diameter $\ge 4.0\text{ cm}$ is considered dilated in adults, and $\ge 5.0\text{ cm}$ constitutes an aneurysm requiring specialist evaluation.
* **Normalizing for Body Size:** Aortic cross-sectional area divided by patient height ($\text{cm}^2/\text{m}$) or Aortic Size Index (ASI: diameter/BSA, $\text{cm/m}^2$) improves risk stratification in patients of extreme stature. An **area-to-height ratio $> 10\text{ cm}^2/\text{m}$** indicates significantly increased rupture/dissection risk.

![Figure 4: Freedom From Ascending Aorta Events Based on Size](images/fig04_freedom_ascending_aorta_events.jpg)

![Figure 5: Relative Risk of Aortic Dissection or Rupture](images/fig05_relative_risk_aortic_events.jpg)

''')

    # Table 3
    parts.append(render_table_en('t03-classification-aortic-dissection-chronicity.json'))

    parts.append(r'''### 2.4 Definitions and Classification of Acute Aortic Syndromes (AAS)
Acute aortic syndrome describes a spectrum of life-threatening conditions involving the aortic wall:
1. **Acute Aortic Dissection (AAD):** Separation of the aortic wall media triggered by an intimal entry tear, creating a false lumen through which blood flows.
   - **Stanford Classification:**
     - **Type A:** Involves the ascending aorta (with or without extension to arch and descending aorta); requires emergency surgical repair.
     - **Type B:** Involves only the aorta distal to the left subclavian artery (Zone 3+); managed medically or with TEVAR.
     - **Non-A Non-B Dissection:** Dissection involving the aortic arch without ascending aortic involvement.
   - **DeBakey Classification:**
     - **Type I:** Arises in ascending aorta and extends downstream into arch and descending aorta.
     - **Type II:** Confined strictly to the ascending aorta.
     - **Type III:** Originates distal to left subclavian artery (IIIa: thoracic only; IIIb: extends below diaphragm).
2. **Intramural Hematoma (IMH):** Blood accumulation within the aortic media without a detectable intimal tear or flow in a false lumen on imaging.
3. **Penetrating Atherosclerotic Ulcer (PAU):** Ulceration of an atheromatous plaque that burrows through the internal elastic lamina into the aortic media, potentially precipitating IMH, pseudoaneurysm, or rupture.

![Figure 6: Acute Aortic Syndromes (Dissection, IMH, and PAU)](images/fig06_acute_aortic_syndromes.jpg)

![Figure 7: Classification of Acute Aortic Dissection (Stanford and DeBakey Systems)](images/fig07_classification_aortic_dissection.jpg)

![Figure 8: Anatomic Reporting of Acute Aortic Dissection](images/fig08_anatomic_reporting_dissection.jpg)

### 2.4.1 Mechanisms of Malperfusion in Aortic Dissection
Malperfusion syndrome occurs in up to 30% of acute dissections and is a primary determinant of in-hospital mortality:
* **Dynamic Malperfusion:** Driven by prolapse of the mobile intimal flap across a branch vessel ostium, fluctuating with blood pressure and cardiac cycle. Corrected by true lumen expansion (stenting or fenestration).
* **Static Malperfusion:** Direct propagation of the dissection flap into the branch vessel wall, thrombosis of the false lumen within the branch, or avulsion of the vessel. Requires dedicated branch vessel stenting or surgical bypass.

![Figure 9: Mechanisms of Dynamic and Static Obstruction in Malperfusion Syndrome](images/fig09_mechanisms_dynamic_static_malperfusion.jpg)

### 2.5 Classification of Thoracoabdominal Aortic Aneurysms (TAAA: Crawford Extents)
Thoracoabdominal aneurysms involve both the descending thoracic and abdominal aorta:
* **Extent I:** From distal to left subclavian artery to above the renal arteries.
* **Extent II:** From distal to left subclavian artery to below the renal arteries (highest risk of paraplegia and renal failure).
* **Extent III:** From mid-descending thoracic aorta (below 6th intercostal space) to below the renal arteries.
* **Extent IV:** Confined to the abdominal aorta from the diaphragm (involving celiac, SMA, renals) to the aortic bifurcation.
* **Extent V (Safi modification):** From mid-descending aorta to above the renal arteries (excluding visceral/renal vessels).

![Figure 10: Classification of Thoracoabdominal Aortic Aneurysms (Crawford Extents I to V)](images/fig10_classification_taaa_crawford.jpg)

### 2.6 Classification of Endoleaks After Endovascular Aortic Repair
Endoleak denotes persistent blood flow within the aneurysm sac outside the stent-graft lumen:
* **Type I:** Inadequate seal at proximal (Ia) or distal (Ib) attachment zone, or iliac occluder (Ic). Requires urgent reintervention due to high rupture risk.
* **Type II:** Retrograde filling of the aneurysm sac from collateral branch vessels (lumbar arteries, inferior mesenteric artery). Often managed conservatively unless sac expands $\ge 5\text{ mm}$.
* **Type III:** Structural graft defect, junctional separation between modular components (IIIa), or fabric tear (IIIb). Requires immediate repair.
* **Type IV:** Graft fabric porosity (typically resolves within 24–48 hours post-implant).
* **Type V (Endotension):** Aneurysm sac pressurization and expansion without visible flow on imaging.

![Figure 11: Classification of Endoleak Types After EVAR/TEVAR](images/fig11_classification_endoleaks.jpg)

</div></details>

<details class="med-details"><summary>

## 3. Imaging Modalities, Acquisition Protocols, and Conventions of Measurement</summary><div class="details-content">

### 3.1 Aortic Imaging Modalities
* **Computed Tomography Angiography (CTA):** Modality of choice for acute aortic syndromes and comprehensive operative planning. Requires non-contrast acquisition (to detect hyperattenuating IMH) followed by ECG-gated contrast-enhanced arterial phase from neck to femoral bifurcations.
* **Magnetic Resonance Angiography (MRA):** Preferred for serial surveillance in young patients and heritable aortopathies to eliminate ionizing radiation.
* **Transthoracic Echocardiography (TTE):** First-line screening for aortic root and valve assessment, LV function, and pericardial effusion.
* **Transesophageal Echocardiography (TEE):** Essential intraoperatively and in unstable patients suspected of Type A dissection.
* **Intravascular Ultrasound (IVUS):** Crucial intraprocedural adjunct during TEVAR to confirm true vs false lumen wire position, identify branch vessel takeoff, and guide stent-graft sizing without nephrotoxic contrast.

![Figure 12: Diagnostic Performance and Utilization of Aortic Imaging Techniques](images/fig12_aortic_imaging_techniques.jpg)

''')

    # Tables 4 & 5
    parts.append(render_table_en('t04-essential-elements-ct-mri-imaging-reports.json'))
    parts.append(render_table_en('t05-diagnostic-performance-aortic-imaging-modalities.json'))

    # RT 1
    parts.append(render_rt_en('rt01-aortic-imaging-techniques.json'))

    # 3.2 Conventions of Measurement
    parts.append(r'''### 3.2 Conventions of Aortic Measurement
* **Orthogonal Double-Oblique Multiplanar Reconstruction (MPR):** Aortic diameters must be measured on images reformatted strictly **perpendicular to the blood flow centerline** (true short-axis). Axial measurements on unformatted cross-sectional scans overestimate true diameter by up to 20% in tortuous or angled vessels.
* **Edge-to-Edge Conventions:**
  - **CT and MRI:** Measured using **outer-edge-to-outer-edge (OTO)** convention.
  - **Echocardiography:** Measured in end-diastole using **leading-edge-to-leading-edge (LTL)** or inner-edge-to-inner-edge (ITI) depending on validated laboratory standards.
  - Comparison between modalities must account for these systematic differences ($1\text{ to }2\text{ mm}$).

![Figure 13: Reformatted Orthogonal CT Measurement Perpendicular to Aortic Centerline](images/fig13_orthogonal_ct_measurements.jpg)

</div></details>

<details class="med-details"><summary>

## 4. Multidisciplinary Aortic Teams and Comprehensive Aortic Centers</summary><div class="details-content">

### 4.1 Concept and Clinical Impact of Multidisciplinary Aortic Teams
* Clinical outcomes for complex aortic repair (elective and emergency) demonstrate an inverse volume-outcome relationship: higher institutional and surgeon volumes correlate with significantly reduced perioperative mortality, lower stroke rates, and improved long-term survival.
* **Multidisciplinary Aortic Teams (MAT):** Comprise cardiothoracic surgeons, vascular surgeons, interventional cardiologists, cardiovascular radiologists, cardiac anesthesiologists, and cardiovascular geneticists operating within comprehensive aortic centers (Class 1, Level of Evidence B-NR).
* The availability of a dedicated MAT justifies lowering elective surgical thresholds (e.g., $5.0\text{ cm}$ for sporadic root/ascending aneurysm) when institutional mortality is demonstrated to be $< 1\%$.

![Figure 14: Observed Relationship Between Aortic Size and Dissection](images/fig14_observed_relationship_size_dissection.jpg)

![Figure 15: Predicted Risk of Mortality in Aortic Surgery Based on Volume and Comorbidity](images/fig15_predicted_risk_mortality.jpg)

![Figure 20: Algorithm for Triage and Multidisciplinary Aortic Team Care](images/fig20_multidisciplinary_aortic_team.jpg)

''')

    # RT 2
    parts.append(render_rt_en('rt02-multidisciplinary-aortic-teams.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 5. Shared Decision-Making in Aortic Disease</summary><div class="details-content">

### 5.1 Shared Decision-Making Principles
* Management decisions regarding elective aortic surgery, endovascular repair, athletic restriction, genetic testing, and pregnancy should be made through a structured shared decision-making process involving the patient, their family, and the Multidisciplinary Aortic Team (Class 1, Level of Evidence C-LD).
* Key elements include individualized risk-benefit quantification, discussion of operative vs watchful waiting risks, valve preservation feasibility, anticoagulation implications of mechanical prostheses, and quality-of-life considerations.

''')

    # RT 3
    parts.append(render_rt_en('rt03-shared-decision-making.json'))

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/aortic_block1_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 1 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
