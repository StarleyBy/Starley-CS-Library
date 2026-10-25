# -*- coding: utf-8 -*-
import fitz, sys
sys.stdout.reconfigure(encoding='utf-8')

FIGURES = [
    (1,  10, 471, "fig01_central_illustration_hf_management.jpg"),
    (2,  17, 659, "fig02_stages_classifications_hf.jpg"),
    (3,  18, 722, "fig03_nomenclature_hf_therapies.jpg"),
    (4,  23, 669, "fig04_diagnostic_algorithm_chronic_hf.jpg"),
    (5,  26, 606, "fig05_contributing_causes_hfref.jpg"),
    (6,  27, 614, "fig06_risk_factors_hfpef.jpg"),
    (7,  28, 700, "fig07_multiparametric_aetiology_assessment.jpg"),
    (8,  29, 714, "fig08_diagnosis_ischaemic_hf.jpg"),
    (9,  31, 537, "fig09_arrhythmia_associated_hf.jpg"),
    (10, 40, 658, "fig10_indications_crt.jpg"),
    (11, 43, 529, "fig11_diagnosing_decompensated_hf.jpg"),
    (12, 45, 471, "fig12_phases_goals_inhospital_management.jpg"),
    (13, 46, 405, "fig13_initial_management_dhf.jpg"),
    (14, 47, 472, "fig14_tools_assessment_decongestion.jpg"),
    (15, 49, 654, "fig15_management_decongestion.jpg"),
    (16, 53, 337, "fig16_triage_timely_referral_advanced_hf.jpg"),
    (17, 55, 573, "fig17_intermacs_classification.jpg"),
    (18, 56, 498, "fig18_treatment_advanced_hf.jpg"),
    (19, 61, 674, "fig19_management_cad_in_hf.jpg"),
    (20, 63, 416, "fig20_management_secondary_mr.jpg"),
    (21, 70, 721, "fig21_core_members_hf_team.jpg"),
    (22, 73, 422, "fig22_long_term_followup_stable_hf.jpg"),
    (23, 76, 673, "fig23_diagnosis_treatment_cardiac_amyloidosis.jpg"),
]

doc = fitz.open('scratch/next_guideline.pdf')

for fnum, pno, old_y_cutoff, fname in FIGURES:
    page = doc[pno - 1]
    blocks = page.get_text("blocks")
    
    cap_blocks = [b for b in blocks if f"Figure {fnum}" in b[4] or f"Figure  {fnum}" in b[4]]
    
    top_body = []
    for b in blocks:
        if b[1] >= 40:
            if cap_blocks and b in cap_blocks:
                continue
            txt = b[4].strip()
            if len(txt) > 40 and not txt.startswith("Figure "):
                top_body.append(b)
                
    print(f"=== Fig {fnum:02d} (p.{pno:02d}) -> {fname} ===")
    if cap_blocks:
        cb = cap_blocks[0]
        print(f"  Caption: y=({cb[1]:.1f}, {cb[3]:.1f}), text: {cb[4].strip().replace(chr(10), ' ')[:70]}...")
    else:
        print("  Caption: NOT FOUND")
        
    if cap_blocks:
        cb = cap_blocks[0]
        above_cap = [b for b in top_body if b[3] <= cb[1]]
        below_cap = [b for b in top_body if b[1] >= cb[3]]
        
        if above_cap:
            # Check if there is body text above
            text_above = [b for b in above_cap if b[1] < cb[1] - 50]
            if text_above:
                max_top_y = max(b[3] for b in text_above)
                print(f"  *** TEXT ABOVE FIGURE *** count={len(text_above)}, max_y={max_top_y:.1f}")
                for b in text_above:
                    print(f"    y=({b[1]:.1f}, {b[3]:.1f}): {b[4].strip().replace(chr(10), ' ')[:50]}...")
            else:
                print("  No text significantly above figure")
        else:
            print("  No blocks above caption")
            
        if below_cap:
            min_below_y = min(b[1] for b in below_cap)
            print(f"  TEXT BELOW CAPTION: count={len(below_cap)}, min_y={min_below_y:.1f}")
