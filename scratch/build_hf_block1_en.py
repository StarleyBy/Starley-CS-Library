# -*- coding: utf-8 -*-
"""
Builder for Chapter 14 - Block 1 (English)
2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure
Executive Summary, Sections 1 to 6 (pages 1 - 29)
"""

from hf_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Executive Summary: Top 10 Take-Home Messages
    parts.append(r'''<details class="med-details"><summary>

## Executive Summary: Top 10 Take-Home Messages</summary><div class="details-content">

1. **Four Pillars of Guideline-Directed Medical Therapy (GDMT) for HFrEF:** Pharmacotherapy for heart failure with reduced ejection fraction (HFrEF) now rests upon four foundational medication classes: (1) SGLT2 inhibitors; (2) beta-blockers; (3) mineralocorticoid receptor antagonists (MRAs); and (4) renin-angiotensin system inhibitors, with angiotensin receptor-neprilysin inhibitors (ARNI) recommended as the preferred first-line agent over ACE inhibitors or ARBs.
2. **SGLT2 Inhibitors Across the LVEF Spectrum:** SGLT2 inhibitors hold a Class 2a recommendation in heart failure with mildly reduced ejection fraction (HFmrEF) and in heart failure with preserved ejection fraction (HFpEF), significantly reducing cardiovascular death and heart failure hospitalizations regardless of the presence of type 2 diabetes mellitus.
3. **Multifaceted Medical Therapy for HFpEF:** In patients with HFpEF, evidence-based management includes SGLT2 inhibitors (Class 2a), MRAs (Class 2b), and ARNI (Class 2b), alongside rigorous blood pressure control (Class 1), management of atrial fibrillation (Class 2a), and avoiding routine use of nitrates or phosphodiesterase-5 inhibitors (Class 3: No Benefit).
4. **Heart Failure With Improved Ejection Fraction (HFimpEF):** A dedicated category is established for patients with previous HFrEF who experience documented recovery of LVEF to $> 40\%$. GDMT must be maintained indefinitely in HFimpEF, as treatment withdrawal precipitates relapse of LV dysfunction and clinical decompensation.
5. **Formal Value and Cost-Effectiveness Statements:** High-value statements are integrated for interventions supported by published high-quality economic analyses, demonstrating that ARNI, SGLT2 inhibitors, and CRT provide high economic value and cost-effectiveness in clinical practice.
6. **Amyloid Cardiomyopathy Diagnostic and Treatment Pathway:** Comprehensive recommendations for cardiac amyloidosis include routine screening with serum and urine immunofixation electrophoresis and serum free light chains (to exclude AL amyloidosis), $^{99\text{m}}\text{Tc}$-PYP/DPD bone scintigraphy (to diagnose ATTR amyloidosis noninvasively), genetic testing (*TTR* sequencing), tetramer stabilizer therapy (tafamidis, Class 1), and universal anticoagulation for atrial fibrillation.
7. **Documenting Elevated Filling Pressures When LVEF $> 40\%$:** Objective confirmation of elevated left ventricular filling pressures—obtained noninvasively (elevated natriuretic peptides, Doppler diastolic parameters, left atrial enlargement) or invasively (hemodynamic catheterization at rest or exercise)—is required to confirm the diagnosis of HFmrEF or HFpEF.
8. **Timely Specialty Referral for Advanced HF (Stage D):** Patients with advanced heart failure who desire survival prolongation should be referred promptly to a specialized multidisciplinary heart failure team (using the "I-NEED-HELP" clinical triggers) to evaluate eligibility for mechanical circulatory support (durable LVAD), orthotopic heart transplantation, or palliative inotropes.
9. **Revised Staging System Emphasizing Prevention:** The ACC/AHA stages are updated with refined terminology: **Stage A: At Risk for HF** (hypertension, diabetes, metabolic syndrome, cardiotoxic exposure) and **Stage B: Pre-HF** (asymptomatic structural heart disease, elevated filling pressures, or abnormal natriuretic peptides/troponins), emphasizing early lifestyle modification and neurohormonal protection before symptom onset.
10. **Targeted Comorbidity Management:** Specific guideline-directed recommendations address prevalent comorbidities in heart failure, including intravenous iron repletion for iron deficiency, rhythm control and catheter ablation for atrial fibrillation, continuous positive airway pressure (CPAP) for obstructive sleep apnea, and SGLT2 inhibitors for type 2 diabetes.

#### Table 1: Associated Guidelines and Relevant Statements
* 2020 AHA/ACC Guideline for the Diagnosis and Treatment of Patients With Hypertrophic Cardiomyopathy
* 2020 ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease
* 2021 ACC/AHA/SCAI Guideline for Coronary Artery Revascularization
* 2023 ACC/AHA/ACCP/HRS Guideline for the Diagnosis and Management of Atrial Fibrillation
* 2017 AHA/ACC/HRS Guideline for Management of Patients With Ventricular Arrhythmias and Prevention of SCD
* 2021 ESC Guidelines for the Diagnosis and Treatment of Acute and Chronic Heart Failure

</div></details>

<details class="med-details"><summary>

## 1. Introduction: Scope, Methodology, and Recommendation System</summary><div class="details-content">

### 1.1 Scope of the Guideline
Heart failure is a complex clinical syndrome resulting from structural or functional impairment of ventricular filling or ejection. This guideline provides contemporary, evidence-based recommendations for clinicians to prevent, diagnose, and manage heart failure across the full continuum of ejection fraction and disease stages.

### 1.2 Class of Recommendation and Level of Evidence

#### Table 2: Applying ACC/AHA Class of Recommendation and Level of Evidence
* **Class 1 (Strong):** Benefit >>> Risk. The treatment/intervention SHOULD be performed.
* **Class 2a (Moderate):** Benefit >> Risk. The treatment/intervention is REASONABLE.
* **Class 2b (Weak):** Benefit $\ge$ Risk. The treatment/intervention MAY BE CONSIDERED.
* **Class 3: No Benefit (Moderate):** Benefit = Risk. The treatment/intervention is NOT recommended (no clinical efficacy).
* **Class 3: Harm (Strong):** Risk > Benefit. The treatment/intervention causes HARM and should NOT be performed.

**Levels of Evidence (LOE):**
* **Level A:** High-quality evidence from $> 1$ randomized controlled trial (RCT), or meta-analyses of high-quality RCTs.
* **Level B-R (Randomized):** Moderate-quality evidence from 1 or more RCTs.
* **Level B-NR (Nonrandomized):** Moderate-quality evidence from well-designed observational studies or registries.
* **Level C-LD (Limited Data):** Observational or registry studies with design limitations.
* **Level C-EO (Expert Opinion):** Consensus of expert opinion based on clinical experience.

### 1.3 Abbreviations
* **ACEi:** Angiotensin-Converting Enzyme Inhibitor
* **AF:** Atrial Fibrillation
* **ARB:** Angiotensin Receptor Blocker
* **ARNI:** Angiotensin Receptor-Neprilysin Inhibitor (Sacubitril/Valsartan)
* **BNP:** B-Type Natriuretic Peptide
* **CMR:** Cardiovascular Magnetic Resonance
* **COR:** Class of Recommendation
* **CRT:** Cardiac Resynchronization Therapy (CRT-D / CRT-P)
* **DOAC:** Direct Oral Anticoagulant
* **GDMT:** Guideline-Directed Medical Therapy
* **HF:** Heart Failure
* **HFimpEF:** Heart Failure with Improved Ejection Fraction (previous $\le 40\%$, now $> 40\%$)
* **HFmrEF:** Heart Failure with Mildly Reduced Ejection Fraction (LVEF 41% to 49%)
* **HFpEF:** Heart Failure with Preserved Ejection Fraction (LVEF $\ge 50\%$)
* **HFrEF:** Heart Failure with Reduced Ejection Fraction (LVEF $\le 40\%$)
* **ICD:** Implantable Cardioverter-Defibrillator
* **LOE:** Level of Evidence
* **LVEF:** Left Ventricular Ejection Fraction
* **LVAD:** Left Ventricular Assist Device
* **MCS:** Mechanical Circulatory Support
* **MRA:** Mineralocorticoid Receptor Antagonist (Spironolactone, Eplerenone)
* **NT-proBNP:** N-Terminal Pro-B-Type Natriuretic Peptide
* **NYHA:** New York Heart Association
* **SGLT2i:** Sodium-Glucose Cotransporter-2 Inhibitor (Dapagliflozin, Empagliflozin)
* **TEER:** Transcatheter Edge-to-Edge Repair (MitraClip)

</div></details>

<details class="med-details"><summary>

## 2. Definition, Stages, and Classification of Heart Failure</summary><div class="details-content">

### 2.1 Stages of Heart Failure (Stages A through D)
The guideline updates the classic ACC/AHA staging framework to emphasize disease prevention, early structural recognition, and clinical trajectory:

![Figure 1: ACC/AHA Stages of Heart Failure](images/fig01_acc_aha_stages_hf.jpg)

![Figure 2: Trajectory of Stage C Heart Failure](images/fig02_trajectory_stage_c_hf.jpg)

''')

    # Table 3
    parts.append(render_table_en('t03-stages-hf.json'))

    parts.append(r'''### 2.2 Classification of Heart Failure by Left Ventricular Ejection Fraction (LVEF)
Heart failure is phenotypically categorized according to resting left ventricular ejection fraction (LVEF), which dictates specific evidence-based therapeutic pathways:
* **HFrEF (Heart Failure with Reduced Ejection Fraction):** LVEF **$\le 40\%$**. Characterized by progressive chamber dilatation, eccentric remodeling, and primary systolic contractile failure.
* **HFmrEF (Heart Failure with Mildly Reduced Ejection Fraction):** LVEF **$41\%\text{ to }49\%$**. Represents a transitional phenotype with features overlapping HFrEF and HFpEF. Requires evidence of spontaneous or provoked elevated LV filling pressures.
* **HFpEF (Heart Failure with Preserved Ejection Fraction):** LVEF **$\ge 50\%$**. Driven primarily by diastolic dysfunction, concentric remodeling, impaired active relaxation, and systemic vascular inflammation. Requires objective proof of elevated LV filling pressures (natriuretic peptides, invasive hemodynamics, or stress echocardiography).
* **HFimpEF (Heart Failure with Improved Ejection Fraction):** Baseline LVEF $\le 40\%$ with a documented interval increase of $\ge 10$ points to a second measurement **$> 40\%$**. These patients remain biologically distinct from de novo HFpEF and require lifelong maintenance of GDMT.

![Figure 3: Classification and Trajectories of Heart Failure Based on LVEF](images/fig03_classification_trajectories_lvef.jpg)

''')

    # Table 4
    parts.append(render_table_en('t04-classification-lvef.json'))

    parts.append(r'''### 2.3 Diagnostic Algorithm for Classification of HF According to LVEF
Establishing the clinical diagnosis of heart failure requires integrating symptoms and physical signs with objective biomarkers, 12-lead ECG, and comprehensive imaging:

![Figure 4: Diagnostic Algorithm for Heart Failure](images/fig04_diagnostic_algorithm_hf.jpg)

</div></details>

<details class="med-details"><summary>

## 3. Epidemiology and Causes of Heart Failure</summary><div class="details-content">

### 3.1 Epidemiology of Heart Failure
* More than **6 million adults** in the United States currently live with heart failure, with prevalence projected to exceed 8 million by 2030 (a 46% increase).
* Lifetime risk of developing heart failure at age 40 exceeds **20% to 25%** for both men and women.
* Despite therapeutic advances, 5-year all-cause mortality following heart failure diagnosis remains approximately 50%, highlighting the paramount importance of early primary prevention.

### 3.2 Etiologies of Heart Failure
* **Ischemic Heart Disease:** Accounts for approximately 50% to 60% of all HFrEF cases, resulting from previous myocardial infarction, severe multivessel coronary artery disease, or chronic ischemic hibernation.
* **Nonischemic Cardiomyopathies:** Encompass diverse genetic, inflammatory, toxic, infiltrative, metabolic, and systemic disorders.

''')

    # Table 5
    parts.append(render_table_en('t05-nonischemic-causes-hf.json'))

    parts.append('''</div></details>

<details class="med-details"><summary>

## 4. Initial and Serial Clinical Evaluation</summary><div class="details-content">

### 4.1 History, Physical Examination, Laboratory, and ECG Testing
* **Initial Evaluation:** Thorough assessment of cardiovascular risk factors, family history of cardiomyopathy or sudden death, alcohol/substance use, chemotherapeutic exposures, and functional limitation using the New York Heart Association (NYHA) functional classification.
* **Physical Examination:** Systematic evaluation of jugular venous distension, hepatojugular reflux, third heart sound ($S_3$ gallop), laterally displaced apical impulse, pulmonary crackles, and peripheral edema.
* **Laboratory Testing:** Complete blood count, serum electrolytes, blood urea nitrogen, serum creatinine, estimated GFR, liver function tests, fasting lipid profile, hemoglobin A1c, thyroid-stimulating hormone (TSH), and urinalysis.
* **12-Lead Electrocardiogram:** Evaluates cardiac rhythm, QRS complex duration, presence of bundle branch block (especially left bundle branch block [LBBB] $\ge 150\text{ ms}$ for CRT candidacy), left ventricular hypertrophy, and prior pathological Q waves.

### 4.2 Use of Biomarkers: Natriuretic Peptides and Troponins
* **Diagnostic Biomarkers:** In patients presenting with acute dyspnea, measurement of **B-type natriuretic peptide (BNP)** or **N-terminal pro-B-type natriuretic peptide (NT-proBNP)** is recommended to support or exclude the diagnosis of decompensated heart failure (Class 1, Level of Evidence A).
  - Diagnostic exclusion cutoffs: BNP $< 100\text{ pg/mL}$ or NT-proBNP $< 300\text{ pg/mL}$ have high negative predictive value ($> 95\%$) to rule out acute HF.
  - Obesity lowers circulating natriuretic peptide levels by approximately 50%, whereas advanced age, female sex, renal dysfunction, and atrial fibrillation cause non-hemodynamic elevations.
  - **Interaction with ARNI:** Sacubitril inhibits neprilysin degradation of BNP, leading to elevated circulating BNP levels; NT-proBNP is not a neprilysin substrate and reliably reflects clinical response to ARNI therapy.
* **Prognostic Stratification:** Baseline and predischarge natriuretic peptide levels strongly predict postdischarge rehospitalization and mortality (Class 1, Level A).
* **Cardiac Troponins:** Measurement of high-sensitivity cardiac troponin I or T is recommended in patients presenting with acute heart failure to detect concurrent myocardial injury and establish prognosis (Class 1, Level A).

''')

    # Table 6
    parts.append(render_table_en('t06-causes-elevated-bnp.json'))

    parts.append(r'''### 4.3 Genetic Evaluation and Testing
* **Indications:** In patients with nonischemic cardiomyopathy, genetic evaluation and testing with targeted next-generation sequencing cardiomyopathy panels should be considered when there is a family history of cardiomyopathy, early unexplained sudden cardiac death, conduction system disease, or specific phenotypic syndromic features (Class 2a, Level of Evidence B-NR).
* Cascade clinical and genetic screening should be offered to first-degree relatives of probands harboring pathogenic or likely pathogenic variants.

#### Table 7: Examples of Factors Implicating Possible Genetic Cardiomyopathy
* Family history of heart failure, dilated cardiomyopathy, or sudden unexplained death $\le 50$ years
* Concomitant skeletal myopathy, muscular dystrophy, or elevated creatine kinase
* Progressive conduction system disease (AV block) at young age (e.g., *LMNA, PRKAG2*)
* Recurrent sustained ventricular arrhythmias out of proportion to LV dysfunction
* Sensorineural hearing loss, pigmentary retinopathy, or lipodystrophy
* Facial dysmorphism, lentigines, or renal angiomyolipomas

### 4.4 Evaluation With Cardiac Imaging
* **Transthoracic Echocardiography (TTE):** First-line imaging recommended for all patients with suspected HF (Class 1, Level of Evidence A) to quantify LVEF, chamber dimensions, regional wall motion, wall thickness, diastolic function, and valvular regurgitation/stenosis.
* **Cardiovascular Magnetic Resonance (CMR):** Indicated when echocardiography is suboptimal or when tissue characterization is critical to establish the underlying etiology (e.g., myocarditis, sarcoidosis, amyloidosis, hemochromatosis, Fabry disease) and quantify late gadolinium enhancement (LGE) (Class 1, Level B-NR).
* **Cardiac CT:** Reasonable for evaluating coronary anatomy in patients with low-to-intermediate pretest probability of CAD who have contraindications to CMR.

### 4.5 Invasive Evaluation
* **Invasive Hemodynamic Assessment (Right Heart Catheterization):** Recommended in patients with persistent cardiogenic shock, respiratory failure, uncertain volume status, or when evaluating candidacy for mechanical circulatory support or heart transplantation (Class 1, Level B-NR).
* **Endomyocardial Biopsy (EMB):** Reasonable when a specific systemic or myocardial infiltrative/inflammatory etiology is suspected (e.g., giant cell myocarditis, eosinophilic myocarditis, cardiac amyloidosis) where histological verification directly alters management (Class 2a, Level B-NR).

### 4.6 Wearables and Remote Monitoring
* Remote pulmonary artery pressure monitoring (e.g., CardioMEMS) is reasonable in selected symptomatic patients (NYHA class III) with a prior HF hospitalization to guide diuretic titration and reduce recurrent hospitalizations (Class 2b, Level B-R; CHAMPION trial).

### 4.7 Exercise and Functional Capacity Testing
* Cardiopulmonary exercise testing (CPET) measuring peak oxygen consumption ($V\text{O}_2\text{ peak}$) is recommended when evaluating patients for advanced therapies (LVAD or heart transplantation) or differentiating cardiac from pulmonary causes of exercise intolerance (Class 1, Level B-NR). A peak $V\text{O}_2 \le 12\text{--}14\text{ mL/kg/min}$ identifies severe impairment and supports advanced listing.

### 4.8 Clinical Assessment: HF Risk Scoring
* Multivariable clinical risk scores (e.g., Seattle Heart Failure Model [SHFM], MAGGIC score) are reasonable to estimate mortality and guide therapeutic intensity and goals of care discussions (Class 2a, Level B-NR).

#### Table 8: Selected Multivariable Risk Scores to Predict Mortality in Heart Failure
* **Seattle Heart Failure Model (SHFM):** Incorporates clinical characteristics, laboratory values, medications, and device therapies to predict 1-, 2-, and 5-year survival.
* **MAGGIC Heart Failure Risk Score:** Validated across both HFrEF and HFpEF cohorts using 13 clinical variables to predict 1- and 3-year mortality.
* **Get With The Guidelines-Heart Failure (GWTG-HF) Score:** Predicts in-hospital mortality during acute heart failure hospitalization based on admission clinical parameters.

</div></details>

<details class="med-details"><summary>

## 5. Stage A: Patients at Risk for Heart Failure (Primary Prevention)</summary><div class="details-content">

Stage A represents individuals at high risk for developing heart failure who have no symptoms, no structural heart disease, and no biomarker evidence of myocardial stretch or injury:
* **Blood Pressure Control:** In patients with hypertension, aggressive blood pressure lowering to achieve a systolic target $< 130\text{ mm Hg}$ is recommended to prevent the transition to symptomatic heart failure (Class 1, Level of Evidence A; SPRINT trial).
* **SGLT2 Inhibitors in Type 2 Diabetes:** In patients with type 2 diabetes mellitus and established cardiovascular disease or high cardiovascular risk, treatment with an SGLT2 inhibitor (empagliflozin, dapagliflozin, canagliflozin) is recommended to prevent heart failure hospitalizations (Class 1, Level A; EMPA-REG, CANVAS, DECLARE-TIMI 58).
* **Healthy Lifestyle:** Regular physical activity, maintaining healthy weight, smoking cessation, and avoidance of excessive alcohol consumption are recommended for all individuals at risk (Class 1, Level B-NR).
* **Natriuretic Peptide Screening:** In patients with cardiovascular risk factors, biomarker-based screening (measuring BNP/NT-proBNP) followed by team-based collaborative care is reasonable to prevent structural heart disease and clinical heart failure (Class 2a, Level B-R; STOP-HF trial).

</div></details>

<details class="med-details"><summary>

## 6. Stage B: Patients With Pre-Heart Failure</summary><div class="details-content">

Stage B identifies asymptomatic individuals who have evidence of structural heart disease, increased filling pressures, or persistently elevated natriuretic peptides or cardiac troponins:
* **Asymptomatic Reduced LVEF ($\le 40\%$):**
  - **ACE Inhibitors or ARBs:** Recommended in patients with asymptomatic LVEF $\le 40\%$ to prevent symptomatic heart failure and reduce mortality (Class 1, Level of Evidence A; SOLVD Prevention trial).
  - **Beta-Blockers:** Evidence-based beta-blockers (carvedilol, metoprolol succinate, bisoprolol) are recommended in patients with asymptomatic LVEF $\le 40\%$ to prevent progression to clinical heart failure (Class 1, Level A).
* **Post-Myocardial Infarction Management:**
  - **Statins:** Recommended in all patients with prior MI to prevent heart failure development (Class 1, Level A).
  - **Primary Prevention ICD:** In patients with prior MI and LVEF $\le 30\%$ on optimal medical therapy (at least 40 days post-MI), prophylactic ICD implantation is recommended to reduce sudden cardiac death (Class 1, Level A; MADIT-II).
* **Avoidance of Harm (Class 3: Harm):** Non-dihydropyridine calcium channel blockers (verapamil, diltiazem) with negative inotropic effects should not be used in patients with asymptomatic reduced LVEF.

![Figure 5: Recommendations (Class 1 and 2a) for Patients at Risk of HF (Stage A) and Those With Pre-HF (Stage B)](images/fig05_recommendations_stages_a_b.jpg)

#### Table 9: Selected Multivariable Risk Scores to Predict Development of Incident HF in Stage A/B
* **Framingham Heart Failure Risk Score:** Predicts 10-year incident heart failure risk in community cohorts.
* **ARIC HF Risk Score:** Evaluates 10-year risk of incident HF hospitalization based on demographic, metabolic, and electrocardiographic parameters.
* **PCP-HF (Pooled Cohort Equations to Prevent HF):** Contemporary 10-year risk prediction model tailored across sex and race subgroups.

#### Table 10: Associated ACC/AHA Clinical Practice Guidelines Addressing Stage B Structural Heart Disease
* 2019 ACC/AHA Guideline on the Primary Prevention of Cardiovascular Disease
* 2020 ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease
* 2020 AHA/ACC Guideline for the Diagnosis and Treatment of Patients With Hypertrophic Cardiomyopathy
* 2021 ACC/AHA/SCAI Guideline for Coronary Artery Revascularization

''')

    # RT 1
    parts.append(render_rt_en('rt01-prevention-stage-a-b.json'))

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/hf_block1_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 1 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
