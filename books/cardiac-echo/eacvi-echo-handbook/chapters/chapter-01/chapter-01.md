# Chapter 1. Examination & Echo Machine Setup

##### Comprehensive guide to standard system setup, acoustic physics, image optimization, Doppler modalities, and advanced imaging protocols according to the EACVI.

<details class="med-details" open><summary>

## Executive Summary</summary><div class="details-content">

### Physical & Instrument Controls
* **Acoustic Power:** Regulates ultrasonic energy delivered to tissues. Higher output elevates signal-to-noise ratio (SNR) but increases potential bio-effects. Monitored through Thermal Index (TI < 2.0) and Mechanical Index (MI < 1.9).
* **Gain & Depth Gain Compensation (DGC):** Master gain amplifies both acoustic signals and ambient electronic noise equally (SNR remains strictly unchanged). DGC allows selective attenuation compensation at graduated depths; baseline examination should always begin with DGC sliders in the neutral central position.
* **Transmit Frequency & Harmonic Imaging:** Higher fundamental frequencies maximize axial and spatial resolution at the cost of tissue penetration. Tissue Harmonic Imaging (THI) transmits at frequency $f_0$ and receives at $2f_0$, suppressing near-field reverberations and clutter to improve SNR, though slightly broadening pulse duration.
* **Focal Position:** Sets the depth of beam narrowing where lateral resolution is highest. Best practice mandates placing the focal marker at or immediately below the deepest target cardiac structure.
* **Temporal Resolution (Frame Rate):** Represents scan line density per unit time. High frame rate reduces scan line density (diminishing lateral resolution). Diagnostic 2D imaging requires 30–50 fps; speckle tracking demands 50–90 fps; myocardial tissue Doppler requires > 115 fps.

### Spectral & Colour Doppler Optimization
* **Doppler Beam Alignment:** Intercept angle between ultrasound beam and blood flow vector must remain < 20° ($\cos 	heta pprox 1.0$) to avoid velocity underestimation.
* **Pulse Repetition Frequency (PRF) & Velocity Scale:** Scale set too low generates spectral aliasing; scale set too high compromises velocity resolution and dynamic range.
* **Sample Volume (SV):** In pulsed-wave (PW) Doppler, SV size controls axial sampling length (typically 1–3 mm for blood flow; 5–10 mm for tissue Doppler). For mitral inflow assessment, SV must be placed precisely between the open leaflet tips.
* **Wall Filter & Sweep Speed:** High-pass filter removes high-amplitude, low-velocity wall clutter; excessive filtering obliterates low-velocity diastolic filling waves. Standard sweep speed is 100 mm/s for cycle analysis, or 25–33 mm/s for assessing respiratory variation in constrictive pericarditis and tamponade.
* **Colour-Flow Mapping (CFM):** Frame rate in CFM is inversely proportional to sector width and depth. The colour region of interest (ROI) must be restricted strictly to the valve or pathology under investigation.

</div></details>

<details class="med-details" open><summary>

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

Modern ultrasound platforms provide pre-programmed software presets configured for specific anatomical targets. Examinations must always begin with the dedicated cardiac preset rather than abdominal or vascular configurations ([Fig. 1.1.1](#fig-01-01)).

<figure class="med-figure" id="fig-01-01">
  <img src="images/fig-01-01.jpg" alt="Fig. 1.1.1: Echo machine pre-settings. Comparison between cardiac (**A**) and abdominal (**B**) presets. Cardiac presets" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.1: Echo machine pre-settings. Comparison between cardiac (**A**) and abdominal (**B**) presets. Cardiac presets utilize higher frame rates, specialized logarithmic compression curves, and dynamic range settings tailored to rapid myocardial motion.</figcaption>
</figure>

</div></details>

</div></details>

<details class="med-details" open><summary>

## 1.2 Acoustic Power and Bio-Effects</summary><div class="details-content">

Acoustic power controls the total ultrasonic energy emitted by the piezoelectric elements of the transducer into biological tissue.

<details class="med-details"><summary>

#### Acoustic Energy and Signal-to-Noise Ratio</summary><div class="details-content">

Delivering higher acoustic energy to the myocardium produces stronger backscattered echoes, which directly increases the signal-to-noise ratio (SNR) and enhances 2D image clarity ([Fig. 1.1.2](#fig-01-02)).

Acoustic power is expressed in decibels (dB) relative to the maximum permissible energy output of the machine (100% output corresponds to 0 dB; a 50% power reduction corresponds to −6 dB).

<figure class="med-figure" id="fig-01-02">
  <img src="images/fig-01-02.jpg" alt="Fig. 1.1.2: Acoustic power adjustments. Comparison between low acoustic power (**A**) demonstrating poor signal-to-noise" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.2: Acoustic power adjustments. Comparison between low acoustic power (**A**) demonstrating poor signal-to-noise ratio with drop-out, and high acoustic power (**B**) showing enhanced endocardial definition and crisp tissue borders.</figcaption>
</figure>

</div></details>

<details class="med-details"><summary>

#### Acoustic Bio-Effects: Thermal and Mechanical Indices</summary><div class="details-content">

Excessive acoustic exposure can induce irreversible biological tissue damage through two distinct physical mechanisms:

1. **Thermal Bio-Effects (Heating):** Ultrasound energy absorption by tissue converts acoustic energy into heat. This is continuously monitored via the **Thermal Index (TI)**:
   $$	ext{TI} = rac{W_p}{W_{	ext{deg}}}$$
   Where $W_p$ is acoustic power and $W_{	ext{deg}}$ is the estimated power required to raise tissue temperature by 1°C. For clinical cardiac scanning, **TI must remain strictly below 2.0**.
2. **Mechanical Bio-Effects (Cavitation):** The alternating compression and rarefaction phases of ultrasound waves can cause microbubble formation and violent collapse in fluid media, generating extreme local pressures and shear stress. Cavitation potential is monitored via the **Mechanical Index (MI)**:
   $$	ext{MI} = rac{P_{r,lpha}}{\sqrt{f_c}}$$
   Where $P_{r,lpha}$ is peak rarefactional pressure (derated for tissue attenuation) and $f_c$ is center transmit frequency. For standard clinical imaging, **MI must remain below 1.9** (and lower during contrast echocardiography).

<details class="med-details"><summary>

#### <span id="box-01-01"></span>RECOMMENDATION 1-1: Acoustic Power Management</summary><div class="details-content">

Although higher acoustic power increases SNR, it also increases the likelihood of bio-effects. Clinicians must follow the ALARA principle (As Low As Reasonably Achievable). Only increase transmit power above default factory levels if the acoustic window results in unacceptable SNR despite gain and frequency optimization.

</div></details>

</div></details>

</div></details>

<details class="med-details" open><summary>

## 1.3 Gain and Depth Gain Compensation</summary><div class="details-content">

Amplification controls determine how returning acoustic signals are conditioned and displayed on the diagnostic monitor.

<details class="med-details"><summary>

#### Master 2D Gain</summary><div class="details-content">

Master 2D gain controls the electronic amplification applied uniformly across all returning radiofrequency signals prior to logarithmic conversion and video display.

* Increasing gain amplifies weak returning echoes from endocardial surfaces.
* Crucially, master gain amplifies background electronic noise and acoustic clutter to the exact same degree.
* Consequently, **the signal-to-noise ratio (SNR) remains strictly unchanged** regardless of master gain adjustments ([Fig. 1.1.3](#fig-01-03) and [Fig. 1.1.4](#fig-01-04)).

<figure class="med-figure" id="fig-01-03">
  <img src="images/fig-01-03.jpg" alt="Fig. 1.1.3: Effect of electronic gain on signal-to-noise ratio (SNR). As reflected ultrasound signal and acquisition noi" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.3: Effect of electronic gain on signal-to-noise ratio (SNR). As reflected ultrasound signal and acquisition noise are amplified equally, the underlying SNR remains completely identical.</figcaption>
</figure>

<figure class="med-figure" id="fig-01-04">
  <img src="images/fig-01-04.jpg" alt="Fig. 1.1.4: Effects of increased master gain on 2D echocardiographic image appearance. Excessive gain leads to blooming " class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.4: Effects of increased master gain on 2D echocardiographic image appearance. Excessive gain leads to blooming artifacts and cavity clutter, whereas insufficient gain causes dropped endocardial borders.</figcaption>
</figure>

<details class="med-details"><summary>

#### <span id="box-01-02"></span>RECOMMENDATION 1-2: Master Gain Adjustment</summary><div class="details-content">

Adjust 2D master gain to achieve a balanced, comfortable grayscale appearance where intracardiac blood pools remain anechoic (black) while myocardial parenchyma exhibits subtle, textured speckling.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Depth Gain Compensation (DGC / TGC)</summary><div class="details-content">

Ultrasound beam energy attenuates exponentially as it traverses soft tissue due to scattering and absorption:
$$A(z) = A_0 \cdot e^{-lpha \cdot f \cdot z}$$
Where $lpha$ is tissue attenuation coefficient (~ 0.5–1.0 dB/cm/MHz in myocardium), $f$ is frequency, and $z$ is depth.

To compensate for progressive attenuation at deeper tissue levels, ultrasound platforms utilize **Depth Gain Compensation (DGC)**, also termed **Time Gain Compensation (TGC)**:
* **Automatic Compensation:** Internal algorithms automatically increase amplification for deeper reflectors based on anticipated average attenuation.
* **Manual Sliders:** A vertical bank of sliding potentiometers allows operators to manually fine-tune amplification across segmented depth bands ([Fig. 1.1.5](#fig-01-05)).

<figure class="med-figure" id="fig-01-05">
  <img src="images/fig-01-05.jpg" alt="Fig. 1.1.5: Manual adjustment of Depth Gain Compensation (DGC) sliders. **A:** Slider pushed excessively to the right, c" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.5: Manual adjustment of Depth Gain Compensation (DGC) sliders. **A:** Slider pushed excessively to the right, causing intense near-field saturation. **B:** Neutral central slider alignment providing uniform tissue intensity across all depths. **C:** Slider pulled excessively to the left, resulting in severe far-field acoustic drop-out.</figcaption>
</figure>

<details class="med-details"><summary>

#### <span id="box-01-03"></span>RECOMMENDATION 1-3: DGC Initial Configuration</summary><div class="details-content">

Always begin every new echocardiographic study with all DGC slide controls aligned in their neutral, central vertical position. Adjust individual sliders only when specific near-field clutter or far-field drop-out persists.

</div></details>

</div></details>

</div></details>

<details class="med-details" open><summary>

## 1.4 Transmit Frequency and Harmonic Imaging</summary><div class="details-content">

Operating frequency represents the fundamental acoustic parameter dictating the fundamental compromise between image resolution and penetration depth.

<details class="med-details"><summary>

#### Fundamental Transmit Frequency</summary><div class="details-content">

Modern broadband cardiac transducers can toggle between multiple transmit frequencies:
* **Lower Transmit Frequency (e.g., 2.0 MHz):** Yields longer ultrasonic wavelengths ($\lambda = c / f$), resulting in reduced acoustic attenuation and superior penetration through thick chest walls, but lowers axial and lateral spatial resolution ([Fig. 1.1.6](#fig-01-06)).
* **Higher Transmit Frequency (e.g., 3.5–5.0 MHz):** Yields shorter wavelengths, delivering superior spatial resolution for fine anatomical details (such as leaflet thickness or vegetative lesions), but suffers rapid attenuation and reduced depth penetration.

<figure class="med-figure" id="fig-01-06">
  <img src="images/fig-01-06.jpg" alt="Fig. 1.1.6: Effects of altering transmit frequency. Comparison between 2.0 MHz (providing deep penetration in difficult " class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.6: Effects of altering transmit frequency. Comparison between 2.0 MHz (providing deep penetration in difficult acoustic windows) and 3.5 MHz (yielding sharp spatial resolution for superficial and mid-field structures).</figcaption>
</figure>

</div></details>

<details class="med-details"><summary>

#### Tissue Harmonic Imaging (THI)</summary><div class="details-content">

Tissue Harmonic Imaging exploits non-linear sound propagation through biological tissue. As high-pressure wave peaks travel faster than low-pressure troughs, the sinusoidal waveform distorts into a sawtooth pattern, generating harmonic frequencies ($2f_0, 3f_0, \dots$) primarily in the central, high-intensity core of the beam ([Fig. 1.1.7](#fig-01-07)).

* **Reverberation Suppression:** Because harmonic signals are not generated within low-intensity superficial layers (subcutaneous fat, ribs), near-field reverberation and chest wall clutter are largely eliminated.
* **SNR Enhancement:** Side-lobe artifacts are substantially reduced, markedly improving cavity-to-endocardium contrast.
* **Resolution Considerations:** While THI improves contrast resolution and lateral definition, receiving at harmonic frequencies may slightly lengthen pulse duration, slightly reducing axial resolution compared to pure high-frequency fundamental imaging.

<figure class="med-figure" id="fig-01-07">
  <img src="images/fig-01-07.jpg" alt="Fig. 1.1.7: Effects of fundamental versus harmonic imaging. Comparison between harmonic imaging (1.7/3.4 MHz) and fundam" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.7: Effects of fundamental versus harmonic imaging. Comparison between harmonic imaging (1.7/3.4 MHz) and fundamental imaging (3.5 MHz). Harmonic imaging suppresses clutter and enhances endocardial border definition, whereas fundamental imaging is advantageous for delicate valve edge resolution.</figcaption>
</figure>

<details class="med-details"><summary>

#### <span id="box-01-04"></span>RECOMMENDATION 1-4: Transmit Frequency & Harmonics</summary><div class="details-content">

* Maintain harmonic imaging (THI) as the standard default mode for routine 2D chamber assessment.
* Operate at the transducer's nominal center frequency unless severe penetration limitations require downward frequency adjustment, or delicate microstructural interrogation requires switching to fundamental imaging.

</div></details>

</div></details>

</div></details>

<details class="med-details" open><summary>

## 1.5 Focal Position and Beam Geometry</summary><div class="details-content">

Electronic beam focusing shapes the geometry of the ultrasound pulse, concentrating acoustic energy into a narrow cross-section at a designated depth.

<details class="med-details"><summary>

#### Focal Zone and Lateral Resolution</summary><div class="details-content">

The lateral resolution of an ultrasound system—its capacity to distinguish two adjacent reflectors positioned perpendicular to the beam axis—depends strictly on ultrasound beam width.

* Beam width is narrowest at the **focal point**, where lateral resolution is highest ([Fig. 1.1.8](#fig-01-08)).
* Beyond the focal zone, the beam diverges exponentially, leading to severe lateral smearing and artifactual thickening of cardiac structures ([Fig. 1.1.9](#fig-01-09)).

<figure class="med-figure" id="fig-01-08">
  <img src="images/fig-01-08.jpg" alt="Fig. 1.1.8: Position of the focal point. The focal zone indicator (arrowhead) positioned along the lateral sector scale " class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.8: Position of the focal point. The focal zone indicator (arrowhead) positioned along the lateral sector scale marks the depth of maximum lateral resolution.</figcaption>
</figure>

<figure class="med-figure" id="fig-01-09">
  <img src="images/fig-01-09.jpg" alt="Fig. 1.1.9: Simulated acoustic pressure field of a cardiac transducer across changing focal depths ($F = 50	ext{ mm}$, $" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.9: Simulated acoustic pressure field of a cardiac transducer across changing focal depths ($F = 50	ext{ mm}$, $F = 90	ext{ mm}$, $F = 130	ext{ mm}$). White horizontal bar denotes focal beam width. Note the dramatic divergence and loss of lateral resolution at depths beyond the focal zone.</figcaption>
</figure>

<details class="med-details"><summary>

#### <span id="box-01-05"></span>RECOMMENDATION 1-5: Focal Point Positioning</summary><div class="details-content">

Always place the focal marker at or slightly deeper than the specific cardiac structure of interest (e.g., at the level of the mitral valve tips when evaluating mitral regurgitation, or at the LV apex when evaluating apical thrombus).

</div></details>

</div></details>

</div></details>

<details class="med-details" open><summary>

## 1.6 Temporal Resolution and Frame Rate</summary><div class="details-content">

Temporal resolution defines the system's ability to resolve rapid intracardiac events across time, determined by the frame rate (frames per second, fps).

<details class="med-details"><summary>

#### The Triangle of Acoustic Trade-Offs</summary><div class="details-content">

Because ultrasound propagates through soft tissue at a constant speed ($c pprox 1540	ext{ m/s}$), the time required to interrogate each scan line is fixed:
$$T_{	ext{line}} = rac{2 \cdot 	ext{Depth}}{c}$$
The maximum achievable frame rate is governed by fundamental physics:
$$	ext{Frame Rate} \le rac{c}{2 \cdot 	ext{Depth} \cdot N_{	ext{lines}}}$$
Where $N_{	ext{lines}}$ is the number of acoustic scan lines per frame.

To increase frame rate without reducing depth, the system must reduce the number of scan lines, compromising line density and lateral spatial resolution ([Fig. 1.1.10](#fig-01-10)).

* **Sector Width:** Narrowing the 2D sector angle reduces total line count, immediately multiplying frame rate.
* **Scan Depth:** Decreasing depth reduces round-trip transit time, elevating frame rate.

<figure class="med-figure" id="fig-01-10">
  <img src="images/fig-01-10.jpg" alt="Fig. 1.1.10: Interaction between frame rate and spatial resolution. High scan line density (**A**, 43.3 fps) delivers su" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.10: Interaction between frame rate and spatial resolution. High scan line density (**A**, 43.3 fps) delivers superior lateral resolution; reduced line density (**B**, 79.2 fps) improves temporal capture of fast-moving valves but softens fine anatomical details.</figcaption>
</figure>

<details class="med-details"><summary>

#### <span id="box-01-06"></span>RECOMMENDATION 1-6: Frame Rate Management</summary><div class="details-content">

Maintain frame rates within standard factory parameters (30–60 fps) for standard anatomical surveys. Increase frame rate (by narrowing sector width and depth) when interrogating hyperdynamic valve leaflets, performing stress echocardiography, or acquiring speckle tracking strain.

</div></details>

</div></details>

</div></details>

<details class="med-details" open><summary>

## 1.7 Continuous-Wave and Pulsed-Wave Doppler</summary><div class="details-content">

Spectral Doppler interrogation measures the velocity, direction, and timing of blood flow by detecting frequency shifts in reflected ultrasound waves according to the Doppler equation:
$$\Delta f = rac{2 f_0 \cdot v \cdot \cos 	heta}{c}$$
Where $v$ is blood velocity and $	heta$ is the intercept angle.

<details class="med-details"><summary>

#### Intercept Angle and Beam Alignment</summary><div class="details-content">

Measurement accuracy depends directly on $\cos 	heta$.
* When beam alignment is parallel to flow ($	heta = 0^\circ$), $\cos 	heta = 1.0$, yielding 100% velocity detection.
* An angle of $20^\circ$ produces a minimal ~ 6% underestimation ($\cos 20^\circ = 0.94$).
* Angles $> 20^\circ$ produce substantial, non-linear underestimation of true peak velocities and transvalvular gradients ([Fig. 1.1.11](#fig-01-11)).

<figure class="med-figure" id="fig-01-11">
  <img src="images/fig-01-11.jpg" alt="Fig. 1.1.11: Doppler beam alignment. Comparison of adequate alignment ($	heta" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.11: Doppler beam alignment. Comparison of adequate alignment ($	heta</figcaption>
</figure>< 20^\circ$) yielding peak velocity and crisp envelope definition versus sub-optimal oblique alignment with pronounced velocity underestimation.

<details class="med-details"><summary>

#### <span id="box-01-07"></span>RECOMMENDATION 1-7: Optimizing Doppler Beam Alignment</summary><div class="details-content">

Always utilize colour Doppler mapping as a visual guide prior to placing the spectral Doppler cursor. Manipulate, rotate, and angulate the transducer until the Doppler cursor is aligned coaxially with the high-velocity jet vector.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Velocity Scale, PRF, and Aliasing</summary><div class="details-content">

In Pulsed-Wave (PW) Doppler, pulses are transmitted at the Pulse Repetition Frequency (PRF). The maximum unambiguous Doppler shift that can be resolved without wrap-around distortion is the **Nyquist limit**:
$$v_{	ext{Nyquist}} = rac{c \cdot 	ext{PRF}}{4 f_0 \cdot \cos 	heta}$$
* **Scale Too Low:** Velocities exceeding the Nyquist limit alias, wrapping around the baseline into the opposite spectral display ([Fig. 1.1.12](#fig-01-12)).
* **Scale Too High:** Compresses the spectral envelope into a narrow band, impairing velocity measurement precision.

<figure class="med-figure" id="fig-01-12">
  <img src="images/fig-01-12.jpg" alt="Fig. 1.1.12: Doppler velocity scale adjustments. **A:** Adequate velocity scale allowing accurate envelope tracing and t" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.12: Doppler velocity scale adjustments. **A:** Adequate velocity scale allowing accurate envelope tracing and timing. **B:** Velocity scale set too low, resulting in severe spectral aliasing.</figcaption>
</figure>

</div></details>

<details class="med-details"><summary>

#### Sample Volume Position and Size</summary><div class="details-content">

The pulsed Doppler sample volume (gate) defines the exact spatial coordinate from which frequency shifts are sampled.

* **Sample Position:** For transmitral inflow assessment, the gate must be positioned precisely between the tips of the open mitral leaflets during diastole ([Fig. 1.1.13](#fig-01-13)). Placing the gate too high in the left atrium or too deep in the LV cavity introduces profound velocity distortion.
* **Sample Size:** Controls axial length of the gate ([Fig. 1.1.14](#fig-01-14)):
  * **Small sample volume (1–3 mm):** Provides high spatial resolution, isolating discrete laminar flow velocities with minimal spectral broadening.
  * **Large sample volume (5–10 mm):** Enhances signal sensitivity and velocity resolution at the expense of spatial localization; routinely employed in tissue Doppler imaging.

<figure class="med-figure" id="fig-01-13">
  <img src="images/fig-01-13.jpg" alt="Fig. 1.1.13: Sample volume positioning for mitral inflow. **A:** Gate positioned too high in the atrium. **B:** Appropri" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.13: Sample volume positioning for mitral inflow. **A:** Gate positioned too high in the atrium. **B:** Appropriate gate position at the leaflet tips. **C:** Gate positioned too deep into the LV cavity.</figcaption>
</figure>

<figure class="med-figure" id="fig-01-14">
  <img src="images/fig-01-14.jpg" alt="Fig. 1.1.14: Sample volume axial dimensions. Comparison between large sample volume (**A**, 10.1 mm), standard sample vo" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.14: Sample volume axial dimensions. Comparison between large sample volume (**A**, 10.1 mm), standard sample volume (**B**, 5.1 mm), and small sample volume (**C**, 1.0 mm).</figcaption>
</figure>

<details class="med-details"><summary>

#### <span id="box-01-08"></span>RECOMMENDATION 1-8: Sample Volume Placement</summary><div class="details-content">

For transmitral flow evaluation, position the sample volume precisely at the tips of the mitral valve leaflets in the apical 4-chamber view. For left ventricular outflow tract (LVOT) stroke volume calculation, position the sample volume 3–5 mm apical to the aortic valve annulus.

</div></details>

</div></details>

<details class="med-details"><summary>

#### Wall Filter and Sweep Speed</summary><div class="details-content">

* **Wall Filter (High-Pass Filter):** Rejects high-amplitude, low-velocity signals generated by moving myocardial walls and valve rings ([Fig. 1.1.15](#fig-01-15)):
  * *Filter too low:* High-amplitude wall motion pollutes the baseline, obscuring low-velocity signals.
  * *Filter too high:* Eradicates physiological low-velocity blood signals, such as late diastolic mitral A-waves or pulmonary vein reversals.
* **Sweep Speed:** Controls horizontal time-base scrolling rate ([Fig. 1.1.16](#fig-01-16)):
  * *Standard sweep speed (100 mm/s):* Mandatory for precise measurement of interval durations, acceleration/deceleration times, and velocity-time integrals (VTI).
  * *Reduced sweep speed (25–33 mm/s):* Displays multiple consecutive cardiac cycles across respiratory phases, essential for evaluating respiratory variation in suspected constrictive pericarditis or cardiac tamponade.

<figure class="med-figure" id="fig-01-15">
  <img src="images/fig-01-15.jpg" alt="Fig. 1.1.15: Wall filter settings. **A:** Filter set too low; myocardial motion signals pollute the baseline. **B:** App" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.15: Wall filter settings. **A:** Filter set too low; myocardial motion signals pollute the baseline. **B:** Appropriate filter setting with clear baseline and preserved envelope. **C:** Filter set too high; low-velocity onset and cessation of flow are artifactually clipped.</figcaption>
</figure>

<figure class="med-figure" id="fig-01-16">
  <img src="images/fig-01-16.jpg" alt="Fig. 1.1.16: Spectral Doppler sweep speed. **A:** Standard sweep speed of 100 mm/s for morphological and quantitative an" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.16: Spectral Doppler sweep speed. **A:** Standard sweep speed of 100 mm/s for morphological and quantitative analysis. **B:** Compressed sweep speed of 33 mm/s for assessing respiratory variation across consecutive beats.</figcaption>
</figure>

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

<details class="med-details" open><summary>

## 1.8 Colour-Flow Mapping</summary><div class="details-content">

Colour-Flow Mapping (CFM) overlays multi-gate pulsed Doppler velocity information onto real-time 2D grayscale anatomical images.

<details class="med-details"><summary>

#### Colour Encoding and Velocity Scale</summary><div class="details-content">

Colour encoding follows the standardized BART convention (Blue Away, Red Towards the transducer):
* **Red:** Flow directed towards the probe.
* **Blue:** Flow directed away from the probe.
* **Mosaic / Green Variance:** High-velocity turbulent flow or velocity variance exceeding the Nyquist limit, causing aliasing ([Fig. 1.1.17](#fig-01-17)).
* **Colour Scale:** Set between 50 and 70 cm/s for standard valve regurgitation and stenosis evaluation. Lowering scale below 30 cm/s induces low-velocity aliasing, useful only when mapping pulmonary venous flow or low-flow atrial shunts.

<figure class="med-figure" id="fig-01-17">
  <img src="images/fig-01-17.jpg" alt="Fig. 1.1.17: Colour-flow mapping velocity scale and aliasing. Velocities within the Nyquist limit are encoded as laminar" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.17: Colour-flow mapping velocity scale and aliasing. Velocities within the Nyquist limit are encoded as laminar red or blue; velocities exceeding the threshold exhibit colour aliasing (mosaic/green reversal).</figcaption>
</figure>

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

Colour Doppler relies on multi-pulse ensembles (packet sizes of 8–16 pulses per scan line). Consequently, the colour region of interest (ROI) dramatically depresses system frame rate ([Fig. 1.1.18](#fig-01-18)).

* A large colour box covering the entire ventricle degrades frame rate (often dropping below 15 fps).
* Restricting box width and depth restores high temporal resolution (> 30 fps), preventing missed transient regurgitant jets.

<figure class="med-figure" id="fig-01-18">
  <img src="images/fig-01-18.jpg" alt="Fig. 1.1.18: Impact of colour box size on temporal resolution. **A:** Small, focused colour box maintaining high frame r" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.18: Impact of colour box size on temporal resolution. **A:** Small, focused colour box maintaining high frame rate (31.2 fps). **B:** Excessively large colour box causing severe frame rate degradation (12.9 fps).</figcaption>
</figure>

<details class="med-details"><summary>

#### <span id="box-01-13"></span>RECOMMENDATION 1-13: Minimizing Colour Sector Geometry</summary><div class="details-content">

Keep the colour box as small and narrow as possible, restricted strictly to the valve or pathology under investigation, to preserve optimal spatial and temporal resolution.

</div></details>

</div></details>

</div></details>

<details class="med-details" open><summary>

## 1.9 Advanced Echocardiographic Modalities</summary><div class="details-content">

Advanced echocardiographic modalities provide quantitative assessment of regional myocardial mechanics and volumetric anatomy.

<details class="med-details"><summary>

#### Myocardial Velocity Imaging (Tissue Doppler Imaging - TDI)</summary><div class="details-content">

Tissue Doppler Imaging (TDI) measures high-amplitude, low-velocity acoustic signals reflected from myocardial fibers rather than blood pool erythrocytes ([Fig. 1.1.19](#fig-01-19)).

Essential acquisition steps:
1. **Parallel Alignment:** Align the ultrasound beam strictly parallel to longitudinal myocardial wall motion (< 20° off-axis).
2. **Velocity Scale:** Adjust PRF scale to standard myocardial ranges (typically −20 to +20 cm/s).
3. **Sector Geometry:** Use narrow sector widths to achieve high frame rates (optimal > 115 fps for colour TDI).
4. **Sample Placement:** For mitral annular velocities ($s', e', a'$), place a 5–10 mm sample volume at the septal and lateral mitral annulus, within 1 cm of the insertion site.
5. **ECG Gating:** Ensure high-quality ECG recording for reliable measurement of isovolumic contraction (IVCT) and relaxation (IVRT) intervals.

<figure class="med-figure" id="fig-01-19">
  <img src="images/fig-01-19.jpg" alt="Fig. 1.1.19: Myocardial Velocity Imaging (TDI). Left panel demonstrates Pulsed-Wave TDI displaying systolic ($s$) and d" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.19: Myocardial Velocity Imaging (TDI). Left panel demonstrates Pulsed-Wave TDI displaying systolic ($s'$) and diastolic ($e', a'$) annular velocities; right panel shows real-time colour-coded myocardial velocity mapping.</figcaption>
</figure>

</div></details>

<details class="med-details"><summary>

#### Speckle Tracking Echocardiography (2D Strain Imaging)</summary><div class="details-content">

Two-dimensional speckle tracking echocardiography (STE) tracks acoustic natural acoustic markers (speckles) generated by sub-wavelength tissue scatterers across consecutive cardiac frames ([Fig. 1.1.20](#fig-01-20)).

Key technical requirements for robust strain computation:
1. **Gain and Focus:** Optimize grayscale gain and place the focal zone at mid-cavity depth to maximize speckle clarity.
2. **Region of Interest Centering:** Center the left ventricle in standard apical 4-, 2-, and 3-chamber views without apex foreshortening.
3. **Depth and Size:** Adjust depth so the mitral annulus lies near the base of the sector, maximizing myocardial pixel resolution.
4. **Frame Rate Optimization:** Maintain frame rate strictly between 50 and 90 fps. Frame rates < 40 fps cause tracking loss between frames; frame rates > 100 fps reduce line density and degrade speckle pattern definition.
5. **ECG Signal:** Clean ECG trace is essential to define end-diastolic reference points and aortic valve closure timing.

<figure class="med-figure" id="fig-01-20">
  <img src="images/fig-01-20.jpg" alt="Fig. 1.1.20: Two-dimensional speckle tracking echocardiography (STE). Semiautomated tracking of myocardial acoustic spec" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.20: Two-dimensional speckle tracking echocardiography (STE). Semiautomated tracking of myocardial acoustic speckles across the cardiac cycle, displaying longitudinal strain curves and polar bull's-eye map.</figcaption>
</figure>

</div></details>

<details class="med-details"><summary>

#### Three-Dimensional (3D) Echocardiography</summary><div class="details-content">

Full-matrix array transducers contain thousands of active piezoelectric elements, acquiring pyramidal volumetric data sets without geometric assumptions ([Fig. 1.1.21](#fig-01-21)).

Protocol for successful 3D volumetric acquisition:
1. **Acoustic Window:** Secure an optimal, wide acoustic window because matrix probes have larger physical footprints.
2. **2D Centering:** Use biplane (orthogonal) 2D guidance to verify that the entire ventricular cavity or valve apparatus remains within the pyramidal volume throughout systole and diastole.
3. **Respiratory Gating:** Instruct the patient to perform quiet end-expiratory breath-holding during multi-beat acquisitions to avoid stitch artifacts.
4. **Volume Rate Optimization:** Balance single-beat live 3D imaging (lower volume rate, ~ 20–30 Hz, zero stitch artifacts) against multi-beat stitched acquisition (4–6 beats, higher volume rate, > 50 Hz, susceptible to respiratory movement and arrhythmias).
5. **Gain and Drop-Out:** Carefully adjust 3D gain to avoid pseudo-drop-out of thin membranous structures while preventing artificial tissue bridging.
6. **Volumetric Cropping:** Utilize multi-planar reconstruction (MPR) cropping tools to re-slice and visualize en-face anatomical views of valve orifices and congenital defects.

<figure class="med-figure" id="fig-01-21">
  <img src="images/fig-01-21.jpg" alt="Fig. 1.1.21: Three-dimensional (3D) volumetric echocardiography. Full-volume pyramidal rendering providing comprehensive" class="med-image" loading="lazy" />
  <figcaption class="med-caption">Fig. 1.1.21: Three-dimensional (3D) volumetric echocardiography. Full-volume pyramidal rendering providing comprehensive en-face visualization of intracardiac anatomy and automated left ventricular volumetric reconstruction.</figcaption>
</figure>

</div></details>

</div></details>
