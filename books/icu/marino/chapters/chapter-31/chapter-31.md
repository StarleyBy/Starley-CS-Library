# Acid-Base Analysis

> *Seek simplicity, and distrust it.*
> 
> — Alfred North Whitehead

Mastery of acid-base physiology and pathology is a foundational competency in critical care medicine. In the intensive care unit, acid-base derangements rarely occur in isolation; rather, multiple primary disruptions frequently coexist, reflecting complex multiorgan dysfunction. 

This chapter presents a systematic, rule-based approach to deciphering primary, secondary, and mixed acid-base disorders using the core relationships between arterial pH, $\text{PaCO}_2$, and plasma bicarbonate ($\text{HCO}_3^-$). Subsequent sections examine the diagnostic application of the anion gap, albumin correction, the delta gap, and the serum osmolal gap.

<details class="med-details" open><summary>

## Executive Summary</summary><div class="details-content">

- **Hydrogen Ion Concentration vs. pH:** Normal plasma $\text{pH} = 7.40$ corresponds to a free hydrogen ion concentration $[\text{H}^+]$ of $40\text{ nEq/L}$ ($10^{-9}\text{ Eq/L}$), making $\text{H}^+$ a million-fold less concentrated than sodium or chloride. Due to the logarithmic scale, a drop in pH produces far larger shifts in $[\text{H}^+]$ in the acidotic range (60 nEq/L change between pH 7.40 and 7.00) than in the alkalotic range (24 nEq/L change between pH 7.40 and 7.80).
- **Kassirer-Bleich Relationship:** Extracellular $[\text{H}^+]$ is determined by the balance between $\text{PaCO}_2$ and $\text{HCO}_3^-$: $[\text{H}^+] = 24 \times (\text{PaCO}_2 / \text{HCO}_3^-)$. Primary respiratory disorders are initiated by $\text{PaCO}_2$ changes; primary metabolic disorders are initiated by $\text{HCO}_3^-$ changes.
- **Rules of Compensation:** Physiological compensation limits, but never fully normalizes, the pH shift of the primary disorder. In metabolic acidosis, expected $\text{PaCO}_2 = 40 - [1.2 \times (24 - \text{HCO}_3^-)]$. In metabolic alkalosis, expected $\text{PaCO}_2 = 40 + [0.7 \times (\text{HCO}_3^- - 24)]$.
- **Acute vs. Chronic Respiratory Compensation:** Renal $\text{HCO}_3^-$ reabsorption takes 48–72 hours to achieve steady-state. For each $10\text{ mm Hg}$ rise in $\text{PaCO}_2$, plasma $\text{HCO}_3^-$ rises by only $1\text{ mEq/L}$ in acute respiratory acidosis, but by $4\text{ mEq/L}$ in chronic respiratory acidosis.
- **The Serum Anion Gap (AG):** Calculated as $[\text{Na}^+] - ([\text{Cl}^-] + [\text{HCO}_3^-])$. Normal reference range is 8–12 mEq/L. Albumin accounts for the majority of unmeasured anions ($2.5\text{ mEq/L}$ per g/dL of albumin).
- **Albumin Correction:** In hypoalbuminemic critically ill patients, calculate corrected $\text{AG} = \text{AG} + [2.5 \times (4.5 - \text{Albumin in g/dL})]$ to prevent missing occult high anion gap acidosis.
- **Occult High-Gap Pathologies:** D-lactic acidosis in short bowel syndrome and pyroglutamic acid (5-oxoproline) acidosis from chronic paracetamol/acetaminophen ingestion present with high AG metabolic acidosis and normal standard L-lactate levels.
- **The Delta Gap ($\Delta\text{AG} / \Delta\text{HCO}_3^-$):** In high anion gap acidosis, the ratio $(\text{AG} - 12) / (24 - \text{HCO}_3^-)$ identifies mixed metabolic disorders. A ratio $< 1.0$ indicates coexisting hyperchloremic (normal gap) acidosis (e.g., massive saline resuscitation in DKA); a ratio $> 1.0$ signals concurrent metabolic alkalosis.
- **The Serum Osmolal Gap:** Measured osmolality minus calculated osmolality ($2[\text{Na}^+] + \text{Glucose}/18 + \text{BUN}/2.8$). An elevated osmolal gap ($> 10\text{ mOsm/kg H}_2\text{O}$) unmasks low-molecular-weight exogenous toxins (methanol, ethylene glycol, propylene glycol).
</div></details>

<details class="med-details" open><summary>

## Basic Concepts of Acid-Base Balance</summary><div class="details-content">

### Hydrogen Ion Concentration and pH

The free hydrogen ion concentration $[\text{H}^+]$ in aqueous solutions is traditionally expressed as pH, defined as the negative logarithm of hydrogen ion activity:

$$\text{pH} = \log\left(\frac{1}{[\text{H}^+]}\right) = -\log[\text{H}^+] \tag{31.1}$$

The physiological spectrum of pH and its corresponding $[\text{H}^+]$ is illustrated in Figure 31.1. Normal extracellular arterial pH of 7.40 corresponds to a free $[\text{H}^+]$ of $40\text{ nEq/L}$.

![Figure 31.1](images/_page_1_Figure_1.jpeg)

**FIGURE 31.1** Relationship between extracellular (plasma) pH and hydrogen ion concentration. Notice the non-linear relationship: a unit change in pH represents a far greater shift in $[\text{H}^+]$ in the acidemic range than in the alkalemic range.

Because pH is logarithmic, equal decrements in pH reflect vastly unequal increments in $[\text{H}^+]$:
- Moving from pH 7.40 ($40\text{ nEq/L}$) to pH 7.00 ($100\text{ nEq/L}$) represents an increase of $60\text{ nEq/L}$.
- Moving from pH 7.40 ($40\text{ nEq/L}$) to pH 7.80 ($16\text{ nEq/L}$) represents a decrease of only $24\text{ nEq/L}$.

### Hydrogen Ion as a Trace Element

Extracellular $[\text{H}^+]$ is measured in nanoequivalents per liter ($10^{-9}\text{ Eq/L}$). Because 1 nanoequivalent is one-millionth of a milliequivalent ($1\text{ nEq} = 10^{-6}\text{ mEq}$), hydrogen ions circulate at concentrations a million times lower than sodium ($140\text{ mEq/L}$) or chloride ($102\text{ mEq/L}$). Despite being a chemical trace element, $[\text{H}^+]$ exerts profound catalytic control over enzymatic conformation, cellular membrane proteins, and systemic vascular tone.

### The Kassirer-Bleich Formulation

According to traditional acid-base chemistry, $[\text{H}^+]$ is determined by the equilibrium ratio of carbon dioxide to bicarbonate:

$$[\text{H}^+] = 24 \times \left(\frac{\text{PaCO}_2}{\text{HCO}_3^-}\right) \tag{31.2}$$

where $[\text{H}^+]$ is expressed in nEq/L, $\text{PaCO}_2$ in mm Hg, and $\text{HCO}_3^-$ in mEq/L. The ratio $\text{PaCO}_2 / \text{HCO}_3^-$ classifies all primary acid-base disturbances and their expected secondary compensatory responses (Table 31.1).

### TABLE 31.1 Primary Acid-Base Disorders and Compensatory Responses

| Primary Disorder | Primary Abnormality | Secondary Compensatory Response |
| :--- | :---: | :---: |
| **Respiratory Acidosis** | $\uparrow \text{PaCO}_2$ | $\uparrow \text{HCO}_3^-$ (Renal conservation) |
| **Respiratory Alkalosis** | $\downarrow \text{PaCO}_2$ | $\downarrow \text{HCO}_3^-$ (Renal excretion) |
| **Metabolic Acidosis** | $\downarrow \text{HCO}_3^-$ | $\downarrow \text{PaCO}_2$ (Alveolar hyperventilation) |
| **Metabolic Alkalosis** | $\uparrow \text{HCO}_3^-$ | $\uparrow \text{PaCO}_2$ (Alveolar hypoventilation) |

A primary disturbance initiated by $\text{PaCO}_2$ is defined as *respiratory*; a primary disturbance initiated by $\text{HCO}_3^-$ is defined as *metabolic*.
</div></details>

<details class="med-details" open><summary>

## Compensatory Secondary Responses</summary><div class="details-content">

Compensatory responses operate to return the $\text{PaCO}_2 / \text{HCO}_3^-$ ratio toward 40/24 (1.67) by driving the non-primary variable in the same numerical direction. Compensatory responses limit, but **never completely return pH to 7.40**. Overcompensation does not occur in human physiology. Predictive equations for evaluating secondary responses are summarized in Figure 31.2.

![Figure 31.2](images/_page_3_Figure_0.jpeg)

**FIGURE 31.2** Predictive equations for evaluating expected secondary physiological responses to primary acid-base disorders.

### Respiratory Compensation for Metabolic Disorders

Metabolic disorders trigger rapid respiratory compensation mediated by carotid body chemoreceptors sensing arterial $[\text{H}^+]$, initiating ventilatory shifts within 30–120 minutes.

#### Metabolic Acidosis

Carotid chemoreceptor stimulation increases alveolar minute ventilation, driving down $\text{PaCO}_2$. The magnitude of expected respiratory compensation is:

$$\Delta\text{PaCO}_2 = 1.2 \times \Delta\text{HCO}_3^- \tag{31.3}$$

$$\text{Expected PaCO}_2 = 40 - [1.2 \times (24 - \text{measured HCO}_3^-)] \tag{31.4}$$

##### Clinical Example and Interpretation

*Clinical Example:* A patient with diabetic ketoacidosis presents with $\text{HCO}_3^- = 14\text{ mEq/L}$:
1. $\Delta\text{HCO}_3^- = 24 - 14 = 10\text{ mEq/L}$.
2. Expected $\Delta\text{PaCO}_2 = 1.2 \times 10 = 12\text{ mm Hg}$.
3. Expected $\text{PaCO}_2 = 40 - 12 = 28\text{ mm Hg}$.
   - If measured $\text{PaCO}_2 > 28\text{ mm Hg}$, an additional respiratory acidosis is present.
   - If measured $\text{PaCO}_2 < 28\text{ mm Hg}$, an additional respiratory alkalosis is present.

#### Metabolic Alkalosis

Alkalemia depresses peripheral chemoreceptor firing, reducing alveolar ventilation and elevating $\text{PaCO}_2$. This response is less pronounced because hypoventilation is constrained by hypoxemic ventilatory drive:

$$\Delta\text{PaCO}_2 = 0.7 \times \Delta\text{HCO}_3^- \tag{31.5}$$

$$\text{Expected PaCO}_2 = 40 + [0.7 \times (\text{measured HCO}_3^- - 24)] \tag{31.6}$$

##### Clinical Example and Interpretation

*Clinical Example:* A patient on high-dose loop diuretics presents with $\text{HCO}_3^- = 40\text{ mEq/L}$:
1. $\Delta\text{HCO}_3^- = 40 - 24 = 16\text{ mEq/L}$.
2. Expected $\Delta\text{PaCO}_2 = 0.7 \times 16 = 11.2\text{ mm Hg}$ ($\sim 11\text{ mm Hg}$).
3. Expected $\text{PaCO}_2 = 40 + 11 = 51\text{ mm Hg}$.

### Renal Compensation for Respiratory Disorders

Compensatory responses to primary alterations in $\text{PaCO}_2$ occur via renal proximal tubular reabsorption and distal generation of $\text{HCO}_3^-$. The renal response requires 48 to 72 hours to reach full physiological adaptation, dividing respiratory disorders into acute and chronic phases.

#### Acute Respiratory Disorders

Acute shifts in $\text{PaCO}_2$ alter plasma $\text{HCO}_3^-$ solely via mass-action chemical titration within red blood cells and tissue buffers:

- **Acute Respiratory Acidosis:**

$$\Delta\text{HCO}_3^- = 0.1 \times \Delta\text{PaCO}_2 \tag{31.7}$$

- **Acute Respiratory Alkalosis:**

$$\Delta\text{HCO}_3^- = 0.2 \times \Delta\text{PaCO}_2 \tag{31.8}$$

For an acute $20\text{ mm Hg}$ rise in $\text{PaCO}_2$ (to 60 mm Hg), expected $\text{HCO}_3^-$ rises by only $2\text{ mEq/L}$ (from 24 to 26 mEq/L).

#### Chronic (Compensated) Respiratory Disorders

Once renal tubular remodeling is complete ($\geq 48\text{–}72\text{ hours}$), the magnitude of renal $\text{HCO}_3^-$ compensation increases four-fold:

$$\Delta\text{HCO}_3^- = 0.4 \times \Delta\text{PaCO}_2 \tag{31.9}$$

- **Chronic Respiratory Acidosis:**

$$\text{Expected HCO}_3^- = 24 + [0.4 \times (\text{current PaCO}_2 - 40)] \tag{31.10}$$

- **Chronic Respiratory Alkalosis:**

$$\text{Expected HCO}_3^- = 24 - [0.4 \times (40 - \text{current PaCO}_2)] \tag{31.11}$$

*Clinical Example:* In chronic stable COPD with $\text{PaCO}_2 = 60\text{ mm Hg}$ ($\Delta\text{PaCO}_2 = 20\text{ mm Hg}$):
1. Expected $\Delta\text{HCO}_3^- = 0.4 \times 20 = 8\text{ mEq/L}$.
2. Expected $\text{HCO}_3^- = 24 + 8 = 32\text{ mEq/L}$.
</div></details>

<details class="med-details" open><summary>

## Structured Stepwise Approach to Acid-Base Analysis</summary><div class="details-content">

Clinical acid-base analysis requires a disciplined, three-stage diagnostic algorithm based upon the standard arterial reference ranges:
- **Arterial pH:** 7.36–7.44
- **$\text{PaCO}_2$:** 36–44 mm Hg
- **$\text{HCO}_3^-$:** 22–26 mEq/L

### Stage I: Identification of the Primary Disorder

Examine the direction of deviation of arterial pH and $\text{PaCO}_2$:

- **Rule 1a (Same Direction = Metabolic):** If pH and $\text{PaCO}_2$ deviate in the same direction, a primary metabolic disorder is present. Low pH with low $\text{PaCO}_2$ represents primary metabolic acidosis. High pH with high $\text{PaCO}_2$ represents primary metabolic alkalosis.
- **Rule 1b (Opposite Direction = Respiratory):** If pH and $\text{PaCO}_2$ deviate in opposite directions, a primary respiratory disorder is present. Low pH with high $\text{PaCO}_2$ represents primary respiratory acidosis. High pH with low $\text{PaCO}_2$ represents primary respiratory alkalosis.
- **Rule 2 (Normal pH with Abnormal $\text{PaCO}_2$ = Mixed Disorder):** When $\text{PaCO}_2$ is distinctly abnormal but pH remains within normal limits (7.36–7.44), a mixed respiratory and metabolic disorder is present. The direction of $\text{PaCO}_2$ defines the respiratory component, while the metabolic disorder operates in the opposing direction.

### Stage II: Detection of Secondary Acid-Base Disorders

Calculate expected physiological compensation using Equations 31.3 through 31.11:

- **Rule 3 (In Primary Metabolic Acidosis):** Compare measured $\text{PaCO}_2$ to expected $\text{PaCO}_2 = 40 - [1.2 \times (24 - \text{HCO}_3^-)]$.
  - Measured $\text{PaCO}_2 > \text{Expected}$: Coexisting secondary respiratory acidosis.
  - Measured $\text{PaCO}_2 < \text{Expected}$: Coexisting secondary respiratory alkalosis.
- **Rule 4 (In Primary Respiratory Disorders):** Determine expected $\text{HCO}_3^-$ for both acute and chronic states.
  - In respiratory acidosis: Measured $\text{HCO}_3^- < \text{Expected}_{\text{acute}}$ signals coexisting metabolic acidosis; measured $\text{HCO}_3^- > \text{Expected}_{\text{chronic}}$ signals coexisting metabolic alkalosis.
  - In respiratory alkalosis: Measured $\text{HCO}_3^- > \text{Expected}_{\text{acute}}$ signals coexisting metabolic alkalosis; measured $\text{HCO}_3^- < \text{Expected}_{\text{chronic}}$ signals coexisting metabolic acidosis.

### Stage III: Diagnostic Evaluation of Metabolic Acidosis

Whenever a metabolic acidosis is identified, calculate the serum anion gap, corrected anion gap, delta gap, and osmolal gap.
</div></details>

<details class="med-details" open><summary>

## Diagnostic Gaps in Metabolic Acidosis</summary><div class="details-content">

### The Principle of Electroneutrality

Electroneutrality dictates that total serum cation charges strictly equal total anion charges:

$$[\text{Na}^+] + \text{Unmeasured Cations (UC)} = ([\text{Cl}^-] + [\text{HCO}_3^-]) + \text{Unmeasured Anions (UA)} \tag{31.12}$$

#### Definition of Serum Anion Gap

Rearranging gives the clinical definition of the serum anion gap (AG):

$$\text{AG} = [\text{Na}^+] - ([\text{Cl}^-] + [\text{HCO}_3^-]) = \text{UA} - \text{UC} \tag{31.13}$$

### Determinants of the Anion Gap

The unmeasured ions establishing the normal anion gap are detailed in Table 31.2. The baseline reference range is 8–12 mEq/L.

### TABLE 31.2 Determinants of the Serum Anion Gap

| Unmeasured Anions (UA) | Concentration (mEq/L) | Unmeasured Cations (UC) | Concentration (mEq/L) |
| :--- | :---: | :--- | :---: |
| **Albumin** | **15** | **Calcium** ($\text{Ca}^{2+}$) | 5 |
| **Organic Acids** | 5 | **Potassium** ($\text{K}^+$) | 4.5 |
| **Phosphate** | 2 | **Magnesium** ($\text{Mg}^{2+}$) | 1.5 |
| **Sulfate** | 1 | | |
| **Total UA** | **23 mEq/L** | **Total UC** | **11 mEq/L** |

$$\text{Baseline Anion Gap} = \text{Total UA} - \text{Total UC} = 23 - 11 = 12\text{ mEq/L}$$

### Albumin Correction Formula

Serum albumin is the predominant unmeasured anion, providing roughly 2.5 mEq of negative charge per gram of albumin. In hypoalbuminemia (prevalent in up to 90% of ICU patients), the baseline anion gap falls significantly, which can mask life-threatening lactic acidosis or toxic ingestions. 

#### Calculation Formula

Calculate the corrected anion gap ($\text{AG}_c$):

$$\text{AG}_c = \text{AG} + [2.5 \times (4.5 - \text{Albumin in g/dL})] \tag{31.15}$$

#### Clinical Case Illustration

*Clinical Example:* An ICU patient with septic shock has measured $\text{Na}^+ = 138$, $\text{Cl}^- = 104$, $\text{HCO}_3^- = 22\text{ mEq/L}$ (calculated $\text{AG} = 12\text{ mEq/L}$, apparently normal) and serum $\text{albumin} = 1.5\text{ g/dL}$:

$$\text{AG}_c = 12 + [2.5 \times (4.5 - 1.5)] = 12 + 7.5 = 19.5\text{ mEq/L}$$

The corrected anion gap unmasks an occult high anion gap acidosis.

### Differential Diagnosis of Metabolic Acidosis

Metabolic acidoses are segregated into high anion gap and normal anion gap (hyperchloremic) categories (Table 31.3).

### TABLE 31.3 Etiology of Metabolic Acidosis Based on the Anion Gap

| High Anion Gap Metabolic Acidosis | Normal Anion Gap (Hyperchloremic) Acidosis |
| :--- | :--- |
| • L-Lactic Acidosis (Type A shock, Type B toxins)<br>• D-Lactic Acidosis (Short bowel syndrome)<br>• Ketoacidosis (Diabetic, Alcoholic, Starvation)<br>• Toxic Alcohols (Methanol $\rightarrow$ Formic, Ethylene Glycol $\rightarrow$ Oxalic)<br>• Salicylate Poisoning<br>• Pyroglutamic Acid / 5-Oxoproline (Paracetamol)<br>• Advanced Uremic Renal Failure (Sulfate, Phosphate) | • Severe Diarrhea (Gastrointestinal bicarbonate loss)<br>• Rapid Isotonic Saline Resuscitation (0.9% NaCl)<br>• Early Renal Insufficiency<br>• Renal Tubular Acidosis (Types 1, 2, and 4)<br>• Carbonic Anhydrase Inhibitors (Acetazolamide)<br>• Ureteroenterostomy |

#### Occult High Anion Gap Pathologies

- **D-Lactic Acidosis:** Mammalian tissues produce and measure L-lactate. In patients with short bowel syndrome or jejunoileal bypass, colonic bacterial overgrowth metabolizes unabsorbed carbohydrates into D-lactate. Standard clinical laboratory assays do not detect D-lactate, resulting in an unexplained high anion gap encephalopathy (ataxia, slurred speech, confusion).
- **Pyroglutamic Acid (5-Oxoproline):** Occurs in critically ill, malnourished, or septic patients receiving chronic therapeutic acetaminophen. Glutathione depletion disrupts the $\gamma$-glutamyl cycle, provoking massive pyroglutamate accumulation.

### The Delta Gap (Gap-Gap Ratio)

The delta gap compares the excess anion gap ($\Delta\text{AG}$) to the bicarbonate deficit ($\Delta\text{HCO}_3^-$):

$$\text{Delta Gap} = \frac{\Delta\text{AG}}{\Delta\text{HCO}_3^-} = \frac{\text{AG} - 12}{24 - \text{HCO}_3^-} \tag{31.16}$$

In uncomplicated high anion gap acidosis, each milliequivalent of unmeasured acid buffers one milliequivalent of $\text{HCO}_3^-$, yielding a ratio of **1.0**:
- **Delta Gap $< 1.0$:** $\text{HCO}_3^-$ has fallen more than expected relative to the AG increase. Indicates a **coexisting normal anion gap (hyperchloremic) acidosis** (e.g., DKA resuscitated with liters of normal saline).
- **Delta Gap $> 1.0$:** $\text{HCO}_3^-$ is higher than expected relative to the AG increase. Indicates a **coexisting metabolic alkalosis** (e.g., lactic acidosis in a patient on chronic loop diuretics or with ongoing nasogastric suction).

### The Serum Osmolal Gap

Calculated plasma osmolality ($P_{\text{osm}}$) is derived from major serum osmoles:

$$P_{\text{osm}}\text{ (mOsm/kg H}_2\text{O)} = 2 \times [\text{Na}^+] + \frac{\text{Glucose (mg/dL)}}{18} + \frac{\text{BUN (mg/dL)}}{2.8} \tag{31.17}$$

#### Detection of Exogenous Toxins

The osmolal gap represents the difference between measured freezing-point osmolality and calculated osmolality:

$$\text{Osmolal Gap} = \text{Measured } P_{\text{osm}} - \text{Calculated } P_{\text{osm}}$$

An osmolal gap $> 10\text{ mOsm/kg H}_2\text{O}$ signals the circulation of low-molecular-weight non-ionized molecules (toxic alcohols: methanol, ethylene glycol, isopropanol, or propylene glycol). In patients with high anion gap acidosis of obscure origin, an elevated osmolal gap confirms toxic alcohol ingestion before metabolites are cleared into organic acids.
</div></details>

<details class="med-details" open><summary>

## Physicochemical Perspective: Beyond Traditional Henderson-Hasselbalch</summary><div class="details-content">

For over a century, clinical medicine has viewed acid-base balance through the lens of the carbonic acid reaction sequence:

$$\text{CO}_2 + \text{H}_2\text{O} \rightleftharpoons \text{H}_2\text{CO}_3 \rightleftharpoons \text{H}^+ + \text{HCO}_3^- \tag{31.18}$$

While clinically practical, this framework has significant physicochemical limitations:
1. $\text{HCO}_3^-$ and $\text{PaCO}_2$ are chemically interdependent variables; bicarbonate cannot change independently without shifting carbon dioxide.
2. Bicarbonate is not a true buffer within the physiological pH range of 7.40 because its $\text{pK}_a$ is 6.10.

Peter Stewart's quantitative physicochemical approach demonstrates that $[\text{H}^+]$ is determined by three mathematically independent variables:
1. **Strong Ion Difference (SID):** Net charge of fully dissociated cations minus anions ($[\text{Na}^+] + [\text{K}^+] + [\text{Ca}^{2+}] + [\text{Mg}^{2+}] - [\text{Cl}^-] - [\text{lactate}^-]$). A fall in SID produces acidosis (e.g., hyperchloremia).
2. **Total Weak Non-Volatile Acids ($A_{\text{tot}}$):** Primarily serum albumin and phosphate. Hypoalbuminemia raises pH (alkalosis).
3. **$\text{PaCO}_2$:** The independent respiratory variable governed by minute ventilation.

Recognizing these physicochemical determinants deepens the clinician's understanding of complex, multifactorial ICU acid-base derangements.
</div></details>
