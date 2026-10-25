# -*- coding: utf-8 -*-
"""
Builder for Chapter 12 - Block 3 (English)
2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes
Sections 6, 7, 8, and 9 (pages 37 - 51)
"""

from acs_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Section 6: NSTE-ACS: Routine Invasive or Selective Invasive Initial Approach
    parts.append(r'''<details class="med-details"><summary>

## 6. NSTE-ACS: Routine Invasive or Selective Invasive Initial Approach</summary><div class="details-content">

### 6.1 Rationale and Timing for a Routine Invasive or Selective Invasive Approach
Management of non–ST-segment elevation acute coronary syndromes (NSTE-ACS) requires risk-directed decision-making regarding diagnostic coronary angiography and subsequent revascularization:
* **Routine Invasive Strategy:** In patients with confirmed NSTE-ACS who are at intermediate or high risk of death or ischemic events, an initial routine invasive approach (diagnostic catheterization with intent to revascularize) is recommended (Class 1, Level of Evidence A) to reduce refractory angina, recurrent hospitalizations, and long-term ischemic complications.
* **Immediate Invasive Strategy ($< 2\text{ hours}$):** Urgent coronary angiography is recommended for patients presenting with:
  1. Refractory or recurrent angina despite intensive medical therapy;
  2. Hemodynamic instability or cardiogenic shock;
  3. Life-threatening ventricular arrhythmias (sustained VT or VF);
  4. Dynamic new ST-segment depression or transient ST-segment elevation;
  5. Mechanical complications or acute acute heart failure with new or worsening mitral regurgitation.
* **Early Invasive Strategy ($< 24\text{ hours}$):** An early invasive approach within 24 hours of hospital presentation is reasonable (Class 2a, Level A) in stable high-risk patients, defined by:
  - Elevated cardiac troponin temporal rise/fall;
  - GRACE risk score $> 140$;
  - Dynamic ST-segment or T-wave ischemic changes.
* **Selective Invasive (Ischemia-Guided) Strategy:** In low-risk patients (e.g., GRACE risk score $< 109$, TIMI risk score $0\text{ to }1$, normal serial troponins and ECGs), or those with severe noncardiac comorbidities where revascularization would not improve functional status or survival, noninvasive functional or anatomical testing (CCTA, stress imaging) is recommended before deciding on catheterization.
* **Class 3 (Harm):** A routine invasive strategy is **not recommended** in patients with extensive comorbidities (e.g., advanced hepatic, renal, or pulmonary failure, end-stage malignancy) where procedural morbidity and bleeding hazards clearly outweigh any potential ischemic benefit.

![Figure 7: Selection of Routine vs Selective Invasive Strategy in Patients With Confirmed NSTE-ACS](images/fig07_selection_routine_vs_selective_invasive.jpg)

![Figure 8: Selection of Timing of Invasive Strategy in Patients With Confirmed NSTE-ACS](images/fig08_selection_timing_invasive_strategy_nste_acs.jpg)

''')

    # Table 15 & RT 18
    parts.append(render_table_en('t15-relative-contraindications-routine-invasive-approach-acs.json'))
    parts.append(render_rt_en('rt18-rationale-timing-invasive-selective-approach.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 7. Catheterization Laboratory Considerations in ACS</summary><div class="details-content">

### 7.1 Vascular Access Approach for PCI
* **Radial Artery Access Preferred:** In patients with ACS undergoing percutaneous coronary intervention (PCI), **radial artery access** is recommended in preference to femoral artery access (Class 1, Level of Evidence A). Landmark trials (RIVAL, MATRIX) and large meta-analyses demonstrate that transradial intervention significantly reduces access-site bleeding, vascular complications, blood transfusion requirements, and all-cause mortality, particularly in STEMI and high-risk NSTE-ACS cohorts.
* Femoral access should be reserved for cases with anatomical radial artery failure, extreme tortuosity, severe radial spasm, or when large-bore mechanical circulatory support devices (e.g., Impella, ECMO) are concurrently required.

''')

    # RT 19
    parts.append(render_rt_en('rt19-vascular-access-approach-pci.json'))

    # 7.2 Aspiration Thrombectomy
    parts.append(r'''### 7.2 Use of Aspiration Thrombectomy
* **Routine Use Harmful / No Benefit:** Routine manual aspiration thrombectomy prior to primary PCI in STEMI is **not recommended** (Class 3: No Benefit, Level of Evidence A). Large-scale prospective randomized clinical trials (TOTAL [$n=10{,}732$] and TASTE [$n=7{,}244$]) demonstrated that routine aspiration thrombectomy did not reduce cardiovascular mortality, recurrent MI, or stent thrombosis, but was associated with a statistically significant increase in the risk of stroke or transient ischemic attack (TOTAL trial).
* **Selective / Bailout Thrombectomy:** Aspiration thrombectomy may be considered in carefully selected cases only as a bailout maneuver for massive residual intracoronary thrombus burden or refractory no-reflow following stent deployment/balloon dilation (Class 2b, Level C-LD).

''')

    # RT 20
    parts.append(render_rt_en('rt20-use-of-aspiration-thrombectomy.json'))

    # 7.3 Intracoronary Imaging
    parts.append(r'''### 7.3 Use of Intracoronary Imaging
Intravascular imaging modalities—including **optical coherence tomography (OCT)** and **intravascular ultrasound (IVUS)**—have transformed procedural precision and diagnostic clarity in ACS:
* **Procedural Guidance:** In patients with ACS undergoing coronary stent implantation, procedural guidance using IVUS or OCT is recommended (Class 2a, Level of Evidence A). Imaging guidance ensures accurate reference vessel sizing, optimal stent expansion, identification of malapposition, and detection of edge dissections, resulting in significantly lower rates of target vessel failure, stent thrombosis, and cardiac death (supported by RENOVATE-COMPLEX-PCI, OCTOBER, and ILUMIEN IV trials).
* **Diagnostic Clarification:** Intracoronary imaging is invaluable for defining underlying culprit lesion morphology—such as distinguishing plaque rupture from plaque erosion, identifying calcified nodules, or diagnosing spontaneous coronary artery dissection (SCAD) and myocardial infarction with nonobstructive coronary arteries (MINOCA).

''')

    # RT 21
    parts.append(render_rt_en('rt21-use-of-intracoronary-imaging.json'))

    # 7.4 Multivessel CAD in ACS
    parts.append(r'''### 7.4 Management of Multivessel CAD in ACS
Multivessel coronary artery disease (MVD) is present in approximately 40% to 50% of STEMI and 50% to 60% of NSTE-ACS patients:

#### 7.4.1 Multivessel CAD in STEMI
* **Hemodynamically Stable Patients:** In selected, hemodynamically stable patients with STEMI and multivessel disease, **complete revascularization** of non-infarct-related (non-culprit) arteries with PCI is recommended (Class 1, Level of Evidence A). Staged PCI of non-culprit lesions may be performed during the index hospitalization or within 45 days after discharge, as demonstrated by the COMPLETE trial ($n=4{,}041$), which showed a significant 26% reduction in cardiovascular death or new myocardial infarction ($7.8\%\text{ vs }10.5\%$, $P=0.004$).
* **Timing of Non-Culprit PCI:** Non-culprit PCI may be performed at the time of primary PCI or as a staged procedure during index hospitalization (Class 2a, Level B-R).
* **Complex Anatomy / CABG:** In patients with STEMI and complex multivessel disease (e.g., severe unprotected left main disease, high SYNTAX score) not amenable to PCI, urgent coronary artery bypass graft (CABG) surgery is indicated after Heart Team evaluation (Class 2a, Level B-NR).
* **Cardiogenic Shock (Class 3: Harm):** In patients with STEMI complicated by cardiogenic shock, routine immediate PCI of non-culprit arteries during primary PCI is **not recommended** (Class 3: Harm, Level B-R), driven by the CULPRIT-SHOCK trial which demonstrated higher 30-day mortality and renal replacement therapy with immediate multivessel PCI compared to culprit-only PCI ($54.7\%\text{ vs }45.9\%$, $P=0.01$).

''')

    # RT 22
    parts.append(render_rt_en('rt22-management-multivessel-cad-stemi.json'))

    parts.append(r'''#### 7.4.2 Multivessel CAD in NSTE-ACS
* **Heart Team Consultation:** In patients with NSTE-ACS and multivessel disease, the mode of revascularization (PCI versus CABG) should be determined by an interdisciplinary Heart Team assessing anatomical complexity (SYNTAX score), surgical risk (STS score), presence of diabetes mellitus, left ventricular ejection fraction, and patient preferences (Class 1, Level B-NR).
* **Complete Revascularization:** In stable patients with NSTE-ACS and multivessel CAD, complete revascularization is recommended (Class 1, Level B-R), supported by the FIRE trial demonstrating reduced cardiovascular death and MI in elderly ACS patients treated with complete physiology-guided revascularization.
* **Staged PCI Approach:** Non-culprit revascularization may be performed either during the index catheterization or as a staged in-hospital or outpatient procedure (Class 2a, Level B-R).
* **Cardiogenic Shock:** In NSTE-ACS complicated by cardiogenic shock, non-culprit PCI during the index procedure should not be routinely performed (Class 3: Harm, Level B-R).

''')

    # Table 16 & RT 23
    parts.append(render_table_en('t16-considerations-revascularization-nste-acs-mvd.json'))
    parts.append(render_rt_en('rt23-management-multivessel-cad-nste-acs.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 8. Cardiogenic Shock Management</summary><div class="details-content">

### 8.1 Revascularization in ACS With Cardiogenic Shock
Cardiogenic shock complicates 5% to 10% of ACS cases and remains the leading cause of in-hospital death:
* **Emergency Culprit Revascularization:** In patients with ACS complicated by cardiogenic shock or hemodynamic instability, emergency revascularization of the culprit coronary artery (via primary PCI or emergency CABG) is strongly recommended irrespective of the time delay from symptom onset (Class 1, Level of Evidence B-R). The landmark SHOCK trial demonstrated that early emergency revascularization yields significant long-term survival advantages (6-year survival 32.8% vs 19.6%).
* **Culprit-Only Strategy during Acute Phase:** In patients presenting with ACS and cardiogenic shock, routine immediate PCI of non-culprit arteries is **harmful** and **not recommended** (Class 3: Harm, Level B-R). In the CULPRIT-SHOCK trial ($n=706$), immediate multivessel PCI significantly increased 30-day all-cause mortality and renal failure requiring dialysis compared to culprit-lesion-only PCI. Non-culprit revascularization should only be performed in staged fashion once shock has resolved, or acutely if an identifiable second vessel displays critical TIMI flow 0/1 with ongoing extensive ischemia.

''')

    # RT 24
    parts.append(render_rt_en('rt24-revascularization-acs-cardiogenic-shock.json'))

    # 8.2 Mechanical Circulatory Support (MCS)
    parts.append(r'''### 8.2 Mechanical Circulatory Support (MCS) in ACS and Cardiogenic Shock
The landscape of temporary mechanical circulatory support (tMCS) has evolved with paradigm-shifting clinical trial data:
* **Microaxial Left Ventricular Flow Pump (Impella CP):** In carefully selected patients with STEMI-related cardiogenic shock (SCAI stage C, D, or E), routine implantation of a microaxial flow pump is reasonable to reduce 180-day all-cause mortality (Class 2b, Level of Evidence B-R). The landmark DanGer Shock trial ($n=355$) demonstrated that routine microaxial flow pump placement reduced 180-day mortality from 58.5% to 45.8% (hazard ratio 0.74, 95% CI 0.55–0.99; $P=0.04$). However, this survival advantage is accompanied by significantly higher risks of severe bleeding, limb ischemia, vascular injury, and renal replacement therapy, emphasizing the need for meticulous vascular access, ultrasound guidance, and institutional shock team protocols.
* **Bridge to Surgery for Mechanical Complications:** In patients with mechanical complications of ACS (acute ventricular septal rupture or severe papillary muscle rupture with acute mitral regurgitation), temporary MCS (e.g., intra-aortic balloon pump [IABP], Impella, or venoarterial ECMO) is reasonable as a hemodynamic bridge to emergency surgery (Class 2a, Level B-NR).
* **Routine IABP (Class 3: No Benefit):** In patients with acute myocardial infarction complicated by cardiogenic shock *without* mechanical complications, routine placement of an intra-aortic balloon pump (IABP) is **not recommended** (Class 3: No Benefit, Level of Evidence A). The randomized IABP-SHOCK II trial ($n=600$) established that routine IABP did not improve 30-day, 1-year, or 6-year mortality or hemodynamic parameters compared to standard medical therapy.

''')

    # RT 25
    parts.append(render_rt_en('rt25-mcs-in-acs-cardiogenic-shock.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 9. ACS Complications</summary><div class="details-content">

### 9.1 Mechanical Complications of Myocardial Infarction
Mechanical complications occur in $< 1\%$ of reperfused ACS cases but carry catastrophic mortality ($> 40\text{--}80\%$ without surgical intervention). They typically develop within the first 1 to 14 days post-MI:
* **Clinical Presentation:** Acute hemodynamic collapse, sudden pulmonary edema, new harsh holosystolic murmur (ventricular septal rupture or acute mitral regurgitation), or electromechanical dissociation / cardiac tamponade (free wall rupture).
* **Emergency Multidisciplinary Care:** Patients with mechanical complications must immediately be evaluated by an interdisciplinary Heart Team (cardiac surgery, interventional cardiology, advanced heart failure, and critical care) and transferred to a high-volume surgical center (Class 1, Level B-NR).
* **Emergency Echocardiography:** Transthoracic echocardiography (TTE) or transesophageal echocardiography (TEE) should be performed immediately to confirm diagnosis, characterize anatomical defect size, assess biventricular function, and evaluate pericardial effusion.
* **Definitive Repair:** Emergency surgical or transcatheter repair is recommended for ventricular septal rupture (VSR) and acute papillary muscle rupture / flail leaflet causing severe mitral regurgitation (Class 1, Level B-NR). Free wall rupture requires immediate emergency pericardial decompression and surgical cardiorrhaphy.
* **Preoperative Hemodynamic Support:** Initiation of temporary mechanical circulatory support (IABP, Impella, or VA-ECMO) is reasonable to achieve afterload reduction, stabilize end-organ perfusion, and bridge the patient to definitive surgery (Class 2a, Level B-NR).

![Figure 9: Mechanical Complications of Myocardial Infarction](images/fig09_mechanical_complications_mi.jpg)

''')

    # RT 26
    parts.append(render_rt_en('rt26-mechanical-complications.json'))

    # 9.2 Electrical Complications and Sudden Cardiac Death
    parts.append(r'''### 9.2 Electrical Complications and Prevention of Sudden Cardiac Death After ACS
Ventricular arrhythmias and conduction system disturbances are frequent acute complications of ACS:
* **Secondary Prevention ICD:** In patients experiencing sustained ventricular tachycardia (VT) or ventricular fibrillation (VF) occurring **$> 48\text{ hours}$** after acute MI, implantable cardioverter-defibrillator (ICD) therapy is recommended for secondary prevention (Class 1, Level of Evidence A), provided the arrhythmia is not solely attributable to acute transient, reversible myocardial ischemia or reinfarction.
* **Primary Prevention Prophylactic ICD:**
  - Prophylactic ICD implantation is indicated in patients with persistent left ventricular ejection fraction (LVEF) $\le 35\%$ and NYHA class II or III heart failure symptoms (or LVEF $\le 30\%$ with NYHA class I symptoms) measured at least **$40\text{ days}$** after MI (or at least **$90\text{ days}$** after surgical or percutaneous revascularization) while on optimal guideline-directed medical therapy (Class 1, Level of Evidence A).
  - Routine early prophylactic ICD implantation ($< 40\text{ days}$ post-MI) is **not recommended** (Class 3: No Benefit, Level B-R), as the DINAMIT and IRIS randomized trials demonstrated that while early ICDs reduced arrhythmic deaths, non-arrhythmic mortality was increased, yielding no overall survival advantage.
* **Wearable Cardioverter-Defibrillator (WCD):** In selected patients early after MI with severe LV dysfunction (LVEF $\le 35\%$) or awaiting delayed ICD reassessment, a wearable cardioverter-defibrillator may be considered as a temporary protective bridge (Class 2b, Level B-R; VEST trial).
* **Conduction Disturbances:** High-grade atrioventricular (AV) block or sinus node arrest during acute inferior MI is frequently transient and responds to atropine or temporary pacing. In contrast, new-onset bundle branch block or bifascicular block with anterior MI indicates extensive septal necrosis and warrants close hemodynamic and electrophysiological surveillance.

''')

    # Table 17 & RT 27
    parts.append(render_table_en('t17-lvef-characteristics-prophylactic-icd-indication.json'))
    parts.append(render_rt_en('rt27-electrical-complications-prevention-scd.json'))

    # 9.3 Pericarditis Management
    parts.append(r'''### 9.3 Pericarditis Management After MI
Pericarditis after myocardial infarction occurs either early (peri-infarction pericarditis, within days of extensive transmural necrosis) or late (Dressler syndrome / post-cardiac injury syndrome, weeks to months post-MI, autoimmune etiology):
* **Diagnostic Criteria:** Diagnosis requires at least 2 of 4 classic criteria: (1) positional chest pain (sharp, pleuritic, improved by sitting up and leaning forward); (2) pericardial friction rub; (3) dynamic ECG changes (widespread ST-segment elevation with PR depression); (4) new or worsening pericardial effusion on echocardiography.
* **First-Line Pharmacotherapy:** High-dose **aspirin** ($650\text{ to }1000\text{ mg}$ orally every 6 to 8 hours) combined with **colchicine** ($0.5\text{ to }0.6\text{ mg}$ once or twice daily for 3 months) is the standard recommended regimen.
* **Avoidance of NSAIDs and Glucocorticoids:** Nonsteroidal anti-inflammatory drugs (e.g., ibuprofen, indomethacin) and systemic corticosteroids should be strictly avoided in the acute peri-infarction window, as experimental and clinical data indicate they impair myocardial scar formation, increase infarct thinning, and elevate the risk of free wall myocardial rupture.

''')

    # Tables 18 & 19
    parts.append(render_table_en('t18-clinical-criteria-diagnosis-pericarditis.json'))
    parts.append(render_table_en('t19-additional-therapy-persistent-late-pericarditis.json'))

    # 9.4 LV Thrombus Management
    parts.append(r'''### 9.4 Management of Left Ventricular Thrombus After MI
Left ventricular (LV) mural thrombus develops in up to 15% of patients with large anterior STEMI and apical akinesis/dyskinesis:
* **Detection:** Echocardiography with ultrasound enhancing agents (contrast) or cardiac magnetic resonance (CMR) imaging provides high diagnostic sensitivity and specificity.
* **Anticoagulation Regimen:** Therapeutic anticoagulation with an oral **direct oral anticoagulant (DOAC)** (apixaban, rivaroxaban) or **vitamin K antagonist (warfarin)** (target INR $2.0\text{--}3.0$) is recommended for a minimum duration of **3 to 6 months**.
* **DAPT De-escalation:** Concomitant antiplatelet therapy must be minimized to reduce severe bleeding. In patients requiring DAPT after PCI who develop LV thrombus, transition to single antiplatelet therapy (aspirin or clopidogrel) combined with oral anticoagulation is strongly advised after 1 to 4 weeks.
* **Repeat Imaging:** Repeat echocardiography or CMR is recommended prior to discontinuing anticoagulation to verify complete thrombus resolution and recovery of regional apical wall motion.

''')

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/acs_block3_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 3 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
