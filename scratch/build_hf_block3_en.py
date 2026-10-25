# -*- coding: utf-8 -*-
"""
Builder for Chapter 14 - Block 3 (English)
2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure
Sections 8 and 9: Stage D (Advanced HF) and Acute Decompensated HF (pages 60 - 76)
"""

from hf_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Section 8: Stage D (Advanced) Heart Failure
    parts.append(r'''<details class="med-details"><summary>

## 8. Stage D: Advanced Heart Failure</summary><div class="details-content">

Stage D heart failure designates patients with refractory symptoms that severely interfere with daily life and who experience recurrent hospitalizations despite maximally tolerated guideline-directed medical therapy.

### 8.1 Specialty Referral for Advanced Heart Failure
* **Timely Specialty Referral (Class 1, Level of Evidence C-LD):** In patients with advanced heart failure who wish to prolong survival, referral to a specialized multidisciplinary advanced heart failure team is recommended to evaluate eligibility for mechanical circulatory support (MCS), heart transplantation, or palliative care.
* **The "I-NEED-HELP" Clinical Triggers:**
  - **I:** Intravenous inotropes (current or past requirement).
  - **N:** NYHA functional class IIIb/IV symptoms or persistently elevated natriuretic peptides.
  - **E:** End-organ dysfunction (worsening renal or liver function due to hypoperfusion/congestion).
  - **E:** Ejection fraction $\le 20\%$ or severe diastolic dysfunction.
  - **D:** Defibrillator shocks (recurrent appropriate ICD shocks).
  - **H:** Hospitalizations ($\ge 2$ unplanned HF admissions within the past 12 months).
  - **E:** Edema refractory to escalating diuretic regimens.
  - **L:** Low blood pressure (systolic $\text{BP} < 90\text{ mm Hg}$ or symptomatic hypotension).
  - **P:** Prognostic medication down-titration (inability to tolerate beta-blockers, ARNI/ACEi, or MRAs).

''')

    # Tables 16, 17, 18 & RT 15
    parts.append(render_table_en('t16-esc-definition-advanced-hf.json'))
    parts.append(render_table_en('t17-intermacs-profiles.json'))
    parts.append(render_table_en('t18-clinical-indicators-advanced-hf.json'))
    parts.append(render_rt_en('rt15-specialty-referral-advanced-hf.json'))

    # 8.2 Nonpharmacological Management
    parts.append(r'''### 8.2 Nonpharmacological Management in Advanced Heart Failure
* **Fluid Restriction in Hyponatremia:** In patients with advanced heart failure and clinically significant hypervolemic hyponatremia (serum sodium $< 130\text{ mEq/L}$), dietary fluid restriction to **$1.5\text{ to }2.0\text{ L/day}$** is reasonable to alleviate congestive symptoms (Class 2a, Level of Evidence C-LD).

''')

    # RT 16
    parts.append(render_rt_en('rt16-nonpharmacological-advanced-hf.json'))

    # 8.3 Inotropic Support
    parts.append(r'''### 8.3 Inotropic Support in Advanced Heart Failure
* **Cardiogenic Shock and Bridge Therapy (Class 2a, Level of Evidence B-NR):** Continuous intravenous inotropic support (milrinone, dobutamine) is reasonable in Stage D patients refractory to GDMT who present with severe hypoperfusion, symptomatic hypotension, or end-organ hypoperfusion as a bridge to mechanical circulatory support (MCS) or cardiac transplantation.
* **Palliative Inotropic Infusion (Class 2b, Level B-NR):** In select Stage D patients who are ineligible for MCS or transplantation, continuous home intravenous inotropes may be considered for symptom palliation and reduction of repeated hospitalizations as part of a formal palliative care plan.
* **Avoidance of Routine Use (Class 3: Harm):** Routine or intermittent outpatient intravenous inotropes without specific indications are associated with increased mortality due to ventricular tachyarrhythmias and myocardial ischemia.

''')

    # Table 20 & RT 17
    parts.append(render_table_en('t20-inotropic-agents-hf.json'))
    parts.append(render_rt_en('rt17-inotropic-support.json'))

    # 8.4 Mechanical Circulatory Support
    parts.append(r'''### 8.4 Mechanical Circulatory Support (MCS)
* **Durable Left Ventricular Assist Devices (LVAD) (Class 1, Level of Evidence A):** In selected patients with advanced Stage D HFrEF who are dependent on intravenous inotropes or have severe refractory symptoms despite GDMT:
  - **Bridge to Transplantation (BTT):** Recommended to prolong survival and functional capacity while awaiting donor organ availability.
  - **Destination Therapy (DT):** Recommended to prolong survival and improve quality of life in patients who are ineligible for cardiac transplantation (MOMENTUM 3 trial; fully magnetically levitated centrifugal-flow HeartMate 3 device).
* **Temporary MCS in Cardiogenic Shock (Class 2a, Level B-NR):** In patients with Stage D HFrEF presenting in refractory cardiogenic shock with end-organ failure, temporary MCS (e.g., microaxial pump [Impella], venoarterial ECMO, tandem devices) is reasonable as a "bridge to decision" or "bridge to recovery".

''')

    # Table 19 & RT 18
    parts.append(render_table_en('t19-indications-contraindications-mcs.json'))
    parts.append(render_rt_en('rt18-mechanical-circulatory-support.json'))

    # 8.5 Cardiac Transplantation & Summary RT 6
    parts.append(r'''### 8.5 Cardiac Transplantation
* **Orthotopic Cardiac Transplantation (Class 1, Level of Evidence A):** In selected patients with Stage D advanced heart failure who are refractory to medical and device therapies and have no contraindications, cardiac transplantation is recommended to significantly improve survival, exercise capacity, and quality of life.

''')

    # RT 19 & RT 6
    parts.append(render_rt_en('rt19-cardiac-transplantation.json'))
    parts.append(render_rt_en('rt06-advanced-hf.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 9. Patients Hospitalized With Acute Decompensated Heart Failure</summary><div class="details-content">

Acute decompensated heart failure (ADHF) is a frequent cause of emergency presentation and hospitalization, requiring urgent hemodynamic stabilization, decongestion, and structured transitional care.

### 9.1 Initial Assessment of Hospitalized Patients
* **Hemodynamic and Volume Profiling (Class 1, Level of Evidence C-EO):** In all patients admitted with ADHF, bedside evaluation must characterize the hemodynamic profile based on congestion ("wet" vs "dry") and peripheral perfusion ("warm" vs "cold"). The vast majority ($> 90\%$) present as "warm and wet".
* **Identification of Precipitating Factors:** Systematic search for acute triggers—including myocardial ischemia, acute arrhythmias (especially rapid atrial fibrillation), uncontrolled hypertension, medication non-adherence, dietary excess, NSAID use, infection, and worsening renal failure.

''')

    # Table 21 & RT 20
    parts.append(render_table_en('t21-precipitating-factors-hf.json'))
    parts.append(render_rt_en('rt20-assessment-hospitalized-decompensated-hf.json'))

    # 9.2 Maintenance or Optimization of GDMT
    parts.append(r'''### 9.2 Maintenance or Optimization of GDMT During Hospitalization
* **Continuation of Chronic GDMT (Class 1, Level of Evidence B-NR):** In patients with HFrEF hospitalized for ADHF without hemodynamic instability, shock, or symptomatic hypotension, pre-existing GDMT (including beta-blockers, ARNI/ACEi/ARB, MRAs, and SGLT2 inhibitors) should be **continued and not routinely discontinued**.
* **In-Hospital Initiation / Titration (Class 1, Level B-NR):** Hospitalization represents a critical window of opportunity to initiate and titrate foundational GDMT, including ARNI and SGLT2 inhibitors, once patients are stabilized and decongestion is underway (PIONEER-HF, EMPULSE trials).
* **Transient Dose Reduction (Class 2a, Level B-NR):** If severe renal impairment or symptomatic hypotension occurs, temporary dose reduction of RAS inhibitors or beta-blockers may be considered, with prompt reinstatement prior to discharge.

''')

    # RT 21
    parts.append(render_rt_en('rt21-maintenance-optimization-gdmt-hospitalization.json'))

    # 9.3 Inpatient Diuretics: Decongestion Strategy
    parts.append(r'''### 9.3 Diuretics in Hospitalized Patients: Decongestion Strategy
* **Intravenous Loop Diuretics First-Line (Class 1, Level of Evidence B-NR):** Patients admitted with signs of fluid overload should receive prompt intravenous loop diuretics. For patients on chronic outpatient oral loop diuretics, the initial IV dose should be equal to or greater than their home oral daily dose (e.g., $1.0\text{ to }2.5\times$ oral dose in IV milligrams; DOSE-AHF trial).
* **Dynamic Monitoring of Diuretic Response:** Urine output, daily morning weight, clinical signs of congestion, and serum electrolytes must be monitored serial. If diuretic response is inadequate (e.g., spot urine sodium $< 50\text{--}70\text{ mEq/L}$ at 2 hours or urine output $< 100\text{--}150\text{ mL/hr}$), the IV loop diuretic dose should be doubled (Class 1, Level B-NR).
* **Combination Diuresis for Resistance:** Adding a thiazide-type diuretic (metolazone $2.5\text{--}5\text{ mg}$ or IV chlorothiazide $500\text{ mg}$) or initiating an SGLT2 inhibitor is recommended when loop diuresis alone fails to achieve decongestion (Class 2a, Level B-NR).

''')

    # RT 22
    parts.append(render_rt_en('rt22-diuretics-hospitalized-decongestion.json'))

    # 9.4 Vasodilators and VTE Prophylaxis
    parts.append(r'''### 9.4 Vasodilation and VTE Prophylaxis in Hospitalized Heart Failure
* **Parenteral Vasodilation Therapy (Class 2b, Level of Evidence B-NR):** In patients admitted with acute decompensated heart failure and severe hypertension or refractory acute pulmonary edema without systemic hypotension, intravenous vasodilators (nitroglycerin or sodium nitroprusside) may be considered as an adjunct to IV diuretics to reduce preload and afterload.
* **Venous Thromboembolism Prophylaxis (Class 1, Level B-NR):** In patients hospitalized with acute decompensated heart failure without contraindications or ongoing anticoagulation, pharmacological thromboprophylaxis with low-molecular-weight heparin or unfractionated heparin is recommended.

''')

    # RT 23 & RT 24
    parts.append(render_rt_en('rt23-parenteral-vasodilation-hospitalized-hf.json'))
    parts.append(render_rt_en('rt24-vte-prophylaxis-hospitalized-hf.json'))

    # 9.5 Cardiogenic Shock
    parts.append(r'''### 9.5 Evaluation and Management of Cardiogenic Shock
Cardiogenic shock is a life-threatening state of critical end-organ hypoperfusion caused by severe cardiac dysfunction:
* **Multidisciplinary Shock Team Care (Class 2a, Level of Evidence B-NR):** In patients presenting with cardiogenic shock, management by a dedicated multidisciplinary "Shock Team" and early transfer to a high-volume shock center improves survival.
* **Invasive Hemodynamic Monitoring (Class 2a, Level B-NR):** Pulmonary artery catheterization (PAC) is reasonable to guide inotropic, vasopressor, and mechanical circulatory support titration.
* **Pharmacological Support:** Inotropic agents (dobutamine, milrinone) to restore cardiac index and vasopressors (norepinephrine preferred over dopamine) to maintain mean arterial pressure $\ge 65\text{ mm Hg}$.
* **Temporary Mechanical Circulatory Support (Class 2a, Level B-NR):** In patients with refractory cardiogenic shock unresponsive to inotropes/vasopressors, early temporary MCS (Impella, VA-ECMO, TandemHeart) is reasonable to restore systemic perfusion and prevent multi-organ failure.

''')

    # Tables 22, 23, 24 & RT 25
    parts.append(render_table_en('t22-shock-clinical-criteria.json'))
    parts.append(render_table_en('t23-shock-hemodynamic-criteria.json'))
    parts.append(render_table_en('t24-scai-cardiogenic-shock-criteria.json'))
    parts.append(render_rt_en('rt25-cardiogenic-shock-evaluation-management.json'))

    # 9.6 Integration of Care & Summary RT 5
    parts.append(r'''### 9.6 Integration of Care: Transitions and Team-Based Approaches
* **Multidisciplinary Transitional Care (Class 1, Level of Evidence A):** Comprehensive transitional care programs—including postdischarge follow-up within **7 to 14 days**, medication reconciliation, structured telephone contact, and home visits—are recommended to reduce 30-day readmissions and mortality.

''')

    # Table 25, RT 26 & RT 5
    parts.append(render_table_en('t25-transitional-care-plan-components.json'))
    parts.append(render_rt_en('rt26-integration-of-care-transitions.json'))
    parts.append(render_rt_en('rt05-acute-decompensated-hf.json'))

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/hf_block3_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 3 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
