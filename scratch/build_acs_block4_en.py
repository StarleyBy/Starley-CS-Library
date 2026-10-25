# -*- coding: utf-8 -*-
"""
Builder for Chapter 12 - Block 4 (English)
2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes
Sections 10, 11, and 12 (pages 51 - 63)
"""

from acs_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Section 10: In-Hospital Issues in the Management of ACS
    parts.append(r'''<details class="med-details"><summary>

## 10. In-Hospital Issues in the Management of ACS</summary><div class="details-content">

### 10.1 Cardiac Intensive Care Unit (CICU)
Admission to a specialized Cardiac Intensive Care Unit (CICU) is reserved for patients requiring advanced hemodynamic monitoring, invasive mechanical support, or intensive nursing care:
* **CICU Admission Criteria:** Patients presenting with ongoing refractory angina, hemodynamic instability, cardiogenic shock, respiratory failure requiring mechanical ventilation, life-threatening sustained ventricular arrhythmias, high-grade heart block, or acute mechanical complications should be admitted directly to a CICU (Class 1, Level of Evidence B-NR).
* **Step-Down Triage:** Clinically stable, uncomplicated patients with successfully reperfused STEMI or NSTE-ACS without recurrent ischemia or arrhythmias can be safely managed in a telemetry step-down unit, optimizing critical care resource utilization.

''')

    # RT 28
    parts.append(render_rt_en('rt28-cicu-admission.json'))

    # 10.2 Management of Anemia
    parts.append(r'''### 10.2 Management of Anemia in ACS
Anemia is an independent predictor of adverse ischemic and bleeding outcomes in ACS. Myocardial oxygen delivery is critically dependent on both coronary blood flow and hemoglobin concentration:
* **Transfusion Strategy (MINT Trial):** In patients with ACS and acute or chronic anemia, a **restrictive red blood cell transfusion threshold** (transfusion only when hemoglobin drops below **$7\text{ to }8\text{ g/dL}$**) is reasonable compared to a liberal transfusion strategy (Class 2a, Level of Evidence B-R).
* The multicenter MINT trial ($n=3{,}504$) demonstrated that while a liberal transfusion strategy (transfusing for hemoglobin $< 10\text{ g/dL}$) did not statistically significantly reduce 30-day mortality or recurrent MI, point estimates trended toward lower ischemic events without increasing fluid overload or harm. Clinical decision-making should balance ischemic symptoms, hemodynamic stability, and ongoing bleeding when considering transfusion in patients with hemoglobin levels between $8\text{ and }10\text{ g/dL}$.

''')

    # RT 29
    parts.append(render_rt_en('rt29-management-of-anemia.json'))

    # 10.3 Telemetry and Length of Stay
    parts.append(r'''### 10.3 Telemetry Monitoring and Hospital Length of Stay
* **Telemetry Duration:** In patients with ACS, continuous telemetry monitoring is recommended for at least **24 hours** after presentation or until successful revascularization and clinical stabilization (Class 1, Level of Evidence B-NR). For uncomplicated patients successfully revascularized via radial primary PCI who remain asymptomatic with normal rhythm, telemetry discontinuation after 24 hours is safe and appropriate.
* **Early Hospital Discharge:** In low-risk patients with uncomplicated STEMI (Zwolle Risk Score $\le 3$ or PAMI-II low risk) or uncomplicated NSTE-ACS, early discharge within **24 to 48 hours** is reasonable and safe, provided home support, outpatient medication reconciliation, and rapid follow-up are assured.

''')

    # RT 30
    parts.append(render_rt_en('rt30-telemetry-and-length-of-stay.json'))

    # 10.4 Noninvasive Testing Prior to Discharge
    parts.append(r'''### 10.4 Noninvasive Diagnostic Testing Prior to Hospital Discharge
* **Assessment of Left Ventricular Function:** In all patients with confirmed ACS, an assessment of left ventricular ejection fraction (LVEF) with resting **transthoracic echocardiography (TTE)** is recommended prior to hospital discharge (Class 1, Level of Evidence B-NR). Echocardiography evaluates systolic and diastolic function, regional wall motion abnormalities, mechanical complications (VSR, papillary rupture, pseudoaneurysm), right ventricular involvement, and apical mural thrombus formation.
* **Noninvasive Ischemia Testing:** In patients with NSTE-ACS treated with an initial selective (conservative) invasive strategy, pre-discharge noninvasive functional testing (exercise treadmill testing, stress echocardiography, or stress nuclear myocardial perfusion imaging) is indicated to detect residual inducible ischemia and assess prognosis.

''')

    # RT 31
    parts.append(render_rt_en('rt31-noninvasive-diagnostic-testing-prior-to-discharge.json'))

    # 10.5 Discharge Planning
    parts.append(r'''### 10.5 Discharge Planning and Care Coordination
Optimal transition of care from the inpatient setting to ambulatory recovery is essential for preventing early readmissions and cardiovascular death:
* **Patient Education:** Comprehensive patient and family education should encompass medication adherence, early recognition of recurrent ischemic symptoms, smoking cessation, healthy lifestyle habits, and emergency medical services (EMS) activation protocols.

''')

    # Tables 20 & 21
    parts.append(render_table_en('t20-essential-components-patient-education.json'))
    parts.append(render_table_en('t21-guidance-acs-discharge-best-practices.json'))

    parts.append(r'''### 10.6 Cardiac Rehabilitation
* **Mandatory Referral:** All eligible patients hospitalized with ACS should be formally referred to a comprehensive, outpatient **cardiac rehabilitation (CR)** program prior to hospital discharge (Class 1, Level of Evidence A).
* **Clinical Benefits:** Participation in exercise-based CR programs confers a 20% to 30% reduction in all-cause and cardiovascular mortality, reduces hospital readmissions, improves functional exercise capacity, and enhances quality of life.
* **Home-Based and Hybrid CR:** In patients unable to attend traditional facility-based programs due to geographic, financial, or employment barriers, home-based or hybrid CR models with remote monitoring are reasonable alternatives (Class 2a, Level A).

![Figure 10: Core Components of Cardiac Rehabilitation](images/fig10_core_components_cardiac_rehab.jpg)

''')

    # RT 32
    parts.append(render_rt_en('rt32-cardiac-rehabilitation.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 11. Discharge: Long-Term Management and Secondary Prevention</summary><div class="details-content">

### 11.1 DAPT Strategies in the First 12 Months Postdischarge
Balancing ischemic protection against bleeding complications is the central goal of post-ACS antiplatelet therapy:
* **Standard 12-Month DAPT:** In patients with ACS undergoing PCI who are not at high bleeding risk (HBR), DAPT consisting of aspirin combined with a potent oral P2Y12 inhibitor (**prasugrel** or **ticagrelor**) for at least **12 months** is recommended (Class 1, Level of Evidence A).
* **Extended DAPT ($> 12\text{ months}$):** In patients who have tolerated 12 months of DAPT without bleeding and have high ischemic risk features (e.g., prior MI, multivessel CAD, bifurcation stenting, diabetes) combined with low bleeding risk, extended DAPT with low-dose aspirin plus ticagrelor ($60\text{ mg}$ twice daily) or clopidogrel ($75\text{ mg}$ once daily) is reasonable (Class 2b, Level A; PEGASUS-TIMI 54 and DAPT trials).
* **Gastroprotection:** In patients with increased risk of gastrointestinal bleeding (history of GI bleed, age $\ge 65$, concomitant anticoagulants or NSAIDs), routine co-prescription of a proton pump inhibitor (PPI) is recommended (Class 1, Level A; COGENT trial).
* **DAPT De-Escalation:** In patients undergoing PCI, de-escalation of DAPT (switching from prasugrel/ticagrelor to clopidogrel after 1 to 3 months, or reducing ticagrelor dose) may be considered (Class 2b, Level B-R) based on platelet function testing, CYP2C19 genotype guidance (POPular Genetics, TAILOR-PCI), or an unguided clinical strategy (TOPIC, TALOS-AMI).
* **Shortened DAPT in High Bleeding Risk (HBR):** In patients undergoing PCI who meet Academic Research Consortium High Bleeding Risk (ARC-HBR) criteria:
  - Discontinuing aspirin after **1 to 3 months** and maintaining **P2Y12 inhibitor monotherapy** (ticagrelor or clopidogrel) for up to 12 months is recommended (Class 1, Level A; MASTER DAPT, TWILIGHT, TICO).
  - Alternatively, in extreme HBR patients, discontinuing the P2Y12 inhibitor after **1 month** and continuing aspirin monotherapy is reasonable (Class 2a, Level B-R).

![Figure 11: DAPT Strategies in the First 12 Months Postdischarge in Patients Not Requiring an Oral Anticoagulant](images/fig11_dapt_strategies_first_12_months.jpg)

''')

    # Table 22 & RT 33
    parts.append(render_table_en('t22-arc-hbr-criteria-after-pci.json'))
    parts.append(render_rt_en('rt33-dapt-strategies-first-12-months-postdischarge.json'))

    # 11.1.1 Antiplatelet Therapy With Oral Anticoagulation
    parts.append(r'''### 11.1.1 Antiplatelet Therapy in Patients Requiring Chronic Oral Anticoagulation
Atrial fibrillation or other indications for oral anticoagulation (OAC) occur in 8% to 12% of ACS patients:
* **Double Therapy (DOAC + Clopidogrel):** In patients with ACS requiring long-term oral anticoagulation who undergo PCI, **double therapy** consisting of a direct oral anticoagulant (DOAC at standard stroke prevention dosing) and a single oral P2Y12 inhibitor (**clopidogrel $75\text{ mg}$ once daily**) is recommended in preference to triple therapy (Class 1, Level of Evidence A). Four pivotal randomized trials (PIONEER AF-PCI, RE-DUAL PCI, AUGUSTUS, and ENTRUST-AF PCI) demonstrated that dropping aspirin immediately upon discharge reduces major or clinically relevant bleeding by approximately 50% without a statistically significant increase in stent thrombosis or ischemic events.
* **Duration of Triple Therapy:** If triple therapy (aspirin + clopidogrel + DOAC) is used, it should be limited to the in-hospital period or $\le 1\text{ to }4\text{ weeks}$ post-PCI in patients with exceptionally high ischemic/thrombotic risk and acceptable bleeding risk.
* **Class 3 (Harm):** Potent P2Y12 inhibitors (**prasugrel** or **ticagrelor**) should **not be used** as part of triple therapy with an oral anticoagulant due to prohibitive bleeding risks (Class 3: Harm).
* **Cessation of Antiplatelet Therapy at 12 Months:** After 12 months post-PCI, antiplatelet therapy should generally be discontinued, maintaining DOAC monotherapy lifelong (Class 2a, Level B-R; OAC-ALONE, AFIRE trials).

''')

    # RT 34
    parts.append(render_rt_en('rt34-antiplatelet-therapy-anticoagulation-postdischarge.json'))

    # 11.2 Reassessment of Lipid Levels
    parts.append(r'''### 11.2 Reassessment of Lipid Levels and Intensification of Lipid-Lowering Therapy
* **Postdischarge Lipid Panel:** In all patients post-ACS, a fasting or nonfasting lipid panel is recommended **4 to 12 weeks** postdischarge to evaluate therapeutic response and medication adherence (Class 1, Level of Evidence B-NR).
* **Intensification Goals:** The guideline-directed goal is achieving an **LDL-C $< 55\text{ mg/dL}$ ($< 1.4\text{ mmol/L}$)** and a **$\ge 50\%$ reduction** from baseline.
* **Nonstatin Add-on:** If the LDL-C remains $\ge 55\text{ mg/dL}$ despite maximally tolerated high-intensity statin therapy:
  1. Add **ezetimibe** ($10\text{ mg}$ daily) as first-line nonstatin therapy (Class 1, Level B-R);
  2. Add a **PCSK9 inhibitor** (evolocumab or alirocumab) or **inclisiran** for very high-risk patients failing to achieve LDL targets on statin + ezetimibe (Class 1, Level A);
  3. Consider **bempedoic acid** in statin-intolerant patients (CLEAR Outcomes trial).

''')

    # RT 35
    parts.append(render_rt_en('rt35-reassessment-lipid-levels-postdischarge.json'))

    # 11.3 SGLT2i and GLP-1 RA
    parts.append(r'''### 11.3 SGLT-2 Inhibitors and GLP-1 Receptor Agonists
* **SGLT-2 Inhibitors (Empagliflozin, Dapagliflozin):** In patients with ACS and comorbid type 2 diabetes mellitus, chronic kidney disease (eGFR $20\text{--}60\text{ mL/min/1.73 m}^2$), or heart failure (with reduced or preserved ejection fraction), an SGLT-2 inhibitor is recommended to reduce cardiovascular mortality, heart failure hospitalizations, and renal disease progression (Class 1, Level A; DAPA-HF, EMPEROR-Reduced, DELIVER, EMPEROR-Preserved).
* **GLP-1 Receptor Agonists (Semaglutide, Dulaglutide):** In patients with ACS and type 2 diabetes mellitus or established obesity without diabetes, a GLP-1 receptor agonist with proven cardiovascular benefit is recommended to reduce major adverse cardiovascular events (Class 1, Level A; SUSTAIN-6, LEADER, SELECT trial).

''')

    # 11.4 Colchicine
    parts.append(r'''### 11.4 Use of Chronic Colchicine
* **Anti-inflammatory Therapy:** In patients post-ACS on optimal guideline-directed medical therapy, low-dose **colchicine** ($0.5\text{ mg}$ once daily) is reasonable to reduce recurrent ischemic events, including myocardial infarction, stroke, and ischemia-driven coronary revascularization (Class 2b, Level of Evidence B-R).
* The COLCOT trial ($n=4{,}745$) demonstrated that colchicine initiated within 30 days of MI reduced the composite primary ischemic endpoint by 23% ($5.5\%\text{ vs }7.1\%$, hazard ratio 0.77; $P=0.02$). The LoDoCo2 trial confirmed long-term ischemic event reduction in chronic coronary disease. Colchicine should be used with caution in patients with significant renal impairment or hepatic dysfunction.

''')

    # RT 36
    parts.append(render_rt_en('rt36-use-of-chronic-colchicine.json'))

    # 11.5 Immunization
    parts.append(r'''### 11.5 Immunization
* **Influenza Vaccination:** In patients with ACS without contraindications, annual **influenza vaccination** is recommended prior to hospital discharge or at the earliest ambulatory encounter (Class 1, Level of Evidence B-R).
* The randomized IAMI trial ($n=2{,}571$) and FLUVACS trial demonstrated that early in-hospital influenza vaccination after acute MI or high-risk CAD reduced the composite of all-cause death, MI, or stent thrombosis at 12 months (hazard ratio 0.72; $P=0.014$).
* Routine vaccination against **Streptococcus pneumoniae**, **respiratory syncytial virus (RSV)**, and **COVID-19** is also strongly recommended according to national immunization advisory guidelines.

''')

    # RT 37
    parts.append(render_rt_en('rt37-immunization.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 12. Evidence Gaps and Future Directions</summary><div class="details-content">

Despite transformative advancements in early reperfusion, mechanical circulatory support, and secondary prevention pharmacotherapy, several critical clinical questions remain unresolved:
1. **Mechanical Circulatory Support Timing and Selection:** While DanGer Shock demonstrated 180-day survival benefits with routine Impella CP in STEMI cardiogenic shock, vascular and bleeding complications remain substantial. Refined clinical and hemodynamic algorithms (e.g., SCAI shock stages, pulmonary artery pulsatility index, invasive cardiac power output) are needed to identify patients who derive maximal survival advantage while minimizing devicerelated morbidities.
2. **Novel Antithrombotic Strategies:** Next-generation anticoagulants targeting factor XI and XIa (e.g., asundexian, milvexian) hold potential to uncouple antithrombotic efficacy from bleeding risk, potentially revolutionizing combination therapy with antiplatelet agents post-ACS.
3. **Plaque Erosion and Personalized Revascularization:** Intravascular imaging (OCT) has revealed that up to one-third of ACS cases are caused by plaque erosion rather than plaque rupture. Ongoing trials are investigating whether non-stent medical stabilization (effective DAPT and aggressive lipid-lowering) can safely avoid permanent metallic stenting in selected patients with plaque erosion.
4. **Myocardial Infarction With Nonobstructive Coronary Arteries (MINOCA):** High-resolution multimodal imaging (OCT, CMR) is uncovering distinct etiologies (coronary spasm, SCAD, microvascular dysfunction, myocarditis, takotsubo cardiomyopathy). Targeted clinical trials are urgently needed to guide disease-specific pharmacotherapies.
5. **Anti-Inflammatory Therapies Beyond Colchicine:** Interleukin-1$\beta$ and interleukin-6 inhibitors (e.g., ziltivekimab) are currently being evaluated in clinical trials to determine whether targeted cytokine suppression provides superior cardiovascular protection compared to non-targeted anti-inflammatory agents.
6. **Cardioprotection and Myocardial Regeneration:** Novel molecular agents, sodium-glucose cotransporter inhibitors, and cell/gene-based therapeutic platforms aiming to limit reperfusion injury, reduce microvascular obstruction, and promote functional scar healing require further validation.

</div></details>
''')

    full_text = '\n\n'.join(parts)
    with open('scratch/acs_block4_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 4 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
