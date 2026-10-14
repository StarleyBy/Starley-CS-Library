import fs from 'fs';
import path from 'path';

const baseDir = 'd:/IT sandbox/Starley-CS-Library/data/guidelines/esc-revasc-2018';

// 1. rt03-decision-making-patient-information.json
// Recommendations for decision-making and patient information in the elective setting
const rt03 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt03-decision-making-patient-information",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 3",
  "title": {
    "en": "Recommendations for decision-making and patient information in the elective setting",
    "ru": "Рекомендации по принятию решений и информированию пациентов в плановом порядке"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Decision-making and patient information",
        "ru": "Принятие решений и информирование пациента"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "It is recommended that patients undergoing coronary angiography are informed about benefits and risks, as well as potential therapeutic consequences, ahead of the procedure.",
            "ru": "Рекомендуется информировать пациентов, направляемых на коронарографию, о пользе, рисках и возможных терапевтических последствиях до выполнения процедуры."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r02",
          "text": {
            "en": "It is recommended that patients are adequately informed about short- and long-term benefits and risks of the revascularization procedure with information about local experience, and allowed enough time for informed decision-making.",
            "ru": "Рекомендуется надлежащим образом информировать пациентов о краткосрочной и долгосрочной пользе и рисках процедуры реваскуляризации с учетом данных местного опыта, а также предоставить достаточно времени для принятия осознанного решения."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r03",
          "text": {
            "en": "It is recommended that institutional protocols are developed by the Heart Team to implement the appropriate revascularization strategy in accordance with current Guidelines.",
            "ru": "Рекомендуется, чтобы команда кардиологов и кардиохирургов (Heart Team) разработала локальные клинические протоколы для реализации надлежащей стратегии реваскуляризации в соответствии с актуальными рекомендациями."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r04",
          "text": {
            "en": "In PCI centres without on-site surgery, it is recommended that institutional protocols are established with partner institutions providing cardiac surgery.",
            "ru": "В центрах ЧКВ без хирургического отделения на месте рекомендуется утвердить локальные протоколы взаимодействия с партнерскими клиниками, выполняющими кардиохирургические вмешательства."
          },
          "class": "I",
          "level": "C"
        }
      ]
    }
  ]
};

// 2. rt04-indications-stable-angina.json
// Indications for revascularization in patients with stable angina or silent ischaemia
const rt04 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt04-indications-stable-angina",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 4",
  "title": {
    "en": "Indications for revascularization in patients with stable angina or silent ischaemia",
    "ru": "Показания к реваскуляризации у пациентов со стабильной стенокардией или безболевой ишемией миокарда"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-prognosis",
      "title": {
        "en": "For prognosis",
        "ru": "Для улучшения прогноза"
      },
      "rows": [
        {
          "id": "r_prog_01",
          "text": {
            "en": "Left main disease with stenosis >50% (with documented ischaemia or a haemodynamically relevant lesion defined by FFR ≤0.80 or iwFR ≤0.89, or >90% stenosis in a major coronary vessel).",
            "ru": "Поражение ствола левой коронарной артерии со стенозом >50% (при подтвержденной ишемии или гемодинамически значимом стенозе по данным FFR ≤0,80 либо iwFR ≤0,89, либо при стенозе >90% магистральной коронарной артерии)."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_prog_02",
          "text": {
            "en": "Proximal LAD stenosis >50% (with documented ischaemia or a haemodynamically relevant lesion defined by FFR ≤0.80 or iwFR ≤0.89, or >90% stenosis in a major coronary vessel).",
            "ru": "Стеноз проксимального отдела ПМЖВ >50% (при подтвержденной ишемии или гемодинамически значимом стенозе по данным FFR ≤0,80 либо iwFR ≤0,89, либо при стенозе >90% магистральной коронарной артерии)."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_prog_03",
          "text": {
            "en": "Two- or three-vessel disease with stenosis >50% with impaired LV function (LVEF ≤35%) (with documented ischaemia or a haemodynamically relevant lesion defined by FFR ≤0.80 or iwFR ≤0.89, or >90% stenosis in a major coronary vessel).",
            "ru": "Двух- или трехсосудистое поражение со стенозом >50% и нарушением функции ЛЖ (ФВ ЛЖ ≤35%) (при подтвержденной ишемии или гемодинамически значимом стенозе по данным FFR ≤0,80 либо iwFR ≤0,89, либо при стенозе >90% магистральной коронарной артерии)."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_prog_04",
          "text": {
            "en": "Large area of ischaemia detected by functional testing (>10% LV) or abnormal invasive FFR (based on FFR <0.75 indicating a prognostically relevant lesion).",
            "ru": "Большая зона ишемии, выявленная при функциональном тестировании (>10% миокарда ЛЖ), или патологический инвазивный FFR (на основании FFR <0,75, указывающего на прогностически значимое поражение)."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_prog_05",
          "text": {
            "en": "Single remaining patent coronary artery with stenosis >50% (with documented ischaemia or a haemodynamically relevant lesion defined by FFR ≤0.80 or iwFR ≤0.89, or >90% stenosis in a major coronary vessel).",
            "ru": "Единственная сохранная проходимая коронарная артерия со стенозом >50% (при подтвержденной ишемии или гемодинамически значимом стенозе по данным FFR ≤0,80 либо iwFR ≤0,89, либо при стенозе >90% магистральной коронарной артерии)."
          },
          "class": "I",
          "level": "C"
        }
      ]
    },
    {
      "id": "sec-symptoms",
      "title": {
        "en": "For symptoms",
        "ru": "Для уменьшения симптомов"
      },
      "rows": [
        {
          "id": "r_symp_01",
          "text": {
            "en": "Haemodynamically significant coronary stenosis (with documented ischaemia or a haemodynamically relevant lesion defined by FFR ≤0.80 or iwFR ≤0.89, or >90% stenosis in a major coronary vessel) in the presence of limiting angina or angina equivalent, with insufficient response to optimized medical therapy (in consideration of patient compliance and wishes in relation to the intensity of anti-anginal therapy).",
            "ru": "Гемодинамически значимый коронарный стеноз (при подтвержденной ишемии или гемодинамически значимом стенозе по данным FFR ≤0,80 либо iwFR ≤0,89, либо стенозе >90% магистральной артерии) при наличии лимитирующей стенокардии или ее эквивалентов и недостаточном ответе на оптимальную медикаментозную терапию (с учетом приверженности и пожеланий пациента относительно интенсивности антиангинальной терапии)."
          },
          "class": "I",
          "level": "A"
        }
      ]
    }
  ]
};

// 3. t04-rcts-des-vs-cabg.json
// Table 4 Randomized clinical trials comparing percutaneous coronary intervention with drug-eluting stents vs. surgical revascularization
const t04 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.t04-rcts-des-vs-cabg",
  "guidelineId": "esc-revasc-2018",
  "number": "Table 4",
  "title": {
    "en": "Randomized clinical trials comparing percutaneous coronary intervention with drug-eluting stents vs. surgical revascularization",
    "ru": "Рандомизированные клинические исследования, сравнивающие чрескожное коронарное вмешательство со стентами с лекарственным покрытием и хирургическую реваскуляризацию"
  },
  "type": "grid",
  "columns": [
    { "id": "stent_year", "title": { "en": "Stent type and year of publication", "ru": "Тип стента и год публикации" } },
    { "id": "study", "title": { "en": "Study", "ru": "Исследование" } },
    { "id": "n", "title": { "en": "N", "ru": "N" } },
    { "id": "age", "title": { "en": "Age (y)", "ru": "Возраст (лет)" } },
    { "id": "women", "title": { "en": "Women (%)", "ru": "Женщины (%)" } },
    { "id": "diabetes", "title": { "en": "Diabetes (%)", "ru": "Диабет (%)" } },
    { "id": "mv_disease", "title": { "en": "MV disease (%)", "ru": "Многососудистое поражение (%)" } },
    { "id": "ef", "title": { "en": "EF (%)", "ru": "ФВ (%)" } },
    { "id": "primary_endpoint_def", "title": { "en": "Primary endpoint definition", "ru": "Первичная конечная точка: определение" } },
    { "id": "primary_endpoint_y", "title": { "en": "Primary endpoint: Years", "ru": "Первичная конечная точка: лет" } },
    { "id": "primary_endpoint_res", "title": { "en": "Primary endpoint results (PCI vs. CABG)", "ru": "Первичная конечная точка: ЧКВ vs КШ" } },
    { "id": "sec_y", "title": { "en": "Secondary endpoints: Years", "ru": "Вторичные конечные точки: лет" } },
    { "id": "sec_death", "title": { "en": "Death (PCI vs. CABG)", "ru": "Смерть (ЧКВ vs КШ)" } },
    { "id": "sec_mi", "title": { "en": "MI (PCI vs. CABG)", "ru": "ИМ (ЧКВ vs КШ)" } },
    { "id": "sec_revasc", "title": { "en": "Repeat Revasc (PCI vs. CABG)", "ru": "Повторная реваскуляризация (ЧКВ vs КШ)" } },
    { "id": "sec_stroke", "title": { "en": "Stroke (PCI vs. CABG)", "ru": "Инсульт (ЧКВ vs КШ)" } }
  ],
  "rows": [
    {
      "id": "syntax",
      "cells": [
        { "text": { "en": "PES 2009", "ru": "PES 2009" } },
        { "text": { "en": "SYNTAX", "ru": "SYNTAX" } },
        { "text": { "en": "1800", "ru": "1800" } },
        { "text": { "en": "65", "ru": "65" } },
        { "text": { "en": "22", "ru": "22" } },
        { "text": { "en": "25", "ru": "25" } },
        { "text": { "en": "MV 61, LM 39", "ru": "Многососудистое 61, ствол ЛКА 39" } },
        { "text": { "en": "-", "ru": "-" } },
        { "text": { "en": "Death, MI, stroke, or repeat revasc", "ru": "Смерть, ИМ, инсульт или повторная реваскуляризация" } },
        { "text": { "en": "1", "ru": "1" } },
        { "text": { "en": "17.8% vs. 12.4%", "ru": "17,8% против 12,4%" } },
        { "text": { "en": "5", "ru": "5" } },
        { "text": { "en": "13.9% vs. 11.4%", "ru": "13,9% против 11,4%" } },
        { "text": { "en": "9.7% vs. 3.8% (P < 0.05)", "ru": "9,7% против 3,8% (P < 0,05)" } },
        { "text": { "en": "25.9% vs. 13.7% (P < 0.05)", "ru": "25,9% против 13,7% (P < 0,05)" } },
        { "text": { "en": "2.4% vs. 3.7%", "ru": "2,4% против 3,7%" } }
      ]
    },
    {
      "id": "boudriot",
      "cells": [
        { "text": { "en": "SES 2011", "ru": "SES 2011" } },
        { "text": { "en": "Boudriot", "ru": "Boudriot" } },
        { "text": { "en": "201", "ru": "201" } },
        { "text": { "en": "68", "ru": "68" } },
        { "text": { "en": "25", "ru": "25" } },
        { "text": { "en": "36", "ru": "36" } },
        { "text": { "en": "LM 100", "ru": "Ствол ЛКА 100" } },
        { "text": { "en": "65", "ru": "65" } },
        { "text": { "en": "Death, MI, or repeat revasc", "ru": "Смерть, ИМ или повторная реваскуляризация" } },
        { "text": { "en": "1", "ru": "1" } },
        { "text": { "en": "13.9% vs. 19%", "ru": "13,9% против 19%" } },
        { "text": { "en": "1", "ru": "1" } },
        { "text": { "en": "2% vs. 5%", "ru": "2% против 5%" } },
        { "text": { "en": "3% vs. 3%", "ru": "3% против 3%" } },
        { "text": { "en": "14% vs. 5.9%", "ru": "14% против 5,9%" } },
        { "text": { "en": "-", "ru": "-" } }
      ]
    },
    {
      "id": "precombat",
      "cells": [
        { "text": { "en": "SES 2011", "ru": "SES 2011" } },
        { "text": { "en": "PRECOMBAT", "ru": "PRECOMBAT" } },
        { "text": { "en": "600", "ru": "600" } },
        { "text": { "en": "62", "ru": "62" } },
        { "text": { "en": "24", "ru": "24" } },
        { "text": { "en": "32", "ru": "32" } },
        { "text": { "en": "LM 100", "ru": "Ствол ЛКА 100" } },
        { "text": { "en": "61", "ru": "61" } },
        { "text": { "en": "Death, MI, stroke, or TVR", "ru": "Смерть, ИМ, инсульт или TVR" } },
        { "text": { "en": "1", "ru": "1" } },
        { "text": { "en": "8.7% vs. 6.7% (non-inferiority met)", "ru": "8,7% против 6,7% (критерий non-inferiority достигнут)" } },
        { "text": { "en": "2", "ru": "2" } },
        { "text": { "en": "2.4% vs. 3.4%", "ru": "2,4% против 3,4%" } },
        { "text": { "en": "1.7% vs. 1.0%", "ru": "1,7% против 1,0%" } },
        { "text": { "en": "9.0% vs. 4.2% (P < 0.05)", "ru": "9,0% против 4,2% (P < 0,05)" } },
        { "text": { "en": "0.4% vs. 0.7%", "ru": "0,4% против 0,7%" } }
      ]
    },
    {
      "id": "best",
      "cells": [
        { "text": { "en": "EES 2015", "ru": "EES 2015" } },
        { "text": { "en": "BEST", "ru": "BEST" } },
        { "text": { "en": "880", "ru": "880" } },
        { "text": { "en": "64", "ru": "64" } },
        { "text": { "en": "29", "ru": "29" } },
        { "text": { "en": "41", "ru": "41" } },
        { "text": { "en": "MV 100", "ru": "Многососудистое 100" } },
        { "text": { "en": "60", "ru": "60" } },
        { "text": { "en": "Death, MI, or TVR", "ru": "Смерть, ИМ или TVR" } },
        { "text": { "en": "2", "ru": "2" } },
        { "text": { "en": "11.0% vs. 7.9%", "ru": "11,0% против 7,9%" } },
        { "text": { "en": "5", "ru": "5" } },
        { "text": { "en": "6.6% vs. 5.0%", "ru": "6,6% против 5,0%" } },
        { "text": { "en": "4.8% vs. 2.7%", "ru": "4,8% против 2,7%" } },
        { "text": { "en": "13.4% vs. 6.6%", "ru": "13,4% против 6,6%" } },
        { "text": { "en": "2.9% vs. 3.3%", "ru": "2,9% против 3,3%" } }
      ]
    },
    {
      "id": "noble",
      "cells": [
        { "text": { "en": "BES 2016", "ru": "BES 2016" } },
        { "text": { "en": "NOBLE", "ru": "NOBLE" } },
        { "text": { "en": "1201", "ru": "1201" } },
        { "text": { "en": "66", "ru": "66" } },
        { "text": { "en": "22", "ru": "22" } },
        { "text": { "en": "15", "ru": "15" } },
        { "text": { "en": "LM 100", "ru": "Ствол ЛКА 100" } },
        { "text": { "en": "60", "ru": "60" } },
        { "text": { "en": "Death, MI, or TVR", "ru": "Смерть, ИМ или TVR" } },
        { "text": { "en": "5", "ru": "5" } },
        { "text": { "en": "15.4% vs. 7.2%", "ru": "15,4% против 7,2%" } },
        { "text": { "en": "5", "ru": "5" } },
        { "text": { "en": "11.6% vs. 9.5%", "ru": "11,6% против 9,5%" } },
        { "text": { "en": "6.9% vs. 1.9% (non-procedural MI, P < 0.05)", "ru": "6,9% против 1,9% (непроцедурный ИМ, P < 0,05)" } },
        { "text": { "en": "16.2% vs. 10.4% (P < 0.05)", "ru": "16,2% против 10,4% (P < 0,05)" } },
        { "text": { "en": "4.9% vs. 1.7%", "ru": "4,9% против 1,7%" } }
      ]
    },
    {
      "id": "excel",
      "cells": [
        { "text": { "en": "EES 2016", "ru": "EES 2016" } },
        { "text": { "en": "EXCEL", "ru": "EXCEL" } },
        { "text": { "en": "1905", "ru": "1905" } },
        { "text": { "en": "66", "ru": "66" } },
        { "text": { "en": "24", "ru": "24" } },
        { "text": { "en": "30", "ru": "30" } },
        { "text": { "en": "LM 100", "ru": "Ствол ЛКА 100" } },
        { "text": { "en": "57", "ru": "57" } },
        { "text": { "en": "Death, MI, or stroke", "ru": "Смерть, ИМ или инсульт" } },
        { "text": { "en": "3", "ru": "3" } },
        { "text": { "en": "15.4% vs. 14.7% (non-inferiority met)", "ru": "15,4% против 14,7% (критерий non-inferiority достигнут)" } },
        { "text": { "en": "3", "ru": "3" } },
        { "text": { "en": "8.2% vs. 5.9%", "ru": "8,2% против 5,9%" } },
        { "text": { "en": "8.0% vs. 8.3%", "ru": "8,0% против 8,3%" } },
        { "text": { "en": "13.4% vs. 6.6%*", "ru": "13,4% против 6,6%*" } },
        { "text": { "en": "2.3% vs. 2.9%", "ru": "2,3% против 2,9%" } }
      ]
    }
  ]
};

// 4. t05-euroscore-in-rcts.json
// Table 5 Logistic EuroSCOREs in major randomized trials comparing percutaneous coronary intervention with coronary artery bypass grafting
const t05 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.t05-euroscore-in-rcts",
  "guidelineId": "esc-revasc-2018",
  "number": "Table 5",
  "title": {
    "en": "Logistic EuroSCOREs in major randomized trials comparing percutaneous coronary intervention with coronary artery bypass grafting",
    "ru": "Логистический EuroSCORE в ключевых рандомизированных исследованиях, сравнивающих чрескожное коронарное вмешательство и коронарное шунтирование"
  },
  "type": "grid",
  "columns": [
    { "id": "trial", "title": { "en": "Trial", "ru": "Исследование" } },
    { "id": "euroscore_pci", "title": { "en": "EuroSCORE PCI", "ru": "EuroSCORE ЧКВ" } },
    { "id": "euroscore_cabg", "title": { "en": "EuroSCORE CABG", "ru": "EuroSCORE КШ" } }
  ],
  "rows": [
    {
      "id": "syntax",
      "cells": [
        { "text": { "en": "SYNTAX", "ru": "SYNTAX" } },
        { "text": { "en": "3.8 ± 2.6", "ru": "3,8 ± 2,6" } },
        { "text": { "en": "3.8 ± 2.7", "ru": "3,8 ± 2,7" } }
      ]
    },
    {
      "id": "best",
      "cells": [
        { "text": { "en": "BEST", "ru": "BEST" } },
        { "text": { "en": "2.9 ± 2.0", "ru": "2,9 ± 2,0" } },
        { "text": { "en": "3.0 ± 2.1", "ru": "3,0 ± 2,1" } }
      ]
    },
    {
      "id": "freedom",
      "cells": [
        { "text": { "en": "FREEDOM", "ru": "FREEDOM" } },
        { "text": { "en": "2.7 ± 2.4", "ru": "2,7 ± 2,4" } },
        { "text": { "en": "2.8 ± 2.5", "ru": "2,8 ± 2,5" } }
      ]
    },
    {
      "id": "precombat",
      "cells": [
        { "text": { "en": "PRECOMBAT", "ru": "PRECOMBAT" } },
        { "text": { "en": "2.7 ± 1.8", "ru": "2,7 ± 1,8" } },
        { "text": { "en": "2.8 ± 1.9", "ru": "2,8 ± 1,9" } }
      ]
    },
    {
      "id": "excel",
      "cells": [
        { "text": { "en": "EXCEL", "ru": "EXCEL" } },
        { "text": { "en": "Not reported", "ru": "Не указано" } },
        { "text": { "en": "Not reported", "ru": "Не указано" } }
      ]
    },
    {
      "id": "noble",
      "cells": [
        { "text": { "en": "NOBLE", "ru": "NOBLE" } },
        { "text": { "en": "2 (2–4)", "ru": "2 (2–4)" } },
        { "text": { "en": "2 (2–4)", "ru": "2 (2–4)" } }
      ]
    }
  ]
};

fs.writeFileSync(path.join(baseDir, 'rt03-decision-making-patient-information.json'), JSON.stringify(rt03, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt04-indications-stable-angina.json'), JSON.stringify(rt04, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 't04-rcts-des-vs-cabg.json'), JSON.stringify(t04, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 't05-euroscore-in-rcts.json'), JSON.stringify(t05, null, 2), 'utf8');

console.log('Successfully generated rt03, rt04, t04, and t05 for esc-revasc-2018');
