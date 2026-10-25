# -*- coding: utf-8 -*-
"""
Builder for Chapter 15 - Block 4 (English)
2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease
Sections 8 to 12 (pages 90 - 111)
"""

from aortic_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Section 8: Pregnancy in Patients With Aortopathy
    parts.append(r'''<details class="med-details"><summary>

## 8. Pregnancy in Patients With Aortopathy</summary><div class="details-content">

Pregnancy carries significant hemodynamic and hormonal stress that markedly increases the risk of aortic dissection or rapid aneurysm enlargement in women with aortopathies. Peak vulnerability occurs during the third trimester and early postpartum period:

### 8.1 Pre-Pregnancy Counseling, Genetic Evaluation, and Medical Management
* **Multidisciplinary Pregnancy Heart Team (Class 1, Level of Evidence C-EO):** Care should be coordinated by a specialized team including maternal-fetal medicine obstetricians, cardiologists, cardiac/vascular surgeons, and anesthesiologists.
* **Preconceptional Imaging and Counseling:** Complete imaging of the thoracic and abdominal aorta by echocardiography and MRA (or CTA) is recommended prior to conception.
* **Teratogenic Medication Discontinuation:** Renin-angiotensin system inhibitors (ACE inhibitors, ARBs, ARNI) are strictly contraindicated and must be discontinued before conception.
* **Beta-Blocker Continuation (Class 1, Level B-NR):** Beta-blockers (metoprolol, labetalol) should be continued throughout pregnancy and the postpartum period in women with Marfan, Loeys-Dietz, or other thoracic aortopathies to mitigate dissection risk.

''')

    # RT 67
    parts.append(render_rt_en('rt67-counseling-management-pregnancy.json'))

    # 8.2 Delivery Mode
    parts.append(r'''### 8.2 Mode and Management of Delivery
* **Vaginal Delivery:** Permissible with regional/epidural anesthesia and assisted second stage in women with stable minor aortic dilation ($< 4.0\text{ cm}$ in Marfan, $< 4.5\text{ cm}$ in BAV).
* **Cesarean Delivery (Class 1, Level of Evidence C-LD):** Recommended in women with high-risk features:
  - Aortic root or ascending diameter **$\ge 4.0\text{ to }4.5\text{ cm}$** in Marfan syndrome
  - Aortic diameter **$\ge 4.0\text{ cm}$** or any dilation in Loeys-Dietz syndrome
  - Vascular Ehlers-Danlos syndrome (*COL3A1*)
  - Aortic diameter **$\ge 4.5\text{ cm}$** in bicuspid aortic valve or non-syndromic HTAD
  - History of chronic aortic dissection

''')

    # RT 68
    parts.append(render_rt_en('rt68-delivery-pregnancy-aortopathy.json'))

    # 8.3 Prophylactic Surgery Before Pregnancy
    parts.append(r'''### 8.3 Prophylactic Aortic Surgery Before Pregnancy
* Prophylactic aortic root/ascending repair is recommended before pregnancy in women with:
  - Marfan syndrome and diameter **$\ge 4.5\text{ cm}$** (or $\ge 4.0\text{ cm}$ with risk factors) (Class 1, Level B-NR).
  - Loeys-Dietz syndrome with diameter **$\ge 4.0\text{ to }4.5\text{ cm}$** (Class 1, Level B-NR).
  - BAV or sporadic TAA with diameter **$\ge 5.0\text{ cm}$** (Class 1, Level B-NR).

''')

    # Table 34 & RT 69
    parts.append(render_table_en('t34-prophylactic-surgery-before-pregnancy.json'))
    parts.append(render_rt_en('rt69-surgery-before-pregnancy.json'))

    # 8.4 Acute Dissection and Surgery During Pregnancy
    parts.append(r'''### 8.4 Acute Aortic Dissection and Surgery During Pregnancy
* **Acute Type A Dissection:** Emergent surgical repair is mandatory regardless of gestational age.
  - At gestational age **$< 28$ weeks:** Urgent maternal aortic repair with fetal monitoring and maintenance of normothermic, high-flow CPB without delivery.
  - At gestational age **$\ge 28$ weeks:** Primary emergency cesarean delivery followed immediately by maternal aortic repair during the same operative session.

''')

    # RT 70
    parts.append(render_rt_en('rt70-dissection-surgery-in-pregnancy.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 9. Other Aortic Conditions</summary><div class="details-content">

### 9.1 Inflammatory Aortitis (Takayasu Arteritis and Giant Cell Arteritis)
Large-vessel vasculitides cause transmural granulomatous inflammation leading to stenosis, occlusion, aneurysm formation, and dissection:
* **Takayasu Arteritis:** Predominantly affects young women ($< 40$ years), frequently involving the subclavian, carotid, and renal arteries and descending aorta.
* **Giant Cell Arteritis (GCA):** Affects individuals $> 50$ years, involving the cranial branches, thoracic aorta, and arch vessels.
* **Medical Therapy (Class 1, Level of Evidence A):** High-dose systemic glucocorticoids (prednisone $1\text{ mg/kg/day}$) are the cornerstone of induction therapy, combined with steroid-sparing agents (tocilizumab, methotrexate) for maintenance.
* **Revascularization Principles (Class 1, Level B-NR):** Elective surgical or endovascular revascularization should be delayed until complete clinical and serologic remission of vascular inflammation is achieved to prevent restenosis, anastomotic dehiscence, and graft failure.

![Figure 25: EULAR Recommendations for Imaging and Management in Takayasu Arteritis](images/fig25_eular_takayasu_arteritis.jpg)

![Figure 26: EULAR Recommendations for Imaging and Management in Giant Cell Arteritis](images/fig26_eular_giant_cell_arteritis.jpg)

''')

    # Table 35 & RT 71
    parts.append(render_table_en('t35-diagnostic-criteria-inflammatory-aortitis.json'))
    parts.append(render_rt_en('rt71-inflammatory-aortitis-takayasu-gca.json'))

    # 9.2 Infectious Aortitis
    parts.append(r'''### 9.2 Infectious Aortitis
* **Native Aorta Infection (Mycotic Aneurysm):** Arises from hematogenous bacteremic seeding of atheromatous plaque or septic embolization (*Staphylococcus aureus*, *Salmonella*, *Streptococcus* species). Rapid aneurysm expansion and rupture risk require prompt radical surgical debridement and reconstruction with cryopreserved arterial allograft, autologous superficial femoral vein graft, or rifampin-soaked polyester graft with prolonged targeted IV antibiotic therapy.
* **Prosthetic Aortic Graft Infection (PAGI):** Life-threatening complication diagnosed by contrast CTA and functional molecular imaging ($^{18}\text{F}$-FDG PET-CT or tagged white blood cell SPECT-CT). Complete graft excision with in situ or extra-anatomic reconstruction is preferred; endovascular stent-grafting is strictly reserved as an emergency bridge in unstable, exsanguinating patients.

''')

    # Table 36 & RT 72, 73
    parts.append(render_table_en('t36-management-aortic-mycotic-aneurysm.json'))
    parts.append(render_rt_en('rt72-infection-native-aorta.json'))
    parts.append(render_rt_en('rt73-prosthetic-aortic-graft-infection.json'))

    # 9.3 Atherosclerotic Disease
    parts.append(r'''### 9.3 Atherosclerotic Disease: Aortic Thrombus, Occlusion, and Porcelain Aorta
* **Mobile / Protruding Aortic Thrombus:** Source of systemic and peripheral atheroembolism; managed with systemic anticoagulation, antiplatelet therapy, and statins, with surgical or endovascular thrombectomy for recurrent emboli.
* **Porcelain Aorta:** Circumferential heavy transmural calcification of the ascending aorta precluding safe cross-clamping or cannulation during cardiac surgery. Requires hypothermic circulatory arrest, "no-touch" techniques, or alternative cannulation sites (femoral, axillary).

''')

    # RT 74
    parts.append(render_rt_en('rt74-atherosclerotic-disease.json'))

    # 9.4 Coarctation of Aorta and Arch Abnormalities
    parts.append(r'''### 9.4 Coarctation of the Aorta (CoA) and Arch Abnormalities

#### 9.4.1 Coarctation of the Aorta (CoA)
* **Intervention Indications (Class 1, Level of Evidence B-NR):** Significant native or recurrent coarctation with peak-to-peak trans-coarctation pressure gradient **$\ge 20\text{ mm Hg}$** (or $< 20\text{ mm Hg}$ with extensive collateralization or severe LV hypertrophy/hypertension).
* **Catheter Intervention:** Transcatheter stent placement (covered or bare-metal stents) is preferred over open surgery in adolescents and adult patients (Class 1, Level B-NR).

''')

    # Table 37 & RT 75
    parts.append(render_table_en('t37-criteria-significant-coa.json'))
    parts.append(render_rt_en('rt75-coa.json'))

    # 9.4.2 Congenital Arch Branch Abnormalities
    parts.append(r'''#### 9.4.2 Congenital Arch Branch Abnormalities
* **Aberrant Right Subclavian Artery (ARSA / Arteria Lusoria) and Kommerell Diverticulum:** ARSA originates as the last branch of a left-sided arch, crossing behind the esophagus and potentially causing dysphagia lusoria. Kommerell diverticulum represents dilation of the originating aortic wall:
  - Surgical repair is indicated for symptomatic compression or diverticulum base diameter **$\ge 30\text{ mm}$** or orifice-to-diverticulum-wall depth **$\ge 50\text{ mm}$** (Class 1, Level B-NR).
* **Aberrant Left Vertebral Artery:** Direct arch origin occurring in 5% of individuals; must be preserved or revascularized during Zone 2 TEVAR to prevent cerebellar/brainstem infarction.
* **Bovine Aortic Arch:** Common innominate and left common carotid artery origin (common trunk) present in up to 20% of the general population; technical implications for endovascular branch navigation and cannulation.

![Figure 27: Measurements and Anatomy of Kommerell Diverticulum](images/fig27_measurements_kommerell_diverticulum.jpg)

![Figure 28: Normal Versus Bovine Aortic Arch Configurations](images/fig28_normal_bovine_aortic_arch.jpg)

''')

    # RT 76, 77, 78
    parts.append(render_rt_en('rt76-aberrant-subclavian-artery-kommerell.json'))
    parts.append(render_rt_en('rt77-aberrant-left-vertebral-artery.json'))
    parts.append(render_rt_en('rt78-bovine-arch.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 10. Physical Activity and Quality of Life</summary><div class="details-content">

### 10.1 Exercise Prescription and Lifestyle Recommendations
* **Isometric Straining Avoidance:** Heavy competitive weightlifting, intense isometric resistance exercises, and activities requiring prolonged Valsalva maneuvers (which elevate systolic BP acutely to $> 300\text{ mm Hg}$) are discouraged in patients with aortic aneurysms or prior dissection.
* **Aerobic Exercise Encouraged (Class 1, Level of Evidence B-NR):** Moderate-intensity dynamic aerobic physical activity ($30\text{ to }60\text{ minutes}$, $\ge 3\text{ to }5\text{ days/week}$) is recommended to promote cardiovascular fitness, blood pressure control, and overall well-being.
* **Cardiac Rehabilitation (Class 2a, Level B-NR):** Supervised exercise-based cardiac rehabilitation is reasonable after acute aortic dissection or aortic surgery to facilitate safe functional recovery and psychological reintegration.

''')

    # RT 79
    parts.append(render_rt_en('rt79-physical-activity-quality-of-life.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 11. Cost and Value Considerations in Aortic Disease</summary><div class="details-content">

* Ultrasound screening for AAA in 65-year-old men with a smoking history is highly cost-effective, with an incremental cost-effectiveness ratio (ICER) well below accepted societal willingness-to-pay thresholds ($< \$50,000\text{ per QALY}$ gained).
* Centralization of elective complex aortic surgical and endovascular care in high-volume Multidisciplinary Aortic Centers reduces perioperative failure-to-rescue rates, reoperation costs, and overall health resource consumption.
* Routine multi-gene panel testing in young patients ($< 60$ years) with thoracic aortic disease demonstrates favorable long-term cost-effectiveness by identifying at-risk relatives early through cascade screening, preventing catastrophic unheralded dissections and emergency repairs.

</div></details>

<details class="med-details"><summary>

## 12. Evidence Gaps and Future Directions</summary><div class="details-content">

Key priorities for future research in aortic medicine and surgery include:
1. **Biomarker Discovery:** Identification of specific circulating RNA, extracellular matrix degradation products, or proteomic signatures that predict rapid aneurysm expansion or impending rupture before structural failure occurs.
2. **Genomic Architecture:** Unraveling novel genetic variants and polygenic risk scores contributing to non-syndromic familial thoracic and abdominal aortic aneurysms.
3. **Advanced Aortic Biomechanics & CFD:** Transitioning beyond simple maximal diameter to four-dimensional flow MRI and computational fluid dynamics (CFD) modeling of wall shear stress, wall thickness, and cyclic strain to personalize intervention thresholds.
4. **Sex and Racial Disparities:** Investigating biological and structural reasons why women with aortic dissection present later, have smaller absolute diameters at rupture, and suffer higher perioperative mortality than men.
5. **Next-Generation Endovascular Technology:** Development of off-the-shelf branched and fenestrated endografts for the aortic arch and thoracoabdominal aorta with lower spinal cord ischemia and stroke risks.
6. **Cardioprotective and Anti-Degenerative Pharmacotherapies:** Conducting dedicated clinical trials investigating novel molecular targets (e.g., matrix metalloproteinase inhibition, TGF-$\beta$ modulators, SGLT2 inhibitors) to halt or reverse aortic wall degeneration.

</div></details>
''')

    full_text = '\n\n'.join(parts)
    with open('scratch/aortic_block4_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 4 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
