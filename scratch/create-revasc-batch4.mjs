import fs from 'fs';
import path from 'path';

const baseDir = 'd:/IT sandbox/Starley-CS-Library/data/guidelines/esc-revasc-2018';

// 1. rt07-nste-acs-invasive-evaluation.json
// Recommendations for invasive evaluation and revascularization in non-ST-elevation acute coronary syndrome
const rt07 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt07-nste-acs-invasive-evaluation",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 7",
  "title": {
    "en": "Recommendations for invasive evaluation and revascularization in non-ST-elevation acute coronary syndrome",
    "ru": "Рекомендации по инвазивной оценке и реваскуляризации при остром коронарном синдроме без подъема сегмента ST"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Invasive evaluation and revascularization in NSTE-ACS",
        "ru": "Инвазивная оценка и реваскуляризация при ОКСбпST"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "Urgent coronary angiography (<2 h) is recommended in patients at very high ischaemic risk.",
            "ru": "Экстренная коронарография (<2 ч) рекомендуется пациентам очень высокого ишемического риска."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r02",
          "text": {
            "en": "An early invasive strategy (<24 h) is recommended in patients with at least one high-risk criterion.",
            "ru": "Ранняя инвазивная стратегия (<24 ч) рекомендуется пациентам при наличии хотя бы одного критерия высокого риска."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r03",
          "text": {
            "en": "An invasive strategy (<72 h after first presentation) is indicated in patients with at least one intermediate-risk criterion or recurrent symptoms.",
            "ru": "Инвазивная стратегия (<72 ч от первого обращения) показана пациентам при наличии хотя бы одного критерия промежуточного риска или рецидивирующих симптомах."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r04",
          "text": {
            "en": "It is recommended to base the revascularization strategy (ad hoc culprit lesion PCI/multivessel PCI/CABG) on the clinical status and comorbidities, as well as the disease severity [i.e. the distribution and angiographic lesion characteristics (e.g. SYNTAX score)], according to the principles for SCAD (may apply to stabilized NSTE-ACS patients).",
            "ru": "Рекомендуется основывать стратегию реваскуляризации (одномоментное ad hoc ЧКВ на инфаркт-связанной артерии, многососудистое ЧКВ или КШ) на клиническом состоянии и коморбидности, а также на тяжести поражения [т.е. локализации и ангиографических характеристиках поражений (например, по шкале SYNTAX)] в соответствии с принципами для стабильной ИБС (применимо к стабилизированным пациентам с ОКСбпST)."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r05",
          "text": {
            "en": "In cardiogenic shock, routine revascularization of non-IRA lesions is not recommended during primary PCI.",
            "ru": "При кардиогенном шоке рутинная реваскуляризация не связанных с инфарктом поражений (non-IRA) во время первичного ЧКВ не рекомендуется."
          },
          "class": "III",
          "level": "B"
        }
      ]
    }
  ]
};

// 2. t08-nste-acs-risk-stratification.json
// Figure 4 Selection of non-ST-elevation acute coronary syndrome treatment strategy and timing according to initial risk stratification
const t08 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.t08-nste-acs-risk-stratification",
  "guidelineId": "esc-revasc-2018",
  "number": "Figure 4",
  "title": {
    "en": "Selection of non-ST-elevation acute coronary syndrome treatment strategy and timing according to initial risk stratification",
    "ru": "Выбор стратегии лечения и сроков вмешательства при остром коронарном синдроме без подъема сегмента ST в зависимости от исходной стратификации риска"
  },
  "type": "grid",
  "columns": [
    { "id": "risk_category", "title": { "en": "Risk category", "ru": "Категория риска" } },
    { "id": "criteria", "title": { "en": "Clinical criteria", "ru": "Клинические критерии" } },
    { "id": "strategy", "title": { "en": "Strategy and timing", "ru": "Стратегия и сроки" } },
    { "id": "class", "title": { "en": "Class", "ru": "Класс" } },
    { "id": "level", "title": { "en": "Level", "ru": "Уровень" } }
  ],
  "rows": [
    {
      "id": "r_very_high",
      "cells": [
        { "text": { "en": "Very High-Risk", "ru": "Очень высокий риск" }, "tone": "red" },
        {
          "text": {
            "en": "• Haemodynamic instability or cardiogenic shock\n• Recurrent/ongoing chest pain refractory to medical treatment\n• Life-threatening arrhythmias or cardiac arrest\n• Mechanical complications of MI\n• Acute heart failure\n• Recurrent dynamic ST-T wave changes (particularly intermittent ST-elevation)",
            "ru": "• Гемодинамическая нестабильность или кардиогенный шок\n• Рецидивирующая/сохраняющаяся боль в грудной клетке, рефрактерная к медикаментозной терапии\n• Жизнеугрожающие аритмии или остановка сердца\n• Механические осложнения инфаркта миокарда\n• Острая сердечная недостаточность\n• Рецидивирующие динамические изменения сегмента ST-T (особенно интермиттирующий подъем ST)"
          }
        },
        { "text": { "en": "Immediate Invasive (<2 hours)", "ru": "Неотложная инвазивная (<2 часов)" } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "C", "ru": "C" } }
      ]
    },
    {
      "id": "r_high",
      "cells": [
        { "text": { "en": "High-Risk", "ru": "Высокий риск" }, "tone": "orange" },
        {
          "text": {
            "en": "• Established diagnosis of non-ST-elevation myocardial infarction based on cardiac troponins\n• Dynamic ST/T-changes (symptomatic or silent)\n• GRACE score >140",
            "ru": "• Подтвержденный диагноз инфаркта миокарда без подъема ST на основании динамики сердечных тропонинов\n• Динамические изменения ST/T (с симптомами или бессимптомные)\n• Оценка по шкале GRACE >140 баллов"
          }
        },
        { "text": { "en": "Early Invasive (<24 hours)", "ru": "Ранняя инвазивная (<24 часов)" } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } }
      ]
    },
    {
      "id": "r_intermediate",
      "cells": [
        { "text": { "en": "Intermediate Risk", "ru": "Промежуточный риск" }, "tone": "yellow" },
        {
          "text": {
            "en": "• Diabetes mellitus or renal insufficiency (eGFR <60 mL/min/1.73 m²)\n• LVEF <40% or congestive heart failure\n• Early post-infarction angina or prior PCI/CABG\n• GRACE risk score >109 and <140 or recurrent symptoms/ischaemia on non-invasive testing",
            "ru": "• Сахарный диабет или почечная недостаточность (рСКФ <60 мл/мин/1,73 м²)\n• ФВ ЛЖ <40% или застойная сердечная недостаточность\n• Ранняя постинфарктная стенокардия либо ЧКВ/КШ в анамнезе\n• Оценка по шкале GRACE >109 и <140 либо рецидивирующие симптомы/ишемия при неинвазивных тестах"
          }
        },
        { "text": { "en": "Invasive (<72 hours)", "ru": "Инвазивная (<72 часов)" } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } }
      ]
    }
  ]
};

// 3. rt08-primary-pci-stemi-indications-logistics.json
// Primary percutaneous coronary intervention for myocardial reperfusion in ST-elevation myocardial infarction: indications and logistics
const rt08 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt08-primary-pci-stemi-indications-logistics",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 8",
  "title": {
    "en": "Primary percutaneous coronary intervention for myocardial reperfusion in ST-elevation myocardial infarction: indications and logistics",
    "ru": "Первичное чрескожное коронарное вмешательство для реперфузии миокарда при инфаркте миокарда с подъемом сегмента ST: показания и логистика"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-indication",
      "title": {
        "en": "Indication",
        "ru": "Показания"
      },
      "rows": [
        {
          "id": "r_ind_01",
          "text": {
            "en": "Reperfusion therapy is indicated in all patients with time from symptom onset <12 h duration and persistent ST-segment elevation.",
            "ru": "Реперфузионная терапия показана всем пациентам с длительностью от начала симптомов <12 ч и стойким подъемом сегмента ST."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_ind_02",
          "text": {
            "en": "In the absence of ST-segment elevation, a primary PCI strategy is indicated in patients with suspected ongoing ischaemic symptoms suggestive of MI and at least one of the following criteria present:\n• haemodynamic instability or cardiogenic shock\n• recurrent or ongoing chest pain refractory to medical treatment\n• life-threatening arrhythmias or cardiac arrest\n• mechanical complications of MI\n• acute heart failure\n• recurrent dynamic ST-segment or T-wave changes, particularly with intermittent ST-segment elevation.",
            "ru": "При отсутствии стойкого подъема сегмента ST стратегия первичного ЧКВ показана пациентам с подозрением на продолжающуюся ишемию, указывающую на ИМ, при наличии хотя бы одного из следующих критериев:\n• гемодинамическая нестабильность или кардиогенный шок\n• рецидивирующая или сохраняющаяся боль в грудной клетке, рефрактерная к медикаментозной терапии\n• жизнеугрожающие аритмии или остановка сердца\n• механические осложнения инфаркта миокарда\n• острая сердечная недостаточность\n• рецидивирующие динамические изменения сегмента ST или зубца T, особенно с интермиттирующим подъемом сегмента ST."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_ind_03",
          "text": {
            "en": "A primary PCI strategy is recommended over fibrinolysis within the indicated time frames.",
            "ru": "Стратегия первичного ЧКВ рекомендуется предпочтительнее фибринолиза при условии соблюдения установленных временных рамок."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_ind_04",
          "text": {
            "en": "In patients with time from symptom onset >12 h, a primary PCI strategy is indicated in the presence of ongoing symptoms or signs suggestive of ischaemia, haemodynamic instability, or life-threatening arrhythmias.",
            "ru": "У пациентов со сроком от начала симптомов >12 ч первичное ЧКВ показано при наличии сохраняющихся симптомов или признаков ишемии, гемодинамической нестабильности либо жизнеугрожающих аритмий."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_ind_05",
          "text": {
            "en": "A routine primary PCI strategy should be considered in patients presenting late (12–48 h) after symptom onset.",
            "ru": "Рутинную стратегию первичного ЧКВ следует рассмотреть у пациентов, поступивших в поздние сроки (12–48 ч) после начала симптомов."
          },
          "class": "IIa",
          "level": "B"
        }
      ]
    },
    {
      "id": "sec-logistics",
      "title": {
        "en": "Logistics",
        "ru": "Логистика"
      },
      "rows": [
        {
          "id": "r_log_01",
          "text": {
            "en": "It is recommended that the pre-hospital management of STEMI patients should be based on regional networks that are designed to deliver reperfusion therapy effectively in a timely fashion, and to offer primary PCI to as many patients as possible.",
            "ru": "Рекомендуется базировать догоспитальное ведение пациентов с ИМпST на региональных сетях, организованных для эффективного и своевременного проведения реперфузии и обеспечения первичного ЧКВ как можно большему числу пациентов."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_log_02",
          "text": {
            "en": "It is recommended that all EMS, emergency departments, coronary care units, and catheterization laboratories have a written updated STEMI management protocol, preferably shared within geographical networks.",
            "ru": "Рекомендуется, чтобы службы скорой медицинской помощи, приемные отделения, блоки кардиореанимации (ОРИТ/БИТ) и рентгеноперационные имели единый обновляемый письменный протокол ведения ИМпST, предпочтительно согласованный в масштабах географического региона."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_log_03",
          "text": {
            "en": "It is recommended that primary PCI-capable centres deliver a 24 h/7 day service and ensure that primary PCI is performed as fast as possible.",
            "ru": "Рекомендуется, чтобы центры, выполняющие первичное ЧКВ, работали в режиме 24/7 и обеспечивали проведение первичного ЧКВ в кратчайшие сроки."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_log_04",
          "text": {
            "en": "It is recommended that patients transferred to a PCI-capable centre for primary PCI bypass the emergency department and CCU/ICCU, and are transferred directly to the catheterization laboratory.",
            "ru": "Рекомендуется, чтобы пациенты, транспортируемые в ЧКВ-центр для первичного ЧКВ, миновали приемное отделение и блок интенсивной терапии и направлялись непосредственно в рентгеноперационную."
          },
          "class": "I",
          "level": "B"
        }
      ]
    }
  ]
};

// 4. rt09-primary-pci-stemi-procedural.json
// Primary percutaneous coronary intervention for myocardial reperfusion in ST-elevation myocardial infarction: procedural aspects (strategy and technique)
const rt09 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt09-primary-pci-stemi-procedural",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 9",
  "title": {
    "en": "Primary percutaneous coronary intervention for myocardial reperfusion in ST-elevation myocardial infarction: procedural aspects (strategy and technique)",
    "ru": "Первичное чрескожное коронарное вмешательство для реперфузии миокарда при инфаркте миокарда с подъемом сегмента ST: процедурные аспекты (стратегия и техника)"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-strategy",
      "title": {
        "en": "Strategy",
        "ru": "Стратегия"
      },
      "rows": [
        {
          "id": "r_strat_01",
          "text": {
            "en": "Routine revascularization of non-IRA lesions should be considered in patients with multivessel disease before hospital discharge.",
            "ru": "Рутинную реваскуляризацию не связанных с инфарктом поражений (non-IRA) следует рассмотреть у пациентов с многососудистым поражением до выписки из стационара."
          },
          "class": "IIa",
          "level": "A"
        },
        {
          "id": "r_strat_02",
          "text": {
            "en": "CABG should be considered in patients with ongoing ischaemia and large areas of jeopardized myocardium if PCI of the IRA cannot be performed.",
            "ru": "КШ следует рассмотреть у пациентов с сохраняющейся ишемией и большой зоной жизнеспособного миокарда под угрозой, если ЧКВ на инфаркт-связанной артерии выполнить невозможно."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_strat_03",
          "text": {
            "en": "In cardiogenic shock, routine revascularization of non-IRA lesions is not recommended during primary PCI.",
            "ru": "При кардиогенном шоке рутинная реваскуляризация не связанных с инфарктом артерий во время первичного ЧКВ не рекомендуется."
          },
          "class": "III",
          "level": "B"
        }
      ]
    },
    {
      "id": "sec-technique",
      "title": {
        "en": "Technique",
        "ru": "Техника выполнения"
      },
      "rows": [
        {
          "id": "r_tech_01",
          "text": {
            "en": "Routine use of thrombus aspiration is not recommended.",
            "ru": "Рутинное применение мануальной тромбоаспирации не рекомендуется."
          },
          "class": "III",
          "level": "A"
        }
      ]
    }
  ]
};

// 5. rt10-revasc-heart-failure-lv-dysfunction.json
// Recommendations on revascularizations in patients with chronic heart failure and systolic left ventricular dysfunction (ejection fraction ≤35%)
const rt10 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt10-revasc-heart-failure-lv-dysfunction",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 10",
  "title": {
    "en": "Recommendations on revascularizations in patients with chronic heart failure and systolic left ventricular dysfunction (ejection fraction ≤35%)",
    "ru": "Рекомендации по реваскуляризации у пациентов с хронической сердечной недостаточностью и систолической дисфункцией левого желудочка (фракция выброса ≤35%)"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Revascularization in chronic HF and LV dysfunction (LVEF ≤35%)",
        "ru": "Реваскуляризация при ХСН и систолической дисфункции ЛЖ (ФВ ЛЖ ≤35%)"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "In patients with severe LV systolic dysfunction and coronary artery disease suitable for intervention, myocardial revascularization is recommended.",
            "ru": "У пациентов с выраженной систолической дисфункцией ЛЖ и ишемической болезнью сердца, подходящей для вмешательства, рекомендуется проведение реваскуляризации миокарда."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r02",
          "text": {
            "en": "CABG is recommended as the first revascularization strategy choice in patients with multivessel disease and acceptable surgical risk.",
            "ru": "КШ рекомендуется в качестве метода выбора первой линии реваскуляризации у пациентов с многососудистым поражением и приемлемым хирургическим риском."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r03",
          "text": {
            "en": "In patients with one- or two-vessel disease, PCI should be considered as an alternative to CABG when complete revascularization can be achieved.",
            "ru": "У пациентов с одно- или двухсосудистым поражением следует рассмотреть ЧКВ как альтернативу КШ, если возможно достижение полной реваскуляризации."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r04",
          "text": {
            "en": "In patients with three-vessel disease, PCI should be considered based on the evaluation by the Heart Team of the patient's coronary anatomy, the expected completeness of revascularization, diabetes status, and comorbidities.",
            "ru": "У пациентов с трехсосудистым поражением возможность ЧКВ следует рассматривать на основе коллегиальной оценки Heart Team коронарной анатомии, ожидаемой полноты реваскуляризации, наличия диабета и сопутствующих заболеваний."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r05",
          "text": {
            "en": "LV aneurysmectomy during CABG should be considered in patients with NYHA class III/IV, large LV aneurysm, large thrombus formation, or if the aneurysm is the origin of arrhythmias.",
            "ru": "Аневризмэктомию ЛЖ во время КШ следует рассмотреть у пациентов с III/IV ФК по NYHA, большой аневризмой ЛЖ, формированием крупного тромба или если аневризма служит источником аритмий."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r06",
          "text": {
            "en": "Surgical ventricular restoration during CABG may be considered in selected patients treated in centres with expertise.",
            "ru": "Хирургическое ремоделирование/восстановление ЛЖ (SVR) во время КШ может быть рассмотрено у отдельных пациентов в специализированных центрах с соответствующим опытом."
          },
          "class": "IIb",
          "level": "B"
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(baseDir, 'rt07-nste-acs-invasive-evaluation.json'), JSON.stringify(rt07, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 't08-nste-acs-risk-stratification.json'), JSON.stringify(t08, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt08-primary-pci-stemi-indications-logistics.json'), JSON.stringify(rt08, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt09-primary-pci-stemi-procedural.json'), JSON.stringify(rt09, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt10-revasc-heart-failure-lv-dysfunction.json'), JSON.stringify(rt10, null, 2), 'utf8');

console.log('Successfully generated rt07, t08, rt08, rt09, rt10 for esc-revasc-2018');
