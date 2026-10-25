# -*- coding: utf-8 -*-
"""
Builder for Chapter 15 - Block 3 (English)
2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease
Section 7: Acute Aortic Syndromes (pages 65 - 90)
"""

from aortic_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Section 7: Acute Aortic Syndromes
    parts.append(r'''<details class="med-details"><summary>

## 7. Acute Aortic Syndromes (AAS)</summary><div class="details-content">

Acute aortic syndromes comprise life-threatening conditions involving disruptions of the aortic wall architecture: acute aortic dissection, intramural hematoma (IMH), penetrating atherosclerotic ulcer (PAU), and blunt traumatic aortic injury (BTAI).

### 7.1 Clinical Presentation and Diagnostic Triage
* **Classic Presentation:** Abrupt onset of severe, excruciating chest, back, or abdominal pain described as sharp, tearing, ripping, or stabbing. Pain migratory pattern follows the path of dissection propagation.
* **Atypical & High-Risk Features:** Syncope, pulse deficit, blood pressure differential $> 20\text{ mm Hg}$ between arms, new murmur of aortic regurgitation, focal neurological deficit (stroke, paraplegia), acute limb ischemia, or acute renal/mesenteric ischemia.
* **Risk Stratification Scores:**
  - **Aortic Dissection Detection Risk Score (ADD-RS):** Evaluates high-risk predisposing conditions (Marfan, BAV, recent aortic intervention), high-risk pain features, and high-risk examination signs. Score 0 (low risk), 1 (intermediate risk), $\ge 2$ (high risk).
  - **D-Dimer Biomarker Utility:** In low-to-intermediate pretest probability (ADD-RS $\le 1$), a negative D-dimer ($< 500\text{ ng/mL}$) has a $> 98\%$ negative predictive value for ruling out AAS. D-dimer should not be used to rule out AAS in patients with high clinical pretest probability.

''')

    # Tables 22, 23, 24, 25 & RT 48
    parts.append(render_table_en('t22-signs-symptoms-aas.json'))
    parts.append(render_table_en('t23-chest-x-ray-aortic-dissection.json'))
    parts.append(render_table_en('t24-add-rs-items.json'))
    parts.append(render_table_en('t25-aorta-simplified-score.json'))
    parts.append(render_rt_en('rt48-aas-diagnostic-evaluation.json'))

    # 7.3 Medical Management of AAS
    parts.append(r'''### 7.3 Medical Management of Acute Aortic Syndromes
* **Immediate Anti-Impulse Therapy (Class 1, Level of Evidence B-NR):**
  - **Target Heart Rate and Blood Pressure:** Initial intravenous beta-blocker therapy (esmolol, labetalol) titrated to **heart rate $< 60\text{ bpm}$**, followed by intravenous vasodilators (nicardipine, nitroprusside) if needed to achieve **systolic blood pressure between $100\text{ and }120\text{ mm Hg}$** (or the lowest tolerated pressure preserving cerebral, renal, and coronary perfusion).
  - **Critical Sequence Principle:** Vasodilators must **never** be administered before beta-blockers to prevent reflex tachycardia and increased ventricular ejection velocity ($dP/dt$), which accelerates dissection propagation.
* **Pain Relief:** Intravenous opioids (fentanyl, morphine) to alleviate pain and blunt sympathetic overdrive.
* **Long-Term Blood Pressure Target (Class 1, Level B-NR):** Maintenance blood pressure **$< 120/80\text{ mm Hg}$** using oral beta-blockers, ACE inhibitors, or ARBs.

''')

    # RT 49 & RT 50
    parts.append(render_rt_en('rt49-acute-medical-management-aas.json'))
    parts.append(render_rt_en('rt50-subsequent-medical-management-aas.json'))

    # 7.4 Surgical and Endovascular Management of Acute Aortic Dissection
    parts.append(r'''### 7.4 Surgical and Endovascular Management of Acute Aortic Dissection

#### 7.4.1 Acute Type A Aortic Dissection (ATAAD)
* **Emergency Surgical Repair (Class 1, Level of Evidence B-NR):** Emergent open surgical repair is indicated for all patients with acute Type A aortic dissection to prevent fatal pericardial tamponade, aortic rupture, coronary malperfusion, and acute severe aortic regurgitation.
* **Operative Principles:**
  - Resection of the primary intimal tear.
  - Replacement of the ascending aorta (hemiarch or total arch replacement).
  - Reconstruction of the aortic root with resuspension of the native aortic valve or root replacement (valve-sparing reimplantation or composite mechanical/biological graft).
  - **Extended Arch Repair With Frozen Elephant Trunk (FET):** Recommended in selected patients with arch entry tears, arch aneurysms, or distal malperfusion to optimize true lumen expansion.
* **Management of Malperfusion in Type A Dissection:**
  - Up to 30% of ATAAD cases present with malperfusion syndrome (coronary, cerebral, mesenteric, renal, or extremity).
  - In mesenteric malperfusion with established bowel ischemia/necrosis, primary percutaneous endovascular fenestration/stenting of visceral arteries before open cardiac repair may be considered by experienced multidisciplinary teams.

![Figure 21: Acute Aortic Dissection: Malperfusion Treatment Options and Decision Algorithm](images/fig21_malperfusion_treatment_options.jpg)

''')

    # Table 26 & RT 51, 52, 53
    parts.append(render_table_en('t26-clinical-evidence-malperfusion.json'))
    parts.append(render_rt_en('rt51-initial-surgical-considerations-type-a-dissection.json'))
    parts.append(render_rt_en('rt52-management-malperfusion.json'))
    parts.append(render_rt_en('rt53-surgical-strategies-type-a-dissection.json'))

    # 7.4.2 Acute Type B Aortic Dissection (ATBAD)
    parts.append(r'''#### 7.4.2 Acute Type B Aortic Dissection (ATBAD)
* **Complicated Acute Type B Dissection (Class 1, Level of Evidence B-NR):** Defined by the presence of rupture, impending rupture, malperfusion syndrome (visceral, renal, lower limb), refractory pain, or uncontrolled hypertension despite maximal medical therapy. **Emergent TEVAR is the first-line treatment of choice**, achieving immediate true lumen restoration and covering the primary intimal tear.
* **High-Risk Uncomplicated Type B Dissection (Class 2a, Level B-R):** In medically stable patients presenting with high-risk clinical or morphological features:
  - False lumen diameter $\ge 22\text{ mm}$
  - Primary intimal entry tear diameter $\ge 10\text{ mm}$
  - Total aortic diameter $\ge 40\text{ mm}$
  - Partial false lumen thrombosis
  - Persistent or recurrent pain
  - Refractory hypertension
  - TEVAR in the subacute phase ($15\text{ to }90$ days) is reasonable to promote false lumen thrombosis, prevent aneurysmal degeneration, and reduce late aortic-related mortality (INSTEAD-XL trial).
* **Low-Risk Uncomplicated Type B Dissection:** Managed with optimal medical therapy (aggressive anti-impulse therapy, BP control, and serial surveillance imaging).

''')

    # Tables 27, 28 & RT 54
    parts.append(render_table_en('t27-consensus-features-complicated-type-b-dissection.json'))
    parts.append(render_table_en('t28-high-risk-features-uncomplicated-type-b-dissection.json'))
    parts.append(render_rt_en('rt54-management-acute-type-b-dissection.json'))

    # 7.5 Management of Intramural Hematoma (IMH)
    parts.append(r'''### 7.5 Management of Intramural Hematoma (IMH)
* **Type A IMH (Class 1, Level of Evidence B-NR):** Emergent surgical repair is recommended due to high risk of progression to overt dissection, rupture, or pericardial tamponade (similar to Type A dissection).
* **Type B IMH:** Initial medical therapy with anti-impulse control is recommended. Endovascular repair (TEVAR) is indicated for complicated IMH characterized by refractory pain, hemodynamic instability, hematoma expansion, or the development of ulcer-like projections (ULPs) (Class 1, Level B-NR).

''')

    # Tables 29, 30 & RT 55
    parts.append(render_table_en('t29-features-complicated-imh.json'))
    parts.append(render_table_en('t30-high-risk-imaging-features-imh.json'))
    parts.append(render_rt_en('rt55-management-imh.json'))

    # 7.6 Management of Penetrating Atherosclerotic Ulcer (PAU)
    parts.append(r'''### 7.6 Management of Penetrating Atherosclerotic Ulcer (PAU)
* PAUs arise from ulceration of atheromatous plaques through the internal elastic lamina into the media:
* **Indications for Intervention (Class 1, Level of Evidence B-NR):** TEVAR is the intervention of choice for PAU associated with persistent/recurrent pain, IMH, pseudoaneurysm, rapid expansion, or rupture.
* **Isolated Asymptomatic PAU:** Elective TEVAR is reasonable for large PAUs with depth **$> 10\text{ mm}$** or ulcer neck diameter **$> 20\text{ mm}$** due to high natural history risk of progression (Class 2a, Level B-NR).

![Figure 22: Dimensions of Penetrating Atherosclerotic Ulcers (Neck Diameter and Depth)](images/fig22_dimensions_pau.jpg)

''')

    # Table 31 & RT 56, 57, 58
    parts.append(render_table_en('t31-high-risk-imaging-features-paus.json'))
    parts.append(render_rt_en('rt56-pau-imh-rupture.json'))
    parts.append(render_rt_en('rt57-isolated-pau.json'))
    parts.append(render_rt_en('rt58-pau-open-vs-endovascular-repair.json'))

    # 7.7 Blunt Traumatic Aortic Injury (BTAI)
    parts.append(r'''### 7.7 Blunt Traumatic Aortic Injury (BTAI)
* Rapid deceleration injuries in motor vehicle collisions or falls commonly injure the aortic isthmus (distal to left subclavian origin):
* **Classification and Management of BTTAI:**
  - **Grade I (Intimal Tear):** Non-operative conservative management with serial imaging and blood pressure control (Class 1, Level B-NR).
  - **Grade II (Intramural Hematoma):** Urgent TEVAR is reasonable (Class 2a, Level B-NR).
  - **Grade III (Pseudoaneurysm):** Prompt TEVAR is recommended within 24 hours after stabilizing other life-threatening injuries (Class 1, Level B-NR).
  - **Grade IV (Rupture / Free Extravasation):** Emergent TEVAR is recommended immediately (Class 1, Level B-NR).
* **TEVAR as Primary Modality (Class 1, Level of Evidence B-NR):** TEVAR is strongly preferred over open thoracotomy for blunt aortic trauma due to significantly lower operative mortality, reduced blood loss, and markedly lower paraplegia risk.

![Figure 23: Classification System for Blunt Traumatic Thoracic Aortic Injuries (Grades I to IV)](images/fig23_classification_bttai.jpg)

![Figure 24: Abdominal Aortic Zones of Injury for Surgical Approaches](images/fig24_abdominal_aortic_injury_zones.jpg)

''')

    # Tables 32, 33 & RT 59 to 63
    parts.append(render_table_en('t32-high-risk-imaging-features-bttai.json'))
    parts.append(render_table_en('t33-descriptions-blunt-aortic-injury-grades.json'))
    parts.append(render_rt_en('rt59-initial-management-bttai-emergency-department.json'))
    parts.append(render_rt_en('rt60-approach-initial-management-bttai.json'))
    parts.append(render_rt_en('rt61-bttai-tevar-vs-open-repair.json'))
    parts.append(render_rt_en('rt62-initial-management-baai.json'))
    parts.append(render_rt_en('rt63-long-term-management-surveillance-btai.json'))

    # 7.8 Long-Term Management and Surveillance Imaging
    parts.append(r'''### 7.8 Long-Term Management and Surveillance Imaging After AAS
* **Post-Dissection Surveillance Protocols (Class 1, Level of Evidence B-NR):**
  - Contrast-enhanced CTA or MRA before hospital discharge or at **1 month**, followed by imaging at **6 months**, **12 months**, and **annually thereafter**.
  - Monitoring focuses on true lumen patency, false lumen thrombosis or expansion, entry tear closure, stent-graft position, and branch vessel perfusion.
* **Strict Hemodynamic Control:** Lifelong target blood pressure $< 120/80\text{ mm Hg}$ with beta-blockers as foundational agents.

''')

    # RT 64, 65, 66
    parts.append(render_rt_en('rt64-surveillance-imaging-dissection-imh.json'))
    parts.append(render_rt_en('rt65-long-term-management-dissection-imh.json'))
    parts.append(render_rt_en('rt66-surveillance-paus.json'))

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/aortic_block3_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 3 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
