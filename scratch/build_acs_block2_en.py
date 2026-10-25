# -*- coding: utf-8 -*-
"""
Builder for Chapter 12 - Block 2 (English)
2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes
Sections 4 and 5 (pages 18 - 37)
"""

from acs_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Section 4: Standard Medical Therapies for STEMI and NSTE-ACS
    parts.append(r'''<details class="med-details"><summary>

## 4. Standard Medical Therapies for STEMI and NSTE-ACS</summary><div class="details-content">

### 4.1 Aspirin
Aspirin (acetylsalicylic acid) remains the fundamental antiplatelet foundation in ACS management. By irreversibly acetylating platelet cyclooxygenase-1 (COX-1), aspirin inhibits the synthesis of thromboxane A2 for the lifespan of the platelet:
* **Initial Loading Dose:** A non–enteric-coated chewable aspirin loading dose of **$162\text{ to }325\text{ mg}$** is recommended as soon as possible after presentation in all patients with confirmed or suspected ACS (Class 1, Level of Evidence A). If oral ingestion is not feasible, intravenous aspirin ($250\text{--}500\text{ mg}$) or rectal administration ($300\text{--}600\text{ mg}$) is reasonable.
* **Maintenance Dose:** Lifelong low-dose aspirin (**$81\text{ mg}$ once daily**) is recommended. High maintenance doses ($> 100\text{ mg/day}$) confer no additional ischemic protection but significantly increase gastrointestinal bleeding risks.

''')

    # RT 5
    parts.append(render_rt_en('rt05-aspirin.json'))

    # 4.2 Oral P2Y12 Inhibitors
    parts.append(r'''### 4.2 Oral P2Y12 Inhibitors During Hospitalization
Dual antiplatelet therapy (DAPT) combining aspirin with an oral P2Y12 receptor inhibitor is indicated across all ACS clinical pathways. The choice of P2Y12 inhibitor depends on the planned revascularization strategy, bleeding risk, and need for chronic oral anticoagulation:
* **Potent P2Y12 Inhibitors Preferred:** In patients with ACS undergoing PCI who are not at high bleeding risk and do not require chronic oral anticoagulation, potent P2Y12 inhibitors—**prasugrel** ($60\text{ mg}$ loading dose, followed by $10\text{ mg}$ once daily) or **ticagrelor** ($180\text{ mg}$ loading dose, followed by $90\text{ mg}$ twice daily)—are recommended in preference to clopidogrel (Class 1, Level B-R), driven by TRITON-TIMI 38, PLATO, and ISAR-REACT 5 trials demonstrating superior ischemic event reduction and stent thrombosis suppression.
* **Pretreatment Considerations in NSTE-ACS:** In patients with NSTE-ACS scheduled for an early invasive strategy, routine unselected pre-treatment with prasugrel before diagnostic coronary angiography is **not recommended** (Class 3: Harm), as it increases bleeding without ischemic benefit (ACCOAST trial) and complicates urgent CABG. Pre-treatment with ticagrelor or clopidogrel may be considered when an invasive strategy is delayed $> 24\text{ hours}$.
* **Clopidogrel Indications:** Clopidogrel ($300\text{--}600\text{ mg}$ load, $75\text{ mg}$ daily) is recommended in patients receiving fibrinolytic therapy, those with high bleeding risk (HBR), prior stroke/TIA (contraindication to prasugrel), or those requiring concomitant oral anticoagulation.

![Figure 4: Initial Choice of P2Y12 Inhibitor in Patients Not Requiring an Oral Anticoagulant](images/fig04_initial_choice_p2y12_inhibitor.jpg)

''')

    # Tables 7, 8 and RT 6
    parts.append(render_table_en('t07-dosing-oral-antiplatelet-therapy-acs.json'))
    parts.append(render_table_en('t08-management-p2y12-inhibitors-cabg-surgery.json'))
    parts.append(render_rt_en('rt06-oral-p2y12-inhibitors-during-hospitalization.json'))

    # 4.3 Intravenous Antiplatelet Therapies
    parts.append(r'''### 4.3 Intravenous Antiplatelet Therapies
* **Intravenous Cangrelor:** An ultra-short-acting, reversible intravenous P2Y12 inhibitor with immediate onset ($< 2\text{ min}$) and rapid offset (platelet recovery in $60\text{ min}$). Cangrelor ($30\ \mu\text{g/kg}$ bolus, followed by $4\ \mu\text{g/kg/min}$ infusion for at least 2 hours or the duration of PCI) is reasonable in P2Y12 inhibitor–naive patients undergoing PCI to reduce periprocedural ischemic events and acute stent thrombosis (CHAMPION trials). Transitioning to oral P2Y12 inhibitors must follow structured timing protocols.
* **Intravenous Glycoprotein IIb/IIIa Inhibitors (Tirofiban, Eptifibatide):** Routine upfront administration is **not recommended** (Class 3: No Benefit) due to increased major bleeding. GP IIb/IIIa inhibitors are reserved as \"bailout\" therapy during PCI for high-burden visible thrombus, slow-flow/no-reflow, or procedural thrombotic complications.

''')

    # Table 9, RT 7, RT 8
    parts.append(render_table_en('t09-transition-cangrelor-to-oral-p2y12-inhibitor.json'))
    parts.append(render_rt_en('rt07-intravenous-p2y12-inhibition.json'))
    parts.append(render_rt_en('rt08-intravenous-glycoprotein-iib-iiia-inhibitors.json'))

    # 4.4 Parenteral Anticoagulation
    parts.append(r'''### 4.4 Parenteral Anticoagulation
Parenteral anticoagulation is indicated for all ACS patients during acute management:
* **Primary PCI for STEMI:** Unfractionated heparin (UFH) ($70\text{--}100\text{ units/kg}$ IV bolus targeting ACT $250\text{--}300\text{ s}$) or Bivalirudin ($0.75\text{ mg/kg}$ bolus, $1.75\text{ mg/kg/h}$ infusion with post-PCI full-dose infusion for 2–4 hours) is recommended.
* **NSTE-ACS:** Enoxaparin ($1\text{ mg/kg}$ subcutaneously twice daily) or UFH is recommended. Enoxaparin demonstrates lower ischemic events compared to UFH in medical and invasive cohorts. Fondaparinux ($2.5\text{ mg}$ SC daily) is indicated in non-invasive management or high bleeding risk, but requires supplementary UFH during PCI to prevent catheter thrombosis.
* **Discontinuation:** Routine continuation of parenteral anticoagulation post-PCI in uncomplicated patients is **not recommended** (Class 3: No Benefit).

''')

    # Table 10 and RT 9
    parts.append(render_table_en('t10-dosing-parenteral-anticoagulation-acs.json'))
    parts.append(render_rt_en('rt09-parenteral-anticoagulation.json'))

    # 4.5 Lipid Management
    parts.append(r'''### 4.5 Lipid Management
Atherosclerotic cardiovascular plaque stabilization requires aggressive, early lipid lowering:
* **Universal High-Intensity Statin:** High-intensity statin therapy (atorvastatin $80\text{ mg}$ daily or rosuvastatin $40\text{ mg}$ daily) is recommended in all patients presenting with ACS, irrespective of baseline LDL-C levels (Class 1, Level A).
* **Early Nonstatin Intensification:** In patients whose LDL-C remains $\ge 55\text{ mg/dL}$ ($\ge 1.4\text{ mmol/L}$) or fails to decrease by $\ge 50\%$ despite maximally tolerated statin therapy, adding **ezetimibe** ($10\text{ mg}$ daily) and subsequently a **PCSK9 inhibitor** (evolocumab $140\text{ mg}$ every 2 weeks or alirocumab $75\text{--}150\text{ mg}$ every 2 weeks) during hospitalization or within 4–12 weeks postdischarge is recommended.

![Figure 5: Management of Lipid-Lowering Therapy for Patients With ACS](images/fig05_lipid_lowering_therapy_acs.jpg)

''')

    # Tables 11, 12 and RT 10
    parts.append(render_table_en('t11-nonstatin-options-ldl-c-lowering-acs.json'))
    parts.append(render_table_en('t12-statin-classification.json'))
    parts.append(render_rt_en('rt10-lipid-management.json'))

    # 4.6 and 4.7 Beta-Blockers and RAAS Inhibitors
    parts.append(r'''### 4.6 Beta-Blocker Therapy
Oral beta-blocker therapy (metoprolol succinate, carvedilol, or bisoprolol) should be initiated within the first 24 hours in patients without acute decompensated heart failure, signs of hypoperfusion, bradycardia, or high-degree AV block. 
* In patients with left ventricular systolic dysfunction (LVEF $\le 40\%$), long-term beta-blocker therapy is recommended (Class 1, Level A) to reduce mortality. 
* In patients with preserved ejection fraction (LVEF $> 50\%$) and complete revascularization, recent randomized trials (REDUCE-AMI) suggest that long-term beta-blocker therapy beyond 1 year may not confer a mortality benefit, and reassessment is appropriate.

''')

    parts.append(render_rt_en('rt11-beta-blocker-therapy.json'))

    parts.append(r'''### 4.7 Renin-Angiotensin-Aldosterone System (RAAS) Inhibitors
* **ACE Inhibitors / ARBs:** Recommended within the first 24 hours in all ACS patients with LVEF $\le 40\%$, hypertension, diabetes mellitus, or chronic kidney disease (Class 1, Level A).
* **Mineralocorticoid Receptor Antagonists (MRA):** Eplerenone ($25\text{--}50\text{ mg}$ daily) or spironolactone is recommended in patients already receiving an ACEI/ARB and beta-blocker who have LVEF $\le 40\%$ and either heart failure symptoms or diabetes mellitus, without severe renal impairment (eGFR $< 30\text{ mL/min}$) or hyperkalemia ($\text{K}^+ > 5.0\text{ mEq/L}$) (Class 1, Level A, EPHESUS trial).
* **ARNI (Sacubitril/Valsartan):** An ARNI is reasonable as replacement for an ACEI/ARB in patients with persistent HFrEF (LVEF $\le 40\%$) and chronic heart failure symptoms.

''')

    parts.append(render_rt_en('rt12-raas-inhibitors.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 5. STEMI Management: Reperfusion Strategies</summary><div class="details-content">

### 5.1 Reperfusion Systems of Care and Triage
Timely restoration of epicardial coronary blood flow and myocardial tissue perfusion is the primary determinant of survival in STEMI. Regional systems of care must coordinate EMS dispatch, hospital triage, and interfacility transport to ensure rapid reperfusion:

![Figure 6: Care System Pathway for Patients Experiencing Ischemic Symptoms Suggestive of ACS](images/fig06_care_system_pathway_ischemic_symptoms.jpg)

''')

    # RT 13
    parts.append(render_rt_en('rt13-regional-systems-stemi-care.json'))

    # 5.2 Primary PCI and Urgent CABG
    parts.append(r'''### 5.2 Primary Percutaneous Coronary Intervention (PPCI) and Urgent CABG
* **Primary PCI (PPCI):** PPCI is the preferred reperfusion strategy for patients presenting with STEMI within 12 hours of symptom onset, provided it can be performed within 120 minutes of STEMI diagnosis (or FMC-to-device time $\le 90\text{ minutes}$ at PCI centers, $\le 120\text{ minutes}$ for transfer patients) (Class 1, Level A).
* **Urgent CABG Surgery:** Indicated in STEMI patients with coronary anatomy not amenable to PCI, failed PCI with ongoing ischemia, or mechanical complications (VSR, papillary muscle rupture) in the absence of refractory cardiogenic arrest.

''')

    # RT 14, RT 15
    parts.append(render_rt_en('rt14-ppci-in-stemi.json'))
    parts.append(render_rt_en('rt15-urgent-cabg-surgery.json'))

    # 5.3 Fibrinolytic Therapy & Pharmacoinvasive Strategy
    parts.append(r'''### 5.3 Fibrinolytic Therapy and Pharmacoinvasive Strategy
When PPCI cannot be performed within 120 minutes of STEMI diagnosis, **intravenous fibrinolytic therapy** is recommended within **30 minutes of hospital arrival** (door-to-needle time $\le 30\text{ minutes}$) in patients without contraindications presenting within 12 hours of symptom onset (Class 1, Level A).
* **Fibrin-Specific Agents:** Weight-adjusted tenecteplase (TNK-tPA) bolus is preferred due to convenience and lower non-cerebral bleeding rates.
* **Pharmacoinvasive Transfer:** Following fibrinolytic administration, immediate transfer to a PCI-capable center is recommended for all patients. Routine coronary angiography is recommended between **2 and 24 hours** after successful fibrinolysis (STREAM trial), or immediately in cases of failed reperfusion ($< 50\%$ ST-resolution at 60–90 min) as rescue PCI.

''')

    # Tables 13, 14 and RT 16, 17
    parts.append(render_table_en('t13-fibrin-specific-fibrinolytic-agents-stemi.json'))
    parts.append(render_table_en('t14-absolute-relative-contraindications-fibrinolytic-stemi.json'))
    parts.append(render_rt_en('rt16-reperfusion-non-pci-capable-hospitals.json'))
    parts.append(render_rt_en('rt17-coronary-angiography-pci-after-fibrinolytic-therapy.json'))

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/acs_block2_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 2 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
