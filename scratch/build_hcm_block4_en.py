# -*- coding: utf-8 -*-
"""
Builder for Chapter 13 - Block 4 (English)
2024 AHA/ACC/AMSSM/HRS/PACES/SCMR Guideline for the Management of Hypertrophic Cardiomyopathy
Sections 9 and 10 (pages 45 - 51)
"""

from hcm_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Section 9: Lifestyle Considerations for Patients With HCM
    parts.append(r'''<details class="med-details"><summary>

## 9. Lifestyle Considerations for Patients With HCM</summary><div class="details-content">

### 9.1 Recreational Physical Activity and Competitive Sports
Historically, individuals diagnosed with HCM were broadly restricted from vigorous exercise due to concerns about exercise-triggered sudden cardiac death. Contemporary evidence demonstrates that physical inactivity carries substantial adverse cardiovascular and metabolic risks, and that individualized exercise prescriptions are safe and beneficial:
* **Mild-to-Moderate Recreational Exercise:** Regular, low-to-moderate intensity physical activity (e.g., brisk walking, cycling, lap swimming, light jogging) is strongly recommended for all patients with HCM to maintain cardiorespiratory fitness, improve quality of life, and reduce metabolic morbidity (Class 1, Level of Evidence B-NR).
* **Vigorous Recreational Exercise and Competitive Sports:**
  - In individuals with HCM, participation in competitive sports or high-intensity athletic activities may be considered after a comprehensive clinical evaluation by an expert HCM specialist and a structured shared decision-making dialogue (Class 2a, Level of Evidence B-NR).
  - Landmark registry data (e.g., the prospective LIVE-HCM study of $> 1{,}600$ patients) demonstrated that individuals engaging in vigorous exercise or competitive sports had rates of death or life-threatening ventricular arrhythmias comparable to those engaging in moderate or non-vigorous exercise.
  - An individualized risk assessment must evaluate: history of syncope, dynamic LVOT obstruction, presence of an ICD, high-risk genetic mutations, and degree of myocardial hypertrophy.
* **Genotype-Positive, Phenotype-Negative (G+/P-):** Individuals who carry a pathogenic sarcomeric variant but exhibit no clinical or imaging signs of hypertrophy should not be restricted from competitive sports or vigorous physical activities (Class 3: No Benefit / Restriction Not Recommended, Level B-NR).

''')

    # RT 22
    parts.append(render_rt_en('rt22-recreational-physical-activity-competitive-sports.json'))

    # 9.2 Occupation in Patients With HCM
    parts.append(r'''### 9.2 Occupation in Patients With HCM
* **Individualized Occupational Assessment:** Most individuals with HCM can safely pursue their chosen professions. Comprehensive evaluation of functional capacity, dynamic symptoms, and arrhythmic risk should guide employment fitness (Class 1, Level of Evidence B-NR).
* **High-Risk Safety-Critical Occupations:** Specific regulatory restrictions apply to commercial airline pilots, commercial motor vehicle operators, military combat personnel, and high-hazard industrial positions:
  - Regulatory standards (e.g., Federal Aviation Administration [FAA], Federal Motor Carrier Safety Administration [FMCSA]) must be adhered to.
  - Patients should be counseled that heavy manual labor involving extreme burst isometric straining, rapid dehydration, or heat stress can exacerbate dynamic LVOT obstruction and provoke presyncope or syncope.

''')

    # RT 23
    parts.append(render_rt_en('rt23-occupation-in-hcm.json'))

    # 9.3 Pregnancy in Patients With HCM
    parts.append(r'''### 9.3 Pregnancy in Patients With HCM
Most women with HCM have favorable maternal and fetal outcomes when managed by a multidisciplinary Cardio-Obstetrics team:
* **Preconceptional Counseling:** Women of childbearing potential should receive comprehensive preconception counseling regarding maternal cardiac risks, inheritable genetic transmission (50% risk of transmitting autosomal dominant sarcomeric variants), and teratogenic medications (Class 1, Level of Evidence B-NR).
* **Multidisciplinary Team Care:** Pregnant patients with HCM should be managed collaboratively by cardiologists with HCM expertise, maternal-fetal medicine specialists, and obstetric anesthesiologists (Class 1, Level B-NR).
* **High-Risk Features:** Women with pre-existing severe symptoms (NYHA class III–IV), resting LVOT gradients $> 50\text{ mm Hg}$, LVEF $< 50\%$, or active atrial/ventricular arrhythmias have elevated risks of pulmonary edema and heart failure decompensation during late pregnancy and delivery.
* **Pharmacological Safety in Pregnancy:**
  - **Beta-Blockers:** Metoprolol or propranolol are the preferred agents for symptom management and rate control. **Atenolol must be avoided** due to documented associations with fetal growth restriction.
  - **Contraindicated Medications (Class 3: Harm):** ACE inhibitors, ARBs, ARNIs, and mineralocorticoid receptor antagonists are strictly contraindicated due to fetal fetopathy and renal agenesis.
  - **Cardiac Myosin Inhibitors (Mavacamten):** Teratogenic in animal models; mavacamten **must not be administered during pregnancy or breastfeeding**, and effective contraception is mandatory in women of childbearing potential.
* **Labor and Delivery:** Vaginal delivery with effective regional (epidural) anesthesia is recommended as the preferred mode of delivery, reserving cesarean section for standard obstetric indications (Class 1, Level B-NR). Epidural anesthesia must be carefully titrated to avoid abrupt vasodilation and hypotension.

''')

    # RT 24
    parts.append(render_rt_en('rt24-pregnancy-in-hcm.json'))

    # 9.4 Patients With Comorbidities
    parts.append(r'''### 9.4 Patients With Comorbidities
Concurrent medical comorbidities interact synergistically with HCM pathology and require aggressive optimization:
* **Systemic Hypertension:** Present in $> 50\%$ of adult patients with HCM. Uncontrolled hypertension accelerates secondary concentric hypertrophy, worsens diastolic dysfunction, and increases stroke risk. First-line antihypertensive therapy should utilize beta-blockers or non-dihydropyridine calcium channel blockers. If additional agents are required, ACE inhibitors, ARBs, or mineralocorticoid receptor antagonists can be carefully introduced in nonobstructive patients. Vasodilating agents (dihydropyridines, nitrates) should be avoided in obstructive physiology.
* **Obesity:** Excess adiposity dramatically increases left ventricular mass, worsens exertional dyspnea, and markedly escalates the incidence of atrial fibrillation and dynamic LVOTO. Structured lifestyle interventions, dietary counseling, and supervised exercise are recommended (Class 1, Level B-NR).
* **Obstructive Sleep Apnea (OSA):** Highly prevalent in patients with HCM. OSA increases nocturnal sympathetic surges, promotes systemic hypertension, and triggers atrial and ventricular arrhythmias. Routine screening for snoring, daytime somnolence, and nocturnal gasping, with subsequent polysomnography and continuous positive airway pressure (CPAP) therapy, is recommended (Class 1, Level B-NR).

''')

    # RT 25
    parts.append(render_rt_en('rt25-patients-with-comorbidities.json'))

    parts.append(r'''</div></details>

<details class="med-details"><summary>

## 10. Evidence Gaps and Future Directions</summary><div class="details-content">

Despite transformative advancements in the understanding and management of hypertrophic cardiomyopathy, several pivotal clinical and biological questions remain unanswered:
1. **Refining the Diagnosis of HCM:** Developing machine learning algorithms and advanced automated echocardiographic/CMR strain metrics to distinguish early sarcomeric HCM from physiological athlete's heart and non-sarcomeric phenocopies with high specificity.
2. **Developing Disease-Modifying Therapies:** Determining whether early initiation of cardiac myosin inhibitors or next-generation small-molecule allosteric modulators in young patients or genotype-positive, phenotype-negative individuals can prevent the development or progression of hypertrophy, interstitial fibrosis, and diastolic dysfunction (e.g., ongoing gene-silencing, CRISPR base-editing, and AAV-mediated gene therapy platforms).
3. **Improving Care for Nonobstructive HCM:** While obstructive HCM has effective medical and surgical options, nonobstructive HCM remains an area of significant unmet therapeutic need. Novel therapies targeting myocardial energetics, microvascular ischemia, and advanced antifibrotic pathways are urgently needed.
4. **Improving and Expanding SCD Risk Stratification:** Enhancing risk algorithms in intermediate-risk adults and pediatric populations by integrating polygenic risk scores, serum circulating biomarkers, high-resolution CMR parametric mapping (ECV and diffuse interstitial fibrosis), and artificial intelligence-augmented electrocardiography.
5. **Arrhythmia Management:** Refining catheter ablation strategies for atrial fibrillation and ventricular tachycardia in structurally abnormal, fibrotic ventricles; determining the role of left atrial appendage closure devices in stroke prevention; and identifying optimal pharmacotherapies for preventing post-ablation recurrent arrhythmias.
6. **Expanding Understanding of Genetic Architecture:** Deciphering the genetic and epigenetic determinants of incomplete penetrance, variable phenotypic expression, and non-sarcomeric disease; identifying protective genetic modifiers that prevent severe hypertrophy in individuals harboring high-risk sarcomeric mutations.

</div></details>
''')

    full_text = '\n\n'.join(parts)
    with open('scratch/hcm_block4_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 4 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
