# Conventional Mechanical Ventilation

> *Medicine is a science which has been more laboured than advanced. For I find much iteration, but small addition.*
> 
> — Sir Francis Bacon

The earliest mechanical ventilators, introduced in 1920, were negative-pressure chambers known as *iron lungs* that enclosed the patient from the neck to the feet. These behemoths (early models weighed approximately one ton) remained the predominant mode of ventilatory support until the devastating poliomyelitis epidemic in 1950, when the demand for assisted ventilation overwhelmed the supply of negative-pressure chambers. In Copenhagen, tracheostomies were rapidly adopted, and medical students worked in 8-hour shifts as human ventilators, manually bagging the lungs of stricken patients. Concurrently in Boston, a prototype positive-pressure lung ventilator designed by the Emerson Company was deployed at the Massachusetts General Hospital, achieving immediate clinical success.

Seven decades (70 years) later, an estimated 174 different modes of mechanical ventilation are available on modern intensive care ventilators. However, only one strategy has consistently demonstrated improved clinical outcomes: lung protective ventilation with low tidal volumes, and solely because it limits the iatrogenic pulmonary damage inflicted by positive pressure itself. Mechanical ventilation is often made far more complicated than necessary; in practice, simpler approaches yield superior outcomes.

This chapter details the fundamental principles of conventional positive-pressure mechanical ventilation, providing the physiological foundation required to manage the overwhelming majority of critically ill patients.

<details class="med-details" open><summary>

## Executive Summary</summary><div class="details-content">

- **Ventilator Breath Types:** In volume-control ventilation (VCV), a preset tidal volume ($V_T$) is delivered at a constant flow rate, causing airway pressure to rise progressively. In pressure-control ventilation (PCV), a preset inspiratory pressure is applied with a decelerating flow pattern, reaching peak pressure early with variable tidal volume.
- **Plateau Pressure and Mechanics:** An end-inspiratory pause (inflation hold) eliminates airflow resistance ($P_{\text{res}}$), revealing alveolar pressure ($P_{\text{plateau}}$), which reflects chest wall and lung elastance ($P_{\text{el}}$): $P_{\text{peak}} = P_{\text{res}} + P_{\text{el}}$. Alveolar overdistension and volutrauma are minimized when $P_{\text{plateau}} \leq 30\text{ cm H}_2\text{O}$.
- **Thoracic Compliance:** Static compliance ($C_{\text{stat}} = V_T / [P_{\text{plateau}} - \text{PEEP}_{\text{tot}}]$) normal values range between 50 and 80 mL/$\text{cm H}_2\text{O}$, falling to $< 25\text{ mL/cm H}_2\text{O}$ in ARDS or pulmonary edema. Measurements must account for ventilator circuit tubing compliance ($\sim 3\text{ mL/cm H}_2\text{O}$).
- **End-Expiratory Pressure:** Occult (auto/intrinsic) PEEP occurs when expiratory flow fails to reach zero prior to the next inspiration (dynamic hyperinflation). It is quantified via an end-expiratory occlusion hold in passively breathing patients.
- **Assist-Control Ventilation (ACV):** Delivers fully assisted volume- or pressure-cycled breaths for every trigger effort. Flow-triggering (1–10 L/min) is the standard modality, significantly reducing work of breathing compared to negative pressure triggering.
- **Synchronized Intermittent Mandatory Ventilation (SIMV):** Permits spontaneous breaths between set machine breaths, augmented with pressure support ($\sim 10\text{ cm H}_2\text{O}$). Indicated for rapid breathing with severe alkalemia or occult PEEP during ACV; contraindicated in diaphragmatic exhaustion and severe left ventricular failure.
- **Best PEEP Concept:** PEEP prevents small airway collapse (atelectrauma) and recruits non-aerated alveoli. However, excessive PEEP overdistends healthy lung units (volutrauma) and compresses pulmonary capillaries, increasing right ventricular afterload and decreasing cardiac output. "Best PEEP" balances lung recruitment (maximal compliance, minimal driving pressure) with systemic oxygen delivery ($\text{DO}_2$).
- **Lung Protective Strategy:** Initial settings for acute respiratory failure: volume control ACV, initial $V_T = 8\text{ mL/kg}$ predicted body weight (PBW), down-titrated over 2 hours to 6 mL/kg PBW, initial PEEP 5–8 $\text{cm H}_2\text{O}$, target $P_{\text{plateau}} \leq 30\text{ cm H}_2\text{O}$, and $\text{I:E ratio} \geq 1:2$.
</div></details>

<details class="med-details" open><summary>

## The Ventilator Breath</summary><div class="details-content">

Positive-pressure lung inflation is governed by two fundamental delivery methods, as illustrated in Figure 27.1.

![Figure 27.1](images/_page_1_Figure_1.jpeg)

**FIGURE 27.1** Changes in lung volume, airway pressure, and flow rate during a single ventilator breath using volume-control and pressure-control modes of lung inflation. $\text{I}$ = inspiration, $\text{E}$ = expiration.

1. **Volume-Control Ventilation (VCV):** The operator sets a target tidal volume ($V_T$) and a constant inspiratory flow rate. Airway pressure rises linearly to a peak as the volume is delivered, after which expiration occurs passively.
2. **Pressure-Control Ventilation (PCV):** The operator preselects the inspiratory pressure and inspiratory time ($T_I$). The inspiratory flow follows a decelerating profile, peaking immediately at breath initiation and tapering toward zero as lung units fill. Volume delivery depends entirely on respiratory system compliance and airway resistance.

### Volume-Control Ventilation and Airway Pressures

In VCV, peak airway pressure ($P_{\text{peak}}$) is the sum of pressure needed to overcome airway resistance ($P_{\text{res}}$) and pressure needed to distend the elastic recoil of the lungs and chest wall ($P_{\text{el}}$):

$$P_{\text{peak}} = P_{\text{res}} + P_{\text{el}} \tag{27.1}$$

#### The Plateau Pressure and Inflation-Hold Maneuver

The individual contributions of resistance and elastance can be differentiated by applying a brief end-inspiratory occlusion (an inflation-hold maneuver lasting 0.5–1.0 second), as demonstrated in Figure 27.2. 

![Figure 27.2](images/_page_2_Figure_7.jpeg)

**FIGURE 27.2** Airway pressure profile for a volume-controlled breath with an end-inspiratory occlusion (inflation-hold). $P_{\text{peak}}$ = peak airway pressure, $P_{\text{plateau}}$ = end-inspiratory occlusion pressure, $P_{\text{alv}}$ = alveolar pressure, $P_{\text{res}}$ = resistive pressure, and $P_{\text{el}}$ = elastic recoil pressure.

When gas flow ceases at end-inspiration, the resistive pressure drops abruptly to zero, revealing a static plateau pressure ($P_{\text{plateau}}$). Because there is no flow, $P_{\text{plateau}}$ equals alveolar pressure ($P_{\text{alv}}$) and reflects purely the elastic distension of the lungs and chest wall:

$$P_{\text{plateau}} = P_{\text{alv}} = P_{\text{el}} \tag{27.2}$$

#### Differentiating Resistance and Elastance

The difference between peak and plateau pressure represents the resistive pressure dissipating across the conducting airways and endotracheal tube:

$$P_{\text{peak}} - P_{\text{plateau}} = P_{\text{res}} \tag{27.3}$$

An elevation in $P_{\text{peak}}$ with an unchanged $P_{\text{plateau}}$ signals increased airway resistance (bronchospasm, secretions, kinking of the endotracheal tube). Conversely, a concurrent rise in both $P_{\text{peak}}$ and $P_{\text{plateau}}$ signals reduced thoracic compliance (pneumothorax, worsening pulmonary edema, pneumonia, abdominal distension).

#### Risk of Alveolar Injury

Peak airway pressure is higher during VCV than PCV, which historically prompted concern for barotrauma. However, alveolar stretch and tissue damage (volutrauma) are determined by alveolar pressure ($P_{\text{plateau}}$), not proximal peak circuit pressure. Extensive clinical trials establish that the risk of alveolar overdistension and rupture is negligible when $P_{\text{plateau}} \leq 30\text{ cm H}_2\text{O}$, which forms the foundational limit of lung protective mechanical ventilation.

#### Advantages and Disadvantages of VCV

- **Advantages:** Guaranteed minute ventilation and precise tidal volume delivery, ensuring strict adherence to lung-protective protocols.
- **Disadvantages:** Constant square-wave flow may fail to meet the instantaneous demands of tachypneic patients, causing flow starvation and patient-ventilator dyssynchrony. A decelerating flow pattern can improve comfort during volume-targeted ventilation.

### Pressure-Control Ventilation

In PCV, the target inspiratory pressure is held constant throughout the preset inspiratory time. The high initial flow rapidly fills lung units, promoting more homogeneous gas distribution and improving patient comfort in tachypneic individuals.

#### Advantages and Disadvantages of PCV

- **Advantages:** Decelerating flow matches patient demand, reduces peak airway pressures, and promotes more uniform alveolar ventilation in heterogeneous lung disease.
- **Disadvantages:** Tidal volume varies dynamically with changes in patient compliance and airway resistance. Bronchospasm or worsening edema will cause tidal volume to plummet, whereas improving compliance risks unexpected alveolar overdistension.

#### Pressure-Regulated Volume Control

Pressure-regulated volume control (PRVC) combines the attributes of both modes. The ventilator delivers decelerating flow breaths while test-measuring lung compliance on each cycle, continuously adjusting the required inspiratory pressure to deliver the preselected target tidal volume at the lowest feasible airway pressure. However, in patients with vigorous, erratic breathing drives, PRVC can cause inappropriate pressure reductions and dyssynchrony.

### End-Expiratory Pressure

End-expiratory pressure represents the lowest baseline pressure present in the alveoli at the completion of expiration (Figure 27.3).

![Figure 27.3](images/_page_4_Figure_9.jpeg)

**FIGURE 27.3** Forms of end-expiratory pressure: ZEEP, applied extrinsic PEEP, and occult (intrinsic/auto) PEEP revealed by an end-expiratory hold.

- **ZEEP (Zero End-Expiratory Pressure):** In quiet breathing with unobstructed airways, alveolar pressure equilibrates with atmospheric pressure at the end of expiration.
- **Applied PEEP:** Positive end-expiratory pressure added extrinsically via an exhalation threshold resistor valve in the ventilator circuit. Applied PEEP prevents terminal alveolar collapse and recruits flooded or atelectatic lung units.
- **Occult (Intrinsic or Auto) PEEP:** When expiration is truncated before the lungs fully deflate, gas remains trapped, and alveolar pressure remains positive even though proximal airway pressure reads zero. Occult PEEP is prominent in obstructive diseases (COPD, asthma) and during ventilation with high respiratory rates or inadequate expiratory time.

#### Detecting Occult PEEP

Occult PEEP is visually identified on flow-time scalar waveforms when expiratory flow fails to return to zero prior to the initiation of the next breath. In a passively breathing, non-effortful patient, occult PEEP is quantified by performing an end-expiratory occlusion maneuver, which allows alveolar pressure to equilibrate with the proximal circuit sensor (Figure 27.3).

### Mean Airway Pressure

Mean airway pressure ($P_{\text{mean}}$) is the average circuit pressure integrated over the entire respiratory cycle. It is influenced by peak pressure, waveform contour, PEEP level, inspiratory time fraction ($T_I/T_{\text{tot}}$), and respiratory rate. Typical $P_{\text{mean}}$ values are:
- Normal lungs: 5–10 $\text{cm H}_2\text{O}$
- Obstructive airway disease: 10–20 $\text{cm H}_2\text{O}$
- Stiff, noncompliant lungs (ARDS): 20–30 $\text{cm H}_2\text{O}$

$P_{\text{mean}}$ correlates directly with the hemodynamic consequences of positive-pressure breathing and with mean alveolar recruitment.

### Thoracic Compliance

Compliance ($\Delta V / \Delta P$) is the reciprocal of elastance, quantifying the distensibility of a hollow chamber. In mechanical ventilation, measured compliance reflects total thoracic compliance, incorporating both the lung parenchyma and the chest wall.

#### Static Compliance in Volume-Control Ventilation

During VCV with an end-inspiratory pause, static compliance ($C_{\text{stat}}$) is calculated as:

$$C_{\text{stat}} = \frac{V_T}{P_{\text{plateau}} - \text{PEEP}_{\text{tot}}} \tag{27.4}$$

where $\text{PEEP}_{\text{tot}}$ is total PEEP (applied extrinsic PEEP plus occult PEEP). In patients with normal lungs, $C_{\text{stat}}$ is 50–80 mL/$\text{cm H}_2\text{O}$. In infiltrative parenchymal disorders (ARDS, severe cardiogenic edema), $C_{\text{stat}}$ drops to $< 25\text{ mL/cm H}_2\text{O}$.

#### Static Compliance in Pressure-Control Ventilation

During PCV, when inspiratory flow decelerates to zero at end-inspiration, end-inspiratory airway pressure ($P_{\text{aw}}$) equals alveolar pressure, and $C_{\text{stat}}$ is calculated using the exhaled tidal volume ($V_T$):

$$C_{\text{stat}} = \frac{\text{Exhaled } V_T}{P_{\text{aw}}(\text{end-insp}) - \text{PEEP}_{\text{tot}}} \tag{27.5}$$

#### Sources of Error in Compliance Calculations

1. **Chest Wall Muscle Contraction:** During passive ventilation, the chest wall contributes approximately 35% of total thoracic elastance. Active patient muscle tone distorts pressure readings; compliance should only be measured in relaxed or sedated patients without active respiratory efforts.
2. **Volume-Dependence:** Compliance decreases nonlinearly at high lung volumes. Serial comparisons must be performed at identical tidal volumes.
3. **Tubing Circuit Compressibility:** Ventilator tubing expands under pressure, absorbing approximately 3 mL/$\text{cm H}_2\text{O}$ of delivered volume. If delivered $V_T = 500\text{ mL}$ and $P_{\text{peak}} = 40\text{ cm H}_2\text{O}$, $3 \times 40 = 120\text{ mL}$ is lost to circuit expansion, delivering only 380 mL to the patient.
</div></details>

<details class="med-details" open><summary>

## Assist-Control Ventilation</summary><div class="details-content">

Assist-control ventilation (ACV) guarantees a preset baseline respiratory rate while enabling the patient to trigger additional full-volume or full-pressure assisted breaths (Figure 27.4).

![Figure 27.4](images/_page_7_Figure_0.jpeg)

**FIGURE 27.4** Airway pressure waveforms in assist-control ventilation (ACV) and synchronized intermittent mandatory ventilation (SIMV).

### Triggering Mechanisms

Breaths in ACV are either patient-triggered (initiating from patient effort) or time-triggered (delivered automatically if the patient fails to breathe within a preset interval).

- **Pressure Triggering:** The patient must generate a negative airway pressure swing of 2–3 $\text{cm H}_2\text{O}$ to open the inspiratory valve. Approximately one-third of patient inspiratory efforts fail to trigger a breath with pressure triggering due to auto-PEEP or weakness.
- **Flow Triggering:** The ventilator maintains a continuous baseline bias flow through the circuit. When the patient begins to inhale, a portion of this flow is diverted into the patient's lungs. When the returning expiratory flow drops by a preset threshold (typically 1–10 L/min), inspiration is triggered immediately. Flow triggering requires minimal patient work and is the current worldwide standard.

### The Respiratory Cycle and I:E Ratio

Mechanical ventilation requires sufficient expiratory time to prevent air trapping. The inspiratory-to-expiratory time ratio (I:E ratio) should normally be maintained at $\geq 1:2$. When expiratory time is curtailed, the I:E ratio can be expanded by:
1. Increasing peak inspiratory flow rate.
2. Reducing tidal volume.
3. Decreasing inspiratory time ($T_I$) in pressure-targeted modes.

In patients breathing rapidly on ACV, every breath triggers a full tidal volume, drastically reducing expiratory time and multiplying the risk of dynamic hyperinflation and occult PEEP.
</div></details>

<details class="med-details" open><summary>

## Intermittent Mandatory Ventilation</summary><div class="details-content">

Intermittent mandatory ventilation (IMV) was devised to permit spontaneous unassisted breathing between mandatory ventilator breaths, preventing respiratory alkalosis and air trapping in tachypneic patients.

### Synchronization and Pressure Support

In modern practice, mandatory breaths are synchronized to the patient's spontaneous efforts (**Synchronized IMV / SIMV**), as shown in the lower panel of Figure 27.4. Spontaneous breaths taken between mandatory cycles are typically augmented with pressure support (e.g., 10 $\text{cm H}_2\text{O}$) to overcome the internal resistance of the endotracheal tube and breathing circuit.

### Adverse Effects of SIMV

1. **Increased Work of Breathing:** Breathing through the circuit without adequate pressure support significantly increases diaphragmatic workload and can induce muscle fatigue.
2. **Decreased Cardiac Output:** While positive-pressure breaths reduce left ventricular afterload, spontaneous negative-pressure breaths increase left ventricular afterload. In patients with severe left ventricular systolic dysfunction, switching from ACV to SIMV can precipitate acute heart failure and drop cardiac output.

### Clinical Indications

The primary indication for SIMV is rapid, tachypneic breathing during ACV that causes respiratory alkalosis and occult PEEP refractory to adjustments in flow and sedation. SIMV is contraindicated in patients with severe respiratory muscle fatigue or decompensated left heart failure.
</div></details>

<details class="med-details" open><summary>

## Positive End-Expiratory Pressure and Best PEEP</summary><div class="details-content">

In acute lung injury, cyclical alveolar collapse at end-expiration followed by violent re-expansion on inspiration inflicts high shear stresses that tear epithelial linings, a mechanism known as *atelectrauma*. Applied PEEP splints open unstable lung units, maintaining patency throughout the ventilatory cycle.

### The Concept of Best PEEP

While moderate PEEP (5–10 $\text{cm H}_2\text{O}$) prevents end-expiratory collapse, higher levels (10–20 $\text{cm H}_2\text{O}$) actively recruit previously consolidated or fluid-filled alveoli, expanding the surface area for gas exchange. However, excessive PEEP overdistends compliant, normal alveoli, causing volutrauma and compressing intra-alveolar capillaries. "Best PEEP" represents the optimal pressure that maximizes alveolar recruitment while avoiding overdistension and circulatory depression.

![Figure 27.5](images/_page_10_Figure_4.jpeg)

**FIGURE 27.5** Effects of incremental PEEP on thoracic compliance and driving pressure at a constant tidal volume of 4 mL/kg predicted body weight. The inflection point identifies "best PEEP".

#### Compliance and Driving Pressure Titration

As PEEP recruits collapsed alveoli, total thoracic compliance rises and the driving pressure ($\Delta P = P_{\text{plateau}} - \text{PEEP}$) falls (Figure 27.5). When incremental PEEP begins to overdistend already open alveoli, compliance begins to decline and driving pressure increases. The inflection point of maximal compliance and minimal driving pressure defines the mechanical "best PEEP".

### PaO2/FiO2 Ratio and Oxygen Delivery

Although higher PEEP routinely improves arterial oxygenation ($\text{PaO}_2/\text{FiO}_2$), this does not necessarily translate into improved tissue oxygen delivery ($\text{DO}_2$), which depends upon both arterial oxygen content ($\text{CaO}_2$) and cardiac output ($\text{CO}$):

$$\text{DO}_2 = \text{CO} \times \text{CaO}_2 \tag{27.6}$$

![Figure 27.6](images/_page_11_Figure_4.jpeg)

**FIGURE 27.6** Opposing effects of positive end-expiratory pressure (PEEP) on arterial oxygenation ($\text{PaO}_2/\text{FiO}_2$) and cardiac index in patients with ARDS.

As illustrated in Figure 27.6, aggressive PEEP titration improves $\text{PaO}_2/\text{FiO}_2$ but simultaneously impairs venous return, precipitating a steep decline in cardiac index. As a consequence, systemic $\text{DO}_2$ may actually drop despite a rising $\text{PaO}_2$. Central venous oxygen saturation ($\text{ScvO}_2$) can serve as a clinical monitor to ensure that cardiac output is not compromised during PEEP titration.
</div></details>

<details class="med-details" open><summary>

## Initial Ventilator Setup and Protocol</summary><div class="details-content">

When instituting mechanical ventilation in an adult intensive care patient, settings should be methodically configured following proven lung-protective principles.

### Protocol for Lung Protective Ventilation

Table 27.1 summarizes the landmark ARDSNet protocol, which has established standard care across intensive care units worldwide.

### TABLE 27.1 Protocol for Lung Protective Ventilation

| Stage | Action Steps |
| :--- | :--- |
| **First Stage** | 1. Calculate patient's predicted body weight (PBW):<br>• Males: $\text{PBW (kg)} = 50 + [2.3 \times (\text{height in inches} - 60)]$<br>• Females: $\text{PBW (kg)} = 45.5 + [2.3 \times (\text{height in inches} - 60)]$<br>2. Set initial tidal volume ($V_T$) at 8 mL/kg PBW.<br>3. Add positive end-expiratory pressure (PEEP) of 5 $\text{cm H}_2\text{O}$.<br>4. Select lowest $\text{FiO}_2$ that achieves target $\text{SpO}_2$ of 88–95%.<br>5. Reduce $V_T$ by 1 mL/kg PBW every 2 hours until $V_T = 6\text{ mL/kg PBW}$. |
| **Second Stage** | 1. When $V_T = 6\text{ mL/kg PBW}$, measure plateau pressure ($P_{\text{plateau}}$).<br>2. If $P_{\text{plateau}} > 30\text{ cm H}_2\text{O}$, decrease $V_T$ in 1 mL/kg increments until $P_{\text{plateau}} \leq 30\text{ cm H}_2\text{O}$ or $V_T = 4\text{ mL/kg PBW}$. |
| **Third Stage** | 1. Monitor arterial blood gases for respiratory acidosis.<br>2. If $\text{pH} = 7.15–7.30$, increase respiratory rate until $\text{pH} > 7.30$ or $\text{RR} = 35\text{ breaths/min}$.<br>3. If $\text{pH} < 7.15$, increase RR to 35 breaths/min; if $\text{pH}$ remains $< 7.15$, increase $V_T$ by 1 mL/kg increments until $\text{pH} > 7.15$. |
| **Target Goals** | $V_T = 6\text{ mL/kg PBW}$, $P_{\text{plateau}} \leq 30\text{ cm H}_2\text{O}$, $\text{SpO}_2 = 88–95\%$, $\text{pH} = 7.30–7.45$. |

### Systematic Initial Settings

1. **Mode:** Initiate assist-control ventilation (ACV) using volume control (VCV) or pressure-regulated volume control (PRVC) to ensure precise control over tidal volume.
2. **Inspiratory Flow Rate:** Set baseline flow at 60 L/min for quiet breathing; increase to $\geq 80\text{ L/min}$ for tachypneic patients with high ventilatory drive to prevent flow starvation.
3. **I:E Ratio:** Maintain an I:E ratio of $\geq 1:2$. Expand expiratory time if airway obstruction or occult PEEP is detected.
4. **Respiratory Rate:** Set at 12–16 breaths/min (or matching pre-intubation minute ventilation, maximum 35 breaths/min). Check arterial blood gases at 30 minutes and adjust rate accordingly.
5. **Initial PEEP:** Set at 5–8 $\text{cm H}_2\text{O}$. Titrate upward if high $\text{FiO}_2$ ($> 60\%$) is required to maintain $\text{SpO}_2 \geq 90\%$.
6. **Management of Occult PEEP:** If expiratory flow does not return to zero at end-expiration, extend expiratory time by increasing flow rate or reducing $V_T$. If occult PEEP persists, extrinsic PEEP may be added up to 80% of occult PEEP to reduce the inspiratory trigger work.
</div></details>

<details class="med-details" open><summary>

## Clinical Perspective: Loss of Focus</summary><div class="details-content">

Since the inception of positive-pressure mechanical ventilation, an immense volume of engineering effort has been expended creating over 174 ventilation modes, yet only low-tidal-volume lung protective ventilation has conclusively demonstrated improved patient survival. 

What has frequently been overlooked in modern intensive care is that mechanical ventilation is strictly a temporary supportive bridge, not a curative therapy for underlying pulmonary pathology. To optimize clinical outcomes in ventilator-dependent patients, less attention should be devoted to esoteric ventilator dials, and far greater focus directed toward reversing the diseases that necessitate mechanical support.
</div></details>
