# Risk Assessment and Performance Improvement in Cardiac Surgery

##### Assessing risk to improve outcomes is not a new principle. Formal assessment of patient care to improve outcomes dates back millennia. While it may be hard to establish an exact beginning, there are historical times and iconoclastic healthcare providers who stand out as important contributors to the modern concepts of quality assessment and performance improvement. At least six individuals stand out as iconoclasts in the field of performance improvement in surgery (Table 7-1). From the practice-changing observational studies of medieval surgeons like Albucasis and Trotula to the twentieth century insistence on evidence-based studies and randomized controlled trials (RCTs) by Archie Cochrane, many individuals served as champions of performance improvement using the tools of their times.

<details class="med-details"><summary>
  
## Executive Summary</summary><div class="details-content">

### Foundational Concepts in Quality Assessment

*   **Donabedian framework:** Quality in health care is defined by improvement in patient status after accounting for severity of illness, comorbidity, and services received. Quality is measured across three domains: **structure** (facilities, personnel, volume), **process** (actions leading to outcomes, e.g., IMA use, antiplatelet therapy), and **outcome** (operative mortality, morbidity, patient-reported outcomes).
*   **Performance measures:** Quantitative entities indicating performance. Outcome measures (mortality, renal failure, stroke) are most important for patients but require risk adjustment. Process measures (beta-blockade at discharge, antibiotic prophylaxis) are actionable but may have weak links to outcomes. Structural measures (database participation, ICU facilities) are easily tabulated but often difficult to alter.
*   **Patient-reported outcomes (PRO):** Growing importance in elderly populations where symptom relief and quality of life, rather than cure, are goals. CABG provides excellent health-related quality of life 10–15 years postoperatively, even in patients >80 years.

### Statistical Tools and Risk Adjustment

*   **Basic statistics:** Three broad uses—recap (summarize data), relate (compare groups using t-tests, chi-square), and regress (multivariable analysis for risk adjustment).
*   **Logistic regression:** Most common method for predicting dichotomous outcomes (death, complications). Provides observed/expected (O/E) ratios for provider performance assessment.
*   **Kaplan-Meier method:** Estimates time-related survival probability. Log-rank statistic compares survival curves. Hazard is the instantaneous risk of an event; Cox proportional hazards regression identifies predictors of long-term survival and calculates hazard ratios.
*   **Comorbidity indices:** Charlson Index, CIRS, ICED, and Kaplan Index are validated measures of comorbidity, though none derived specifically from cardiac surgery populations.

### Major Risk Models and Databases

*   **STS Adult Cardiac Surgery Database:** Voluntary registry capturing >90% of US cardiac centers. Provides benchmark data, risk-adjusted outcomes, and supports 27 risk models for CABG, isolated valve, and combined procedures. NQF-endorsed measures include composite scores, risk-adjusted mortality for all major procedures, and process measures (IMA use, antiplatelet therapy, beta-blockade).
*   **Regional systems:** New York, Pennsylvania, Northern New England, EuroSCORE, VA, and Canadian risk models each use varying numbers of risk factors but show similar predictive capability—much predictive ability resides in a relatively small number of factors.
*   **Limitations:** Risk models predict average population outcomes but not individual patient outcomes. Even with perfect risk adjustment, random variation accounts for much observed mortality differences; sensitivity for detecting poor-quality providers is <20% with >50% predictive error for outliers.

### Study Designs and Evidence Hierarchy

*   **Randomized controlled trials (RCTs):** Gold standard for causal inference, championed by Archie Cochrane (father of evidence-based medicine). Advantages: absence of confounding and selection bias. Disadvantages: small, highly selected populations; costly; time-consuming.
*   **Observational studies:** Represent "real-world" patients with large sample sizes. Propensity score matching creates pseudo-randomized groups approximating RCT results when well-designed.
*   **Practice guidelines:** Compiled evidence-based recommendations with graded classes (I–III) and levels of evidence (A–C). Class I: beneficial/useful; Class II: conflicting evidence (IIa favors, IIb less established); Class III: not useful/harmful.

### Performance Assessment Applications

*   **Operative mortality:** Most studied outcome, particularly for CABG. Risk factors show consistency across models (age, gender, urgency, EF, renal dysfunction, prior CABG, left main disease).
*   **Morbidity and resource utilization:** Non-fatal complications account for ~40% of CABG costs, affecting only 10–15% of patients (Pareto principle). STS morbidity models for stroke, renal failure, reoperation, prolonged ventilation, and mediastinitis guide quality improvement.
*   **Failure-to-rescue:** Mortality rate in patients experiencing postoperative complications. Reflects ICU capabilities, nursing care, and structural measures rather than preoperative risk alone.
*   **Composite measures:** Combine multiple quality indicators (outcome, process, structure) into single scores for more robust performance assessment.

### Quality Improvement Case Studies

*   **Northern New England Cardiovascular Study Group (NNECVDSG):** Voluntary consortium using feedback, continuous quality improvement training, and site visits. Reduced CABG mortality from 4.3% to below expected across all acuity categories.
*   **Total Quality Management (TQM):** Deming and Juran principles applied to health care: process-focused, customer (patient)-supplier relationships, understanding variation, Pareto principle (80/20 rule), quality reduces cost.

### Controversies and Limitations

*   **Risk aversion:** Public reporting may lead providers to avoid high-risk patients. Evidence mixed—New York state analyses showed increased severity over time, but outmigration concerns persist.
*   **Administrative vs. clinical data:** Claims data underestimate comorbidity, misclassify procedures, and lack critical prognostic variables (LV function, vessel disease). Clinical databases (STS) provide superior accuracy.
*   **Hierarchical vs. logistic regression:** Multilevel models "shrink" low-volume provider estimates toward the mean, reducing false outlier identification. Used by STS and Massachusetts for provider profiling.
*   **League tables vs. funnel plots:** League tables imply false distinctions; funnel plots show volume-related uncertainty and identify true outliers with appropriate confidence intervals.

### Future Directions

*   **Effectiveness vs. safety:** Evidence-based effectiveness interventions may save more lives than safety-focused error reduction. Effectiveness outcomes are easier to measure.
*   **Guidelines vs. standards:** Guidelines reflect available evidence; standards operationalize guidelines into bedside practice with monitored outcome measures.
*   **Human factors research:** Structured observation of operating room behavior, modeled on aviation industry, can identify error patterns and improve outcomes.
*   **Electronic medical records:** CPOE systems show mixed results—may reduce errors but can introduce new ones. Veterans Health Affairs system demonstrates successful implementation.
*   **Public reporting:** STS partnership with Consumers Union publishes composite CABG measures; transparency has public appeal but effect on consumer behavior remains uncertain.

</div></details>

<details class="med-details"><summary>
  
## ASSESSMENT OF CARDIAC OPERATIONS</summary><div class="details-content">

<details class="med-details"><summary>
  
### Measures of Successful Operations</summary><div class="details-content">

In the early 1960s, Donabedian suggested that quality in health care is defined as improvement in patient status after accounting for the patient's severity of illness, presence of comorbidity, and the medical services received. He further proposed that quality could best be measured by considering three domains: structure, process, and outcome. Only recently has the notion of measuring health-care quality using this Donabedian framework been accepted and implemented. In 2000, the Institute of Medicine (IOM) issued a report that was highly critical of the US health-care system, suggesting that between 50,000 and 90,000 unnecessary deaths occur yearly because of errors in the health-care system. The IOM reports created a heightened awareness of more global aspects of quality. For most of the history of cardiac surgery an outcome measure, operative mortality, defined surgical quality. After the IOM report appeared, change occurred, and other aspects of Donabedian's framework surfaced to measure quality. In addition to operative mortality, health-care quality measurement gave way to a broader analysis that included additional performance measures including operative morbidity, processes of care, and structural measures of care.

<details class="med-details"><summary>
  
#### Performance Measure Definitions (The Joint Commission)</summary><div class="details-content">

*   **Performance measure:** A quantitative entity that provides an indication of an organization's or surgeon's performance in relation to a specified process or outcome.
*   **Outcome measure:** A measure that indicates the results of process measures. Examples are operative mortality, the frequency of postoperative mediastinitis, renal failure, and myocardial infarction.
*   **Process measure:** A measure that focuses on a process leading to a certain outcome. Intrinsic in this definition is a scientific basis for believing that the process will increase the probability of achieving a desired outcome. Examples include the rate of internal mammary artery (IMA) use in coronary artery bypass graft (CABG) patients or the fraction of CABG patients placed on anti-platelet agents postoperatively.
*   **Structural measure:** A measure that assesses whether an appropriate number, type, and distribution of medical personnel, equipment, and/or facilities are in place to deliver optimal health care. Examples include enrollment in a national database, adequate intensive care unit (ICU) facilities, or procedural volume.

</div></details>

<details class="med-details"><summary>
  
#### Advantages and Disadvantages of Performance Measure Types</summary><div class="details-content">

Birkmeyer and coworkers outlined advantages and disadvantages associated with each of these three specific types of performance measures.

*   **Structural measures:**
    *   Advantage: readily tabulated inexpensively using administrative data.
    *   Disadvantage: many do not lend themselves to alteration (e.g., small hospitals cannot increase procedural volume or introduce costly ICU design changes). Attempts to alter structure may have adverse consequences.
*   **Process measures:**
    *   Advantage: links to health-care quality exist and are usually actionable.
    *   Disadvantage: linkage to outcomes may be weak.
*   **Outcome measures:**
    *   Advantage: most important endpoint for patients.
    *   Disadvantage: inadequate sample size and lack of appropriate risk-adjustment limit accurate assessment.

</div></details>

<details class="med-details"><summary>
  
#### National Quality Forum (NQF) Endorsed Measures</summary><div class="details-content">

Several national organizations develop and evaluate performance measures. Perhaps the most visible of these is the *National Quality Forum (NQF)*, a public-private collaborative organization that uses a process of exhaustive, evidence-based scrutiny of candidate measures to determine their relevance to both patients and healthcare providers. The NQF considers whether candidate measures can be assessed accurately and whether actionable interventions can improve performance for these measures. Because of this scrutiny, NQF-endorsed measures have a high level of national credibility.

<details class="med-details"><summary>

#### TABLE 7-2: National Quality Forum (NQF) Endorsed National Standards for Cardiac Surgery for 2014*</summary><div class="details-content">

| Composite Measure | |
|-------------------|-|
| 1. STS CABG Composite Score composed of six outcome measures and five process measures. | |

| Outcome Measures | |
|------------------|-|
| 2. Risk-Adjusted Deep Sternal Wound Infection Rate. | |
| 3. Risk-Adjusted Operative Mortality for Aortic Valve Replacement (AVR). | |
| 4. Risk-Adjusted Operative Mortality for AVR + CABG Surgery. | |
| 5. Risk-Adjusted Operative Mortality for CABG. | |
| 6. Risk-Adjusted Operative Mortality for Mitral Valve (MV) Repair. | |
| 7. Risk-Adjusted Operative Mortality for MV Repair + CABG Surgery. | |
| 8. Risk-Adjusted Operative Mortality for MV Replacement. | |
| 9. Risk-Adjusted Operative Mortality for MV Replacement + CABG. | |
| 10. Risk-Adjusted Postoperative Renal Failure. | |
| 11. Risk-Adjusted Prolonged Intubation (Ventilation). | |
| 12. Risk-Adjusted Stroke/Cerebrovascular Accident. | |
| 13. Risk-Adjusted Surgical Re-exploration. | |

| Process Measures | |
|------------------|-|
| 14. Anti-Lipid Treatment at Discharge. | |
| 15. Anti-Platelet Medication at Discharge. | |
| 16. Beta Blockade at Discharge. | |
| 17. Duration of Antibiotic Prophylaxis for Cardiac Surgery Patients. | |
| 18. Preoperative Beta Blockade. | |
| 19. Selection of Antibiotic Prophylaxis for Cardiac Surgery Patients. | |
| 20. Use of Internal Mammary Artery in CABG. | |

| Structural Measure | |
|-------------------|-|
| 21. Participation in a Systematic Database for Cardiac Surgery. | |

###### *http://www.sts.org/quality-research-patient-safety/quality/quality-performance-measures.
</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
### PATIENT SATISFACTION—PATIENT-REPORTED OUTCOMES</summary><div class="details-content">

Other outcomes following cardiac procedures, such as patient satisfaction and health-related quality of life, are less well studied but extremely important in the assessment of performance. Meeting or exceeding patients' expectations is a major goal of the health-care system. While all recognize the importance of performing safe surgery, one must also acknowledge that a safe operation with minimal patient benefit is to be avoided. The growing importance of patient-reported outcomes (PRO) also reflects the increasing prevalence of chronic disease in our aging population. The goal of therapeutic interventions is often to relieve symptoms and to improve quality of life, rather than cure a disease and prolong survival. This is especially important in selecting elderly patients for cardiac operations. Recent studies suggest that CABG results in excellent health-related quality of life 10 to 15 years following operation in most patients, and that this benefit extends to those patients older than 80 years of age. Future research into patient-perceived performance assessment is inevitable given the aging of populations in the developed countries.

Statistical models to adjust for patient risk are essential to determine the probability of procedural outcomes. Traditionally, risk models predict the probability of death or other postprocedural complications such as stroke, infection, or renal failure. These traditional models are clearly important to assess procedural risk, but the safety of an operation is only part of the decision-making process as to whether to recommend a given procedure. Patient benefit must be considered as well. Just because one can do a procedure safely does not mean it should be done—if it affords the patient only minimal benefit, then the patient has received poor treatment.

Patient benefit can be represented by using appropriate metrics other than procedural mortality and morbidity. PRO can be objectively determined from a variety of published scoring protocols. These scores can be considered to be an objective measure of patient benefit. In turn, the scores provide information necessary to develop statistical models that predict the probability of PRO scores, in much the same way that traditional models predict the probability of procedural complications. The results of these models should serve as a meaningful measure of predicted patient benefit. Clinical registries are now collecting data that will permit an objective estimate of both patient risk and patient benefit. Statistical risk models should soon be available to predict not only procedural mortality and major non-fatal complications, but also the probability of patient benefit.

</div></details>

<details class="med-details"><summary>
  
### COMPOSITE MEASURES THAT REFLECT PROCESS, STRUCTURE, AND OUTCOME DOMAINS</summary><div class="details-content">

The best approach to assessing surgical quality is uncertain. Operative mortality for most cardiac procedures is low and performance assessment requires large patient numbers to discriminate between hospitals and providers. For this reason other measures surface for performance assessment. There is growing interest in the use of *composite measures* to assess provider and hospital performance. Composite measures combine multiple quality indicators into a single score and can include outcome, structural, and process measures in various combinations. Evidence suggests that composite variables that incorporate multiple outcome measures as well as structural and process performance measures are better reflections of quality than are individual outcomes alone. Examples of composite performance measures used for quality assessment include indices that combine ICU care variables with outcome measures, and those that combine process of care variables with outcome variables and structural variables.

Certain outcome variables may reflect multiple domains of performance. One such measure is *failure-to-rescue*, usually defined as the mortality rate for a subset of patients who experience postoperative complications. Studies suggest that failure-to-rescue rates depend on structural measures (eg, advanced ICU capabilities and presence of residency training), processes of care, and traditional morbidity outcome measures. While traditional outcome measures such as operative mortality are thought to be mostly dependent on patient-related risk factors, it appears that failure-to-rescue rates reflect a different part of the care continuum, specifically the intensive care arena. Some consider failure-to-rescue rates to be primarily a structural measure focused on nursing care and ICU staffing. There are multiple contributions to failure-to-rescue rates, thereby qualifying this variable as a composite performance measure. Several studies are underway to determine the ability of this variable to identify and stratify quality performers.

The development of composite measures is statistically complex. The composite metric is very dependent on the statistical approach used to combine the component variables. Despite the complexities of creating composite measures, increased reliance on composite measures of quality is inevitable, and efforts at improving the reliability and predictive accuracy are underway.

</div></details>

</div></details>

<details class="med-details"><summary>
  
## TOOLS OF PERFORMANCE ASSESSMENT</summary><div class="details-content">

<details class="med-details"><summary>
  
### Basic Statistical Treatment of Outcome Data</summary><div class="details-content">

<details class="med-details"><summary>
  
#### RECAP, RELATE, AND REGRESS</summary><div class="details-content">

Analysis of cardiac surgical results is purpose-driven. Use of statistics follows the purpose for which data were gathered. There are three broad uses of statistics for analysis of cardiac surgical outcomes.

*   **Recap (summarize):** The most basic use is to recap or summarize information about a patient group. Certain reports can only document surgical outcomes in a few patients because of the rarity of disease or limited ability to sample patient populations. A single estimate of an outcome in a limited population may be misleading. In order to acknowledge the inaccuracy of a single estimate of a limited population, statistical measures describe this imprecision. Multiple statistical terms describe this uncertainty, including sample, mean, standard deviation, interquartile range, confidence interval, and standard error.
*   **Relate (compare groups):** More commonly, statistics serve to relate or compare attributes of two or more groups. Comparisons between groups require comparisons between known reference distributions (eg, chi-square and t-distribution) and the data sample distribution. Differences between these two distributions allow calculation of a probability that there really is a difference between the sample and the reference distribution. This probability has different names including $p$-value or alpha ($\alpha$) level. The most commonly used test for comparisons of two numeric variables is the Student's t-test. The t-test makes use of the symmetry of the t-distribution of a sample and compares the $t$ statistic calculated from each of the two group's t-distributions with critical values. The astute reader quickly realizes that the statistical formulation of the t-test requires computer support as the workhorse that does the calculations. In fact, very few statistical tests do not rely on computer-intensive calculations. Reliance on computers to calculate $p$-values, and to perform statistical tests in general, provides opportunity for misuse or inaccurate use of both simple and complex statistics. Misuse of the simplest statistical tests is common, and has been for many years. It behooves the surgeon who evaluates the literature or who performs statistical analyses to understand the principles and application of various statistical tests used for comparing two or more groups.
*   **Regress (multivariable analysis):** Comparing the outcomes between two groups based on several characteristics of each group considered simultaneously requires multivariable analysis. *Multivariate regression analysis* provides a means of accounting for multiple independent variables (also called risk factors) that predict the dependent (also called outcome) variable. The result of multivariate regression is called a "model," a slightly counter-intuitive term. Regression models allow assignment of a regression coefficient to each predictor variable that roughly corresponds to the variable contribution to outcome prediction. Again, computer software does the work; investigators do the interpretation.

</div></details>

<details class="med-details"><summary>
  
#### OUTCOME MODELS</summary><div class="details-content">

There is a multitude of regression models available for analysis of cardiac surgical data. Perhaps the most common is *logistic regression*. Logistic regression models are a means of analyzing independent variables that predict a *dichotomous outcome* (eg, death, renal failure, and mediastinitis).

Regression models provide *risk-adjusted assessment* of outcomes that is often used for *performance assessment* across groups of providers. For example, logistic regression models provide a population probability (value between zero and one) of an outcome based on multiple independent predictor variables. These probabilities are called risk-adjusted probabilities and can be defined as the predicted population outcome or *expected outcome*. Individual members of the population have an *observed outcome*. The ratio of observed outcome to predicted outcome is called *O/E ratio*, and reflects a measure of individual provider performance. There are multiple ways to assess adequacy of regression models, especially logistic regression. Hosmer and coauthors provide a particularly comprehensive, yet practical, description of regression model assessment. The O/E ratio for an individual provider may give a rough estimate of risk-adjusted performance, but this measure alone does not strictly determine clinical competence or quality of care. *Cumulative sum (CUSUM) analysis* calculates provider O/E ratios over time and allows a graphical picture of performance that avoids point estimates.

</div></details>

<details class="med-details"><summary>
  
#### LATE TIME-RELATED EVENTS</summary><div class="details-content">

Cardiac surgeons are frequently concerned about events that occur late following operations. Special statistical methods are used to determine the long-term status of patients following operative procedures.

The most common way to estimate time-related benefit employs the *Kaplan-Meier method*. This method provides an estimate of survival (or some other later time-dependent event) probability before all patients in the cohort experience the late event. This method assumes that patients who are alive at the time of analysis have the same risk of future death as those who have already died. The graphical representation of the Kaplan-Meier model gives a survival curve and allows comparisons between survival rates associated with different interventions (eg, two different valve types). The *log-rank statistic* is used most often to compare Kaplan-Meier survival curves.

At any point in time, an individual patient has a risk of experiencing the designated endpoint. This risk of reaching the endpoint is known as the *hazard*. If death is the selected endpoint, then the hazard is the risk of dying at any point in time. The *cumulative hazard function* is the negative logarithm of the Kaplan-Meier estimated survival obtained from the survival curve.

Surgeons are often interested in the multiple factors that predict long-term survival. These factors are typically the clinical risk factors for a patient population or the type of intervention performed. *Cox regression models* provide a multivariable analysis of predictors of survival using the hazard function. Using the results of Cox models, one can calculate a hazard ratio (HR), which adjusts for clinical factors in the process of providing a comparison of survival for two interventions at a given time. For example, to compare the survival of CABG against the survival of percutaneous coronary intervention (PCI) at a specified time after the procedure, one could determine the HR comparing the two procedures. The HR provides the relative risk of death of CABG versus PCI for risk-adjusted populations at a given point in time. This method assumes that the hazard function is constant over time; hence the proper name *Cox proportional hazards regression*. When survival curves intersect at some point in time, the proportional hazards assumption is not met and one should then use other metrics such as the risk ratio.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Risk Adjustment and Comorbidity</summary><div class="details-content">

<details class="med-details"><summary>
  
#### MEASURES OF COMORBIDITY</summary><div class="details-content">

Essential for the assessment of the success of cardiac operations is the ability to arrange patients according to their severity of illness. Comorbid illness in patients with cardiac disease is common. Various measures of comorbidity compile patients' risk factors into a single variable that reflects global comorbidity (Table 7-3). The comorbidity indices in Table 7-3 adjust for the incremental risk associated with specific preoperative factors variously known as risk factors, risk predictors, comorbidities, or covariates. The comorbidity systems listed in Table 7-3 are in constant evolution and use of these indices often extends to populations that include cardiac surgical patients, despite the fact that none of the indices are derived from patients undergoing cardiac procedures.

<details class="med-details"><summary>

#### TABLE 7-3: Characteristics and Study Populations of Commonly Used Comorbidity Indices</summary><div class="details-content">

| Comorbidity Index | Variables in the Index | Weights Used to Compute Index | Final Index Score | Population Used to Derive Index |
|-------------------|------------------------|-------------------------------|-------------------|---------------------------------|
| Charlson Index | 19 comorbid conditions | Relative risk for each comorbid condition derived from logistic regression of mortality | Sum of weights | Cancer patients, heart disease, pneumonia, elective noncardiac operations, amputees. |
| CIRS | 13 body systems | Score from 0 to 4 for each body system | Sum of weights | Elderly patients many institutionalized for long-term care. |
| ICED | 14 disease categories and 10 functional categories | Score of 1 to 5 for disease categories and 1 to 3 for functional categories | Scoring algorithm that sums up disease and functional scores to arrive at values from 1 to 4 | Total hip replacements and nursing home patients. |
| Kaplan Index | Two categories—vascular or nonvascular disease | Graded 0 through 3 for each category | Most severe condition. Two grade 2 are ranked as grade 3 | Diabetes and breast cancer. |
| BOD Index | 59 diseases | 0 through 4 for each disease | Sum of weights | Long-stay nursing home patients. |
| Cornoni-Huntley Index | 3 categories | 1—No comorbidity<br>2—Impaired hearing or vision<br>3—Heart disease, stroke or diabetes<br>4—Both 2 and 3 | Graded 1 through 4 | Hypertensive population and age >75 years. |
| Disease Count | Number of diseases present based on ICD-9 codes | Sum number of diseases | Maximum score based on number of diseases | Breast cancer, MI, HIV, asthma, appendicitis, low back pain, pneumonia, diabetes, abdominal hernia. |
| Shwartz Index | 21 comorbidities | Relative risks from model that predicts medical costs | Sum of relative risks for each comorbidity | Stroke, lung disease, heart disease, prostate cancer, hip fracture, and low back pain. |

###### Adapted with permission from de Groot V, Beckerman H, Lankhorst GJ, Bouter LM: How to measure comorbidity: A critical review of available methods, *J Clin Epidemiol* 2003 Mar;56(3):221-229.
</div></details>

Table 7-3 compares commonly used comorbidity measures. The Charlson Index, the CIRS, the ICED, and the Kaplan Index are valid and reliable measures of comorbidity as measured in certain specific patient populations, but not in patients undergoing cardiac operations. The other comorbidity measures in Table 7-3 do not have sufficient data to assess their validity and reliability and are probably less useful than the four validated measures. There are many limitations of comorbidity indices, and they are not applied widely in studies of efficacy or medical effectiveness for cardiac operations.

</div></details>

<details class="med-details"><summary>
  
#### RISK ADJUSTMENT SYSTEMS FOR CARDIAC OPERATIONS</summary><div class="details-content">

Comorbidity indices, and risk factors in general, make up the variables that generate regression models that are used for risk adjustment. Most risk-adjustment models share several common features.

*   The risk factors or comorbidities in the model are associated with a specific outcome.
*   If the goal is to measure provider performance, the risk factors include only patient characteristics (not hospital, physician, or regional characteristics) present prior to surgery.
*   A sufficient number of patients must have the risk factor, and a sufficient number must experience the adverse outcome, in order to construct an accurate risk model.
*   It is necessary to define the period of observation for the outcomes of interest (eg, in-hospital, 30-day mortality, or both).

<details class="med-details"><summary>

#### TABLE 7-4: Examples of Risk Adjustment Models Used for Patients Undergoing Cardiac Surgical Procedures</summary><div class="details-content">

| Severity System | Data Source | Classification Approach | Outcomes Measured |
|-----------------|-------------|------------------------|-------------------|
| APACHE III | Values of 17 physiologic parameters and other clinical information | Integer scores from 0 to 299 measured within 24 hours of ICU admission | In-hospital death |
| Pennsylvania | Clinical findings collected at time of admission | Probability of in-hospital death ranging from 0 to 1 based on logistic regression model and MediQual's Atlas™ admission severity score | In-hospital death and cost of procedure |
| New York | Condition specific clinical variables from discharge record | Probability of in-hospital death ranging from 0 to 1 based on logistic regression model | In-hospital death |
| Society for Thoracic Surgeons | Condition-specific clinical variables from discharge record | Originally used Bayesian algorithm to assign patient to risk interval (percent mortality interval). More recently used logistic and hierarchical regression methods | In-hospital death and morbidity |
| EuroSCORE | Condition specific clinical variables from discharge record | Additive logistic regression model with scores based on presence or absence of important risk factors | 30-day and in-hospital mortality |
| Veterans Administration | Condition-specific clinical variables measured 30 days after operation | Logistic regression model used to assign patient to risk interval (percent mortality interval) | In-hospital death and morbidity |
| Canadian | Condition specific clinical variables entered at time of referral for cardiac surgery | Range of scores from 0 to 16 based on logistic regression odds ratio for six key risk factors | In-hospital mortality, ICU stay and postoperative length of stay |
| Northern New England | Condition specific clinical variables and comorbidity index entered from discharge record | Scoring system based on logistic regression coefficients used to calculate probability of operative mortality from 7 clinical variables and 1 comorbidity index | In-hospital mortality |

###### Abbreviations: Pennsylvania = Pennsylvania Cost Containment Committee for Cardiac Surgery; New York = New York State Department of Health Cardiac Surgery Reporting System; Society for Thoracic Surgeons = Society of Thoracic Surgeons Adult Cardiac Surgery Risk Model; Veterans Administration = Veterans Administration Cardiac Surgery Risk Assessment Program; Canadian = Ontario Ministry of Health Provincial Adult Cardiac Care Network; Northern New England = Northern New England Cardiovascular Disease Study Group.
</div></details>

Table 7-4 lists risk-adjustment models used to define quality or performance based on clinical outcome measures (eg, risk of death or other adverse clinical outcomes). In addition, two of the risk adjustment models shown in Table 7-4 (the Pennsylvania Cardiac Surgery Reporting System and the Canadian Provincial Adult Cardiac Care Network of Ontario) assess risk based on resource utilization (eg, hospital length-of-stay and cost) as well as on clinical outcome measures. Of the risk models listed in Table 7-4, only one, the APACHE III system, computes a risk score independent of patient diagnosis. All of the others in the table are diagnosis-specific systems that use only patients with particular diagnoses in computing risk scores.

Once developed from a reference population, each of the risk stratification models shown in Table 7-4 is validated in some way. There are too many individual patient and procedural differences, many of them unknown or unmeasured, to allow completely accurate validated preoperative risk assessment. The most important reason that risk-adjustment methods fail to completely predict individual outcomes is that the data set used to derive the risk score comes from retrospective, observational data that contain inherent selection bias, that is patients were given a certain treatment that resulted in a particular outcome because a clinician had a selection bias about what treatment that particular patient should receive. In observational datasets, patients are not allocated to a given treatment in a randomized manner. In addition, clinician bias may not reflect evidence-based data. Methods are available that attempt to overcome some of these limitations of observational data. These methods include use of propensity matching and "bootstrap" variable selection. Observational datasets are much more readily available and represent "real-world" treatment and outcomes compared to RCTs. An excellent review of the subtleties of evaluating the quality of risk-adjustment methods is given in the book by Iezzoni and this reference is recommended to the interested reader.

Within the last decade the Society of Thoracic Surgeons (STS) published the most comprehensive set of cardiac surgery risk models yet available. Twenty-seven risk models encompassed nine endpoints for each of three major groups of cardiac procedures (isolated CABG, isolated valve, and valve + CABG). These risk models provide the framework for measurement of risk-adjusted outcomes for cardiac operations and, ultimately, for performance assessment of individual cardiac programs or for individual providers. The NQF has endorsed most of the STS risk adjustment models for use in determining cardiac surgery quality measures (see Table 7-2).

Ideally, differences in risk-adjusted outcomes are due to differences in quality of care, but caution is necessary in the interpretation of provider differences based on differences derived from risk adjustment models. One study simulated the mortality experience for a hypothetical set of hospitals assuming perfect risk adjustment and with prior perfect knowledge of poor quality providers. These authors used various simulation models, including Monte Carlo simulation, and found that under all reasonable assumptions, sensitivity for determining poor provider quality was less than 20% and the predictive error for determining high outliers was greater than 50%. Much of the observed mortality rate differences between high outliers and nonoutliers were attributable to random variation. Park and coauthors suggest that providers identified as high outliers using conventional risk adjustment methods do not provide lower quality care than do nonoutliers, and that most of the outcome differences are due to random variations.

</div></details>

<details class="med-details"><summary>
  
### Performance of Risk Adjustment Models</summary><div class="details-content">

Many risk stratification models for cardiac operations are used to assess surgical performance. Before a risk model and its component risk factors are used to evaluate provider performance, these models are tested for accuracy. Many patient variables are candidate risk factors for operative mortality following coronary revascularization. Examples include serum blood urea nitrogen (BUN), cachexia, oxygen delivery, HIV, case volume, low hematocrit on bypass, the diameter of the coronary artery, and resident involvement in the operation. On the surface, these variables seem like valid risk factors, but many are not. All putative risk factors should be subjected to rigorous scrutiny. Tests of risk model prediction including regression diagnostics (eg, receiver operating characteristics (ROC) curves and cross-validation studies) performed on the models included in Tables 7-4 suggest that the models are good, but not perfect, at predicting outcomes. In statistical terms this may mean that all of the variability in outcome measurement is not explained by the set of risk factors included in the regression models. Hence, it is possible that inclusion of new putative risk factors in the regression equations may improve the validity and precision of the models. New regression models, and new risk factors, must be scrutinized and tested with regression diagnostics before acceptance. However, it is uncertain whether inclusion of many more risk factors will significantly improve the quality and predictive ability of regression models, and there is an ongoing tension between parsimonious models and robust models that contain many variables. For example, the STS risk stratification model described in Table 7-4 includes many predictor variables, while the Toronto risk adjustment model includes only five predictor variables. Yet the regression diagnostics for these two models are similar, suggesting that both models have equal precision and predictive capabilities for identifying outcome measures. Studies show that much of the predictive ability of risk models is contained in a relatively small number of risk factors. Other studies suggest that the limiting factor in the accuracy of current risk models may be a failure to understand and account for all the important factors related to risk. Additionally, risk models are useful for predicting the average outcome for a population of patients with specific risk factors, but not necessarily accurate for predicting the outcome for a specific patient. Further work needs to be done, both to explain the differences in risk factors seen between the various risk models and to determine which models are best suited for studies of quality improvement and performance assessment.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Study Designs to Compare Outcomes</summary><div class="details-content">

<details class="med-details"><summary>
  
#### RANDOMIZED CONTROL TRIALS</summary><div class="details-content">

After World War II, there was a rapid expansion of therapeutic options, especially drugs, for treatment of previously untreatable acute and chronic diseases. With the advent of this new drug therapy came the introduction of RCTs to define the efficacy of various drug regimens. Archie Cochrane, a Scottish pulmonary medicine specialist, championed RCTs as the most reliable means of deciding on optimal treatment (Fig. 7-1). He suggested that RCTs were the best means of identifying interventions that have a causal influence on outcomes. His efforts eventually led to the creation of the Cochrane Collaboration, a repository for works of evidence-based medicine (EBM). He is arguably the father of EBM and is largely responsible for the current preeminence of RCTs as the "holy grail" of decisions about treatment options. RCTs provide the best evidence to decide about surgical treatment options for cardiac diseases, as well as providing the best means of identifying cause and effect relationships. The impact of Cochrane's insistence on wide dissemination of published high-quality evidence, including RCTs, and summaries of RCTs and observational data including meta-analyses and systematic reviews (collectively referred to as EBM publications), is felt today, even more than in previous decades. In 2014, a Pub Med search identified 27 EBM publications concerning various treatment options related to cardiac operations and associated diseases.

![](_page_7_Picture_10.jpeg)

**FIGURE 7-1** Portrait of Archie Cochrane and significant life events and accomplishments. *(Used with permission from the Cochrane Collaboration.)*

</div></details>

<details class="med-details"><summary>
  
#### NONRANDOMIZED COMPARISONS FOR CAUSAL INFERENCE</summary><div class="details-content">

Not every question about cardiac operations can be answered by RCTs. For many reasons the majority of the published cardiac surgical studies are observational studies, not RCTs. In nearly all observational studies, there may be *selection bias*. Patients underwent a treatment for nonrandom reasons. The nonrandom nature of observational studies mandates statistical methods to account for variables (usually preoperative variables) that affect the outcome (typically operative mortality and/or morbidity). Shortly after the creation of the Cochrane Collaboration in the 1970s, publications suggested that observational studies may weight outcomes in favor of new therapies, much more so than RCTs that address the same comparisons. Almost 20 years later reassessment of the value of nonrandomized comparisons suggested that well-done observational studies using carefully selected controls (either cohort or case-control designs) do not overestimate treatment benefit.

There are multiple ways to address bias in observational studies. Perhaps the most widely used technique involves careful matching of treatment and control groups using various statistical techniques, the most popular method being *propensity score matching*. The propensity score is constructed in as robust a manner as possible given the population variables. Typically logistic regression with all preoperative independent variables forced into the regression equation is used to compute the propensity score for comparison of two groups. Matching control and experimental groups based on their propensity scores (ie, probability of a given outcome based on the logistic regression-derived probability) provides a "pseudo-randomized" group from the total population. Comparisons using carefully matched groups approximate RCTs in most cases.

</div></details>

<details class="med-details"><summary>
  
#### STUDY DESIGN: THE TENSION BETWEEN RANDOMIZED TRIALS AND OBSERVATIONAL STUDIES</summary><div class="details-content">

There are clear advantages and disadvantages associated with both RCT and observational studies.

*   **RCT advantages:** Because of the absence of confounding and selection bias, the RCT remains the "gold standard" for comparing results.
*   **RCT disadvantages:** RCTs focus on relatively small, highly select populations that may have little in common with patients typically seen in practice. Small sample size often precludes meaningful subgroup analysis and statistical analyses may be underpowered. RCTs are also quite costly and so time-consuming that results may often be outdated by the time they are reported.
*   **Observational study advantages:** Observational studies usually involve large populations of "real-world" patients. Subgroup cohorts with adequately powered statistical analysis are commonly seen. Since these studies often use registry data, they can be carried out in a timely fashion with minimal expense.
*   **Observational study disadvantages:** Cohort balancing using propensity scoring techniques and other statistical approaches provides useful comparisons that can approximate RCTs, but careful matching techniques for group comparisons never completely rule out bias or confounding.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
## GOALS OF CARDIAC SURGICAL PERFORMANCE ASSESSMENT</summary><div class="details-content">

<details class="med-details"><summary>
  
### Using Quality Assessments to Create Guidelines</summary><div class="details-content">

One goal of assessment of cardiac procedures is to define best practices. Wide dissemination of global assessment of cardiac operations can provide evidence that helps surgeons know the best alternative for surgical treatment of cardiovascular disorders. Recognizing the difficulties in defining "best practices" for a given illness, professional organizations opted to promote practice guidelines or "suggested therapy" for cardiac surgical diseases. These *practice guidelines* represent a compilation of available published evidence, including randomized trials and observational studies. For example, the practice guideline for CABG is available for both practitioners and the lay public on the Internet (http://circ.ahajournals.org/content/124/23/e652.full.pdf+html).

Guidelines are a list of recommendations that have varying support in the literature. The strength of a guideline recommendation is often graded by class and by level of evidence used to support the class of recommendation. A typical rating scheme used by the STS Workforce on Evidence Based Surgery and by the Joint American College of Cardiology/American Heart Association Task Force on Practice Guidelines has three classes of recommendations as follows:

*   **Class I:** Conditions for which there is evidence and/or general agreement that a given procedure or treatment is beneficial, useful, and effective.
*   **Class II:** Conditions for which there is conflicting evidence and/or a divergence of opinion about the usefulness/efficacy of a procedure or treatment.
    *   **Class IIa:** Weight of evidence/opinion is in favor of usefulness/efficacy.
    *   **Class IIb:** Usefulness/efficacy is less well established by evidence/opinion.
*   **Class III:** Conditions for which there is evidence and/or general agreement that a procedure/treatment is not useful/effective and in some cases may be harmful.

Evidence supporting the various classes of recommendations ranges from high-quality RCTs to consensus opinion of experts. Three categories describe the level of evidence used to arrive at the Class of Recommendation:

*   **Level A:** Data derived from multiple randomized clinical trials or meta-analyses.
*   **Level B:** Data derived from a single randomized trial or nonrandomized studies.
*   **Level C:** Consensus opinion of experts, case studies, or standard-of-care.

Guidelines, derived from assessment of cardiac operations, provide surgeons with accepted evidence-based standards of care that most would agree upon, with an ultimate goal of limiting deviations from accepted standards.

</div></details>

<details class="med-details"><summary>
  
### Other Goals of Performance Assessment (Cost Containment and Altering Physician Practices)</summary><div class="details-content">

Financial factors are a major force behind health-care reform. America's health-care costs amount to 15 to 20% of the gross national product and this figure is rising at an unsustainable rate. Institutions who pay for health care are demanding change, and these demands are fueled by studies that suggest that 20 to 30% of care is inappropriate with services both underused and overused compared to evidence-based practice standards. This resulted in a shift in emphasis, with health-care costs being emphasized on equal footing with clinical outcomes of care. Sometimes health-care costs and clinical outcomes are combined into a metric that reflects *health-care value* for service rendered.

Variations in physician practice distort the allocation of health-care funds in an inappropriate way. Research suggests that there is a 17-year lag time between medical discovery and when most patients benefit from the discovery. The failure on the part of some surgeons to implement innovation has a huge cost in terms of morbidity and mortality. Solutions to this problem involve altering physician practice patterns to be consistent with best available evidence, something that is difficult to achieve.

</div></details>

<details class="med-details"><summary>
  
### Rewarding High Performers ("Pay for Performance")</summary><div class="details-content">

Many believe that additional incentives for quality improvement can be obtained by linking quality scores to reimbursement. This concept, commonly called *pay-for-performance* (*P4P*) or *value-based purchasing*, is supported by a variety of organizations. Effective performance-based payments show positive results in private industrial applications and, in spite of the absence of convincing evidence, there is widespread belief that similar results can be obtained in medicine. P4P is particularly popular among third party payers. Historically payment was based on the number and the complexity of services provided to patients, but with P4P, some portion of payment is determined by the quality rather than the quantity of services. It remains to be seen whether reimbursement incentives will lead to meaningful improvements in quality of care.

There are several reimbursement models associated with P4P, the most common of which is the *tournament model*. In the tournament approach, there are unequivocal winners and losers. Top performers get bonuses which come from reduced payments to the lower performers. Although popular because of its simplicity, this budget-neutral approach in which one "robs Peter to pay Paul," penalizes precisely the group which most needs financial resources for improvement. Regardless of the mode of implementation, it is obvious that performance measures are destined to be an important and intrinsic part of the surgical milieu in the upcoming years.

</div></details>

<details class="med-details"><summary>
  
### Problems with Assessing Quality of Care—Underuse, Misuse, and Overuse</summary><div class="details-content">

Assessing the quality of cardiac care is a worthy goal of measuring performance. However, this goal is elusive and hard to define. A major problem arises in attaining this goal because uniform definitions of quality of care are not available. Performance measures are a means of assessing cardiac surgical performance. A logical construct from measuring performance standards is that providers who do not meet the performance standards outlined by these measures are guilty of misuse of health-care resources. But there are other indices of health-care quality not covered by these measures, including appropriateness of care and disparities in care (eg, women and minorities often receiving substandard care). Inappropriate use of procedures is often referred to as overuse, and failure to provide indicated care as underuse. Both are found in treatment of cardiovascular diseases. For example, there is substantial geographic variation in the rates at which patients with cardiovascular diseases undergo diagnostic procedures, with little, if any, evidence that these variations affect survival or improved outcome. In one study, coronary angiography was performed in 45% of patients after acute myocardial infarction for patients in Texas compared to 30% for patients in New York State. Another study showed large variations in care delivered to patients having cardiac operations. Among six Veteran's Administration Medical Centers that treated very similar patients, there were large differences in the percentage of elective, urgent, and emergent cases, ranging from 58 to 96% elective, 3 to 31% urgent, and 1 to 8% emergent. There was also a tenfold difference in the preoperative use of intra-aortic balloon counterpulsation for control of unstable angina, varying from 0.8 to 10.6%. Similar variations in physician-specific practices exist for mitral valve procedures, carotid endarterectomy and for blood transfusion during cardiac procedures. This variation in clinical practice may reflect uncertainty about the efficacy of available interventions or differences in practitioners' clinical judgment.

While wide differences in the use of cardiac interventions initially fueled charges of overuse in certain areas; further evaluations suggest that underuse of indicated cardiac interventions (either PCI or CABG) may be a cause of this variation. Whether caused by underuse or overuse of cardiovascular services, regional variations in resource utilization suggest that a rigorous definition of the "correct" treatment of acute myocardial infarction, as in other cardiovascular disease states, is elusive and the definition of quality of care for such patients is imperfect. Regional variations in cardiovascular care delivery are only a few of the examples of *unclear best practices*. Age, gender, race, community size, patient preference, and hospital characteristics influence utilization of diagnostic and operative interventions without much evidence that these factors should direct the appropriate treatment for various cardiac disorders. While measures that define performance assessment may be a way to judge quality of care among providers, much more work needs to be done to define best practices and to limit practice variations before performance measures accurately reflect quality of care.

</div></details>

</div></details>

<details class="med-details"><summary>
  
## TYPES OF ASSESSMENT OF CARDIAC PROCEDURES</summary><div class="details-content">

<details class="med-details"><summary>
  
### Assessment Using Operative Mortality</summary><div class="details-content">

By far, the bulk of available experience with outcome assessment in cardiothoracic surgery deals with operative mortality, particularly in patients undergoing operative coronary revascularization (CABG). Table 7-5 is a partial list of risk models used to assess operative mortality in patients undergoing coronary revascularization. Risk stratification models like those shown in Table 7-5 evaluate mortality outcomes in CABG patients, because mortality is such an unequivocal endpoint of greatest interest to patients and is recorded with high accuracy. For the diagnosis of ischemic heart disease having operative repair, Table 7-5 lists the significant risk factors found to be important for each of the various risk stratification systems. The definition of operative mortality varies among the different systems (either 30-day mortality and/or in-hospital mortality), but the risk factors identified by each of the stratification schemes in Table 7-5 show many similarities. Regression diagnostics validated each of the models in Table 7-5; hence, there is some justification for using any of the risk stratification methods both in preoperative assessment of patients undergoing CABG and in assessing provider performance (either physicians or hospitals). Using the risk models in Table 7-5 for performance assessment of surgeons or hospitals must be done with caution, since, as described previously, risk models are imperfect. Results indicating that a provider is a statistical outlier should always be corroborated by clinical review, and preferably with constructive quality improvement initiatives.

There are many critical features of any risk-adjustment algorithm that must be considered when determining its suitability for profiling provider performance. Daley provides a summary of the key features that are necessary to validate any risk adjustment model. Differences in risk-adjusted mortalities across providers may reflect differences in the process and structure of care, rather than simple outcome assessment, an issue that needs further study.

<details class="med-details"><summary>

#### TABLE 7-5: Published Variables Used in Risk Assessment Models to Predict Coronary Bypass Surgical Mortality</summary><div class="details-content">

| Risk Model | STS | NYS | Canada | USA | VA | Australia | Canada2 | NNE | Japan |
|------------|-----|-----|--------|-----|----|-----------|---------|-----|-------|
| Number of Patients | 774,881 | 174,210 | 57,187 | 50,357 | 13,368 | 12,712 | 12,003 | 3654 | 24,704 |
| No. of Risk Factors | 29 | 29 | 16 | 13 | 6 | 9 | 5 | 9 | 17 |
| Age | X | X | X | | X | X | X | X | X |
| Gender | X | X | X | X | X | | X | | |
| Surgical urgency | X | X | | X | X | X | | X | X |
| Ejection fraction | X | X | X | | X | | X | X | X |
| Renal dysfunction | X | X | X | X | | | | X | X |
| Creatinine | X | | | | | | | | |
| Previous CABG | X | X | | X | | | | X | X |
| NYHA class | | X | X | X | | X | | | X |
| Left main disease | X | X | X | | | | | X | |
| Diseased coronary vessels | X | X | X | | X | | | | |
| Peripheral vascular disease | X | X | | X | | X | | | |
| Diabetes mellitus | X | X | X | | X | | | | |
| Cerebrovascular disease | X | X | | X | | X | | | X |
| Intraop/postop variables | | | | X | | | X | | |
| Myocardial infarction | X | X | X | X | | | | | |
| Body size | X | X | X | | | | | | |
| Preoperative IABP | X | X | X | | | X | | | |
| Cardiogenic shock/unstable | X | X | X | | | | | X | X |
| COPD | X | X | X | | | | | | X |
| PTCA | X | X | | X | | | | | |
| Angina | X | | X | | | | X | | |
| Intravenous nitrates | | X | | | | X | | | |
| Arrhythmias | | X | | | | | | | X |
| History of heart operation | X | | X | | | X | | | |
| Hemodynamic instability | X | X | | | | | | | |
| Charlson comorbidity score | | | | | | | | X | |
| Dialysis dependence | X | X | X | | | | | | X |
| Valvular heart disease | X | | | | | | | | X |
| Pulmonary hypertension | | X | | | | | | | |
| Diuretics | | X | | | | X | | | |
| Systemic hypertension | X | | | | | | | | |
| Serum albumin | | | | | | | | | |
| Race | X | X | | | | | | | |
| Previous CHF | X | | | | | | | X | X |
| Myocardial infarction timing | X | X | | | | | | | |
| Cardiac index | | | | | | | | | |
| LV end-diastolic pressure | | | | | | | | | |
| CVA timing | X | X | | | | | | | |
| Liver disease | | | | X | | | | | |
| Neoplasia/Metastatic disease | | | | X | | | | | |
| Ventricular aneurysm | | | | X | | | | | |
| Steroids/Antiplatelet drugs/other drugs | X | X | | | | | | | X |

###### Reproduced with permission from Grunkemeier GL, Zerr KJ, Jin R: Cardiac surgery report cards: making the grade. *Ann Thorac Surg*. 2001 Dec;72(6):1845-1848.
</div></details>

</div></details>

<details class="med-details"><summary>
  
### Assessment Using Postoperative Morbidity and Resource Utilization</summary><div class="details-content">

Patients with non-fatal outcomes following operations for ischemic heart disease make up more than 95% of the pool of patients undergoing operation. Obviously all non-fatal operative results are not equivalent. Patients who experience renal failure requiring lifelong dialysis, or a serious sternal wound infection, have not had the same result as a patient who leaves the hospital with no major complications, as occurs in about 85% of patients entered in the STS Database. The complications occurring in surviving patients range from serious organ system dysfunction to minor limitation or dissatisfaction with life style, and account for a significant fraction of the cost of the procedures. We estimate that as much as 40% of the yearly hospital costs for CABG are consumed by 10 to 15% of the patients who have serious complications after operation. This is an example of a statistical principle called the Pareto principle and also suggests that reducing morbidity in high-risk cardiac surgical patients has significant impact on cost reduction.

A great deal of information exists on non-fatal complications after cardiac operations. Several large databases identify risk factors for both non-fatal morbidity and increased resource utilization. Table 7-6 is a summary of some of the risk factors identified by available risk stratification models that are associated with either serious postoperative morbidity or increased resource utilization as measures of undesirable outcomes.

For many years, operative mortality was the sole criterion for a successful CABG procedure. This concept gave way to a broader focus on the entire hospitalization associated with CABG. There is universal agreement that non-fatal complications play a central role in the assessment of CABG quality, but many morbidity outcomes are relatively difficult to define and track. Risk adjustment is particularly difficult because of the fact that risk factors for most complications are not well-established. The low frequency of some complications also creates statistical challenges.

Shroyer and coworkers used part of the large national experience captured in the *STS Database* to examine five important postoperative CABG complications: stroke, renal failure, reoperation within 24 hours after CABG, prolonged (>24 hours) postoperative ventilation, and mediastinitis. Revised morbidity models using contemporary statistical approaches followed this landmark study by Shroyer and coworkers. In 2009, the STS morbidity risk models were updated using data from 2002 to 2006, with specific models for isolated CABG, isolated valve, and combined CABG + valve procedures. Given the contemporary data and large reference populations, these risk models will undoubtedly play an important role in future attempts at performance assessment.

<details class="med-details"><summary>

#### TABLE 7-6: Risk Factors Associated with Either Increased Length of Stay (L) or Increased Incidence of Organ Failure Morbidity (M) or Both (L/M) Following Coronary Revascularization</summary><div class="details-content">

| Risk Factor | STS | STS Updated | Boston | Albany | VA | Canada |
|-------------|-----|--------------|--------|--------|----|--------|
| Demographics | | | | | | |
| Advanced age | M | M | L | L | M | L |
| Low preoperative red blood cell volume | M | | | L/M | | |
| Race | | M | | | | |
| Female gender | M | M | | | | L |
| Disease-specific diagnoses | | | | | | |
| CHF | M | M | L | L/M | M | |
| Concomitant valve disease | M | M | | | M | L |
| Reoperation | M | M | | | M | L |
| LV dysfunction (ejection fraction) | M | M | | | | L |
| Surgical priority | M | M | | | M | L |
| 3-Vessel disease | | M | | | | |
| IABP preop | M | M | L | | | |
| Active endocarditis | | | | | M | |
| Left-main disease | | M | | | | |
| Preoperative atrial fibrillation | | M | | | | |
| Comorbid conditions | | | | | | |
| Obesity | | M | L | | | |
| Renal dysfunction | M | M | L | L | M | |
| Diabetes | | M | | | | |
| Peripheral vascular disease | M | M | | L | M | |
| Chronic obstructive lung disease | M | M | | L | | |
| Cerebrovascular disease | M | M | | L/M | | |
| Hypertension | M | M | | L/M | | |
| Immunosuppression | | M | | | | |

###### Abbreviations: CHF = congestive heart failure; LV = left ventricular; IABP = intra-aortic balloon pump.
</div></details>

</div></details>

<details class="med-details"><summary>
  
### Patient Satisfaction as an Outcome</summary><div class="details-content">

Patients' assessment of surgical outcome is an alternate means of judging performance. There are several difficulties with measurement of PRO, and consequently cardiothoracic surgeons are not deeply involved with systematic measurements of patient satisfaction after operation. Considerable research deals with instruments that measure patient satisfaction. At least two of these instruments, the Short-Form Health Survey or SF-36 and the San Jose Medical Group's Patient Satisfaction Measure, are used to monitor patient satisfaction over time. The current status of these and other measures of patient satisfaction does not allow accurate comparisons among providers, because the quality of the data generated by these measures is poor. These instruments are characterized by low response rates, inadequate sampling, infrequent use, and unavailability of satisfactory benchmarks. Nonetheless, available evidence indicates that feedback on patient satisfaction data to physicians may impact physician practices. Managed care organizations and hospitals use PRO measures to compare institutions and individual providers.

Risk stratification methodology can identify patients who are optimal candidates for coronary revascularization based on quality of life and functional status considerations. Multivariate risk factors associated with unimproved postoperative quality of life after CABG include female gender, patients with depressive disorders, and operations complicated by sternal wound infection. One comparative study found no difference between patients older than 65 years and those younger than or equal to 65 with regard to quality of life outcomes after cardiac operations (symptoms, cardiac functional class, activities of daily living, and emotional and social functioning). This study identified a direct relationship between clinical severity and quality of life indicators, since patients with less comorbid conditions and better preoperative functional status had better quality of life indicators six months after operation than those with significant comorbidities. In contrast, Rumsfeld and coworkers found that improvement in the self-reported quality of life (from Form SF-36) was more likely in patients who had relatively poor health status before CABG compared to those who had relatively good preoperative health status. Interestingly, these same authors found that poor preoperative self-reported quality of life indicator was an independent predictor of operative mortality following CABG. These findings suggest that the risks of patient dissatisfaction after CABG are poorly understood but may be dependent on preoperative comorbid factors as well as on the indications for, and technical complexities of, the operation itself. At present, there is no well-established risk model to identify patients who are likely to report dissatisfaction with operative intervention following CABG.

</div></details>

</div></details>

<details class="med-details"><summary>
  
## USING DATA TO IMPROVE PERFORMANCE—CASE STUDIES</summary><div class="details-content">

<details class="med-details"><summary>
  
### Management Philosophy and Performance Assessment</summary><div class="details-content">

American health care made almost unbelievable strides in the last 100 years. We are at the brink of being able to treat disease at the genotypic molecular level. Further, cardiac surgeons treat patients considered inoperable as recently as a decade ago. Yet almost no one is happy with the health-care system. It costs too much, excludes many, is inefficient, and is ignorant about its own effectiveness. A similar state of confusion existed with Japanese industry after World War II. Out of the confusion and crisis of post-World War II, Japan became a monolith of efficiency. Two major architects of this transformation were an American statistician, W. Edwards Deming, and a Romanian-American theoretician, J. M. Juran. They led the way in establishing and implementing certain principles of management and efficiency based on quality. Their efforts are recognized in Japan by the annual awarding of the *Deming Prizes* in recognition of achievements in attaining high quality. Deming's and Juran's books are some of the classics of quality management in industry.

Deming's and Juran's management philosophy are sometimes referred to as total quality management or TQM. The amazing turn-around in Japanese industry led many organizations to embrace and modify the principles of TQM, including organizations involved in delivery and assessment of health care. Table 7-7 outlines the key features of TQM.

<details class="med-details"><summary>

#### TABLE 7-7: Principles of Total Quality Management (TQM) Applied to Health Care</summary><div class="details-content">

| Principle | Explanation |
|-----------|-------------|
| Health-care delivery is a process. | The purpose of a process is to *add value* to the input of the process. Each person in an organization is part of one or more processes. |
| Quality defects arise from problems with the process. | Former reliance on quotas, numerical goals, and discipline of workers is unlikely to improve quality, since these measures imply that workers are at fault and that quality will get better if workers do better. The problem is with the process not with the worker. Quality improvement involves "driving out fear" on the part of the worker, and breaking down barriers between departments so that everyone may work effectively as a team for the organization. |
| Customer-supplier relationships are the most important aspect of quality. | A *customer is anyone who depends on the organization*. The goal of quality improvement is to improve constantly and to establish a long-term relationship of loyalty and trust between customer (patient) and supplier (health-care organization) and, thereby, meet the needs of the patient. The competitive advantage for an organization that can better meet the needs of the customer is obvious. |
| Understand the causes of variability. | Failure to *understand variation in critical processes* within the organization is the cause of many serious quality problems. Unpredictable processes are flawed and are difficult to study and assess. Managers must understand the difference between random (or common-cause) variation and special variation in a given outcome. |
| Develop new organizational structures. | Managers are leaders not enforcers. Eliminate management by objective numerical goals. Remove barriers that rob workers of their right to pride of workmanship. Empower everybody in the organization to achieve the transformation to a quality product. |
| Focus on the most "vital few" processes. | This is known as the *Pareto principle* (first devised by Juran) and states that whenever a number of individual factors contribute to an outcome, relatively few of those items account for the bulk of the effect. By focusing on the "vital few," the greatest reward for effort will occur. |
| Quality reduces cost. | *Poor quality is costly.* Malpractice suits, excessive use of costly laboratory tests, and unnecessarily long hospital stay, are examples of costly poor quality. The premise that it is too costly to implement quality control is incorrect. |
| Statistics and scientific thinking are the foundation of quality. | Managers must make decisions based on accurate data, using scientific methods. Not only managers, but all members of the organization, utilize the scientific method for improving processes as part of their normal daily activity. |

</div></details>

A TQM project starts from critical observations. For example, excessive blood transfusion after operation may result in increased morbidity, including disease transmission, increased infection risk, and increased cost. Tools such as *flow diagrams* that document all of the steps in the process are used in a TQM project (eg, steps involved in the blood transfusion process after CABG). A logical starting point for efforts to improve the quality of the blood transfusion process would be to focus on a high-risk subset of patients who consume a disproportionate amount of blood resources. An Italian economist, Vilfredo Pareto, made the observation that a relatively few factors account for the majority of the outcomes of a complex process. This has been termed the *Pareto Principle*, also known as the "80-20 rule." Juran was one of the first to apply this principle to manufacturing in the United States and Japan. In medicine, this principle is commonly used to point out that most of the observed complications come from a small part of the overall patient population. Applying the Pareto Principle, one should logically focus attention not on the entire population, but rather on that small population associated with the majority of the problem. A graphical method of identifying the spectrum of outcomes in a process is included in most statistics programs, and is termed a Pareto diagram. Figure 7-2 is an example of a Pareto diagram for blood product transfusion in cardiac operations. Figure 7-2 suggests that about 20% of the patients consume 80% of the blood products transfused following cardiac procedures. Substantial savings in cost and morbidity should result by focusing on decreasing the amount of blood transfusion in these 20% "high-end" users. For TQM purposes, strategies can be devised and tested to decrease blood product consumption in the high-risk subset, and ultimately, monitors are set up to measure the effectiveness of the new strategies. Other tools of TQM such as data sampling strategies and use of control charts play an important role in the process.

![](_page_14_Figure_6.jpeg)

**FIGURE 7-2** Pareto diagram of blood transfusion in 4457 patients undergoing cardiac procedures over a 4 year period. *(Reproduced with permission from Ferraris VA, Ferraris SP, Saha SP, et al.: Perioperative blood transfusion and blood conservation in cardiac surgery: the Society of Thoracic Surgeons and The Society of Cardiovascular Anesthesiologists clinical practice guideline, Ann Thorac Surg 2007 May;83(5 Suppl):S27-86.)*

One example of using the principles of TQM to improve patient care is to isolate high-risk subsets obtained from population-based risk models. These retrospective risk models (ie, effectiveness studies) are examined to define key elements of the processes of care that contribute to outcomes. The key components of the process are then used as test interventions to improve outcome in high-risk subsets using RCTs (ie, efficacy studies). For example, a population-based risk model of postoperative blood transfusion revealed that the following factors were significantly associated with excessive blood transfusion (defined as more than 4 units of blood products after CABG): (1) template bleeding time, (2) red blood cell volume, (3) cardiopulmonary bypass time, and (4) advanced age. Based on these retrospective effectiveness studies, investigators hypothesized that process improvement interventions aimed at reducing blood transfusion after CABG would most likely benefit high-risk patients with prolonged bleeding time and low red blood cell volume. A prospective clinical trial tested this hypothesis using two components of the blood conservation process, platelet-rich plasma saving and normovolemic hemodilution, in patients undergoing CABG. Results showed that these two blood conservation interventions reduced bleeding and blood transfusion only in the high-risk subset of patients. These studies imply that more costly interventions such as use of platelet-rich plasma savers are more efficacious in high-risk patients, with the high-risk subset defined by risk stratification methodologies. This approach of using observational risk adjustment models to devise and test hypotheses using efficacy studies is a valuable use of risk assessment models and embodies principles of TQM.

A limitation of any outcomes-based quality improvement project is that knowing outcomes does not necessarily provide the answer to producing better outcomes, rather, it requires the elements of TQM to make meaningful advances. The principles of TQM, including transparent self-assessment and identification of process deficits, are the foundations of quality improvement. Participating in databases like the STS Adult Cardiac Surgery database or the American College of Surgeons National Surgical Quality Improvement Project database does not guarantee adequate performance assessment and quality improvement. Leadership, educational tools, EBM guidelines, practice standards, and benchmarking of improvement processes are important, and essential, additions to outcomes measurement for quality improvement.

</div></details>

<details class="med-details"><summary>
  
### STS Database and Quality Improvement—Transparent Risk Assessment</summary><div class="details-content">

The STS recognized a compelling need for a national standard in cardiac surgery as early as 1986 with the creation of an STS committee to develop a national database of cardiac surgery. This committee gathered and analyzed data in order to establish a national standard of care in cardiac surgery. The STS Database is a voluntary registry that currently collects perioperative patient data from more than 90% of cardiac centers in the United States. Individual participant sites enter extensive clinical data on each patient undergoing cardiac surgery. This information is harvested quarterly and aggregated at the Duke Clinical Research Institute (DCRI). The data are analyzed and reports, which include benchmark data and risk-adjusted outcomes, are provided to each site. This reporting process allows sites to pinpoint areas in need of improvement so that tailored quality assessment and performance improvement programs can be developed. The database has numerous important practical applications that allow performance assessment and document workload.

The STS database allows accurate determination of thoracic surgeons' workload. Much of the recommendations for surgeon reimbursement stems from the *American Medical Association/Specialty Society Relative Value Scale Update Committee, or RUC* (rhymes with "truck") for short. The RUC's recommendations to the Centers for Medicare and Medicaid Services (CMS) influence the relative values assigned to physician services and, as a result, how much physicians are paid. STS data allows monitoring of trends in the patient profile of cardiac surgery patients over the years. This kind of information impacts negotiations with RUC. Deliberations with the RUC were traditionally based on small surveys but the use of STS data allowed a more accurate presentation of objective information that provides a truly fair and meaningful workload analysis.

The STS database reporting and feedback process to individual sites produced impressive *performance improvements in surgical outcomes*. Database information showed a progressive increase in CABG operative risk from 1993 to 2008. In spite of this risk increase, the observed operative mortality steadily declined from over 4% to approximately 2% during this period. Improvements in process measures like use of the IMA in CABG accompanied these impressive advances in outcome measures.

</div></details>

<details class="med-details"><summary>
  
### Peer-Directed Outcomes Assessment</summary><div class="details-content">

A superb example of a TQM-based approach to improving cardiac surgery quality is the Northern New England Cardiovascular Study Group (NNECVDSG). Founded in 1987, this voluntary consortium of clinicians, scientists, and administrators represents cardiac surgery programs in Northern New England. Its mission is to study and improve the quality of cardiovascular care provided to patients through the use of systematic data collection and feedback. Shortly after its formation, this group developed and validated a logistic risk model to account for case mix differences across its member institutions. Using this model, the group analyzed CABG outcomes for 3055 patients operated upon at five medical centers in Maine, New Hampshire and Vermont between July 1987 and April 1989. Overall unadjusted CABG mortality was 4.3% but this varied substantially among centers (3.1 to 6.3%). Even after case-mix adjustment, significant variability persisted among medical centers ($p = 0.021$) and surgeons ($p = 0.025$). In 1990, the NNECVDSG initiated a regional intervention aimed at reducing both absolute CABG mortality and inter-institutional variability. The three major components of this TQM approach included feedback of outcomes data, training in continuous quality improvement techniques, and site visits to each program. During the latter, visitors from each discipline focused on the practice of their counterparts at the host institutions. Numerous changes were implemented as a result of these site visits including technical aspects, processes of care, personnel organization and training, decision-making, and methods of evaluating care. Following these interventions, observed mortality declined to less than expected in all categories of patient acuity.

Following publication of these landmark papers, the Northern New England consortium continued to grow in size, and their registry forms the basis for numerous publications aimed at improving the care of cardiac surgical patients. Their publications cover a wide range of topics including the impact of preoperative variables on hospital and long-term mortality, the optimal conduct of cardiopulmonary perfusion, the prevention of specific postoperative complications, on-pump versus off pump CABG operations, and modes of death following CABG. Over two decades since its inception, the NNECVDSG serves at the "poster child" of efforts to improve cardiac surgery quality through voluntary, confidential, and collaborative TQM.

</div></details>

</div></details>

<details class="med-details"><summary>
  
## CONTROVERSIES IN THE ASSESSMENT OF PERFORMANCE</summary><div class="details-content">

<details class="med-details"><summary>
  
### Dangers of Outcome Assessment</summary><div class="details-content">

After the introduction of provider report cards in New York and Pennsylvania in the early 1990s, studies emerged suggesting that providers were changing their practice patterns in response to public reporting. The release of risk-adjusted data may alienate providers and result in the sickest patients having less accessibility to care. This may have happened in New York State and in other regions where risk-adjusted mortality and cost data were released to the public.

Of even more concern is the selection bias that may exist in managed care Health Maintenance Organization (HMO) enrollment. Morgan and coworkers suggested that Medicare HMOs benefit from the selective enrollment of healthier Medicare recipients and the dis-enrollment or outright rejection of sicker beneficiaries. This form of separation of patients into unfavorable or favorable risk categories is a direct result of risk assessment and may be an unintended consequence of performance assessment methodology. This type of discrimination undermines the effectiveness and appropriateness of care. Omoigui and colleagues addressed this issue in a report about the effect of publication of surgeon-specific report cards in New York state. These authors concluded that surgeons in that state were less willing to operate on high-risk patients. Patients in New York state were subsequently transferred in disproportionately large numbers to the Cleveland Clinic, where both their expected and observed adverse outcomes exceeded those of other referral areas without report cards. Although some public figures challenged this "outmigration" phenomenon, additional studies in New York and Pennsylvania suggest that the concept of risk aversion may have some validity. Subsequent and more comprehensive analyses of CABG public reporting in New York state could not document any systematic exclusion of high-risk patients from CABG operations, and showed that the severity of illness and comorbidities of operated patients actually increased over the years. There may be some degree of risk aversion in public reporting environments, and this could result in denial of care to the high-risk patients that might benefit most from intervention. Others suggest that it may redirect such patients to the most experienced providers, which could be a more positive result.

</div></details>

<details class="med-details"><summary>
  
### Validity and Reliability of Assessment Methods</summary><div class="details-content">

<details class="med-details"><summary>
  
#### ACCURACY OF DATABASES—ADMINISTRATIVE VERSUS CLINICAL DATA</summary><div class="details-content">

Perhaps the most important tool of any outcome assessment endeavor is a database that is made up of a representative sample of the study group of interest. The accuracy of the data elements in any such database cannot be overemphasized. Factors such as the source of data, the outcome of interest, the methods used for data collection, standardized definitions of the data elements, data reliability checking, and the time frame of data collection are essential features that must be considered when either constructing a new database or deciding about using an existing database.

Data obtained from claims or administrative databases are less reliable than those obtained from clinical databases. Because claims data are generated for the collection of bills, their clinical accuracy is inadequate and it is likely that these databases overestimate complications for billing purposes. They may incorrectly classify some surgical procedures, and this in turn may result in erroneous and misleading outcomes results. Furthermore, claims data underestimate the effects of comorbid illness and contain major deficiencies in important prognostic variables for CABG, such as left ventricular function and number of diseased vessels. The Duke Databank for Cardiovascular Disease found major discrepancies between clinical and claims databases, with claims data failing to identify more than half of the patients with important comorbid conditions such as congestive heart failure (CHF), cerebrovascular disease, and angina. The quality of databases used to generate comparisons cannot be overemphasized.

Health-care experts recognize the shortcomings of claims or administrative databases. The primary reason for continued reliance on these types of data sources is their ease of use and readily available access. Current information suggests that discharge coding accuracy is the major problem in the use of administrative databases for outcomes comparisons. Recent reviews found that coding accuracy improved with renewed emphasis on accuracy. It is likely that the low cost and ready availability of administrative data will continue and even increase as health-care resources are ratcheted down.

</div></details>

<details class="med-details"><summary>
  
#### LOGISTIC REGRESSION AND HIERARCHICAL REGRESSION MODELS</summary><div class="details-content">

One of the most common yet controversial applications of logistic regression models is provider profiling, sometimes mandated by governmental organizations, in which case the results are usually published as report cards and made available to the public. The statistical methodology previously used to develop most such report cards is straightforward. The probability of mortality for each of a provider's patients during a given time period is estimated using logistic regression or some other multivariate method based on a large database containing multiple surgeons' patients. These probabilities are aggregated to determine a particular provider's expected mortality, or $E$. The observed mortality, $O$, is simply the counted number of operative deaths. An $O/E$ ratio has a value close to one if the performance is what would be predicted from the model. Ratios significantly greater than 1.0 imply worse than expected performance, and ratios significantly less than 1.0 suggest better than expected performance. Often, the $O/E$ ratios are multiplied by the population unadjusted mortality rate to obtain the *risk-adjusted mortality ratio* (RAMR).

Statisticians realize that, although intuitively appealing, it is not ideal to aggregate patient-level data to make inferences about providers using logistic regression. Assessing operative mortality among hospitals and among surgeons is inherently multilevel. Multiple levels exist that may alter operative mortality, including surgeons, hospitals, referring physicians, etc. In such situations simply aggregating between levels may lead to erroneous conclusions. Multilevel or hierarchical models are available for such situations. These models address most of the major concerns regarding the use of standard logistic regression models. Hierarchical models "shrink" the observed mortality rates of lower volume providers toward the mean of the overall population of providers, a way of borrowing strength or pooling the data from multiple levels of hospitals and providers. The resulting estimates are more accurate and stable. Standard logistic models do not accurately partition the multiple levels of variability (between and within providers), which is one of the central questions to be answered by profiling. Hierarchical models correctly partition this variability and account for sample size variation and compensate for multiple comparisons. Numerous studies investigated the difference in the results of provider profiling obtained from traditional logistic regression versus hierarchical modeling. For example, Goldstein and Spiegelhalter compared a hierarchical model of operative mortality of surgeons in New York state to a traditional single level logistic model, and found reduced number of surgeon outliers using the hierarchical models. A logical objection to the use of hierarchical models is that, by reducing the chance of false outlier identification, it may also reduce the sensitivity to detect true outliers. Ultimately, this tradeoff is a health policy and regulatory decision. Hierarchical models are complex and require not only extensive computer resources but also close planning and oversight by a statistician experienced in these methods. Most investigators regard them as the best model for multilevel comparisons, and hierarchical modeling is used both by the state of Massachusetts and by the STS for the development of provider profiles.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### The Downside of Performance Assessment</summary><div class="details-content">

<details class="med-details"><summary>
  
#### COST AND IMPERFECTION</summary><div class="details-content">

Collecting risk-adjusted data for performance assessment and quality improvement adds to the administrative costs of the health-care system. It is estimated that 20% of health-care costs (\$150-\$180 billion/year) are spent on the administration of health care. The costs of implementing a risk-adjustment system are substantial. Additional costs are incurred in implementing quality measures that are suggested by risk-stratification methodology. A disturbing notion is that the costs of performance assessment may outweigh the payers' willingness to pay for these benefits. For example, Iowa hospitals estimated that they spent \$2.5 million annually to gather MedisGroups severity data that was mandated by the state. Because of the cost, the state abandoned this mandate and concluded that neither consumers nor purchasers used the data anyway. Similarly, reports suggest that public release of quality indicators neither improves composite hospital performance nor changes consumer behavior. It is possible that quality improvement may cost rather than save money; although one of the principles of TQM (often quoted by Deming) is that the least expensive means to accomplish a task (eg, deliver health care) is the means that employs the highest quality in the process. Ultimately, improved quality will be cost-efficient, but start-up costs may be daunting. In order to be cost-effective, any cost savings realized from performance assessment must be factored into the total costs of gathering risk-adjusted data and implementing performance improvement. Further, given the considerable costs of a single serious complication, such as stroke, dialysis-dependent renal failure, or a sternal infection, the cost savings of avoiding these complications using performance assessment and quality improvement programs may be substantial.

</div></details>

<details class="med-details"><summary>
  
#### INTERPRETATION OF RISK-ADJUSTED OUTCOMES</summary><div class="details-content">

One of the least well understood aspects of performance report cards is the correct interpretation of risk-adjusted or risk-standardized outcomes, which are derived by comparing observed outcomes with those predicted by statistical risk models. There is a tendency by the public, by insurance companies, and by government officials to regard Risk-Adjusted Mortality Ratios (eg, O/E ratios) and Risk-adjusted or Standardized Mortality Rates as the ultimate metric of provider performance. Compared to unadjusted rates these are certainly superior approaches, but their limitations must be recognized. First, all risk models are only approximations of reality, and they cannot adjust for all possible combinations of risk factors. These models are useful for predicting population average outcomes given a particular patient mix, but they are less useful for predicting the outcome for specific patients and providers. Second, even if there were perfect risk adjustment, the results for a particular provider must be correctly interpreted. The risk-standardized or risk-adjusted mortality for a hospital reflects its performance for its specific patient case mix, compared to what would have been expected had these same patients been cared for by an average provider in the reference population. Because *indirect* rather than *direct* standardization is used for virtually all risk models used in profiling, it may not be appropriate to directly compare the risk-adjusted results of one institution with those of another. The risk-adjusted mortality of a small community hospital is based largely on a low-risk population. Even though it is adjusted, it cannot be compared directly to the risk-adjusted rate of a quaternary referral center, which is based largely on a population of patients that the community program rarely if ever sees. In this extreme example, these two hospitals may have virtually no types of patients in common, and even though their rates are adjusted they should not be directly compared with one another.

</div></details>

<details class="med-details"><summary>
  
#### RANKING PROVIDERS—LEAGUE TABLES VERSUS FUNNEL PLOTS</summary><div class="details-content">

There is a problem with report cards of provider results that appear in the lay press and on the Internet. Most report cards rank providers in the form of league tables, similar to tables used in sports to rank teams or individuals. League tables always have someone on top and someone on the bottom. In general, the public does not understand that there is no meaningful difference for the vast majority of names published in league tables of cardiac surgeons' performance. The limited sample size of any individual surgeon or hospital leads to wide fluctuation in outcomes over time. Reporting of one surgeon as being better (ie, higher in the league table) than another is inaccurate and probably unethical. Spiegelhalter addressed this concern and suggested better options for reporting surgeons' and hospitals' results. He advocated funnel plots as a far better alternative than league tables to report provider outcomes. A funnel plot is a plot of individual surgeons' volume (x-axis) versus risk-adjusted mortality (y-axis) with population confidence intervals. The plot allows immediate identification of outliers (ie, providers outside the confidence intervals) and gives the viewer an estimate of the larger uncertainties (ie, increased confidence intervals) of risk-adjusted mortality of low-volume providers compared to high-volume providers. The limits of uncertainty (ie, control limits) form a funnel around the provider outcome. The United Kingdom Central Cardiac Audit Database (http://www.ic.nhs.uk/services/national-clinical-audit-support-programme-ncasp/heart-disease/adult-cardiac-surgery) and the STS Congenital Heart Surgery Database Report use funnel plots to identify outliers.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
## FUTURE DIRECTIONS</summary><div class="details-content">

<details class="med-details"><summary>
  
### Effectiveness, Appropriateness, Guidelines, and Standards</summary><div class="details-content">

<details class="med-details"><summary>
  
#### EFFECTIVENESS VERSUS SAFETY</summary><div class="details-content">

Since the IOM report on medical errors that appeared in 2000, reducing medical errors both by physicians and by hospitals garnered significant resources. Since then, several authors suggested that the culture of safety in hospitals is unchanged. Brennan and coauthors point out that the IOM distinguishes safety from effectiveness. Effectiveness is defined as an evidence-based intervention that improves quality, whereas safety encompasses a much narrower definition of limiting accidental injury. These authors suggest redirection of health-care goals toward effectiveness interventions and away from accident reduction interventions. An important advantage of focus on effectiveness is the ease with which effectiveness outcomes can be measured compared to safety outcomes. There is some evidence that focus on evidence-based interventions (eg, providing aspirin to cardiac patients when they leave the hospital) improves the effectiveness of treatment with secondary benefit of reducing errors. Furthermore, there is still a reluctance to deal transparently with medical mistakes and identifying problems with safety may be difficult. Health-care providers may not spend significantly increased resources on safety and error management largely because the return on this type of investment is very hard to measure. On the other hand, quality improvement efforts based on evidence of effectiveness are likely to be more readily embraced and may save more lives than will safety-related interventions that lack an evidence base.

</div></details>

<details class="med-details"><summary>
  
#### PRACTICE GUIDELINES AND APPROPRIATENESS CRITERIA</summary><div class="details-content">

An important part of implementing effectiveness of care is knowing what evidence-based interventions represent best practice. Practice guidelines provide evidence-based recommendations for cardiovascular interventions and serve as a template for effectiveness. Professional societies attempted to enhance adherence to evidence-based practice guidelines by introducing appropriateness criteria. Appropriateness criteria are lists of appropriate indications for interventions in common clinical scenarios based on available evidence. They document indications for drug or device intervention with a scale metric. For example, the AHA/ACC/STS Joint Task Force generated appropriateness criteria for coronary revascularization that used a scale of 1 to 10. Values of 7 through 10 indicated that coronary revascularization is appropriate for patients with a particular set of risk factors. Scores of 1 to 3 indicate revascularization is inappropriate and unlikely to improve health outcomes or survival. The mid-range scores (4–6) suggests that improvement in survival or other health-care outcomes with coronary revascularization is uncertain. The aim of appropriateness criteria is to guide physician decision making toward use of evidence-based interventions. It is likely that expansion of the appropriateness criteria concept will occur.

</div></details>

<details class="med-details"><summary>
  
#### GUIDELINES VERSUS STANDARDS</summary><div class="details-content">

Practice guidelines gained a hallowed position in the hierarchy of evidence starting with Archie Cochrane in the 1950s (see Fig. 7-1). Cochrane championed RCTs as a means of testing medical hypotheses in order to make decisions about best treatment for diseases. His work ultimately led to establishment of the Cochrane Collaboration and the Cochrane Library, a repository of RCTs, meta-analyses, and systematic reviews. Cochrane is arguably the father of EBM, although his definition of EBM in the 1960s was much narrower than the current definition. Today's definition of EBM encompasses practice guidelines that reflect available evidence. The basic principles of EBM are that decisions about medical care should be based on research and that these research recommendations should be ranked based on specific norms (ie, the level of evidence).

Several pieces of evidence suggest that adherence to guidelines and incorporation into clinical practice is suboptimal. For example, blood conservation guidelines for cardiac surgery developed by the STS were circulated widely and are among the most cited articles in the thoracic surgery literature. Nonetheless, wide variation in the transfusion of blood products in patients having a standard operation for coronary revascularization persists. A Physician Consortium of the American Medical Association and The Joint Commission identified transfusion as one of the five most overused procedures in the United States (http://www.jointcommission.org/overuse_summit/).

There are many reasons for guideline nonadherence, but it is apparent that implementation strategies need to accompany evidence-based recommendations and dissemination. Professional organizations recognize the limits of guideline development and take a different approach to implementation of evidence-based recommendations. These implementation strategies have various names like standardized practice design, standardized EBM protocol, evidence-based algorithm, decision aids, or perhaps most euphemistically, "organizational recommendations." Collectively implementation strategies define a term called practice standards. Standards are a means of operationalizing EBM and practice guidelines. For example, the Society for the Advancement of Blood Management (SABM) recognized the limitations of blood management guidelines as a means of improving transfusion practice. SABM developed blood management practice standards to address this problem. This organization defined twelve patient blood management standards that operationalize blood conservation guidelines and provide a roadmap for the creation of an infrastructure that leads to implementation of evidence-based guidelines. Simply stated, *standards allow* conversion of guidelines into bedside practice. Accompanying the standards are hard outcome measures that are monitored by multidisciplinary teams. The efforts that go into creating standards parallel the rigor accompanying development of guidelines. While guidelines reflect available evidence, standards indicate how to implement EBM and monitor the success of those efforts in a continuing cycle of implementation and measurement. The introduction of practice standards guides quality assessment, and their increased use is virtually assured given the changing health-care environment.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Human Factors Research and Performance Assessment</summary><div class="details-content">

Surgeons make errors in the operating room. The causes of these errors and their ultimate impact on outcomes are an important measure of performance. Human factors are responsible for many errors that affect performance. Human factors research is concerned primarily with the performance of one or more persons in a task-oriented environment interacting with equipment, other people, or both. Structured observation of surgeons by experts in human factor analysis can provide performance assessment and improve outcomes. The airline industry had success in limiting errors by instituting human factor analysis of pilots during simulated flight. This industry is used as a model of successful implementation of error avoidance behavior and process improvement. Several authors report application of these same principles of human factors analysis to pediatric cardiac operations with some success. They employed self-assessment questionnaires and human factors researchers who observed behavior in the operating room, an approach similar to the quality improvement steps used in the airline industry. These studies highlight the important role of human factors in adverse surgical outcomes. More importantly, they found that appropriate behavioral responses in the operating room can mitigate potentially harmful events during operation. Such studies emphasize that human factors are associated with outcomes, both good and bad. Behavior modification and process improvement that involves human factor analysis hold promise for error reduction in cardiac surgery.

</div></details>

<details class="med-details"><summary>
  
### Public Reporting and Provider Accountability</summary><div class="details-content">

Today there is an unprecedented call for accountability and public reporting. That call comes from consumer groups and insurers as it has in the past, but today it is coming from governmental organizations including the US Congress as well. There is now federal legislative force mandating the collection and the release of this information. The Centers for Medicare and Medicaid Services (CMS), for example, made it quite clear that their upcoming "pay for performance" programs will include mandated public reporting of data.

The World Wide Web provides ready access to a wide variety of medical facts, particularly concerning cardiothoracic surgery. Simple Internet searches provide the public with literature reviews of cardiac procedures, the results of randomized trials, new innovations, and surgeon and hospital-specific outcomes. This ready public access will undoubtedly increase. There is limited external scrutiny or validation of many of the information sources. Most information available on these sites is accepted at face value by the public and quality control of the information sources is limited to self-imposed efforts on the part of the website authors. The *Agency for Healthcare Research and Quality (AHRQ)* attempted to empower the public to critically evaluate the various web-based sources of health-care information in order to limit the spread of misinformation. The success of the AHRQ efforts is uncertain but becomes extremely critical as the amount of health-care information available on the web skyrockets.

The goal of public reporting of performance is to empower consumers to seek optimal care and to modify provider practices to improve outcomes. The ability of public reporting of performance to accomplish these goals is uncertain. Evidence suggests that public reporting does not accomplish any of these stated goals. A Cochrane Review found that public release of performance data neither changes consumer behavior nor improves care. Despite shortcomings associated with web-based public information sources, the national cry for public reporting continues unabated. Recognizing the inevitability of this national movement, the STS initiated a project to develop a public reporting format that contains clinical data that is meaningful, audited, totally transparent and clinically relevant both for physicians and for the public. In collaboration with *Consumers Union*, the STS began publishing the composite CABG performance measures for those program participants that agreed to do so. This information appeared in *Consumer's Report* and was one of the most widely read issues of this magazine ever (http://www.consumerreports.org/cro/2011/08/looking-for-a-heart-surgeon/index.htm). There is obvious public interest in information transparency about cardiac operations. The uncertainty is how, or if, the public changes behavior in response to this publically available information. This type of partnership may well become the paradigm for other professional organizations as they manage public reporting. Public reporting of cardiac surgical outcomes provides transparency and has public appeal.

</div></details>

<details class="med-details"><summary>
  
### Information Management: Electronic Medical Records</summary><div class="details-content">

Medical records are an invaluable source of information about patient risk factors and outcomes. Inevitably computer applications are applied to medical records. Pilot studies assessed the importance of *computerized medical records* in a variety of clinical situations. Perhaps the most important example of successful implementation of computerized medical records lies within the *Veterans Health Affairs (VHA)* medical system in the United States. Over a 20 year period the VHA system of hospitals completed a dramatic conversion from problematic, fragmented care to a nationally recognized health-care delivery system. This transformation was aided, if not completely caused by, the implementation of a costly but highly successful computerized medical record system.

Iezzoni pointed out the difficulties with computerized medical records and suggests that they may not adequately reflect the importance of chronic disability while at the same time prolonging the time that physicians spend documenting care into the computer system. Yet the advantages of reduced medical errors, improved efficiency, and expanded access to medical information all overshadow most objections to implementation of an electronic information system.

Legislation passed by Congress allocates health-care reforms that include an investment of \$50 billion to promote health information technology. Further, in its economic recovery package, the Obama administration will spend \$19 billion to accelerate the use of computerized medical records in doctors' offices (http://www.nytimes.com/2009/03/01/business/01unbox.html). Medical experts agree that electronic patient records, when used wisely, can help curb costs and improve care. Pending legislation indicates that physicians will be paid a bonus only for the "meaningful use" of digital records, although the government has not yet defined that term precisely. The new legislation also calls for creation of "regional health I.T. extension centers" to help doctors in small office practices use electronic records. It is apparent that the need for data about large groups of patients exists, especially for managed care and capitation initiatives. It is reasonable to expect that efforts to computerize medical records will expand. Applications of electronic medical records that may be available in the future for cardiothoracic surgeons include monitoring of patient outcomes, supporting clinical decision making, and real-time tracking of resource utilization.

Computer applications were applied to the electronic medical record in hopes of minimizing physician errors in ordering. Computerized physician order entry (CPOE) is one of these applications that monitors and offers suggestions when physicians' orders do not meet a predesigned computer algorithm. CPOE is viewed as a quality indicator and private employer-based organizations used the presence of CPOE to judge whether hospitals should be part of their preferred network (http://www.leapfroggroup.org/). One of these private groups is the *Leapfrog Group* and an initial survey by this Group in 2001 found that only 3.3% of responding hospitals currently had CPOE systems in place (http://www.ctsnet.org/reuters/reutersarticle.cfm?article=19325). In New York State, several large corporations and health-care insurers agreed to pay hospitals that meet the CPOE standards a bonus on all health-care billings submitted. Other computer-based safety initiatives that involve the electronic medical record are likely to surface in the future. The impact of these innovations on the quality of health care is untested and any benefit remains to be proven.

The success of information technology used to reduce medical errors is mixed. Innovations that employ monitoring of electronic medical records may reduce errors. However, with the increasing implementation of commercial CPOE systems in various settings of care, evidence suggests that some implementation approaches may not achieve previously published results or may actually cause new errors or even harm. Much work needs to be done before computer-aided methods lead to medical error reduction but the future will see more efforts of this type made. The increasing role of CPOE systems in health care invites much more scrutiny about the effectiveness of these systems in actual practice.

</div></details>

</div></details>