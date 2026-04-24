![](_page_0_Picture_0.jpeg)

# **22 Cardiac Mapping Technologies**

Lars M. Mattison, Megan M. Schmidt, Anthony Scinicariello, Qingguo Zeng, Qing Lou, Timothy G. Laske, and Paul A. Iaizzo

#### **Abstract**

In general, the technologies and methodologies for cardiac electrical mapping entail registration of the electrical activation sequences of the heart, by recording extracellular electrograms. The initial uses of cardiac mapping were primarily to better understand the normal electrical excitations of the heart. However, the focus in such mapping over time has shifted to the study of mechanisms and substrates underlying various arrhythmias; these techniques have been employed to aid in the guidance of curative surgical and/or catheter ablation procedures. More recently, the advent and continued development of highresolution mapping technologies have considerably enhanced our understanding of rapid, complex, and/or transient arrhythmias: i.e., those that typically could not before be suffciently characterized with more conventional methodologies. For example, the ability to visualize endocardial structures during electrophysiology procedures has greatly advanced the understanding of complex cardiac arrhythmias and their complex relationships with their underlying anatomies. In addition, such technologies provide powerful tools in the subsequent treatment of cardiac patients, particularly with the promise of accurately pinpointing the source of arrhythmias and thereby providing possible curative treatments. This

L. M. Mattison (\*) · M. M. Schmidt · A. Scinicariello · Q. Zeng · Q. Lou

Medtronic, Inc., Minneapolis, MN, USA e-mail[: lars.m.mattison@medtronic.com](mailto:lars.m.mattison@medtronic.com)

T. G. Laske

Visible Heart® Laboratories, Institute for Engineering in Medicine, Department of Surgery, University of Minnesota, Minneapolis, MN, USA

Medtronic, Inc., Minneapolis, MN, USA

P. A. Iaizzo

Visible Heart® Laboratories, The Institute for Engineering in Medicine and the Departments of Biomedical Engineering and Surgery, University of Minnesota, Minneapolis, MN, USA

chapter will summarize the most recent developments in catheter navigation and three-dimensional arrhythmia mapping technologies, including both intracardiac and noninvasive approaches.

#### **Keywords**

Activation maps · Body surface potential mapping · Cardiac mapping · Continuous mapping · Electroanatomic mapping · Endocardial mapping · Epicardial mapping · Isopotential maps · Noninvasive mapping · Sequential mapping

# **22.1 Introduction and Background**

The frst recorded electrocardiogram (ECG) detailing the structure of atrioventricular conduction was made by Tawara nearly a hundred years ago [1]. Soon thereafter, Mayer was the frst to observe rhythmical pulsations in ring-like preparations of the muscular tissue of a jellyfsh (Scyphomedusa Cassiopeia) [2, 3]. In similar ring-like preparations of the tortoise heart, Mines was able to initiate circulating excitation by employing electrical stimulation [4]. Shortly thereafter, Lewis and Rothschild described the excitatory process in a canine heart [5], and after a delay due to the events of World War I, Lewis next reported the frst real cardiac *mapping* experiment in 1920 [6]. These groundbreaking studies were the very early attempts to illustrate and document electrical re-entry in an intact heart, and these results have greatly infuenced those who have continued to perform mapping studies. Hence, the feld of *cardiac electrical mapping* was established. Soon afterward, the idea of mapping arrhythmic activations encompassed an ever-larger number of studies, including the early pioneering work of Barker et al., who performed mapping of the frst intact human heart, in 1930 [7]. Many research groups have continued along this line of investigation, leading to several major discoveries in overall cardiac function, as well as in the innovative developments of numerous systems to record such electrical activities in high-resolution three-dimensional detail. One representative approach is the so-called body surface potential mapping [8], in which an array of electrodes is used to record and visualize the electrical potentials over the body surface. Much of the research performed to date, has focused primarily on the mechanisms and substrates underlying various arrhythmias, and cardiac mapping that has been employed to aid in the guidance of curative surgical and catheter ablation procedures [9–14]. More recently, the advent and ongoing developments of high-resolution mapping technologies have considerably enhanced our understanding of rapid, complex, and/or transient arrhythmias: i.e., those that could not have before been suffciently characterized with more conventional methodologies.

# **22.1.1 Basics of Mapping and Navigation**

A cardiac map is defned as a collection of data points, each associated with a given anatomical location. The data underlying a cardiac map are usually voltage-based (e.g., peak amplitude or maximum negative slope) or timing-based (e.g., local activation time within the cardiac cycle). Voltage maps are typically used to assess the substrate of the mapped chamber, as relatively low-voltage regions can indicate scarred areas susceptible to arrhythmogenesis. Timing maps are typically used to study the rhythm in the mapped chamber, as they can reveal underlying patterns of normal or abnormal activations.

In the context of invasive procedures, navigation refers to the tracking of the 3D position and orientation of an object of interest within a defned coordinate system. In the case of cardiac mapping, the objects of interest are typically the catheter electrodes used to measure the electrogram signals, from which voltage and timing data may be collected.

When cardiac mapping is performed with an integrated navigation system, it is possible to create in near real-time, a 3D rendering of the mapped chamber. This is accomplished by manipulating the catheter so that it reaches into all parts of the heart chamber while the navigation system records the catheter location. The resulting volume represents the inner surface of the chamber, commonly referred to as an endocardial anatomical map. Other map data (voltage, timing) can be projected onto the anatomical map using a color scheme. Some examples are shown below, see Fig. 22.1.

### **22.1.2 Cardiac Navigation Theory of Operation**

The two most prevalent modalities for cardiac navigation are electropotential navigation and electromagnetic navigation. The following sections describe their underlying mechanisms of operation, expected performances, and the benefts and drawbacks of each modality.

#### **22.1.2.1 Electropotential Navigation**

With electropotential navigation, body-worn patches deliver low-level alternating current through the patient's torso, establishing an electric feld. The amplitudes and frequencies of the applied currents (amplitude typically less than 100 μA and frequency typically greater than 1 kHz) are selected to be below the thresholds for sensation and stimulation of anatomical structures: i.e., to avoid interferences with other signals of interest such as electrograms. When a catheter is introduced into the body, the electric feld induces a voltage at each catheter electrode. The magnitudes and phases of the voltages measured will change proportionally, relative to the distances between the two patches delivering the current. Because of this mechanism of operation, electropotential navigation is also informally known as impedance navigation.

By using three pairs of orthogonally placed patches (typically anterior/posterior, left/right, and superior/inferior) with a unique AC frequency for each pair and monitoring the induced voltages, an estimate of the location of each catheter electrode can be triangulated within the heart, in real time. Knowledge of the construction of a catheter plus the estimated electrode locations allows the rendering of a catheter in 3D space.

Use of body surface patches to generate an electric feld is the most common approach used for electropotential navigation, but alternative methods are also possible. One such method is employed by the CARTO3 system (Biosense Webster); this reverses the process by emitting alternating current from each connected catheter electrode and measuring the resulting voltage at six surface patches. Another method, employed by the "Array Mode" of the EnSite Velocity system (Abbott): this platform also emits alternating current from each connected catheter electrode, but the resulting voltages are measured by electrodes on the Array catheter which is placed in a fxed location in the chamber of interest. No body surface patches are necessary for electropotential navigation with Array Mode (see Sect. 22.3.3).

#### **22.1.2.2 Electromagnetic Navigation**

With electromagnetic navigation, a bed-mounted transmitter generates a low-intensity, time-varying electromagnetic feld that encompasses the patient's torso. At least one sensor—a small, tightly wrapped coil of wire—must be embedded into any catheter that is to be tracked with electromagnetic navigation. When such a catheter is introduced into the body and within the feld established by the transmitter, the timevarying electromagnetic feld induces currents within the sensor coil. For a specifc transmitter/sensor pair, the relationship between the current induced in the sensor and the 3D positions and orientations of the sensors are character-

![](_page_2_Figure_2.jpeg)

**Fig 22.1** A representative voltage map of the left atrium (top) ([https://www.ahajournals.org/doi/full/10.1161/CIRCEP.120.008718\)](https://www.ahajournals.org/doi/full/10.1161/CIRCEP.120.008718) and representative activation map of the right ventricle [\(https://doi.org/10.1161/CIRCULATIONAHA.119.042423\)](https://doi.org/10.1161/CIRCULATIONAHA.119.042423)

ized ahead of time by the manufacturer, to establish needed transfer functions. Thus, the induced currents are measured, and the 3D positions and orientations of the sensor coil can be calculated in real time.

Knowledge of the construction of a catheter plus the 3D positions and orientations of the embedded sensor coil allows the rendering of a catheter in 3D space; including estimation of catheter electrode locations.

With a single sensor coil, it is possible to calculate its positions and orientations with 5 degrees of freedom (5DOF)—x position, y position, z position, pitch angle, and yaw angle. Determinations of roll angles along the axes of the sensor coil are not possible. However, by combining the 5DOF measurements from at least 2 coils, in different known orientations, it is possible to compute the roll angle along the shared axis, effectively creating a 6DOF sensor.

#### **22.1.3 Navigation Performance**

Both navigation methods described above, provide for estimates of catheter electrode locations. When discussing how well navigation systems perform, it is natural to want to compare the estimated catheter electrodes, to their respective actual locations, leading to characterizations of both accuracy and precision.

The diagram below (Fig. 22.2) represents a standard demonstration of accuracy and precision using a bullseye analogy. The optimal system is represented by the center panel as the bullseye is consistently hit. When each attempt is consistent but off-target, the system is considered precise, but not accurate as shown in the left panel. When the attempts are not consistent but, on average, are on-target, the system is considered accurate but not precise as shown in the right panel.

For cardiac navigation, "accuracy" is understood to refer to the positional accuracy of the system, which in context refects the linearity of the system. Accuracy of mapping system navigation addresses the question: Can the system represent chamber geometries faithfully? For example, a system with high accuracy would be able to create an anatomical map that closely resembles a 3D model generated from segmented CT or MR images. On the other hand, a system with poor accuracy may suffer from stretching or fatness in anatomies in one or more dimensions.

"Precision" is understood to refer to the repeatability of the system, which in this mapping context refects the stability of the system over time. Precision of mapping system navigation addresses the question: can I be confdent that the catheter is in the same position now as it was when I collected a data point from the same reported location earlier? For example, a system with high precision would refect a line of block in a voltage map at the locations where ablation lesions had been tagged earlier in the procedure. On the other hand, a system with poor precision may show a catheter being positioned outside of an anatomical map collected earlier, in the procedure or may show excessive motion artifacts due to respiration.

# **22.1.4 Comparison of Methods**

Each of the navigation methods presented has associated benefts and drawbacks. Perhaps not surprisingly, the benefts of one tend to address the drawbacks of the other.

Electropotential navigation has the advantage of being able to locate any catheter electrode that is connected to the mapping system and therefore can render most catheters without the need for any special equipment or incorporated catheter design elements. In contrast, to take advantage of electromagnetic navigation, requires sensor coils to be embedded in each catheter, which increases both costs and manufacturing complexities.

On the other hand, currently, electromagnetic navigation tends to outperform electropotential navigation; particularly with respect to accuracy, which is typically less than 1 mm on average. Navigation accuracy utilizing electropotential navigation is impacted by nonlinearities in the coordinate axes; due to inhomogeneities of the patient's body or medium (skin, fat, bone, muscle, air, etc.).

Electropotential navigation systems are also susceptible to shift and drift, which erode their precision performances. Shift refers to a sudden movement of all measured catheter electrodes due to an external infuence, such as movement of the body surface patches generating the electric feld used for navigation. Note, movement of patches can include more subtle changes, such as peeling at corners or patient movements combined with loose skin under a patch. Drift refers to gradual movements of catheter electrodes over time, due to an ever-changing study environment; such as electrolyte changes impacting the conductivities of blood and tissues.

Electromagnetic navigation is also susceptible to shifts induced by metal interference. For example, if certain metals are brought close enough to the transmitter to impact the magnetic feld generated by the system, they can cause errors in the reported position and orientation of sensor coils. Typically, the most prevalent source of metal interference experienced during cardiac mapping procedures is the C-Arm used to generate fuoroscopic images.

**Fig. 22.2** Diagram demonstrating precision (left), accuracy (right), and accurate and precise (middle)

![](_page_3_Picture_14.jpeg)

# **22.1.5 Combining Modalities**

Given that the benefts of one modality tend to address the drawbacks of the other, it is not surprising to observe that most commercially available cardiac mapping systems are now going to the combination of electropotential and electromagnetic navigation, to optimize performance. They do this by implementing simultaneous electropotential and electromagnetic navigations and co-registering coordinate systems.

Co-registration is the process of determining a 3D coordinate system transformation from one modality to the other. Each navigation modality outputs continuous sensor location data in three dimensions, referenced to its own Cartesian coordinate system. Then, sensor location data is the electrode locations needed for electropotential navigation and sensor coil locations and orientations for electromagnetic navigation. When a catheter with a sensor coil and electrodes is moved in a volume of interest, paired sensor coil locations and electrode locations can be used to develop the mathematical relationships between the electropotential coordinate system and the electromagnetic coordinate system. Once enough data has been collected, the mapping system can project electrode locations measured by electropotential navigation onto the electromagnetic coordinate system, which is preferred due to the latter's inherent linearity as described above. Currently, these combination mapping systems differ on how they implement the co-registration process, but the underlying mechanisms are the same.

Combining navigation modalities has the advantage of enabling more accurate catheter rendering than utilizing either modality alone. For example, once the co-registration process is completed, catheters that have no sensor coil can also be rendered in the same coordinate space, with the same accuracy performance as catheters with a sensor coil.

Another advantage comes in the design of more complex catheters, such as the Advisor™ HD Grid catheter from Abbott (Fig. 22.3). The paddle portion of the catheter is very fexible. To be able to render the catheter accurately with electromagnetic navigation only would require multiple sensor coils in the paddle portion, making the catheter design extremely complex. By taking advantage of combining navigation modalities, the catheter design can be simpler, including only 1 6DOF sensor (2 5DOF coils) in the distal part of the shaft located in a fxed position relative to two shaft ring electrodes. The EnSite mapping system takes advantage of the shaft topology for co-registration and projects the paddle electrode locations, measured by electropotential navigation, onto the electromagnetic navigation coordinate axes.

![](_page_4_Picture_7.jpeg)

**Fig. 22.3** Shown here is the current version of the Abbott HD Grid Catheter [\(https://cardiacrhythmnews.com/advisor-hd-grid-mapping](https://cardiacrhythmnews.com/advisor-hd-grid-mapping-catheter/)[catheter/\)](https://cardiacrhythmnews.com/advisor-hd-grid-mapping-catheter/)

#### **22.1.6 Industry Overview**

The table below (Table 22.1) provides some of the currently commercially available systems and the navigation modalities used by each. When both modalities are used, the modality listed frst indicates the primary coordinate system.

# **22.2 Clinical Implementation**

Currently, approximately ten million Americans annually are afficted with cardiac arrhythmias (both ventricular and atrial), yet only a small percentage of these patients are expected to have electrophysiological (EP) mapping procedures. This is only expected to continue to grow as the world's population continues to age. It is generally accepted that cardiac electrical mapping is critical in understanding the pathophysiological mechanisms that underlie arrhythmias, as well as the mechanisms that control their initiation and sustenance. Furthermore, cardiac mapping is commonly used for evaluating the effect of pharmacological therapies and directing surgical and/or catheter ablation procedures in the clinical EP laboratory.

Mapping of the depolarization and repolarization electrical processes is considered critical for the selection of optimal therapeutic procedures. In particular, mapping of potential distribution and its evolution in time is required for precisely determining activation patterns, locating specifc arrhythmogenic sites, and identifying anatomical areas of abnormal activity and/or slow conduction.

The purpose of advanced clinical cardiac mapping techniques is to better characterize and localize arrhythmogenic structures, and this can be accomplished by a variety of methods. Thus, *cardiac mapping* is a broad term that encom-

**Table 22.1** Commercially available mapping systems and navigation modalities

| Company                                          | System                | Navigation modality             | Image |
|--------------------------------------------------|-----------------------|---------------------------------|-------|
| Biosense Webster<br>(Johnson & Johnson Med Tech) | CARTO 3               | EM + EP                         |       |
| Abbott                                           | EnSite X              | NavX: EP + EM<br>Voxel: EM + EP |       |
| Boston Scientifc                                 | Rhythmia HDx/Opal HDx | EM + EP                         |       |

(continued)

**Table 22.1** (continued)

| Company   | System | Navigation modality | Image |
|-----------|--------|---------------------|-------|
| Medtronic | Affera | EM                  |       |
| CardioNXT | iMap   | EM + EP             |       |

passes many applications such as body surface potential maps (BSPMs), epicardial mapping, or endocardial mapping, as well as approaches including activation maps and/or isopotential maps. Such applications can be clinically applied via either invasive or noninvasive approaches. Nevertheless, there are many fundamental similarities in all of these techniques.

Currently, the gold standard is the clinical EP study, which is primarily used to: (1) determine the source of cardiac arrhythmias; (2) support the management of treatment through pharmacological means; and/or (3) support nonpharmacologic interventions such as implantable pacemakers, defbrillators, and/or ablation therapies (see also Chap. 28). More specifcally, these methods are also used to assess the timing and propagation of cardiac electrical activities involving the 12-lead ECG and/or recordings of electrical activation sequences termed *extracellular electrograms*. These signals are obtained by using multiple intravascular electrode catheters positioned at various locations within the heart. The technique of catheter-based mapping not only permits a better understanding of the underlying mechanisms of various arrhythmias but also serves as the basis for most of the emerging concepts for treatment, namely ablative techniques. Subsequently, the need for more invasive arrhythmia surgery (e.g., maze procedures) has signifcantly decreased as a result of advances in (and increased use of) catheterbased endocardial mapping and ablation methodologies [15].

Nevertheless, the EP study is not without limitations. The electrophysiologist can only record electrical activity from electrodes located on the surface of the catheter, which must be in contact with the chamber wall. Such electrode areas (mm in diameter) are relatively small in comparison to the heart's total surface area. Thus, to adequately obtain complete global electrical activation patterns, it often dictates the placement of one or more catheters at multiple locations within the chamber of interest. As a consequence, this process requires a considerable amount of time, thus leading to extensive use of fuoroscopy and exposing the medical staff and patients to undesirable levels of ionizing radiation [16].

Secondly, and perhaps more importantly, fuoroscopy does not suffciently provide for the visualization of the complex 3D cardiac anatomy and soft tissue characteristics of a heart's chambers (Fig. 22.4). As a direct result, the expedient and reproducible localization of sites of interest is often poor. More specifcally, this inability to precisely relate EP information to a specifc spatial location in the heart limits conventional techniques for employing ablation catheters for the treatment of complex cardiac arrhythmias. Lastly, such techniques for mapping electrical potential activities from multiple sites do so sequentially over several cardiac cycles, without accounting for likely beat-to-beat variability in activation patterns. Despite these known limitations, electrophysiologists still use these conventional techniques for validation purposes.

# **22.2.1 Types of Maps**

Within the framework of cardiac mapping systems, there are two primary map types utilized in the diagnosis and treatment of cardiac arrhythmias: "Voltage Mapping" and "Activation Mapping."

#### **22.2.1.1 Voltage Mapping**

Voltage Mapping is primarily comprised of visually displaying the intensities (voltage) of local tissue potentials. When a mapping catheter is placed within the heart, electrograms are recorded from the confgured electrodes. These electrograms

![](_page_7_Picture_6.jpeg)

**Fig. 22.4** Image illustrating fuoroscopy's poor soft tissue contrast

may be confgured as unipolar and/or bipolar in nature. Unipolar electrograms are typically created by utilizing Wilson's central terminal as the indifferent electrode [17]. Bipolar electrograms are constructed by the subtraction of two unipolar electrograms. The magnitude of the given voltage is assigned within a color scale and displayed on the anatomical shell representing the surface of the heart (Fig. 22.5). Many factors play roles in the absolute magnitudes of recorded bipolar electrograms, including electrode size and spacings, as well as tissue properties and rhythm at time of mapping, thus exact voltages of interest can be diffcult identify [18, 19].

#### **22.2.1.2 Activation Mapping**

Activation mapping utilizes the timing of the previously described voltage potentials, with respect to a reference. This reference is typically one of the 12 standard surface electrocardiograms (ECG) tracings. In a case where the observed rhythm is a regular tachycardia and the individual is hemodynamically stable, the tachycardia may be mapped. An atrial or ventricular reference would be set, dependent upon the observed rhythm, and the electrical data is then collected by moving the catheter throughout the chamber, as is done in a voltage map. The system typically displays the obtained information related to the timing of activation, with respect to the reference. Such representations allows the users to visualize patterns in the activation cycle and thus identify critical structures to target for arrhythmia termination. In cases where arrhythmias are non-sustained, pacing may be implemented from a focal catheter to attempt to recreate an

![](_page_7_Picture_11.jpeg)

**Fig. 22.5** Shown here are examples of EnSite Precision Voltage Mapping: Voltage maps of left atrium and pulmonary veins. Posterior view, purple, represents viable myocardium, red and grey areas represent scar. In (**a**), is shown a voltage map before irreversible

electroporation (IRE) ablation and in (**b**) is the voltage map after an applied IRE ablation. [\(https://www.ahajournals.org/doi/10.1161/](https://www.ahajournals.org/doi/10.1161/CIRCEP.119.008192) [CIRCEP.119.008192\)](https://www.ahajournals.org/doi/10.1161/CIRCEP.119.008192)

observed arrhythmia morphology, on the ECG tracings as an additional method of identifying critical substrate to target for treatment (see also Chaps. 31 and 32).

Additional methods of providing electrogram information have recently been implemented within mapping systems, as means to provide additional information to the user. This includes further looking at the frequency components of the electrograms and displaying these graphically as well.

### **22.3 Commercially Available Invasive Mapping Systems**

Commercially available invasive mapping systems, have now been implemented in clinical electrophysiology labs around the world. The high-resolution capabilities of modern mapping systems has enabled their rapid adoptions and have become a preference for using them instead of more traditional EP mapping techniques. They are commonly used in most ablation cases in the United States. However, their use is less common in other countries, particularly in Europe. Moreover, it is now possible to integrate these techniques with imaging modalities such as magnetic resonance imaging, computed tomography, and real-time 3D/4D ultrasound. These techniques can broadly be categorized into two primary technologies, each possessing unique advantages and disadvantages: *sequential mapping* and *continuous mapping*.

The EP mapping space has become highly competitive with all major medical device companies within the electrophysiological space (Abbott, Biosense Webster, Boston Scientifc, and Medtronic) offering a *sequential mapping* system; there are also several startups that are also competing in the mapping space. Each of these technologies offers slightly different features, as will be discussed below. In sequential mapping, points are collected over several heart beats and then displayed on a single map. The use of sequential mapping has been much more widely adopted compared to continuous mapping systems.

*Continuous mapping* systems represent technologies that the second major mapping technology category, and typically consist of either basket or noncontact catheter mapping (NCM). Such systems allow for the recording of global data so that the rhythm can be characterized with a minimal number of cardiac beats. In general, basket catheter mapping technologies necessitate electrode contact with the chamber's walls in order to obtain suffciently accurate reconstructed electrograms, whereas NCM simply needs to be placed in the blood pool of the chamber of interest.

Continued advancements have been made in the feld of noninvasive imaging such that cardiac electrical activities are spatially represented over the 3D space of the heart. Decades ago, He and coworkers have pioneered the development of 3D cardiac electrical activity from bioelectric recordings [20–22]. The goal of such cardiac electrical imaging, also known as the *inverse problem* of electrocardiography, is to noninvasively image and visualize the electrical activity of the heart from BSPMs. Due to the high temporal resolution inherent in these bioelectric measurements, the availability of bioelectric source imaging modalities provides much needed high temporal resolution in mapping functional status of the heart and, in turn, aids clinical diagnosis and treatment. In a series of studies, He and colleagues have developed data-driven 3D cardiac electrical imaging techniques that are based upon the fundamental biophysics of cardiac activation, to image activation sequences throughout the heart [23]; they further validated such an imaging approach in animal models using intracardiac mapping [24–27]. These rigorously conducted experiments demonstrate the ability to map transmural cardiac activation throughout the entire heart from noninvasive BSPMs. CardioInsight, Inc. has developed a revolutionary noninvasive electrocardiographic mapping platform (CardioInsight, Medronic, Cleveland, OH, USA) that gathers information about the heart using a proprietary, multi-sensor electrode "vest" placed upon the patient's body. The system combines this electrical information with images from the patient's CT scan, to provide 3D maps of the electrical activity of the heart. Unlike conventional catheter-based mapping methods, the CardioInsight system is noninvasive and provides a view of the entire heart's electrical activity during a single beat.

#### **22.3.1 LocaLisa® Technologies**

While no longer commercially available, the LocaLisa® system was the frst technology developed for real-time 3D localization of intracardiac catheter electrodes within the chambers of the heart. The inclusion of this historic system within this chapter, shows just how much cardiac mapping has progressed since its inception. It worked on the principle that when an electrical current is externally applied through the thorax, a voltage drop occurs across the internal organs, including the heart (electropotential mapping). This particular voltage drop can then be recorded via standard catheter electrodes and subsequently used to determine electrode positions within a given 3D space.

Using similar physical properties, the LocaLisa® system (Fig. 22.6) delivers an external electrical feld that is detected via standard catheter electrodes. This is achieved by sensing impedance changes between the catheter and reference points. Analogous to the Frank lead system, the electric feld is applied in three orthogonal directions (*x*, *y*, and *z*) with different frequencies (~30 kHz) via three applied skin electrode pairs. This system then records the voltage potentials

![](_page_9_Picture_2.jpeg)

**Fig. 22.6** Shown is the previously developed LocaLisa® mapping system (Medtronic, Inc.) that is no longer clinically available. (Image courtesy of Medtronic, Inc.)

detected by the catheter's electrodes within the three electric felds, thus allowing for a defned coordinate system to be created.

These voltage potentials are next translated into a measure of distance relative to a fxed reference catheter, giving the user a 3D representation of the catheter location within the heart's chamber. Important catheter locations are subsequently recorded and represented as color-coded spots on a 3D grid, a process that requires a skilled operator's interpretation (Fig. 22.7). Individual catheter locations can be saved, annotated, and revisited later in the procedure.

Since the system displays real-time electrode movements, catheter movements due to cardiac and respiratory cycles are similar to those observed with fuoroscopy. In initial human validation studies, the LocaLisa® system was described to provide clinically feasible and accurate catheter locations within the heart [28]. Developers of the system reported successful use in over 250 complex ablation procedures for both ventricular and supraventricular tachyarrhythmias. The novel capabilities of this system included: (1) its ability to use any general catheter to collect data; (2) relative improvements in the visualization of catheters in 3D space; and (3) a broad clinical applicability. Finally, this methodology could be applied with complex catheter designs such as multielectrode catheters, irrigated electrode catheters, and/or basket catheters [29–31].

![](_page_9_Picture_7.jpeg)

**Fig. 22.7** Screen shot of the previous LocaLisa®'s mapping software (Medtronic, Inc.). (Image courtesy of Medtronic, Inc.)

# **22.3.2 The Carto Mapping Platform**

The Carto platform (Biosense Webster, Diamond Bar, CA) are mapping systems that have been built off a proprietary electromagnetic sensing platform. The current system is considered a *closed mapping system* that requires use of a catheter that has an EM sensor in it, frst to be able to create an impedance matrix, which can then be used to visualize other non-EM catheters. To visualize placed catheters without an EM sensor, the system sends a high frequency signal to each of the electrodes on the catheter and then uses the 6 patches on the patient to determine the locations of the given catheter within the patient (3 patches on the patient's chest, 3 on the patient's back). It is limited to 2, 20 electrode impedance (only) based catheters that can be tracked at a given time: but can track multiple catheters that are 4-10Fr with 4–20 electrodes with a straight, circular loop, or multiple branch geometry with EM sensors.

Currently, the Carto platform offers two primary HD mapping catheters for the system: these are the Octaray™ and Optrell™ catheters. The Octaray™ has 8 independent splines, each with 6 electrodes per spline. The independent movement of the splines allows for fast coverage of the intracardiac surface. A previous version of the Octaray™ was the Pentaray™ which was a similar style catheter with only 5 splines. The Optrell™ catheter is a grid catheter that has six splines with 8 electrodes per spline. Both catheters utilize TRUERef™ technology, which allows for the ability to limit the effects of farfeld signals within the EGM recordings [32].

![](_page_10_Picture_2.jpeg)

**Fig. 22.8** The current version of the Carto Mapping System (on left), Octaray Catheter (upper right) and Optrel Catheter (lower right)

As is commonplace, ablation catheters have been fully integrated into the mapping system. This includes placing EM sensors within ablation catheters so they can be visualized using the electromagnetic information. The full integration of ablation catheters into a mapping and navigation system allows for the display of ablation information on the mapping system (i.e., power, temperature, duration, contact force) as well as tracking catheter locations during ablation. Combining all this information allows for the displays of the applied ablation locations, on the mapping system itself.

Additionally, Carto offers CartoSound which is an integrated intracardiac echo (ICE) module; that allows for the creation of anatomical maps (geometries) by tracing the outline of the cardiac silhouette from the obtained ICE image on the mapping system. This allows for navigation of other EM based catheters within a cardiac shell on the system (Fig. 22.8).

### **22.3.3 EnSite X**

The EnSite™ X system offers two modes of catheter tracking, termed VoXel mode and NavX mode. VoXel mode functions in a similar manner as Carto (closed system) where catheter locations are mainly based on the magnetic signals generated by an EM sensor and reference electrode. Note, catheters without a sensor, can only be visualized once enough magnetic information has been collected. NavX mode (which was previously offered on EnSite Velocity and Precision) is an open system and allows for the visualization of any standard EP catheter. When using impedance tracking, the EnSite™ system utilizes externally applied high frequency electric felds, generated from cutaneous patches to determine catheter locations; rather than magnetic sensors within the catheter tip. It requires three pairs of skin patches, one for each of *x*, *y*, and *z*-axes, thus creating a 3D coordinate system. Therefore, the NavX™ system can, in theory, be used to perform EP studies and catheter ablation procedures with a very low amount of fuoroscopy, which has been recently demonstrated with the introduction of the MediGuide™ system (Abbott) [33]. The MediGuide system is a visualization and navigation system that can display the relative positions and orientations of MediGuide Enabled™ devices (equipped with a MediGuide sensor) on both live and prerecorded fuoroscopy imaging, in real time. With the NavX™ software system, it is also possible to import a 3D reconstructions of cardiac anatomies taken from a high-resolution computed tomographic scan performed prior to the procedure; this is then synchronized into the images so that 3D views and maps can be manipulated simultaneously [34].

Similar to Carto, EnSite also has integrated ablation technologies within the mapping system. Visualizations of ablation information and lesion tagging, are both available on the system. The more open format (NavX mode) allows for EnSite to be able to be used with more existing catheters without the requirements of using catheters specifc to this system.

The EnSite HD mapping catheter is called the HD Grid which a 4 spline, 16 electrode catheter (Fig. 22.3). The design of this catheter allows for both bipolar (between an electrode pair) and "omnipolar" (between 3 electrodes) technology; which allows for better visualization by adding a second dimension to the electrogram recording. When the two different confgurations used showed a mean points collected using HD wave (omnipolar) were 9522 ± 3542 and mean points user was 1624.8 ± 612. The mean points collected using standard bipolar confguration were 3818 ± 1765 and mean points used were 1167 ± 9518 [35] (Fig. 22.9).

In previous versions of EnSite (Precision, Velocity) a noncontact mapping approach was implemented for the treatment of complex cardiac arrhythmias, as described by Schilling et al. [12, 36, 37]. While it is no longer implemented in the current version, EnSite X, a description of how it was implemented is described here. More specifcally, the EnSite™ Array™ noncontact mapping catheter, used in combination with EnSite™ Velocity system (St. Jude Medical) introduced by Taccardi et al. [38], was comprised of a catheter-mounted, infatable multielectrode array, a reference patch electrode, amplifers, and a workstation.

**Fig. 22.9** Views of the current components of the EnSite X Mapping System ([https://www.cardiovascular.](https://www.cardiovascular.abbott/us/en/hcp/products/electrophysiology/mapping-systems/ensite-x.html) [abbott/us/en/hcp/products/](https://www.cardiovascular.abbott/us/en/hcp/products/electrophysiology/mapping-systems/ensite-x.html) [electrophysiology/mapping](https://www.cardiovascular.abbott/us/en/hcp/products/electrophysiology/mapping-systems/ensite-x.html)[systems/ensite-x.html\)](https://www.cardiovascular.abbott/us/en/hcp/products/electrophysiology/mapping-systems/ensite-x.html)

![](_page_11_Picture_3.jpeg)

![](_page_11_Picture_4.jpeg)

**Fig. 22.10** Shown are the features of the multielectrode array catheter: system prior to deployment (left), catheter array deployed (middle), and the a magnifed view of one of the 64 exposed electrodes (St. Jude Medical, Inc.)

Specifcally, this system's EnGuide® locator technology utilized a single-use 9 Fr, 110 cm transvenous multielectrode array catheter (Fig. 22.10) consisting primarily of: (1) a polyamide insulated wire braid with 64 laser-etched unipolar electrodes; (2) a 7.5 mL infatable polyurethane balloon; and (3) distal and proximal E1 and E2 ring electrodes. Additionally positioned on the proximal end of the catheter utilized a handle and cable connector that allows the physician to deploy a balloon in the chamber of interest, providing the electrical connection from the array to the patient interface unit of the system.

Typically, the multielectrode array is inserted transvenously into the patient's chamber of interest over a standard 0.032‴ guidewire. Once positioned within a given chamber, the multielectrode array wire braid is mechanically expanded and the balloon is infated using a 50/50 contrast-saline solution. Next, a second catheter, termed the *roving* catheter, is introduced into the same chamber of interest. Following connection to the breakout box, the system's EnGuide® technology emits a low 5.68 kHz signal via the tip of the roving catheter that is detected by the E1 and E2 ring electrodes on the multielectrode array catheter. Subsequently, by determi-

![](_page_12_Figure_2.jpeg)

**Fig. 22.11** Shown are obtained maps of the swine left ventricular: (**a**) an isopotential activation map and (**b**) an isochronal activation map

nation of the locator signal angles and strengths, the system is able to compute the 3D relationship of the tip of the roving catheter to that of the multielectrode array catheter ring electrodes. In order to reconstruct the 3D *virtual* endocardium of the chamber, the roving catheter continues to emit the 5.68 kHz signal as it is moved around the chamber by dragging the tip around the endocardial wall's contour.

A convex-hull algorithm is then utilized to omit the previously collected points that are inferior to the facets created during the collection process, so that the system essentially stores only the most distant points visited by the roving catheter (i.e., those from the endocardial surface during diastole). The roving catheter is used to locate the major anatomical locations associated with fuoroscopic imaging, and these anatomical landmarks are subsequently labeled on the reconstructed geometry to provide a frame of reference for the physician.

Once the geometry reconstruction is complete, the multielectrode array is used to detect and record the far-feld intracavitary electrical potentials from the surrounding myocardium by employing an approximation method based on algorithms developed for inverse problems [39]. To further explain, the potentials in this feld are typically lower in amplitude and frequency than the source potentials of the endocardium itself. Therefore, to improve accuracy and stability in reconstruction, a technique is used based on an inverse solution to Laplace's equation by use of a boundary element method so that the resulting signals are used to reconstruct and display >3300 *virtual* electrograms.

After establishment of the chamber's voltage feld, cardiac activation can be displayed as computed *virtual* electrograms or as *isopotential maps*. More specifcally, these resulting isopotential maps are dynamic representations of the propagation of the electrical wavefront. As such, the electrophysiological information is visually represented by color coding that describes voltage, ranging from red (representing regions of depolarized myocardium) to purple (representing regions electrically neutral) (Fig. 22.11a). Additionally, the system allows for the creation of a static representation of the electrical propagations via *isochronal maps* (Fig. 22.11b). Consequently, the color-coded EP information is representative of the time required to activate different regions of the chamber. In cases where ablation is employed, the EnGuide® technology aids in navigating RF catheters to the appropriate site with an accuracy of ±1 mm.

### **22.3.4 The Rhythmia Mapping System**

In the Rhythmia mapping system, an integrated multielectrode catheter is utilized. The multielectrode mapping catheter (IntellaMap Orion™) has an 8 Fr profle and is equipped with a mechanism for bidirectional tip defections. At the tip, there are 64 electrodes distributed on eight splines with an interelectrode spacing of 2.5 mm (Fig. 22.12). Electrodes can be used in either bipolar or unipolar confgurations. The catheter is part of an integrated EAM system, which also includes an electronic patient interface unit and a computer workstation that is used to run the mapping software. Advanced front-end technology flters and collects high quality signals with low noise, and the system's open architecture allows the operator the freedom to utilize and visualize most ablation or diagnostic tools once an initial map has been created with Orion™. Further, the system's dynamic review capabilities allow the user to quickly review and edit data points; it also offers automated annotation to help minimize the time required to manually annotate data collected. The positions of the multielectrode array are tracked utilizing a combination of magnetic and electrical feld information. In early preclini-

![](_page_13_Picture_3.jpeg)

**Fig. 22.12** A map generated by the Rhythmia mapping system's IntellaMap Orion™ high-resolution mapping catheter (Boston Scientifc, Inc.). (Image from [http://www.bostonscientifc.com/en-US/products/](http://www.bostonscientific.com/en-US/products/capital-equipment--mapping-and-navigation/rhythmia-mapping-system/redefined.html) [capital-equipment%2D%2Dmapping-and-navigation/rhythmia](http://www.bostonscientific.com/en-US/products/capital-equipment--mapping-and-navigation/rhythmia-mapping-system/redefined.html)[mapping-system/redefned.html\)](http://www.bostonscientific.com/en-US/products/capital-equipment--mapping-and-navigation/rhythmia-mapping-system/redefined.html)

cal feasibility trials it was reported, that an employed multielectrode catheter was capable of producing high-resolution electroanatomical maps of the right atrium and the left ventricle in animal models [40, 41]. Average map acquisition times for the catheter (with continuous data collection) ranged from 5.2 to 9.5 min and these maps contained an average of 2753–3566 points.

# **22.3.5 The Afera Prism-1 Mapping System**

The Affera Prism-1 mapping system (Medtronic Inc) is a recently regulatory approved mapping system, in use in both the US and EU. It is currently an electromagnetic only system, that works with specifc sensor enabled catheters. One of the current catheters used with the system, has a novel design that the enables both mapping and ablation; i.e., with a single catheter. This Sphere 9 catheter has 9 electrodes positioned around a nitinol sphere (4 in a proximal ring, 4 in a distal ring, and 1 at the tip of the catheter) (Fig. 22.13). It also employs a near feld unipolar electrogram recording, where an electrode located within the center of the formed nitinol cage, is the reference to each of the electrodes on the outer part of the catheter. This method of recoding helps to eliminate far-feld signals from electrogram recordings. The Sphere9 catheter was developed to be capable of delivering both radiofrequency energy and pulsed feld energy: i.e., though the same catheter that is used to collect mapping data points. As a fully integrated system, lesion tags are also automatically generated and positioned on the map. This is done based on catheter location and tissue thermal response to the ablation energy. The electrogram data collected (as with other mapping systems) can be represented as either a voltage and/or activation map. (Fig. 22.13).

![](_page_13_Picture_8.jpeg)

![](_page_13_Picture_9.jpeg)

**Fig. 22.13** Shown are maps generated by employing the Affera mapping system: (left) a representative example of pre and post maps (<https://doi.org/10.1016/j.jacep.2023.04.002>) and (right) the Sphere9

catheter, used exclusively with the Affera system ([https://www.](https://www.medicaldevice-network.com/news/medtronic-sphere-9-ablation-catheter/) medicaldevice- [network.com/news/](https://www.medicaldevice-network.com/news/medtronic-sphere-9-ablation-catheter/) [medtronic-sphere-9-ablation-catheter/](https://www.medicaldevice-network.com/news/medtronic-sphere-9-ablation-catheter/))

# **22.3.6 Additional Technologies**

CardioNXT is an FDA approved mapping technology that is a hybrid (Impedance and Electromagnetic navigation). The system, while not providing any of their own mapping or ablation catheters themselves, has fully integrated several mapping (e.g., HD GRID, Abbott) and ablation (e.g., Farawave, Boston Scientifc) catheters within the system (Fig. 22.14).

Currently, Kardium is another technology with can provide high-resolution electrical mapping with low resolution anatomical information. It utilizes a 30 mm 122 electrode catheter that can both map and deliver Pulsed Field Ablation energy. The large 30 mm balloon is rigid, making large balloon shaped maps with high electrode fdelity. The catheter itself is allows for occlusion assessment with FLOW and CONTACT assessment and can map from the non-ablative electrodes (see Fig. 22.15).

Another developed technology, the Acutus AcQMap system, utilizes a novel approach for noncontact mapping. The mapping system utilized a catheter with 48 electrodes and 48 ultrasound transducers across a six-spline catheter. This enabled the catheter to be placed within the left atrium and generate a complete anatomical and electrical maps, in under 3 min. The incorporated ultrasound transducers are able to measure the distances to the tissue and generate the left atrial geometry. The electrodes collect electrical data and can this can be projected onto the anatomical map that was generated. As an impedance only system (no electromagnetic tracking), it is also able to use and track other catheter's positions and collect anatomical geometries and electrical activities as well. Yet, as of the writing of this chapter, the company has announced that they will no longer continue production of the AcQMap system (see Fig. 22.16).

![](_page_14_Figure_6.jpeg)

![](_page_14_Figure_7.jpeg)

**Fig. 22.14** Examples of maps obtained with the CardioNXT mapping system. On the left is shown representative images of a voltage map made with FaraWave catheter (Boston Scientifc). On the right are

shown a voltage map generated with HD Grid (Abbott) on CardioNXT. (Image from ([https://cardionxt.com/\)](https://cardionxt.com/))

![](_page_14_Picture_10.jpeg)

**Fig. 22.15** Left: Representative voltage map generated on Kardium. Right: Kardium catheter rendering in the left superior pulmonary vein. (Image from (<https://kardium.com/globe-system/>))

**Fig. 22.16** Left: Acutus AcQMap system right: Acutus mapping catheter with electrodes and ultrasound crystals. (Image from ([https://](https://www.acutusmedical.com/int/technology/) [www.acutusmedical.com/int/](https://www.acutusmedical.com/int/technology/) [technology/](https://www.acutusmedical.com/int/technology/)))

![](_page_15_Picture_3.jpeg)

#### **22.4 Continuous Mapping Systems**

#### **Noninvasive Imaging**

Signifcant and innovative advancements have been made in the noninvasive imaging of cardiac electrical activity. Ongoing research in this area is aimed at improving our overall understanding of the mechanisms of cardiac function and dysfunction, in turn, aiding clinical diagnosis and management of cardiac diseases. Employing such an approach allows clinicians the opportunity to precisely localize the arrhythmic substrate and study mechanisms prior to the intervention by solving the so-called *inverse problem*. As a result, one can quickly focus therapy at the primary source of the arrhythmia and subsequently decrease the need for a lengthy EP procedure and, importantly, minimize fuoroscopy exposure to the patient and clinical staff.

The investigation of the epicardial potential inverse solution has garnered interest since the 1970s [42]. Recently the epicardial potential inverse solution has demonstrated the ability to reconstruct epicardial potentials in in vivo humans [43]. In addition, heart surface activation mapping, where activation maps over both the epicardial and endocardial surfaces are estimated from BSPMs, has been investigated [44].

He and coworkers proposed and developed the 3D cardiac electrical imaging (3DCEI) approach for noninvasively imaging 3D cardiac electrical activity employing BSPMs [20–23, 45]. In this 3D approach, cardiac electrical activity is estimated and visualized over the 3D myocardium by solving a linear or nonlinear inverse problem. This 3DCEI approach has been rigorously validated using 3D intracardiac mapping in rabbit [24, 46]*,* swine [47], and canine models [48, 49].

The validation study of the 3DCEI in the swine model [50] is reviewed below, as the swine represents perhaps the most similar model to humans. In brief, a heart-excitation model and heart-torso volume conductor model were constructed based on preoperative MRI scans and prior physiological knowledge of the swine heart. The MR images were segmented to obtain detailed cardiac geometry and the cellular-automaton heart model. The entire heart-excitation process could be simulated and the corresponding BSPMs were calculated by employing a boundary element method. A preliminary classifcation system was also employed to initialize the parameters of the heart-excitation model, and then model parameters were iteratively adjusted in an attempt to minimize any dissimilarity between the measured and heart-model-generated BSPMs until the convergent criteria were satisfed. In this swine validation study, we employed site-specifc pacing and, for each pacing site, both the 3D location of the initiation site for electrical activation and the corresponding activation sequence throughout the ventricles were noninvasively estimated using the above procedure. In total, data from 5 right ventricular and 5 left ventricular pacing sites from control and heart failure animals were collected and, subsequently, sequences of 100 paced beats were analyzed. It was demonstrated that the averaged localized error of the right and left ventricular sites was 7.3 ± 1.8 mm (*n* = 50) and 7.0 ± 2.2 mm (*n* = 50), respectively. The global 3D activation sequences throughout the ventricular myocardium were also derived. The endocardial activation sequences as a subset of the estimated 3D activation sequences were frst compared with those reconstructed from simultaneously obtained data collected using an NCM system in order to validate the procedure. Figure 22.17 shows an example of the 3D activation sequence estimated from acquired BSPMs which were induced by ventricular pacing in a healthy animal. In addition to the heart-excitation-model-based

![](_page_16_Figure_2.jpeg)

**Fig. 22.17** Example of a 3D activation sequence imaged from noninvasive body surface potential maps in a control swine, following left ventricular pacing. (Modifed from [47])

approach [21, 22, 47], He and coworkers also developed a data-driven imaging approach [23] and validated it in a series of animal studies [24–27], including pacing and ventricular tachycardia in healthy animals and animals with heart failure.

The CardioInsight system is another noninvasive electrocardiographic mapping system. The CardioInsight system is built on the foundation of the Electrocardiographic Imaging (ECGI) technology. The ECGI approach was developed by Dr. Yoram Rudy's group to reconstruct potentials of the epicardial cardiac surface to provide proximity to the heart's electrical sources and therefore have much improved resolution than the body surface potentials they are derived from (Fig. 22.18). CardioInsight is considered as the frst commer-

**Fig. 22.18** Block diagram of the ECGI procedure. (**a**) Instrumentation setup, (**b**) Computed tomography slices showing heart contours (*red*) and body surface electrodes (*shiny dots*), (**c**) Meshed heart-torso geometry, (**d**) Sample ECG signals obtained from mapping system, (**e**) Spatial representation of body surface potentials, (**f**) ECGI software package (CADIS), (**g**) Examples of noninvasive ECGI images, including epicardial potentials, electrograms, and isochrones. (Image from [43])

![](_page_16_Figure_7.jpeg)

**Fig. 22.19** CardioInsight system and noninvasive vest

![](_page_17_Picture_3.jpeg)

![](_page_17_Picture_4.jpeg)

cial mapping system to combine electrical data from the body surface with heart-torso anatomy from a CT scan, to then calculate the 3D images of the electrical activity of a patient's heart. Importantly, due to the noninvasive nature of the system, it enables advanced cardiac mapping to be utilized outside the existing confnes of the EP lab.

The physics of ECGI technology is based on a property that the electric felds generated by the beating heart within the passively conducting torso volume can be represented by the relationship: *φ*T = *Aφ*E, where epicardial potentials (*φ*E) could be calculated from body surface potentials (*φ*T) via a matrix (*A*) that approximates the electrical relationship between the surface of the body and the epicardial surface of the heart. A detailed description of these methodologies, as well as validation and practical considerations are included in various sources [50–57].

The CardioInsight system is comprised of a single-use disposable 252 electrode vest, an amplifer system, and a workstation for advanced data analyses and visualizations (Fig. 22.19). The vest was designed to accommodate a variety of torso shapes and sizes [58]. The system received its CE mark in 2011 and FDA approval in 2017 and has been used in clinical cases for mapping various kinds of arrhythmias such as AF, PVC, or VT, as well as for assessing the effcacy for cardiac resynchronization procedures. To date, the system has been used particularly in patients with intermittent, unstable, transient, and polymorphic arrhythmias, and also in cases where the attributes of the system in providing single beat, dual chamber (bi-atrial or biventricular) global mapping information was perceived as a distinct clinical advantage. The aggregate clinical success or performance use of the CardioInsight (compared to an EP study) approach ranged from 85% to 100% for a given chamber or region of interest within the cardiac chamber. Further, it is considered that use of the CardioInsight system has specifc advantages in patients with: (1) complex arrhythmias, including polymorphic arrhythmias; (2) complicated congenital cardiac anatomies; and/or (3) fbrillatory arrhythmias. It has been reported that the noninvasive mapping information provided by the CardioInsight system was especially useful in facilitating EP diagnoses with lower amounts of catheter manipulation; recent literature relating to the use of the system is included in other sources [59, 60].

# **22.5 Summary**

Cardiac mapping technologies continue to be developed and employed and this has in turn revolutionized the clinical EP laboratory. The high geometric and electrophysiological resolutions of these systems have in turn led to numerous novel insights into the mechanisms underlying all types of arrhythmias. Relative to commonly employed multicatheter approaches, such applications have improved resolutions, 3D spatial localizations, and/or rapid acquisition of the detailed characteristics of cardiac activations in both normal and diseased hearts. In general, these technologies employ novel computational approaches to accurately determine high-resolution 3D locations of mapping catheters and anatomic-specifc local electrograms. Acquired data of the relative intracardiac catheter positions and recorded intracardiac electrograms are commonly used by such technologies to reconstruct, in real time, a representation of the 3D geometry of the cardiac chamber of interest.

Today, cardiac mapping systems have been widely adopted for uses across all cardiac ablation platforms. There used have evolved to be at the "centers" of CathLab ecosystems; with several additional technologies being integrated into the mapping system. Further, intracardiac echocardiography (ICE), and CT/MRI data are being incorporated as useful adjuncts for more precise and rapid catheter positioning, perhaps even providing more reproducible catheter positioning toward specifc intracardiac structures that are more diffcult to identify for mapping or ablation. Future integrations of artifcial intelligence and machine learning to mapping systems, will provides lot of future opportunities that will further enhance the integrations of cardiac mapping systems into the CathLab.

# **References**

- 1. Tawara S (1906) Das Reizleitungssystem des Säugetierherzens. Eine anatomisch-histologische studie über das atrioventrikularbündel und die Purkinjeschen fäden
- 2. Mayer AG (1906) Rhythmical pulsation in scyphomedusae. Carnegie Institute of Washington, Washington, DC
- 3. Mayer AG (1908) Rhythmical pulsation in scyphomedusae. In: II. Papers from the marine biological laboratory at Tortugas. Carnegie Institution, Washington DC, pp 115–131
- 4. Mines GR (1916) On dynamic equilibrium in the heart. J Physiol Lond 46:349–382
- 5. Lewis T, Rothschild MA (1915) The excitatory process in the dog's heart, II: the ventricles. Philos Trans R Soc Lond Ser B Biol Sci 206:181–266
- 6. Lewis T, Feil S, Stroud WD (1920) Observations upon futter and fbrillation. II the nature of auricular futter. Heart 7:191–346
- 7. Barker PS, McLeod AG, Alexander J (1930) The excitatory process observed in the exposed human heart. Am Heart J 5:720–742
- 8. Taccardi B (1962) Distribution of heart potentials on dog's thoracic surface. Circ Res 11:862–869
- 9. Jackman WM, Wang XZ, Friday KJ et al (1991) Catheter ablation of accessory atrioventricular pathways (Wolff–Parkinson–White syndrome) by radiofrequency current. N Engl J Med 324:1605–1611
- 10. Gasparini M, Coltorti F, Mantica M, Galimberti P, Ceriotti C, Beatty G (2000) Noncontact system-guided simplifed right atrial linear lesions using radiofrequency transcatheter ablation for treatment of refractory atrial fbrillation. Pacing Clin Electrophysiol 23:1843–1847
- 11. Schmitt H, Weber S, Tillmanns H, Waldecker B (2000) Diagnosis and ablation of atrial futter using a high resolution, noncontact mapping system. Pacing Clin Electrophysiol 23:2057–2064
- 12. Schilling RJ, Davies DW, Peters NS (1998) Characteristics of sinus rhythm electrograms at sites of ablation of ventricular tachycardia relative to all other sites: a noncontact mapping study of the entire left ventricle. J Cardiovasc Electrophysiol 9:921–933
- 13. Sra J, Thomas JM (2001) New techniques for mapping cardiac arrhythmias. Indian Heart J 53:423–444
- 14. Schumacher B, Jung W, Lewalter T, Wolpert C, Luderitz B (1999) Verifcation of linear lesions using a noncontact multielectrode array catheter versus conventional contact mapping techniques. J Cardiovasc Electrophysiol 10:791–798
- 15. Calkins H, Langberg J, Sousa J et al (1992) Radiofrequency catheter ablation of accessory atrioventricular connections in 250 patients.

- Abbreviated therapeutic approach to Wolff–Parkinson–White syndrome. Circulation 85:1337–1346
- 16. Wittkampf FH, Wever EF, Vos K et al (2000) Reduction of radiation exposure in the cardiac electrophysiology laboratory. Pacing Clin Electrophysiol 23:1638–1644
- 17. Reithmann C, Hoffmann E, Dorwarth U et al (2001) Electroanatomical mapping for visualization of atrial activation in patients with incisional atrial tachycardias. Eur Heart J 22:237–246
- 18. Sim I, Bishop M, O'Neill M, Williams S (2019) Left atrial voltage mapping: defning and targeting the atrial fbrillation substrate. J Intervention Cardiac Electrophysiol [Internet] 56(3):213–227. <https://doi.org/10.1007/s10840-019-00537-8>
- 19. Mannion J, Galvin J, Boles U (2020) Left atrial scar identifcation and quantifcation in sinus rhythm and atrial fbrillation. J Arrhythm 36(6):967–973. <https://doi.org/10.1002/joa3.12421>. PMID: 33335611; PMCID: PMC7733578
- 20. He B, Wu D (2001) Imaging and visualization of 3D cardiac electric activity. IEEE Trans Inf Tech Biomed 5:181–186
- 21. Li G, He B (2001) Localization of the site of origin of cardiac activation by means of a heart-model-based electrocardiographic imaging approach. IEEE Trans Biomed Eng 48:660–669
- 22. He B, Li G, Zhang X (2002) Noninvasive three-dimensional activation time imaging of ventricular excitation by means of a heartexcitation model. Phys Med Biol 47:4063–4078
- 23. Liu Z, Liu C, He B (2006) Noninvasive reconstruction of threedimensional ventricular activation sequence from the inverse solution of distributed equivalent current density. IEEE Trans Med Imaging 25:1307–1318
- 24. Han C, Pogwizd S, Killingsworth C, He B (2011) Noninvasive imaging of three-dimensional cardiac activation sequence in hearts with pacing and ventricular tachycardia: a quantitative comparison to intra-cardiac mapping on a rabbit model. Heart Rhythm 8:1266–1272
- 25. Han C, Pogwizd S, Killingsworth C, He B (2012) Noninvasive reconstruction of three-dimensional ventricular activation sequence during pacing and ventricular tachycardia in the canine heart. Am J Physiol Heart Circ Physiol 302:H244–H252
- 26. Han C, Pogwizd S, Killingsworth C, Zhou Z, He B (2013) Noninvasive cardiac activation imaging of ventricular arrhythmias during drug-induced QT prolongation in the rabbit heart. Heart Rhythm 10:1509–1515
- 27. Han C, Pogwizd SM, Yu L, Zhou Z, Killingsworth C, He B (2015) Imaging cardiac activation sequence during ventricular tachycardia in a canine model of nonischemic heart failure. Am J Physiol Heart Circ Physiol 308:H108–H114. [https://doi.org/10.1152/](https://doi.org/10.1152/ajpheart.00196.201) [ajpheart.00196.201](https://doi.org/10.1152/ajpheart.00196.201)
- 28. Wittkampf FH, Wever EF, Derksen R et al (1999) LocaLisa: new technique for real-time 3Dimensional localization of regular intracardiac electrodes. Circulation 99:1312–1317
- 29. Avitall B, Helms RW, Kotov AV, Sieben W, Anderson J (1996) The use of temperature versus local depolarization amplitude to monitor atrial lesion maturation during the creation of linear lesions in both atria. Circulation 94:1–558
- 30. Borggrefe M, Budde T, Podczeck A, Breithardt G (1987) High frequency alternating current ablation of an accessory pathway in humans. J Am Coll Cardiol 10:576–582
- 31. Jenkins KJ, Walsh EP, Colan SD, Bergau DM, Saul JP, Lock JE (1993) Multipolar endocardial mapping of the right atrium during cardiac catheterization: description of a new technique. J Am Coll Cardiol 22:1105–1110
- 32. OCTARAY-FIM Study Clinical Study Report. July 17, 2019. BWI\_2017\_05
- 33. Tuzcu V (2007) A nonfuoroscopic approach for electrophysiology and catheter ablation procedures using a three-dimensional navigation system. Pacing Clin Electrophysiol 30:519–525