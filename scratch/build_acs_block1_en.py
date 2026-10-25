# -*- coding: utf-8 -*-
"""
Builder for Chapter 12 - Block 1 (English)
2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes
Sections 1 - 3 (pages 1 - 18)
"""

from acs_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Title & Header
    parts.append('''# 2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes

##### A Report of the American College of Cardiology/American Heart Association Joint Committee on Clinical Practice Guidelines. Developed in Collaboration With and Endorsed by the American College of Emergency Physicians (ACEP), National Association of EMS Physicians (NAEMSP), and Society for Cardiovascular Angiography and Interventions (SCAI).

##### Writing Committee Members: Sunil V. Rao (Chair), Michelle L. O'Donoghue (Co-Chair), Marc Ruel (Vice Chair), Tift Mann, Jacqueline E. Tamis-Holland, John H. Alexander, Usman Baber, Heather Baker, Michael G. Cohen, Manuel Cruz-Ruiz, Leslie L. Davis, James A. de Lemos, Travis A. DeWald, Islam Y. Elgendy, Dmitry N. Feldman, Abhinav Goyal, Ijeoma Isiadinso, Venu Menon, David A. Morrow, Debabrata Mukherjee, Erin Platz, Susan B. Promes, Sigrid Sandner, Yader Sandoval, Rebecca Schunder, Binita Shah, Jason P. Stopyra, Amy W. Talbot, Pam R. Taub, and Mary S. Williams.

<details class="med-details"><summary>

## Executive Summary</summary><div class="details-content">

### Paradigm Shifts and Top 10 Take-Home Messages of the 2025 Guidelines
The 2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes provides a contemporary, comprehensive, and evidence-based synthesis of diagnostic and therapeutic strategies for patients presenting across the entire spectrum of acute coronary syndromes (STEMI, NSTEMI, and unstable angina):

1. **Streamlined Systems of Care & Prehospital Triage:** A 12-lead ECG must be acquired and interpreted within 10 minutes of first medical contact (FMC). In suspected STEMI, immediate emergency medical services (EMS) routing directly to a PCI-capable center with advance hospital notification is recommended to achieve an FMC-to-first-device activation time $\le 90\text{ minutes}$.
2. **Potent P2Y12 Inhibitors Preferred:** Dual antiplatelet therapy (DAPT) with aspirin and an oral P2Y12 inhibitor is recommended for all ACS patients. In patients undergoing PCI who do not require chronic oral anticoagulation and are not at high bleeding risk, potent P2Y12 inhibitors (**prasugrel** $60\text{ mg}$ load / $10\text{ mg}$ daily or **ticagrelor** $180\text{ mg}$ load / $90\text{ mg}$ twice daily) are recommended in preference to clopidogrel.
3. **Universal High-Intensity Statin & Early Non-Statin Intensification:** High-intensity statin therapy (atorvastatin $80\text{ mg}$ or rosuvastatin $40\text{ mg}$) is recommended in all ACS patients regardless of baseline LDL-C. In patients who do not achieve an LDL-C target $< 55\text{ mg/dL}$ ($< 1.4\text{ mmol/L}$) or $\ge 50\%$ reduction from baseline, early initiation of nonstatin therapies (**ezetimibe** and **PCSK9 inhibitors**) during hospitalization or within 4–12 weeks postdischarge is recommended.
4. **Radial-First Revascularization:** Radial artery access is a definitive Class 1 recommendation for all diagnostic coronary angiography and PCI procedures in both STEMI and NSTE-ACS to minimize access-site bleeding, vascular complications, and all-cause mortality.
5. **Complete Revascularization in Multivessel Disease:** In hemodynamically stable patients with STEMI or NSTE-ACS and multivessel coronary artery disease, complete revascularization (staged or index-procedure treatment of nonculprit angiographically significant lesions) is recommended over culprit-only revascularization to reduce cardiovascular death and recurrent myocardial infarction (supported by COMPLETE and FIRE trials).
6. **Risk-Tailored Invasive Strategy in NSTE-ACS:** Routine invasive coronary angiography within 24 hours of admission is recommended for intermediate-to-high risk NSTE-ACS. Immediate coronary angiography ($< 2\text{ hours}$) is indicated for very high-risk criteria: hemodynamic instability, cardiogenic shock, recurrent refractory chest pain, sustained ventricular arrhythmias, or mechanical complications.
7. **Cardiogenic Shock & Mechanical Circulatory Support:** Revascularization in ACS-associated cardiogenic shock should be restricted to the **culprit lesion only** during the acute phase (CULPRIT-SHOCK trial). In selected STEMI patients presenting with cardiogenic shock, routine use of a **microaxial flow pump (Impella)** is recommended based on the randomized **DanGer Shock trial** demonstrating a significant reduction in 180-day all-cause mortality (with careful vigilance for major bleeding and limb ischemia). Routine use of intra-aortic balloon counterpulsation (IABP) is not recommended.
8. **Individualized DAPT De-escalation & Shortened DAPT:** While standard DAPT remains 12 months, personalized strategies are endorsed:
   * In patients with **High Bleeding Risk (HBR)** (ARC-HBR criteria), DAPT should be shortened to **1 to 3 months**, followed by single antiplatelet therapy (P2Y12 inhibitor or aspirin monotherapy).
   * In non-HBR patients, early de-escalation from prasugrel/ticagrelor to clopidogrel or transitioning to **P2Y12 inhibitor monotherapy (ticagrelor)** after 1–3 months reduces major bleeding while maintaining ischemic protection.
9. **Double Therapy in Anticoagulated Patients (AF + PCI):** In ACS patients requiring long-term oral anticoagulation (OAC) undergoing PCI, triple therapy (DOAC + Aspirin + Clopidogrel) is strictly minimized to the peri-PCI in-hospital period (up to 1–4 weeks), followed immediately by **double antithrombotic therapy (DOAC + Clopidogrel $75\text{ mg}$ once daily)** for up to 12 months, then lifelong DOAC monotherapy. Prasugrel and ticagrelor are contraindicated as part of triple therapy.
10. **Comprehensive Secondary Prevention Pharmacotherapy:** Routine prescription of evidence-based beta-blockers (for LVEF $\le 40\%$), RAAS inhibitors, SGLT2 inhibitors and GLP-1 receptor agonists in diabetic/HF patients, low-dose **colchicine** ($0.5\text{ mg/day}$) for residual inflammatory risk reduction, automatic referral to structured **cardiac rehabilitation**, and annual immunization (influenza, pneumococcal, COVID-19).

</div></details>

<details class="med-details"><summary>

## Abbreviations and Acronyms</summary><div class="details-content">

| Abbreviation | Meaning |
|---|---|
| **ACC** | American College of Cardiology |
| **ACE** | Angiotensin-converting enzyme |
| **ACEI** | Angiotensin-converting enzyme inhibitor |
| **ACEP** | American College of Emergency Physicians |
| **ACS** | Acute coronary syndromes |
| **AF** | Atrial fibrillation |
| **AHA** | American Heart Association |
| **AMI** | Acute myocardial infarction |
| **ARB** | Angiotensin receptor blocker |
| **ARC-HBR** | Academic Research Consortium for High Bleeding Risk |
| **ARNI** | Angiotensin receptor-neprilysin inhibitor |
| **b.p.m.** | Beats per minute |
| **CABG** | Coronary artery bypass graft |
| **CAD** | Coronary artery disease |
| **CCS** | Chronic coronary syndromes |
| **CIED** | Cardiac implantable electronic device |
| **CICU** | Cardiac intensive care unit |
| **CKD** | Chronic kidney disease |
| **CMR** | Cardiac magnetic resonance |
| **CPAP** | Continuous positive airway pressure |
| **CR** | Cardiac rehabilitation |
| **cTn / hs-cTn** | Cardiac troponin / high-sensitivity cardiac troponin |
| **DAPT** | Dual antiplatelet therapy |
| **DOAC** | Direct oral anticoagulant |
| **ECG** | Electrocardiogram |
| **ECMO / VA-ECMO** | Extracorporeal membrane oxygenation / Venoarterial ECMO |
| **ED** | Emergency department |
| **eGFR** | Estimated glomerular filtration rate |
| **EMS** | Emergency medical services |
| **FMC** | First medical contact |
| **GLP-1 RA** | Glucagon-like peptide-1 receptor agonist |
| **GP IIb/IIIa** | Glycoprotein IIb/IIIa |
| **GRACE** | Global Registry of Acute Coronary Events |
| **HBR** | High bleeding risk |
| **HF / HFrEF / HFpEF** | Heart failure / with reduced ejection fraction / with preserved ejection fraction |
| **IABP** | Intra-aortic balloon pump |
| **ICD** | Implantable cardioverter-defibrillator |
| **IV** | Intravenous |
| **IVUS** | Intravascular ultrasound |
| **LBBB** | Left bundle branch block |
| **LDL-C** | Low-density lipoprotein cholesterol |
| **LMWH** | Low-molecular-weight heparin |
| **LVEF** | Left ventricular ejection fraction |
| **MACE** | Major adverse cardiovascular events |
| **MCS** | Mechanical circulatory support |
| **MI** | Myocardial infarction |
| **MINOCA** | Myocardial infarction with nonobstructive coronary arteries |
| **MRA** | Mineralocorticoid receptor antagonist |
| **MVD** | Multivessel coronary artery disease |
| **NAEMSP** | National Association of EMS Physicians |
| **NSTE-ACS** | Non–ST-segment elevation acute coronary syndromes |
| **NSTEMI** | Non–ST-segment elevation myocardial infarction |
| **OAC** | Oral anticoagulation |
| **OCT** | Optical coherence tomography |
| **PCI / PPCI** | Percutaneous coronary intervention / Primary PCI |
| **PCSK9** | Proprotein convertase subtilisin/kexin type 9 |
| **RAAS** | Renin-angiotensin-aldosterone system |
| **SAPT** | Single antiplatelet therapy |
| **SCAI** | Society for Cardiovascular Angiography and Interventions |
| **SCAD** | Spontaneous coronary artery dissection |
| **SCD** | Sudden cardiac death |
| **SGLT2 / SGLT2i** | Sodium-glucose cotransporter-2 / inhibitor |
| **STEMI** | ST-segment elevation myocardial infarction |
| **TIMI** | Thrombolysis in Myocardial Infarction |
| **TTE** | Transthoracic echocardiography |
| **UFH** | Unfractionated heparin |
| **ULN** | Upper limit of normal |
| **VKA** | Vitamin K antagonist |
| **VSR** | Ventricular septal rupture |

</div></details>

<details class="med-details"><summary>

### Table 1 & 2. Associated Publications and Applying Class of Recommendation and Level of Evidence</summary><div class="details-content">

#### Table 1: Associated Publications
| Title of Related Guideline or Consensus Document | Year | Sponsoring Organizations |
|---|---|---|
| Guideline for Coronary Artery Revascularization | 2021 | ACC/AHA/SCAI |
| Guideline for the Evaluation and Diagnosis of Chest Pain | 2021 | ACC/AHA/ASE/CHEST/SAEM/SCCT/SCMR |
| Guideline for the Management of Heart Failure | 2022 | AHA/ACC/HFSA |
| Guideline for the Diagnosis and Management of Aortic Disease | 2022 | ACC/AHA |
| Guideline for the Management of Patients With Chronic Coronary Disease | 2023 | AHA/ACC/ACCP/ASPC/NLA/PCNA |
| Fourth Universal Definition of Myocardial Infarction | 2018 | ESC/ACC/AHA/WHF |

#### Table 2: Applying ACC/AHA Class of Recommendation and Level of Evidence
| Class of Recommendation (COR) | Suggested Clinical Phrase | Definition |
|---|---|---|
| **Class 1 (Strong)** | Is recommended / is indicated | Benefit >>> Risk; should be performed / administered in all eligible patients. |
| **Class 2a (Moderate)** | Is reasonable / should be considered | Benefit >> Risk; weight of evidence in favor; reasonable to perform. |
| **Class 2b (Weak)** | May be considered / might be reasonable | Benefit $\ge$ Risk; usefulness/efficacy is less well established. |
| **Class 3: No Benefit** | Is not recommended | Benefit = Risk; procedure/test does not provide clinical benefit. |
| **Class 3: Harm** | Potentially harmful / should not be performed | Risk > Benefit; causes harm, complications, or excess mortality. |

| Level of Evidence (LOE) | Definition and Evidence Base |
|---|---|
| **Level A** | High-quality evidence from more than 1 randomized controlled trial (RCT), meta-analyses of high-quality RCTs, or 1 or more RCTs corroborated by high-quality registry studies. |
| **Level B-R (Randomized)** | Moderate-quality evidence from 1 or more RCTs, or meta-analyses of moderate-quality RCTs. |
| **Level B-NR (Nonrandomized)** | Moderate-quality evidence from 1 or more well-designed, well-executed nonrandomized studies, observational studies, or registry studies. |
| **Level C-LD (Limited Data)** | Randomized or nonrandomized observational or registry studies with limitations of design or execution; physiological or mechanistic studies in humans. |
| **Level C-EO (Expert Opinion)** | Consensus of expert opinion based on clinical experience when evidentiary data are lacking. |

</div></details>

<details class="med-details"><summary>

## 1. Introduction</summary><div class="details-content">

### 1.1 Methodology and Evidence Review
Clinical practice guidelines provide evidence-based recommendations to assist healthcare professionals in the diagnosis and management of patients with cardiovascular diseases. This 2025 guideline was commissioned by the American College of Cardiology (ACC) and American Heart Association (AHA) Joint Committee on Clinical Practice Guidelines, developed in direct collaboration with and endorsed by the American College of Emergency Physicians (ACEP), the National Association of EMS Physicians (NAEMSP), and the Society for Cardiovascular Angiography and Interventions (SCAI).

The Writing Committee performed comprehensive, systematic literature searches across MEDLINE/PubMed, Embase, and the Cochrane Library through 2024. Evidence synthesis strictly prioritized prospective randomized controlled trials, well-designed observational registries, and systematic meta-analyses. Strict conflict-of-interest policies were maintained, with members recusing themselves from deliberations and voting on topic sections to which commercial relationships could apply.

### 1.2 Scope of the Guideline and Health Equity
The scope of this document encompasses the entire continuum of Acute Coronary Syndromes (ACS) in adults, including:
* ST-segment elevation myocardial infarction (STEMI)
* Non–ST-segment elevation myocardial infarction (NSTEMI)
* Unstable angina (UA)
* Myocardial infarction with nonobstructive coronary arteries (MINOCA)
* Spontaneous coronary artery dissection (SCAD)
* Complications of myocardial infarction, in-hospital care pathways, and transition to long-term secondary prevention.

The guideline explicitly underscores the vital principle of **health equity**. Racial and ethnic minority populations, women, individuals of lower socioeconomic status, and rural residents experience documented disparities in time-to-presentation, access to primary PCI, utilization of potent antiplatelet therapies, and referral to cardiac rehabilitation. Standardized institutional clinical protocols, regionalized transfer networks, and implicit bias education are recommended to eliminate these pervasive inequities.

</div></details>

<details class="med-details"><summary>

## 2. Overview of ACS</summary><div class="details-content">

### 2.1 Pathobiology of Type 1 Myocardial Infarction Due to Atherosclerosis
Acute coronary syndromes most commonly result from the acute disruption of an unstable, lipid-rich atherosclerotic plaque in an epicardial coronary artery. 

Plaque disruption occurs primarily through two distinct mechanisms:
1. **Plaque Rupture:** Typically characterized by a thin fibrous cap ($< 65\ \mu\text{m}$), extensive macrophage infiltration, apoptosis, and a large necrotic lipid core. Disruption exposes thrombogenic subendothelial core contents (tissue factor, collagen) directly to circulating blood.
2. **Plaque Erosion:** Characterized by an intact fibrous cap with denudation of overlying endothelial cells, enriched with proteoglycans and hyaluronan, and associated with neutrophil extracellular traps (NETs).

Exposure of thrombogenic matrix triggers rapid platelet adhesion via glycoprotein receptors (GP Ib/IX/V, GP VI), platelet activation with degranulation and release of thromboxane A2 and ADP, and conformational activation of GP IIb/IIIa receptors, mediating platelet cross-linking via fibrinogen. Simultaneously, tissue factor activates the extrinsic coagulation cascade, generating a thrombin burst that converts fibrinogen into a cross-linked fibrin clot. When the thrombus is totally occlusive, acute transmural ischemia and STEMI typically result. When thrombus is partially occlusive, dynamic, or complicated by distal microembolization, NSTEMI or unstable angina develops.

![Figure 1: Pathobiology of a Type 1 Myocardial Infarction Due to Atherothrombosis](images/fig01_pathobiology_type1_mi.jpg)

### 2.2 Types and Classification of Acute Coronary Syndromes
Acute coronary syndromes are classified clinically based on the surface 12-lead electrocardiogram (ECG) and biochemical evidence of myocardial necrosis (elevated cardiac troponin above the 99th percentile upper reference limit):

![Figure 2: Types and Classification of Acute Coronary Syndromes](images/fig02_types_classification_acs.jpg)

''')

    # Tables 3 and 4
    parts.append(render_table_en('t03-electrocardiographic-interpretation-suspected-acs.json'))
    parts.append(render_table_en('t04-types-ami-universal-definition.json'))

    parts.append('''</div></details>

<details class="med-details"><summary>

## 3. Initial Evaluation and Management of Patients With Suspected or Confirmed ACS</summary><div class="details-content">

### 3.1 Clinical Assessment, Prehospital Triage, and Initial In-Hospital Care
Early identification of ACS is vital, as myocardial salvage is strictly time-dependent ("time is muscle"). Patients experiencing ischemic symptoms (retrosternal pressure, squeezing, fullness, radiation to neck, jaw, shoulders, or arms, diaphoresis, dyspnea, nausea, or syncope) should immediately activate 911/EMS rather than driving to the hospital.

Emergency Medical Services (EMS) personnel play an indispensable role in the survival chain by obtaining a prehospital 12-lead ECG within 10 minutes of first medical contact (FMC), initiating telemetric transmission to the receiving facility, activating the cardiac catheterization team directly from the field, and bypassing non-PCI hospitals for patients with suspected STEMI.

![Figure 3: Initial Assessment of Patients With Suspected ACS](images/fig03_initial_assessment_suspected_acs.jpg)

''')

    # RT 1 and RT 2
    parts.append(render_rt_en('rt01-prehospital-assessment-management-suspected-acs.json'))
    parts.append(render_rt_en('rt02-initial-in-hospital-assessment-suspected-acs.json'))

    # Table 5 and RT 3
    parts.append(render_table_en('t05-selected-risk-stratification-tools-acs.json'))
    parts.append(render_rt_en('rt03-management-patients-presenting-with-cardiac-arrest.json'))

    # 3.2 Analgesia and Oxygen Therapy
    parts.append('''### 3.2 Analgesia and Oxygen Therapy
* **Supplemental Oxygen:** Routine administration of supplemental oxygen in non-hypoxemic patients ($SaO_2 \ge 90\%$) is **not recommended** (Class 3: No Benefit). Hyperoxia induces coronary vasoconstriction, enhances free radical generation, and increases infarct size and myocardial injury. Supplemental oxygen is indicated exclusively for patients with documented arterial hypoxemia ($SaO_2 < 90\%$, $PaO_2 < 60\text{ mmHg}$) or respiratory distress.
* **Nitrates:** Sublingual nitroglycerin ($0.4\text{ mg}$ every 5 minutes up to 3 doses) is reasonable for ongoing ischemic chest discomfort. Intravenous nitroglycerin is indicated for recurrent ischemia, uncontrolled hypertension, or acute heart failure. *Strict Contraindication:* Nitrates must **never** be administered to patients who have taken phosphodiesterase-5 inhibitors (sildenafil/vardenafil within 24 hours, tadalafil within 48 hours) due to life-threatening refractory hypotension, or in severe aortic stenosis or right ventricular infarction.
* **Opioids (Morphine):** Intravenous morphine sulfate should be reserved for refractory ischemic chest pain unresponsive to anti-ischemic medications. Routine administration should be approached with caution, as morphine delays gastric emptying, impairs absorption, and blunts peak antiplatelet effects of oral P2Y12 inhibitors.
* **NSAIDs:** Nonsteroidal anti-inflammatory drugs (except aspirin) should be withheld and discontinued during acute hospitalization due to increased risks of myocardial rupture, recurrent infarction, heart failure, and mortality.

''')

    parts.append(render_table_en('t06-analgesic-treatment-cardiac-chest-pain.json'))
    parts.append(render_rt_en('rt04-oxygen-therapy.json'))

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/acs_block1_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 1 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
