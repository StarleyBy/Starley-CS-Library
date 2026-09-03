# Ventilator Graphics

<details class="med-details"><summary>

## Executive Summary</summary><div class="details-content">

### Basic Concepts of Ventilator Graphics
* **Scalars:** Waveforms of pressure, flow, or volume graphed against time. Six basic shapes: rectangular (square/constant), descending ramp (decelerating), ascending ramp (accelerating), sinusoidal (sine wave), rising exponential, decaying exponential (Fig. 9.1, Box 9.1).
* **Loops:** Graphs of two variables (pressure vs. volume, flow vs. volume). P‑V loops monitor compliance and resistance; F‑V loops monitor airway obstruction and response to bronchodilators.
* **Key relationships:** Flow = ΔV / T<sub>I</sub>. Pressure required to inflate lungs depends on compliance and resistance (ΔP = ΔV / C<sub>L</sub>). Volume delivered = Flow × T<sub>I</sub>. Greater pressure gradient → higher flow → faster lung filling (Key Point 9.1).

### Identifying Breath Types and Modes from Scalars
* **Volume‑controlled CMV (VC‑CMV):** Constant (square) flow pattern (if set), pressure scalar rises to PIP and may have inspiratory pause. Flow rises abruptly to set peak, remains constant, then drops to zero (Fig. 9.2, 9.3).
* **Pressure‑controlled CMV (PC‑CMV):** Decelerating (descending ramp) flow pattern (always), pressure scalar is square (constant) if T<sub>I</sub> long enough (Fig. 9.7). Peak flow varies with patient demand (dashed line).
* **Patient vs. time trigger:** Patient‑triggered breath shows slight negative deflection in pressure scalar before rise (Fig. 9.5). Time‑triggered breath has no preceding deflection.
* **Intermittent mandatory ventilation (IMV):** Spontaneous breaths have smaller pressure and volume excursions than mandatory breaths. Elevated baseline indicates PEEP/CPAP (Fig. 9.6, 9.9, 9.10). Spontaneous breaths may be pressure‑supported (Fig. 9.8, 9.9) or unsupported (Fig. 9.10).

### Pressure‑Volume (P‑V) Loops
* **Direction:** Positive pressure breath → counterclockwise tracing (Fig. 9.11). Spontaneous breath → clockwise tracing (Fig. 9.13). Patient‑triggered mandatory breath: initial clockwise (patient effort) then counterclockwise (ventilator) (Fig. 9.14).
* **Components (Fig. 9.12):** X‑axis pressure (PIP, P<sub>awo</sub>), Y‑axis volume (V<sub>T</sub>). Static P‑V line (dashed) reflects alveolar pressure (P<sub>alv</sub>). Transairway pressure (P<sub>TA</sub>) = P<sub>awo</sub> – P<sub>alv</sub> (horizontal width between inspiratory and expiratory limbs).
* **Work of breathing (WOB) (Fig. 9.17):** Triangle ABE = elastic work to overcome lung/chest wall recoil. Area ACB = resistive work during inspiration. Area ADB = resistive work during expiration. Hysteresis (area between inspiratory and expiratory curves) reflects energy lost to resistance (Box 9.2).
* **Compliance changes (Fig. 9.18, 9.19):** Decreased compliance (ARDS, edema, atelectasis) → P‑V loop flattens (greater pressure for same volume in VC‑CMV; lower volume for same pressure in PC‑CMV). Increased compliance (emphysema) → loop shifts left.
* **Increased resistance (Fig. 9.20):** Loop widens (increased horizontal distance between inspiratory and expiratory limbs) but slope of static line (compliance) remains normal.

### Flow‑Volume (F‑V) Loops
* **Orientation:** Inspiratory flow above baseline, expiratory flow below baseline (opposite of standard pulmonary function testing) (Fig. 9.15).
* **Normal:** Expiratory flow declines linearly from peak expiratory flow rate (PEFR) to zero at end‑exhalation.
* **Increased resistance (Fig. 9.21, 9.22):** PEFR decreases; expiratory limb becomes scooped‑out (concave). Inspiratory limb unchanged if flow is set (VC‑CMV). Common in COPD, asthma, secretions, bronchospasm.
* **Response to bronchodilator (Fig. 9.23):** Outer loop shows improved expiratory flow (higher PEFR, less scooping). Initial expiratory spike (artifact) from decompression of circuit gas.

### Patient‑Ventilator Asynchrony
* **Trigger asynchrony (Fig. 9.24, 9.25):** Ventilator fails to recognize patient effort (pressure/flow deflection without trigger). Caused by insensitive trigger setting. P‑V loop shows characteristic “fish tail” deflection below PEEP baseline.
* **Autotriggering (Fig. 9.26, 9.27):** Premature breath initiation without patient effort. Caused by overly sensitive trigger or circuit leak. Differentiate by P‑V and F‑V loops (leak shows incomplete return to baseline on both loops) (Fig. 9.27).
* **Flow asynchrony (Fig. 9.28A):** Set flow insufficient for patient demand → pressure scalar shows M‑shaped dip during inspiration. Correct by increasing set flow, switching to pressure‑targeted breath, or using hybrid modes (VC+, PRVC, AutoFlow). Fig. 9.28B shows VC+ automatically adjusting flow between breaths.
* **Cycle asynchrony (termination asynchrony) (Fig. 9.29):** Patient actively exhales before ventilator cycles off → pressure spike at end‑inspiration. Caused by incorrect flow cycle percentage in PSV (too low) or inappropriate T<sub>I</sub> in mandatory breaths.

### Advanced Graphic Applications
* **Auto‑PEEP detection (Fig. 9.30, 9.31):** Flow scalar – expiratory flow does not return to zero before next breath. P‑V loop – expiratory limb does not return to baseline (arrow). F‑V loop – same finding. Both auto‑PEEP and circuit leak cause incomplete return – differentiate by clinical assessment and circuit check.
* **Titrating PEEP (Fig. 9.32):** Increasing PEEP improves compliance (slope of P‑V loop increases) if set below lower inflection point. Compare loops at different PEEP levels.
* **APRV (Fig. 9.33, 9.34):** Long high‑pressure time (T<sub>high</sub>), short low‑pressure time (T<sub>low</sub>). Auto‑PEEP intentional. Period of zero flow at constant pressure indicates alveolar recruitment. Upper and lower inflection points guide pressure settings.
* **Esophageal pressure (P<sub>es</sub>) integration (Fig. 9.35):** Transpulmonary pressure (P<sub>L</sub> = P<sub>aw</sub> – P<sub>es</sub>) helps identify ineffective triggering (patient efforts without ventilator response) and asynchrony.
* **Overdistention in PC‑CMV (Fig. 9.36, 9.37):** P‑V loop flattens at end‑inspiration (“bird beak” appearance). Further pressure increase yields minimal volume gain (point A vs. point B). Set pressure at point where volume gain plateaus.
* **Rise time (slope) control (Fig. 9.38):** Adjusts initial flow delivery in pressure‑targeted breaths. Faster rise time delivers higher initial flow; slower rise time tapers flow to reduce pressure overshoot and turbulence (important with small ETT).
* **Flow cycling in PSV (Fig. 9.39):** Inspiration ends when flow falls to set percentage of peak flow (e.g., 25%). Low percentage → longer T<sub>I</sub>, higher delivered volume but risk of cycle asynchrony (patient exhales before cycling). High percentage (e.g., 40%) → shorter T<sub>I</sub>, better for COPD patients with slow flow decline.

### Case Study 9.2 (Fig. 9.40)
* Auto‑PEEP on flow scalar (arrow in A). Increasing expiratory time (reducing T<sub>I</sub> or rate) allows expiratory flow to reach zero before next breath (B), confirming resolution.

</div></details>

<details class="med-details"><summary>

## RELATIONSHIP OF FLOW, PRESSURE, VOLUME, AND TIME</summary><div class="details-content">

Modern mechanical ventilators (e.g., Dräger v500 [Dräger Medical Inc., Telford, PA], CareFusion AVEA [CareFusion, Viasys Corp, San Diego, CA], Maquet Servo‑i [Maquet Inc. Wayne, NJ], Puritan Bennett 840 [Covidien‑Nellcor and Puritan Bennett, Boulder, CO], and Hamilton G5 [Hamilton Medical, Bonzduz, Switzerland]) incorporate graphic displays into their ventilator interfaces to provide instantaneous displays of pressure, flow, and volume. These graphic displays allow clinicians to obtain real‑time measurements of the patient‑ventilator interaction, which can provide insight into a patient’s mechanics of breathing. Thus ventilator graphics offer valuable information for clinicians making adjustments to ventilator settings.

Becoming proficient in the use of ventilator graphics typically requires dedicated time and practice. Once this skill is mastered, however, it can greatly enhance a clinician’s ability to assess patient‑ventilator interactions and improve patient care. Indeed, ventilator graphics can alert the clinician to abnormalities even before clinical signs are obvious and provide a graphic record of the pathophysiological changes that can lead to patient‑ventilator asynchrony and respiratory distress.

Proprietary software programs offered by the ventilator manufacturers allow for flow, pressure, and volume measurements to be displayed as different types of waveforms. The term **scalar** is used to specify the flow, pressure, and volume waveforms that are graphed relative to time (i.e., pressure, flow, and volume scalars). Basically, six shapes (waveforms) are produced with scalars during mechanical ventilation ([Fig. 9.1](#fig-9-1) and Box 9.1). The term **loop** is used to describe a graph of two variables plotted on the *x* and *y* coordinates, such as pressure‑volume and flow‑volume loops (these are discussed later in the chapter).

<span id="fig-9-1"></span>![](./_page_1_Figure_3.jpeg)

**FIGURE 9.1** Examples of waveforms for pressure, volume, and flow. Pressure waveforms are usually the rectangular or rising exponential (similar to an ascending ramp) type. Volume waveforms are usually the ascending ramp or sinusoidal type. Flow waveforms can take various forms; the rectangular, ramp (ascending or descending), sinusoidal, and decaying exponential waveforms are seen most often.

##### BOX 9.1 Six Basic Curves (Waveforms)

- Rectangular (often called the square wave or constant waveform)
- Descending ramp (also called a decelerating ramp)
- Ascending ramp (also called an accelerating ramp)
- Sinusoidal (often called the sine wave; only half or part of this wave is present)
- Rising exponential
- Decaying exponential

Flow, pressure, volume, and time must be determined to produce the various waveforms and loops. The following principles explain the basic interrelationship of volume, pressure, flow, and time as they are used to create a waveform display:

1. The flow of gas into the lungs depends on the difference between the pressure from the power source (the ventilator) and the pressure inside the lungs. The greater the pressure gradient, the higher is the flow of gas, and the faster the lungs fill. Flow is measured as a volume change per unit of time, where time is the inspiratory time (Flow = V / T<sub>I</sub>).
2. The amount of pressure (ΔP) required to inflate the lungs depends on the patient’s lung compliance and airway resistance. If the lungs are compliant and easy to inflate, relatively low pressures are required. If the lungs are stiff (low compliance), considerably higher pressures are required to inflate them (ΔP = ΔV / C<sub>L</sub>). For airway resistance, the most important factor affecting the degree of resistance is the diameter of the airways (or more specifically the radius according to Poiseuille’s law). Airway resistance decreases as the diameter of the airway increases, resulting in an increased flow. Conversely, airway resistance increases as the diameter of the airway is reduced, causing a decreased flow (Key Point 9.1). Note that the ventilator’s microprocessor can calculate both compliance and resistance using the measured data.
3. The volume (V) delivered depends on the amount of flow and inspiratory time (T<sub>I</sub>) (V = Flow × T<sub>I</sub>).

**Key Point 9.1** The amount of pressure (ΔP) required to inflate the lungs depends on the patient’s lung compliance and airway resistance.

</div></details>

<details class="med-details"><summary>

## A CLOSER LOOK AT SCALARS, CURVES, AND LOOPS</summary><div class="details-content">

<details class="med-details"><summary>

### Scalars</summary><div class="details-content">

[Fig. 9.2](#fig-9-2) shows a typical set of scalars for volume‑controlled continuous mandatory ventilation (VC‑CMV). Note the directional arrows indicating the movement of flow into the lungs and the corresponding rise in airway pressure and resulting delivered volume. Also, notice that flow rises to its peak value and remains constant throughout inspiration.

<span id="fig-9-2"></span>![](./_page_3_Figure_3.jpeg)

**FIGURE 9.2** Time‑triggered, constant‑flow, volume‑targeted ventilation (VC‑CMV). (A) Peak inspiratory flow; (B) peak expiratory flow; (C) peak inspiratory pressure; (D) baseline pressure; (E) delivered inspiratory tidal volume. (Modified from Hess DR, MacIntyre NR, Mishoe SC, et al.: *Respiratory care principles and practice*, Philadelphia, PA, 2002, WB Saunders.)

[Fig. 9.3](#fig-9-3) presents a closer look at a flow scalar. At point *A*, the inspiratory valve opens, allowing gas flow into the lungs. Keep in mind that this is also the point at which expiration ends. Flow rises quickly to point *B*, which is the peak inspiratory flow set on the control panel of the ventilator. What is the inspiratory flow setting in this example? At point *C*, inspiratory flow delivery stops. Has an inspiratory pause been set on the ventilator? What is the length of T<sub>I</sub>? What is the flow during the pause period?

In this example, as the expiratory valve opens at point *D*, gas leaves the patient and the ventilator circuit and passes through the ventilator’s expiratory valve. Flow during exhalation is graphed below the baseline, as specified by the software program. Look at the expiratory flow curve. What is the peak expiratory flow rate (PEFR)?*

Continue to follow the expiratory flow curve. Note that at point *E*, expiratory flow ends; however, the total expiratory time (T<sub>E</sub>) lasts from point *D* to point *F*, and the T<sub>E</sub> continues until the next inspiration begins (point *F*). How long is the T<sub>E</sub>?† How much of the T<sub>E</sub> is represented by a period of no gas flow?

<span id="fig-9-3"></span>![](./_page_3_Figure_5.jpeg)

**FIGURE 9.3** Flow‑time graph showing inspiration and expiration during volume ventilation with a constant flow. (See text for explanation.)

*PEFR is 80 L/min. (Even though the graph indicates minus [–] 80 L/min, the value is read without the minus sign.)
†T<sub>E</sub> = 1.5 seconds. 1.5 to 2.25 seconds (0.75‑second total) is the interval during exhalation when no more gas leaves the patient.

[Fig. 9.4](#fig-9-4) shows a VC‑CMV breath, but notice that the flow pattern has been set to decelerating pattern. Can you explain why this would not be representative of a pressure‑controlled continuous mandatory ventilation (PC‑CMV) breath? (Hint: Look at the contour of the pressure scalar.)

<span id="fig-9-4"></span>![](./_page_3_Figure_10.jpeg)

**FIGURE 9.4** Time‑triggered, descending‑flow, volume‑targeted ventilation (VC‑CMV). (Modified from Hess DR, MacIntyre NR, Mishoe SC, et al.: *Respiratory care principles and practice*, Philadelphia, PA, 2002, Saunders.)

Scalars also can be used to identify how a ventilator breath is initiated (i.e., time triggered or patient triggered). In [Fig. 9.5](#fig-9-5) arrow *A* indicates a time‑triggered breath and arrow *B* shows a patient‑triggered breath. Notice that for breath *B* there is a slight drop in baseline pressure, indicating a patient effort. Can you determine whether this is a PC or VC breath? (Hint: Look at the flow scalar.) Additional information about PC versus VC breaths is presented in the following section on the comparison of pressure‑controlled ventilation and volume‑controlled ventilation.

<span id="fig-9-5"></span>![](./_page_3_Figure_12.jpeg)

**FIGURE 9.5** Pressure and flow scalars for time‑triggered (A) and patient‑triggered (B) breaths.

As described in Chapter 5, intermittent mandatory ventilation (IMV) is a mode of ventilation that allows spontaneous breaths interspersed with mandatory breaths. [Fig. 9.6](#fig-9-6) shows an example of a VC‑IMV breath. Notice the minimal rise in pressure and tidal volume (V<sub>T</sub>) for each spontaneous breath and the contour difference in flow, pressure, and volume between the mandatory and spontaneous breaths. The elevated baseline pressure (see the *arrow* on the pressure scalar) indicates that the patient is receiving positive end‑expiratory pressure (PEEP).

<span id="fig-9-6"></span>![](./_page_4_Figure_3.jpeg)

**FIGURE 9.6** Volume‑controlled intermittent mandatory ventilation (VC‑IMV) plus continuous positive airway pressure/positive end‑expiratory pressure (CPAP)/PEEP. (See text for explanation.) (From Hess DR, MacIntyre NR, Mishoe SC, et al.: *Respiratory care principles and practice*, Philadelphia, PA, 2002, WB Saunders.)

During PC‑CMV, the flow and pressure patterns differ from those of VC‑CMV breaths. As shown in [Fig. 9.7](#fig-9-7), the flow pattern for PC‑CMV is decelerating with a constant (square) pressure pattern. PC‑CMV breaths always generate a decelerating flow pattern, whereas the flow pattern for VC‑CMV can be changed from square to decelerating. Notice also the change in peak flow that occurs with changes in patient demand during PC‑CMV (dashed line).

<span id="fig-9-7"></span>![](./_page_5_Figure_3.jpeg)

**FIGURE 9.7** Flow, pressure, and volume scalars seen during pressure‑controlled continuous mandatory ventilation (PC‑CMV).

Mandatory pressure‑targeted breaths can also be delivered with PC‑IMV as shown in [Fig. 9.8](#fig-9-8). Compare the difference in the flow and pressure scalars for the mandatory breaths and spontaneous breaths in this graphic with those in [Fig. 9.6](#fig-9-6). The spontaneous breaths have a flow and pressure pattern typically associated with a pressure‑targeted breath and are representative of a pressure support breath.

<span id="fig-9-8"></span>![](./_page_5_Figure_5.jpeg)

**FIGURE 9.8** Pressure, flow, and volume scalars for pressure‑controlled intermittent mandatory ventilation (PC‑IMV) plus pressure support and continuous positive airway pressure (CPAP). Arrows indicate spontaneous breaths. (See text for further information.)

</div></details>

<details class="med-details"><summary>

### Comparison of Pressure‑Controlled Ventilation and Volume‑Controlled Ventilation</summary><div class="details-content">

When pressure and volume breaths are compared, the pressure and flow curves demonstrate the most distinct differences. Volume‑controlled ventilation with constant flow produces a rectangular flow curve, which can be changed by selecting a different flow waveform.

During pressure‑controlled ventilation, the flow waveform is a descending curve that varies with both lung characteristics and patient flow demand; therefore it is referred to as a *continuously variable decelerating waveform* (Key Point 9.2).

**Key Point 9.2** Volume‑controlled ventilation with constant flow produces a rectangular flow curve, which can be changed by selecting a different flow waveform. During pressure‑controlled ventilation the flow waveform is a descending curve that varies with both lung characteristics and patient flow demand.

During volume‑controlled ventilation, the pressure scalar resembles an ascending ramp, or a *rising exponential curve*. During pressure‑controlled ventilation, it is rectangular, assuming T<sub>I</sub> is long enough. (See the section on monitoring pulmonary mechanics for additional information.)

</div></details>

<details class="med-details"><summary>

### Determining the Mode of Ventilation</summary><div class="details-content">

Scalars can also be used to identify the mode of ventilation being used. By carefully examining the pressure and flow scalars, it is possible to determine whether mandatory, spontaneous, or IMV is being used. [Fig. 9.9](#fig-9-9) illustrates the flow, pressure, and volume scalars for mandatory and spontaneous breaths during IMV. [Fig. 9.10](#fig-9-10) also demonstrates flow, pressure, and volume scalars during IMV; however, careful examination of the spontaneous breaths shows that the spontaneous breaths are not being pressure supported. (Case Study 9.1 provides an example illustrating how ventilator graphics can be used to identify the mode of ventilation being used.)

<span id="fig-9-9"></span>![](./_page_6_Figure_3.jpeg)

**FIGURE 9.9** Flow (top), pressure (middle), and volume (bottom) scalars during volume‑controlled intermittent mandatory ventilation (VC‑IMV) with pressure support ventilation (PSV) and continuous positive airway pressure (CPAP). (From Hess DR, MacIntyre NR, Mishoe SC, et al.: *Respiratory care principles and practice*, Philadelphia, PA, 2002, WB Saunders.)

<span id="fig-9-10"></span>![](./_page_7_Figure_3.jpeg)

**FIGURE 9.10** Flow (top), pressure (middle), and volume (bottom) scalars during volume‑controlled intermittent mandatory ventilation (VC‑IMV) plus continuous positive airway pressure/positive end‑expiratory pressure (CPAP/PEEP). (See text for explanation.) (From Hess DR, MacIntyre NR, Mishoe SC, et al.: *Respiratory care principles and practice*, Philadelphia, PA, 2002, WB Saunders.)

<details class="med-details"><summary>

#### Case Study 9.1</summary><div class="details-content">

A patient is switched from PC‑CMV to PC‑IMV to promote respiratory muscle activity. Initially the patient does not exhibit a spontaneous breathing frequency, but spontaneous efforts are subsequently noted on pressure and flow scalars. Describe how you would differentiate patient‑triggered breaths and time‑triggered breaths. (Hint: What type of breaths are the arrows indicating?)

</div></details>

</div></details>

<details class="med-details"><summary>

### Components of the Pressure‑Volume Loop</summary><div class="details-content">

Pressure‑volume (P‑V) loops can be used to monitor changes in lung compliance (C<sub>L</sub> = ΔV/ΔP) and airway resistance. [Fig. 9.11](#fig-9-11) shows a typical P‑V loop generated during a positive pressure breath. This breath is time triggered by the ventilator rather than patient triggered. It is important to recognize that the P‑V loop is drawn in a counterclockwise direction when a ventilator breath is delivered. Notice also that the inspiratory and expiratory curves are not perfect arcs. The maximum pressure shown on the *x* axis is the peak inspiratory pressure (PIP), and the maximum volume reached on the *y* axis is the V<sub>T</sub>.

<span id="fig-9-11"></span>![](./_page_7_Figure_5.jpeg)

**FIGURE 9.11** Typical pressure‑volume loop for a positive pressure breath. The loop represents the pressure and volume measured at the upper airway opening (P<sub>awo</sub>). The highest point for tidal volume (V<sub>T</sub> [*y* axis]) and peak inspiratory pressure (PIP [*x* axis]) represents the dynamic compliance for that pressure‑volume relationship.

[Fig. 9.12](#fig-9-12) provides additional information regarding pressure gradients that can be determined using a P‑V loop. The *solid line* of the loop represents pressure at the airway opening (P<sub>awo</sub>) during a V<sub>T</sub>. The *dashed line* represents the static P‑V line, which reflects the alveolar pressure (P<sub>alv</sub>) under no‑flow conditions. The transairway pressure (P<sub>TA</sub>), or flow‑resistive pressure, is the difference between the P<sub>alv</sub> and P<sub>awo</sub>. P<sub>TA</sub> is represented by a *double‑headed arrow* in this figure. Try to determine the values for PIP, V<sub>T</sub>, P<sub>TA</sub>, and peak P<sub>alv</sub> for the P‑V loop shown in [Fig. 9.12](#fig-9-12).

<span id="fig-9-12"></span>![](./_page_7_Figure_9.jpeg)

**FIGURE 9.12** P‑V loop showing the peak inspiratory pressure (PIP), pressure at the airway opening (P<sub>awo</sub>), alveolar pressure (P<sub>alv</sub>), and transairway pressure (P<sub>TA</sub>). (See text for additional information.)

</div></details>

<details class="med-details"><summary>

### Spontaneous Breaths and Pressure‑Volume Loops</summary><div class="details-content">

The clinician can learn to distinguish mandatory breaths from spontaneous breaths by observing the way the P‑V loop is generated during breath delivery. When a patient makes a spontaneous inspiration, the P‑V loop tracks in a clockwise fashion ([Fig. 9.13](#fig-9-13)). This is the reverse of a positive pressure breath, which creates a counterclockwise tracing (as shown in [Fig. 9.11](#fig-9-11)).

<span id="fig-9-13"></span>![](./_page_8_Figure_3.jpeg)

**FIGURE 9.13** Pressure‑volume loop recorded during a spontaneous, unsupported breath. No continuous positive airway pressure (CPAP) or pressure support ventilation (PSV) is delivered. Arrow *A* indicates inspiration, and arrow *B* indicates expiration. (Modified from Puritan Bennett: Waveforms: the graphical presentation of ventilator data, form AA‑1594 [2/91], Pleasanton, CA, 1991, Puritan Bennett Tyco.)

Now look at [Fig. 9.14](#fig-9-14), which shows the P‑V loop for a patient‑triggered mandatory breath. When the patient breathes in spontaneously, the curve moves to the left (clockwise), reflecting the patient’s effort. As the positive pressure from the ventilator is triggered, the curve crosses to the right and is traced in a counterclockwise fashion, which indicates that the machine is doing the work.

<span id="fig-9-14"></span>![](./_page_8_Figure_5.jpeg)

**FIGURE 9.14** Pressure‑volume loop for a patient‑triggered breath during pressure‑controlled continuous mandatory ventilation (PC‑CMV). Notice that part of the curve moves to the left of the *y* axis, reflecting a drop in pressure during inspiration (pressure value becomes negative); the curve traces to the right of the *y* axis as the ventilator delivers a positive pressure breath (pressure value becomes positive).

</div></details>

<details class="med-details"><summary>

### Components of the Flow‑Volume Loop</summary><div class="details-content">

[Fig. 9.15](#fig-9-15) illustrates a typical flow‑volume (F‑V) loop recorded during a positive pressure breath. Inspiratory flow appears above the baseline, and expiratory flow is below the baseline. (NOTE: This is the reverse of the way F‑V loops are usually reported for spirometry obtained during a standard laboratory pulmonary function test.) PEFR is the highest value on the expiratory flow curve. What is the PEFR in [Fig. 9.15](#fig-9-15)? What type of flow waveform is the ventilator delivering? What is the set inspiratory flow?*

<span id="fig-9-15"></span>![](./_page_8_Figure_7.jpeg)

**FIGURE 9.15** Normal F‑V loop during volume‑controlled ventilation. The inspiratory curve is on the top, and the expiratory curve is on the bottom. Note the linear change in expiratory flow from peak to end expiration. Also, the end‑expiratory flow is zero. (From Kacmarek RM, Hess D, Stoller JK: *Monitoring in respiratory care*, St. Louis, MO, 1993, Mosby.)

*PEFR is approximately 70 L per minute (LPM), flow pattern is square, and inspiratory flow is approximately 55 LPM.

</div></details>

<details class="med-details"><summary>

### Summary: Normal Scalars, Loops, and Curves</summary><div class="details-content">

With the diagnostic use of scalars, P‑V, and F‑V loops, several key points should be reiterated:
- Scalars can be used to identify the phases and characteristics of mechanical ventilatory breaths including PIP, PEEP, peak flow, expiratory flow, and patient‑triggered and time‑triggered breaths.
- The contour of the flow pattern identifies the type of preset flow for volume‑controlled breaths and when viewed with the pressure pattern, volume‑controlled breaths can be differentiated from pressure‑controlled breaths.
- In addition to identifying the breath type, scalars are useful in identifying the mode of ventilation.
- P‑V curves can be an effective method to monitor pulmonary compliance and airway resistance.
- F‑V loops can be a useful way to show the PEFR and inspiratory flow.

</div></details>

</div></details>

<details class="med-details"><summary>

## USING GRAPHICS TO MONITOR PULMONARY MECHANICS</summary><div class="details-content">

Most intensive care unit (ICU) ventilators have the capability of measuring and displaying digital calculations of pulmonary compliance and airway resistance. [Fig. 9.16](#fig-9-16) illustrates the flow, pressure, and volume scalars obtained during an inspiratory pause with a patient on VC‑CMV.

<span id="fig-9-16"></span>![](./_page_8_Figure_12.jpeg)

**FIGURE 9.16** Flow, pressure, and volume scalars during volume‑controlled continuous mandatory ventilation (VC‑CMV) with constant flow and an inspiratory pause. (See text for explanation.)

Look first at the inspiratory portion of the pressure‑time curve. Notice that the baseline pressure is 5 cm H₂O, indicating that 5 cm H₂O of PEEP is being used. (It is important to recognize that although the baseline pressure is positive, the flow and volume curves start from a zero baseline and end at a zero baseline.) Now observe the flow scalar during the inspiratory pause. Compare the flow and volume scalars at the same moment in time. Notice that when no flow occurs, there is no volume delivery. The volume curve also looks as if it has a pause, or plateau (Key Point 9.3).

**Key Point 9.3** When flow drops to zero at the end of inspiration, an inspiratory pause is present. When flow is zero, the pressure gradient between the ventilator and the patient’s lungs is the same.

P‑V loops can be used to assess changes in pulmonary mechanics. In [Fig. 9.17](#fig-9-17), line *AB* (peak P<sub>alv</sub>) represents the pressure‑volume relationship of the normal lung under static (no‑flow) conditions; that is, it is the P<sub>alv</sub> during static conditions. *C* represents the elastic component of the lungs and chest wall (see [Fig. 9.17](#fig-9-17)). Triangle *ABE* represents the amount of mechanical work required to overcome the elastic resistance of the lungs and chest wall. For a given amount of pressure applied to the lungs, a certain volume results. When flow is present, the direct (straight‑line) relationship no longer exists; rather, as seen in previous P‑V loops, the line curves during inspiration and expiration.

A certain amount of pressure is required during inhalation (see curve *ACB* in [Fig. 9.17](#fig-9-17)) and exhalation (curve *BDA*) to overcome the resistance of the airways and the tissues. These curves represent the nonelastic (frictional) forces opposing ventilation. Force (pressure) is applied to the lung by the action of the ventilator, but a slight lag time elapses before the volume actually increases. The area between curves *ACB* (the inspiratory curve) and *ADB* (the expiratory curve) is the result of **hysteresis** (Box 9.2). For any given lung volume, the elastic recoil in the lungs is less during exhalation than during inhalation.

The total mechanical work of breathing (WOB) is the sum of triangle *ABE* and curve *ACB*. Recall from physics that work equals force times distance. (In respiratory physiology, force is expressed as pressure and distance is expressed as volume.) In the lungs this translates to WOB, which approximately equals the pressure required to ventilate the lungs times the volume the lungs accumulate (WOB = P × V). The inspiratory work resulting from airway resistance (R<sub>aw</sub>) and partly from tissue resistance is curve *ACB*. The expiratory work is represented by curve *ADB*. Chapter 10 provides more information on the monitoring of WOB; it also reviews the pressure‑time product and the use of transdiaphragmatic pressure monitoring as a technique for estimating WOB.

<span id="fig-9-17"></span>![](./_page_9_Figure_3.jpeg)

**FIGURE 9.17** P‑V loop for a normal lung. Line *AB* represents compliance or the pressure‑volume relation of the lung under static (no flow) conditions. Curve *ACB* is inspiration. Curve *BDA* is expiration. Blue shaded area *ABE* denotes work to overcome the elastic resistance of the lungs alone. Cross‑hatched area *ACB* represents work performed to overcome nonelastic airflow resistance during inspiration. Area *ABD* represents airflow resistance during exhalation. The sum of the latter two areas represents the resistive work of breathing in one breath. Note that work is not performed during a normal exhalation. P<sub>A</sub>, Alveolar pressure. (Modified from Dupuis Y: *Ventilators: theory and clinical application*, ed 2, St. Louis, MO, 1992, Mosby.)

##### BOX 9.2 Hysteresis

*Hysteresis* can be thought of as a lagging of one of two associated phenomena; that is, two associated phenomena fail to coincide or occur simultaneously. An example of hysteresis is the difference between the inspiratory and expiratory curves in a pressure‑volume loop for the lungs, as shown in Fig. 9.12.

During positive pressure ventilation for less compliant (stiffer) lungs, greater pressure is required to achieve a given volume. The P‑V loop therefore tends to flatten ([Fig. 9.18](#fig-9-18)). Examples of lung conditions demonstrating reduced compliance include fibrotic diseases of the lung and conditions that flood the alveoli with fluids (e.g., pulmonary edema, pneumonia, and acute respiratory distress syndrome [ARDS]). Reduced compliance is also seen in conditions in which the alveoli are deflated (e.g., atelectasis). It is important to understand that as compliance decreases, airway pressure increases, but volume delivery remains constant during volume‑targeted ventilation.

<span id="fig-9-18"></span>![](./_page_9_Figure_10.jpeg)

**FIGURE 9.18** Changes in the P‑V loop during volume‑targeted ventilation as lung compliance changes. Volume delivery remains constant, but peak inspiratory pressure (PIP) changes. (From Dhand R: Ventilator graphics and respiratory mechanics in the patient with obstructive lung disease, *Respir Care* 50:246‑261, 2005.)

Compared with volume‑targeted ventilation, lung volume decreases, whereas pressure remains at the preset level during a pressure‑targeted breath as compliance changes ([Fig. 9.19](#fig-9-19)).

<span id="fig-9-19"></span>![](./_page_10_Figure_3.jpeg)

**FIGURE 9.19** P‑V loops during pressure ventilation. As compliance changes, volume delivery changes, but pressure delivery remains constant. (From Dhand R: Ventilator graphics and respiratory mechanics in the patient with obstructive lung disease, *Respir Care* 2005;50:246‑261.)

Pressure‑volume curves can also reflect changes in airway resistance. Notice in the P‑V curve in [Fig. 9.17](#fig-9-17), the *dashed line* dividing the curve into an inspiratory and expiratory component. The width of each component reflects the resistive forces during the respective phase of ventilation. Now compare the width of the P‑V curve shown in [Fig. 9.20](#fig-9-20) with that of a P‑V curve with normal resistance (see [Fig. 9.17](#fig-9-17)). Note how the width of the curve increases but the compliance (*slope of the isoflow line*) remains normal.

<span id="fig-9-20"></span>![](./_page_10_Figure_5.jpeg)

**FIGURE 9.20** Airway P‑V loop recorded in a patient with chronic obstructive pulmonary disease (COPD) during controlled ventilation. Note the increased nonelastic inspiratory and expiratory work (widening of the loop) and the shift of the dynamic compliance curve (P‑V loop) upward and to the left. PIP, Peak inspiratory pressure. (From Kacmarek RM, Hess D, Stoller JK: *Monitoring in respiratory care*, St. Louis, MO, 1993, Mosby.)

Flow‑volume loops are routinely used in a pulmonary function laboratory to assess changes in airway resistance. [Fig. 9.21](#fig-9-21) illustrates one of the most valuable uses of the F‑V loop, evaluating R<sub>aw</sub>. Loop *A* in [Fig. 9.21](#fig-9-21) reflects normal R<sub>aw</sub> during volume ventilation with a constant flow and a normal compliance. Loops *B* and *C* show the effects of increasing R<sub>aw</sub>. The inspiratory F‑V curve is not significantly affected because the ventilator is set to deliver a constant flow (50 L/min) and volume (about 530 mL). However, PEFR progressively decreases as R<sub>aw</sub> increases.

<span id="fig-9-21"></span>![](./_page_10_Figure_10.jpeg)

**FIGURE 9.21** F‑V loops showing volume‑targeted breaths with a constant flow but changing airway resistance (*compliance constant*). Loop *A* shows a normal R<sub>aw</sub>. Loops *B* and *C* represent progressively increasing R<sub>aw</sub>. Note the drop in expiratory flow and peak expiratory flow rate (PEFR) as airway resistance increases.

A reduction in PEFR is most often associated with airway obstruction (e.g., secretions and bronchospasm). [Fig. 9.22](#fig-9-22) shows examples of F‑V curves that would be obtained in patients with increased airway resistance, such as in a patient with chronic obstructive pulmonary disease (COPD). Note the scooped‑out appearance of the expiratory curve.

<span id="fig-9-22"></span>![](./_page_10_Figure_12.jpeg)

**FIGURE 9.22** F‑V loop during volume ventilation in a patient with chronic obstructive pulmonary disease (COPD). Note the diminished peak expiratory flow and the scooped‑out *(concave)* shape of the expiratory F‑V curve. (NOTE: The flow scale is 0 to 30 L/min during inspiration and 0 to –20 L/min during exhalation.) The clinician must make sure to check the scale when reading graphs. Inspiration *(top)* and expiration *(bottom)*. (From Kacmarek RM, Hess D, Stoller JK: *Monitoring in respiratory care*, St. Louis, MO, 1993, Mosby.)

The F‑V loops are helpful for evaluating a patient’s response to bronchodilator therapy. [Fig. 9.23](#fig-9-23) shows two flow‑volume loops that reflect a patient’s response to an aerosol treatment with a β‑adrenergic agent (e.g., albuterol). Note the improvement in expiratory flow. In the inner loop, a high expiratory flow can be seen at the start of expiration; this spike in flow is an artifact that reflects the release of gas trapped in the patient circuit during inspiration. The clinician can confirm this finding clinically by noting whether the corrugated tubing of the patient circuit “exhales” at the start of expiration.

<span id="fig-9-23"></span>![](./_page_11_Figure_3.jpeg)

**FIGURE 9.23** Two F‑V loops produced during volume ventilation (constant flow waveform). The inner loop indicates increased airway resistance. The outer loop represents the patient’s response to bronchodilator therapy. Note the improvement in expiratory flow. (NOTE: The high expiratory flow spike in the lower right corner of the inner loop results from gas decompression of the patient circuit. The initial expiratory flow spike is an artifact and represents release of the volume of gas trapped in the patient circuit at the beginning of the breath.) (Redrawn from Nilsestuen JO, Hargett K: Managing the patient‑ventilator system using graphic analysis: an overview and introduction to Graphics Corner, *Respir Care* 41:1105‑1122, 1996.)

</div></details>

<details class="med-details"><summary>

## ASSESSING PATIENT‑VENTILATOR ASYNCHRONY</summary><div class="details-content">

Patient‑ventilator asynchrony has been identified as one of the major issues in the management of patients on ventilation. As discussed in Chapter 18, asynchrony can be simply defined as a mismatching between the patient’s ventilatory drive and the response of the ventilator (Key Point 9.4). One type of asynchrony may occur at the onset of breath when the ventilator either delivers a premature breath or fails to recognize a patient effort. These situations are often referred to as trigger asynchrony ([Fig. 9.24](#fig-9-24)).

**Key Point 9.4** Asynchrony is a mismatching between the patient’s ventilatory drive and the response of the ventilator.

<span id="fig-9-24"></span>![](./_page_11_Figure_6.jpeg)

**FIGURE 9.24** Ventilator graphic demonstrating trigger asynchrony. Notice that the *arrows* point to a change in baseline pressure and flow without a response from the ventilator. This situation is often seen if the ventilator’s sensitivity is set too low.

Trigger asynchrony can also be assessed using a P‑V loop. [Fig. 9.25A](#fig-9-25) shows how the patient’s inspiratory effort results in a considerable reduction in pressure below the PEEP level, creating the characteristic “fish tail” appearance. In [Fig. 9.25B](#fig-9-25), trigger sensitivity has been adjusted, resulting in an improved trigger synchrony.

<span id="fig-9-25"></span>![](./_page_11_Figure_8.jpeg)

**FIGURE 9.25** Pressure‑volume loops illustrating trigger asynchrony. (A) Deflection below the set level of PEEP, indicating increased patient effort to trigger a breath. (B) Trigger sensitivity has been adjusted, resulting in a minimal effort to initiate the breath.

In [Fig. 9.26](#fig-9-26) the arrows are pointing at a premature initiation of a breath independent of time or patient effort. This is often referred to as “autotriggering” and may be caused by too sensitive a trigger setting or a leak in the patient‑ventilator circuit. A convenient method to differentiate an inappropriately set trigger sensitivity resulting in autotriggering from a leak is to observe the P‑V and F‑V tracings as shown in [Fig. 9.27](#fig-9-27)A and B.

<span id="fig-9-26"></span>![](./_page_11_Figure_10.jpeg)

**FIGURE 9.26** Pressure and flow scalars showing the effects of “autotriggering.”

<span id="fig-9-27"></span>![](./_page_12_Figure_3.jpeg)

**FIGURE 9.27** Pressure‑volume loop (A) and flow‑volume loop (B) indicating an air leak.

Asynchrony can also occur when inspiratory flow from the ventilator does not match the patient’s demands (i.e., flow asynchrony) or when the patient wants inspiration to end but the ventilator fails to cycle to exhalation (i.e., cycle asynchrony). Flow asynchrony can occur when the set flow rate, as in volume control ventilation, is insufficient to meet the patient’s inspiratory demands. Notice the deflection (arrows) in the pressure scalar midway through inspiration, which creates an M‑shaped pressure pattern associated with flow asynchrony ([Fig. 9.28A](#fig-9-28)). Remedies for flow asynchrony may include increasing the set flow in volume‑targeted ventilation, changing to a pressure‑targeted breath, switching to hybrid breath type such as volume control plus (VC+), pressure‑regulated volume control (PRVC), or autoflow. [Fig. 9.28B](#fig-9-28) illustrates the flow scalar changes that occur when the patient was switched to VC+. Notice how the delivered flow rate changes between the first and second breaths in response to patient demand and flow asynchrony is avoided (see [Fig. 9.28B](#fig-9-28)).

<span id="fig-9-28"></span>![](./_page_12_Figure_5.jpeg)

**FIGURE 9.28** (A) Pressure and flow scalars demonstrating flow asynchrony. (B) After the patient was switched to volume control plus (VC+), the contour of the pressure pattern became stable (*first breath*). Notice how the delivered flow rate changed between the first and second breath in response to patient demand and flow asynchrony is avoided.

Failure to cycle or termination asynchrony often results in an inappropriate set T<sub>I</sub> during a mandatory breath or an incorrect flow termination level on a spontaneous breath. [Fig. 9.29](#fig-9-29) is an example of cycle asynchrony. The arrow points to a rise in PIP at the end of inspiration created by the patient actively exhaling to end inspiration.

<span id="fig-9-29"></span>![](./_page_12_Figure_9.jpeg)

**FIGURE 9.29** Pressure, flow, and volume scalars illustrating a patient receiving 5 cm H₂O of pressure support. The patient’s neural timing precedes the end of the mechanical inflation and results in a pressure spike (*large arrow*) on the pressure waveform. Note the rapid decline in the inspiratory flow waveform at the end of inspiration (*double arrows*) as a result of the patient’s active exhalation. (From Nilsestuen JO, Hargett KD: Using ventilator graphics to identify patient‑ventilator asynchrony, *Respir Care* 2005;50:202‑234.)

</div></details>

<details class="med-details"><summary>

## ADVANCED APPLICATIONS</summary><div class="details-content">

<details class="med-details"><summary>

### Auto‑PEEP and Air Trapping</summary><div class="details-content">

Auto‑PEEP, sometimes referred to as *intrinsic PEEP* or *air trapping*, occurs when the patient does not complete exhalation before the onset of the next breath. Chapter 17 discussed the causes, occurrence, and remedy in detail. [Fig. 9.30](#fig-9-30) indicates pressure and flow scalars for a patient demonstrating auto‑PEEP.

<span id="fig-9-30"></span>![](./_page_13_Figure_3.jpeg)

**FIGURE 9.30** Pressure and flow scalars demonstrating auto‑PEEP. The *arrows* on the flow scalar show how flow does not return to baseline before the beginning of the next breath.

Auto‑PEEP initially can be observed on a P‑V curve ([Fig. 9.31A](#fig-9-31)) and F‑V loop (see [Fig. 9.31B](#fig-9-31)). The characteristic finding is the appearance of an incomplete exhalation with the expiratory portion of the loop not returning to baseline (arrow). It is interesting to note that an air leak would look similar to auto‑PEEP.

<span id="fig-9-31"></span>![](./_page_13_Figure_7.jpeg)

**FIGURE 9.31** (A) Pressure‑volume loop demonstrating the presence of auto‑PEEP. (B) Flow‑volume loop demonstrating the presence of auto‑PEEP. Notice that the expiratory portion of the P‑V loop and the F‑V loop does not return to baseline.

</div></details>

<details class="med-details"><summary>

### Titrating PEEP</summary><div class="details-content">

Several methods can be used to correctly set PEEP, including observing changes in P‑V loops as PEEP levels are changed. As previously discussed, the slope of the isoflow line reflects lung‑thorax compliance (see [Fig. 9.19](#fig-9-19)). As shown in [Fig. 9.32](#fig-9-32), the slope of loop *A* is less than loop *B*, indicating that *B* represents a more compliant lung‑thorax unit. Careful examination of these two curves shows that curve *B* has a higher baseline (PEEP) level than curve *A*, demonstrating that the application of a higher PEEP level results in improved compliance.

<span id="fig-9-32"></span>![](./_page_13_Figure_15.jpeg)

**FIGURE 9.32** Pressure‑volume loops showing the effects of increasing levels of applied PEEP on lung‑thorax compliance. (A) Effects of 0 cm H₂O of applied PEEP (decreased compliance). (B) Effects of 5 cm H₂O of applied PEEP (increased compliance).

</div></details>

<details class="med-details"><summary>

### APRV Settings</summary><div class="details-content">

Airway pressure release ventilation (APRV) is often used as a lung recruitment mode of ventilation. One of the unique features of this mode is the inversing of high‑pressure time to that of low pressure. Graphics can be useful in determining the setting of high‑pressure and low‑pressure times to create a period of static flow (see Chapter 23). Additionally, this mode by design is often configured to generate auto‑PEEP ([Fig. 9.33](#fig-9-33)).

<span id="fig-9-33"></span>![](./_page_13_Figure_19.jpeg)

**FIGURE 9.33** Pressure and flow scalars for a patient receiving airway pressure release ventilation (APRV). Note the extended high‑pressure time, short low‑pressure period, and resulting auto‑PEEP. The *arrows* are pointed to the period of constant pressure with zero flow. This period is thought to promote recruitment of low compliant alveolar units.

Upper and lower inflection points can be used to determine the high and low PEEP settings in APRV. [Fig. 9.34](#fig-9-34) provides an example of how the upper and lower inflections points affect the pressure scalar and P‑V loop for during APRV.

<span id="fig-9-34"></span>![](./_page_14_Figure_3.jpeg)

**FIGURE 9.34** Ventilator graphics illustrating how the upper and lower inflection points for an airway pressure release ventilation (APRV) breath would appear for a pressure scalar and a P‑V loop. (Settings for APRV are often established by institutional protocol or through waveform analysis. See Chapter 23 for a detailed discussion on APRV.)

</div></details>

<details class="med-details"><summary>

### Integrated Ventilator and Esophageal Graphics</summary><div class="details-content">

Several ventilators provide an auxiliary pressure monitoring port that can be connected to an esophageal catheter. Esophageal pressure measurements may be employed to determine transpulmonary pressure (P<sub>TP</sub>), which can then be used to set plateau and PEEP pressures. Additionally, esophageal manometry is often used in conjunction with scalars to further identify patient‑ventilator asynchrony, as shown in [Fig. 9.35](#fig-9-35).

<span id="fig-9-35"></span>![](./_page_14_Figure_7.jpeg)

**FIGURE 9.35** Flow, air pressure (P<sub>aw</sub>), and esophageal pressure (P<sub>es</sub>) in a patient with chronic obstructive pulmonary disease (COPD) during PSV. *Dotted lines* indicate the beginning of an inspiratory effort that triggers ventilator gas flow. *Black arrows* in the P<sub>es</sub> curve indicate patient efforts that did not trigger ventilatory flow. Note the time delay between the beginning of the effort and ventilator triggering. Ineffective efforts occur during both mechanical inspiration and expiration. During inspiration, the *flow scalar* can be used to identify ineffective patient efforts and a rise in the inspiratory flow. During expiration, ineffective efforts are identified by *open arrows* showing a small convex shape in the flow curve. Note how no apparent change occurs in P<sub>aw</sub>. (From Kondili E, Prinianakis G, Georgopoulos D: New concepts in respiratory function, *Br J Anaesthesiol* 91:106‑119, 2003.)

</div></details>

<details class="med-details"><summary>

### Assessing Overdistention During Pressure‑Controlled Ventilation</summary><div class="details-content">

Determining the appropriate amount of pressure to use with PC‑CMV or PC‑IMV can often be a challenging procedure. Although V<sub>T</sub> delivery should be a primary criterion when setting the rise in pressure above baseline (PC + PEEP), often a secondary criterion can be used to avoid overdistention of the lung. [Fig. 9.36](#fig-9-36) illustrates how ventilator graphics can be used to set ventilation parameters. Just as graphics can be used to set baseline pressures, they also can aid in determining the appropriate pressure level when a pressure‑controlled breath is delivered. Notice in [Fig. 9.36](#fig-9-36) how at the end of inspiration the P‑V loop flattens out, creating a pressure overshoot sometimes referred to as a “bird beak.” Compare the V<sub>T</sub> delivery at 15 cm H₂O of pressure with that of 18, and notice that there is little difference between the two pressure levels. When administering ventilation to a premature infant, keeping the peak pressures at a minimum is critical. In this case the PC level could be dropped to 15 with little effect on V<sub>T</sub> delivery.

<span id="fig-9-36"></span>![](./_page_14_Figure_11.jpeg)

**FIGURE 9.36** Pressure‑volume loop showing the effects of overdistention of the lung during pressure‑controlled intermittent mandatory ventilation (PC‑IMV).

[Fig. 9.37](#fig-9-37) was obtained from an adult patient receiving PC‑CMV. Again, notice the pressure overshoot creating a “bird beak” appearance on the P‑V loop. Point *B* represents the peak inspiratory pressure, and point *A* indicates the pressure at which V<sub>T</sub> delivery is optimized in terms of pressure. Note the difference in lung compliance between the two pressure levels indicating that pulmonary mechanics would be optimized at 20 cm H₂O of ventilating pressure.

<span id="fig-9-37"></span>![](./_page_15_Figure_3.jpeg)

**FIGURE 9.37** Pressure‑volume loop showing the effects of overdistention of the lung during pressure‑controlled intermittent mandatory ventilation (PC‑IMV). Point *A* indicates the pressure at which tidal volume delivery is optimized in terms of pressure. Point *B* represents the peak inspiratory pressure. *CWP*, Capillary wedge pressure.

</div></details>

<details class="med-details"><summary>

### Inspiratory Rise Time Control: Sloping or Ramping</summary><div class="details-content">

A pressure breath produces a high flow at the beginning of inspiration. With small‑diameter endotracheal tubes (i.e., increased R<sub>aw</sub>), the high flow through the narrow opening creates turbulence. As a result, a pressure overshoot can occur at the beginning of the pressure curve before the pressure adjusts to the set value.

If the flow and pressure delivery are tapered at the start of inspiration, the waveform can be adjusted to reduce this overshoot. Most current acute care ventilators have a function that can taper the flow during pressure ventilation. When tapering is used, the pressure curve may no longer be constant but may be tapered at the beginning of the breath.

Inspiratory flow delivery during PC‑CMV can therefore be adjusted with an inspiratory rise time control, also called a *slope control* ([Fig. 9.38](#fig-9-38)).

<span id="fig-9-38"></span>![](./_page_15_Figure_9.jpeg)

**FIGURE 9.38** Changes in the gas delivery system produced by adjusting the pressure slope, or rise time function, during pressure‑targeted ventilation. (See text for additional information.) (Redrawn from Nilsestuen JO, Hargett K: Managing the patient‑ventilator system using graphic analysis: an overview and introduction to Graphics Corner, *Respir Care* 41:1105‑1122, 1996.)

</div></details>

<details class="med-details"><summary>

### Flow Cycling During Pressure Support Ventilation</summary><div class="details-content">

The normal flow‑cycling mechanism of pressure support ventilation (PSV) is discussed in Chapters 3 and 5. Flow cycling occurs when the ventilator detects a decreasing flow, which represents the end of inspiration. The ventilator’s software determines the point at which flow cycling occurs; in most ventilators this point is a percentage of the peak flow measured during inspiration.

Unfortunately, no single flow cycle percentage is ideal for all patients. Patients with COPD or increased R<sub>aw</sub> have a slower flow rate drop‑off during inspiration with pressure ventilation than do patients with normal R<sub>aw</sub>. Because flow does not drop normally, patients with COPD are more comfortable with a higher flow cycle percentage (e.g., 40%). The clinician can determine the appropriate cycling criterion by evaluating the P‑T curve during PSV. If an active rise in pressure occurs at end inspiration, the flow cycle percentage may be increased to reduce the amount of expiratory work the patient must perform.

The graphics in [Fig. 9.39](#fig-9-39) show two flow cycle percentages. What is the peak flow in *A*? What is the flow value where inspiratory flow ends? What is the approximate flow cycle percentage?* What is the peak flow in *B*? What is the flow value at which inspiratory flow ends? What is the approximate flow cycle percentage in *B*?†

<span id="fig-9-39"></span>![](./_page_15_Figure_15.jpeg)

**FIGURE 9.39** Effect of changes in termination flow during PSV. (A) A low‑percentage flow cycle is set so that inspiratory time (T<sub>I</sub>) is longer. (B) A higher‑percentage flow cycle is set so that T<sub>I</sub> is shorter. (See text for additional explanation.) (From Hess DR, MacIntyre NR, Mishoe SC, et al.: *Respiratory care principles and practice*, Philadelphia, PA, 2002, WB Saunders.)

*Peak flow in A is 60 L/min. Inspiratory flow ends at ~10 L/min, flow cycle percentage ≈ 17%.
†Peak flow in B is also 60 L/min. Inspiratory flow ends at ~30 L/min, flow cycle percentage ≈ 50%.

<details class="med-details"><summary>

#### Case Study 9.2</summary><div class="details-content">

A patient receiving PC‑CMV demonstrates auto‑PEEP on several breaths on the flow scalar (see arrow in [Fig. 9.40](#fig-9-40), A). The therapist recommends a change in the inspiratory time setting to increase expiratory time. After 5 minutes on the new settings the following flow scalar was seen (see [Fig. 9.40](#fig-9-40), B). Does the flow scalar show any evidence that the change reduced the level of auto‑PEEP? Note that the expiratory flow now reaches zero (see arrow) before the onset of the next breath, indicating that the change reduced the level of auto‑PEEP.

<span id="fig-9-40"></span>![](./_page_16_Figure_3.jpeg)

**FIGURE 9.40** Flow scalars for a patient showing the presence of auto‑PEEP. See Case Study 9.2 for additional details.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## SUMMARY</summary><div class="details-content">

- Modern microprocessor ventilators provide graphic waveforms, including flow, volume, and pressure scalars and pressure‑volume and flow‑volume loops.
- Ventilator graphics can be used to monitor ventilator function, evaluate a patient’s response to the ventilator, and help the clinician adjust ventilator settings.
- It is important to comprehend how the ventilator measures, computes, and displays various parameters. Clinicians must also study actual ventilator graphics to fully understand the usefulness of this application.
- The scalars most often displayed on the ventilator screen are P<sub>aw</sub>, flow, and V.
- Pressure and flow scalars can provide an effective tool for identifying the PIP, PEFR, presence of leaks in the patient circuit, and auto‑PEEP during VC‑CMV.
- The flow waveform during volume‑targeted ventilation may be set as rectangular or descending, although it is by default a descending waveform in pressure‑targeted ventilation.
- The pressure waveform varies with changes in static lung compliance (C<sub>S</sub>) and R<sub>aw</sub> during volume‑targeted ventilation.
- During pressure‑targeted ventilation, changes in C<sub>S</sub> and R<sub>aw</sub> will affect the flow and volume waveforms.
- As lung characteristics deteriorate, the pressure delivered to a patient during PSV remains constant but the delivered volume may decrease.
- Pressure‑volume loops can alert the clinician to changes in a patient’s lung compliance, airway resistance, and work of breathing.
- Pressure and flow scalars are useful to detect patient‑ventilator asynchrony.
- Flow‑volume loops allow the clinician to evaluate a patient’s response to bronchodilator therapy during mechanical ventilation. These loops can also be used to detect leaks and auto‑PEEP.

</div></details>

<details class="med-details"><summary>

## REVIEW QUESTIONS</summary><div class="details-content">

*(See Appendix A for answers.)*

1. Refer to the scalars for pressure, flow, and volume in pressure support ventilation (PSV) in the figure below to answer the following questions.
   - A. What caused the pressure spike indicated by arrow A on the pressure‑time waveform?
   - B. What ventilator parameter might be adjusted to eliminate this problem?
   - C. What caused the flow waveform during exhalation indicated by arrow B?
   - D. What parameters might be adjusted on the ventilator to eliminate this problem?
   - E. What pulmonary change is suggested by the exhalation volume waveform indicated by arrow C?
   - F. Is the flow cycle percentage set at a high or low percentage of peak flow?
   - G. Is there any indication of inadequate inspiratory flow?

   *(Refer to the figure in the original text)*

2. Use the scalars for a specific mode of ventilation in the figure below, A, to answer the following questions.
   - A. What target variable is illustrated?
   - B. What is the set pressure?
   - C. What is the delivered V<sub>T</sub>?
   - D. What is the P<sub>plat</sub>?
   - E. What problem is indicated by the volume‑time curve?

   *(Refer to the figure in the original text)*

3. The scalars in the figure in Question 1, B are for a different mode of ventilation from that in the figure in Question 2, A. Use the scalars in part B to answer the following questions.
   - A. What is the target variable illustrated and how do you determine the mode?
   - B. What is the total cycle time?
   - C. Is the breath patient triggered or time triggered?
   - D. What problem is indicated by the pressure scalar?

4. Answer the following questions with regard to the scalars for VC‑CMV shown in the figure in Question 2, *C*.
   - A. What is the set flow?
   - B. Why is the flow delivery variable during inspiration?
   - C. What causes the change in flow delivery and how does this affect volume delivery?

5. Answer the following questions using the figure below.
   - A. What is the PIP?
   - B. What is the approximate delivered V<sub>T</sub>?
   - C. Has a PEEP been set?
   - D. What is the compliance?
   - E. What is the approximate P<sub>TA</sub> during inspiration as indicated by the double‑headed arrow? Is this normal?
   - F. From the appearance of this P‑V loop, what do you think is the patient’s primary problem?

   *(Refer to the P‑V loop figure in the original text)*

6. Answer the following questions using the figure below.
   - A. What is the target variable in this figure?
   - B. What are the flow setting and flow waveform?
   - C. What is the V<sub>T</sub> delivery?
   - D. What causes the artifact indicated by arrow A?
   - E. What does arrow B indicate?
   - F. What might be the cause of this patient’s pulmonary problem?

   *(Refer to the F‑V loop figure in the original text)*

7. A ventilator is set for volume‑targeted ventilation, constant flow, and control mode. What will happen to the PIP, P<sub>plat</sub>, T<sub>I</sub>, and V<sub>T</sub> if lung compliance (C<sub>L</sub>) decreases? (Assume that the pressure limit is not reached.)

8. A ventilator is set for pressure‑targeted ventilation, patient triggering, and time cycling. What will happen to the set pressure, T<sub>I</sub>, and V<sub>T</sub> if C<sub>L</sub> increases? (Assume that the pressure limit is not reached.)

9. A patient receiving pressure ventilation has a C<sub>L</sub> of 15 mL/cm H₂O (0.015 L/cm H₂O). The pressure is set at 35 cm H₂O. The ventilator is time cycled at 2 seconds. Flow drops to zero before the end of inspiration.
   - A. What will the P<sub>alv</sub> be?
   - B. What is an estimated volume delivery?
   - C. C<sub>L</sub> changes to 30 mL/cm H₂O with improvement in the patient’s lung condition. What will happen to the flow and volume delivery?
   - D. How would you change volume delivery to return it to its previous value?

10. What type of asynchrony is shown in the figures below?
    - A. Flow asynchrony
    - B. Trigger asynchrony
    - C. Termination asynchrony
    - D. Cycle asynchrony

    *(Refer to the figure in the original text)*

11. What would be your suggestion to resolve the problem shown in Question 10?
    - A. Increase PEEP.
    - B. Reduce inspiratory time.
    - C. Adjust trigger sensitivity.
    - D. Use a variable flow breath type.

</div></details>