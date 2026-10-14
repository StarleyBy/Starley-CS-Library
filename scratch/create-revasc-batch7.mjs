import fs from 'fs';
import path from 'path';

const baseDir = 'd:/IT sandbox/Starley-CS-Library/data/guidelines/esc-revasc-2018';

// 1. t09-doses-antiplatelet-anticoagulant.json
// Table 7 Doses of antiplatelet and anticoagulant drugs used during and after myocardial revascularization
const t09 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.t09-doses-antiplatelet-anticoagulant",
  "guidelineId": "esc-revasc-2018",
  "number": "Table 7",
  "title": {
    "en": "Doses of antiplatelet and anticoagulant drugs used during and after myocardial revascularization",
    "ru": "Дозы антитромбоцитарных и антикоагулянтных препаратов, применяемых во время и после реваскуляризации миокарда"
  },
  "type": "grid",
  "columns": [
    { "id": "drug", "title": { "en": "Drug", "ru": "Препарат" } },
    { "id": "dosage", "title": { "en": "Dosage regimen", "ru": "Режим дозирования" } }
  ],
  "rows": [
    {
      "id": "sec_antiplatelet",
      "kind": "section",
      "cells": [
        { "text": { "en": "Antiplatelet drugs", "ru": "Антитромбоцитарные препараты" }, "colspan": 2 }
      ]
    },
    {
      "id": "aspirin",
      "cells": [
        { "text": { "en": "Aspirin", "ru": "Ацетилсалициловая кислота (АСК)" } },
        {
          "text": {
            "en": "Loading dose of 150–300 mg orally or 75–150 mg i.v. if oral ingestion is not possible, followed by a maintenance dose of 75–100 mg/day.",
            "ru": "Нагрузочная доза 150–300 мг внутрь или 75–150 мг в/в при невозможности приема внутрь, затем поддерживающая доза 75–100 мг/сут."
          }
        }
      ]
    },
    {
      "id": "clopidogrel",
      "cells": [
        { "text": { "en": "Clopidogrel", "ru": "Клопидогрел" } },
        {
          "text": {
            "en": "Loading dose of 600 mg orally, followed by a maintenance dose of 75 mg/day.",
            "ru": "Нагрузочная доза 600 мг внутрь, затем поддерживающая доза 75 мг/сут."
          }
        }
      ]
    },
    {
      "id": "prasugrel",
      "cells": [
        { "text": { "en": "Prasugrel", "ru": "Прасугрел" } },
        {
          "text": {
            "en": "Loading dose of 60 mg orally, followed by a maintenance dose of 10 mg/day. In patients with body weight <60 kg, a maintenance dose of 5 mg is recommended. In patients aged >75 years, prasugrel is generally not recommended, but a dose of 5 mg should be used if treatment is deemed necessary.",
            "ru": "Нагрузочная доза 60 мг внутрь, затем поддерживающая доза 10 мг/сут. У пациентов с массой тела <60 кг рекомендуется поддерживающая доза 5 мг. У пациентов в возрасте >75 лет прасугрел обычно не рекомендуется, но при абсолютной необходимости терапии следует использовать дозу 5 мг."
          }
        }
      ]
    },
    {
      "id": "ticagrelor",
      "cells": [
        { "text": { "en": "Ticagrelor", "ru": "Тикагрелор" } },
        {
          "text": {
            "en": "Loading dose of 180 mg orally, followed by a maintenance dose of 90 mg b.i.d.",
            "ru": "Нагрузочная доза 180 мг внутрь, затем поддерживающая доза 90 мг два раза в сутки."
          }
        }
      ]
    },
    {
      "id": "abciximab",
      "cells": [
        { "text": { "en": "Abciximab", "ru": "Абциксимаб" } },
        {
          "text": {
            "en": "Bolus of 0.25 mg/kg i.v. and 0.125 µg/kg/min infusion (maximum 10 µg/min) for 12 h.",
            "ru": "Болюс 0,25 мг/кг в/в и инфузия 0,125 мкг/кг/мин (максимум 10 мкг/мин) в течение 12 ч."
          }
        }
      ]
    },
    {
      "id": "eptifibatide",
      "cells": [
        { "text": { "en": "Eptifibatide", "ru": "Эптифибатид" } },
        {
          "text": {
            "en": "Double bolus of 180 µg/kg i.v. (given at a 10 min interval) followed by an infusion of 2.0 µg/kg/min for up to 18 h.",
            "ru": "Двойной болюс по 180 мкг/кг в/в (с интервалом 10 мин), затем инфузия 2,0 мкг/кг/мин продолжительностью до 18 ч."
          }
        }
      ]
    },
    {
      "id": "tirofiban",
      "cells": [
        { "text": { "en": "Tirofiban", "ru": "Тирофибан" } },
        {
          "text": {
            "en": "Bolus of 25 µg/kg over 3 min i.v., followed by an infusion of 0.15 µg/kg/min for up to 18 h.",
            "ru": "Болюс 25 мкг/кг в/в за 3 мин, затем инфузия 0,15 мкг/кг/мин продолжительностью до 18 ч."
          }
        }
      ]
    },
    {
      "id": "cangrelor",
      "cells": [
        { "text": { "en": "Cangrelor", "ru": "Кангрелор" } },
        {
          "text": {
            "en": "Bolus of 30 µg/kg i.v. followed by 4 µg/kg/min infusion for at least 2 h or duration of procedure, whichever is longer.",
            "ru": "Болюс 30 мкг/кг в/в, затем инфузия 4 мкг/кг/мин не менее 2 ч или на протяжении всей процедуры (выбирается большая длительность)."
          }
        }
      ]
    },
    {
      "id": "sec_anticoag_pci",
      "kind": "section",
      "cells": [
        { "text": { "en": "Anticoagulant drugs for PCI", "ru": "Антикоагулянтные препараты для ЧКВ" }, "colspan": 2 }
      ]
    },
    {
      "id": "ufh",
      "cells": [
        { "text": { "en": "Unfractionated heparin", "ru": "Нефракционированный гепарин (НФГ)" } },
        {
          "text": {
            "en": "• 70–100 U/kg i.v. bolus when no GP IIb/IIIa inhibitor is planned.\n• 50–70 U/kg i.v. bolus with GP IIb/IIIa inhibitors.",
            "ru": "• 70–100 ЕД/кг в/в болюс, если ингибиторы GP IIb/IIIa не планируются.\n• 50–70 ЕД/кг в/в болюс при использовании ингибиторов GP IIb/IIIa."
          }
        }
      ]
    },
    {
      "id": "enoxaparin",
      "cells": [
        { "text": { "en": "Enoxaparin", "ru": "Эноксапарин" } },
        {
          "text": {
            "en": "0.5 mg/kg i.v. bolus.",
            "ru": "0,5 мг/кг в/в болюс."
          }
        }
      ]
    },
    {
      "id": "bivalirudin",
      "cells": [
        { "text": { "en": "Bivalirudin", "ru": "Бивалирудин" } },
        {
          "text": {
            "en": "0.75 mg/kg i.v. bolus followed by i.v. infusion of 1.75 mg/kg/h for up to 4 h after the procedure as clinically warranted.",
            "ru": "0,75 мг/кг в/в болюс, затем в/в инфузия 1,75 мг/кг/ч продолжительностью до 4 ч после процедуры по клиническим показаниям."
          }
        }
      ]
    },
    {
      "id": "sec_oac_post_pci",
      "kind": "section",
      "cells": [
        { "text": { "en": "Oral anticoagulant drugs (concomitant treatment after PCI)", "ru": "Пероральные антикоагулянты (сопутствующая терапия после ЧКВ)" }, "colspan": 2 }
      ]
    },
    {
      "id": "vka",
      "cells": [
        { "text": { "en": "Vitamin K antagonists (e.g. warfarin, phenprocoumon)", "ru": "Антагонисты витамина К (например, варфарин)" } },
        {
          "text": {
            "en": "Dosing is based on INR value and the respective clinical indication.",
            "ru": "Дозирование подбирается на основании целевого значения МНО и клинических показаний."
          }
        }
      ]
    },
    {
      "id": "apixaban",
      "cells": [
        { "text": { "en": "Apixaban", "ru": "Апиксабан" } },
        {
          "text": {
            "en": "Maintenance doses of 5 and 2.5 mg (specific criteria for reduced dose apply) b.i.d.",
            "ru": "Поддерживающая доза 5 мг и 2,5 мг (при наличии специальных критериев снижения дозы) 2 раза в сутки."
          }
        }
      ]
    },
    {
      "id": "dabigatran",
      "cells": [
        { "text": { "en": "Dabigatran", "ru": "Дабигатран" } },
        {
          "text": {
            "en": "Maintenance doses of 150 and 110 mg b.i.d.",
            "ru": "Поддерживающая доза 150 мг и 110 мг 2 раза в сутки."
          }
        }
      ]
    },
    {
      "id": "edoxaban",
      "cells": [
        { "text": { "en": "Edoxaban", "ru": "Эдоксабан" } },
        {
          "text": {
            "en": "Maintenance doses of 60 and 30 mg (specific criteria for reduced dose apply)/day.",
            "ru": "Поддерживающая доза 60 мг и 30 мг (при наличии критериев снижения дозы) 1 раз в сутки."
          }
        }
      ]
    },
    {
      "id": "rivaroxaban",
      "cells": [
        { "text": { "en": "Rivaroxaban", "ru": "Ривароксабан" } },
        {
          "text": {
            "en": "Maintenance doses of 20 and 15 mg (specific criteria for reduced dose apply)/day, and 2.5 mg b.i.d. (vascular dose).",
            "ru": "Поддерживающая доза 20 мг и 15 мг (при наличии критериев снижения дозы) 1 раз в сутки, а также 2,5 мг 2 раза в сутки (сосудистая доза)."
          }
        }
      ]
    }
  ]
};

// 2. rt24-antithrombotic-scad-pci.json
// Recommendations for antithrombotic treatment in stable coronary artery disease patients undergoing percutaneous coronary intervention
const rt24 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt24-antithrombotic-scad-pci",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 24",
  "title": {
    "en": "Recommendations for antithrombotic treatment in stable coronary artery disease patients undergoing percutaneous coronary intervention",
    "ru": "Рекомендации по антитромботической терапии у пациентов со стабильной ИБС, подвергающихся чрескожному коронарному вмешательству"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-pretreatment",
      "title": {
        "en": "Pre-treatment and antiplatelet therapy",
        "ru": "Предварительное лечение и антитромбоцитарная терапия"
      },
      "rows": [
        {
          "id": "r_pre_01",
          "text": {
            "en": "Treatment with 600 mg clopidogrel is recommended in elective PCI patients once the coronary anatomy is known and a decision is made to proceed with PCI.",
            "ru": "Терапия клопидогрелом в дозе 600 мг рекомендуется плановым пациентам на ЧКВ после установления коронарной анатомии и принятия решения о проведении ЧКВ."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_pre_02",
          "text": {
            "en": "Pre-treatment with clopidogrel may be considered if the probability of PCI is high.",
            "ru": "Предварительное насыщение клопидогрелом может быть рассмотрено при высокой вероятности выполнения ЧКВ."
          },
          "class": "IIb",
          "level": "C"
        },
        {
          "id": "r_pre_03",
          "text": {
            "en": "In patients on a maintenance dose of 75 mg clopidogrel, a new loading dose of 600 mg may be considered once the indication for PCI is confirmed.",
            "ru": "У пациентов, принимающих поддерживающую дозу клопидогрела 75 мг, может быть рассмотрена повторная нагрузочная доза 600 мг после подтверждения показаний к ЧКВ."
          },
          "class": "IIb",
          "level": "C"
        }
      ]
    },
    {
      "id": "sec-peri-interventional",
      "title": {
        "en": "Peri-interventional treatment",
        "ru": "Перипроцедурная терапия"
      },
      "rows": [
        {
          "id": "r_peri_01",
          "text": {
            "en": "Aspirin is indicated before elective stenting.",
            "ru": "Ацетилсалициловая кислота показана перед плановым стентированием."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_peri_02",
          "text": {
            "en": "An oral loading dose of aspirin (150–300 mg p.o. or 75–250 mg i.v.) is recommended if the patient is not pre-treated.",
            "ru": "Нагрузочная доза АСК (150–300 мг внутрь или 75–250 мг в/в) рекомендуется, если пациент ранее не получал препарат."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_peri_03",
          "text": {
            "en": "Clopidogrel (600 mg loading dose, 75 mg daily maintenance dose) is recommended for elective stenting.",
            "ru": "Клопидогрел (нагрузочная доза 600 мг, поддерживающая доза 75 мг/сут) рекомендуется при плановом стентировании."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_peri_04",
          "text": {
            "en": "Glycoprotein IIb/IIIa antagonists should be considered only for bail-out.",
            "ru": "Антагонисты гликопротеина IIb/IIIa следует рассматривать только в качестве экстренной терапии спасения (bail-out)."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_peri_05",
          "text": {
            "en": "Prasugrel or ticagrelor may be considered in specific high-risk situations of elective stenting (e.g. history of stent thrombosis or left main stenting).",
            "ru": "Прасугрел или тикагрелор могут быть рассмотрены в специфических ситуациях высокого риска при плановом стентировании (например, тромбоз стента в анамнезе или стентирование ствола ЛКА)."
          },
          "class": "IIb",
          "level": "C"
        },
        {
          "id": "r_peri_06",
          "text": {
            "en": "Unfractionated heparin is indicated as the standard anticoagulant (70–100 U/kg).",
            "ru": "Нефракционированный гепарин показан в качестве стандартного антикоагулянта (70–100 ЕД/кг)."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_peri_07",
          "text": {
            "en": "Bivalirudin (0.75 mg/kg bolus, followed by 1.75 mg/kg/h for up to 4 h after the procedure) is indicated in the case of heparin-induced thrombocytopenia.",
            "ru": "Бивалирудин (болюс 0,75 мг/кг с последующей инфузией 1,75 мг/кг/ч до 4 ч после процедуры) показан в случае гепарин-индуцированной тромбоцитопении (ГИТ)."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_peri_08",
          "text": {
            "en": "Enoxaparin (i.v. 0.5 mg/kg) should be considered as an alternative agent.",
            "ru": "Эноксапарин (в/в 0,5 мг/кг) следует рассмотреть в качестве альтернативного антикоагулянта."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r_peri_09",
          "text": {
            "en": "Cangrelor may be considered in P2Y12-inhibitor naïve patients undergoing PCI.",
            "ru": "Кангрелор может быть рассмотрен у пациентов, ранее не получавших ингибиторы P2Y12, подвергающихся ЧКВ."
          },
          "class": "IIb",
          "level": "A"
        }
      ]
    },
    {
      "id": "sec-post-interventional",
      "title": {
        "en": "Post-interventional and maintenance treatment",
        "ru": "Послепроцедурная и поддерживающая терапия"
      },
      "rows": [
        {
          "id": "r_post_01",
          "text": {
            "en": "Life-long single antiplatelet therapy, usually aspirin, is recommended.",
            "ru": "Пожизненная одинарная антитромбоцитарная терапия (обычно АСК) рекомендуется."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_post_02",
          "text": {
            "en": "Instruction of patients about the importance of complying with antiplatelet therapy is recommended.",
            "ru": "Рекомендуется информирование пациентов о критической важности соблюдения режима антитромбоцитарной терапии."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_post_03",
          "text": {
            "en": "In patients with SCAD treated with coronary stent implantation, DAPT consisting of clopidogrel in addition to aspirin is generally recommended for 6 months, irrespective of the stent type.",
            "ru": "У пациентов со стабильной ИБС после имплантации коронарного стента ДАТТ клопидогрелом в дополнение к АСК обычно рекомендуется на 6 месяцев независимо от типа стента."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_post_04",
          "text": {
            "en": "In patients with SCAD treated with BRS, DAPT should be considered for at least 12 months and up to the presumed full absorption of the BRS, based on an individual assessment of bleeding and ischaemic risk.",
            "ru": "У пациентов со стабильной ИБС, леченных с помощью BRS, ДАТТ следует рассмотреть не менее чем на 12 месяцев и вплоть до предполагаемой полной резорбции каркаса с учетом индивидуального баланса риска кровотечений и ишемии."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_post_05",
          "text": {
            "en": "In patients with SCAD treated with DCB, DAPT should be considered for 6 months.",
            "ru": "У пациентов со стабильной ИБС после применения баллонов с лекарственным покрытием (DCB) ДАТТ следует рассмотреть в течение 6 месяцев."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r_post_06",
          "text": {
            "en": "In patients with SCAD considered at high bleeding risk (e.g. PRECISE-DAPT ≥25), DAPT should be considered for 3 months.",
            "ru": "У пациентов со стабильной ИБС с высоким риском кровотечений (например, PRECISE-DAPT ≥25) длительность ДАТТ следует сократить до 3 месяцев."
          },
          "class": "IIa",
          "level": "A"
        },
        {
          "id": "r_post_07",
          "text": {
            "en": "In patients with SCAD who have tolerated DAPT without a bleeding complication and who are at low bleeding risk but high thrombotic risk, continuation of DAPT with clopidogrel for >6 months and up to 30 months may be considered.",
            "ru": "У пациентов со стабильной ИБС, хорошо перенесших ДАТТ без кровотечений, с низким геморрагическим, но высоким тромботическим риском, может быть рассмотрено продолжение ДАТТ клопидогрелом на срок >6 месяцев и до 30 месяцев."
          },
          "class": "IIb",
          "level": "A"
        },
        {
          "id": "r_post_08",
          "text": {
            "en": "In patients with SCAD in whom 3 month DAPT poses safety concerns, DAPT may be considered for 1 month.",
            "ru": "У пациентов со стабильной ИБС, у которых 3-месячная ДАТТ вызывает серьезные опасения по безопасности, может быть рассмотрен 1 месяц ДАТТ."
          },
          "class": "IIb",
          "level": "C"
        }
      ]
    }
  ]
};

// 3. rt25-antithrombotic-nste-acs-pci.json
// Recommendations for antithrombotic treatment in patients with non-ST-elevation acute coronary syndromes undergoing percutaneous coronary intervention
const rt25 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt25-antithrombotic-nste-acs-pci",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 25",
  "title": {
    "en": "Recommendations for antithrombotic treatment in patients with non-ST-elevation acute coronary syndromes undergoing percutaneous coronary intervention",
    "ru": "Рекомендации по антитромботической терапии у пациентов с острым коронарным синдромом без подъема сегмента ST, подвергающихся чрескожному коронарному вмешательству"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-pretreatment",
      "title": {
        "en": "Pre-treatment and antiplatelet therapy",
        "ru": "Предварительное лечение и антитромбоцитарная терапия"
      },
      "rows": [
        {
          "id": "r_pre_01",
          "text": {
            "en": "Aspirin is recommended for all patients without contraindications at an initial oral loading dose of 150–300 mg (or 75–250 mg i.v.), and at a maintenance dose of 75–100 mg daily long-term.",
            "ru": "Ацетилсалициловая кислота рекомендуется всем пациентам при отсутствии противопоказаний в начальной нагрузочной дозе 150–300 мг внутрь (или 75–250 мг в/в) и поддерживающей дозе 75–100 мг/сут длительно/пожизненно."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_pre_02",
          "text": {
            "en": "A P2Y12 inhibitor is recommended in addition to aspirin, maintained over 12 months unless there are contraindications such as an excessive risk of bleeding: prasugrel (60 mg loading dose, 10 mg daily dose) in P2Y12-inhibitor naïve patients who proceed to PCI.",
            "ru": "Ингибитор P2Y12 рекомендуется в дополнение к АСК на 12 месяцев при отсутствии противопоказаний (чрезмерный риск кровотечений): прасугрел (нагрузочная доза 60 мг, затем 10 мг/сут) у ранее не получавших P2Y12-ингибиторы пациентов при выполнении ЧКВ."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_pre_03",
          "text": {
            "en": "A P2Y12 inhibitor is recommended in addition to aspirin, maintained over 12 months unless there are contraindications such as an excessive risk of bleeding: ticagrelor (180 mg loading dose, 90 mg b.i.d.) irrespective of the preceding P2Y12 inhibitor regimen.",
            "ru": "Ингибитор P2Y12 рекомендуется в дополнение к АСК на 12 месяцев: тикагрелор (нагрузочная доза 180 мг, затем 90 мг 2 раза в сутки) независимо от предшествующей терапии ингибиторами P2Y12."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_pre_04",
          "text": {
            "en": "A P2Y12 inhibitor is recommended in addition to aspirin, maintained over 12 months unless there are contraindications such as an excessive risk of bleeding: clopidogrel (600 mg loading dose, 75 mg daily dose) only when prasugrel or ticagrelor are not available or are contraindicated.",
            "ru": "Ингибитор P2Y12 рекомендуется в дополнение к АСК на 12 месяцев: клопидогрел (нагрузочная доза 600 мг, затем 75 мг/сут) только в случаях, когда прасугрел или тикагрелор недоступны либо противопоказаны."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_pre_05",
          "text": {
            "en": "GP IIb/IIIa antagonists should be considered for bail-out if there is evidence of no-reflow or a thrombotic complication.",
            "ru": "Антагонисты GP IIb/IIIa следует рассматривать в качестве экстренной терапии спасения (bail-out) при развитии феномена no-reflow или тромботических осложнений."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_pre_06",
          "text": {
            "en": "For pre-treatment in patients with NSTE-ACS undergoing invasive management, ticagrelor administration (180 mg loading dose, 90 mg b.i.d.), or clopidogrel (600 mg loading dose, 75 mg daily dose) if ticagrelor is not an option, should be considered as soon as the diagnosis is established.",
            "ru": "Для предварительного насыщения у пациентов с ОКСбпST, направляемых на инвазивную стратегию, назначение тикагрелора (180 мг нагрузка, затем 90 мг 2 раза/сут) или клопидогрела (600 мг нагрузка, затем 75 мг/сут, если тикагрелор не применим) следует рассмотреть сразу после установления диагноза."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_pre_07",
          "text": {
            "en": "Cangrelor may be considered in P2Y12-inhibitor naïve patients undergoing PCI.",
            "ru": "Кангрелор может быть рассмотрен у пациентов, ранее не получавших ингибиторы P2Y12, подвергающихся ЧКВ."
          },
          "class": "IIb",
          "level": "A"
        },
        {
          "id": "r_pre_08",
          "text": {
            "en": "GP IIb/IIIa antagonists may be considered in P2Y12-inhibitor naïve patients undergoing PCI.",
            "ru": "Антагонисты GP IIb/IIIa могут быть рассмотрены у пациентов, ранее не получавших ингибиторы P2Y12, подвергающихся ЧКВ."
          },
          "class": "IIb",
          "level": "C"
        },
        {
          "id": "r_pre_09",
          "text": {
            "en": "Pre-treatment with GP IIb/IIIa antagonists in patients in whom coronary anatomy is not known is not recommended.",
            "ru": "Предварительное назначение антагонистов GP IIb/IIIa пациентам с неизвестной коронарной анатомией не рекомендуется."
          },
          "class": "III",
          "level": "A"
        },
        {
          "id": "r_pre_10",
          "text": {
            "en": "Administration of prasugrel in patients in whom coronary anatomy is not known is not recommended.",
            "ru": "Назначение прасугрела пациентам до визуализации коронарной анатомии не рекомендуется."
          },
          "class": "III",
          "level": "B"
        }
      ]
    },
    {
      "id": "sec-peri-interventional",
      "title": {
        "en": "Peri-interventional therapy",
        "ru": "Перипроцедурная терапия"
      },
      "rows": [
        {
          "id": "r_peri_01",
          "text": {
            "en": "Anticoagulation is recommended for all patients in addition to antiplatelet therapy.",
            "ru": "Антикоагулянтная терапия рекомендуется всем пациентам в дополнение к антитромбоцитарной терапии."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_peri_02",
          "text": {
            "en": "It is recommended that anticoagulation is selected according to both ischaemic and bleeding risks, and according to the efficacy–safety profile of the chosen agent.",
            "ru": "Рекомендуется выбирать антикоагулянт с учетом как ишемического, так и геморрагического риска, а также профиля эффективности и безопасности препарата."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_peri_03",
          "text": {
            "en": "UFH is recommended.",
            "ru": "Нефракционированный гепарин (НФГ) рекомендуется."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_peri_04",
          "text": {
            "en": "In patients on fondaparinux, a single bolus UFH (85 IU/kg, or 60 IU in the case of concomitant use of GP IIb/IIIa receptor inhibitors) is indicated.",
            "ru": "У пациентов, получающих фондапаринукс, показан дополнительный однократный в/в болюс НФГ (85 МЕ/кг или 60 МЕ/кг при одновременном применении ингибиторов GP IIb/IIIa)."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_peri_05",
          "text": {
            "en": "Enoxaparin should be considered in patients pre-treated with subcutaneous enoxaparin.",
            "ru": "Эноксапарин следует рассмотреть у пациентов, ранее получавших подкожные инъекции эноксапарина."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r_peri_06",
          "text": {
            "en": "Discontinuation of parenteral anticoagulation should be considered immediately after an invasive procedure.",
            "ru": "Прекращение парентеральной антикоагуляции следует рассмотреть сразу после завершения инвазивной процедуры."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_peri_07",
          "text": {
            "en": "Bivalirudin (0.75 mg/kg bolus, followed by 1.75 mg/kg/h for up to 4 h after the procedure) may be considered as an alternative to UFH.",
            "ru": "Бивалирудин (болюс 0,75 мг/кг с последующей инфузией 1,75 мг/кг/ч до 4 ч после процедуры) может быть рассмотрен в качестве альтернативы НФГ."
          },
          "class": "IIb",
          "level": "A"
        },
        {
          "id": "r_peri_08",
          "text": {
            "en": "Crossover of UFH and LMWH is not recommended.",
            "ru": "Перекрестная замена (crossover) НФГ и НМГ не рекомендуется."
          },
          "class": "III",
          "level": "B"
        }
      ]
    }
  ]
};

// 4. rt26-post-interventional-maintenance-acs.json
// Recommendations for post-interventional and maintenance treatment in patients with non-ST-elevation acute coronary syndromes and ST-elevation myocardial infarction undergoing percutaneous coronary intervention
const rt26 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt26-post-interventional-maintenance-acs",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 26",
  "title": {
    "en": "Recommendations for post-interventional and maintenance treatment in patients with NSTE-ACS and STEMI undergoing percutaneous coronary intervention",
    "ru": "Рекомендации по послепроцедурной и поддерживающей терапии у пациентов с ОКСбпST и ИМпST, подвергающихся чрескожному коронарному вмешательству"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Post-interventional and maintenance antithrombotic treatment in ACS",
        "ru": "Поддерживающая антитромботическая терапия при ОКС"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "In patients with ACS treated with coronary stent implantation, DAPT with a P2Y12 inhibitor on top of aspirin is recommended for 12 months unless there are contraindications such as an excessive risk of bleeding (e.g. PRECISE-DAPT ≥25).",
            "ru": "У пациентов с ОКС после имплантации коронарного стента ДАТТ ингибитором P2Y12 в дополнение к АСК рекомендуется в течение 12 месяцев при отсутствии противопоказаний (чрезмерный риск кровотечений, например PRECISE-DAPT ≥25)."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r02",
          "text": {
            "en": "In patients with ACS and stent implantation who are at high risk of bleeding (e.g. PRECISE-DAPT ≥25), discontinuation of P2Y12 inhibitor therapy after 6 months should be considered.",
            "ru": "У пациентов с ОКС и стентированием с высоким риском кровотечений (например, PRECISE-DAPT ≥25) следует рассмотреть отмену ингибитора P2Y12 через 6 месяцев."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r03",
          "text": {
            "en": "In patients with ACS treated with BRS, DAPT should be considered for at least 12 months and up to the presumed full absorption of the BRS, based on an individual assessment of bleeding and ischaemic risk.",
            "ru": "У пациентов с ОКС, леченных с применением BRS, ДАТТ следует рассмотреть не менее чем на 12 месяцев и до предполагаемой полной резорбции каркаса с учетом индивидуального баланса риска кровотечений и ишемии."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r04",
          "text": {
            "en": "De-escalation of P2Y12 inhibitor treatment (e.g. with a switch from prasugrel or ticagrelor to clopidogrel) guided by platelet function testing may be considered as an alternative DAPT strategy, especially for ACS patients deemed unsuitable for 12-month potent platelet inhibition.",
            "ru": "Деэскалация терапии ингибиторами P2Y12 (например, переход с прасугрела или тикагрелора на клопидогрел) под контролем функциональных тестов тромбоцитов может рассматриваться как альтернативная стратегия ДАТТ, особенно для пациентов с ОКС, которым противопоказано мощное 12-месячное ингибирование тромбоцитов."
          },
          "class": "IIb",
          "level": "B"
        },
        {
          "id": "r05",
          "text": {
            "en": "In patients with ACS who have tolerated DAPT without a bleeding complication, continuation of DAPT for longer than 12 months may be considered.",
            "ru": "У пациентов с ОКС, перенесших ДАТТ без геморрагических осложнений, может быть рассмотрено продление ДАТТ на срок более 12 месяцев."
          },
          "class": "IIb",
          "level": "A"
        },
        {
          "id": "r06",
          "text": {
            "en": "In patients with MI and high ischaemic risk (defined as ≥50 years of age and having one of the following additional high-risk features: age ≥65 years, diabetes requiring medication, a second prior spontaneous MI, multivessel CAD, or chronic renal dysfunction with eCrCl <60 mL/min) who have tolerated DAPT without a bleeding complication, ticagrelor 60 mg b.i.d. for longer than 12 months on top of aspirin may be preferred over clopidogrel or prasugrel.",
            "ru": "У пациентов с ИМ и высоким ишемическим риском (возраст ≥50 лет плюс один из дополнительных факторов: возраст ≥65 лет, диабет на медикаментозной терапии, второй спонтанный ИМ в анамнезе, многососудистая ИБС или ХБП с клиренсом креатинина <60 мл/мин), хорошо перенесших ДАТТ без кровотечений, продление терапии тикагрелором в дозе 60 мг 2 раза/сут на срок >12 месяцев в дополнение к АСК может быть предпочтительнее клопидогрела или прасугрела."
          },
          "class": "IIb",
          "level": "B"
        },
        {
          "id": "r07",
          "text": {
            "en": "In ACS patients with no prior stroke/TIA, and at high ischaemic risk as well as low bleeding risk, receiving aspirin and clopidogrel, low-dose rivaroxaban (2.5 mg b.i.d. for approximately 1 year) may be considered after discontinuation of parenteral anticoagulation.",
            "ru": "У пациентов с ОКС без инсульта/ТИА в анамнезе, с высоким ишемическим и низким геморрагическим риском, получающих АСК и клопидогрел, низкие дозы ривароксабана (2,5 мг 2 раза в сутки на срок около 1 года) могут быть рассмотрены после прекращения парентеральной антикоагуляции."
          },
          "class": "IIb",
          "level": "B"
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(baseDir, 't09-doses-antiplatelet-anticoagulant.json'), JSON.stringify(t09, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt24-antithrombotic-scad-pci.json'), JSON.stringify(rt24, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt25-antithrombotic-nste-acs-pci.json'), JSON.stringify(rt25, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt26-post-interventional-maintenance-acs.json'), JSON.stringify(rt26, null, 2), 'utf8');

console.log('Successfully generated t09, rt24, rt25, and rt26 for esc-revasc-2018');
