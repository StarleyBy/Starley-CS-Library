# Quality Assurance

##### The American Society of Quality defines quality assurance as that «part of quality management focused on providing confidence that quality requirements will be fulfilled.» Healthcare quality assurance typically compares observed outcomes (e.g., mortality rates) with normative or expected outcomes using observed to expected ratios or risk‑adjusted rates. Performance outliers may be identified, and results may be published. In this chapter, quality assurance in adult and pediatric cardiac surgery is described, including relevant history, important methodological considerations, limitations and concerns regarding current practices, and potential future innovations.

<details class="med-details"><summary>
  
## Executive Summary</summary><div class="details-content">

### Historical Foundations
*   **Florence Nightingale (19th century):** Published variable mortality among London hospitals; recognised need for risk adjustment and potential for «gaming» (e.g., premature discharge of terminally ill patients).
*   **Ernest Amory Codman (early 20th century):** Advocated public reporting of surgical outcomes, classified results as Perfect/Good/No Improvement/Bad Result/Died, and categorised causes of adverse events (E‑s, E‑j, E‑c, E‑d, P‑d, P‑r, C). Known as the «Father of outcomes assessment».
*   **Nonrandom variation in healthcare:** Similar to industrial production, unexplained variation exists in procedural utilisation (Wennberg, Dartmouth Atlas) and outcomes. Statistical quality‑control methods applied to cardiac surgery from 1996 onward.
*   **Technologic advances:** Large healthcare datasets (Medicare, state registries, VA, STS), modern computing, and statistical innovations (logistic regression, hierarchical mixed‑effect models) enabled large‑scale quality measurement.

### Modern Quality Initiatives in Adult Cardiac Surgery
*   **Veterans Administration (VA):** 1985 legislation mandated risk‑adjusted outcome comparisons, leading to NSQIP (later ACS NSQIP).
*   **State report cards:** New York (1990 hospital, 1992 surgeon), Pennsylvania, New Jersey, Massachusetts, California. Associated with significantly improved outcomes.
*   **Regional collaboratives:** Northern New England Cardiovascular Disease Study Group (voluntary, confidential, exchange visits); Michigan Society of Thoracic and Cardiovascular Surgeons (MSTCVS) Quality Collaborative (Phase of Care Mortality Analyses); Virginia Cardiac Services Quality Initiative (VCSQI) — all using STS data to drive improvement.
*   **Society of Thoracic Surgeons (STS):** Formed 1986 Ad Hoc Committee on Risk Factors. Confidential performance feedback reports since 1990s. Participation grew to >1000 adult programs by 2022. Public reporting of composite outcomes and star ratings since 2010. STS has 34 NQF‑endorsed measures.

### Methodologic Considerations
*   **Data sources:** Administrative claims (Medicare, HCUP) — inexpensive but lack clinical granularity; clinical registries (STS, ACC, ACS) — structured, granular, robust risk adjustment; electronic health records (EHR) — unstructured but potential for AI/ML; data linkage optimises strengths of each.
*   **Target conditions/procedures:** Should be frequent, have significant adverse outcome potential, demonstrate reasonable variation across providers. STS composite measures all show such variation (Figs. 8.3, 8.4).
*   **Provider attribution:** Hospitals most common level; surgeon‑level possible with sufficient volume (STS multiprocedural composite reliability 0.81). Surgeon‑hospital combinations also reported.
*   **Observation periods:** In‑hospital mortality subject to discharge bias; 30‑day outcomes are gold standard but harder to ascertain. STS uses «operative mortality» (in‑hospital + 30‑day). Provider observation typically 3 years to increase sample size and reliability.
*   **Types of performance measures (Donabedian):**
    - **Outcomes:** Mortality, morbidity (serious complications), readmission (CMS HRRP). Readmission balancing measures needed (e.g., 30‑day mortality).
    - **Process measures:** Evidence‑based, guideline‑recommended care (e.g., ITA use, perioperative medications). Actionable but risk of «check the box» and ceiling effects.
    - **Structure measures:** Procedural volume (Leapfrog Group thresholds). Volume–outcomes association strongest for complex, low‑frequency procedures.
    - **Appropriateness:** Underuse, misuse, overuse. AUC for coronary revascularisation (2009‑2017) and aortic stenosis (2017). Studies show half of nonacute PCIs were uncertain/inappropriate; public reporting improved appropriateness.
    - **Patient‑reported outcomes (PRO):** SF‑36, PROMIS, NYHA class, KCCQ, SAQ. PRO‑PMs remain controversial.
    - **Patient experience of care:** HCAHPS scores — structured, validated, associated with better adherence and outcomes, teachable skills.
    - **Failure to rescue:** Conditional probability of death given serious complication. More related to hospital resources than patient comorbidities. STS studies show wide variation.
    - **Composite performance measures:** Aggregate multiple domains (e.g., STS CABG composite: risk‑adjusted mortality 81% weight, morbidity 10%, ITA use 7%, medication use 3%). Increase ability to differentiate outliers (23% vs. 1% with mortality alone).

### Statistical Concepts
*   **Sample sizes:** Small provider volumes limit reliability. Approaches: longer collection windows, heterogeneous procedure categories, higher attribution levels, shrinkage estimation (hierarchical models).
*   **Confidence/credible intervals:** 95% credible interval = 95% probability true parameter lies within. Wide intervals at typical volumes (Fig. 8.6).
*   **Reliability:** Proportion of variability due to real performance differences. Higher with larger caseloads, higher event frequencies, composite measures. STS requires average reliability >0.5 for star ratings (Table 8.1).
*   **Statistical power:** For cardiac surgery (mortality 2.7%), 352 procedures needed for power 0.8; median annual surgeon procedures 128.
*   **Performance classification:** Rating (better/worse/as expected) preferred over ranking (wide overlapping confidence intervals). Norm‑based thresholds using statistical hypothesis testing superior to partitioning (quintiles misclassify outliers).

### Risk Adjustment
*   **When and why:** Necessary when patient factors (pre‑existing, beyond provider control, impact outcomes, vary across providers) exist. Ensures face validity.
*   **Hierarchical vs. conventional logistic:** Hierarchical models account for clustering, small samples, and multiple comparisons; produce more conservative outlier estimates.
*   **Direct vs. indirect standardisation:** Indirect standardisation (used almost universally) allows comparison only with benchmark population, not directly between providers with different case mixes.
*   **Permissible risk factors:** Only pre‑intervention factors. Categories: demographic/clinical (age, sex, comorbidities, previous interventions); functional status and frailty (5‑meter walk test in STS, prehabilitation); social risk factors (socioeconomic position, race, area deprivation index, insurance type). Consensus guidelines recommend conceptual modelling, empirical validation, stratification by social risk categories to identify disparities.

### Public Reporting
*   **Arguments for:** Patient autonomy, informed choice.
*   **Unintended consequences:** Gaming (upcoding, case shifting) and risk aversion (refusing high‑risk patients). Empirical evidence for risk aversion in cardiac surgery is weak; stronger in PCI. Mitigation: credible risk models, separate reporting for exceptionally high‑risk patients, team‑based decision‑making, monitoring access.

### Future Directions
*   **AI/ML approaches:** Potential for detecting nonlinear associations, novel predictors, automating feature extraction. Limitations: low dimensionality, small samples, rare events. Solutions in Appendix 8B.
*   **Nonfatal outcomes:** Composite morbidity domains, failure to rescue.
*   **Reduced lag time:** Automated data extraction, real‑time monitoring.
*   **Fewer, more credible, consistent measures:** Standardised methodologies (Pronovost, Berwick).

### Pediatric Cardiac Surgery Quality Assurance
*   **Historical evolution:** Early mortality for benchmark operations; RACHS‑1 (2002, expert opinion); STAT score (2009, empirical, derived from STS and EACTS databases); PRAiS model (UK, 2012, updated 2017, 2024). Current focus includes complications, long‑term survival, neurodevelopmental outcomes, HRQoL.
*   **Data standards:** International Pediatric and Congenital Cardiac Code (IPCCC, 367 terms in ICD‑11). Extracardiac variables (preoperative mechanical support, renal dysfunction, shock, ventilation) added to risk models.
*   **Registries and collaboratives:** STS‑CHSD (North America, voluntary, 85% US programs), NCHDA (UK, mandatory, public reporting), ECHSA (Europe), PC4 (Pediatric Cardiac Critical Care Consortium, dashboards, safety bundles). Data linkage (STS‑CHSD + PHIS; UK linkage across 20 years) enables long‑term outcome assessment.
*   **Risk model assessment:** Coverage, discrimination (AUC), calibration (Hosmer‑Lemeshow, calibration slope). UK uses MADCAP (CUSUM‑type) for model evaluation.
*   **Morbidity challenges:** Distinguishing pre‑existing from new morbidities; time horizon (30 days or same hospitalisation). Special morbidities: technical performance scores, unplanned reoperations (5.4% in STS‑CHSD), neurologic events and child development (up to 25% of infants). AHA guidelines for neurodevelopmental surveillance.
*   **Real‑time monitoring:** Run charts, VLAD (variable life‑adjusted display) charts. UK spreadsheet software co‑designed with clinicians. PC4 dashboards enable intercenter learning.
*   **Reporting to parents:** Transparency and accessibility; layering information; use of survival (not mortality) and horizontal bar graphs; involve parents in content development (UK website example). Key findings from Spiegelhalter’s workshops: risk ratios hard to understand, survival better than mortality, horizontal bars preferred, simple education and cartoons essential.
*   **Family involvement:** Parents prioritise holistic outcomes (feeding, development, communication) more than clinicians (ECLS, reoperation). Changing what is measured through family engagement.

### Controversies in Quality Assurance
*   **Goodhart’s Law:** «When a measure becomes a target, it ceases to be a good measure.» Risk of losing sight of ultimate goal.
*   **Risk of intervention vs. nonintervention:** Standard risk calculators do not estimate risk of alternatives. Shared decision‑making requires eliciting patient priorities (stroke vs. death vs. dialysis).
*   **Quaternary referral centers:** «Courts of last resort» face unique pressures; risk aversion may actually be optimal sorting of high‑risk patients to most capable surgeons.
*   **Priming effect:** «10% chance of dying» vs. «90% chance of surviving» — mathematically equivalent but affect decisions differently.
*   **Cost considerations:** TAVR vs. SAVR — similar outcomes, different costs and margins; who decides?
*   **Gaming:** Case 2 — adding unnecessary valve repair to change procedure category; anecdotal but no objective evidence. Transplant allocation changes led to use of less safe temporary devices for higher priority (patient advocacy vs. gaming).
*   **Stifling innovation:** Case 3 — ventricular reconstruction vs. transplant in high‑risk patient; public reporting may discourage innovative procedures.
*   **Moral distress:** Conflict between patient well‑being and system pressures (performance metrics, reputation, remuneration). Contributes to physician burnout.

</div>
</details>

<details class="med-details"><summary>
  
## SECTION I: QUALITY ASSURANCE IN ADULT CARDIAC SURGERY</summary><div class="details-content">

Quality measurement and improvement initiatives, which may incorporate public reporting and value‑based purchasing, are increasingly the norm in contemporary health care. In this section, we first review the history of healthcare quality measurement (often referred to as provider profiling), performance improvement, and public reporting, with particular emphasis on cardiac surgery. This is followed by presentations of important methodological and statistical considerations in performance measurement. Finally, we conclude with some perspectives on the future of quality measurement and improvement.

<details class="med-details"><summary>
  
### Historical Note</summary><div class="details-content">

<details class="med-details"><summary>
  
#### Nightingale and Codman</summary><div class="details-content">

Florence Nightingale, founder of modern nursing and the first female member of the Royal Statistical Society, is rightly credited for her seminal work on healthcare quality in the mid and late 19th century United Kingdom, including her publication of widely variable (albeit statistically flawed) mortality among London hospitals. Nightingale also made insightful observations regarding the need for risk adjustment and the potential dangers of report card *gaming*, such as terminally ill patients being prematurely discharged or transferred to another hospital to avoid responsibility for an inevitable death.

Subsequent to Nightingale, the most significant and sustained efforts in healthcare quality measurement have been largely driven by surgeons, beginning with the prolific work of Dr. Ernest Amory Codman of the Massachusetts General Hospital and Harvard Medical School, who stated in 1918:

*«So I am called eccentric for saying in public: That hospitals, if they wish to be sure of improvement, must find out what their results are. Must analyze their results... Must compare their results with those of other hospitals... Must welcome publicity not only for their successes, but for their errors... Such opinions will not be eccentric a few years hence.»*

Codman believed that it was the ethical responsibility of healthcare providers to publish their results so that the public could consider these data when choosing a provider, most importantly to avoid a low‑quality provider. In response, providers would be incentivised to improve their outcomes and to avoid performing procedures for which they were not qualified.

In 1902, Codman published the first detailed, hospital‑specific, short‑ and longer‑term surgical outcomes that were available to the public. Having obtained 1‑year follow‑up using in‑person interviews of patients who had undergone a variety of procedures on the East Surgical Service of the Massachusetts General Hospital in early 1900, he classified each procedure’s results and summarised them in a table as *Perfect, Good, No Improvement, Bad Result, Died*, and *Died after Leaving Hospital*, a granular level of outcomes assessment rarely seen today. Later, after he began his own private hospital on Pinckney Street in Boston, Codman further expanded his commitment to accountability and public reporting, publishing detailed summaries of every patient’s case, their outcomes, and for each adverse event, a shorthand classification of the probable cause: (1) errors due to lack of technical knowledge or skill, E‑s; (2) errors due to lack of surgical judgment, E‑j; (3) errors due to lack of care or equipment, E‑c; (4) errors due to lack of diagnostic skill, E‑d; (5) the patient’s unconquerable disease, P‑d; (6) the patient’s refusal of treatment, P‑r; and (7) the calamities of surgery or those accidents and complications over which we have no known control, C.

Despite Codman’s seminal contributions, for which his headstone appropriately refers to him as the *«Father of outcomes assessment and quality measurement in health care,»* there was subsequently little national engagement in healthcare quality measurement until the second half of the 20th century.

</div></details>

<details class="med-details"><summary>
  
#### Nonrandom Variation in Industrial Production and Health Care</summary><div class="details-content">

With the introduction of large‑scale industrial production in the early 20th century, substantial variation in the output of manufacturing processes became evident, including *random statistical fluctuation* and *systematic variation* (e.g., faulty machinery in some assembly lines, less experienced staff). In the mid‑to‑late 20th century, it became increasingly apparent that similar to industrial production, there was also unexplained, often substantial, nonrandom variation in health care. This variation was present in both *procedural utilization*, as introduced by Wennberg and colleagues at Dartmouth (ultimately the basis of the Dartmouth Atlas), and also in healthcare *processes of care and outcomes*.

The need to accurately differentiate random from nonrandom variation in healthcare outcomes led to the application of *statistical quality‑control* approaches as used in manufacturing to the longitudinal monitoring of continuous and binary healthcare outcomes, including in cardiac surgery, as described by Shahian and colleagues in 1996. Objective data from state, federal, and professional society report cards, including the Society of Thoracic Surgeons (STS), have continued to document statistically significant, nonrandom variation among different treatment strategies and different providers for the same conditions or procedures.

</div></details>

<details class="med-details"><summary>
  
#### Technologic and Methodologic Advances</summary><div class="details-content">

Several technologic and methodologic advances subsequently expanded the scale and scope of these early quality monitoring activities.

**Large Healthcare Datasets.** Reliable statistical differentiation of random from nonrandom variation typically requires large amounts of data from broadly representative and diverse populations. Such data were generally unavailable until the mid‑20th century. Enactment of Medicare legislation in 1965, though primarily a federal healthcare insurance program, produced a secondary but critical benefit—an expansive set of granular, nationally representative, patient‑level health data that could be used for large‑scale national quality studies, at least for the older population. Later, beginning in the late 1980s, clinical registry data were introduced by states (e.g., New York), the Veterans Affairs Administration, regional quality initiatives (e.g., the Northern New England Cardiovascular Disease Study Group), and professional societies (e.g., the STS, the American College of Surgeons). These provided standardised, structured, granular, clinically relevant data sources for risk‑adjusted outcomes analyses.

**Quantum Advances in Computing.** The advent of modern computing was also critical for managing large datasets and complex statistical analyses. The availability of mainframe and desktop computers greatly enhanced data storage capacity, computational speed, and portability, thereby allowing large databases to be analysed efficiently.

**Statistical Innovations.** Another facilitator of contemporary quality measurement was the evolution and application of modern statistical techniques. Cornfield, in response to Framingham Heart Study investigators, introduced logistic regression in 1961, and variations of this model has been widely used for decades to estimate risk‑adjusted binary healthcare outcomes.

In the late 20th century, hierarchical mixed‑effect models were first applied to assess education effectiveness in the United Kingdom and for health care (*small area analyses*). Similar approaches were subsequently applied to healthcare provider profiling, where these models explicitly accounted for clustered data (i.e., the patients of a given provider tend to be more similar to one another than to patients of another provider, thereby reducing the number of independent observations); variable and often small sample sizes; and the need to explicitly differentiate random from systematic variation.

</div></details>

<details class="med-details"><summary>
  
#### Advent of the Modern Era of Provider Quality Assessment</summary><div class="details-content">

Two transformative, national legislative acts in December 1985 and early March 1986 signalled the beginning of the modern era of provider profiling. Public Law 99‑166 of December 3, 1985, referring to the Veterans Administration (VA) healthcare system, was effectively the beginning of nationally mandated QA using *risk‑adjusted data* to compare provider outcomes within a federal program (VA). This ultimately led to the development of the National Surgical Quality Improvement Program (NSQIP) and its clinical data registry.

Several months after this VA legislation, on March 12, 1986, the Health Care Financing Administration (HCFA, the predecessor of the Centers for Medicare and Medicaid Services [CMS]) published mortality reports for various procedures and conditions for all US hospitals caring for Medicare patients, including the identification of putative outliers with excessive mortality. These reports included mortality outcomes and outliers for coronary artery bypass grafting surgery (CABG).

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Evolution of Cardiac Surgery Quality Initiatives</summary><div class="details-content">

<details class="med-details"><summary>
  
#### The Veterans Administration</summary><div class="details-content">

Cardiac surgery quality had been monitored in the VA since 1972 primarily using volumes and unadjusted outcomes. In response to the 1985 VA QA legislation, a one‑page clinical data form was designed and collected for each patient, and these data were used to generate risk‑adjusted outcome reports for each program. In 1991, the VA Continuous Improvement in Cardiac Care Study Program was initiated, and in 1994, similar VA quality monitoring was expanded to all surgery through the formation of the VA NSQIP, which later evolved into the American College of Surgeons NSQIP program.

</div></details>

<details class="med-details"><summary>
  
#### State and Regional Report Cards</summary><div class="details-content">

Several states also developed robust, risk‑adjusted, quality assessment and public reporting programs in cardiac surgery including New York, Pennsylvania, New Jersey, Massachusetts, and California. New York was among the first of these in the late 1980s and initial public release of hospital data began in 1990; a surgeon report card was published beginning in 1992. These initiatives have been associated with significantly improved outcomes. Massachusetts began collecting cardiac surgical data using the STS Database in 2000, publishing its first hospital‑level report card in 2002 and its first surgeon report in 2006 (based on 2002‑2004 data). This initiative used state‑of‑the‑art Bayesian hierarchical methodologies, and its implementation was associated with outcomes that were significantly better than national results.

</div></details>

<details class="med-details"><summary>
  
#### Quality Improvement Initiative: Northern New England, Michigan, Virginia</summary><div class="details-content">

Most cardiac surgery quality programs have focused primarily on outcomes measurement, which is then expected to motivate performance improvement indirectly. Some regional and statewide initiatives have adopted a more direct approach to improvement—provider‑focused, collaborative, confidential improvement initiatives.

The exemplar for this approach was the Northern New England Cardiovascular Disease Study Group (NNE), a voluntary regional consortium of six cardiac centers in Maine, Massachusetts, New Hampshire, and Vermont that included surgeons, interventional cardiologists, anaesthesiologists, perfusionists, administrators, and researchers. A simple, standardised data form was collected for each patient, and data were then aggregated and analysed to identify areas of variation and opportunity. Best‑practice, collaborative approaches were used, with exchange visits between programs and multiple annual meetings where improvement opportunities and projects were discussed. The clinical research produced by the NNE was prolific and had a substantial regional and national impact in reducing adverse events and unwarranted variation and improving outcomes.

The Michigan Society of Thoracic and Cardiovascular Surgery (MSTCVS) and the MSTCVS Quality Collaborative include all cardiac surgical centers in that state, encompassing a wide variety of program sizes, rural versus urban locations, ownership, and academic intensity. Using the STS Database, the MSTCVS created a regional report, initially confidential, which detailed the outcomes of all programs and identified areas of opportunity, both statewide and for individual programs. A critical feature of these initiatives was Phase of Care Mortality Analyses. For each patient death, these analyses identified the specific phase of the care continuum in which the factors most likely related to the patient’s demise occurred, with the goal of mitigating such factors in the future. The program was ultimately funded by Blue Cross Blue Shield of Michigan, which recognised its value in improving patient outcomes and constraining costs.

Similarly, the Virginia Cardiac Services Quality Initiative (VCSQI), formed in 1996, ultimately grew to include 18 hospitals, 14 cardiac surgical programs, and numerous interventional cardiology practices, effectively encompassing virtually all cardiac surgery in the Commonwealth and half the interventional cardiology procedures. Like the MSTCVS, the VCSQI used data from the STS Database to identify areas of opportunity for targeted improvements, with particular emphasis on reducing complications and their associated incremental costs.

</div></details>

<details class="med-details"><summary>
  
#### The Society of Thoracic Surgeons</summary><div class="details-content">

In 1986, the STS formed the Ad Hoc Committee on Risk Factors for Coronary Artery Bypass Surgery, which published a statement emphasising the need to adequately risk adjust CABG mortality analyses and the desirability of also assessing other adverse outcomes, including «postoperative complications and other indices of hospital morbidity.»

Clinically relevant risk variables were recognised as essential for robust risk adjustment. Initial STS risk modeling used Bayesian approaches, although the methodology then shifted toward frequently updated logistic and hierarchical models.

Confidential performance feedback reports are provided several times annually to STS Database participants, and data suggest that the STS Database and its performance reports are critical drivers of improvements in cardiac surgery quality outcomes. Figs. 8.1 and 8.2 illustrate the improvements in CABG outcomes and compliance with National Quality Forum (NQF)‑endorsed processes of care among STS Database participants between 1998 and 2016. Many believe these improvements are a direct result of provider participation in the STS National Database, feedback of results to guide improvement activities, and public reporting.

![](_page_4_Figure_8.jpeg)

**FIGURE 8.1** Longitudinal marked reductions in Society of Thoracic Surgeons coronary artery bypass grafting (CABG) adverse outcomes between 1998 and 2016.

![](_page_5_Figure_3.jpeg)

**FIGURE 8.2** Longitudinal marked improvements in Society of Thoracic Surgeons coronary artery bypass grafting (CABG) process measure compliance between 1998 and 2016. *IMA,* internal mammary (thoracic) artery.

Participation in the STS Database has grown steadily and, as of late 2022, included 1010 adult cardiac surgery programs, 118 congenital cardiac, 273 general thoracic programs, 180 Interagency Registry for Mechanically Assisted Circulatory Support (Intermacs) programs, and 40 Pediatric Interagency Registry for Mechanical Circulatory Support (Pedimacs) programs. A 2021 analysis of the STS Adult Cardiac Surgery Database by Jacobs and colleagues, using linked Medicare data, revealed 97% patient‑level penetration and 95% center‑level penetration.

Beginning in 2010, STS provided Database participants with the opportunity to publish their composite outcomes and star ratings on the STS website, to our knowledge the first major specialty to publicly report detailed, comprehensive, risk‑adjusted outcomes rather than just process measure compliance. Studies by Shahian and colleagues have demonstrated that publicly reporting STS participant programs have higher STS composite performance scores and lower risk‑adjusted mortality compared with nonreporting programs. A similar study of mortality in Massachusetts, which required all cardiac surgery programs to participate in the STS Database and to publicly report outcomes, showed superior results compared with the rest of the nation.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Methodologic Considerations in Healthcare Quality Measurement</summary><div class="details-content">

Direct comparisons of US News & World Report Cardiology and Heart Surgery ratings with STS ratings show marked differences in provider ratings. Such disparities among different rating systems reflect lack of a standardised methodologic approach to provider profiling and failure of some rating systems to apply generally accepted statistical practices. Regardless of the reasons, inconsistent provider ratings create doubts and confusion among consumers. Some experts have called for greater standardisation of healthcare quality measurement methodology. At a minimum, healthcare quality rating programs should publish their methodologies in the peer‑reviewed literature and ideally submit their measures for rigorous external vetting and endorsement by organisations like the NQF or its Consensus‑Based Entity successor, Battelle’s Partnership for Quality Measurement (PQM). For example, as of 2022, STS had 34 NQF‑endorsed measures, by far the most of any healthcare professional society.

<details class="med-details"><summary>
  
#### Data Sources for Performance Measurement in Cardiac Surgery</summary><div class="details-content">

The earliest ratings of cardiac surgery providers were conducted by the federal government starting in 1986 using Medicare claims data. These data remain available today for virtually all patients 65 years of age and older and include most types of admissions in the Medicare population. Because they are relatively inexpensive and easy for measure developers and researchers to acquire, they are a commonly used data source for quality measurement and healthcare research. However, Medicare and many other administrative claims data sources were designed primarily for billing and not for clinical quality assessment, and they often lack clinical granularity and specificity for robust risk adjustment.

The National (Nationwide) Inpatient Sample, part of the Agency for Healthcare Research and Quality (AHRQ) Healthcare Cost & Utilization Project (HCUP), is a roughly 20% sample of all discharges from US community hospitals among participating states, covering more than 97% of the US population and including all payers and demographics. Other administrative data sources, such as the National Death Index (NDI), are useful for long‑term vital status.

Electronic health record (EHR) data are ubiquitous and encompass all payers and patient demographics. However, much of the data in EHRs are unstructured and are entered without regard to standardised definitions or specifications. Nonetheless, EHR data are currently underutilised for research, but artificial intelligence (AI) and machine learning approaches may expand the utility of this valuable data source.

In contrast, clinical registry data, typically developed and maintained by professional societies such as the STS, the American College of Cardiology, and the American College of Surgeons, are usually entered by trained data abstractors using highly structured and standardised data specifications. These data are clinically granular and relevant, thereby facilitating robust risk adjustment.

Because each of these data sources has inherent limitations, the optimal solution may be to link these individual sources using direct identifiers (e.g., a universal patient identifier) or probabilistic matching, thereby exploiting the advantages of each and mitigating their respective limitations. For example, multiple clinical registry data sources may be combined to encompass a broader spectrum of diseases and conditions. These might also be linked with Medicare Provider Analysis and Review (MedPAR) claims data to assess long‑term readmissions and reinterventions or with the NDI for short‑ and long‑term vital status.

</div></details>

<details class="med-details"><summary>
  
#### Target Conditions and Procedures</summary><div class="details-content">

Given that healthcare resources are limited, QA activities must focus on those areas with the greatest potential for improvement across broad populations. Selected conditions and procedures should be relatively frequent at most hospitals, both to optimise sample size and to ensure that the population impact will be greatest. In general, elective and urgent procedures should be prioritised for measurement and reporting rather than emergency cases, which are more idiosyncratic and difficult to risk adjust accurately.

Selected target conditions and procedures should have significant potential for adverse outcomes such as death or complications, as this makes their potential impact greater (i.e., investing resources to study mortality for elective cholecystectomy would not be cost‑effective). There should be reasonable variation in outcomes across institutions for these conditions and procedures—otherwise, the likelihood and impact of identifying worse or better‑than‑expected performance will be limited. This variation has been demonstrated for every STS composite measure. Fig. 8.3, adapted from Shahian and colleagues, illustrates this variation at the center level for aortic valve replacement (AVR) + CABG, and Fig. 8.4 shows similar variation at the individual surgeon level.

![](_page_6_Figure_10.jpeg)
![](_page_6_Figure_11.jpeg)

**FIGURE 8.3** Distribution of mortality and morbidity scores in the Society of Thoracic Surgeons participant‑level aortic valve replacement plus concomitant coronary artery bypass grafting (AVR + CABG) composite measure (Shahian and colleagues). Both scores demonstrate broad distributions, suggesting that they are appropriate targets for quality measurement and provider profiling. *IQR,* interquartile range (25th to 75th quartiles).

![](_page_7_Figure_3.jpeg)
![](_page_7_Figure_4.jpeg)

**FIGURE 8.4** Distribution of surgeon mortality and morbidity scores in the Society of Thoracic Surgeons individual surgeon multiprocedural composite measure (Shahian and colleagues). Both scores demonstrate broad distributions, suggesting that they are appropriate targets for quality measurement and provider profiling. *IQR,* interquartile range (25th to 75th quartiles).

</div></details>

<details class="med-details"><summary>
  
#### Level of Provider Attribution</summary><div class="details-content">

Healthcare outcomes are affected by the decisions and actions of physicians and surgeons but are also influenced by the resources, institutional experience, expertise, and culture of hospitals and systems. Ideally, performance measures would include all these levels of attribution, but there are important practical limitations. As discussed later in this section under «Statistical Reliability,» most physicians and surgeons have an inadequate number of cases of any specific condition or procedure to ensure adequate sample size, and measure reliabilities are often low. Hospitals remain the most widely used level of attribution, and they are also the most appropriate effector arm for many improvement activities. Notably, however, a highly reliable, multiprocedure composite performance measure for individual cardiac surgeons has also been developed and used by STS (see «Composite Performance Measures» later in this section and in online Appendix 8A).

In cardiac surgery and also for most other surgical procedures, the surgeon, the hospital, and their joint functioning are important to optimise outcomes, and results are generally superior when surgeons work with a familiar team at their primary hospital. Some states’ cardiac surgery report cards (e.g., New York) acknowledge this by reporting outcomes separately for surgeons, centers, and surgeon‑center combinations, although the sample sizes in the latter may be small.

</div></details>

<details class="med-details"><summary>
  
#### Observation Periods</summary><div class="details-content">

**Patient.** For *patient* observation periods, early studies used in‑hospital mortality, which is captured with high accuracy but results in varying postprocedure or postdischarge time intervals, complicating the statistical analyses and contributing to measurement bias. Duration of the index hospitalisation can vary substantially depending on the local and regional availability of home care, rehabilitation, extended care, and skilled nursing facilities, and this variation may be completely independent of the quality of care delivered by the index hospital or physician. In areas where these postacute resources are less readily available, patients tend to remain hospitalised for longer initial periods postprocedure, and thus any complications are more likely to be recorded during the index hospitalisation. Pouw and colleagues found that index hospitalisation length of stay and in‑hospital mortality were positively correlated, whereas in‑hospital and postdischarge mortality were inversely associated, which they refer to as «discharge bias.» In areas where postacute resources are available, patients are discharged earlier in their recovery, and subsequent death or complications after index hospitalisation discharge will not be recorded in in‑hospital statistics, a form of *ascertainment* or *surveillance* bias. This approach may also lead to intentional *gaming* or unintentional biasing of the reporting system, in which seriously ill, preterminal patients are discharged and transferred to hospice or other postacute facilities prior to their death. Their subsequent early postdischarge death is not recorded as in‑hospital mortality at the index institution.

Given these deficiencies, 30‑day postevent (e.g., acute myocardial infarction), 30‑day postprocedure (e.g., CABG), or 30‑day postdischarge (readmission measures) outcomes are now generally regarded as the gold standard, as they capture all events within this standardised time interval regardless of whether they occur in‑hospital, at home, or in extended care. However, like in‑hospital metrics, they are also potentially susceptible to gaming, such as keeping a terminally ill patient alive until day 31 before removing life support, thus avoiding a 30‑day mortality. Although a theoretical concern supported by many anecdotes, analyses of discharge patterns in states with 30‑day versus 30‑day plus in‑hospital outcomes reporting do not support significant occurrence of this gaming phenomenon. Despite their advantages, 30‑day standardised outcomes are more difficult to obtain. For example, even the simplest outcome, 30‑day mortality, requires either evidence of a clinic visit or lab test on or after 30 days or direct communication with the patient, their family, or their local physicians. Ascertaining other adverse outcomes, such as sternal wound infection, requires even greater scrutiny.

To mitigate the limitations of in‑hospital and 30‑day mortality, STS comprehensively includes all mortalities using an endpoint referred to as *operative mortality*, which includes all index admission deaths regardless of when they take place, and all 30‑day deaths regardless of where they occur. Some argue that 30 days is too short in current cardiac surgical practice for assessing the acute outcomes of the index condition or procedure. Ideally, with linkages to other data sources such as the NDI or Medicare claims, longer‑term survival, reinterventions, and readmissions will be possible to ascertain consistently and accurately.

**Provider.** The time window over which a provider’s performance is estimated is generally 1 year at a minimum, and more often 3 years to increase sample size, reliability, and power. The original STS CABG Composite measure, which was based on 1 year of data and 98% credible intervals, was updated in 2021 to include 3 years of data and 95% credible intervals (see online Appendix 8A). These changes resulted in substantial increases in the percentages of both better and worse‑than‑expected outliers. Three‑year samples are typically updated each year with an additional year of data.

</div></details>

<details class="med-details"><summary>
  
#### Types of Performance Measures</summary><div class="details-content">

As originally defined by Professor Avedis Donabedian in his classic 1966 publication *Evaluating the Quality of Medical Care*, healthcare performance measures generally fall into three major categories—outcomes, process measures, and structure measures.

Donabedian referred to *outcomes* as the «ultimate validators» of quality, and they are the most common performance metrics in cardiac surgery. Outcomes measures are methodologically the most demanding of all measure types, requiring adequate sample sizes and end‑point frequencies, and robust risk adjustment. Outcomes may not be appropriate quality measures for procedures done infrequently at most hospitals, such as esophagectomy or septal myectomy for hypertrophic cardiomyopathy, and they are not appropriate for procedures with very rare adverse outcomes.

<details class="med-details"><summary>
  
##### Mortality and Morbidity</summary><div class="details-content">

In‑hospital or 30‑day mortality, or combinations thereof (e.g., STS «operative» mortality), remain the most common surgical outcome metrics, but for many procedures, mortality is quite low. As recommended three decades ago by Kouchoukos and colleagues in their STS response to the HCFA mortality reports, outcome evaluations should also include serious postoperative complications, some of which (e.g., disabling stroke or permanent, dialysis‑dependent renal failure) are equally or more feared and consequential for patients.

</div></details>

<details class="med-details"><summary>
  
##### Readmission</summary><div class="details-content">

Postoperative hospital readmissions may reflect quality of care during the index admissions. Among surgical patients, including cardiac surgical patients, readmissions also often reflect the initial but delayed, postdischarge appearance of complications, especially as short index hospitalisation lengths of stay have been incentivised.

In a study of New York patients who had undergone CABG, Hannan and colleagues found that 84.5% of readmissions were related to CABG complications, of which infections were the most common. The Cardiothoracic Surgical Trials Network (CTSN), sponsored by the National Heart, Lung, and Blood Institute and the Canadian Institutes of Health Research, followed 5158 patients from 10 hospitals prospectively for 60 days after cardiac surgery, and 237 (4.6%) experienced 301 major infections, with 45% occurring after hospital discharge. Mortality was 5% among those infected versus 0.7% among noninfected patients. Major infections accounted for 16% of all readmissions during that 60‑day period. These data all suggest that in addition to index hospitalisation mortality and complications, postdischarge 30‑day readmissions provide a valuable additional window into surgical quality and are not just a reflection of inadequate postdischarge coordination.

Readmission as a metric assumed even greater importance with the advent in 2012 of the CMS Hospital Readmissions Reduction Program (HRRP), which penalises hospitals financially if their readmissions exceed expected values based on predicted models. Although reduction of readmission is desirable, some have expressed concern that an excessive focus on readmission penalties may lead some hospitals to delay or defer readmissions for patients who would benefit from rehospitalisation, and that this might lead to higher overall mortality. Thus, these measures should always be considered in conjunction with *balancing measures*, such as 30‑day mortality. Further, readmission measures may disproportionately affect providers caring for vulnerable populations who have less access to community resources that might prevent unnecessary readmissions. To mitigate this concern, HRRP performance and penalties are now based on *peer group stratification* (proportion of dual eligible patients).

</div></details>

<details class="med-details"><summary>
  
##### Process Measures</summary><div class="details-content">

*Process measures* typically quantify the proportion of a provider’s patients in which specific, evidence‑based, guideline‑recommended care processes were used. In cardiac surgery, the STS CABG composite measure includes two evidence‑based process measures—use of at least one internal thoracic artery (ITA) bypass conduit and the use of all four NQF‑endorsed perioperative medications. Unlike outcome measures, for which an improvement pathway may not be immediately apparent, process measure deficiencies are readily actionable and suggest their own remediation (e.g., use more ITA grafts).

Notwithstanding these advantages, process measures also have their issues, one of the most common being an inadequate evidence base. Further, although these measures are usually not risk‑adjusted, they often have substantial *exceptions* or *exclusions* that make a substantial proportion of patients ineligible. Thus, unlike outcome measures that have a result for every patient, the subpopulation of patients for whom a particular process measure is applicable may not be representative of the provider’s overall cohort of patients. Other process measure issues include weak process–outcomes associations; «check the box» mentality; ceiling effects or topped‑out measures; and poor postdischarge patient compliance. Many object to process measures as being «cookbook medicine» that marginalises individual physician judgment. Others note that process measures focus attention solely on measured processes of care to the detriment of equally important but unmeasured processes of care. Finally, in some instances, there may be direct or indirect harm. For example, by incentivising providers to apply process measures to all patients without obvious contraindications, some patients will receive care that may be inappropriate or inconsistent with their wishes.

Given all these considerations, Masoudi and colleagues recommend using clinical guidelines and associated process performance measures with the strongest and most generalisable evidence base; affirmation of trial results in broader populations when data are available; personalised physician judgment when applying guidelines to specific patients; and appropriate use and documentation of exclusions to avoid any incentive for overuse.

</div></details>

<details class="med-details"><summary>
  
##### Structure Measures: Procedural Volume</summary><div class="details-content">

Structure measures reflect provider characteristics that are thought to be associated with higher quality care, such as 24/7 intensivist coverage in the ICU, EHRs, clinical registry participation, and appropriate nurse staffing ratios. In surgery, since the pioneering work of Luft and colleagues in 1979, the most widely used structural measure of quality has been provider volume. It has been demonstrated repeatedly that for complex operations, there is an association between volume and outcomes, although the strength of that association varies widely. Volume–outcomes associations also vary depending on methodologic considerations. Studies using more appropriate multilevel, hierarchical approaches tend to show weaker associations.

In adult cardiac surgery, modern volume–outcomes studies have generally shown that these associations do exist and are strongest for more complex, less frequently performed, and newly introduced procedures. Such outcomes associations have led many to call for regionalisation of care to higher volume centers, especially for more complex procedures. However, some smaller programs have consistently excellent results over many years, so a combination of volume thresholds and direct outcomes measurement may be fairest.

The Leapfrog Group has now included minimum annual hospital/surgeon volume standards for 11 procedures, many of them in cardiothoracic surgery, including esophageal resection for cancer (20/7); lung resection for cancer (40/15); mitral repair/replacement (40/20); open aortic procedures (10/7); and Norwood procedures (8/5). Implementation of such volume thresholds is not straightforward and there are many nuances. For example, should the same standards apply to highly experienced surgeons who have already performed hundreds or thousands of a particular procedure and are now trying to direct routine cases to younger surgeons? Further, despite the overall volume–outcomes association, there are some low‑volume programs that consistently achieve excellent outcomes, and conversely, high volume is not always a guarantee of superior results. Finally, some data suggest that regionalisation may not be preferred by all patients. Even when a regional referral center may have better outcomes, patients often prefer local care.

</div></details>

<details class="med-details"><summary>
  
##### Appropriateness</summary><div class="details-content">

*Underuse, misuse,* and *overuse* are three commonly used categories of poor healthcare quality. *Underuse* is failure to use appropriate, evidence‑based testing or treatment, such as routine screening colonoscopy or mammography. This may be especially problematic among minorities and other vulnerable or underinsured populations. *Misuse* refers mainly to medical errors, avoidable complications, safety events, and other adverse outcomes, brought to public attention most notably in the landmark Harvard Medical Practice Study, the subsequent Institute of Medicine monograph *To Err Is Human* (which signalled the beginning of the patient safety movement in US health care), and the 2023 study by Bates and colleagues investigating the current safety of inpatient care. *Overuse*, a third category of poor‑quality health care, refers to care that is inconsistent with evidence‑based guidelines, not indicated, or low‑value, such as magnetic resonance imaging for uncomplicated low back pain or antibiotics for viral infections.

Regarding overuse, the most systematic approaches to identifying and mitigating this practice are Appropriateness Use Criteria (AUC), which have also been adapted as quality indicators. Cardiac surgery and interventional cardiology have been leaders in the development and application of AUC, contributing three versions for coronary revascularisation between 2009 and 2017. These were developed based on expert consensus grading of numerous real‑life clinical scenarios, with each scenario scored appropriate (score 7‑9), uncertain (may be appropriate, score 4‑6), and inappropriate (or rarely appropriate, score 1‑3). The value of AUCs as performance metrics has been widely discussed and debated, with limitations including poor documentation and coding; limited number of experts developing AUC decisions; gaming of angina severity; disregard for patient preferences; stress tests not performed or uninterpretable; uncertain vs. inappropriate classification; and physician resentment. A similar AUC for treatment of severe aortic stenosis was published in 2017.

When the multiorganisational AUC criteria for coronary revascularisation have been applied to state and national populations who have undergone these procedures, some results have raised concerns. Studies of acute percutaneous coronary intervention (PCI) for myocardial infarction have shown these procedures to almost always be appropriate, with similar findings for virtually all CABG procedures. Conversely, in several studies, roughly half of PCIs for nonacute patient presentations were found to be uncertain or inappropriate. The value of calculating and publicising such appropriateness data is demonstrated by the substantial longitudinal improvements in nonacute PCI appropriateness found by Hannan and colleagues in New York and Desai and colleagues in a study of 766 centers in the National Cardiovascular Data Registry. Similarly, a study of the appropriateness of surgical AVR for severe aortic stenosis showed occurrence of «rarely» or «may be appropriate» of 3.83% before release of national AUC, declining to 2.06% after their publication.

</div></details>

<details class="med-details"><summary>
  
##### Patient‑Reported Outcomes</summary><div class="details-content">

Most quality measures are defined, scored, and reported by physicians, but some outcomes are best provided directly by patients without physician filtering or interpretation. These include various combinations of general or condition‑specific physical symptoms, pain, mental and emotional state, functional status, disability, health‑related quality of life, and health behaviours, collectively referred to as *patient‑reported outcomes.* Patient‑reported adverse outcomes not only reflect the unfiltered perspective of patients but often occur with greater frequency than commonly reported clinical outcomes such as death or major complications, and may thus better differentiate performance. They also reflect what is most important to the patient, which may sometimes be quite different from the provider’s priorities.

Patient‑reported outcome measures may be used longitudinally to compare a patient’s preoperative and postoperative status in the same functional domains, with patients serving as their own control; to compare the course of an individual patient with that of «average» patients to identify potential areas of opportunity for recovery and rehabilitation; and to serve as clinical trial endpoints. In some instances, they may also be useful to compare the functional or symptomatic recovery of groups of patients cared for by different physicians or surgeons (for example, the rate of return of joint function after total knee or hip replacement by different surgeons), although this role as *patient‑reported outcomes‑based performance measures* (PRO‑PMs) remains controversial. Issues include the rationale for using a PRO‑PM in specific contexts; identifying and applying measures that are most meaningful to patients, actionable, and that have acceptable psychometric properties; ensuring measure sensitivity to differences in mode, method, time, place, and frequency of administration; whether and when to risk adjust (e.g., in cross‑sectional analyses, when providers care for markedly different populations); and establishing a framework for implementation, scoring and stakeholder interpretation, broad dissemination, and ongoing refinement.

Patient‑reported outcomes may be generic, focusing on a broad spectrum of domains, such as the SF‑36 or SF‑12, or the NIH‑funded *Patient‑Reported Outcomes Measurement Information System* (PROMIS), which uses item response theory and computer adaptive testing to measure physical, mental, and social well‑being and health‑related quality of life domains (e.g., pain, fatigue, depression, and physical function). In cardiovascular disease, the New York Heart Association (NYHA) class has long been used to characterise cardiac symptoms, with newer and more comprehensive measures including the Kansas City Cardiomyopathy Questionnaire for heart failure symptoms and the Seattle Angina Questionnaire to quantify angina severity.

In cardiothoracic surgery, many clinical trials and research studies now include patient‑reported outcomes. Finally, an STS Taskforce is examining approaches to routinely collect short‑ and long‑term patient‑reported outcomes, including issues such as collection mode (email, smart portable electronic devices, standard mail) and optimal timing, frequency, and duration of follow‑up.

</div></details>

<details class="med-details"><summary>
  
##### Patient Experience of Care</summary><div class="details-content">

The other major type of patient‑centered outcome is *patient experience of care*. This should be differentiated from *patient satisfaction*, which is more subjective and highly dependent on whether expectations were met. Experience of care instruments use structured, standardised, objective domains such as the hospital environment or discharge coordination. Hospital Consumer Assessment of Healthcare Providers and Systems (HCAHPS) scores, developed by the AHRQ and used extensively by CMS in many of its quality programs, are the most well‑known examples. In contrast to many online rating services, HCAHPS scores are methodologically rigorous and validated. HCAHPS surveys include information on doctor and nurse communication, medication communication, staff responsiveness, discharge information, care transitions, hospital cleanliness and quietness, overall hospital rating, and willingness to recommend. They adjust for patient characteristics and mode of administration. Importantly, patient experience of care scores have been associated with better adherence to treatment plans and improved outcomes for patients, as well as advantages for providers including practice loyalty and lower malpractice claims. In addition, the skills necessary to improve patient experience scores can be taught relatively easily and quickly to physicians and their staff.

</div></details>

<details class="med-details"><summary>
  
##### Failure to Rescue</summary><div class="details-content">

Failure to rescue quantifies mortality for patients who experience a serious complication following treatment (typically a surgical procedure). Formally stated, it is the conditional probability of death given the occurrence of a serious postoperative complication. Unlike mortality and complications, which are significantly associated with patient severity of illness, failure to rescue is more strongly associated with hospital characteristics and resources (e.g., teaching intensity, volume, nurse/patient ratios, technology services, 24/7 intensivists, closed staff intensive care units, rapid response teams, and the use of hospitalists) than with patient comorbidities. Hospitals may have more complications because they routinely care for higher acuity patients, but their resources, experience, and expertise allow them to salvage these patients and prevent serious complications from leading to death.

In cardiac surgery, Edwards and colleagues demonstrated an overall failure to rescue of 22.3% for renal failure, 16.4% for stroke, 12.4% for reoperation, 12.1% for prolonged ventilation, and 10.5% for the composite outcome. Mortality increased with certain combinations of complications and number of complications. Expanding on these findings, Kurlansky and colleagues found that for patients undergoing CABG, valve, or combined procedures, there was wide variation in failure to rescue across centers; rigorous risk models were developed, and among STS Database participants, 5.6% performed worse than expected and 4.7% better than expected.

</div></details>

<details class="med-details"><summary>
  
##### Composite Performance Measures</summary><div class="details-content">

Rarely does a single measure encompass all important aspects of a complex construct such as intelligence, stock market performance, or healthcare provider quality. In such situations, a commonly used approach is to create a composite measure that aggregates the results of multiple domains into a single score. Composite measures also increase the number of domains and endpoints, providing greater information with which to classify and differentiate provider performance. However, there is the potential for excellent scores in one domain of the composite to obscure poor performance in other domains (see online Appendix 8A).

In cardiac surgery, mortality was for decades the most common and often the only quality metric. However, with declining mortality, it became increasingly difficult to differentiate provider quality based on this relatively infrequent endpoint. In 2007, the STS developed its first composite quality metric for CABG, which included four domains (Fig. 8.5 and online Appendix 8A), of which two were outcomes (risk‑adjusted mortality and risk‑adjusted occurrence of any of five major complications: reoperation, renal failure, stroke, sternal wound infection, or prolonged ventilation) and two were process measures (use of at least one ITA bypass graft conduit and use of all four NQF‑endorsed perioperative medications: preoperative beta blockade, discharge antiplatelet agents, statins, and beta blockade). In the final composite score, the relative weights of these four domains, based on the reciprocals of their standard deviations in the development sample, were risk‑adjusted mortality 81%, risk‑adjusted morbidity 10%, ITA use 7%, and medication use 3%.

This composite provides greater dimensionality of quality measurement and acknowledges the importance to patients of nonfatal but serious complications, which may have life‑altering consequences. Because of the increased information in the four composite domains, the ability to differentiate high and low outliers from «as expected» performance is greatly enhanced. In the original development cohort, only 1% of STS participants could be identified as high or low outliers based on mortality alone, but 23% of outliers were identified with the composite. In 2022, STS updated this CABG composite to include 3 years of data and to use 95% rather than 98% credible intervals, which further increased the ability to differentiate outliers. STS has now created a family of composite performance measures, all of which consist of at least risk‑adjusted mortality and morbidity domains, and these encompass all the most common procedures performed in adult cardiac surgery.

![](_page_10_Figure_7.jpeg)

**FIGURE 8.5** The prototypical Society of Thoracic Surgeons (STS) coronary artery bypass grafting (CABG) composite measure contains two outcome domains (risk adjusted mortality and risk‑adjusted avoidance of *all* five major complications) and two process domains (use of at least one internal mammary [thoracic] artery graft, and use of *all* four National Quality Forum (NQF)‑endorsed perioperative medications). Outliers are classified using a Bayesian hierarchical framework with 95% credible intervals, corresponding to 97.5% true Bayesian probabilities. *ASA,* acetylsalicylic acid; *preop,* preoperative.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Statistical Concepts</summary><div class="details-content">

<details class="med-details"><summary>
  
#### Performance Reports</summary><div class="details-content">

**Samples of True, Underlying Performance.** The quality of a healthcare provider (surgeon, hospital, system) is typically estimated from periodically repeated samples, often consisting of relatively few cases (e.g., 50‑200). These samples are used to compare the provider’s results with those of the benchmark population (e.g., US national data from all STS participants). Sample collection periods typically range in duration from 1‑ to 3‑years, and in multiyear periods the results are updated annually by each new year’s data.

Thus, most provider performance measures are snapshots in time that serve as estimates of the true, underlying performance. How confident can a prospective patient or regulator be that these limited snapshots in time reflect a provider’s true underlying performance, how their performance compares with that of other providers (performance classification), and whether these short‑term results will be consistent, reliable, and reproducible over time?

**Sample Sizes.** Two specific sample sizes are relevant to the credibility of provider performance measurement—the number of patients sampled for each provider, and the number of providers. The larger the sample size of patients available for a specific provider, the more certain we can be of their true underlying performance, and the less likely their results are subject to random sampling variation. Conversely, small patient sample sizes and «low information» remain one of the most persistent, troubling limitations of most healthcare performance measurement initiatives, compromising their accuracy and reliability.

Several potential approaches are available to increase the sample size of patients for provider profiling: (1) *longer data collection* windows (e.g., 5 years instead of 1 or 3 years), although the relevance of the older data might be questioned; (2) more heterogeneous categories of procedures and conditions (e.g., combining multiple types of cardiac procedures), although this would be less useful for patients interested in their specific procedure and might also obscure poor results in one specific procedure type; and (3) focusing on higher levels of attribution (e.g., hospital or system measurement rather than individual physicians). Additional statistical approaches include shrinkage estimation (included within hierarchical models), which shifts results from low‑volume providers (which can often be more extreme) toward the mean for all providers, introducing bias to effectively anticipate regression to the mean, and producing estimates with less total mean squared error.

Regarding the number of providers, the larger the population of providers available to study, the more generalisable will the results be and the less likely that a few extreme providers (e.g., with very high mortality) could have a disproportionate effect on the benchmark populations used to develop risk models. The latter scenario could result in models that effectively obscure identification of a true low‑performing outlier. Normand and Shahian discuss replication approaches to mitigate this problem.

**Confidence Intervals or Bayesian Credible Intervals.** When presenting point estimates of a provider’s outcomes, it is recommended that they also include a measure of statistical uncertainty, such as frequentist confidence intervals or Bayesian credible intervals, both of which are inversely related to the sample size. From a frequentist perspective, if a provider’s outcomes were estimated repeatedly in different random samples of patients, the true outcome value would be contained by the 95% confidence interval in approximately 95 out of 100 samples (for any single test interval, the true value either does or does not lie within the interval). From a Bayesian perspective, the interpretation is simpler and more intuitive: a 95% credible interval implies a 95% probability that the true parameter lies within that interval.

For illustration, Fig. 8.6 shows the upper and lower limits produced by an exact binomial confidence interval when sample size varies from 50 to 900 and the observed adverse event occurrence (e.g., mortality) is 2%. At the sample sizes typically encountered for any specific procedures at most hospitals (e.g., <300 per year), event prevalence estimates have a wide range of random sampling error.

![](_page_11_Figure_12.jpeg)

**FIGURE 8.6** 95% confidence intervals of a binomial proportion with a 2% event rate. There is considerable random sampling variation at typical provider volumes for many cardiac surgical procedures. At sample sizes of 100, for example, the 95% confidence interval extends from nearly zero to about 7%.

**Statistical Reliability.** A fundamental question in quality assessment is whether a participant’s estimated performance in any given period of observation is an accurate reflection of the participant’s true performance (i.e., the underlying probabilities that generated the participant’s data). One approach to answering that question is provided by measure reliability, which may be thought of as consistency or reproducibility of scores. The reliability of a test result is often viewed from the narrow perspective of test‑retest (subsequent results using the same rater or test) or inter‑rater consistency (agreement among observers or tests). However, viewed more broadly, the reliability of a measure used for provider profiling reflects the extent to which the sample outcome reflects true signal about the provider’s performance versus noise, or random statistical fluctuation.

Any single performance estimate is subject to random sampling error and estimates from subsequent samples may yield different results. This random variation may impose constraints on the accuracy of any individual performance estimate. From a practical perspective, the design of a provider profiling initiative should seek to optimise reliability, and isolated extreme values should be viewed with caution, as regression to the mean in subsequent observations is likely. Most importantly, higher reliability measures are less likely to lead to provider misclassification.

As described by John Adams in his Rand monograph, reliability is «the proportion of the variability in measured performance that can be explained by real differences in performance.» In simple cases, this may be represented as between‑provider variance divided by total variance, where total variance equals between‑provider variance plus noise, or provider‑specific variance. Reliability ranges from 0, where all measure variability is due to measurement error, to 1, where all measure variability is due to actual performance differences.

Adams notes that reliability can be calculated as «the squared correlation between a measurement and the true value,» although estimation of the latter may be challenging. For example, in calculating the reliability of its performance measures, STS estimates the unobservable «true value» (e.g., the true short‑term mortality outcomes of a cardiac center) using Markov chain Monte Carlo approaches.

Larger sample sizes (caseloads), higher frequency of event occurrences (e.g., morbidity vs. mortality) and greater between‑provider differences in outcomes typically result in higher reliability. Accruing data across multiple years will also increase sample size and measurement reliability, at the risk of using some older data that may be less relevant. Higher levels of provider attribution (system or hospital vs. physician‑level) are inevitably associated with higher reliabilities. Composite measures include multiple endpoints and thus are typically associated with higher reliabilities than single outcomes.

Given these considerations, from a practical perspective surgical procedures of interest for outcomes measurement should have a relatively large number of total cases, reasonable end‑point frequency (e.g., mortality is not a good end point for bariatric surgery, as it is so low), and demonstrable variation across providers in the population of interest. Further, level of provider attribution should also be selected to maximise reliability, which is typically much better at the hospital level rather than for individual physicians or surgeons. However, in cardiac surgery, using 3‑year composite mortality and morbidity data for multiple common adult cardiac procedures, Shahian and colleagues developed a sophisticated, multiprocedure composite measure for individual physicians with an overall reliability of 0.81.

In cardiothoracic surgery, STS requires average measure reliability >0.5 as a prerequisite for issuing a quality rating for its composite performance measures. Included with its more recent measure publications are extensive tables showing average reliabilities for programs above and below various volume thresholds. Table 8.1 is a reliability table from Shahian and colleagues’ publication of the STS multiprocedural composite measure. These tables are used to define lower limits on programmatic volumes that would make them ineligible to receive the STS measure ratings.

<details class="med-details"><summary>

#### TABLE 8.1 Reliability Table: The Society of Thoracic Surgeons (STS) Participant‑level Multiprocedural Composite Measure</summary><div class="details-content">

| Threshold | No. of Participants Meeting Threshold | Estimated Signal Variance | Reliability: Participant Volumes Higher Than Threshold | Reliability: Participant Volumes Lower Than Threshold |
|-----------|--------------------------------------|--------------------------|-------------------------------------------------------|------------------------------------------------------|
| All Participants | 977 | 0.0283 | 0.81 (0.78–0.83) | 0.45 (0.16–0.71) |
| ≥50 eligible cases | 950 | 0.0276 | 0.83 (0.81–0.85) | 0.45 (0.23–0.65) |
| ≥75 eligible cases | 934 | 0.0272 | 0.84 (0.82–0.86) | 0.52 (0.35–0.67) |
| ≥100 eligible cases | 913 | 0.0266 | 0.84 (0.82–0.86) | 0.59 (0.47–0.70) |
| ≥150 eligible cases | 874 | 0.0261 | 0.85 (0.83–0.87) | 0.66 (0.57–0.73) |
| ≥200 eligible cases | 823 | 0.0243 | 0.86 (0.84–0.87) | 0.68 (0.61–0.75) |
| ≥250 eligible cases | 770 | 0.0231 | 0.86 (0.85–0.88) | 0.74 (0.70–0.78) |
| ≥500 eligible cases | 490 | 0.0194 | 0.90 (0.88–0.91) | 0.79 (0.75–0.81) |
| ≥1000 eligible cases | 196 | 0.0147 | 0.92 (0.90–0.94) | |

###### For a broad range of participant volume thresholds, the number of STS Adult Cardiac Database participants meeting the threshold and the reliabilities for participants above and below those thresholds are shown. In general, STS requires recipients of a star rating classification to have sample sizes that on average would yield reliabilities of at least 0.50. From Shahian and Colleagues’ publication (Reference 260).

</div></details>

Even in settings with high reliability, it is important to note that changes in a provider’s true, underlying performance can occur. For example, improvement could result from staffing changes or implementation of a new quality improvement intervention. Because there is often a several‑year gap between patient outcomes and the release of public report cards based on those outcomes, when interpreting such data it is essential to consider both the statistical reliability of the performance estimate and the possibility of changes in true performance. A host of potential sources of bias may further complicate assessment of performance as described by Kahneman in *Thinking Fast and Slow* and by Reason in *Human Error* (see «Human Error» in Chapter 7).

**Statistical Power.** Another ramification of sample size is statistical power. One of the main functions of healthcare provider profiling is to detect providers with outcomes that are statistically better or worse than expected, as discussed in the next section on *rating* and *outliers*. In the context of statistical hypothesis testing terminology, the goal is to avoid type II statistical errors (false negative, or failure to reject a null hypothesis that is actually false). In healthcare provider profiling, this means failure to recognise that a provider’s results are significantly different from what would have been expected for their case mix.

Using a typical alpha level of 0.05, many statistical analyses for research purposes strive for sample sizes that will achieve a power of 0.80, meaning that of 100 true outliers, 80 would be correctly classified as such. Statistical power is affected by the number of procedures and the expected number of occurrences (e.g., deaths) in the time period of interest (e.g., 1, 3, or 5 years). For many of even the most common surgical procedures, unrealistically large sample sizes would often be required to achieve this power, as demonstrated in a UK study by Walker and colleagues. With national mortality of 2.7% for cardiac surgery, 352 procedures would be required to achieve a power of 0.8 and 192 to achieve 0.60 power, whereas median annual procedures per surgeon are 128. For procedures like esophagectomy or gastrectomy with substantially higher mortality, far fewer cases are required to achieve statistical power in the 0.60 to 0.80 range. Similar findings were previously noted by Dimick and colleagues.

**Performance Classification.** As introduced in the previous section, one of the most common applications of healthcare quality measurement is the classification of performance categories. This is typically done using *rating* (e.g., «better or worse than expected» or «as expected») or *ranking* (i.e., #1, #2,…), the latter mentioned only to discourage its use. As noted in numerous statistical studies, the confidence intervals around rank estimates are invariably wide and overlapping, which makes most rank order estimates both unwarranted and misleading. Further, these effectively represent a series of program‑to‑program comparisons that would necessitate adjustments for multiple comparisons to mitigate type 1 statistical errors. Such adjustments are rarely, if ever, performed.

Performance *rating* systems typically use one of two approaches to classify outliers. In *criterion‑based* approaches, thresholds for acceptable and unacceptable performance are established based on previous literature, policy goals, or other considerations, but not specifically on the distribution of results in the current data sample. This approach is rarely used in contemporary health care, mainly because it would often be challenging to achieve broad consensus on where to set these thresholds.

*Norm‑based thresholds* use the actual distribution of outcomes in the population of providers being assessed to determine quality outliers. There are two major norm‑based approaches—*partitioning* and *statistical hypothesis testing*. In *partitioning*, the distribution of provider scores is divided into quantiles (e.g., deciles, quartiles, quintiles). Typically, the highest and lowest quantiles are assigned as outliers, which effectively predetermines a certain number of providers will be thus classified. However, depending on the shape of the score distribution in the provider population (e.g., narrow vs. wider), even those providers in extreme quantiles may have outcomes that are not statistically significantly different than expected. In the alternative and preferred approach, *statistical hypothesis testing*, appropriate tests are conducted to determine, with a specified degree of certainty, whether a provider’s results are statistically significantly better or worse than expected for their case mix.

In cardiac surgery, Shahian and colleagues used 2009 data from the STS Adult Cardiac Surgery Database to compare outliers determined from statistical hypothesis testing (*P* < .05) compared with partitioning into quintiles. Among 972 programs studied, 195 and 194 programs, respectively, were in the first and fifth quintiles of risk‑adjusted CABG mortality and could be considered outliers using a partitioning approach. Of these, only 8.7% of programs in the best‑performing quintile and 28.4% in the worst‑performing quintile were true statistical outliers, illustrating how partitioning approaches have the potential to misclassify outliers (generally exaggerating their numbers) whose results are not statistically significantly different from expected.

</div></details>

<details class="med-details"><summary>
  
#### Risk Adjustment</summary><div class="details-content">

No topic has been more central to modern provider profiling, yet remains so inconsistently applied and misunderstood, as risk adjustment. The lack of risk adjustment in the 1986 HCFA mortality reports for CABG was the proximate motivation for the development of the STS Database, and the lack of comprehensive, robust, specialty‑specific risk adjustment remains a common criticism of many performance rating systems in contemporary health care. Generally accepted statistical approaches to risk model development and testing are described in Chapter 7 as well as other standard texts and publications. Selected topics are described later.

<details class="med-details"><summary>
  
##### When and Why to Risk Adjust</summary><div class="details-content">

Risk adjustment is generally appropriate when there are patient factors that (1) are present before interaction with the provider, (2) are beyond the locus of control of the provider, (3) have an independent impact on outcomes, and (4) vary in frequency across providers. Even a high‑risk predictor such as cardiogenic shock may not need to be included in risk models if all providers’ prevalences of patients with this risk were identical.

From a practical perspective, risk adjustment is also essential to ensure face validity—provider acceptance and belief in the accuracy and fairness of quality measurement. In its absence, providers who receive a low score will simply argue that the severity, acuity, or complexity of their patients were not accounted for, and some providers may consequently decline to accept high‑risk patients.

</div></details>

<details class="med-details"><summary>
  
##### Conventional Logistic Versus Hierarchical Models</summary><div class="details-content">

Most risk models in health care, including cardiac surgery, are estimated using conventional logistic regression or a multilevel hierarchical version of logistic regression. The latter approach, introduced into provider profiling in the late 1990s, specifically acknowledges and is designed to mitigate a number of issues with standard logistic regression. These include the variable and often small sample sizes from individual providers, with resulting variation in the precision with which provider performance is estimated; clustering of observations within providers; failure to appropriately partition random and systematic variation; and failure to account for multiple comparisons when estimating the results of numerous providers. Nonhierarchical approaches that do not account for these issues can underestimate the random component of interprovider variation and, depending on context, have greater potential for false outlier classification. Hierarchical models typically produce somewhat more conservative estimates of the number of statistical outliers, although the practical differences from nonhierarchical logistic regression approaches have not been substantial in several large studies.

</div></details>

<details class="med-details"><summary>
  
##### Direct Versus Indirect Standardisation</summary><div class="details-content">

Existing risk models have several limitations, including absence of important risk factors that are simply unavailable for many patients, so‑called *unmeasured confounders*. However, an even more fundamental concern and source of confusion involves how these measures should be interpreted, specifically in the context of *direct* versus *indirect standardisation*. In *direct standardisation*, such as age‑ and sex‑adjusted comparisons of mortality across states, outcomes from a limited number of strata (age, sex, etc.) from each provider’s patient population are applied to a standard population. Because all providers have their outcomes applied to this same standard, these directly standardised outcomes can be directly compared with one another.

By contrast, largely because of the number of risk factors that must be accounted for (which makes stratification impractical), risk‑adjusted healthcare outcomes almost always use *indirect standardisation*, in which population‑derived risk factors (typically derived from regression modeling) are applied to each provider’s patient population. A provider’s indirectly standardised outcomes can only be compared with the expected outcomes for a similar cohort of patients based on data from the overall benchmark population of providers. They should not be compared with the results of any other specific provider unless the two providers are shown to have nearly identical, overlapping risk distributions, which is rare.

A second feature of indirect standardisation is that provider’s risk‑adjusted scores only represent their performance for the specific mix of patients for whom they actually cared, and this case mix may vary dramatically among providers. It is inappropriate, for example, to compare an *as‑expected* rating for a referral center caring for mostly high‑risk, complex patients with a *better‑than‑expected* rating for a small center caring for mostly low‑risk patients. Both institutions are doing a good job for their respective mixes of patients, but it would be unsubstantiated and inappropriate to say that the smaller program with lower‑risk patients and *better‑than‑expected* outcomes is superior to the referral center with an *as‑expected* rating.

</div></details>

<details class="med-details"><summary>
  
##### Permissible Risk Factors</summary><div class="details-content">

What risk factors are permissible to use in a risk model depends on how that model will be applied. Some healthcare risk models designed for internal operational use might incorporate a broad range of variables that include preoperative patient characteristics as well as events that occur during hospitalisation. For example, consider a predictive model developed to assist hospitals in identifying patients at high risk of readmission. These patients might benefit from enhanced postdischarge services to reduce their likelihood of requiring readmission. This operational model would legitimately include not only preoperative demographic and clinical features but also some events occurring postoperatively that might impact readmission risk, such as postoperative infections, stroke, or heart attack, which will impact a patient’s recovery and rehabilitation.

In contrast, when developing risk models to be used for profiling provider performance for specific procedures or conditions, only those risk factors present before a patient’s first interaction with the provider for that specific episode of care are permissible. Several categories of risk factors are typically considered for inclusion in risk models used to assess provider quality. Among these, the most common are *demographic* and *clinical risk factors* such as age and biologic sex, history of previous interventions, and comorbidities such as heart failure, low ejection fraction, renal insufficiency, or previous stroke. These are entered into multivariable risk models, and the independent association of each variable with the end point of interest is determined.

A second, increasingly studied category of risk factors includes *functional status* and *frailty*. *Functional status* is an individual’s ability to conduct their normal activities of daily living and to maintain an acceptable health‑related quality of life. Previously described in this chapter in the context of patient‑reported outcomes, identical or similar functional indicators collected prior to treatment (e.g., preoperative PROMIS score, NYHA class, Kansas City Cardiomyopathy Questionnaire, or Seattle Angina Questionnaire scores) may be associated with a variety of short‑ and long‑term healthcare outcomes, including death, complications, and prolonged length of stay. Some national recommendations have suggested including functional risk factors in healthcare risk modeling, as they may be important mediators of the effects of social risk factors.

Although closely related to and overlapping with functional status, *frailty* is a distinct phenotype characterised by reduced physiologic reserve and greater vulnerability to stressors such as illness, injury, or surgery. Single or multidimensional indicators of frailty (e.g., the Clinical Frailty Scale [CFS], Acute Frailty Network Criteria, Derby Frailty Index, Rockwood Deficit Index, Fried Frailty Phenotype, Edmonton Frailty Scale, Study of Osteoporotic Fractures, the Cardiovascular Health Study, Johns Hopkins Adjusted Clinical Group Frailty Indicator, Hospital Frailty Risk Score, and the Preoperative Frailty Index) have included various metrics such as gait speed and aerobic capacity, upper and lower extremity strength, unintentional weight loss, cognition, weakness or exhaustion, history of falls, incontinence, sarcopenia, inability to perform activities of daily living, and various lab tests, such as anemia, low albumin, and inflammatory markers. Because of its substantial impact on outcomes, preoperative identification and mitigation (e.g., prehabilitation) of frailty are subjects of increasing clinical interest.

Frail preoperative status is increasingly recommended for inclusion in risk prediction models. In cardiac surgery, various measures of frailty have been associated with increased postoperative mortality and morbidity, readmissions, worse short‑ and long‑term overall and functional survival, and quality of life. The STS Database includes a well‑validated frailty measure, the 5‑meter walk test, but it has been inconsistently used by cardiac centers. New approaches to frailty assessment for STS risk modeling are currently under investigation.

The importance of a third category of risk predictors—*social risk factors*—has also been increasingly acknowledged. In a framework developed by the National Academy of Sciences, Engineering, and Medicine, these include socioeconomic position; race, ethnicity, and cultural context; sex and gender; social relationships; and residential and community context. Social risk factors are independently associated with healthcare outcomes, regardless of quality of care (see «Social Determinants of Health» in Chapter 7). Multiple mechanisms may be involved, including employment; income; housing; food security; preferred language, education, and literacy; availability of public transportation; neighbourhood safety and recreational opportunities; community and social support systems and health resources; insurance; provider availability; residual clinical comorbidity unaccounted for by standard clinical risk factors; functional disability and frailty; postdischarge care and follow‑up; and nearby pharmacies and affordable prescriptions.

Often, these social risk indicators are collectively referred to as socioeconomic position, sociodemographic variables, or social determinants of health. These may be measured at the level of the *individual* (patient‑specific), *geographic area or neighbourhood*, or *hospital* (proportion of vulnerable patients cared for by a hospital). Individual patient‑level social risk variables are generally unavailable except for insurance type, such as Medicaid or dual‑eligible (Medicare and Medicaid) status. Area‑based indicators are more commonly used, both as proxies for individual patient‑level indicators and also because of the substantial impact that the local community has on patients’ health and healthcare outcomes (e.g., access to health care; grocery stores with healthy food options; pharmacies; social support mechanisms; public transportation; recreational spaces; community services; and good quality water and air). Historically, zip codes were the most common area‑based social risk indicators, but zip code areas were designed for efficient mail delivery and are not optimal approaches to defining populations that are relatively homogeneous with respect to social risk. Newer area‑based indicators include those developed by Diez‑Roux and colleagues; the AHRQ sociodemographics indicator; the Distressed Communities Index; and the Area Deprivation Index, a comprehensive, overall indicator of social determinants of health that incorporates 17 variables in multiple domains.

Patients with low socioeconomic/sociodemographic status often have reduced or delayed access to care, especially to specialists, and may be cared for by lower‑quality providers. They have worse healthcare outcomes across a broad spectrum of conditions and procedures, including multiple studies in cardiac surgery, some of which focused on the important social risk indicator of race. The issue of social risk factors, their impact on public reporting and payment, guidelines for their use to minimise unintended negative consequences, and alternative approaches to social risk adjustment (e.g., stratified reporting, direct payment incentives, and technical assistance for the care of vulnerable populations) have been discussed in multiple publications, including a comprehensive review by Shahian and colleagues and extensive reports by the NQF; the National Academy of Sciences, Engineering, and Medicine; and the Office of the Assistant Secretary for Planning and Evaluation in the US Department of Health and Human Services.

Although there is considerable variation among the recommendations in these reports, there is general consensus that if such variables are included in risk models, developers should describe (1) the hypothesised conceptual model by which these variables are linked to outcomes; (2) details regarding the specific variables used to capture these social constructs; (3) empirical data demonstrating the performance of models with and without these variables and across multiple different populations, including those with increased social risk; (4) the potential impact of social risk factor inclusion or exclusion on vulnerable populations; and (5) acknowledgment that for some social risk variables such as race and ethnicity, currently captured data may be oversimplified proxies for a heterogeneous range of factors including socioeconomic deprivation, environmental exposures, lower access to high‑quality providers, discrimination, and epigenetic and genetic factors. When more specific indicators become available, they should be substituted for these proxies. Whether or not social risk factors are used for adjustment, results *stratified* by social risk categories (including race and ethnicity) are always appropriate to identify and address disparities.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Public Reporting of Healthcare Performance Measures</summary><div class="details-content">

In addition to confidential, risk‑adjusted, outcome feedback reports to providers to guide improvement initiatives, most states and healthcare professional societies that produce risk‑adjusted outcome data also have mandatory (e.g., New York, Pennsylvania) or voluntary (STS) public reporting programs. These data must be presented in a way that maximises correct interpretation by consumers with varying degrees of numeracy, often facilitated by visual aids such as star ratings.

<details class="med-details"><summary>
  
##### Arguments Favoring Public Reporting</summary><div class="details-content">

The various arguments for and against public reporting of healthcare outcomes, including empirical data for cardiac surgery and cardiology, have been reviewed by Shahian and colleagues. Public reporting satisfies the ethical responsibility of providers to promote patient autonomy by better informing their choice of providers. Though an anticipated and desired consequence of public reporting, shifts in market share to higher‑performing providers have not generally been observed. The latter demonstrates that other compelling factors influence choice of providers by patients and their families, including the desire for local care rather than travel to regional centers, and the importance of recommendations by primary care physicians, family, and friends.

</div></details>

<details class="med-details"><summary>
  
##### Unintended Negative Consequences of Public Reporting</summary><div class="details-content">

Public reporting also has unintended negative consequences, of which the two most commonly noted are *gaming* (e.g., intentional upcoding of comorbidities, case shifting to unreported categories, prolonging the life of hopelessly ill patients after surgery) and *risk aversion* (see Section III of this chapter). The latter, as discussed in an extensive review by Shahian and colleagues, refers to the refusal of providers to accept high‑risk patients for treatment, fearing that their anticipated poor results will adversely affect the provider’s publicly reported outcomes and, consequently, their reputations, referrals, and finances. Although survey and anecdotal data support this concern in cardiac surgery, and despite the seminal description of this phenomenon by Omoigui and colleagues from the Cleveland Clinic (which has been challenged by others), multiple subsequent empirical studies have failed to substantiate major shifts in patient severity (e.g., predicted risk of mortality) after the initiation of public reporting. The empirical evidence for risk aversion is much stronger in PCIs, especially for patients in shock or with uncertain neurologic status after a myocardial infarction.

Shahian and colleagues suggest mitigation strategies for risk aversion, of which the most important is development and application of comprehensive, highly credible risk‑adjustment models that comprehensively account for inherent patient risk, then educating clinicians about the adequacy of this risk‑adjustment. Other mitigation strategies for risk‑aversion include separate reporting or exclusion of exceptionally high‑risk patients (which would require careful audit and adjudication to prevent gaming); reporting by condition or diagnosis rather than procedure; reporting at the hospital rather than individual physician or surgeon level; team‑based (e.g., Heart Team) collaborative decision‑making; and monitoring of access to treatment for high‑risk patients.

Finally, the term risk aversion may often be a misnomer and should be applied only to instances in which high‑risk patients are inappropriately denied surgery because of public reporting and reputational fears. In reality, numerous studies (some of which were designed to support the existence of risk aversion) demonstrate that in a public reporting environment, high‑risk patients may be avoided by less experienced surgeons, but they are accepted by more capable surgeons, an optimal matching of risk and expertise that works to the benefit of all patients.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### The Future of Quality Measurement in Cardiothoracic Surgery</summary><div class="details-content">

Profiling the quality of cardiothoracic surgery programs and surgeons will continue to grow in importance and will increasingly be linked to referrals, center of excellence designation, financial incentives for patients to seek higher‑quality hospitals and surgeons, and reimbursement rewards and penalties for providers. These increasing stakes mandate increasingly sophisticated, constantly evolving approaches to quality measurement. Several evolutionary trends are discussed later.

<details class="med-details"><summary>
  
##### Application of Artificial Intelligence and Machine Learning Approaches</summary><div class="details-content">

As described in a 2022 commentary by Orfanoudaki and colleagues, artificial intelligence and machine learning (AI/ML) approaches afford many potential advantages for healthcare provider profiling, and these approaches are now more practical to use because of modern computing power and speed, data storage capacity, and the increasing availability of electronic «big data» sources that are essential to train AI/ML algorithms.

The potential utility of AI/ML in cardiac surgery risk modeling was first demonstrated in studies by Lippmann, Kukolich, and Shahian between 1995 and 1997 using neural networks. In contrast to traditional statistical modeling approaches, AI/ML approaches may detect previously unsuspected nonlinear associations of predictor variables and outcomes and can uncover new and novel predictors and their interactions, as demonstrated by Normand and colleagues in their studies of diagnosis‑procedure dyads. AI/ML approaches are ideal for data‑rich information sources such as images (computed tomography scans, magnetic resonance images, echocardiograms) and digital monitoring. Finally, using AI/ML to automate or facilitate feature extraction may reduce the burden of manual data abstraction, allowing more data elements to be collected for each patient with the same or fewer resources.

The availability of increased amounts and types of data, and datasets encompassing large numbers of patients, will be crucial if the full potential of AI/ML risk prediction is to be realised. As noted by Shahian and Lippman, most studies of AI/ML approaches, at least in cardiac surgery mortality prediction, have not shown dramatic improvements compared with traditional statistical approaches, likely due to the limited number and granularity of features (low dimensionality) and small patient samples. By their nature, it is said that the forte of ML is classification, not prediction of probabilities, although this has been overcome by the recent work of O’Brien and Ishwaran (see «Imbalanced Data» in Chapter 7). Most are particularly susceptible to rare events, which characterises contemporary cardiac surgery. These and other issues have been rigorously addressed recently and solutions are outlined in online Appendix 8B.

</div></details>

<details class="med-details"><summary>
  
##### Nonfatal Outcomes</summary><div class="details-content">

As mortality for cardiothoracic surgery has fallen, it has become increasingly challenging to differentiate quality based solely on mortality, and this was one primary motivation for the development of the STS family of composite quality indicators, which all include a composite any‑or‑none morbidity domain (see online Appendix 8A). These nonfatal but potentially debilitating, life‑altering complications (e.g., stroke or dialysis‑dependent kidney failure) may be at least as frequent as deaths and are also of great importance to patients. Further, failure to rescue patients (i.e., to prevent death) after they incur serious postoperative complications is increasingly used as a quality metric. For all these reasons, preventing postoperative complications will be an increasingly important goal for both patients and providers.

</div></details>

<details class="med-details"><summary>
  
##### Reduced Lag Time</summary><div class="details-content">

Because of the time required to follow patients after a procedure (e.g., 30 days or longer), the collection of their relevant data by abstractors, and the additional delays for data curation and analysis, the time lag between performance of surgical procedures and the reporting of their outcomes to providers and the public may range from 6 months to several years. Given programmatic and surgeon changes in the interim, this may reduce the relevance of some data to current practice. Efforts must be made to collect, curate, and analyse data in a timelier fashion, which will benefit both patients and providers, although this must not be done at the expense of lower accuracy or completeness. As described earlier, automated or facilitated data extraction will help to reduce lag time.

</div></details>

<details class="med-details"><summary>
  
##### Fewer, More Credible, and More Consistent Measures</summary><div class="details-content">

Critical healthcare quality measurement issues that affect cardiothoracic surgery include the proliferation of quality measures and the lack of generally recognised methodological standards. The results from different healthcare rating systems are often inconsistent, creating confusion for consumers, who may then simply disregard all quality measures as unreliable and unhelpful. Berwick and others argue that there should be fewer healthcare quality measures, and Pronovost and colleagues argue for standardised methodologies. These would ensure robust, accurate provider quality assessments that are consistent, credible, and useful for all stakeholders.

</div></details>

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
## SECTION II: QUALITY ASSURANCE IN PEDIATRIC CARDIAC SURGERY</summary><div class="details-content">

<details class="med-details"><summary>
  
### Historical Note</summary><div class="details-content">

The first outcome used for quality assurance (QA) in pediatric cardiac surgery was early postoperative mortality, initially measured after certain specific types of operation, referred to as «Benchmark operations» during the latter part of the 20th century. Recognising the need to widen the monitoring of postoperative mortality in this complex and diverse field of practice, a series of approaches were developed to adjust for case‑mix complexity so that inclusive evaluation of postoperative mortality could be undertaken. The first method, called Risk Adjustment for Congenital Heart Surgery (RACHS‑1), was published in 2002 and was based on expert opinion. Later empirical methods of risk adjustment were developed and validated in the early 21st century using accruing registry data. These scores are now widely used.

In recent years, the focus of QA in pediatric cardiac surgery has evolved as early survival is excellent, with 97% to 98% of children discharged home. Hence, contemporary focus of QA stakeholders is related to additional, more complex outcome measures, such as specific postoperative adverse events or complications that might have consequences for survivors’ health‑related quality of life (HRQoL). Outcome measures of complications, longer‑term survival, neurodevelopmental outcomes, and HRQoL now complement, where feasible, postoperative mortality as QA metrics. These metrics are inter‑related as it is recognised that periprocedure measures, including hospital length of stay and technical performance score of the operation, have implications for longer term neurodevelopmental function, which is an important determinant of quality of life.

Engagement with QA by a wide range of stakeholder organisations, registries, and collectives has enabled improvements in the processes of data collection, analyses, and metric reporting. These important initiatives, by supporting transparency, are drivers of quality improvement and have had a widening scope in recent years. The Society for Thoracic Surgery Congenital Heart Surgery Database (STS‑CHSD) reports the outcomes of participating organisations and has led to a large and expanding series of outcomes research reports that inform practice. Clinician collaboratives, such as the Pediatric Cardiac Critical Care Consortium (PC4, North America), have leveraged improvements in outcomes by reporting and receiving feedback on complications. Regulatory or government‑mandated QA with clinician engagement, such as the National Congenital Heart Diseases Audit (NCHDA) in the United Kingdom, is linked to contemporary improvements in outcomes for pediatric cardiac surgery. A further evolution reflects acknowledgment of the psychological effect on parents of children with congenital heart disease and its treatment, together with the influence of parent functioning on child psychosocial outcomes.

</div></details>

<details class="med-details"><summary>
  
### Data Underpinning Quality Assurance</summary><div class="details-content">

<details class="med-details"><summary>
  
#### Cardiac Diagnostic and Procedural Data Points</summary><div class="details-content">

The accrual and analyses of data for QA in large multiinstitutional registries such as STS‑CHSD rely on consistent definitions of all terms and standardisation of all codes. Initiatives to address the challenges of coding for congenital heart disease and pediatric cardiac surgery have significantly and substantially developed since Maude Abbott published the *Atlas for Congenital Heart Disease* in 1936. The International Society for Nomenclature of Pediatric and Congenital Heart Disease (ISNPCHD) was initiated in 2005 with an aim of «unifying terminology for pediatric and congenital cardiac care.» The International Pediatric and Congenital Cardiac Code (IPCCC) is the product of the initial mission of ISNPCHD. Reflecting iterative improvements over time, the 11th revision of IPCCC was published in 2021 in ICD‑11 and states that the total number of pediatric and congenital cardiac terms is 367. In dedicated registries participating in QA for pediatric cardiac surgery, IPCCC terms are used to define key congenital heart conditions and procedure types that underpin the reporting of outcomes (see Chapter 27). In the case of complex heart diseases, the inclusion and exclusion criteria that determine which diagnostic or procedure group is applicable are complex, an example being the detailed coding instructions that may be used to define and identify the range of single ventricle heart conditions.

</div></details>

<details class="med-details"><summary>
  
#### Extracardiac Variables</summary><div class="details-content">

The diversity of case mix for pediatric cardiac surgery goes beyond the congenital heart disease and procedure type to include a range of additional important aspects both congenital and acquired. Use of preoperative factors such as age, weight, and noncardiac comorbidities for case‑mix description was initially limited by the availability of accurate registry‑based data, with earlier efforts to evaluate case complexity focused more narrowly. In 2014, based on recent data on 25,476 procedures, the STS‑CHSD explored the role of individual, specific preoperative risk factors in addition to the cardiac surgery type and found that preoperative mechanical circulatory support, renal dysfunction, shock, and mechanical ventilation were associated with higher risk. Important noncardiac variables have since been included in the empirical risk‑adjustment model supported by STS‑CHSD for use in research and QA, with subsequent updates and refinements in how noncardiac variables are handled. A study in 2017 from the United Kingdom’s NCHDA Registry found that four broad clinical groups of congenital comorbidity, acquired comorbidity, severity of illness indicators, and additional cardiac risk factors, defined based on selected IPCC codes, were each independently associated with increased risk of 30‑day mortality. The study noted that consistent definition and case ascertainment for such preprocedural risk factors is of key importance when using them within a risk‑adjustment model for research and for driving QA in the care of pediatric cardiac surgery patients.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Data Processing for Quality Assurance</summary><div class="details-content">

<details class="med-details"><summary>
  
#### Multiinstitutional Registries for Pediatric Cardiac Surgery</summary><div class="details-content">

Enabled by improvements in cardiac coding, there has been a worldwide focus and effort in the field of pediatric cardiac surgery to collect audit data for the purposes of QA and benchmarking. This era has seen the evolution of multiinstitutional databases such as NCHDA in the United Kingdom, the STS‑CHSD in North America, and the European Congenital Heart Surgery Association (ECHSA) Database, which accepts data submissions from various countries in Europe and even a few from North Africa. These multiinstitutional databases are located in different geographical regions and, as such, must conform to the laws and culture of the regions they serve.

The STS‑CHSD, founded in 1994 to support QA in pediatric cardiac surgery in the United States and Canada, was one of the first and currently the largest of the clinical databases. Participation in the STS‑CHSD is voluntary for individual centers. However, given the wide awareness of the importance of benchmarking for QA, this has expanded. The update for STS‑CHSD 2016 reported a gradual increase in participation over time, with accrual of 202,895 index operations at 118 pediatric and congenital heart surgery hospitals in the United States and Canada. A 2020 STS‑CHSD study reported participation by 102 US hospitals between 2014 and 2017, which is estimated to be 85% of US congenital heart programs.

The registry representing pediatric cardiac surgical centers in the United Kingdom and the Republic of Ireland, the NCHDA, is a mandatory registry for which all programs must submit procedural data for all cases. Submitted data are subject to external validation by external auditors, as this is permitted by the legal framework in the United Kingdom. Thirty‑day survival outcomes for a range of specific procedures, and also program‑level risk‑adjusted survival for all hospitals, are published online in 3‑year running cycles, with the centers identified by name. For the few occasions that a hospital has had lower than‑expected survival for a specific operation, the program is required to explore this issue and publish a statement about findings and actions on the NCHDA website.

</div></details>

<details class="med-details"><summary>
  
#### Multiinstitutional Collaboratives</summary><div class="details-content">

Collaborative learning for QA involves multidisciplinary teams working within a network or group of collaborating teams to collect and share data about patients and their outcomes. These teams engage in voluntary transparency, reflecting and learning about what contributes to best outcomes, as demonstrated by the outcome data. A shining example of this is PC4, which published its mission statement in 2015 to «advance pediatric cardiac intensive care medicine through critical evaluation of data, identification of evidence‑based practices and dissemination of this information.» Metrics and complications that have been subjected to special focus on process improvement in PC4 have included early extubation, reducing postoperative length of stay, and reducing occurrence of cardiac arrest by instituting a «safety bundle» of elements to promote increased situational awareness and communication among bedside clinicians to recognise and mitigate deterioration in high‑risk patients. PC4 reported the benefit to patients when hospitals participated by studying data for 19,600 admissions across 18 hospitals after cardiovascular surgery performed from August 2014 to June 2018. The study showed that participation was associated with improved survival.

Multiinstitutional collaboratives for QA characterise a range of stages in the patient journey after pediatric cardiac surgery, as demonstrated by the Cardiac Neurodevelopmental Outcome Collaborative, which is dedicated to optimising neurodevelopmental outcomes and quality of life across the lifespan.

</div></details>

<details class="med-details"><summary>
  
#### Data Linkage for Quality Assessment</summary><div class="details-content">

Combining databases using linkage methods can maximise a database’s strengths and minimise its limitations, enabling a wider range of outcomes to be assessed for quality improvement. Although linkage approaches entail legal and logistic challenges, this is an active new area for QA. For example, the linkage between STS‑CHSD and the administrative database Pediatric Health Information System (PHIS) led to important studies of healthcare utilisation for pediatric cardiac surgery in the United States. A linkage study in the United Kingdom successfully combined national databases in England and Wales with data related to pediatric cardiac procedures in public hospitals, critical care, administrative hospital episodes, and mortality. This linkage created episodes of inpatient and outpatient interactions with secondary and tertiary health care, covering up to 20 years of life. The study has so far facilitated a range of QA evaluations, including assessment of different models of care for transitioning young people with congenital heart disease to adult services, an evaluation of healthcare utilisation for children born with functionally single ventricle heart disease, and an evaluation of the treatment of secundum atrial septal defect closure in adults in the United Kingdom.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Outcomes</summary><div class="details-content">

<details class="med-details"><summary>
  
#### Postoperative Mortality</summary><div class="details-content">

The first and most formative outcome used for QA in pediatric cardiac surgery is postoperative mortality, which has been subject to a considerable amount of research focused on measuring, understanding, and reducing this end point for QA.

</div></details>

<details class="med-details"><summary>
  
#### Specific Cardiac Procedures or Benchmark Operations</summary><div class="details-content">

The concept of benchmark operations was used as an approach to deal with adjustment for case complexity in pediatric cardiac surgery in the absence of other available methods, and this is still valued as a complement to newer risk‑adjustment approaches. Institutional results for certain more prevalent and recognizable benchmark procedures were published for QA purposes in the 1990s (for example, arterial switch operation, and complete repair of tetralogy of Fallot). The great diversity and complexity of congenital heart disease may lead to variations of the same procedure being perceived as differing in complexity and, therefore, risk. It has been viewed as crucial to build consensus within the professional community with respect to classifying individual operations with the appropriate level of attention to definition of each one, so that comparisons of performance would be fair. Over the first few years of national audit data collection in the United Kingdom, the national audit steering committee, which consists of a mixture of experienced pediatric cardiac surgeons and pediatric cardiologists, worked on extending the reach of the audit in terms of presenting results from an increasingly large pool of recognizable operations. This process required developing a specific procedure algorithm to ensure consistency and transparency with respect to procedure definitions. Following public reporting of 30‑day outcome of specific pediatric cardiac operations by center from 2005 onward, the level of engagement from United Kingdom institutions caring for children with congenital heart disease increased, as professionals from the centers took a greater interest in the results as they appeared on the public site. This engagement led to further refinements and improvements in procedure definitions. The algorithm has been periodically improved and updated based on feedback and comments from professionals in the community.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Risk Adjustment for Pediatric Cardiac Surgery</summary><div class="details-content">

It is generally recognised that it is important and valuable to monitor outcomes in pediatric cardiac surgery and that to do so fairly and effectively, one needs to risk stratify the case load. Risk stratification of adult cardiac surgery patients became an essential part of the QA process in the 1980s (see Section I), aiming to reduce the prospect of unfair assessment of outcomes attributed to a surgeon or team whose mortality is high simply because it reflects patients who are inherently higher risk. Evidence from the United Kingdom suggested that since outcome monitoring in adult cardiac surgery became mandatory and routine, outcomes improved, and although it had been feared that there would be a consequent negative effect in terms of centers turning away high‑risk cases, this did not arise. Early risk‑adjustment efforts for pediatric surgery focused on the procedure(s) that patients had undergone, augmented by patient‑specific information such as age and weight. As efforts matured, it was noted that patient comorbidities may augment information about procedural risk, and this is also an important factor to consider in case complexity. Then, whereas in many surgical specialties there is a one‑to‑one mapping between diagnosis and surgical intervention, this is not the case in pediatric congenital heart surgery. Some procedures are performed for a number of diagnoses, which undermines the extent to which the procedures performed by a surgeon or within a unit accurately reflect case mix. Similarly, the same heart defect may be managed using different surgical interventions, with the choice of intervention reflecting other aspects of the patient’s condition (age, weight, comorbidities, severity of symptoms) and differences in surgical strategy among units based on local experience and, potentially, on a different balance being struck between long‑term objectives and short‑term risks. Therefore, the underlying cardiac diagnosis is also a potentially informative aspect of case mix to consider in risk adjustment.

<details class="med-details"><summary>
  
#### Subjective Risk Stratification Schemes</summary><div class="details-content">

With respect to risk stratifying patients according to the operation performed, RACHS‑1 included 79 different types of pediatric cardiac operations grouped into six categories ranked in order of increasing risk, as perceived by clinicians. This scheme appears to be useful as a basis for forecasting risk, has been validated in a range of contexts, and has been widely referenced. One limitation is that the entire range of operations described for congenital heart disease is not encompassed. Therefore, a substantial proportion of procedures do not have a risk category attributed to them. The scheme considers operative information only, with some minimal information on age ranges for a small number of procedures. A further limitation is that it was developed before large amounts of registry data were available and, therefore, was based on clinician expert opinion rather than empirical information.

Another consensus‑based scoring system developed by clinicians to describe perceived surgical risk was the Aristotle Score. It was based on three components: perceived risk of mortality, morbidity, and perception of technical difficulty. A panel of experts made estimates of these three factors for 145 procedures. There were two versions of the Aristotle Score, the more detailed of which required collecting 248 variables. This high level of data collection was perceived as a barrier to the score being implemented, noting it was less widely used than RACHS‑1.

</div></details>

<details class="med-details"><summary>
  
#### Empirical Risk Stratification Schemes</summary><div class="details-content">

Accrual of standardised data in large multiinstitutional databases over years led to a shift from using consensus‑based risk stratification tools to risk stratification based on empirical data. In 2009, an empirical risk‑adjustment tool (now referred to as the STAT score) was published using information from two large databases in North America (STS, 43,934 episodes of care) and Europe (EACTS, 33,360 episodes of care). Procedures were assigned a numeric score, calculated using a Bayesian model, and performance of this model was validated in a test set. One of its aims was to group procedures with similar estimated mortality risks into relatively homogeneous groups that could then be used to adjust for case mix when analysing outcomes and benchmarking. The risk model performed well and compared favourably with previous schemes used for risk stratification based on consensus, such as RACHS‑1 and Aristotle.

The STAT (Society of Thoracic Surgeons–European Association for Cardio‑Thoracic Surgery) score of STS‑CHSD has undergone extensive serial improvement over time, with addition of comorbidity information and other refinements. It was revised in 2021 and designed to incorporate a revised (updated) approach to multiple component operations. Scores for multiple component operations were assigned when the statistically estimated risk of mortality was different from that of the highest‑risk component procedure.

The Partial Risk Adjustment in Surgery (PRAiS) model of the NCHDA, developed and validated in the United Kingdom in 2012, incorporated information about procedure (29 categories), cardiac diagnosis (3 risk categories), number of functioning ventricles, age category (neonate, infant, child), age and weight as continuous variables, presence of a non‑Down syndrome comorbidity, and whether surgery was performed on cardiopulmonary bypass. As it began to be used to monitor outcomes and report these in public in the United Kingdom from 2012 onward, data quality for information previously collected but not actively used (e.g., comorbidity and diagnosis codes) rapidly improved. Moreover, as in the STS‑CHSD, contemporaneous improvements were noted in 30‑day mortality in the United Kingdom. These evolutions motivated an update to the PRAiS model in 2017, at which time a clinical steering panel added value to the empirical evidence to define the comorbidity and additional risk factors and the final broad cardiac procedure and diagnosis groupings used. Close involvement of the expert panel representing many hospitals and different specialties allowed careful consideration of how individual codes have been and will be used by centers in practice and built trust in the final model within the clinical community. PRAiS was updated a third time in 2024, again in partnership with clinicians.

</div></details>

<details class="med-details"><summary>
  
#### Criteria for Assessment of Risk Models</summary><div class="details-content">

The main considerations in judging or comparing the attributes of different risk stratification schemes and risk models that have been used in pediatric cardiac surgery are as follows:

1) *Coverage:* proportion of cases that can be incorporated into the scheme or model, generally expressed as the percentage of cases in which a risk score could be attributed.
2) *Discrimination:* extent to which the scheme or model is successful in distinguishing groups of patients with higher and lower postoperative mortality. The standard measure of discrimination adopted in this literature is the area under the receiver operating characteristic (ROC), area under the curve (AUC), or C statistic. The AUC gives the probability that a patient who died, chosen at random, would have had a higher risk score than a randomly selected survivor (see alternative under «Rare Occurrence of Postoperative Events» in online Appendix 8B and «Discrimination» and «Imbalanced Data» in Section IV of Chapter 7).
3) *Calibration:* extent to which magnitude of calculated probabilities tracks relative frequency of observed outcomes. For models that estimate a percentage risk of postoperative death, a common measure of model calibration performance is the Hosmer‑Lemeshow chi‑squared statistic (see «Calibration» in Section IV of Chapter 7), which indicates how statistically significant any deviations are between predicted and observed mortality in groups of operations, defined by deciles of predicted risk. More recent methods include calibration slope and intercept.

To develop and test PRAiS in the United Kingdom, mean adjusted deaths compared against predicted (MADCAP), a cumulative sum (CUSUM)‑type empirical graphical method for assessing model performance was used to assess accuracy of candidate models under evaluation. MADCAP enables the visual identification of patterns of systematic over‑ or underestimation of risk using a risk model.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Challenges in Postoperative Mortality and Morbidity Reporting</summary><div class="details-content">

<details class="med-details"><summary>
  
#### Endpoint Definition for Mortality</summary><div class="details-content">

Common mortality end points are death in hospital or death within 30 days of the operation. Consistent verification of outcomes outside the hospital environment is not available in many databases. One problem with limiting the end point to death in hospital is that patients may die shortly after discharge home, and a subset of deaths may be related to the operation. If the end point is limited to a 30‑day cutoff, although a consistent end point, patients have extremely variable hospital lengths of stay, with outlying patients staying longer than 30 days having a greater mortality risk than those with shorter lengths of stay. At the same time, use of hospital discharge (or eventual death) as the end point for such analyses may mean that children with a very long stay do not contribute for a prolonged period, also a drawback. Moreover, patients may be discharged from one institution to another, sometimes still on life support, some of whom may die at the second institution; these outcomes could be wrongly excluded from the analysis. Discharge practices might also vary between centers, which could bias a measure using only in‑hospital mortality.

</div></details>

<details class="med-details"><summary>
  
#### Postoperative Complications and Morbidities</summary><div class="details-content">

Morbidity associated with pediatric cardiac surgery refers to illness or lack of health that has a temporal connection to such an operation and, as such, may be regarded as a complicator or an adverse outcome. The STS Taskforce Subcommittee on Patient Safety in the United States has defined a range of adverse events that contribute to postoperative morbidity, including complications, adverse events, harm, medical error or injury, and near misses. This Taskforce further noted that in the current era of declining mortality after pediatric cardiac surgery, improvement in health care as measured by reduction in adverse outcomes is more likely when unwanted events are acknowledged, measured, and responded to in terms of healthcare delivery.

**Importance of Morbidity and Complications after Pediatric Cardiac Surgery.** Morbidity and complications are key metrics for QA because they are linked to longer stays in the hospital, and children who experience prolonged hospitalisation and complications are at greater risk of further adverse events and death. In addition, over the long‑term, children with specific heart conditions who experience prolonged postoperative hospital stays, which are often related to complications or morbidities, develop higher levels of neurologic disability. The subset who require mechanical circulatory support are at heightened risk of neurodevelopmental disability. Prolonged hospitalisation due to morbidities can also add considerably to in‑hospital costs. A United Kingdom study evaluated the effect of postoperative morbidities or complications and found that these were linked to poorer quality of life, fewer days at home by 6 months after surgery, and greater healthcare costs. Morbidity, disability, and quality of life are increasingly viewed as key outcomes by patients, families, and clinical teams who are looking to improve their quality of service.

**Morbidity Selection, Definition, and Measurement.** A series of detailed articles by health professionals from the US‑based Multi‑Societal Database Committee for Pediatric and Congenital Heart Disease profiled an extensive range of complications incorporating all organ systems, including kidney failure, deep‑seated infections, and failure of the original operation leading to reintervention. It is important to note that views may differ between professionals and nonprofessionals over what the term morbidity refers to and which morbidity events are most important. A United Kingdom study that incorporated both patient and professional viewpoints identified nine measures of morbidity: acute neurologic event, unplanned reoperation/reintervention, problems feeding, need for renal replacement therapy, major adverse event, extracorporeal life support, necrotising enterocolitis, hospital‑acquired infection, prolonged pleural effusion, and chylothorax. Although there was strong agreement among informants as to the importance of certain morbidities, for example, both professionals and parents ranked acute neurologic events and brain damage very highly, there were differences in viewpoint. Parents considered feeding problems as very important morbidities, but health professionals were less convinced, viewing these as less closely linked to an operation.

The STS database reported the defined list of major complications available within the Registry and demonstrated that occurrences varied from 1% to 38%, with greater prevalence associated with increased procedural complexity. A Canadian study that prospectively reported postoperative complications indicated that contemporaneous monitoring may lead to greater case ascertainment and, hence, a perception of more complications. A prospective multicenter study in the United Kingdom developed clinical definitions for nine important postoperative morbidities or complications and monitored these, finding that 21% of children were affected by at least one; 6.4% experienced multiple. This study also reported a greater likelihood of complications with very young children, more complex operations, and in children who were sicker before surgery.

</div></details>

<details class="med-details"><summary>
  
#### Quality Assurance Challenges for Morbidities and Complications</summary><div class="details-content">

**Consideration of Preprocedural Factors.** A major difficulty when contemplating monitoring morbidity or complications after pediatric cardiac surgery for QA is achieving a distinction between conditions present before the operation versus new morbidities arising after surgery. It must be acknowledged that preoperative events, such as existing congenital diagnoses and patient conditions, are inextricably linked to the postoperative journey. Preoperative events may also potentially be subject to quality control; for example, collapse of a neonate from late diagnosis of heart disease leads to more multiple organ failure and may be averted by antenatal diagnosis and prospective management of the circulation.

**Postprocedural Timing.** Conventionally, the time horizon linked to surgical complications has been 30 days following the operation, although STS‑CHSD defines it as within the same operative hospitalisation or 30 days, whichever is longer. Certain morbidities, particularly those defined by use of technology (renal support, extracorporeal life support), are likely to occur only during hospitalisation, whereas others may occur at any time over a child’s lifespan (reoperation, endocarditis, feeding problems). Hence, a time limit must be chosen to enhance the feasibility of postoperative monitoring for QA, despite this limit appearing arbitrary in some cases.

</div></details>

<details class="med-details"><summary>
  
#### Special Morbidities for Quality Assessment in Pediatric Cardiac Surgery</summary><div class="details-content">

**Technical Performance Scores and Unplanned Reoperations.** Unplanned reinterventions have been proposed as an important quality metric for pediatric cardiac surgery because these are clinically relevant outcomes that may importantly affect the patient trajectory and are associated with a greater risk of postoperative mortality. As such, unplanned reinterventions are monitored by pediatric cardiac surgical registries such as STS‑CHSD in the United States and NCHDA in the United Kingdom. Occurrences of unplanned reinterventions vary based on case complexity, being most common in neonates, with overall prevalence in the whole pediatric cardiac surgery population of 5.4% in STS‑CHSD, 3.5% in NCHDA, and 4.7% in a prospective multicenter study.

QA initiatives aimed at reducing mortality related to residual lesions and enhancing the timeliness of any required reintervention have focused on the study of technical performance scores. A standardised approach has been used to assess the technical success of an operation using such a score. Poorer technical performance scores are linked to higher mortality, need for extracorporeal membrane oxygenation, and adverse neurodevelopmental outcomes. In a study of technical performance, early correction of residual lesions was associated with similar outcomes as among patients who had no residual lesions.

**Neurologic Events and Child Development.** Systematic evaluation of infants undergoing common congenital heart repairs in the United States with validated instruments indicated that neurologic difficulties occurred in up to 25%, thus making it the most frequent morbidity. Types of neurodevelopmental abnormalities in survivors of cardiac surgery include motor deficits, seizures, poor executive functioning, communication problems, impairments in visual construction and perception, poor attention, and learning difficulties. Deficits can range in severity and may be subtle and, therefore, more easily overlooked, particularly in children with less complex diseases. Throughout childhood and adolescence, the presentation of neurodevelopmental abnormalities can change. Recent longitudinal evaluation of a cohort of preschool‑aged children at high risk of developmental delay revealed an improving developmental trajectory in some, but approximately 20% had scores in one or more developmental domains that decreased over time. Presentation of deficits can be obscured or confounded by a range of factors, including those related to cardiac surgery, the effects of hospitalisation, and other comorbidities.

In 2012, the American Heart Association published guidelines for systematic surveillance, screening, evaluation, and intervention to identify neurodevelopmental problems early and optimise outcomes in the short and longer term, building on earlier guidelines from the American Academy of Pediatrics. They also highlighted the importance of continued monitoring because the level of risk for neurodevelopmental impairment can change over time as different impairments become apparent during different periods of development. Furthermore, children at risk for poor late outcomes are frequently not identified from results of early testing. It is, therefore, not surprising that increasing numbers of follow‑up programs for children with congenital heart disease and neurodevelopmental concerns are now being implemented, particularly in the United States and some European countries.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Reporting Outcomes to Clinical Teams</summary><div class="details-content">

Retrospective audit across centers is important, as described in previous text, but providing timely feedback to teams on the ground is also desirable. In the United Kingdom, a recent major review of the specialty highlighted the need to monitor outcomes in a timely and meaningful fashion, and commissioners of services are appropriately seeking evidence on outcomes and QA from providers. Real‑time monitoring of risk‑adjusted surgical outcomes within each center supports a continuous improvement mindset, as runs of both better and worse‑than‑expected outcomes can be identified, discussed, addressed, and learned from while memories are fresh.

Absolutely critical in enabling local improvement is recognition that outcomes, good and bad, are not a product of the surgeon alone but of the whole team, from the cardiac diagnostics to the entire surgical team to the intensive care team attending to the child postsurgery. Focusing only on the intraoperative period or a single person, such as the surgeon, can lead to missed opportunities for learning and risks a blame culture that inhibits genuine learning and improvement.

<details class="med-details"><summary>
  
#### Charts for Real‑time Monitoring of Short‑term Outcomes</summary><div class="details-content">

The key feature of real‑time monitoring is trend rather than overall numbers. Trends are an early indicator that a process may be changing in your system, whether it’s getting better or getting worse. If a policy change has been instituted (e.g., a new treatment protocol or ward reorganisation), looking at outcomes over time allows any potential changes to be tracked in real time. The most common way to do this trend monitoring is by simply plotting relevant outcomes over time, called a *run chart*. There are many ways to display run charts, but a time series is the core element. For congenital heart disease outcomes, some form of risk adjustment should be incorporated to aid interpretation, given the heterogeneity of conditions and risk.

In the United States, PC4 facilitates this local monitoring through dashboards available to participating centers. The dashboards include run charts of outcomes for each center, adjusted for case mix, and allow centers to stratify by patient characteristics and drill down into individual patient records if required. The design of the dashboard is explicitly tailored to enable quality improvement, with the innovation that participating centers can see the results of other centers and identify where there can be mutual learning. Evidence supports that this approach contributes importantly to improving outcomes for participating centers.

In the United Kingdom, the National Health Service has mandated that all centers performing pediatric congenital heart surgery must examine their outcomes at least once a month using a type of run chart called a variable life‑adjusted display (VLAD), which charts the cumulative difference between expected and actual risk‑adjusted mortality over time. Spiegelhalter has provided seven important aspects that need to be considered when designing monitoring systems: (1) Unit being monitored; (2) Event being monitored; (3) Risk adjustment of outcomes; (4) Choice of summary statistic for monitoring; (5) Role of discounting past experience; (6) Selection of thresholds for action; and (7) Actions to take.

Spreadsheet software has been developed for clinical teams to enable regular monitoring of unit‑specific outcomes using VLAD charts. The expected risk of death is estimated for each 30‑day episode of care using PRAiS, and risk‑adjusted outcomes over time are displayed using the VLAD method. Additional cardiac operations and interventional catheterisation within each 30‑day episode of care are also displayed on the VLAD chart to provide additional context on achieved outcomes.

The software also provides additional information to support learning. Individual records for all patients who died are collated on a worksheet, along with calculated risk factors; estimates of risk for each patient are available, as are all risk factors (e.g., diagnostic groups or comorbidity group assignment) used in the PRAiS risk model. This allows for sense checking and subgroup analysis within local teams (e.g., all univentricular heart patients). Finally, the software provides information on how a particular unit’s risk factors compare to the national cohort and provides (user‑specified) prediction intervals for overall observed 30‑day mortality.

A crucial aspect of the software is that it was co‑designed with clinical teams. At each time the PRAiS risk model is updated, further user input is sought on the software to incorporate additional improvements. This principle led to addition of functions, including comprehensive error checking of the raw input data that helps local teams maintain data quality and the ordering and design of columns to enable rapid data transfer. Such codevelopment supports implementation and sustained use: the PRAiS software has been in consistent use within United Kingdom centers since 2013, with minimal technical support.

</div></details>

<details class="med-details"><summary>
  
##### Morbidities</summary><div class="details-content">

In the United States, PC4 also provides data on a range of complications, such as cardiac arrest, mechanical circulatory support, unplanned cardiac reintervention, neurologic complications, chylothorax, and failed extubation. Occurrence of these complications varies greatly across participating centers (e.g., a fivefold difference in chylothorax), and the PC4 dashboard facilitates intercenter learning through access to unblinded results and a consortium commitment supporting teams from one hospital learning from another.

In the United Kingdom, the National Institute for Cardiovascular Outcomes has started collecting data for some complications after pediatric cardiac surgery, and unadjusted center‑specific prevalences are reported annually; however, the time interval between occurrence and report of over a year is an important disadvantage. Prototype methods for more contemporaneous feedback of recent center outcomes on a range of complications, such as cardiac arrest, mechanical circulatory support, unplanned cardiac reintervention, neurologic complications, chylothorax, postoperative bleeding, and feeding problems, have been developed together with clinical teams. Results are presented in a series of slides automatically generated from a spreadsheet, providing frequency of each complication, frequency of multiple complications in a single patient, and, for any given complication, which other complications have been coincident. These outcomes are currently presented as unadjusted prevalences benchmarked against the national average, with plans to add risk adjustment. New models for complications after surgery for congenital heart disease in England and Wales have been constructed for 6 morbidities occurring within 30 days of adult congenital heart surgery and for seven morbidities within 30 days of pediatric congenital heart surgery.

</div></details>

<details class="med-details"><summary>
  
##### Long‑term Outcomes</summary><div class="details-content">

Traditionally, local improvement initiatives have focused on short‑term outcomes that can be measured and reported in close to real time (typically with no more than a 30‑day lag), to allow reflection and improvement in acute hospital management. However, a more holistic viewpoint is the long‑term outcome for a child born with a given diagnosis, particularly survival. This is what matters most to families, but also to commissioners, as the ultimate aim of a program. The Congenital Heart Audit: Measuring Progress In Outcomes Nationally (CHAMPION) project is exploring ways of including 5‑year survival and information on off‑pathway procedures as part of annual reports as a way of moving toward long‑term outcomes reporting. However, it must be acknowledged that long‑term outcomes are less useful for ongoing improvement initiatives because often the important events occur long before they are reported. That said, they do provide an important complementary perspective and are often the most useful outcomes for evaluating different treatment options, for example, timing and sequencing of surgery or subtle effects of case volume. The authors have proposed methods for the routine reporting of long term outcomes in the United Kingdom by diagnosis, which includes defining clear treatment pathways for the different diagnoses.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Reporting Outcomes to Funders, Governmental Organizations, and Regulators</summary><div class="details-content">

Routine audit of postoperative mortality in pediatric cardiac surgery is well established in the United Kingdom via the NCHDA, which has published center‑specific results of individual operations online since 2005 and program‑based 30‑day mortality with case‑mix adjustment since 2012. Stakeholders, including children’s heart surgery programs, congenital heart patient support groups, and NCHDA, share a goal of adding morbidity to these mortality outcome reports. Efforts are also underway in the United Kingdom to extend reporting to include program‑level outcomes for longer‑term survival by diagnosis and procedure outcomes in adults (the government‑funded CHAMPION project, running from 2018‑2024).

Registries and reporting based on voluntary participation tend not to have authority to act on possibly concerning outcomes. For example, STS reports risk‑adjusted outcomes at the hospital level, and hospitals are identifiable to the public. In 2017, 60% of hospitals participating in the STS‑CHSD had agreed to publicly report their outcomes. However, in Sweden, annual reports contain a large amount of national‑level data on outcomes but little or no disaggregation by hospital and many countries do not report results publicly at all. Germany, for example, does not, focusing instead on reporting research arising from the German registry managed by the German Society for Thoracic and Cardiovascular Surgery (DGTHG). In all these situations, funders may have little understanding of the outcomes of their commissioned services, let alone their ability to act on any concerning results. Although hospitals are deidentified, patients and families can respond by directly choosing different centers, but this is then driven by individuals and not by commissioning bodies.

Where there is mandated reporting and a more centralised system, actions available differ. For example, in England, if NICOR identifies potentially worse‑than‑expected outcomes at a hospital, it will contact that hospital and ask for a more detailed review of recent cases. If concerns remain, the NICOR can contact NHS England, which in turn can ask the Care Quality Commission (the independent regulator of all health and social care services in England) to conduct an inspection and evaluate whether that hospital meets the set standard. The Quality Commission has the authority to suspend services if it considers that action warranted after inspection.

Australia and New Zealand established The Australia and New Zealand Congenital Outcomes Registry for Surgery (ANZCORS) in 2017 and are in the process of codeveloping the reporting system and how reports will feed into quality improvement initiatives with all the relevant stakeholders, including parents and families. Since 2020, annual reports have been shared with patients and families, hospital executives, and clinical teams. This work has the support and involvement of the Australian Commission on Safety and Quality in Health Care, with the goal to develop a system similar to that of the United Kingdom.

In summary, the level of reporting to service commissioners and regulators depends both on the way each country’s health system is structured and the willingness of professional bodies and individual hospitals to drive transparency and be part of an accountable system.

</div></details>

<details class="med-details"><summary>
  
### Reporting to Parents and Caregivers</summary><div class="details-content">

<details class="med-details"><summary>
  
#### Transparency and Accessibility</summary><div class="details-content">

Transparency requires hospitals and healthcare systems to commit to making outcome data readily available to families, with clear explanations of what the data are, where they have come from, and how their accuracy is ensured. Accessibility is a necessary condition for transparency: data are not transparent if they are not accessible. There are two aspects to accessibility. The first is making it easy to find results both online and in person from a child’s physician or hospital. A PDF file buried at the bottom of a hard‑to‑navigate technical website is not accessible. The second aspect is comprehensibility. Jargon must be avoided, and all concepts necessary for interpreting the data must be explained. To ensure this, working closely with parents and the public on language, content, and level of detail is crucial. Pagel and colleagues codeveloped a website with parents and the public to present and explain United Kingdom monitoring of 30‑day mortality after pediatric heart surgery and described how close interaction with parents was crucial at all stages. Parents highlighted jargon, confusing graphs, and key concepts to emphasise at every stage of the process, all of which had not been identified by the subject experts. Brown and colleagues followed a similar process in developing a patient information leaflet for parents explaining different complications of pediatric surgery, how common they were, and what their implication was for survival or length of hospital stay. The content was driven by workshops with parents whose children had experienced complications, and a key theme was their wish that they had known beforehand that it could happen and what it might mean.

In the United States, the patient advocacy group *Conquering CHD* has a *Guided Questions Tool* that encourages parents to ask key questions about their child’s cardiac team. In addition to questions specific to their child, they suggest a series of questions aimed at understanding the hospital’s patient survival, case volume, complications, and whether the hospital contributes to national benchmarking and publishes its results. Several hospitals have responded by making their data highly accessible and providing detailed outcome data benchmarked to national data.

</div></details>

<details class="med-details"><summary>
  
#### Interpretability</summary><div class="details-content">

Presenting outcomes in the appropriate context is essential to avoid misinterpretation. Data must be presented alongside contextual information, such as case‑mix complexity, patient demographics, and procedural volume, to help parents understand the factors influencing outcomes. Presenting risk‑adjusted outcomes can be a powerful way of contextualising the data, but in this case, risk adjustment must be explained, and its caveats must be transparently presented. The UK website «Understanding Children’s Heart Surgery Outcomes» has layers of detail about what risk adjustment is and how it is used, and a section on what the site cannot be used for (Figs. 8.7, 8.8, and 8.9).

Layering information so that families can choose the level of detail they access can also enhance interpretability and transparency. The amount of information provided by clinicians can have both positive and negative effects on parental anxiety. Parents want information to be accessible, honest, and understandable in lay language. Because each family is different, with some wanting to know every detail and others wanting less, layering information helps create resources that families can tailor to their own needs.

Layering information is also important when considering that many families access outcome data at a time of stress shortly after their child has received a congenital heart disease diagnosis and, often, shortly before treatment must begin. Stress and time pressure are known to be barriers to informed consent. Studies have also indicated that distress levels, time pressure, and the quality of «clinician–parent communication» can adversely affect parental understanding of information provided, with the potential to limit parents’ ability to make informed decisions. Thus, information on outcomes should not only be layered but repeated in several places throughout a document or on a website, with key concepts highlighted to draw the eye and short, easily understood sentences. The UK website developed such a «key points» section following the direct suggestions of families.

![](_page_23_Figure_9.jpeg)

**FIGURE 8.7** Simple cartoons precede a more thorough and extensive explanation of congenital heart surgery survival statistics the parents and public are seeing. (https://www.childrensheartsurgery.info/intro).

![](_page_24_Figure_2.jpeg)

**FIGURE 8.8** Screenshot of survival data for Great Ormond Street Hospital for Children from the public website https://www.childrensheartsurgery.info/data/map. Note that survival, not mortality, is reported, that information is provided in easily readable format, and an explanation is given in language that has been vetted by parents and psychologists.

![](_page_24_Figure_4.jpeg)

**FIGURE 8.9** Background, limitations, and a simple verbal explanation assist in educating parents and the public in understanding the outcome statistics. Only survival statistics are shown because surveys found that this was far and away the most important concern. (https://www.childrensheartsurgery.info/faqs).

</div></details>

<details class="med-details"><summary>
  
#### A Further Word on the United Kingdom Public Reporting Recommendations</summary><div class="details-content">

In an era of Evidence‑Based Medicine, to our knowledge, no randomised trial of the value of public reporting has been tested, and only observational data are generally cited without accounting for confounders. However, as is evident in the preceding text, in the United Kingdom there is a unique center: the Winton Centre for Risk and Evidence Communication based in the Department of Pure Mathematics and Mathematical Statistics at Cambridge University whose chair is Sir David Spiegelhalter. He, with Drs. Christina Pagel and Katherine Brown in the Clinical Operational Research Unit at University College, London, and others in psychology and neuroscience at King’s College, London, launched a three‑round workshop to investigate how well the public, parents, families, and healthcare workers understood what was being reported to the public and if it could be improved. Here are the words of Sir David as he reflected on this seminal research:

*«This has been a humbling and invaluable experience. I thought I knew something about communicating statistics, but sitting listening to enthusiastic users struggling to understand concepts made me realise my inadequacy. If we want to genuinely communicate statistical evidence, I am now utterly convinced that users have to be involved from the very start.»*

Here are some important findings:

- Risk ratios are hard to understand. This is particularly problematic when risk is very low. For example, 10% risk is twice that of 5% risk, but how important is the twofold difference between .05% risk and .1% risk or .005% risk and .01% risk? As noted in Chapter 7, such ratios represent what statisticians call imbalanced data. In such cases, risk models are guaranteed to have a high area under the receiver‑operator curve (AUC or C‑statistic). Better statistics are the area under the precision‑recall curve and G‑mean, among other statistics for rare events.
- Parents, families, and we suspect adult patients grasp survival (being alive) better than mortality. Thus, the idea that 99 out of 100 patients will leave the hospital alive is better understood than 1% mortality. This resulted in tables and graphs of survival rather than of mortality (Fig. 8.8).
- Horizontal bar graphs are superior to vertical ones. Newspapers figured this out long before these experiments, with the majority of «bar graphs» displayed horizontally (Figs. 8.8 and 8.9).
- Some metric on where a given patient, hospital, or provider risk sits in the range of expected survival is helpful (Figs. 8.8 and 8.9).
- Words matter. The authors noted: *«The experiments and workshops also emphasised the importance of consistency in using (or implying) terms such as ‘luck,’ ‘chance,’ ‘risk,’ ‘uncertainty,’ and ‘probability.’ We decided always to refer to predicted risk as ‘predicted chance of survival.’»*
- Simple education is key, both by simple short explanations and by «cartoons» (Fig. 8.7).

</div></details>

<details class="med-details"><summary>
  
#### Changing What Is Measured Through Involving Families and Patients</summary><div class="details-content">

Although there is much common ground between parents, CH caregivers, and health professionals, all of whom want to see the best outcome for the child, the range of focus for parents and caregivers differs somewhat from that of clinicians. For example, Pagel and colleagues in a prospective study to collect data on complications following pediatric heart surgery ran a rigorous and extensive outcome selection process together with clinicians and families. Some divergence was seen between the two groups regarding the fundamental issues of what the important morbidities linked to pediatric cardiac surgery are: clinicians tended to prioritise clearly clinical issues related to the heart (use of extracorporeal life support and reoperation), whereas parents placed greater emphasis on holistic outcomes for their child (problems feeding, child development, and communication). During the consent process and the postoperative periods, the highly skilled practitioners involved in pediatric cardiac surgery understandably have a particularly intense focus on the conduct and success of the procedure itself. Although parents and caregivers obviously share this priority, given their role as primary caregivers, they wish to know more about what their child will be doing afterward in the medium and longer term. Clearly, both areas are very important.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
## SECTION III: CONTROVERSIES IN QUALITY ASSURANCE</summary><div class="details-content">

<details class="med-details"><summary>
  
### Clinical Decision‑Making in the Quality Era</summary><div class="details-content">

Section I cited substantial improvements in cardiac surgical outcomes since the advent of national quality metrics in the United States and iterative enhancements in methodology to assess performance of cardiac surgery programs. Paradoxically, these ongoing advances in analytic methodology, computing power, numbers of outcomes metrics, and overall performance have in some ways made patient‑focused, clinical decision‑making more challenging.

It is difficult to criticise efforts to achieve zero medical error and patient harm, as described in the first edition of this book. However, it is critical that in the current era of transparency and accountability, physicians and healthcare organisations should never allow their quest for higher performance ratings and rankings to conflict with what must always be the ultimate objectives of healthcare providers—acting in the best interests of their patients (in formal medical ethics, *beneficence*), and helping their patients make the best informed treatment choices consistent with their personal beliefs and goals.

The costs to the healthcare system of achieving high performance ratings must also be considered. For example, hospitals in the United States are measured and rated on patient safety indicator (PSI) 12: occurrence of postadmission deep vein thrombosis (DVT) and pulmonary embolism. However, unless a screening system is implemented which includes both admission and predischarge scans for DVT (with significant additional cost), the hospital metric for DVT may appear falsely elevated, since preexisting DVT occurrences will be included in the metric calculation. Is this additional screening scan justified to avoid an unfavourable metric score which could impact the hospital’s rating and reimbursement? Is it in the best interest of an individual patient? Is it the best overall usage of scarce healthcare resources?

In this section, we discuss a variety of challenging quality issues including shared decision‑making; the ethical mandate to prioritise patient autonomy and beneficence; and the unique challenges faced by major referral centers in a public reporting environment. Challenges in clinical decision‑making will be illustrated by three case studies, with a focus on the potential effects of quality metrics and public reporting on surgeons’ behaviour. We explore questions that have been raised about the pros and cons of quality efforts, discuss psychological and ethical issues that affect decision‑making, and offer recommendations to continue the impressive and unrelenting drive to improve safety and outcomes of patients undergoing cardiac operations.

</div></details>

<details class="med-details"><summary>
  
### Measurement Does Not Necessarily Translate into Improvement</summary><div class="details-content">

Despite the current emphasis on quality metrics and improvement, experts have voiced a cautionary note regarding the results of these efforts. Lisa Rosenbaum, in a three‑part series on *The Quality Movement* published in the New England Journal of Medicine, asked the question, «Is quality improving?» and responded with, «It’s hard to know.» She noted that although some quality measures have improved, there is increasing concern about the validity of many measures; the cost of measuring the quality of care delivered; the unintended consequences of a singular focus on metrics in complex clinical scenarios; and metric overload.

Despite an ever‑increasing emphasis on performance metrics, healthcare quality and safety remain suboptimal. In 2023, Bates and colleagues reviewed 2809 inpatient medical records from 11 hospitals and found that 24% of patients experienced adverse events, 23% of which were preventable, and 32% of the events caused serious harm requiring intervention or prolonged recovery. The most common events were medication‑related mistakes, followed by surgical errors and patient care incidents such as falls and pressure ulcers. Twenty‑five years after the Institute of Medicine’s *Crossing the Quality Chasm*, it is clear that physicians continue to be challenged in the current era of outcome metrics.

One potential explanation for the disconnect between measurement and improvement may relate to what is referred to as Goodhart’s Law. In a speech in Australia in 1975, economist Charles Goodhart quipped that «any observed statistical regularity will tend to collapse once pressure is placed on it for control purposes.» This became known as Goodhart’s Law and was refined by British anthropologist Marilyn Strathern, who stated, «When a measure becomes a target, it ceases to be a good measure.» In simple terms, Goodhart’s law, which has been applied to many different disciplines, suggests that when measurement leads individuals to focus singularly and obsessively on optimising a number or score, they may lose sight of the ultimate goal, which is actual improvement in processes and outcomes.

Mattson reflects on how Goodhart’s Law has affected, as an example, graduate medical education, «In particular, the practice of targeting measures and then using them to assess learners and evaluate programs, even when the measures are no longer credible, is quite pervasive in graduate medical education.»

</div></details>

<details class="med-details"><summary>
  
### The Risk of Intervention Versus the Risk of Nonintervention</summary><div class="details-content">

Consider Case 1: an 84‑year‑old patient (Box 8.1) has aortic stenosis with characteristics similar to the average randomised subject in PARTNER 1 and 2, except for important mitral anular calcification. The patient’s demographics and clinical characteristics are entered into an online STS risk calculator (https://acsdriskcalc.research.sts.org/), and the risk of operative mortality is calculated to be 12%. The surgeon’s decision to operate will likely be influenced by whether this estimated risk appears justified. Specifically, at age 84, what if nothing is done at this time?

This scenario highlights that standard risk calculators generate the estimated risk of a specific intervention (operation) but do not simultaneously estimate the risk of alternatives, including not intervening, which is critical from the patient’s perspective. Relevant to Case 1, Ross and Braunwald in 1960 noted that patients with aortic stenosis and either syncope or heart failure had survivals of only 3 and 1.5 years, respectively. In the prohibitive surgical risk PARTNER cohort, 94% of patients were NYHA class III‑IV, and 50% died within a year—little changed over a half‑century. These patients had a 72% chance of dying or being hospitalised during the first year. The high‑risk surgical patients in the PARTNER trial who underwent surgery just a few years later looked, on average, strikingly similar to the patients in the nonoperative cohort of the initial trial and had a much lower 30‑day and 1‑year mortality of 6.5% and 27%, respectively.

<details class="med-details"><summary>
  
#### The Primacy of the Patient’s Perspective in Shared Decision‑Making</summary><div class="details-content">

Does a performance metric measure what is important to the patient? Schaff and Bailey cautioned that something as relatively simple as the composite score – based STS ratings, which include morbid events, may not reflect the relative importance placed on various adverse outcomes by different patients. For example, some patients may fear a stroke as much or more than dying, while others may have similar fears regarding the need for lifelong kidney dialysis. In shared decision‑making, it is essential that the provider elicit from the patient what their greatest priorities and fears are, which may not be reflected in the design of the applicable quality metrics for their procedure.

</div></details>

<details class="med-details"><summary>

#### BOX 8.1 Case 1: Patient with Aortic Stenosis and Mitral Anular Calcification</summary><div class="details-content">

A patient with aortic stenosis presents with characteristics that are similar to the average patient in the first two PARTNER trials. The figure shows expected outcomes using the 9/2023 Version of the STS Risk Calculator.

![](_page_27_Figure_5.jpeg)

The transcatheter aortic valve replacement (TAVR) team notes that anular calcium extends into the anterior mitral leaflet increasing the risk of anular disruption.

**Questions to Ponder**

1. Is a 12% expected risk too high for an isolated aortic valve replacement?
2. What risk(s) does the patient consider most important?
3. Can a risk calculator help with decision‑making?
4. What is the patient’s life expectancy and quality of life without surgery?
5. What is the patient’s life expectancy and quality of life with surgical aortic valve replacement (SAVR) and with transcatheter aortic valve replacement (TAVR)?
6. Should decision‑making depend on knowledge that SAVR generates a much higher margin for the hospital than the percutaneous option?

**Decision**

The Heart Team recommended proceeding with surgical aortic valve replacement (SAVR).

</div></details>

</div></details>

<details class="med-details"><summary>
  
### The Unique Challenges of Quaternary Referral Centers</summary><div class="details-content">

«Managing to the metric» in a public reporting environment may be a particular challenge for tertiary and quaternary referral centers. Ibrahim and colleagues have described the unique pressures experienced in these centers—the traditional «courts of last resort»—when faced with treatment decisions regarding high‑risk patients, especially when these centers are also the subjects of professional or state quality metrics. With these additional reputational, referral, or reimbursement risks, might they be less inclined to accept such high‑risk patients for treatment which would otherwise be in the best interests of the patient?

Regarding this inherent tension, a review of public reporting on cardiac surgery performance by Shahian and colleagues noted the potential surgeon behavioural changes such as gaming and risk aversion that could occur in response to public reporting. However, they emphasised the primacy of informed patient choice as a fundamental justification for these accountability and transparency initiatives: «Notwithstanding all of these other considerations, public reporting affirms the right of patient autonomy, and the latter is a fundamental ethical responsibility of physicians and professional organisations.» The authors also suggested that what is often labelled as risk aversion may in fact reflect «…‘sorting’ of higher risk patients to the best surgeons who are most able to treat them successfully…[or] patients with little or no chance of survival being denied futile interventions, which in such extreme cases may be the best decision.» Smedira and colleagues similarly emphasised the priority of each individual patient and their wishes, and the primacy of the risk‑benefit ratio for each patient. The balance between the patients’ right to access publicly reported provider outcomes versus nuanced, comprehensive assessment of the risk‑benefit ratio for each patient is challenging and requires clarity in communication.

</div></details>

<details class="med-details"><summary>
  
### Procedural Risk and Outcomes</summary><div class="details-content">

<details class="med-details"><summary>
  
#### The Current Standard</summary><div class="details-content">

Short‑term procedural outcome metrics are generally easy to define and are well‑established.

The estimated risks of specific outcomes such as mortality are related through multivariable predictive models to patient‑related risk factors and, when provider performance assessment is not the objective, to procedure‑related factors such as ischaemic time, cardiopulmonary bypass time, and other early events (used in explanatory models).

This procedure‑related focus estimates the patient’s expected risk of an intervention, which informs shared decision‑making and alerts the surgical team regarding potential challenges and mitigation strategies. Importantly, surgical procedures have an unequivocal time zero and exact denominator, and the typical performance metrics require only short‑term follow‑up and are often actionable. They include not only adverse events but also quantifiable process metrics, such as antibiotic timing or use of an ITA for CABG. These metrics are easily used in program rating and ranking by various professional organisations and performance rating services.

</div></details>

<details class="med-details"><summary>
  
#### Would Disease Outcomes be Preferable?</summary><div class="details-content">

Notwithstanding the widespread use of procedure‑based quality metrics, Porter and Teisberg assert that the value and results of health care delivered must also include the long‑term outcomes of disease management, though this is a much more challenging task than short‑term procedural outcomes. Developing predictive models would require identifying when the disease began or was first diagnosed (which is variable from patient to patient, with an imprecise time zero), identifying therapeutic decisions (right therapy for the right patient at the right time) made throughout the life span of the disease, and obtaining a variety of long‑term outcomes, all laudable but extremely challenging goals. This process is further complicated by the current regulatory, privacy, and confidentiality barriers to tracking all healthcare encounters of a patient for optimising disease management.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### «Priming» in the Context of Shared Decision‑Making</summary><div class="details-content">

Patient autonomy and shared decision‑making are also affected by the way in which information is presented to them, sometimes referred to as the «priming effect». When patients are informed («primed») that they have a 10% chance of dying after a procedure, more patients decline the procedure than when they are told there is a 90% chance of surviving, despite these statements being mathematically equivalent (see Figs. 8.7, 8.8, and 8.9). Similarly, physicians remember their last bad outcome much longer than their numerous intervening successes.

</div></details>

<details class="med-details"><summary>
  
### Cost Considerations in Treatment Decisions</summary><div class="details-content">

Costs of care and the financial viability of their hospital or health system are additional factors that may influence physician decision‑making. Controlling healthcare costs is unquestionably a critical national priority. The United States spends more per capita on health care than any other developed country without concomitant superiority in health outcomes. Various macroeconomic policies have been implemented to control costs, many of which are monitored with performance indicators. The costs of specific equipment and drugs, length of hospital stay, and readmissions are a few examples of «quality metrics» that may affect care decisions without rigorous evidence to show they ultimately improve outcomes or reduce overall costs.

Consider this example. If outcomes are similar and the cost of a percutaneous valve is more than 10 times that of a surgical prosthesis, who should be responsible for the additional costs of a transcatheter procedure? Is the higher cost justified from the perspective of quality, patient benefit, and the viability of individual healthcare organisations?

From the patient’s perspective, the rational decision is clear. For a patient with severe aortic stenosis, they are eight times more likely to be alive one year later with an intervention. Transcatheter AVR appears to be associated with the same or lower risk than surgical valve replacement and avoids the months needed for full functional recovery. However, the procedural costs are higher and the margins lower for the hospital. In this context, should it be the surgeon, patient, payor, or healthcare organisation that determines which procedure to perform?

</div></details>

<details class="med-details"><summary>
  
### Gaming</summary><div class="details-content">

In *Crossing the Quality Chasm*, Paul Plsek notes that the healthcare system, unlike a mechanical system, is best thought of as a complex adaptive system in which the constituents within the system respond to information in many different and unpredictable ways, and in which one agent’s actions can change the context and behaviour of another. Complex adaptive system thinking aids in forming a conceptual framework and identifying its properties (Table 8.2). Within this complex framework, inadequate attention is typically paid to how individual physicians react to performance metrics and procedural risk estimators when trying to balance the well‑being of the patient versus their personal and organisational reputations and ratings.

<details class="med-details"><summary>

#### TABLE 8.2 Properties and Responses Within a Complex Adaptive System</summary><div class="details-content">

| Properties | Response |
|------------|----------|
| Adaptable elements | Each element can change |
| Simple rules | Complex outcomes |
| Nonlinearity | Small changes → large effect |
| Emergent behaviour, novelty | Creativity, gaming |
| Inexact predictions | Have to observe response |
| Context and embeddedness | System within systems |
| Co‑evolution | Systems move forward |

</div></details>

Consider Case 2: a 67‑year‑old man with a recent non‑ST‑segment myocardial infarction has reduced left ventricular systolic function, diffuse multisystem coronary artery disease, mild tricuspid and mitral valve regurgitation, and elevated creatinine (Box 8.2). Although the Heart Team, following American College of Cardiology/American Heart Association guidelines, might recommend isolated CABG, his calculated procedural risk of operative mortality is high. Adding a discretionary and possibly unnecessary additional procedure (e.g., tricuspid valve repair) would change the category of case (i.e., taking it out of the isolated CABG publicly reported category) without clear evidence of benefit. The surgeon could hypothetically pursue this option to mitigate the potential reputational consequences of what they suspect may be a poor isolated CABG outcome that will impact their public report cards. Though this type of «gaming» behaviour has been mentioned anecdotally, there is no objective evidence that such behaviours are occurring with any frequency.

Rather than serving the self‑interests of providers, some types of «gaming» might be attempts to advocate on behalf of patients. Consider cardiac transplantation in the United States, in which a change in the allocation system was implemented to decrease mortality on the waiting list and reduce the priority for patients supported by durable ventricular assist devices, with their known safety. This has resulted in a practice of using alternative and potentially less safe techniques (temporary support devices) to support urgent patients, which provides them a higher priority for available donors. Khazanie and Drazner note that «gaming the system» and «patient advocacy» speak to the challenges physicians face caring for patients, and the transplant community needs to consider «the difficult ethical balance faced by physicians during the allocation process.»

<details class="med-details"><summary>

#### BOX 8.2 Case 2: 67‑Year‑Old Male with a Recent Non‑ST Segment Myocardial Infarction</summary><div class="details-content">

A 67‑year‑old male presents with a recent non‑ST segment myocardial infarction. His ejection fraction is 40%, and he is found to have diffused multisystem coronary artery disease with mild‑to‑moderate tricuspid valve regurgitation and mild‑to‑moderate mitral valve regurgitation. The tricuspid valve anulus measures 3.2 cm. The Society of Thoracic Surgery expected mortality is 4.1%. Creatinine peaked at 4 mg/dL and now at baseline is 2.8 mg/dL.

The Heart Team recommends coronary artery bypass grafting (CABG).

![](_page_29_Picture_6.jpeg)
![](_page_29_Picture_7.jpeg)

**Question to Ponder**

The surgeon wonders, «Should the mitral or tricuspid valve be ‘repaired’ with a reduction anuloplasty, thereby changing the procedure from an isolated CABG to a valve and CABG, avoiding a possible ‘hit’ against his and his department’s quality metric?»

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Risk Aversion and Diversion</summary><div class="details-content">

As noted previously in this section and in Section I, quality and safety measures based on procedural outcomes have inherent unintended consequences including «gaming» and physician «risk aversion.» Regarding the latter, in an era of generally excellent cardiac surgical outcomes, some have argued that programs may avoid some very high risk patients (often those who may benefit most from an intervention) in hopes of preserving or improving their personal or organisational performance metrics. Others have countered that what is typically classified as the inappropriate practice of risk aversion may in some instances be an effective, patient‑centric strategy, intentionally allowing higher risk patients to be transferred from a less experienced and more «risk averse» center to one with greater experience and expertise in caring for such patients.

Although little evidence exists for risk aversion in cardiac surgery, Wasfy and colleagues noted that 79% of interventional cardiologists in the State of New York thought public reporting played a role in their clinical decision‑making regarding PCIs.

</div></details>

<details class="med-details"><summary>
  
### Stifling of Innovation in a Public Reporting Environment</summary><div class="details-content">

Consider Case 3, a 65‑year‑old male with a history of alcohol abuse who presents in cardiogenic shock with a large anterior and apical pseudoaneurysm and ventricular septal rupture (Box 8.3). Should the patient undergo emergency reconstruction of the ventricle or heart transplant? The challenge in this case is that there is more than one therapeutic option available, one of which involves an evolving innovation in reconstruction of the left ventricle that could potentially allow for heart tissue to become stronger and permit recovery of systemic organ function, avoiding surgical futility. It would avoid a transplant and possible increased risk of rejection from noncompliance in a patient with a history of alcohol abuse. Should such innovation be encouraged? In the practice of heart surgery, when does performance evaluation in the setting of public reporting (despite its many favourable attributes in promoting quality) impair surgical innovation? When innovative procedures are an option, should someone other than the provider of the innovative new procedure (e.g., the operating surgeon) present the options and risks to the patient to assure they have received unbiased, objective information for their informed decision‑making?

<details class="med-details"><summary>

#### BOX 8.3 Case 3: 65‑Year‑Old Male Presenting in Cardiogenic Shock</summary><div class="details-content">

A 65‑year‑old male presents a few days after an anteroseptal infarct in cardiogenic shock. He is stabilised and supported with a microaxial pump. Imaging shows a large anterior and apical pseudoaneurysm and ventricular septal rupture. The patient has a long history of alcohol abuse with multiple citations for driving under the influence. He has no other comorbid conditions.

![](_page_30_Picture_4.jpeg)

Should the patient undergo emergency reconstruction of the ventricle or heart transplant? With the complex destruction of the anterior wall and septum, half the surgical team thinks reconstruction of the ventricle is feasible. The other half of the team thinks transplant is a better option. However, concerns are raised about the alcohol use history. It is thought that poor compliance with immunosuppressive drugs will increase risk of graft loss.

**Considerations Pondered**

The transplant team notes that the program has had a few deaths in the current 3‑year cycle; another death could put the program in jeopardy. The committee debate is contentious with vocal proponents each for prioritising the life of the patient, not jeopardising the program’s standing, and for maximising the utility of a scarce resource.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Moral Injury or Distress</summary><div class="details-content">

The three clinical cases highlight the challenges of managing conflicting expectations of near‑perfect outcomes with the primacy of the patient’s wishes and well‑being, especially for high‑risk procedures and patients. This tension can lead to what has been described as moral distress, a phrase initially used to describe the distress or injury of soldiers who, in combat, are faced with ethical challenges. It entered the public lexicon describing the challenges healthcare workers experienced triaging critically ill patients with COVID‑19 during the pandemic of 2020 to 2022 and as an explanation for increased physician burnout blamed on the corporatisation of medicine. Rosenbaum defines it as «The sense of moral transgression clinicians may experience when the system prevents them from meeting the patients’ needs.»

In the case of heart transplantation in a potentially noncompliant patient (Case 3), this distress among heart failure practitioners arises from several competing desires: providing the noncompliant patient with a possibly life‑saving transplant; saving the organ for a better risk recipient and performing an unproven, innovative procedure; having a posttransplant mortality that puts the program in jeopardy if a performance standard is not met.

As conflicting demands increase on practitioners, there is recognition that moral distress is a powerful factor impacting physician’s job satisfaction and willingness to discuss internal hospital issues.

</div></details>

<details class="med-details"><summary>
  
### Conclusions</summary><div class="details-content">

Physicians generally make rational decisions, but in the era of transparency and accountability, decision‑making for an individual patient, especially if high risk, can be challenging. In the past, a decision to prioritise the patient’s needs meant only a sacrifice of the physician’s time, energy, and mental and emotional stress. Today, a clinical or procedural decision may have implications for employment, professional standing, remuneration, and success of the organisation.

In the three cases presented, the choices are not clear cut. Each physician addresses these care decisions with their unique intelligence, personal values, biases, last worst case, and priorities. Performance and quality standards also impact these decisions, but despite their salutary impact on overall outcomes, they may impose an undue influence on clinical decision‑making.

From the patient’s perspective, physician treatment recommendations should be based on a risk/benefit assessment of the therapeutic alternatives in their particular situation. However, these considerations may be at odds with the anticipated impact of a procedure on the provider’s quality and performance metrics. Further, the current framework of 30‑day or in‑hospital mortality and outcomes often provides an incomplete depiction of the long‑term benefit of a given therapy.

More sophisticated analytic methods, greater computing power, and machine learning algorithms for both outcome data collection and predictive model development may improve clinical decision‑making and outcomes assessment. Notwithstanding such future improvements, it will always be essential to consider the human element—the patient, the physician, and the moral responsibility of the physician for their patient—in clinical decision‑making.

</div></details>

</div></details>