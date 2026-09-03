# Generating Knowledge from Information, Data, and Analyses

##### Cardiac surgery is among the most quantitative subspecialties in medicine. Studies in cardiac surgery reveal a complex, multifactorial, multilayered interplay among patient characteristics, variability of the heart disease, effect of the disease on the patient, conduct of the surgery, and response to treatment. This chapter provides a comprehensive framework for transforming clinical information into analyzable data, performing appropriate analyses, evaluating inferences, applying new knowledge to individual patients, and disseminating findings. It emphasizes the Newtonian inductive method—letting the data speak for themselves—and covers topics from human error and surgical failure to advanced machine learning, precision medicine, and social determinants of health.

<details class="med-details"><summary>
  
## Executive Summary</summary><div class="details-content">

### Philosophy and Foundational Concepts
*   **Inductive vs. Deductive Method:** Newtonian induction begins with data analysis to reveal patterns, then infers causes; deduction starts with hypotheses and tests them against data. This chapter prioritises the inductive approach («let the data speak»).
*   **Determinism vs. Empiricism:** Many clinical responses are probabilistic, not fully deterministic; thus empirical pattern recognition is essential.
*   **Collectivism vs. Individualism:** John Graunt’s 17th‑century analysis of plague deaths treated people as interchangeable (the «forest») to identify risk factors, while individual cases (the «trees») provide complementary insights.
*   **Continuity in Nature:** Categorising continuous variables (e.g., age) loses power; analysing the full spectrum («borrowing power») is preferred.
*   **Linearity vs. Nonlinearity:** The logistic relation between risk (logit units) and absolute probability is S‑shaped. A small increase in risk near 50% probability has a much larger absolute effect than the same increase at very low or very high risk.
*   **Parsimony vs. Complexity:** Simplicity is a philosophical virtue, but overly simple models may miss important relations. For comparisons, account for «everything known» when data are sufficient.
*   **Nihilism vs. Predictability:** Multivariable equations can predict group and individual outcomes reliably, but prediction fails for patients with rare, unaccounted‑for conditions.

### Human Error and Surgical Failure
*   **Categories of Error:** *Slips* (execution failures), *lapses* (memory failures), *mistakes* (plan/judgment failures). Slips and lapses are active errors; mistakes often represent latent errors embedded in the system.
*   **Mechanisms of Error:** Downregulation (automaticity leads to skill‑based errors when attention is diverted), upregulation (focused attention can cause data loss or overload), primitive storage/retrieval (pattern matching may misfire), conscious thought (slow, serial, prone to knowledge‑based errors).
*   **Reducing Errors:** Intense apprenticeship, simulators, distraction‑minimising environments, team alertness, «cognitive prostheses» (e.g., computerised medication safety), and system‑level correction of latent errors.

### Clinical Study Designs
*   **Descriptive Studies:** Techniques, case reports, case series – essential for sharing innovations and describing outcomes.
*   **Nonrandomised Treatment Studies:** Multivariable analysis, case‑control, comparative effectiveness, and virtual twin methods. Propensity scores help balance groups for apples‑to‑apples comparisons.
*   **Randomised Clinical Trials (RCTs):** Gold standard for average treatment effects, eliminating selection bias. Challenges in surgery include blinding, skill variability, and standardisation.
*   **Meta‑Analysis:** Combines multiple studies. Requires careful handling of heterogeneous follow‑up durations and non‑proportional hazards.

### Research Proposal and Data Collection
*   **FINER Criteria:** Feasible, Interesting, Novel, Ethical, Relevant.
*   **Study Group Definition:** Clear inclusion/exclusion criteria; always include denominator (cohort, not just numerators).
*   **Endpoints:** Must be linked to hypotheses, clearly defined, and dated. For repeated events, record every occurrence, not just the first or last.
*   **Covariables:** Balance between sparsity and «Christmas tree effect» (too many ornamentals). Use controlled vocabulary, avoid free text.
*   **Data Verification:** Iterative checking, postage‑stamp plots for continuous/binary/ordinal variables, correction of outliers and missing values.

### Information Models
*   **Computer‑Based Patient Record (CPR):** Values for variables from a controlled vocabulary, time‑stamped, retrievable at individual and group levels.
*   **Relational Model:** Tables (columns = variables, rows = patients). Simple but often leads to siloed databases.
*   **Semistructured Model (RDF triples, OWL):** Complex data elements are self‑documenting, allowing flexible relationships imposed only at retrieval. Aligned with Semantic Web technologies.

### Data Preparation and Descriptive Statistics
*   **Analysis Data Set:** Create time intervals, indicator variables (1/0), consistent naming conventions. Screen and scrub for impossible values.
*   **Missing Values:** Sporadic → mean imputation or informative imputation; systematic → set to zero with a missing indicator.
*   **Descriptive Statistics:** For categorical variables: counts, percentages. For continuous: mean ± SD if normal; median and percentiles if skewed.
*   **Rounding:** Keep all digits during computation; round only for presentation, preserving significant digits based on standard error.

### Multivariable Analysis and Risk Factors
*   **Purpose:** Identify variables associated with outcome, estimate magnitude, quantify uncertainty, reveal relations, dismiss noise.
*   **Logistic Regression:** For binary outcomes (e.g., hospital mortality). The equation: \( P = 1/(1+e^{-z}) \) with \( z = \beta_0 + \beta_1x_1 + ... \)
*   **Polytomous/Ordinal Logistic Regression:** For multiple unordered or ordered outcome categories.
*   **Machine Learning Approaches:** AdaBoost, gradient boosting, random forests, lasso (L₁ regularisation) and ridge (L₂). These handle high dimensionality, non‑linearity, and interactions with fewer assumptions.
*   **Incremental Risk Factors:** Variables that add risk after adjusting for others. They reflect surgical complexity, disease acuity, surrogates for unmeasured causes, or quality of care.
*   **Variable Selection:** Bootstrap aggregation (bagging) reveals reliable risk factors (appear in ≥50% of bootstrap models). Lasso sets some coefficients exactly to zero, achieving sparse models.
*   **Calibration and Discrimination:** Hosmer‑Lemeshow test, ROC‑AUC, precision‑recall AUC (preferred for imbalanced data).

### Time‑Related Event Analysis
*   **Kaplan‑Meier (Nonparametric):** Estimates survival/freedom from event at each event time.
*   **Parametric Hazard Models:** Decompose hazard into early (rapidly declining), constant, and late (rising) phases. Allow patient‑specific predictions with confidence limits.
*   **Cox Proportional Hazards:** Semiparametric; assumes constant hazard ratio over time. Check proportionality; if violated, use non‑proportional methods.
*   **Repeated Events:** Nelson estimator (cumulative hazard) or modulated renewal process (restart time zero after each event).
*   **Weighted Events:** Multiply hazard by a cost/severity weight (e.g., neurological deficit grade).
*   **Competing Risks:** Multiple mutually exclusive end states (e.g., death vs. reintervention). Use cumulative incidence function or conditional probability.

### Longitudinal Outcomes
*   **Mixed‑effects models** account for within‑patient correlation of repeated measurements over irregular intervals.
*   **Temporal decomposition** applies the same multiphase concept as hazard analysis to continuous/binary/ordinal longitudinal data.
*   **Joint modelling** links longitudinal trajectories (e.g., FEV₁) with time‑to‑event outcomes (e.g., death) to handle informative censoring.

### Clinical Decision‑Making
*   **Average Treatment Effect (ATE):** From RCTs or propensity‑matched studies. Answers «what works on average?»
*   **Individual Treatment Effect (ITE):** Precision medicine – predicting outcome for a specific patient using multivariable equations or virtual twin methods.
*   **Propensity Score:** Probability of receiving treatment given covariates. Used for matching, stratification, weighting, or covariate adjustment to reduce selection bias in observational studies.
*   **Virtual Twins:** Machine learning models estimate counterfactual outcomes (what would happen if the same patient received alternative treatment). Requires positivity (plausibility of the alternative).
*   **Partial Dependence Plots (PDP):** Visualise causal relationships by integrating out covariates, avoiding confounding bias.

### Disseminating Knowledge
*   **Scientific Paper Structure:** IMRD (Introduction, Methods, Results, Discussion) with structured abstract, central message, graphical/visual abstract.
*   **Authorship:** ICMJE criteria (substantial contribution, drafting/revising, final approval, accountability).
*   **Scientific Presentations:** Use story‑based structure, serial listening principles, speech‑box formatted script, minimal slides, no tables if possible.

### Social Determinants of Health and Causality
*   **Causal Inference:** Counterfactual framework, confounding, effect modification, mediation. Directed acyclic graphs (DAGs) help visualise causal hypotheses.
*   **Social Determinants:** Residential segregation, redlining, neighbourhood deprivation (Area Deprivation Index, Social Vulnerability Index) strongly affect cardiovascular outcomes. Measuring and modelling them requires geocoding and multilevel approaches.

</div>
</details>

<details class="med-details"><summary>
  
## SECTION I: GENERATING KNOWLEDGE FROM INFORMATION, DATA, AND ANALYSES</summary><div class="details-content">

<details class="med-details"><summary>
  
### Introducing the Chapter</summary><div class="details-content">

Cardiac surgery is among the most quantitative subspecialties in medicine. It started that way and continues to be that way. Studies in cardiac surgery reveal a complex, multifactorial, multilayered, multidimensional interplay among patient characteristics, variability of the heart disease, effect of the disease on the patient, conduct of the cardiac surgery, and response of the patient to treatment in the short and long term. Because cardiac surgeons were "data collectors" from the beginning of the subspecialty, it is understandable that efforts to improve quality and appropriateness of medical care while containing its costs found cardiac surgical results an easy target. The dawn of medical report cards made it evident that multiple factors influencing outcome must be taken into account to make fair comparisons. This scrutiny of results, often by the media, reveals that variability in performing technical details of operations, coupled with environmental factors often not under direct control of cardiac surgeons, contribute to differences in results.

Propensity toward data collection in cardiac surgery was reinforced in the 1970s and early 1980s by challenges from cardiologists to demonstrate not simply symptomatic improvement from cardiac surgery, but longer survival and better long-term quality of life (appropriateness). This resulted in one of the first large‑scale, government‑funded registries and an in‑depth research database (Box 7.1) of patients with ischemic heart disease, as well as a rather small, narrowly focused randomised trial (Coronary Artery Surgery Study). It stimulated subsequent establishment by the Society of Thoracic Surgeons (STS) of what is now the largest nongovernmental registry of cardiac surgical data.

Thus, it is important for all in the subspecialty of cardiac surgery, not just those engaged in bench, translational, or clinical research, to (1) understand how information generated from observations made during patient care is transformed into data suitable for analysis, (2) appreciate at a high level what constitutes appropriate analyses of those data, (3) effectively evaluate inferences drawn from those analyses, (4) translate and apply new knowledge to better care for individual patients, and (5) disseminate that knowledge.

It is our desire that the reader realise these goals and not conclude prematurely that this chapter is simply a treatise on data science, biostatistics, outcomes research, epidemiology, biomathematics, or bioinformatics.

Thus, to lead from information to new knowledge, they envision bringing together quantitative needs in structural biology, biochemistry, molecular biology, and genomics at the microscopic level, and medical, health services, health economics, and social systems disciplines at the macroscopic level, with analytic tools from computer science, mathematics, statistics, physics, and other quantitative disciplines. This vision transcends current restrictiveness of traditional biostatistics in analysis of clinical information. This is why we emphasise in this chapter that the material is not simply for surgeons, their clinical research team, and consulting and collaborating biostatisticians, but also for a wider audience of professionals in a variety of quantitative and qualitative disciplines.

<details class="med-details"><summary>
  
#### Who Should Read This Chapter</summary><div class="details-content">

This chapter should be read in whole or in part by (1) all cardiac surgeons, to improve their comprehension of the medical literature and hone their skills in its critical appraisal; (2) young surgeons interested in becoming clinical investigators, who need instruction on how to pursue successful research (see "Technique for Successful Clinical Research" later in this section); (3) mature surgeon‑investigators and other similar medical professionals and their collaborating statisticians, mathematicians, and data and computer scientists, who will benefit from some of the philosophical ideas included in this section, and particularly from the discussion of emerging analytic methods for generating new knowledge; and (4) data managers and data scientists of larger clinical research groups, who need to appreciate their pivotal role in successful research, particularly as described in Sections I, II, and III of this chapter and Appendix 7A.

The potential obstacle for all will be language. For the surgeon, the language of statistics, mathematics, and computer science may pose a daunting obstacle of symbols, numbers, and algorithms. For collaborating statisticians, mathematicians, and computer scientists, the Greek and Latin language of medicine is equally daunting. For most, the language of implementation and dissemination science, behavioural science, and econometrics is unique. This chapter attempts to surmount the language barrier by translating ideas, philosophy, and unfamiliar concepts into words while introducing only sufficient statistics, mathematics, and algorithms to be useful for the collaborating scientist.

Because this chapter is intended for a mixed audience, it focuses on the most common points of intersection between cardiac surgery and quantitative and qualitative science, with the goal of establishing sufficient common ground for effective and efficient communication and collaboration. As such, it is not a substitute for statistical texts or academic courses, nor a substitute for the surgeon‑investigator to establish a collaborative relationship with biostatisticians, nor is it intended to equip surgeons with sufficient statistical expertise to conduct highly sophisticated data analyses themselves.

</div></details>

<details class="med-details"><summary>
  
#### How This Chapter Has Evolved</summary><div class="details-content">

At least three factors have contributed to the evolution of this chapter from edition to edition of this textbook: increasing importance of computers in analysing clinical data, introduction of new and increasingly appropriate and applicable methods for analysing those data, and growing importance of nontraditional machine learning methods for drawing useful and important inferences from medical data with fewer assumptions. In Edition 4, we introduced collaborators in the fields of artificial intelligence, ontology, and machine learning. Revision was also strongly influenced by the Institute of Medicine’s (IOM; now the Academy of Medicine) Learning Health System initiative and comparative effectiveness emphases of the Academy and NIH.

In this edition, we split off Quality Assurance as a separate chapter (Chapter 8); amplify machine learning, causal inference, and graphical representation of mechanistic hypotheses as directed acyclic graphs; and cast patient‑specific predictions (precision medicine) into the formal next‑generation propensity arena of virtual twins. We hint at the emerging fields of implementation and dissemination science with their frameworks and mixed methods in the context of social determinants of health. The latter affects not only access to cardiac diagnosis and treatment, but long‑term outcomes of patients.

</div></details>

<details class="med-details"><summary>
  
#### How the Chapter Is Organized</summary><div class="details-content">

The organisational basis for this chapter is the Newtonian *inductive method* of discovery. It begins with *information* about a microcosm of medicine, proceeds to translation of information into *data* and *analysis* of those data, and ends with new *knowledge* about a small aspect of nature. This organisational basis emphasises the phrase "Let the data speak for themselves." It is that philosophy that dictates, for example, placing "Indications for Operation" after, not before, presentation of surgical results throughout this book.

*Information.* In health care, information is a collection of material, workflow documentation, and recorded observations (see Section II). This information is largely in electronic (computer) format.

*Data.* Data consist of organised values for variables, usually expressed symbolically (e.g., numerically) by means of a controlled vocabulary (see Section III). Characterisation of data includes descriptive statistics that summarise the data and express their variability.

*Analysis.* Analysis is a process, using a large repertoire of methods, by which data are explored, important findings are revealed and unimportant ones suppressed, and relations are clarified and quantified (see Section IV).

*Knowledge.* Knowledge is the synthesis of information, data, and analyses arrived at by application of information, data, and analyses in the form of study designs that yield evidence for evidence‑based medicine based on average treatment effects and evidence for precision medicine based on individual treatment effects (see Section V). New knowledge may take the form of *clinical inferences*, which are summarising statements that synthesise information, data, and analyses, drawn with varying degrees of confidence that they are true. It may also include *speculations*, which are statements suggested by the data or by reasoning, often about mechanisms, without direct supportive data. Ideally, it also includes new *hypotheses*, which are testable statements suggested by reasoning, inferences, or speculations from the information, data, and analyses.

*Knowledge Dissemination.* To be useful both to incrementally benefit science and to contribute to advancement of health and health care, knowledge must be disseminated. The clearest example of this is scientific publications and presentations (see Section VI). That is, to be most useful, what has been found must be made public. In this edition, we only hint at the rapidly evolving field of implementation and dissemination science and its barriers (see Section VII), but this science is crucial to apply knowledge to routine clinical practice. The lag between discovery and its integration into routine clinical practice is estimated to be 17 years, and this needs to be shortened.

</div></details>

<details class="med-details"><summary>
  
#### How to Read This Chapter</summary><div class="details-content">

Unlike most chapters in this book, whose various sections and parts can be read somewhat randomly and in isolation, Section I of this chapter should be read in its entirety before embarking on other sections. It identifies the mindset of the authors; defends the rationale for emphasising surgical success and failure; contrasts philosophies, concepts, and ideas that shape both how we think about the results of research and how we do research; lays out a technique for successful clinical research that parallels the surgical technique portions of other chapters; and for collaborating scientists engaged in analysing clinical data, lays the foundation for our recommendations concerning data analysis.

Much of the material in this introductory section is amplified in later portions of the chapter, and we provide cross‑references to these to avoid redundancy.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Driving Forces of New Knowledge Generation</summary><div class="details-content">

Many forces drive the generation of new knowledge in cardiac surgery, including the business economics of healthcare, need for innovation, clinical research, surgical success and failure, and awareness of medical error.

<details class="med-details"><summary>
  
#### Economics</summary><div class="details-content">

The economics of health and healthcare are driving changes in practice toward what is hoped to be less expensive, more efficient, yet higher quality care. Interesting methods for testing the validity of these claims have become available in the form of *cluster randomised trials.* In such trials (e.g., a trial introducing a change in physician behaviour), patients are not randomised; physicians are. (Patients form the cluster being cared for by each physician.) This leads to inefficient studies that nevertheless can be effective with proper design and a large enough pool of physicians. It is a study design in which the unit of randomisation (physician) is not the unit of analysis (individual patient outcome). Such trials appear to require rethinking of traditional medical ethics.

</div></details>

<details class="med-details"><summary>
  
#### Innovation</summary><div class="details-content">

Just when it seems that cardiac surgery has matured, innovation intervenes and occurs at several levels. It includes new devices; new procedures; existing procedures performed on new groups of patients; simplifying and codifying seemingly disparate anatomy, physiology, or operative techniques; standardising procedures to make them teachable and reproducible; and introducing new concepts of patient care. Many of these innovations apply beyond the field of cardiac surgery.

Yet, innovation is often at odds with cost reduction and is perceived as being at odds with traditional research. In all areas of science, however, injection of innovation is the enthalpy that prevents entropy, stimulating yet more research and development and more innovation. Without it, cardiac surgery would be unable to adapt to changes in managing ischaemic heart disease, potential reversal of the atherosclerotic process, percutaneous approaches to valvular and congenital heart disease, and other changes directed toward less invasive therapy. What is controversial is (1) when and if it is appropriate to subject innovation to formal clinical trial and (2) the ethics of innovation in surgery, for which standardisation is difficult.

</div></details>

<details class="med-details"><summary>
  
#### Reducing the Unknown</summary><div class="details-content">

New knowledge in cardiac surgery has been driven by the quest to fill voids of the unknown, whether by clinical research or laboratory research. This has included research to clarify normal and abnormal physiology, such as the abnormal state of the body supported on cardiopulmonary bypass.

Clinical research has historically followed one of two broad designs: nonrandomised studies of observational patient cohorts ("clinical practice") and randomised clinical trials. Increasing emphasis, however, is being placed on translational research, bringing basic research findings to the bedside and back. John Kirklin called this the "excitement at the interface of disciplines." Part and parcel of the incremental risk factor concept (see "Incremental Risk Factor Concept" in Section IV) is that it is an essential link in a feedback loop that starts with surgical failure, proceeds to identifying risk factors, draws inferences about specific gaps in knowledge that need to be addressed by basic science, generates fundamental knowledge by the basic scientists, and ends by bringing these full circle to the clinical arena, testing and assessing the value of the new knowledge generated for improving medical care.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Surgical Failure</summary><div class="details-content">

Results of operative intervention in heart disease, particularly surgical failure, drive much of the new knowledge generated by clinical research—in the late 1970s and early 1980s, a useful concept arose about surgical failures—the absence of natural disaster or sabotage, there are two principal causes of failure of cardiac operations to provide a desired outcome: (1) lack of scientific progress and (2) human error.

<details class="med-details"><summary>
  
#### Human Error (introduction)</summary><div class="details-content">

Increased awareness of medical error is driving the generation of new knowledge, just as it is driving increasing regulatory pressure and medicolegal litigation. Kirklin’s group at the University of Alabama at Birmingham (UAB) was one of the first to publish information about human error in cardiac surgery and place it into the context of cognitive sciences, human factors, and safety research. This interface of disciplines is essential for facilitating substantial reduction in injury from medical errors.

</div></details>

<details class="med-details"><summary>
  
#### Surgical Failure (detailed)</summary><div class="details-content">

Surgical failure is a strong stimulant of clinical research aimed at making scientific progress. With increasing requirements for reporting both outcomes and process measures in the United States (with "pay for performance"), there is now also an economic stimulus to reduce human error (see Chapter 8, Quality Assurance). The term "human error" carries negative connotations that make it difficult to discuss in a positive, objective way to do root‑cause analyses of surgical failures. It is too often equated with negligence or malpractice, and almost inevitably leads to blaming persons on the "sharp end" (caregivers), with little consideration of the decision‑making, organisational structures, infrastructures, or other factors that are remote in time and distance ("blunt end").

</div></details>

<details class="med-details"><summary>
  
#### Human Error (detailed)</summary><div class="details-content">

Richardson in 1912 recognised the need to eliminate "preventable disaster from surgery." Human error as a cause of surgical failure is not difficult to find, particularly if one is careful to include errors of diagnosis, delay in therapy, inappropriate operations, omissions of therapy, and breaches of protocol.

When we initially delved into what was known about human error in the era before Canary Island (1977), Three‑Mile Island (1979), Bhopal (1984), Challenger (1986), and Chernobyl (1986), events that contributed enormously to knowledge of the nature of human error, we learned two lessons from the investigation of occupational and mining injuries. First, successful investigation of the role of the human element in injury depends on establishing an environment of *nonculpable error*. An atmosphere of blame impedes investigating, understanding, and preventing error. How foreign this is from the culture of medicine! We take responsibility for whatever happens to our patients as a philosophical commitment. Yet cardiac operations are performed in a complex and imperfect environment in which every individual performs imperfectly at times. It is too easy when things go wrong to look for someone to blame. Blame by 20/20 hindsight allows many root causes to be overlooked.

Second, we learned that errors of *omission* exceed errors of *commission*. This is exactly what we found in ventricular septal defect (VSD) repair in the 1960s and 1970s (Table 7.1), suggesting that the cardiac surgical environment is not so different from that of a gold mine, and we can learn from that literature.

These two lessons reinforced some surgical practices and stimulated introduction of others that were valuable in the early stages of growth of the UAB cardiac surgery program: using hand signals for passing instruments, minimising distractions, replying simply to every command, reading aloud the protocol for the operation as it proceeds, standardising apparently disparate operations or portions thereof, and focusing morbidity conferences candidly on human error and lack of knowledge to prevent the same failure in the future. To amplify, these practices were enunciated as a "culture of clarity"—in today’s terms, a culture of transparency—by the late Robert Karp, MD, the end result of which is a reproducible and successful surgical endeavour. In the operating room, each individual on the surgical team is relaxed but alert:

- Hand signals serve to inform assistants and the scrub nurse or technician of anticipated needs for a relatively small number of frequently used instruments or manoeuvres.
- Spoken communication is reserved for those out of the field of sight (i.e., the anaesthesiologist and perfusionist). When verbalised, "commands" are acknowledged with a simple reply.
- Anticipated deviations from the usual are presented in the preprocedure "huddle." Unanticipated deviations are acknowledged to all concerned as soon as possible.
- Successful routines are codified. These include chronology for anticoagulation and its reversal, myocardial management routines, and protocols controlled by the surgeon for commencing and weaning the patient from cardiopulmonary bypass.
- Technical intuitive concepts are articulated. For example, some think the VSD in tetralogy of Fallot is a circular hole. Thus, closing such a hole would simply involve running a suture circumferentially to secure a patch. Kirklin and Karp were able to describe the suture line as having four different areas of transition in three dimensions and precisely articulated names for those transitions. Each had a defined anatomic relationship to neighbouring structures, so the hole became infinitely more interesting!

Discussion of surgical failure is planned for a time when distractions are minimal. The stated goal is improvement, measurable in terms of reproducibility and surgical success. The philosophy is that events do not simply occur but have antecedent associations, so‑called root‑cause analysis. An attempt is made to determine if errors can be avoided and if scientific knowledge exists or does not exist to prevent future failure.

A major portion of the remainder of this chapter addresses acquisition and description of this new knowledge.

<details class="med-details"><summary>
  
##### Categories of Human Error</summary><div class="details-content">

*Slips* are failures in execution of actions and are commonly associated with attention failures. Some external stimulus interrupts a sequence of actions or in some other way intrudes into them such that attention is redirected. In that instance, the intended action is not taken. *Lapses* are failures of memory. A step in the plan is omitted, one’s place in a sequence of actions is lost, or the reason for what one is doing is forgotten. *Mistakes* relate to plans and so take two familiar forms: (1) misapplication to the immediate situation of a good plan (rule) appropriate for a different and more usual situation and (2) application of a wrong plan (rule).

Slips and lapses constitute *active errors*. They occur at the physician–patient interface. Mistakes, in addition, constitute many *latent errors*. These are indirect errors that relate to performance by leaders, decision makers, managers, certifying boards, environmental services, and a host of activities that share a common trait: planning, decisions, ideas, and philosophy removed in time and space from the immediate healthcare environment in which the error occurred. These are a category of errors over which the surgeon caring for a patient has little or no control or chance of modifying because latent errors are embedded in the system. It is claimed by students of human error in other contexts that the greatest chance of preventing adverse outcomes from human error is in discovering and neutralising latent error.

</div></details>

<details class="med-details"><summary>
  
##### Inevitability of Human Error</summary><div class="details-content">

If one considers all the possibilities for error in daily life, what is remarkable is that so few are made. We are surrounded with unimaginable complexity, yet we cope nearly perfectly because our minds simplify complex information. Think of how remarkably accident‑free our early‑morning commutes to the hospital are while driving complex machines in complex traffic patterns while we plan our day and listen to the news, weather report, and commercials.

When this cognitive strategy fails, it does so in only a few stereotypical ways. Because of this, models have been developed, based largely on observation of human error, that mimic human behaviour by incorporating a fallible information‑handling device (our minds) that operates correctly nearly always, but is occasionally wrong. Central to the theory on which these models are based is that our minds can remarkably simplify complex information. Exceedingly rare imperfect performance is theorised to be the price we pay for being able to cope this way with complexity. The mechanisms of human error are purported to stem from three aspects of "fallible machines": downregulation, upregulation, and primitive mechanisms of information retrieval. In the text that follows, we borrow heavily from the human factors work of James Reason.

**Downregulation.** We call this habit formation, skill development, and "good hands." Most activities of life, and certainly those of a skillful surgeon, need to become automatic. If we had to think about every motion involved in performing an operation, the task would become nearly impossible to accomplish accurately. It would not be executed smoothly and would be error prone. It is hard to quantify surgical skill. It starts with a baseline of necessary sensory‑motor eye‑hand coordination that is likely innate. It becomes optimised by aggregation of correct "moves" and steps as well as by observation. It is refined by repetition of correct actions, implying identification of satisfactory and unsatisfactory immediate results (feedback). Then comes individual reflection and codification of moves and steps by hard analysis. Finally, motor skills are mastered by a synthesis of cognition and motor memory. The resulting automaticity and reproducibility of a skillful surgeon make a complex operation appear effortless, graceful, and flawless. However, automaticity renders errors inevitable.

*Skill‑based errors* occur in the setting of routine activity. They occur when attention is diverted (distraction or preoccupation) or when a situation changes and is not detected in a timely fashion. They also occur as a result of overattention. Skill‑based errors are ones that only skilled experts can make—beautiful execution of the wrong thing (slip) or failure to follow a complex sequence of actions (lapse). Skill‑based errors tend to be easily detected and corrected.

*Rule‑based errors* occur during routine problem‑solving activities. Goals of training programmes are to produce not only skillful surgeons but also expert problem solvers. Indeed, an expert may be defined as an individual with a wide repertoire of stored problem‑solving plans or rules. Inevitable errors that occur take the form of either inappropriate application of a good rule or application of a bad rule.

**Upregulation.** Our mind focuses conscious attention on the problem or activity with which we are confronted and filters out distracting information. The price we pay for this powerful ability is susceptibility to both data loss and information overload. This aspect of the mind is also what permits distractions or preoccupations to capture the attention of the surgeon, who would otherwise be focused on the routine tasks at hand. In problem solving, there may be inappropriate matching of the patient’s actual condition to routine rules for a somewhat different set of circumstances. Some of the mismatches undoubtedly result from the display of vast quantities of undigested monitoring information about the patient’s condition. Errors of information overload need to be addressed by more intelligent computer‑based assimilation and display of data.

**Primitive Mechanisms of Information Storage and Retrieval.** The mind seems to possess an unlimited capacity for information storage and a blinding speed of information retrieval unparalleled as yet by computers. In computer systems, there is often a trade‑off between storage capacity and speed of retrieval. Not so for the mind. The brain achieves this, apparently, not by storing facts but by storing models and theories—abstractions about these facts. Furthermore, the information is stored in finite packets along with other, often unrelated, information. (Many people use the latter phenomenon to recall names by associating them with more familiar objects, such as animals.) The implications for error are that our mental image may diverge importantly from reality.

The mind’s search strategy for information achieves remarkable speed by having apparently just two tools for fetching information. First, it matches patterns. Opportunity for error arises because our interpretation of the present and anticipation of the future are shaped by patterns or regularities of the past. Second, if pattern matching produces multiple items, it prioritises these by choosing the one that has been retrieved most often. This mechanism gives rise to rule‑based errors in a less frequently occurring setting.

**Conscious Mind.** When automatic skills and stored rules are of no help, we must consciously think. Unlike the automaticity we just described, the conscious mind is of limited capacity but possesses powerful computational and reasoning tools, all those attributes we ascribe to the thought process. However, it is a serial, slow, and laborious process that gives rise to *knowledge‑based errors*. Unlike stereotypical skill‑ and rule‑based errors, knowledge‑based errors are less predictable. Furthermore, there are far fewer opportunities in life for "thinking" than for automatic processes, and therefore the ratio of errors to opportunity is higher. Errors take the form of confirmation bias, causality versus association, inappropriate selectivity, overconfidence, and difficulties in assimilating temporal processes.

The unusual ordering of material presented in the clinical chapters of this book was chosen by its original authors to provide a framework for thinking with the conscious mind about heart disease and its surgical therapy that would assist in preventing knowledge‑based errors. For example, an algorithm (protocol, recipe) for successfully managing mitral valve regurgitation is based on knowledge of morphology, aetiology, and detailed mechanisms of the regurgitation; preoperative clinical, physiologic, and imaging findings; natural history of the disease if left untreated; technical details of the operation; postoperative management; both early and long‑term results of operation; and from all these considerations, the indications for operation and type of operation. Lack of adequate knowledge results in inappropriate use of a robot for mitral valve repair, too many mitral valve replacements, or suboptimal timing of operation.

</div></details>

<details class="med-details"><summary>
  
##### Reducing Errors</summary><div class="details-content">

We have presented this cognitive model in part because it suggests constructive steps for reducing human error and, thus, surgical failure.

It affirms the necessity for intense apprentice‑type training that leads to automatisation of surgical skills and problem‑solving rules. It equally suggests the value of simulators for acquiring such skills. It supports creating an environment that minimises or masks potential distractions. It supports a system that discovers errors and allows recovery from them before injury occurs. This requires a well‑trained team in which each individual is familiar with the operative protocol and is alert to any departures from it. In this regard, de Leval and colleagues’ findings are sobering. Major errors were often recognised and corrected by the surgical team, but minor ones were not, and a higher number of minor errors was strongly associated with adverse outcomes. It is also sobering that self‑reporting of intraoperative errors was of no value. Must there be a human factors professional at the elbow of every surgeon?

James Reason suggested that "cognitive prostheses" may be of value, some of which are being advocated in medicine. For example, there is much that computers can do to reduce medication errors. A prime target is knowledge‑based errors. Reducing these errors may be achievable through computer‑based artificial intelligence, and novel modes of information assembly, processing, and display for processing by the human mind. Finally, if latent errors are the root cause of many active errors, analysis and correction at the system level will be required. A cardiac surgery programme may fail, for example, from latent errors traceable to management of the blood bank, postoperative care practices, ventilation systems, and even complex administrative decisions at the level of hospitals, universities with which they may be associated, and national health system policies and regulations within which they operate.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Lack of Scientific Progress</summary><div class="details-content">

A practical consequence of categorising surgical failures into two causes is that they fit the programmatic paradigm of "research and development": discovery on the one hand and application of knowledge to prevent failures on the other. The quest to reduce injury from medical errors that has just been described is what we might term "development." Thus, lack of scientific progress is gradually reduced by generating new knowledge (research), and human error is reduced in frequency and consequences by implementing available knowledge (development), a process as vital in cardiac surgery as it is in the transportation and manufacturing sectors.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Philosophy</summary><div class="details-content">

Clinical research in cardiac surgery consists largely of patient‑oriented investigations motivated by a quest for new knowledge to improve surgical results—that is, to increase survival early and in the long term; to reduce surgical complications; to enhance quality of life; and to extend appropriate operations to more patients, such as high‑risk subsets. This inferential activity, aimed at improving clinical results, is in contrast to pure description of experiences. Its motivation also contrasts with those aspects of "outcomes assessment" motivated by regulation or punishment, institutional promotion or protection, quality assessment by outlier identification, and negative aspects of cost justification or containment. These coexisting motivations have stimulated us to identify, articulate, and contrast philosophies that underlie serious clinical research. It is these philosophies that inform our approach to analysis of clinical experiences.

<details class="med-details"><summary>
  
#### Deduction Versus Induction</summary><div class="details-content">

"Let the data speak for themselves."

Arguably, Sir Isaac Newton’s greatest contribution to science was a novel intellectual tool: a method for investigating the nature of natural phenomena. His contemporaries considered his method not only a powerful scientific ally, but also a new way of philosophising applicable to many other areas of human knowledge. His method had two strictly ordered aspects that for the first time were systematically expressed: a first, and extensive, phase of data *analysis* whereby observations of some small portion of a natural phenomenon are examined and dissected, followed by a second, less emphasised, phase of *synthesis* whereby possible causes are inferred and a small portion of nature revealed from the observations and analyses. This was the beginning of the *inductive method* in science: valuing first and foremost the observations made about a phenomenon, then "letting the data speak for themselves" in suggesting possible natural mechanisms.

This represented the antithesis of the *deductive method* of investigation that had been successful in the development of mathematics and logic (the basis for ontology‑based artificial intelligence reasoning today). The deductive method begins with what is believed to be the nature of the universe (referred to by Newton as "hypothesis"), from which logical predictions are deduced and tested against observations. If the observations deviate from logic, the data are suspect, not the principles behind the deductions. The data do not speak for themselves. Newton realised that it was impossible to have complete knowledge of the universe. Therefore, a new methodology was necessary to examine just portions of nature, with less emphasis on synthesising the whole. The idea was heralded as liberating in nearly all fields of science.

As the 18th century unfolded, the new method rapidly divided such diverse fields as religion into those based on deduction (fundamentalism) and those based on induction (liberalism). This philosophical dichotomy continues to shape the scientific, social, economic, and political climate of the 21st century.

</div></details>

<details class="med-details"><summary>
  
#### Determinism Versus Empiricism</summary><div class="details-content">

Determinism is the philosophy that everything—events, acts, diseases, decisions—is an inevitable consequence of causal antecedents. If disease and patients’ response to disease and its treatment were clearly deterministic and inferences deductive, there would be little need to analyse clinical data to discover their general patterns. Great strides are being made in linking causal mechanisms to predictable clinical response (see Section VII). Yet many areas of cardiovascular medicine remain nondeterministic and incompletely understood. In particular, the relation between a specific patient’s response to complex therapy such as a cardiac operation and known mechanisms of disease appears to be predictable only in a probabilistic sense. For these patients, therapy is based on empirical recognition of general patterns of disease progression and observed response to therapy.

Generating new knowledge from clinical experiences consists, then, of inductive inference about the nature of disease and its treatment from analyses of ongoing empirical observations of clinical experience that take into account variability, uncertainty, and relationships among surrogate variables for causal mechanisms. Indeed, human error and its opposite—success—may be thought of as human performance variability.

</div></details>

<details class="med-details"><summary>
  
#### Collectivism Versus Individualism</summary><div class="details-content">

To better convey how new knowledge is acquired from observing clinical experiences, we look back to the 17th century to encounter the proverbial dichotomy between collectivism and individualism, so‑called lumpers and splitters or forests and trees.

In 1603, during one of its worst plague epidemics, the City of London began prospective collection of weekly records of christenings and burials. In modern language, this was an administrative registry (see Box 7.1). Those "who constantly took in the weekly bills of mortality made little use of them, than to look at the foot, how the burials increased or decreased; and among the casualties, what has happened rare, and extraordinary, in the week current," complained John Graunt. Unlike those who stopped at counting and relating anecdotal information, Graunt believed the data could be analysed in a way that would yield useful inferences about the nature and possible control of the plague.

His ultimate success might be attributed in part to his being an investigator at the interface of disciplines. By profession he was a haberdasher, so Graunt translated merchandise inventory dynamics into terms of human population dynamics. He described the birth rate (rate of goods received) and death rate (rate of goods sold); he then calculated the population currently alive (the inventory).

Graunt then made a giant intellectual leap. In modern terms, he assumed that every person (any item on the shelf) was interchangeable with any other (collectivism). By assuming—no matter how politically, sociologically, or factually incorrect—that people are interchangeable, he achieved an understanding of the general nature of the birth‑life‑death process in the absence of dealing with specific named individuals (individualism). He attempted to discover, as it were, the general nature of the forest at the expense of ignoring characteristics of the individual trees.

Graunt then identified general factors associated with variability of these rates (risk factors, in modern terminology; see "Multivariable Analysis" in Section IV). From the City of London Bills of Mortality, he found that the death rate was higher when ships from foreign ports docked in the more densely populated areas of the city, and in households harbouring domestic animals. Based on these observations, he made inferences about the nature of the plague—what it was and what it was not—and formulated recommendations for stopping its spread: avoid night air brought in from foreign ships (which we now know was not night air but rats), flee to the country (social distancing), separate people from animal vectors, and quarantine infected individuals. Nevertheless, they were effective in stopping the plague for 200 years until its cause and mechanism of spread were identified.

Lessons based on this therapeutic triumph of clinical investigation conducted 300 years ago include the following: (1) empirical identification of patterns of disease can suggest fruitful directions for research and eliminate some hypothesised causal mechanisms, (2) recommendations based on empirical observations may be effective until causal mechanisms and treatments are discovered, and (3) new knowledge is often generated by overview (synthesis), as well as by study of the fate of individual patients.

When generating new knowledge about the nature of heart disease and its treatment, it is important both to examine groups of patients (the forest) and to investigate individual therapeutic successes and failures (the trees). This is similar to Heisenberg’s uncertainty principle in chemistry, thermodynamics, and mechanics, in which physical matter and energy can be thought of as discrete particles on the microhierarchical plane (individualism, splitting, trees), and as waves (field theory) on the macrohierarchical plane (collectivism, lumping, forests). Both views give valuable insights into nature, but they cannot be viewed simultaneously. Statistical methods emphasising optimum discrimination for identifying individual patients at risk tend to apply to the former, whereas those emphasising probabilities and general inferences tend to apply to the latter.

</div></details>

<details class="med-details"><summary>
  
#### Continuity Versus Discontinuity in Nature</summary><div class="details-content">

To discover relationships between outcomes and items that differ in value from patient to patient (called *variables*), a challenge immediately arises: Many of the variables related to outcome are measured either on an ordered clinical scale (ordinal variables), such as New York Heart Association functional class, or on a more or less granular and unlimited scale (continuous variables), such as age. Three hundred years after Graunt, the Framingham Heart Disease Epidemiology Study investigators were faced with this frustrating problem. Many of the variables associated with development of heart disease were continuously distributed ones, such as age, blood pressure, and cholesterol level. To examine the relationship of such variables to development of heart disease, it was then accepted practice to categorise continuous variables coarsely for constructing cross‑tabulation tables. Valuable information was lost this way. Investigators recognised that a 59‑year‑old’s risk of developing heart disease was more closely related to that of a 60‑year‑old’s than to that of the group of patients in the sixth versus seventh decade of life. They therefore insisted on examining the entire spectrum of continuous variables rather than subclassifying the information.

What they embraced is a key concept in the history of ideas namely, *continuity in nature*. The idea has emerged in mathematics, science, philosophy, history, and theology. In our view, the common practice of stratifying age and other continuous variables into a few discrete categories is lamentable because it loses the power of continuity (some statisticians call this "borrowing power"). Focus on small, presumed homogeneous groups of patients also loses the power inherent in a wide spectrum of related but heterogeneous cases. After all, any trend observed over an ever‑narrower framework looks more and more like no trend at all! Like the Framingham investigators, we therefore embrace continuity in nature unless it can be demonstrated that doing so is not valid, useful, or beneficial. (Machine learning methods that use splitting rules may seem to stumble at this point, but repetition of analyses over hundreds or thousands of bootstrapped data samples followed by averaging achieves a close approximation to continuity in nature [see Section IV].)

</div></details>

<details class="med-details"><summary>
  
#### Single Versus Multiple Dimensionality</summary><div class="details-content">

The second problem the Framingham investigators addressed was the need to consider multiple variables simultaneously. Univariable (one variable at a time) statistics are attractive because they are simple to understand. However, most clinical problems are multifactorial. At the same time, clinical data contain enormous redundancies that somehow need to be taken into account (e.g., height, weight, body surface area, and body mass index are highly correlated and relate to the conceptual variable "body size").

Cornfield came to the rescue of the Framingham investigators with a new methodology called *multivariable logistic regression* (see "Logistic Regression Analysis" in Section IV). It permitted multiple factors to be examined simultaneously, took into account redundancy of information among variables (collinearity), and identified a parsimonious set of variables for which the investigators coined the term "factors of risk" or *risk factors* (see "Parsimony Versus Complexity" later in this section and "Multivariable Analysis" in Section IV).

Various forms of multivariable analysis, in addition to logistic regression analysis, are available to clinical investigators. Their common theme is to identify patterns of relationships between outcome and a number of variables considered simultaneously. These are not cause–effect relations, but associations with underlying causal mechanisms (see discussion of surrogates under "Multivariable Analyses" in Section IV). The relationships that are found may well be spurious, fortuitous, hard to interpret, and confusing because of the degree of correlation among variables. For example, women may be at a higher risk of mortality after certain cardiac procedures, but female sex may not be a "risk factor" but rather a marker for more advanced disease because other factors, such as body mass index, may be the more general variable related to risk, whether in women or men. In this instance, it is simultaneously true that (1) being female is not per se a risk factor, but (2) women are at higher risk by virtue of the fact that, on average, they are smaller than men.

This means that a close collaboration must exist between statistical experts and surgeons, particularly in organising variables for analysis and interpreting findings from analyses.

</div></details>

<details class="med-details"><summary>
  
#### Linearity Versus Nonlinearity</summary><div class="details-content">

Risk factor methodology introduced another complexity besides increased dimensionality. The logistic equation is a symmetric S‑shaped curve that expresses the relationship between a scale of risk, called *logit units*, and a corresponding scale of absolute probability of experiencing an event (Fig. 7.1). Because the relationship is not linear, it is not possible to simply add up scores for individual variables and come up with a probability of an event.

![](_page_10_Figure_6.jpeg)

**FIGURE 7.1** Fundamental logistic relation of a scale of risk (logit units) to absolute probability of an event. (A) Logistic relation, shown when risk factors are translated into logit units, is depicted along horizontal axis, and probability of the outcome event along vertical axis. Logistic equation is inserted, where *exp* is the natural exponential function. (B) Relation between cardiac index and probability of hospital death in cardiac failure determined by logistic regression analysis of data obtained in intensive care unit (UAB). Cardiac index in L · min⁻¹ · m⁻² is plotted along the horizontal axis. *z* describes the transformation of cardiac index to logit units, where *Ln* is the natural logarithm. If data were replotted with transformation to logit units along the horizontal axis, depiction would reflect *some portion* of the curve in *A*.

The nonlinear relationship between risk factors and probability of outcome makes medical sense. Imagine a risk factor with a logit unit coefficient of 1.0 (representing an odds ratio of 2.7; Box 7.3 and see Fig. 7.1). If all other things position a patient far to the left on the logit scale, a 1‑logit‑unit increase in risk results in a trivial increase in the probability of experiencing an event. But as other factors move a patient closer to the center of the scale (0 logit units, corresponding to a 50% probability of an event), a 1‑logit‑unit increase in risk makes a huge difference. This is consistent with the medical perception that some patients experiencing the same disease, trauma, or complication respond quite differently. Some are medically robust because they are far to the left (low‑risk region) on the logit curve before the event occurred. Others are medically fragile because their age or comorbid conditions place them close to the center of the logit curve. For the latter, a 1‑logit‑unit increase in risk can be "the straw that breaks the camel’s back." It is this kind of relation that makes it hard to demonstrate, for example, the benefit of bilateral internal thoracic artery grafting in relatively young adults followed for even a couple of decades, but easy in patients who have other risk factors. The same has been demonstrated for risk of operation in patients with aortic regurgitation and low ejection fraction.

This type of sensible, nonlinear medical relation makes us want to deal with absolute risk rather than relative risk or risk ratios (see Box 7.3). Relative risk is simply a translation of the scale of risk, without regard to location on that scale. Absolute risk integrates this with the totality of other risk factors.

<details class="med-details"><summary>

#### BOX 7.3 Expressions of Relative Risk</summary><div class="details-content">

**Proportion**

Consider two groups of patients, A and B. Mortality in group A is 10 of 40 patients (25%); in B, it is 5 of 50 patients (10%). For the sake of illustrating the various ways these proportions (see later Box 7.11), 0.25 and 0.10, can be expressed relative to one another, designate *a* as the number of deaths (10) in A and *b* as the number alive (30). The total in A is *a*+*b* (40) patients, *n*<sub>A</sub>. Designate *c* as the number of deaths (5) in B and *d* as the number alive (45). The total in B is *c*+*d* (50) patients, *n*<sub>B</sub>. Designate *P*<sub>A</sub> as the proportion of deaths in A, *a*/(*a*+*b*) or *a*/*n*<sub>A</sub>, and *P*<sub>B</sub> as the proportion in B, *c*/(*c*+*d*) or *c*/*n*<sub>B</sub>.

**Relative Risk (Risk Ratio)**

Relative risk is the ratio of two probabilities. In the previous example, relative risk of A compared with B is *P*<sub>A</sub>/*P*<sub>B</sub> = [*a*/(*a*+*b*)]/[*c*/(*c*+*d*)] = 0.25/0.10 or 2.5. Equivalently, one could reverse the proportions, *P*<sub>B</sub>/*P*<sub>A</sub> = 0.10/0.25 = 0.4. If *P*<sub>A</sub> were to exactly equal *P*<sub>B</sub>, relative risk would be unity (1.0). Another way to express relative risk when comparing two treatments is by *relative risk reduction*, which for relative risks greater than 1 is 1 minus relative risk. This is mathematically identical to dividing the absolute difference in proportions by the higher of the two: (*P*<sub>B</sub> – *P*<sub>A</sub>)/*P*<sub>B</sub>.

**Odds and Gambler’s Odds**

The odds of an event is the number of events divided by non‑events. In the previous example, the odds of death in A is *a*/*b* = 10/30 = 0.33; in B, it is *c*/*d* = 5/45 = 0.11. The mathematical interrelation of probability (*P*) of an event and odds (*O*) are these: *O* = *P*/(1 – *P*) and *P* = *O*/(1 + *O*). A probability of 0.1 is an odds of 0.11, but a probability of 0.5 is an odds of 1, of 0.8 an odds of 4, of 0.9 an odds of 9, and of 1.0 an odds of infinity. Often, it is interesting to examine the odds of the complement (1 – *P*) of a proportion, (1 – *P*)/*P*, which is *gambler’s odds*. Thus, a *P* value of .05 is equivalent to an odds of .053 and a gambler’s odds of 19:1. A *P* value of .01 has a gambler’s odds of 99:1, and a *P* value of 2 has a gambler’s odds of 4:1.

**Odds Ratio and Log Odds**

The odds ratio is the ratio of odds. In the previous example, the odds ratio of A compared with B is (*a*/*b*)/(*c*/*d*) = *ad*/*bc*, which is either (10/30)/(5/45) = 3 or (10·45)/(30·5) = 3.

Note that the logistic equation is Ln[*P*/(1 – *P*)]. For A, *P*<sub>A</sub>/(1 – *P*<sub>A</sub>) is *a*/*b*, the odds of A. Thus, Ln[*P*/(1 – *P*)] is *log odds.* Logistic regression can then be thought of as an analysis of log odds. Exponentiation of a logistic coefficient for a dichotomous (yes/no) risk factor from such an analysis re‑expresses it in terms of the odds ratio for those with versus those without the risk factor (see later Box 7.17).

When the probability of an event is low, say less than 10%, *relative risk (RR)* and the *odds ratio (OR)* are numerically nearly the same. The mathematical relation is *RR* = [(1 – *P*<sub>A</sub>/(1 – *P*<sub>B</sub>)]·*OR*. In the previous example, the relative risk was 2.5, but the odds ratio was 3, and the disparity increases as the probability of event increases to 50%.

Relative risk is easier for most physicians to grasp because it is simply the ratio of proportions. It is unusual to encounter a physician without an epidemiology background who understands the odds ratio.

**Expressing Relative Risk and Odds Ratios**

Both relative risk and odds ratios are expressed on a scale of 0 to infinity. However, all odds ratios less than 1 are squeezed into the range 0 to 1, in contrast to those greater than 1, which are spread out from 1 to infinity. It is thus difficult to visualise that an odds ratio of 4 is equivalent to one of 0.25 if a linear scale is used. We recommend that a scale be chosen to express these quantities with equal distance above and below 1.0. This can be achieved, for example, by using a logarithmic or logit presentation scale.

**Risk Difference (Absolute Risk Reduction) and Number to Treat**

The risk difference is the difference between two proportions. In the previous example, *P*<sub>A</sub> – *P*<sub>B</sub> is the risk difference. In many situations, risk difference is more meaningful than risk ratios (either relative risk or the odds ratio). Consider a low probability situation with a risk of 0.5% and another with a risk of 1%. Relative risk is 2. Yet risk difference is only 0.5%. In contrast, consider a higher‑probability situation in which one probability is 50% and the other 25%. Relative risk is still 2, but risk difference is 25%. These represent the proverbial statement that "twice nothing is still nothing." They reflect the relation between the logit scale and absolute probability (see Fig. 7.1A), recalling that the logit scale is one of log odds.

An alternative way to express a difference in probabilities when the difference is arranged to be positive (e.g., *P*<sub>A</sub> – *P*<sub>B</sub>), and thus expresses absolute risk reduction, is as the inverse, 1/(*P*<sub>A</sub> – *P*<sub>B</sub>). This expression of absolute risk reduction is called *number to treat.* It is useful in many comparisons in which it is meaningful to answer the question, "How many patients must be treated by A (compared with B) to prevent one event (death)?" In our example, absolute risk reduction is 25% – 10% = 15%, and number needed to treat is 1/0.15 = 6.7. Number needed to treat is particularly valuable for thinking about risks and benefits of different treatment strategies. If it is large, one may question the risk of switching treatments, but if it is small, the benefit of doing so becomes more compelling.

**Hazard Ratio**

In time‑related analyses, it is convenient to express the model of risk factors in terms of a log‑linear function (see later Box 7.17 and "Cox Proportional Hazards Regression" in Section IV): Ln(λ*t*) = Ln(λ*t*)<sup>0</sup> + β<sub>1</sub>*x*<sub>1</sub> + ... + β<sub>k</sub>*x*<sub>k</sub>, where Ln is the natural logarithm and λ*t* is the hazard function. The regression coefficients, β, for a dichotomous risk factor thus represent the logarithm of the ratio of hazard functions. Hazard ratios, as well as relative risk and the odds ratio, can be misleading in magnitude (large ratios, small risk differences) in some settings. Hazard comparisons, just like survival comparisons, often are more meaningfully and simply expressed as differences.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Raw Data Versus Models of Data</summary><div class="details-content">

Importantly, the Framingham investigators did not stop at risk factor identification. Because logistic regression generates an equation based on raw data, it can be solved for a given set of values for risk factors. The investigators devised a cardboard slide rule for use by laypersons to determine their predicted risk of developing heart disease within the next 5 years.

Whenever possible and appropriate, results of clinical data analyses should be expressed in the form of mathematical models that become equations. These can be solved after "plugging in" values for an individual patient’s risk factors to estimate absolute risk and its confidence limits. Equations are compact and portable, so that with the ubiquitous computer, they can be used to advise individual patients (see "Knowledge for Clinical Decision‑Making" in Section V).

It can be argued that equations do not represent raw data. But in most cases, are we really interested in raw data? Archaeologists are interested in the past, but the objective of most clinical investigation is not to predict the past, but to draw inferences based on observations of the past that can be used in treating future patients. Thus, one might argue that equations derived from raw data about the past are more useful than raw, undigested data.

But what about use of machine learning algorithms that may excel at prediction, but may be opaque? These may not be as compact in form as an equation, but we would include them in this notion of models of data (see "Machine Learning for Multivariable Analysis" in Section IV).

</div></details>

<details class="med-details"><summary>
  
#### Nihilism Versus Predictability</summary><div class="details-content">

One of the important advantages of generating equations and algorithms is that they can be used to predict future results for either groups of patients or individual patients. We recognise that when speaking of individual patients, we are referring to a prediction concerning the probability of events for that patient; we generally cannot predict exactly who will experience an event or when an event will occur. Indeed, whenever we apply what we have learned from clinical experience to a new patient, we are predicting. This motivated us to develop statistical tools that yield patient‑specific estimates of absolute risk as an integral byproduct. These were intended to be used for formal or informal comparison of predicted risks and benefits among alternative therapeutic strategies (see "Clinical Studies with Nonrandomly Assigned Treatment" later in this section).

Of course, the nihilist will say, "You can’t predict." However, in a prospective study of 3720 patients in Leuven, Belgium, we generated evidence that predictions from multivariable equations are generally reliable (see details under "Residual Risk" in Section V). We compared observed survival, obtained at subsequent follow‑up, with prospectively predicted survival. The correspondence was excellent in 92% of patients. However, it was poor in the rest (Fig. 7.2 and Table 7.2). A time‑related analysis of residual risk identified circumstances leading to poor prediction and revealed the limitations of quantitative predictions: (1) when patients have important rare conditions that have not been considered in the analysis, risk is underestimated; (2) when large data sets rich in clinically relevant variables are the basis for prediction equations, prediction should be suspect in only a small proportion of patients with unaccounted‑for conditions. Except for these limitations, multivariable equations and algorithms appear capable of adjusting well for different case mixes.

![](_page_12_Figure_10.jpeg)

**FIGURE 7.2** Predicted and observed survival after coronary artery bypass grafting, illustrating both ability to predict from multivariable equations and pitfalls in doing so. (A) Observed overall survival among prospectively studied patients (*n* = 3720) compared with predicted survival. Each *circle* represents an observed death, positioned at time of death along horizontal axis, and according to Kaplan‑Meier life‑table method along vertical axis; *vertical bars* are 70% confidence limits (CL). *Solid line* and its 70% CLs represent predicted survival. Notice systematic underestimation of survival. Number of predicted deaths = 273 (5.7%) and observed deaths = 243 (6.5%); *P* = .03. (B) Patients stratified by presence *(open squares)* and absence *(circles)* of rare unaccounted‑for risk factors (malignancy, preoperative dialysis, atrial fibrillation, ventricular tachycardia, or aortic regurgitation). Otherwise, format is as in *A.* Note excellent correspondence of predicted survival to observed survival in patients without these factors, and substantial underestimation of risk in patients with them.

<details class="med-details"><summary>

#### TABLE 7.2 Predicted and Observed Number of Deaths after Primary Isolated Coronary Artery Bypass Grafting</summary><div class="details-content">

|              |      | TOTAL DEATHS |     |           |     |        |  |
|--------------|------|--------------|-----|-----------|-----|--------|--|
| Rare Risk    |      | Observed     |     | Predicted |     |        |  |
| Factors      | n    | No.          | %   | No.       | %   | P      |  |
| No           | 3428 | 186          | 5.4 | 191       | 5.6 | .7     |  |
| Yes          | 292  | 57           | 20  | 22        | 7.5 | <.0001 |  |

###### Table illustrates both the ability to predict from multivariable equations and the pitfalls of doing so. Data from Sergeant and colleagues, July 1987 to 1992; *n* = 3720.

</div></details>

The amount of data necessary to generate new knowledge is much larger than that needed to use the knowledge in a predictive way. To generate new knowledge, data should be rich both in relevant variables and in variables eventually found not to be relevant. But for prediction, one needs to collect only those variables used in the equation or algorithm unless one is interested in investigating reasons for prediction error.

</div></details>

<details class="med-details"><summary>
  
#### Blunt Instruments Versus Fine Dissecting Instruments</summary><div class="details-content">

A related use of predictive equations and algorithms is in comparing alternative therapies. Some would argue that the only believable comparisons are those based on randomised trials, and that documented clinical experiences are irrelevant and misleading. However, many randomised trials are homogeneous and focused and are analysed by blunt instruments, such as the average treatment effect. On the other hand, real‑world clinical experience involves patient selection that is difficult to quantify, may be a single‑institution experience with limited generality except to other institutions of the same variety, is not formalised unless there is prospective gathering of clinical information into registries, and is less disciplined. Nevertheless, analyses of clinical experiences can yield a fine dissecting instrument in the form of equations or algorithms that are useful across the spectrum of heart disease for comparing alternative treatments and therefore for advising patients (see "Clinical Studies with Nonrandomly Assigned Treatment" later in this section).

</div></details>

<details class="med-details"><summary>
  
#### Parsimony Versus Complexity</summary><div class="details-content">

Although clinical data analysis methods and results may seem complex at times, an important philosophy behind such analysis is parsimony (simplicity). We have discussed two reasons for this previously. One is that clinical data contain inherent redundancy, and one purpose of multivariable analysis is to identify that redundancy and thus simplify dimensionality. A second reason is that assimilation of new knowledge is incomplete unless one can extract the essence of the information. Thus, clinical inferences are often even more digested and simpler than the multivariable analyses.

We must admit that simplicity is a virtue based on philosophical, not scientific, grounds. The concept was introduced by William of Ocken in the early 14th century as a concept of beauty—beauty of ideas and theories. Nevertheless, it is pervasive in science.

There are dangers associated with parsimony and beauty, however. The human brain appears to assimilate information in the form of models, not actual data (see "Human Error" earlier in this section). Thus, new ideas, innovations, breakthroughs, and new interpretations of the same data often hinge on discarding past paradigms ("thinking outside the box"). There are other dangers in striving for simplicity. We may miss important relations because our threshold for detecting them is too high. We may reduce complex clinical questions to simple but inadequate questions that we know how to answer.

For analyses whose primary purpose is comparison, it is important, when sufficient data are available (Box 7.4), to account for "everything known." In this way the residual variability attributed to the comparison is most likely to be correct.

<details class="med-details"><summary>

#### BOX 7.4 Sufficient Data</summary><div class="details-content">

A common misconception is that the larger the study group (called the *sample* because it is a sample of all patients past, present, and future [see later Box 7.11]), the larger the amount of data available for analysis. However, in studies of outcome events, the effective sample size for analysis is proportional to the *number of events* that have occurred, not the size of the study group. Thus, a study of 200 patients experiencing 10 events has an *effective sample size* of 10, not 200.

Ability to detect differences in outcome is coupled with effective sample size. A statistical quantification of the ability to detect a difference is the *power* of a study. A few aspects of power that affect multivariable analyses of events are mentioned.

Many variables in a data set represent subgroups of patients, and some of them may be few in number. If a single patient in a small subgroup experiences an event, multivariable analysis may identify that subgroup as one at high risk, when in fact the variable represents only a specific patient, not a common denominator of risk (see "Incremental Risk Factor Concept" in Section IV). The purpose of a multivariable analysis is to identify general risk factors, not individual patients experiencing events!

Thus, more than one event needs to be associated with every variable considered in the analysis. The rule of thumb in multivariable analysis is that the ratio of events to risk factors identified should be about 10:1. For us, *sufficient data* means at least five events associated with every variable. This strategy could result in identifying up to one factor per five events. We get nervous at this extreme, but in small studies we are sometimes close to that ratio. However, bear in mind that variables may be highly correlated and subgroups overlap, so in the course of analysis, the number of unexplained events in a subgroup may effectively fall below five, which is *insufficient data.*

Thus, there is both an upper limit of risk factors that can be identified by multivariable analysis and a lower limit of events to allow a variable to be considered in the analysis. Sufficient data implies having enough events available to test for all relevant risk factors.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### New Knowledge Versus Selling Shoes</summary><div class="details-content">

The philosophies described so far focus on the challenge of generating new knowledge from clinical experiences. However, other uses are made of clinical data.

Clinical data may be used as a form of advertising ("selling shoes"). Innovation stems less from purposefulness than from aesthetically motivated curiosity, frustration with the status quo, sheer genius, fortuitous timing, favourable circumstances, and keen intuition. With innovation comes the need to promote. However, promotional records of achievement should not be confused with serious study of safety, clinical effectiveness, and long‑range appropriateness.

Closely related to promotion and innovation is proprietary information related to its commercialisation. At present, the philosophies of scientific investigation and business are irreconcilable. One thrives on open dissemination of information, the other on proprietary information offering a competitive advantage. In an era of dwindling public resources for research and increasing commercial funding, we may be seeing increasing conflict between open scientific inquiry and commercial interests.

</div></details>

<details class="med-details"><summary>
  
#### Past Versus Future</summary><div class="details-content">

Is there, then, a future for quantitative analysis of the results of therapy, as there was in the developmental phase of cardiac surgery? Kirklin and Barratt‑Boyes wrote in their preface to the second edition of this book:

*The second edition reflects data and outcomes from an era of largely unregulated medical care, and similar data may be impossible to gather and freely analyse when care is largely regulated. This is not intended as an opinion as to the advantages or disadvantages of regulation of healthcare; indeed, as regulation proceeds, the data in this book, along with other data, should be helpful in establishing priorities and guidelines.*

As already noted in all editions of this book, the last section of each clinical chapter is indications for operation. In the future, regulations of policymakers may need to be added to other variables determining indications, including patient preference.

On the horizon is the promise that medicine will become decreasingly empirical and more deterministic. However, as long as treatment of heart disease requires complex procedures, and as long as most are palliative in the life history of chronic disease, there will be a need to understand more fully the nature of the disease, its treatment, and its optimal management. This will require adoption of approaches to data that are inescapably philosophical.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Clinical Research</summary><div class="details-content">

In response to the American Medical Association’s Resolution 309 (I‑98), a Clinical Research Summit and subsequently an ongoing Clinical Research Roundtable of the Academy of Medicine in the United States have sought to define and reenergise clinical research. The most important aspects of the definition of clinical research are that (1) it is but one component of medical and health research aimed at producing new knowledge; (2) the knowledge produced should be valuable for understanding the nature of disease, its treatment, and prevention; and (3) it embraces a wide spectrum of types of research. Here we highlight broad examples of that spectrum commonly found in cardiac surgery publications.

<details class="med-details"><summary>
  
#### Descriptive Studies: Techniques, Case Reports, and Case Series</summary><div class="details-content">

The majority of publications in cardiac surgery clinical research fall into the general category of descriptive studies.

**Techniques.** Every aspect of cardiac surgery has been described in thousands of publications about technical details. These may be techniques of preoperative evaluation, such as imaging, preoperative and intraoperative aspects of anaesthesia, technical details of operations, details of postoperative management, and patient recovery. Many describe new devices and their properties and even failures, and some even describe novel methods of analysis.

The common denominator of these publications is transparent disclosure of techniques for their use by all in the field. Advancements by one surgeon or group that are not shared is a loss to the entire field of cardiac surgery.

**Case Reports.** The impact factor of most journals is not enhanced by individual case reports or very short case series because they are not commonly cited. However, particularly in congenital heart disease, these reports often advance the field. They may initially appear as oddities, but may later fit into gaps of knowledge, or their successful repair may advance the field in unexpected ways.

**Case Series.** Whether a short case series, a thousand‑case series, or a national case series or hundreds of thousands of more cases, what are often classified as "just" descriptive studies have advanced the field of cardiac surgery tremendously. Haemodynamics of prosthetic valves, experience with the radial artery as a conduit for coronary bypass grafting, national experience with ablation for atrial fibrillation, Medicare costs, heart failure rehospitalisations after certain operations, and quality of life after aneurysm repair are all examples of descriptive case series. In "Technique for Successful Clinical Research" that follows, we will describe how to design effective descriptive studies that answer important relevant questions that are hypothesis driven and hypothesis generating.

</div></details>

<details class="med-details"><summary>
  
#### Clinical Studies with Nonrandomly Assigned Treatment</summary><div class="details-content">

**Multivariable Analyses.** In contrast to studies that describe a series of cases are observational studies that compare outcomes of different treatments. The fundamental objection to using observational clinical data for comparing treatments is that many uncontrolled variables affect outcome. Thus, attributing outcome differences to just one factor—the alternative treatment—stretches credibility. Even a cursory glance at the characteristics of patients treated one way versus another usually reveals that they are different groups. This should be expected because treatment has been selected by experts who believe they know what is best for a given patient. The accusation that one is comparing apples and oranges is well justified!

Indeed, a consistent message since Graunt is that risk factors for outcomes from analyses of clinical experience (and these include treatment differences) are *associations*, not *causal relations*. Multivariable adjustment for differences in *outcome* is valuable, and methods for multivariable analysis will be detailed in Section IV under "Multivariable Analysis." It must be pointed out, however, that if alternative therapies are being analysed by multivariable analysis, these analyses are not guaranteed to be effective in eliminating selection bias as the genesis of a difference in outcome (a form of *confounding*).

**Case‑Control Studies.** Over the years, a number of attempts have been made to move "association" toward "causality." One such method is the case‑control study. The method seems logical and straightforward in concept. Patients in one treatment group (cases) are matched with one or more patients in the other treatment group (controls) according to variables such as age, sex, and ventricular function. However, case matching is rarely easy in practice. How closely matched must the pair of patients be in age? How close in ejection fraction? "We don’t have anyone to match this patient in both age and ejection fraction!" The more variables that must be matched, the more difficult it is to find a match in all specified characteristics. Yet matching on only a few variables may not protect well against apples‑and‑oranges comparisons. Diabolically, selection factor effects, which case matching is intended to reduce, may *increase* bias when unmatched cases are simply eliminated.

**Comparative Effectiveness Studies.** During the 1980s, federal support for complex clinical trials in heart disease was abundant. Perhaps as a result, few of us noticed the important advances being made in statistical methods for valid, nonrandomised comparisons. One example was the seminal 1983 *Biometrika* paper "The Central Role of the Propensity Score in Observational Studies for Causal Effects" by Rosenbaum and Rubin. In the 1990s, as the funding climate changed, interest in methods for making nonrandomised comparisons accelerated. This interest has increased as comparative effectiveness research has taken on greater importance, and the concept of a Learning Health System has been advocated by the National Academy of Medicine in the United States. Studies using propensity scores for comparison of outcomes are detailed in Section V under "Comparisons Based on the Propensity Score."

**Virtual Twin Studies.** More recently, formal statistical methods for conceptually treating patients as their own controls—something that has been done in cardiac surgery since the 1970s—is known as virtual twin methodology. The method borrows the concept of propensity score methods in identifying patients empirically eligible to be treated by two or more therapies, but both refines and importantly extends those methods such that patients are matched to themselves first with treatment received and then with the counterfactual treatment. Clinical research using virtual twins is detailed in Section V under "Virtual Twins and Causal Analysis."

</div></details>

<details class="med-details"><summary>
  
#### Clinical Trials with Randomly Assigned Treatment</summary><div class="details-content">

A randomised clinical trial is a scientific experiment in human subjects wherein allocation of therapies and alternatives for individual patients is not under control of the clinician, but rather is assigned at random, eliminating selection bias and thus permitting direct comparison of treatment outcomes. "Therapy" may include a placebo (placebo‑controlled trials) or current versus new therapy. In the hierarchy of clinical research study designs, the randomised trial generates the most secure information about average treatment differences. Randomised trials are detailed in Section V under "Clinical Trials with Randomly Assigned Treatments."

</div></details>

<details class="med-details"><summary>
  
#### Meta‑Analysis</summary><div class="details-content">

Meta‑analysis combines or integrates the results of multiple independently conducted clinical trials, observational clinical studies, or sets of individual patient data that are deemed combinable with respect to a common research question, then analyses them statistically. Meta‑analysis studies are detailed in Section V under "Meta‑Analysis."

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Technique for Successful Clinical Research</summary><div class="details-content">

Marbán and Braunwald, in reflecting on training the clinician‑investigator, provide guiding principles for successful clinical research. Among these are:

- Choose the right project.
- Embrace the unknown.
- Use state‑of‑the‑art approaches.
- Do not become the slave of a single technique.
- Never underestimate the power of the written or spoken word.

In this subsection, we emphasise these principles and suggest ways to operationalise them.

A deliberate plan is needed to successfully carry a study through from inception to publication. Many such plans have been proposed, but with important commonalities. Here we outline such a plan for the study of a clinical question for which clinical experience (an observational case series or comparative cohorts) will provide the data. This plan appears as a linear *workflow,* but in reality, most research efforts do not proceed linearly but rather iteratively, with each step being more refined and usually more focused right up to the last revision of the manuscript. As is true of most workflow, there are mileposts at which there need to be *deliverables*, whether a written proposal, data, analyses, tables and graphs, a manuscript, or page proofs. This plan is articulated in a research proposal.

<details class="med-details"><summary>
  
#### Research Proposal</summary><div class="details-content">

Good science requires a plan. This may be seen as a bureaucratic necessity for Institutional Review Board (IRB) oversight, but for effective, efficient studies, be they for quality assurance investigations or any type of clinical study, a formal plan in the form of a proposal is essential. In the words of Daniel Burnham, "Make no little plans; they have no magic to stir men’s blood."

**Getting Started.** A proposal first serves to clarify and bring into focus the *question* or set of related questions being asked. A common mistake is to ask questions that are unfocused, or uninteresting, or overworked, or that do not target a clear gap in knowledge or area of importance. Marbán and Braunwald say "Ask a bold question...about which you can feel passionate."

*Topical Question.* It is not possible to ask a researchable question without knowing something about the topic of one’s curiosity. Thus, as a preliminary to the research question, there is the topical question that relates to what is already known about the topic of interest and what gaps there are in knowledge related to that topic. Help in this regard may come from clinicians and mentors, but there is no substitute for a literature search and review. Indeed, some research mentors encourage this to be done as a systematic review (or "scoping" review), which can result in a state‑of‑the‑topic review manuscript that ends with a discussion of current gaps or limitations in knowledge, disparate findings that require reconciling, assertions from data that require verification, underpowered observations that need more robust study, and so on. From this literature study, you should be able to determine if your initial question has been adequately answered and no further study is needed, or to generate your research question.

*Research Question.* What is a good research question on your topic of interest? Browner and colleagues describe the characteristics of a good research question and study plan as meeting those described by the acronym FINER. F stands for *feasibility*: "adequate number of subjects, adequate technical expertise, affordable time and money, manageable scope, and fundable." Many IRBs exempt obtaining numbers of cases meeting eligibility requirements for a study to determine if the study is feasible. I stands for *interesting*: "getting the answer intrigues investigators and their colleagues." The National Institutes of Health (NIH) would call this *significance*, one of the graded criteria for grant proposals. N stands for *novel*: "provides new findings, confirms, refutes, or extends previous findings, may lead to innovations in concepts of health and disease, medical practice, or methodologies for research." NIH calls this *innovation*. E stands for *ethical*: "a study that the IRB will approve." As an aside, we note that there continues to be research fraud, and it is nearly impossible for reviewers to identify. R stands for *relevant*: "likely to have significant impacts on scientific knowledge, clinical practice, or health policy; may influence directions of future research." NIH calls this overall impact, and this is the ultimate score that is given a proposal for funding.

A further suggestion we offer is that a good research question should have three parts: the population, the treatment, and the outcome. For example, one might offer the topical question "What should we do for ischaemic mitral disease?" Given the knowledge gap from the literature review, this topical question can be transformed into a good investigable question: For patients with moderate ischaemic mitral regurgitation (the population), does addition of an undersized rigid anuloplasty ring (the treatment comparison) result in more complete reverse left ventricular remodelling (the outcome)?

*Study Title.* Once you have a good question, you have what you need to provide a good title for your proposal. The title should be a statement that relates directly to your primary research question. Some like to then extract from the title a short word for the study (this is especially true of clinical trials), such as MATADORS: **M**ultidisciplinary study of **A**scending **T**issue characteristics **A**nd haemodynamics for the **D**evelopment of novel a**OR**tic **S**tentgrafts.

*Mechanistic Hypothesis.* Given the research question, a hypothesis that is focused not on statistical matters but on the "why" is important, because it leads directly to the endpoint, and the endpoint to the analysis or its refinement. The mechanistic hypothesis for the question about mitral valve anuloplasty might be "By stabilising the mitral anular size with a rigid anuloplasty ring, regurgitation across the mitral valve is limited and stress on the left ventricular myocardium reduced, resulting in a decrease in systolic ventricular size (reverse remodelling)." There may be secondary hypotheses that lead to other endpoints, such as time‑related mortality.

**Identify the Study Group.** The next step is to clearly define the inclusion and exclusion criteria for the *study group*. A common mistake is to define this group too narrowly, such that cases "fall through the cracks" or an insufficient spectrum is stipulated. The inclusive dates should be considered carefully. Readers will be suspicious if the dates are "strange"; did you stop just before a series of deaths? Whole years or half years dispel these suspicions. Similarly, suspicion arises when a study consists of a "nice" number of patients, such as "the first 100 or 1000 repairs."

In defining the study group, particular care should be taken to include the denominator. For example, a study question may relate to postoperative neurologic events, but it is also important to have a denominator to put these events into context. Or one may wish to evaluate a new surgical technique but will be unable to compare it with the standard technique without a comparison group. A study of only numerators is the true definition of a *retrospective* study; if the denominator is included, it is a *prospective* or *cohort* study (Box 7.5). The inclusion and exclusion criteria should allow one to perform an initial search for patients as a feasibility study. Are there too few patients to answer the study question? A common failing is forgetting that if an outcome event is the endpoint, the effective sample size is the number of events observed (see Box 7.4). A study may have 1000 patients, but if only 10 events are observed, one cannot find multiple risk factors for those events. In cardiothoracic surgery, the number of events is often a very small fraction of the denominator, and such data are known as imbalanced. This is particularly important for nonparametric machine learning methods and in applying traditional goodness‑of‑fit statistics (like the C‑statistic) to parametric models.

<details class="med-details"><summary>

#### BOX 7.5 Retrospective, Prospective</summary><div class="details-content">

When clinical data are used for research, some term this *retrospective research* (e.g., the National Institutes of Health). Epidemiologists also perform what they call *retrospective studies* that bear no resemblance to typical clinical studies. Thus, confusion has been introduced by use of both the word *retrospective* and *prospective* to designate interchangeably two antithetical types of clinical study. The confusion is perpetuated by institutional review boards and government agencies that believe one (prospective), but not the other (retrospective), constitutes "research" on human subjects. The confusion can be eliminated by differentiating between (1) the temporal direction of study design and (2) the temporal direction of data collection for a study, as did Feinstein.

**Temporal Direction of Study Design**

The temporal pursuit of patients may be *forward.* That is, a cohort (group) of patients is defined at some common time zero, such as operation, and this group is followed for outcomes. Some call this a *cohort study.* It is the most typical type of study in cardiac surgery: A group of patients is operated on and outcome is assessed. Statisticians have called this a *prospective clinical study design*; it moves from a defined time zero forward (which is what the word *prospective* means).

In contrast, temporal pursuit of patients may be *backward.* Generally in such a study, an outcome event occurs, such as death from a communicable disease. Starting from this event (generally, a group of such events), the study proceeds backward to attempt to ascertain its cause. Feinstein suggests calling such a study a "trohoc" study (*cohort* spelled backwards). For years, many epidemiologists called this a *retrospective clinical study design* because of its backward temporal direction of study.

**Temporal Direction of Data Collection**

Increasingly, *retrospective* is used to designate the temporal aspect of collecting data from existing clinical records for either a cohort or trohoc study. If charts or radiographs of past patients in a cohort study must be reviewed or echocardiographic features measured, the *data collection* is retrospective. Feinstein has coined the term "retrolective" for this to avoid use of the word *retrospective* because of the previously well‑understood meaning of the latter in study design. If registry data are collected concurrently with patient care, this process is surely *prospective* data collection. Feinstein suggests calling such data collection "prolective" data collection.

</div></details>

The deliverable for this feasibility investigation is a CONSORT‑style diagram (http://www.consort‑statement.org/consort‑statement/flow‑diagram). For observational studies, there is a related STROBE guideline, and all these are part of the EQUATOR (Enhancing the **QUA**lity and **T**ransparency **O**f health **R**esearch) network (www.equator‑network.org).

**Identify Endpoints.** *Endpoints* (results, outcomes) should be linked one‑to‑one to the study questions and accompanying hypotheses. For example, if the first subquestion of a comparative effectiveness study is "How do these treatment groups differ?" and the mechanistic hypothesis is that for some patients, experienced, knowledgeable clinicians have selected one treatment for them and selected another treatment for other patients. However, for a group of these patients, systematic selection has not occurred, creating among them virtual equipoise. The endpoint for that hypothesis is the treatment received. For hypotheses about effectiveness of the treatment, endpoints would be those about short‑, medium‑, or long‑term effectiveness of treatment. For a hypothesis related to differences in safety of the therapies, perioperative complications are likely among the endpoints. Whatever the endpoint, it must be clearly defined in a reproducible fashion. Generally, every event endpoint should be accompanied by its date of occurrence. A common failing is that for repeated endpoints (e.g., thromboembolism, assessments of functional status, rehospitalisations, echocardiographic assessment of valve gradient or grade of regurgitation), only the first or most recent time they occurred or were assessed is recorded. The latter is particularly egregious because every patient has a different interval from, say, surgery to that last observation, so the data at last observation are not interpretable. Instead, record every instance, every assessment. Techniques to analyse repeated endpoints are available (see "Longitudinal Outcomes" in Section IV).

**Identify Covariables.** Careful attention must be paid to the *covariables* that will be studied. They should be pertinent to the study question (purpose, objective, hypothesis). A common failing is to collect values for too many variables such that quality of data collection for important variables suffers. This error usually arises in a reasonable and understandable way. The surgeon‑investigator reasons that because the patient medical records must be reviewed, a number of other variables "may as well" be abstracted while there. Or realising the full complexity of the clinical setting, the surgeon‑investigator feels compelled to collect information on all possible ramifications of the study, even if some of it is peripheral to the study’s focus. John Kirklin called this "the Christmas tree effect," meaning adding ornament upon ornament until they dominate what once was "just" a fine tree. There needs to be a balance between so sparse a set of variables that little can be done by way of risk factor identification or balancing characteristics of the group, and so rich a set of variables that the study flounders or insufficient care is given to the quality and completeness of relevant variables.

*Variables from Electronic Sources.* What variables can be obtained from electronic sources? Some aspects of these data may need to be verified. Of vital importance is determining the units of measurement for values from electronic sources. For example, in one source, height may be in inches and in another in centimetres!

*Variables Specific to Study that need to be Collected.* For many studies, at least some values for variables needed are not available electronically. This requires developing a database for their acquisition. Note that for successful data analysis, the vocabulary for these variables must be controlled, meaning that all possible values (including "unknown") for each variable must be explicitly specified at the outset (no "free text"). These will become "picklists" for data entry.

**Propose Data Analysis Plan.** A data analysis plan should be linked one‑to‑one with the study questions, their accompanying hypotheses, and their accompanying endpoints. For example, if the first subquestion relates to how patients are receiving one therapy versus another, the first objective in the analysis plan would be comparing characteristics of the two groups of patients, for example, by a table or figure of standardised differences. The second step would be to develop a parsimonious model of these differences that would then be augmented into a nonparsimonious model, followed by generating a balancing or propensity score. This would be followed by 1:1 or weighted matching and comparison of characteristics of the resulting matched groups. This, in turn, would lead to comparisons of endpoints, and finally study of the remaining unmatched cases (the "oranges").

**Appreciate Limitations and Anticipated Problems.** Every study has limitations and anticipated problems. These can be identified by a brief but serious investigation of the state of all the above. If any appear insurmountable or present fatal flaws that preclude later publication, the study should be abandoned. There are always more questions than can be addressed in cardiac surgery, so not being able to answer some specific research question is not an excuse to abandon the search for new knowledge!

**Sketch Shell Tables and Figures.** Every aspect of the data analysis plan is likely to generate perhaps some simple answers, but more often tables and figures. Laying these out with the proposal will be helpful to the statisticians analysing the data and often identifies items missing from the analysis plan—those analyses, tables, and figures that "connect the dots."

**Establish a Timetable.** Develop a timetable for data abstraction, data set generation, data analysis and reporting, possible meeting abstract and deadline, and all deliverables at various mileposts in the study. If the timetable is beyond that tolerable, abandon the study. It is rare for a study to be completed in a year from start to finish. This emphasises both the bottlenecks of research and the need for lifelong commitment. Although abstract deadlines often drive the timetable, this is a poor milepost (see "Presentation" in Section V).

**Final Deliverable.** The final deliverable is a completed research proposal (or protocol) that is ready for review by collaborating investigators, data managers, and statisticians, followed by revision and iterative refinement of the proposal. The better the proposal, the better the research and the easier for statisticians to analyse. The protocol will often need to be approved by a research committee for its scientific merit and funding, and by the institutional review (ethics) board.

The proposal should be a living document. It is likely to be updated throughout the course of a study, and we advocate online tracking of each study, with periodic updates of the protocol as one of the tasks in project management.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
## SECTION II: INFORMATION</summary><div class="details-content">

In this chapter, we define information as a collection of facts. The medical record is one such collection of facts about the health care of a patient. In it, observations are recorded (clinical documentation) for communication among healthcare professionals (and coders for billing for care) and for workflow (e.g., plan of care, orders). However, perhaps as much as 90% of the information communicated in the care of a patient is never recorded. The attitude of health insurers—"if it is not recorded, it did not happen"—represents a sobering lack of appreciation for the way information about patient care is used and communicated. However, it is also an indictment of the way medical practice is documented. Much is left out of written records, and many reports are poorly organised or incomplete. If important clinical observations are not recorded during patient care in a clear, complete, and well‑organised (structured) fashion, information gathering for clinical research and a learning health system is impeded.

<details class="med-details"><summary>
  
### Computer‑Based Patient Record</summary><div class="details-content">

In 1991—now more than 35 years ago—the Institute of Medicine (now Academy of Medicine) recognised the need not only for computerising the paper medical record, but also for devising a radically different way to record, store, communicate, and use clinical information. They coined the term "computer‑based patient record," or CPR, and distinguished it from the electronic medical record (EMR) by the fact that it would contain values for variables using a highly controlled vocabulary rather than free text (natural language).

For the cardiac surgical group interested in conducting serious and efficient clinical research, a CPR with a few specific characteristics could enormously facilitate clinical studies. Additionally, it could transform the results of this research into dynamic, patient‑specific, strategic decision‑support tools to enhance patient care. Although clearly elusive, and therefore theoretical, the nature of such a system can be described.

First and foremost, the CPR must consist of *values for variables*, selected from a *controlled vocabulary*. This format for recording information is necessary because analysis now and in the foreseeable future must use information that is formatted in a highly structured, precisely defined fashion, not uncontrolled natural language. Extracting structured information from natural language is a formidable challenge and one that should be unnecessary. Second, the CPR must accommodate *time* as a fundamental attribute. This includes specific time (date:time stamps), inexact time (about 5 years ago), duration (how long an event lasted, including inexact duration), sequence (second myocardial infarction [MI], before, after), and repetition (number of times, such as three MIs). Third, the CPR must store information in a fashion that permits retrieval not only at the *individual* patient level but also at the *group* level, according to specified inclusion and exclusion criteria. Fourth, the CPR will ideally incorporate mechanisms for using results of clinical studies in a patient‑specific fashion for *decision support* in the broadest sense of the term, such as patient management algorithms and patient‑specific predictions of outcome from equations or algorithms developed by research (see "Decision‑Making Based on Individual Effect of Therapies" in Section V).

There are many other requirements for CPRs, from human‑user interfaces, to administrative and financial functions, to healthcare workflow, to human error avoidance systems, to quality assurance (see Chapter 8) that are beyond the scope of the clinical research theme in this section. However, certain ideas about how medical information could be stored to facilitate clinical research follow.

</div></details>

<details class="med-details"><summary>
  
### Ontology</summary><div class="details-content">

If medical information is to be gathered and stored as values for variables, a medical vocabulary and organising syntax must be available. A technical term for this is *ontology.* In Greek philosophy, *ontology* meant "the nature of things." Specifically, it meant what actually is (reality), not what is perceived (see "Human Error" in Section I) or known (epistemology). In medicine of the 17th and 18th centuries, however, it came to mean a view of disease as real, distinct, classifiable, definable entities. This idea was adopted by computer science to embrace with a single term everything that formally *specifies the concepts and relationships* that can exist for some subject, such as medicine. An ontology permits sharing of information, such as a vocabulary of medicine (terms, phrases), variables, definitions of variables, synonyms, all possible values for variables, classification and relationships of variables (e.g., in terms of anatomy, disease, healthcare delivery), semantics, syntax, and other attributes and relationships.

An ontology for all of medicine does not yet exist. Efforts to develop a unified medical language, such as the Unified Medical Language System (UMLS) of the National Library of Medicine, are well underway and becoming increasingly formalised linguistically as ontologies.

Ontology is familiar to clinical researchers, who must always have a controlled vocabulary for values for variables, well‑defined variables, and explicit interrelations among variables. Without these, there is no way to accurately interpret analyses or relate results to the findings of other investigators. However, a clinical study is a microscopic view of medicine; scaling up to all of medicine is daunting.

Perhaps, then, the simplest way of thinking about an ontology for the researcher is as data dictionaries and their organisational structure, and some mechanism to develop and maintain them. These attributes have collectively been called *metadata* (data about data) or a *knowledge base*, and *metadata‑base* or *knowledge‑base management systems*, respectively.

</div></details>

<details class="med-details"><summary>
  
### Information (Data) Model</summary><div class="details-content">

An information (data) model is a specification of the arrangement of the most granular piece of information according to specific relationships and the organisation of all of these into sets of related information. The objective of an information model is to decrease entropy—that is, to decrease the degree of disorder in the information and thereby increase efficiency of information storage and retrieval (performance). Here we describe briefly two such information models, an old model still in use today and a new model from among many that may be less familiar.

<details class="med-details"><summary>
  
#### Relational Information Model</summary><div class="details-content">

In medicine, information is multidimensional. A given value for a variable may carry with it time, who or what machine generated the value, the context of obtaining the value ("documentation"), format or units of measurement, and a host of attributes and relationships—indeed ontology—that give the value meaning within the context of healthcare delivery. Simply storing a set of values is insufficient. At a minimum, a comprehensive data dictionary must be developed, and ideally the database structure will contain metadata as to who entered the data, completeness of the data, and who can access and use the data. When data comes to analysis, information relevant to the values may importantly affect the analysis.

In relational database technology, variables are arranged as columns of a table, sets of columns are organised as a table, individual patients are in rows, and a set of interrelated tables constitute the database (Fig. 7.3A). Retrieval of data from such a model is often accompanied by the structured query language (SQL).

Popularity of the relational model among clinical researchers stems from its simplicity in handling a microscopic corner of medical information. As soon as a new topic is addressed or new variables must be collected, the typical behaviour of the research team is to generate a new specific database. Rarely do these multiple, independent, and to some extent redundant databases communicate with one another across studies. Thus, simplicity can work against more complex or comprehensive future studies.

</div></details>

<details class="med-details"><summary>
  
#### Semistructured Information Model</summary><div class="details-content">

A different kind of information model emerged from an important conference at UAB of leaders in the development of several different types of database as part of a CPR project. After review of the strengths and limitations of various information models, a novel approach was suggested by Kirklin and then formalised. He proposed that all information that provided context and meaning to a value for a variable be packaged together. He envisioned that such a *complex data element* should be able to reside as an independent self‑sufficient entity.

This idea has several meritorious implications. First, an *electronic container* for a collection of complex data elements could consist of a highly stable, totally generic repository for a CPR because it would be required to possess no knowledge of content of any data element. It could therefore manage important information storage and retrieval functions, implement data encryption for privacy and confidentiality, store knowledge bases used to construct the complex data elements and retrieve them, maintain audit trails, and perform all those functions of database management systems that are independent of data content. The second implication is that as medical knowledge increases, new entries would be made in the knowledge‑based dictionaries. These would be updated, not the database structure. Not only would this ease database maintenance, but it would also enforce documentation in the knowledge base. The third implication, and the one most important for clinical research, is that no a priori limitations would be placed on relations; they could be of any dimensionality considered useful at the time data elements were *retrieved* for analysis. Thus, the electronic container is a single variable value‑pair augmented with contextual documentation and capable of being modified as new or more knowledge accrues (Fig. 7.3B).

Essential characteristics of such an information repository would be:

- Self‑documentation at the level of individual values for a variable (complex data element)
- Self‑reporting at the time of data element retrieval and potential
- Self‑displaying in a human‑computer interface
- Self‑organising

The latter is an important attribute for future implementation of what might be called "artificial intelligence" features of a CPR. These may be as simple as self‑generation of alerts, solution of multivariable equations or algorithms for decision support at the individual patient level, or intelligent data mining for undiscovered relations within the information.

About 1995, at the time these ideas were being developed at UAB, similar thinking was going on among computer scientists at Stanford University and the University of Pennsylvania, arising from different stimuli. They termed an information model of complex data elements that carried with them all attributes intended for self‑documentation, self‑reporting, and self‑organising *semistructured data.* This phrase meant that the data elements were fully structured, but no necessary relation of one data element to another was presupposed. The culmination of these efforts was a database for storing complex data elements called Lore and a novel query language for retrieving complex data elements called Lorel.

In the 1990s, it was recognised that the information structure suggested by Kirklin and the University of Pennsylvania and Stanford computer scientists could be conceptualised as a directed acyclic graph. At that time, another entity was also rapidly coming into existence with similar properties, but of global proportions: the World Wide Web (WWW, or simply the Web). A Web page is analogous to a complex data element, with an essential feature being that it is self‑describing, so it can be retrieved. The Web is the infrastructure for these pages. It has no need to be aware of Web page content. The subject matter has no bounds. Not surprisingly, then, the tools developed for retrieving semistructured data were quickly adapted to what has become known as *search engines* for the Web. Like Dr. Kirklin’s vision of complex data elements, information retrieved by a search engine can become related in ways never envisioned by the person generating it, because full structure is imposed only at the time of retrieval, not at the time of storage.

Thus, at Cleveland Clinic, investigators both harnessed and developed Semantic Web tools for data storage and manipulation, in part within the framework of the World Wide Web Consortium (W3C) and in part through ontologies built by Douglas Lenat of Cycorp.

An information model was built on a graph‑based data model known as the *Resource Description Framework* (RDF), as well as a framework for describing conceptual models of RDF data in a particular domain known as the *Ontology Web Language* (OWL). It also includes a standard querying language called *SPARQL*.

RDF captures meaning as a collection of triples consisting of components analogous to those of an elementary sentence in natural language: subject, verb, object. Typically, terms in these sentences are resources identified by Uniform Resource Identifiers (URIs). URIs are global identifiers for items of interest (called *resources*) in the information space of the Web. Collections of RDF triples constitute an RDF graph.

Many requirements outlined as crucial for CPR systems are addressed by using RDF as a data format for patient record content. In particular, our ability to link with other clinical records can be facilitated when RDF is used in this way. Use of URIs as syntax for the names of concepts in RDF graphs is the primary reason for this. The meaning of terms used in a patient record (as well as the patient record itself or some part of it) can be made available over the Web in a (secure) distributed fashion for on‑demand retrieval.

A judicious application of Semantic Web technologies can also lead to faster movement of innovation from the research laboratory to the clinic or hospital. In particular, it was envisioned that use of these technologies would improve productivity of research, help raise quality of healthcare, and enable scientists to formulate new hypotheses, inspiring research based on clinical experience.

![](_page_19_Figure_6.jpeg)

**FIGURE 7.3** Comparison of *relational* information model with a *semistructured* one presented as a directed acyclic graph. (A) Relational. Tables are related by ID and source. Note that second table is many‑to‑one; that is, many postoperative echocardiograms were performed on one patient. (B) Semistructured. (From Jonathan Borden, <a href="https://www.jonathanborden-md.com">www.jonathanborden-md.com</a>.)

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Data Collection for a Clinical Study</summary><div class="details-content">

Clinical studies are only as accurate and complete as the data available in patients’ records. Therefore, cardiac surgeons and team members must ensure that their preoperative, operative, and postoperative records are clear, organised, accurate, and extensive so that information gathered from these records can be complete and meaningful. The records should emphasise description, and although they may well contain the conclusions of the moment, it is the description of basic observations that becomes useful in later analyses.

<details class="med-details"><summary>
  
#### Core Data Elements</summary><div class="details-content">

Beyond these core variables, there will likely be a need for variables specific to a particular study. These should be identified and reproducibly defined in a data dictionary. Experienced investigators realise that in the midst of a study, it occasionally becomes evident that some variables require refinement, others collecting de novo, others rechecking, and others redefining. It is important to understand that when this occurs, the variables must be refined, collected, rechecked, or redefined uniformly for *every* patient in the study.

</div></details>

<details class="med-details"><summary>
  
#### Extract Values for Variables</summary><div class="details-content">

A source, or sources, for obtaining values for the set of variables specified in the clinical research proposal must now be identified for the study group (Box 7.6). These are often contained in an electronic format (e.g., a quality registry or a hospital information system), but values for some variables may be in narrative form in patients’ medical records and must be abstracted.

**Export from Electronic Information Sources.** If some or all the variables specified are in electronic format, sources must be identified, and a query made for patients in the study to extract values for the variables. This often time‑consuming step is facilitated by three factors. First, at the time the information system is created, procedures can be built in to ease extracting, formatting, and exporting values for variables. This is particularly feasible in a so‑called metadata‑driven system, in which "data about data" drives not only the data entry process but the data extraction process as well. It is also particularly feasible for relational databases that are electronically linked (e.g., portals) to the analysis system. Second, "standard" groups of core data elements can be identified that form the basis for at least a major portion of the variables needed for most studies, and these may be part of prospectively maintained registries for quality reporting. The advantage of this strategy is that queries can be assembled carefully and refined over time. Third, successful, accurate ad hoc queries can be stored so that when the same variables are again specified, these queries can be reused.

Often more than one electronic data source must be used. In this case, values for variables in common may need to be adjudicated if they do not match in value, definition, granularity, or in variable nomenclature. Ultimately, unique variables must be joined into a common database.

**Extract from Medical Records.** Even if the majority of information is available electronically, there are nearly always some variables new to the study that must be gathered from paper records or free text in the EMR if a CPR is not available. A more arduous process must be put into place for extracting data from original documents by natural language processing. A precise methodology is necessary for assembling information to prevent repetitious handling of both the patient’s record and the extracted information, as well as to ensure complete and accurate data retrieval while preserving patients’ privacy and confidentiality.

All information should be recorded in clearly defined, objective terms. There may be a preference for using descriptive terms that have been clearly defined (e.g., absent, trivial, mild, moderate, severe). Alternatively, numeric coding may be used, with each numeral clearly defined. Pedal pulses, for example, may be recorded as 0, 1, 2, 3, or 4, with 4 indicating normal. Either method is equally rigorous as long as values are picked from a controlled vocabulary with clear definitions.

What one must avoid is an uncontrolled approach to entry of data in a spreadsheet (Table 7.3A). Each column contains data in multiple formats with a mix of alphabetical and numeric data, units associated with some numbers (differing units at that!), dates in several formats, anomalous dates in which day and month could be reversed, and different expressions of a quantitative variable. Keep in mind the data scientist or statistician who will be analysing the data. In the end, they will need the data as it appears in Table 7.3B. What is needed is a data entry form that has controlled data entry, in this case with separation of numerical values from a column of units of measure and non‑ambiguous dates, and a data dictionary.

Accuracy of data entry is improved by recording only primary information (e.g., date of birth, date of operation) and not indices derived or calculated from them (e.g., patient age at operation, body surface area). Such indices can later be calculated quickly and reproducibly by computer.

A key concept is to record *core data elements* that can be logically combined in multiple ways to form derived variables (see Box 7.6). For example, for analysis one may want to use only the variable "current smoker." If this were the variable gathered primarily, one would be unable later to derive other data about smoking, such as pack‑years, duration of smoking, or when a previous smoker quit. Core data elements would instead relate to dates of smoking and intensity, from which all others could be derived.

The process of gathering data is the most time‑consuming step in a study. It is not unusual for it to consume months or years of work. Even if electronic sources of information are used, if values for variables were not entered at the point of care, the expense can be enormous. This is why the CPR, as the repository of all patient data and patient care workflow, is essential to increase the efficiency of clinical research.

For many institutions, identifying patients using a quality assurance registry for core data elements (see Chapter 8, Quality Assurance) and extracting more detailed ancillary data for a specific study are the most cost‑effective methods for clinical research. Although review of the medical record in this way is often considered a thankless chore, it has the benefit of an investigator gaining valuable in‑depth insight into the patient cohort that is not captured by typical "case report forms" or routine registry capture. Indeed, the clinical importance of the research and the clinical inferences and practical recommendations coming from the research are often greatly enhanced by careful review of all or at least a substantial sampling of the medical records.

<details class="med-details"><summary>

#### BOX 7.6 Core Data Element Concept</summary><div class="details-content">

Core data elements represent the most granular source information that can be logically combined or mapped in multiple ways to generate answers (values) to specific questions (variables). Schematically, this is shown in the following diagram for six core data elements (CDE) from sources a‑f.

[Diagram in original]

The diagram that follows answers two specific database queries concerning use of anti‑anginal medications.

[Diagram in original]

Finally, a third database query relates to a specific medication and requires a combination of temporal reasoning and medication class, prescription, and use.

[Diagram in original]

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Time</summary><div class="details-content">

The ability to manage that ubiquitous attribute of all medical data—*time*—is not part of any widely available information retrieval system (generally called *query languages*). Some proposals have been tested in a limited fashion, such as the Tzolkin system developed at Stanford University, but the software is not generally available. The reason for needing to consider time is readily apparent. Whenever we think about retrieving medical information along some time axis (e.g., sequence, duration, point in time), new logical relations must be generated to obtain reasonable results. For example, if we ask for all patients younger than 80 years who have undergone a second coronary artery bypass operation followed within 6 months by an MI, a number of time‑related logical steps must be formulated. What is meant by patients younger than 80? Younger than 80 when? At the time of initial surgery, second surgery, MI, or at the time of the inquiry? The sequence of coronary artery bypass grafting (CABG) must be ascertained from data elements about each procedure a patient has undergone. Information about the MI and its relation to the date of the second CABG must be retrieved. The process is even more complex if only approximate dates are available.

Perhaps a growing interest pertaining to the time axis in business may stimulate development of better tools for managing queries related to time in medical information.

</div></details>

<details class="med-details"><summary>
  
#### Follow‑up Information</summary><div class="details-content">

Time‑related events occurring after hospital discharge are often extracted *opportunistically* from clinic visit records rather than by *systematic* patient contact. Patients not appearing for clinic visits are said to be untraced. This is an unacceptable method of follow‑up.

Even with systematic methods, however, some patients cannot be traced, and in the United States, privacy and confidentiality regulations are making this task increasingly difficult. A high prevalence of untraced patients potentially introduces bias into the time‑related analysis, leading to overestimating or underestimating survival or freedom from other events, and reduces effective sample size.

**Active Follow‑up.** Active follow‑up means that patients or their families are contacted directly by mailed questionnaire, telephone, or electronic means (e‑mail, Internet). Active follow‑up is essential for discovering time‑related events such as reinterventions and longitudinal clinical condition such as periodic echocardiographic assessment, perhaps with the exception of vital status, which may be available from government sources. Active follow‑up data, and particularly the date of last active follow‑up, must be kept separate from any augmentation of these data from passive sources. If a patient is found to have died, nearest relatives are contacted in a sensitive, sympathetic fashion to document the circumstances of death and ascertain all other pertinent cardiac events that occurred between the date of last active contact and death.

There are two general methods of active follow‑up: anniversary and cross‑sectional.

*Anniversary Method.* In the anniversary method, patients are contacted yearly on the anniversary of their surgery or entry into the study (or periodically if not yearly). This method is ideal for sampling the time‑varying condition of the patient (e.g., functional status, freedom from angina, health‑related quality of life, growth and developmental patterns). It has the added advantage of maintaining yearly contact with the patient or patient’s family, an important consideration in a mobile society. It has also been demonstrated that nonlethal morbid events such as thromboembolism and haemorrhage after heart valve replacement are forgotten unless there is at least yearly contact. Yearly active contact also makes it more likely patients will report events to their physicians during the course of the year.

For practical purposes, "anniversary" follow‑up may be batched, resulting in a graph depicting completeness of follow‑up that consists of a series of stair steps (Fig. 7.4A). In that case, one may wish to truncate follow‑up for a given patient at exactly his or her anniversary date of surgery, even if events have happened in the interval beyond their anniversary date.

*Cross‑sectional Method.* In the cross‑sectional method, a specific follow‑up inquiry of the patient cohort is initiated on a specific calendar date called the *common closing date*, with the goal of obtaining the status of all patients at a specific instant in time. In practice, of course, finite time is necessary to conduct the follow‑up. For example, a cross‑sectional follow‑up may be initiated on August 1 and questionnaires returned over the ensuing 2 months. During this time, telephone calls may be made to nonresponders or those whose questionnaires have been returned as undeliverable.

The status of every patient, including events observed, is that as of the common closing date (August 1 in this example). Any events occurring after the common closing date are ignored (censored). Patients still event‑free by the common closing date will appear as a diagonal line on a completeness of follow‑up graph (Fig. 7.4B).

For patient condition (longitudinal data), a decision must be made about condition as of the closing date. This can be made clear on the follow‑up form or via the telephone script.

**Passive Follow‑up.** If vital status is the only outcome of interest, date of death may be obtainable from government vital statistics offices or a death registry. In passive follow‑up, only death and date of death (which may be approximate) may be identified, not whether each individual in the study is alive or dead at the time of inquiry. Usually there is a lag between death and reporting, so methods must be employed to determine the status of living patients at any given time. It is important to remember that nonfatal events cannot be determined by passive follow‑up. If passive follow‑up is used to supplement active follow‑up, a separate date for end of active follow‑up must be retained for analysis of nonfatal events. Passive follow‑up can include use of office visits or hospital admissions as the sole source of follow‑up. This is opportunistic and is non‑systematic follow‑up. Non‑systematic follow‑up captures only some of the events and some of the potential follow‑up, so analyses of time‑related events are distorted. Particular care must be taken if for a clinical trial with yearly follow‑up, it is required that deaths be reported within a short interval, such as 48 hours. This will result for the last year of follow‑up numerators (deaths) with no denominators. This is avoided by truncating data for analysis after the preceding systematic follow‑up.

**Completeness of Follow‑up.** In performing active follow‑up, every effort must be made to contact every patient in as short a time as possible. Special assistance may be required to achieve a high level of follow‑up under these circumstances. In the past, we advised using cross‑reference indices to former neighbours or contact of relatives and former physicians, churches, and other agencies. However, in the United States this is now prohibited.

There is no perfect way to describe and quantify completeness of follow‑up. Fig. 7.4 illustrates one way of visually assessing completeness of follow‑up for each patient. In Fig. 7.4C, note that many patients are at the bottom of the graph, indicating that no follow‑up has started. Other incompletely followed patients appear below the upper triangle of completely followed patients. Lack of follow‑up for nonfatal events requires that these unfollowed patients be followed cross‑sectionally, as shown in Fig. 7.4D.

Grunkemeier and Starr have described a patient‑year method for estimating goodness of follow‑up based on *observed* versus *potential* follow‑up duration. For each patient, the duration of potential follow‑up is computed (this is the interval from study entry, such as surgery, until death or, for the patient still alive at follow‑up, the common closing date or response date, anniversary date, or analysis date, depending on the type of follow‑up study performed). The measure of completeness of follow‑up is the ratio of total observed follow‑up duration to total potential follow‑up duration.

In highly lethal diseases, Korn suggests a different definition of potential follow‑up, namely total patient years or median follow‑up as if no events occurred. This is important in a setting where one has complete follow‑up over 20 years, but median follow‑up is only 1.5 years because of rapid demise of patients. It obviates the reader’s reaction that there is little follow‑up or very incomplete follow‑up, or that the therapy has only recently been introduced, all of which could be alternative reasons for short median follow‑up.

**Follow‑up for Longitudinal Data.** Although follow‑up for clinical events has dominated past cardiac surgery studies, increasingly, longitudinal data are important outcomes. These include continuous data such as valve gradient, binary data such as recurrence of arrhythmias, and ordinal data, such as grade of valvular regurgitation. Typically, longitudinal data represent a snapshot at various time intervals. But the assessments are often made at somewhat irregular times, for a different number of measurements per patient depending on whether the operation occurred recently or many years ago.

At times investigators collect and assess values only at last follow‑up. Such data are uninterpretable because the interval from surgery to last follow‑up differs from patient to patient. Others set thresholds and when exceeded at the time of an assessment, analyse the data as if they were an event. This has several drawbacks: (1) it is uncertain when the value exceeded the threshold; all one knows is it had not at the previous assessment; (2) longitudinal data are rarely static but vary from measurement to measurement, making the threshold a moving target; and (3) a lot of detailed data are lost. As will be seen under "Longitudinal Outcomes" in Section IV, good methods are available today for analysing longitudinal data.

When collecting longitudinal data it may seem logical to string the values in a single row on a spreadsheet, as seen in Table 7.4A. However, this creates variable length records that are difficult to analyse. Instead, collect these repeated measures in what is known as "long format," illustrated in Table 7.4B. Doing so results in many records per patient (Table 7.5), but the format, known as many‑to‑one, is ideal for analysis. Tables of such outcomes can be linked to the "one" static record of patient demographics, comorbidities, and surgical procedure in a relational database model.

<details class="med-details"><summary>

#### TABLE 7.4 Longitudinal (Repeated Measures) Data</summary><div class="details-content">

**A, Wide format.** Each patient’s repeated echocardiographic data has been strung out to the right in "wide" format, with baseline, then first postoperative echo data, then second. Because patients are followed for different durations, the number of observations to the right is variable. Further, there may be different quantities measured on these echos, and that strings things out even further.

**B, Long format.** Each row of uniform length shows the repeated measurements in long format. Thus, format gets rid of variable length records and in its place substitutes multiple records per patient (called "many‑to‑one"). Note that surgery date (Surg\_dt), race (Race\_Wh), sex (Female), and baseline aortic regurgitation grade (AR\_base and ejection fraction [EF]\_base) are repeated. This is because this "long" format data consisting of Study\_ID and these baseline characteristics have been joined with echo data that also had the key Study\_ID and the repeated observations of postoperative ejection fraction (Ef\_po) as observed multiple times. In practice, one would have all the desired echocardiographic variables, not just ejection fraction, to the right of Ef\_po.

</div></details>

<details class="med-details"><summary>

#### TABLE 7.5 Use of Symbols of Inequality: Illustration with P‑Values and Their Interpretation</summary><div class="details-content">

| P value range | Interpretation of Null Hypothesis | Inferences About the Difference |
|---------------|-----------------------------------|--------------------------------|
| < .05 | Almost certainly not true | Unlikely to be due to chance |
| .05 to .1 | Probably not true | Probably not due to chance |
| .1 to .2 | Possibly not true | Possibly not due to chance |
| ≥ .2 | Nearly certainly true | Likely to be due to chance |

###### A small sample size also could account for this P value.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Follow‑up Instrument</summary><div class="details-content">

The follow‑up instrument may be a simple questionnaire mailed to the patient (with one or two remailings followed by telephone calls to non‑responders). If so, it is wise to not exceed a single sheet in length, relying on the telephone or personal contact to obtain more details if events have occurred. Alternatively, the inquiry may be completed by telephone, using well‑trained individuals, a script, and a form that is filled out during the conversation, by electronic means coupled with the patient’s medical record, or by other electronic mechanisms.

Patients rarely resent being followed up; to the contrary, periodic follow‑up is useful not only in detecting medical trends in individual patients who may need attention, but also in generating good will between the patient and the medical system.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Verify Collected Information</summary><div class="details-content">

No matter what method of data export or extraction is used, experience dictates that one or more iterative data verification steps must be inserted before any analyses are performed. This can take three general forms: (1) value‑by‑value checking of recorded data against primary source documents, (2) random quality checking, (3) automatic reasonableness checking, and (4) comprehensive graphical review. If a routine activity of recording core data elements is used, it is wise to verify each element initially to identify those that are rarely in error (these can be "spot checked" by a random process) and those that are more often in error. The latter are usually a small fraction of the whole and are often values requiring interpretation. These may require element‑by‑element verification.

This process is long and tedious and can be boring. It usually reveals *many* errors, but it also allows review of each patient’s record to detect missed information. Data are then checked for reasonableness, a process greatly aided by computer, as described in the following Section III under "Screen and Scrub and Descriptive Data Exploration." Discrepancies and inaccurate outliers are found and the data corrected. Importantly, if data errors are found, they should be corrected in the primary information repository and the data re‑exported. This policy ensures upgrades of repository quality with each study.

Although a controversial statistical point, data should probably not be "doctored" by rejecting outliers unless there is a reason to suspect they are less reliable than values obtained for other patients. It is also useful to list all patients with missing data so that renewed efforts can be made to obtain them. Finally, a check is made to detect possible duplicate records, particularly if the same patient was the subject of a preceding study or if data were extracted from an electronic source in which patients may be entered multiple times.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
## SECTION III: DATA</summary><div class="details-content">

*Data consist of organised information.* We add the following further constraints.

First, *data consist of values for variables*. These values have been selected from a list of all possible values for a variable, and this list is part of a constrained vocabulary. The constrained vocabulary may consist of numbers, "yes" or "no," ordered lists (none, mild, moderate, severe), nonordered lists (such as names of diseases), calendar dates, and so forth but not unconstrained free text.

Second, *data consist of values for variables that have been accurately and precisely defined* both at the level of the database and medically. One of the important benefits of multicentre randomised trials, concurrent observational studies, and national registries is that these activities require establishing agreed‑upon definitions at the outset. Coupled with this is often intensive and ongoing education of study coordinators and other data‑gathering personnel about these definitions, exceptions, and evolution of definitions and standards. There is a mechanism to monitor compliance with these definitions and standards throughout the study, and the same should hold true for any registry. A mechanism to ensure similar adherence to definitions is essential even for individual clinical studies. Further, documentation must be in place to identify dates on which changes in definition have occurred, and these must be communicated to the individuals analysing the data (generally, indicator variables are created that "flag" cases for which definitions of an individual variable have changed). The rigour of establishing good definitions is considered distasteful by investigators who are impatient to collect data, but it is essential for successful research. It is also somewhat of an iterative process, which is why we suggest extracting data on the basis of initial definitions for a few patients scattered over the entire time frame of the study, then refining the definitions. One must also be aware of standards developed by national and international groups of cardiac surgeons and cardiologists assembled for this purpose.

Third, *data consist of values for variables that have been organised*, generally using a database management system, into a database or data set(s). At the present time, data analysis procedures presume that data will be organised in a fully structured format, generally a relational database. In such a database, tables with columns for each variable and rows for each separate patient contain static information (e.g., demographics, past medical history), but other tables linked to that table may contain multiple entries of longitudinal and follow‑up data for patients, with a key that links that table to individual patients in a many‑to‑one fashion. It is our view that the fully structured organisation of data, probably in relational database format (see "Relational Information Model" in Section II), should be imposed only at the point of extraction of values for variables from information (often called the "export" phase in a process termed *rectangularisation*). This allows the input of data to be semistructured (see "Semistructured Information Model" in Section II), maximally flexible, and with few imposed organisational constraints (outside of retrievability), so that relations among variables are imposed by the research question being asked and not by a priori database constraints. Thus, we advocate for "self‑documenting" primary databases such as registries, with Yes (or Y), No (N), or Unknown (U) so there is no mistake as there can be with assigning a numerical value to these quantities.

<details class="med-details"><summary>
  
### Information to Data</summary><div class="details-content">

An idealised, linearised perspective on the process of transforming clinical information to data suitable for analysis requires three broad steps: (1) formulating a clinical research proposal that leads to identifying a suitable study group (see "Research Proposal" in Section I), (2) gathering proposed variables and values that lead to an electronic data set, and (3) manipulating the values and variables to create a data set in a format suitable for analysis. This is a linear process in theory only. In reality, it contains checks that cause the investigator to retrace steps.

<details class="med-details"><summary>
  
#### Data Conversion for Analysis</summary><div class="details-content">

An often underappreciated, unanticipated, and time‑consuming effort is conversion of data elements residing in a database to a format suitable for data analysis. Even if the day comes when all medical information is recorded as values for variables in a computer‑based patient record, this step will be unavoidable. Statistical procedures require data to be arranged in "columns and rows," with each column representing values for a single variable (often in numeric format), and each row either a separate patient or multiple records on a single patient (many‑to‑one, as in repeated‑measures longitudinal data analysis).

An important activity is managing sporadic missing data. If too many data are missing, the variable may be unsuitable for analysis (see "Managing Missing Values" later in this section). Otherwise, missing‑value imputation is necessary so that entire patients are not removed from analyses, the default option in many analysis programmes.

</div></details>

<details class="med-details"><summary>
  
#### Analysis Data Set</summary><div class="details-content">

The last step in transforming information into analysable data is creating one or more analysis data sets in a format compatible with analytical procedures. This step includes (1) manipulating variables and values, (2) screening and scrubbing data, (3) imputing missing values, and (4) organising a set of analysis variables into medically meaningful categories. The general process has been described under "Technique for Successful Clinical Research" in Section I.

**Manipulate Variables and Values**

*Time Intervals.* To interpret patient information meaningfully, an *index time for study entry* must be established for every patient. The reason is the central place of date:time in medicine. Thus, in a system of longitudinal data entry at the time of patient care, past, present, and future are defined in terms of this index time. For surgeons, fortunately, this is often the time of an operative procedure. It is more difficult in medical situations to define, say, onset of disease; often, date of diagnosis or patient encounter is used. Once index time for study entry has been determined, then, using dates for each data element, one can determine if there have been previous events, such as MIs, how many of these have occurred, and the interval from the most recent to the index time. All items in what we commonly think of as "past medical history" are defined in terms of this index time for study entry.

One of the most common requirements is to compute *intervals* between dates. For example, the age of a patient at index time is calculated from index time and date of birth. Follow‑up intervals are similarly computed from dates. A common error is attempting to manually calculate intervals between dates and index time. This is rarely accurate and should be done by computer.

*Indicator Variables.* Indicator variables are always required. These may simply be the translation of a variable whose value has been coded as YES or NO into the numbers 1 and 0, respectively. A cardinal rule to avoid ambiguity, human error, and misinterpretation is that the computer variable name of an indicator variable must always be the one indicated by a YES or 1. Thus, in forming an indicator variable from a primary variable called SEX with values of MALE and FEMALE, one would name the indicator variable MALE with values of 1 for male, and 0 for female. An indicator variable called SEX or GROUP is ambiguous and should not be used as an analysis variable, because it is not self‑documenting.

Another common requirement is to form *multiple indicator variables* from a single variable containing values from a nonordered list. These list variables often are represented by a set that allows selection of multiple items from the list. Typical list variables are diagnoses or type of operation. A nonordered (polytomous) list variable is not interpretable in many types of data analysis (the exception is mutually exclusive lists, for which polytomous methods are useful; see "Logistic Regression Analysis" in Section IV). Generally, a variable useful for data analysis from such list variables must take on at least one of three values: 0 (NO), 1 (YES), or blank (MISSING). However, in many cases the medical picklist can be so long that in general clinical practice, only positive findings are recorded and all the rest (e.g., thousands of possible diagnoses) "dismissed," sometimes called "coding by exception."

When it comes to data analysis, however, we often need indicator variables for all list items that identify more than YES (or 1). Generally, the assumption is made that if a list item is not selected, the patient does not have that condition or procedure. However, it is possible that they did, but (1) the list item was added recently and so was not collected at index time, (2) the data abstractor could not find the item, forgot to look for it, or was distracted and did not return to find it, or (3) the item was recorded in a previous clinical record that was not retrieved by the criterion used to gather the electronic data set.

Such ambiguities can be avoided to some extent for a particular discipline by recording and abstracting important data elements using individual values for variables. For example, one may wish to have unambiguous information on the comorbidities diabetes (and its treatment); preoperative dialysis for chronic renal failure; prior MI (perhaps with date or a count of the number experienced); prior stroke; carotid artery and peripheral artery disease; chronic pulmonary disease; and the like. Rather than making them items in a long list of variables, create individual variables whose values of YES or NO must be explicitly entered. An alternative is to have multiple missing value indicators, representing by default "not yet found," but then including the extremes of "pending" and "completely absent," "don’t know," "lost chart," "illegible," "invalid response," "refused to answer," and "not applicable" (e.g., child relation of parent fields to which the answer is NO, or all smoking history variables for a person who never smoked).

No matter the coding chosen, it is highly likely that there will be parent–child relationships, explicit or implied, that will lead to pseudo‑missing data. For example, a child of diabetes = YES may be a checklist of pharmaceuticals for treating diabetes. If none is checked, it may be because diabetes = NO; one should then impute a 0 for each of the pharmaceuticals. Similarly, if only insulin, for example, is checked, the others should be set to zero. Depending on the construct schema of the database used for data abstraction, this can be an easy or difficult task, but what is always required is to think about smart imputation when you encounter missing ("null") values in a data set.

*Naming Variables.* We advocate for a disciplined common naming convention for variables that is used across all studies, as opposed to an ad hoc approach. These common names are defined in a data dictionary or ontology. In our clinical research unit, two‑letter prefixes and suffixes are used in part to naturally organise variables and for procedural studies to indicate temporal relations. For example, medical history names have the prefix hx, time intervals iv, surgical procedures sp, transcatheter procedures tp, and postoperative po.

With this disciplined approach, other data analysts, future research fellows, and investigators can readily understand the analysis data sets.

**Screen and Scrub.** After intervals and indicator variables are created, data screening is performed. If negative intervals are found, dates or times need to be investigated and corrected in original sources. Impossible combinations of variables may be found, such as a "normal" aortic valve said to have a 100‑mmHg peak gradient and valve area less than 1 cm<sup>2</sup>. Parent–child relations are verified, particularly if the database has inadvertently overlooked constraining such relations. For example, specifying an aortic valve prosthesis should be a child variable of a parent variable for "aortic valve replacement." Inadvertent redundancies must be resolved if they disagree.

Inconsistencies in applying definitions from the data dictionary are reported to the investigation team for resolution, and the iterative process is repeated. This process is often discouraging to the novice investigator who assumes that all data (particularly those personally extracted) are flawless.

Just as important as improving accuracy of the data set is evaluating the quality of each variable by this screening and scrubbing process. One may find that information is too often unavailable in medical records to trust the variable, and it is dropped. One may also find that interpretation of the clinical condition has been so variable, such as heart failure, that the values gathered are not reproducible. Either a better surrogate has to be found or the data element dropped from further consideration.

In times past, continuous‑variable data screening has consisted of producing summary tables of means, standard deviation, medians, minimum, maximum, selected percentiles, and number of missing values; quantitative variable data screening has consisted of tables of values and missing data counts. We have found these of limited value in discovering "warts" in the data. What we now do is produce pages of "postage stamp" scattergrams of every continuous variable that includes all data points, usually plotted against date of operation, and rug marks for missing values (Fig. 7.5). These may reveal "outliers" that may be data entry errors, floor or ceiling effects, or an admixture of different units of measurement that need to be normalised to one measurement scale. For binary variables, we recommend two types of "postage stamp" pages: one of actual count (Fig. 7.6A) and a second one of percentage (Fig. 7.6B). These may show missing data, gaps in the data (Fig. 7.6C), different patterns of data collection, and many other anomalies that are not evident if just numbers and percentages are shown in a table. Ordinal data are displayed as stacked plots (Fig. 7.7).

In addition to these individual data checks, we routinely plot height versus weight to find "skinny giants" or "fat midgets," along with graphs of other highly correlated variables. These drive us back to data sources to determine what the problem is and correct it, or if the cause seems to be an error in clinical recording, setting the value to missing.

It is important that corrections of errors discovered in the data anywhere along the way be fed back to the original database and the data re‑exported. In this way, database quality will be constantly improved. Ideally, the change in the primary data will be documented by an audit trail.

**Managing Missing Values.** In addition to missing values from parent–child relationships, in any study there are likely to be values for some variables that have not been recorded. Most statistical procedures eliminate entire observations (e.g., patients) for which any data requested for analysis are missing. In medical data analysis, however, one is more likely to introduce bias by eliminating all data on an entire patient than by substituting a value for the missing data that can be shown not to importantly bias the analysis. The process is called *missing value imputation*.

Although the literature on managing missing data is extensive, much of it is directed toward survey investigations in which entire survey instruments have not been returned. The general directive for such data is to eliminate records for nonresponders. In clinical research, missing data are most commonly sporadic or systematic (block missing) for some specific time segment (e.g., missing magnetic resonance imaging data before the introduction of that technology). These common types of missing data should be managed in a different way from those of surveys.

*Sporadic Missing Values.* For sporadic values missing in a tiny proportion of patients, it is reasonable to substitute (impute) the mean value for all patients with nonmissing data (called *non‑informative imputation*). Thus, if 1% of patients are missing values for ejection fraction, the mean value may be substituted.

If there are at least five outcome events associated with patients having sporadic missing values for a variable, a dichotomous (0,1) missing value indicator is created and forced into all models in which the primary variable is incorporated. If the indicator variable is not statistically significant, it is likely that the imputation has been non‑informative with respect to outcome. If it is significant, the indicator variable both adjusts for this and serves as a warning that additional work must be done, such as use of informative imputation.

Informative imputation capitalises on redundancy in medical information. A multivariable equation is generated (see "Multivariable Analysis" in Section IV) for the variable of interest but using only patients for whom values are not missing. A value is predicted from this equation for the patient with the value missing, and this is the imputed value. Missing value indicators are just as germane for informative as for non‑informative imputation.

Yet another strategy is *multiple imputation*. Briefly, a set of randomly chosen values is used for imputing missing values for each patient and analysis is performed, followed by another set of values and analysis. This process may be repeated as many as 200 to 1000 times, and the many analyses summarised. More commonly, an initial investigation data set is constructed and used for preliminary model building (see "Multivariable Analysis" in Section IV). This is followed by applying that preliminary model to additional imputed data sets and aggregating the results.

*When* to impute missing values by whatever method is chosen turns out to be important: transform, then impute. As noted in "Calibration of Continuous Variables" under "Risk Factor Identification" in the Section IV discussion titled "Multivariable Analysis," the scale of continuous variables may have to be transformed to meet model assumptions (linearising transformations). It is important that transformations first be performed, followed by missing value imputation, as documented by von Hippel. Note that one advantage of nonparametric machine learning algorithms such as random forests is that such transformations of scale need not be done, and, indeed, partial dependency plots will reveal any nonlinearities (see "Classification Using Machine Learning" in Section IV).

For some forms of nonparametric machine learning, specialised types of missing value imputation are used, often particularly focused on 100% missing values, such as social media clues used by retail establishments to identify individuals for selective person‑specific advertising.

*Systematic Missing Values.* Systematic missing values occur under two conditions that can be managed similarly. First, a value may be inapplicable. For example, in a study of mitral valve surgery, values for various repair techniques are inapplicable to patients receiving a prosthesis. Second, some test may come into use partway (in calendar time) through a study, or information may not have been collected about some variable until a certain calendar date. For such patients, we suggest that missing data be managed as "interaction terms." By this we mean that systematic missing values be set to zero (0). Then a missing value indicator is generated: 1 for patients with systematic missing values and 0 otherwise. Both variables are linked in all analyses. This makes interpretation of the models realistic, although it is a strategy that is computationally close to non‑informative missing value imputation. A drawback is that the missing value indicator may become an unrecognised surrogate for temporal trends in the data if the block missing data are concentrated among patients early in the study.

**Organise Variables for Analysis.** Once the aforementioned steps have been achieved, often iteratively, the result is a final data set in the format needed for analysis. However, one further step remains: organising variables deemed suitable for analysis in a medically meaningful way. The reason for this is the importance we place on *informed and supervised data analysis*. Those analysing the data must "know the data" just as the investigator knows the data. Not every variable has equal importance for analysis. For example, quantitative ejection fraction is "better data" than a qualitative assessment of left ventricular function on a coarsely graded scale; creatinine level at surgery contains more data than a diagnosis of renal failure; individual components of cusp morphology in atrioventricular septal defect contain higher information content than Rastelli type.

Not every variable is of equal reliability, but medical information tends to be redundant, so more reliable surrogates should be sought and analysed. Many variables are highly correlated and may be of equal reliability, such as height, weight, body surface area, and body mass index (indeed, the latter two are calculated from the former two). Therefore, if such variables are equally associated with an outcome, and are naturally colinear, one may arbitrarily select the most reliable or easily measured representative of that concept (in this example, the concept of body size).

The data management team, in collaboration with the investigator, must then compile a final list of *analysable variables*. These should be grouped in a medically meaningful fashion that aids data analysis. A suggested grouping might be as follows, although it will vary from study to study:

- Demographics (age, sex, body size, social determinants of health)
- Symptoms (functional status, angina class)
- Ventricular function (ejection fraction, number of previous MIs, interval from last MI to surgery)
- Pathophysiology and etiology (grade of mitral valve regurgitation, etiology of valvular regurgitation)
- Coronary artery anatomy and disease (degree of left main disease and that of each coronary system, dominance)
- Other cardiac comorbidity (previous cardiac operations, atrial fibrillation)
- Noncardiac comorbidity (smoking history, creatinine, pulmonary disease, diabetes, albumin level, organised by organ system)
- Preoperative management (preoperative temporary mechanical circulatory support for haemodynamic instability, intravenous nitroglycerin for unstable angina)
- Cardiac procedure (CABG, aortic valve replacement, mitral valve repair)
- Support techniques (duration of aortic clamping, use of warm substrate‑enhanced induction cardioplegia, duration of circulatory arrest, duration of cardiopulmonary bypass)
- Experience (date of operation, surgeon)
- Outcome, in‑hospital events (occurrence of various complications, hospital death, length of postoperative stay)
- Outcome, time‑related events (all‑cause mortality, interval from surgery to death or censoring)
- Longitudinal data (echocardiographic findings after valve operations)
- Missing value indicator variables
- Interaction terms (organised according to previous schema)

A practical way to implement this organisational structure is to isolate programming code in the form of a computer macro that contains the list of available variables for analysis and a place for those analysing the data to insert code for imputing missing values, transforming the scale of variables, forming additional indicator variables, and performing other useful data manipulations. This strategy guards against human error in data analysis by isolating to a single location all data manipulation used in the analysis.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Descriptive Data Exploration</summary><div class="details-content">

After the analysis data set has been constructed, data are explored by producing simple descriptive tables (sorting and tallying) and simple statistics about continuous variables, scatterplots of variables, and other exploratory data analyses. To understand this process, some appreciation of numeric data is necessary.

<details class="med-details"><summary>
  
#### Numbers</summary><div class="details-content">

*Accuracy and Precision.* Because both calculators and computers express numbers to many digits (Box 7.7), it is necessary to know a set of rules for compaction and expression (display) of numeric data. The format in which a numeric value is expressed has implications. The number 493, for example, implies that the *truth* is somewhere between 492.5 and 493.5 (accuracy), and that the scatter in repeated measurements of the number (precision) is no greater than that explicitly expressed (Box 7.8). The number 492.8 implies that the truth is somewhere between 492.75 and 492.85, and 492.76 implies that the truth is somewhere between 492.755 and 492.765. This last numeral to the right (right‑most digit) explicitly indicates that the accuracy is much greater and the precision much less than when the number is 493 or 490.

*Rounding.* In computation and computer storage, all available digits of numbers displayed or recorded by measuring devices should be retained. It is only at the last step of numeric presentation that numbers are rounded (Box 7.9). In presenting numeric information, numbers should be rounded in such a way as to reflect their precision or reproducibility, although consistency within tables is also important.

*Tabular Presentation.* Numbers are often presented in tabular form that indicates distribution of data between the extremes of a continuous variable (e.g., patient age). Such tables should be prepared so that positioning of any point along the continuous variable can be *unambiguously* determined. In this text, intervals between extremes of a continuous variable are indicated by symbols of inequality (see Table 7.5). This method of presentation of tabular information is mathematically conventional (Box 7.10) but not conventional for medical publications, where ambiguity often abounds.

<details class="med-details"><summary>

#### BOX 7.7 Expressing Numbers</summary><div class="details-content">

**Digit** — one of the 10 Arabic number symbols, 0 through 9. Digits are also called *numbers*, *numerals*, or *integers*.

**Number** — a series of digits, separators (commas, decimal points), and other notations (see "Scientific Notation") that together represent a numeric quantity.

**Even Numbers** — Arabic numerals beginning with 0, 2, 4, 6, 8... (divisible by 2 without remainder).

**Odd Numbers** — Arabic numerals beginning with 1, 3, 5, 7, 9... (divisible by 2 with remainder exactly 1).

**Decimal Format** — numeric system based on multiples of 10 as the fundamental unit (base 10). Each place is a multiple of 10. The decimal point separates the units place from the tenths place.

**Decimal Place** — position of digits immediately to the right of the decimal point.

**Significant Digit** — digits of the decimal form beginning with the leftmost nonzero digit and extending to the right, implying that all digits to the right are warranted by the measuring device or statistical properties.

**Scientific Notation** — numbers from 1 to 9, followed by a decimal point, remaining significant digits, multiplied by a power of 10 (e.g., 3.7×10⁻⁴).

**Leading Zero** — zero placed before a decimal point that is not a significant digit; used to separate a negative/positive sign from the decimal point. Probabilities (including P values) are increasingly displayed without a leading zero.

</div></details>

<details class="med-details"><summary>

#### BOX 7.8 Accuracy Versus Precision</summary><div class="details-content">

**Accuracy** — absence of systematic error of measurement (bias) from the "truth." It is an expression of "rightness."

**Precision** — ability to provide the same answer in repeated measurements. It is an expression of "exactness."

These terms are not synonymous. Repeated measurements may have scatter (imprecise) but average to the truth (accurate). Alternatively, they may be precise (little scatter) but inaccurate (uncalibrated).

</div></details>

<details class="med-details"><summary>

#### BOX 7.9 Rounding Numbers</summary><div class="details-content">

**Step 1: Determine the Number of Digits to Save** — suggested by precision of the measuring instrument and by the standard error of the mean value or proportion. Find the first significant digit of the standard error; round the mean/proportion to that place.

**Step 2: Look for Exceptions** — if the first significant digit of the standard error is 1, save one additional place; for percentages between 0%–10% or 90%–100%, keep at least two significant digits; within a single contingency table, consistency is desirable.

**Step 3: Round** — remove digits from the right side. If the first digit to be dropped is >5, round up; if <5, round down; if exactly 500…0, round to the nearest even digit.

</div></details>

<details class="med-details"><summary>

#### BOX 7.10 Inequalities</summary><div class="details-content">

- `<` less than (3 < 4)
- `>` greater than (5 > 3)
- `≤` less than or equal to (systolic BP ≤ 130)
- `≥` greater than or equal to (diastolic BP ≥ 80)
- `30 ≤ x < 40` — x is ≥30 but strictly <40 (unambiguous, unlike "between 30 and 40").

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Descriptive Statistics</summary><div class="details-content">

Descriptive statistics are numbers used to summarise values for a specific variable recorded for a group of patients (*sample*); nomenclature is given in Box 7.11. Variables fall into two broad categories for which different methods and expression of summarisation are appropriate: (1) *categorical* and (2) *continuous*.

Categorical variables take on a small number of values. If they take on just two (e.g., YES, NO), they are called *dichotomous* variables. If they have values that are ordered (e.g., none, mild, moderate, severe), they are called *ordinal* variables. If they are just a list (e.g., type of valve prosthesis), they are called *polytomous* variables.

Continuous variables take on a theoretically limitless number of values, although these values may have natural constraints (e.g., age, which cannot be negative). Their degree of granularity may vary (e.g., age may be calculated in whole years in adults, but in days or even hours [higher granularity] in neonates).

<details class="med-details"><summary>
  
##### Categorical Variables</summary><div class="details-content">

**Dichotomous.** Descriptive statistics for dichotomous categorical variables include simple counts (i.e., a count of the number of times the variable was YES [or 1] or NO [or 0]): How many cases were performed? How many men and women were in the study? How many patients died after operation? Summary counts are of limited value, however, because they do not reflect the size of the sample. Therefore, a summary statistic can be formulated that normalises the counts to a standard denominator, commonly 100 (percent). This is a probability parameter estimate, so it not only reflects what is experienced within the sample but also begins to give insight into characteristics of the population (Box 7.12).

**Ordinal.** Each value of an ordinal variable bears a strictly increasing or decreasing (monotonic) relation to all other possible values. For simplicity, it may be tempting to group some of these values together—forming a less granular dichotomous variable that lumps NYHA classes I and II versus III and IV, for example. This is an information‑losing transformation of scale that should be done only if outcome is truly found by analysis not to follow the ordinal scale but to suggest just two groups of patients, or if one or more categories is sparse.

When ordinal variables are analysed with respect to outcome, it is important to use statistical methods that are appropriate for ordered values (trend statistics) rather than for lists (tests of independence of categories). This must be communicated to the data analyst.

**Polytomous.** Variables with values that are simply a list (complications after operation, type of valve prosthesis) can be counted, but special mention must be made as to whether the counts represent mutually exclusive categories. A list of types of prosthesis used is likely to be mutually exclusive (a patient can fall into only one category), but a table of complications is unlikely to be so (a patient can experience more than one complication). In presenting lists, all categories should be represented, including number of missing values and whether some categories have been coalesced (e.g., under "other").

List variables are often useful for analysis if they are mutually exclusive. Otherwise, the list should be decomposed into a set of dichotomous variables for each category.

</div></details>

<details class="med-details"><summary>
  
##### Continuous Variables</summary><div class="details-content">

The other broad category of variables is continuous, for which each patient in a study (sample) may have a different value (e.g., age, weight, ejection fraction). Thus, the raw data are rarely published, because each patient or subject in a study is likely to be unique in regard to continuous variables, making any tabular presentation unwieldy unless the number of patients and number of variables are small. Summarising statements may be made of the raw data by one of several techniques.

A commonly used summarisation of raw data is a simple table with patients grouped into "nice" ordered categories. A *histogram* is a plot of such a table (Fig. 7.8A). Another method of constructing a simple table is to sort patients into several groups of equal number, even if the width of the range of values in each group is different. Because the number of such groups was originally 10, these are called *decile tables*.

Yet another alternative is to divide patients into *percentiles*, stating the value of the variable at these percentiles as follows. Patients or subjects are first sorted by (generally) increasing magnitude of the variable under consideration (e.g., by increasing age). Then the number (or more commonly the proportion) of patients with values less than or equal to each value is calculated. For example, if there are 21 patients and each is a different age at operation, patients are first sorted from youngest to oldest. No patient is younger than the youngest one (0/21, 0%, or minimum); 1/21 are as young or younger than the youngest (4.8%), and for these data, this is also the 5th percentile; 2/21 (9.5%) are as young or younger than the second youngest patient, and this is also the 10th percentile. The middle value of age, that of the 11th patient in this list, is called the *median* or *50th percentile*. All (21/21, 100%) are as young or younger than the oldest. A *cumulative distribution plot*, produced easily by computer but laboriously by hand, presents all the raw data in this percentile format (Fig. 7.8B).

Alternatively (and more commonly), a value is found below which a stated proportion of patients have that value or a lesser one (100 times that proportion is the percentile). For example, the *median* is the 50th percentile. This means that half the patients have a value for the continuous variable below the median, and half have values greater. For consistency, one might also state the 15th and 85th percentiles, as they correspond to 70% confidence limits (CLs; see "Confidence Limits [Intervals]" in Section IV). More commonly, 25th and 75th percentiles (quartiles) or 10th and 90th percentiles are used, which summarise the middle 50% of data.

This method of summarising data is called *nonparametric* (see Box 7.12). Beyond such simple counting (percentages and percentiles), more abstract methods are often brought into play to describe continuous data. The methods have in common a process whereby raw data on a sample of patients are used to estimate values of *parameters* of mathematical equations. The most familiar of these is the *mean*, which is estimated as the summation of all values of the continuous variable (e.g., age, pulmonary artery pressure) divided by the number of people or observations (*n*). The rationale for using the mean is that it provides an estimate of the *central tendency* of the data and a characteristic of the population studied. If the data are distributed perfectly symmetrically in the form of a bell‑shaped curve, the mean is exactly at the midpoint of the data range (see Fig. 7.8A). It is also the most frequently occurring number (*mode*), with half the patients above it and half below (*median*) (see Fig. 7.8B).

The derivation of averages, or means, was begun by astronomers centuries ago. They thought that the scatter in their data was from observational error or imprecision, and they used means, or averages, in an attempt to obtain true values (accuracy). Later, Gauss discussed and described the symmetric *normal distribution curve*, which actually was described earlier by DeMoivre (Box 7.13).

![](_page_36_Figure_2.jpeg)
![](_page_36_Figure_3.jpeg)

**FIGURE 7.8** Distribution of a continuous variable, age at operation. (A) Histogram of age at operation of 102 patients undergoing coronary artery bypass grafting. Approximately 30% were 50 to 55 years of age at operation, 25% were age 55 to 60, and lesser percentages of patients were older or younger. (B) Cumulative distribution plot of age at operation in these 102 patients. Vertical axis shows percentage of patients coming to operation at or younger than any given age on horizontal axis. It also gives directly the percentile of patients coming to operation by a given age: Median is the 50th percentile. S shape of this particular plot suggests a normal distribution; any other shape would suggest a different distribution.

The mean is the easiest statistic to calculate. Unfortunately, it is not a robust measure of central tendency. If many infants and only one or two adults are in a study, average age is greatly exaggerated by the few adults. A more robust measure of central tendency is the median. Whether or not the sample data are distributed in a Gaussian‑type bell‑shaped curve (see Fig. 7.9 and Box 7.13) may be tested by such statistics as the Shapiro‑Wilk *W* statistic for small *n* (e.g., 50 or less) and the Kolmogorov‑Smirnov *D* statistic for larger samples. The skewness of the data (rightward or leftward asymmetric tail) and their kurtosis (unusual peakedness of the distribution of values) are also tested.

Thus, in addition to an estimation of the population mean, some measure of *dispersion* (variance, spread, scatter) of values is needed. One such measure is the *standard deviation*, the name of the second parameter of the Gaussian distribution equation (see Box 7.13). It refers to variability from subject to subject or variability of individuals within the sample and is used to determine whether an individual is "within limits of normal." Standard deviation is necessary for comparison statistics. For example, an individual’s standard deviation from the mean regarding a particular measured variable (commonly called *z*) is often useful. This is calculated from the difference between the measurement for the individual and the mean normal value divided by the standard deviation. A *z* may be negative or positive and has no units.

However, if the distribution of data values does not conform to the normal distribution, then reporting two model parameters of the normal distribution, namely mean and standard deviation, represents a mismatch between the data and the model of the data, called model misspecification. Thus, for a continuous variable that is strictly positive (and nearly all of them in medicine have only positive values), if the standard deviation is larger than the mean or even close to it, the data are skewed (Table 7.6 and Fig. 7.10), and median and selected percentiles must be provided instead to accurately summarise the distribution of data.

<details class="med-details"><summary>

#### BOX 7.11 Statistical Nomenclature</summary><div class="details-content">

**Population** — the entire set of things with specified attributes.

**Sample** — one or more things with specific attributes belonging to a population.

**Proportion** — number having some attribute of interest divided by the number in the sample.

**Percent** — proportion multiplied by 100.

**Parameter** — a constant used to characterise some attribute of a population (e.g., mean, regression coefficient).

**Variable** — an attribute that can take on different values from one thing to another.

**Prevalence** — frequency of occurrence of some factor, characteristic, event, or incident in a group.

**Incidence** — frequency of occurrence *per unit of time* (e.g., hazard function).

**Rate** — quantity per unit time; synonymous with incidence in the context of events.

</div></details>

<details class="med-details"><summary>

#### BOX 7.12 Parametric Versus Nonparametric</summary><div class="details-content">

**Nonparametric** — a statistical method that summarises data without using an empirical or biomathematical model (e.g., median, Kaplan‑Meier survival estimates).

**Parametric** — a statistical method that summarises data in terms of a model (e.g., mean and standard deviation, coefficients of a regression equation). Numeric estimates of constants in these models are called *parameter estimates*.

</div></details>

<details class="med-details"><summary>

#### BOX 7.13 Gaussian Distribution</summary><div class="details-content">

The equation of the bell‑shaped *Gaussian (normal) distribution* curve is:

$$y = \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{(x-\mu)^2}{2\sigma^2}}$$

where π ≈ 3.14159, e ≈ 2.71828 (base of natural logarithms), σ is the standard deviation, μ is the mean, x is a value of the variable, y is the probability of occurrence of x.

**Standard Deviation** — the Gaussian distribution parameter representing scatter of individual values from the mean. It is a descriptive statistic.

**Standard Error** — the standard deviation of the mean; a measure of the precision of the mean. Obtained by dividing the standard deviation by √n.

</div></details>

<details class="med-details"><summary>

#### TABLE 7.6 Summary Statistics for Distributions (Shown in Fig. 7.10)</summary><div class="details-content">

| Patient Characteristic | Mean ± SD | 15th/50th/85th Percentiles | Distribution |
|------------------------|-----------|----------------------------|---------------|
| Age at surgery (y) | 56 ± 15 | 40/57/71 | Normal |
| Preop creatinine (mg/dL) | 1.8 ± 1.7 | 0.76/1.1/2.8 | Skewed |
| Preop BUN (mg/dL) | 24 ± 18 | 10/18/37 | Skewed |
| ICU length of stay (h) | 143 ± 214 | 25/69/237 | Skewed |

###### *BUN,* blood urea nitrogen; *ICU,* intensive care unit; *Preop,* preoperative; *SD,* standard deviation.

</div></details>

![](_page_38_Figure_6.jpeg)
![](_page_39_Figure_3.jpeg)

**FIGURE 7.10** Illustration of a normally distributed variable and three skewed distributions. (A) Probability density functions skewed "to the right" (long tail to the right), typical of many medical variables. (B) Cumulative distribution functions corresponding to the area beneath density functions in A. "Normally" distributed values take on an S‑shaped curve, not so for skewed variables.

Other methods are available for summarising skewed data. One is to resort to a purely *nonparametric* (i.e., without equations, coefficients) description (e.g., using the median and its various percentiles). Another is to *transform* the data into a more normally distributed scale. For example, a logarithmic transformation is often useful; the resultant mean is called the *geometric mean*.

</div></details>

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
## SECTION IV: ANALYSES</summary><div class="details-content">

<details class="med-details"><summary>
  
### Historical Note</summary><div class="details-content">

Analysis, as expressed by Sir Isaac Newton, is that part of an inductive scientific process whereby a small part of nature (a phenomenon) is examined in the light of observations (data) so that inferences can be drawn that help explain that aspect of the workings of nature.

Philosophies underpinning methods of data analysis have evolved rapidly since the latter part of the 19th century and may be at an important crossroad. Stimulated in large part by the findings of his cousin Charles Darwin, Sir Francis Galton, along with Karl Pearson and Francis Edgeworth, established at that time what has come to be known as *biostatistics*. Because of the Darwinian link, much of their thinking was directed toward an empirical study of genetic versus environmental influence on biological development. It stimulated development of the field of eugenics (human breeding) and the study of mental and even criminal characteristics of humans as they relate to physical characteristics (profiling). The outbreak of World War I led to development of statistics related to quality control. Sir Ronald Fisher formalised a methodological approach to experimentation, including randomised designs, particularly in agriculture. The varying milieus of development led to several competing schools of thought within statistics, such as frequentist and Bayesian, with different terminologies and different methods. Formalisation of the discipline occurred, and whatever the flavour of statistics, it came to dominate the analytic phase of inferential data analysis, perhaps because of its empirical approach and lack of underlying mechanistic assumptions.

Simultaneously, the discipline of *biomathematics* arose, stimulated in particular by the need to understand the growth of organisms (allometric growth) and populations in a quantitative fashion. Biomathematicians attempted to develop mathematical models of natural phenomena such as clearance of pharmaceuticals, enzyme kinetics, and blood flow dynamics. These continue to be important today in understanding such altered physiology as cavopulmonary shunt flow. Many of the biomathematical models came to compete with statistical models for distribution of values for variables, such as the distribution of times to an event.

Advent of the fast Fourier transform in the mid‑1960s led to important medical advances in filtering signal from noise and image processing. The impetus for this development came largely from the communications industry, so only a few noticed that concepts in communication theory coincided with those in statistics, mathematics, and physics.

As business use of computers expanded, and more recently as genomic data became voluminous, computer scientists developed methods for examining large stores of data (see footnote a, p. 238). These included data mining in business and computational biology and bioinformatics in the life sciences. Problems of classification (e.g., of addresses for automating postal services) led to such tools as neural networks, which have been superseded in recent years by an entire discipline of machine learning.

In the past quarter century, all these disciplines of mathematics, computer science, information modeling, and digital signal processing have been vying for a place in the analytic phase of clinical research that in the past has largely been dominated by biostatistics (see footnote a, p. 238). Specifically, advanced statistics and algorithmic data analysis have conquered the huge inductive inference problem of disparity between number of parameters to be estimated and number of subjects (e.g., in genetics, hundreds of thousands of variables for n = 1). Advanced high‑order computer reasoning and logic have taken the Aristotelian deterministic approach to a level that allows intelligent agents to connect genotype with phenotype. It may be rational to believe that the power of these two divergent approaches to science can be combined in such a way that very "black box" but highly predictive methods can be explored by intelligent agents that report the logical reasons for a black‑box prediction.

Fortunately, those in cardiac surgery need not be threatened by these alternative voices but can seize the opportunity to discover how each can contribute to better understanding of the phenomena encountered in this medical discipline. For this reason, in this section, Dr. Hemant Ishwaran from the University of Miami in Florida has interjected a number of advanced concepts involving machine learning to complement the largely parametric methods presented.

</div></details>

<details class="med-details"><summary>
  
### Overview</summary><div class="details-content">

This section highlights (1) the important statistical concept of dealing with *uncertainty*, illustrating it with CLs, P values, and measures of importance; (2) the increasingly important signal processing concept, *multivariable analysis*, illustrating it with logistic regression of early postoperative events; (3) *analysis of time‑related events*; and (4) longitudinal data analysis, which we present in terms of biomathematical concepts and machine learning. In Section VI, other specialised methods are highlighted, including some that are only peripherally related to serious clinical research but importantly affect cardiac surgeons.

</div></details>

<details class="med-details"><summary>
  
### Uncertainty</summary><div class="details-content">

Publication of an experience with triple valve replacement in 438 patients, among whom 8 (1.8%) died in the hospital, is in isolation a record of past achievement. Assuming honest reporting, there is no uncertainty about this result, but in and of itself, except for inviting applause or criticism, it has only historical value. Yet most persons expect past experience to be useful in predicting what can be accomplished in the present or the future, or in comparing outcome with that of other surgical options or continued medical therapy (see "Nihilism Versus Predictability" in Section I). That is, they recognise the future is uncertain, but they are not nihilists; they assume there is continuity in nature (see "Continuity Versus Discontinuity in Nature" in Section I). There are well‑tested theories and methods that quantify the uncertainty of inferring from the past the probable results in the future (assuming nothing changes), expressed as a degree of uncertainty. Quantifying the degree of uncertainty is a major part of making results of past experience useful.

<details class="med-details"><summary>
  
#### Point Estimates</summary><div class="details-content">

Point estimates represent the central tendency of a set of numbers that describe the characteristics or state of a sample (e.g., group of patients). The previously mentioned 1.8% hospital mortality is a point estimate. So are the mean value of age in a group of patients and percent survival 1 or 20 years after an operation.

Such numbers are generally derived from a study of a *sample* (see Box 7.11) of members of a *population* (e.g., everyone everywhere undergoing triple valve replacement). Yet the clinical study is nearly always performed to generalise beyond the sample examined.

Generalising from a sample to the population is fraught with uncertainty. Recorded, unrecorded, or unrecognised patient characteristics may occur at a different frequency in the sample than in the population (including your future patients). Surgeons use expert clinical judgment in decision‑making, and this introduces selection bias into the sample. Well‑recognised variance in institutional policies, processes, procedures, skill, and experience influence outcomes in ways that may be difficult to dissect and confound inextricably both outcomes and interpretation of outcomes. These suggest that inferences from sample point estimates alone are unlikely to be predictive of results in either the population or future samples.

Nevertheless, over the past quarter century, fewer and fewer cardiac surgery publications accompany point estimates with a measure of uncertainty.

</div></details>

<details class="med-details"><summary>
  
#### Confidence Limits (Intervals)</summary><div class="details-content">

CLs, the two extremes of a confidence interval (Box 7.14), are the fundamental statistics that quantify uncertainty of point estimates. It is not the underlying data that are uncertain (e.g., how many hospital deaths occurred in a defined group of patients), but inferences about the future based on known data from the past.

<details class="med-details"><summary>
  
##### Historical Note</summary><div class="details-content">

The questions "What is the risk of repair of postinfarction VSD in general?" and "Is risk with the method of repair I used higher or lower than that with the method another surgeon is using?" are similar to questions put to Galileo about the nature of chance, particularly games of chance, by 17th‑century gamblers. From those questions emerged the Laws of Chance, now known as the *theory of probability*. These laws are believed to apply to all things that can have more than one possible result. Many scientists believe that all natural phenomena, including those of the physical world, behave in accordance with the theory of probability. Events and phenomena of cardiac surgery behave in accordance with this theory.

Galileo showed that there is variability in sample point estimates. To illustrate, if the risk of death in the entire population of patients undergoing repair of postinfarction VSD by a given method is 33%, and samples of three patients are taken repeatedly, 0 deaths among the three would be experienced in 30% of samples, 1 death in 44% of samples, 2 deaths in 22% of samples, and 3 deaths in 4% of samples. In larger samples, results are less variable. For example, with samples of size 300, although the number of deaths experienced may still be quite variable, the proportion dying will be 30% to 36% in 70% of samples taken.

Because of this random variability in the sample estimates of risk, it is impossible to estimate the population parameter (see Box 7.11) with certainty (i.e., to know the risk in the entire population) from sample information. However, the pattern of variability in repeated sampling is well understood, and in most situations, it is possible to derive a formula to calculate the range of values that would contain the parameter for a specified percentage (e.g., 70%) of samples taken.

Users of CLs should be aware that this range of values for all proportions except 0.5 (50%) is asymmetric, in contrast to standard deviations, which are symmetric. Thus, we must report both the point estimate (probability) and lower and upper CLs.

As the sample size increases and more information becomes available, width of the confidence interval decreases (i.e., a more precise estimate is obtained). With a more precise estimate, the investigator is less uncertain where the population parameter lies, or in other words, what the "true" risk is. With a less precise estimate, the investigator is more uncertain.

</div></details>

<details class="med-details"><summary>
  
##### Computational Methods</summary><div class="details-content">

A number of methods have been developed to calculate CLs for proportions. *Bootstrapping* is a generalised method for obtaining CLs for any statistic. The original sample of data is randomly sampled in such a way that the patient can be sampled again (sampled with replacement) to form a data set equal in size to the original. Because of replacement, some patients will appear more than once in this bootstrap sample, and others will not appear at all. The point estimate (e.g., hospital mortality) is estimated in this sample. Then another sample is drawn in the same fashion, and this process is repeated as many as 1000 times. All the point estimates from each sample are sorted from smallest to largest, as in forming a cumulative frequency distribution (see "Descriptive Data Exploration" in Section III). The "best" estimate of the point estimate is the median value (50% above and 50% below). If 70% CLs are desired, then the 15th percentile is the lower CL and the 85th percentile is the upper limit (if 68.3% limits are desired, the numbers would be approximately the 16th and 84th percentiles). Approximating formulae are used in most statistical packages.

</div></details>

<details class="med-details"><summary>
  
##### What Level of Confidence?</summary><div class="details-content">

Any desired CL can be derived, such as 50%, 70%, 90%, 95%, or 97.5%. Choice of CLs to be expressed (called the *confidence coefficient*) depends on (1) use to be made of them, (2) consistency, or (3) convention, in that order of preference.

Most often in cardiac surgery, CLs are used as scanning tools to aid predictions and comparisons, either of proportions or time‑related depictions (see "Scanning Tool" later in this section). If great certainty is desired in the inference that there is a difference between two proportions of time‑related depictions, 95% confidence intervals may be chosen for the comparisons. If only moderate certainty is required that the evident difference is a true difference and would be found in larger samples, 50% confidence intervals might be chosen.

Most situations in cardiac surgery seem to lie somewhere between these extremes, so use of 70% CLs for most comparisons is reasonable. The interval is relatively narrow (specific), and although it is reasonably certain that truth lies within the CLs, there is a 15% chance it will be higher and a 15% chance it will be lower.

Seventy‑percent CLs (actually 68.3%) are equivalent to 1 standard error (SE), and 95% CLs are consistent with 2 SEs. For consistency, if other numeric estimates are presented to 1 SE, 70% CLs should be used, and if 2 SEs are presented, 95% CLs should be used. We emphasise consistency because we believe surgeons should become familiar with using CLs as a scanning tool; to use a tool effectively, it is helpful to be consistent among all measures of uncertainty. Conventionally, many statisticians use 95% CLs, even in the context of using 1 SE for most everything else, and 50% limits for nonparametric statistics. This makes no sense and is simply a habit, not a product of reflective thinking about the inferences or about consistency.

In a numeric presentation of differences, such as difference in survival curves (see Box 7.3), 90% CLs are equivalent in comparative inference to individual 70% CLs, a largely empirical finding. The reason is that a one‑sided confidence interval of a difference between two estimates is narrower than the sum of the 70% upper and lower CLs that just touch. This narrowness is compensated for by use of somewhat wider CLs (90%) of the difference.

</div></details>

<details class="med-details"><summary>
  
##### Scanning Tool</summary><div class="details-content">

Overlapping or nonoverlapping of CLs around two or more point estimates can be used as a simple and intuitive scanning method for determining whether the difference in point estimates is unlikely to be due to chance alone. They delimit the effect, and because they are accompanied by the magnitude of the effect, there is no confusion between statistical significance and magnitude of the effect, as there may be if P values are used (see "P‑Values" later in this section). When CLs are not overlapping, the difference is unlikely to be due to chance alone.

Because "nonoverlapping CLs suggest with a stated degree of uncertainty that a difference exists" is cumbersome, the phrase *evident difference* may be used to express the same idea (Appendix 7B). Nonoverlapping CLs are easily visualised in a nomogram in which the CLs are displayed around the point estimate expressing the association between variables. Within this context, it can be said with a stated degree of uncertainty that the effect of the independent variable compared with a baseline value becomes evident at the point at which the CLs just separate. However, in contrast to evident differences in a contingency table, this point is not easily seen in a nomogram, and it does not appear in an equation. The point at which evident differences appear in equations can, however, be calculated mathematically (see Appendix 7B).

We stress that comparing CLs in this way is a *scanning tool*. The classic method using P values involves computing the difference between the two proportions and testing the hypothesis that the difference is zero. Experience with scanning and P value methods has taught that when the lower 70% CL of one estimate just touches the upper 70% confidence of the other, the P value for the difference is between .08 and .1; when similar 95% CLs just touch, the P value is about .01.

</div></details>

<details class="med-details"><summary>

#### BOX 7.14 Confidence Limits, Confidence Intervals</summary><div class="details-content">

**Confidence Limits** — numbers at the two extremes of an interval that encompasses a stated percentage of the variability of a point estimate. In this book, we use confidence limits (CL) rather than confidence intervals (CI) to avoid confusion with cardiac index (CI), a familiar abbreviation used by cardiac surgeons.

**Confidence Interval** — interval encompassing a stated percentage of the variability of a point estimate.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### P Values</summary><div class="details-content">

The phrase "statistically significant," generally referring to P values, has done disservice to the understanding of truth, proof, and uncertainty. This is because of fundamental misunderstandings, in part because of failure to appreciate that all test statistics are specific in their use, and in part because P values are frequently used for their effect on the reader rather than as one of many tools useful for promoting understanding and framing inferences from data. In fact, P values are deemed by some to be unnecessary statistics and not worth the risk of misinterpreting or misusing them. They prefer CLs. Others cite machine learning alternatives.

<details class="med-details"><summary>
  
##### Definition</summary><div class="details-content">

In the context of hypothesis (or significance) testing, the P value is the probability of observing the data we have, or something even more extreme, if a so‑called null hypothesis is true (Box 7.15). Or, as stated by the American Statistical Association (ASA), "Informally, a P value is the probability under a specified statistical model that a statistical summary of the data (e.g., the sample mean difference between two compared groups) would be equal to or more extreme than its observed value." However, if you must have a formal definition, three of them are presented in commentaries within the ASA white paper by Deborah Mayo, Michael Lavine, Joseph Horowitz, and Valen Johnson.

Historically, *hypothesis testing* is a formal expression of English common law. The null hypothesis represents "innocent until proven guilty beyond a reasonable doubt." Clearly, two injustices can occur: a guilty person can go free or an innocent person can be convicted. These possibilities are termed *type I error* and *type II error*, respectively (see Box 7.15). Evidence marshalled against the null hypothesis is called a *test statistic*, which is based on the data themselves (the exhibits) and n. The probability of guilt (reasonable doubt) is quantified by the P value or its inverse, the odds [(1/P) – 1] (see Box 7.3).

Had the originators been raised under a different judicial system, perhaps a different pattern for testing hypotheses might have arisen. Specifically, the system does not judge how innocent a person is (the "alternative hypothesis"; see Box 7.15), nor does it test for equivalence, a very important matter for comparing pharmaceuticals and even alternative surgical therapies.

Some statisticians believe that hypothesis or significance testing and interpretation of the P value by this system of justice is too artificial and misses important information. For example, it is sobering to demonstrate the distribution of P values by bootstrap sampling. Furthermore, the magnitude of the P value is dependent on two factors: magnitude of difference and sample size. These individuals would prefer that P values be interpreted simply as "degree of evidence," "degree of surprise," or "degree of belief." We agree with these ideas and suggest that rather than using P values for judging guilt or innocence (accepting or rejecting the null hypothesis), the P value itself should be reported as degree of evidence. It is worthwhile considering the conclusion of the ASA white paper: "Good statistical practice, as an essential component of good scientific practice, emphasises principles of good study design and conduct, a variety of numerical and graphical summaries of data, understanding of the phenomenon under study, interpretation of results in context, complete reporting and proper logical and quantitative understanding of what data summaries mean. No single index should substitute for scientific reasoning."

</div></details>

<details class="med-details"><summary>
  
##### Calculating the P‑Value</summary><div class="details-content">

All methods for calculating P values have in common one or more point estimates, some measure of variability for each, some comparison statistic related to the point estimates (e.g., the difference or a ratio), an estimate of the variability of the comparison statistic, and size of the groups.

The test to be used is selected. This must be appropriate for the comparison. It is crucial that a biostatistician familiar with the data and desired comparison be the one to select this test and interpret the results. In general terms, this demands that a specific distribution of the difference or ratio be selected. From the difference or ratio, some measure of its variability and n, a number, is computed for the particular distribution selected, called the *test statistic* (see Box 7.15). There are a number of test statistics, which means there are a number of prescribed, defined, specific methods (tests) for calculating the test statistic. The statistician selects the test statistic to be used on the basis of the fit of the data to the assumptions underlying the test.

The magnitude of the computed test statistic among the hypothetically determined distribution of values for the test chosen is determined. The area under the distribution curve (proportion of the total area) occupied by more extreme values of the test statistic is the P value, a number ranging from 0 to 1.

In the case of many test statistics, a family of distribution curves exists, and to determine the P values, one of these must be selected. The selection is based, more or less, on the sample size (n). By "more or less," we mean that some information content in the n may already have been "used up" in other calculations in the process and may not be available for computation of the P value. What is left, called *degrees of freedom*, determines the distribution curve selected.

The phrases *one‑tailed P value* and *two‑tailed P value* are commonly used. Which is appropriate depends on the research hypothesis being tested. When the hypothesis relates to differences in either direction ("different from zero"), a two‑tailed P value is used; when it relates to differences in only one direction ("less than," for example), a one‑tailed P value is used. A two‑tailed P value is always the same as or larger than a one‑tailed P value. Generally, in the work described in this book, two‑tailed P values are used.

</div></details>

<details class="med-details"><summary>

#### BOX 7.15 Hypothesis (Significance) Testing</summary><div class="details-content">

**Statistical Hypothesis** — a claim about the value of one or more parameters.

**Null Hypothesis** — a claim that the difference between one or more parameters is zero or no change (written H₀). It is the claim the investigator is arguing *against*.

**Alternative Hypothesis** — the "investigator’s claim," sometimes called the study hypothesis.

**Test Statistic** — a number, computed from the distribution of the variable to be tested in the sample of data, that is used to test the merit of the null hypothesis.

**Type I Error** — rejecting the null hypothesis when it is true (false negative). Probability designated α.

**Type II Error** — not rejecting the null hypothesis when it is false (false positive). Probability designated β.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Use of Expressions of Degree of Uncertainty</summary><div class="details-content">

Whether one uses CLs or P values, a decision must be made concerning the degree of certainty desired in the inference that A is different from B. Some have a slavish attachment to a certain P value, such as .05, or a certain width of CLs, such as 95%, as the yardstick for all situations. Sir Ronald Fisher wrote, "No scientific worker has a fixed level of significance at which from year to year, and in all circumstances, he rejects hypotheses; he rather gives his mind to each particular case in the light of his evidence and his ideas."

This discussion would be unnecessary if all sample sizes were moderately large and the number of events ample, providing adequate power (information content) for all computations (see Box 7.4). In many clinical investigations, a large sample is simply not available, yet important decisions must be made on the basis of the inference generated. Then the cost of making a wrong decision based on an analysis, and the risk of overlooking or not finding a relation between two variables that in fact exists, play importantly in the decision regarding what P value to use (see Table 7.5 and Box 7.15). The greater the cost, the smaller the P value demanded.

An apparent contradiction to the foregoing discussion is the setting of so‑called humongous databases of hundreds of thousands or millions of patients. In this setting, the dependence of P values on n becomes glaringly apparent. Essentially in every comparison, no matter how small the clinical difference, P values are small. "All null hypotheses are false." In this circumstance, other measures of surprise must be devised for testing differences that take into account the magnitude of the difference.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Multivariable Analysis</summary><div class="details-content">

<details class="med-details"><summary>
  
#### The Necessity</summary><div class="details-content">

Surgeons have intuitively understood that surgical outcomes, such as hospital mortality, may be related to a number of explanatory variables, such as age or renal and hepatic function. However, when presenting a risk factor analysis of outcome for a group of patients, two reactions are heard, often from the same critic: (1) "Your analyses are much too complex, far beyond the comprehension of ordinary cardiac surgeons," and (2) "This is a very complex, multifactorial situation, and you have not begun to take all the things that could have influenced outcome into consideration." This contradiction reflects the cognitive structure of the human mind, as discussed in Section I. On the one hand, we perceive, understand, and store in our brains simplified models of reality; on the other hand, our conscious minds recognise that "things are often less simple than they seem."

To complicate matters, we generally know neither the cause nor the causal sequence that leads to a surgical failure, and that is what we want to know to make progress toward preventing future failures. The cause may in fact be buried in the clinical information and the data we have extracted therefrom, but we do not know if this is true and suspect we are ignorant of the real cause. Extensive cautionary literature on surrogate endpoints for clinical trials and how they can lead us astray fuel this anxiety. We need, perhaps, to be reminded that public health recommendations based on crude risk factors for the plague were effective in halting it and preventing its recurrence for 200 years until the causative organism and vector were discovered.

Faced with hundreds, perhaps thousands, of variables, the investigator seeks to find simple or dominant or stratospheric comprehension of the data. They want to discover the wood, not necessarily the trees (or branches and leaves, for that matter). Multivariable analysis (Box 7.16) is a set of methods for considering multiple variables simultaneously and for (1) identifying those that by some criteria are associated with an outcome, (2) estimating the magnitude of each variable’s influence in light of all others, (3) quantifying the degree of uncertainty of those estimates, and (4) revealing the relation among the set of variables so identified while (5) dismissing others either as noise or as so correlated with other variables associated with outcome that they either do not contribute further information or are so lacking in additional information content that their association cannot be determined.

</div></details>

<details class="med-details"><summary>
  
#### Historical Note</summary><div class="details-content">

Fisher understood the relation of outcome to possibly multiple explanatory variables when he wrote that the behaviour of a sample could be considered characteristic of the population only when no subsets within the population behaved differently. Yet the use of these ideas in a formal way in medicine emerged only during the last half of the 20th century. This is because multivariable analysis, particularly of events after cardiac procedures and more especially time‑related or longitudinal outcomes, involves considerable computational power. The mathematical models are generally nonlinear (Box 7.17), so solving for their parameters is (1) an *iterative process*, that is, a series of systematically directed mathematical steps that follow an algorithm or plan to find the best value of the parameter (often called a coefficient) and its variability by gradually closing in on it, and (2) a *mathematical process* in which computations for explanatory variables are performed simultaneously. Because the computational challenge is considerable, use of multivariable analysis had to await development of computers.

The first use of multivariable analysis to identify risk factors for *outcome events* in humans was probably the Framingham epidemiologic study of coronary artery disease. Two papers are landmarks in this regard. In 1967, Walker and Duncan published their paper on multivariable analysis in the domain of logistic regression analysis, stating that "the purpose of this paper is to develop a method for estimating from dichotomous (quantal) or polytomous data the probability of occurrence of an event as a function of a relatively large number of independent variables." Then in 1976, Kannel and colleagues coined the term "risk factors" (actually "factors of risk"), noting that (1) "a single risk factor is neither a logical nor an effective means of detecting persons at high risk" and (2) "the risk function...is an effective instrument...for assisting in the search for and care of persons at high risk for cardiovascular disease." In 1979, the phrase "incremental risk factors" was coined at UAB to emphasise that risk factors add in a stepwise, or incremental, fashion to the risk present in the most favourable situation.

Before the advent of multivariable analysis, stratification of the values of one or more potential risk factors was often used to search for association of risk with outcome. Although this is still of interest as a scanning method, it has serious disadvantages, including (1) loss of information by coarseness of stratification and (2) possibly erroneous inferences from the necessarily arbitrary nature of stratification. These dangers were well summarised by Kannel and colleagues, who stated that "while there is some convenience in dichotomising a continuous variable like blood pressure into high and low, one would prefer some method to take into account the exact value."

</div></details>

<details class="med-details"><summary>
  
#### Machine Learning for Multivariable Analysis</summary><div class="details-content">

Advances in machine learning for multivariable analyses evolved rapidly beginning in the late 1990s. Freund and Schapire introduced "AdaBoost" (adaptive boosting) for classification, a precursor to the now widely used "gradient boosting" method. A remarkable feature of AdaBoost was that it required little supervision and appeared to be immune to overfitting. In many experiments it was found to outperform traditional methods, especially in challenging examples where standard model assumptions failed to hold. The mathematical explanation for AdaBoost’s success, however, seemed very mysterious: The algorithm iteratively reweighted observations fitting in each iteration a simple "weak" learner (such as a tree) with higher weights given to those data points difficult to classify. This seemed intuitive, but a rigorous explanation of what it was doing was not clear at first.

Fig. 7.11 provides an illustration of how AdaBoost uses its weights to construct a classifier. Data were simulated from the circle in a square synthetic experiment (in this experiment, we have two covariates, x₁ and x₂, and the outcome is one of two classes: class one is a circle and class two is the outside of the circle inside a square). Stumpy trees with a depth of 3 were used for weak learners (trees are characterised later in this section). The figure shows how AdaBoost’s weights vary with number of iterations, m. As seen, weights quickly migrate from a uniform distribution to small and large values, where large values are observed near the classification boundary (where the circle touches the square). The last panel displays test‑set prediction error. Error drops substantially with only a few trees: This rapid effect is due to classifying easy cases, those away from the boundary, which make up the majority of the data. After that, AdaBoost spends its effort trying to improve classification for the hard to classify cases near the boundary, and the effect on reducing prediction error is much slower.

Many learning methods apply the principle of empirical risk minimisation. In many cases empirical risk equals the training error. For example, in regression the empirical risk is equivalent to goodness of fit, which essentially amounts to measuring how well the procedure performs in fitting the data. These procedures seek to minimise empirical risk and are constructed in a manner allowing them to fit flexible models while avoiding overfitting (this latter aspect of machine learning to avoid overfitting is called regularisation). Empirical risk minimisation is a well‑understood concept with good properties, but how then was it possible for AdaBoost to work so well? There seemed no reason to believe that AdaBoost was an empirical risk‑reduction strategy.

Surprisingly, researchers were later able to show that the weighting scheme used by AdaBoost was equivalent to fitting an additive stagewise learner. In fact, the algorithm was shown to be minimising a loss function nearly identical to that used in logistic regression. The term *stagewise* refers to a procedure that repeatedly refits residuals. Thus, AdaBoost repeatedly refits residuals, each time seeking to minimise a loss function and its associated empirical risk.

The insight that AdaBoost was actually performing risk minimisation quickly led to a unified treatment for general loss functions applicable to many problem settings. This unified treatment is now generally referred to as gradient boosting and is taken to be the modern standard for boosting. Just like AdaBoost, the idea is to repeatedly fit the data using weak learners. Gradient boosting, however, sets about choosing the weak learner using the principle of steepest descent, thereby directly attacking the issue of empirical risk minimisation head on. (See also "matching pursuit," which is a closely related idea.) The AdaBoost algorithm was originally proposed for classification. It constructs its classifier by using an additive expansion F_M = Σ_{m=1}^{M} c_m h_m where h₁, h₂, …, h_M are weak learners and F_M is the combined learner used for classification. Therefore, AdaBoost adopts the view of combining weak base learners for the purpose of creating a better classifier. A closely related idea is ensemble learning, which was another intensely studied area in the early development of machine learning. Researchers found, surprisingly, that a procedure’s performance could be significantly improved by combining its runs over different subsets of the data. The resulting averaged procedure was termed an ensemble (as an example, an ensemble classifier is a collection of classifiers whose votes are averaged). One especially successful procedure is bagging, which combines bootstrapped trees. Random forests refine the idea of bagging by introducing further randomisation into the tree construction. The averaged random trees result in a more accurate ensemble than bagging.

A characteristic common to the aforementioned procedures is that they can all be implemented with little supervision. Typically, only a few parameters, called tuning parameters, need to be determined, and choosing them wisely prevents overfitting. Tuning of parameters is the so‑called regularisation step needed when fitting a machine learner. For gradient boosting, the most important parameter is the number of iterations (in our circle in the square problem, this is the number of trees used); for random forests, they are the parameters specifying how a random tree is constructed, for example, how many random features to be selected when splitting an internal tree node or how large the terminal nodes (end of a tree) are. Importantly, a hallmark of these methods is their robustness to tuning parameters and that parameter tuning is generally easy to do in practice; typically, this is accomplished by using cross‑validation. Another hallmark is their ability to automatically learn from the data and find difficult‑to‑grasp relationships, such as interactions and nonlinear trends without human input. For this reason, these procedures are generally referred to as machine learning methods.

![](_page_45_Figure_8.jpeg)

**FIGURE 7.11** Circle in a square two‑class synthetic experiment using AdaBoost with stumpy tree learners with depth of 3. Shown are AdaBoost weights for iterations m = 1,2,3,4,5,6,10,50. Size of weights are proportional to size of points: Values near the boundary of the circle with the square are hardest to classify and receive the largest weights as m increases. Bottom right figure shows test set prediction error as a function of m (number of trees).

</div></details>

<details class="med-details"><summary>
  
#### Carrier of Risk Factors: Underlying Mathematical Model</summary><div class="details-content">

Multivariable analysis as described by the Framingham investigators requires a model (equation) that relates a placeholder for explanatory variables (generally one or more of the model parameters) to the dependent (outcome) variable. The equation may be a completely *linear* one; for these, iterative techniques are not required, but for most models of surgical outcomes the computations are large and for all practical purposes require a computer. The general term for such a model is a *regression equation* (see Box 7.17).

Logistic multivariable regression analysis is a *nonlinear* model that is illustrative for understanding the nature of the relation of risk factors to outcome in a medically rational fashion. Fig. 7.1A illustrates the relation between the absolute probability of a clinical event on the vertical axis and an expression of risk measured in logit units along the horizontal axis. The horizontal axis is the one related to risk factors. The relation is sigmoidal (S‑shaped). Notice that an increment of risk along the horizontal axis, if far to the left or right of the curve, is not associated with a perceptible increase or decrease along the probability scale. However, a small increment near 0 logit units is associated with a large change in probability.

To illustrate, imagine two patients. One is a strapping football player who is mugged on his way to a pharmacy late at night. He is stabbed in the abdomen, and his inferior vena cava is lacerated. Fortunately, a trauma centre is nearby, and he is rushed to surgery. His anxious parents arrive at the hospital about an hour after the incident and want to know "What are his chances, doctor?" Let us say that the injury moves the football player’s risk two units to the right on the logit scale. Before the incident, this robust individual was positioned far to the left on the logit curve, so his chances of recovery are good.

A week later, the second patient, a frail, elderly diabetic man, is walking to the same pharmacy for his insulin when he is stabbed in the abdomen, and his inferior vena cava is lacerated. He, too, is rushed to the trauma centre and into the operating room. An hour later, his anxious daughter arrives at the hospital and wants to know "What are his chances, doctor?" The fragile patient may already have been sitting near the centre of the logit curve, say at –1 logit units, before the incident. Two logit units of acute risk greatly increase his probability of hospital mortality.

These anecdotes emphasise that the models’ underlying composition makes good medical sense. They reflect what we mean by a robust patient, a fragile patient, and an unsalvageable patient. They reflect the reality that the identical risk factor may operate with respect to absolute risk differently, depending on the presence or absence of other risk factors, that is, where the patient is along the horizontal axis.

</div></details>

<details class="med-details"><summary>
  
#### Risk Factor Identification</summary><div class="details-content">

Given a mathematical model to carry risk factors (see Box 7.17), the next task is risk factor identification. It requires (1) screening of candidate variables for suitability in the analysis, (2) calibrating continuous and ordinal variables to outcome, (3) selecting variables related to outcome, and (4) presenting results in the format of incremental risk factors (see Box 7.16).

<details class="med-details"><summary>
  
##### Screening</summary><div class="details-content">

Screening candidate variables has two purposes: (1) to determine whether there are sufficient data (see Box 7.4) to be suitable in the analysis and (2) to understand a variable in relation to other candidate variables. Because for outcome events the effective sample size for analysis is the number of events, not the number of patients, a variable may not be suitable for analysis when it represents a subgroup of patients with too few events to evaluate. This represents a limitation of the study, not of methodology. Indeed, one is generally happy with a therapy associated with few events; however, it then makes sense that risk factors cannot be identified.

We do not screen variables to discover which ones relate individually to outcome. It is a common practice of many groups to ignore variables that are not univariably associated with outcome. However, there is a long history of occurrence of *lurking variables* (Box 7.18 and Fig. 7.12) that are found to relate to outcome only when (1) other variables that mask their importance are accounted for in the analysis or (2) they are suitably transformed (or coupled with nonlinear rescaling of themselves), indicating a complex association with outcome.

It is valuable to determine the pairwise correlation of variables. This will help one understand why many variables may be associated with outcome, but only a few are selected as risk factors. Medical data are highly redundant, sharing a great deal of information.

<details class="med-details"><summary>

#### BOX 7.18 Lurking Variables</summary><div class="details-content">

Lurking variables are those found to relate to some outcome or dependent variable (see Box 7.17) only after (1) other variables masking their importance are taken into account either by multivariable analysis or matched‑type analyses (e.g., using balancing scores) or (2) the lurking variable (if continuous or ordinal) is properly rescaled (e.g., transformed) so that complex relations are revealed, such as higher risk of mortality at both old and young age.

Fig. 7.12A shows survival in patients after exercise stress testing stratified according to long‑term aspirin use. Apparently there is no relation to survival. However, Table 7.8 shows that there are multiple differences in patient characteristics between these two groups of patients, with those taking aspirin being older, for example. Indeed, in multivariable analysis, the moment age is taken into account, a beneficial effect of long‑term aspirin is revealed. Fig. 7.12B shows survival in propensity‑matched pairs of patients (see "Clinical Trials with Nonrandomly Assigned Treatment" in Section I). The lurking benefit of long‑term aspirin use is clearly revealed.

</div></details>

![](_page_47_Figure_6.jpeg)

**FIGURE 7.12** Demonstration of a lurking variable. Survival after stress testing is shown on an expanded scale and stratified according to use and nonuse of long‑term aspirin therapy. (A) Risk‑unadjusted survival in entire cohort. Note similarity of survival. (B) Survival in propensity‑matched patients. Note dissimilarity of survival revealed when risk factors for death are balanced between groups. (From Gum and colleagues.)

</div></details>

<details class="med-details"><summary>
  
##### Calibration of Continuous Variables</summary><div class="details-content">

Continuous variables contain unique values for each patient and so are particularly valuable in analyses. For unclear reasons (statisticians uniformly decry the practice), many investigators stratify continuous variables into two or a few arbitrary categories, throwing away valuable information. This flies in the teeth of a fundamental philosophy of data analysis: continuity in nature (see "Continuity Versus Discontinuity in Nature" in Section I). Furthermore, to better understand the phenomenon one is studying, it is important to determine the shape of the relation of continuous variables (e.g., age, birth weight, creatinine) to outcome.

However, the scale on which a continuous variable has been measured or expressed may not coincide with a linear increase in risk. Nature does not know about man‑made rulers! Therefore, the appropriate calibration of the variable to outcome must be discovered. One method to accomplish this is to examine various *linearising transformations* (Fig. 7.13). However, the "perfect" transformation of scale may not coincide with the best one after other factors have been considered in a multivariable model. Thus, we rely on graphical methods, as in the figure, to obtain a set of similar transformations, and then include all transformed variable candidates in the selection process to be described. A promising offshoot of nonparametric machine learning techniques, such as random forests technology, is the generation of risk‑adjusted coplots and risk‑adjusted partial dependency plots that can suggest the shape of the relationship of these continuous variables with risk (Fig. 7.14).

![](_page_48_Figure_2.jpeg)

**FIGURE 7.13** Calibration of 1‑second forced expiratory volume (FEV₁) to risk of hospital mortality. Scale of risk is given on vertical axis (akin to logit units of Fig. 7.1), and eight groups of equal numbers of patients according to value for FEV₁ along horizontal axis. Their mortality, converted to the risk scale, is shown by each closed circle. (Eighth closed circle cannot be shown because there were no deaths in the eighth group with highest FEV₁s.) (A) Linear scale of FEV₁. Clearly there is a decreasing (more negative) value of risk at higher FEV₁ (simple regression line shown, with explained scatter for these points of 80%). (B) Inverse scale of FEV₁. Because of the inverse transformation, lower FEV₁s are to right of scale, and higher FEV₁s to left. Risk falls from left to right, unlike in A. There is now tighter correspondence of risk to this rescaling of FEV₁ (85% of scatter explained) than in the conventional scale of A. (From Blackstone and Rice.)

![](_page_48_Figure_4.jpeg)

**FIGURE 7.14** Risk‑adjusted partial dependency plot from a random forest analysis of operative mortality demonstrating the "shape" of its relationship to a number of continuous variables representing demographics and organ dysfunction.

</div></details>

<details class="med-details"><summary>
  
##### Variable Selection</summary><div class="details-content">

A seminal contribution of the Framingham Study investigators was the idea that in the absence of identified mechanisms of either disease or treatment failure, useful inferences for medical decision‑making, lifestyle modification, and programmatic decisions about avenues of further research can be gleaned by nonspecific risk factor identification. A direct consequence of the idea, however, is that for any set of potential variables that may be associated with outcome, there is no unique set of risk factors that constitute the best common denominators of disease or treatment failure. Therefore, different persons analysing the same data may generate different sets of risk factors. As a consequence, multivariable identification of risk factors has become an art that depends on expert medical knowledge of the entity being studied, understanding the goals of the research, knowledge of the variables and how they may relate to the study goals as well as to one another, identification of the quality and reliability of each variable, and development of different, often sequential, analysis strategies appropriate to each research question. Not all these issues of art or expertise will disappear, but there are substantial aspects of multivariable analysis that are yielding to science.

Naftel of UAB, in an important 1994 letter to the editor of the *Journal of Thoracic and Cardiovascular Surgery*, addressed nine aspects of multivariable analysis that contribute to obtaining different models (sets of risk factors). He called these "steps and decisions that may influence the final equation":

- Differing statistical models. For example, if time‑related events are being modelled, results using a Cox proportional hazards model (see "Cox Proportional Hazards Regression" later in this section) will differ from those using a multiphase nonproportional hazards model (see "Parametric Hazard Function Regression" later in this section).
- Differing approaches to missing data (see "Managing Missing Values" in Section III).
- Differing approaches to minimal information (see Box 7.4).
- Differing approaches to correlated data. Variables with similar information content should be chosen for maximal insight by the clinical investigator, not necessarily the statistician.
- Differing coding of data. Some may pay more attention than others to linearising transformation of continuous variables, to whether continuous or ordinal variables should be dichotomised or in other ways collapsed, or to management of interaction (multiplicative) variables.
- Differing approach to apparently incorrect data. True data outliers, handling of clearly imperfect data, improbable combinations of variables (e.g., apparently exceedingly short, very heavy patients as a result of misplaced decimal points or mixed metric and English units), and attitude toward whether or not a large sample negates errors are all decisions made during the screening process for multivariable analysis.
- Differing variable selection methods and P value criteria. This area is undergoing complete change through introduction of machine learning algorithmic methods. Even with new methods, however, a criterion must be arbitrarily established to differentiate what is signal from what is noise (P values, for example).
- Differing computer resources. Although even desktop computers rival the computational capacity of large‑scale computers of several decades ago, computer‑intensive methods may require high‑intensity parallel processing.
- Differing appreciations of the science. Unless data analysts work collaboratively with the surgeon‑investigator, analysis may be unrevealing. One cannot divorce the underlying clinical science from data analysis.

In all areas, new knowledge has been generated that is beginning to differentiate inadequate techniques from reasonable techniques and optimal techniques. Perhaps the more active area presently is "differing variable selection methods," and it is an important one. Part of the challenge is that variables may be thought to be risk factors because they are associated with a small P value, and other factors may be thought not to be risk factors because of larger P values, but both opinions may be erroneous (type I and type II statistical errors, respectively; see Box 7.15). There is therefore a need for a method that balances these two types of error. Closely coupled with this is the need for a statistic that measures the reliability with which a risk factor has been identified. Because one is analysing only a single set of data rather than many sets of data about the same subject, determining this reliability has been elusive. It is in the arena of machine learning that promising solutions have arisen to address this gap in knowledge.

<details class="med-details"><summary>
  
###### Variable Selection by Bootstrapping</summary><div class="details-content">

Thus, there is new thinking about what risk factor identification is. In thinking anew, we leave traditional statistical methodology out of the picture, and risk factor identification becomes an attempt to find *signal* (risk factors) in *noise* (other candidates). Important advances in pure mathematics (*logical analysis*) and machine learning (*algorithmic analysis*) are proving valuable for such diverse signal detection challenges as handwriting identification, genomic identification, and now risk factor identification. These techniques are evolving rapidly, and we will describe only the most basic here: bootstrap aggregation, or *bagging*.

Bootstrapping belongs to a class of methods that has been developed over the past 40 years. In 1983, an astonishing article entitled "Computer‑Intensive Methods in Statistics" appeared in the popular scientific literature. Its authors, Persi Diaconis and Bradley Efron from Stanford University, indicated that "most statistical methods in common use today were developed between 1800 and 1930, when computation was slow and expensive. Now, computation is fast and cheap. The new methods are fantastic computational spendthrifts...The payoff for such intensive computation is freedom from two limiting factors that have dominated statistical theory since its beginnings: the assumption that the data conform to a bell‑shaped curve and the need to focus on statistical measures whose theoretical properties can be analysed mathematically."

Efron and his group demonstrated that random sampling with replacement from a data set to create a new data set, resampling to produce perhaps thousands of new data sets, and combining the information generated from these many data sets can produce robust and accurate statistics without assumptions. His group called this technique *bootstrapping*, after the expression "pulling yourself up by your own bootstraps," because it reflected the fact that one could develop all the statistical testing necessary directly from the actual data simply by repeatedly sampling them.

These techniques have been applied to entire analytical processes, including multivariable analysis. In fact, one still has to pay attention to appropriate models, missing data, variable considerations, correlated variables, appropriate strategy, and so forth, that remain part of a disciplined, informed approach to the data. However, the variable selection process is bootstrapped.

In practice, a carefully crafted set of variables is formulated that will be subjected to simple automated variable selection, such as forward stepwise selection, whereby the most significant variables are entered one by one into a multivariable model. Specific P value criteria for entering and retaining these variables are specified. Then a random bootstrap sample of cases is selected, generally of the same sample size as the original n. A complete automated analysis is performed, and its results are stored. Then another random bootstrap set of cases is drawn from the original data set, and analysis is performed. This resampling of the original data set, followed by analysis and storage of the results, continues perhaps hundreds and even thousands of times, then the frequency of occurrence of factors identified among these many models is summarised. Frequency of occurrence generally stabilises after about 100 bootstrap analyses. The many models are also analysed by cluster techniques to detect closely related variables that in the final model will be represented by the most commonly occurring representative and by noting if a variable and one or more transformations of scale occur with about equal frequency, indicating a nonlinear relationship to risk. All this information is used to select variables for the final multivariable model.

Of interest, the variables identified for every bootstrap data set are usually different, a sobering revelation. However, it becomes evident that some variables are never selected or seldom selected; these constitute "noise." Variables that appear in 50% or more of models are claimed to be reliable and are considered "signal" for inclusion in the final model.

This phenomenon is illustrated in Table 7.7 and Fig. 7.15. Fifteen variables were selected from among many being analysed for the late hazard phase of death following mitral valve repair or replacement for degenerative disease. In analysis of the first bootstrap sample, 8 of these 15 variables were selected (only 5 were ultimately found to be reliable risk factors). By 100 analyses, although every variable had been identified as a risk factor in at least 2 analyses, 5 variables dominated the analyses (we considered these reliable risk factors), 8 rarely appeared, and 2 appeared in 22% to 32% of analyses.

What happens in bagging (bootstrap aggregation) is similar to what is seen in signal averaging, such as in visual evoked potentials. Noise is cancelled out, and signal amplified. In the same way, many variables appear rarely in models, but a few show up time and time again (see Fig. 7.15). One can therefore express the reliability of identification of a given risk factor at a selected level of statistical significance.

Bagging, although demanding a huge number of computer cycles, removes much of the human arbitrariness from multivariable analysis and provides another important statistic: a measure of reliability of each risk factor. Thus, increasingly we have been reporting not only the magnitude of the effect, its variance, and its P value, but also its bootstrap reliability. The technique appears to provide a balance between selecting risk factors that are not reliable (type I error) and overlooking variables that are reliable (type II error).

</div></details>

<details class="med-details"><summary>
  
###### Variable Selection by Machine Learning</summary><div class="details-content">

Variable selection for traditional parametric models generally relies on use of statistical significance (P values) or ad hoc stepwise methods for reducing dimension and choosing variables. Issues with P values have been discussed earlier, and stepwise procedures are unreliable because their results are highly dependent on the order in which variables are entered or eliminated. Neither of these procedures is suitable when number of variables can be high. A regularisation procedure to address this is the least absolute shrinkage and selection operator (lasso) method. In the case of regression, the lasso is fit in the same manner as least‑squares but with the additional constraint that the length of the regression parameters must be constrained. The lasso measures length using absolute distance (mathematically called L₁‑distance), which is the sum of the absolute values of the coefficients (for example, if there are two variables x₁ and x₂ with coefficients β₁ and β₂, then the lasso penalty term is λₗ(|β₁| + |β₂|), where λₗ > 0 is the lasso regularisation parameter (as will be explained, larger values of λₗ induce more penalisation and therefore sparser solutions). This differs from ridge regression that constrains the length of parameters using Euclidean distance (called L₂‑distance). Thus, in our example the ridge penalty is λᵣ(|β₁|² + |β₂|²), where λᵣ > 0 is the ridge regularisation parameter.

Ridge regression was introduced to combat instability of least squares in linear regression arising from the presence of collinearity among the covariates. By applying the ridge penalty, we can always be assured that a solution exists even in high correlation and even in the presence of many covariates. This is a nice feature of using ridge penalisation; however, the problem is that this does not address the issue of variable selection. The seemingly small difference between L₂‑regularisation used by ridge versus L₁‑regularisation used by lasso has tremendous consequences for selecting variables, especially in high dimensions. Unlike ridge regression, the estimated regression model using lasso will have coefficient values that are exactly zero, whereas ridge regression is not able to set any coefficient values to zero. Thus, the lasso has the desirable property that it achieves estimation and variable selection simultaneously, the latter being achieved by having coefficients that are exactly zero and therefore of no value to the model.

How does the lasso achieve this? Consider Fig. 7.16. Displayed is the optimisation problem for the lasso in a regression problem involving three variables, labelled x, y, and z. As mentioned, lasso is a penalisation problem that penalises the least squares solution by absolute distance. The least squares solution (the usual regression solution) is the centre of the ellipsoid. To solve the penalisation problem, the solution is to find the point at which the ellipsoid first touches the constraint region, which is the pointy region centred at zero. The size of the constraint region depends on the lasso parameter λₗ with larger values applying more constraint. Because of the shape of this region, it will often happen that the solution will touch one of the axes, which in this case is x. The result is that this coefficient becomes zero. In problems with many variables, the pointy nature of the constraint region will induce many variables to be zero. This leads to the so‑called sparsity property of the lasso in high dimensions.

Now consider Fig. 7.17, which is the solution for ridge regression. The difference here is that the constraint region is a sphere centred at zero. The ridge solution is where the ellipse touches the sphere. The size of the sphere is related to the ridge parameter, which like the lasso parameter controls the amount of regularisation. However, due to the round nature of the sphere there is no possibility for any coefficient to become zero like the lasso. This problem persists and becomes worse as the number of variables increases. Thus, the ridge estimator does not possess sparsity and cannot be used for variable selection like the lasso.

In another promising approach, machine learning technologies are being harnessed in interesting ways by either embedding traditional parametric models or extending nonparametric analytic strategies. As mentioned, results of traditional variable selection are highly dependent on the order in which variables are entered or eliminated. One can instead imagine forming thousands of bootstrap models with clusters of randomly chosen variables forced into each and aggregating the results. One can apply learning theories to model development. One can examine variable importance (often revealing that many variables actually degrade predictive power). Splitting algorithms can be averaged to reveal the most common splits (Fig. 7.18).

In machine learning, variable selection is often performed using variable importance (VIMP), defined by how much prediction accuracy of the model depends on the information in each feature. One of the most popular methods is permutation importance, introduced in random forests by Breiman. To calculate a variable’s permutation importance, the given variable is randomly permuted in the out‑of‑sample data (i.e., the observations not selected in the bootstrap random sampling with replacement, called the out‑of‑bag [OOB] data), and the permuted OOB data are dropped down a tree. OOB prediction error is then calculated. The difference between this and the OOB error without permutation (i.e., from the original tree), averaged over all trees, is the importance of the variable. The larger the permutation importance of a variable, the more predictive the variable, as illustrated in Fig. 7.19.

Other approaches not using prediction error have also been developed for selecting variables; however, these tend to be specifically designed for the algorithm being considered. Recently, attention has been given to developing variable importance that can apply more generally across different types of learning procedures within the framework of model selection. Related to this are methods developed within the framework of model‑free feature screening in which explanatory variables are identified without producing an overall prediction model (see Li and colleagues for a discussion of the difference between model selection and variable selection).

A new promising method called variable priority (VarPro) takes a broader approach in the spirit of these latter methods. An interesting aspect of VarPro is that it does not assume linearity or other specific model formulations often used for the conditional means used in model‑free feature screening algorithms, while on the other hand, it does construct trees just like in model‑selection methods using trees; however, the goal, which is to construct neighbourhoods of the covariate space rather than predicting the outcome, is different. Therefore, this method is called model‑independent, in the spirit of borrowing the best parts of both model selection and model‑free variable selection. Indeed, "variable selection" is a misnomer, because the inner working of VarPro is to progressively exclude (give zero weight to) variables that contribute nothing to predicting outcome, leaving behind those that do. Using rules from externally constructed trees, the VarPro importance statistic for a set of variables equals the difference between the estimator of conditional mean based on a rule and the estimator based on the released rule obtained by removing any constraints on the variables of interest. VarPro readily scales to large data sets requiring only calculating sample averages and can be used in a variety of settings, including regression, classification, and survival.

</div></details>

<details class="med-details"><summary>

#### TABLE 7.7 Frequency of Occurrence (%) of Variables Selected in Bootstrap Analyses of the Late Hazard Phase of Death after Mitral Valve Repair or Replacement for Degenerative Disease</summary><div class="details-content">

| Variable | 1 | 5 | 10 | 55 | 100 | 250 | 500 | 1000 |
|----------|---|---|----|----|-----|-----|-----|------|
| **Demography** | | | | | | | | |
| Age | 100 | 100 | 100 | 100 | 99 | 99 | 99 | 99 |
| Women | 0 | 0 | 0 | 6 | 7 | 4 | 3 | 5 |
| **Noncardiac Comorbidity** | | | | | | | | |
| Bilirubin | 0 | 40 | 20 | 16 | 12 | 10 | 10 | 10 |
| BUN | 100 | 40 | 60 | 72 | 76 | 78 | 77 | 78 |
| Hypertension | 0 | 0 | 10 | 6 | 6 | 5 | 6 | 6 |
| Peripheral artery disease | 0 | 0 | 0 | 4 | 2 | 4 | 3 | 3 |
| Smoker | 0 | 0 | 0 | 6 | 8 | 9 | 11 | 10 |
| **Ventricular Function** | | | | | | | | |
| Ejection fraction | 0 | 0 | 0 | 18 | 22 | 22 | 24 | 25 |
| Left ventricular dysfunction (grade) | 100 | 60 | 70 | 70 | 66 | 66 | 68 | 68 |
| Right ventricular systolic pressure | 100 | 20 | 10 | 10 | 8 | 8 | 8 | 8 |
| **Cardiac Morbidity** | | | | | | | | |
| Coronary artery disease | 100 | 100 | 100 | 96 | 94 | 92 | 92 | 91 |
| Anterior leaflet prolapse | 100 | 80 | 90 | 82 | 82 | 84 | 85 | 85 |
| **Preoperative Condition** | | | | | | | | |
| NYHA class | 100 | 20 | 20 | 30 | 32 | 34 | 33 | 36 |
| Hematocrit | 0 | 0 | 20 | 16 | 17 | 14 | 16 | 17 |
| **Experience** | | | | | | | | |
| Date of operation | 100 | 20 | 10 | 14 | 15 | 14 | 13 | 14 |

###### *BUN,* Blood urea nitrogen; *NYHA,* New York Heart Association.

</div></details>

![](_page_51_Figure_3.jpeg)

**FIGURE 7.15** Example of automated variable selection by bootstrap aggregation (bagging). Fifteen variables labelled A through O are depicted as potential predictors of death after mitral valve surgery. In column A, analyses of five bootstrap samples are shown. *Tall bars* indicate the variable was selected at P < .05, and gaps represent variables not selected. In all cases, variables A and D were selected, but otherwise analyses appear to be unique. Panel B shows a running average of these five analyses. Variables A, D, I, and J were selected more often than others. Panel C shows averages of 10, 50, 100, 250, and 1000 bootstrap analyses. Notice that no variable was selected 100% of the time, and all 15 were selected at one time or another. But if we consider variables appearing in 50% or more analyses as reliable risk factors, variables A, C, D, I, and J fit that criterion of "signal" and the rest are "noise." (From Blackstone and colleagues.)

![](_page_52_Figure_8.jpeg)

**FIGURE 7.16** The lasso solution is the point where the ellipsoid touches the lasso constraint region |x| + |y| + |z| ≤ C.

![](_page_52_Figure_10.jpeg)

**FIGURE 7.17** The ridge solution (p = 3 dimensions) is the point where the ellipsoid centred at the ordinary least square value touches the constraint region x² + y² + z² = C.

![](_page_53_Figure_3.jpeg)
![](_page_54_Figure_2.jpeg)
![](_page_55_Figure_3.jpeg)

**FIGURE 7.18** Use of random forests for variable selection. (A) Example of a random tree. A bootstrap sample of patients from original data set is used to create a random tree. At the root node, a random set of variables is chosen to be candidates, and the most predictive variable for survival among those is identified. Node levels are numbered based on their relative distance to top of tree (i.e., 0, 1, 2). Splitting of nodes to create trees continues until terminal nodes have a few distinct events (e.g., deaths). (B) Illustration of minimal depth of a variable in a random tree from a 2000‑tree forest. Highlighted are three top variables: peak V̇O₂ (violet), blood urea nitrogen (BUN, aqua), and exercise time (tan). Depth of a node is indicated by numbers 0, 1, 2, 3‑8. Minimal depths are 0, 1, 2 for exercise time, peak V̇O₂, and BUN, respectively. (C) Illustration of six random trees from a 2000‑tree forest. The three most important variables among these trees are colour coded blue for treadmill exercise time, violet for peak V̇O₂ and green for serum BUN. (D) Minimal depth (variable importance) from random survival forests analysis. Dashed blue line is threshold for filtering variables: All variables below line are predictive. Diameter of each circle is proportional to forest‑averaged number of maximal subtrees for that variable. (From Hsieh and colleagues.)

![](_page_56_Figure_2.jpeg)

**FIGURE 7.19** Illustration of how randomly permuting a variable leads to different terminal node assignments, which is at the heart of why permutation importance works. *Red nodes* are tree nodes that split on the target variable v. In the top panel on the left, the *bold arrows* show the path that a data point x takes as it traverses through the tree to its terminal node assignment "1." On the right, the v coordinate of x has been randomly permuted, and its new terminal node assignment is now "4." In the bottom panel is the path for another x value. Its terminal node assignment is "6." However, when v is permuted, its new terminal assignment becomes "5." Importantly, notice that in the top panel the terminal node assignment after randomly permuting v is much farther than its original terminal node assignment than in the bottom panel. This shows that the higher v splits in the tree, the more effect permutation has on final terminal node membership, and hence on prediction error.

</div></details>

<details class="med-details"><summary>
  
##### Verification</summary><div class="details-content">

The ideal verification of a multivariable analysis is to demonstrate its accuracy in predicting results of a new set of patients, preferably extramurally. Another popular method, if the data set or number of events is large, is to split the data set randomly into training and testing data sets. Modeling is performed on the former and verification on the latter. Whether this is an efficient and effective strategy has been debated. One of the first applications of bootstrapping was to address this issue by generating multiple training and testing sets. Within the domain of the primary multivariable analysis itself, there are, as it were, internal validity diagnostics. For example, in linear regression (see Box 7.17), a measure of explained scatter is the r² value (square of the familiar correlation coefficient). It is desirable that the value of r² be high (closer to 1 than 0); however, if a model is overdetermined by having in it either too many factors or surrogates for the outcome‑dependent variable, a high r² may be spurious.

<details class="med-details"><summary>
  
###### Calibration</summary><div class="details-content">

In logistic regression (see "Logistic Regression Analysis" later in this section), a number of diagnostic tools are available. One of the earliest was the decile table, often attributed to Hosmer and Lemeshow but used much earlier by the Framingham investigators and others. By solving the multivariable equation for each patient, patients are ordered with respect to their estimated probability of experiencing an event. They are then stratified in up to 10 groups (thus "decile"), and within each group the estimated probabilities are summed. This sum represents expected events; it is compared with observed events in each decile. The Hosmer‑Lemeshow statistic is a general calibration test of the differences between observed and predicted events (Box 7.19).

A calibration metric that is useful for both binary models and time‑to‑event models is the *Briar score*, which quantifies the differences between predicted probability (p) and observed events (o):

$$\text{Briar score} = \frac{1}{n} \sum_{i=1}^{n} (p_i - o_i)^2.$$

Note that the better the accuracy, the smaller the value of the Briar score. Walsh and colleagues also provide a comparison of calibration methods.

</div></details>

<details class="med-details"><summary>
  
###### Discrimination</summary><div class="details-content">

Discrimination is the ability of a model to stratify data into 2 or more distinct classes. The most familiar tests of discrimination is the C‑statistic, or area under the curve (AUC) of a receiver operating characteristic curve (ROC). To understand this, consider the following 2×2 table (sometimes called a confusion matrix):

| | Event happened (positive) | Event didn’t happen (negative) |
|---|---|---|
| Predicted positive | a True positive (TP) | b False positive (FP) |
| Predicted negative | c False negative (FN) | d True negative (TN) |

From this are derived a number of relationships:
- Sensitivity = TP/(TP + FN), detection of true positives
- Specificity = TN/(TN + FP), detection of true negatives
- Positive predictive value = TP/(TP + FP), for those testing positive, proportion actually positive
- Negative predictive value = TN/(TN + FN), for those testing negative, proportion actually negative
- Precision = TP/(TP + FP), which is identical to positive predictive value
- Recall = TP/(TP + FN), which is identical to sensitivity

ROC is plotted as sensitivity vs. 1‑specificity and ROC‑AUC is the area under the relationship of sensitivity to 1‑specificity.

Trouble begins, however, when events, such as those after cardiac surgery become small and its denominator proportionately large (known as imbalanced data), as is demonstrated in detail under "Classification Using Machine Learning." In such a case, false negatives become a large problem, and this is particularly for machine learning for classification, whose predictions will favour the majority class. This suggests a focus on the minority class, which is what recall (sensitivity) does along with precision (positive predictive value). As data become increasingly imbalanced, ROC‑AUC increases to approach 1, even though its prediction of the outcome of interest may be poor, because this is overwhelmed by all the true negatives with hardly any false positives (sensitivity). In other words, sensitivity is focused on how well a model detects true positives, and precision is focused on how well the model avoids the false positives. Thus, for imbalanced data, one wants the area under the precision‑recall curve (PR‑AUC) to be approaching 1.

There are a multitude of tests for discrimination in addition to ROC‑AUC and PR‑AUC. For time‑related events, Harrell’s *Concordance Index* is analogous to ROC‑AUC. *G‑mean* is the square root of the product of sensitivity and specificity, which is a measure of poor performance in classifying the minority class, because if there are few false positives, specificity will approach 1 while false negatives are emphasised by the sensitivity. *F₁* measures the balance between precision and sensitivity and is 2 times the product of sensitivity and precision divided by the sum of sensitivity and precision.

One of the best sources of information on calibration and discrimination and other metrics for goodness of model fit is a series of articles by Frank Harrell and colleagues. For machine learning, O’Brien and Ishwaran have provided a method to generate accurate probabilities in the face of class imbalance.

</div></details>

<details class="med-details"><summary>
  
###### Other Model Diagnostics</summary><div class="details-content">

In addition, for all varieties of multivariable models, a number of regression diagnostic procedures are used, including formal testing of goodness of fit, identification of observations that particularly influence the results, and analysis of residuals (the difference between observed and predicted values) in linear regression.

However, as risk of cardiac surgery approaches zero (in terms of mortality and several morbidities), traditional ROC curves as a measure of discrimination become deceptive, yielding a misleading metric of accuracy. This is because the outcomes are highly imbalanced (few events among a large number of patients), and simply predicting no events will result in a high metric of accuracy. There are several metrics that mitigate this problem (see Box 7.19). One is the graph of precision versus recall. Precision is another term for sensitivity (true positive/[true positive + true negative]), and recall is another term for positive predictive value (true positive/[true positive + false negative]).

A validation technique, part of calibration, that holds future promise is OOB prediction error assessment. As noted earlier in this section, one bootstrap sample or average does not select about a third of patients. These nonselected patients are known as the OOB sample. A model developed on the two thirds of data can be applied to the OOB sample and prediction error calculated as VIMP.

<details class="med-details"><summary>

#### BOX 7.19 Calibration and Discrimination</summary><div class="details-content">

**Calibration** — the process of determining if the results predicted by a model are consistent with the actual data, the closeness (goodness) of fit of a model to data. Hosmer and Lemeshow introduced a method to test the goodness of fit of expected proportion of events as predicted from such regression analyses to observed proportion of events. They proposed a simple way to do this was to "bin" data into deciles (10 groups) of ascending predicted proportion of events and determine within each decile the proportion of actual events observed. A good fitting model would line these up on the diagonal. Deviation from that line was tested by the simple chi‑squared goodness of fit test. Despite advances since, this is still a useful tool to explore non‑linearities of continuous variables in a model and presence of interactions between variables.

**Discrimination** — the ability of a model to stratify data into 2 or more distinct classes.

</div></details>

</div></details>

<details class="med-details"><summary>
  
##### Presentation</summary><div class="details-content">

A multivariable parametric model analysis generates an enormous amount of information, including:

- The structure of the model and estimates of parameters related to that structure
- A list of risk factors identified
- Magnitude of association of each risk factor with outcome as adjusted for all other variables in the model (these multipliers may be expressed either as the parameter estimates themselves—called *model coefficients*—or as some reformatted relative risk expression (see Box 7.3)
- Direction of each relation, positive or negative
- Uncertainty of the associations, generally expressed as standard deviations of the coefficients
- A statistical score on which a P value is based
- P values
- A set of numbers indicating quantitative interrelation of all parameter estimates in the model (the variance–covariance matrix)
- Bootstrap reliability of each risk factor identified

There is some controversy about which of these nine sets of numbers should be reported in a manuscript. It may be sufficient for understanding the relations to simply list the risk factors and place in an appendix some of the numeric data. If the model is intended to be used for prediction, including CLs, the entire list must be reported or provided electronically, as was previously done for Society of Thoracic Surgeons National Cardiac Database models.

None of the nine, however, directly addresses the way a final multivariable model is formulated to reveal incremental risk factors (see "Incremental Risk Factor Concept" in text that follows). The incremental risk factor concept was developed to facilitate medical interpretation of a multivariable analysis. Any dichotomous risk factor in a multivariable analysis can be complemented to allow it to have a positive sign. This is desirable because we think of variables in the model as risk factors, and usually we consider risk to be increasing (positive value) with increasing value of the risk factor. Generally, continuous and ordinal variables cannot be formulated this way, so we recommend that each of these be accompanied by an indication of the direction of greater risk (younger age, lower ejection fraction, greater functional impairment, higher bilirubin).

<details class="med-details"><summary>
  
###### Incremental Risk Factor Concept</summary><div class="details-content">

An incremental risk factor is a variable identified by multivariable analysis that is associated with an increased risk of an adverse outcome (surgical failure). Surgical failure may be an *event*, such as early postoperative stroke, and risk is expressed in terms of probability. It may be a *time‑related event*, and risk is expressed in terms of a shorter interval to the event, such as premature death. It may be a *longitudinal outcome*, and risk is expressed as increased prevalence, higher grade of failure, or elevated or lowered quantitative level. In the context of other simultaneously identified factors, the *magnitude* (strength) and *certainty* (P value) of an incremental risk factor represent its contribution over and above those of all other factors. Thus, it is incremental in two ways: (1) with respect to being associated with increased risk and (2) with respect to other factors simultaneously incorporated into a risk factor equation.

There are a number of possible interpretations of an incremental risk factor, all of which should be assessed in drawing inferences:

- Incremental risk factors are variables that reflect increased difficulty in achieving surgical success. This original definition addressed the reality of *surgical complexity*. Complexity may be expressed in terms of morphologic features (e.g., atrioventricular septal defect). It may also relate to duration of operation (e.g., longer myocardial ischaemic time); to both the operation and components of it; to presence of associated cardiac or noncardiac diseases; to demographics (e.g., young age, low birth weight, sex, social determinants of health); or to conditions that increase difficulty of access (reoperations) or add a potential for complication (e.g., religious preference that precludes administration of blood products, administration of thrombolytics shortly before operation).
- Incremental risk factors are *common denominators* of surgical failure. The Framingham originators of the risk factor concept were initially disappointed that they did not discover mechanistic (deterministic) causes of heart disease, only weak associations. These weak associations are what we call *common denominators*. They are general factors associated with increased or decreased risk of an outcome. Sufficient data (see Box 7.4) are necessary to keep them from becoming identifiers of specific patients.
- Some incremental risk factors reflect *disease acuity*. Need for emergency or urgent operation in patients with severely impaired functional status, such as NYHA class IV or V (the latter designating severe haemodynamic instability, cardiogenic shock or emergency salvage), low pH, or short interval from MI to ruptured ventricular septum, represent risk factors that increase acuity.
- Some incremental risk factors reflect *immutable conditions* that increase risk. These include extremes of age or body size, genetic disorders, sex, and race.
- Some incremental risk factors reflect influential coexisting *noncardiac diseases* that shorten life expectancy in the absence of cardiac disease. These include chronic renal disease, diabetes, malignancies, arteriosclerosis, and infectious diseases.
- Incremental risk factors are usually *surrogates* for true, but unmeasured or unrecognised, sources of surgical failure. It is tempting to misinterpret *associations* as *causes*. Studies of surrogate endpoints to decrease sample size for randomised clinical trials are instructive. They demonstrate a number of circumstances under which such surrogates may be misleading. On the other hand, if unknown cause and measurable surrogate are strongly mechanistically linked, interim neutralisation of the surrogate may neutralise the cause (Appendix 7C). The Framingham investigators classified most risk factors as rather general, insensitive, but useful surrogates for underlying mechanisms.
- Incremental risk factors may be *spurious associations* with risk. One of our motivations to base risk factor identification on algorithmic methods such as bagging is that in simulations, these methods balance very nearly 50:50 the probability of overlooking a risk factor and identifying a spurious association.
- An incremental risk factor may be a cause or mechanism of *surgical failure*. It is difficult to establish a causal mechanism outside the scope of a randomised, well‑powered, and well‑conducted generalisable clinical trial. This is due to confounding between selection factors influencing treatment recommendations and decisions and outcome. Balancing score methods (e.g., propensity score) attempt to remove such confounding and approach more closely causal inferences (see "Natural Experiments" in Section V). In addition, we must acknowledge that "association," "cause," and "mechanism" may simply be levels of granularity in the pathway of cause to effect. As more becomes known at the molecular level, it may be assumed that at that level of fine granularity, a clear understanding of mechanisms may emerge. However, a macroscopic event such as death or a complication after a cardiac operation may not be completely understood by knowledge of the many individual events taking place at the microscopic level, which probably interact in a complex fashion.
- Some incremental risk factors reflect *temporal experience*. The "learning curve" idea is intended to capture variables relating to experience of the surgical team, but also those representing temporal changes in approach or practice (e.g., addition of retrograde cardioplegia to myocardial management, preservation of chordae in mitral valve replacement, and use of artificial chordae in mitral valve repair). It is more helpful to identify specific temporal changes in management as separate variables than to lump them into a "date of operation" variable. To do so may require initially suppressing date of operation in the analysis to allow entry of such identifiers of management changes.
- Some incremental risk factors reflect *quality of care* and, as such, "blunt end" ramifications of institutional facilities, organisation of healthcare delivery, support systems, policies, practices, healthcare systems, and national and political decisions. Just like temporal experience, however, it is more helpful to identify the specific factors reflected in institutional variance than simply to state that some institutions are high risk and others low risk. If these can be identified and institutions no longer enter an analysis as risk factors, it becomes important to quantify their frequency of occurrence in each institution. If the prevalence is high, and if associations are strongly linked to mechanisms of failure, then institutional protocols to lower the prevalence are warranted. Although quality of care is measured by outcomes, factors influencing it are identified in risk factor assessment and serve as important information for quality monitoring, quality improvement, quality comparison, and assessment of strategies implemented. (Institutional variance is addressed in more detail in Chapter 8.)
- Incremental risk factors reflect individual patient *prognosis*. They cannot be used to identify *which* patient will suffer a surgical failure, but they can be used to predict the *probability* of failure. Surgeons make recommendations and decisions every day that reflect conscious or unconscious assessment of probabilities. *Patient selection* requires weighing the probabilities of risks and benefits (value) of intervention versus nonintervention or an alternative management strategy. *Indications for operation* is the same. Analysis of clinical experience transforms generalities of patient selection and indication guidelines into quantitative probabilities for an individual patient’s characteristics.

</div></details>

<details class="med-details"><summary>
  
###### Residual Risk</summary><div class="details-content">

A valuable adjunct to incremental risk factor methodology is *analysis of residual risk*. In analysis of residual risk, the risk score for each patient is calculated from existing parametric models. For logistic regression, this is the logit of the probability of the event; for Cox proportional hazards modelling, it is the sum of the weighted risk factors; for hazard function regression, it is the sum of the weighted factors in each hazard phase (see Box 7.17). These are forced into a new model with new data elements, and a search is made for risk factors not accounted for by the risk score or for factors in the risk score that are either underweighted or overweighted.

For example, Sergeant and colleagues studied 3720 patients prospectively, applying a previously published time‑related equation to generate a survival curve for each. The patients were subsequently followed up and comparison made of actual and expected survival (see Fig. 7.2A). Estimated survival was too optimistic, so an analysis of residual risk was performed. Five residual risk factors were found, falling into three categories:

- Two factors had been suspected in the original analysis, but they occurred so infrequently that reliable parameter estimates could not be computed.
- Two variables were related to preoperative atrial and ventricular rhythm disturbances. These data had been available for the original analysis, but the investigator ignored them because he thought they were unimportant.
- The fifth variable identified a patient subset that had not been represented at all (extended indication) in the original data set. These residual risk factors accounted for only a small fraction of the new patient group, but a group whose risk was vastly underestimated (see Fig. 7.2B and Table 7.2). Going forward, a new risk factor model should be produced to more comprehensively and accurately predict outcome of future patients.

This experience has driven us to the opinion that clinically rich models, rather than simple ones, are required for accurate risk adjustment. The factors liable to lead to risk underestimation are (1) rare factors, (2) factors that are important but not included in models, and (3) factors related to subgroups for whom indication for operation has been extended beyond that of patients included in developing the models.

</div></details>

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Early Events</summary><div class="details-content">

<details class="med-details"><summary>
  
#### Method of Expression</summary><div class="details-content">

Early mortality is often expressed as *hospital mortality*, which includes all deaths that occur after operation but before hospital discharge. The disadvantage of using hospital mortality is that the relatively high but rapidly declining early phase of risk after cardiac operation nearly always extends beyond the hospital period, often out to 3 months and occasionally 6. The degree of extension, even after such safe operations as CABG, appears to increase as risk factors increase. Thus, hospital mortality underestimates the true early risk of operation and gives an incomplete picture of this measure of quality of care. It also covers a variable time period that is patient‑specific.

An alternative is to use *30‑day mortality*, but this requires patient follow‑up, either active (and expensive) or passive (and delayed). The hybrid of these, *operative mortality*, is all hospital deaths plus those that occur in the first 30 days among patients discharged alive earlier than that. Actually, the most appropriate way to depict early mortality (or any other outcome event) after a procedure or decision is in a time‑related manner beginning at time zero (see "Time‑Related Events" later in this section).

If simple percentages are used, at least the confidence intervals around that percentage have to be stated (see "Uncertainty" earlier in this section) and ideally some information about characteristics of the patient group. Often the patient group is stratified in some manner to demonstrate the effects of heterogeneity of risk factors on outcomes.

</div></details>

<details class="med-details"><summary>
  
#### Logistic Regression Analysis</summary><div class="details-content">

Logistic regression is used for multivariable analysis of hospital outcomes (events) that are dichotomous (yes/no).

<details class="med-details"><summary>
  
##### Historical Note</summary><div class="details-content">

The logistic equation was introduced by Verhulst between 1835 and 1845 to describe population growth in France and Belgium. Thus, it belongs to a large class of *growth equations*. The logistic equation is the simplest of these, resulting in a symmetric S‑shaped curve when plotted (see Fig. 7.1A). The model reappeared in the work of Pearl and Reed at Johns Hopkins University in 1920. They recognised the pattern of an autocatalytic reaction in the characteristic pattern of the logistic equation for populations; this was earlier suspected by Pearl in 1909 from his reflections on the relation of these curves to organic laws of change. The equation is characterised by an initial phase of increasingly rapid chemical conversion catalysed by the products produced, followed by a decelerating phase as reactants are consumed (e.g., hydrolysis of ethyl acetate to acetic acid and ethyl alcohol).

Also at Johns Hopkins University during the late 1920s, Berkson and colleagues found that the logistic equation represented kinetics between enzymes and certain substrates. Later at the Mayo Clinic in the 1940s, Berkson found a logistic relation between dosage of drug and proportion of small experimental animals killed (bioassay). In his studies, the outcome variable was a probability. Unlike population or biochemical kinetics in which not only the rate but also the initial (base) level and the final (asymptotic, limiting) level must be estimated, when the logistic equation is used to estimate the probability of an event, values are constrained within a base of 0 and asymptotic level of 100% (or unity), simplifying the equation and leaving a single parameter to estimate from the data, z.

In 1953, Berkson dubbed the units of the logistic nomogram *logit units*, parallel to the *probit units* of another method of bioassay. Thus, certain aspects of the nature of population behaviour, enzyme kinetics, lethality of drugs, and risk factors for human outcomes found common ground in this fundamental logistic expression. The logistic equation was made multivariable in the 1960s by Cornfield and colleagues and Walker and Duncan, as described under "Multivariable Analysis" earlier in this section.

</div></details>

<details class="med-details"><summary>
  
##### Logistic Regression Equation</summary><div class="details-content">

Multivariable logistic regression generalises the discriminant analysis of Fisher by embedding it within the logistic equation. Thus z, the logistic parameter expressed in logit units, is assumed to be related to a logit‑linear combination of incremental risk factors (see Box 7.17):

$$z = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_k x_k \quad (7-1)$$

where β₀ is the intercept term (logit units when all x = 0), x₁ through xₖ are the numeric values for the independent variables, and β₁ through βₖ are coefficients, estimated from the data, that translate the values of the independent variables (see Box 7.16) to logit units. Logit units are related to probabilities (P) by the logistic relationship:

$$z = \operatorname{Ln}\left(\frac{p}{1-p}\right) \quad (7-2)$$

where Ln is the natural logarithm. This form of the logistic equation makes clear why "log" is part of its name. Notice, also, that z is a function of the ratio of P, the probability of an event, and 1 − P, the complementary probability of the event not occurring. This ratio is the *odds ratio* (see Box 7.3), and Equation 7‑2 is referred to as *log odds*. Equation 7‑2 is not computationally applicable to raw clinical data for which P is exactly 0 or 1 for each patient (e.g., analysis of a dichotomous variable like mortality; see Box 7.17). Thus, the computational form is a nonlinear equation obtained by exponentiating Equation 7‑2:

$$P = \frac{1}{1 + e^{-z}} \quad (7-3)$$

where P is the estimated probability using the maximum likelihood principle, and e is the base of the natural logarithms. In practice, the dependent variable is a dichotomous variable with value 0 (no event) or 1 (event), and the independent variables are potential incremental risk factors (see Box 7.16). In this form, no restrictions are made on the distribution of the risk factors (x); they may be any mix of continuous, dichotomous, or ordinal variables.

</div></details>

<details class="med-details"><summary>
  
##### Logistic Regression for Nonbinary Data</summary><div class="details-content">

**Polytomous Logistic Regression.** The "event" whose probability is being calculated does not always take the simple form of 0 and 1; sometimes it is a list of possible dichotomous outcomes. Consider hospital mortality. It may occur in a multiplicity of modes (e.g., acute cardiac failure, death from haemorrhage, death in renal failure). The data may need to be analysed for more than one mode of death. Such analysis leads to the coding of multiple so‑called competing events: alive, acute cardiac failure, death in renal failure, and so forth. These are *unordered lists* of modes of death for which polytomous logistic regression might be considered.

One option for polytomous variables is to analyse each event category independently, determining its incremental risk factors using logistic regression for dichotomous outcomes as previously described. It is important to note that for such analyses, the entire data set is used.

Another option is to analyse each variable in the same fashion as time‑related competing risks (see "Competing Risks" under "Time‑Related Events" later in this section). The assumption is that all items in the list are independent. As in temporal competing risks analysis, patients experiencing events in any other category are eliminated (e.g., all patients dying in other modes) in these separate analyses. Thus, the data set used to analyse each event in the list contains all patients experiencing each successive event in the list. The entire data set is not used. The analysis is performed and the results interpreted as a conditional probability; that is, the probability of an event of one type, conditional on the absence of another type (e.g., the probability of cardiac death given the absence of any other mode of death.)

An important feature of this type of conditional probability analysis is that event categories must be strictly mutually exclusive. This means that a patient can be assigned only one mode of death, for example. If one were analysing morbid events such as hospital complications, this would be the earliest occurring complication (in which case one would normally use time‑related techniques, of course). This introduces a certain arbitrariness into the analysis. Furthermore, if one adds another category of morbid event to the list, the probabilities of the remaining new ones will not be the same, because the "denominator" (all those not experiencing an event) plus the patients in each successive category will change.

On the other hand, if one then uses the logistic regression equation to predict the occurrence of each event category, the method of conditional probability guarantees these will add to 100% (including the category "no event") as long as the same risk factors are used for each analysis, and approximately so if a different set is used. This property of polytomous logistic regression, then, distinguishes it from ordinary logistic regression. In ordinary logistic regression in which the entire patient sample is used for each event, it is unlikely that the probabilities for a list of events will add to 100%.

This leads us to reflect that ordinary logistic regression examines an event in isolation of any other kind of event. It is ideal for answering the question "What is the nature of this outcome phenomenon?" Polytomous logistic regression, by considering the entire list of events that make up a more global event (e.g., death, complications), answers the question "What are the probabilities of each kind of event conditional on none of the others occurring?" All these will add up to the total probability of the overall event.

Although used in data analysis by others before them, Hosmer and colleagues described the equations and programmed the software for performing a multiple (polytomous) logistic regression simultaneously on multiple events, and these algorithms are incorporated into most modern logistic regression computer software. Generally, all items in the polytomous list are analysed simultaneously, with multiple streams of the same set of risk factors. This allows assessment of the sometimes‑complex interplay of risk factors among the various list items.

An important limitation of polytomous logistic regression is that the number of risk factors must be such that the category with the fewest events does not become overdetermined. When there is wide difference among the categories in number of events, perhaps one or two orders of magnitude, this can limit the model considerably, permitting little insight into the most commonly occurring category and jeopardising the least commonly occurring. Some coalescence of categories may be necessary.

Assumptions of polytomous logistic regression include *noninformative censoring* (just as for time‑related events)—that is, occurrence of one item in the list is unrelated to the possible occurrence of another, had the first not happened first. In cardiac operations, in which multiorgan system failure often leads to death, independence of modes of death such as from renal failure or hepatic failure is hard to accept.

**Ordinal Logistic Regression.** A generalisation of logistic regression is to an ordinal response (dependent) variable such as NYHA functional status after operation. The logistic equation, by means of multiple intercept terms, then predicts the probability for each ordinal level, all of which sum to 100%. The primary assumption of ordinal logistic regression is that there is an orderly relation between increasing risk and increasing ordinal level of the outcome variable. Patients "flow," as it were, into states of greater severity as states of lesser severity empty (Fig. 7.21). This assumption may be violated, so testing the *proportional odds* assumption is mandatory during analysis. The most common reason for violation of the proportional odds assumption is too few patients in some categories. This requires coalescence of categories until the proportional odds assumption is met.

A practical note is that a naive solution of an ordinal logistic equation generates cumulative probabilities. What one generally is interested in is the actual probabilities of each level of the ordinal variable. These must be obtained by subtraction and the CLs calculated for each such conditional probability.

![](_page_60_Figure_14.jpeg)

**FIGURE 7.21** Illustration of ordinal longitudinal outcomes. Diagram illustrates the assumption that aortic regurgitation across stented bovine pericardial aortic valve prostheses progresses from grade 0 to grade 1+, then to grade 2+, and finally to grades 3+ and 4+. (Redrawn from Blackstone.)

</div></details>

<details class="med-details"><summary>
  
##### Diagnostics</summary><div class="details-content">

Upon completion of a logistic regression analysis, it is important to perform a variety of diagnostics to determine the quality of the results obtained. Pregibon has presented several helpful logistic regression diagnostics. Harrell has incorporated a number of diagnostics into his R‑based package. These substantially extend more typical Hosmer‑Lemeshow diagnostics.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Machine Learning</summary><div class="details-content">

In machine learning, the situation where the observed outcome is binary is referred to as the two‑class problem. Interest typically focuses on the issue of classification, and the machine learning procedure is often simply referred to as a classifier. This is different from in medicine, where the focus is generally on estimating the probability of the event of interest, often by using a method like logistic regression. Another important difference is that many machine learning classifiers do not provide properly calibrated values for probabilities. This point often gets obscured because performance is often reported using the receiver operating characteristic area under the curve (ROC‑AUC). This metric measures how accurately the classifier can correctly rank two randomly selected patients from each group in terms of the size of their probabilities (see Box 7.19). Therefore, it assesses how accurately the classifier can discriminate patients, which is something machine learning is good at, but it does not tell us anything about its calibration accuracy, which can be poor depending on the machine learning method used.

Soft classification is the problem of classifying an object using probability. Classification is generally based on the Bayes decision rule, which classifies patients on the basis of their probabilities, with patients with probability 0.5 or higher assigned to one class and less than 0.5 to the other class. Besides the previously mentioned problem with obtaining properly calibrated probabilities, another wrinkle that often occurs in two‑class problems is class‑imbalanced data. These data, sometimes simply referred to as imbalanced data, occur when the frequency of the observed classes is skewed to one realisation—the majority class versus the other possible realisation—the minority class.

<details class="med-details"><summary>
  
##### Imbalanced Data</summary><div class="details-content">

Imbalanced data present a serious problem for machine learning methods because they tend to force the classifier to classify nearly all the cases into the majority group. Consider the following example as an illustration of this phenomenon. In studying the value of adjuvant therapy versus esophagectomy only for esophageal cancer, it became necessary to assess treatment overlap as part of the causal analysis. Assessing treatment overlap required running a classification analysis to predict treatment group using patient covariates. In this data set there were N₀ = 6649 patients in the esophagectomy only group and N₁ = 988 in the adjuvant therapy group. This is an imbalanced ratio (IR) of N₀/N₁ = 6649/988 = 6.7, which is larger than 1 if groups were balanced (i.e., N₀ = N₁).

Although the IR is moderate in this example, we still observe strange results. Running a random forest classifier on the data, the following confusion matrix was obtained (values calculated using OOB):

| Actual | PREDICTED | | |
|--------|-----------|---|---|
| | Surgery | Adjuvant | Error |
| Surgery | 6567 | 82 | 0.012 |
| Adjuvant | 850 | 138 | 0.860 |

The OOB estimated overall misclassification error is 12.2%, which looks very good. However, notice how the conditional error rates, which are conditioned on the true class label, are very different from one another, with a small error value of 1.2% for the majority class (surgery group, call this label "0") but a very high error value of 86% for the minority class (adjuvant group, call this label "1"). Therefore, the overall low error rate of 12.2% is primarily driven by the majority class label, illuminating the poor classification for the minority group.

The problem is that machine learning methods are "biased" toward the majority class in the presence of imbalanced data, especially when the IR is high, because classification is based on the Bayes decision rule. This classifies patients to the minority class if their probabilities are greater than or equal to 0.5. Of course, the very nature of the imbalanced data makes this unlikely to occur, because the probability of being a minority class will almost certainly be less than 0.5 (except, perhaps, for a small subset). Hence, this forces the classifier to classify most of the data to the majority class in imbalanced data settings. Note that this applies to other machine learning procedures and is not unique to random forests. Furthermore, the same principle applies to standard procedures such as logistic regression if the Bayes decision rule is used for classification.

This issue often flies under the radar, with many researchers unaware that imbalanced data can lead to a false sense of high performance. This is caused by relying on the wrong kinds of metrics, in particular the de facto use of ROC‑AUC for evaluation. In the example presented earlier, the OOB AUC is 91%, suggesting excellent performance for the classifier. But the issue is that ROC‑AUC is insensitive to IR. Such a property is unwanted for imbalanced data, because rare cases are usually associated with greater costs; proper performance metrics should show a monotonic decrease with increasing IR, but ROC‑AUC does not have this property.

A more appropriate metric is the precision‑recall area under the curve (PR‑AUC). High precision means a high positive predictive value and a high recall (a high sensitivity). The trade‑off of these two values is measured by the area under the PR‑AUC, which provides a more appropriate metric for imbalanced data. In the previous example, the PR‑AUC is 63%, thus identifying that the classifier is not performing well. Another metric suitable for imbalanced data is the geometric mean index. This measures the balance of true positives and true negatives and is defined as the square root of these two values. In the earlier example, the true negative value is .988 and the true positive value is .140; therefore, the geometric mean is √(.988×.140) = .372, which is very low and a clear signal that the classifier is unable to perform well over both groups. By way of contrast, a geometric mean close to 1, which is highly desirable, occurs only when both true negative and true positive rates are close to 1, and the difference between the two is small.

How can we overcome this seemingly insurmountable hurdle? One often used strategy is to use what are called sampling methods. There are two types of such strategies used: undersampling and oversampling. An example of oversampling is SMOTE (Synthetic Minority Oversampling Technique), which creates artificial minority class examples to balance the data. Thus, for the data previously discussed, SMOTE would manufacture esophageal patients undergoing adjuvant therapy (in total, N₀ – N₁ = 5661 such patients would be needed to balance the data). Undersampling works in the opposite direction by undersampling the majority class to balance the data (in our example, the N₀ = 6449 patients undergoing surgery are undersampled to a size N₁ = 988).

Unfortunately, although these types of methods reported success in the literature, there are some hidden concerns with their use that researchers may be unaware of. One concern is the creation of artificial data. This is always difficult, and for highly imbalanced data it involves manufacturing a large amount of data and may lead to false results. Also, data subsampling that makes use of clinical information (which is what SMOTE does) can result in biased estimation of probabilities, a task that machine learning methods already struggle with in balanced settings. Even random sampling can introduce biased estimation of probabilities, and although correctable in some cases, it is rarely done in practice. Further, these problems persist for classical methods like logistic regression. A systematic study of oversampling and undersampling and SMOTE revealed that the probability of belonging to the minority class was strongly overestimated in penalised logistic regression.

Given all these issues, what can we do, and what is the answer? It turns out there is another solution that provides a clearer path forward. This method is also based on random subsampling of the data (technically, this type of sampling is actually called response‑based sampling because the sampling is based on the observed outcome values). Response‑based undersampling is used by random forests in a method called balanced random forests (BRF), which has been shown to have good classification performance. The theoretical explanation for why BRF and response‑based undersampling works was provided by O’Brien and Ishwaran, who showed that response‑based undersampling is theoretically equivalent to replacing the Bayes rule with a different decision rule known as the quantile classification rule. Rather than classifying patients on whether their probability is greater than or equal to 0.5, the rule adjusts the value 0.5 to match the underlying prevalence. Doing so yields a procedure with the optimal property of simultaneously maximising sensitivity and specificity.

In fact, there is no need to subsample at all! O’Brien and Ishwaran showed that one only needs to replace the Bayes rule with the new quantile rule to yield a procedure with theoretically justified properties. Furthermore, by forgoing sampling, the resulting estimated probabilities remain valid, and we benefit by using a much larger sample size (the entire data of size N₀ + N₁ vs. a smaller subset of size 2N₀ used by BRF). Unlike other machine learning methods, trees provide reliable and consistent estimation of probabilities. Thus, we obtain not only a good classifier, but also one with valid probability estimates. O’Brien and Ishwaran have developed the quantile classifier for use with random forests, a method referred to as RFQ (random forest quantile classifier). As illustration, RFQ was applied to the esophageal data described earlier, resulting in the following confusion matrix:

| Actual | PREDICTED | | |
|--------|-----------|---|---|
| | Surgery | Adjuvant | Error |
| Surgery | 4928 | 1721 | 0.02912 |
| Adjuvant | 103 | 885 | 0.104 |

Observe how there is better balance in conditional error. The majority class error rate has increased to 23.2%, but simultaneously the minority class error has decreased from 86% to 10.4%. This leads to a high geometric mean index of 82.5%, demonstrating good classification performance.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Time‑Related Events</summary><div class="details-content">

Adverse events in‑hospital or shortly after an operation are considered procedural risks and typically are analysed as described earlier in this section under "Early Events." Adverse events in the intermediate‑ and long‑term after an operation relate to its appropriateness, completeness, durability, events related to a device, and many other procedure‑related factors. These other factors include positive or negative response to the therapy, patient demographics, comorbidities, access to follow‑up care, social determinants of health, and a multitude of other factors. Here we focus on events that occur at varying intervals after operation, such as death, rehospitalisation, stroke, and reoperation.

Typical outcome events considered, such as death, are called *terminating events*; that is, they can occur only once. Others, such as thromboembolism and rehospitalisations for heart failure, may occur a number of times and are called *repeated morbid events*. Yet others are not dichotomous events, but events associated with severity, such as stroke; these are called *weighted morbid events*. Terminating, repeated, and weighted events have one attribute or assumption in common: They occur instantly in time distant from some starting time (e.g., cardiac operation), called *time zero*.

Depictions of time‑related events have been called by many names that reflect their origin in the discipline from which they arose (economics, government, industrial reliability testing, biologic sciences). In this book, estimates based on counting theory alone (nonparametric estimates, see Box 7.12) are termed *actuarial estimates*, for which there is strong historical precedence. This term does not imply the specific theoretical underpinnings or method of calculation, of which there are many.

<details class="med-details"><summary>
  
#### Historical Note</summary><div class="details-content">

The word *actuarial* comes from the Latin *actuarius*, meaning "secretary of accounts." The most notable actuarius was the Praetorian Prefect Domitius Ulpianus, who produced a table of annuity values in the early 3rd century a.d. This table continued to be used in Europe into the early 19th century. With emergence of both definitive population data and the science of probability, modern actuarial tables arose, produced first by Edmund Halley (of comet fame) in 1693. He was motivated, as was Ulpianus, by economics related to human survival, because governments sold annuities to finance public works. Workers in this overlapping area of demography and economics came to be known as *actuaries* in the late 18th century. In the 19th century, the actuary of the Alliance Assurance Company of London, Benjamin Gompertz, developed mathematical models of the dynamics of population growth (birth and death) to characterise survival. This model‑based, completely parametric (equations with constants estimated from data) methodology (see Box 7.12) was substantially different from the simple empirical counting methodology (nonparametric) of Halley.

In the more than 300 years since Halley, a multitude of methods have been developed (and often reinvented) in actuarial science, demography, statistics, industry, and medical science. They all have the common goal of estimating the distribution of intervals between a designated time zero and occurrence of an event. In medicine, an ad hoc *direct method* of survival estimation was developed in which nth‑year survival (e.g., 5‑year survival) excluded all patients whose follow‑up interval was less than n years. Life tables constructed in this fashion were not guaranteed to be monotonically decreasing, nor did they use all patients with all available information for each time‑related estimate.

The direct method highlights a unique problem with time‑related events data: *incomplete* (not missing) *data* (Box 7.20). Rarely are we patient enough to observe a group of patients until all have died. Rather, at a given point in time we know the duration of survival for some patients and therefore have complete data with respect to vital status; for others we know only that they are still living after a certain interval of time. We know *something* (they have not died within that interval), but information about their eventual date of death is incomplete. This is called *censored* data (see Box 7.20).

In 1950, Berkson and Gage published their landmark medical paper on the life‑table method for censored data, which they stated was no different from that used by others as early as at least 1922. Estimates of percent survival and censoring were made at arbitrarily determined intervals (e.g., yearly), although the original papers Berkson cites also address a method of generating a new estimate at every unique death interval that went unrecognised even after the work by Kaplan and Meier.

In 1952, Paul Meier at Johns Hopkins University and, in 1953, Edward Kaplan at Bell Telephone Laboratories, submitted to the *Journal of the American Statistical Association* a new method for survival analysis—the product‑limit method—that used more of the data. Estimates were generated at the time of each occurrence of an event. Furthermore, the basis for the estimates was grounded in sound statistical theory. Meier was interested in the survival of cancer patients; Kaplan was interested in the lifetime of vacuum tubes in repeaters in telephone cables buried in the ocean. The journal editor, John Tukey, believed the two had discovered the same method, although presented differently, and insisted they join forces and produce a single publication. For the next 5 years before its publication in 1958, the two hammered out their differences in terminology and thinking, fearing all the while they would be scooped. The product‑limit method (usually known as the *Kaplan‑Meier method*), after considerable delay awaiting the advent of high‑speed computers to ease the computation load, became the gold standard of nonparametric analysis.

Until 1972, only crude methods were available to *compare survival curves* according to different patient characteristics. The introduction by Cox of a proposal for multivariable survival analysis revolutionised the field. From then through the 1980s, survival analysis became the subject of thousands of practical and theoretical papers and scores of textbooks. These explored both parametric and nonparametric methods and identified limitations and assumptions, such as the effect of informative censoring. Much of the development was in the field of medicine.

Important developments also took place in industrial reliability. Wayne Nelson at General Electric developed a method for analysing time‑related events in the *cumulative hazard function domain* rather than the survivorship domain (see "Fundamentals" under "Time‑Related Events" later in this section) because he was interested in the rate at which events occurred (hazard function). The estimation procedure differed, therefore, from that of Kaplan and Meier, but the two methods converge as the number of events increases (see "Repeated Events" and "Weighted Events" later in this section). Importantly, by not "thinking" in the probability domain but rather the hazard function domain, he extended his method to repeated events and then extended this further to weighted events. He called the latter *time‑related cost functions*, recognising that recurrence of the same event, such as a machine repair, may be associated with different costs. (We have used this, for example, to analyse the grade of medical impairment from repeated episodes of thromboembolism following heart valve replacement and length of stay in repeated hospitalisations for a ventricular assist device.)

At the turn of the 21st century, Ishwaran at Cleveland Clinic, with his clinical colleague Lauer and research colleague Blackstone, developed survival methods for random forests. Initially, these were Cox‑like with proportional hazards, but soon became more general without a proportional hazards restriction. The resulting statistical package included not only survival, but random forests for classification and regression (including quantile regression) as well.

<details class="med-details"><summary>

#### BOX 7.20 Censored Data</summary><div class="details-content">

In survival analysis, time to an event is often not known. The data with respect to time of event are *incomplete*. It is as if some information has been "cut off," resulting in *censored data*.

In contrast, an *uncensored observation* is one for which (1) the event of interest has occurred and (2) the exact time the event occurred, X, is known. Some call such an observation *complete data*.

The most commonly encountered instance of incomplete (censored) data is the finding at follow‑up of a patient who is still alive or has not experienced the event of interest. If t is the interval between time zero (T = 0) and time of follow‑up, T = t, and X is the exact (future and unknown) time the event occurs, X is to the right of t on the timeline (time is presumed to progress from left to right). This form of censoring is called *right‑censored data*. Other examples of right‑censored data are morbid events that do not occur before the patient dies, and death (rather than follow‑up) is the censoring mechanism.

Occasionally we know that a patient has experienced the event, but we do not know exactly when. We may know it occurred between time t₁ at the earliest and t₂ at the latest—that is, t₁ ≤ X ≤ t₂. This form of inexact timing of the event is called *interval censored data*. An extreme variant of interval censored data is the situation in which the event is known to have occurred before the date of follow‑up, but no information is known as to when. In this case, the interval is between time zero and follow‑up. Such data are called *left truncated*.

An assumption of most methods for analysing time‑related events is that the mechanism of censoring is unrelated to occurrence leading to an event. Such mechanisms are said to result in noninformative censoring. Under some circumstances, however, it is intuitive that this is a poor assumption. For example, if transplantation is a censoring mechanism for death after a patient is placed on a waiting list, it is possible that informative censoring has occurred, because transplants may preferentially be triaged to the patients thought least likely to survive. Methods for identifying and managing informative censoring are not yet in widespread use.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Fundamentals</summary><div class="details-content">

Time‑related events are those presumed to occur at an instant in time after a defined starting time. Information about occurrence of the event and when it occurred is obtained by patient follow‑up, as detailed under "Follow‑up Information" in Section II.

<details class="med-details"><summary>
  
##### Essential Data</summary><div class="details-content">

Successful analysis of time‑related events requires answers to three fundamental questions:

- What is the event?
- When is time zero?
- Who is at risk?

**Event.** Defining the *event* for an analysis may be straightforward, such as death from any cause. Events that are not uniformly fatal are called *nonterminating* or *morbid events*. Examples include stroke, reoperation, and prosthetic valve endocarditis. A clear, uniformly applied definition of the event is vital and has two components: (1) It defines an *uncensored* patient who experiences the event, and (2) it defines a *censored* patient who at some point in time becomes untraced (censored) as regards the event.

Caution must be exercised in considering the time‑relatedness of some events. For example, degeneration of a xenograft heart valve is a time‑related *process*, not an event. Timing of reoperation for structural valve deterioration of a xenograft, therefore, depends on the rate of a process, the patient’s response to that process, and medical decision‑making. Processes that can be measured at multiple times are best studied by the methods described under "Longitudinal Outcomes" later in this section.

**Time Zero.** The moment a patient becomes at risk of experiencing the event of interest is called *time zero* (Fig. 7.22). For patients who undergo interventions such as a cardiac procedure, time zero is often the time of the procedure. Under many circumstances, however, defining time zero is not so simple. For example, it is not easy to date the onset of ischaemic heart disease, although it may be easy to identify the date of a first MI.

**At Risk.** Patients remain *at risk* of experiencing the event from time zero to either the occurrence of the event or the time at which they no longer can experience the event (censoring; see Box 7.19). Defining who is at risk demands thought. For example, if the event is reoperation for bioprosthetic structural valve deterioration, then patients receiving a mechanical prosthesis are never at risk. This distinction may not be obvious to a statistician asked to analyse structural valve deterioration unless the surgeon‑investigator explains it in detail. In this example, patients receiving a bioprosthesis also become no longer at risk of this event the moment the bioprosthesis is explanted for other indications. They are permanently censored at that point. Note that if a repeated morbid event is being analysed, such as transplant rejection or thromboembolism or rehospitalisation for heart failure, patients continue to remain at risk after each occurrence of the event until they are censored by death, end of follow‑up, or, in the case of transplant rejection, heart excision.

</div></details>

<details class="med-details"><summary>
  
##### Granularity of Time</summary><div class="details-content">

The basic data required for the simplest time‑related analyses are (1) the interval from time zero to either occurrence of the event or censoring (usually the interval to end of follow‑up) and (2) an indicator variable specifying that the event occurred (uncensored) or did not (censored). Granularity of this interval is important, particularly for parametric models (see "Parametric Survival Estimation" later in this section). The shorter the interval from time zero to the event, the finer the granularity required. In cardiac surgery, calculating the interval for a patient dying on the day of operation or experiencing a complication may require use of clock time (hours and minutes) of time zero (generally the first time that an attempt is made to wean the patient from cardiopulmonary bypass or that the operation is declared completed) and clock time of death or of the complication. When the interval is long, simply subtracting the calendar date of the event from that of surgery is sufficiently granular.

</div></details>

<details class="med-details"><summary>
  
##### Time‑to‑Event Model</summary><div class="details-content">

There are two distinctly different ways to think about time‑related events, and this difference must be understood for effective communication between the surgeon‑investigator and the statistician. First, time‑to‑event data may be thought of as simply the *distribution of intervals* to an event (martingale or counting theory). This will be the framework with which most statisticians are familiar. Second, time‑to‑event data may be thought of in terms of the mathematics of mass transport from one state (e.g., alive) to another (death) (Markov process theory). This is the framework more familiar to a surgeon, who has training in such mass transport phenomena as diffusion, heat transfer, blood flow, and other dynamic transport processes involving rates.

**Distribution Framework (Counting Process).** Intervals to event are thought of like any other continuous, positive‑valued variable. A common expression is the *probability density function*, which is analogous to an ordinary histogram such as the distribution of ages (see Fig. 7.8A). Conventionally, however, the distribution of time to events is expressed as a *cumulative distribution* graph, which is the integral (area) under the probability density function (see Fig. 7.8B). The only nuance is that by convention, the graph is turned upside down (its *complement*) so that it starts at 100% and falls as the interval lengthens. This is called the *survivorship function*. The function also useful in survival analysis is the ratio of the probability density function to the survivorship function (the conditional probability density function), because it represents the risk of the event in patients who have not yet experienced it. This ratio is called the *hazard function*.

If S(t) is the survivorship function across time t, h(t) the probability density function, and λ(t) the hazard function, the following mathematical equations express the prior relations:

$$h(t) = \frac{\partial s(t)}{\partial t} \quad (7-4)$$

where ∂S(t)/∂t is the slope (derivative) of S(t), and

$$\lambda(t) = \frac{h(t)}{S(t)} \quad (7-5)$$

**Mass Transport Framework (Hazard Function).** The *hazard function*, or λ(t), sometimes called the force of mortality, can be envisioned as "transporting" patients from the state of being alive, S(t), to the state of death F(t) (Fig. 7.23). This framework of thinking was initially suggested by John Graunt in the mid‑1600s. Exactly the same equations, 7‑4 and 7‑5, hold for this dynamic process.

![](_page_65_Figure_16.jpeg)

**FIGURE 7.22** Right‑censored time‑related‑events data. Conceptual graph of incomplete data in a group (cohort) of patients followed after operation cross‑sectionally (see "Follow‑up Information" in Section II). (A) Calendar date is along horizontal axis, and each patient enters at a different date, ordered from earliest date of operation to most recent, top to bottom. Systematic active follow‑up has a common closing date. Patients still alive at follow‑up are depicted by *arrowheads* indicating that they will continue to be followed. *Terminated lines* are deaths. (B) Patients are now aligned at *time zero*, when operation was performed. They have also been sorted from shortest interval to longest (called *rank order*). Patients who are still alive are depicted by *lines with arrowheads*. Time of their death is unknown and in the future, but we at least know they have lived as long as is indicated by the length of their follow‑up line. This is called *incomplete data* with respect to death, or *censored data*. Because the arrow of time is presumed to proceed from left to right, data are called *right censored.* The four lines that terminate without an arrow are deaths. (C) Basic counting needed to estimate survival. Along the left is number of patients at risk; at time of shortest follow‑up, all eight patients were at risk. Number decreases progressively as patients either die or are no longer traced. On right is the count of deaths at that interval (here, as is usually the case, the number is 1).

![](_page_65_Figure_16.jpeg) — *Caption as above*

</div></details>

<details class="med-details"><summary>
  
##### Useful Mathematical Relations</summary><div class="details-content">

The area beneath the hazard function accumulates exposure to risk across time and is called the *cumulative hazard function*, Λ(t):

$$\Lambda(t) = \int_0^t \lambda(u) du \quad (7-6)$$

This relation yields other useful relationships:

$$S(t) = e^{-\Lambda(t)} \quad (7-7)$$

where e is the base of the natural logarithms, and

$$-\operatorname{Ln}[S(t)] = \Lambda(t) \quad (7-8)$$

where Ln is the natural logarithm. Thus, the cumulative hazard function is easily calculated from estimates of S(t), and its slope reflects the shape of λ(t).

![](_page_65_Figure_16.jpeg) — *Placeholder for Fig. 7.23*

**FIGURE 7.23** Compartmental mass‑balance analog of a time‑related terminating event such as death. Decrease in survivors as interval (time t) after operation increases is proportional to hazard rate λ(t) (instantaneous risk) for death multiplied by number of individuals remaining at risk at time t.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Nonparametric Survival Estimation</summary><div class="details-content">

The nonparametric *Kaplan‑Meier method* is the most commonly used method for estimating the survivorship function in medicine, although a number of others have been proposed. Each Kaplan‑Meier estimate incorporates the number of patients experiencing an event since the last event occurred and the number of patients at risk in that interval, taking into account censoring (see Fig. 7.22C). Computing Kaplan‑Meier survival estimates is relatively straightforward. The basic idea is to first calculate the probability of surviving (being event‑free) in the interval since the last event occurred (the ratio of events, generally 1, to number at risk). This probability is then multiplied by the probability of surviving up to that time, a product called a *conditional probability*. This successive multiplication of individual probabilities by preceding ones is what gave rise to the generic description of this method, the *product‑limit* method. It also guarantees that the estimates of survival decrease monotonically.

As can be imagined, at the longest intervals, few patients remain at risk and individual survival estimates make large jumps. For example, if four patients are alive and one dies, the probability of survival in that interval is only 75%. This phenomenon results in systematic bias downward, underestimating the survivorship function. This is called the *completion effect*.

Each Kaplan‑Meier estimate has an expressed degree of uncertainty. Often this is reported as the standard error (essentially the 68% symmetric confidence intervals). Preferably, however, the degree of uncertainty is expressed using asymmetric confidence units. When plotted, a symbol positioned on the horizontal axis at the time of each event and on the vertical axis at the Kaplan‑Meier estimate graphically displays the information (Fig. 7.24A).

There is controversy about (1) whether or not Kaplan‑Meier estimates should be connected and (2) if they are connected, in what fashion. If parametric estimates are also generated, the obvious solution is to compare nonparametric and parametric estimates, with nonparametric estimates unconnected (Fig. 7.24B). If this is not the case and connection is desired, most statisticians connect estimates with a horizontal straight line at the level of the previous estimate. This is technically called "zero order" interpolation with a left step. It can be proven that this practice is the worst possible means of connecting estimates. Therefore, some statisticians connect the estimates by straight line segments (first‑order interpolation), as did Berkson and Gage, but others use yet higher‑order interpolation methods that approach the smoothness of parametric estimates.

Kaplan‑Meier and other nonparametric life‑table estimates are not "raw data" (descriptions of actual events). The time of death actually "happened," but the proportion, or percentage, is a computation and thus an estimate.

![](_page_66_Figure_2.jpeg)

**FIGURE 7.24** Nonparametric and parametric depictions of survival after repair of atrioventricular septal defects. (A) Nonparametric estimates are represented by individual *circles*, and their 70% confidence limits (CL) by *vertical bars*; numbers in parentheses are the number remaining at risk at various times. (B) Parametric depiction superimposed on nonparametric estimates represented by *solid line*, and 70% CLs by *dashed lines*. Note excellent correspondence between parametric and nonparametric estimates, each obtained independently of the other. (From Studer and colleagues.)

<details class="med-details"><summary>
  
##### Random Survival Forests</summary><div class="details-content">

Random forests was originally developed for regression and classification problems. Random survival forests (RSF) was introduced by Ishwaran and colleagues to extend random forests to the setting of right‑censored survival data. Implementation of RSF follows the same general principles as random forests:

- Survival trees are grown using bootstrapped data.
- Random feature selection is used when splitting tree nodes.
- Trees are generally grown deeply.
- The survival forest ensemble is calculated by averaging tree survival estimators.

Two types of ensemble estimators are provided, one for the cumulative hazard function and one for the survival function. The former is estimated by the Nelson‑Aalen estimator and the latter by the Kaplan‑Meier estimator.

Although Cox’s proportional hazard regression method is popular for time‑to‑event data analysis, RSF has become attractive as a nonparametric method with less restrictive model assumptions. Some of RSF’s important properties are as follows.

- It is fully nonparametric and can identify survival risk factors without assuming a parametric relationship (linear or nonlinear) or prior knowledge of interactions among variables.
- It is robust to outliers and does not suffer from the completion effect.
- It can be used for high‑dimensional data.
- It offers OOB (cross‑validated) prediction that does not overfit the data and therefore can be used for reliable inference from the training data.
- It provides a fully nonparametric variable importance measure of a variable’s contribution to predicting survival.
- Variable screening by VarPro is embedded.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Parametric Survival Estimation</summary><div class="details-content">

Unlike nonparametric survival estimation that arose from the theory of counting, model‑based or parametric survival estimation (see Box 7.12) arose out of biomathematical consideration of the force of mortality, the hazard function. Unlike survival, which depicts *prevalence* of an event (or freedom therefrom) across time, the hazard function depicts the *rate* of occurrence, or *incidence*, of an event across time (see Box 7.11).

<details class="med-details"><summary>
  
##### General Comments</summary><div class="details-content">

During the Great Plague, John Graunt assumed a constant risk of mortality (the mortality rate or force of mortality). He called it the *hazard function* after a technical term for a form of dicing that had, by the mid‑17th century, come into common usage to mean "calamity," much as "crap shoot" has taken on the connotation of the losing throw in craps. Because a constant hazard rate presumes a mathematical model of survival, his was a *parametric method*. Graunt’s colleague, William Petty, believed instead that the hazard rate was age related (time varying).

Thereafter, the hazard function essentially disappeared from the medical world until the 1980s, although it remained in use in industry and in government depictions of population behaviour. This is possibly because the hazard function, unlike the survivorship function, appears to have no well‑understood statistical counterpart, as do the Kaplan‑Meier estimator and death density function. It may also be related to the difficulty of understanding intuitively a series composed of almost an infinite number of instantaneous estimates of risk to the easily perceived accumulated risk expressed as freedom from the event. In addition, the inherently mathematical nature of the hazard function makes it difficult and forbidding to many physicians whose statistical collaborators may not have thought to introduce it to them in terms of biochemical reaction rates or other familiar physiologic rates. For those who need a visceral sense of the hazard function, think of its magnitude in terms of the sudden change from a sense of well‑being to one of danger when screeching tyres are heard close by, or the less dramatic difference between the speed of your automobile (a rate like the hazard function) and distance travelled (like the survivorship function).

</div></details>

<details class="med-details"><summary>
  
##### Linearized Rate</summary><div class="details-content">

The most common expression of hazard is the *linearized rate*. It was linearised rates that John Graunt used when exploring risk factors for the plague. A linearised rate means the hazard function is constant across time. The analogy is radioactive decay: a constant rate of decay leads to exponential decrease in radioactivity. Likewise, a constant hazard leads to an exponentially decreasing survivorship function. When hazard is constant, the cumulative hazard is linearly increasing: Λ(t) = at; that is, it increases linearly with increasing time with constant hazard slope a. Then S(t) = exp(–at), where exp is the exponential function, and thus survival decreases exponentially.

The linearised rate is easily computed by simply counting the number of events and dividing by the total follow‑up time of a group of patients:

$$\hat{\lambda} = \frac{n_d}{\sum_{i=1}^{n} t_i} \quad (7-9)$$

where \(\hat{\lambda}\) is estimated constant hazard, n_d is number of events, n is total number of patients, and t_i is individual (i) time to the event.

Importantly, if there are multiple events per patient, such as thromboembolic events, all occurrences are counted. CLs of linearised rates are also easily calculated (see "Repeated Events" later in this section). However, there are a number of different, although roughly equivalent, formulae for these CLs. For example, Cox and Oakes present a simple formula:

$$\text{SD}\left[\text{Ln}\left(\hat{\lambda}\right)\right] = \sqrt{\frac{1}{n_d}} \quad (7-10)$$

and the upper CL of \(\hat{\lambda}\) is

$$\hat{\lambda}^{+} = e^{\text{Ln}(\hat{\lambda}) + z\sqrt{1/n_d}} \quad (7-11)$$

and the lower CL is

$$\hat{\lambda}^{-} = e^{\text{Ln}(\hat{\lambda}) - z\sqrt{1/n_d}} \quad (7-12)$$

where z is the confidence coefficient (1 for 68% CL, 1.96 for 95% CL), and e is the base of the natural logarithms.

</div></details>

<details class="med-details"><summary>
  
##### Time‑Varying Rate</summary><div class="details-content">

Although linearised rates have frequently been used for cardiac surgery data, particularly by regulatory agencies, it is uncommon for hazard to be constant. Rather, cardiac procedures, perhaps more than many other therapies, impose on patients a time‑related course composed of highly variable and sometimes rapidly changing instantaneous risk of death modulated by multiple risk factors of varying strength and times of influence. Certainly, the hazard function is greater 1 hour after operation than it is 1 week, 1 month, or 1 year after operation. Thus, a great deal of practical importance is attached to the time‑varying hazard function after operations.

Visual examination of life‑table depictions of events after cardiac operation in cohorts of well‑followed patients reveals simple, smooth time‑varying patterns (see Fig. 7.24). These patterns suggest that the intervals between events are closely spaced immediately after the operation (usually time zero) and become more widely spaced in the hours and days that follow. Some days, weeks, or even months later, they merge into a sparse, random spacing of events. If follow‑up evaluation is extended considerably, the time interval between events may again begin to shorten, representing accelerated risk. Nevertheless, under most circumstances, the majority of patients are free of the event even after many years, making censoring prevalence high in the cardiac surgical setting.

The stereotypical patterns observed in analysis of several thousand life tables of freedom from an unfavourable outcome event after cardiac operation led the UAB group, at the urging of D.R. Cox, to believe that a mathematical model for time‑related events could be developed. In this development, it was thought likely that risk factors for late‑occurring events would differ at least in strength, if not qualitatively, from those in the acute phase of recovery after operation, and that their prevalence might be different in different time frames. Further, the ability to graph patient‑specific risk and survival estimates became increasingly important to the development of new knowledge in cardiac surgery. Finally, these depictions required CLs. Therefore, the UAB group introduced a hazard function modelling method that produced not only time‑related freedom from an event but also time‑varying risk (hazard function) for an event, complete with CLs. The method is analogous to using a prism to decompose white light into its various colours. It decomposes time‑varying hazard into as many as three simple additive hazard phases, as shown in Fig. 7.25 (a more generalised method would allow more than three phases for unusual situations, as has been done for longitudinal outcomes described later in this section).

The mathematical model is as follows:

$$\Lambda(t, \mathbf{x}) = \sum_{j=1}^{k} \mu_j(\mathbf{x}_j, \beta_j) \cdot G_j(t, \Theta_j) \quad (7-13)$$

where Λ(t, x) is the cumulative hazard function, μ_j(x_j, β_j) is a function of risk factors for the jth phase, G_j(t, Θ_j) is a shaping function unique for each phase, and Σ is the sum of the individual components (phases) 1 through k. Such a formulation places Equation 7‑13 into the class of mixture distributions and competing‑risk models (see "Competing Risks" later in this section), with each hazard phase competing for the event.

The shaping functions G_j(t, Θ_j) are based on a collection of biomathematical models of risk that were assembled into generic equations. They permit great flexibility in shape of the short‑ and long‑term hazard. Shape of the early hazard phase of short‑term risk originated as an assembly of a large number of nested mathematical models describing biochemical reactions, ecology, and population growth. The early hazard function can begin at infinity after time zero, it can start at zero and peak, or it can start at a finite value and decline from there. Shape of the constant hazard phase, as its name implies, is a constant value (horizontal line) across time. Shape of the late hazard function is based on a generalisation of the Weibull model of risk used widely in industrial settings.

Although early and late hazard phases can have several of their shaping parameters estimated, in practice they usually reduce from four down to one or two parameters, resulting in simple, special‑case forms of their respective generic mathematical constructs.

Each phase also has a scaling function μ_j that can carry risk factors. This parameter was selected by sensitivity analyses and was not arbitrary. The form of the regression model may be either logit‑linear or log‑linear (see Box 7.17); they yield nearly identical coefficients and shapes.

All phases of the model are defined from time 0 to infinity. The phases are overlapping and additive across time (see Fig. 7.25B), but the nature of the shaping functions allows a phase to predominate more at one time than another (see Fig. 7.25C). This property permits the model to accommodate risk factors not displaying proportional hazard properties across all time (see "Cox Proportional Hazards Regression" later in this section).

A computer software program interfaced to the SAS system is available at www.lerner.ccf.org/quantitative‑health/software.

![](_page_67_Figure_13.jpeg)
![](_page_67_Figure_14.jpeg)
![](_page_67_Figure_15.jpeg)

**FIGURE 7.25** Conceptual depiction of time‑varying patterns of hazard. (A) Survivorship (proportion event free), its corresponding cumulative hazard function, and hazard function (time‑related instantaneous risk of event and slope of cumulative hazard). (B) Hazard function from A shown decomposed into three simpler components, or phases, that when added together yield total hazard: (1) a rapidly declining early hazard phase, (2) a constant hazard phase, and (3) a late‑rising hazard phase. (C) Relative influence of each hazard phase across time as a proportion of total hazard shown in A. Initially, the early hazard phase predominates, at 2 to about 8 years the constant hazard phase predominates, and thereafter the late hazard phase predominates. It is the temporal separation of components (decomposition) that permits separate sets of risk factors to essentially independently modulate each hazard phase.

</div></details>

<details class="med-details"><summary>
  
##### Estimating Time‑Related Hazard Function</summary><div class="details-content">

The first step in developing a model specific to a set of event‑time data is to determine the overall hazard function across time (without considering risk factors). This is the step, sometimes a time‑consuming one, that differs from the work required in using the Cox model described later in this section. The work is best done in the cumulative hazard domain by taking minus the logarithm of the life‑table estimates (Fig. 7.26). This depiction makes evident the early phase of hazard, the duration of its predominance, and the point at which it levels off (its asymptotic value); the time to halt that asymptotic level is a good estimate for the half‑time of the early hazard phase. Slope of the intermediate phase of risk yields an estimate of the constant hazard scaling parameter. Departures late from the constant hazard slope yield information about the late rising phase of hazard if it is present, but a value of 2 (time squared) is a reasonable starting value because it is close to that of the general population. Such plots also reveal whether one or two of the three phases may be completely absent, given the duration of follow‑up and distribution of observed events.

The method of maximum likelihood is used to estimate values for the parameters of the proposed model, which includes exploring various mathematical forms of the early and late generic shaping equations, defined by the sign of their exponents, and reducing the model to its simplest form (parsimony). The only input to this process is the sequence of event and censoring intervals. No arbitrary assignment of events to early, constant, or late hazard phase is required. The model simply attempts to best represent the distribution over time of these intervals. An iterative (optimisation) procedure is used to estimate the parameter values. Once estimated, these values can be used to solve the resulting equation for time‑related freedom from the event and the hazard function (Fig. 7.27).

Absence of some phases may be related to duration of follow‑up or number of events observed and their intervals, which may make it difficult to identify statistically the existence of a phase. Most commonly, one or two phases are found.

At this juncture, investigation is made of model validity. The calculated (parametric) event‑free curves are superimposed on the Kaplan‑Meier estimates and examined for lack of correspondence (see Figs. 7.24 and 7.26).

![](_page_68_Figure_15.jpeg)

**FIGURE 7.26** Cumulative hazard depiction of data set used in Fig. 7.24. An early phase component is apparent. Thereafter it is unclear whether there is a constant hazard phase or a rising one. This must be tested by statistical analysis. Nonparametric depiction is as in Fig. 7.24. (A) Nonparametric estimates. (B) Superimposed nonparametric and parametric estimates. Note good correspondence between the two sets of estimates. (From Studer and colleagues.)

![](_page_69_Figure_19.jpeg)
![](_page_69_Figure_20.jpeg)
![](_page_69_Figure_21.jpeg)

**FIGURE 7.27** Death after coronary artery bypass grafting (CABG), illustrating survivorship and hazard functions and decomposition of hazard into phases. (A) Survival. *Solid blue line* is survival estimate, and *dashed lines* enclose confidence limits (CL) equivalent to ±1 standard error. Numbers are percent survival at 30 days, and 5, 10, 15, and 20 years after operation. *Red line* is survival in an age‑sex‑race‑matched population life table. (B) Hazard. *Solid blue* line is hazard estimate, and *dashed lines* enclose CLs equivalent to ±1 standard error. *Red line* is hazard in an age‑sex‑race‑matched population life table. (C) Components of instantaneous risk of death (hazard). Three are depicted: (1) an early rapidly falling hazard phase, (2) a constant hazard phase, and (3) a late‑rising hazard phase. These components sum across time to overall hazard function shown by *dotted line*. (From Sergeant and colleagues.)

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Multivariable Semiparametric and Parametric Analysis</summary><div class="details-content">

Feigl and Zelen introduced multivariable analysis of constant hazards using a log‑linear model (see Box 7.17). This formalised the method used 300 years earlier by Graunt, but it is inapplicable to data with time‑varying hazards that typically characterise risk after interventions.

A number of methods were used in a limited way in demographics and industry, but in 1972 everything changed. That year, D.R. Cox proposed a multivariable method that did not require estimating the hazard function. Rather, it assumed that an unspecified underlying hazard function of any shape existed and was modulated in a regular way by a set of risk factors. This is called a *semiparametric method* because the model for risk factors was parametric, but the underlying hazard was unspecified.

<details class="med-details"><summary>
  
##### Cox Proportional Hazards Regression</summary><div class="details-content">

The log‑linear form (see Box 7.16) of the Cox model of risk factors is

$$\operatorname{Ln}[\lambda(t)] = \operatorname{Ln}[\lambda_0(t)] + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_k x_k \quad (7-14)$$

where λ₀(t) is the underlying unspecified hazard that is modified by risk factors (x) that are weighted by coefficients (β); Ln is the natural logarithm. The importance of the log‑linear form is that the scale of both β and x can span the entire number line, and still the hazard function will be positive when Ln[λ(t)] is exponentiated, which must be the case.

Another way to express the Cox model is in the cumulative hazard domain. Let us say there is one dichotomous risk factor, x₁, and coefficient, β₁. Then:

$$\Lambda(t) = \Lambda_0(t)e^{\beta_1 x_1} \quad (7-15)$$

where Λ(t) is the cumulative hazard function, Λ₀(t) is the underlying cumulative hazard, and e is the base of the natural logarithms. The ratio of cumulative hazard with the factor present (x₁ = 1) to that with it absent (x₁ = 0) is

$$\frac{\Lambda(t, x_1 = 1)}{\Lambda(t, x_1 = 0)} = e^{\beta_1} \quad (7-16)$$

Taking logarithms and rearranging:

$$\beta_1 = \operatorname{Ln}[\Lambda(t, x_1 = 1)] - \operatorname{Ln}[\Lambda(t, x_1 = 0)] \quad (7-17)$$

Notice that the logarithm of the two cumulative hazard curves is separated across all time by a constant distance β₁ (Equation 7‑17), and the exponential of β₁ (Equation 7‑16) represents a constant ratio of cumulative hazards. This idea of a constant distance of separation or constant ratio is known as the *proportional hazards assumption* of the Cox method. Recall that cumulative hazard is estimated from the survival curve S(t) by taking minus its logarithm (Equation 7‑8). Therefore, if logarithms are taken of cumulative hazard using either Kaplan‑Meier or Nelson estimates (or a single logarithm of Nelson cumulative hazard estimates), the proportionality assumption can be checked. If the proportional hazards assumption does not hold, nonproportional hazard methodology must be used.

Often, β is expressed in a fashion to reflect relative risk as hazard ratios and their CLs (see Box 7.3). This can be seen from Equation 7‑16, where the β₁ is exponentiated, showing a ratio of hazards with and without the risk factor. CLs are asymmetric, obtained from the variance of β. The hazard ratio makes sense for dichotomous variables, but less sense for continuous ones, particularly if transformation of scale has been necessary.

</div></details>

<details class="med-details"><summary>
  
##### Parametric Hazard Function Regression</summary><div class="details-content">

Multivariable analysis of risk factors is no more (or less) difficult in the totally parametric hazard function domain than in the logistic or Cox regression domain (see "Multivariable Analysis" earlier in this section). The only intellectual (not computational) complexity is that risk factors are estimated simultaneously in all phases of hazard. Within each hazard phase, risk factors are assumed to obey a proportional hazards assumption (see "Cox Proportional Hazards Regression" earlier in this section). However, the entire model need not (and generally does not) obey the proportional hazards assumption. It therefore has been classified as a model of nonproportional hazards.

Among the diagnostics for such a model is the general depiction of the time frame during which each hazard phase dominates (see Fig. 7.25C). The data can be examined within these separate time frames for screening and for transformations that may be necessary for continuous and ordinal variables.

After risk factors have been identified in each hazard phase, a final check on which phase a risk factor properly belongs is performed. Occasionally a risk factor will be found with similar strength in each hazard phase, and such a variable indeed meets the proportional hazards assumption across the entire span of follow‑up represented in the data. This suggests that the entire sum in Equation 7‑13 could be multiplied by another scaling function consisting of proportional hazards variables.

A complete description of the final equation that emerges from the hazard function multivariable analysis includes a model specification, coefficients for all variables (incremental risk factors) in each phase of the equation (recall that a risk factor can occur in more than one phase), intercept for each phase, shaping parameter estimates, and a variance–covariance matrix. Because the equation is by definition completely parametric, prediction of an event‑free curve and its corresponding hazard function, each accompanied by CLs, is possible for any desired combination of values for the risk factors by substituting values for each variable in the equation and solving it for any time interval(s) desired.

</div></details>

<details class="med-details"><summary>
  
##### Validating the Multivariable Analysis</summary><div class="details-content">

Validation of the multivariable analysis in a specific study is accomplished by comparing the computed time‑related survival of a stratified life‑table depiction of the entire study group with that predicted by the multivariable equation (Fig. 7.28). This process can be extended to subgroups to check the adequacy of modelling efforts and is accomplished in the following manner. For each patient, the survivorship function is estimated across time \(\hat{S}(t; \mathbf{x}_i, \Theta, \beta)\) from each individual’s specific values for the risk factors in the equation. In the previous notation, t is the time interval after time zero, Θ is the vector (column of numbers) of shaping parameter estimates, β is the vector of regression coefficient estimates, and x_i is the corresponding vector of risk factor values for individual i. For clarity, this is abbreviated to notation \(\hat{S}(t; \mathbf{x}_i)\). In addition, the upper and lower CLs for \(\hat{S}(t; \mathbf{x}_i)\) are calculated using the variance–covariance matrix from the multivariable analysis. The predicted value of time‑related survival in a group of n individuals is then calculated as the average at each point in time of the individual survival estimates:

$$\widetilde{S}(t) = \sum_{i=1}^{n} \frac{\hat{S}(t; \mathbf{x}_i)}{n} \quad (7-18)$$

The theoretical justification for this is that the individual \(\hat{S}(t; \mathbf{x}_i)\) represents proper cumulative distribution functions, and these should sum to another proper cumulative distribution function. On the other hand, specific theory underlying the formulation of CLs for this estimate in a straightforward manner has not been available. A conservative estimate has been made, however, by averaging the upper CLs for each individual to form an upper CL for \(\widetilde{S}(t)\), and similarly for the lower CL. The error, if present, is that the confidence intervals are too wide. These confidence intervals have been found to be roughly equivalent to those obtained by averaging the variance of the logistic transform of \(\widetilde{S}(t)\), but they are somewhat more stable.

For the validation, time‑related freedoms from the event of stratified groups of the cohort are determined nonparametrically as well and plotted according to the Kaplan‑Meier estimator. For example, Fig. 7.29 shows tetralogy data stratified according to presence or absence of a transanular patch. This variable was not identified as a "significant" risk factor in the multivariable analysis. Nonetheless, averaged parametric survival values for patients in the subset compare well with stratified Kaplan‑Meier survival. (This validation study also indicates that difference in prevalence of risk factors in patients with and without transanular patching, not the patching itself, appears to account for the difference in mortality.) Propensity score matching would provide a reliable support for this inference (see "Balancing Scores" in Section V).

In a fashion akin to the logistic model, an overall assessment of validity within each stratum also may be obtained by calculating the number of expected events and comparing that with the number of observed events. In the domain of time‑related events, *conservation of events* is attributed to the cumulative hazard function rather than to the probability domain. Thus, for each individual’s specific follow‑up interval (t_i), the cumulative hazard, \(\hat{\Lambda}(t_i; \mathbf{x}_i)\), is calculated. These are summed up to estimate the expected number of events (E):

$$E = \sum_{i=1}^{n} \hat{\Lambda}(t_i; \mathbf{x}_i) \quad (7-19)$$

The expected number of events is compared with the observed number of events by a chi‑square goodness‑of‑fit test.

![](_page_70_Figure_9.jpeg)

**FIGURE 7.28** Validation of time‑related multivariable equation. A multivariable equation for time‑related death after left ventricular reconstruction (Dor operation) was solved for each patient in the study. Patients were then stratified by preoperative QRS duration and the curves averaged within strata (*solid lines with dashed confidence limits [CL]* equivalent to ±1 standard deviation of estimates). Superimposed on these predictions are Kaplan‑Meier survival estimates, shown by *open circles* (QRS duration ≤ 120 ms) and *squares* (QRS duration > 120 ms); *vertical bars* represent 70% CLs. Note good correspondence between model‑based predictions and Kaplan‑Meier survival estimates. (From Cleveland Clinic, 1997 to 2002, n = 84.)

![](_page_71_Figure_3.jpeg)

**FIGURE 7.29** Internal validation of a parametric multivariable analysis of death after repair of tetralogy of Fallot. Transanular patching (TAP) versus simple repair is not a risk factor in the multivariable equation. Patients have, however, been stratified according to this variable. Nonparametric estimates *(circles and squares)* are Kaplan‑Meier depictions for these strata. *Solid parametric lines* represent the average of individual parametric curves calculated for each patient in the stratum, obtained as described in the text. Close agreement of predicted and observed survival indicates that prevalence of other risk factors differs in these two groups, leading to an apparent difference in survival. (From Kirklin and colleagues.)

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Expressing Degree of Uncertainty in Time‑related Depictions of Freedom from an Event</summary><div class="details-content">

There is conflict (or at least a difference of opinion) between (1) those who focus on a single overall P value for the difference between two time‑related freedom‑from‑event depictions (life tables) and (2) those who use time‑related depictions as a consideration when recommending therapy for individual patients (see "Time‑Related Events" earlier in this section). This stems from their differing needs. Studies involving testing hypotheses, such as clinical trials in which treatment is randomly assigned, usually require a yes/no (true/false) answer to a hypothesis, and a single overall P value may be appropriate. The clinician, on the other hand, lives daily with the reality that, for an individual patient, occurrence of an unfavourable outcome event at one point in time (interval after time zero) is often considerably less disadvantageous than occurrence of the same event at another point in time; the clinician also understands that there is considerable variability among patients as to the time of greatest disadvantage.

Mantel recognised in 1966, as no doubt did others, that time‑related variability occurs in the relation between survival curves of two different treatments or between groups of patients. He noted that in some cases the difference may be similar throughout time, that in others the relation between the two may be similar at some times but not at others, and that in still others one survival curve may cross another. He also recognised that varying hazard phases are present after surgical procedures, and he understood the variability in the "utility function," or value, ascribed by different individuals to the same survival curve.

These matters posed difficulties for those seeking a simple yes/no answer to a hypothesis. In response to this, Mantel and others set about to devise tests that would generate a single overall P value. These tests make different assumptions, each attempting to overcome some difficulty posed by the differing patterns of survival. In contrast, clinicians wish to compute, examine, and understand the variability in the time‑related comparisons between curves to best inform and advise patients. Thus, they wish to know the *time‑related certainty* of differences that may exist.

The scanning method of comparing confidence intervals, as well as methods involving P values, can be applied to develop time‑related estimates of the degree of uncertainty in comparing survival and other event‑free curves. A depiction of time‑related survival is in actuality a series of proportions; the proportions are discrete when determined by the Kaplan‑Meier life‑table method and are continuously variable when determined by the parametric hazard function regression analysis method. Thus, the overlapping or nonoverlapping of confidence intervals around each of two survival curves can be used to scan the possibility, at various specific intervals after time zero, that the difference between the curves is or is not likely to be due to chance alone (Fig. 7.30A). Also, based on classic statistical principles, the time‑related confidence intervals around the *difference* between the two proportions can be determined and their relation to zero computed and visualised in a continuous, time‑related depiction (Fig. 7.30B). An equivalent expression of absolute difference is *absolute risk reduction*, the inverse of this difference, often expressed as *number to treat* to save one life (see Box 7.3). The time‑related relation of the difference compared to zero difference can be depicted continuously in terms of the P value (Fig. 7.30C).

The relation between two time‑related expressions of freedom from an event can also be expressed by comparing the confidence intervals of the *hazard function* (Fig. 7.30D). They may also be compared using the CLs around the hazard ratio (Fig. 7.30E). Alternatively, the area between survival curves—the lifetime function—can be computed (Fig. 7.30F). We prefer the lifetime function to the alternative statistic, *expected lifetime,* because the complete hazard function beyond the follow‑up information available affects the value of this extrapolated statistic, and its trajectory may not be well characterised. The lifetime function to a specific point in time, such as 5 years, is called the restricted mean survival time (RMST). It is increasingly being used in clinical trials as an endpoint, particularly when the proportional hazard assumption is in doubt or when survival lines cross.

![](_page_72_Figure_2.jpeg)

**FIGURE 7.30** Survival estimates for a cachectic diabetic man with unstable angina according to different initial treatment strategy for his ischaemic heart disease. This set of graphs depicts the decision‑making challenge of intervention versus continued medical therapy (or natural history of a chronic disease) versus one alternative intervention. There are "crossing lines": An initial higher risk of surgery is traded for a longer‑term survival benefit. (A) Survival. (B) Difference in predicted percent survival between CABG and natural history (medical) with dashed 90% CLs. (C) P value for difference in predicted percent survival. (D) Hazard function. (E) Hazard ratio. (F) Difference in predicted lifetime.

</div></details>

<details class="med-details"><summary>
  
#### Repeated Events</summary><div class="details-content">

Unlike death, morbid events such as thromboembolism hospitalisation for heart failure may recur. Furthermore, the consequences of these events may be variable, from apparently "no functional residual" from a transient ischaemic attack to a fatal outcome (Fig. 7.31).

If the hazard function is truly constant, the method of linearised rates, as described earlier in this section under "Parametric Survival Estimation," may be used. The estimation procedure is simple but rarely appropriate, because most hazard functions are not constant.

When the hazard function is not constant, three general approaches to display and analysis of morbid events have been used: analysis as a terminating event, repeated events analysis, and modulated renewal process analysis.

<details class="med-details"><summary>
  
##### Terminating Events Approach</summary><div class="details-content">

The most common method of display and analysis of repeated morbid events is to focus only on the first occurrence, ignoring any further information beyond that point for the patients experiencing the event. It thus becomes a terminating events analysis, with Kaplan‑Meier estimation of freedom from occurrence of the event. This is the least informative approach.

</div></details>

<details class="med-details"><summary>
  
##### Repeated Events Approach</summary><div class="details-content">

True repeated events analysis can be performed, but generally this requires abandoning the Kaplan‑Meier estimator and turning to other estimators such as the Nelson estimator. The Nelson estimator is formulated in the cumulative hazard domain (see "Fundamentals" under "Time‑Related Events" earlier in this section). Patients continue to be followed after each occurrence of the event until end of follow‑up, death, or some other appropriate censoring mechanism (see Fig. 7.31). Estimates are made at the time of each occurrence, with the hazard estimated as 1/number at risk, and the cumulative hazard as the sum of all these hazards. Graphical depiction of Nelson estimates is as cumulative hazard across time, with the vertical axis being the number of repetitions of the event expected per patient (Fig. 7.32). Thus:

$$\Lambda(t_i) = \sum_{k=1}^{i} \frac{n_{dk}}{n_{rk}} \quad (7-20)$$

where n_{dk} is the number experiencing the event (generally 1) at time t_i, and n_{rk} is number at risk.

The Blackstone‑Naftel‑Turner parametric hazard method is designed to analyse repeated morbid events. An interesting but useful technical detail of such an analysis is that each patient’s follow‑up history is recorded as a sequence of interevent segments: time zero to first event, first event to second (etc.), last event to censoring mechanism. Each segment has a beginning and ending time. Kalbfleisch and Prentice point out that this approach to the data simplifies what might otherwise appear to be a daunting analytical challenge.

</div></details>

<details class="med-details"><summary>
  
##### Modulated Renewal Process Approach</summary><div class="details-content">

The hazard function for repeated events may follow a similar pattern after each repeated episode, only modulated to some degree (higher or lower) in its intensity. Such a phenomenon, commonly observed in the industrial setting, is called a *modulated renewal process* (see Fig. 7.31D).

The idea behind a modulated renewal process is that the industrial machine (or patient) is restarted at a new time zero each time the event occurs. This permits (1) ordinary Kaplan‑Meier methods to be used, (2) the number of occurrences and intervals between each recurrence to be used in multivariable analyses, and (3) change in patient characteristics at each new time zero to be used in analyses. Thus, if the modulated renewal assumption can be shown to be valid, it increases the power and utility of the analysis tremendously. For example, Hickey and colleagues demonstrated that each repeated episode of thromboembolism following mitral valve commissurotomy increased the risk (shortened the interval) of the next (Fig. 7.33). Kubo, Naftel, and colleagues demonstrated that rejection after cardiac transplantation behaved as a modulated renewal process, and among other factors, number of previous rejection episodes was a risk factor for subsequent episodes (Fig. 7.34). Blackstone and colleagues exploited the modulated renewal process methodology for reoperations, periprosthetic leakage, and replacement device endocarditis after valve replacement.

From a data handling perspective, the patient’s follow‑up record is segmented just as described earlier in this section for the "Repeated Events Approach," but the starting time of each segment is set to zero and the ending time to duration of the segment.

![](_page_73_Figure_11.jpeg)
![](_page_74_Figure_14.jpeg)
![](_page_75_Figure_3.jpeg)
![](_page_75_Figure_10.jpeg)

**FIGURE 7.31** Repeated morbid events data.
**FIGURE 7.32** Illustration of repeated events data. Repeated bloodstream infections after left ventricular assist device (LVAD) insertion.
**FIGURE 7.33** Freedom (risk‑adjusted) from a postcommissurotomy thromboembolic event, illustrating analyses of repeated morbid events as a modulated renewal process.
**FIGURE 7.34** Freedom from transplant rejection after 1 year or any rejection episode later than 1 year, stratified according to number of rejection episodes during first year after transplantation. (Redrawn from Kubo and colleagues.)

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Weighted Events</summary><div class="details-content">

When a machine is repaired, there is a cost associated with the repair. Thus, in industrial settings it is important not just to estimate the risk (hazard) of repair but also to weight those risks by the cost of repair (Fig. 7.35). Mathematically, cost is taken into account by what is termed "weighting" of the hazard estimate. This simply means the hazard is multiplied by the cost.

Medically, there are a number of cost scales that can be used to quantify, or at least grade, severity of an event. The UAB group, for example, used a simple 5‑point scale for residual neurologic consequences of a thromboembolic episode, with 0 being no consequences and 4 being death.

Nonparametric estimation is in the cumulative cost domain, and Nelson’s method is used. The Blackstone‑Naftel‑Turner parametric hazard function method also accommodates weighted events and complete multivariable analysis.

![](_page_76_Figure_2.jpeg)
![](_page_76_Figure_4.jpeg)

**FIGURE 7.35** Weighted repeated events. Compartmental analog showing patients experiencing an initial episode, such as a cardiac valve replacement, at time zero. A repeating morbid event is then shown (e.g., thromboembolism). Rate at which these occur is depicted by λs (which may differ after each event). In addition, medical cost of each episode is depicted by a severity weight (Ws). From each compartment (after each event), the patient may die, an eventuality governed by another set of hazard rates not depicted.

</div></details>

<details class="med-details"><summary>
  
#### Competing Risks</summary><div class="details-content">

Competing risks analysis is a method of time‑related data analysis in which multiple mutually exclusive events are considered simultaneously. It is the simplest form of continuous‑time Markov process models of transition among states. In this simplest case, patients make a transition from an initial state (called *event‑free survival*) to at most one other state that is considered to be terminating (Fig. 7.36). Thus, there is a single set of intervals from time zero to the earliest occurring of each event for a given patient. Rates of transition from the initial state to one of the events (called an *end state*) are individual independent functions. One way to think about this is that the initial state is represented by a bucket of water (Fig. 7.37). The transition rates are holes in the bucket of varying size. If all but one hole is blocked, the amount of water filling a container beneath the hole is identical to an ordinary survival function turned upside down. In a competing risks analysis, one is interested in discovering the amount of water in each of several containers when all the holes are unblocked simultaneously.

<details class="med-details"><summary>
  
##### Motivation</summary><div class="details-content">

Analysis of a single time‑related event is performed in isolation of any other event. This is ideal for understanding that specific phenomenon. In contrast, competing risks analysis considers multiple outcomes in the context of one another. It is thus an integrative analysis.

Fig. 7.38 shows three events following CABG: death before reintervention, reintervention by percutaneous methods, and operative reintervention. At time zero, all patients are alive and without reintervention. They then migrate at different rates into the previously mentioned various end states (Fig. 7.38A). The consequence of these migrations is that the initial state is gradually emptied, and the reintervention states and death state fill (Fig. 7.38B).

The nature of migration into each of these end states is itself an important phenomenon. Results from the Cardiac Transplant Research Database and the UAB group show the provocative difference in the various competing hazard functions for modes of death after transplantation, just as the UAB group had shown for modes of death after valve replacement.

Because many possible paths of migration exist, it is important for understanding each phenomenon to isolate it from all others, much as one would perform a controlled experiment with all other factors held constant. If one assumes that the rates of migration (hazard functions) are independent of one another, factors influencing those rates (incremental risk factors) can be discovered and their influence explored. As long as it is reasonable to assume independence of events, such analyses are valuable to estimate matters like how often death would occur in the absence of reintervention.

However, individual analyses do not address the question of how often an event might occur in the presence of competing risks of other events. For example, it is valuable to know the influence of age and extent of grafting on reintervention or death. "How often will elderly patients need reoperation given the risk of mortality from old age itself?" A second question is "What is the durability of a bioprosthetic heart valve if death were not a competing risk?"

</div></details>

<details class="med-details"><summary>
  
##### Historical Note</summary><div class="details-content">

In the early 18th century, some progress was made in the war against smallpox by inoculating people with small doses of the virus to establish immunity to the full‑blown disease. The technique was 10% fatal in otherwise healthy individuals! The search for reliable low‑risk protection became intense. Because governments at that time were supported in part by annuities, it was of considerable economic importance to know the consequences a cure of smallpox might bring upon the government’s purse. Daniel Bernoulli tackled this question by classifying deaths into mutually exclusive categories, one of which was death from smallpox. For simplicity, he assumed that modes of death were independent of one another. He then developed kinetic equations for the rate of migration from the state of being alive to any one of several categories of being dead, including from smallpox. It was like hanging a bucket of water with multiple different sizes of holes in the bottom (see Fig. 7.37) and assuming no interactions between the holes. He could then compute how stopping up one large hole, smallpox, would influence both the number of people still alive and the redistribution of deaths into the other categories.

The triumph of the "war on smallpox" came in 1796, just 36 years after his publication.

</div></details>

<details class="med-details"><summary>
  
##### What’s in a Name?</summary><div class="details-content">

Competing risks analysis has many names, which makes communication among disciplines, as well as assembly of a common body of methodological knowledge, difficult. In vital statistics, competing risks are often called *disease‑specific event rates*. In actuarial statistics, they may be called *multiple decrement analyses*. In statistics, they are usually called *competing risks*, but also *cumulative incidence functions* or *marginal* or *conditional survival analyses*. In demographics, they may be called *crude* versus *net* versus *partial crude survival functions*. In medicine, and heart valve procedures specifically, the terms used include *cumulative events*, *multiple decrement*, *competing risks*, *mode‑specific survival*, and *actual* versus *actuarial analysis* (competing risks are called *actual* and single‑event analyses *actuarial*).

These methods are contrasted as if they were competing methods, or indeed, as if one were right and the other wrong. We must emphasise that each answers different questions, and assuming independence, the hazard functions are the same. Had one of them not yet been invented, the other surely would have been because of the different questions answered. Individual event analyses (actuarial) using the entire patient cohort answer the question, "What is the probability of this event among patients still exposed to risk of the event, and what are its risk factors?" It is an unconditional probability and ignores any competing risk. It is relevant to the investigation of a phenomenon. Such an investigation has to be conducted (as best as possible) free from confounding by occurrence of other outcomes. In contrast, competing risks analyses address the question, "How many patients are expected to experience a certain event before they experience another (specified) event?" Thus, individual event analyses indicate the probability of reoperative CABG as a function of age; competing risks analyses may indicate that few elderly patients will survive to experience such a reoperation. The likelihood of a patient experiencing an event in the face of a competing risk such as death is called the cumulative incidence function.

To answer the question about intrinsic durability of a bioprosthesis when death is a competing risk takes us back to the original method of Bernoulli. It is the conditional probability function.

Fig. 7.39 depicts the three functions described in the preceding text. The Kaplan‑Meier estimate is always the middle curve. The cumulative incidence curve is always less than the Kaplan‑Meier estimate, and the conditional probability curve is greater than or equal to the Kaplan‑Meier estimate. Note that when the conditional probability curve is greater than the Kaplan‑Meier estimates, it indicates that there is a degree of informative censoring. This means that death is somewhat correlated with the durability of the bioprosthesis.

</div></details>

<details class="med-details"><summary>
  
##### Methods</summary><div class="details-content">

Nonparametric estimates of cumulative incidence and conditional probability often use the Anderson method. Parametric methods, such as with the multiphase model developed at UAB, can be used and require integrating the competing hazard functions. Ishwaran and colleagues have devised a machine learning algorithm for competing risks. Probably the most used method (though not incorporating conditional probability) is the Fine and Grey proportional hazards model, but beware the problems identified by Austin and colleagues.

![](_page_77_Figure_3.jpeg)
![](_page_78_Figure_2.jpeg)
![](_page_79_Figure_3.jpeg)

**FIGURE 7.36** Competing risks data.
**FIGURE 7.37** Competing risks cartoon using a bucket and water analogy.
**FIGURE 7.38** Illustration of competing risks. (From Blackstone and Lytle.)
**FIGURE 7.39** Explant for structural valve deterioration (SVD) of a bioprosthetic aortic valve (AV) and the effect of competing risk of death. (Redrawn from Rajeswaran and Blackstone.)

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Limitations and Assumptions</summary><div class="details-content">

An important assumption of time‑related analyses is *noninformative censoring*. Either systematic anniversary or cross‑sectional follow‑up methods help with this assumption. However, in analysis of morbid events, death is a censoring mechanism, and it may not be independent of morbidity. In competing risks analysis, all events cause censoring of one another, and the possibility of informative censoring multiplies. This is why we advocate for the conditional probability estimate in competing risks analyses: It reveals and accounts for informative censoring.

The number of hazard phases resolved in parametric hazard estimation depends on length of follow‑up. Therefore, their ability to extrapolate beyond the length of follow‑up is limited.

The number of events limits the number of risk factors that can be identified in either Cox proportional hazards analysis or hazard function multivariable analysis (see Box 7.17). If the latter is performed, this limitation is true within each hazard phase. An impetus for using machine learning tactics by analysis of a randomly selected subset of covariates and then combining these is helpful in circumventing this limitation.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Longitudinal Outcomes</summary><div class="details-content">

In analysis of time‑related events, the event is assumed to be a point process; that is, it is assumed to occur at some specific point in time, and the analysis focuses on the distribution of times until that event occurs. Many phenomena of equal importance to the cardiac surgeon are not point processes but outcomes that *evolve* and progress across time: longitudinal data. Longitudinal data may be continuous, ordinal, or binary.

Specific examples include time‑related values of creatinine or bilirubin while awaiting cardiac transplant (continuous), grade of return of valvular regurgitation and its progression after mitral valve repair (ordinal), and atrial fibrillation episodes after a maze procedure (binary). For all these phenomena, information is obtained periodically, usually at irregular intervals that differ from patient to patient.

Assessment of longitudinal outcome may be interrupted (censored) permanently by death, temporarily at active cross‑sectional follow‑up, or by other events that remove patients from risk, just as in time‑related events studies (see "Fundamentals" under "Time‑Related Events" earlier in this section). One would like to use the data up to the time of censoring. Furthermore, the clinical investigator is interested in factors that affect longitudinal evolution of these phenomena. In addition, the investigator often would like to know if these longitudinal data are associated with time‑related events, such as death.

<details class="med-details"><summary>
  
#### Historical Note</summary><div class="details-content">

Severe technologic barriers to comprehensive analysis of longitudinal data existed before the late 1980s. Repeated‑measures analysis of variance for *continuous* variables had restrictive requirements, including fixed time intervals of assessment and no censored data. *Ordinal* logistic regression for assessment of functional status was useful for assessments made at cross‑sectional follow‑up but not for repeated assessment at irregular time intervals with censoring.

In the late 1980s, Zeger and his students and colleagues at Johns Hopkins University incrementally but rapidly evolved the scope, generality, and availability of what they termed "longitudinal data analysis." Their methodology accounts for correlation among repeated measurements in individual patients, separating it from correlation between patients, and variables that relate to both the ensemble and the nature of the variability. Because average response and variability are analysed simultaneously, the technology has been called "mixed‑effects" modeling. The technique has been extended to continuous, dichotomous, and ordinal outcomes using both linear and nonlinear modelling.

Because of its importance in many fields of investigation, the methodology acquired different names. In 1982, Laird and Ware published a *random effects model* for longitudinal data from a frequentist school of thought. In 1983, Morris presented his idea on *empirical Bayes* from a Bayesian school of thought. In the late 1980s, members of Zeger’s department at Johns Hopkins University developed the *generalised estimating equation* (GEE) approach.

Goldstein’s addition to the Kendall series in 1995 emphasised the hierarchical structure of these models. His is a particularly apt description. The general idea is that such analyses must account for covariables that are measured or recorded at different hierarchical levels of aggregation. In the simplest cases, time is one level of aggregation, and individual patients with multiple measurements is another. These levels have their corresponding parameters that are estimated, and each may require different assumptions about variability (random vs. fixed‑effects distributions).

Except under exceptional circumstances, these techniques have replaced former restrictive varieties of repeated‑measures analysis, which we now consider of historical interest except for controlled experiments designed to exactly meet their assumptions.

</div></details>

<details class="med-details"><summary>
  
#### Concept</summary><div class="details-content">

One way to think about the concept underlying longitudinal data analysis is to consider it as a method that summarises the results of individual longitudinal trajectories for each individual. To illustrate, Figs. 7.40A, 7.41A and B, and 7.42A show 50 individual‑patient longitudinal graphs of data for a continuous variable, a binary variable, and an ordinal variable. Even without analysis, these individual patient graphs reveal important features such as rapidly decreasing lung function, persistence of atrial fibrillation, and increasing bioprosthetic regurgitation. These raw data can be aggregated into spaghetti plots (Figs. 7.40B and 7.42B), although the spaghetti plot for ordinal variables is hard to interpret. A crude way to visualise raw ordinal data is to bin values within intervals and graph the average percent in each grade, as in Fig. 7.42C.

![](_page_80_Figure_6.jpeg)
![](_page_81_Figure_16.jpeg)
![](_page_82_Figure_2.jpeg)
![](_page_83_Figure_3.jpeg)

**FIGURE 7.40** Visualisation of continuous longitudinal repeated measurements data, here forced expiratory volume in 1 second, expressed as percent of predicted (FEV₁ [%]), after lung transplant. (From Rajeswaran and Blackstone.)
**FIGURE 7.41** Atrial fibrillation (AF) detected on weekly transtelephonic monitoring (TTM) rhythm strips. (Modified from Rajeswaran and Blackstone.)
**FIGURE 7.42** Ordinal longitudinal data, here aortic valve (AV) regurgitation grade on transthoracic echocardiography after valve replacement with a bioprosthesis. (Modified from Rajeswaran and Blackstone.)

</div></details>

<details class="med-details"><summary>
  
#### Implications</summary><div class="details-content">

As noted in "Follow‑up for Longitudinal Data" in Section II, cardiac surgeons have often collected information on longitudinal outcomes only at the time of last follow‑up, such as most recent NYHA functional class, most recent echocardiographic assessment of valve regurgitation after repair, or most recent mean gradient after heart valve replacement. Such a strategy cripples establishing time trends, because each patient contributes only one data point, preventing trends from being identified at the individual patient level. Further, each patient has a different duration of follow‑up, so any estimation of longitudinal trend from such data is suspect. Therefore, it is imperative that every observation of longitudinal outcome be gathered and included in the analysis as part of the follow‑up process.

A further cautionary note is that one‑time survey of patients at follow‑up (e.g., a quality‑of‑life questionnaire) also represents a single observation per patient. Yet often, inferences are desired of a longitudinal nature. It is a huge assumption that *ensemble averages* based on one point per patient will reflect what multiple longitudinal measurements per patient would tell you.

</div></details>

<details class="med-details"><summary>
  
#### Assumptions</summary><div class="details-content">

Assumptions underlying longitudinal models are important to understand. At one time, mixed models demanded repeated values to be measured at identical times for all subjects. As mathematical and statistical developments progressed, flexibility increased. Thus, today, longitudinal data analyses can be employed for data:

- Observed at haphazard intervals
- With a differing number of observations per patient
- Encompassing an observation period of variable length
- Containing "missing" observations in a prescribed sequence of surveillance observations
- Having sequences interrupted by a censoring mechanism such as death

This flexibility comes at a price. The most important price is the assumption that censoring for any reason is noninformative with respect to the outcome being assessed. Although this assumption is similar to that for time‑related events, some aspects of longitudinal data make them even more susceptible to informative bias. First, it is not hard to imagine settings in which various factors "deplete" availability of longitudinal outcomes in a systematic fashion. To illustrate, if the outcome is NYHA functional status, death interrupts assessment, and it is likely that the sickest patients with highest NYHA class die; the remaining patients may be more robust, leading to the possible inference that results are improving with time. Thus, it may be questionable whether patients remaining after censoring are representative of the original group. Biased inferences could result from this *informative censoring*.

Just as Berkson and Gage in the early 1950s found that one should ignore follow‑up intervals beyond the point at which about 10% of the original group was followed, we believe a similar truncation of longitudinal data should be considered. But this does not address an important bias of ascertainment. For example, patients being monitored longitudinally for a disease or because of a recurrent event (e.g., return of atrial fibrillation after ablation, recurrent angina after CABG) may be observed more frequently than patients deemed to be disease or symptom free.

</div></details>

<details class="med-details"><summary>
  
#### Modulators of Longitudinal Trajectories</summary><div class="details-content">

Factors modulate longitudinal trajectories just as they do any other type of outcome, so multivariable analysis within the longitudinal analysis domain is necessary. Currently the facility for such analyses is somewhat limited in available statistical software. This provides an opportunity to use newer algorithmic techniques for risk factor identification, such as longitudinal boosting. It would also not be surprising if, just as in analysis of time‑related events after cardiac surgery, different factors modulate different time frames of longitudinal evolution (see "Temporal Decomposition of Longitudinal Data" in the text that follows). In most implementations of longitudinal analyses, time is treated no differently from any other variable, so there is little opportunity for variables to meaningfully modulate temporal rates of change. The Cleveland Clinic group has developed a set of novel methods for analysis of longitudinal data that treat time in a special way using the same mathematical concept as for time‑related events.

</div></details>

<details class="med-details"><summary>
  
#### Temporal Decomposition of Longitudinal Data</summary><div class="details-content">

Using the same strategy and mathematical formulation that Blackstone, Naftel, and Turner employed for time‑related events, the temporal occurrence of a binary event, such as presence or absence of atrial fibrillation, is conceived as the addition of a number of temporal components or phases. Each phase is modulated simultaneously by log‑linear additive function of risk factors.

For example, Fig. 7.40C illustrates the result of modelling forced expiratory volume in 1 second (FEV₁), expressed as percent of predicted. It shows an early peaking phase in the first year after lung transplant followed by a gradual decline in lung function. However, simple stratification of the data by type of lung transplant identifies single versus double lung transplant as an important modulator of FEV₁ (Fig. 7.40D). The longitudinal atrial fibrillation data are composed of a peaking early phase and a late plateau phase (Fig. 7.41C). Exploiting the mixed‑effects portion of the longitudinal data analysis, trajectories of longitudinal data can be plotted for each patient (Fig. 7.41D), and their average across time is the ensemble trajectory of atrial fibrillation over time after surgery. Note that most of the predicted lines are at either 0 (no atrial fibrillation) or 1 (persistent atrial fibrillation), with few in the middle where the average curve lies. This illustrates the detail that may be hidden beneath the ensemble average! Fig. 7.42D shows an estimated ensemble average of the percent of patients in each regurgitation grade across time (adding at each time point to 100% because of the ordinal nature of the data). The symbols are those from Fig. 7.42C that do not account for the within‑patient correlation of repeated measurements but which may serve as a crude validation of the parametric model.

</div></details>

<details class="med-details"><summary>
  
#### Machine Learning for Longitudinal Data</summary><div class="details-content">

Pande and colleagues have developed a non‑parametric machine learning method for longitudinal data. It uses a gradient boosting approach with multivariate trees (boostmtree in R), producing variable importance values for both fixed effects of longitudinal variables and for their time‑varying effects.

</div></details>

<details class="med-details"><summary>
  
#### Joint Modeling of Longitudinal and Time‑to‑Event Data</summary><div class="details-content">

During follow‑up, not only are longitudinal measurements observed and recorded, but also some time‑related events. For example, after aortic valve replacement, longitudinal echocardiographic‑derived graded valve regurgitation and mean transprosthesis gradient may be measured to study valve haemodynamics; during this follow‑up, valve reoperations and deaths may occur. The longitudinal follow‑up for haemodynamics of that prosthesis is interrupted by reoperation, and all longitudinal data are censored by death. A statistical assumption is that valve gradient is not informative of either reoperation or death, and this does not make clinical sense. Thus, when we have these two types of endpoints (longitudinal and time‑to‑event), the scientific objectives can be:

1. To study the effect of longitudinal measurement on time to an event; for example, effect of longitudinal change of aortic valve regurgitation on the risk of reoperation. In this scenario, outcome of interest is reoperation, and we want to study the longitudinal measurement of haemodynamics as a marker for the time to the event reoperations.
2. To assess the profiles of the longitudinal measurement in the presence of time‑related events. However, in this scenario, one cannot ignore the fact that the longitudinal profiles of the patients who eventually undergo reoperation or die may have a different temporal pattern than that of patients who are alive without a reoperation. Thus, one must take into account time‑to‑events when studying longitudinal temporal profiles. Statistically, the time‑to‑event information is a "nuisance variable." In this scenario, outcome of interest is longitudinal measurements and time to event is a "nuisance variable" but one that cannot be ignored.

When the objective is (1), the straightforward approach is to treat longitudinal data as a *time‑varying covariate* in a time‑to‑event model. However, there may be bias in the estimation of association parameter due to measurement error in longitudinal measurements. For this, one can adopt a "two‑step" strategy where one first estimates the "true" longitudinal process, then use the "true" estimate as a time‑varying covariate in the time‑to‑event model. There is still a criticism that when one estimates the "true" longitudinal process, it does not take into account that the longitudinal process may have been influenced by the time to events, such that, for example, only sicker patients may come back for follow‑up visits. Thus, one must perform a *joint model* where models for both processes are simultaneously implemented.

When the objective is (2), the focus for inferences is the longitudinal process for which a time to event may have influenced the longitudinal process. For example, patients who died within 3 months after aortic valve replacement may have a different longitudinal profile of ejection fraction than that of patients who died after 3 years. That is, the drop‑out is said to be "nonignorable." One can take into account the drop‑out (or censoring) process when estimating longitudinal process using conditional or joint modelling.

In joint modelling, one models both longitudinal and time‑to‑event processes simultaneously using two models, where we can include other modulators of both processes in the respective model. For example, Fig. 7.43 illustrates a joint model of longitudinal FEV₁ (% of predicted) after lung transplant and risk of death. After single lung transplant (Fig. 7.43A), if FEV₁ decreases *(solid line)* the hazard function for death *(dashed line)* correspondingly increases. When FEV₁ then improves, the hazard function for death decreases. In contrast, after double lung transplant (Fig. 7.43B), risk of death *(dashed line)* hardly changes with changes in FEV₁ *(dashed line)*, likely reflecting a difference in respiratory reserve. Note that the joint modeling can be extended to accommodate more than one longitudinal outcome and more than one time‑to‑event outcome.

![](_page_84_Figure_10.jpeg)
![](_page_84_Figure_11.jpeg)

**FIGURE 7.43** Forced 1‑second expiratory volume (FEV₁ [% of predicted]) after lung transplantation *(dashed lines)* and its influence on hazard of death *(solid lines)*. (A) Single lung transplant. (B) Double lung transplant. (From Mason and colleagues.)

</div></details>

</div></details>

</div></details>
  
</div></details>

<details class="med-details"><summary>
  
## SECTION V: GENERATING KNOWLEDGE TO FACILITATE CLINICAL DECISIONS</summary><div class="details-content">

<details class="med-details"><summary>
  
### Knowledge for Clinical Decision‑Making</summary><div class="details-content">

Coupling information, data, and analyses to scientific study design and execution leads to scientific inferences that facilitate the clinical decision‑making process.

When a cardiac operation is advised, it is in anticipation of cure or palliation. In either case, operation should be recommended only when life expectancy and functional capacity are predicted to be better with than without operation. Thus, each patient care decision involves a comparison, and the comparison should be made with full knowledge of the degree of uncertainty imposed by the available data and their analysis. Thus, an important goal of clinical research is to provide this information for decision‑making in as many areas of cardiac surgery as possible and with as high a degree of certainty as possible.

When patients fall into well‑defined categories for which reliable information is available, individual patient care decisions can be made largely on the basis of prior appropriate comparisons of the options. For example, the therapy can be chosen that has been shown to result in the lowest hospital mortality, the highest long‑term survival, and the lowest incidence of reoperation in similar patients. One of the goals of this book is to present data in sufficient detail to be useful for most individual patient care decisions. However, decision‑making is not always easy. Indeed, some decisions that may appear easy in fact are not. This is when a solution based either on average treatment effect (e.g., randomised trials or propensity‑based equivalents, described later in this section) or on individual treatment effect (e.g., regression equations or predictions from virtual twin analysis) using a patient’s specific characteristics becomes valuable.

</div></details>

<details class="med-details"><summary>
  
### Average Versus Individual Effect of Treatment</summary><div class="details-content">

Randomised trials, meta‑analysis regression methods, and propensity methods all yield an average effect of treatment. They have in common possible contributions to evidence‑based guidelines, but with varying degrees of quality of evidence. However, average effect of treatment does not answer important questions like "Who benefits? Who doesn’t? Who is harmed?" At some level we believe in "the right treatment for the right patient at the right time." The right treatment involves discovering the individual‑patient treatment effect, the essence of precision medicine.

For many therapies, individual patient response to treatment departs widely from the average (Fig. 7.44). This variable response was quantified by Framingham Heart Study investigators, using the first application of multivariable logistic regression followed by widespread door‑to‑door public distribution of a cardboard "slide rule" for individuals to calculate their personal risk of developing coronary artery disease (Fig. 7.45). In the 21st century, we recognise many more risk factors, including all those of the many ‑omics even beyond genomics, microbiomes, and social determinants of health, some of which are more powerful than commonly considered clinical variables.

In the words of Tonelli and Shirts, "Precision medicine explicitly prioritises the individualisation of care and focuses attention on unique characteristics of a particular patient. In this fashion, it differs greatly from evidence‑based medicine, which seeks to determine the best course of action for a patient with an appeal to generalisable knowledge gained from population‑based studies. To realise the goals of precision medicine, the hierarchy of evidence pyramid must yield to a more horizontal conception of medical knowledge."

![](_page_85_Figure_14.jpeg)

**FIGURE 7.44** Individual survival estimates for patients eligible for esophagectomy alone or neoadjuvant therapy. *Bold line* is average treatment effect. (A) cT2N0M0 adenocarcinoma eligible for esophagectomy alone. (B) cT2N0M0 adenocarcinoma eligible for neoadjuvant therapy. These figures emphasise that individual patients are predicted to have survival both much longer and much shorter than the average treatment effect, the difference between precision medicine and evidence‑based medicine. (Redrawn from Rice and colleagues.)

![](_page_86_Figure_2.jpeg)

**FIGURE 7.45** "Slide rule" for calculating risk of developing coronary heart disease sometime during the next 6 years for men (left) and women (right). These slide rules as depicted were distributed to doctors for advising their patients, but also were widely distributed to households across the United States. The slide rules were based on the 1973 analyses from the Framingham Heart Study. People were instructed to start at Section 1, insert a pencil point in the hole opposite the values that most closely matched them, and pull the slide down until pencil point stops; this was to be repeated for each section. In the box would appear "chances in 100." Thus, at the very dawn of multivariable analysis, and despite the "factors of risk" being recognised as associations only, the investigators also deemed them valuable as tools for predicting risk for individual patients, a form of precision medicine.

</div></details>

<details class="med-details"><summary>
  
### Decision‑Making Based on Average Effects of Therapies</summary><div class="details-content">

<details class="med-details"><summary>
  
#### Clinical Trials with Randomly Assigned Treatments</summary><div class="details-content">

The highest quality evidence for therapies comes from randomised trials—particularly multisite and even multicountry—and observational studies of such trials (meta‑analysis, described later in this section). Their objective is to ascertain a population‑based assessment of average therapeutic effects, possibly stratified by a small number of independently randomised strata.

There are several types of trial designs in which assignment of treatments is randomised. The type most familiar to clinicians is the randomised clinical trial in which patients are randomised, which we will focus on in text that follows. Other types include a large variety of adaptive trial designs, Bayesian designs, and cluster randomised trial designs in which groups of patients are randomised. These are not detailed in this chapter.

<details class="med-details"><summary>
  
##### Historical Note</summary><div class="details-content">

Controlled trials date back at least to biblical times, when casting of lots was used as a fair mechanism for decision‑making under uncertainty (Numbers 33:54). Solomon noted, "The lot causeth disputes to cease, and it decideth between the mighty" (Proverbs 18:18). An early clinical trial took place in the Court of Nebuchadnezzar, king of Babylon. He ordered several gifted Hebrew youths to reside at his palace for 3 years as if they were his own children. Among them was Daniel, who objected to the Babylonian diet. Daniel proposed a 10‑day clinical trial: The Hebrews would eat a vegetarian diet with water; the children of the king would eat the king’s meat and wine. After 10 days, the condition of the Hebrews was determined to be better than that of the king’s children (Daniel 1:1‑15). Although 17th‑ and 18th‑century unblinded trials have been cited as historical predecessors, the first placebo‑controlled, double‑blinded, randomised clinical trial was carried out by Sir Austin Bradford Hill in England on the effectiveness of streptomycin versus bed rest alone for treatment of tuberculosis.

Clinical trials in which cardiac surgical procedures and medical therapy were randomly assigned have made major contributions to our knowledge of treatment and outcomes of heart disease. Notable examples are the Veterans Administration (VA) study of CABG, the Coronary Artery Surgery Study (CASS) trial of CABG, and the European Coronary Surgery Study trial. These trials, like the transcatheter aortic valve replacement (TAVR) for aortic stenosis in patients with prohibitive surgical risk trial, were superiority trials. Once a treatment is shown to be superior to no treatment, subsequent trials are generally non‑inferiority trials. Such trials have the result of showing an alternative therapy "is no worse" than the comparator therapy. Thus, subsequent trials comparing CABG to percutaneous coronary intervention, such as balloon angioplasty, or aortic, mitral, or tricuspid valve surgery to respective transcatheter therapies, have been this type of trial.

</div></details>

<details class="med-details"><summary>
  
##### Characteristics of Randomised Trials</summary><div class="details-content">

Randomisation of treatment assignments has three valuable and unique characteristics:

- It eliminates selection factors (bias) in treatment assignment (although this can be defeated at least partially by enrolment bias), permitting causal inferences about the therapies compared. However, the high cost of traditional randomised clinical trials has given rise to pragmatic and registry‑based designs that rely only on real‑world data acquisition.
- It distributes patient characteristics equally between groups, whether they are measured or not, known or unknown (balance).
- It meets assumptions of statistical tests used to compare endpoints.

Randomised clinical trials are also characterised by concurrent treatment, excellent and complete compilation of data gathered according to explicit definitions, and proper follow‑up evaluation of patients. These operational byproducts may have contributed nearly as much new knowledge as the random assignment of treatment.

</div></details>

<details class="med-details"><summary>
  
##### Challenges of Randomised Trials in Cardiac Surgery</summary><div class="details-content">

It has become ritualistic for some to dismiss out of hand all information, inferences, and comparisons relating to outcome events derived from experiences in which treatment was not randomly assigned. If this attitude is valid, then much of the information now used to manage patients with cardiac disease would have to be dismissed and ignored! Investigations concerning differences of outcome among different physicians, different institutions, and different time periods would have to be abandoned. However, moral justification may not be present for a randomised comparison of procedures and protocols that clinical experience strongly suggests have an important difference. In fact, when Benson and Hartz investigated differences between randomised trials and observational comparisons over a broad range of medical and surgical interventions, they found "little evidence that estimates of treatment effects in observational studies reported after 1984 are consistently larger than or qualitatively different from those obtained in randomised controlled studies." (See, however, the rebuttal by Pocock and Elbourne.) These findings were confirmed by Concato and colleagues.

Trials in which treatment is randomly assigned are testing a hypothesis, and hypothesis testing in general requires a yes or no answer unperturbed by uncontrollable factors. Thus, ideally, the study is for a short duration, with all participants blinded and a treatment that can be well standardised. However, in many clinical situations involving patients with congenital or acquired heart disease, the time‑relatedness of freedom from an unfavourable outcome event is important and can jeopardise interpretation of the trial. This is because individual patients assign different values to different durations of time‑related freedoms, in part because differing severities of disease (and corresponding differences in natural history) affect different time frames and, in part, because the longer the trial, the more likely there will be crossovers (e.g., from medical to surgical therapy). Also, the greater the number of risk factors associated with the condition for which treatment is being evaluated, the greater the potential heterogeneity (number of subsets) of patients with that condition and the greater the likelihood that a yes/no answer will apply only to some subset of patients. In such situations, a randomised trial may have the disadvantage of including only a limited number of subsets. It may in fact apply to no subset, because the "average patient" for whom the answer is derived may not exist except as a computation. Trials have addressed this problem by basing the randomisation on subsets or by later analysing subsets by stratification (but see concerns raised by Guillemin) or by multivariable analysis.

These considerations, in addition to ethical concerns, have fuelled the debate about whether surgery is an appropriate arena for randomised trials of innovation, devices, and operations. Some argue strongly that randomisation should be required at the outset of every introduction of new therapy. In three related articles arising from the Balliol Colloquium held at the University of Oxford between 2007 and 2009, clinicians and anaesthesiologists sought to clarify the issues surrounding surgical clinical trials. They recognised important stages in developing a surgical technique, starting with innovation, progressing through development and exploration, to assessment and long‑term outcomes. They then explored options for evaluative studies and barriers to each, including sham operations and nonoperative treatment alternatives. They ended with an IDEAL model for surgical development (idea, development, exploration, assessment, long‑term study) and the role of feasibility‑randomised‑trials in exploration, definitive trials in assessment, and registries in long‑term surveillance.

Steven Piantadosi, MD, PhD at Brigham and Women’s Hospital describes a number of important methodologic problems with conducting successful surgical trials, however (personal communication; November 2001):

- Operations are often not amenable to blinding or use of placebos (sham operations), although there is growing acceptance of this in some cases of surgery, in part because of the huge placebo effect of surgery. This can introduce bias that may be impossible to control; however, thoughtful and creative study designs can often produce substantial blinding, such as those assessing outcome.
- Selection bias is difficult to avoid. He notes that it is insufficient to compare patients undergoing operation with those who do not, no matter how similar the groups appear, unless every patient not undergoing operation is completely eligible for surgical intervention. Good judgment is a characteristic of a good surgeon, and the better the surgical judgment, the more likely bias will enter any trial of surgical versus nonsurgical therapy, even if it is the bias of selecting patients for the trial.
- Surgical therapy is skill‑based. Therefore, any result obtained from a trial consists of the inextricable confounding of (1) procedure efficacy and (2) surgical skill.
- Surgery is largely unregulated. Every operation is different, and particularly in treatment of complex congenital heart diseases, tailoring operations to the specific anomaly is expected and often necessary for patient survival. There is little uniformity from patient to patient to provide a basis for randomising therapy.

These and other obstacles to randomised trials in cardiac surgery have been voiced by Gaudino and colleagues as well.

Given these potential obstacles to adequate evaluation of surgical procedures ever occurring, McCulloch has proposed a hybrid strategy that begins with a prospective but nonrandomised surgical study during the dissemination phase of development (phase II) that progresses to a phase III randomised clinical trial. During the phase II study, learning curves are determined, a likely treatment effect is identified for sample‑size calculation, consensus is built, and quality measures to confirm delivery of intended operations are drawn up.

Moses and others present the case for a balance between randomised clinical trials and observational clinical studies. However, observational studies are beset with these same problems of selection bias and skill variance; thus, not to be overlooked are the development and rapid introduction of powerful new methods for drawing causal inferences from nonrandomised trials (see "Causality" in Section VII).

Particularly as new devices were introduced into cardiac surgery, and their counterparts into interventional cardiology, clinical trials became largely industry‑sponsored device trials, leading members of the American Association for Thoracic Surgery Scientific Affairs and Government Relations Committee to meet with the National Heart, Lung, and Blood Institute (NHLBI) to explore how to reverse a downward trend in NHLBI funding for surgical research and clinical trials in particular. The result was the Cardiothoracic Surgical Trials Network (CTSN). Commencing in 2007, CTSN has performed a number of seminal randomised and successfully completed clinical trials. These trials have changed surgical practice, such as for ischaemic mitral regurgitation. In therapy for congenital heart disease, despite the challenges of more rare disease, successful and important randomised trials have been performed. Results of these trials not only appear in the highest impact journals, and therefore are widely disseminated, but they provide the highest level of evidence for evidence‑based clinical guidelines. All the predictable challenges of surgical trials have been encountered in the CTSN, but the Network has persisted not only in proposing and executing trials, but also in promoting an education programme built into the CTSN from its inception to foster a generation of surgeon‑scientists versed in clinical trials methodology, and more recently to embrace implementation and dissemination research. Yet, with advances in medical, transcatheter, potentially gene therapies and more, what has been learned from trials in the past may need to be revisited today.

</div></details>

<details class="med-details"><summary>
  
##### Limitations of Randomised Trials</summary><div class="details-content">

Randomised trials have restrictive inclusion and exclusion criteria, partly in the name of homogeneity, partly in the name of equipoise, that may artificially narrow the scope of patients potentially eligible for a particular treatment and may introduce bias into interpretation of the treatment effect and its magnitude and breadth of its applicability. Randomised trials also are most commonly conducted in academic institutions, which may not reflect the real‑world community. In addition, bias may be introduced by reluctance of persons of various demographics, races, ethnicity, or socioeconomic groups to consent to a trial or complete the trial. The trials are often expensive to conduct and coordinate. Implementation and dissemination of the results of the trials are often slow. Thus, only a tiny fraction of clinical decisions is based on these randomised trials.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Meta‑Analysis</summary><div class="details-content">

<details class="med-details"><summary>
  
##### Historical Note</summary><div class="details-content">

There is a 300‑year history of using statistical methods to draw inferences broader than any individual study from a combined analysis of results. In 1722, Cotes used weighted averages to combine measurements of different astronomical observers. In 1805, Legendre introduced the method of least squares, used in linear regression (see Box 7.17), for similar synthesis. In 1904, Pearson averaged five different estimates of *correlation* because "many of the groups...are far too small to allow any definite opinion being formed." In 1931, Trippett combined P values. In 1937 and 1938, Cochran and Yates combined results of agricultural experiments.

Beecher is credited with having performed the first medical meta‑analysis in 1955, but the appropriate methodology developed primarily in educational research. In 1976, Glass coined the term *meta‑analysis* to mean "the analysis of analyses." Most statistical procedures used today were introduced at that time in the social sciences.

In 1993, clinicians, epidemiologists, statisticians, and other professionals joined together to prepare, maintain, and disseminate comprehensive and systematic reviews of health‑related questions. This was called the Cochrane Collaboration, named after epidemiologist Archie Cochrane. In 1994, an international group developed the Quality of Reporting of Meta‑analyses (QUOROM) guideline document for meta‑analysis of randomised clinical trials. Subsequently these were updated to checklists and diagrams called Preferred Reporting Items for Systematic Reviews and Meta‑analyses (PRISMA). A parallel effort was mounted to develop a guidance document for meta‑analysis of observational studies (MOOSE).

</div></details>

<details class="med-details"><summary>
  
##### Motivation</summary><div class="details-content">

Motivations for meta‑analysis are to:

- Increase sample size and thereby better protect against either (1) misplaced enthusiasm for positive results (type I error) or (2) failure to find a beneficial effect (type II error)
- Detect small effects (or exclude small effects more definitively)
- Detect bias of reporting multiple, possibly underpowered, trials (positive results of trials tend to be reported more frequently than negative ones)
- Make better use of studies performed independently by synthesising the results
- Suggest the most promising avenue for future research on a subject and the sample size likely needed to study the question definitively
- Formalise the review process of past studies, including independent assessment of study quality by individuals not associated with the original studies
- Determine whether "enough is enough" and no further corroborative studies are needed to establish a relation
- Corroborate, refute, or modify evidence‑based medical guidelines that emanate from expert opinion and literature review rather than from statistical analysis of data

</div></details>

<details class="med-details"><summary>
  
##### Types</summary><div class="details-content">

Meta‑analyses may be categorised according to (1) type of studies assembled and (2) type of data gathered. The types of analyses assembled may be only randomised clinical trials, only observational clinical studies, or a combination. Just as with any clinical study, there is a presumed hierarchy of quality; generally, preference is given to randomised clinical trials.

Type of data used in a meta‑analysis may be (1) summary (aggregated) statistics or (2) raw individual patient data from each trial or study, the highest level of quality. The latter is considered to be the most time‑consuming and politically most difficult to perform because investigators are often wary of relinquishing raw data to a third party, and data sharing is often met with almost insurmountable institutional obstacles.

Meta‑analyses in cardiovascular medicine and surgery often have as their primary focus time‑related events, such as mortality or major adverse cardiovascular events (MACE). There is a potential problem if the trials/studies selected for combining have highly unequal durations of follow‑up. Various methods to combine trials of time‑related events have been proposed.

1. If the event occurs at a constant rate (called a "linearised rate"), there are standard methods for analysis. However, there are few time‑related endpoints in cardiovascular treatment that occur at a constant rate.
2. Where there are truly proportional hazards, log event estimates can be valid with the assumption that proportional hazards hold across all time.

Other than constant and proportional hazards, estimates made on widely differing follow‑up times introduce heterogeneity and bias into meta‑analyses. For example, surgical therapies usually exhibit an elevated hazard early after treatment, and often a subsequent rising hazard phase later after treatment. If one trial is focused on, say, 1‑year outcomes, another on 10‑year outcomes, and yet another on 20‑year outcomes, each encompasses a different portion of the hazard (risk) function, leading to challenges in interpreting a meta‑analysis. It is possible that a test of heterogeneity may provide a clue that this is a problem. The following are some suggested workarounds when hazards are neither constant nor proportional.

1. Individual patient meta‑analyses: If one has all the individual patient data, including patient characteristics, treatments, and time‑related events, then one can perform appropriate time‑varying hazard regression (meta‑regression) analyses, being careful not to have misspecified the model. Alternatively, one can use landmark analyses to capture, for example, early, intermediate, and late risks.
2. Individual patient events meta‑analyses: Tierney and colleagues and Guyot and colleagues describe in detail methods of extracting patient‑level data from published Kaplan‑Meier curves and, from these, calculating hazard ratios. However, that is not enough. If this is done, one should again use nonproportional hazards models and meta‑regression.
3. Network meta‑analysis: Jeroen Jansen’s group in Boston and Dequen and colleagues describe network meta‑analysis of survival data with fractional polynomials and other parametric or semiparametric methods that account for nonproportional hazards and some tests for this approach.
4. Restricted mean survival analysis: One integrates the area under each survival curve out to some common point in time, say 1, 3, 5, or 10 years. The unit of that integration is years. Subtract the RMST for one group from the other to determine if the survival time to that designated point in time is different between groups.

</div></details>

<details class="med-details"><summary>
  
##### Conduct</summary><div class="details-content">

Because the design of a meta‑analysis is that of an *observational study of accumulated evidence* from prior investigations, a rigorous plan for conducting the study must be put into place. Elements of conduct include:

- Formulating the question and hypotheses to be addressed, without which comparability of studies cannot be assessed
- Establishing criteria for studies to be included and excluded
- Identifying all relevant studies
- Assessing the quality of each study
- Establishing a rigorous protocol for data extraction, including calculations necessary for putting all data into a standard format on a uniform scale
- Extracting and verifying data
- Diagnosing bias and sensitivity to inclusion and exclusion criteria to be sure the analysis should proceed further
- Diagnosing heterogeneity among studies that may call into question poolability
- Analysing the analyses, generally using mixed (hierarchical) models that account for fixed and random effects at various levels of aggregation (see "Longitudinal Outcomes" in Section IV)

In calculating an overall effect from multiple studies, the simple arithmetic average gives misleading results. Specifically, small studies have more scatter by chance alone and should be weighted less than large studies. Proper analyses can be broadly grouped into two approaches that differ only in the way variability among studies is managed: (1) fixed effects models that assume variability is simply random variation and (2) random effects models that assume a different mechanism of variation for each study. Tests of heterogeneity of variation may be used to assess which model may be more applicable. Ideally, features of each study, such as sex, race, publication date, patient status, and age, are incorporated into the analysis. Such a model has both fixed and random effects. Details of these and other considerations are found in the now abundant literature on the topic.

We enumerate these points of study conduct to emphasise that meta‑analysis is a disciplined, rigorous, and often statistically challenging type of observational study. In the cardiac surgical literature, including some publications cited in this book, less rigorous methods have been used to synthesise multiple independent, but related, analyses. Attention to meta‑analytic techniques is necessary to raise the quality of such syntheses.

</div></details>

<details class="med-details"><summary>
  
##### Limitations</summary><div class="details-content">

Shortly after its introduction, Eysenck declared meta‑analysis "mega‑silliness." Similar skepticism or outright disdain has been voiced in medicine. These attitudes are based on such findings as two separate meta‑analyses of the same subject coming to diametrically opposite conclusions and the contradiction of meta‑analysis results by large, randomised trials.

Not often appreciated is that limitations of meta‑analyses are similar to those of observational clinical studies. First, they require an extremely focused question, without which it is not possible to assess combinability of studies. It may be found that in fact there are no truly combinable studies for some topics of interest, or that there are too few studies to achieve sufficient statistical power to determine from diagnostic testing whether the studies are combinable (heterogeneity).

Second, it may be difficult to assemble the entire literature on a well‑framed question. Medical libraries are generally more successful in doing this than physicians using search engines. References in identified articles must be found. In the process, it is common to uncover either wholly duplicate publications or some overlap that may be challenging to pull apart. Even a thorough search will not correct for confounding from publication bias that favours large studies, positive results, and mainstream topics.

Third, different meta‑analyses may produce conflicting results, depending on thoroughness of the search and evaluation of applicability and combinability. These represent forms of selection bias over and above publication bias.

Fourth, there are limitations of data. One would like to adjust the analysis for multiple variables, but often the number of variables in common across studies is small. This is why combining individual data with many variables in common leads to the most robust estimates.

Finally, there are limitations in methodology, variance in professional skill and experience in using the methodology, and potential problems in both data presentation and interpretation.

</div></details>

</div></details>

<details class="med-details"><summary>
  
#### Clinical Trials and Comparisons without Random Assignment</summary><div class="details-content">

Most of medicine is practised without the benefit of evidence‑based medicine of the highest degree—randomised trials. Over the last 40 years, increasingly sophisticated methods for analysing clinical experience with nonrandomised alternative methods have been developed and widely used to determine clinical effectiveness. We begin with concepts and methods that provide average effects of alternative treatments.

<details class="med-details"><summary>
  
##### Nonexchangeability and Exchangeability</summary><div class="details-content">

There are settings for which it is important to compare outcomes, but they violate an important assumption underlying any treatment comparison: exchangeability. The exchangeability concept is that patients treated by the opposite of how they were actually treated (counterfactual treatment) are perfectly eligible to be treated in either way. By definition, this must be true of all randomised trials. However, there are settings for which it is impossible, unethical, or illegal to randomise patients. For example, it is probably impossible to randomise patients to be geographically located in Sydney, Australia, or rural Mississippi, United States. It would be unethical to randomise patients to be never‑smokers and heavy smokers to definitively link smoking with lung cancer. It would be illegal to randomise patients to be pushed out of an airplane with versus without a parachute. But in addition, there are other naturally occurring traits (male vs. female) or diseases (diabetes vs. no diabetes) that violate the concept of exchangeability. For these comparisons in which exchangeability is clearly violated, we must rely on methods for Natural Experiments.

</div></details>

<details class="med-details"><summary>
  
##### Natural Experiments</summary><div class="details-content">

Natural Experiments important to cardiac surgery are all around us. Female versus male patients, patients with diabetes versus those without, patients with variable cardiac, pulmonary, hepatic, or renal dysfunction, and different social determinants of health are but a few. These are commonly identified by multivariable analysis as incremental risk factors. We have been careful to state that these are associations and may not be in a causal pathway. Yet, it may be desirable to get closer to the possibility that they may be causal. This is the function of Natural Experiment studies.

<details class="med-details"><summary>
  
###### Historical Note</summary><div class="details-content">

*"London was without cholera from the latter part of 1849 to August 1853. During this interval an important change had taken place in the water supply of several of the south districts of London. The Lambeth Company removed their water works in 1852 from opposite Hungerford Market to Thames Ditton; thus obtaining a supply of water quite free from the sewage of London...The districts supplied by the Lambeth Company are, however, also supplied, to a certain extent, by the Southwark and Vauxhall Company, the pipes of both companies going down every street, in the places where the supply is mixed..."* — J. Snow, *On the Mode of Communication of Cholera* 1855, John Churchill, London. p 68.

Dr. John Snow, considered the father of epidemiology, along with others in London were faced with 500 deaths in 10 days from cholera. The difference is that Snow developed a mechanistic hypothesis: The water source of the Lambeth area was not near a source of water potentially contaminated by London waste, but the Southwark and Vauxhall Company source was. This hypothesis was based on location of the difference in the water intake in relationship to sewage discharge into the Thames River. Clearly, one could not randomise people geographically, so they were nonexchangeable. However, the number of people, their occupations, age, and other characteristics were well balanced between those whose water supply was from one or the other water companies. He then simply counted (and famously mapped) the deaths from cholera, identifying the manyfold excess deaths in one community (the one whose water was supplied by the Southwark and Vauxhall Company) versus the other (whose water was supplied by Lambeth). From the mapping, he found the greatest density was in the area around the Broad Street pump and was able to confirm his observation and conclusion by removing the handle from the Broad Street pump, after which deaths from cholera plummeted. This introduced the epidemiologic concept of balancing to mitigate the effects of nonexchangeability.

</div></details>

<details class="med-details"><summary>
  
###### Definition</summary><div class="details-content">

The United Kingdom Medical Research Council guidance in defining Natural Experiments broadly is to include any event not under the control of a researcher that divides a population into exposed and unexposed groups. These will be distinguished from quasi‑experimental studies that will be discussed later in this section.

</div></details>

<details class="med-details"><summary>
  
###### Balancing Scores</summary><div class="details-content">

There are several epidemiologic designs of Natural Experiments, two of which we will use to aid in understanding the concept. For illustration of the methodology, it is easiest to use the example of patients who regularly take aspirin long‑term and those who do not. Although this is something that could be subject to a randomised trial, this study was conducted when such a trial had not been done. We wanted to balance the two groups and identified the simplest balancing score, called the propensity score by Rosenbaum and Rubin.

The two balancing scores discussed here are a particular form of multivariable statistical methods that use saturated or semisaturated regression models to identify patients with similar chances of receiving one or the other nonrandomised treatment or who have similar values of, for example, laboratory measurements, such as HbA1c. Groups of patients with similar balancing scores are well balanced with respect to patient, disease, and comorbidity characteristics taken into account in forming the balancing score. The difference in outcomes between groups of patients who have similar balancing scores but receive different treatments provides an unbiased estimate of the average effect attributable to the difference in treatments. That is, the method can identify the apples from among the mixed fruit of clinical practice variance, transforming apples‑to‑oranges outcomes comparisons into apples‑to‑apples comparisons.

Whereas randomly allocating patients 1:1 to alternative treatments in a clinical trial balances the number of subjects in each treatment arm, a balancing score achieves *local* balance in patient characteristics at the expense of unbalancing n. Tables 7.8 and 7.9 illustrate local balance of patient characteristics achieved by using the specific balancing score, the *propensity score* (see "Propensity Score" later in this section for details on how it is derived from patient data). To illustrate, Table 7.8 demonstrates that patients on long‑term aspirin therapy had dissimilar characteristics from those not on this therapy. Unadjusted comparison of outcomes in these two groups is invalid—an apples‑to‑oranges comparison. Therefore, multivariable logistic regression analysis (see "Logistic Regression Analysis" in Section IV) was performed to identify factors predictive of treatment received (long‑term aspirin vs. not). The resulting logistic equation was solved for each patient’s probability of being on long‑term aspirin therapy, their propensity score. Patients were then sorted according to the balancing (propensity) score and divided into five equal‑sized groups, called *quintiles*, from low score to high. Thus, patients in each quintile had similar balancing scores (see Table 7.9). Simply by virtue of having similar balancing scores, patients within each quintile were found to have similar characteristics (except for age in quintile I). As might be expected, patient characteristics differed importantly from one quintile to the next. For example, most patients in quintile I were women; most in quintile V were men. Except for unbalanced n, these quintiles look like five individual randomised trials with differing entry and exclusion criteria, which is exactly what balancing scores are intended to achieve! Thus, the propensity score balanced essentially all patient characteristics within *localised* subsets of patients, in contrast to randomised clinical trials that balance both patient characteristics and n globally within the trial.

To achieve this balance of patient characteristics, a widely dissimilar number of patients *actually* received long‑term aspirin therapy from quintile to quintile. Quintile I contained only a few patients who received long‑term aspirin therapy, whereas quintile V had few *not* receiving aspirin. Thus, balance in patient characteristics was achieved by unbalancing n (Table 7.10).

Balancing scores can be used for not only medical interventions, but also for natural phenomenon such as genetic differences and disease presence and absence. In addition, it is not only categorical variables such as treatments that can be balanced; continuous ones can as well. Let’s say you want to assess outcomes of cardiac surgery among patients according to HbA1c, a continuous variable. As shown by the red triangles in Fig. 7.46, patient characteristics are not evenly distributed across levels of haemoglobin A1c; higher levels are associated with more extensive coronary artery disease, higher triglyceride levels, greater body mass index, and so on. These factors also differ between those who are and are not clinically diabetic. To find the "true" (and possibly causal) association of outcomes with haemoglobin A1c, these factors must be balanced across patient characteristics. One can form a balancing score for preoperative haemoglobin A1c by linear multivariable regression using all the patient variables available, then predict for each patient a value for haemoglobin A1c from the resulting analysis. This is the balancing score. As shown in Fig. 7.46 by the green squares, patient characteristics are now well balanced, thus we can have a more comparable assessment of outcomes across haemoglobin A1c levels.

<details class="med-details"><summary>

#### TABLE 7.8 Selected Patient Characteristics According to Long‑Term Aspirin Use in Patients Undergoing Stress Echocardiography for Known or Suspected Coronary Artery Disease</summary><div class="details-content">

| Patient Characteristic | ASA | No ASA | P |
|------------------------|-----|--------|---|
| n | 2455 | 4072 | |
| Men (%) | 49 | 56 | .001 |
| Age (mean ± SD, years) | 62 ± 11 | 56 ± 12 | <.0001 |
| Smoker (%) | 10 | 13 | .001 |
| Resting heart rate (beats·min⁻¹) | 74 ± 13 | 78 ± 14 | <.0001 |
| Ejection fraction (%) | 50 ± 9 | 53 ± 7 | <.0001 |

###### Table shows that patient characteristics differ importantly, making direct comparisons of outcome invalid. As shown in original article, many other patient characteristics differed between the two groups. *ASA,* Long‑term aspirin use; *SD,* standard deviation. Data from Gum and colleagues.

</div></details>

<details class="med-details"><summary>

#### TABLE 7.9 Selected Patient Characteristics According to Long‑Term Aspirin Use in Patients Undergoing Stress Echocardiography for Known or Suspected Coronary Artery Disease: Stratified by Propensity Score for Aspirin Use</summary><div class="details-content">

| | QUINTILE I | II | III | IV | V |
|---|---|---|---|---|---|
| | ASA | No ASA | ASA | No ASA | ASA | No ASA | ASA | No ASA | ASA | No ASA |
| n | 113 | 1092 | 194 | 1111 | 384 | 922 | 719 | 586 | 1045 | 261 |
| Men (%) | 22 | 22 | 57 | 63 | 74 | 71 | 78 | 78 | 88 | 87 |
| Age (years) | 55 | 49 | 56 | 55 | 61 | 61 | 62 | 64 | 63 | 65 |
| Smoker (%) | 15 | 13 | 15 | 15 | 12 | 11 | 11 | 13 | 7 | 9 |
| Resting heart rate (beats·min⁻¹) | 84 | 83 | 79 | 79 | 76 | 76 | 76 | 76 | 71 | 73 |
| Ejection fraction (%) | 53 | 54 | 54 | 54 | 53 | 53 | 49 | 49 | 49 | 48 |

###### Table illustrates that balancing patient characteristics by the propensity score comes at the expense of unbalancing number of patients within comparable quintiles. *ASA,* Long‑term aspirin use. Data from Gum and colleagues.

</div></details>

<details class="med-details"><summary>

#### TABLE 7.10 Balance in Patient and Selection Characteristics Achieved by Unbalancing Number of Cases in Each Propensity‑Ranked Group in Three Separate Studies</summary><div class="details-content">

| Study | Factor Present, n | Factor Absent, n |
|-------|-------------------|------------------|
| **Long‑Term Aspirin Use** | | |
| Quintile 1 | 113 | 1192 |
| Quintile 2 | 194 | 1111 |
| Quintile 3 | 384 | 922 |
| Quintile 4 | 719 | 586 |
| Quintile 5 | 1045 | 261 |
| **Natural Selection: Preoperative AF in Degenerative MV Disease** | | |
| Quintile 1 | 2 | 225 |
| Quintile 2 | 13 | 214 |
| Quintile 3 | 32 | 195 |
| Quintile 4 | 78 | 149 |
| Quintile 5 | 162 | 66 |
| **OPCAB versus On‑Pump** | | |
| Quintile 1 | 40 | 702 |
| Quintile 2 | 71 | 671 |
| Quintile 3 | 61 | 682 |
| Quintile 4 | 90 | 652 |

###### *AF,* Atrial fibrillation; *MV,* mitral valve; *OPCAB,* off‑pump coronary artery bypass grafting.

</div></details>

![](_page_93_Figure_9.jpeg)
![](_page_94_Figure_2.jpeg)

**FIGURE 7.46** Illustration of use of a balancing score for a Natural Experiment. Neither diabetes in (A) nor non‑diabetes in (B) are exchangeable, and neither is the level of HbA1c. Thus, a balancing score has been generated by a multivariable analysis of variables associated with level of HbA1c. Predicted HbA1c was then calculated for each patient to use as a balancing score. Before the analysis, the regression coefficients are shown in *red*. Once we adjust for the balancing score, the standardised regression coefficients are shown in *green*. *AV,* aortic valve; *LVEF,* left ventricular ejection fraction; *MV,* mitral valve; *TV,* tricuspid valve.

</div></details>

</div></details>

<details class="med-details"><summary>
  
##### Quasi‑Experimental Studies</summary><div class="details-content">

A quasi‑experimental study is distinguished from a Natural Experiment in that at least in theory the "exposure" is controllable by the investigator, such as the surgeon. Quasi‑experimental studies extend from outcomes comparison of alternative therapies performed in the past to quite formal prospective trials for which randomisation is desirable, but for which it is neither permitted nor feasible. Instead, patients may be allocated to one or the other treatment according to surgery on even or odd dates. In this section, we will discuss the use of propensity scores for comparison of outcomes after alternative therapies in the past.

<details class="med-details"><summary>
  
###### Comparisons Based on the Propensity Score</summary><div class="details-content">

The most widely used balancing score is the propensity score. It provides for each patient an estimate of the propensity toward (probability of) belonging to one group versus another *(group membership)*. Here we describe (1) designing the nonrandomised study, (2) constructing a propensity model, (3) calculating a propensity score for each patient using the propensity model, and (4) using the propensity score in various ways for effecting a balanced comparison of average effect of treatment.

**Designing the nonrandomised study.** The essential approach to comparing treatment outcomes in a nonrandomised setting is to design the comparison as if it were a randomised clinical trial and to interpret the resulting analyses as if they emanated from such a trial, as emphasised in Rubin’s 2007 article "The Design Versus the Analysis of Observational Studies for Causal Effects: Parallels with the Design of Randomised Trials." He states that a nonrandomised set of observations should be conceptualised as a broken randomised experiment with a lost rule for "patient allocation, and specifically for the propensity score, which the analysis will attempt to construct." For example, the investigator should ask, "Could each patient in all comparison groups be treated by all therapies considered?" If not, this constitutes specific inclusion and exclusion criteria. Then, if this were a randomised trial, when would randomisation take place? In constructing a propensity score, one must use only variables that would be known at the time randomisation would have occurred, not after that; this means that variables chosen in the propensity score analysis are not those that could possibly be affected by the treatment. Note, however, that it could include the planned operation, including its planned procedural components.

**Constructing a propensity model.** For a two‑group comparison, typically, multivariable logistic regression is used to identify factors predictive of group membership (see "Logistic Regression Analysis" in Section IV). In most respects, this is what cardiac surgery groups have done for years (i.e., find correlates of an event). In this case, it is not risk factors for an outcome but rather correlates of membership in one or the other comparison group of interest.

We recommend initially formulating a parsimonious multivariable explanatory model that identifies common denominators of group membership (see "Multivariable Analysis" in Section IV). This often is important in describing the systematic factors leading to one or another therapy. Prior to modeling, imputation for missing data should be performed. In forming this parsimonious model, avoid discretising continuous variables. The more of these that are in the model, the more granular the propensity score and the better the ultimate matching. Once this traditional modeling is completed, a further step is taken to generate the *propensity model* by augmenting the parsimonious model with other factors, even if not statistically significant. The goal is to balance patient characteristics by whatever means possible, incorporating "everything" recorded that may relate to systematic bias, no matter the statistical significance. (However, this is not to say that the addition of nonsignificant variables is done carelessly; the same rigour in variable preparation described in "Multivariable Analysis" in Section IV is mandatory.)

When taken to the extreme, forming the propensity model can cause problems because medical data tend to have many variables that measure the same thing. The solution is to pick one variable from among a closely correlated cluster of variables as a representative of the cluster. An example is to select one variable representing body size from among height, weight, body surface area, and body mass index. In addition, one must be careful not to include variables that are surrogates for the procedure. For example, if the two groups were more‑or‑less sequentially introduced, including date of operation may be a surrogate for the treatment.

Note that the propensity model may be framed from classification using nonparametric quantile regression models, particularly those that account for nonlinearities or interactions.

**Calculating a propensity score.** Once the propensity modeling is completed, a propensity score is calculated for each patient. If multiple imputation methods are used, the propensity score may be the average of multiple scores. If a logistic regression model has been used, the model produces a *coefficient* or numeric weight for each variable (see Box 7.17). The coefficient maps the units of measurement of the variable into units of risk. Specifically, a given patient’s value for a variable is transformed into risk units by multiplying it by the coefficient. One continues through the list of model variables, multiplying the coefficient by the specific value for each variable. When finished, the resulting products are summed. To this sum is added the *intercept* of the model (see Box 7.17), and the result is the propensity score.

**Using the propensity score for comparisons.** Once the propensity model is constructed and a propensity score is calculated for each patient, four types of comparison are used: matching, stratification, multivariable adjustment, and weighting.

The propensity score can be used as the sole criterion for *matching* pairs of patients (Table 7.11). Rarely does one find exact matches. Instead, a patient is selected from one group whose propensity score is nearest to that of a patient in the other group. If multiple patients are close in propensity scores, optimal selection among these candidates can be used. Rubin (personal communication, 2008) has suggested matching with replacement versus the usual "greedy" matching, which removes matched patients from further consideration. However, because patients are duplicated, this presents analytic challenges. Indeed, matching can be bootstrapped, creating multiple matched comparison groups over which outcome can be averaged.

Tables 7.9 and 7.11 demonstrate that such matching works astonishingly well. The comparison data sets have all the appearances of a randomised study! The average effect of the comparison variable of interest is assessed as the difference in outcome between the groups of matched pairs. However, unlike a randomised study, the method is unlikely to balance unmeasured variables well, and this may be fatal to the inference.

Once patients are matched, it is important to diagnostically test the quality of matching. This can be accomplished visually by graphs of standardised differences (Fig. 7.47). Differences that were substantial should virtually disappear. If they do not, it is possible that interaction terms (multiplicative rather than additive factors) may be required. An alternative if number of events is sufficient (see Box 7.4), the comparison can be made using outcomes regression models with treatment group and poorly matched variables added to the model.

A graph of propensity scores for the groups is instructive (Fig. 7.48). The scores for two treatments may nearly overlap, as they would for a randomised trial. On the other hand, there may be little overlap, as in Fig. 7.49, and the comparison focuses on the centre part of the spectrum of propensity scores, where there is substantial overlap (virtual equipoise).

Outcome can also be compared within broad groupings of patients, called *strata* or *subclasses*, according to propensity score. After patients are sorted by propensity score, they are divided into equal‑sized groups. For example, they may be split into five groups, or quintiles (see Tables 7.9 and 7.10), but fewer or more groups may be used, depending on the size of the study. Comparison of outcome for the comparison variable of interest is made within each stratum. If a consistent difference in outcome is not observed across strata, intensive investigation is required. Usually, something is discovered about the characteristics of the disease, the patients, or their clinical condition that results in different outcomes across the spectrum of disease. For example, in their study of ischaemic mitral regurgitation, Gillinov and colleagues discovered that the difference in survival between those undergoing repair versus replacement progressively narrowed as complexity of the pattern of regurgitation increased and condition of the patient worsened (Fig. 7.50). Apparent anomalies such as this give important insight into the nature of the disease and its treatment. A drawback with this method is that the strata on the two extremes tend to have fewer well‑matched patients.

The propensity score for each patient can be included in a *multivariable analysis* of outcome. Such an analysis includes *both* the comparison variable of interest and the propensity score. The propensity score adjusts the apparent influence of the comparison variable of interest for patient selection differences not accounted for by other variables in the analysis. Occasionally the propensity score remains statistically significant in such a multivariable model. This constitutes evidence that adjustment for selection factors by multivariable analysis alone is ineffective, something that cannot be ignored. It may mean that not all variables important for bias reduction have been incorporated into the model, such as when one is using a simple set of variables. It may mean that an important modulating or synergistic effect of the comparison variable occurs across propensity scores, as noted previously (e.g., the mechanism of disease may be different within quintiles). It may mean that important interactions of the variable of interest with other variables have not been accounted for, leading to a systematic difference identified by the propensity score. The collaborating statistician must investigate and resolve these possibilities. Understanding aside, this statistically significant propensity score has performed its intended function of adjusting the variable representing the group difference.

Using the propensity score as a weight for each patient is a way to improve quality of the matching. In the earlier description of pairwise matching, "whole patients" are matched with "whole patients." Another approach is to fractionally match all patients according to their propensity score. Li and Green show that this improves matching, and it has become our standard method. Other forms of weighted matching include inverse probability weighting. A drawback to inverse probability weighting is that at small probabilities the inverse may be large, upsetting the balance and necessitating "trimming," unlike the Li and Greene method.

**Oranges.** The propensity score may reveal that a large number of patients in one group do not have scores close to patients in the other. Thus, some patients may not be matched. If stratification is used, quintiles of patients may have hardly any matches at one or the other, or both, ends of the propensity spectrum. We have called these "oranges" (as in "apples and oranges" comparisons).

In some settings, they represent a different end of the spectrum of disease for which different therapies have been applied systematically. Often the first clue to systematic selection is finding that the influence of the comparison variable of interest is inconsistent across quintiles and results in a quasi‑separation error in logistic regression modeling. Indeed, this emphasises the nature of comparisons with balancing score methodology: the comparisons relate only to the subset of patients that is truly apples‑to‑apples. Comparing these apples to the remaining oranges with respect to outcomes is not valid. The area of broad overlap of propensity scores, in contrast, can be thought of as the area of *virtual equipoise* (see Fig. 7.49). The cautionary note is that this phenomenon is identical to the limitation of clinical trials that have many exclusion criteria; inferences from the trial can be made only to that restricted subset of the population studied, something rarely pointed out in publications.

Thus, when apples and oranges (and other "mixed fruit") are revealed by a propensity analysis, investigation should be intensified rather than the oranges simply being set aside. After the investigation is completed, comparisons among the well‑matched patients can proceed with known boundaries within which valid comparisons are possible.

**Limitations.** Some investigators tell us that balancing score methods are valid only for large studies, citing Rubin. It is true that large numbers facilitate certain uses of these scores, such as stratification. However, we believe there is considerable latitude in matching that still reduces bias; the method seems to "work" even for modest‑sized data sets.

Another limitation is having few variables available for propensity modeling. The propensity score is seriously degraded when important variables influencing selection have not been collected. A corollary to this is that unmeasured variables cannot be reliably balanced. If these are influential on outcome, a spurious inference may be made.

The propensity score may not eliminate all selection bias. This may be attributed to limitations of the modeling itself imposed by the linear combination of factors in the regression analysis that generates the balancing score (see Box 7.17). If the comparison data sets are comparable in size, it may not be possible to match every patient in the smaller of the two data sets, simply because closely comparable patients have been "used up," unless propensity weighting is used, or bootstrap sampling with replacement.

Perhaps the most important limitation is inextricable confounding. Suppose one wishes to compare on‑pump CABG with off‑pump CABG. One designs a study to compare the results of institution A, which performs only off‑pump bypass, with those of institution B, which performs only on‑pump bypass. Even after careful application of propensity score methods, it remains impossible to distinguish between an institutional and a treatment difference, because they are inextricably intertwined (confounded); that is, the values for institution and treatment are 100% correlated.

**Extension.** At times, one may wish to compare more than two groups, such as groups representing three different valve types. Under this circumstance, multiple propensity models are formulated by fully conditional multiple logistic propensity scores (see "Polytomous Logistic Regression" in Section IV). However, we often find that different treatments are applicable to somewhat different kinds of patients. Thus, pairwise comparison of separately matched groups may yield more appropriate comparisons than use of a polytomous approach.

Logistic regression is not the only way to formulate propensity scores. A nonparametric machine learning technique—random forests—can be used and has been found by Lee and colleagues to better balance groups, with reduced bias. We have formulated a generalised theorem as an extension of the work of Imai and van Dyk for propensity scores and devised a data‑adaptive, random‑forest, nearest‑neighbor algorithm that simultaneously matches patients and estimates the treatment effect from thousands of bootstrap samples while simultaneously refining the characteristics of "true" oranges—noncomparable patients.

<details class="med-details"><summary>

#### TABLE 7.11 Comparison of Patient Characteristics According to Long‑Term Aspirin Use in Propensity‑Matched Pairs</summary><div class="details-content">

| Patient Characteristic | ASA | No ASA |
|------------------------|-----|--------|
| n | 1351 | 1351 |
| Men (%) | 49 | 51 |
| Age (years) | 60 | 61 |
| Smoker (%) | 50 | 50 |
| Resting heart rate (beats·min⁻¹) | 77 | 76 |
| Ejection fraction (%) | 51 | 51 |

###### Table illustrates ability of the propensity score to produce what appears to be a randomised study balancing both patient characteristics and n. *ASA,* Long‑term aspirin use. Data from Gum and colleagues.

</div></details>

![](_page_94_Figure_9.jpeg)

**FIGURE 7.47** Covariable balance plot before and after propensity score matching on selected covariables. Symbols depict percent standardised differences for covariables between patients in less invasive and conventional groups. *BMI,* Body mass index; *BUN,* blood urea nitrogen; *COPD,* chronic obstructive pulmonary disease; *Dysfunct.,* dysfunction; *HTN,* hypertension; *LV,* left ventricular; *Regurg.,* regurgitation; *TV,* tricuspid valve. (Johnston DR, Atik FA, Rajeswaran J, Blackstone EH, Nowicki ER, Sabik JF 3rd, Mihaljevic T, Gillinov AM, Lytle BW, Svensson LG. Outcomes of less invasive J‑incision approach to aortic valve surgery. *J Thorac Cardiovasc Surg.* 2012;144(4):852‑858.)

![](_page_95_Figure_3.jpeg)

**FIGURE 7.48** Distribution of propensity scores for conventional and less invasive approaches for aortic valve replacement. (Johnston DR, et al. *J Thorac Cardiovasc Surg.* 2012;144(4):852‑858.)

![](_page_95_Figure_9.jpeg)

**FIGURE 7.49** Mirrored histogram of distribution of propensity scores for conventional *(bars above zero line)* and less invasive *(bars below zero line)* approaches for aortic valve replacement. *Darkened area* represents matched patient pairs, showing that they cover the complete spectrum of cases but predominate in the central area (area of "virtual equipoise").

![](_page_96_Figure_2.jpeg)

**FIGURE 7.50** Demonstration of changing risk across propensity score for mitral valve repair versus replacement. Because of small numbers of patients with mitral valve replacement in quintiles III through V, these quintiles are grouped together. Patient profiles are similar in each quintile but differ across quintiles. Each symbol represents a death according to the Kaplan‑Meier estimator. Vertical bars enclose asymmetric 68% confidence limits (CL); solid lines enclosed within dashed 68% CLs represent parametric survival estimates; numbers in parentheses are numbers of patients traced beyond that point. P values are for log‑rank test. (A) Quintile I. (B) Quintile II. (C) Quintiles III through V. (From Gillinov and colleagues.)

</div></details>

</div></details>

<details class="med-details"><summary>
  
##### Inferences from Randomized Versus Nonrandomized Comparisons</summary><div class="details-content">

Randomised clinical trials yield a population treatment comparison: the average treatment effect. By random treatment assignment they permit cause–effect (causal) inferences about efficacy and safety of alternative treatments. Although Rosenbaum purports that use of propensity matching moves observation comparison to a causal comparison, as do advocates of inverse probability of treatment weighting, an admittedly conservative inference is that use of propensity methods, rather than applying to the population, applies to those treated, yielding the average treatment effect on the treated (ATT).

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Decision‑Making Based on Individual Effects of Therapies</summary><div class="details-content">

<details class="med-details"><summary>
  
#### Precision Medicine</summary><div class="details-content">

Heterogeneity of response to treatment calls into question the value of treatment decisions based on average treatment effects from either randomised or nonrandomised studies, despite their importance to evidence‑based medicine. In contrast, precision medicine explicitly seeks to identify the right therapy for the right patient, requiring methodology for identifying an individual treatment effect (ITE, or its counterpart ITT, sometimes referred to as conditional treatment effect). Randomised trials and their meta‑analyses hide heterogeneity in individual‑patient response, known as heterogeneity of treatment effects. This is what drove ART trial investigators to dig into their data to identify a subgroup that appeared to benefit from multiple arterial grafting. Attempts to ferret out subsets who may benefit (or be harmed) are hypothesis‑generating, although the high quality of data collected in randomised multisite trials render them good sources for exploring individual treatment effects.

Tonelli notes that "Precision medicine differs from evidence‑based medicine, which seeks to determine the best course of action for a patient with an appeal to generalisable knowledge gained from population‑based studies...the major challenge of precision medicine...will be to expand the individualised knowledge that can confidently be brought to bear, moving beyond genomics and proteomics to include life‑style and environment as premised in its definition."

For nearly half a century, efforts have been made in cardiac surgery to develop mathematical models for patient‑specific decision‑making based on routine clinical information, a precision‑based approach. Early work included optimal decision about primary versus two‑stage repair of tetralogy of Fallot. Subsequently, equations were developed to provide patient‑specific guidance for medical therapy versus percutaneous coronary intervention versus CABG. When similar efforts were directed at the multiple therapies for ischaemic cardiomyopathy, it became clear that even for patient‑specific decision‑making, a patient must be eligible for any of the proposed therapies. For example, mitral valve repair plus CABG versus a Dor operation would not be an appropriate comparison if the patient did not have mitral valve regurgitation.

In all these endeavours, which were based on parametric models, the concept was to solve the applicable equations for the characteristics of a particular patient and compare predicted outcomes. If two treatment outcomes were predicted and compared, these calculations might be referred to as being for virtual twins—twins with completely identical characteristics. Thus, in the text that follows, we start with precision medicine estimates using regression methods, then balancing score methods, and ending in the latest of these, virtual twin methods that can yield both an average treatment effect and an exquisitely balanced individual treatment effect.

</div></details>

<details class="med-details"><summary>
  
#### Use of Incremental Risk Factors from Multivariable Analyses</summary><div class="details-content">

Multivariable analysis identifies incremental risk factors for outcomes, and this provides one form of new knowledge for clinical decision‑making. The risk factors identified are sometimes proclaimed by cardiac surgeons and others to be "truly independent," suggesting that such a risk factor is independent of the effect of any other risk factor in exerting its influence. Such is not the case, and this idea is not the origin of the use of the adjective "independent." An independent variable is simply one that may be associated with the dependent (outcome) variable (see Box 7.16). Draper and Smith state, "The words 'independent variables' must not be too literally interpreted. In a particular body of data, two or more independent variables may vary together in some definite way."

In addition to generating specific new knowledge by identifying risk factors for an outcome, multivariable analysis (see Box 7.16) can be used for patient‑specific predictions and comparisons of outcomes after competing forms of therapy. Risk‑adjusted comparisons can be made of the results of different surgeons, different interventional cardiologists, different methods, and different institutions.

Authors of the first American College of Cardiology/American Heart Association (ACC/AHA) guidelines for CABG recognised wide variability of mortality among patients whose ischaemic heart disease was managed medically, by percutaneous coronary intervention, or CABG. The writers therefore included a section entitled "Patient‑Specific Guidelines and Indications for Coronary Artery Bypass Operation." Equations were provided in appendices and on a floppy disk prepared to allow physicians to generate survival curve differences in survival; differences in RMST, hazard functions and ratios; and time‑related P values for all of these with graphical output according to individual patient characteristics for medical management, percutaneous transluminal coronary angiography, and CABG (see Fig. 7.30). They anticipated that these would be useful for making therapeutic recommendations and for informed patient decisions. Only 60 requests were made for these disks, indicating that clinicians were not ready to adopt quantitative tools like this, particularly in an era (which includes the present) before it was possible to extract values for model variables from the CPR, perform the calculations, and display results automatically.

As with this ACC/AHA example, we note that with rare exception published papers represent a static medium (this may change substantially in the future as dynamic features are linked directly to publications). However, parametric model analyses generate mathematical models that can be solved for the characteristics of a specific patient (*patient‑specific predictions*), complete with CLs. Used in this way, static presentation of "risk factors" becomes a basis for dynamic decision support for individual patients. Simpler graphical nomograms to accomplish this in cancer were introduced by Kattan’s group, and these individual‑patient decision tools have gained considerable traction (see https://riskcalc.org).

Multivariable analysis of clinical experiences can also be used to investigate the nature of cardiac surgery for a specific situation, such as stages in palliation of single ventricle physiology or the post‑cardiopulmonary bypass state. For such purposes, a series of sequential analyses are often more useful than a single analysis performed with preoperative variables in a parsimonious manner. In sequential analysis, often the patient‑specific potential risk factors are first examined and the multivariable equation for the outcome event generated. Then the procedural variables may be entered and their effect on the certainty and strength of the patient‑specific variables studied. This may be followed by analysis of the downstream effect of complications. That may be followed by time‑varying covariates leading to dynamic relationships rather than static ones (formalisation of this concept in the form of directed acyclic graphs is found under "Special Methods and Controversies" in Section VII.) New ideas then generate reanalyses, reevaluation of the correlations between risk factors, and additional new analyses.

Multivariable analysis can also be used to examine and interpret the way one risk factor *modulates influence* on outcome of another. One such use is to determine if a risk factor, such as age, is neutralised with experience (Fig. 7.51, see Appendix 7C). Another is to determine if treatments modulate some risk factor differently from another (interaction terms) (Fig. 7.52).

All of these details emphasise the care with which multivariable models must be developed. Good, reliable, and valid analyses are not made by computers alone, but by people using computers expertly as just one tool of analysis and synthesis, so‑called "supervised" analyses.

It will be argued that medical and surgical treatments are changing so rapidly that no data from the past are relevant for today’s decision support; at best, general guidelines and judgment are all that is available. However, this gives more credit to new therapy than most medical and surgical innovations deserve. Furthermore, a decision must be made, and making it on the basis of past data is likely to be less faulty than using no data at all.

**Limitations of Regression Equations for Individual Patient Treatment Decisions.** There are important limitations in using regression equations for individual patient treatment decisions.

- Richness of the equations is limited by number of events (see Box 7.4).
- Although the equations reflect real‑world experience, they are often based on the limited experience of a single institution.
- Regression equations are optimised for explanation of phenomena (associations, not causation). They are not optimised for prediction with minimization of prediction error, although this is possible to do, as shown by Lu and Ishwaran.
- Parametric equations can generate calculations even if a treatment is not applicable to that patient.

![](_page_98_Figure_8.jpeg)

**FIGURE 7.51** Illustration of prediction from multivariable models. Observed hospital mortality after repair (1984 to September 1985) of isolated complete atrioventricular septal defects in patients younger than age 12 months (n=23, deaths=1) and in those age 12 to 48 months (n=5, deaths=0). Note that both observed mortalities (*circles*) and their confidence limits (CL; *vertical bars*) lie within 70% CLs of mortality predicted for repair by the multivariable equation derived from 1967 to 1982 experience. (From Kirklin and colleagues.)

![](_page_98_Figure_10.jpeg)

**FIGURE 7.52** Illustration of prediction when risk factors modulate and neutralise one another. Observed hospital mortality after repair (1984 to September 1985) of complete and partial atrioventricular septal defects with or without major associated cardiac anomalies; observed mortality is shown as open circles, and vertical bars represent 70% confidence limits (CL). Note that these observed mortalities lie on nomogram lines representing a solution of the multivariable equation. Solid line represents 8‑day mortality, and dashed lines enclose 70% CLs. The widely dotted depiction extends the solid line of probability estimate into a time period (1982‑1986) not included in the experience used for derivation of equations and coefficients. (From Kirklin and colleagues.)

</div></details>

<details class="med-details"><summary>
  
#### Use of Virtual Twins Analyses</summary><div class="details-content">

Even for a medical discipline steeped in a tradition of randomised trials, the evidence basis for only a few guidelines is based on randomised trials. In part this is due to continued development of treatments, in part to enormous expense of clinical trials, and in large part to the hundreds of treatments and their nuances involved in real‑world, heterogenous clinical practice. Thus, many therapeutic decisions are based on observational studies.

An approach we embarked on in the 1970s was using risk factor regression equations to compare outcomes for individual patients as if they had one treatment versus another. An example is staged versus primary repair of tetralogy of Fallot. Separate equations were generated for each alternative treatment, and outcomes for alternative treatments were calculated from each. We recognised in the mid‑2000s that we needed to consider three more factors. First, we needed to explicitly identify for every patient which alternative treatments they were eligible for. Second, we needed to incorporate into each regression equation the identical variables, whether statistically significant or not. Third, we needed to incorporate interactions of the treatment with the risk factors. Such was the case with exploring alternative therapies for ischaemic cardiomyopathy. However, in that study we used a set of clinical rather than statistical rules for eligibility obtained empirically from real‑world data.

In attempting to identify optimum individual‑patient treatment for esophageal cancer using worldwide data, we recognised that a statistically robust method for identifying patient eligibility for alternative therapies needed to be developed. The methodology needed to address two major problems: (1) only partial overlap of treatments and (2) selection bias. Each treatment is to a degree bounded within constraints of indication and appropriateness, but the same patient might be treated differently by different physicians or at different hospitals, often without explicit or evident reasons. Hence, a fundamental hurdle in decision‑making from observational studies is to address the resulting selection bias or confounding. Naively evaluating differences in outcomes without doing so leads to biased results and flawed scientific conclusions.

"Potential outcomes" proves to be a powerful framework for achieving unbiased and correct inference from observational data. Consider the setting of a treatment with two options, say Z = 0 and Z = 1, where we are interested in determining the optimal treatment for a patient. In this framework, one plays the game of hypothesising what would have happened if the individual could have received both treatments. Let Y(0) and Y(1) be these potential outcomes, that is the outcomes for the individual under each of the two treatments, and write μ(0) and μ(1) for their expected values. Then the treatment effectiveness parameter for the patient is:

$$\emptyset = \mu(1) - \mu(0).$$

Knowing this value provides us with gold standard information needed to decide the best course of action. However, the difficulty of implementing this strategy in practice is that although the potential outcomes are hypothesised to exist, only the outcome Y from the actual treatment assignment is observed.

An effective way to obtain counterfactual outcome estimates is the virtual twin method. Let **X** be the patient’s covariate and Z be the "causal variable." The goal is to study the effect of Z on the individual’s outcome of interest. Our prior discussion considered when Z was a binary treatment; however, it is possible for Z to be much more abstract (for example, it can be continuous or even multivariate and thus is abstractly referred to as being the causal variable). In the virtual twin method, using the observational data, a prediction model \(\hat{f}(Z, X)\) is obtained from a machine learning method for estimating the mean outcome for Y given the patient variable **X** and the causal value Z.

Denote the true mean value f(Z, X). Then \(\hat{f}(Z^a, X) - \hat{f}(Z^c, X)\) is used to estimate the individual’s causal effect size \(f(Z^a, X) - f(Z^c, X)\) where Z^c is the causal treatment for the individual and Z^a is the actual treatment assignment. Conceptually this amounts to having virtual twins, where each twin is exactly the same and therefore has the same patient covariate **X**, but where one twin is studied under treatment Z^a (so this is the actual patient under the assigned treatment), and the other under the causal treatment Z^c (so this is the virtual twin under the hypothesised treatment).

As mentioned before, even though in observational data settings we are only able to observe the outcome for the assigned treatment Z^a and not for the causal treatment Z^c, and therefore we can observe only one twin, machine learning makes it possible to accurately estimate the outcome under both settings, which under certain assumptions yields an unbiased estimator for the true causal effect size. One of the key assumptions needed for unbiased estimation is the so‑called positivity assumption. In the virtual twin analogy this means that a virtual twin under the alternative treatment assignment has to be possible. This may not always happen, because some treatments may not be plausible or even ethical for every patient. Therefore, we must ask what if the patient received the alternative treatment, and we must be convinced that such a treatment assignment is plausible. If we pass the "what if" test, then we can use the machine learning regression model applied to the virtual twin to estimate the true model value under the causal treatment assignment. To test for "plausibility" of "what if," we must check the positivity condition and discard virtual twins that fail to meet the "what if" criteria. The partialPro estimator checks for violations by using isolation forests, which is a popular machine learning procedure for outlier detection.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Transforming Statistical Inferences into Clinical Inferences</summary><div class="details-content">

Statistical inferences focus on interpreting magnitude and variability of parameter estimates, reliability of numeric results, summary statistics, behaviour of CLs, P values, variable importance, and many other numeric results. The data truly speak through these results, often revealing what is important and what is not. However, numeric information often does not lead to the kind of mental image of these statistics that is needed to generate knowledge for making clinical decisions. There must be a view of the wood, not just the trees. Something further is needed to translate *statistical* inferences into *new knowledge* for *clinical* inferences.

<details class="med-details"><summary>
  
#### Visualization from Analyses</summary><div class="details-content">

One of the most powerful tools to translate statistical inferences into clinical inferences and new knowledge is graphics. An important reason for using and developing models was that they facilitate generating graphical *nomograms*, as advocated by the Framingham investigators (see Fig. 7.45). For example, if an analysis indicates an association of survival with age, we want to know the shape of that relationship. Is it relatively flat for a broad range of age before rapidly increasing at either extreme of age? Or does risk increase rather linearly with increasing age? Although the answers to these questions are contained within the numbers on computer printouts, these numbers are not easily assimilated by the mind. However, they can be used to demonstrate graphically the shape of the age relation with all other factors held constant.

<details class="med-details"><summary>
  
##### Visualization of Parametric Models</summary><div class="details-content">

Because graphics are so powerful in the process of generating new knowledge, an important responsibility is placed on statisticians to be sure that relations among variables and outcomes are correct, particularly when continuous variables are incorporated into parametric regression models. Often, variables are examined and statistical inferences made simply to determine whether a continuous variable is a risk factor, without paying particular attention to what the data convey regarding the shape of the relationship to outcome. Instead, the statistician needs to focus during analysis on linearising transformations of scale or a spline representation thereof that may be needed to faithfully depict the relationship (see "Multivariable Analysis" in Section IV) or use nonparametric machine learning with few assumptions. Our experience indicates that most relations of continuous variables with outcome are smooth when numbers are sufficient, and often they are nonlinear. They uncommonly show sharp cut‑offs (see "Continuity Versus Discontinuity in Nature" in Section I), although they may well show evident differences (see Appendix 7B).

</div></details>

<details class="med-details"><summary>
  
##### Visualization of Nonparametric Machine Learning Algorithms</summary><div class="details-content">

Although machine learning methods have superior prediction performance and are excellent tools for outcome prediction and prediction in causal inferential models like the virtual twin method described earlier in this section, a shortcoming is their lack of interpretability or transparency. Often they are viewed suspiciously as being "black boxes" without the ability to provide insight into the clinical decision‑making process. When the causal variable is continuous, or multivariate, understanding and visualising the causal relationship are essential.

A powerful tool for achieving this goal is the partial dependence plot that isolates the effect of a single variable in the prediction model while simultaneously adjusting for all other variables. Surprisingly, the partial dependence plot has a strong connection to an important causal inferential quantity, the average treatment effect.

To explain this, consider again the scenario of a binary treatment Z ∈ {0, 1} and let (Y_i, Z_i, X_i) be the data i = 1, …, n. From an estimated prediction model \(\hat{f}(Z, X)\) trained on the data, such as that obtained from random forests, Bayesian additive regression trees (BART), or using gradient tree boosting, the average treatment effect, which is the mean of f(Z, X) averaged over X, can be estimated by:

$$\frac{\sum_{i=1}^{n} \hat{f}(z=1, X_i)}{n} - \frac{\sum_{i=1}^{n} \hat{f}(z=0, X_i)}{n}$$

Note that the difference between this and the observed mean difference:

$$\frac{\sum_{i=1}^{n} I\{Z_i = 1\} Y_i}{\sum_{i=1}^{n} I\{Z_i = 1\}} - \frac{\sum_{i=1}^{n} I\{Z_i = 0\} Y_i}{\sum_{i=1}^{n} I\{Z_i = 0\}}$$

is that the former is equivalent to integrating \(\hat{f}(Z, X)\) over the covariates using the marginal density of the observed covariates, while the latter uses the conditional density of the observed covariates conditioned on the treatment (causal) variable.

Fig. 7.53A demonstrates that adjusting for all other covariates by integrating them out, which is what the partial plot seeks to do, is of paramount importance. In this example, we use a continuous treatment variable Z, and the true conditional mean of Y is f(Z, X) = –Z² + 2.5X, where Z and the covariate X are normally distributed with a correlation of 0.9 and both variables have a mean of 0 and a variance of 1. Because X has a mean of zero, the average treatment effect obtained by integrating over X is \(\mathcal{O}(Z) = -Z^2\). Thus, the treatment variable Z has a quadratic effect on the outcome Y, but the naive scatterplot estimator in blue in the figure demonstrates a positive, near linear effect on Y due to the fact that Z is strongly correlated with the confounding variable X. This is similar to what happens when using a naive estimator in binary treatment problems. It ignores the possibility that treatment assignment may be correlated with the patient variable. Therefore, it is misleading. Likewise, the scatterplot is misleading because it does not control for the confounding variable. Integrating f(Z, X) over the marginal distribution of X given by red points reflects the true causal relationship for Z, which is the quadratic \(\mathcal{O}(Z) = -Z^2\) displayed by a green line.

To construct the partial plot estimator, for a treatment variable taking M > 1 values z(₁)…z(ₘ), let f(z, X) be the machine learning predictor trained on the data. Then the true causal value \(\mathcal{O}(z_{(j)})\) is estimated by the partial plot estimator:

$$\hat{\theta}_{\text{partial plot}}\left(z_{(j)}\right) = \frac{\sum_{i=1}^{n} \hat{f}\left(z_{(j)}, X_i\right)}{n}$$

Notice that this estimator is the same as that used for the average treatment effect estimator and that it is different from the naive scatterplot estimator:

$$\hat{\theta}_{\text{naive scatterplot}}\left(z_{(j)}\right) = \frac{\sum_{i=1}^{n} I\left\{Z_i = z_{(j)}\right\} \hat{f}\left(z_{(j)}, X_i\right)}{\sum_{i=1}^{n} I\left\{Z_i = z_{(j)}\right\}}$$

That, as we have already explained, is a poor estimator because it ignores potential correlations with confounding variables.

Even though the partial plot estimator is a superior estimator to the scatterplot estimator, it still suffers from one major deficiency in that it does not check the positivity condition. Recall that for correct inference in causal inference we have to play the virtual twin game of "what if" and convince ourselves that the virtual twin we wish to study is legitimate. The partial plot estimator uses every data point in the training data and then substitutes in the treatment variable z for each of the "what if" values z(₁)…z(ₘ). Therefore, each data point has M virtual twins. However, many of these virtual twins may not be sensible, and this is especially the case when the treatment variable is correlated strongly with the covariates.

We can see this effect by considering Fig. 7.53B. Shown are partial plot estimators using random forests, Bayesian additive regression trees (BART), and boosted trees. The root mean‑squared error (RMSE) for each procedure is displayed in the figure legend. In this example, BART appears to have the best performance, most likely because of its better behaviour near the edges. However, all methods have trouble estimating the true causal relationship \(\mathcal{O}(Z)\), given in green.

Also displayed in Fig. 7.53B are the results using partialPro. Unlike the other procedures, this method checks the positivity condition and discards virtual twins that fail to meet the "what if" criteria. The partialPro estimator checks for violations by using isolation forests for outlier detection. In this example, we clearly see the benefits of checking the positivity condition, as the partialPro estimator has by far the best performance. We observe a small RMSE of 0.13, and its estimated curve is nearly identical to the truth.

![](_page_101_Figure_3.jpeg)

**FIGURE 7.53** Example in which the true causal relationship is quadratic, but due to correlation between the treatment variable and the covariate, the relationship appears nearly linear in a naive analysis; even with powerful machine learning procedures, the results can be suboptimal due to using implausible virtual twins. Panel *A* demonstrates that adjusting for all other covariates by integrating them out, which is what the partial plot seeks to do, is of paramount importance. Panel *B* demonstrates partialPro result that checks for violations by using isolation forests.

</div></details>

</div></details>

</div></details>

</div></details>
  
</div></details>

<details class="med-details"><summary>
  
## SECTION VI: DISSEMINATING KNOWLEDGE</summary><div class="details-content">

<details class="med-details"><summary>
  
### Historical Note</summary><div class="details-content">

Modern structure of a scientific paper was formalised by Louis Pasteur, who established the "IMRD" format for reporting scientific information: *Introduction, Methods, Results, Discussion*. Contrast this format, for example, with "A further account of Mr. Boyle’s experimental history of cold" in *Transactions of the Royal Society,* Volume 16:

*6. Whether that Tradition be true, that if frozen Apples or Eggs be thaw’d neer the Fire, they will be thereby spoil’d, but if immersed in cold water, the Internal Cold will be drawn out, as is supposed, by the External Cold; and the frozen Bodies will be harmlesly thawed?....*

*7. What Bodies are expanded by being frozen, and how that expansion is evinced? And whether it is caused by the intrusion of Air? As also, whether, what is contained in icy bubbles, is true and Spring Air, or not.*

Here in this first volume of the first English scientific journal, you find simply stream‑of‑consciousness questions that lead up to Boyle’s Gas Law relating temperature and pressure to volume of a gas—"Springy Air."

In modern times, Dr. Gerald Pollack recounts in the text *The Fourth Phase of Water: Beyond Solid, Liquid, and Vapor,* details of his discovery of the fourth phase of water that also started with unanswered childhood questions (subsequently we have as of this writing more than nine states just of ice, including the bronze metal state). These are wonderful unstructured tales of discovery that reveal the context, the questions, and the work, including the false hypotheses, bad assumptions, and "rabbit holes" that finally lead to discovery.

In the crowded field of modern medical publishing, we have no room for these stories, but just a highly structured scientific paper that is neither poetry nor prose, just signpost and content for selective, strategic reading. This format has been codified into the requirements of all scientific journals. It provides a valuable structure for thinking about and clearly expressing the findings of one’s research.

</div></details>

<details class="med-details"><summary>
  
### Scientific Paper</summary><div class="details-content">

A scientific paper is a formal communication of new knowledge generated by a scientific study. It can be argued that science must be communicated to exist. The importance of communicating clinical research is that evidence‑based medicine is literature‑based medicine. Thus, medical research can have life‑and‑death implications, although Day comments, "Good scientific writing is not a matter of life or death...it’s much more serious than that."

Unlike most other forms of communication, scientific writing has all the following elements:

- It is in the public domain and not proprietary.
- It is objective.
- It presents sufficient information to allow verification by others.
- It builds on what has been previously discovered.
- It predicts what should subsequently transpire in an orderly universe.
- It is not written with just authority or opinion as its basis, but rather with information, data, and analyses at its core.
- It does not intuit or pass along traditions but draws inferences and relates these to the context of past investigations.
- It is a formally structured communication.

Rarely is the progress from research proposal to scientific paper (formatted according to its formal structure) linear. That is, the paper, written on the basis of what has been discovered from the investigation, likely cannot entirely reflect the original study proposal. The best way, then, to begin writing a scientific paper is to study intently the descriptive statistics, results of the various analyses, tabular results, and graphical depictions from the analyses, allowing "the data to speak for themselves."

Goals for the paper are then set that establish its message and those purposes of the study that relate directly to supporting this message. These purposes will comprise the last sentences of the Introduction. Methods and Results likely should follow, then completing the initial portion of the Introduction and Discussion. We recommend writing the Abstract last because it condenses all the text from the Introduction through Discussion and Conclusions. In the following text, each element of a manuscript is defined and described in accordance with its function.

<details class="med-details"><summary>
  
#### Authors</summary><div class="details-content">

Perhaps the most contentious portion of a paper is the author list. It is simplistic to say that the authors are the ones who wrote the paper. Author lists reflect, more often than not, sociology: power, authority, expertise, experience, or rank. It has academic implications; the admonition of "publish or perish" is real, and this is particularly important in deciding who will be the first author, particularly among younger participants in the study. It has financial implications with respect to the "investigators" score when applying for grants.

The International Committee of Medical Journal Editors defines an author based on four criteria:

- Substantial contributions to the conception or design of the work; or the acquisition, analysis, or interpretation of data for the work; AND
- Drafting the work or revising it critically for important intellectual content; AND
- Final approval of the version to be published; AND
- Agreement to be accountable for all aspects of the work in ensuring that questions related to the accuracy or integrity of any part of the work are appropriately investigated and resolved.

Medical journals have recognised that not all individuals who have contributed to a study meet these four requirements. Therefore, a new category for such individuals has been defined: Contributors. These may be persons who in the past have merely been acknowledged, or they are part of a team that has played a secondary, but meaningful, role in the study. A PubMed search will reveal that The National Library of Medicine in the United States has preserved the names of contributors, and they are searchable.

Clinical journals often require a statement or checklist of what contribution each author has made to the manuscript, and in some cases the truthful answer is "nothing." In an ideal and just world, the list of who contributed what and the author order should be decided when developing the study proposal. However, often in the course of gathering data, analysing the data, and writing the paper in today’s multidisciplinary team‑based research environment, persons other than those who developed the proposal contribute importantly to the study and should be considered for the author list. There seems to be no perfect solution, except that it has become customary for the last author to be the senior author and the first author the primary leader of the project and the one who generates the initial complete manuscript draft.

</div></details>

<details class="med-details"><summary>
  
#### Title</summary><div class="details-content">

The title introduces the work. It might be the only thing read and so must entice intended readers. A good title is short but specific, truly represents the content of the paper, is indexable, and avoids jargon, qualifiers, abbreviations, and "filler." A title might be provocative, particularly if addressing a controversy, asking a question, or making a statement paralleling a conclusion. Care should be taken to ensure that the title does not overstate the study’s content or inferences, nor mislead the reader.

</div></details>

<details class="med-details"><summary>
  
#### Message</summary><div class="details-content">

The Ultra‑Mini Abstract, now often called the Central Message, was the first "reader’s guide" to a manuscript added by *the Journal of Thoracic and Cardiovascular Surgery.* It is the truest two or three sentences that capture the essence of the findings—the message of the paper. It is not a brief summary of the rationale for the study or its results. Rather, it is the inferences that will be supported by the results. It is often identical to the conclusions of an abstract and a condensation of the paper’s conclusions section.

Only if one can simply and succinctly understand the findings of the study and articulate what they mean will one be able to convey them clearly to the reader. By experimentation, we found that if the essence can be stated adequately in fewer than 25 words, the paper may have low information content and should be conveyed as a brief communication or letter to the editor. If it cannot be stated in 25 to 50 words, there may be information overload, and the study should be split into more than one manuscript, each focused on a different aspect of the results.

Once this piece, the essence of the study, is written, the entire manuscript—text, tables, and figures—should be sharply focused on those results that support the paper’s message. Other information should be either relegated to appendices or online supplemental material, or eliminated altogether. In addition to the Ultra‑Mini Abstract, many journals also include either a short abstract, a list of key findings, a perspective in accessible medical language, and other brief synopses of the manuscript. These help readers to decide quickly if they want to read the entire article. A simple figure that best conveys an important finding may also be required.

Even more helpful than a simple figure is a graphical/visual abstract. These were pioneered in chemistry journals in the 1970s but have been adopted by many medical journals over the last decade. As noted by Hoffberg and colleagues, these graphical abstracts tell the story of a scientific paper and generally contain the fundamental Pasteur IMRD elements in graphical form. Their crossover‑design randomised trial demonstrated a substantially greater impact of a graphical abstract over that of a text abstract. Ibrahim and colleagues at the University of Michigan have provided several versions of how to effectively design such abstracts.

</div></details>

<details class="med-details"><summary>
  
#### Structured Abstract</summary><div class="details-content">

In the January 1, 1956, edition of the *Journal of the American Medical Association,* an abstract first appeared but in unstructured format. In April 1987, the Ad Hoc Working Group on Critical Appraisal of the Medical Literature proposed the structured abstract as a way to "assist clinicians in finding articles that are both scientifically sound and applicable to their practices. An easily implemented, although partial, solution is for authors of articles that have clinical implications to structure their abstracts so that key aspects of purpose, methods, and results are reported with a partly controlled vocabulary and in a standardised format."

Today, most medical journals require a structured abstract, although the "key aspects" vary from quite elaborate (as for the *Journal of the American Medical Association*) to the simple Pasteur IMRD elements, often reexpressed as Objectives, Methods, Results, and Conclusions. A general guide for writing an abstract is the 10‑sentence method: 2 sentences for objectives, 3 sentences for methods, 3 sentences for results, and 2 sentences for conclusions. In practice, we note that many times the conclusion simply reiterates the results and not conclusions "applicable to their practices." We recommend that the Ultra‑Mini Abstract, described in previous text and limited to about 50 words, be used as a model for the conclusions. The results, then, provide the data that support the conclusions, no more and no less, and these results dictate the objectives and methods synopses.

</div></details>

<details class="med-details"><summary>
  
#### Introduction</summary><div class="details-content">

The introduction answers four important questions:

- What is the problem addressed?
- Why is it important?
- What is the context?
- What are the specific objectives of the study that will address the problem?

**The Problem.** Within the first sentence or two, the reader needs to know what problem you have tackled in your study. It is the overall research question, or overall objective of the study, or overall aim. It is tempting to recite a historical prelude that leads up to the problem, but if the reader does not quickly understand the problem being addressed, interest will possibly be lost.

**Importance.** Again, within the first couple of sentences, the reader must understand the importance of the investigation to them, to patients, and to science. In the words of Daniel Burnham, "Make no little plans; they have no magic to stir men’s blood...."

**Context.** Once the problem and why it is important are stated, it is customary to provide a brief paragraph that sets the context, typically with only a few key references. For example, if there is a controversy you have studied, state it. If you have studied durability of a novel bioprosthesis, the rationale might be stated. If you are making a comparison, you might cite key papers about each side of the comparison, such as surgical versus transcatheter procedures for mitral valve repair. Keep the context short and focused. The temptation is to write a large chunk of the Discussion in the Introduction, which hinders the reader from quickly understanding what you have done and why.

**Specific Objectives.** Often heralded by the word "therefore," the specific objectives of your study in the order of your Central Message should be stated. These may be accompanied by one or more mechanistic hypotheses that will lead to endpoints, and endpoints to analyses to be performed.

As you write these specific objectives, bear in mind that these now must be refined and either limited or expanded to include the one, two, or three aspects of the study that led to the essence of the findings. For example, the original incentive for your research may have been to discover any possible adverse effect of reoperation for bleeding on hospital outcomes. However, to investigate this properly, you likely would have more specifically determined the prevalence of postoperative bleeding and incremental risk factors associated with bleeding, perhaps then using these to develop a propensity score so that an apples‑to‑apples comparison could be made of outcomes in patients who did and did not require reoperation. Thus, for the manuscript, the stated objective may be to (1) determine the prevalence of postoperative bleeding, (2) identify incremental risk factors for postoperative bleeding, and (3) compare the prevalence of hospital complications between those who experienced bleeding and those who did not.

Given a clear message for the paper and a clear statement of objectives that will support that essential message, it becomes rather easy to organise subsequent sections of the paper (Patients and Methods, Results, Discussion, and Conclusions) to exactly follow the organisation suggested by the objectives (using identical words each time). In this way, the manuscript stays focused, supporting material is highlighted, and triage of extraneous information is facilitated.

</div></details>

<details class="med-details"><summary>
  
#### Patients and Methods</summary><div class="details-content">

This section tells how the study was done and provides clues to the reader as to whether they should believe the results of the study. It is rarely read in its entirety, in part because readers assume that the peer‑review process has vetted the methods.

**Patients.** Both the Consolidated Standards of Reporting Trials (CONSORT) and Strengthening the Reporting of Observational Studies in Epidemiology (STROBE) statements, checklists, and diagrams are helpful for the entire manuscript but particularly for Patients and Methods. For example, a CONSORT‑style diagram starts with your broad inclusion criteria (group, inclusive dates, number of cases), enumerates independently, not sequentially, exclusion criteria, displays final total group and number, then any grouping of cases (e.g., mitral repair and mitral replacement if those are your comparator groups), with number of patients in each. Depending on your study design, this may be a straightforward diagram or may require more than one CONSORT diagram, or portions thereof, for a complex study (see Moore and colleagues). Another figure might be number of these procedures across time (and if a comparative study, percent of each group over time).

Having established the patient group, there is controversy as to whether one should describe the characteristics of the patients here or in the first part of Results. We take a classical stance, unlike the STROBE checklist, that reserves Results for the results of the objectives of the study, which are not these characteristics. As such, we follow what is generally done for laboratory studies that characterise the "Materials" under Methods rather than Results. Thus, in addition to inclusive dates and number of patients in all groups of interest, we recommend referring to "Table 1," which contains patient demographics, clinical condition at surgery (if a surgical paper), cardiac or thoracic disease and variables related to it (e.g., etiology, findings from imaging studies and other diagnostic modalities), cardiac or thoracic comorbidities, and noncardiac comorbidities organised generally by organ system, including related laboratory findings. It might also include preoperative patient‑reported outcomes and social determinants of health.

**Endpoints.** All endpoints of the study should be listed along with reproducible definitions. If the endpoints have been ascertained by follow‑up, provide details of how follow‑up was conducted, such as goodness of follow‑up (we find the event chart method particularly valuable as described by Goldman), and how many patients have been followed at various intervals, although these may be graphs in Results.

**Data.** List types of data gathered, particularly those most relevant to the study. State the IRB number and date of approval (this group may be called by other names, such as Research Ethics Board) and indicate what kind of patient consent was required or waived.

**Data Analysis.** Describe the software used and general statistics. However, we suggest that it is useful to organise statistical methods according to the stated objectives accompanied by references. It is not unusual for this to be accompanied by tables and figures, such as directed acyclic graphs of the investigative strategy or standardised difference graphs before and after propensity matching.

</div></details>

<details class="med-details"><summary>
  
#### Results</summary><div class="details-content">

This section answers the simple question, "For each objective, what was found?" This is the core—the lasting value—of the paper. Of necessity, it is rarely all the raw data. Rather, it is a selected, well‑digested summary that relates directly to each objective of the paper in the same order as in the Introduction (and uses the same words). It does not interpret the results of the study. It consists only of facts. It uses tables and figures to summarise and illustrate the results. It is an unfortunate fact that reviewers of manuscripts often suggest eliminating tables and figures as a first priority to shorten a paper. Instead, it is text that should be shortened (including placing detailed methods in electronic appendices). A temptation is to include in the text numerical data from tables. Instead, point out the interesting things the reader should see. As a writer you should have in mind (1) accuracy in reporting, (2) brevity, and (3) clarity.

As one reviews a draft of the Results, ask whether the data presented and their logical order convincingly support conclusions related to the objectives laid out at the end of the Introduction. Have you included measures of uncertainty based on the sample of cases? Do lack of support for some objectives merely reflect that the study was not adequately powered for that objective? Keep in mind that absence of "statistical significance" does not mean absence of a difference, as it is often interpreted.

</div></details>

<details class="med-details"><summary>
  
#### Discussion</summary><div class="details-content">

The Discussion tells the reader how the authors have interpreted the results, basically answering the "So what? Who cares?" questions. Here is a suggested outline for a Discussion:

- Brief summary of principal findings, organised by objectives
- Findings in context. Here there may be a series of subheadings, such as for each objective, that put results into context of work by others
- Limitations
- Conclusions (inferences, clinical recommendations) that are supported by the results presented, not a summary of results

The Discussion should be concise and focused. Interpretation should be reasonable (e.g., avoiding causal statements when only associations are established). Quotation of work by others should be accurate. Inferences should be supported by the data and speculations beyond that so identified. There should be no new results introduced. Promissory notes should be avoided.

</div></details>

<details class="med-details"><summary>
  
#### Submission</summary><div class="details-content">

Coupled with initial manuscript writing, a decision should be made regarding the appropriate audience, and therefore journal, for the paper. Generally, manuscripts of interest to a broad spectrum of medical professionals should be targeted to general medical journals, those that should be read by both cardiologists and cardiac surgeons should be targeted to general cardiologic journals, and those that should be read by cardiac surgeons should be targeted to cardiac surgical journals.

When the manuscript has been completed, one may be tempted to send it immediately to the targeted journal, but the quality of the manuscript may be improved by allowing it to sit on the shelf for a time. After a few weeks, review the manuscript afresh from beginning to end, along with comments that have been solicited from coauthors. By this time, three things have happened. First, you have distanced yourself just a bit from the manuscript and can see more clearly its possible deficiencies. Second, the passage of time has allowed your unconscious mind to work on the material, and by the time the manuscript is revisited, this process has provided further insights and clarity. Third, you have had the opportunity to present the material intramurally and have received valuable feedback. In other words, the work has matured. (In addition, the manuscript shelf provides the best possible resource of abstracts for upcoming scientific meetings.)

</div></details>

<details class="med-details"><summary>
  
#### Responding to Reviewers</summary><div class="details-content">

The next step is to respond to peer review of the manuscript. Some authors become despondent and never revise and return their paper. Others decide to send the original manuscript to another journal, ignoring the peer review, which is wasteful of reviewers’ time and expertise. Others respond defensively, making little change to the manuscript.

Instead, this important phase of generating new knowledge should be viewed as an essential exercise to improve the manuscript. Sometimes it will require performing new analyses or gathering additional information. If some point is confusing to a reviewer, and particularly if it is confusing to more than one reviewer, or if the reviewers have completely missed the point, clarity is needed. Rethink the purposes and structure the paper anew, move overly detailed material from text to appendices or supplemental material, construct new tables and simplify others, prepare more intuitive graphics, or state things more clearly and logically. The peer review process usually functions superbly to improve the quality of papers.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Scientific Presentations</summary><div class="details-content">

<details class="med-details"><summary>
  
#### Meeting Abstract</summary><div class="details-content">

The best possible preparation for writing and submitting a meeting abstract, and subsequently presenting the findings, is to already have completed a well‑crafted manuscript. There is no substitute for this. If it is not possible to complete all analyses and to prepare a manuscript, at least enough of this must be done so the essence of the findings is known, the purpose of the study is clear, and the conclusions are well supported.

It is common practice to use meeting abstract deadlines either to drive the research process or serve as a triage function for bouncing half‑formulated and partially analyzed data off abstract reviewers; if the paper is not accepted, the research is not pursued. This is not serious clinical research. It also represents a lack of understanding of the process whereby presentations are accepted for scientific meetings. For example, if there are two excellent abstracts submitted by two groups on the same subject, one may be taken and the other not; it would be a mistake for the submitter of the rejected abstract to conclude that the work is unworthy! A poor abstract may be the only abstract submitted on a subject that is deemed to be needed for a well‑rounded meeting, so it is accepted. An entire category of abstracts may be jettisoned because there is no room for it on the program. Other abstracts, because of the appealing way they are crafted, are accepted, but the work is of less than stellar quality when presented or reviewed as a manuscript.

A meeting abstract does not serve the same function as the abstract for a scientific paper. Its purpose is to get the work onto a program. Thus, crafting a meeting abstract is an art. The title must be eye‑catching. Such a title may not be appropriate for a manuscript, but it is the first thing the graders will see. Second, the purposes and conclusions of the abstract must be clear and must match one to one. The purposes and conclusions may be all that is read before the abstract is discarded! If there is a gripping title, clear and interesting purposes, and important conclusions, the abstract graders will read the methods and results sections. There is no sense in including detailed methods that are well known; instead, focus on those that (1) succinctly define the patient sample, (2) address each purpose, and (3) make the study novel or more valid than other work in the field. Results should highlight just those numeric findings that relate to the purposes. A well‑crafted table, or especially a seminal figure, often speaks louder than words and may constitute nearly the entire Results section. Importantly, the presentation can be almost entirely crafted from this abstract.

</div></details>

<details class="med-details"><summary>
  
#### Presentation</summary><div class="details-content">

**Preparation.** For a short 5‑ to 8‑minute presentation, one must know the intended audience. Is it a general audience for which medical jargon and abbreviations will not be understood, or is it a group of experts in your field who will be distracted by summary of well‑known introductory material?

**Text.** Before writing the text (which we recommend), clearly articulate the message you wish to convey to your audience. For a short talk, this will be two or three main points. Your talk should focus on these points and *nothing more*. Ideally, it will be divided with clear signposts (orally or visually) for each point.

What is generally not taught to presenters is that the audience will listen serially. No one in the audience can go back to review the material; there is no second chance to determine whether your progression of thought is logical or to study a table or figure in detail. The classic IMRD format for a scientific paper is not conducive to serial aural disclosure!

Elements of a good presentation are more akin to telling a good story than writing a good scientific paper. Like a good story, the presentation ideally has a gripping beginning and ending (think: "Once upon a time in a land far, far away there lived a beautiful princess and a handsome prince." Followed by frog, kissing the frog, etc., then at the end "...and they lived happily ever after."). In a scientific presentation, this may take the form of a clinical example, an echocardiogram, or an operative picture to capture the attention of the audience at the very beginning. At the end, one can come back to the clinical case and tell how the story ended. This serves as bookends. An even more effective "storyboard" is to weave the entire presentation around the case—work‑up, diagnostic information, clinical decision‑making with presentation of alternatives, data related to each of those alternatives, and what and why the procedure the patient underwent was chosen based on the data you have shown.

After the opening of the story, objectives of the study, inclusive dates and number of patients, and the operation or procedure performed are presented. This preamble to the story should be followed by segments, analogous to chapters of a storybook, that relate to each objective. Within each segment, present the rationale for the aim—a sentence—possibly brief methods, but mostly data presented if possible in the form of graphics rather than tables, followed by a concluding statement reflecting your interpretation of the data. In a short talk, there is no need to summarise the results at the end of the presentation, rather go right to your conclusions about each objective and end with your "bookend."

The temptation, which must be resisted, is to present methods following the statement of objectives. This violates the principle of serial listening: information must be presented "just in time," which is why we suggest it be woven into the segments, if necessary. Just as in a manuscript, you will also be tempted to make no conclusions, but rather just summarise the data. Instead, tell your audience how they can use the information in their practice in each segment before proceeding to the next.

![](_page_107_Figure_3.jpeg)

**FIGURE 7.54** Speech box page showing (1) Times New Roman, 20 point type; (2) each sentence written as an indented paragraph (½") with a full line of space between them; (3) words to emphasise underlined; and (4) an arrow in left margin showing the direction one slides the page into the lefthand side of the speech box (SCRIPTMASTER™).

Your presentation delivery should be semiconversational, with a balance between formal and casual styles. Above all, plainly emphasise the message you want to deliver by connecting with the audience through attitude, energy, and motions. Ways to engage the audience include introducing ideas in threes (I came, I saw, I conquered; the good, the bad, and the ugly), contrasting pairs, introducing anticipation, and using occasional pauses and repetition. We recommend that the text of a presentation be written in full, practised, and read. To aid this, for many years we and our students, residents, and fellows have used a Script‑Master speech box. It holds 8½" × 11" sheets of paper and has a short stepdown from the right‑hand compartment to the left so that pages slid to the left can fall neatly onto the pages that have already been read.

Format of the speech is also important and is illustrated in Fig. 7.54. The font is Times New Roman 20 point. Each sentence is written as an indented paragraph (½") with a full line of space between each sentence. Words (important or not) that either need emphasis, or a change in pace, or that may be hard to pronounce or trip you up, are underlined. There is an arrow in the left margin indicating the direction you must slide the page (usually when you are about halfway through a page).

This format can be seen in speeches by Presidents of the United States, such as the 1941 "Four Freedoms" speech by Franklin D. Roosevelt and Richard Nixon’s (thankfully unnecessary) speech of July 18, 1969, "In the Event of Moon Disaster." Importantly, by isolating each sentence, it tends to slow down the speaker (a good thing), and although it may seem awkward, you connect best with an audience if your eyes are up (on audience) at the beginning and ending of sentences and down (on the text) in the middle, which is facilitated by the single‑sentence‑as‑paragraph format.

**Visuals ("Slides").** The purpose of visuals accompanying a presentation is to emphasise and illustrate your ideas. They are not for entertainment or to provide supplemental material. They are not the talk.

Although visuals are a matter of taste, a few comments may be helpful for those who have never been taught the art of creating presentation slides, but rather follow the formats and styles generally seen in medical meetings.

Keep the slides plain with no distracting or extraneous material. Avoid textured backgrounds that distract listeners from your talk. Eliminate "cute" transitions from slide to slide. Simple graphs and figures are more effective than complex ones. Package one thought per slide. Avoid complete sentences and paragraphs on slides; references in tiny print cannot be seen.

Use as few "word slides" as possible. Those that are used are most effective if they have single‑line titles, three or fewer major heads, and only one subhead level. It is best to set a word slide format and stick to it rather than showing a haphazard mix of left‑justified and centred text starting at different spots on the slide. A consistent format reduces the work of the listener so that they can listen to you.

Visual order when first seeing a slide is top down, left to right, and clockwise. Thus, text and visuals should follow this order.

We recommend avoiding tables. Generally, only specific pieces of information on a table are useful. There are usually ways to present them as bar graphs or pie charts that are more readily digested.

From a practical standpoint, use a sans serif font of no less than 32‑point size so that slides are visible from the back of the auditorium.

**Question and Answer Period.** The question and answer period is part of your presentation, and you should be prepared for it. Your attitude should be that this is a final opportunity to get your message across. Richard Butterfield has provided a number of suggestions. Anticipate what questions the audience *should* have for you. Anticipate and prepare for possible questions. You don’t have to respond directly to the questions actually asked if they lead you away from your message; rather, rephrase the question to bring it back to your message. However, don’t be tempted to give a long rambling answer: Respond and stop. If a question catches you off guard, you might repeat the question or rephrase it to the way you want to answer it or pause and think, then answer deliberately and honestly. You can always admit that you don’t have an answer right now but then bring the conversation back to the message you are trying to convey. If questioners simply want to present their own experience, let them and then tie their experience into your message.

In many meetings there may be no questions. A well‑prepared moderator should have a question for you, but if not, you have been given an opportunity to drive home your message. So if there is silence, you might say, "You may be wondering..." or "A question I have been thinking about...." This in turn may stimulate someone in the audience to ask a question.

Finally, a questioner may be hostile or disagree with your message. You should correct any clear falsehood but then respond in noninflammatory terms. Stay on track with your message, use no sarcasm, and by all means, stick to the truth of your data while discussing limitations.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
## SECTION VII: SPECIAL METHODS AND CONTROVERSIES</summary><div class="details-content">

<details class="med-details"><summary>
  
### Causality</summary><div class="details-content">

Causality is one of the most essential concepts in clinical research. The acceptability of new interventions for practice is premised on underlying causal claims. Research strategies implicitly and explicitly assert causal claims and evaluate evidence in support (or against) those claims. Causality is also one of the most difficult and nuanced topics within the area of clinical research to understand, with philosophical underpinnings that span centuries and rapid methodologic development in recent times. Statistical perspectives on causality that rely on *counterfactual* comparisons—i.e., consideration of outcomes under alternative exposures or interventions for a single patient—have dominated the practice of clinical research, stemming in large part from R.A. Fisher’s introduction of randomised experiments in 1935. However, developments in causal inference methods have enabled more general representations of causal relationships and causal analysis of even nonrandomised (e.g., observational) data. In this section, we review predominant approaches to causal analysis and their underlying assumptions. Taken together, these approaches offer an expanded set of methodologic tools and new opportunities for understanding mechanisms in cardiac surgery research.

<details class="med-details"><summary>
  
#### Counterfactuals</summary><div class="details-content">

Consideration of single cause/effect relationships—for example, whether TAVR causes a reduction in 30‑day postoperative mortality compared with surgical aortic valve replacement (SAVR)—can be represented as a counterfactual problem in which it is of interest to determine, for each individual patient, the difference in *potential outcomes* of each treatment. In our example, the *individual treatment effect* reflects the probability of 30‑day postoperative mortality under TAVR minus the probability of 30‑day mortality under SAVR for a given patient (for simplicity, we assume that patients have complete ascertainment with no loss to follow‑up, such that mortality can be evaluated as a binary outcome variable). This quantity may vary from patient to patient and is, of course, not observable, because a given patient can only receive one of the two (or, more generally, any number of) therapies. In statistical terms, this presents a problem of *non‑identifiability*: The quantity of interest is not empirically observable.

</div></details>

<details class="med-details"><summary>
  
#### Confounding</summary><div class="details-content">

Fundamentally, individual treatment effects would be of direct interest for person‑centered clinical care, but as described earlier, these cannot be directly measured. The researcher is instead required to evaluate the presence and/or strength of a causal relationship *across* patients, using data in which patients receive only one therapy. When assignment of patients to therapies is correlated with the risk of experiencing the outcome, misattribution of an observed association between the assigned therapy and the outcome as a causal relationship can occur. In other words, evaluation of the relationship of interest is confounded by preferential assignment of patients to treatments based on perceived or measured baseline risk of the outcome (as a function of patient characteristics). Fisher’s solution to this problem was to impose a mechanism by which the outcome is statistically independent from (or uncorrelated with, as sample size increases) the treatment assignment mechanism, namely, randomisation. In other words, the distribution of the outcome among patients receiving each given therapy is unrelated to the values of any other characteristics (assuming a sufficiently large sample size), whether those characteristics are measured or unmeasured. These conditions enable the identification of population‑average treatment effects, which are (pairwise) differences in average outcome (e.g., probability of 30‑day mortality) between groups assigned to each therapy.

</div></details>

<details class="med-details"><summary>
  
#### Effect Modification</summary><div class="details-content">

Effect modification, which is also referred to as *moderation* or *heterogeneity in treatment effect* (HTE), is the phenomenon in which a causal relationship is dependent (or conditional) on one or more other factors. Conditional average treatment effects represent the difference in expected outcomes for given values of one or more effect‑modifying characteristics (or *contextualizers*). Choice of contextualizers is critical, and issues with confounding are more complex when conditioning estimates on these variables. Internal risk scoring approaches have been introduced as a means for simplifying the analysis of HTE and have been applied in reanalyses of data sets from several randomised clinical trials. In these analyses, there are two stages. First, a prediction model (internal risk model) is developed to characterise variation in the probability of the outcome as a function of a set of baseline risk factors (omitting the study intervention). Then, the predictions from this model are applied in a second stage to study the degree to which the treatment effect varies as a function of baseline risk. Generally, HTE is uncommon when considering relative effects of interventions (e.g., relative risk estimates) but more common when considering absolute effects (e.g., estimates of absolute risk reduction), which tend to be larger among those with higher levels of baseline risk of the outcome.

</div></details>

<details class="med-details"><summary>
  
#### Mediation</summary><div class="details-content">

Mediation is the phenomenon by which the causal effect of an intervention or exposure is at least partially explained by its effect on one or more intermediate variables (mediators), which in turn influence the outcome. The effect of aortic clamping on acute kidney injury in cardiac surgery, for example, may be mediated through several processes, including renal ischemia during placement and inflammation associated with the ischaemia‑reperfusion process after removal. Just as evaluation of a treatment effect in randomised trials requires pre‑specification of causal hypotheses (in that case, null and alternative hypotheses of causal effect), mediation is also a causal hypothesis that must be prespecified. Data analyses are then used to evaluate the evidence in support of (or against) the mediation hypotheses, and furthermore, to measure the proportion of the overall effect between the exposure and outcome that is accounted for via the mediation mechanism.

Traditional analyses of mediation have used the approach of Baron and Kenny, in which the goal is to establish *whether or not* a (third) variable mediates the relationship between the exposure and the outcome. This approach is relatively simple to implement and involves the following criteria: (1) there is an overall association between the exposure and the outcome (ignoring the potential mediator); (2) there is an association between the exposure and the potential mediator (ignoring the outcome); (3) there is an association between the mediator and the outcome after adjusting for the exposure; and finally (4) the strength of the exposure–outcome association weakens after adjusting for the mediator. If these four conditions are met, according to the method, then the investigator can conclude that a mediation effect exists.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### Social Determinants of Health</summary><div class="details-content">

Social status and socioeconomic position have been observed to be associated with health status and outcomes within and among populations for millennia and have been documented in writings from Ancient China, Greece, Egypt, and India. Ecologic, social, economic, cultural, and political environments have produced entrenched disparities in health and longevity that persist and are pervasive in current times. For example, the correlation between gross domestic product (GDP) per capita and life expectancy among countries is very strong. Life expectancy in sub‑Saharan mainland African countries with per capita GDP < 5000 USD ranged from 52.8 years (Central African Republic) to 67.7 years (Senegal) in 2018, while life expectancy in large, richer countries with per capita GDP > 50,000 USD ranged from 75.0 years (Saudi Arabia) to 84.6 years (Japan).

The same is true within larger, socioeconomically diverse countries such as the United States. In Cuyahoga County, Ohio, the census tract with the lowest life expectancy (65.4 years, based on 2010‑2015 US Centers for Disease Control and Prevention [CDC] data) is located in the Woodhill neighbourhood in the city of Cleveland, which is a predominately Black community affected by severe poverty and lack of resources (Fig. 7.55). The life expectancy observed among residents of this neighbourhood is comparable to that of Tanzania. This census tract is located just 1 mile (1.6 km) from the tract with the highest life expectancy in the county (at 88.6 years), which is in the affluent and educated suburb of Shaker Heights. This life expectancy is greater than that of Japan.

The CDC defines social determinants of health as the "conditions in the places where people live, learn, work, and play that affect a wide range of health and quality‑of life risks and outcomes." Understanding and explaining the underlying social, ecologic, cultural, economic, political, demographic, and psychological mechanisms by which these social determinants of health are responsible for producing health disparities are essential to influence policy and practice to address those disparities. Furthermore, it is essential to understand how such mechanisms organise and become biologically *embodied*, and how disease distributions across diverse populations are produced through them.

These mechanisms—and their biologic embodiment—are not simple but rather *complex*. They operate at multiple levels of organisation (e.g., within and among persons, families, neighbourhoods, communities, and policy environments) and at various stages over the life course and across generations. Furthermore, they interact, coevolve, and reinforce one another such that observed health disparities across a population are not readily explained by any single mechanism.

![](_page_108_Figure_2.jpeg)

**FIGURE 7.55** Census‑tract‑level life expectancy in Cleveland and Cuyahoga County, Ohio. Data: US Centers for Disease Control and Prevention’s United States Small‑Area Life Expectancy Estimates Project (USALEEP).

<details class="med-details"><summary>
  
#### Exile, Genocide, and Residential Segregation</summary><div class="details-content">

Many volumes tell the histories of forced relocation (or death) of social groups defined on the basis of religion, race, nationality, ethnicity, or other characteristics—either by means of warfare, genocide, or policy. As early as 745‑727 BC, King Tiglath‑Pileser III of Assyria exiled half of the population of his growing empire’s conquered lands to solidify Assyrian rule of those lands. Large‑scale and/or systematic attacks on social groups have continued throughout history, all with the goal of eliminating or spatially segregating groups. In more recent centuries, indigenous peoples, Jews, Blacks, and many other minority groups were murdered or victimised.

This history is necessary context for understanding racial and ethnic residential segregation in cities. Racial and ethnic residential segregation is prevalent worldwide, but is generally more severe in American cities than in other locations such as in Europe. In the United States, the Great Migration (ca. 1910‑1970) saw over 6 million Blacks move from the South to cities in the Northeast, Midwest, and West to escape racial violence, pursue opportunities for employment in industry, and obtain freedom from Jim Crow‑era laws in the South. Job opportunities became available during military mobilisation in World Wars I and II and thereafter as the US economy experienced large‑scale expansion in the 1950s and 1960s.

Racist and xenophobic housing policies and lending practices coincided with the Great Migration and were undergirded by major economic fluctuations that occurred over this period. During the Great Depression, there were more than 9000 bank failures due to many factors, including speculative overuse of credit on behalf of banks, lack of maintenance of reserve funds, massive loan defaults on behalf of both banks and their clients, and cascading divestments of accounts on behalf of both organisations and individuals. These failures and their corresponding policy response reached peak intensity in 1932‑1933, when the federal government passed a plethora of major banking reforms early in Franklin D. Roosevelt’s presidency (1933‑1945). These reforms included the Reconstruction Finance Corporation Act (1932), which provided federal financial stimulus to banks; the Emergency Banking Act (1933), which created the Federal Deposit Insurance Corporation and provided insurance protecting bank account balances from bank defaults; the Glass‑Steagall Act (1933), which separated fiduciary roles of commercial banking from investment banking; the Home Owners’ Loan Act (1933), which established the Home Owners’ Loan Corporation (HOLC); and the National Housing Act (1934), which created the Federal Housing Administration (FHA) and the Federal Savings and Loan Insurance Corporation.

The stated intent of the National Housing Act was to subsidise and guarantee (through the FHA) mortgages for borrowers at risk of default. However, implementation of the law occurred almost exclusively to the benefit of Whites and to the detriment of people of color and/or of ethnic backgrounds that were subject to discrimination. The HOLC and the FHA created maps to guide the practice of mortgage loan approvals, literally redlining districts in US cities in which it was determined that loans were of excessively high risk of default and therefore not amenable to federal loan insurance provided to banks (Fig. 7.56).

Redlined districts were predominately populated by low‑income racial and/or ethnic minorities. Options to obtain financing for housing were therefore severely limited for members of these populations, who could not obtain approvals for more expensive housing in nonredlined areas. Furthermore, the terms of the loans that they could access were exploitative, with excessive interest rates, no FHA mortgage insurance (due to being in redlined districts), and no equity accrued until the loan was fully paid.

If discriminative housing and lending practices were the wheels that set the locomotive of racial and ethnic residential segregation in the United States in motion, economic changes that occurred during the second wave of the Great Migration after World War II were the engine. Net migrations of Whites from cities to surrounding suburbs were supported by the introduction of wide‑scale automobile use, development of the US interstate highway system, and explosive increase in new home construction during the 1950s and 1960s. Adding to the complexity of the Great Migration was White Flight as Blacks moved into previously all‑White neighbourhoods (https://www.datacenterresearch.org/pre‑katrina/tertiary/white.html).

Growing advocacy by leaders and organisations (including Rev. Dr. Martin Luther King, Jr., the National Association for the Advancement of Colored People, the National Association of Real Estate Brokers, the GI Forum, and the National Committee Against Discrimination in Housing) on behalf of people affected by discriminative housing and lending practices in the 1960s led to the Fair Housing Act (1968). The Fair Housing Act was an amendment (Title VIII) of the Civil Rights Act (1964) and prohibited discrimination in housing practices based on race, ethnicity, religion, and other social or demographic factors. Although the Fair Housing Act banned certain overt forms of housing discrimination against racial and ethnic minorities, racial and ethnic residential segregation remains today due to the historical, systemic, and entrenched conditions that emerged from discriminative housing policies and was exacerbated by continued exploitative behaviour by those who provide access to housing as well as continued lack of investments, capacities, and resources in affected communities.

This provides necessary historical context for understanding the severe extent of neighbourhood‑level health disparities that exist today. Fig. 7.57 illustrates present‑day neighbourhood health and healthcare disparities in Cleveland and surrounding communities. The map closely resembles the redlining map in Fig. 7.56.

![](_page_109_Figure_10.jpeg)

**FIGURE 7.56** 1930s‑era redlining map of Cleveland, Ohio. (Source: Mapping Inequality: Redlining in New Deal America. https://dsl.richmond.edu/panorama/redlining. Accessed 2022‑12‑11.)

![](_page_110_Figure_2.jpeg)

**FIGURE 7.57** 2017‑2018 CDC Places estimates of the prevalence of cardiovascular risk factors (obesity, top left; current smoking, top right; insufficient sleep amount, bottom left) and health insurance coverage rates (bottom right) in Cleveland and Cuyahoga County, Ohio.

</div></details>

<details class="med-details"><summary>
  
#### Measuring Social Determinants of Health</summary><div class="details-content">

Social determinants of health are observable at micro‑ (e.g., within individuals, among family members or with friends, educators or peers); mezzo‑ (e.g., within academic, religious, professional or community institutions); and macroscales (e.g., within and among cultures, societies, policy environments, and/or geographical entities). Together, these factors create environments in which individuals’ lived experience is differentially influenced across their life course (aging effects), across generations (birth cohort effects), and at specific intersections in time (period effects).

The National Institute on Minority Health and Health Disparities recommends the use of standardised data collection protocols for measuring individual‑level and structural social determinants of health and provides the Phenotypes and Exposures (PhenX) toolkit for this purpose. The PhenX toolkit is a collection of survey question templates for documenting access to health services, health insurance coverage, health literacy, educational attainment, food insecurity, housing insecurity, gender identity, sexual orientation, English proficiency, current employment status, and other factors.

Health systems have largely only recently begun systematically measuring individual‑level and structural social determinants of health. Social needs screening questionnaires were developed in the 2010s and incorporated into electronic health records at scale beginning in 2019. The National Association of Community Health Centers, Association of Asian Pacific Community Health Organizations, and Oregon Primary Care Association created the Protocol for Responding to and Assessing Patients’ Assets, Risks, and Experiences (PRAPARE) guidelines for measuring individual social determinants of health and developed the PRAPARE screening tool. The American Academy of Family Practitioners created another social needs screening tool as part of their EveryONE project, which is available on their website. The US Centers for Medicare and Medicaid Services (CMS) also created the Accountable Health Communities Health‑Related Social Needs Screening Tool, which is similarly available for download from the CMS website.

Measurement of neighbourhood and other place‑based social determinants of health involves taking into account individuals’ geographic locations. This may include *geocoding* addresses of residence (i.e., the mapping of addresses to latitude and longitude coordinates and spatial referencing to geographical areas such as those provided by the US Census [or similar entities in other locales]). Area designations provided by the US Census are hierarchical and include state, county, census tract, census block group, and census block. Mail codes (such as US ZIP codes and ZIP code tabulation areas) can include populations over 100,000 in size and are therefore too crude a level of spatial resolution for expressing neighbourhood environments. For this purpose, the use of census tracts or, ideally, census block groups has been recommended over that of ZIP codes or ZIP code tabulation areas.

Neighbourhoods are characterised by social, built, economic, natural, chemical, and other environments. Social environments include factors such as levels of social support, structure and breadth of social networks, quality of schools, crime levels, perceived or experienced discrimination, social capital, social cohesion, and collective efficacy (the ability for neighbourhood members to effect change). Built environments include factors such as housing structure and quality, access to healthy foods, commercial and industrial structures, ambient noise, car use and dependence, public transportation, and broadband Internet connectivity. Economic factors include income, poverty status, income inequality, unemployment rates, numbers or percentages of workers with multiple jobs, numbers or percentages of households headed by a single parent, distributions of job classes among workers, and distributions of educational attainment. Natural factors include factors such as park access, green space, tree cover, water quality, walkability, presence of ecosystems, and natural borders (e.g., bodies of water, hills, valleys, or mountains). Chemical environments include factors such as lead contamination in water and house paint; concentrations of various compounds (fine particulate matter, carbon monoxide, sulfur dioxide, ozone, nitrogen dioxide) in the air, and presence of hazardous sites or brownfields.

There are many available public data sources for neighbourhood‑level social determinants of health. This includes several neighbourhood‑level indices of overall socioeconomic position (i.e., where a neighbourhood is placed in the distribution of social status, occupations, income, wealth, and education across society). Predominately, researchers use the Area Deprivation Index (ADI) of Singh, which has been adapted by researchers at the University of Wisconsin and which is available on the Neighbourhood Atlas website at the census block group and ZIP code levels. The ADI incorporates 17 measures of housing, income, income inequality, education, family structure, employment, and access to housing amenities. Another frequently used index of neighbourhood socioeconomic position is the US Centers for Disease Control and Prevention’s (CDC) Social Vulnerability Index (SVI). Developed initially for the purpose of disaster management, the SVI is defined at the census tract level and includes 16 indicators. An important distinction of the SVI is that it includes measures of racial and ethnic makeup; this precludes its use in studies where it is of interest to understand interactions between race, ethnicity, and neighbourhood socioeconomic position or evaluate potential mediation hypotheses in which racism and/or xenophobia is the cause of exposure to adverse neighbourhood environments, which in turn at least partially account for racial and/or ethnic differences in health outcomes.

These indices reference other place‑based data sources, and there are still other publicly available placed‑based data sources. Such sources include the US Department of Agriculture’s Economic Research Service (food access, natural resources); the US Environmental Protection Agency’s EnviroAtlas (ecosystems, pollution, built environments, natural boundaries) and National Air Toxics Assessment (air quality) databases; CDC Places (prevalence of health conditions, health behaviours, measures of preventive care utilisation and access); the National Aeronautics and Space Administration’s Earthdata platform (air quality); and many others. University‑based data platforms are also available (e.g., New York University’s City Health Dashboard).

</div></details>

<details class="med-details"><summary>
  
#### Scientific Approaches to Understanding Social Determinants of Health</summary><div class="details-content">

Research in fundamental social causes of health disparities was largely confined to those in social sciences and community health settings and relied on prospective, longitudinal cohort data sets that undersampled or were underpowered for inferences on racial and/or ethnic minority or socioeconomically disadvantaged populations. In cardiovascular prevention research, multiple prospective cohorts were combined to adapt atherosclerotic cardiovascular event risk equations to incorporate stratified relationships by race. Data on demographically and socioeconomically diverse patient populations have since become more widely available. This includes episodic data sources such as geocoded electronic health records as well as prospective observational cohorts (such as the NIH’s All of Us Research Program and the US Department of Health and Human Services’ Million Hearts Initiative).

When investigating diverse patient populations, whether using retrospectively or prospectively collected patient data, care must be taken to understand and account for misrepresentations resulting from imbalances between the distribution of socioeconomically or demographically defined groups available to the researcher and that of the underlying population. Recommended approaches include stratification and spatial analysis. Also, in spatial analyses, the way in which geographical units are defined can influence the conclusions about spatial variation derived from the analyses; this is known as the "modifiable areal unit problem." Recommended approaches to mitigating (to a degree) the effects of modifiable areal units on conclusions are to analyse areas with a high degree of spatial resolution (e.g., census block groups), although on the other hand data from small areas are more scant and therefore more vulnerable to fluctuations due to small sample sizes.

Descriptive studies that leverage place‑based measures of neighbourhood socioeconomic position are now widely conducted in various clinical settings. A common procedure for these studies is to geocode patients’ residential locations into census block groups, merge a composite area‑based socioeconomic position index (such as the ADI or SVI) with the geocoded patient data, and stratify (or use regression modelling to study) patient outcomes across categories (e.g., quintiles or deciles) of socioeconomic position.

Predictive studies might also incorporate social determinants of health, although it is critical for the investigator to consider the intended uses of such a clinical prediction model so as to avoid potential algorithmic bias against vulnerable groups. Specifically, thorough investigations into the appropriateness for clinical use of a model in which lower risk (and by extension, lower levels of care provision) is associated with patients from socially vulnerable groups compared with more affluent and/or resourced groups for a given set of clinical factors should be conducted.

Mechanistic studies involving social determinants of health are much more complex, for reasons stated earlier. Researchers are increasingly applying principles of complex systems science to represent, model, and simulate variation in health trajectories over time and place. Common types of systems modelling approaches used for this purpose include discrete event simulation (in which transitions among individual health states are modeled probabilistically), dynamic systems (in which multiple variables are modeled across a sequence of time points), and agent‑based models (in which attributes, behaviours, and interactions of multiple types of individuals are modeled). Combinations of these approaches to develop more complex simulation models are possible, for instance embedding a dynamic systems model forecasting heart failure onset, progression, treatment, and outcomes within a broader agent‑based model describing patterns of decision‑making among providers embedded in care practices.

</div></details>

<details class="med-details"><summary>
  
#### Causal Graphs</summary><div class="details-content">

The previous considerations lend themselves to a graph‑based conceptualisation of causality such as shown in the two directed acyclic graphs depicted in Fig. 7.58. Fig. 7.58A is focused on the influence of social determinants of health on post‑cardiac surgery outcomes, in particular race and ADI. In this study, the investigator has proposed how ADI may influence immunohematologic factors, cardiac and noncardiac comorbidities, body mass index, and, mediated through these factors, outcomes. Each line represents a testable hypothesis and substudies that may be done. Fig. 7.58B is focused on unbalanced atrioventricular septal defects, factors that may create them, and downstream effects on choice of repair pathway and outcomes. Although the factors hypothesised could be simply part of a multivariable analysis of outcomes, by drawing a causal graph, one could investigate the contribution of each factor or, at a minimum, present mechanistic hypotheses.

![](_page_112_Figure_9.jpeg)
![](_page_113_Figure_3.jpeg)

**FIGURE 7.58** Directed acyclic graphs (DAGs). (A) Investigation of effects of social determinants of health on development, treatment, and outcomes of aortic valve stenosis. (B) Investigation of the determinants and/or consequences of unbalanced atrioventricular septal defect. *ASD,* atrial septal defect; *AV,* aortic valve; *CoA,* coarctation of the aorta; *PAB,* pulmonary artery band; *VSD,* ventricular septal defect.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
## Appendices</summary><div class="details-content">

<details class="med-details"><summary>
  
### 7A Knowledge‑Generating Team</summary><div class="details-content">

Serious clinical research in cardiac surgery can be accomplished, no doubt, by the cardiac surgeon alone. Individual cases can be reported (case reports) with keen insight. Data can be entered and tallied with both simple calculators and user‑friendly statistical software.

More commonly, though, a surgeon or full‑time clinical investigator will be either the leader or medical expert of a research team. With the growing sophistication of data management and analytic tools, it becomes necessary to assemble a research group with varied roles and expertise, all focused on the goals of clinical investigation.

<details class="med-details"><summary>
  
##### Structure</summary><div class="details-content">

Regardless of whether the same individuals are involved, clinical research generally includes two fundamentally different activities: (1) continuous registry and database activity for quality reporting (see Box 7.1) and (2) individual clinical research activity. The *registry activity* involves gathering and entering data for a prescribed set of core data elements for every case. Until the advent of effective computer‑based patient record (CPR) systems in the form of values for variables (rather than narrative) that contain the life history of a patient, at least some portions of a registry or database will have to be abstracted manually from medical records (see "Computer‑based Patient Record" in Section II). *Individual clinical research activity* can be categorised roughly into two classes that require different skill sets: (1) clinical trials (either intramurally funded or extramurally sponsored by government or industry) and (2) studies of clinical experience (cohort studies).

</div></details>

<details class="med-details"><summary>
  
##### Roles</summary><div class="details-content">

<details class="med-details"><summary>
  
###### Surgeon‑Investigator</summary><div class="details-content">

The surgeon (clinical)‑investigator, with collaboration of key individuals in data management, statistics, and study coordination, must develop the clinical question (aims, objectives), define the study group of interest, identify variables and endpoints (outcomes) of interest, review the literature, and develop all elements of a study protocol (see "Technique for Successful Clinical Research" in Section I). They must adjudicate data quality, often gather values for variables in addition to the core data elements, help interpret the analyses performed, putting them into clinical context, present the findings to colleagues, and write manuscripts.

</div></details>

<details class="med-details"><summary>
  
###### Data Gatherers</summary><div class="details-content">

Persons skilled in data gathering for data entry fall into a hierarchy of individuals. For gathering some variables, expert medical domain knowledge as possessed by the surgeon or a knowledgeable research nurse is essential. Other data elements can be extracted by individuals with little formal training other than medical terminology. Essential ingredients are accuracy and integrity. Accuracy may be inborn and is indispensable; it can be assessed prospectively by testing and maintained by quality management and education.

</div></details>

<details class="med-details"><summary>
  
###### Education/Quality</summary><div class="details-content">

If large quantities of data are maintained, one or more individuals must assess the quality of the data and from these findings educate the data gatherers. Such individuals must have expert medical domain knowledge; for example, the surgeon or a research and education nurse. In large organisations, this role includes maintaining clinical documentation of the database, keeping current with new surgical trends, and pruning variables that no longer are of value or are of questionable quality.

</div></details>

<details class="med-details"><summary>
  
###### Data Manager</summary><div class="details-content">

There is no more key support person than the data manager. They are at the interface between data gathering and data analysis. Assembly of data for meaningful analysis is often complex, requiring information to be retrieved from a variety of electronic sources. Data managers usually need formal training in computer science and specifically in database construction and management. They must master an effective data query language.

Their most valuable skill, however, perhaps inborn rather than developed, is attention to the smallest detail of the data. Surgeons are usually not of the temperament for this kind of work, and statisticians by training are "big picture" oriented; if surgeons see the forest, data managers must see the trees. Thus, data management is not simply skill in formulating databases, writing and executing query logic, and documenting these in detail (although these are important); rather, it is skill in examining the actual data, finding errors in them, finding inconsistencies and deviation from the norm that should be verified, verifying what appear as outliers, and assessing quality of data for every variable.

The surgeon and data manager then together organise the variables in a way that is meaningful for analysis. If time‑related or longitudinal outcomes are being assessed, we recommend that the data manager become expert in forming intervals and assessing time‑related data (time zero, events, intervals), two of the most demanding and essential tasks for such analyses.

For larger clinical quality and research organisations, a member of the data management team is the statistical programmer, who must convert data from database format into analysis data sets that make sense to the statistician (see "Data Conversion for Analysis" under "Information to Data" in Section III).

</div></details>

<details class="med-details"><summary>
  
###### Statistician and Data Scientist</summary><div class="details-content">

Most serious clinical research efforts require equally serious collaboration with one or more statisticians. The applied statistician needs to become expert, facile, and experienced in many analytic methods. This chapter provides a compendium of such areas of expertise (see Sections IV and V): time‑related events analysis; binary, ordinal, and polytomous regression; longitudinal mixed‑model (hierarchical) data analysis; multivariable analysis; case‑matching analysis; cluster randomised trials; diagnostic accuracy; classification algorithms; and a variety of machine learning methods, to name a few. Supporting such applied efforts must be ongoing methodologic research. Many studies, perhaps most, use analytic methods that answer specific questions, but the questions answered may not precisely match the ones that are medically relevant (because of assumptions or lack of more appropriate methods). Encountering these difficulties should stimulate development of more appropriate methodology.

The most recent spin‑off of statistics, data management, and information and computer science is the data scientist. Data science is the name proposed in 1974 by Danish computer science Turing award winner Peter Naur. He defined the field simply as the science of data and traced its predecessor to Tukey, who noted that "data analysis is intrinsically an empirical science." Data science has been described as an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract or extrapolate knowledge and insights from noisy, structured, and unstructured data. Efron and Hastie place data science into a temporal framework that starts with applications of the 19th century, mathematical and logical justification of statistical methods culminating in the 1950s, and computational methods for empirical inference with emphasis on "algorithmic processing of large data sets for the extraction of useful information, with the prediction algorithms as exemplars" without "parametric probability models or formal inference."

</div></details>

<details class="med-details"><summary>
  
###### Other Professionals</summary><div class="details-content">

Other professionals that may be part of a team, depending on the nature of the surgeon’s research interests, include mathematicians (who develop mathematical models that attempt to capture known mechanistic relations within the data, in contrast to the statistician, who takes a more empiric approach), computer scientists (e.g., those in bioinformatics, computational biology, data mining, or algorithmic data analysis), human factors psychologists (for investigation of human error), ontologists (who maintain the meaning of data), experts in artificial intelligence, and many others. Indispensable are the editor and/or editorial assistant, who help with manuscript preparation, ensure proper grammar and style and that journal style requirements are met, manage references, and often handle post‑submission communication with publishers.

</div></details>

<details class="med-details"><summary>
  
###### Infrastructure</summary><div class="details-content">

Some individuals are shared by several groups. They maintain computer networks, computers, and software, enter and verify data, perform patient follow‑up, do financial analysis, write grants, produce medical illustrations or computer graphics, and engage in many other support roles.

It may be more comfortable and convenient for the surgeon to have a single point of contact among these individuals. However, today it is a collaborative team with a multitude of skills that is often needed, with data flowing progressively (often iteratively) from the information through analysis phases, forcing the surgeon to leave comfort and convenience behind and become immersed in a multidisciplinary and even transdisciplinary effort!

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>
  
### 7B Equations for Calculating Evident Differences</summary><div class="details-content">

<details class="med-details"><summary>
  
#### Nonoverlapping Confidence Limits</summary><div class="details-content">

To find the point at which the effect of a variable is evident using nonoverlapping CLs, consider a simple linear relationship between effect *x* and outcome *z*:

$$z = \beta_0 + \beta_1 x_1 \quad (7B-1)$$

where coefficients β₀, the intercept, and β₁, the slope, are determined from a regression analysis (see Box 7.17). The first requisite is to select a reference value of x; call it x₁. The object is to find a different x, call it x₂, at and beyond which the effect is evident—that is, different from that at x₁.

The CLs for z at x₁, calculated from the variance of z, Var[z(x₁)], and a confidence coefficient transformed to an appropriate t (e.g., t = 1 for 68.3% CL), are calculated as follows:

$$\text{Var}[z(x_1)] = V_0 + V_1 x_1^2 + 2\text{Cov}_{0,1} x_1 \quad (7B-2)$$

and

$$\text{CL}[z(x_1)] = z(x_1) \pm t\sqrt{\text{Var}[z(x_1)]} \quad (7B-3)$$

where V₀ and V₁ are the variances of β₀ and β₁ (variance being the square of the standard deviation, SD), and Cov₀,₁ is the covariance term between β₀ and β₁ (Cov₀,₁ is related to the correlation r between β₀ and β₁ by the expression SD₀·SD₁·r). The CLs of the unknown x₂ are given by Appendix Equations 7B‑2 and 7B‑3, with x₂ substituted for x₁.

Because CLs of z(x₂) must exactly equal either the upper or lower CLs of z(x₁), we can write, using Equations 7B‑2 and 7B‑3:

$$\text{CL}[z(x_1)] = \text{CL}[z(x_2)] = z(x_2) \pm t\sqrt{\text{Var}[z(x_2)]} \quad (7B-4)$$

or

$$\text{CL}[z(x_1)] = \beta_0 + \beta_1 x_2 \pm t\sqrt{V_0 + V_1 x_2^2 + 2\text{Cov}_{0,2} x_2} \quad (7B-5)$$

The only unknown in Equation 7B‑5 is x₂, which, in this case, can be found using the general solution for roots of a quadratic equation. For uncomplicated situations that reduce to Equation 7B‑5, the four roots (two each for the ± expression) can be calculated using a handheld calculator program. Two of the roots will simply yield x₁. Which of the other two roots is the desired x₂ is easily selected by inspection. For more complex multivariable cases, the equation must be solved for explicit values of all variables except x₂; thus, even a complex set of coefficients often can be reduced to the form of Equation 7B‑5. However, if higher‑order terms in x (higher powers) are involved, it is probably easier to solve the equation using an iterative method for solving nonlinear equations.

</div></details>

<details class="med-details"><summary>
  
#### P Values</summary><div class="details-content">

If, instead of (or in addition to) determining an evident difference using nonoverlapping CLs, one wishes to detect an evident difference at some level of significance (P value), then Equations 7B‑1 and 7B‑2 are used to define z(x₁), z(x₂), Var[z(x₁)], and Var[z(x₂)]. Then the general equation for a test of significance is used:

$$t = \frac{z(x_1) - z(x_2)}{\sqrt{\text{Var}[z(x_1)] + \text{Var}[z(x_2)]}} \quad (7B-6)$$

where t is the number of standard deviations represented by the selected significance level (P value). Expanding Equation 7B‑6:

$$t = \frac{z(x_1) - (\beta_0 + \beta_1 x_2)}{\sqrt{\text{Var}[z(x_1)] + (V_0 + V_1 x_2^2 + 2\text{Cov}_{0,1} x_2)}} \quad (7B-7)$$

yields an equation with only one unknown, x₂. In the simplest cases, Equation 7B‑7 can be solved using a solution for roots of a quadratic equation. Higher‑order terms of x require use of iterative methods.

Note that if Equation 7B‑2 represents a logistic equation, solving for evident differences is performed in the logit domain, not the probability domain. Similarly, if time‑related evident differences are desired, calculations are performed in the domain in which estimation of the parameters is performed.

</div></details>

</div></details>

<details class="med-details"><summary>
  
### 7C Neutralization of Incremental Risk Factors</summary><div class="details-content">

Multivariable analysis (see Box 7.16) can be used to discover if an incremental risk factor has been neutralised with experience (see "Incremental Risk Factor Concept" in Section IV). Date of operation (expressed on a "continuous" scale from, for example, the beginning of a programme or beginning of a calendar year) is multiplied by the risk factor to form a new variable, called an *interaction term*, and the risk factor, date of operation (both called *main effects*), and interaction term are forced into the multivariable model. If a risk factor has been completely neutralised, the magnitude of the interaction term should have a sign opposite that of the main effect and be of equal magnitude.

Besides complete neutralisation of a risk factor, risk factors may be partially neutralised. This may be documented by observing over time, for example, a decreasing strength of a risk factor. Risk factors may also be neutralised effectively by an overall change in risk, recognised by a decrease in the intercept without change in magnitude of risk factors.

<details class="med-details"><summary>
  
#### Interaction</summary><div class="details-content">

A note on *interaction terms* and their interpretation in general is in order. Interaction can be found between factors x₁ and x₂ in the following ways, particularly if one (say x₂) is dichotomous:

- x₁, x₂, x₁·x₂
- x₁, x₁·x₂, x₁·(1‑x₂)
- x₁, 1‑x₂, x₁·(1‑x₂)

Note that the interaction term is the one that multiplies one x by another. Depending on the signs and magnitude of these factors, they provide equivalent model fit but different insights. Specifically, they may identify possible neutralisation of an effect. In another setting, they examine the relation when a factor is present, and the same relation when it is not. Finally, the increment of risk from interaction can be quantified. Thus, simply multiplying two factors should not be done blindly but in several ways to explore each aspect of interaction.

</div></details>

</div></details>

</div></details>
