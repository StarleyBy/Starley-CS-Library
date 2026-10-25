# -*- coding: utf-8 -*-
"""
Builder for Chapter 14 - Block 2 (English)
2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure
Section 7: Stage C Heart Failure (pages 29 - 60)
"""

from hf_helpers import render_rt_en, render_table_en

def build():
    parts = []

    # Section 7: Stage C Heart Failure
    parts.append(r'''<details class="med-details"><summary>

## 7. Stage C Heart Failure: Symptomatic Heart Failure</summary><div class="details-content">

Stage C designates patients with current or prior symptoms of heart failure caused by structural and/or functional cardiac abnormalities. Management depends upon phenotypic classification according to LVEF.

### 7.1 Nonpharmacological Interventions

#### 7.1.1 Self-Care Support in Heart Failure
Self-care support is an essential component of comprehensive heart failure management:
* **Multidisciplinary Education:** Patients with heart failure should receive specific education and support on symptom monitoring (daily morning weights), flexible diuretic adjustments, low-sodium dietary habits, medication adherence, and early recognition of decompensation (Class 1, Level of Evidence A).

#### Table 11: Potential Barriers to Effective HF Self-Care and Example Interventions
* **Cognitive Impairment / Depression:** Structured pill organizers, caregiver involvement, simplified once-daily regimens, routine depression screening.
* **Low Health Literacy / Language Barriers:** Culturally tailored bilingual visual aids, "teach-back" educational methodology.
* **Financial and Transportation Hardships:** Social work consultation, patient assistance drug programs, telehealth monitoring.
* **Complex Polypharmacy:** Multidisciplinary pharmacist-led medication reconciliation and protocolized uptitration.

#### 7.1.2 Dietary Sodium Restriction
* In patients with Stage C heart failure, avoiding excessive sodium intake (generally targeting **$< 2{,}000\text{ to }3{,}000\text{ mg/day}$**) is reasonable to reduce congestive symptoms and prevent volume overload (Class 2a, Level of Evidence C-LD).
* Extremely strict sodium restriction ($< 1{,}500\text{ mg/day}$) is **not recommended** because it may activate neurohormonal cascades (renin-angiotensin-aldosterone and sympathetic nervous system) and impair nutritional intake without conferring clinical benefit.

#### 7.1.3 Physical Activity, Exercise Prescription, and Cardiac Rehabilitation
* In patients with stable Stage C heart failure who are able to participate, regular aerobic exercise training or formal enrollment in a supervised **cardiac rehabilitation program** is recommended to improve functional capacity, exercise duration, and health-related quality of life, and to reduce hospitalizations (Class 1, Level of Evidence A; HF-ACTION trial).

### 7.2 Diuretics and Decongestion Strategies in Patients With Heart Failure
* **Loop Diuretics for Congestion:** In patients with Stage C heart failure who have evidence of fluid retention, loop diuretics (furosemide, bumetanide, torsemide) are recommended to achieve and maintain euvolemia (Class 1, Level of Evidence B-NR).
* **Diuretic Titration:** Diuretic dosing should be dynamically titrated to achieve decongestion with the lowest effective dose necessary to avoid neurohormonal activation, intravascular volume depletion, and worsening renal function.
* **Combination Diuretic Therapy for Resistance:** In patients with refractory congestion despite high doses of loop diuretics, the addition of a second diuretic with a complementary site of tubular action (e.g., metolazone, oral chlorothiazide, or IV chlorothiazide) is reasonable (Class 2a, Level B-NR).

#### Table 12: Commonly Used Oral Diuretics in the Treatment of Heart Failure
* **Furosemide:** Initial dose $20\text{--}40\text{ mg}$ once or twice daily; maximum daily dose $600\text{ mg}$; oral bioavailability $10\%\text{--}90\%$ (erratic/food-dependent); duration of action 6–8 hours.
* **Bumetanide:** Initial dose $0.5\text{--}1.0\text{ mg}$ once or twice daily; maximum daily dose $10\text{ mg}$; oral bioavailability $80\%\text{--}100\%$; duration of action 4–6 hours.
* **Torsemide:** Initial dose $10\text{--}20\text{ mg}$ once daily; maximum daily dose $200\text{ mg}$; oral bioavailability $80\%\text{--}100\%$ (consistent/predictable); duration of action 12–16 hours.
* **Metolazone:** Initial dose $2.5\text{ mg}$ once daily; maximum daily dose $20\text{ mg}$; acts on distal convoluted tubule; synergistic when co-administered with loop diuretics.
* **Spironolactone / Eplerenone (as diuretic adjunct):** Doses of $25\text{--}50\text{ mg}$ daily provide distal nephron sodium blockade and potassium sparing.

### 7.3 Pharmacological Treatment for HFrEF (The Four Pillars of GDMT)
Guideline-directed medical therapy (GDMT) for patients with HFrEF ($\text{LVEF} \le 40\%$) is anchored on **four foundational medication classes** that independently reduce all-cause mortality and heart failure hospitalizations:

![Figure 6: Treatment of HFrEF Stages C and D](images/fig06_treatment_hfref_stages_c_d.jpg)

#### 7.3.1 Renin-Angiotensin System Inhibition: ARNI, ACEi, or ARB
1. **ARNI (Sacubitril/Valsartan) as Preferred First-Line (Class 1, Level of Evidence A):** In patients with chronic symptomatic HFrEF (NYHA class II–III), treatment with an ARNI is recommended to reduce cardiovascular mortality and heart failure hospitalizations.
   - In the PARADIGM-HF trial ($n=8{,}442$), sacubitril/valsartan reduced cardiovascular death by 20%, HF hospitalization by 21%, and all-cause mortality by 16% compared with enalapril ($10\text{ mg}$ twice daily).
   - In the PIONEER-HF and TRANSITION trials, in-hospital initiation of ARNI in stabilized acute decompensated HFrEF patients was safe, well-tolerated, and reduced postdischarge cardiovascular death and rehospitalizations.
   - **Switching from ACEi to ARNI (Class 3: Harm):** ARNI must not be administered within **36 hours** of the last dose of an ACE inhibitor to prevent severe angioedema. ARNI is contraindicated in patients with any history of hereditary or ACEi-associated angioedema.
2. **ACE Inhibitors (Class 1, Level A):** When ARNI is not feasible or affordable, an ACE inhibitor (enalapril, lisinopril, ramipril) is recommended to reduce morbidity and mortality (CONSENSUS, SOLVD Treatment).
3. **Angiotensin Receptor Blockers (Class 1, Level A):** Recommended in patients intolerant of ACE inhibitors due to intractable cough, or when ARNI is not feasible (CHARM-Alternative, Val-HeFT).

#### 7.3.2 Beta-Blockers
* In patients with HFrEF and current or previous symptoms, evidence-based beta-blockers—specifically **bisoprolol, carvedilol, or sustained-release metoprolol succinate**—are recommended to reduce mortality and hospitalizations (Class 1, Level of Evidence A; CIBIS-II, COPERNICUS, MERIT-HF).
* Beta-blockers should be initiated in clinically stable, euvolemic patients at very low starting doses and uptitrated every 2 to 4 weeks toward target trial doses.

#### 7.3.3 Mineralocorticoid Receptor Antagonists (MRAs)
* In patients with HFrEF (NYHA class II–IV, LVEF $\le 35\%$), treatment with an MRA (**spironolactone** or **eplerenone**) is recommended to reduce all-cause mortality, cardiovascular death, and hospitalizations (Class 1, Level of Evidence A; RALES, EMPHASIS-HF).
* **Monitoring Requirements:** Baseline serum potassium must be $< 5.0\text{ mEq/L}$ and estimated GFR $> 30\text{ mL/min/1.73 m}^2$. Serum potassium and renal function must be monitored closely at 1, 4, 8, and 12 weeks following initiation or dose escalation, and every 6 months thereafter.

#### 7.3.4 Sodium-Glucose Cotransporter-2 (SGLT2) Inhibitors
* In patients with symptomatic chronic HFrEF, an SGLT2 inhibitor (**dapagliflozin $10\text{ mg}$ once daily** or **empagliflozin $10\text{ mg}$ once daily**) is recommended to reduce cardiovascular mortality and heart failure hospitalizations, **regardless of the presence of type 2 diabetes mellitus** (Class 1, Level of Evidence A).
  - In DAPA-HF ($n=4{,}744$), dapagliflozin reduced the primary composite endpoint of worsening HF or CV death by 26% (HR 0.74, 95% CI 0.65–0.85; $P<0.001$) with identical benefits in diabetic and non-diabetic cohorts.
  - In EMPEROR-Reduced ($n=3{,}730$), empagliflozin reduced CV death or HF hospitalization by 25% (HR 0.75, 95% CI 0.65–0.86; $P<0.001$) and slowed the rate of renal function decline.
  - SGLT2 inhibitors demonstrate immediate hemodynamic decongestion, do not require blood pressure or potassium titration, and can be initiated safely during hospital admission or early outpatient care.

#### 7.3.5 Hydralazine and Isosorbide Dinitrate
* In self-identified Black/African American patients with HFrEF (NYHA class III–IV) receiving optimal therapy with beta-blockers, MRAs, and RAS inhibitors, the addition of **hydralazine and isosorbide dinitrate** is recommended to reduce mortality and hospitalizations (Class 1, Level of Evidence A; A-HeFT trial).
* In patients with HFrEF unable to tolerate any RAS inhibitor or ARNI due to severe renal impairment, hyperkalemia, or bilateral renal artery stenosis, the combination of hydralazine and isosorbide dinitrate is reasonable (Class 2b, Level C-LD).

#### 7.3.6 Other Medical Therapies for HFrEF
* **Ivabradine (Class 2a, Level of Evidence B-R):** In symptomatic HFrEF patients with LVEF $\le 35\%$ in normal sinus rhythm with a resting heart rate **$\ge 70\text{ bpm}$** despite maximally tolerated beta-blocker therapy (or who have beta-blocker contraindications), ivabradine is reasonable to reduce HF hospitalizations and cardiovascular mortality (SHIFT trial).
* **Vericiguat (Soluble Guanylyl Cyclase Stimulator, Class 2b, Level B-R):** In high-risk patients with symptomatic HFrEF and recent heart failure hospitalization or elevated natriuretic peptides despite quadruple GDMT, vericiguat ($10\text{ mg}$ daily) may be considered to reduce HF hospitalizations and CV death (VICTORIA trial).
* **Digoxin (Class 2b, Level B-R):** In patients with persistent HFrEF symptoms despite GDMT, low-dose digoxin (targeting serum concentration $0.5\text{--}0.9\text{ ng/mL}$) may be considered to reduce HF hospitalizations (DIG trial).

![Figure 7: Additional Medical Therapies for Patients With HFrEF](images/fig07_additional_medical_therapies_hfref.jpg)

#### Table 13: Selected Prescription Medications That May Cause or Exacerbate Heart Failure (Class 3: Harm)
* **Non-Dihydropyridine Calcium Channel Blockers (Diltiazem, Verapamil):** Negative inotropes; exacerbate HFrEF and increase mortality.
* **Nonsteroidal Anti-Inflammatory Drugs (NSAIDs & COX-2 Inhibitors):** Inhibit renal prostaglandins, cause sodium retention, blunt diuretic efficacy, worsen renal function, and precipitate acute HF decompensation.
* **Thiazolidinediones (Rosiglitazone, Pioglitazone):** Cause fluid retention and significantly increase heart failure hospitalizations.
* **Class I and Class III Antiarrhythmic Drugs (Except Amiodarone and Dofetilide):** Dronedarone, flecainide, and sotalol increase mortality in HFrEF due to negative inotropy and proarrhythmia.

#### Table 14: Recommended Dosing and Uptitration Targets for Four Pillars of GDMT in HFrEF
* **Sacubitril/Valsartan (ARNI):** Starting dose $24/26\text{ mg}$ or $49/51\text{ mg}$ BID; target dose $97/103\text{ mg}$ BID.
* **Enalapril:** Starting dose $2.5\text{ mg}$ BID; target dose $10\text{--}20\text{ mg}$ BID.
* **Lisinopril:** Starting dose $2.5\text{--}5.0\text{ mg}$ daily; target dose $20\text{--}40\text{ mg}$ daily.
* **Carvedilol:** Starting dose $3.125\text{ mg}$ BID; target dose $25\text{ mg}$ BID (or $50\text{ mg}$ BID for weight $> 85\text{ kg}$).
* **Metoprolol Succinate:** Starting dose $12.5\text{--}25\text{ mg}$ daily; target dose $200\text{ mg}$ daily.
* **Bisoprolol:** Starting dose $1.25\text{ mg}$ daily; target dose $10\text{ mg}$ daily.
* **Spironolactone:** Starting dose $12.5\text{--}25\text{ mg}$ daily; target dose $25\text{--}50\text{ mg}$ daily.
* **Eplerenone:** Starting dose $25\text{ mg}$ daily; target dose $50\text{ mg}$ daily.
* **Dapagliflozin:** $10\text{ mg}$ once daily (no dose titration required).
* **Empagliflozin:** $10\text{ mg}$ once daily (no dose titration required).

#### Table 15: Magnitude of Relative Risk Reduction with Evidence-Based Therapies for HFrEF
* **ARNI vs Placebo / Active Control:** 20% reduction in CV death, 21% reduction in HF hospitalizations.
* **Beta-Blockers vs Placebo:** 34% reduction in all-cause mortality, 41% reduction in HF hospitalizations.
* **MRAs vs Placebo:** 30% reduction in all-cause mortality, 35% reduction in HF hospitalizations.
* **SGLT2 Inhibitors vs Placebo:** 25% to 26% reduction in composite CV death / HF hospitalization.
* **Quadruple GDMT Combination:** Estimated 73% relative reduction in 2-year mortality compared with conventional untreated historical controls.

''')

    # RT 2
    parts.append(render_rt_en('rt02-hfref-gdmt.json'))

    # 7.4 Devices and Revascularization
    parts.append(r'''### 7.4 Device and Interventional Therapies for HFrEF

#### 7.4.1 Implantable Cardioverter-Defibrillators (ICD)
* **Secondary Prevention (Class 1, Level of Evidence A):** ICD is recommended for patients who have survived cardiac arrest due to VF or hemodynamically unstable VT.
* **Primary Prevention in Ischemic Cardiomyopathy (Class 1, Level A):** ICD is recommended in patients with prior MI (at least 40 days post-MI), LVEF $\le 35\%$, NYHA class II–III, or LVEF $\le 30\%$ with NYHA class I on chronic GDMT ($> 90$ days post-revascularization), with meaningful expected survival $> 1$ year (MADIT-II, SCD-HeFT).
* **Primary Prevention in Nonischemic Cardiomyopathy (Class 1, Level A):** ICD is recommended in patients with nonischemic dilated cardiomyopathy, LVEF $\le 35\%$, NYHA class II–III on optimal GDMT for $\ge 3$ months (DEFINITE, SCD-HeFT, DANISH).

#### 7.4.2 Cardiac Resynchronization Therapy (CRT)
* **Sinus Rhythm with LBBB $\ge 150\text{ ms}$ (Class 1, Level of Evidence A):** CRT (CRT-D or CRT-P) is recommended for patients with LVEF $\le 35\%$, sinus rhythm, left bundle branch block (LBBB) with QRS duration $\ge 150\text{ ms}$, and NYHA class II, III, or ambulatory class IV symptoms on GDMT (COMPANION, CARE-HF, MADIT-CRT, RAFT).
* **Sinus Rhythm with LBBB $120\text{--}149\text{ ms}$ (Class 2a, Level B-R):** CRT is reasonable for patients with LVEF $\le 35\%$, LBBB with QRS $120\text{--}149\text{ ms}$, and NYHA class II–IV.
* **Non-LBBB QRS $\ge 150\text{ ms}$ (Class 2a, Level B-R):** CRT is reasonable for patients with non-LBBB morphology and QRS $\ge 150\text{ ms}$.
* **High Expected Ventricular Pacing ($> 40\%$):** In patients with LVEF $\le 50\%$ and anticipated high burden of ventricular pacing for AV block, biventricular pacing or conduction system pacing is recommended over conventional RV apical pacing (Class 1, Level B-R; BLOCK-HF).

![Figure 8: Algorithm for CRT Indications in Patients With Cardiomyopathy or HFrEF](images/fig08_algorithm_crt_indications.jpg)

![Figure 9: Additional Device Therapies in HFrEF](images/fig09_additional_device_therapies.jpg)

''')

    # RT 3
    parts.append(render_rt_en('rt03-devices-hfref.json'))

    # 7.4.3 Revascularization
    parts.append(r'''#### 7.4.3 Coronary Revascularization for CAD in HFrEF
* In patients with HFrEF and multi-vessel coronary artery disease amenable to surgical revascularization, **coronary artery bypass graft (CABG)** surgery plus GDMT is recommended to improve survival, reduce cardiovascular hospitalizations, and relieve angina (Class 1, Level of Evidence B-R; STICH trial).
* Percutaneous coronary intervention (PCI) may be considered in selected patients with CAD and HFrEF when surgery is contraindicated or carries prohibitive operative risk.

''')

    # RT 9
    parts.append(render_rt_en('rt09-revascularization-cad.json'))

    # 7.5 Valvular Heart Disease
    parts.append(r'''### 7.5 Valvular Heart Disease in Heart Failure (Secondary Mitral Regurgitation)
Secondary (functional) mitral regurgitation (SMR) develops from LV chamber dilatation, papillary muscle displacement, and leaflet tethering:
* **GDMT First (Class 1, Level of Evidence A):** Maximization of guideline-directed medical therapy and CRT (when indicated) is the foundational first-line treatment for SMR.
* **Transcatheter Edge-to-Edge Repair (TEER / MitraClip, Class 2a, Level B-R):** In patients with persistent severe symptomatic secondary MR (effective regurgitant orifice area $\ge 0.3\text{--}0.4\text{ cm}^2$, regurgitant volume $> 45\text{--}60\text{ mL}$), LVEF $20\%\text{--}50\%$, LV end-systolic dimension $\le 70\text{ mm}$, and persistent NYHA class II–IV symptoms despite optimal GDMT and CRT, TEER is reasonable to reduce heart failure hospitalizations and mortality (COAPT trial).

![Figure 10: Treatment Approach in Secondary Mitral Regurgitation](images/fig10_approach_secondary_mitral_regurgitation.jpg)

''')

    # RT 10
    parts.append(render_rt_en('rt10-valvular-heart-disease.json'))

    # 7.6 HFmrEF and HFimpEF
    parts.append(r'''### 7.6 Heart Failure With Mildly Reduced EF (HFmrEF) and Improved EF (HFimpEF)

#### 7.6.1 Heart Failure With Mildly Reduced Ejection Fraction (HFmrEF: LVEF 41% to 49%)
* **SGLT2 Inhibitors (Class 2a, Level of Evidence B-R):** In patients with HFmrEF, SGLT2 inhibitors (dapagliflozin, empagliflozin) are recommended to reduce cardiovascular mortality and heart failure hospitalizations.
* **ARNI, ACEi, ARB, MRA, Beta-Blockers (Class 2b, Level B-NR):** In patients with HFmrEF, neurohormonal therapies may be considered to reduce hospitalizations, based on prespecified subgroup analyses from PARAGON-HF, TOPCAT, and CHARM-Preserved.

![Figure 11: Recommendations for Patients With Mildly Reduced Ejection Fraction (HFmrEF)](images/fig11_recommendations_hfmref.jpg)

''')

    # RT 11
    parts.append(render_rt_en('rt11-hfmref.json'))

    # 7.6.2 HFimpEF
    parts.append(r'''#### 7.6.2 Heart Failure With Improved Ejection Fraction (HFimpEF)
* In patients with prior HFrEF who demonstrate marked improvement or normalization of LVEF to $> 40\%$, **continuation of GDMT is strongly recommended** (Class 1, Level of Evidence B-R).
* In the randomized TRED-HF trial, phased withdrawal of neurohormonal therapies in recovered cardiomyopathy resulted in early relapse of LV dilatation, systolic dysfunction, and elevation of natriuretic peptides in 44% of patients within 6 months.

''')

    # RT 12
    parts.append(render_rt_en('rt12-hfimpef.json'))

    # 7.7 HFpEF
    parts.append(r'''### 7.7 Heart Failure With Preserved Ejection Fraction (HFpEF: LVEF $\ge 50\%$)
* **SGLT2 Inhibitors (Class 2a, Level of Evidence B-R):** In patients with HFpEF, SGLT2 inhibitors (empagliflozin, dapagliflozin) are reasonable to reduce cardiovascular death and heart failure hospitalizations (EMPEROR-Preserved, DELIVER).
* **MRAs (Class 2b, Level B-R):** Spironolactone or eplerenone may be considered in selected patients with HFpEF, especially those with LVEF at the lower end of the preserved spectrum (TOPCAT trial).
* **ARNI (Class 2b, Level B-R):** Sacubitril/valsartan may be considered in patients with HFpEF, particularly women and patients with LVEF below normal (PARAGON-HF trial).
* **Blood Pressure Control (Class 1, Level C-LD):** Aggressive management of hypertension according to published clinical practice guidelines is recommended.
* **Avoidance of Routine Nitrates or PDE-5 Inhibitors (Class 3: No Benefit):** Routine administration of organic nitrates or phosphodiesterase-5 inhibitors does not improve functional capacity or outcomes in HFpEF (NEAT-HFpEF, RELAX trials).

![Figure 12: Recommendations for Patients With Preserved Ejection Fraction (HFpEF)](images/fig12_recommendations_hfpef.jpg)

''')

    # RT 4
    parts.append(render_rt_en('rt04-hfpef-hfmref.json'))

    # 7.8 Cardiac Amyloidosis
    parts.append(r'''### 7.8 Cardiac Amyloidosis: Diagnosis and Management
Cardiac amyloidosis is an increasingly recognized cause of heart failure, primarily caused by transthyretin (ATTR) or immunoglobulin light-chain (AL) deposition:
* **Diagnostic Algorithm:**
  1. Concomitant screening for monoclonal light chains with **serum and urine protein electrophoresis with immunofixation** AND **serum free light chain assay** is mandatory to rule out AL amyloidosis (Class 1, Level of Evidence B-NR).
  2. If monoclonal testing is negative, **$^{99\text{m}}\text{Tc}$-PYP or DPD bone scintigraphy** is recommended; intense myocardial radiotracer uptake (Grade 2 or 3) provides definitive nonbiopsy diagnosis of ATTR cardiac amyloidosis (Class 1, Level B-NR).
  3. When ATTR amyloidosis is confirmed, ***TTR* genetic sequencing** is recommended to differentiate hereditary (variant) ATTR from wild-type ATTR (Class 1, Level B-NR).
* **Tafamidis for ATTR Amyloidosis (Class 1, Level B-R):** In patients with wild-type or variant ATTR cardiac amyloidosis and NYHA class I to III symptoms, the transthyretin tetramer stabilizer **tafamidis** ($61\text{ mg}$ daily) is recommended to reduce all-cause mortality, CV hospitalizations, and functional decline (ATTR-ACT trial).
* **Anticoagulation in Atrial Fibrillation (Class 1, Level B-NR):** Anticoagulation is recommended for all patients with cardiac amyloidosis who develop atrial fibrillation, regardless of the CHA2DS2-VASc score, due to high intracardiac thrombus burden.

![Figure 13: Diagnostic and Treatment Algorithm for Transthyretin Cardiac Amyloidosis](images/fig13_diagnostic_treatment_ttr_cardiac_amyloidosis.jpg)

''')

    # RT 13 & RT 14
    parts.append(render_rt_en('rt13-diagnosis-cardiac-amyloidosis.json'))
    parts.append(render_rt_en('rt14-treatment-cardiac-amyloidosis.json'))

    parts.append('''</div></details>\n''')

    full_text = '\n\n'.join(parts)
    with open('scratch/hf_block2_en.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print(f"Block 2 (EN) generated: {len(full_text):,} characters")

if __name__ == '__main__':
    build()
