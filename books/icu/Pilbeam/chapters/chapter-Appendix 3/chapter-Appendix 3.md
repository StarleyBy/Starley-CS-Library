# Graphics Exercises

<details class="med-details"><summary>

## Executive Summary</summary><div class="details-content">

### Basic Concepts of Ventilator Waveforms
* **Volume-controlled continuous mandatory ventilation (VC-CMV):** Delivers constant flow during inspiration until prescribed tidal volume reached.
* **Key variables in respiratory mechanics:** Compliance (C = ∆V/∆P), airway resistance (R<sub>aw</sub> = P<sub>TA</sub>/Flow), alveolar pressure (P<sub>alv</sub>), transairway pressure (P<sub>TA</sub>), and airway opening pressure (P<sub>awo</sub> = P<sub>alv</sub> + P<sub>TA</sub>).
* **Relationship between flow, volume, and time:** Volume = Time × Flow (V = T × F). With constant flow, volume increases linearly.

### Graphing Exercise Calculations
* **Flow rate conversion:** 40 L/min = 0.67 L/s (divide by 60).
* **Transairway pressure calculation:** P<sub>TA</sub> = R<sub>aw</sub> × Flow = 15 cm H<sub>2</sub>O/L/s × 0.67 L/s = 10 cm H<sub>2</sub>O (constant throughout inspiration when flow and resistance are constant).
* **Alveolar pressure calculation:** P<sub>alv</sub> = ∆V/C (EEP = 0, so ∆P = P<sub>alv</sub>). Volume at each quarter-second interval divided by compliance.
* **Airway opening pressure:** P<sub>awo</sub> = P<sub>alv</sub> + P<sub>TA</sub>. At time just above zero, P<sub>awo</sub> ≈ P<sub>TA</sub> (pressure rises rapidly due to circuit and ET tube resistance).

### Constant-Flow Volume Ventilation With High Working Pressure
* **High working pressure ventilators (400–700 cm H₂O):** Can generate any waveform pattern; waveforms unchanged by changes in lung characteristics.
* **Volume and flow curves** remain constant even with decreased compliance or increased R<sub>aw</sub> as long as ventilator is time-cycled or volume-cycled.
* **Decreased compliance:** Increases both peak inspiratory pressure (PIP) and plateau pressure (P<sub>plat</sub>).
* **Increased airway resistance:** Increases PIP, while P<sub>plat</sub> remains constant; P<sub>TA</sub> increases (difference between PIP and P<sub>plat</sub>).
* **Pressure cycling prematurely:** If set pressure limit reached, volume delivery decreases.

### Constant-Flow Volume Ventilation With Low Working Pressure
* **Low to moderate working pressure (40–120 cm H₂O):** Under normal conditions, constant-flow waveform is maintained.
* **Significantly decreased compliance + increased resistance:** PIP rises, flow decreases during inspiration due to reduced pressure gradient between ventilator and alveoli.
* **Modified descending ramp waveform:** May improve gas distribution but can alter inspiratory time (T<sub>I</sub>) and I/E ratio.
* **Volume-cycled ventilators** continue to deliver set volume, but T<sub>I</sub> may increase.

</div></details>

<details class="med-details"><summary>

## GRAPHING VENTILATOR WAVEFORMS</summary><div class="details-content">

This exercise is designed to help the reader understand graphic waveforms produced by a microprocessor-controlled ventilator. By performing these graphing exercises and calculations, the reader will also gain a better understanding of the interrelationship of flow, volume, pressure, and time waveforms generated during mechanical ventilation.

<details class="med-details"><summary>

#### Problem 1</summary><div class="details-content">

Assume you have a patient who is receiving ventilation using volume-controlled continuous mandatory ventilation (VC-CMV) set to deliver a constant flow of gas during inspiration until it reaches the volume ordered by the physician. You are given the following information about the patient's lung characteristics and ventilator parameters:

- Compliance (C) is 0.2 L/cm H₂O
- Airway resistance (R<sub>aw</sub>) is 15 cm H₂O/L/s
- Flow rate is constant at 40 L/min
- Ordered tidal volume (V<sub>T</sub>) is 1 L (1000 mL)
- End-expiratory pressure is zero (no positive end-expiratory pressure [PEEP])

Perform the following steps using the preceding information:

1. Calculate the flow rate in L/s.
2. Record under variable ([Fig. C.1A](#fig-c-1a)) the flow at each quarter-second of time that will be present during inspiration. Graph the flow at quarter-second intervals (see [Fig. C.1A](#fig-c-1a)).
3. Calculate and graph the volume delivered at each quarter-second interval during inspiration: Volume (V) = Time (T) × Flow (see [Fig. C.1B](#fig-c-1b)).

Note that the ordered V<sub>T</sub> of 1 L (1000 mL) was delivered in about 1.5 seconds. A volume-cycled ventilator would stop the inspiratory phase at this point. For all graphs from this point on, calculations need to be made only for times up to 1.5 seconds.

4. Using the volume, calculate and graph the alveolar pressure. Recall that C = ∆V/∆P; ∆P = P<sub>alv</sub> - EEP and EEP = 0; P<sub>alv</sub> = ∆V/C. The volume is taken from the calculations of volume in step 3 for each quarter-second interval (see [Fig. C.1C](#fig-c-1c)).
5. Calculate and graph the transairway pressure (P<sub>TA</sub>). Recall that R<sub>aw</sub> = P<sub>TA</sub>/Flow. Therefore P<sub>TA</sub> = R<sub>aw</sub> × Flow; P<sub>TA</sub> = 15 × 0.67 = 10 cm H₂O. Both R<sub>aw</sub> and flow have constant values. P<sub>TA</sub> will have the same value for each quarter-second interval (see [Fig. C.1D](#fig-c-1d)).
6. Add the values of P<sub>alv</sub> and P<sub>TA</sub> to determine the airway opening pressure (P<sub>awo</sub>) at each quarter-second interval. Graph these values. Note that at the zero point on the x and y axes, the P<sub>awo</sub> will not go to zero. The pressure rises rapidly as the flow begins to go to the patient because the gas flow encounters the resistance of the circuit, the endotracheal tube (ET), and the patient's airways. The P<sub>awo</sub> value just near zero on the x axis is approximately equal to the P<sub>TA</sub> just to the right of the y axis (see [Fig. C.1E](#fig-c-1e)).
7. Compare the curves produced in the preceding exercise; the graph for flow has the same waveform as the graph for:
   - P<sub>alv</sub>
   - PIP
   - P<sub>TA</sub>

<span id="fig-c-1"></span>**FIGURE C.1** Graphing exercise. (See text for explanation. Note that the tables of Time/Variable appear directly above each graph.) (Answers to this problem can be found in Appendix A.)

![](_page_2_Figure_1.jpeg)

</div></details>

</div></details>

<details class="med-details"><summary>

## CHANGES IN WAVEFORMS WITH CHANGES IN LUNG CHARACTERISTICS</summary><div class="details-content">

<details class="med-details"><summary>

#### Ventilator Working Pressure</summary><div class="details-content">

A ventilator that can generate pressures that greatly exceed those reached at the upper airway can deliver any waveform pattern for flow, volume, or pressure. These waveforms do not change regardless of changes in lung characteristics. Some ventilators deliver pressures of 400 to 700 cm H₂O, far greater than what is needed for ventilation of the human lung (10–35 cm H₂O).

The following sections discuss how pressure waveforms change during volume ventilation (constant flow) and how volume and flow waveforms change during pressure ventilation (constant pressure) with changes in lung characteristics.

</div></details>

<details class="med-details"><summary>

#### Constant-Flow Volume Ventilation With High Working Pressure</summary><div class="details-content">

During volume ventilation (constant flow), the volume waveform increases linearly and volume delivery is constant. Inspiration is usually time cycled or volume cycled ([Fig. C.2](#fig-c-2)). As a patient's lungs become less compliant or R<sub>aw</sub> increases, the pressure waveforms are affected; however, the volume and flow curves remain the same. Clinically, a decrease in compliance increases peak inspiratory pressure (PIP) and P<sub>plat</sub> ([Fig. C.3](#fig-c-3)). An increase in R<sub>aw</sub> also increases PIP, whereas alveolar pressure (P<sub>plat</sub>) remains fairly constant. The difference between the two (P<sub>TA</sub>) increases ([Fig. C.4](#fig-c-4)). The ventilator provides a constant volume, even with changes in lung characteristics, as long as the ventilator is time cycled or volume cycled. If it prematurely pressure cycles as a result of reaching the set pressure limit, volume decreases.

Using other types of flow waveforms produces changes similar to those seen for P<sub>plat</sub>, P<sub>TA</sub>, and P<sub>awo</sub>. Reduced compliance increases PIP and P<sub>plat</sub>. Increased R<sub>aw</sub> increases P<sub>TA</sub>.

<span id="fig-c-2"></span>**FIGURE C.2** Curves for constant (rectangular) flow under normal lung conditions (compliance [C] = 0.1 L/cm H₂O; airway resistance [R<sub>aw</sub>] = 2 cm H₂O/L/s); inspiratory time [T<sub>I</sub>] = 2 seconds. (A) Flow is constant at 0.5 L/s. (B) Volume increases at a constant rate during inspiration, achieving a tidal volume (V<sub>T</sub>) of 1 L. (C) P<sub>alv</sub> increases at a constant rate, as does volume, to a maximum of 10 cm H₂O. (D) Because flow is constant, P<sub>TA</sub> is constant; this assumes that resistance and flow do not change. (E) P<sub>awo</sub> = P<sub>alv</sub> + P<sub>TA</sub>.

![](_page_2_Figure_2.jpeg)

<span id="fig-c-3"></span>**FIGURE C.3** (A) Flow is constant at 0.5 L/s. T<sub>I</sub> = 2 seconds. The volume coming from the ventilator remains the same at 1 L even though compliance (C) is reduced. P<sub>alv</sub> has doubled (20 cm H₂O) in this situation because compliance is half its previous value. The dashed line represents the curve for normal compliance (C = 0.1 L/cm H₂O), and the solid line represents the curve for reduced compliance (C = 0.05 L/cm H₂O). (B) Because flow and airway resistance (R<sub>aw</sub>) are constant, the pressure lost to the airways is constant (P<sub>TA</sub> = 1 cm H₂O). P<sub>TA</sub> is the shaded area. The upper airway pressure is much higher than normal because compliance is reduced. P<sub>alv</sub>, alveolar pressure; P<sub>awo</sub>, upper airway pressure; P<sub>TA</sub>, pressure lost to airways.

![](_page_3_Figure_3.jpeg)

<span id="fig-c-4"></span>**FIGURE C.4** Constant-flow ventilator. The following inspiratory curves are produced when airway resistance (R<sub>aw</sub>) is increased to 4 cm H₂O/L/s and compliance is normal (C = 0.1 L/cm H₂O). (A) Pressure lost to the airways (P<sub>TA</sub>) is the product of flow and airway resistance (Flow × R<sub>aw</sub>). With an increase in R<sub>aw</sub>, P<sub>TA</sub> increases to 2 cm H₂O (solid line) compared with normal at 1 cm H₂O (dashed line). (B) Upper airway pressure (P<sub>awo</sub>), the sum of alveolar pressure (P<sub>alv</sub>) and P<sub>TA</sub>, increases to a maximum of 12 cm H₂O because P<sub>TA</sub> is increased (shaded area). The difference between the peak and plateau, or P<sub>TA</sub>, increases.

![](_page_3_Figure_8.jpeg)

</div></details>

<details class="med-details"><summary>

#### Constant-Flow Volume Ventilation With Low Working Pressure</summary><div class="details-content">

Under normal lung conditions, a constant-flow ventilator with low to moderate working pressure (40–120 cm H₂O) creates a constant-flow waveform similar to that shown in [Fig. C.5A](#fig-c-5a).

When compliance is significantly reduced and resistance is increased, PIP rises and flow decreases during inspiration because of the decrease in pressure gradient between the ventilator and alveoli. When the driving mechanism no longer generates an adequate working pressure, the ventilator no longer provides a constant flow. This is not necessarily a disadvantage. The resulting modified descending ramp waveform may actually be more desirable for improving gas distribution in the lungs, but it can alter inspiratory time (T<sub>I</sub>) (see [Fig. C.5B](#fig-c-5b)).

<span id="fig-c-5"></span>**FIGURE C.5** Inspiratory curves represent the changes in flow that can occur using constant flow in a ventilator with moderate to low pressure-generating capabilities. (A) Under normal conditions, flow is constant. (B) As compliance decreases and resistance increases significantly, flow decreases slightly. If the ventilator is volume cycled, volume is delivered from the ventilator but inspiratory time (T<sub>I</sub>) may increase. This affects the inspiratory-to-expiratory ratio (I/E). These changes in lung characteristics increase P<sub>alv</sub> and P<sub>awo</sub> as long as the ventilator is not pressure cycled out of inspiration by reaching the preset pressure limit.

![](_page_3_Figure_10.jpeg)

</div></details>

</div></details>