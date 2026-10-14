import fs from 'fs';
import path from 'path';

const baseDir = 'd:/IT sandbox/Starley-CS-Library/data/guidelines/esc-revasc-2018';

// 1. rt11-cardiogenic-shock.json
// Recommendations for the management of patients with cardiogenic shock
const rt11 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt11-cardiogenic-shock",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 11",
  "title": {
    "en": "Recommendations for the management of patients with cardiogenic shock",
    "ru": "Рекомендации по ведению пациентов с кардиогенным шоком"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Management of cardiogenic shock",
        "ru": "Ведение кардиогенного шока"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "Emergency coronary angiography is indicated in patients with acute heart failure or cardiogenic shock complicating ACS.",
            "ru": "Экстренная коронарография показана пациентам с острой сердечной недостаточностью или кардиогенным шоком, осложняющим ОКС."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r02",
          "text": {
            "en": "Emergency PCI of the culprit lesion is indicated for patients with cardiogenic shock due to STEMI or NSTE-ACS, independent of time delay of symptom onset, if coronary anatomy is amenable to PCI.",
            "ru": "Экстренное ЧКВ на инфаркт-связанном поражении показано пациентам с кардиогенным шоком вследствие ИМпST или ОКСбпST независимо от времени от начала симптомов, если коронарная анатомия пригодна для ЧКВ."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r03",
          "text": {
            "en": "Emergency CABG is recommended for patients with cardiogenic shock if the coronary anatomy is not amenable to PCI.",
            "ru": "Экстренное КШ рекомендуется пациентам с кардиогенным шоком, если коронарная анатомия не пригодна для выполнения ЧКВ."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r04",
          "text": {
            "en": "In cases of haemodynamic instability, emergency surgical or catheter-based repair of mechanical complications of ACS is indicated, as decided by the Heart Team.",
            "ru": "При гемодинамической нестабильности показано экстренное хирургическое или транскатетерное устранение механических осложнений ОКС по решению мультидисциплинарной команды Heart Team."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r05",
          "text": {
            "en": "In selected patients with ACS and cardiogenic shock, short-term mechanical circulatory support may be considered, depending on patient age, comorbidities, neurological function, and the prospects for long-term survival and predicted quality of life.",
            "ru": "У отдельных пациентов с ОКС и кардиогенным шоком может быть рассмотрена краткосрочная механическая поддержка кровообращения в зависимости от возраста, коморбидности, неврологического статуса, а также перспектив долгосрочной выживаемости и прогнозируемого качества жизни."
          },
          "class": "IIb",
          "level": "C"
        },
        {
          "id": "r06",
          "text": {
            "en": "Routine use of IABPs in patients with cardiogenic shock due to ACS is not recommended.",
            "ru": "Рутинное применение внутриаортальной баллонной контрпульсации (ВАБК) у пациентов с кардиогенным шоком вследствие ОКС не рекомендуется."
          },
          "class": "III",
          "level": "B"
        }
      ]
    }
  ]
};

// 2. rt12-patients-on-metformin.json
// Recommendation for patients on metformin
const rt12 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt12-patients-on-metformin",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 12",
  "title": {
    "en": "Recommendation for patients on metformin",
    "ru": "Рекомендации для пациентов, принимающих метформин"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Metformin and angiography",
        "ru": "Метформин и ангиография"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "It is recommended to check renal function if patients have taken metformin immediately before angiography and withhold metformin if renal function deteriorates.",
            "ru": "Рекомендуется проверить функцию почек, если пациенты приняли метформин непосредственно перед ангиографией, и отменить метформин в случае ухудшения функции почек."
          },
          "class": "I",
          "level": "C"
        }
      ]
    }
  ]
};

// 3. rt13-prevention-contrast-induced-nephropathy.json
// Recommendations for the prevention of contrast-induced nephropathy
const rt13 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt13-prevention-contrast-induced-nephropathy",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 13",
  "title": {
    "en": "Recommendations for the prevention of contrast-induced nephropathy",
    "ru": "Рекомендации по профилактике контраст-индуцированной нефропатии"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-angio-msct",
      "title": {
        "en": "Patients undergoing coronary angiography or MSCT",
        "ru": "Пациенты, подвергающиеся коронарографии или МСКТ"
      },
      "rows": [
        {
          "id": "r_angio_01",
          "text": {
            "en": "It is recommended that all patients are assessed for the risk of contrast-induced nephropathy.",
            "ru": "Рекомендуется оценивать риск контраст-индуцированной нефропатии у всех пациентов."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_angio_02",
          "text": {
            "en": "Adequate hydration is recommended.",
            "ru": "Рекомендуется адекватная гидратация."
          },
          "class": "I",
          "level": "C"
        }
      ]
    },
    {
      "id": "sec-mod-severe-ckd",
      "title": {
        "en": "Patients with moderate or severe CKD (National Kidney Foundation stages 3b and 4)",
        "ru": "Пациенты с умеренной или тяжелой ХБП (стадии 3b и 4 по классификации NKF)"
      },
      "rows": [
        {
          "id": "r_ckd_01",
          "text": {
            "en": "Use of low-osmolar or iso-osmolar contrast media is recommended.",
            "ru": "Рекомендуется использование низкоосмолярных или изоосмолярных рентгеноконтрастных препаратов."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_ckd_02",
          "text": {
            "en": "It is recommended that the volume of contrast media be minimized (total contrast volume/GFR <3.7; for example, 370 mL of contrast medium in a patient with a GFR of 100 mL/min will yield a ratio of 3.7).",
            "ru": "Рекомендуется минимизировать объем контрастного препарата (отношение суммарного объема контраста к СКФ <3,7; например, 370 мл контраста у пациента с СКФ 100 мл/мин дает отношение 3,7)."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_ckd_03",
          "text": {
            "en": "In statin-naive patients, pre-treatment with high-dose statins should be considered (rosuvastatin 40/20 mg or atorvastatin 80 mg).",
            "ru": "У пациентов, ранее не принимавших статины, следует рассмотреть предварительную терапию высокими дозами статинов (розувастатин 40/20 мг или аторвастатин 80 мг)."
          },
          "class": "IIa",
          "level": "A"
        },
        {
          "id": "r_ckd_04",
          "text": {
            "en": "Pre- and post-hydration with isotonic saline should be considered if the expected contrast volume is >100 mL (1 mL/kg/h 12 h before and continued for 24 h after the procedure; 0.5 mL/kg/h if LVEF ≤35% or NYHA >2).",
            "ru": "Инфузию изотонического раствора хлорида натрия до и после процедуры следует рассмотреть, если ожидаемый объем контраста составляет >100 мл (1 мл/кг/ч за 12 ч до и продолжать в течение 24 ч после процедуры; 0,5 мл/кг/ч при ФВ ЛЖ ≤35% или NYHA >2)."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_ckd_05",
          "text": {
            "en": "As an alternative to the pre- and post-hydration regimen, tailored hydration regimens may be considered (e.g. infusion of normal saline adjusted to central venous pressure or furosemide with matched infusion of normal saline).",
            "ru": "В качестве альтернативы стандартному режиму пре- и постгидратации можно рассмотреть индивидуализированные протоколы гидратации (например, инфузия физиологического раствора под контролем центрального венозного давления или фуросемид с компенсирующей инфузией физиологического раствора)."
          },
          "class": "IIb",
          "level": "B"
        }
      ]
    },
    {
      "id": "sec-severe-ckd-stage4",
      "title": {
        "en": "Patients with severe CKD (National Kidney Foundation stage 4)",
        "ru": "Пациенты с тяжелой ХБП (стадия 4 по классификации NKF)"
      },
      "rows": [
        {
          "id": "r_stage4_01",
          "text": {
            "en": "Prophylactic haemofiltration 6 h before complex PCI may be considered (fluid replacement rate 1000 mL/h without negative loss and saline hydration continued for 24 h after the procedure).",
            "ru": "Профилактическая гемофильтрация за 6 ч до сложного ЧКВ может быть рассмотрена (скорость замещения жидкости 1000 мл/ч без отрицательного баланса с продолжением гидратации физраствором в течение 24 ч после процедуры)."
          },
          "class": "IIb",
          "level": "B"
        },
        {
          "id": "r_stage4_02",
          "text": {
            "en": "Haemodialysis is not recommended as a preventive measure.",
            "ru": "Гемодиализ в качестве профилактической меры не рекомендуется."
          },
          "class": "III",
          "level": "B"
        }
      ]
    }
  ]
};

// 4. rt14-valvular-coronary-interventions.json
// Recommendations for combined valvular and coronary interventions
const rt14 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt14-valvular-coronary-interventions",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 14",
  "title": {
    "en": "Recommendations for combined valvular and coronary interventions",
    "ru": "Рекомендации по сочетанным клапанным и коронарным вмешательствам"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-primary-valve",
      "title": {
        "en": "Primary valve intervention and coronary revascularization",
        "ru": "Первичное вмешательство на клапанах и коронарная реваскуляризация"
      },
      "rows": [
        {
          "id": "r_valv_01",
          "text": {
            "en": "CABG is recommended in patients with a primary indication for aortic/mitral valve surgery and coronary artery diameter stenosis >70%.",
            "ru": "КШ рекомендуется пациентам с первичными показаниями к операции на аортальном/митральном клапане и стенозом коронарной артерии по диаметру >70%."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_valv_02",
          "text": {
            "en": "CABG should be considered in patients with a primary indication for aortic/mitral valve surgery and coronary artery diameter stenosis of 50–70%.",
            "ru": "КШ следует рассмотреть у пациентов с первичными показаниями к операции на аортальном/митральном клапане и стенозом коронарной артерии по диаметру 50–70%."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_valv_03",
          "text": {
            "en": "PCI should be considered in patients with a primary indication to undergo TAVI and coronary artery diameter stenosis >70% in proximal segments.",
            "ru": "ЧКВ следует рассмотреть у пациентов с первичными показаниями к TAVI и стенозом коронарной артерии по диаметру >70% в проксимальных сегментах."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_valv_04",
          "text": {
            "en": "PCI should be considered in patients with a primary indication to undergo transcatheter mitral valve interventions and coronary artery diameter stenosis >70% in proximal segments.",
            "ru": "ЧКВ следует рассмотреть у пациентов с первичными показаниями к транскатетерным вмешательствам на митральном клапане и стенозом коронарной артерии по диаметру >70% в проксимальных сегментах."
          },
          "class": "IIa",
          "level": "C"
        }
      ]
    },
    {
      "id": "sec-primary-revasc",
      "title": {
        "en": "Primary myocardial revascularization and valve intervention",
        "ru": "Первичная реваскуляризация миокарда и вмешательство на клапанах"
      },
      "rows": [
        {
          "id": "r_revasc_01",
          "text": {
            "en": "SAVR is indicated in patients with severe AS undergoing CABG, or surgery of the ascending aorta or another valve.",
            "ru": "Хирургическое протезирование аортального клапана (SAVR) показано пациентам с тяжелым аортальным стенозом, подвергающимся КШ или операции на восходящей аорте либо другом клапане."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_revasc_02",
          "text": {
            "en": "Mitral valve surgery is indicated in patients with severe secondary MR undergoing CABG and LVEF >30%.",
            "ru": "Хирургическое вмешательство на митральном клапане показано пациентам с тяжелой вторичной митральной регургитацией, подвергающимся КШ, при ФВ ЛЖ >30%."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_revasc_03",
          "text": {
            "en": "Mitral valve surgery should be considered in symptomatic patients with severe secondary MR and LVEF <30%, but with evidence of myocardial viability and an option for surgical revascularization.",
            "ru": "Хирургическое вмешательство на митральном клапане следует рассмотреть у симптоматических пациентов с тяжелой вторичной митральной регургитацией и ФВ ЛЖ <30%, но при наличии признаков жизнеспособности миокарда и возможности хирургической реваскуляризации."
          },
          "class": "IIa",
          "level": "C"
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(baseDir, 'rt11-cardiogenic-shock.json'), JSON.stringify(rt11, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt12-patients-on-metformin.json'), JSON.stringify(rt12, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt13-prevention-contrast-induced-nephropathy.json'), JSON.stringify(rt13, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt14-valvular-coronary-interventions.json'), JSON.stringify(rt14, null, 2), 'utf8');

console.log('Successfully generated rt11, rt12, rt13, rt14 for esc-revasc-2018');
