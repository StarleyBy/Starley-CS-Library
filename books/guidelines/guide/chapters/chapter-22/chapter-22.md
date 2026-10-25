# ⚙️ Evaluation of <span class="luminous-purple">Prosthetic Valve Function</span> with Cardiovascular Imaging <span class="luminous-amber">2024</span> (<span class="luminous-cyan">ECHO</span>/<span class="luminous-blue">SCMR</span>/<span class="luminous-blue">SCCT</span>)

<div class="guideline-meta">
  <span class="meta-tag">ASE / SCMR / SCCT Guideline</span>
  <span class="meta-tag">Prosthetic Heart Valves (PHV)</span>
  <span class="meta-tag">Multimodality Imaging (ECHO / CT / CMR)</span>
  <span class="meta-tag">SVD, PPM, PVL, Thrombus, Endocarditis</span>
  <span class="meta-tag">J Am Soc Echocardiogr 2024;37:2–63</span>
</div>

---

<details class="med-details"><summary>

## 1. General Principles, Prosthetic Valve Classification, and Core Hemodynamics</summary><div class="details-content">

### Clinical Scope and Imaging Evolution
Diagnostic evaluation of prosthetic heart valves (PHVs) has evolved substantially over the past decade. Transthoracic echocardiography (TTE) remains the cornerstone first-line modality, complemented by two-dimensional (2D) and three-dimensional (3D) transesophageal echocardiography (TEE) for comprehensive anatomical and functional interrogation.

<details class="med-details"><summary>

#### Table 1: Essential Clinical and Echocardiographic Parameters Required for Complete PHV Evaluation</summary><div class="details-content">

| Assessment Domain | Critical Elements and Specific Clinical Parameters |
| :--- | :--- |
| **Clinical History & Demographics** | Date of implantation; precise operative indication; specific prosthesis brand, model, and manufacturer label size; patient height, weight, body surface area (BSA), and body mass index (BMI); current functional class and symptoms. |
| **Physical Examination & Hemodynamics** | Heart rate and systemic blood pressure at the time of ultrasound examination; auscultatory findings (crispness of mechanical closing/opening clicks, presence/duration of systolic or diastolic murmurs). |
| **Echocardiographic Chamber Assessment** | Left ventricular (LV) internal dimensions, wall thickness, end-diastolic volume, end-systolic volume, and ejection fraction (LVEF); right ventricular (RV) dimensions, systolic function (TAPSE, S' velocity, fractional area change); left atrial and right atrial volumes. |
| **Doppler Hemodynamic Assessment** | Peak prosthetic transvalvular jet velocity ($V_{\text{max}}$); mean transvalvular pressure gradient ($\Delta P_{\text{mean}}$); velocity-time integral (VTI) of the transvalvular jet; Doppler Velocity Index (DVI); Effective Orifice Area (EOA) and indexed EOA (EOAi). |
| **Valve-Specific Hemodynamics** | **Aortic Position**: Acceleration time (AT), ejection time (ET), AT/ET ratio, presence of holodiastolic flow reversal in the descending thoracic or abdominal aorta.<br>**Mitral/Tricuspid Position**: Pressure half-time (PHT), early filling velocity ($E$), peak and mean inflow gradients, ratio of mitral VTI to LVOT VTI. |
| **Prosthetic Valve Morphology** | 2D/3D visualization of leaflet/occluder motion and excursion; sewing ring stability and seating; presence of rocking motion; detection of structural calcification, thickening, pannus, thrombus, or mobile vegetative masses. |
| **Evaluation of Regurgitation** | Strict differentiation between normal physiologic washing jets and pathologic regurgitation; classification into transvalvular (central/intra-stent) versus paravalvular leak (PVL); quantitative assessment of vena contracta, jet width, and regurgitant volume/fraction. |

</div></details>

<details class="med-details"><summary>

### Mechanical and Biological Valve Classifications</summary><div class="details-content">

![Figure 1: Mechanical valves: bileaflet, single-leaflet, and caged-ball valves](images/fig01_mechanical_valves_types.jpg)
*Figure 1: Mechanical prosthetic valves and their echocardiographic features. (A) Bileaflet tilting disk valve (St. Jude Medical, On-X) with central narrow slit and two lateral semicircular orifices. (B) Single tilting disk valve (Medtronic-Hall) with major and minor orifices. (C) Caged-ball valve (Starr-Edwards) demonstrating ball excursion and dense posterior acoustic reverberations.*

![Figure 2: Biological valves: stented, stentless, and percutaneous transcatheter valves](images/fig02_biological_stented_transcatheter_valves.jpg)
*Figure 2: Biological prosthetic valves. Top row: Surgical stented bioprostheses with polymer/metal struts and porcine or pericardial leaflets. Bottom row: Transcatheter aortic and mitral prostheses (balloon-expandable SAPIEN, self-expanding Evolut) displaying stent geometry, 3D en face profiles, and intra-annular seating.*

</div></details>

<details class="med-details"><summary>

### Principles of Transvalvular Doppler and Continuity Derivations</summary><div class="details-content">

Transvalvular pressure gradients are calculated using the simplified Bernoulli equation:
$$\Delta P_{\text{max}} = 4 \times (V_{\text{max}})^2 \quad \text{and} \quad \Delta P_{\text{mean}} = 4 \times \frac{1}{T} \int_0^T v(t)^2 \, dt$$

The **Effective Orifice Area (EOA)** is derived via the continuity of mass principle:
$$\text{Stroke Volume (SV)} = \text{Area}_{\text{LVOT}} \times \text{VTI}_{\text{LVOT}}$$
$$\text{EOA} = \frac{\text{Stroke Volume}}{\text{VTI}_{\text{PrAV}}} = \frac{\text{Area}_{\text{LVOT}} \times \text{VTI}_{\text{LVOT}}}{\text{VTI}_{\text{PrAV}}}$$

```
                               [PRESSURE RECOVERY IN PHVs]
        Vena Contracta                Mid-Ascending Aorta
         (High Velocity)            (Flow Expansion & Deceleration)
       ═════════════════             ══════════════════════════════════
  ───►  Kinetic Energy   ──────────►  Pressure Restored (Recovered)
  ───►   [Low Pressure]  ──────────►  Net Drop = True Catheter Gradient
       ═════════════════             ══════════════════════════════════
           ▲                                       ▲
           │                                       │
     Doppler Measures:                       Cardiac Cath Measures:
    Vena Contracta Velocity               Recovered Downstream Pressure
   (Max Theoretical Gradient)              (Net Clinical Resistance)
```

![Figure 3: Pressure recovery in prosthetic valves](images/fig03_pressure_recovery_schematic.jpg)
*Figure 3: Schematics of pressure recovery in prosthetic valves. Doppler ultrasound measures blood velocity at the vena contracta, reflecting the maximal pressure drop ($\Delta P_{\text{max}}$). Downstream in the ascending aorta, deceleration converts kinetic energy back into static pressure ($P_{\text{net}}$), causing Doppler to overestimate invasive catheter-measured gradients, particularly in small aortic roots (diameter < 3.0 cm).*

![Figure 4: Calculation of flow in the left ventricular outflow tract in transcatheter aortic valves](images/fig04_lvot_stroke_volume_tavr.jpg)
*Figure 4: Calculation of stroke volume in transcatheter aortic valves (TAVR). Measurement of the LVOT diameter at the outer stent margin immediately apical to the stent frame ensures accurate continuity equation stroke volume determination.*

</div></details>

<details class="med-details"><summary>

### Doppler Velocity Index (DVI) and Acoustic Artifacts</summary><div class="details-content">

The Doppler Velocity Index eliminates the need for geometric assumptions regarding LVOT circular cross-sectional area, making it a robust, flow-independent screening parameter:
$$\text{DVI}_{\text{Aortic}} = \frac{\text{VTI}_{\text{LVOT}}}{\text{VTI}_{\text{PrAV}}} = \frac{V_{\text{max, LVOT}}}{V_{\text{max, PrAV}}}$$
$$\text{DVI}_{\text{Mitral}} = \frac{\text{VTI}_{\text{PrMV}}}{\text{VTI}_{\text{LVOT}}}$$

![Figure 5: Doppler Velocity Index (DVI) derivation](images/fig05_doppler_velocity_index_dvi.jpg)
*Figure 5: Doppler Velocity Index (DVI) derivation for prosthetic aortic (PrAV) and mitral (PrMV) valves. A normal aortic DVI is >0.35; values <0.25 strongly indicate prosthetic stenosis or significant obstruction.*

![Figure 6: Effect of mechanical prosthetic valve position on ultrasound attenuation and acoustic shadowing](images/fig06_ultrasound_shadowing_mechanical_valves.jpg)
*Figure 6: Influence of mechanical valve position and acoustic shadowing. Transthoracic apical views obscure the left atrium behind mechanical mitral prostheses due to metallic reverberation, mandating TEE for accurate left atrial and paravalvular regurgitation assessment.*

</div></details>

<details class="med-details"><summary>

#### Table 2: Multimodality Imaging of Prosthetic Valves: Clinical Advantages and Limitations</summary><div class="details-content">

| Imaging Modality | Primary Clinical Strengths & Advantages | Diagnostic Limitations & Vulnerabilities |
| :--- | :--- | :--- |
| **Transthoracic Echocardiography (TTE)** | Readily available at bedside; premier method for continuous-wave Doppler hemodynamics, gradients, and serial chamber remodeling. | Acoustic shadowing obscures posterior structures (left atrium, mitral sewing ring, paravalvular jets); degraded by obesity or chest deformities. |
| **Transesophageal Echocardiography (TEE)** | Superior near-field spatial resolution; unobstructed view of mitral and left atrial anatomy; 3D en face mapping of paravalvular defects. | Invasive; requires sedation; anterior structures (anterior aortic root, RVOT) may be shadowed behind mechanical prostheses. |
| **Cardiac Computed Tomography (MDCT)** | Submillimeter isotropic 3D resolution; precise assessment of leaflet calcification, pannus, HALT, stent deformation, and pseudoaneurysms. | Ionizing radiation; iodinated contrast nephrotoxicity; heart rate-dependent; cannot measure transvalvular blood flow velocities. |
| **Cardiovascular Magnetic Resonance (CMR)** | Gold standard for ventricular volume and mass quantification; accurate phase-contrast regurgitant volume measurement without acoustic shadowing. | Susceptibility artifacts from metallic valve housings; contraindicated in non-MRI-conditional devices; limited availability. |
| **Positron Emission Tomography (18F-FDG PET/CT)** | High sensitivity for active metabolic infection; highly specific for prosthetic valve endocarditis (PVE) and graft infections. | False positives from surgical glue/recent surgery (<3 months); non-specific inflammation; high cost and radiation burden. |

</div></details>

<details class="med-details"><summary>

#### Table 3: Comparative Strength of Imaging Modalities in Assessing Prosthetic Valves</summary><div class="details-content">

| Clinical Feature / Complication | TTE | TEE | MDCT | CMR | PET / CT |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Transvalvular Hemodynamics (Gradients / EOA)** | ++++ | +++ | + | ++ | – |
| **Leaflet / Occluder Motion (Thrombus / HALT)** | ++ | +++ | ++++ | ++ | – |
| **Paravalvular Leak Localization & Sizing** | ++ | ++++ | +++ | +++ | – |
| **Prosthetic Valve Endocarditis (Vegetations)** | ++ | ++++ | ++ | + | ++++ |
| **Periannular Abscess / Pseudoaneurysm / Fistula** | ++ | ++++ | ++++ | +++ | ++++ |
| **Pannus vs Thrombus Differentiation** | + | ++ | ++++ | + | – |
| **Ventricular Volumes and Regurgitant Fraction** | ++ | + | +++ | ++++ | – |

</div></details>

</div></details>

---

<details class="med-details"><summary>

## 2. Mechanisms and Classification of Prosthetic Valve Dysfunction</summary><div class="details-content">

### Structural vs Non-Structural Valve Deterioration
Prosthetic valve failure is categorized into four primary pathological phenotypes:
1. **Structural Valve Deterioration (SVD)**: Intrinsic permanent biological degradation, including leaflet calcification, fibrosis, tear, perforation, or mechanical occluder fracture.
2. **Non-Structural Valve Dysfunction (NSVD)**: Extrinsic mechanical failure unrelated to intrinsic leaflet integrity, including Patient-Prosthesis Mismatch (PPM), paravalvular leak (PVL), suture dehiscence, or clip malposition.
3. **Thrombosis & Leaflet Immobility (HALT/RELM)**: Dynamic thrombotic apposition interfering with leaflet motion, highly responsive to anticoagulation.
4. **Prosthetic Valve Endocarditis (PVE)**: Microbial infection causing vegetations, destructive abscesses, fistulae, and leaflet destruction.

<details class="med-details"><summary>

#### Table 6: Hemodynamic Criteria for Structural Valve Deterioration (SVD)</summary><div class="details-content">

| SVD Severity Stage | Hemodynamic Criteria in Aortic Position | Hemodynamic Criteria in Mitral Position |
| :--- | :--- | :--- |
| **Stage 1: Morphological SVD** | Leaflet thickening, calcification, or mild reduction in mobility without significant hemodynamic alteration | Leaflet thickening or calcification without significant gradient increase |
| **Stage 2: Moderate Hemodynamic SVD** | Mean gradient increase ≥10 mm Hg (resulting in mean gradient 20–39 mm Hg) OR DVI decrease ≥0.1 (or ≥20%) with new moderate prosthetic AR | Mean gradient increase ≥3 mm Hg (resulting in mean gradient 5–9 mm Hg) OR new moderate prosthetic MR |
| **Stage 3: Severe Hemodynamic SVD** | Mean gradient increase ≥20 mm Hg (resulting in mean gradient ≥40 mm Hg) OR DVI decrease ≥0.2 (or ≥40%) OR new severe prosthetic AR | Mean gradient increase ≥5 mm Hg (resulting in mean gradient ≥10 mm Hg) OR new severe prosthetic MR |

</div></details>

<details class="med-details"><summary>

#### Table 7: Doppler Criteria for Aortic and Mitral Prosthesis-Patient Mismatch (PPM)</summary><div class="details-content">

| Valve Position | Severity of PPM | Indexed EOA for BMI < 30 kg/m² | Indexed EOA for BMI ≥ 30 kg/m² (Obese) |
| :--- | :--- | :--- | :--- |
| **Aortic Valve Replacement** | **No PPM** | $>0.85\text{ cm}^2/\text{m}^2$ | $>0.70\text{ cm}^2/\text{m}^2$ |
| | **Moderate PPM** | $0.65 - 0.85\text{ cm}^2/\text{m}^2$ | $0.55 - 0.70\text{ cm}^2/\text{m}^2$ |
| | **Severe PPM** | $<0.65\text{ cm}^2/\text{m}^2$ | $<0.55\text{ cm}^2/\text{m}^2$ |
| **Mitral Valve Replacement** | **No PPM** | $>1.20\text{ cm}^2/\text{m}^2$ | $>1.00\text{ cm}^2/\text{m}^2$ |
| | **Moderate PPM** | $0.90 - 1.20\text{ cm}^2/\text{m}^2$ | $0.75 - 1.00\text{ cm}^2/\text{m}^2$ |
| | **Severe PPM** | $<0.90\text{ cm}^2/\text{m}^2$ | $<0.75\text{ cm}^2/\text{m}^2$ |

</div></details>

<details class="med-details"><summary>

### Thrombus, Pannus, and Endocarditis</summary><div class="details-content">

![Figure 7: Cardiac computed tomography angiography of bileaflet mechanical aortic valves](images/fig07_ct_angiography_mechanical_valves.jpg)
*Figure 7: Multi-detector CT angiography of mechanical bileaflet aortic valves. (Top row) Normal leaflet opening and closing angles. (Bottom row) Obstructive subvalvular pannus ingrowth restricting leaflet excursion with high CT attenuation (>150 HU).*

![Figure 10: Endocarditis affecting a mechanical aortic valve and ascending aortic graft](images/fig10_endocarditis_mechanical_aortic_valve.jpg)
*Figure 10: Mechanical aortic valve endocarditis and ascending aortic graft infection. Left: Cine-fluoroscopy showing valve rocking and perivalvular detachment. Right: 3D TEE revealing large vegetative mobile masses and dehiscence of the sewing ring.*

![Figure 12: Bioprosthetic aortic valve thrombus](images/fig12_bioprosthetic_aortic_valve_thrombus.jpg)
*Figure 12: Bioprosthetic aortic valve thrombosis. (A) Transthoracic short-axis view demonstrating soft, bulky, low-density mass on the aortic side of the cusps. (B) High transvalvular gradient with delayed acceleration time. (C) Complete resolution of thrombus and gradient normalization after 4 weeks of therapeutic anticoagulation.*

![Figure 15: Aortic root pseudoaneurysm complicating bioprosthetic aortic valve endocarditis](images/fig15_aortic_root_pseudoaneurysm_tee_ct.jpg)
*Figure 15: Aortic root pseudoaneurysm. 2D/3D TEE and ECG-gated CT demonstrating a large pulsating perivalvular cavity communicating directly with the LVOT via a narrow neck, with to-and-fro systolic-diastolic flow.*

![Figure 17: Hypoattenuating leaflet thickening (HALT) and reduced leaflet motion (RELM) in transcatheter SAPIEN 3](images/fig17_halt_tavr_sapien3_ct_gradients.jpg)
*Figure 17: Subclinical leaflet thrombosis (HALT) in a 23-mm SAPIEN 3 TAVR prosthesis. (A) Elevated mean transvalvular gradient of 28 mm Hg. (B, C) 4D volume-rendered CT displaying meniscal hypoattenuating leaflet thickening causing restricted leaflet motion. (D) Complete resolution of HALT and gradient reduction after oral anticoagulation.*

</div></details>

</div></details>

---

<details class="med-details"><summary>

## 3. Comprehensive Evaluation of Prosthetic Aortic Valves</summary><div class="details-content">

<details class="med-details"><summary>

#### Table 4: Echocardiographic Protocol for Evaluating Prosthetic Aortic Valves</summary><div class="details-content">

| Acoustic Window | Standard Imaging Planes | Specific Diagnostic Information Obtained |
| :--- | :--- | :--- |
| **Parasternal Acoustic Window** | Parasternal Long-Axis (PLAX) | LVOT diameter at the outer stent margin; seating depth; leaflet thickness and mobility; Color Doppler for paravalvular vs central jets. |
| | Parasternal Short-Axis (PSAX) | Valve circular symmetry; leaflet opening pattern; localization of PVL origin (coronary vs noncoronary sinus distribution). |
| **Apical Acoustic Window** | Apical 5-Chamber & 3-Chamber | Optimal alignment for continuous-wave Doppler transvalvular jet velocity ($V_{\text{max}}$); pulsed-wave Doppler LVOT stroke volume interrogation. |
| **Right Parasternal Window** | Right Parasternal Long-Axis | **Mandatory** non-imaging CW Doppler (Pedoff probe) interrogation; frequently yields the true highest peak velocity in horizontal or folded aortas. |
| **Suprasternal Acoustic Window** | Suprasternal Aortic Arch | CW Doppler confirmation; pulsed-wave Doppler evaluation of holodiastolic flow reversal in the proximal descending thoracic aorta. |
| **Transesophageal Window (TEE)** | ME LAX (120°–140°) & ME AV SAX (30°–60°) | Unobstructed anterior root evaluation; 3D en face planimetry; precise detection of micro-thrombi, vegetations, and subaortic pannus. |

</div></details>

<details class="med-details"><summary>

#### Table 5: Doppler Parameters of Prosthetic Valves in the Aortic Valve Position</summary><div class="details-content">

| Doppler Hemodynamic Parameter | Normal Function | Possible Stenosis | Suggests Significant Stenosis |
| :--- | :---: | :---: | :---: |
| **Jet Velocity Contour** | Triangular, early peaking | Triangular to intermediate | Rounded, symmetrical, late peaking |
| **Acceleration Time (AT)** | $<80\text{ ms}$ | $80 - 100\text{ ms}$ | $>100\text{ ms}$ |
| **AT / LV Ejection Time (AT/ET)** | $<0.32$ | $0.32 - 0.37$ | $>0.37$ |
| **Peak Transvalvular Velocity ($V_{\text{max}}$)** | $<3.0\text{ m/s}$ | $3.0 - 4.0\text{ m/s}$ | $\ge 4.0\text{ m/s}$ |
| **Mean Transvalvular Gradient ($\Delta P_{\text{mean}}$)** | $<20\text{ mm Hg}$ | $20 - 34\text{ mm Hg}$ | $\ge 35\text{ mm Hg}$ |
| **Doppler Velocity Index (DVI)** | $>0.35$ | $0.25 - 0.35$ | $<0.25$ |
| **Effective Orifice Area (EOA)** | Reference $\text{EOA} \pm 1\text{ SD}$ | $1\text{ SD}$ smaller than reference | $\ge 2\text{ SD}$ smaller than reference |
| **TAVR: Change from Post-Deploy Baseline** | | | |
| • Mean Gradient Increase | $<10\text{ mm Hg}$ | Increase $10 - 19\text{ mm Hg}$ | Increase $\ge 20\text{ mm Hg}$ |
| • DVI Decrease | $<0.10$ (or $<20\%$) | Decrease $0.10 - 0.19$ (or $20\%-39\%$) | Decrease $\ge 0.20$ (or $\ge 40\%$) |
| • EOA Decrease | $<0.3\text{ cm}^2$ (or $<25\%$) | Decrease $0.3 - 0.59\text{ cm}^2$ ($25\%-49\%$) | Decrease $\ge 0.60\text{ cm}^2$ (or $\ge 50\%$) |

![Figure 11: Doppler echocardiographic findings in a normal versus stenotic mechanical aortic valve](images/fig11_doppler_normal_vs_stenotic_aortic_valve.jpg)
*Figure 11: Continuous-wave Doppler spectrum across a prosthetic aortic valve. (Left) Normal valve: rapid acceleration, early-peaking triangular contour ($V_{\text{max}} = 2.2\text{ m/s}$, $\text{AT} = 65\text{ ms}$). (Right) Severely stenotic valve: rounded, delayed peak velocity contour ($V_{\text{max}} = 4.4\text{ m/s}$, $\text{AT} = 125\text{ ms}$, $\text{AT/ET} = 0.44$).*

![Figure 13: Algorithm for initial evaluation of elevated peak prosthetic aortic jet velocity](images/fig13_algorithm_elevated_aortic_jet_velocity.jpg)
*Figure 13: Diagnostic algorithm for evaluating elevated prosthetic aortic jet velocity ($V_{\text{max}} \ge 3.0\text{ m/s}$). Stepwise integration of DVI, acceleration time (AT), jet contour, and visual leaflet excursion separates true prosthetic stenosis from high-output states and patient-prosthesis mismatch.*

![Figure 14: Combined aortic regurgitation and stenosis in a tissue prosthetic aortic valve](images/fig14_combined_ar_and_stenosis_tissue_av.jpg)
*Figure 14: Combined prosthetic stenosis and severe regurgitation. High transvalvular gradient driven by hyperdynamic total stroke volume combined with intrinsic structural leaflet calcification and dense holodiastolic flow reversal in the descending thoracic aorta.*

</div></details>

<details class="med-details"><summary>

#### Table 8: Parameters for Evaluation of Prosthetic Aortic Valve Regurgitation Severity</summary><div class="details-content">

| Echocardiographic Parameter | Mild Prosthetic AR | Moderate Prosthetic AR | Severe Prosthetic AR |
| :--- | :---: | :---: | :---: |
| **Jet Width / Stent Annulus Diameter** | $<25\%$ | $25\% - 59\%$ | $\ge 60\%$ |
| **Vena Contracta Width (Central Jets)** | $<0.3\text{ cm}$ | $0.3 - 0.6\text{ cm}$ | $>0.6\text{ cm}$ |
| **Circumferential Extent of PVL (3D En Face)** | $<10\%$ of circumference | $10\% - 29\%$ of circumference | $\ge 30\%$ of circumference |
| **Pressure Half-Time (PHT)** | $>500\text{ ms}$ | $200 - 500\text{ ms}$ | $<200\text{ ms}$ |
| **Holodiastolic Flow Reversal (Descending Aorta)** | Absent or early brief diastolic reversal | Intermediate diastolic flow velocity | Prominent end-diastolic velocity ($>20\text{ cm/s}$ in thoracic; $>12\text{ cm/s}$ in abdominal aorta) |
| **Regurgitant Volume by Continuity** | $<30\text{ mL/beat}$ | $30 - 59\text{ mL/beat}$ | $\ge 60\text{ mL/beat}$ |
| **Regurgitant Fraction (ECHO / CMR)** | $<30\%$ | $30\% - 49\%$ | $\ge 50\%$ |

![Figure 16: Suggested algorithm to guide integration of multiple parameters of AR severity after aortic valve replacement](images/fig16_algorithm_prosthetic_ar_severity.jpg)
*Figure 16: Algorithmic integration for grading prosthetic aortic regurgitation severity after SAVR or TAVR. Conclusive severe criteria include holodiastolic flow reversal in the abdominal aorta, circumferential PVL $\ge 30\%$, and CMR regurgitant fraction $\ge 50\%$.*

</div></details>

<details class="med-details"><summary>

### Multimodal CMR and CT Imaging in Aortic Prostheses</summary><div class="details-content">

![Figure 8: Cardiac magnetic resonance methodology in prosthetic valves, homografts, and conduits](images/fig08_cmr_methodology_prosthetic_valves.jpg)
*Figure 8: CMR pulse sequences for prosthetic valve evaluation. SSFP cine for chamber volumes and valve geometry; 2D/4D phase-contrast flow analysis positioned 0.25–0.44 cm downstream from the stent for absolute regurgitant volume quantification; 3D MRA for aortic root and conduit assessment.*

![Figure 9: Cardiac magnetic resonance imaging of severe bioprosthetic AR](images/fig09_cmr_severe_bioprosthetic_ar.jpg)
*Figure 9: Phase-contrast CMR evaluation of severe bioprosthetic AR. (A) Three-chamber cine showing turbulent diastolic regurgitant flow. (B) Phase-contrast velocity map cross-section. (C) Forward stroke volume = 110 mL, regurgitant volume = 58 mL, regurgitant fraction = 53% (severe AR).*

![Figure 18: Bioprosthetic aortic stenosis evaluated using cardiovascular magnetic resonance](images/fig18_bioprosthetic_aortic_stenosis_cmr.jpg)
*Figure 18: Bioprosthetic aortic valve stenosis on CMR. Steady-state free precession cine direct en face planimetry demonstrating anatomically restricted leaflet opening ($0.7\text{ cm}^2$) and phase-contrast jet velocity exceeding 4.2 m/s.*

<details class="med-details"><summary>

#### Table 9: Potential Role of CT in Complications of Prosthetic Aortic Valves</summary><div class="details-content">

| Prosthetic Complication | Multi-Detector CT Capabilities & Specific Imaging Findings |
| :--- | :--- |
| **Prosthetic Valve Thrombosis** | Low-attenuation mass (<90 HU) adhering to leaflets/struts; restricted leaflet excursion; rapid regression on repeat CT after anticoagulation. |
| **Subvalvular Pannus Formation** | High-attenuation dense mass (>140 HU); circular or semi-circular subvalvular shelf; static regardless of anticoagulation therapy. |
| **Hypoattenuating Leaflet Thickening (HALT)** | Meniscal hypoattenuation on 4D CT originating from the leaflet base and extending to the tip, causing reduced leaflet motion (RELM). |
| **Paravalvular Leak (PVL)** | Direct visualization of contrast-filled gap between sewing ring/transcatheter frame and native calcified annulus; guides transcatheter plug closure. |
| **Infective Endocarditis / Abscess** | Periannular soft-tissue thickening, low-attenuation collections, pseudoaneurysms, and fistulous tracts; superior sensitivity for coronary button dehiscence. |

</div></details>

</div></details>

</div></details>

---

<details class="med-details"><summary>

## 4. Comprehensive Evaluation of Prosthetic Mitral Valves</summary><div class="details-content">

<details class="med-details"><summary>

#### Table 10: Echocardiographic Parameters Required for Evaluating Prosthetic Mitral Valves</summary><div class="details-content">

| Parameter Type | Standard Measured Values and Calculation Methods |
| :--- | :--- |
| **Basic Physiological Context** | Heart rate at acquisition; rhythm (sinus rhythm vs atrial fibrillation); systemic blood pressure. |
| **Peak & Mean Inflow Velocities** | Peak early diastolic transvalvular inflow velocity ($E_{\text{max}}$, m/s); mean transvalvular diastolic pressure gradient ($\Delta P_{\text{mean}}$, mm Hg) derived from continuous-wave Doppler tracing. |
| **Pressure Half-Time (PHT)** | Time required for the peak transmitral pressure gradient to decline by 50% ($T_{1/2}$, ms). |
| **Effective Orifice Area (EOA)** | $\text{EOA} = \frac{\text{Stroke Volume}}{\text{VTI}_{\text{PrMV}}}$, where stroke volume is derived from LVOT pulsed-wave Doppler in the absence of aortic regurgitation. |
| **Doppler Velocity Index (DVI)** | $\text{DVI} = \frac{\text{VTI}_{\text{PrMV}}}{\text{VTI}_{\text{LVOT}}}$. Ratio of transmitral flow to forward LVOT stroke volume. |
| **Left Atrial & Pulmonary Pressures** | Left atrial volume index (LAVI); pulmonary artery systolic pressure (PASP) estimated from tricuspid regurgitation peak velocity. |

</div></details>

<details class="med-details"><summary>

#### Table 11: Doppler Findings Suggestive of Prosthetic Mitral Valve Stenosis</summary><div class="details-content">

| Parameter | Normal Mitral Prosthesis | Possible Mitral Stenosis | Suggests Significant Mitral Stenosis |
| :--- | :---: | :---: | :---: |
| **Peak Inflow Velocity ($E_{\text{max}}$)** | $<1.9\text{ m/s}$ | $1.9 - 2.4\text{ m/s}$ | $\ge 2.5\text{ m/s}$ |
| **Mean Diastolic Gradient ($\Delta P_{\text{mean}}$)** | $<5\text{ mm Hg}$ | $6 - 9\text{ mm Hg}$ | $\ge 10\text{ mm Hg}$ |
| **Doppler Velocity Index ($\text{DVI}_{\text{Mitral}}$)** | $<2.2$ | $2.2 - 2.5$ | $>2.5$ |
| **Effective Orifice Area (EOA)** | Reference $\text{EOA} \pm 1\text{ SD}$ | $1\text{ SD}$ smaller than reference | $<1.0\text{ cm}^2$ (or $\ge 2\text{ SD}$ below reference) |
| **Pressure Half-Time (PHT)** | $<130\text{ ms}$ | $130 - 200\text{ ms}$ | $>200\text{ ms}$ |

*Note: In mechanical valves, isolated PHT calculation of valve area via $220/\text{PHT}$ is inaccurate and should not be used as the sole determinant of EOA.*

<details class="med-details"><summary>

#### Table 12: Findings Suggestive of Significant Prosthetic MR in Mechanical Valves with Normal PHT</summary><div class="details-content">

| Diagnostic Clue | Specific Clinical Mechanism & Presentation |
| :--- | :--- |
| **Elevated Peak Inflow Velocity ($E \ge 2.5\text{ m/s}$)** | High forward transmitral flow during diastole driven by significant regurgitant volume emptying back into the LV. |
| **Elevated Mean Gradient ($\Delta P_{\text{mean}} \ge 6\text{ mm Hg}$)** | Pseudo-stenotic gradient created entirely by massive regurgitant volume returning across the prosthesis. |
| **Normal or Short PHT ($<130\text{ ms}$)** | Rapid equalization of LA and LV diastolic pressures due to high LA filling pressures. |
| **Prominent DVI Elevation ($\text{DVI} > 2.5$)** | Large discrepancy between transmitral VTI and diminished forward LVOT stroke volume. |
| **Pulmonary Venous Flow Reversal** | Blunting or overt systolic flow reversal in one or more pulmonary veins on pulsed-wave Doppler. |

</div></details>

![Figure 19: Mechanical mitral valve stenosis secondary to obstructive thrombus](images/fig19_mechanical_mitral_stenosis_thrombus.jpg)
*Figure 19: Obstructive mechanical mitral valve thrombosis. (A) 2D TEE displaying restricted excursion of the lateral leaflet and immobile medial occluder. (B) Marked acoustic shadowing. (C) Continuous-wave Doppler demonstrating severe transmitral mean gradient of 18 mm Hg at heart rate 72 bpm.*

</div></details>

<details class="med-details"><summary>

### Prosthetic Mitral Regurgitation and Transcatheter Interventions</summary><div class="details-content">

![Figure 20: Paravalvular mitral regurgitation in a mechanical valve evaluated by 3D TEE](images/fig20_paravalvular_mr_mechanical_valve_3d_tee.jpg)
*Figure 20: Severe paravalvular mitral regurgitation. (A) TTE showing dense acoustic shadowing obscuring the LA cavity. (B) 2D TEE demonstrating eccentric regurgitant jet. (C) 3D TEE surgical "en face" view localizing the dehiscence between 7 and 9 o'clock along the posterior sewing ring, enabling successful transcatheter plug occlusion.*

![Figure 21: Suggested algorithm to guide integration of multiple parameters of MR severity after mitral valve replacement](images/fig21_algorithm_prosthetic_mr_severity.jpg)
*Figure 21: Stepwise algorithmic evaluation of prosthetic mitral regurgitation severity. Integrates color Doppler jet dimensions, vena contracta width, pulmonary venous flow patterns, and quantitative regurgitant fraction.*

![Figure 22: Bioprosthetic mitral valve stenosis and successful transcatheter Valve-in-Valve (ViV) implantation](images/fig22_mitral_viv_stenosis_reversal.jpg)
*Figure 22: Degenerated surgical bioprosthetic mitral valve treated with transcatheter Valve-in-Valve (ViV) placement. Baseline severe calcific leaflet stenosis with mean gradient 14 mm Hg, completely resolved to mean gradient 4 mm Hg following SAPIEN 3 deployment within the surgical ring.*

<details class="med-details"><summary>

#### Table 13: Echocardiographic Criteria for Severity of Prosthetic Mitral Valve Regurgitation</summary><div class="details-content">

| Diagnostic Criterion | Mild Prosthetic MR | Moderate Prosthetic MR | Severe Prosthetic MR |
| :--- | :---: | :---: | :---: |
| **Color Flow Jet Area** | Small, central, or localized paravalvular jet ($<4\text{ cm}^2$) | Intermediate jet area ($4 - 8\text{ cm}^2$) | Large central jet ($>8\text{ cm}^2$) OR wall-impinging eccentric jet swirling in LA |
| **Vena Contracta Width** | $<0.3\text{ cm}$ | $0.3 - 0.69\text{ cm}$ | $\ge 0.70\text{ cm}$ |
| **Circumferential Extent of PVL (3D)** | $<10\%$ of sewing ring | $10\% - 29\%$ of sewing ring | $\ge 30\%$ of sewing ring circumference |
| **Pulmonary Venous Flow Pattern** | Systolic dominance ($S > D$) | Systolic blunting ($S < D$) | Overt systolic flow reversal ($S$ wave negative) |
| **Mitral Regurgitant Volume** | $<30\text{ mL/beat}$ | $30 - 59\text{ mL/beat}$ | $\ge 60\text{ mL/beat}$ |
| **Mitral Regurgitant Fraction** | $<30\%$ | $30\% - 49\%$ | $\ge 50\%$ |

</div></details>

</div></details>

</div></details>

---

<details class="med-details"><summary>

## 5. Evaluation of Prosthetic Pulmonary and Tricuspid Valves</summary><div class="details-content">

<details class="med-details"><summary>

### Pulmonary Valve Replacement (PVR) Protocols and Device Types</summary><div class="details-content">

Pulmonary valve replacement is frequently performed in congenital heart disease (e.g., repaired Tetralogy of Fallot, Ross procedure). Modern therapy includes surgical stented/stentless valves, homografts, and transcatheter pulmonary valves (TPVR).

<details class="med-details"><summary>

#### Table 14: Contemporary Types of Pulmonary Valve Replacement (PVR)</summary><div class="details-content">

| Prosthesis Category | Specific Valve Models & Devices | Primary Clinical Application & Size Ranges |
| :--- | :--- | :--- |
| **Transcatheter Balloon-Expandable** | Medtronic Melody (bovine jugular vein, 16–22 mm); Edwards SAPIEN XT / SAPIEN 3 (bovine pericardial, 20–29 mm) | Implantation within dysfunctional surgical conduits, bioprostheses, or prestented RVOT. |
| **Transcatheter Self-Expanding** | Medtronic Harmony (porcine pericardial, 22 & 25 mm); Edwards Alterra Adaptive Prestent; VenusP-Valve | Implantation in large, native or patched non-conduit RVOT anatomy without requiring surgical conduit reconstruction. |
| **Surgical Bioprostheses** | Stented porcine (Mosaic, Epic); stented bovine pericardial (Carpentier-Edwards Magna); pulmonary/aortic homografts | Primary surgical RVOT reconstruction and conduit revisions. |

</div></details>

<details class="med-details"><summary>

#### Table 15: Doppler Criteria for Prosthetic Pulmonary Valve Stenosis</summary><div class="details-content">

| Parameter | Normal Prosthetic PV | Possible PV Stenosis | Suggests Significant PV Stenosis |
| :--- | :---: | :---: | :---: |
| **Peak Inflow Velocity ($V_{\text{max}}$)** | $<2.5\text{ m/s}$ | $2.5 - 3.2\text{ m/s}$ | $>3.2\text{ m/s}$ |
| **Mean Transvalvular Gradient** | $<15\text{ mm Hg}$ | $15 - 24\text{ mm Hg}$ | $\ge 25\text{ mm Hg}$ |
| **Velocity-Time Integral Ratio (DVI)** | $>0.50$ | $0.35 - 0.50$ | $<0.35$ |

</div></details>

<details class="med-details"><summary>

#### Table 16: Criteria for Severity of Prosthetic Pulmonary Regurgitation (PR)</summary><div class="details-content">

| Parameter | Mild PR | Moderate PR | Severe PR |
| :--- | :---: | :---: | :---: |
| **Color Jet Width / Valve Annulus** | Small, narrow origin ($<25\%$) | Intermediate ($25\% - 49\%$) | Wide jet origin ($\ge 50\%$ of RVOT) |
| **CW Doppler Jet Density & Deceleration** | Faint, slow deceleration | Moderate density | Dense, steep deceleration; early diastolic cessation |
| **Branch Pulmonary Artery Diastolic Flow** | Absent | Brief early diastolic reversal | Holodiastolic flow reversal in main and branch PAs |
| **CMR Regurgitant Fraction** | $<20\%$ | $20\% - 39\%$ | $\ge 40\%$ |

</div></details>

![Figure 23: Normally functioning prosthetic pulmonary valve versus significant pulmonary stenosis](images/fig023_prosthetic_pulmonary_valve_normal_vs_stenosis.jpg)
*Figure 23: Echocardiographic evaluation of prosthetic pulmonary valves. (A, B) Normal surgical pulmonary bioprosthesis with thin leaflets and low velocity ($1.6\text{ m/s}$, mean gradient 6 mm Hg). (C, D) Severe structural bioprosthetic stenosis with heavily calcified, immobile leaflets, peak velocity $3.8\text{ m/s}$, and mean gradient 36 mm Hg.*

![Figure 24: Cardiovascular magnetic resonance in a patient with Tetralogy of Fallot and a pulmonary homograft](images/fig24_fallot_pulmonary_homograft_cmr.jpg)
*Figure 24: Phase-contrast CMR in repaired Tetralogy of Fallot with a 20-mm pulmonary homograft. Accurate quantification of RV end-diastolic volume index ($168\text{ mL/m}^2$) and pulmonary regurgitant fraction ($46\%$, severe PR), guiding the decision for percutaneous pulmonary valve re-replacement.*

<details class="med-details"><summary>

#### Table 17: Prosthetic Pulmonary Valve Assessment: Multimodality Advantages and Limitations</summary><div class="details-content">

| Modality | Major Clinical Strengths in PVR | Principal Limitations in PVR |
| :--- | :--- | :--- |
| **TTE** | Noninvasive, bedside monitoring of transvalvular gradient and RV systolic function. | Suboptimal acoustic windows in post-sternotomy adults; retrosternal valve location limits visualization. |
| **TEE** | Deep transgastric views improve alignment with RVOT and pulmonary valve conduits. | Semi-invasive; anterior RVOT structures may lie outside optimal focal zone. |
| **CMR** | **Gold standard** for RV volumes, ejection fraction, conduit geometry, and phase-contrast regurgitant fraction. | Artifacts from metallic stent frames (Melody, SAPIEN); cannot be performed with non-conditional pacemakers/ICDs. |
| **CT** | Unmatched 3D spatial mapping of conduit calcification, stent fracture, and coronary artery compression risk prior to TPVR. | Radiation; lack of phase-contrast velocity or flow quantification. |

</div></details>

</div></details>

<details class="med-details"><summary>

### Prosthetic Tricuspid Valve Evaluation</summary><div class="details-content">

<details class="med-details"><summary>

#### Table 18: Echocardiographic Protocol for Evaluating Prosthetic Tricuspid Valves</summary><div class="details-content">

| Required Parameter | Method of Assessment & Hemodynamic Significance |
| :--- | :--- |
| **Peak & Mean Diastolic Gradients** | Traced from CW Doppler across the prosthetic TV at physiologic heart rates ($<80\text{ bpm}$). |
| **Inflow Velocity-Time Integral ($\text{VTI}_{\text{PrTV}}$)** | Planimetry of the complete CW diastolic spectrum. |
| **Effective Orifice Area (EOA)** | Derived via continuity equation using forward stroke volume from LVOT (in the absence of significant AR or MR). |
| **Right Ventricular & Atrial Dimensions** | Right atrial volume index, RV end-diastolic area, TAPSE, and tissue Doppler S' velocity. |

</div></details>

<details class="med-details"><summary>

#### Table 19: Doppler Criteria Suggestive of Prosthetic Tricuspid Valve Stenosis</summary><div class="details-content">

| Parameter | Normal Tricuspid Prosthesis | Possible TV Stenosis | Suggests Significant TV Stenosis |
| :--- | :---: | :---: | :---: |
| **Peak Inflow Velocity ($E_{\text{max}}$)** | $<1.7\text{ m/s}$ | $1.7 - 2.0\text{ m/s}$ | $>2.0\text{ m/s}$ |
| **Mean Transvalvular Gradient** | $\le 5\text{ mm Hg}$ | $6 - 8\text{ mm Hg}$ | $\ge 9\text{ mm Hg}$ |
| **Pressure Half-Time (PHT)** | $<160\text{ ms}$ | $160 - 229\text{ ms}$ | $\ge 230\text{ ms}$ |
| **Effective Orifice Area (EOA)** | Reference $\text{EOA} \pm 1\text{ SD}$ | $1\text{ SD}$ below reference | $\le 1.0\text{ cm}^2$ |

</div></details>

<details class="med-details"><summary>

#### Table 21: Expanded Grading of Tricuspid Regurgitation After TVR or Repair</summary><div class="details-content">

| Grade | Vena Contracta Width | Hepatic Vein Flow Pattern | Quantitative Regurgitant Volume |
| :--- | :---: | :---: | :---: |
| **Mild** | $<0.3\text{ cm}$ | Systolic dominant | $<30\text{ mL/beat}$ |
| **Moderate** | $0.3 - 0.69\text{ cm}$ | Systolic blunting | $30 - 44\text{ mL/beat}$ |
| **Severe** | $0.70 - 1.39\text{ cm}$ | Systolic flow reversal | $45 - 59\text{ mL/beat}$ |
| **Massive** | $1.40 - 2.09\text{ cm}$ | Prominent systolic flow reversal | $60 - 74\text{ mL/beat}$ |
| **Torrential** | $\ge 2.10\text{ cm}$ | Severe holosystolic reversal; large coaptation defect | $\ge 75\text{ mL/beat}$ |

</div></details>

![Figure 25: Severe bioprosthetic tricuspid valve stenosis on TTE and TEE](images/fig25_bioprosthetic_tv_stenosis_tte_tee.jpg)
*Figure 25: Severe bioprosthetic tricuspid stenosis. (A, B) Transthoracic view showing thickened, calcified leaflets with dense diastolic CW Doppler spectrum (mean gradient 11 mm Hg, $\text{PHT} = 265\text{ ms}$). (C, D) TEE confirming severely restricted leaflet excursion.*

![Figure 26: Bioprosthetic tricuspid valve with severe regurgitation and vegetations](images/fig26_bioprosthetic_tv_severe_tr_vegetations.jpg)
*Figure 26: Infective endocarditis of a bioprosthetic tricuspid valve. TEE displaying massive mobile vegetations adhering to the atrial surface of the leaflets causing severe transvalvular tricuspid regurgitation and leaflet perforation.*

![Figure 27: Deep transgastric TEE window in tricuspid Valve-in-Valve](images/fig27_deep_transgastric_tricuspid_viv.jpg)
*Figure 27: Transesophageal echocardiography from a deep transgastric window (60°) providing direct coaxial alignment with the tricuspid prosthesis for accurate Doppler interrogation during tricuspid Valve-in-Valve (ViV) intervention.*

</div></details>

</div></details>

---

<details class="med-details"><summary>

## 6. Prosthetic Valves in Congenital Heart Disease (CHD) and Reference Hemodynamics</summary><div class="details-content">

### Prosthetic Valves in Adult Congenital Heart Disease
Patients with congenital heart disease frequently require valve replacement at a young age, resulting in multiple reoperations, somatic outgrowth of prostheses, complex geometric distortions, and high lifetime exposure to valve failure.

<details class="med-details"><summary>

#### Table 22: Congenital Heart Anatomies Frequently Requiring Prosthetic Heart Valves</summary><div class="details-content">

| Underlying Congenital Anomaly | Valve Positions Affected | Typical Prosthesis Types Utilized |
| :--- | :--- | :--- |
| **Tetralogy of Fallot (repaired)** | Pulmonary position (RVOT) | Transcatheter pulmonary valves (Melody, Harmony, SAPIEN), homografts, bioprosthetic conduits. |
| **Transposition of Great Arteries (Arterial Switch)** | Neoaortic valve | Surgical mechanical or stented tissue aortic valves. |
| **Congenitally Corrected L-TGA** | Systemic atrioventricular (tricuspid) valve | Mechanical or stented bioprosthetic valve replacement. |
| **Ebstein Anomaly** | Tricuspid position | Large-diameter bioprosthetic valves or mechanical prostheses. |
| **Aortic Valve Disease / Ross Procedure** | Neoaortic and pulmonary positions | Autograft in aortic position, homograft/conduit in pulmonary position. |
| **Truncus Arteriosus** | Truncal valve and RV-to-PA conduit | Mechanical/tissue truncal valve; surgical pulmonary conduits. |

</div></details>

<details class="med-details"><summary>

#### Table 23: Clinical Challenges in Evaluating Prosthetic Valves in Congenital Heart Disease</summary><div class="details-content">

| Challenge Domain | Specific Pathophysiological Mechanism & Clinical Impact |
| :--- | :--- |
| **Complex Spatial Orientation** | Levo-transposition, dextrocardia, and chest deformities make standard acoustic windows non-diagnostic, requiring customized off-axis imaging planes. |
| **Somatic Growth & Outgrowth** | Valves implanted in childhood become severely mismatched as patients reach adult body surface area, mimicking structural stenosis. |
| **Conduit Calcification & Bending** | Long curved conduits develop multifocal stenosis at conduit anastomoses distinct from the prosthetic valve itself. |
| **Multiple Prior Sternotomies** | Severe acoustic shadowing from anterior mediastinal scar tissue and retrosternal structures degrades transthoracic imaging. |

</div></details>

<details class="med-details"><summary>

#### Table 24: Clinical Utility of 3D Echocardiography in CHD Prosthetic Valves</summary><div class="details-content">

- **En face Leaflet Planimetry**: Accurate measurement of true anatomical orifice area without relying on geometric circular assumptions;
- **Spatial Relationship to Conduction System**: Critical for planning transcatheter valve-in-valve and valve-in-ring procedures to prevent complete heart block;
- **Complex Paravalvular Defect Sizing**: Direct assessment of multi-orifice and crescent-shaped paravalvular leaks around non-circular surgical rings.

</div></details>

<details class="med-details"><summary>

### Summary of Appendix Reference Hemodynamics (Tables A1–A9)</summary><div class="details-content">

| Prosthesis Class & Model | Typical Label Sizes | Normal Mean Gradient Range | Normal Effective Orifice Area | Normal DVI Range |
| :--- | :---: | :---: | :---: | :---: |
| **Edwards SAPIEN 3 / Ultra (TAVR)** | 20, 23, 26, 29 mm | $8 - 14\text{ mm Hg}$ | $1.4 - 2.4\text{ cm}^2$ | $0.45 - 0.60$ |
| **Medtronic Evolut PRO / FX (TAVR)** | 23, 26, 29, 34 mm | $5 - 9\text{ mm Hg}$ | $1.7 - 2.8\text{ cm}^2$ | $0.55 - 0.70$ |
| **St. Jude Medical Regent (Mechanical SAVR)** | 19, 21, 23, 25 mm | $7 - 12\text{ mm Hg}$ | $1.5 - 2.6\text{ cm}^2$ | $0.48 - 0.65$ |
| **Carpentier-Edwards Magna Ease (Pericardial SAVR)** | 19, 21, 23, 25 mm | $9 - 15\text{ mm Hg}$ | $1.3 - 2.1\text{ cm}^2$ | $0.40 - 0.52$ |
| **St. Jude Medical Masters (Mechanical MVR)** | 27, 29, 31, 33 mm | $3 - 5\text{ mm Hg}$ | $2.2 - 3.4\text{ cm}^2$ | $1.6 - 2.1$ |
| **Carpentier-Edwards Magna (Tissue MVR)** | 27, 29, 31, 33 mm | $3.5 - 5.5\text{ mm Hg}$ | $1.9 - 2.7\text{ cm}^2$ | $1.7 - 2.2$ |
| **Medtronic Melody (Transcatheter TPVR)** | 18, 20, 22 mm | $8 - 15\text{ mm Hg}$ | $1.6 - 2.3\text{ cm}^2$ | $0.50 - 0.65$ |

</div></details>

</div></details>
