import fs from 'fs';
import path from 'path';

const baseDir = 'd:/IT sandbox/Starley-CS-Library/data/guidelines/esc-revasc-2018';

// 1. t01-new-recommendations.json (Figure 1 / Section 2.1 What is new in the 2018 Guidelines?)
const t01 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.t01-new-recommendations",
  "guidelineId": "esc-revasc-2018",
  "number": "Figure 1",
  "title": {
    "en": "What is new in the 2018 Guidelines?",
    "ru": "Что нового в Рекомендациях 2018 года?"
  },
  "type": "grid",
  "columns": [
    {
      "id": "c_class",
      "title": { "en": "Class", "ru": "Класс" }
    },
    {
      "id": "c_rec",
      "title": { "en": "New Recommendation / Concept", "ru": "Новая рекомендация / концепция" }
    }
  ],
  "rows": [
    {
      "id": "r_c1_01",
      "cells": [
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        {
          "text": {
            "en": "Calculation of the Syntax Score, if left main or multivessel revascularization is considered.",
            "ru": "Расчет шкалы SYNTAX Score, если рассматривается реваскуляризация ствола левой коронарной артерии или многососудистое поражение."
          }
        }
      ]
    },
    {
      "id": "r_c1_02",
      "cells": [
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        {
          "text": {
            "en": "Radial access as standard approach for coronary angiography and PCI.",
            "ru": "Радиальный доступ в качестве стандартного подхода для коронарографии и ЧКВ."
          }
        }
      ]
    },
    {
      "id": "r_c1_03",
      "cells": [
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        {
          "text": {
            "en": "DES for any PCI.",
            "ru": "Использование стентов с лекарственным покрытием (DES) при любом ЧКВ."
          }
        }
      ]
    },
    {
      "id": "r_c1_04",
      "cells": [
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        {
          "text": {
            "en": "Systematic re-evaluation of patients after myocardial revascularization.",
            "ru": "Систематическая повторная оценка состояния пациентов после реваскуляризации миокарда."
          }
        }
      ]
    },
    {
      "id": "r_c1_05",
      "cells": [
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        {
          "text": {
            "en": "Stabilised NSTE-ACS patients: revascularization strategy according to principles for SCAD.",
            "ru": "Стабилизированные пациенты с ОКСбпST: выбор стратегии реваскуляризации в соответствии с принципами для стабильной ИБС."
          }
        }
      ]
    },
    {
      "id": "r_c1_06",
      "cells": [
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        {
          "text": {
            "en": "Use of the radial artery grafts over saphenous vein grafts in patients with high-degree stenosis.",
            "ru": "Использование трансплантатов лучевой артерии вместо аутовены у пациентов с тяжелым стенозом."
          }
        }
      ]
    },
    {
      "id": "r_c1_07",
      "cells": [
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        {
          "text": {
            "en": "Myocardial revascularization in patients with CAD, heart failure, and LVEF ≤35%: CABG preferred.",
            "ru": "Реваскуляризация миокарда у пациентов с ИБС, сердечной недостаточностью и ФВ ЛЖ ≤35%: предпочтение отдается КШ."
          }
        }
      ]
    },
    {
      "id": "r_c2a_01",
      "cells": [
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        {
          "text": {
            "en": "Completeness of revascularization prioritized, when considering CABG vs PCI.",
            "ru": "Приоритет полноты реваскуляризации при сопоставлении КШ и ЧКВ."
          }
        }
      ]
    },
    {
      "id": "r_c2a_02",
      "cells": [
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        {
          "text": {
            "en": "NOAC preferred over VKA in patients with non-valvular AF requiring anticoagulation and antiplatelet treatment.",
            "ru": "Предпочтение ПОАК перед АВК у пациентов с неклапанной ФП, требующих сочетания антикоагулянтной и антитромбоцитарной терапии."
          }
        }
      ]
    },
    {
      "id": "r_c2a_03",
      "cells": [
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        {
          "text": {
            "en": "No-touch vein technique, if open vein harvesting for CABG.",
            "ru": "Техника «no-touch» («без прикосновения») при открытом заборе большой подкожной вены для КШ."
          }
        }
      ]
    },
    {
      "id": "r_c2a_04",
      "cells": [
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        {
          "text": {
            "en": "Annual operator volume for left main PCI of at least 25 cases per year.",
            "ru": "Ежегодный объем вмешательств оператора на стволе левой коронарной артерии не менее 25 процедур в год."
          }
        }
      ]
    },
    {
      "id": "r_c2a_05",
      "cells": [
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        {
          "text": {
            "en": "Pre- and post-hydration with isotonic saline in patients with moderate or severe CKD if the expected contrast volume is >100 mL.",
            "ru": "Инфузия изотонического солевого раствора до и после процедуры у пациентов с умеренной или тяжелой ХБП при ожидаемом объеме контраста >100 мл."
          }
        }
      ]
    },
    {
      "id": "r_c2a_06",
      "cells": [
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        {
          "text": {
            "en": "Myocardial revascularization in patients with CAD, heart failure, and LVEF ≤35%: PCI as alternative to CABG.",
            "ru": "Реваскуляризация миокарда у пациентов с ИБС, сердечной недостаточностью и ФВ ЛЖ ≤35%: ЧКВ как альтернатива КШ."
          }
        }
      ]
    },
    {
      "id": "r_c2b_01",
      "cells": [
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        {
          "text": {
            "en": "Routine non-invasive imaging surveillance in high-risk patients 6 months after revascularization.",
            "ru": "Рутинный неинвазивный визуализирующий контроль у пациентов высокого риска через 6 месяцев после реваскуляризации."
          }
        }
      ]
    },
    {
      "id": "r_c2b_02",
      "cells": [
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        {
          "text": {
            "en": "Double-kissing crush technique preferred over provisional T-stenting in true left main bifurcations.",
            "ru": "Методика DK-crush предпочтительнее методики провизорного T-стентирования при истинных бифуркационных поражениях ствола ЛКА."
          }
        }
      ]
    },
    {
      "id": "r_c2b_03",
      "cells": [
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        {
          "text": {
            "en": "Cangrelor in P2Y12-inhibitor naïve patients undergoing PCI.",
            "ru": "Кангрелор у ранее не получавших ингибиторы P2Y12 пациентов, подвергающихся ЧКВ."
          }
        }
      ]
    },
    {
      "id": "r_c2b_04",
      "cells": [
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        {
          "text": {
            "en": "GP IIb/IIIa inhibitors for PCI in P2Y12-inhibitor naïve patients with ACS undergoing PCI.",
            "ru": "Ингибиторы гликопротеина IIb/IIIa для ЧКВ у пациентов с ОКС, ранее не получавших ингибиторы P2Y12."
          }
        }
      ]
    },
    {
      "id": "r_c2b_05",
      "cells": [
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        {
          "text": {
            "en": "Dabigatran 150-mg dose preferred over 110-mg dose when combined with single antiplatelet therapy after PCI.",
            "ru": "Дабигатран в дозе 150 мг предпочтительнее дозы 110 мг при комбинации с одинарной антитромбоцитарной терапией после ЧКВ."
          }
        }
      ]
    },
    {
      "id": "r_c2b_06",
      "cells": [
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        {
          "text": {
            "en": "De-escalation of P2Y12 inhibitor guided by platelet function testing in ACS patients.",
            "ru": "Деэскалация терапии ингибиторами P2Y12 под контролем тестов функции тромбоцитов у пациентов с ОКС."
          }
        }
      ]
    },
    {
      "id": "r_c3_01",
      "cells": [
        { "text": { "en": "III", "ru": "III" }, "tone": "red" },
        {
          "text": {
            "en": "Routine revascularization of non-IRA lesions in myocardial infarction with cardiogenic shock.",
            "ru": "Рутинная реваскуляризация не связанных с инфарктом поражений при инфаркте миокарда с кардиогенным шоком."
          }
        }
      ]
    },
    {
      "id": "r_c3_02",
      "cells": [
        { "text": { "en": "III", "ru": "III" }, "tone": "red" },
        {
          "text": {
            "en": "Current generation BRS for clinical use outside clinical studies.",
            "ru": "Биорезорбируемые скаффолды (BRS) текущего поколения для клинического использования вне рамок клинических исследований."
          }
        }
      ]
    }
  ]
};

// 2. t02-revised-recommendations.json (Figure 2 / Changes in class of recommendation)
const t02 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.t02-revised-recommendations",
  "guidelineId": "esc-revasc-2018",
  "number": "Figure 2",
  "title": {
    "en": "Changes in class of recommendation (2014 vs 2018)",
    "ru": "Изменения класса рекомендаций (2014 против 2018)"
  },
  "type": "grid",
  "columns": [
    {
      "id": "c_direction",
      "title": { "en": "Change", "ru": "Изменение" }
    },
    {
      "id": "c_prev",
      "title": { "en": "2014 Class", "ru": "Класс 2014" }
    },
    {
      "id": "c_curr",
      "title": { "en": "2018 Class", "ru": "Класс 2018" }
    },
    {
      "id": "c_text",
      "title": { "en": "Recommendation", "ru": "Рекомендация" }
    }
  ],
  "rows": [
    {
      "id": "up_01",
      "cells": [
        { "text": { "en": "Upgrade", "ru": "Повышение" } },
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        {
          "text": {
            "en": "For PCI of bifurcation lesions, stent implantation in the main vessel only, followed by provisional balloon angioplasty with or without stenting of the side branch.",
            "ru": "При ЧКВ бифуркационных поражений: имплантация стента только в основной сосуд с последующей провизорной баллонной ангиопластикой со стентированием боковой ветви или без него."
          }
        }
      ]
    },
    {
      "id": "up_02",
      "cells": [
        { "text": { "en": "Upgrade", "ru": "Повышение" } },
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        {
          "text": {
            "en": "Immediate coronary angiography and revascularization, if appropriate, in survivors of out-of-hospital cardiac arrest and an ECG consistent with STEMI.",
            "ru": "Немедленная коронарография и при необходимости реваскуляризация у выживших после внебольничной остановки сердца с ЭКГ-признаками ИМпST."
          }
        }
      ]
    },
    {
      "id": "up_03",
      "cells": [
        { "text": { "en": "Upgrade", "ru": "Повышение" } },
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        {
          "text": {
            "en": "Assess all patients for the risk of contrast-induced nephropathy.",
            "ru": "Оценка риска контраст-индуцированной нефропатии у всех пациентов."
          }
        }
      ]
    },
    {
      "id": "up_04",
      "cells": [
        { "text": { "en": "Upgrade", "ru": "Повышение" } },
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        {
          "text": {
            "en": "OCT for stent optimization.",
            "ru": "Оптическая когерентная томография (ОКТ) для оптимизации стентирования."
          }
        }
      ]
    },
    {
      "id": "down_01",
      "cells": [
        { "text": { "en": "Downgrade", "ru": "Понижение" } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        {
          "text": {
            "en": "Distal protection devices for PCI of SVG lesions.",
            "ru": "Устройства дистальной защиты при ЧКВ на венозных шунтах (SVG)."
          }
        }
      ]
    },
    {
      "id": "down_02",
      "cells": [
        { "text": { "en": "Downgrade", "ru": "Понижение" } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        {
          "text": {
            "en": "Bivalirudin for PCI in NSTE-ACS.",
            "ru": "Бивалирудин при ЧКВ у пациентов с ОКСбпST."
          }
        }
      ]
    },
    {
      "id": "down_03",
      "cells": [
        { "text": { "en": "Downgrade", "ru": "Понижение" } },
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        {
          "text": {
            "en": "Bivalirudin for PCI in STEMI.",
            "ru": "Бивалирудин при ЧКВ у пациентов с ИМпST."
          }
        }
      ]
    },
    {
      "id": "down_04",
      "cells": [
        { "text": { "en": "Downgrade", "ru": "Понижение" } },
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        {
          "text": {
            "en": "PCI for MVD with diabetes and SYNTAX score <23.",
            "ru": "ЧКВ при многососудистом поражении у пациентов с сахарным диабетом и шкалой SYNTAX <23."
          }
        }
      ]
    },
    {
      "id": "down_05",
      "cells": [
        { "text": { "en": "Downgrade", "ru": "Понижение" } },
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        {
          "text": {
            "en": "Platelet function testing to guide antiplatelet therapy interruption in patients undergoing cardiac surgery.",
            "ru": "Тестирование функции тромбоцитов для определения сроков отмены антитромбоцитарной терапии перед кардиохирургическим вмешательством."
          }
        }
      ]
    },
    {
      "id": "down_06",
      "cells": [
        { "text": { "en": "Downgrade", "ru": "Понижение" } },
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        {
          "text": {
            "en": "EuroSCORE II to assess in-hospital mortality after CABG.",
            "ru": "Шкала EuroSCORE II для оценки госпитальной летальности после КШ."
          }
        }
      ]
    }
  ]
};

// 3. rt01-noninvasive-imaging-hf.json
const rt01 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt01-noninvasive-imaging-hf",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 1",
  "title": {
    "en": "Recommendations for non-invasive imaging in patients with coronary artery disease and heart failure with reduced ejection fraction",
    "ru": "Рекомендации по неинвазивной визуализации у пациентов с ишемической болезнью сердца и сердечной недостаточностью со сниженной фракцией выброса"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Non-invasive imaging in CAD and HFrEF",
        "ru": "Неинвазивная визуализация при ИБС и СНнФВ"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "Non-invasive stress imaging (CMR, stress echocardiography, SPECT, or PET) may be considered for the assessment of myocardial ischaemia and viability in patients with HF and CAD (considered suitable for coronary revascularization) before the decision on revascularization.",
            "ru": "Неинвазивная стресс-визуализация (МРТ сердца, стресс-эхокардиография, ОФЭКТ или ПЭТ) может быть рассмотрена для оценки ишемии и жизнеспособности миокарда у пациентов с СН и ИБС (считающихся подходящими для реваскуляризации) до принятия решения о реваскуляризации."
          },
          "class": "IIb",
          "level": "B"
        }
      ]
    }
  ]
};

// 4. rt02-functional-testing-intravascular-imaging.json
const rt02 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt02-functional-testing-intravascular-imaging",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 2",
  "title": {
    "en": "Recommendations on functional testing and intravascular imaging for lesion assessment",
    "ru": "Рекомендации по функциональному тестированию и внутрисосудистой визуализации для оценки поражений"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Functional testing and intravascular imaging",
        "ru": "Функциональное тестирование и внутрисосудистая визуализация"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "When evidence of ischaemia is not available, FFR or iwFR are recommended to assess the haemodynamic relevance of intermediate-grade stenosis.",
            "ru": "При отсутствии доказательств ишемии рекомендуется проведение FFR или iwFR для оценки гемодинамической значимости промежуточных стенозов."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r02",
          "text": {
            "en": "FFR-guided PCI should be considered in patients with multivessel disease undergoing PCI.",
            "ru": "ЧКВ под контролем FFR следует рассмотреть у пациентов с многососудистым поражением, подвергающихся ЧКВ."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r03",
          "text": {
            "en": "IVUS should be considered to assess the severity of unprotected left main lesions.",
            "ru": "Внутрисосудистый ультразвук (ВСУЗИ) следует рассмотреть для оценки тяжести поражения незащищенного ствола левой коронарной артерии."
          },
          "class": "IIa",
          "level": "B"
        }
      ]
    }
  ]
};

// 5. t03-multidisciplinary-decision-pathways.json (Table 3 grid)
const t03 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.t03-multidisciplinary-decision-pathways",
  "guidelineId": "esc-revasc-2018",
  "number": "Table 3",
  "title": {
    "en": "Multidisciplinary decision pathways, patient informed consent, and timing of revascularization",
    "ru": "Мультидисциплинарные алгоритмы принятия решений, информированное согласие пациента и сроки реваскуляризации"
  },
  "type": "grid",
  "columns": [
    {
      "id": "feature",
      "title": { "en": "Feature", "ru": "Параметр" }
    },
    {
      "id": "acs_shock",
      "title": { "en": "ACS: Shock", "ru": "ОКС: Шок" }
    },
    {
      "id": "acs_stemi",
      "title": { "en": "ACS: STEMI", "ru": "ОКС: ИМпST" }
    },
    {
      "id": "acs_nsteacs",
      "title": { "en": "ACS: NSTE-ACS", "ru": "ОКС: ОКСбпST" }
    },
    {
      "id": "scad_no_adhoc",
      "title": {
        "en": "SCAD without ad hoc PCI indication according to Heart Team protocol",
        "ru": "Стабильная ИБС без показаний к ad hoc ЧКВ по протоколу Heart Team"
      }
    },
    {
      "id": "scad_adhoc",
      "title": {
        "en": "SCAD with ad hoc PCI indication according to Heart Team protocol",
        "ru": "Стабильная ИБС с показаниями к ad hoc ЧКВ по протоколу Heart Team"
      }
    }
  ],
  "rows": [
    {
      "id": "decision_making",
      "cells": [
        {
          "text": {
            "en": "Multidisciplinary decision-making",
            "ru": "Мультидисциплинарное принятие решений (Heart Team)"
          }
        },
        {
          "text": {
            "en": "Not mandatory during the acute phase; mechanical circulatory support according to Heart Team protocol",
            "ru": "Не обязательно в острой фазе; механическая поддержка кровообращения по протоколу Heart Team"
          }
        },
        {
          "text": {
            "en": "Not mandatory during the acute phase",
            "ru": "Не обязательно в острой фазе"
          }
        },
        {
          "text": {
            "en": "Not mandatory during the acute phase; after stabilization, recommended as in SCAD",
            "ru": "Не обязательно в острой фазе; после стабилизации рекомендуется как при стабильной ИБС"
          }
        },
        {
          "text": {
            "en": "Required",
            "ru": "Обязательно"
          }
        },
        {
          "text": {
            "en": "Not required",
            "ru": "Не требуется"
          }
        }
      ]
    },
    {
      "id": "informed_consent",
      "cells": [
        {
          "text": {
            "en": "Informed consent",
            "ru": "Информированное согласие"
          }
        },
        {
          "text": {
            "en": "Witnessed verbal informed consent or family consent if possible without delay",
            "ru": "Устное информированное согласие в присутствии свидетелей или согласие родственников, если возможно без задержки"
          }
        },
        {
          "text": {
            "en": "Witnessed verbal informed consent may be sufficient unless written consent is legally required",
            "ru": "Устного информированного согласия в присутствии свидетелей может быть достаточно, если письменное согласие не требуется по закону"
          }
        },
        {
          "text": {
            "en": "Written informed consent (this may not apply to countries that are not legally required to ask for written informed consent; ESC/EACTS advocate documentation for all procedures); in emergency cases witnessed verbal informed consent may be sufficient",
            "ru": "Письменное информированное согласие (может не применяться в странах, где это не требуется законом; ESC/EACTS рекомендуют документирование согласия для всех процедур); в экстренных случаях может быть достаточно устного согласия в присутствии свидетелей"
          }
        },
        {
          "text": {
            "en": "Written informed consent (this may not apply to countries that are not legally required to ask for written informed consent; ESC/EACTS advocate documentation for all procedures)",
            "ru": "Письменное информированное согласие (может не применяться в странах, где это не требуется законом; ESC/EACTS рекомендуют документирование согласия для всех процедур)"
          }
        },
        {
          "text": {
            "en": "Written informed consent (this may not apply to countries that are not legally required to ask for written informed consent; ESC/EACTS advocate documentation for all procedures)",
            "ru": "Письменное информированное согласие (может не применяться в странах, где это не требуется законом; ESC/EACTS рекомендуют документирование согласия для всех процедур)"
          }
        }
      ]
    },
    {
      "id": "time_to_revasc",
      "cells": [
        {
          "text": {
            "en": "Time to revascularization",
            "ru": "Сроки реваскуляризации"
          }
        },
        {
          "text": {
            "en": "Emergency: no delay",
            "ru": "Экстренно: без задержки"
          }
        },
        {
          "text": {
            "en": "Emergency: no delay",
            "ru": "Экстренно: без задержки"
          }
        },
        {
          "text": {
            "en": "Urgency: within 2 h to within 72 h depending on the risk criteria",
            "ru": "Срочно: от <2 часов до <72 часов в зависимости от критериев риска"
          }
        },
        {
          "text": {
            "en": "Within 2 weeks for high-risk patients (severe symptoms [CCS class 3], anatomy [left main disease or equivalent, three-vessel disease or proximal LAD], or depressed ventricular function) and within 6 weeks for all other patients",
            "ru": "В течение 2 недель для пациентов высокого риска (тяжелые симптомы [III класс по CCS], анатомия [поражение ствола ЛКА или эквивалент, трехсосудистое поражение или проксимальный стеноз ПМЖВ] либо сниженная функция желудочка) и в течение 6 недель для всех остальных пациентов"
          }
        },
        {
          "text": {
            "en": "Ad hoc",
            "ru": "Одномоментно (ad hoc)"
          }
        }
      ]
    },
    {
      "id": "procedure",
      "cells": [
        {
          "text": {
            "en": "Procedure",
            "ru": "Процедура"
          }
        },
        {
          "text": {
            "en": "Proceed with intervention based on best evidence/availability. Ad hoc treatment of culprit lesion, staged treatment of non-culprit lesions according to institutional protocol or Heart Team decision.",
            "ru": "Выполнение вмешательства на основе доказательной базы/доступности. Одномоментное (ad hoc) лечение инфаркт-связанного поражения, этапное лечение не связанных с инфарктом поражений по протоколу клиники или решению Heart Team."
          }
        },
        {
          "text": {
            "en": "Proceed with intervention based on best evidence/availability. Non-culprit lesions treated according to institutional protocol or Heart Team decision.",
            "ru": "Выполнение вмешательства на основе доказательной базы/доступности. Лечение не связанных с инфарктом поражений согласно протоколу клиники или решению Heart Team."
          }
        },
        {
          "text": {
            "en": "Proceed with intervention based on best evidence/availability. Non-culprit lesions treated according to institutional protocol or Heart Team decision.",
            "ru": "Выполнение вмешательства на основе доказательной базы/доступности. Лечение не связанных с инфарктом поражений согласно протоколу клиники или решению Heart Team."
          }
        },
        {
          "text": {
            "en": "Allow for enough time from diagnostic catheterization to decide on the appropriate intervention.",
            "ru": "Предоставление достаточного времени от диагностической катетеризации для принятия взвешенного решения о выборе вмешательства."
          }
        },
        {
          "text": {
            "en": "Proceed with intervention according to institutional protocol defined by Heart Team.",
            "ru": "Выполнение вмешательства в соответствии с протоколом клиники, разработанным Heart Team."
          }
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(baseDir, 't01-new-recommendations.json'), JSON.stringify(t01, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 't02-revised-recommendations.json'), JSON.stringify(t02, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt01-noninvasive-imaging-hf.json'), JSON.stringify(rt01, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt02-functional-testing-intravascular-imaging.json'), JSON.stringify(rt02, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 't03-multidisciplinary-decision-pathways.json'), JSON.stringify(t03, null, 2), 'utf8');

console.log('Successfully re-generated all 5 tables for esc-revasc-2018 with valid schema');
