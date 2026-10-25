# -*- coding: utf-8 -*-
"""
Builder for Chapter 14 - Block 4 (English)
2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure
Sections 10 to 14 (pages 76 - 93)
"""

from hf_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Section 10: Comorbidities in Patients With Heart Failure
    parts.append(r'''<details class="med-details"><summary>

## 10. Comorbidities in Patients With Heart Failure</summary><div class="details-content">

Comorbid conditions frequently coexist with heart failure, aggravating symptoms, accelerating disease progression, and complicating pharmacotherapy.

### 10.1 Management of Comorbidities in Heart Failure
* **Iron Deficiency Anemia (Class 2a, Level of Evidence B-R):** In patients with HFrEF (NYHA class II–III) and iron deficiency (defined as serum ferritin $< 100\text{ ng/mL}$ or ferritin $100\text{--}299\text{ ng/mL}$ with transferrin saturation [TSAT] $< 20\%$), intravenous iron repletion with **ferric carboxymaltose or ferric derisomaltose** is reasonable to improve functional status, exercise capacity, and quality of life, and to reduce heart failure hospitalizations (CONFIRM-HF, AFFIRM-AHF).
  - Oral iron administration is ineffective in replaying myocardial iron stores due to hepcidin-mediated intestinal malabsorption.
* **Hypertension:** Target blood pressure should be $< 130/80\text{ mm Hg}$ using GDMT neurohormonal agents (Class 1, Level A).
* **Type 2 Diabetes Mellitus:** SGLT2 inhibitors are recommended as foundational therapy to reduce cardiovascular death and heart failure hospitalizations (Class 1, Level A).
* **Sleep-Disordered Breathing:** In patients with HF and symptoms suggestive of sleep-disordered breathing, comprehensive polysomnography is recommended (Class 2a, Level C-LD).
  - Continuous positive airway pressure (CPAP) is reasonable for obstructive sleep apnea (OSA).
  - **Adaptive Servo-Ventilation Contraindicated (Class 3: Harm):** In patients with HFrEF (NYHA class II–IV, LVEF $\le 45\%$) and predominant central sleep apnea, adaptive servo-ventilation (ASV) is harmful and contraindicated due to increased all-cause and cardiovascular mortality (SERVE-HF trial).

![Figure 14: Recommendations for Treatment of Patients With HF and Selected Comorbidities](images/fig14_treatment_hf_selected_comorbidities.jpg)

''')

    # Table 26 & RT 7
    parts.append(render_table_en('t26-common-co-occurring-conditions-hf.json'))
    parts.append(render_rt_en('rt07-comorbidities-hf.json'))

    # 10.2 Management of Atrial Fibrillation in HF
    parts.append(r'''### 10.2 Management of Atrial Fibrillation in Heart Failure
Atrial fibrillation (AF) is the most common sustained arrhythmia in heart failure, exacerbating hemodynamic compromise and multiplying thromboembolic risk:
* **Anticoagulation First-Line (Class 1, Level of Evidence A):** Direct oral anticoagulants (DOACs: apixaban, dabigatran, edoxaban, rivaroxaban) are recommended in preference to warfarin in all HF patients with AF and elevated stroke risk.
* **Catheter Ablation for Rhythm Control (Class 2a, Level B-R):** In patients with symptomatic HFrEF and paroxysmal or persistent AF, radiofrequency catheter ablation (pulmonary vein isolation) is reasonable to improve symptoms, improve LVEF, and reduce mortality and hospitalizations (CASTLE-AF trial).
* **AV Node Ablation With CRT ("Ablate and Pace") (Class 2a, Level B-NR):** In patients with HFrEF and rapid AF when rate control cannot be achieved with medical therapy or catheter ablation, AV nodal ablation combined with biventricular pacing (CRT) is reasonable.
* **Rate Control:** Beta-blockers are the preferred first-line rate control agents; digoxin may be added if rate control remains inadequate. Non-dihydropyridine CCBs are contraindicated in HFrEF.

''')

    # RT 27
    parts.append(render_rt_en('rt27-management-af-in-hf.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 11. Special Populations</summary><div class="details-content">

### 11.1 Disparities and Vulnerable Populations
* Significant disparities in heart failure incidence, hospitalization rates, and survival persist across racial, ethnic, and socioeconomic strata.
* Black individuals experience higher rates of hypertension, early-onset heart failure, and excess hospitalizations compared with White counterparts.
* Clinical care teams should proactively screen for and address **social determinants of health (SDOH)**—including food insecurity, housing instability, transportation barriers, and medication unaffordability—to reduce disparities (Class 1, Level of Evidence B-NR).

''')

    # Table 27 & RT 28
    parts.append(render_table_en('t27-risk-hf-special-populations.json'))
    parts.append(render_rt_en('rt28-disparities-vulnerable-populations.json'))

    # 11.2 Cardio-Oncology
    parts.append(r'''### 11.2 Cardio-Oncology: Cancer Therapy-Related Cardiac Dysfunction
Cancer therapies—including anthracyclines (doxorubicin), HER2 inhibitors (trastuzumab), VEGF inhibitors, and immune checkpoint inhibitors (ICIs)—can induce serious cardiovascular toxicity:
* **Pretreatment and Serial Surveillance (Class 1, Level of Evidence B-NR):** In patients scheduled to receive cardiotoxic chemotherapies, baseline cardiovascular risk stratification, measurement of cardiac biomarkers (troponins and natriuretic peptides), and baseline echocardiography with global longitudinal strain (GLS) are recommended.
* **Primary Prevention in High-Risk Cancer Patients (Class 2a, Level B-R):** In cancer patients with high cardiotoxic risk, cardioprotective therapy with beta-blockers, ACE inhibitors/ARBs, or statins is reasonable during anthracycline treatment.
* **Management of Cancer Therapy-Related LV Dysfunction (Class 1, Level B-NR):** When chemotherapy-induced LV dysfunction (drop in LVEF $\ge 10$ percentage points to $< 50\%$) occurs, guideline-directed medical therapy for HFrEF should be promptly initiated in coordination with the multidisciplinary oncology team.

''')

    # Tables 28, 29 & RT 29
    parts.append(render_table_en('t28-cancer-therapies-cardiomyopathy.json'))
    parts.append(render_table_en('t29-risk-factors-cancer-cardiomyopathy.json'))
    parts.append(render_rt_en('rt29-cardio-oncology.json'))

    # 11.3 Pregnancy and Heart Failure
    parts.append(r'''### 11.3 Heart Failure and Pregnancy (Peripartum Cardiomyopathy)
* **Preconceptional Counseling (Class 1, Level of Evidence C-LD):** Women with pre-existing cardiomyopathy or heart failure should receive specialized preconceptional counseling by a multidisciplinary Cardio-Obstetrics team.
* **Peripartum Cardiomyopathy (PPCM):** Characterized by acute heart failure developing during the final month of pregnancy or within 5 months postpartum in the absence of other identifiable causes.
* **Medication Safety Across Pregnancy:**
  - **Safe Therapies:** Beta-blockers (metoprolol succinate, carvedilol; avoid atenolol), hydralazine, oral nitrates, and loop diuretics (when clinically congested).
  - **Strictly Contraindicated (Class 3: Harm):** ACE inhibitors, ARBs, ARNIs, and mineralocorticoid receptor antagonists are teratogenic and cause severe fetal fetopathy, oligohydramnios, and neonatal renal failure. SGLT2 inhibitors and ivabradine must be avoided due to lack of pregnancy safety data.
* **Delivery Mode:** Vaginal delivery with epidural anesthesia is preferred, with cesarean section reserved for standard obstetric indications.

''')

    # Table 30 & RT 8
    parts.append(render_table_en('t30-hf-management-pregnancy-continuum.json'))
    parts.append(render_rt_en('rt08-special-populations.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 12. Quality Metrics and Clinical Performance Measures</summary><div class="details-content">

### 12.1 Performance Measurement and Quality of Care
Standardized performance measures evaluate the quality of care delivered across inpatient and outpatient heart failure populations:
* **Key Process Metrics:**
  - Prescription of quadruple GDMT (ARNI/ACEi/ARB, beta-blocker, MRA, SGLT2 inhibitor) at discharge in eligible HFrEF patients.
  - LVEF assessment documented in the medical record.
  - Early outpatient follow-up appointment scheduled within 7 to 14 days of discharge.
  - Formal postdischarge transition care plan documented.

''')

    # Table 31 & RT 30
    parts.append(render_table_en('t31-clinical-performance-quality-measures.json'))
    parts.append(render_rt_en('rt30-performance-measurement.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 13. Goals of Care, Palliative Care, and End-of-Life</summary><div class="details-content">

### 13.1 Palliative and Supportive Care, Shared Decision-Making, and End-of-Life
Palliative care should be integrated early alongside curative and life-prolonging therapies across the heart failure trajectory:
* **Early Integration of Palliative Care (Class 1, Level of Evidence A):** Interdisciplinary palliative care consultations should be offered to patients with advanced heart failure to improve symptom burden, enhance quality of life, assist with complex decision-making, and support caregivers.
* **Advance Care Planning (Class 1, Level B-NR):** Clinicians should proactively engage patients and surrogate decision-makers in structured conversations regarding goals of care, preferences for mechanical support, resuscitation status, and designation of durable power of attorney for healthcare.
* **Elective ICD Deactivation (Class 1, Level C-LD):** In terminal Stage D patients or when comfort-focused care is adopted, proactive counseling regarding the deactivation of the shock functionality of an ICD should occur to prevent distressing and painful shocks during dying. Bradycardia pacing functionality may be preserved.

![Figure 15: Clinical Course of Heart Failure With Associated Types and Intensities of Available Therapies Over Time](images/fig15_clinical_course_hf_therapies_over_time.jpg)

''')

    # Table 32 & RT 31
    parts.append(render_table_en('t32-palliative-supportive-care-domains.json'))
    parts.append(render_rt_en('rt31-palliative-supportive-care-end-of-life.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 14. Patient-Reported Outcomes and Evidence Gaps</summary><div class="details-content">

### 14.1 Patient-Reported Outcomes (PROs)
* **Standardized Health Status Instruments (Class 2a, Level of Evidence B-NR):** In patients with heart failure, routine measurement of patient-reported health status using validated, disease-specific instruments—such as the **Kansas City Cardiomyopathy Questionnaire (KCCQ)** or the **Minnesota Living with Heart Failure Questionnaire (MLHFQ)**—is reasonable to quantify symptom burden, physical limitations, social functioning, and monitor response to therapeutic interventions.

''')

    # RT 32
    parts.append(render_rt_en('rt32-patient-reported-outcomes.json'))

    # 14.2 Evidence Gaps & Table 33
    parts.append(r'''### 14.2 Evidence Gaps and Future Research Directions
Major unresolved questions in heart failure epidemiology, pathophysiology, and therapeutics are systematically cataloged across six key domains:

''')

    parts.append(render_table_en('t33-evidence-gaps-future-research.json'))

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/hf_block4_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 4 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
