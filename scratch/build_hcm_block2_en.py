# -*- coding: utf-8 -*-
"""
Builder for Chapter 13 - Block 2 (English)
2024 AHA/ACC/AMSSM/HRS/PACES/SCMR Guideline for the Management of Hypertrophic Cardiomyopathy
Section 6: Diagnosis, Initial Evaluation, and Follow-Up (pages 15 - 26)
"""

from hcm_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Section 6: Diagnosis, Initial Evaluation, and Follow-Up
    parts.append(r'''<details class="med-details"><summary>

## 6. Diagnosis, Initial Evaluation, and Follow-Up</summary><div class="details-content">

### 6.1 Clinical Diagnosis and Initial Evaluation
The clinical diagnosis of hypertrophic cardiomyopathy (HCM) is established by identifying unexplained left ventricular hypertrophy (LVH) with cardiac imaging:
* **Diagnostic Thresholds:**
  - In adults: Maximal end-diastolic wall thickness **$\ge 15\text{ mm}$** in any myocardial segment (or **$\ge 13\text{ mm}$** in the presence of a confirmed family history of HCM or a verified pathogenic/likely pathogenic sarcomeric variant) in the absence of secondary causes of hypertrophy.
  - In children: LV wall thickness **$z\text{-score} \ge 2.0$** (or $> 2.5$ standard deviations above body surface area-adjusted mean).
* **Physical Examination:** A harsh, crescendo-decrescendo systolic murmur at the left sternal border that characteristically **accentuates** with maneuvers decreasing LV preload or afterload (Valsalva strain phase, abrupt standing) and **attenuates** with maneuvers increasing preload or afterload (passive leg raise, squatting, handgrip).

''')

    # RT 3 & Table 6
    parts.append(render_rt_en('rt03-clinical-diagnosis.json'))
    parts.append(render_table_en('t06-clinical-features-hcm-phenocopies.json'))

    # 6.2 Echocardiography
    parts.append(r'''### 6.2 Echocardiography
Transthoracic echocardiography (TTE) is the primary first-line imaging modality for diagnosis, hemodynamic characterization, and longitudinal follow-up:
* **Comprehensive Baseline TTE:** Recommended for all patients with suspected or confirmed HCM (Class 1, Level of Evidence B-NR). Essential elements include:
  - Accurate measurement of maximal LV wall thickness across all segments from base to apex;
  - Evaluation of systolic anterior motion (SAM) of the mitral valve;
  - Quantification of resting and provoked left ventricular outflow tract (LVOT) gradients using continuous-wave Doppler;
  - Assessment of mitral regurgitation severity and jet direction (posterolaterally directed secondary MR vs central/anterior organic MR);
  - Determination of left atrial volume index ($> 34\text{ mL/m}^2$) and LV diastolic filling parameters;
  - Identification of right ventricular hypertrophy, apical pouching, or apical aneurysm.
* **Provocative Maneuvers for Latent Obstruction:** If the resting LVOT gradient is $< 50\text{ mm Hg}$, physiological provocation (Valsalva maneuver in sitting and standing positions) should be performed routinely. In symptomatic patients with gradients $< 50\text{ mm Hg}$ despite bedside maneuvers, **exercise stress echocardiography** is strongly recommended (Class 1, Level B-NR). Pharmacological provocation with dobutamine is not recommended because of non-physiological inotropic and chronotropic responses.
* **Periodic Surveillance TTE:** Recommended every **1 to 2 years** in clinically stable patients, and promptly upon any change in clinical status or new cardiovascular symptoms (Class 1, Level B-NR).

''')

    # RT 4
    parts.append(render_rt_en('rt04-echocardiography.json'))

    # 6.3 CMR Imaging
    parts.append(r'''### 6.3 Cardiovascular Magnetic Resonance (CMR) Imaging
CMR imaging has emerged as an indispensable cornerstone for definitive diagnosis, phenotypic characterization, and risk stratification in HCM:
* **Indications for Baseline CMR:** Recommended in all patients with HCM when available (Class 1, Level of Evidence B-NR). CMR provides superior spatial and contrast resolution, particularly in segments poorly visualized by echocardiography (anterolateral free wall, apex, posterior septum).
* **Late Gadolinium Enhancement (LGE):** Quantifying myocardial fibrosis using LGE is a critical determinant of arrhythmic risk:
  - Extensive LGE involving **$\ge 15\%$** of total LV mass is an established major risk factor for sudden cardiac death (SCD) and supports primary prevention ICD implantation.
  - Patchy mid-wall LGE located at the junctions of the interventricular septum and right ventricular free wall is the classic hallmark of sarcomeric HCM.
* **Apical Aneurysm Detection:** CMR has substantially higher sensitivity than echocardiography for detecting small-to-medium **left ventricular apical aneurysms**, which confer high risks of both thromboembolism and monomorphic ventricular tachycardia.
* **Differentiating Phenocopies:** CMR tissue characterization (T1/T2 mapping, extracellular volume fraction [ECV]) is invaluable for distinguishing HCM from cardiac amyloidosis (diffuse subendocardial LGE, markedly elevated ECV), Fabry disease (low native myocardial T1, inferolateral basal LGE), and athlete's heart (homogeneous physiologic remodeling without LGE).

''')

    # RT 5
    parts.append(render_rt_en('rt05-cmr-imaging.json'))

    # 6.4 Cardiac CT
    parts.append(r'''### 6.4 Cardiac Computed Tomography (CT)
* In patients with confirmed or suspected HCM who have inadequate acoustic windows on echocardiography and absolute contraindications to CMR (e.g., non-conditional metallic implants, severe claustrophobia), **cardiac CT** is reasonable for anatomical evaluation of wall thickness, cavity geometry, and apical aneurysm identification (Class 2a, Level of Evidence B-NR).
* Cardiac CT angiography is also valuable for evaluating coronary artery anatomy and septal perforator branches prior to invasive septal reduction therapies.

''')

    # RT 7
    parts.append(render_rt_en('rt07-cardiac-ct.json'))

    # 6.5 Heart Rhythm Assessment
    parts.append(r'''### 6.5 Heart Rhythm Assessment
Cardiac arrhythmias are major determinants of morbidity and mortality in HCM:
* **Ambulatory ECG Monitoring:** Continuous 24- to 48-hour ambulatory Holter monitoring is recommended at baseline evaluation for all patients with HCM to screen for asymptomatic non-sustained ventricular tachycardia (NSVT) and subclinical atrial fibrillation (Class 1, Level of Evidence B-NR).
* **Extended Rhythm Monitoring in High-Risk Patients:** In patients with clinical risk factors for atrial fibrillation (left atrial enlargement, age $\ge 65$, elevated filling pressures) or validated high AF risk scores who are eligible for anticoagulation, **extended ambulatory patch monitoring** (1 to 2 weeks) is recommended as part of initial evaluation and annual follow-up (Class 1, Level B-NR).
* **Symptom-Driven Monitoring:** In patients experiencing recurrent palpitations, presyncope, or unexplained lightheadedness, extended monitoring with patch monitors, external event recorders, or implantable loop recorders (ILRs) is indicated.

''')

    # RT 6
    parts.append(render_rt_en('rt06-heart-rhythm-assessment.json'))

    # 6.6 Angiography and Invasive Hemodynamics
    parts.append(r'''### 6.6 Angiography and Invasive Hemodynamic Assessment
* **Invasive Hemodynamics:** Cardiac catheterization with simultaneous left ventricular and ascending aortic pressure measurements is indicated when noninvasive imaging yields discordant or ambiguous findings regarding the presence or severity of dynamic LVOT obstruction in symptomatic patients (Class 1, Level of Evidence B-NR).
* **Provocative Catheterization:** Provocation with post-extrasystolic beat (Brockenbrough-Braunwald-Morrow sign: drop in pulse pressure with increase in LV systolic pressure following a PVC) or isoproterenol infusion can confirm dynamic intracavitary gradients.
* **Coronary Angiography:** Invasive coronary angiography or coronary CT angiography is indicated in patients $\ge 40$ years of age or those with ischemic chest pain, and is mandatory prior to surgical myectomy or alcohol septal ablation to delineate septal perforator coronary branch anatomy.

''')

    # RT 8
    parts.append(render_rt_en('rt08-angiography-invasive-hemodynamic-assessment.json'))

    # 6.7 Exercise Stress Testing
    parts.append(r'''### 6.7 Exercise Stress Testing
* **Functional Capacity and Prognosis:** Symptom-limited exercise treadmill testing or cardiopulmonary exercise testing (CPET) is recommended to objectively quantify functional capacity ($V\text{O}_2\text{ peak}$), assess subclinical functional limitation, and establish safe exercise boundaries (Class 1, Level of Evidence B-NR).
* **Pediatric Stress Testing (New Class 1):** In pediatric patients with HCM, regardless of symptom status, exercise stress testing is recommended to assess functional capacity, hemodynamic response, and prognostic risk.
* **Blood Pressure Response:** Failure to increase systolic blood pressure by $\ge 20\text{ mm Hg}$ or a fall in systolic blood pressure during progressive exercise indicates abnormal vascular regulation and serves as a contributory risk marker for SCD.

''')

    # RT 9
    parts.append(render_rt_en('rt09-exercise-stress-testing.json'))

    # 6.8 Genetics and Family Screening
    parts.append(r'''### 6.8 Genetics and Family Screening
Genetic evaluation provides definitive molecular diagnosis and enables cascade evaluation of at-risk relatives:
* **Pre- and Post-Test Genetic Counseling:** Expert counseling by a cardiovascular geneticist or genetic counselor is recommended for all patients undergoing genetic testing (Class 1, Level of Evidence B-NR).
* **Proband Genetic Testing:** Targeted next-generation sequencing panel testing of sarcomeric genes (*MYH7, MYBPC3, TNNT2, TNNI3, TPM1, ACTC1, MYL2, MYL3*) and major phenocopy genes (*GLA, PRKAG2, LAMP2, TTR*) is recommended for all probands with HCM (Class 1, Level B-NR).
* **Cascade Genetic Testing:** When a pathogenic or likely pathogenic (P/LP) variant is identified in the proband, predictive cascade genetic testing should be offered to all first-degree relatives (Class 1, Level B-NR). Relatives testing negative for the familial P/LP variant can be safely discharged from longitudinal clinical surveillance.
* **Clinical Screening of Relatives:** In first-degree relatives of probands with HCM (or when genetic testing is non-informative or unavailable), longitudinal clinical screening with 12-lead ECG and 2D echocardiography is recommended:
  - **Children and Adolescents:** Every 1 to 2 years starting by age 8 to 10 years (or annually during pubertal growth spurts).
  - **Adult Relatives:** Every 3 to 5 years (or sooner if symptoms develop).

![Figure 1: Recommended Evaluation and Testing for HCM](images/fig01_recommended_evaluation_testing_hcm.jpg)

![Figure 2: Genetic Testing Process in HCM](images/fig02_genetic_testing_process_hcm.jpg)

''')

    # Table 7 & RT 10
    parts.append(render_table_en('t07-screening-ecg-echo-asymptomatic-family-members.json'))
    parts.append(render_rt_en('rt10-genetics-family-screening.json'))

    # 6.9 Genotype-Positive, Phenotype-Negative Individuals
    parts.append(r'''### 6.9 Individuals Who Are Genotype-Positive, Phenotype-Negative
Individuals who inherit a familial sarcomeric P/LP variant but do not manifest left ventricular hypertrophy or other phenotypic criteria are classified as **genotype-positive, phenotype-negative (G+/P-)**:
* **Longitudinal Surveillance:** Periodic clinical evaluation with 12-lead ECG and echocardiography every 2 to 3 years in children and every 3 to 5 years in adults is recommended to detect delayed phenotypic emergence (Class 1, Level of Evidence B-NR).
* **No Prophylactic Pharmacotherapy:** Prophylactic administration of beta-blockers, calcium channel blockers, or other medications is **not recommended** to prevent the development of hypertrophy (Class 3: No Benefit, Level B-R; VANISH trial).
* **Unrestricted Lifestyle:** G+/P- individuals should be reassured that they do not have clinical cardiomyopathy, have an excellent prognosis, and should not be restricted from competitive athletics or recreational sports in the absence of phenotypic expression.

''')

    # RT 11
    parts.append(render_rt_en('rt11-genotype-positive-phenotype-negative.json'))

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/hcm_block2_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 2 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
