# -*- coding: utf-8 -*-
"""
Builder for Chapter 13 - Block 3 (English)
2024 AHA/ACC/AMSSM/HRS/PACES/SCMR Guideline for the Management of Hypertrophic Cardiomyopathy
Sections 7 and 8 (pages 26 - 45)
"""

from hcm_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Section 7: SCD Risk Assessment and Prevention
    parts.append(r'''<details class="med-details"><summary>

## 7. SCD Risk Assessment and Prevention</summary><div class="details-content">

### 7.1 Sudden Cardiac Death (SCD) Risk Assessment
Sudden cardiac death (SCD) from ventricular tachyarrhythmias (ventricular tachycardia / ventricular fibrillation) is the most devastating complication of HCM. Systematic risk stratification must be performed at baseline and repeated every **1 to 2 years** (or sooner if clinical status changes):
* **Established Major Clinical Risk Factors:**
  1. **Prior Ventricular Fibrillation, Sustained VT, or Resuscitated Cardiac Arrest:** Absolute indication for secondary prevention ICD.
  2. **Family History of Premature HCM-Related SCD:** Definite or probable sudden cardiac death in $\ge 1$ first-degree or close relative $\le 50$ years of age.
  3. **Massive Left Ventricular Hypertrophy:** Maximal wall thickness **$\ge 30\text{ mm}$** (or $z\text{-score} \ge 6$ in children) in any LV segment.
  4. **Unexplained Recent Syncope:** Syncope occurring within the preceding 6 to 12 months deemed not neurocardiogenic/vasovagal.
  5. **Left Ventricular Apical Aneurysm:** Regardless of aneurysm size, associated with a distinct arrhythmogenic scarred rim and thromboembolic propensity.
  6. **Systolic Dysfunction (End-Stage / Burned-Out):** Left ventricular ejection fraction **$< 50\%$**.
  7. **Extensive Late Gadolinium Enhancement (LGE):** Involving **$\ge 15\%$** of total LV myocardial mass on contrast CMR.
* **Contributory / Modifying Risk Markers:** Non-sustained ventricular tachycardia (NSVT) on ambulatory monitoring (especially if frequent, rapid, or prolonged), blunted or hypotensive blood pressure response to exercise, and markedly elevated left ventricular outflow tract gradient.

''')

    # Tables 8, RT 12, RT 13
    parts.append(render_table_en('t08-clinical-sudden-death-risk-factors.json'))
    parts.append(render_rt_en('rt12-scd-risk-assessment-adults.json'))
    parts.append(render_rt_en('rt13-scd-risk-assessment-children-adolescents.json'))

    # 7.2 Patient Selection for ICD Placement
    parts.append(r'''### 7.2 Patient Selection for ICD Placement
Implantable cardioverter-defibrillators (ICDs) are the only proven therapy for terminating malignant ventricular arrhythmias and preventing SCD in HCM:
* **Secondary Prevention (Class 1):** In patients with HCM who have survived a cardiac arrest due to VF or sustained VT, or experienced spontaneous sustained VT causing syncope or hemodynamic compromise, an ICD is strongly recommended (Class 1, Level of Evidence B-NR).
* **Primary Prevention in Adults:**
  - In patients harboring **$\ge 1$ major conventional risk factor** (massive LVH $\ge 30\text{ mm}$, family history of premature SCD, unexplained recent syncope, apical aneurysm, or LVEF $< 50\%$), ICD placement is reasonable (Class 2a, Level B-NR).
  - In patients with extensive LGE ($\ge 15\%$) on CMR or significant NSVT, ICD placement is reasonable (Class 2a, Level B-NR).
  - When clinical risk remains borderline or uncertain after conventional assessment, European (HCM Risk-SCD) or pediatric risk prediction calculators may provide supportive guidance, but clinical judgment and shared decision-making remain paramount.
* **Primary Prevention in Children:** In pediatric patients with $\ge 1$ major risk factor (family history of early SCD, massive LVH with $z\text{-score} \ge 6$, unexplained syncope, or NSVT), ICD placement is reasonable (Class 2a, Level B-NR).

![Figure 3: Patient Selection for ICD Use](images/fig03_patient_selection_icd_use.jpg)

''')

    # RT 14
    parts.append(render_rt_en('rt14-icd-placement-high-risk-hcm.json'))

    # 7.3 Device Selection Considerations
    parts.append(r'''### 7.3 Device Selection Considerations: Transvenous vs Subcutaneous ICD
* **Subcutaneous ICD (S-ICD):** Recommended as an alternative to transvenous ICD in patients who do not require bradycardia pacing, cardiac resynchronization therapy (CRT), or anti-tachycardia pacing (ATP) for monomorphic VT (Class 1, Level of Evidence B-NR). S-ICD avoids lead-related intravascular complications, systemic bacteremia, and vascular occlusion, which is especially advantageous in young active patients. Surface ECG screening must be performed to confirm adequate T-wave oversensing discrimination.
* **Transvenous ICD:** Indicated when patients have coexisting indications for antibradycardia pacing, documented monomorphic VT terminable by ATP, or require CRT for end-stage systolic dysfunction.

''')

    # RT 15
    parts.append(render_rt_en('rt15-icd-device-selection-considerations.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 8. Management of HCM</summary><div class="details-content">

### 8.1 Management of Symptomatic Patients With Obstructive HCM

#### 8.1.1 Pharmacological Management of Obstructive HCM
The primary objective of medical therapy is relieving symptoms of heart failure (dyspnea, fatigue) and chest pain by reducing the dynamic LVOT gradient, improving diastolic ventricular relaxation, and lengthening ventricular filling time:
* **First-Line Therapy — Beta-Blockers:** Non-vasodilating oral beta-blockers (e.g., metoprolol succinate, atenolol, propranolol) titrated to a resting heart rate of $55\text{--}65\text{ bpm}$ are recommended as initial first-line therapy (Class 1, Level of Evidence B-NR). Beta-blockers attenuate exercise-induced LVOT gradients by blunting sympathetic chronotropic and inotropic surges.
* **Alternative First-Line — Non-Dihydropyridine Calcium Channel Blockers:** In patients who are intolerant of or have contraindications to beta-blockers, non-dihydropyridine calcium channel blockers (**verapamil** or **diltiazem**) are recommended (Class 1, Level B-NR). Caution is warranted in patients with resting gradients $> 100\text{ mm Hg}$ or severe pulmonary congestion, as vasodilator effects can precipitate pulmonary edema.
* **Second-Line / Add-On Therapy — Cardiac Myosin Inhibitors (Mavacamten):**
  - In symptomatic patients with obstructive HCM who have persistent NYHA class II to III symptoms despite monotherapy with beta-blockers or calcium channel blockers, **mavacamten** is recommended as add-on therapy (Class 1, Level of Evidence A).
  - In the pivotal Phase 3 EXPLORER-HCM trial ($n=251$), mavacamten achieved the primary composite functional endpoint in 37% versus 17% on placebo ($P=0.0005$), reduced resting and provoked gradients to $< 30\text{ mm Hg}$ in 57% of patients, and markedly improved health status (KCCQ score).
  - In the VALOR-HCM trial ($n=112$), mavacamten reduced eligibility for invasive septal reduction therapy from 100% to 18% at 16 weeks ($P<0.001$).
  - **Safety and Monitoring:** Because mavacamten directly inhibits actin-myosin cross-bridging, it reversibly lowers LVEF. Periodic echocardiographic surveillance of LVEF is mandatory (at baseline, weeks 4, 8, 12, and every 12 weeks thereafter). Therapy must be temporarily withheld if LVEF drops below $50\%$. Mavacamten is metabolized by CYP2C19 and CYP3A4, requiring strict adherence to drug-interaction protocols.
* **Alternative Second-Line — Disopyramide:** In patients with persistent symptoms on beta-blockers or calcium channel blockers where cardiac myosin inhibitors are not available or not tolerated, disopyramide (Class Ia antiarrhythmic with negative inotropic properties) combined with an AV-nodal blocking agent is recommended (Class 1, Level B-NR).
* **Medications to AVOID (Class 3: Harm):** Dihydropyridine calcium channel blockers (nifedipine, amlodipine), oral nitrates, phosphodiesterase-5 inhibitors, and cardiac digitalis glycosides (digoxin) cause peripheral vasodilation or positive inotropy, exacerbating dynamic LVOTO.

![Figure 4: Management of Symptoms in Patients With HCM](images/fig04_management_symptoms_hcm.jpg)

''')

    # RT 16
    parts.append(render_rt_en('rt16-pharmacological-management-obstructive-hcm.json'))

    # 8.1.2 Invasive Treatment: Septal Reduction Therapy
    parts.append(r'''#### 8.1.2 Invasive Treatment of Symptomatic Patients With Obstructive HCM (Septal Reduction Therapy)
When severe symptoms (NYHA functional class III–IV, exertional presyncope, or syncope) persist despite maximally tolerated guideline-directed pharmacotherapy, and a dynamic peak LVOT gradient **$\ge 50\text{ mm Hg}$** (at rest or with provocation) is documented, **invasive septal reduction therapy (SRT)** is indicated:
* **Surgical Septal Myectomy (Morrow Procedure):**
  - The gold standard surgical procedure for obstructive HCM, performed via median sternotomy and transaortic approach (often augmented with transapical resection in midventricular/apical hypertrophy).
  - Recommended as the preferred intervention in younger, healthier patients, those with concomitant surgical indications (coronary artery disease requiring CABG, intrinsic mitral valve disease requiring repair/replacement, subaortic membrane, anomalous papillary muscles), or patients with massive basal septal thickness ($> 25\text{--}30\text{ mm}$) (Class 1, Level of Evidence B-NR).
  - High-volume surgical centers report procedural mortality $< 1\%$, permanent complete heart block rates $< 2\text{--}3\%$, and $> 90\%$ long-term freedom from recurrent obstruction.
* **Alcohol Septal Ablation (ASA):**
  - Catheter-based percutaneous technique involving selective balloon catheterization and infusion of $1\text{--}2\text{ mL}$ of absolute ethanol into a suitable septal perforator branch of the left anterior descending artery, inducing targeted focal septal infarction.
  - Recommended as an alternative to surgical myectomy in patients with advanced age, severe noncardiac comorbidities, high surgical risk, or strong informed preference, provided coronary anatomy is favorable and myocardial contrast echocardiography confirms precise localization to the basal septum contacting the mitral valve (Class 1, Level of Evidence B-NR).
  - Procedural complete heart block requiring permanent pacemaker implantation occurs in approximately $8\text{ to }12\%$ of cases.
* **Dual-Chamber Pacing:** In patients with drug-refractory symptoms who are not candidates for or decline myectomy, ASA, or cardiac myosin inhibitors, dual-chamber pacing with short AV delay may be considered to reduce gradients via paradoxical septal motion (Class 2b, Level B-R).

''')

    # RT 17
    parts.append(render_rt_en('rt17-invasive-treatment-obstructive-hcm.json'))

    # 8.2 Nonobstructive HCM With Preserved EF
    parts.append(r'''### 8.2 Management of Patients With Nonobstructive HCM With Preserved EF
Approximately one-third of HCM patients have nonobstructive physiology (resting and provoked peak LVOT gradients $< 30\text{ mm Hg}$):
* **Symptom Pathophysiology:** Exertional symptoms in nonobstructive HCM are primarily caused by severe diastolic dysfunction, elevated left atrial filling pressures, and microvascular ischemia.
* **First-Line Pharmacotherapy:** Beta-blockers or non-dihydropyridine calcium channel blockers (verapamil or diltiazem) are recommended to prolong diastole, improve ventricular compliance, and reduce myocardial oxygen consumption (Class 1, Level of Evidence B-NR).
* **Judicious Diuretics:** Oral loop or thiazide diuretics in low-to-moderate doses may be added to alleviate exertional dyspnea and orthopnea resulting from pulmonary congestion (Class 2a, Level B-NR). Overdiuresis must be avoided because reducing LV end-diastolic volume can precipitate cavity obliteration and dynamic hypotension.
* **SGLT2 Inhibitors:** Sodium-glucose cotransporter-2 (SGLT2) inhibitors are reasonable in patients with persistent heart failure symptoms (Class 2a, Level B-R).

''')

    # RT 18
    parts.append(render_rt_en('rt18-management-nonobstructive-hcm-preserved-ef.json'))

    # 8.3 Advanced Heart Failure
    parts.append(r'''### 8.3 Management of Patients With HCM and Advanced Heart Failure
In 5% to 10% of patients, extensive transmural fibrosis and adverse remodeling lead to the **"burned-out" or hypokinetic end-stage phenotype**, characterized by left ventricular systolic dysfunction (LVEF $< 50\%$):
* **Guideline-Directed Medical Therapy for HFrEF:** Standard neurohormonal blockade—including angiotensin receptor-neprilysin inhibitors (ARNI) or ACE inhibitors/ARBs, beta-blockers, mineralocorticoid receptor antagonists (MRA), and SGLT2 inhibitors—is recommended (Class 1, Level of Evidence B-NR).
* **Cessation of Negative Inotropes:** Calcium channel blockers (verapamil, diltiazem), disopyramide, and cardiac myosin inhibitors must be discontinued once LVEF falls below 50%.
* **Cardiac Resynchronization Therapy (CRT):** In patients with LVEF $< 50\%$, NYHA class II to IV symptoms, and left bundle branch block (LBBB with QRS duration $\ge 130\text{--}150\text{ ms}$), CRT is recommended (Class 1, Level B-NR).
* **Advanced Therapies (Transplantation and LVAD):** In patients developing refractory Stage D heart failure despite optimal GDMT and CRT, evaluation for orthotopic heart transplantation or left ventricular assist device (LVAD) is recommended (Class 1, Level B-NR). Note that small cavity dimensions may pose anatomical challenges for continuous-flow LVAD inflow cannulation.

![Figure 5: Heart Failure Algorithm in Hypertrophic Cardiomyopathy](images/fig05_heart_failure_algorithm.jpg)

''')

    # RT 19
    parts.append(render_rt_en('rt19-management-hcm-advanced-hf.json'))

    # 8.4 HCM and Atrial Fibrillation
    parts.append(r'''### 8.4 Management of Patients With HCM and Atrial Fibrillation
Atrial fibrillation (AF) develops in approximately 20% to 25% of patients with HCM and is associated with severe hemodynamic decompensation and a high risk of thromboembolic stroke:
* **Universal Oral Anticoagulation (DOACs Preferred):** In all patients with HCM who develop clinical or subclinical atrial fibrillation (or atrial flutter), lifelong oral anticoagulation is recommended (Class 1, Level of Evidence B-NR), **regardless of the CHA2DS2-VASc score**.
  - Direct oral anticoagulants (apixaban, rivaroxaban, dabigatran, edoxaban) are recommended in preference to vitamin K antagonists (warfarin) due to lower risks of major bleeding and intracranial hemorrhage.
* **Rhythm Control Strategy:** Because loss of atrial systolic contribution and rapid ventricular rates precipitate severe diastolic underfilling and pulmonary edema, an active rhythm control strategy (pharmacological cardioversion, electrical cardioversion, antiarrhythmic drugs, or catheter ablation) is recommended as the initial approach (Class 1, Level B-NR).
* **Antiarrhythmic Drug Therapy:** Amiodarone, sotalol, or dofetilide are reasonable options for maintaining sinus rhythm (Class 2a, Level B-NR). Class Ic antiarrhythmic drugs (flecainide, propafenone) should be used with extreme caution due to proarrhythmic risks in the presence of marked LVH.
* **Catheter Ablation:** Radiofrequency catheter ablation (pulmonary vein isolation) is recommended for symptomatic refractory AF (Class 1, Level B-NR). While recurrence rates are higher than in patients without structural heart disease, repeated ablation procedures achieve effective rhythm stabilization in $> 60\text{--}70\%$ of patients.
* **Surgical Maze Procedure:** In patients undergoing surgical septal myectomy who have concomitant paroxysmal or persistent AF, a concomitant surgical Cox-Maze procedure with left atrial appendage exclusion is recommended (Class 1, Level B-NR).

''')

    # Table 9 & RT 20
    parts.append(render_table_en('t09-antiarrhythmic-drug-therapy-options-hcm-af.json'))
    parts.append(render_rt_en('rt20-management-hcm-af.json'))

    # 8.5 Ventricular Arrhythmias
    parts.append(r'''### 8.5 Management of Patients With HCM and Ventricular Arrhythmias
* **Non-Sustained VT (NSVT):** Asymptomatic NSVT detected on ambulatory monitoring does not warrant specific antiarrhythmic therapy, but serves as a contributory risk marker for SCD.
* **Sustained Ventricular Arrhythmias:** In patients experiencing sustained VT or VF, secondary prevention ICD implantation is mandatory (Class 1, Level A).
* **Suppressive Antiarrhythmic Therapy:** In patients with recurrent appropriate ICD therapies (shocks or ATP) for ventricular arrhythmias despite beta-blocker therapy, treatment with **amiodarone** or **sotalol** is reasonable (Class 2a, Level B-NR).
* **Catheter Ablation for Monomorphic VT:** Catheter ablation is reasonable for drug-refractory monomorphic VT or recurrent VT storms, frequently targeting scar borders around apical aneurysms or basal septal surgical/ablation margins (Class 2a, Level B-NR).

''')

    # RT 21
    parts.append(render_rt_en('rt21-management-ventricular-arrhythmias.json'))

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/hcm_block3_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 3 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
