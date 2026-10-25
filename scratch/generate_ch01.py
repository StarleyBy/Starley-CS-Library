import os

ch_dir = r'd:\IT sandbox\Starley-CS-Library\books\cardiac-echo\eacvi-echo-handbook\chapters\chapter-01'
os.makedirs(ch_dir, exist_ok=True)

# ----------------- ENGLISH ORIGINAL: chapter-01.md -----------------
en_md = """# Chapter 1. Examination & Echo Machine Setup

##### Comprehensive guide to standard system setup, acoustic physics, image optimization, Doppler modalities, and advanced imaging protocols according to the EACVI.

<details class="med-details"><summary>

## Executive Summary</summary><div class="details-content">

### Physical & Instrument Controls
* **Acoustic Power:** Regulates ultrasonic energy delivered to tissues. Higher output elevates signal-to-noise ratio (SNR) but increases potential bio-effects. Monitored through Thermal Index (TI < 2.0) and Mechanical Index (MI < 1.9).
* **Gain & Depth Gain Compensation (DGC):** Master gain amplifies both acoustic signals and ambient electronic noise equally (SNR remains strictly unchanged). DGC allows selective attenuation compensation at graduated depths; baseline examination should always begin with DGC sliders in the neutral central position.
* **Transmit Frequency & Harmonic Imaging:** Higher fundamental frequencies maximize axial and spatial resolution at the cost of tissue penetration. Tissue Harmonic Imaging (THI) transmits at frequency $f_0$ and receives at $2f_0$, suppressing near-field reverberations and clutter to improve SNR, though slightly broadening pulse duration.
* **Focal Position:** Sets the depth of beam narrowing where lateral resolution is highest. Best practice mandates placing the focal marker at or immediately below the deepest target cardiac structure.
* **Temporal Resolution (Frame Rate):** Represents scan line density per unit time. High frame rate reduces scan line density (diminishing lateral resolution). Diagnostic 2D imaging requires 30–50 fps; speckle tracking demands 50–90 fps; myocardial tissue Doppler requires > 115 fps.

### Spectral & Colour Doppler Optimization
* **Doppler Beam Alignment:** Intercept angle between ultrasound beam and blood flow vector must remain < 20° ($\cos \theta \approx 1.0$) to avoid velocity underestimation.
* **Pulse Repetition Frequency (PRF) & Velocity Scale:** Scale set too low generates spectral aliasing; scale set too high compromises velocity resolution and dynamic range.
* **Sample Volume (SV):** In pulsed-wave (PW) Doppler, SV size controls axial sampling length (typically 1–3 mm for blood flow; 5–10 mm for tissue Doppler). For mitral inflow assessment, SV must be placed precisely between the open leaflet tips.
* **Wall Filter & Sweep Speed:** High-pass filter removes high-amplitude, low-velocity wall clutter; excessive filtering obliterates low-velocity diastolic filling waves. Standard sweep speed is 100 mm/s for cycle analysis, or 25–33 mm/s for assessing respiratory variation in constrictive pericarditis and tamponade.
* **Colour-Flow Mapping (CFM):** Frame rate in CFM is inversely proportional to sector width and depth. The colour region of interest (ROI) must be restricted strictly to the valve or pathology under investigation.

</div></details>

<details class="med-details"><summary>

## 1.1 Preparing for the Transthoracic Examination</summary><div class="details-content">

A standardized, high-quality transthoracic echocardiography (TTE) examination begins with meticulous preparation of the patient and environment before image acquisition commences.

<details class="med-details"><summary>

#### Patient Positioning and Environment</summary><div class="details-content">

* **Patient Decubitus:** Position the patient comfortably in the left lateral decubitus position (typically 30° to 45° tilt). The left arm should be elevated under the head to widen the intercostal acoustic spaces and pull cardiac structures closer to the anterior chest wall.
* **Respiration:** The patient should be encouraged to breathe quietly and regularly. Deep inspiration causes lung expansion that obscures acoustic windows and causes respiratory translation of the heart.
* **Examination Room:** The examination suite must be darkened to optimize contrast perception on the monitor and eliminate ambient reflections. The room must remain quiet so the operator can utilize auditory feedback from spectral Doppler signals to guide probe fine-tuning.
* **Electrocardiographic Gating:** A clean, time-aligned 3-lead ECG tracing with prominent R-waves is mandatory for all acquisitions. Accurate ECG gating is indispensable for triggering end-diastolic and end-systolic frames, calculating stroke volumes, and gating multi-beat 3D and strain acquisitions.
* **Transducer Selection:** Select a dedicated phased-array transducer matched to patient habitus and acoustic characteristics (adult cardiac probes typically operate at 1.5–5.0 MHz).
* **System Maintenance:** Routine preventative maintenance and acoustic lens inspection are essential to prevent electrical noise, element drop-out, and degraded imaging fidelity.

</div></details>

<details class="med-details"><summary>

#### System Presets Optimization</summary><div class="details-content">

Modern ultrasound platforms provide pre-programmed software presets configured for specific anatomical targets. Examinations must always begin with the dedicated cardiac preset rather than abdominal or vascular configurations ([Fig. 1-1](#fig-01-01)).

<span id="fig-01-01"></span>![](fig-01-01.jpg)

**FIGURE 1-1** Echo machine pre-settings. Comparison between cardiac (**A**) and abdominal (**B**) presets. Cardiac presets utilize higher frame rates, specialized logarithmic compression curves, and dynamic range settings tailored to rapid myocardial motion.

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.2 Acoustic Power and Bio-Effects</summary><div class="details-content">

Acoustic power controls the total ultrasonic energy emitted by the piezoelectric elements of the transducer into biological tissue.

<details class="med-details"><summary>

#### Acoustic Energy and Signal-to-Noise Ratio</summary><div class="details-content">

Delivering higher acoustic energy to the myocardium produces stronger backscattered echoes, which directly increases the signal-to-noise ratio (SNR) and enhances 2D image clarity ([Fig. 1-2](#fig-01-02)).

Acoustic power is expressed in decibels (dB) relative to the maximum permissible energy output of the machine (100% output corresponds to 0 dB; a 50% power reduction corresponds to −6 dB).

<span id="fig-01-02"></span>![](fig-01-02.jpg)

**FIGURE 1-2** Acoustic power adjustments. Comparison between low acoustic power (**A**) demonstrating poor signal-to-noise ratio with drop-out, and high acoustic power (**B**) showing enhanced endocardial definition and crisp tissue borders.

</div></details>

<details class="med-details"><summary>

#### Acoustic Bio-Effects: Thermal and Mechanical Indices</summary><div class="details-content">

Excessive acoustic exposure can induce irreversible biological tissue damage through two distinct physical mechanisms:

1. **Thermal Bio-Effects (Heating):** Ultrasound energy absorption by tissue converts acoustic energy into heat. This is continuously monitored via the **Thermal Index (TI)**:
   $$\text{TI} = \frac{W_p}{W_{\text{deg}}}$$
   Where $W_p$ is acoustic power and $W_{\text{deg}}$ is the estimated power required to raise tissue temperature by 1°C. For clinical cardiac scanning, **TI must remain strictly below 2.0**.
2. **Mechanical Bio-Effects (Cavitation):** The alternating compression and rarefaction phases of ultrasound waves can cause microbubble formation and violent collapse in fluid media, generating extreme local pressures and shear stress. Cavitation potential is monitored via the **Mechanical Index (MI)**:
   $$\text{MI} = \frac{P_{r,\alpha}}{\sqrt{f_c}}$$
   Where $P_{r,\alpha}$ is peak rarefactional pressure (derated for tissue attenuation) and $f_c$ is center transmit frequency. For standard clinical imaging, **MI must remain below 1.9** (and lower during contrast echocardiography).

<details class="med-details"><summary>

#### <span id="box-01-01"></span>RECOMMENDATION 1-1: Acoustic Power Management</summary><div class="details-content">

Although higher acoustic power increases SNR, it also increases the likelihood of bio-effects. Clinicians must follow the ALARA principle (As Low As Reasonably Achievable). Only increase transmit power above default factory levels if the acoustic window results in unacceptable SNR despite gain and frequency optimization.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.3 Gain and Depth Gain Compensation</summary><div class="details-content">

Amplification controls determine how returning acoustic signals are conditioned and displayed on the diagnostic monitor.

<details class="med-details"><summary>

#### Master 2D Gain</summary><div class="details-content">

Master 2D gain controls the electronic amplification applied uniformly across all returning radiofrequency signals prior to logarithmic conversion and video display.

* Increasing gain amplifies weak returning echoes from endocardial surfaces.
* Crucially, master gain amplifies background electronic noise and acoustic clutter to the exact same degree.
* Consequently, **the signal-to-noise ratio (SNR) remains strictly unchanged** regardless of master gain adjustments ([Fig. 1-3](#fig-01-03) and [Fig. 1-4](#fig-01-04)).

<span id="fig-01-03"></span>![](fig-01-03.jpg)

**FIGURE 1-3** Effect of electronic gain on signal-to-noise ratio (SNR). As reflected ultrasound signal and acquisition noise are amplified equally, the underlying SNR remains completely identical.

<span id="fig-01-04"></span>![](fig-01-04.jpg)

**FIGURE 1-4** Effects of increased master gain on 2D echocardiographic image appearance. Excessive gain leads to blooming artifacts and cavity clutter, whereas insufficient gain causes dropped endocardial borders.

<details class="med-details"><summary>

#### <span id="box-01-02"></span>RECOMMENDATION 1-2: Master Gain Adjustment</summary><div class="details-content">

Adjust 2D master gain to achieve a balanced, comfortable grayscale appearance where intracardiac blood pools remain anechoic (black) while myocardial parenchyma exhibits subtle, textured speckling.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Depth Gain Compensation (DGC / TGC)</summary><div class="details-content">

Ultrasound beam energy attenuates exponentially as it traverses soft tissue due to scattering and absorption:
$$A(z) = A_0 \cdot e^{-\alpha \cdot f \cdot z}$$
Where $\alpha$ is tissue attenuation coefficient (~ 0.5–1.0 dB/cm/MHz in myocardium), $f$ is frequency, and $z$ is depth.

To compensate for progressive attenuation at deeper tissue levels, ultrasound platforms utilize **Depth Gain Compensation (DGC)**, also termed **Time Gain Compensation (TGC)**:
* **Automatic Compensation:** Internal algorithms automatically increase amplification for deeper reflectors based on anticipated average attenuation.
* **Manual Sliders:** A vertical bank of sliding potentiometers allows operators to manually fine-tune amplification across segmented depth bands ([Fig. 1-5](#fig-01-05)).

<span id="fig-01-05"></span>![](fig-01-05.jpg)

**FIGURE 1-5** Manual adjustment of Depth Gain Compensation (DGC) sliders. **A:** Slider pushed excessively to the right, causing intense near-field saturation. **B:** Neutral central slider alignment providing uniform tissue intensity across all depths. **C:** Slider pulled excessively to the left, resulting in severe far-field acoustic drop-out.

<details class="med-details"><summary>

#### <span id="box-01-03"></span>RECOMMENDATION 1-3: DGC Initial Configuration</summary><div class="details-content">

Always begin every new echocardiographic study with all DGC slide controls aligned in their neutral, central vertical position. Adjust individual sliders only when specific near-field clutter or far-field drop-out persists.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.4 Transmit Frequency and Harmonic Imaging</summary><div class="details-content">

Operating frequency represents the fundamental acoustic parameter dictating the fundamental compromise between image resolution and penetration depth.

<details class="med-details"><summary>

#### Fundamental Transmit Frequency</summary><div class="details-content">

Modern broadband cardiac transducers can toggle between multiple transmit frequencies:
* **Lower Transmit Frequency (e.g., 2.0 MHz):** Yields longer ultrasonic wavelengths ($\lambda = c / f$), resulting in reduced acoustic attenuation and superior penetration through thick chest walls, but lowers axial and lateral spatial resolution ([Fig. 1-6](#fig-01-06)).
* **Higher Transmit Frequency (e.g., 3.5–5.0 MHz):** Yields shorter wavelengths, delivering superior spatial resolution for fine anatomical details (such as leaflet thickness or vegetative lesions), but suffers rapid attenuation and reduced depth penetration.

<span id="fig-01-06"></span>![](fig-01-06.jpg)

**FIGURE 1-6** Effects of altering transmit frequency. Comparison between 2.0 MHz (providing deep penetration in difficult acoustic windows) and 3.5 MHz (yielding sharp spatial resolution for superficial and mid-field structures).

</div></details>

<details class="med-details"><summary>

#### Tissue Harmonic Imaging (THI)</summary><div class="details-content">

Tissue Harmonic Imaging exploits non-linear sound propagation through biological tissue. As high-pressure wave peaks travel faster than low-pressure troughs, the sinusoidal waveform distorts into a sawtooth pattern, generating harmonic frequencies ($2f_0, 3f_0, \dots$) primarily in the central, high-intensity core of the beam ([Fig. 1-7](#fig-01-07)).

* **Reverberation Suppression:** Because harmonic signals are not generated within low-intensity superficial layers (subcutaneous fat, ribs), near-field reverberation and chest wall clutter are largely eliminated.
* **SNR Enhancement:** Side-lobe artifacts are substantially reduced, markedly improving cavity-to-endocardium contrast.
* **Resolution Considerations:** While THI improves contrast resolution and lateral definition, receiving at harmonic frequencies may slightly lengthen pulse duration, slightly reducing axial resolution compared to pure high-frequency fundamental imaging.

<span id="fig-01-07"></span>![](fig-01-07.jpg)

**FIGURE 1-7** Effects of fundamental versus harmonic imaging. Comparison between harmonic imaging (1.7/3.4 MHz) and fundamental imaging (3.5 MHz). Harmonic imaging suppresses clutter and enhances endocardial border definition, whereas fundamental imaging is advantageous for delicate valve edge resolution.

<details class="med-details"><summary>

#### <span id="box-01-04"></span>RECOMMENDATION 1-4: Transmit Frequency & Harmonics</summary><div class="details-content">

* Maintain harmonic imaging (THI) as the standard default mode for routine 2D chamber assessment.
* Operate at the transducer's nominal center frequency unless severe penetration limitations require downward frequency adjustment, or delicate microstructural interrogation requires switching to fundamental imaging.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.5 Focal Position and Beam Geometry</summary><div class="details-content">

Electronic beam focusing shapes the geometry of the ultrasound pulse, concentrating acoustic energy into a narrow cross-section at a designated depth.

<details class="med-details"><summary>

#### Focal Zone and Lateral Resolution</summary><div class="details-content">

The lateral resolution of an ultrasound system—its capacity to distinguish two adjacent reflectors positioned perpendicular to the beam axis—depends strictly on ultrasound beam width.

* Beam width is narrowest at the **focal point**, where lateral resolution is highest ([Fig. 1-8](#fig-01-08)).
* Beyond the focal zone, the beam diverges exponentially, leading to severe lateral smearing and artifactual thickening of cardiac structures ([Fig. 1-9](#fig-01-09)).

<span id="fig-01-08"></span>![](fig-01-08.jpg)

**FIGURE 1-8** Position of the focal point. The focal zone indicator (arrowhead) positioned along the lateral sector scale marks the depth of maximum lateral resolution.

<span id="fig-01-09"></span>![](fig-01-09.jpg)

**FIGURE 1-9** Simulated acoustic pressure field of a cardiac transducer across changing focal depths ($F = 50\text{ mm}$, $F = 90\text{ mm}$, $F = 130\text{ mm}$). White horizontal bar denotes focal beam width. Note the dramatic divergence and loss of lateral resolution at depths beyond the focal zone.

<details class="med-details"><summary>

#### <span id="box-01-05"></span>RECOMMENDATION 1-5: Focal Point Positioning</summary><div class="details-content">

Always place the focal marker at or slightly deeper than the specific cardiac structure of interest (e.g., at the level of the mitral valve tips when evaluating mitral regurgitation, or at the LV apex when evaluating apical thrombus).

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.6 Temporal Resolution and Frame Rate</summary><div class="details-content">

Temporal resolution defines the system's ability to resolve rapid intracardiac events across time, determined by the frame rate (frames per second, fps).

<details class="med-details"><summary>

#### The Triangle of Acoustic Trade-Offs</summary><div class="details-content">

Because ultrasound propagates through soft tissue at a constant speed ($c \approx 1540\text{ m/s}$), the time required to interrogate each scan line is fixed:
$$T_{\text{line}} = \frac{2 \cdot \text{Depth}}{c}$$
The maximum achievable frame rate is governed by fundamental physics:
$$\text{Frame Rate} \le \frac{c}{2 \cdot \text{Depth} \cdot N_{\text{lines}}}$$
Where $N_{\text{lines}}$ is the number of acoustic scan lines per frame.

To increase frame rate without reducing depth, the system must reduce the number of scan lines, compromising line density and lateral spatial resolution ([Fig. 1-10](#fig-01-10)).

* **Sector Width:** Narrowing the 2D sector angle reduces total line count, immediately multiplying frame rate.
* **Scan Depth:** Decreasing depth reduces round-trip transit time, elevating frame rate.

<span id="fig-01-10"></span>![](fig-01-10.jpg)

**FIGURE 1-10** Interaction between frame rate and spatial resolution. High scan line density (**A**, 43.3 fps) delivers superior lateral resolution; reduced line density (**B**, 79.2 fps) improves temporal capture of fast-moving valves but softens fine anatomical details.

<details class="med-details"><summary>

#### <span id="box-01-06"></span>RECOMMENDATION 1-6: Frame Rate Management</summary><div class="details-content">

Maintain frame rates within standard factory parameters (30–60 fps) for standard anatomical surveys. Increase frame rate (by narrowing sector width and depth) when interrogating hyperdynamic valve leaflets, performing stress echocardiography, or acquiring speckle tracking strain.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.7 Continuous-Wave and Pulsed-Wave Doppler</summary><div class="details-content">

Spectral Doppler interrogation measures the velocity, direction, and timing of blood flow by detecting frequency shifts in reflected ultrasound waves according to the Doppler equation:
$$\Delta f = \frac{2 f_0 \cdot v \cdot \cos \theta}{c}$$
Where $v$ is blood velocity and $\theta$ is the intercept angle.

<details class="med-details"><summary>

#### Intercept Angle and Beam Alignment</summary><div class="details-content">

Measurement accuracy depends directly on $\cos \theta$.
* When beam alignment is parallel to flow ($\theta = 0^\circ$), $\cos \theta = 1.0$, yielding 100% velocity detection.
* An angle of $20^\circ$ produces a minimal ~ 6% underestimation ($\cos 20^\circ = 0.94$).
* Angles $> 20^\circ$ produce substantial, non-linear underestimation of true peak velocities and transvalvular gradients ([Fig. 1-11](#fig-01-11)).

<span id="fig-01-11"></span>![](fig-01-11.jpg)

**FIGURE 1-11** Doppler beam alignment. Comparison of adequate alignment ($\theta < 20^\circ$) yielding peak velocity and crisp envelope definition versus sub-optimal oblique alignment with pronounced velocity underestimation.

<details class="med-details"><summary>

#### <span id="box-01-07"></span>RECOMMENDATION 1-7: Optimizing Doppler Beam Alignment</summary><div class="details-content">

Always utilize colour Doppler mapping as a visual guide prior to placing the spectral Doppler cursor. Manipulate, rotate, and angulate the transducer until the Doppler cursor is aligned coaxially with the high-velocity jet vector.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Velocity Scale, PRF, and Aliasing</summary><div class="details-content">

In Pulsed-Wave (PW) Doppler, pulses are transmitted at the Pulse Repetition Frequency (PRF). The maximum unambiguous Doppler shift that can be resolved without wrap-around distortion is the **Nyquist limit**:
$$v_{\text{Nyquist}} = \frac{c \cdot \text{PRF}}{4 f_0 \cdot \cos \theta}$$
* **Scale Too Low:** Velocities exceeding the Nyquist limit alias, wrapping around the baseline into the opposite spectral display ([Fig. 1-12](#fig-01-12)).
* **Scale Too High:** Compresses the spectral envelope into a narrow band, impairing velocity measurement precision.

<span id="fig-01-12"></span>![](fig-01-12.jpg)

**FIGURE 1-12** Doppler velocity scale adjustments. **A:** Adequate velocity scale allowing accurate envelope tracing and timing. **B:** Velocity scale set too low, resulting in severe spectral aliasing.

</div></details>

<details class="med-details"><summary>

#### Sample Volume Position and Size</summary><div class="details-content">

The pulsed Doppler sample volume (gate) defines the exact spatial coordinate from which frequency shifts are sampled.

* **Sample Position:** For transmitral inflow assessment, the gate must be positioned precisely between the tips of the open mitral leaflets during diastole ([Fig. 1-13](#fig-01-13)). Placing the gate too high in the left atrium or too deep in the LV cavity introduces profound velocity distortion.
* **Sample Size:** Controls axial length of the gate ([Fig. 1-14](#fig-01-14)):
  * **Small sample volume (1–3 mm):** Provides high spatial resolution, isolating discrete laminar flow velocities with minimal spectral broadening.
  * **Large sample volume (5–10 mm):** Enhances signal sensitivity and velocity resolution at the expense of spatial localization; routinely employed in tissue Doppler imaging.

<span id="fig-01-13"></span>![](fig-01-13.jpg)

**FIGURE 1-13** Sample volume positioning for mitral inflow. **A:** Gate positioned too high in the atrium. **B:** Appropriate gate position at the leaflet tips. **C:** Gate positioned too deep into the LV cavity.

<span id="fig-01-14"></span>![](fig-01-14.jpg)

**FIGURE 1-14** Sample volume axial dimensions. Comparison between large sample volume (**A**, 10.1 mm), standard sample volume (**B**, 5.1 mm), and small sample volume (**C**, 1.0 mm).

<details class="med-details"><summary>

#### <span id="box-01-08"></span>RECOMMENDATION 1-8: Sample Volume Placement</summary><div class="details-content">

For transmitral flow evaluation, position the sample volume precisely at the tips of the mitral valve leaflets in the apical 4-chamber view. For left ventricular outflow tract (LVOT) stroke volume calculation, position the sample volume 3–5 mm apical to the aortic valve annulus.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Wall Filter and Sweep Speed</summary><div class="details-content">

* **Wall Filter (High-Pass Filter):** Rejects high-amplitude, low-velocity signals generated by moving myocardial walls and valve rings ([Fig. 1-15](#fig-01-15)):
  * *Filter too low:* High-amplitude wall motion pollutes the baseline, obscuring low-velocity signals.
  * *Filter too high:* Eradicates physiological low-velocity blood signals, such as late diastolic mitral A-waves or pulmonary vein reversals.
* **Sweep Speed:** Controls horizontal time-base scrolling rate ([Fig. 1-16](#fig-01-16)):
  * *Standard sweep speed (100 mm/s):* Mandatory for precise measurement of interval durations, acceleration/deceleration times, and velocity-time integrals (VTI).
  * *Reduced sweep speed (25–33 mm/s):* Displays multiple consecutive cardiac cycles across respiratory phases, essential for evaluating respiratory variation in suspected constrictive pericarditis or cardiac tamponade.

<span id="fig-01-15"></span>![](fig-01-15.jpg)

**FIGURE 1-15** Wall filter settings. **A:** Filter set too low; myocardial motion signals pollute the baseline. **B:** Appropriate filter setting with clear baseline and preserved envelope. **C:** Filter set too high; low-velocity onset and cessation of flow are artifactually clipped.

<span id="fig-01-16"></span>![](fig-01-16.jpg)

**FIGURE 1-16** Spectral Doppler sweep speed. **A:** Standard sweep speed of 100 mm/s for morphological and quantitative analysis. **B:** Compressed sweep speed of 33 mm/s for assessing respiratory variation across consecutive beats.

<details class="med-details"><summary>

#### <span id="box-01-09"></span>RECOMMENDATION 1-9: Wall Filter Setting</summary><div class="details-content">

Set the wall filter to the lowest level that eliminates baseline myocardial rumble without truncating low-velocity diastolic filling or regurgitant signals.

</div></details>

<details class="med-details"><summary>

#### <span id="box-01-10"></span>RECOMMENDATION 1-10: Standard Sweep Speed</summary><div class="details-content">

Always record spectral Doppler profiles at 100 mm/s for quantitative measurements. Switch to 25–33 mm/s when examining beat-to-beat respiratory dynamics.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.8 Colour-Flow Mapping</summary><div class="details-content">

Colour-Flow Mapping (CFM) overlays multi-gate pulsed Doppler velocity information onto real-time 2D grayscale anatomical images.

<details class="med-details"><summary>

#### Colour Encoding and Velocity Scale</summary><div class="details-content">

Colour encoding follows the standardized BART convention (Blue Away, Red Towards the transducer):
* **Red:** Flow directed towards the probe.
* **Blue:** Flow directed away from the probe.
* **Mosaic / Green Variance:** High-velocity turbulent flow or velocity variance exceeding the Nyquist limit, causing aliasing ([Fig. 1-17](#fig-01-17)).
* **Colour Scale:** Set between 50 and 70 cm/s for standard valve regurgitation and stenosis evaluation. Lowering scale below 30 cm/s induces low-velocity aliasing, useful only when mapping pulmonary venous flow or low-flow atrial shunts.

<span id="fig-01-17"></span>![](fig-01-17.jpg)

**FIGURE 1-17** Colour-flow mapping velocity scale and aliasing. Velocities within the Nyquist limit are encoded as laminar red or blue; velocities exceeding the threshold exhibit colour aliasing (mosaic/green reversal).

<details class="med-details"><summary>

#### <span id="box-01-11"></span>RECOMMENDATION 1-11: Colour Velocity Scale</summary><div class="details-content">

Maintain colour velocity scale at 50–70 cm/s for valvular assessment. For Proximal Isovelocity Surface Area (PISA) quantitation, shift the baseline downward in the direction of the jet to lower the aliasing velocity to 20–40 cm/s.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Colour Gain Optimization</summary><div class="details-content">

Colour gain controls electronic amplification of Doppler packets.
* *Gain too low:* Pathological regurgitant jets are underestimated or missed entirely.
* *Gain too high:* Random electronic noise speckles non-vascular myocardial and cavity spaces.

<details class="med-details"><summary>

#### <span id="box-01-12"></span>RECOMMENDATION 1-12: Colour Gain Adjustment Protocol</summary><div class="details-content">

Increase colour gain until random background speckling ('snow') appears across stationary tissue, then slowly turn the gain knob down just until the speckling disappears.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Colour Box Size and Temporal Resolution</summary><div class="details-content">

Colour Doppler relies on multi-pulse ensembles (packet sizes of 8–16 pulses per scan line). Consequently, the colour region of interest (ROI) dramatically depresses system frame rate ([Fig. 1-18](#fig-01-18)).

* A large colour box covering the entire ventricle degrades frame rate (often dropping below 15 fps).
* Restricting box width and depth restores high temporal resolution (> 30 fps), preventing missed transient regurgitant jets.

<span id="fig-01-18"></span>![](fig-01-18.jpg)

**FIGURE 1-18** Impact of colour box size on temporal resolution. **A:** Small, focused colour box maintaining high frame rate (31.2 fps). **B:** Excessively large colour box causing severe frame rate degradation (12.9 fps).

<details class="med-details"><summary>

#### <span id="box-01-13"></span>RECOMMENDATION 1-13: Minimizing Colour Sector Geometry</summary><div class="details-content">

Keep the colour box as small and narrow as possible, restricted strictly to the valve or pathology under investigation, to preserve optimal spatial and temporal resolution.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.9 Advanced Echocardiographic Modalities</summary><div class="details-content">

Advanced echocardiographic modalities provide quantitative assessment of regional myocardial mechanics and volumetric anatomy.

<details class="med-details"><summary>

#### Myocardial Velocity Imaging (Tissue Doppler Imaging - TDI)</summary><div class="details-content">

Tissue Doppler Imaging (TDI) measures high-amplitude, low-velocity acoustic signals reflected from myocardial fibers rather than blood pool erythrocytes ([Fig. 1-19](#fig-01-19)).

Essential acquisition steps:
1. **Parallel Alignment:** Align the ultrasound beam strictly parallel to longitudinal myocardial wall motion (< 20° off-axis).
2. **Velocity Scale:** Adjust PRF scale to standard myocardial ranges (typically −20 to +20 cm/s).
3. **Sector Geometry:** Use narrow sector widths to achieve high frame rates (optimal > 115 fps for colour TDI).
4. **Sample Placement:** For mitral annular velocities ($s', e', a'$), place a 5–10 mm sample volume at the septal and lateral mitral annulus, within 1 cm of the insertion site.
5. **ECG Gating:** Ensure high-quality ECG recording for reliable measurement of isovolumic contraction (IVCT) and relaxation (IVRT) intervals.

<span id="fig-01-19"></span>![](fig-01-19.jpg)

**FIGURE 1-19** Myocardial Velocity Imaging (TDI). Left panel demonstrates Pulsed-Wave TDI displaying systolic ($s'$) and diastolic ($e', a'$) annular velocities; right panel shows real-time colour-coded myocardial velocity mapping.

</div></details>

<details class="med-details"><summary>

#### Speckle Tracking Echocardiography (2D Strain Imaging)</summary><div class="details-content">

Two-dimensional speckle tracking echocardiography (STE) tracks acoustic natural acoustic markers (speckles) generated by sub-wavelength tissue scatterers across consecutive cardiac frames ([Fig. 1-20](#fig-01-20)).

Key technical requirements for robust strain computation:
1. **Gain and Focus:** Optimize grayscale gain and place the focal zone at mid-cavity depth to maximize speckle clarity.
2. **Region of Interest Centering:** Center the left ventricle in standard apical 4-, 2-, and 3-chamber views without apex foreshortening.
3. **Depth and Size:** Adjust depth so the mitral annulus lies near the base of the sector, maximizing myocardial pixel resolution.
4. **Frame Rate Optimization:** Maintain frame rate strictly between 50 and 90 fps. Frame rates < 40 fps cause tracking loss between frames; frame rates > 100 fps reduce line density and degrade speckle pattern definition.
5. **ECG Signal:** Clean ECG trace is essential to define end-diastolic reference points and aortic valve closure timing.

<span id="fig-01-20"></span>![](fig-01-20.jpg)

**FIGURE 1-20** Two-dimensional speckle tracking echocardiography (STE). Semiautomated tracking of myocardial acoustic speckles across the cardiac cycle, displaying longitudinal strain curves and polar bull's-eye map.

</div></details>

<details class="med-details"><summary>

#### Three-Dimensional (3D) Echocardiography</summary><div class="details-content">

Full-matrix array transducers contain thousands of active piezoelectric elements, acquiring pyramidal volumetric data sets without geometric assumptions ([Fig. 1-21](#fig-01-21)).

Protocol for successful 3D volumetric acquisition:
1. **Acoustic Window:** Secure an optimal, wide acoustic window because matrix probes have larger physical footprints.
2. **2D Centering:** Use biplane (orthogonal) 2D guidance to verify that the entire ventricular cavity or valve apparatus remains within the pyramidal volume throughout systole and diastole.
3. **Respiratory Gating:** Instruct the patient to perform quiet end-expiratory breath-holding during multi-beat acquisitions to avoid stitch artifacts.
4. **Volume Rate Optimization:** Balance single-beat live 3D imaging (lower volume rate, ~ 20–30 Hz, zero stitch artifacts) against multi-beat stitched acquisition (4–6 beats, higher volume rate, > 50 Hz, susceptible to respiratory movement and arrhythmias).
5. **Gain and Drop-Out:** Carefully adjust 3D gain to avoid pseudo-drop-out of thin membranous structures while preventing artificial tissue bridging.
6. **Volumetric Cropping:** Utilize multi-planar reconstruction (MPR) cropping tools to re-slice and visualize en-face anatomical views of valve orifices and congenital defects.

<span id="fig-01-21"></span>![](fig-01-21.jpg)

**FIGURE 1-21** Three-dimensional (3D) volumetric echocardiography. Full-volume pyramidal rendering providing comprehensive en-face visualization of intracardiac anatomy and automated left ventricular volumetric reconstruction.

</div></details>

</div></details>
"""

# ----------------- RUSSIAN TRANSLATION: chapter-01-ru.md -----------------
ru_md = """# Глава 1. Настройка аппарата и проведение эхокардиографического исследования

##### Полное руководство по стандартной настройке системы, физическим основам акустики, оптимизации 2D-изображения, допплеровским методикам и передовым протоколам визуализации согласно рекомендациям EACVI.

<details class="med-details"><summary>

## Краткое содержание</summary><div class="details-content">

### Физические и инструментальные параметры
* **Акустическая мощность (Acoustic Power):** Регулирует уровень ультразвуковой энергии, излучаемой датчиком в ткани. Повышение мощности увеличивает соотношение сигнал/шум (SNR), но повышает потенциальный риск биоэффектов. Контролируется через термический индекс (TI < 2,0) и механический индекс (MI < 1,9).
* **Усиление (Gain) и компенсация по глубине (DGC/TGC):** Общее усиление одинаково усиливает как отраженные эхо-сигналы, так и аппаратный шум (соотношение SNR остается неизменным). DGC позволяет компенсировать затухание ультразвука на различных глубинах; исследование всегда начинают с нейтрального (центрального) положения ползунков DGC.
* **Частота излучения (Transmit Frequency) и тканевая гармоника (THI):** Высокие частоты обеспечивают максимальное пространственное разрешение, но быстрее затухают. Тканевая гармоника излучает на основной частоте $f_0$, а принимает на второй гармонике $2f_0$, подавляя реверберации ближней зоны и шум от грудной стенки.
* **Положение фокуса (Focal Position):** Задает глубину максимального сужения ультразвукового луча, где латеральное разрешение наивысшее. Фокусный маркер следует размещать на уровне или чуть глубже наиболее глубокой исследуемой структуры.
* **Временное разрешение (Frame Rate):** Определяется плотностью линий сканирования и частотой кадров. Высокая частота кадров снижает плотность линий (ухудшая латеральное разрешение). Для стандартной 2D-визуализации требуется 30–50 кадров/с; для спекл-трекинга — 50–90 кадров/с; для тканевой допплерографии миокарда — > 115 кадров/с.

### Оптимизация спектрального и цветового допплера
* **Коаксиальность допплеровского луча:** Угол падения луча к вектору кровотока должен составлять < 20° ($\cos \theta \approx 1,0$), чтобы избежать критического занижения скорости и градиента давления.
* **Шкала скорости (PRF) и предел Найквиста:** Заниженная шкала вызывает элайзинг (заворачивание спектра); завышенная шкала ухудшает точность измерения низких скоростей.
* **Контрольный объем (Sample Volume):** В импульсно-волновом допплере (PW) размер контрольного объема определяет продольную длину зоны стробирования (1–3 мм для кровотока; 5–10 мм для тканевого допплера). При оценке трансмитрального потока контрольный объем устанавливается строго между кончиками открытых створок митрального клапана.
* **Фильтр движения стенок (Wall Filter) и скорость развертки (Sweep Speed):** Фильтр высоких частот срезает низкоскоростные высокоамплитудные сигналы от движения миокарда. Стандартная скорость развертки составляет 100 мм/с, а для оценки респираторных вариаций при констриктивном перикардите и тампонаде — 25–33 мм/с.
* **Цветовое допплеровское картирование (ЦДК):** Частота кадров в режиме ЦДК обратно пропорциональна ширине и глубине цветового сектора. Цветовое окно должно быть максимально узким и ограничиваться непосредственно зоной исследуемого клапана или дефекта.

</div></details>

<details class="med-details"><summary>

## 1.1 Подготовка к трансторакальному исследованию</summary><div class="details-content">

Стандартизированное и качественное трансторакальное эхокардиографическое исследование (ТТЭхоКГ) начинается с тщательной подготовки пациента, рабочего места и аппаратуры до начала сканирования.

<details class="med-details"><summary>

#### Положение пациента и окружающие условия</summary><div class="details-content">

* **Положение пациента:** Пациент укладывается в удобное положение на левом боку (с наклоном туловища от 30° до 45°). Левая рука заводится за голову, что расширяет межреберные промежутки и смещает сердце ближе к передней грудной стенке.
* **Дыхание:** Пациент должен дышать спокойно и ровно. Глубокий вдох приводит к расправлению легочной ткани, перекрытию акустических окон и значительному смещению сердца по оси.
* **Кабинет ЭхоКГ:** Освещение должно быть приглушено для максимального контрастного восприятия на экране монитора и исключения бликов. В помещении должна соблюдаться тишина для использования звукового канала допплера при точной ориентации датчика.
* **Синхронизация по ЭКГ:** Чистый, синхронизированный по времени сигнал ЭКГ во 2-м отведении с четким зубцом R обязателен для всех исследований. Корректная синхронизация критически необходима для фиксации конечно-диастолических и конечно-систолических кадров, расчета ударного объема, а также для многосердечной 3D-реконструкции и спекл-трекинга.
* **Выбор датчика:** Датчик с фазированной решеткой подбирается с учетом комплекции пациента (для взрослых обычно 1,5–5,0 МГц).
* **Техническое обслуживание:** Регулярная очистка фильтров, калибровка системы и осмотр акустической линзы датчика предотвращают появление электрических наводок и артефактов выпадения элементов.

</div></details>

<details class="med-details"><summary>

#### Оптимизация предустановок аппарата</summary><div class="details-content">

Современные ультразвуковые сканеры имеют предустановленные наборы настроек (пресеты). Исследование сердца всегда следует начинать со специализированного кардиологического пресета, а не абдоминального или сосудистого ([Рис. 1-1](#fig-01-01)).

<span id="fig-01-01"></span>![](fig-01-01.jpg)

**РИСУНОК 1-1** Предустановки (пресеты) эхокардиографа. Сравнение кардиологического (**A**) и абдоминального (**B**) пресетов. Кардиологические настройки обеспечивают более высокую частоту кадров, специальное логарифмическое сжатие и динамический диапазон, адаптированные для быстро движущегося миокарда.

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.2 Акустическая мощность и биологические эффекты</summary><div class="details-content">

Акустическая мощность регулирует суммарную ультразвуковую энергию, генерируемую пьезоэлементами датчика и передаваемую в биологические ткани.

<details class="med-details"><summary>

#### Акустическая энергия и соотношение сигнал/шум</summary><div class="details-content">

Подача более высокой акустической энергии формирует более сильные отраженные эхо-сигналы от структур сердца, что напрямую повышает соотношение сигнал/шум (SNR) и улучшает четкость 2D-изображения ([Рис. 1-2](#fig-01-02)).

Акустическая мощность выражается в децибелах (дБ) относительно максимальной паспортной мощности аппарата (100% мощности соответствует 0 дБ; снижение мощности на 50% соответствует −6 дБ).

<span id="fig-01-02"></span>![](fig-01-02.jpg)

**РИСУНОК 1-2** Регулировка акустической мощности. Сравнение низкой акустической мощности (**A**) с выраженным зашумлением и выпадением сигналов, и высокой акустической мощности (**B**) с четкой дифференциацией эндокарда и границ миокарда.

</div></details>

<details class="med-details"><summary>

#### Биологические эффекты ультразвука: термический и механический индексы</summary><div class="details-content">

Чрезмерное воздействие ультразвука способно вызвать повреждение тканей через два основных физических механизма:

1. **Термические эффекты (нагрев):** Поглощение ультразвуковой энергии тканями сопровождается выделением тепла. Этот процесс непрерывно мониторируется с помощью **термического индекса (Thermal Index, TI)**:
   $$\text{TI} = \frac{W_p}{W_{\text{deg}}}$$
   где $W_p$ — излучаемая акустическая мощность, а $W_{\text{deg}}$ — расчетная мощность, требуемая для нагрева ткани на 1°C. При стандартных исследованиях сердца **значение TI должно строго оставаться ниже 2,0**.
2. **Механические эффекты (кавитация):** Чередование фаз сжатия и разрежения волны приводит к образованию микропузырьков газа в жидких средах с их последующим схлопыванием, что генерирует локальные пиковые давления и микроструи. Потенциал кавитации оценивается с помощью **механического индекса (Mechanical Index, MI)**:
   $$\text{MI} = \frac{P_{r,\alpha}}{\sqrt{f_c}}$$
   где $P_{r,\alpha}$ — пиковое отрицательное давление разрежения, а $f_c$ — центральная частота излучения. При стандартном исследовании **MI должен быть ниже 1,9** (и существенно ниже при контрастной ЭхоКГ).

<details class="med-details"><summary>

#### <span id="box-01-01"></span>РЕКОМЕНДАЦИЯ 1-1: Контроль акустической мощности</summary><div class="details-content">

Хотя увеличение акустической мощности улучшает отношение сигнал/шум (SNR), оно одновременно повышает вероятность нежелательных биоэффектов. Необходимо следовать принципу ALARA (As Low As Reasonably Achievable — настолько низко, насколько разумно достижимо). Увеличивать мощность выше заводских настроек следует только в ситуациях, когда стандартный уровень дает неприемлемо низкое качество изображения, несмотря на оптимизацию усиления и частоты.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.3 Усиление и регулировка усиления по глубине</summary><div class="details-content">

Органы управления усилением определяют, как отраженные радиочастотные сигналы усиливаются и форматируются для отображения на экране.

<details class="med-details"><summary>

#### Общее 2D-усиление (Master Gain)</summary><div class="details-content">

Общее усиление равномерно усиливает все принимаемые эхо-сигналы по всей глубине перед логарифмическим сжатием и выводом на дисплей.

* Повышение усиления делает ярче слабые эхо-сигналы от эндокарда.
* Однако общее усиление точно так же усиливает фоновый электронный шум и артефакты реверберации.
* В результате **соотношение сигнал/шум (SNR) остается абсолютно неизменным** при любом значении общего усиления ([Рис. 1-3](#fig-01-03) и [Рис. 1-4](#fig-01-04)).

<span id="fig-01-03"></span>![](fig-01-03.jpg)

**РИСУНОК 1-3** Влияние электронного усиления на соотношение сигнал/шум (SNR). Отраженный ультразвуковой сигнал и аппаратурный шум усиливаются пропорционально, поэтому базовое соотношение SNR остается идентичным.

<span id="fig-01-04"></span>![](fig-01-04.jpg)

**РИСУНОК 1-4** Эффекты чрезмерного и оптимального общего 2D-усиления. Избыточное усиление приводит к засветке полостей и потере контрастности, тогда как недостаточное усиление вызывает выпадение эндокардиальных контуров.

<details class="med-details"><summary>

#### <span id="box-01-02"></span>РЕКОМЕНДАЦИЯ 1-2: Настройка общего усиления</summary><div class="details-content">

Настраивайте общее 2D-усиление так, чтобы полости сердца оставались анэхогенными (черными), а паренхима миокарда имела естественную серую зернистую текстуру без искусственного пересвечивания.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Компенсация усиления по глубине (DGC / TGC)</summary><div class="details-content">

Энергия ультразвука экспоненциально затухает по мере распространения в тканях из-за поглощения и рассеяния:
$$A(z) = A_0 \cdot e^{-\alpha \cdot f \cdot z}$$
где $\alpha$ — коэффициент затухания (~ 0,5–1,0 дБ/см/МГц в миокарде), $f$ — частота, а $z$ — глубина.

Для устранения затухания на удаленных участках применяется **компенсация усиления по глубине (Depth Gain Compensation, DGC)**:
* **Автоматическая компенсация:** Сканер автоматически повышает коэффициент усиления для более глубоких эхо-сигналов.
* **Ручные ползунки (слайдеры):** Вертикальный блок потенциометров позволяет врачу селективно подстраивать яркость в конкретных горизонтальных слоях ([Рис. 1-5](#fig-01-05)).

<span id="fig-01-05"></span>![](fig-01-05.jpg)

**РИСУНОК 1-5** Ручная настройка компенсации усиления по глубине (DGC/TGC). **A:** Ползунки смещены вправо (чрезмерная засветка ближней зоны). **B:** Нейтральное центральное положение (равномерная яркость по всей глубине). **C:** Ползунки смещены влево (затемнение и выпадение дистальных структур).

<details class="med-details"><summary>

#### <span id="box-01-03"></span>РЕКОМЕНДАЦИЯ 1-3: Исходная позиция ползунков DGC</summary><div class="details-content">

Каждое новое исследование следует начинать при строго нейтральном (центральном) положении всех ползунков DGC. Смещайте отдельные слайдеры только при необходимости скорректировать локальную засветку ближней зоны или затухание в дальней зоне.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.4 Частота излучения и тканевая гармоника</summary><div class="details-content">

Рабочая частота — фундаментальный параметр, определяющий баланс между разрешающей способностью и глубиной проникновения ультразвука.

<details class="med-details"><summary>

#### Основная частота излучения</summary><div class="details-content">

Широкополосные матричные и фазированные датчики позволяют переключать рабочую частоту:
* **Низкая частота (например, 2,0 МГц):** Большая длина волны ($\lambda = c / f$) обеспечивает минимальное затухание и превосходное проникновение через плотную грудную стенку, но снижает продольное и латеральное пространственное разрешение ([Рис. 1-6](#fig-01-06)).
* **Высокая частота (например, 3,5–5,0 МГц):** Малая длина волны гарантирует высочайшую детализацию тонких структур (створки клапанов, вегетации), но быстро затухает, ограничивая визуализацию на глубине.

<span id="fig-01-06"></span>![](fig-01-06.jpg)

**РИСУНОК 1-6** Влияние переключения частоты излучения датчика. Частота 2,0 МГц обеспечивает проникновение в сложных ультразвуковых окнах, тогда как 3,5 МГц дает высокую резкость анатомических структур в ближнем и среднем полях.

</div></details>

<details class="med-details"><summary>

#### Режим тканевой гармоники (Tissue Harmonic Imaging, THI)</summary><div class="details-content">

Режим второй гармоники использует нелинейное распространение ультразвука в тканях. Поскольку фаза сжатия распространяется чуть быстрее фазы разрежения, синусоидальная волна деформируется, генерируя гармонические составляющие ($2f_0, 3f_0, \dots$) преимущественно в центре мощного луча ([Рис. 1-7](#fig-01-07)).

* **Устранение ревербераций:** Поскольку в поверхностных слоях (подкожный жир, ребра) гармоники еще не успели сформироваться, артефакты реверберации и шумы от грудной стенки практически отсутствуют.
* **Повышение отношения сигнал/шум:** Боковые лепестки луча имеют недостаточную мощность для генерации гармоник, что значительно улучшает контрастность эндокарда.
* **Особенности разрешения:** При приеме на удвоенной частоте импульс может быть слегка длиннее, что несколько снижает осевое разрешение по сравнению с чистым высокочастотным фундаментальным режимом.

<span id="fig-01-7"></span>![](fig-01-07.jpg)

**РИСУНОК 1-7** Сравнение фундаментального режима и режима тканевой гармоники. Тканевая гармоника (1,7/3,4 МГц) подавляет шум и четко визуализирует эндокард; фундаментальный режим (3,5 МГц) предпочтителен для исследования тонких краевых структур створок.

<details class="med-details"><summary>

#### <span id="box-01-04"></span>РЕКОМЕНДАЦИЯ 1-4: Использование тканевой гармоники</summary><div class="details-content">

* Тканевая гармоника (THI) должна оставаться стандартным режимом по умолчанию для оценки полостей и сократимости миокарда.
* Сохраняйте центральную частоту датчика, снижая ее только при выраженном дефиците проникновения или переключаясь в фундаментальный режим для сверхтонкого анализа створок.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.5 Положение фокуса и геометрия ультразвукового луча</summary><div class="details-content">

Электронная фокусировка концентрирует ультразвуковую энергию в узкий пучок на заданной оператором глубине.

<details class="med-details"><summary>

#### Фокальная зона и латеральное разрешение</summary><div class="details-content">

Латеральное разрешение сканера — способность разделять две точки, расположенные перпендикулярно оси луча, — напрямую зависит от ширины ультразвукового луча.

* Ширина луча минимальна в **фокальной точке**, где латеральное разрешение достигает максимума ([Рис. 1-8](#fig-01-08)).
* За пределами фокальной зоны луч расширяется, что вызывает смазывание контуров и ложное утолщение мелких структур ([Рис. 1-9](#fig-01-09)).

<span id="fig-01-08"></span>![](fig-01-08.jpg)

**РИСУНОК 1-8** Положение фокальной точки. Стрелка на шкале сектора указывает глубину наивысшего латерального разрешения.

<span id="fig-01-09"></span>![](fig-01-09.jpg)

**РИСУНОК 1-9** Моделированное акустическое поле давления кардиологического датчика при различных глубинах фокуса ($F = 50\text{ мм}$, $F = 90\text{ мм}$, $F = 130\text{ мм}$). Белая полоса показывает ширину луча. Обратите внимание на расширение луча и падение латерального разрешения на глубинах за пределами фокуса.

<details class="med-details"><summary>

#### <span id="box-01-05"></span>РЕКОМЕНДАЦИЯ 1-5: Размещение фокальной точки</summary><div class="details-content">

Устанавливайте фокусный маркер на уровне или чуть ниже исследуемой анатомической структуры (например, на уровне створок митрального клапана при оценке митральной регургитации или у верхушки ЛЖ при поиске тромба).

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.6 Временное разрешение и частота кадров</summary><div class="details-content">

Временное разрешение определяет способность системы отображать динамические высокоскоростные процессы сокращения и движения створок, измеряясь в кадрах в секунду (fps).

<details class="med-details"><summary>

#### Физический компромисс параметров сканирования</summary><div class="details-content">

Скорость ультразвука в тканях фиксирована ($c \approx 1540\text{ м/с}$), поэтому время формирования одной линии сканирования неизменно:
$$T_{\text{line}} = \frac{2 \cdot \text{Depth}}{c}$$
Максимальная достижимая частота кадров определяется формулой:
$$\text{Frame Rate} \le \frac{c}{2 \cdot \text{Depth} \cdot N_{\text{lines}}}$$
где $N_{\text{lines}}$ — число ультразвуковых линий в кадре.

Чтобы повысить частоту кадров без изменения глубины, система вынуждена уменьшать число линий, что снижает латеральное разрешение ([Рис. 1-10](#fig-01-10)).

* **Ширина сектора:** Сужение угла сектора сокращает число линий, немедленно повышая частоту кадров.
* **Глубина сканирования:** Уменьшение глубины сокращает время пробега импульса и повышает частоту кадров.

<span id="fig-01-10"></span>![](fig-01-10.jpg)

**РИСУНОК 1-10** Взаимосвязь частоты кадров и пространственного разрешения. Высокая плотность линий (**A**, 43,3 кадра/с) обеспечивает высокую четкость; уменьшение плотности линий (**B**, 79,2 кадра/с) улучшает временной захват быстро движущихся створок, но снижает детализацию.

<details class="med-details"><summary>

#### <span id="box-01-06"></span>РЕКОМЕНДАЦИЯ 1-6: Контроль частоты кадров</summary><div class="details-content">

Для рутинной анатомической оценки удерживайте частоту кадров в стандартном диапазоне (30–60 кадров/с). Увеличивайте частоту кадров (сужая сектор и уменьшая глубину) при исследовании подвижных створок, стресс-эхокардиографии или спекл-трекинге.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.7 Непрерывно-волновой и импульсно-волновой допплер</summary><div class="details-content">

Спектральный допплер измеряет скорость, направление и время движения потоков крови на основе допплеровского сдвига частоты:
$$\Delta f = \frac{2 f_0 \cdot v \cdot \cos \theta}{c}$$
где $v$ — скорость эритроцитов, а $\theta$ — угол между лучом и потоком.

<details class="med-details"><summary>

#### Коаксиальность луча и угол падения</summary><div class="details-content">

Точность измерения скорости строго зависит от $\cos \theta$:
* При угле $\theta = 0^\circ$ (строго параллельно) $\cos \theta = 1,0$, регистрируется 100% истинной скорости.
* При угле до $20^\circ$ занижение скорости составляет не более 6% ($\cos 20^\circ = 0,94$).
* При угле $> 20^\circ$ начинается резкое нелинейное занижение пиковых скоростей и расчетных градиентов давления ([Рис. 1-11](#fig-01-11)).

<span id="fig-01-11"></span>![](fig-01-11.jpg)

**РИСУНОК 1-11** Выравнивание допплеровского луча. Сравнение адекватной ориентации луча ($\theta < 20^\circ$) с четким спектральным пиком и неоптимального косого направления со значительным занижением скоростных показателей.

<details class="med-details"><summary>

#### <span id="box-01-07"></span>РЕКОМЕНДАЦИЯ 1-7: Обеспечение коаксиальности луча</summary><div class="details-content">

Всегда используйте цветовое картирование (ЦДК) как визуальный ориентир перед установкой допплеровского курсора. Корректируйте положение и угол датчика, пока спектральный луч не совпадет строго с вектором высокоскоростной струи.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Шкала скорости, частота повторения импульсов и элайзинг</summary><div class="details-content">

В импульсно-волновом допплере (PW) импульсы излучаются с частотой повторения PRF. Максимальный сдвиг частоты, который может быть измерен без искажений, ограничен **пределом Найквиста**:
$$v_{\text{Nyquist}} = \frac{c \cdot \text{PRF}}{4 f_0 \cdot \cos \theta}$$
* **Шкала слишком низкая:** Скорости выше предела Найквиста заворачиваются, срезаясь на базовую линию с противоположной стороны ([Рис. 1-12](#fig-01-12)).
* **Шкала слишком высокая:** Спектральная кривая сжимается в тонкую полосу около изолинии, делая невозможным точное измерение.

<span id="fig-01-12"></span>![](fig-01-12.jpg)

**РИСУНОК 1-12** Настройка шкалы скорости. **A:** Оптимальная шкала скорости для точной обводки спектра. **B:** Заниженная шкала с выраженным допплеровским элайзингом.

</div></details>

<details class="med-details"><summary>

#### Положение и размер контрольного объема</summary><div class="details-content">

Контрольный объем (sample volume, gate) определяет пространственные координаты, из которых регистрируется спектр скоростей.

* **Положение:** При оценке трансмитрального потока контрольный объем устанавливается строго между кончиками створок митрального клапана в фазу диастолы ([Рис. 1-13](#fig-01-13)). Смещение в левое предсердие или глубоко в полость ЛЖ резко искажает кривую наполнения.
* **Размер контрольного объема:** Определяет продольный размер зоны стробирования ([Рис. 1-14](#fig-01-14)):
  * **Малый объем (1–3 мм):** Обеспечивает высокую пространственную локализацию, улавливая ламинарный поток без спектрального уширения.
  * **Большой объем (5–10 мм):** Повышает чувствительность и скоростное разрешение за счет усреднения скоростей; стандартно применяется в тканевой допплерографии.

<span id="fig-01-13"></span>![](fig-01-13.jpg)

**РИСУНОК 1-13** Положение контрольного объема при оценке трансмитрального диастолического потока. **A:** Слишком высоко в предсердии. **B:** Оптимально на уровне кончиков створок. **C:** Слишком глубоко в полости ЛЖ.

<span id="fig-01-14"></span>![](fig-01-14.jpg)

**РИСУНОК 1-14** Продольный размер контрольного объема. Сравнение большого объема (**A**, 10,1 мм), среднего объема (**B**, 5,1 мм) и малого объема (**C**, 1,0 мм).

<details class="med-details"><summary>

#### <span id="box-01-08"></span>РЕКОМЕНДАЦИЯ 1-8: Локализация контрольного объема</summary><div class="details-content">

Для трансмитрального потока устанавливайте контрольный объем строго между кончиками створок в 4-камерной верхушечной позиции. Для расчета ударного объема в выходном тракте ЛЖ (LVOT) смещайте контрольный объем на 3–5 мм проксимальнее створок аортального клапана.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Фильтр движения стенок и скорость развертки</summary><div class="details-content">

* **Фильтр движения стенок (Wall Filter):** Отсекает мощные низкоскоростные эхо-сигналы от стенок сердца и фиброзных колец ([Рис. 1-15](#fig-01-15)):
  * *Слишком низкий:* Движение стенок создает помехи на изолинии, зашумляя спектр.
  * *Слишком высокий:* Срезаются истинные низкоскоростные потоки (пик A наполнения, поток в легочных венах).
* **Скорость развертки (Sweep Speed):** Определяет горизонтальную скорость движения спектра во времени ([Рис. 1-16](#fig-01-16)):
  * *Стандартная (100 мм/с):* Необходима для точных измерений временных интервалов, времени замедления (DT) и интеграла линейной скорости (VTI).
  * *Замедленная (25–33 мм/с):* Отображает множество последовательных циклов, выявляя респираторные колебания скоростей при подозрении на констриктивный перикардит или тампонаду.

<span id="fig-01-15"></span>![](fig-01-15.jpg)

**РИСУНОК 1-15** Настройка фильтра движения стенок (Wall Filter). **A:** Фильтр слишком низкий (помехи от движения миокарда). **B:** Оптимальный фильтр с чистой базовой линией. **C:** Фильтр слишком высокий (срезание физиологических низкоскоростных потоков).

<span id="fig-01-16"></span>![](fig-01-16.jpg)

**РИСУНОК 1-16** Скорость развертки спектрального допплера. **A:** Стандартная скорость 100 мм/с для количественного анализа. **B:** Сжатая развертка 33 мм/с для регистрации респираторных вариаций потока.

<details class="med-details"><summary>

#### <span id="box-01-09"></span>РЕКОМЕНДАЦИЯ 1-9: Установка фильтра движения стенок</summary><div class="details-content">

Устанавливайте фильтр на минимальный уровень, достаточный для подавления миокардиальных шумов около изолинии, избегая срезания низких скоростей диастолического наполнения.

</div></details>

<details class="med-details"><summary>

#### <span id="box-01-10"></span>РЕКОМЕНДАЦИЯ 1-10: Скорость развертки</summary><div class="details-content">

Всегда записывайте спектры на скорости 100 мм/с для измерений. Переключайтесь на 25–33 мм/с только при оценке межсердечного взаимодействия и влияния дыхания.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.8 Цветовое допплеровское картирование</summary><div class="details-content">

Цветовое допплеровское картирование (ЦДК) накладывает многоточечную информацию о скоростях кровотока на двухмерное черно-белое изображение.

<details class="med-details"><summary>

#### Цветовое кодирование и скоростная шкала</summary><div class="details-content">

Цветовое кодирование следует международному стандарту BART (Blue Away, Red Towards — синий от датчика, красный к датчику):
* **Красный:** Поток направлен к датчику.
* **Синий:** Поток направлен от датчика.
* **Мозаичный / зеленый цвет:** Турбулентный поток с выраженной дисперсией скоростей или скоростями, превышающими предел Найквиста (элайзинг) ([Рис. 1-17](#fig-01-17)).
* **Шкала скорости:** Стандартно устанавливается на 50–70 см/с для оценки клапанных пороков. Снижение шкалы ниже 30 см/с вызывает преждевременный элайзинг и применяется только для картирования низких скоростей (легочные вены, межпредсердные шунты).

<span id="fig-01-17"></span>![](fig-01-17.jpg)

**РИСУНОК 1-17** Шкала скорости в режиме ЦДК и цветовой элайзинг. Ламинарные потоки кодируются синим и красным; при превышении предела Найквиста возникает турбулентная мозаичная окраска с инверсией цвета.

<details class="med-details"><summary>

#### <span id="box-01-11"></span>РЕКОМЕНДАЦИЯ 1-11: Шкала скоростей ЦДК</summary><div class="details-content">

Удерживайте цветовую шкалу в диапазоне 50–70 см/с для оценки клапанов. При расчете методом PISA смещайте изолинию вниз по направлению струи регургитации, устанавливая скорость элайзинга на уровень 20–40 см/с.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Оптимизация цветового усиления</summary><div class="details-content">

Цветовое усиление регулирует чувствительность приема допплеровских пакетов.
* *Слишком низкое усиление:* Недооценка площади и плотности регургитирующей струи.
* *Слишком высокое усиление:* Появление цветовых помех («снега») на миокарде и в полостях.

<details class="med-details"><summary>

#### <span id="box-01-12"></span>РЕКОМЕНДАЦИЯ 1-12: Протокол настройки цветового усиления</summary><div class="details-content">

Увеличивайте цветовое усиление до появления цветного шума («снега») на статичных тканях, затем плавно уменьшайте усиление ровно до момента исчезновения шума.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Размер цветового окна и временное разрешение</summary><div class="details-content">

Цветовой режим требует излучения пачек импульсов (по 8–16 импульсов на одну линию). Поэтому размер цветового окна резко снижает общую частоту кадров ([Рис. 1-18](#fig-01-18)).

* Широкое окно на весь желудочек может снизить частоту кадров до < 15 кадров/с.
* Узкое и неглубокое окно сохраняет высокую частоту кадров (> 30 кадров/с), исключая пропуск коротких струй регургитации.

<span id="fig-01-18"></span>![](fig-01-18.jpg)

**РИСУНОК 1-18** Влияние размера цветового окна на частоту кадров. **A:** Компактное окно обеспечивает частоту кадров 31,2 кадра/с. **B:** Чрезмерно широкое окно снижает частоту до 12,9 кадра/с.

<details class="med-details"><summary>

#### <span id="box-01-13"></span>РЕКОМЕНДАЦИЯ 1-13: Ограничение размеров цветового окна</summary><div class="details-content">

Формируйте цветовое окно минимально возможного размера, строго ограничивая его зоной исследуемого клапана или регургитирующего отверстия.

</div></details>

</div></details>

</div></details>

<details class="med-details"><summary>

## 1.9 Передовые методики эхокардиографии</summary><div class="details-content">

Передовые методики обеспечивают количественную оценку локальной деформации миокарда и трехмерную анатомическую реконструкцию.

<details class="med-details"><summary>

#### Тканевая допплерография миокарда (TDI / MVI)</summary><div class="details-content">

Тканевая допплерография (Myocardial Velocity Imaging, MVI) регистрирует высокоамплитудные низкоскоростные эхо-сигналы от миокардиальных волокон ([Рис. 1-19](#fig-01-19)).

Правила сбора данных:
1. **Строгая коаксиальность:** Направляйте луч параллельно продольному движению стенок (угол < 20°).
2. **Шкала скорости:** Устанавливайте PRF для диапазона скоростей миокарда (обычно от −20 до +20 см/с).
3. **Геометрия сектора:** Сужайте сектор сканирования для достижения высокой частоты кадров (> 115 кадров/с в цветовом TDI).
4. **Установка строба:** Для измерения скоростей фиброзного кольца ($s', e', a'$) контрольный объем шириной 5–10 мм помещают на септальную и латеральную зоны митрального кольца в пределах 1 см от места прикрепления створок.
5. **Синхронизация по ЭКГ:** Качественная ЭКГ необходима для измерения интервалов изоволюмического сокращения (IVCT) и расслабления (IVRT).

<span id="fig-01-19"></span>![](fig-01-19.jpg)

**РИСУНОК 1-19** Тканевая допплерография миокарда (TDI). Слева — импульсно-волновой тканевой допплер с регистрацией систолической ($s'$) и диастолических ($e', a'$) скоростей кольца; справа — цветовое картирование скоростей миокарда.

</div></details>

<details class="med-details"><summary>

#### Спекл-трекинг эхокардиография (2D Strain)</summary><div class="details-content">

Двухмерная спекл-трекинг эхокардиография (STE) отслеживает естественные акустические маркеры (спеклы), образованные рассеянием ультразвука в миокарде, на протяжении сердечного цикла ([Рис. 1-20](#fig-01-20)).

Ключевые технические требования:
1. **Усиление и фокус:** Оптимизируйте 2D-усиление и установите фокус на среднюю глубину полости для максимальной контрастности спеклов.
2. **Центрирование верхушки:** Центрируйте левый желудочек в стандартных верхушечных позициях (4-, 2- и 3-камерной) без ракурса срезанной верхушки (foreshortening).
3. **Глубина сканирования:** Подбирайте глубину так, чтобы митральное кольцо находилось у основания сектора, максимизируя число пикселей на миокард.
4. **Частота кадров:** Оптимальный диапазон составляет строго от 50 до 90 кадров/с. При частоте < 40 кадров/с программа теряет спеклы между кадрами; при > 100 кадров/с снижается плотность линий и четкость спекл-паттерна.
5. **ЭКГ-триггер:** Четкий зубец R необходим для фиксации конечно-диастолической опорной точки и разметки фаз сердечного цикла.

<span id="fig-01-20"></span>![](fig-01-20.jpg)

**РИСУНОК 1-20** Двухмерная спекл-трекинг эхокардиография (STE). Полуавтоматический трекинг спеклов миокарда с построением кривых продольной деформации (strain) и полярной карты («бычий глаз»).

</div></details>

<details class="med-details"><summary>

#### Трехмерная (3D) эхокардиография</summary><div class="details-content">

Полноматричные датчики с тысячами активных пьезоэлементов собирают трехмерный пирамидальный объем данных без геометрических допущений ([Рис. 1-21](#fig-01-21)).

Протокол качественной 3D-реконструкции:
1. **Акустическое окно:** Требуется стабильное широкое окно, так как матричный датчик имеет большую площадь поверхности.
2. **2D-центрирование:** Используйте ортогональный двухплоскостной (biplane) контроль, чтобы исследуемый клапан или полость целиком оставались внутри пирамидального сектора на протяжении всего цикла.
3. **Задержка дыхания:** Проводите многосердечный сбор данных (multi-beat) на спокойной задержке дыхания на выдохе для исключения артефактов склейки (stitch-artifacts).
4. **Частота объемов:** Выбирайте компромисс между односердечным сбором (live 3D, частота объемов 20–30 Гц, отсутствие артефактов склейки) и многосердечной склейкой (4–6 ударов, частота объемов > 50 Гц, чувствительность к аритмиям).
5. **3D-усиление:** Тщательно регулируйте 3D-усиление для предотвращения ложного выпадения тонких мембран и исключения тканевого шума.
6. **Плоскостное сечение (Cropping):** Используйте мультипланарную реконструкцию (MPR) для виртуального рассечения объема и визуализации клапанов en-face со стороны предсердия или желудочка.

<span id="fig-01-21"></span>![](fig-01-21.jpg)

**РИСУНОК 1-21** Трехмерная (3D) объемная эхокардиография. Полнообъемная пирамидальная реконструкция для анатомической визуализации структур сердца en-face и автоматизированного объемного анализа ЛЖ.

</div></details>

</div></details>
"""

with open(os.path.join(ch_dir, 'chapter-01.md'), 'w', encoding='utf-8') as f:
    f.write(en_md.strip() + '\n')

with open(os.path.join(ch_dir, 'chapter-01-ru.md'), 'w', encoding='utf-8') as f:
    f.write(ru_md.strip() + '\n')

print('Chapter 01 (EN & RU) generated successfully!')
