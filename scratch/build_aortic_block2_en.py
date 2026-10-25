# -*- coding: utf-8 -*-
"""
Builder for Chapter 15 - Block 2 (English)
2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease
Section 6: Aneurysms of the Thoracic and Abdominal Aorta (pages 35 - 65)
"""

from aortic_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Section 6: Aneurysms
    parts.append(r'''<details class="med-details"><summary>

## 6. Aneurysms of the Thoracic and Abdominal Aorta</summary><div class="details-content">

An aortic aneurysm represents a permanent localized dilation $\ge 50\%$ greater than the expected normal diameter for a given anatomic segment. Etiology, natural history, rupture risk, and intervention thresholds vary substantially between thoracic and abdominal aortic segments and between sporadic and heritable disease.

### 6.1 Thoracic Aortic Aneurysm (TAA) Causes and Genetic Aortopathies

#### 6.1.1 Sporadic and Degenerative TAA
Sporadic aneurysms predominantly involve elderly patients with hypertension, atherosclerosis, and smoking history, commonly affecting the ascending or descending aorta.

#### 6.1.2 Heritable Thoracic Aortic Diseases (HTAD)
Up to 20% of patients with thoracic aortic aneurysm or dissection have a genetic basis, either as part of a recognized syndromic disorder or as non-syndromic familial thoracic aortic aneurysm and dissection (FTAAD):
* **Genetic Counseling and Multi-Gene Panel Testing (Class 1, Level of Evidence B-NR):** In patients with thoracic aortic disease presenting at age $< 60$ years, or with a family history of aortic disease, or with physical features suggestive of a connective tissue disorder, genetic counseling and testing with a comprehensive multi-gene panel (including *FBN1*, *TGFBR1*, *TGFBR2*, *SMAD3*, *TGFB2*, *TGFB3*, *ACTA2*, *MYH11*, *COL3A1*, *PRKG1*, *MYLK*, *LOX*) is recommended.
* **Cascade Clinical and Genetic Screening:** First-degree relatives of affected patients should undergo genetic testing for the identified pathogenic variant or periodic imaging surveillance if genetic testing is negative or uninformative (Class 1, Level B-NR).

![Figure 16: Recommendations for Management of Aneurysms of the Aortic Root and Ascending Aorta](images/fig16_management_aneurysms_root_ascending.jpg)

![Figure 17: Evaluation and Genetic Testing Protocol for Patients With Thoracic Aortic Disease](images/fig17_evaluation_genetic_testing_protocol.jpg)

''')

    # Tables 6, 7, 8, 9 & RT 4, RT 5
    parts.append(render_table_en('t06-cause-of-taa.json'))
    parts.append(render_table_en('t07-taa-syndromes-heritable-genetic.json'))
    parts.append(render_table_en('t08-risk-factors-familial-tad.json'))
    parts.append(render_table_en('t09-risk-features-dissection-htad.json'))
    parts.append(render_rt_en('rt04-htad-genetic-testing-screening.json'))
    parts.append(render_rt_en('rt05-surgical-nshtad-no-genetic-cause.json'))

    # Marfan syndrome
    parts.append(r'''#### 6.1.2.1 Marfan Syndrome (MFS)
* Caused by pathogenic variants in *FBN1* encoding fibrillin-1, inherited in an autosomal dominant manner with pleiotropic manifestations (ocular lens dislocation, skeletal overgrowth, dural ectasia, mitral valve prolapse).
* **Imaging Surveillance (Class 1, Level B-NR):** Baseline echocardiography followed by imaging 6 months later to establish stability, then annually if stable. MRA or CTA from head to pelvis at diagnosis to screen for extra-cardiac aneurysms.
* **Medical Therapy (Class 1, Level A):** Maximally tolerated beta-blockers or angiotensin receptor blockers (losartan, irbesartan) are recommended to reduce hemodynamic stress and slow aortic root dilation.
* **Surgical Thresholds (Class 1, Level B-NR):** Prophylactic aortic root replacement is recommended at an external diameter **$\ge 5.0\text{ cm}$**, or **$\ge 4.5\text{ cm}$** in the presence of high-risk features (family history of dissection, rapid growth $\ge 0.3\text{ cm/year}$, severe aortic regurgitation, or desire for pregnancy).
* **Valve-Sparing Root Replacement (VSRR):** Valve-sparing root reimplantation (David procedure) is preferred over composite mechanical valved conduit (Bentall) in experienced centers when aortic valve leaflets are morphologically normal or repairable (Class 1, Level B-NR).

''')

    # Table 10 & RT 6, 7, 8, 9
    parts.append(render_table_en('t10-risk-features-marfan.json'))
    parts.append(render_rt_en('rt06-marfan-imaging-surveillance.json'))
    parts.append(render_rt_en('rt07-marfan-medical-therapy.json'))
    parts.append(render_rt_en('rt08-marfan-root-replacement.json'))
    parts.append(render_rt_en('rt09-marfan-nondissected-aneurysms.json'))

    # Loeys-Dietz syndrome & Vascular Ehlers-Danlos
    parts.append(r'''#### 6.1.2.2 Loeys-Dietz Syndrome (LDS)
* Characterized by mutations in transforming growth factor-beta (TGF-$\beta$) pathway genes (*TGFBR1*, *TGFBR2*, *SMAD3*, *TGFB2*, *TGFB3*), with aggressive clinical course and dissection at smaller aortic diameters and younger ages than Marfan syndrome.
* Prophylactic root replacement thresholds are tailored to the specific pathogenic gene and risk profile, ranging from **$4.0\text{ to }4.5\text{ cm}$** for severe phenotypes (*TGFBR1/2* with extra-aortic craniofacial features) to $4.5\text{ to }5.0\text{ cm}$ for milder forms (*TGFB2/3*).

''')

    # Table 11 & RT 10, 11, 12
    parts.append(render_table_en('t11-surgical-thresholds-loeys-dietz.json'))
    parts.append(render_rt_en('rt10-loeys-dietz-imaging.json'))
    parts.append(render_rt_en('rt11-loeys-dietz-medical-therapy.json'))
    parts.append(render_rt_en('rt12-loeys-dietz-replacement-aorta.json'))

    # Non-syndromic & Turner syndrome
    parts.append(r'''#### 6.1.2.3 Non-Syndromic HTAD and Turner Syndrome
* **Non-Syndromic Genes (*ACTA2*, *MYH11*, *PRKG1*, *MYLK*):** Specific thresholds depend on gene mutation (e.g., $4.5\text{ cm}$ for *ACTA2*, $\ge 4.5\text{ cm}$ for *MYH11*, even smaller for *PRKG1* gain-of-function variants).
* **Turner Syndrome (45,X):** Increased risk of aortic root/ascending dilation, coarctation, and dissection. Aortic size must be indexed to body surface area (Aortic Size Index, ASI: diameter in $\text{cm}/\text{BSA in m}^2$) or height. An **$\text{ASI} \ge 2.5\text{ cm/m}^2$** or diameter $\ge 4.0\text{ cm}$ denotes high dissection risk warranting surgical intervention.

![Figure 18: Suggested Aortic Monitoring Protocol for Girls and Women With Turner Syndrome](images/fig18_monitoring_turner_syndrome.jpg)

''')

    # Table 13 & RT 13
    parts.append(render_table_en('t13-surgical-thresholds-nshtad.json'))
    parts.append(render_rt_en('rt13-turner-syndrome-aortic-dilation.json'))

    # 6.1.3 BAV Aortopathy
    parts.append(r'''#### 6.1.3 Bicuspid Aortic Valve (BAV) Aortopathy
Bicuspid aortic valve occurs in 1% to 2% of the population and is complicated by ascending aortic aneurysm in up to 50% of individuals due to intrinsic matrix disruption and altered hemodynamics:
* **Imaging Surveillance (Class 1, Level B-NR):** Baseline measurement of aortic root and ascending aorta by echocardiography, CTA, or MRA, with serial follow-up based on diameter.
* **Surgical Intervention Thresholds:**
  - In patients with BAV undergoing surgical aortic valve replacement (SAVR) for severe stenosis or regurgitation, replacement of the ascending aorta is recommended if diameter **$\ge 4.5\text{ cm}$** (Class 1, Level B-NR).
  - In asymptomatic patients with BAV without severe valve dysfunction, elective aortic surgery is recommended at **$\ge 5.0\text{ cm}$** when performed by a Multidisciplinary Aortic Team with low operative mortality (Class 2a, Level B-NR; otherwise $\ge 5.5\text{ cm}$).
  - In patients with BAV and high-risk features (family history of dissection, rapid expansion $\ge 0.5\text{ cm/year}$, coarctation, or uncontrolled hypertension), elective surgery is reasonable at **$\ge 5.0\text{ cm}$** (Class 2a, Level B-NR).

''')

    # Table 14 & RT 14, 15, 16
    parts.append(render_table_en('t14-risk-factors-aortic-dissection-bav.json'))
    parts.append(render_rt_en('rt14-bav-aortopathy.json'))
    parts.append(render_rt_en('rt15-bav-routine-follow-up.json'))
    parts.append(render_rt_en('rt16-bav-replacement-aorta.json'))

    # 6.2 AAA Causes, Risk Factors, Screening
    parts.append(r'''### 6.2 Abdominal Aortic Aneurysm (AAA): Causes, Risk Factors, and Screening
* Abdominal aortic aneurysm is defined as an infrarenal aortic diameter $\ge 3.0\text{ cm}$.
* **Ultrasound Screening Recommendations:**
  - One-time screening duplex ultrasound is recommended for all **men aged 65 to 75 who have ever smoked** ($\ge 100$ cigarettes in lifetime) (Class 1, Level of Evidence A).
  - Screening duplex ultrasound is reasonable for **men aged 65 to 75 who have never smoked** but have a first-degree relative with AAA (Class 2a, Level B-NR).
  - Screening is reasonable for **women aged 65 to 75 who have ever smoked** and/or have a family history of AAA (Class 2a, Level B-NR).

![Figure 19: Algorithm for Identifying Patients to Screen for Abdominal Aortic Aneurysm](images/fig19_screening_algorithm_aaa.jpg)

''')

    # Table 15 & RT 17
    parts.append(render_table_en('t15-risk-factors-aaa.json'))
    parts.append(render_rt_en('rt17-aaa-cause-risk-screening.json'))

    # 6.3 & 6.4 Medical Management and Surveillance
    parts.append(r'''### 6.3 & 6.4 Medical Therapy and Surveillance for Aortic Aneurysms
* **Blood Pressure Control:** Antihypertensive therapy targeting blood pressure **$< 130/80\text{ mm Hg}$** is recommended in all patients with thoracic or abdominal aortic aneurysms to reduce wall shear stress (Class 1, Level B-NR). Beta-blockers are preferred first-line agents in TAA.
* **Statin Therapy:** Moderate-to-high intensity statins are recommended for all patients with degenerative TAA or AAA to reduce cardiovascular events (Class 1, Level A).
* **Smoking Cessation:** Smoking is the strongest modifiable risk factor for aneurysm growth and rupture; aggressive cessation interventions are mandatory (Class 1, Level A).
* **Antiplatelet Therapy:** Low-dose aspirin ($81\text{ to }100\text{ mg/day}$) is recommended in patients with atherosclerotic aneurysm disease (Class 1, Level A).
* **Surveillance Intervals:**
  - **Thoracic Aorta:** Diameter $4.0\text{ to }4.9\text{ cm}$: annual imaging (CTA or MRA); diameter $\ge 5.0\text{ cm}$: imaging every 6 months.
  - **Abdominal Aorta:** Diameter $3.0\text{ to }3.9\text{ cm}$: ultrasound every 3 years; diameter $4.0\text{ to }4.9\text{ cm}$: ultrasound annually; diameter $5.0\text{ to }5.4\text{ cm}$: ultrasound or CTA every 6 months.

''')

    # RT 18 to 27
    parts.append(render_rt_en('rt18-bp-management-taa.json'))
    parts.append(render_rt_en('rt19-statins-taa.json'))
    parts.append(render_rt_en('rt20-smoking-cessation-taa.json'))
    parts.append(render_rt_en('rt21-antiplatelet-therapy-taa.json'))
    parts.append(render_rt_en('rt22-bp-management-aaa.json'))
    parts.append(render_rt_en('rt23-statins-aaa.json'))
    parts.append(render_rt_en('rt24-smoking-cessation-aaa.json'))
    parts.append(render_rt_en('rt25-antithrombotic-therapy-aaa.json'))
    parts.append(render_rt_en('rt26-surveillance-thoracic-aortic-dilation-aneurysm.json'))
    parts.append(render_rt_en('rt27-surveillance-aaa.json'))

    # 6.5 Surgical and Endovascular Management
    parts.append(r'''### 6.5 Surgical and Endovascular Management of Aortic Aneurysms

#### 6.5.1 Surgery for Sporadic Aneurysms of Root and Ascending Aorta
* **Elective Surgical Thresholds:**
  - In asymptomatic patients with sporadic root or ascending aneurysm, elective surgery is recommended at **$\ge 5.5\text{ cm}$** (Class 1, Level of Evidence B-NR).
  - In centers with a Multidisciplinary Aortic Team and documented low operative mortality ($< 1\%$), elective repair is reasonable at **$\ge 5.0\text{ cm}$** in selected low-risk patients (Class 2a, Level B-NR).
  - Rapid growth rate **$\ge 0.5\text{ cm/year}$** or **$\ge 0.3\text{ cm/year}$** for 2 consecutive years warrants surgery (Class 2a, Level B-NR).
  - When undergoing cardiac surgery for valve or coronary disease, concomitant ascending aortic repair is recommended at **$\ge 4.5\text{ cm}$** (Class 1, Level B-NR).

''')

    # RT 28 & RT 29
    parts.append(render_rt_en('rt28-surgery-sporadic-aortic-root-ascending.json'))
    parts.append(render_rt_en('rt29-surgical-approach-sporadic-aortic-root-ascending.json'))

    # 6.5.2 Aortic Arch Aneurysms
    parts.append(r'''#### 6.5.2 Aortic Arch Aneurysms
* Elective surgical repair of isolated arch aneurysms is reasonable at an external diameter **$\ge 5.5\text{ cm}$** (Class 2a, Level B-NR).
* Total arch replacement with hypothermic circulatory arrest, selective antegrade cerebral perfusion, and frozen elephant trunk (FET) technique provides a stable landing zone for subsequent downstream endovascular extension.

''')

    # RT 30
    parts.append(render_rt_en('rt30-aortic-arch-aneurysms.json'))

    # 6.5.3 Descending Thoracic Aorta (DTAA)
    parts.append(r'''#### 6.5.3 Descending Thoracic Aorta (DTAA)
* **TEVAR as Primary Intervention:** Thoracic endovascular aortic repair (TEVAR) is the preferred intervention over open thoracotomy in patients with suitable anatomy (adequate proximal and distal seal zones $\ge 20\text{ mm}$ and access vessel diameter) (Class 1, Level of Evidence B-NR).
* **Intervention Thresholds:**
  - TEVAR is recommended for degenerative DTAA at **$\ge 5.5\text{ cm}$** (Class 1, Level B-NR).
  - Open surgical repair is recommended at **$\ge 6.0\text{ cm}$** (or $\ge 5.5\text{ cm}$ in connective tissue disorders) when anatomy is unsuitable for TEVAR (Class 1, Level B-NR).
* **Left Subclavian Artery (LSA) Revascularization (Class 1, Level B-NR):** When TEVAR coverage of the LSA origin is required to achieve an adequate proximal landing zone (Zone 2), elective prophylactic revascularization (carotid-subclavian bypass or transposition) is recommended to prevent posterior circulation stroke, left arm ischemia, and spinal cord ischemia.

''')

    # Tables 16, 17, 18 & RT 31 to 36
    parts.append(render_table_en('t16-adverse-aortic-events-descending-taa.json'))
    parts.append(render_table_en('t17-risk-factors-aortic-rupture-descending-taa.json'))
    parts.append(render_table_en('t18-morbidity-mortality-descending-taa-repair.json'))
    parts.append(render_rt_en('rt31-size-thresholds-descending-taa.json'))
    parts.append(render_rt_en('rt32-endovascular-vs-open-descending-taa.json'))
    parts.append(render_rt_en('rt33-left-subclavian-artery-management.json'))
    parts.append(render_rt_en('rt34-ruptured-descending-taa.json'))
    parts.append(render_rt_en('rt35-celiac-artery-management.json'))
    parts.append(render_rt_en('rt36-access-issues-tevar-descending-taa.json'))

    # 6.5.4 Thoracoabdominal Aortic Aneurysms (TAAA)
    parts.append(r'''#### 6.5.4 Thoracoabdominal Aortic Aneurysms (TAAA)
* **Intervention Thresholds:** Open or complex endovascular repair (fenestrated/branched EVAR, F/B-EVAR) is recommended for TAAA at **$\ge 6.0\text{ cm}$** (or $\ge 5.5\text{ cm}$ in connective tissue disorders or rapid expansion) (Class 1, Level B-NR).
* **Spinal Cord Ischemia (SCI) Protection Bundle (Class 1, Level B-NR):**
  - Cerebrospinal fluid (CSF) drainage targeting CSF pressure $\le 10\text{ mm Hg}$.
  - Mean arterial pressure maintenance $> 80\text{--}90\text{ mm Hg}$.
  - Intraoperative motor evoked potentials (MEP) and somatosensory evoked potentials (SSEP) neuromonitoring.
  - Distal aortic perfusion during open clamp (left heart bypass or CPB).
  - Re-implantation of critical segmental intercostal arteries (T9–T12).

''')

    # Tables 19, 20 & RT 37 to 40
    parts.append(render_table_en('t19-features-increased-risk-taaa-rupture.json'))
    parts.append(render_table_en('t20-measures-optimize-spinal-cord-perfusion.json'))
    parts.append(render_rt_en('rt37-size-thresholds-open-repair-taaa.json'))
    parts.append(render_rt_en('rt38-open-vs-endovascular-repair-taaa.json'))
    parts.append(render_rt_en('rt39-taaa-spinal-cord-protection.json'))
    parts.append(render_rt_en('rt40-taaa-renal-visceral-protection.json'))

    # 6.5.5 Abdominal Aortic Aneurysms (AAA)
    parts.append(r'''#### 6.5.5 Abdominal Aortic Aneurysms (AAA)
* **Elective Repair Thresholds:**
  - In men with asymptomatic infrarenal AAA, elective repair is recommended at **$\ge 5.5\text{ cm}$** (Class 1, Level of Evidence A).
  - In women with asymptomatic AAA, elective repair is reasonable at **$\ge 5.0\text{ cm}$** due to significantly higher rupture risk at smaller diameters (Class 2a, Level B-NR).
  - Rapid expansion **$\ge 0.5\text{ cm}$ within 6 months** warrants intervention (Class 2a, Level B-NR).
* **EVAR Versus Open Surgical Repair:**
  - Both EVAR and open surgical repair are effective strategies; choice of approach should be guided by arterial anatomy, patient comorbidities, and life expectancy. EVAR confers lower 30-day perioperative morbidity and mortality, but requires lifelong surveillance (Class 1, Level A).
* **Ruptured AAA Management (Class 1, Level of Evidence B-NR):**
  - Emergency protocol activation with **permissive hypotension** (target systolic $\text{BP } 70\text{--}90\text{ mm Hg}$ or $\text{MAP } 50\text{--}70\text{ mm Hg}$) while avoiding excessive crystalloid resuscitation.
  - Immediate transfer to an operating room equipped for both endovascular and open surgical repair; EVAR is preferred over open repair if anatomically suitable.

''')

    # RT 41 to 45
    parts.append(render_rt_en('rt41-access-endovascular-repair-aaa.json'))
    parts.append(render_rt_en('rt42-repair-ruptured-aaa.json'))
    parts.append(render_rt_en('rt43-threshold-aaa-repair.json'))
    parts.append(render_rt_en('rt44-open-vs-endovascular-repair-aaa.json'))
    parts.append(render_rt_en('rt45-concomitant-common-iliac-aneurysms.json'))

    # 6.5.6 Surveillance After Aneurysm Repair
    parts.append(r'''#### 6.5.6 Surveillance After Aneurysm Repair
* **Post-EVAR Surveillance:** Contrast CTA or duplex ultrasound at **1 month and 12 months** postoperatively; if no endoleak and sac is stable/shrinking, annual duplex ultrasound is recommended (Class 1, Level B-NR).
* **Post-TEVAR Surveillance:** Baseline CTA at 1 month, 12 months, and annually thereafter (Class 1, Level B-NR).
* **Post-Open Repair Surveillance:** Imaging at 1 year, then every 5 years to detect pseudoaneurysms or adjacent segment aneurysms (Class 1, Level C-LD).

''')

    # Table 21 & RT 46, 47
    parts.append(render_table_en('t21-abnormal-findings-duplex-evar.json'))
    parts.append(render_rt_en('rt46-surveillance-after-taa-repair.json'))
    parts.append(render_rt_en('rt47-surveillance-after-aaa-repair.json'))

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/aortic_block2_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 2 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
