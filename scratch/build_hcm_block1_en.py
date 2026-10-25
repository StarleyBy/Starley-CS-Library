# -*- coding: utf-8 -*-
"""
Builder for Chapter 13 - Block 1 (English)
2024 AHA/ACC/AMSSM/HRS/PACES/SCMR Guideline for the Management of Hypertrophic Cardiomyopathy
Executive Summary, What Is New, Sections 1 to 5 (pages 1 - 15)
"""

from hcm_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Top Take-Home Messages
    parts.append(r'''<details class="med-details"><summary>

## Executive Summary: Top 10 Take-Home Messages</summary><div class="details-content">

1. **Multidisciplinary HCM Centers:** Management at comprehensive and primary hypertrophic cardiomyopathy (HCM) centers with specialized multidisciplinary expertise improves clinical outcomes. Referral is especially recommended for patients with drug-refractory symptoms, complex left ventricular outflow tract (LVOT) anatomy, advanced heart failure, difficult-to-manage arrhythmias, or uncertain risk stratification.
2. **Shared Decision-Making:** Longitudinal shared decision-making is essential across all care pathways—including genetic testing, lifestyle and competitive athletic participation, primary prevention implantable cardioverter-defibrillator (ICD) placement, and invasive septal reduction therapies.
3. **Comprehensive Sudden Cardiac Death (SCD) Risk Assessment:** SCD risk stratification must be performed at initial evaluation and every 1 to 2 years thereafter. Major established clinical risk factors include: massive LV hypertrophy ($\ge 30\text{ mm}$), unexplained recent syncope, family history of premature HCM-related sudden death, LV apical aneurysm, systolic dysfunction (LVEF $< 50\%$), and extensive late gadolinium enhancement (LGE $\ge 15\%$ of LV mass on CMR).
4. **Patient Selection for Primary Prevention ICD:** In adult patients with HCM harboring $\ge 1$ major conventional risk factor, prophylactic ICD implantation is reasonable after an individualized discussion of arrhythmic risk versus device-related complications.
5. **First-Line Pharmacotherapy for Obstructive HCM:** Non-vasodilating beta-blockers titrated to heart rate and symptom response are the first-line pharmacologic agents. Non-dihydropyridine calcium channel blockers (verapamil or diltiazem) are recommended if beta-blockers are ineffective or contraindicated.
6. **Cardiac Myosin Inhibitors (Mavacamten):** In symptomatic patients with obstructive HCM who have persistent NYHA class II to III symptoms despite first-line beta-blockers or calcium channel blockers, the addition of a cardiac myosin inhibitor (mavacamten) is recommended to relieve dynamic LVOT gradient and improve functional class.
7. **Invasive Septal Reduction Therapy (SRT):** In patients with severe, drug-refractory symptoms (NYHA class III–IV or recurrent syncope) and a dynamic peak LVOT gradient $\ge 50\text{ mm Hg}$ (at rest or with provocation), surgical septal myectomy (preferred in younger patients or those with concomitant mitral/cardiac lesions) or alcohol septal ablation (ASA) performed at experienced centers is recommended.
8. **Atrial Fibrillation Management:** Due to the high risk of systemic thromboembolism in HCM, lifelong oral anticoagulation with direct oral anticoagulants (DOACs, preferred over warfarin) is recommended for all patients with clinical or subclinical AF, irrespective of the CHA2DS2-VASc score. Antiarrhythmic drug therapy or catheter ablation is indicated for rhythm control.
9. **Physical Activity and Recreational Exercise:** Mild-to-moderate recreational physical activity is beneficial and strongly encouraged for all individuals with HCM. Participation in competitive sports can be considered after specialized evaluation and comprehensive shared decision-making.
10. **Genetic Testing and Cascade Family Screening:** Genetic testing with a targeted sarcomeric gene panel is recommended for all probands with HCM. Cascade genetic testing should be offered to first-degree relatives when a pathogenic or likely pathogenic variant is identified; clinical screening (ECG and echocardiography) is recommended for all at-risk first-degree relatives.

</div></details>

<details class="med-details"><summary>

## What Is New: Key Practice-Changing Recommendations</summary><div class="details-content">

The 2024 AHA/ACC Guideline updates and expands upon the 2020 recommendations with important practice-changing shifts:
* **Cardiac Myosin Inhibitors (Mavacamten):** Formally introduced as a Class 1 add-on recommendation for symptomatic obstructive HCM after pivotal Phase 3 trials (EXPLORER-HCM and VALOR-HCM) demonstrated dramatic gradient reduction, NYHA class improvement, and deferral/avoidance of surgical septal reduction.
* **Refined SCD Risk Stratification:** Strengthened role of cardiovascular magnetic resonance (CMR) imaging; late gadolinium enhancement (LGE) $\ge 15\%$ and left ventricular apical aneurysms are solidified as major primary prevention ICD triggers.
* **Extended Heart Rhythm Monitoring:** Upgraded from Class 2a to Class 1 in patients deemed high risk for AF (left atrial enlargement, advanced age, or validated risk score) to prevent cardioembolic stroke.
* **Routine Pediatric Stress Testing:** Exercise stress testing is now recommended (Class 1) for all pediatric HCM patients regardless of symptom status to assess functional capacity, dynamic obstruction, and blood pressure response.
* **Universal Anticoagulation in AF:** DOACs are recommended (Class 1) over warfarin for stroke prevention in HCM patients developing AF, confirming that traditional risk scores (CHA2DS2-VASc) significantly underestimate thromboembolic risk in this population.
* **Evolving Stance on Sports Participation:** Shared decision-making allows individualized consideration of competitive athletics for patients with low-risk clinical profiles.

#### Table 1: Key New and Substantially Revised Recommendations in 2024 HCM Guideline

| Clinical Area | 2020 Recommendation & COR | 2024 Updated Recommendation & COR | Clinical Rationale / Impact |
|---|---|---|---|
| **Heart Rhythm Assessment (AF Screening)** | Extended monitoring reasonable (Class 2a) in patients with risk factors (LA dilation, age). | Extended monitoring **recommended (Class 1)** in patients with risk factors or high validated risk score. | Timely detection of subclinical AF allows immediate anticoagulation, averting disabling stroke. |
| **Pediatric Stress Testing** | Consideration in symptomatic pediatric patients. | Exercise stress testing **recommended (Class 1)** in all pediatric patients regardless of symptoms. | Identifies blunted blood pressure response, provoked LVOT gradients, and functional deficits early. |
| **Cardiac Myosin Inhibitors** | Not approved / investigational. | **Recommended (Class 1 / 2a)** in symptomatic obstructive HCM with persistent NYHA II–III symptoms despite beta-blockers/CCBs. | EXPLORER-HCM & VALOR-HCM demonstrated marked LVOTO resolution and reduction in SRT candidacy. |
| **Oral Anticoagulation in AF** | DOACs or Warfarin for AF. | **DOACs recommended over Warfarin (Class 1)** for stroke prevention in all AF, regardless of CHA2DS2-VASc. | Superior efficacy and safety profile with markedly reduced intracranial hemorrhage risk. |
| **Septal Reduction Therapy (SRT)** | Myectomy or ASA for severe refractory symptoms. | Restated Class 1 indication; emphasizing **high-volume multidisciplinary centers** with low procedural mortality ($< 1\%$). | Volume-outcome relationship is paramount for long-term survival, complete gradient relief, and low pacemaker rates. |
| **Athletics & Competitive Sports** | Caution and shared decision-making (Class 2b). | **Class 2a** recommendation for recreational exercise; competitive sports considered via structured shared decision-making. | Removing blanket bans; physical inactivity carries severe independent cardiovascular morbidity. |

#### Table 2: Associated Guidelines and Relevant Statements
* 2020 AHA/ACC Guideline for the Diagnosis and Treatment of Patients With Hypertrophic Cardiomyopathy
* 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure
* 2023 ACC/AHA/ACCP/HRS Guideline for the Diagnosis and Management of Atrial Fibrillation
* 2017 AHA/ACC/HRS Guideline for Management of Patients With Ventricular Arrhythmias and the Prevention of Sudden Cardiac Death
* 2020 ESC Guidelines on Sports Cardiology and Exercise in Patients With Cardiovascular Disease
* 2023 ESC Guidelines for the Management of Cardiomyopathies

</div></details>

<details class="med-details"><summary>

## 1. Introduction: Scope, Methodology, and Recommendation System</summary><div class="details-content">

### 1.1 Scope of the Guideline
Hypertrophic cardiomyopathy (HCM) is the most common monogenic cardiovascular disorder, characterized by unexplained left ventricular hypertrophy in the absence of abnormal loading conditions (e.g., severe aortic stenosis or uncontrolled systemic hypertension). This guideline provides a comprehensive, evidence-based roadmap for clinical diagnosis, advanced multimodality imaging, genetic testing, risk stratification for sudden cardiac death, personalized pharmacotherapy, interventional and surgical septal reduction, and lifelong surveillance.

### 1.2 Class of Recommendation and Level of Evidence

#### Table 3: Applying ACC/AHA Class of Recommendation and Level of Evidence
* **Class 1 (Strong):** Benefit >>> Risk. Treatment/intervention SHOULD be performed.
* **Class 2a (Moderate):** Benefit >> Risk. Treatment/intervention is REASONABLE.
* **Class 2b (Weak):** Benefit $\ge$ Risk. Treatment/intervention MAY BE CONSIDERED.
* **Class 3: No Benefit (Moderate):** Benefit = Risk. Treatment/intervention is NOT recommended (no demonstrated efficacy).
* **Class 3: Harm (Strong):** Risk > Benefit. Treatment/intervention causes HARM and should NOT be performed.

**Levels of Evidence (LOE):**
* **Level A:** High-quality evidence from $> 1$ randomized controlled trial (RCT), or meta-analyses of high-quality RCTs.
* **Level B-R (Randomized):** Moderate-quality evidence from 1 or more RCTs, or meta-analyses of moderate-quality RCTs.
* **Level B-NR (Nonrandomized):** Moderate-quality evidence from 1 or more well-designed nonrandomized studies, observational studies, or registries.
* **Level C-LD (Limited Data):** Randomized or nonrandomized observational or registry studies with limitations of design or execution.
* **Level C-EO (Expert Opinion):** Consensus of expert opinion based on clinical experience.

### 1.3 Abbreviations
* **AF:** Atrial Fibrillation
* **ASA:** Alcohol Septal Ablation
* **CMR:** Cardiovascular Magnetic Resonance
* **COR:** Class of Recommendation
* **CRT:** Cardiac Resynchronization Therapy
* **ECG:** Electrocardiogram
* **HCM:** Hypertrophic Cardiomyopathy
* **HF:** Heart Failure
* **HFpEF:** Heart Failure with Preserved Ejection Fraction
* **HFrEF:** Heart Failure with Reduced Ejection Fraction
* **ICD:** Implantable Cardioverter-Defibrillator
* **LGE:** Late Gadolinium Enhancement
* **LOE:** Level of Evidence
* **LV:** Left Ventricle / Left Ventricular
* **LVEF:** Left Ventricular Ejection Fraction
* **LVOT:** Left Ventricular Outflow Tract
* **LVOTO:** Left Ventricular Outflow Tract Obstruction
* **NYHA:** New York Heart Association
* **SAM:** Systolic Anterior Motion (of the mitral valve)
* **SCD:** Sudden Cardiac Death
* **S-ICD:** Subcutaneous Implantable Cardioverter-Defibrillator
* **SRT:** Septal Reduction Therapy
* **TTE:** Transthoracic Echocardiography

</div></details>

<details class="med-details"><summary>

## 2. Definition, Etiology, Clinical Course, and Natural History</summary><div class="details-content">

### 2.1 Prevalence and Epidemiology
* Hypertrophic cardiomyopathy occurs globally across all racial and ethnic backgrounds with an estimated phenotypic prevalence of approximately **1 in 500** (0.2%) in the general population based on echocardiographic screening.
* When incorporating cardiac magnetic resonance imaging and contemporary genetic cascade screening, the combined prevalence of clinical and subclinical (genotype-positive, phenotype-negative) HCM is estimated at **1 in 200 to 1 in 300** individuals.
* Most affected individuals remain asymptomatic or mildly symptomatic, and modern clinical outcomes demonstrate an annual cardiovascular mortality of $< 1\%$, dispelling historical notions that HCM is uniformly progressive or fatal.

### 2.2 Nomenclature and Differential Diagnosis (Phenocopies)
* The term **Hypertrophic Cardiomyopathy** is defined as left ventricular wall thickness $\ge 15\text{ mm}$ (or $\ge 13\text{ mm}$ with a positive family history or pathogenic gene variant) that cannot be solely explained by abnormal loading conditions.
* In pediatric patients, the diagnosis is established with an LV wall thickness $z\text{-score} \ge 2.0$ or $> 2.5$ standard deviations above the body surface area-adjusted mean.
* **HCM Phenocopies (Mimics):** A crucial step in evaluation is differentiating sarcomeric HCM from systemic disorders that cause secondary myocardial thickening:
  - **Fabry Disease:** X-linked $\alpha$-galactosidase A deficiency; features include neuropathic pain, angiokeratomas, renal dysfunction, and short PR interval.
  - **Cardiac Amyloidosis (ATTR and AL):** Amyloid fibril deposition; marked apical sparing on strain echo, low ECG voltage despite thickened walls, elevated biomarkers.
  - **Danon Disease:** X-linked *LAMP2* deficiency; severe early-onset LV hypertrophy, prominent pre-excitation (WPW), skeletal myopathy, cognitive impairment.
  - **PRKAG2 Cardiomyopathy:** Glycogen storage cardiomyopathy with massive hypertrophy, AV block, and ventricular pre-excitation.
  - **RASopathies (Noonan Syndrome):** Facial dysmorphism, pulmonary valve stenosis, intellectual disability.

### 2.3 Sarcomeric Genetics and Etiology
* Approximately 40% to 60% of probands have an identifiable pathogenic or likely pathogenic variant in genes encoding the cardiac sarcomere, inherited in an **autosomal dominant** pattern with variable penetrance and expression.
* The two most common genes account for $\approx 70\%$ of all gene-positive cases:
  - ***MYH7*:** Encoding cardiac $\beta$-myosin heavy chain (thick filament).
  - ***MYBPC3*:** Encoding cardiac myosin-binding protein C (thick filament regulator).
* Less frequent sarcomeric genes include ***TNNT2*** (cardiac troponin T), ***TNNI3*** (cardiac troponin I), ***TPM1*** ($\alpha$-tropomyosin), ***ACTC1*** (cardiac $\alpha$-actin), ***MYL2*** (regulatory light chain), and ***MYL3*** (essential light chain).
* Non-sarcomeric genetic etiologies and polygenic/epigenetic modifiers contribute to phenotypic expression in gene-negative probands.

### 2.4 Clinical Course and Natural History
The clinical course of HCM encompasses four primary disease pathways:
1. **Normal Longevity / Stable Disease:** The majority of patients experience mild or no symptoms, preserve normal LV systolic function, and achieve a normal life expectancy with guideline-directed medical surveillance.
2. **Dynamic Outflow Obstruction and Exertional Symptoms:** Manifesting as dyspnea, fatigue, angina, and exercise intolerance due to LVOTO, mitral regurgitation, and secondary diastolic filling impairment.
3. **Progressive Heart Failure (End-Stage / Burned-Out HCM):** In approximately 5% to 10% of patients, extensive myocardial fibrosis leads to adverse LV remodeling, progressive wall thinning, cavity dilation, and systolic dysfunction (LVEF $< 50\%$).
4. **Arrhythmias and Sudden Cardiac Death:** Predisposition to ventricular arrhythmias (VT/VF) and atrial fibrillation, requiring systematic risk stratification and proactive rhythm monitoring.

</div></details>

<details class="med-details"><summary>

## 3. Pathophysiology</summary><div class="details-content">

### 3.1 Left Ventricular Outflow Tract Obstruction (LVOTO)
* Dynamic LVOTO is present at rest or with physiological provocation in approximately **two-thirds** of patients with HCM:
  - **Mechanisms:** Characterized by systolic anterior motion (SAM) of the mitral valve leaflets (anterior or posterior) contacting the hypertrophied basal interventricular septum. Venturi forces and flow drag draw elongated mitral leaflets into the high-velocity LVOT stream.
  - **Hemodynamic Thresholds:** A peak instantaneous LVOT gradient **$\ge 30\text{ mm Hg}$** defines dynamic obstruction. A gradient **$\ge 50\text{ mm Hg}$** (at rest or with Valsalva / exercise provocation) is the threshold for hemodynamic significance and guides consideration for invasive septal reduction therapy or cardiac myosin inhibitors.
  - **Dynamic Variability:** The LVOT gradient fluctuates with LV preload, afterload, and myocardial contractility. Dehydration, vasodilators, nitrates, and Valsalva maneuver exacerbate obstruction; volume loading, bradycardia, and increased afterload diminish it.

### 3.2 Diastolic Dysfunction
Diastolic dysfunction is nearly universal in HCM, driven by intrinsic cellular hypercontractility, impaired active myocardial relaxation, myofibrillar disarray, and interstitial collagen fibrosis:
* Decreased left ventricular compliance elevates left ventricular end-diastolic pressure (LVEDP) and causes secondary left atrial hypertension and dilatation.
* Increased left atrial volume index ($> 34\text{ mL/m}^2$) reflects chronically elevated LV filling pressures and strongly predicts risk of atrial fibrillation, stroke, and heart failure hospitalization.

### 3.3 Mitral Regurgitation
* Mitral regurgitation in obstructive HCM is typically **secondary (dynamic)**, resulting from incomplete leaflet coaptation caused by SAM.
* Because the anterior leaflet is pulled anteriorly and medially, the dynamic regurgitant jet is classically directed **posteriorly and laterally** into the left atrium during mid-to-late systole.
* An anteriorly or centrally directed jet should prompt suspicion of intrinsic primary mitral valve pathology (e.g., myxomatous leaflet prolapse, ruptured chordae tendineae, or leaflet calcification), which necessitates surgical repair rather than isolated septal reduction.

### 3.4 Myocardial Ischemia and Microvascular Dysfunction
Myocardial ischemia frequently occurs in the absence of epicardial atherosclerotic coronary artery disease:
* **Microvascular Angina:** Caused by severe coronary microvascular dysfunction, marked intimal hyperplasia and medial hypertrophy of intramural coronary arterioles, and myocardial capillary rarefaction.
* **Demand-Supply Mismatch:** Massive myocardial hypertrophy increases myocardial oxygen demand, while elevated intracavitary systolic pressure, shortened diastole, and prolonged relaxation compress intramural vessels and impair coronary perfusion.
* Repetitive subendocardial ischemia contributes over decades to replacement fibrosis (demonstrated as late gadolinium enhancement on CMR) and adverse ventricular remodeling.

### 3.5 Autonomic Dysfunction
Blunted or abnormal blood pressure responses during exercise (defined as failure to increase systolic blood pressure by $\ge 20\text{ mm Hg}$ or an exertional systolic blood pressure fall $> 20\text{ mm Hg}$) occurs in up to 25% of patients with HCM, reflecting inappropriate peripheral vasodilation and reflex baroreceptor abnormalities.

</div></details>

<details class="med-details"><summary>

## 4. Shared Decision-Making</summary><div class="details-content">

### 4.1 Principles of Patient-Centered Shared Decision-Making
Shared decision-making is a foundational component of quality care in HCM. Because many management choices—including genetic testing, lifestyle adaptations, competitive sports participation, prophylactic ICD placement, and invasive septal reduction therapies—depend on individual risk tolerance, lifestyle preferences, and personal values, a paternalistic model of care is unacceptable:
* Clinicians must ensure full, balanced disclosure of expected benefits, procedural risks, long-term complications, and alternative management strategies.
* Patients and their families should be actively empowered to articulate personal life goals, athletic aspirations, and concerns regarding invasive procedures or device-related restrictions.

''')

    # RT 1
    parts.append(render_rt_en('rt01-shared-decision-making.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 5. Multidisciplinary HCM Centers</summary><div class="details-content">

### 5.1 Care Delivery Model: Comprehensive and Primary HCM Centers
Given the anatomical heterogeneity, complex genetics, and technical demands of invasive interventions, optimal HCM management requires specialized multidisciplinary care teams:
* **Comprehensive HCM Centers:** Advanced tertiary/quaternary academic programs equipped with dedicated HCM cardiologists, multimodality imaging specialists (advanced 3D echocardiography, CMR, cardiac CT), dedicated HCM cardiac surgeons with high surgical myectomy volume ($> 20\text{--}30\text{ procedures/year}$), interventional cardiologists experienced in alcohol septal ablation, cardiovascular geneticists and genetic counselors, and advanced heart failure / electrophysiology teams.
* **Primary HCM Centers:** Regional centers capable of initial clinical evaluation, multimodality imaging, medical therapy optimization, and family cascade screening, maintaining formal collaborative referral pathways to comprehensive centers for complex procedures.
* **Procedural Volumes and Outcomes:** Landmark studies confirm an inverse relationship between institutional/operator volume and procedural mortality/complications. At high-volume surgical myectomy centers, 30-day procedural mortality is consistently $< 1\%$, complete relief of LVOT gradient is achieved in $> 90\%$, and permanent pacemaker dependency is $< 3\%$.

''')

    # Tables 4 & 5, RT 2
    parts.append(render_table_en('t04-competencies-comprehensive-primary-hcm-centers.json'))
    parts.append(render_table_en('t05-targets-invasive-septal-reduction-therapies-outcomes.json'))
    parts.append(render_rt_en('rt02-multidisciplinary-hcm-centers.json'))

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/hcm_block1_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 1 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
