# How a Breath Is Delivered

<details class="med-details"><summary>

## Executive Summary</summary><div class="details-content">

### Equation of Motion and Work of Breathing
* **Equation of motion:** P<sub>mus</sub> + P<sub>vent</sub> = V/C + (R<sub>aw</sub> × Flow). Left side = total pressure (muscle + ventilator); right side = elastic recoil (volume/compliance) + flow resistance (resistance × flow).
* **Transrespiratory pressure (P<sub>TR</sub>):** P<sub>alv</sub> – P<sub>bs</sub>. During spontaneous breathing, P<sub>mus</sub> generates the gradient; during mechanical ventilation, P<sub>vent</sub> (ventilator gauge pressure) provides the energy.
* **Work distribution:** Can range from all patient (spontaneous) to all ventilator (controlled). Assisted breaths combine both.

### Control Variables During Inspiration
* **Control variable:** The primary variable the ventilator adjusts (pressure, volume, flow, or time). Only one can be controlled at a time.
* **Pressure-controlled ventilation (PCV):** Clinician sets pressure; pressure waveform constant; volume and flow vary with lung mechanics. Also called pressure-targeted or pressure ventilation.
* **Volume-controlled ventilation (VCV):** Clinician sets volume; volume and flow waveforms constant; pressure varies with compliance/resistance. Also called volume-targeted or volume ventilation.
* **Flow-controlled ventilation:** Flow (and thus volume) waveform constant; pressure varies. Achieved via flowmeter or solenoid valve.
* **Time-controlled ventilation:** Pressure, volume, and flow vary; inspiratory/expiratory times fixed. Examples: high-frequency jet ventilation, oscillators.

### Waveform Shapes
* Four common waveforms: rectangular (square/constant), exponential (rising or decaying), sinusoidal (sine wave), ramp (ascending or descending decelerating ramp).

### Phase Variables
* **Trigger variable** (begins inspiration): Time triggering (set rate) or patient triggering (pressure, flow, volume, neural). Pressure trigger sensitivity typically –1 cm H₂O; flow triggering requires less work of breathing and is available on most ICU ventilators (e.g., Servo‑i, PB 840).
* **Limit variable** (restricts but does not end inspiration): Pressure limiting (e.g., high‑pressure limit vents excess gas, inspiration continues), volume limiting (fixed cylinder/piston volume), flow limiting (max flow set). Reaching limit does NOT cycle the breath.
* **Cycle variable** (ends inspiration): Volume cycling (set VT delivered), time cycling (fixed TI), flow cycling (flow drops to threshold – used in pressure support), pressure cycling (set pressure reached – may occur as safety feature).
* **Baseline variable** (expiratory phase): Usually pressure. Baseline = 0 (ZEEP) or positive (PEEP). Negative end‑expiratory pressure (NEEP) – historical.

### Inspiratory Pause (Inflation Hold)
* Delays expiratory valve opening after inspiration. Allows measurement of plateau pressure (P<sub>plat</sub>), used for static compliance calculation. Increases inspiratory time, reduces expiratory time.

### Expiratory Phase Considerations
* **Expiratory hold:** Pause at end‑exhalation to detect auto‑PEEP (intrinsic PEEP). Auto‑PEEP present if flow does not return to zero before next breath or if pressure measured during hold > set PEEP.
* **Expiratory retard:** Adds expiratory resistance (like pursed‑lip breathing) – historically used, now rarely applied clinically.
* **Continuous gas flow during expiration:** Reduces expiratory resistance, enables flow triggering.

### CPAP and PEEP
* **CPAP** (continuous positive airway pressure): Positive pressure throughout spontaneous breathing (inspiration and expiration).
* **PEEP** (positive end‑expiratory pressure): Positive baseline pressure during mechanical ventilation. Increases FRC, prevents alveolar collapse, improves oxygenation.
* **BiPAP (bilevel positive airway pressure):** Higher inspiratory positive airway pressure (IPAP) and lower expiratory positive airway pressure (EPAP); patient‑triggered, pressure‑targeted, flow‑ or time‑cycled.

### Types of Breaths
* **Spontaneous:** Patient triggers and cycles; ventilator does not determine volume or timing.
* **Mandatory:** Ventilator triggers (time) and/or cycles (volume or time).
* **Assisted:** Patient triggers inspiration, ventilator does part of the work (e.g., assist‑control mode).

</div></details>

<details class="med-details"><summary>

## BASIC MODEL OF VENTILATION IN THE LUNG DURING INSPIRATION</summary><div class="details-content">

One approach that can be used to understand the mechanics of breathing during mechanical ventilation involves using a mathematical model based on the **equation of motion**. This equation describes the relationships among pressure, volume, and flow during a spontaneous or mechanical breath. The equation includes three terms, which were previously defined in Chapter 1, namely P<sub>TR</sub>, or transrespiratory pressure; P<sub>E</sub>, or elastic recoil pressure; and P<sub>R</sub>, or flow resistance pressure. [Fig. 3.1](#fig-3-1) provides a graphic representation of each of these pressures.

<span id="fig-3-1"></span>![](./_page_2_Figure_5.jpeg)

**FIGURE 3.1** Equation of motion model. The respiratory system can be visualized as a conductive tube connected to an elastic compartment (balloon). Pressure, volume, and flow are variables and functions of time. Resistance and compliance are constants. Transthoracic pressure is the pressure difference between the alveolar space (P<sub>alv</sub>) or lung, and the body surface (P<sub>bs</sub>). (See text for further explanation.) (From Kacmarek RM, Stoller JK, Heuer AJ, editors: *Egan's fundamentals of respiratory care*, ed 12, St. Louis, MO, 2021, Elsevier.)

Box 3.1 summarizes the factors that influence the movement of air into lungs. Notice that the left side of the equation of motion shown in Box 3.1 represents the transrespiratory pressure (P<sub>TR</sub>), which is the energy (i.e., pressure) required to establish a pressure gradient to move gas into the lungs. The P<sub>TR</sub> can be achieved by contraction of the respiratory muscles (P<sub>mus</sub>) during a spontaneous breath or generated by the ventilator (P<sub>vent</sub>) during a mechanical breath. The right side of the equation shows factors that influence the impedance that must be overcome to move air into the lungs. Elastic recoil pressure (P<sub>E</sub>) is the elastic load offered by the lungs and chest wall and the flow resistance pressure or airway resistance (P<sub>R</sub>) produced as gas flows through the conducting airways. Note that elastance can be defined as the ratio of pressure change to volume change (i.e., elastance is the inverse of compliance). Flow resistance is defined as the ratio of pressure change to the flow of gas into the lungs. As described in Box 3.1, the transrespiratory pressure therefore equals the pressure that must be generated to overcome the elastance (or compliance) of the lungs and chest wall plus the flow resistance required to move gas into the lungs. During a spontaneous breath, the inspiratory muscles (i.e., diaphragm and external intercostal muscles) contract, causing enlargement of the lungs and thorax. As discussed in Chapter 1, this increase in lung volume results in a decrease (more negative) in intrapleural pressure and an increase in transrespiratory pressure (P<sub>TR</sub> = P<sub>alv</sub> – P<sub>pl</sub>). The pressure gradient established by contraction of the inspiratory muscles (i.e., muscle pressure [P<sub>mus</sub>]) during a spontaneous breath therefore provides the energy to overcome the impedance (lung and chest wall elastance + airway resistance) to move air into the lungs.

If the respiratory muscles are inactive, a mechanical ventilator can be used to provide the energy required to establish the pressure gradient required to move gas into the lungs by generating a positive pressure (P<sub>vent</sub>) at the airway opening. The ventilator pressure (P<sub>vent</sub>) generated during inspiration therefore represents the transrespiratory pressure (P<sub>TR</sub>) required to overcome the impedance offered by the respiratory system (i.e., the ventilator performs all of the work required to move air into the lungs).

It is important to recognize that the two examples cited previously represent the extremes of a continuum. During spontaneous ventilation, the patient provides the energy required to pull gas into the lungs, whereas in the latter example the ventilator provides all of the energy to push the gas into the patient's lungs. Keep in mind that an infinite number of combinations of P<sub>mus</sub> and P<sub>vent</sub> can be used to achieve the total force required during assisted ventilation.

##### BOX 3.1 Equation of Motion

P<sub>mus</sub> + P<sub>vent</sub> = P<sub>E</sub> + P<sub>R</sub>

where Muscle pressure + Ventilator pressure = Elastic recoil pressure + Flow resistance pressure.

If one considers that:

Elastic recoil pressure = Elastance × Volume = Volume/Compliance (V/C), and

Flow resistance pressure = Resistance × Flow = (R<sub>aw</sub> × V̇)

Then the equation can be rewritten as follows:

P<sub>mus</sub> + P<sub>vent</sub> = V/C + (R<sub>aw</sub> × V̇)

P<sub>mus</sub> is the pressure generated by the respiratory muscles (muscle pressure). If these muscles are inactive, P<sub>mus</sub> = 0 cm H<sub>2</sub>O, then the ventilator must provide the pressure required to achieve an inspiration.

P<sub>vent</sub>, or more specifically P<sub>TR</sub>, is the pressure read on the ventilator gauge (manometer) during inspiration with positive pressure ventilation (i.e., the ventilator gauge pressure). V is the volume delivered, C is respiratory system compliance, V/C is the elastic recoil pressure, R<sub>aw</sub> is airway resistance, and V̇ is the gas flow during inspiration (R<sub>aw</sub> × V̇ = Flow resistance).

Because P<sub>alv</sub> = V/C and P<sub>TA</sub> = R<sub>aw</sub> × V̇, substituting in the above equation results in:

P<sub>mus</sub> + P<sub>TR</sub> = P<sub>alv</sub> + P<sub>TA</sub>

where P<sub>alv</sub> is the alveolar pressure and P<sub>TA</sub> is the transairway pressure (peak pressure minus plateau pressure [PIP – P<sub>plat</sub>]) (see Chapter 1 for further explanation of abbreviations).

</div></details>

<details class="med-details"><summary>

## FACTORS CONTROLLED AND MEASURED DURING INSPIRATION</summary><div class="details-content">

Delivery of an inspiratory volume is perhaps the single most important function a ventilator accomplishes. Two factors determine the way the inspiratory volume is delivered: the structural design of the ventilator and the ventilator **mode** set by the clinician. The clinician sets the mode by selecting either a predetermined pressure or volume as the target variable (Box 3.2).

The primary variable the ventilator adjusts to achieve inspiration is called the **control variable** (Key Point 3.1). As the equation of motion shows, the ventilator can control four variables: pressure, volume, flow, and time. It is important to recognize that the ventilator can control only one variable at a time. Thus, a ventilator can operate as a pressure controller, a volume controller, a flow controller, or a time controller (Box 3.3).

##### BOX 3.2 Common Methods of Delivering Inspiration

**Pressure-Controlled Ventilation**

The clinician sets a pressure for delivery to the patient. Pressure-controlled ventilation is also called:
- Pressure-targeted ventilation
- Pressure ventilation

**Volume-Controlled Ventilation**

The clinician sets a volume for delivery to the patient. Volume-controlled ventilation is also called:
- Volume-targeted ventilation
- Volume ventilation

**Key Point 3.1** The primary variable that the ventilator adjusts to produce inspiration is the control variable. The most commonly used control variables are pressure and volume.

##### BOX 3.3 Ventilator Control Functions During Inspiration

- **Pressure controller:** The ventilator maintains the same pressure waveform at the mouth regardless of changes in lung characteristics.
- **Volume controller:** Ventilator volume delivery and volume waveform remain constant and are not affected by changes in lung characteristics. Volume is measured.*
- **Flow controller:** Ventilator volume delivery and flow waveform remain constant and are not affected by changes in lung characteristics. Flow is measured.*
- **Time controller:** Pressure, volume, and flow curves can change as lung characteristics change. Time remains constant.

\*Volume delivery by current-generation mechanical ventilators is a product of measured flow and inspiratory time. The ventilator essentially controls the flow delivered to the patient and calculates volume delivery based on the rate of flow and the time allowed for flow. Basically, the same effect is achieved by controlling either the volume delivered or flow over time.

<details class="med-details"><summary>

### Pressure-Controlled Breathing</summary><div class="details-content">

When the ventilator maintains the pressure waveform in a specific pattern, the delivered breath is described as *pressure controlled*. With **pressure-controlled ventilation**, the pressure waveform is unaffected by changes in lung characteristics. The volume and flow waveforms will vary with changes in the compliance and resistance characteristics of the patient's respiratory system.

</div></details>

<details class="med-details"><summary>

### Volume-Controlled Breathing</summary><div class="details-content">

When a ventilator maintains the volume waveform in a specific pattern, the delivered breath is *volume controlled*. During **volume-controlled ventilation**, the volume and flow waveforms remain unchanged, but the pressure waveform varies with changes in lung characteristics.

</div></details>

<details class="med-details"><summary>

### Flow-Controlled Breathing</summary><div class="details-content">

When the ventilator controls flow, the flow and therefore volume waveforms remain unchanged but the pressure waveform changes with alterations in the patient's lung characteristics. Flow-controlled ventilation can be achieved directly by a device as simple as a flowmeter or by a more complex mechanism, such as a solenoid valve (see Chapter 2). Notice that any breath that has a set flow waveform also has a set volume waveform and vice versa. Thus when the clinician selects a flow waveform, the volume waveform is automatically established (Flow = Volume change/Time; Volume = Flow × Time). In practical terms, clinicians typically are primarily interested in volume and pressure delivery rather than the contour of the flow waveform.

</div></details>

<details class="med-details"><summary>

### Time-Controlled Breathing</summary><div class="details-content">

When the pressure, volume, and flow waveforms are affected by changes in lung characteristics, the ventilator can control the ventilatory cycle and is described as delivering a breath as **time-controlled ventilation**. High-frequency jet ventilators and oscillators control inspiratory and expiratory times and are therefore examples of mechanical ventilators that can be classified as time-controlled ventilators.

</div></details>

</div></details>

<details class="med-details"><summary>

## OVERVIEW OF INSPIRATORY WAVEFORM CONTROL</summary><div class="details-content">

[Fig. 3.2](#fig-3-2) provides an algorithm to identify the various types of breaths that can be delivered by mechanical ventilators. [Fig. 3.3](#fig-3-3) shows the waveforms for pressure- and volume-controlled ventilation, and Box 3.4 lists basic points that can help simplify evaluation of a breath during inspiration.

<span id="fig-3-2"></span>![](./_page_4_Figure_3.jpeg)

**FIGURE 3.2** Defining a breath based on how the ventilator maintains the inspiratory waveforms. (Modified from Chatburn RL: Classification of mechanical ventilators, *Respir Care* 37:1009–1025, 1992.)

<span id="fig-3-3"></span>![](./_page_4_Figure_5.jpeg)

**FIGURE 3.3** Characteristic waveforms for pressure-controlled ventilation and volume-controlled ventilation. Note that the volume waveform has the same shape as the transthoracic (lung pressure) waveform (i.e., pressure caused by the elastic recoil [compliance] of the lung). The flow waveform has the same shape as the transairway pressure waveform (peak inspiratory pressure minus plateau pressure [PIP – P<sub>plat</sub>]) (shaded area of pressure–time waveform). The *shaded areas* represent pressures caused by resistance, and the *open areas* represent pressure caused by elastic recoil. (From Kacmarek RM, Stoller JK, Heuer AJ, editors: *Egan's fundamentals of respiratory care*, ed 12, St. Louis, MO, 2021, Elsevier.)

The airway pressure waveforms shown in [Fig. 3.3](#fig-3-3) illustrate what the clinician would see on the ventilator graphic display as gas is delivered. The ventilator typically measures variables in one of three places: at the upper, or proximal, airway, where the patient is connected to the ventilator; internally, near the point where the main circuit lines connect to the ventilator; or near the exhalation valve.

Microprocessor-controlled ventilators have the capability of displaying these waveforms as scalars (a variable graphed relative to time) and loops on the ventilator's graphic display. As discussed in Chapter 9, this graphic information is an important tool that can be used for the management of the patient-ventilator interaction.

##### BOX 3.4 Basic Points for Evaluating a Breath During Inspiration

1. Inspiration is commonly described as *pressure controlled* or *volume controlled*. Although both *flow-* and *time-controlled* ventilation have been defined, they are not typically used.
2. Pressure-controlled inspiration maintains the same pattern of pressure at the mouth regardless of changes in lung condition.
3. Volume-controlled inspiration maintains the same pattern of volume at the mouth regardless of changes in lung condition and also maintains the same flow waveform.
4. The pressure, volume, and flow waveforms produced at the mouth usually take one of four shapes:
   a. Rectangular (also called *square* or *constant*)
   b. Exponential (may be increasing [rising] or decreasing [decaying])
   c. Sinusoidal (also called sine wave)
   d. Ramp (available as ascending or descending [decelerating] ramp)

</div></details>

<details class="med-details"><summary>

## PHASES OF A BREATH AND PHASE VARIABLES</summary><div class="details-content">

The following section describes the phases of a breath and the variable that controls each portion of the breath (i.e., the **phase variable**). As summarized in Box 3.5, the phase variable represents the signal measured by the ventilator that is associated with a specific aspect of the breath. The **trigger variable** begins inspiration. The **limit variable** limits the value of pressure, volume, flow, or time during inspiration. It is important to recognize that the limit variable does not end inspiration. The **cycle variable** ends inspiration. The **baseline variable** establishes the baseline during expiration before inspiration is triggered. Pressure is usually identified as the baseline variable.

##### BOX 3.5 Phase Variables

A *phase variable* begins, sustains, ends, and determines the characteristics of the expiratory portion of each breath. Four phase variables are typically described:
1. The trigger variable begins inspiration.
2. The limit variable limits the pressure, volume, flow, or time during inspiration but does not end the breath.
3. The cycle variable ends the inspiratory phase and begins exhalation.
4. The baseline variable is the end-expiratory baseline (usually pressure) before a breath is triggered.

<details class="med-details"><summary>

### Beginning of Inspiration: The Trigger Variable</summary><div class="details-content">

The mechanism the ventilator uses to begin inspiration is the **triggering mechanism** (trigger variable). The ventilator can initiate a breath after a set time (**time triggering**), or the patient can trigger the machine (**patient triggering**) based on pressure, flow, or volume changes. Pressure and flow triggering are the most common triggering variables, but **volume triggering** and neural triggering from the diaphragm output can be used. Most ventilators also allow the operator to manually trigger a breath (Key Point 3.2).

**Key Point 3.2** The trigger variable initiates inspiratory flow from the ventilator.

<details class="med-details"><summary>

#### Time Triggering</summary><div class="details-content">

With time triggering, the ventilator delivers a mandatory breath by beginning inspiration after a set time has elapsed. (NOTE: The set time is based on the total cycle time [TCT], which is the sum of inspiratory time [T<sub>I</sub>] and expiratory time [T<sub>E</sub>], or TCT = T<sub>I</sub> + T<sub>E</sub>). In other words, the number of mandatory breaths delivered by the ventilator is based on the length of the TCT. For example, if the breathing rate is set at 20 breaths per minute, the ventilator triggers inspiration after 3 seconds elapses (60 s/min divided by 20 breaths/min = 3 seconds).

In the past, time-triggered ventilation did not allow a patient to initiate a breath (i.e., the ventilator was "insensitive" to the patient's effort to breathe). Consequently, when the **control mode** setting was selected on early ventilators such as the first Emerson Post-Op, the machine automatically controlled the number of breaths delivered to the patient.

Ventilators are no longer used in this manner. Conscious patients are almost never "locked out," and they can take a breath when they need it. The clinician sets up time triggering with the rate control (or frequency control), which may be a touch pad or a knob. Sometimes clinicians may say that a patient "is being controlled" or "is in the control mode" to describe an individual who is apneic or *sedated* or paralyzed and makes no effort to breathe ([Fig. 3.4](#fig-3-4)). It should be noted, however, that the ventilator should be set so that it will be sensitive to the patient's inspiratory effort when the person is no longer apneic or paralyzed.

<span id="fig-3-4"></span>![](./_page_6_Figure_2.jpeg)

**FIGURE 3.4** Controlled ventilation pressure curve. Patient effort does not trigger a mechanical breath; rather, inspiration occurs at equal, timed intervals.

</div></details>

<details class="med-details"><summary>

#### Patient Triggering</summary><div class="details-content">

In cases in which a patient attempts to breathe spontaneously during mechanical ventilation, a ventilator must be able to measure the patient's effort to breathe. When the ventilator detects changes in pressure, flow, or volume, a patient-triggered breath occurs. Pressure and flow are common patient-triggering mechanisms (e.g., inspiration begins if a negative airway opening pressure or change in flow is detected). [Fig. 3.5](#fig-3-5) illustrates a breath triggered by the patient making an inspiratory effort (i.e., the patient's inspiratory effort can be identified as the pressure deflection below baseline that occurs before initiation of the mechanical breath). To enable patient triggering, the clinician must specify the sensitivity setting, also called the patient effort (or patient-triggering) control. This setting determines the pressure or flow change required to trigger the ventilator. The less pressure or flow change required to trigger a breath, the more sensitive the machine is to the patient's effort. For example, the ventilator is more sensitive to patient effort at a setting of –0.5 cm H<sub>2</sub>O than at a setting of –1 cm H<sub>2</sub>O. Sensing devices are usually located inside the ventilator near the output side of the system; however, in some systems, pressure or flow is measured at the proximal airway.

The sensitivity level for **pressure triggering** is usually set at about –1 cm H<sub>2</sub>O. The clinician must set the sensitivity level to fit the patient's needs. If it is set incorrectly, the ventilator may not be sensitive enough to the patient's effort, and the patient will have to work too hard to trigger the breath ([Fig. 3.6](#fig-3-6)). Conversely, if it is too sensitive, the ventilator can **autotrigger** (i.e., the ventilator triggers a breath without the patient trying to initiate a breath) (Case Study 3.1).

<span id="fig-3-5"></span>![](./_page_7_Figure_2.jpeg)

**FIGURE 3.5** Assist pressure curve. Patient effort (negative pressure deflection from baseline) occurs before each machine breath. Breaths may not occur at equal, timed intervals.

<span id="fig-3-6"></span>![](./_page_7_Figure_4.jpeg)

**FIGURE 3.6** Airway pressure curve during assist ventilation with 5 cm H<sub>2</sub>O of positive end-expiratory pressure (baseline), showing a deflection of the pressure curve to 0 cm H<sub>2</sub>O before each machine breath is delivered. The machine is not sensitive enough to the patient's effort.

**Flow triggering** occurs when the ventilator detects a reduction in flow through the patient circuit during exhalation. To enable flow triggering, the clinician must set an appropriate flow that must be sensed by the ventilator to trigger the next breath. As an example, a ventilator has a baseline flow of 6 L/min. This allows 6 L/min of gas to flow through the patient circuit during the last part of exhalation. The sensors measure a flow of 6 L/min leaving the ventilator and 6 L/min returning to the ventilator. If the flow trigger is set at 2 L/min, the ventilator will begin an assisted breath when it detects a decrease in flow of 2 L/min from the baseline (i.e., 4 L/min returning to the ventilator) ([Fig. 3.7](#fig-3-7)).

When set properly, flow triggering has been shown to require less work of breathing than pressure triggering. Many microprocessor-controlled ventilators (e.g., Servo-i, Hamilton G5, Medtronics Puritan Bennett 840/980) offer flow triggering as an option.

<span id="fig-3-7"></span>![](./_page_8_Figure_1.jpeg)

**FIGURE 3.7** Schematic drawing of the essential features of flow triggering. Triggering occurs when the patient inspires from the circuit and increases the difference between flow from the ventilator (inspiratory side, *in*) and flow back to the exhalation valve (expiratory side, *out*). (From Dupuis Y: *Ventilators: theory and clinical application*, ed 2, St. Louis, MO, 1992, Mosby.)

Volume triggering occurs when the ventilator detects a small drop in volume in the patient circuit during exhalation. The machine interprets this decrease in volume as a patient effort and begins inspiration. Neural triggering is a relatively newer triggering option that allows the ventilator to initiate a breath when electrical activity of the diaphragm is sensed. **Neurally adjusted ventilatory assist (NAVA)** is available on the Getinge Servo ventilators and is discussed in greater detail in Chapter 23.

As mentioned previously, manual triggering is also available. With manual triggering, the operator can initiate a ventilator breath by pressing a button or touch pad labeled "Manual" breath or "Start" breath. When this control is activated, the ventilator delivers a breath according to the set variables.

It is important to recognize that patient triggering can be quite effective when a patient begins to breathe spontaneously, but occasionally the patient may experience an apneic episode. For this reason, a respiratory rate is set with the rate control to guarantee a minimum number of breaths per minute ([Fig. 3.8](#fig-3-8)). Each breath is either patient triggered or time triggered, depending on which occurs first. Although the rate control determines the minimum number of mechanical breaths delivered, the patient has the option of breathing at a faster rate. Clinicians often refer to this as the **assist-control mode**. (NOTE: The clinician must always make sure the ventilator is sensitive to the patient's efforts [Box 3.6].)

<span id="fig-3-8"></span>![](./_page_8_Figure_5.jpeg)

**FIGURE 3.8** Assist-control pressure curve. A patient-triggered (assisted) breath shows negative deflection of pressure before inspiration, whereas a controlled (time-triggered) breath does not.

##### BOX 3.6 Ventilator Determination of Actual Breath Delivery During Assisted Ventilation

If a patient occasionally starts a breath independently, the ventilator must determine how long to wait before another breath is needed. As an example, the rate is set at 6 breaths/min. The ventilator determines that it has 10 seconds (60 s/6 breaths) for each breath. If the patient triggers a breath, the ventilator "resets" itself so that it still allows a full 10 seconds after the start of the patient's last breath before it time-triggers another breath.

<details class="med-details"><summary>

##### Case Study 3.1: Patient Triggering</summary><div class="details-content">

Problem 1: A patient is receiving volume-controlled ventilation. Whenever the patient makes an inspiratory effort, the pressure indicator shows a pressure of –5 cm H₂O below baseline before the ventilator triggers into inspiration. What does this indicate?

Problem 2: A patient appears to be in distress while receiving volume-controlled ventilation. The ventilator is cycling rapidly from breath to breath. The actual rate is much faster than the set rate. No discernible deflection of the pressure indicator occurs at the beginning of inspiration. The ventilator panel indicates that every breath is an assisted, or patient-triggered, breath. What does this indicate?

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

### The Limit Variable During Inspiration</summary><div class="details-content">

Inspiration is timed from the beginning of inspiratory flow to the beginning of expiratory flow. As mentioned previously, the ventilator can determine the waveform for pressure, volume, flow, or time during inspiration. However, it can also limit these variables. For example, during volume-controlled ventilation of an apneic patient, the clinician sets a specific volume that the ventilator will deliver. In general, the volume delivered cannot exceed that amount; it may be for some reason less than desired, but it cannot be more.

A limit variable is the maximum value that a variable (pressure, volume, flow, or time) can attain. It is important to emphasize, however, that reaching the set limit variable *does not* end inspiration. As an example, a ventilator is set to deliver a maximum pressure of 25 cm H<sub>2</sub>O and the inspiratory time is set at 2 seconds. The maximum pressure that can be attained during inspiration is 25 cm H<sub>2</sub>O, but inspiration will end only after 2 seconds have passed. Such a breath is described as a *pressure-limited*, time-cycled breath (cycling ends inspiration [see Termination of the Inspiratory Phase: The Cycling Mechanism section later]).

<details class="med-details"><summary>

#### Pressure Limiting</summary><div class="details-content">

As the example mentioned earlier illustrates, **pressure limiting** allows pressure to rise to a certain value but not exceed it. [Fig. 3.9](#fig-3-9) shows an example of the internal pneumatic circuit of a piston ventilator. The ventilator pushes a volume of gas into the ventilator circuit, which causes the pressure in the circuit to rise. To prevent excessive pressure from entering the patient's lungs, the clinician sets a high-pressure limit control. When the ventilator reaches the high-pressure limit, excess pressure is vented through a spring-loaded pressure release, or pop-off, valve (see [Fig. 3.9](#fig-3-9)). The excess gas pressure is released into the room, just as steam is released by a pressure cooker. In this example, reaching the high-pressure limit does not cycle the ventilator and end inspiration.

<span id="fig-3-9"></span>![](./_page_9_Figure_2.jpeg)

**FIGURE 3.9** Internal pneumatic circuit on a piston-driven ventilator. 1, Pressure release valve; 2, heated humidifier. (Modified from Dupuis Y: *Ventilators: theory and clinical application*, ed 2, St. Louis, MO, 1992, Mosby.)

The pressure-time and volume-time waveforms shown in [Fig. 3.10](#fig-3-10) illustrate how the set pressure and volume curves would appear for a patient with normal lung function and when the patient's lungs are less compliant. Notice that a higher pressure is required to inflate the stiff lungs, and the pressure limit would be reached before the end of the breath occurs. Consequently, the volume delivered would be less than desired. In other words, volume delivery is reduced because the pressure limit is reached at Time A even though inspiration does not end until Time B (i.e., the breath is time cycled).

Infant ventilators often pressure limit the inspiratory phase but time cycle inspiration. Other examples of pressure-limiting modes are **pressure support** and pressure-controlled ventilation. Remember that when the clinician establishes a set value in pressure-targeted ventilation, the pressure the ventilator delivers to the patient is limited; however, reaching the pressure limit does not end the breath.

<span id="fig-3-10"></span>![](./_page_9_Figure_7.jpeg)

**FIGURE 3.10** Waveforms from a volume ventilator that delivers a sine wave pressure curve. The pressure and volume waveforms for normal compliance show pressure peaking at Time A and the normal volume delivered by Time A. Inspiration ends at Time B. With reduced compliance, the pressure rises higher during inspiration. Because excess pressure is vented, the pressure reaches a limit and goes no higher. No more flow enters the patient's lungs. Volume delivery has reached its maximum at Time A, when the pressure starts venting. Inspiration is time cycled at Time B. Note that volume delivery is lower when the lungs are stiffer and the pressure is limited. Some of the volume was vented to the air.

</div></details>

<details class="med-details"><summary>

#### Volume Limiting</summary><div class="details-content">

A volume-limited breath is controlled by an electronically operated valve that measures the flow passing through the ventilator circuit during a specific interval. The clinician can set the volume of gas that the ventilator delivers. With volume limiting, the ventilator may include a bag, bellows, or piston cylinder that contains a fixed volume, which establishes the maximum volume of gas that can be delivered. (NOTE: Reaching that volume does not necessarily end inspiration.) A piston-operated ventilator can be used to provide a simple example of **volume limiting**. Volume is limited to the amount of volume contained in the piston cylinder (see [Fig. 3.9](#fig-3-9)). The forward movement of the piston rod or arm controls the duration of inspiration (time-cycled breath).

Ventilators can have more than one limiting feature at a time. In the example just provided, the duration of inspiration could not exceed the excursion time of the piston, and the volume delivered could not exceed the volume in the piston cylinder. Therefore a piston-driven ventilator can be simultaneously volume limited and time limited. (NOTE: Current ventilators that are not piston driven [e.g., Servo-i] provide a volume limit option. When special modes are selected, an actively breathing patient can receive more volume if inspiratory demand increases. The advantage of these ventilators is that the volume delivered to the patient during selected modes is adjusted to meet the patient's increased inspiratory needs.)

</div></details>

<details class="med-details"><summary>

#### Flow Limiting</summary><div class="details-content">

If gas flow from the ventilator to the patient reaches but does not exceed a maximum value before the end of inspiration, the ventilator is **flow limited**; that is, only a certain amount of flow can be provided. For example, the constant forward motion of a linear-drive piston provides a constant rate of gas delivery to the patient over a certain period. The duration of inspiration is determined by the time it takes the piston rod to move forward.

In other ventilators with volume ventilation, setting the flow control also limits the flow to the patient. Even if the patient makes a strong inspiratory effort, the patient will receive only the maximum flow set by the clinician. For example, if the clinician sets a constant flow of 60 L/min, the maximum flow that the patient can receive is 60 L/min whether or not the patient tries to breathe in at a higher flow. Most current ventilators allow patients to receive increased flow if they have an increased demand because limiting flow is not in the best interest of an actively breathing patient.

</div></details>

</div></details>

<details class="med-details"><summary>

### Maximum Safety Pressure: Pressure Limiting Versus Pressure Cycling</summary><div class="details-content">

All ventilators have a feature that allows inspiratory pressure to reach but not exceed a maximum pressure. This maximum safety pressure is used to prevent excessive pressure from damaging a patient's lungs. It is typically set by the operator to a value of 10 cm H<sub>2</sub>O above the average peak inspiratory pressure. Manufacturers use various names to describe the maximum pressure control function, such as the peak/maximum pressure, normal pressure limit, pressure limit, high-pressure limit, or upper pressure limit.

Most adult ventilators **pressure cycle** (end inspiration) when the set maximum safety pressure limit is reached, as might occur if the patient coughs or if there is an obstruction in the ventilator tubing. Some ventilators allow inspiration to continue while excess pressure is vented to the atmosphere through a pressure safety valve. (In newer intensive care unit [ICU] ventilators, a "floating" exhalation valve prevents pressures from abruptly rising as might occur when the patient coughs [Case Study 3.2]).

It is worth mentioning that ventilator manufacturers set an internal maximum safety pressure. By design, the machine cannot exceed that limit, regardless of the value set by the operator. Ventilator manufacturers usually set internal maximum safety pressure at 120 cm H<sub>2</sub>O.

<details class="med-details"><summary>

#### Case Study 3.2: Premature Breath Cycling</summary><div class="details-content">

A patient receiving volume-controlled ventilation suddenly coughs during the inspiratory phase of the ventilator. A high-pressure alarm sounds, and inspiration ends. Although the set tidal volume is 0.8 L, the measured delivered volume for that breath is 0.5 L. What variable ended inspiration in this example?

</div></details>

</div></details>

<details class="med-details"><summary>

### Termination of the Inspiratory Phase: The Cycling Mechanism (Cycle Variable)</summary><div class="details-content">

The variable that a ventilator uses to end inspiration is called the cycling mechanism. The ventilator measures the cycle variable during inspiration and uses this information to govern when the ventilator will end gas flow. Only one of four variables can be used at a given time by the ventilator to end inspiration (i.e., volume, time, flow, or pressure).

<details class="med-details"><summary>

#### Volume-Cycled Ventilation</summary><div class="details-content">

The inspiratory phase of a volume-cycled breath is terminated when the set volume has been delivered. In most cases, the volume remains constant even if the patient's lung characteristics change. The pressures required to deliver the set volume and gas flow, however, will vary as the patient's respiratory system compliance and airway resistance change.

In cases in which the clinician sets an inspiratory pause, inspiration will continue until the pause has ended and expiration begins. (The inspiratory pause feature delays opening of the expiratory valve.) In this situation, the breath is volume limited and time cycled. Note that setting an inspiratory pause extends inspiratory time, not inspiratory flow.

Because most current-generation ICU ventilators do not use volume displacement mechanisms, none of these devices is technically classified as volume cycled. (NOTE: The Medtronics Puritan Bennett 740 and 760 are exceptions; these ventilators use linear-drive pistons and can function as true volume-cycled ventilators.) Ventilators such as the Medtronics Puritan Bennett 840/980, Servo-i, CareFusion AVEA, Hamilton Galileo, and Dräger Evita use sensors that determine the gas flow delivered by the ventilator over a specified period, which is then converted to a volume reading (Volume = Flow/Time). These ventilators are considered volume cycled when the targeted volume is delivered and ends the breath.

<details class="med-details"><summary>

##### Set Volume Versus Actual Delivered Volume</summary><div class="details-content">

**Tubing Compressibility.** The volume of gas that leaves the ventilator's outlet is not the volume that enters the patient's lungs. During inspiration, positive pressure builds up in the patient circuit, resulting in expansion of the patient circuit and compression of some of the gas in the circuit (an application of Boyle's law). The compressed gas never reaches the patient's lungs.

In most adult ventilator circuits, about 1 to 3 mL of gas is lost to tubing compressibility for every 1 cm H<sub>2</sub>O that is measured by the airway pressure sensor. As a result, a relatively large volume of gas may be compressed in the circuit and never reaches the patient's lungs when high pressures are required to provide ventilation to a patient. Conversely, a patient whose lung compliance is improving can be administered ventilation at lower pressures; therefore less volume is lost to circuit compressibility.

The actual volume delivered to the patient can be determined by measuring the exhaled volume at the endotracheal tube or tracheostomy tube. If the volume is measured at the exhalation valve, it must be corrected for tubing compliance (i.e., the compressible volume). To determine the delivered volume, the volume compressed in the ventilator circuit must be subtracted from the volume measured at the exhalation valve. Most microprocessor-controlled ICU ventilators (e.g., Medtronics Puritan Bennett 840/980, Servo-i) measure and calculate the lost volume and automatically compensate for volume lost to tubing compressibility by increasing the actual volume delivered. For example, the Medtronics PB 840/980 calculates the circuit compliance/compressibility factor during the establishment of ventilation for a new patient setup. The ventilator measures the peak pressure of a breath delivered to the patient and calculates the estimated volume loss caused by circuit compressibility. Then, for the next breath, it adds the volume calculated to the delivered set volume to correct for this loss. (Determination of the compressible volume is discussed in more detail in Chapter 6.)

**System Leaks.** The volume of gas delivered to the patient may be less than the set volume if a leak in the system occurs. The ventilator may be unable to recognize or compensate for leaks, but the size of the leak can be determined by using an exhaled volume monitor. In cases in which a leak exists, the peak inspiratory pressure will be lower than previous peak inspiratory pressures and a low-pressure alarm may be activated. The volume-time graph can also provide information about leaks (see Chapter 9).

</div></details>

</div></details>

<details class="med-details"><summary>

#### Time-Cycled Ventilation</summary><div class="details-content">

A breath is considered time cycled if the inspiratory phase ends when a predetermined time has elapsed. The interval is controlled by a timing mechanism in the ventilator, which is not affected by the patient's respiratory system compliance or airway resistance. At the specified time, the exhalation valve opens (unless an inspiratory pause has been used) and exhaled air is vented through the exhalation valve. If a constant gas flow is used and the interval is fixed, a tidal volume can be predicted:

$$Tidal\ volume = Flow = \left(\frac{Volume}{Time}\right) \times Inspiratory\ time$$

The Servo-i and Dräger Evita XL are examples of time-cycled ventilators. These microprocessor-controlled machines can compare the set volume with the set time and calculate the flow required to deliver that volume in that length of time. Consider the following example. A patient's tidal volume (V<sub>T</sub>) is set at 1000 mL and the inspiratory time (T<sub>I</sub>) is set at 2 seconds. To accomplish this volume delivery in the time allotted, the ventilator would have to deliver a constant flow waveform at a rate of 30 L/min (30 L/60 s = 0.5 L/s) so that 0.5 L/s × 2 s would provide 1.0 L over the desired 2-second inspiratory time.

With time-cycled, volume-controlled ventilation, an increase in airway resistance or a decrease in compliance does not affect the flow pattern or volume delivery as long as the working pressures of the ventilator are adequate. Therefore volume delivery in a fixed period remains the same, although the pressures vary. Appropriate alarms should be set to alert the clinician of any significant changes in airway pressures.

With time-cycled, pressure-controlled ventilation, both volume and flow vary. Volume (and flow) delivery depends on lung compliance and airway resistance, patient effort (if present), inspiratory time, and set pressure. Time-cycled, pressure-controlled ventilation is commonly called pressure-controlled ventilation. Pressure-controlled ventilation is sometimes used because the inspiratory pressure can be limited, which protects the lungs from injury caused by high pressures. However, the variability of tidal volume delivery can be a concern. Alarm settings must be chosen carefully so that the clinician is alerted to any significant changes in the rate and volume.

</div></details>

<details class="med-details"><summary>

#### Flow-Cycled Ventilation</summary><div class="details-content">

With flow-cycled ventilation, the ventilator cycles into the expiratory phase once the flow has decreased to a predetermined value during inspiration. Volume, pressure, and time vary according to changes in lung characteristics. Flow cycling is the most common cycling mechanism in the pressure support mode ([Fig. 3.11](#fig-3-11)). In the Medtronics Puritan Bennett 840 ventilator, flow termination occurs when the flow reaches a percentage of the peak inspiratory flow, which is selected by the clinician. In some ventilators, the flow cycle percentage can be adjusted from about 5% to 80%.

<span id="fig-3-11"></span>![](./_page_11_Figure_3.jpeg)

**FIGURE 3.11** Waveforms from a pressure support breath showing the pressure and flow curves during inspiration. When flow drops to 25% of the peak flow value measured during inspiration, the ventilator flow cycles out of inspiration. PSV, Pressure support ventilation. (Modified from Dupuis Y: *Ventilators: theory and clinical application*, ed 2, St. Louis, MO, 1992, Mosby.)

##### Critical Care Concept 3.1

Early-generation Bennett ventilators (Bennett PR-1 and PR-2) relied on a Bennett valve to control gas flow to the patient. The principle of operation of these devices is the valve switches from the inspiratory phase to the expiratory phase when flow to the patient drops to 1 to 3 L/min. This lower flow results when the pressure gradient between the alveoli and the ventilator is small and the pressures are nearly equal. Because equal pressure is nearly achieved, along with the low gas flow, these machines are sometimes called pressure-cycled ventilators. However, because the predetermined pressure is never actually reached, these ventilators were in reality examples of flow-cycled ventilators. (NOTE: The rate control on these machines allowed these devices to function as time-cycled ventilators as long as flow and/or pressure limits were not reached first.)

</div></details>

<details class="med-details"><summary>

#### Pressure-Cycled Ventilation</summary><div class="details-content">

During pressure-cycled ventilation, inspiration ends when a set pressure threshold is reached at the mouth or upper airway. The exhalation valve opens, and expiration begins. The volume delivered to the patient depends on the flow delivered, duration of inspiration, patient's lung characteristics, and set pressure.

A disadvantage of pressure-cycled ventilators (e.g., Bird Mark 7) is that these devices deliver variable and generally lower tidal volumes when reductions in compliance and increases in resistance occur. An advantage of pressure-cycled ventilators is that they limit peak airway pressures, which may reduce the damage that can occur when pressures are excessive. These ventilators are most often used to deliver intermittent positive pressure breathing treatments. These devices have also been used for short-term ventilation of patients with relatively stable lung function, such as postoperative patients. It is important that appropriate alarms are operational to ensure the patient is receiving adequate ventilation. Ensuring that the humidification system is adequate is also important. (NOTE: As mentioned previously, **pressure cycling** occurs in volume-controlled breaths when the pressure exceeds the maximum safety high-pressure limit. A high-pressure alarm sounds, and the set tidal volume is not delivered [see Case Study 3.2].)

</div></details>

<details class="med-details"><summary>

#### Inflation Hold (Inspiratory Pause)</summary><div class="details-content">

Inflation hold is designed to maintain air in the lungs at the end of inspiration, before the exhalation valve opens. During an inflation hold, the inspired volume remains in the patient's lung and the expiratory valve remains closed for a brief period or pause time. The pressure reading on the manometer peaks at the end of insufflation and then levels to a plateau (plateau pressure). The inflation hold maneuver is sometimes referred to as inspiratory pause, end-inspiratory pause, or inspiratory hold ([Fig. 3.12](#fig-3-12)). As discussed in Chapter 8, the plateau pressure is used to calculate static compliance (Key Point 3.3). The inspiratory pause is used occasionally to increase peripheral distribution of gas and improve oxygenation. Because of the way the pause functions, the normal cycling mechanism no longer ends the breath, resulting in an increase in the inspiratory time and a reduction in the expiratory time.

<span id="fig-3-12"></span>![](./_page_12_Figure_2.jpeg)

**FIGURE 3.12** Positive pressure ventilation with an inflation hold, or end-inspiratory pause, leading to a pressure plateau (P<sub>plat</sub>).

**Key Point 3.3** Calculation of static compliance requires accurate measurement of the plateau pressure. The P<sub>plat</sub> value is inaccurate if the patient is actively breathing when the measurement is taken.

</div></details>

</div></details>

<details class="med-details"><summary>

### Expiratory Phase: The Baseline Variable</summary><div class="details-content">

<details class="med-details"><summary>

#### Definition of Expiration</summary><div class="details-content">

The expiratory phase encompasses the period from the end of inspiration to the beginning of the next breath. During mechanical ventilation, expiration begins when inspiration ends, the expiratory valve opens, and expiratory flow begins. As previously mentioned, opening of the expiratory valve may be delayed if an inflation hold is used to prolong inspiration.

The expiratory phase has received increased attention during the past decade. Clinicians now recognize that air trapping can occur if the expiratory time is too short. Remember that a quiet exhalation is normally a passive event that depends on the elastic recoil of the lungs and thorax and the resistance to airflow offered by the conducting airways. Changes in a patient's respiratory system compliance and airway resistance can alter time constants, which in turn can affect the inspiratory and expiratory times required to achieve effective ventilation. If an adequate amount of time is not provided for exhalation, air trapping and hyperinflation can occur, leading to a phenomenon called auto-PEEP or intrinsic PEEP (see the section on Expiratory Hold later in this chapter).

</div></details>

<details class="med-details"><summary>

#### Baseline Pressure</summary><div class="details-content">

The baseline variable is the parameter that is generally controlled during exhalation. Although either volume or flow could serve as a baseline variable, pressure is the most practical choice and is used by all modern ventilators.

The pressure level from which a ventilator breath begins is called the *baseline pressure* (see [Figs. 3.5](#fig-3-5) and [3.6](#fig-3-6)). Baseline pressure can be zero (atmospheric), which is also called *zero end-expiratory pressure*, or it can be positive if the baseline pressure is above zero (positive end-expiratory pressure [PEEP]).

During the early development of mechanical ventilation, many clinicians thought assisting the expiratory phase was just as important as assisting the inspiratory phase. This was accomplished in one of two ways. With the first method, which was called **negative end-expiratory pressure (NEEP)**, negative pressure was applied with a bellows or an entrainment (Venturi) device positioned at the mouth or upper airway to draw air out of the lungs ([Fig. 3.13](#fig-3-13)). Another method involved applying positive pressure to the abdominal area, below the diaphragm. With this latter technique, it was thought that applying pressure below the diaphragm would force the air out of the lungs by pushing the visceral organs against the diaphragm (i.e., similar to the effects of performing a Heimlich maneuver).

Under normal circumstances, expiration during mechanical ventilation occurs passively and depends on the passive recoil of the lung. High-frequency oscillation is an exception to this principle. High-frequency oscillation ventilation (HFOV) assists both inspiration and expiration. Oscillators push air into the lungs and pull it back out at extremely high frequencies. These devices function similarly to a speaker system on a stereo. If the mean airway pressure during HFOV is set to equal ambient pressure, the airway pressure oscillates above and below the baseline (i.e., atmospheric pressure). During exhalation, HFOV actually creates a negative transrespiratory pressure. HFOV is most often used for ventilation of infant lungs, although it has also been used occasionally to treat adult patients with acute respiratory distress syndrome (see Chapters 22 and 23). Another technique, called automatic tube compensation, allows active removal of air (low pressure) during part of exhalation to reduce the expiratory work of breathing associated with an artificial airway (see Chapter 20 for a more detailed discussion of this technique).

<span id="fig-3-13"></span>![](./_page_13_Figure_2.jpeg)

**FIGURE 3.13** Negative end-expiratory pressure (NEEP). Expiration occurs more rapidly, and the pressure drops below baseline (negative pressure) compared with a normal passive exhalation to zero end-expiratory pressure.

</div></details>

<details class="med-details"><summary>

#### Time-Limited Expiration</summary><div class="details-content">

Current mechanical ventilators (e.g., BD Vyaire CareFusion AVEA, Servo-i, Dräger V500, Medtronics Puritan Bennett 840/980) have a mode that allows the clinician to control T<sub>I</sub> and expiratory time (T<sub>E</sub>). The Dräger Evita was the first ventilator in the United States to provide this mode, which was called *airway pressure release ventilation (APRV)*. During APRV, two time settings are used: Time 1 (T<sub>I</sub>) controls the time high pressure is applied, and Time 2 (T<sub>II</sub>) controls the *release time*, or the time low pressure is applied. This mode of ventilation limits the expiratory time.

Since the introduction of APRV, other manufacturers of ICU ventilators have chosen to incorporate this mode into their ventilator settings. Interestingly, they use other names for this mode. For example, the Servo-i refers to APRV as Bi-Vent and the Hamilton G5 refers to APRV as Duo-PAP. (APRV is covered in more detail in Chapter 23.)

</div></details>

<details class="med-details"><summary>

#### Continuous Gas Flow During Expiration</summary><div class="details-content">

Many ICU ventilators provide gas flow through the patient circuit during the latter part of the expiratory phase. When gas flow is provided only during the end of exhalation, resistance to exhalation is minimized. With some ventilators, the clinician sets system flow, whereas in others the system flow is automatically set by the ventilator (e.g., Servo-i). This feature provides immediate inspiratory flow to a patient on demand and in most cases also serves as part of the flow-triggering mechanism.

</div></details>

<details class="med-details"><summary>

#### Expiratory Hold (End-Expiratory Pause)</summary><div class="details-content">

Expiratory hold, or end-expiratory pause, is a maneuver transiently performed at the end of exhalation. It is accomplished by first allowing the patient to perform a quiet exhalation. The ventilator then pauses before delivering the next machine breath. During this time, both the expiratory and inspiratory valves are closed. Delivery of the next inspiration is briefly delayed. The purpose of this maneuver is to measure pressure associated with air trapped in the lungs at the end of the expiration (i.e., auto-PEEP).

An accurate reading of end-expiratory pressure is impossible to obtain if a patient is breathing spontaneously. However, measurement of the exact amount of auto-PEEP present is not always necessary; simply detecting its presence may be sufficient. Auto-PEEP can be detected in the flow curve on a ventilator that provides a graphic display of gas flow; it is present if flow does not return to zero when a new mandatory ventilator breath begins (see Chapter 9). (NOTE: A respirometer can also be used if a graphic display is not available. The respirometer is placed in line between the ventilator's Y-connector and the patient's endotracheal tube connector. If the respirometer's needle continues to rotate when the next breath begins, air trapping is present [i.e., the patient is still exhaling when the next mandatory breath occurs].)

</div></details>

<details class="med-details"><summary>

#### Expiratory Retard</summary><div class="details-content">

Spontaneously breathing individuals with a disease that leads to early airway closure (e.g., emphysema) require a prolonged expiratory phase. Many of these patients can accomplish a prolonged expiration during spontaneous breathing by using a technique called *pursed-lip breathing*. Obviously, a patient cannot use pursed-lip breathing with an endotracheal tube in place. To mimic pursed-lip breathing, earlier ventilators provided an expiratory adjunct called *expiratory retard*, which added a degree of resistance to exhalation ([Fig. 3.14](#fig-3-14)). Although theoretically expiratory retard should prevent early airway closure and improve ventilation, this technique is not commonly used in clinical practice. It is important to recognize that ventilator circuits, expiratory valves, and bacterial filters placed on the expiratory side of the patient circuit produce a certain amount of expiratory retard because they cause resistance to flow. This is especially true of expiratory filters, which can accumulate moisture from the patient's exhaled air. The clinician can check for expiratory resistance by observing the pressure manometer and the ventilator pressure-time and flow-time graphics. (Increased resistance is present if pressure and flow return to baseline slowly during exhalation [see Chapter 9].)

<span id="fig-3-14"></span>![](./_page_13_Figure_5.jpeg)

**FIGURE 3.14** Positive pressure ventilation with expiratory retard (*solid line*) and passive expiration to zero baseline (*dashed line*). Expiratory retard does not necessarily change expiratory time, which also depends on the patient's spontaneous pattern. However, it increases the amount of pressure in the airway during exhalation.

</div></details>

<details class="med-details"><summary>

#### Continuous Positive Airway Pressure and Positive End-Expiratory Pressure</summary><div class="details-content">

Two methods of applying continuous pressure to the airways have been developed to improve oxygenation in patients with refractory hypoxemia: **continuous positive airway pressure (CPAP)** and PEEP.

CPAP involves the application of pressures above ambient pressure throughout inspiration and expiration to improve oxygenation in a spontaneously breathing patient ([Fig. 3.15](#fig-3-15)). It can be applied through a freestanding CPAP system or a ventilator. CPAP has been used for the treatment of a variety of disorders, including postoperative atelectasis and obstructive sleep apnea (see Chapter 13 for more details on the use of CPAP).

Like CPAP, PEEP involves applying positive pressure to the airway throughout the respiratory cycle. The pressure in the airway therefore remains above ambient even at the end of expiration. According to its purest definition, the term *PEEP* is defined as positive pressure at the end of exhalation during either spontaneous breathing or mechanical ventilation. In practice, however, clinicians commonly use the term to describe the application of continuous positive pressure when a patient is also receiving mandatory breaths from a ventilator ([Figs. 3.16](#fig-3-16) and [3.17](#fig-3-17)). PEEP becomes the baseline variable during mechanical ventilation.

CPAP and PEEP theoretically help prevent early airway closure and alveolar collapse at the end of expiration by increasing (and normalizing) the patient's functional residual capacity, which in turn allows for better oxygenation.

<span id="fig-3-15"></span>![](./_page_14_Figure_2.jpeg)

**FIGURE 3.15** Simplified pressure–time waveform showing continuous positive airway pressure (CPAP). Breathing is spontaneous. Inspiratory positive airway pressure (IPAP) and expiratory positive airway pressure (EPAP) are present. Pressures remain positive and do not return to a zero baseline.

<span id="fig-3-16"></span>![](./_page_14_Figure_4.jpeg)

**FIGURE 3.16** Positive end-expiratory pressure (PEEP) during controlled ventilation. No spontaneous breaths are taken between mandatory breaths, and there are no negative deflections of the baseline, which is maintained above zero.

<span id="fig-3-17"></span>![](./_page_14_Figure_6.jpeg)

**FIGURE 3.17** Continuous positive airway pressure (CPAP) or positive end-expiratory pressure (PEEP) with intermittent mandatory breaths (also called intermittent mandatory ventilation [IMV] with PEEP or CPAP). Spontaneous breaths are taken between mandatory breaths, and the baseline is maintained above zero. The mandatory breaths are equidistant and occur regardless of the phase of the patient's spontaneous respiratory cycle.

Another variation of PEEP and CPAP therapy that is commonly used is bilevel positive airway pressure, or BiPAP. BiPAP is the brand name of a machine manufactured by Philips Respironics (Murrysville, PA), which became popular in the 1980s as a home care device for treating obstructive sleep apnea. The term *BiPAP* has become so commonly used that it is often applied to any device that provides bilevel pressure control (Box 3.7). [Fig. 3.18](#fig-3-18) shows a simplified pressure-time waveform generated by a BiPAP machine.

With bilevel positive pressure, the inspiratory positive airway pressure is higher than the expiratory positive airway pressure. This form of ventilation is patient triggered, pressure targeted, and flow or time cycled. The application of BiPAP in noninvasive ventilation is discussed in Chapter 19.

<span id="fig-3-18"></span>![](./_page_15_Figure_3.jpeg)

**FIGURE 3.18** Inspiratory positive airway pressure (IPAP) plus expiratory positive airway pressure (EPAP). IPAP is higher than EPAP when applied to patients. This technique, also called *bilevel positive airway pressure*, or *BiPAP*, is used for noninvasive ventilation in homecare.

##### BOX 3.7 Other Names for BiPAP

- Bilevel airway pressure
- Bilevel positive pressure
- Bilevel positive airway pressure
- Bilevel continuous positive airway pressure (CPAP)
- Bilevel positive end-expiratory pressure (PEEP)
- Bilevel pressure assist
- Bilevel pressure support

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## TYPES OF BREATHS</summary><div class="details-content">

Three types of mechanical ventilation breaths can be described: spontaneous breaths, mandatory breaths, and assisted breaths. **Spontaneous breaths** are initiated by the patient (i.e., patient triggered), and volume delivery is determined by the patient (i.e., patient cycled). With spontaneous breaths, the volume and flow delivered are based on patient demand rather than a value set by the ventilator operator. During a **mandatory breath**, the ventilator determines the start time (time triggering) or tidal volume (or both). In other words, the ventilator triggers and cycles the breath. **Assisted breaths** have characteristics of spontaneous and mandatory breaths. In an assisted breath, all or part of the breath is generated by the ventilator. As discussed in Chapter 5, the ventilator does part of the breathing for the patient.

Box 3.8 summarizes the main points of control variables, phase variables, and breath types. [Fig. 3.19](#fig-3-19) summarizes the criteria for determining the phase variables that are active during the delivery of a breath.

##### BOX 3.8 Control Variables, Phase Variables, and Types of Breaths

**Control Variables**

Control variables are the main variables the ventilator adjusts to produce inspiration. The two primary control variables are pressure and volume.

**Phase Variables**

Phase variables control the four phases of a breath (i.e., beginning inspiration, inspiration, end inspiration, and expiration). Types of phase variables include:
- Trigger variable (begins inspiration)
- Limit variable (restricts the magnitude of a variable during inspiration)
- Cycle variable (ends inspiration)
- Baseline variable (the parameter controlled during exhalation)

**Types of Breaths**

- **Spontaneous breaths:** Breaths are started by the patient (patient triggered), and tidal volume delivery is determined by the patient (patient cycled).
- **Mandatory breaths:** The ventilator determines the start time for breaths (time triggered) or the tidal volume (volume cycled).
- **Assisted breaths:** Breaths have characteristics of both mandatory and spontaneous breaths (i.e., all or part of a breath is generated by the ventilator). The ventilator therefore does part of the work of breathing for the patient.

<span id="fig-3-19"></span>![](./_page_16_Figure_3.jpeg)

**FIGURE 3.19** Criteria for determining phase variables during delivery of a breath with mechanical ventilation. (From Kacmarek RM, Stoller JK, Heuer AJ, editors: *Egan's fundamentals of respiratory care*, ed 11, St. Louis, MO, 2017, Elsevier.)

</div></details>

<details class="med-details"><summary>

## SUMMARY</summary><div class="details-content">

- The equation of motion provides a mathematical model for describing the relationships among pressure, volume, flow, and time during a spontaneous or mechanical breath.
- The work of breathing can be accomplished by contraction of the respiratory muscles during spontaneous breathing or the ventilator during a mechanical ventilatory breath.
- Two factors determine the way that the inspiratory volume is delivered during mechanical ventilation: the structural design of the ventilator and the ventilator mode set by the clinician.
- The primary variable that the ventilator adjusts to produce inspiration is the control variable. Although ventilators can be volume, pressure, flow, and time controlled, the two most commonly used control variables are pressure and volume.
- Determining which variable is controlled can be determined by using graphical analysis. The control variable will remain constant regardless of changes in the patient's respiratory characteristics.
- Pressure and flow waveforms delivered by a ventilator are often identified by clinicians as rectangular, exponential, sine wave, and ramp.
- Phase variables are used to describe variables that begin inspiration, terminate inspiration and cycle the ventilator from inspiration to expiration, can be limited during inspiration, and describe characteristics of the expiratory phase.
- CPAP and PEEP are two methods of applying continuous pressure to the airways to improve oxygenation in patients with refractory hypoxemia.

</div></details>

<details class="med-details"><summary>

## REVIEW QUESTIONS</summary><div class="details-content">

*(See Appendix A for answers.)*

1. Write the equation of motion.
2. Explain the term *elastic recoil pressure* in the equation of motion.
3. Which of the following phase variables is responsible for beginning inspiration?
   - A. Trigger variable
   - B. Cycle variable
   - C. Limit variable
   - D. Baseline variable
4. List two other names that are used to describe pressure-controlled ventilation.
5. Which of the following variables will remain constant if airway resistance varies during a pressure-controlled breath?
   1. Pressure
   2. Tidal volume
   3. Inspiratory flow
   4. Expiratory time
   - a. 1 only
   - b. 3 only
   - c. 2 and 3 only
   - d. 1 and 4 only
6. Compare pressure, volume, and flow delivery in pressure-controlled breaths and volume-controlled breaths.
7. What are the two most common patient-triggering variables?
8. What happens in ICU ventilators if the high-pressure limit is exceeded?
   1. Inspiration continues, but pressure is limited.
   2. Inspiration ends, and tidal volume is reduced.
   3. An alarm sounds.
   4. Ventilator function does not change.
   - a. 1 only
   - b. 4 only
   - c. 1 and 3 only
   - d. 2 and 3 only
9. Flow triggering gained widespread use by clinicians because:
   - A. The respiratory therapist could set it more easily.
   - B. It required less work of breathing for the patient.
   - C. It was less expensive to manufacture.
   - D. It could be used with any mode of ventilation.
10. A patient is on mechanical ventilation. The tidal volume is set at 600 mL and the rate at 7 breaths/min. The low exhaled volume alarm, set at 500 mL, is suddenly activated. The low-pressure alarm is also activated. The volume monitor shows 0 mL. The peak pressure is 2 cm H<sub>2</sub>O. On the volume–time waveform, the expiratory portion of the volume curve plateaus and does not return to zero. The most likely cause of this problem is:
    - A. Disconnection at the Y-connector
    - B. Loss of volume resulting from tubing compressibility
    - C. Leakage around the endotracheal tube
    - D. Patient coughing
11. Inflation hold increases the inspiratory time.
    - A. True
    - B. False
12. Which of the following phase variables terminates inspiration?
    - A. Limit variable
    - B. Trigger variable
    - C. Baseline variable
    - D. Cycle variable
13. On a pressure-time waveform, the curve during the expiratory phase does not return to the baseline rapidly as it normally would. It eventually reaches the baseline. This may be a result of:
    - A. An obstruction in the expiratory line
    - B. PEEP set above zero baseline
    - C. NEEP
    - D. A leak in the circuit
14. Which of the following mechanical ventilation techniques mimics pursed-lip breathing and has been used to prolong the expiratory phase of spontaneously breathing individuals with a disease that leads to early airway closure (e.g., emphysema)?
    - A. Setting a high-pressure limit
    - B. Inspiratory hold
    - C. End-expiratory hold
    - D. Expiratory retard
15. Which of the following describes the type of ventilation when the pressure-time waveform does not change during inspiration but the volume-time waveform changes when lung characteristics (i.e., airway resistance and lung compliance) change?
    - A. Volume-controlled ventilation
    - B. Pressure-controlled ventilation
    - C. Time-controlled ventilation
    - D. Flow-controlled ventilation

</div></details>