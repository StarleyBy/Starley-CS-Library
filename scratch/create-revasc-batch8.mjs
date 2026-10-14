import fs from 'fs';
import path from 'path';

const baseDir = 'd:/IT sandbox/Starley-CS-Library/data/guidelines/esc-revasc-2018';

// 1. rt27-antithrombotic-stemi-pci.json
// Recommendations for antithrombotic treatment in ST-elevation myocardial infarction patients undergoing percutaneous coronary intervention
const rt27 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt27-antithrombotic-stemi-pci",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 27",
  "title": {
    "en": "Recommendations for antithrombotic treatment in ST-elevation myocardial infarction patients undergoing percutaneous coronary intervention",
    "ru": "Рекомендации по антитромботической терапии у пациентов с инфарктом миокарда с подъемом сегмента ST, подвергающихся чрескожному коронарному вмешательству"
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
            "en": "Aspirin is recommended for all patients without contraindications at an initial oral loading dose of 150–300 mg (or 75–250 mg i.v.), and at a maintenance dose of 75–100 mg daily long-term regardless of treatment strategy.",
            "ru": "Ацетилсалициловая кислота рекомендуется всем пациентам при отсутствии противопоказаний в начальной нагрузочной дозе 150–300 мг внутрь (или 75–250 мг в/в) и поддерживающей дозе 75–100 мг/сут длительно независимо от выбранной стратегии лечения."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_pre_02",
          "text": {
            "en": "A potent P2Y12 inhibitor (prasugrel or ticagrelor), or clopidogrel if these are not available or are contraindicated, is recommended before (or at latest at the time of) PCI and maintained over 12 months, unless there are contraindications such as excessive risk of bleeding.",
            "ru": "Мощный ингибитор P2Y12 (прасугрел или тикагрелор), либо клопидогрел (если они недоступны или противопоказаны), рекомендуется до (или как минимум во время) ЧКВ с продолжением терапии в течение 12 месяцев при отсутствии противопоказаний (чрезмерный риск кровотечений)."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_pre_03",
          "text": {
            "en": "GP IIb/IIIa inhibitors should be considered for bail-out if there is evidence of no-reflow or a thrombotic complication.",
            "ru": "Ингибиторы GP IIb/IIIa следует рассматривать в качестве терапии спасения (bail-out) при развитии феномена no-reflow или тромботических осложнений."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_pre_04",
          "text": {
            "en": "Cangrelor may be considered in P2Y12-inhibitor naïve patients undergoing PCI.",
            "ru": "Кангрелор может быть рассмотрен у пациентов, ранее не получавших ингибиторы P2Y12, подвергающихся ЧКВ."
          },
          "class": "IIb",
          "level": "A"
        },
        {
          "id": "r_pre_05",
          "text": {
            "en": "GP IIb/IIIa antagonists may be considered in P2Y12-inhibitor naïve patients undergoing PCI.",
            "ru": "Антагонисты GP IIb/IIIa могут быть рассмотрены у ранее не получавших ингибиторы P2Y12 пациентов, подвергающихся ЧКВ."
          },
          "class": "IIb",
          "level": "C"
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
            "en": "Anticoagulation is recommended for all patients in addition to antiplatelet therapy during PCI.",
            "ru": "Антикоагулянтная терапия рекомендуется всем пациентам в дополнение к антиагрегантной терапии во время ЧКВ."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_peri_02",
          "text": {
            "en": "Routine use of UFH is recommended.",
            "ru": "Рутинное применение нефракционированного гепарина (НФГ) рекомендуется."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_peri_03",
          "text": {
            "en": "Routine use of enoxaparin should be considered.",
            "ru": "Рутинное применение эноксапарина следует рассмотреть."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r_peri_04",
          "text": {
            "en": "Routine use of bivalirudin may be considered.",
            "ru": "Рутинное применение бивалирудина может быть рассмотрено."
          },
          "class": "IIb",
          "level": "A"
        }
      ]
    }
  ]
};

// 2. rt28-dapt-cardiac-surgery.json
// Dual antiplatelet therapy in patients undergoing cardiac surgery
const rt28 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt28-dapt-cardiac-surgery",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 28",
  "title": {
    "en": "Dual antiplatelet therapy in patients undergoing cardiac surgery",
    "ru": "Двойная антитромбоцитарная терапия у пациентов, подвергающихся кардиохирургическим операциям"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "DAPT in cardiac surgery",
        "ru": "ДАТТ при кардиохирургических вмешательствах"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "It is recommended that the Heart Team estimates the individual bleeding and ischaemic risks, and guides the timing of CABG as well as the anti-thrombotic management.",
            "ru": "Рекомендуется, чтобы команда Heart Team оценивала индивидуальный геморрагический и ишемический риски и определяла сроки проведения КШ, а также тактику антитромботической терапии."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r02",
          "text": {
            "en": "In patients on aspirin who need to undergo non-emergent cardiac surgery, it is recommended to continue aspirin at a low daily regimen throughout the peri-operative period.",
            "ru": "У пациентов, принимающих АСК и нуждающихся в неэкстренной кардиохирургической операции, рекомендуется продолжать прием АСК в низкой суточной дозе на протяжении всего периоперационного периода."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r03",
          "text": {
            "en": "In patients treated with DAPT after coronary stent implantation who subsequently undergo cardiac surgery, it is recommended to resume P2Y12 inhibitor therapy post-operatively as soon as it is deemed safe, so that DAPT continues until the recommended duration of therapy is completed.",
            "ru": "У пациентов, получающих ДАТТ после имплантации коронарного стента и подвергающихся кардиохирургической операции, рекомендуется возобновить прием ингибитора P2Y12 после операции, как только это будет признано безопасным, для завершения рекомендуемой длительности курса ДАТТ."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r04",
          "text": {
            "en": "In patients with ACS (NSTE-ACS or STEMI) treated with DAPT who are undergoing CABG and do not require long-term OAC therapy, resumption of P2Y12 inhibitor therapy as soon as deemed safe after surgery and its continuation up to 12 months is recommended.",
            "ru": "У пациентов с ОКС (ОКСбпST или ИМпST) на ДАТТ, подвергающихся КШ и не нуждающихся в длительном приеме ПОАК, возобновление терапии ингибитором P2Y12 рекомендуется сразу, как только это станет безопасным после операции, с продолжением терапии до 12 месяцев."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r05",
          "text": {
            "en": "In patients on P2Y12 inhibitors who need to undergo non-emergent cardiac surgery, postponing surgery for at least 3 days after discontinuation of ticagrelor, at least 5 days after clopidogrel, and at least 7 days after prasugrel should be considered.",
            "ru": "У пациентов, принимающих ингибиторы P2Y12 и нуждающихся в неэкстренной кардиохирургической операции, следует рассмотреть возможность отсрочки операции минимум на 3 дня после отмены тикагрелора, минимум на 5 дней после клопидогрела и минимум на 7 дней после прасугрела."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r06",
          "text": {
            "en": "In CABG patients with prior MI who are at high risk of severe bleeding (e.g. PRECISE-DAPT ≥25), discontinuation of P2Y12 inhibitor therapy after 6 months should be considered.",
            "ru": "У пациентов после КШ с инфарктом миокарда в анамнезе и высоким риском тяжелых кровотечений (например, PRECISE-DAPT ≥25) следует рассмотреть возможность отмены ингибитора P2Y12 через 6 месяцев."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r07",
          "text": {
            "en": "Platelet function testing may be considered to guide the decision on the timing of cardiac surgery in patients who have recently received P2Y12 inhibitors.",
            "ru": "Тестирование функции тромбоцитов может быть рассмотрено для определения оптимальных сроков кардиохирургической операции у пациентов, недавно принимавших ингибиторы P2Y12."
          },
          "class": "IIb",
          "level": "B"
        },
        {
          "id": "r08",
          "text": {
            "en": "In patients perceived to be at high ischaemic risk with prior MI and CABG, who have tolerated DAPT without a bleeding complication, treatment with DAPT for longer than 12 months and up to 36 months may be considered.",
            "ru": "У пациентов высокого ишемического риска с ИМ в анамнезе после КШ, хорошо перенесших ДАТТ без кровотечений, может быть рассмотрено продление ДАТТ на срок более 12 месяцев (до 36 месяцев)."
          },
          "class": "IIb",
          "level": "C"
        }
      ]
    }
  ]
};

// 3. t10-avoid-bleeding-oral-anticoagulation.json
// Table 8 Strategies to avoid bleeding complications in oral anticoagulation patients
const t10 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.t10-avoid-bleeding-oral-anticoagulation",
  "guidelineId": "esc-revasc-2018",
  "number": "Table 8",
  "title": {
    "en": "Strategies to avoid bleeding complications in oral anticoagulation patients",
    "ru": "Стратегии предотвращения геморрагических осложнений у пациентов, получающих пероральные антикоагулянты"
  },
  "type": "grid",
  "columns": [
    { "id": "num", "title": { "en": "No.", "ru": "№" } },
    { "id": "strategy", "title": { "en": "Strategy", "ru": "Стратегия профилактики кровотечений" } }
  ],
  "rows": [
    {
      "id": "s01",
      "cells": [
        { "text": { "en": "1", "ru": "1" } },
        {
          "text": {
            "en": "Assess ischaemic and bleeding risks using validated risk predictors (e.g. CHA2DS2-VASc, ABC, and HAS-BLED) with a focus on modifiable risk factors.",
            "ru": "Оценка ишемического и геморрагического риска с использованием валидированных шкал (например, CHA2DS2-VASc, ABC и HAS-BLED) с особым вниманием к модифицируемым факторам риска."
          }
        }
      ]
    },
    {
      "id": "s02",
      "cells": [
        { "text": { "en": "2", "ru": "2" } },
        {
          "text": {
            "en": "Keep triple therapy duration as short as possible; dual therapy after PCI (OAC and clopidogrel) to be considered instead of triple therapy.",
            "ru": "Минимизация длительности тройной терапии (как можно короче); рассмотрение двойной терапии после ЧКВ (ПОАК + клопидогрел) вместо тройной терапии."
          }
        }
      ]
    },
    {
      "id": "s03",
      "cells": [
        { "text": { "en": "3", "ru": "3" } },
        {
          "text": {
            "en": "One should consider the use of a NOAC instead of a VKA when NOACs are not contraindicated.",
            "ru": "Следует отдавать предпочтение прямым пероральным антикоагулянтам (ПОАК) перед антагонистами витамина К (АВК), если ПОАК не противопоказаны."
          }
        }
      ]
    },
    {
      "id": "s04",
      "cells": [
        { "text": { "en": "4", "ru": "4" } },
        {
          "text": {
            "en": "Consider a target INR in the lower part of the recommended target range and maximize time in the therapeutic range (i.e. >65%) when a VKA is used.",
            "ru": "При использовании АВК ориентироваться на нижнюю границу целевого диапазона МНО и стремиться к максимальному времени нахождения в терапевтическом диапазоне (TTR >65%)."
          }
        }
      ]
    },
    {
      "id": "s05",
      "cells": [
        { "text": { "en": "5", "ru": "5" } },
        {
          "text": {
            "en": "Clopidogrel is the P2Y12 inhibitor of choice.",
            "ru": "Клопидогрел является ингибитором P2Y12 первого выбора."
          }
        }
      ]
    },
    {
      "id": "s06",
      "cells": [
        { "text": { "en": "6", "ru": "6" } },
        {
          "text": {
            "en": "Use low-dose (≤100 mg daily) aspirin.",
            "ru": "Использование низких доз ацетилсалициловой кислоты (≤100 мг в сутки)."
          }
        }
      ]
    },
    {
      "id": "s07",
      "cells": [
        { "text": { "en": "7", "ru": "7" } },
        {
          "text": {
            "en": "Routine use of PPIs (proton pump inhibitors).",
            "ru": "Рутинное назначение ингибиторов протонной помпы (ИПП)."
          }
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(baseDir, 'rt27-antithrombotic-stemi-pci.json'), JSON.stringify(rt27, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt28-dapt-cardiac-surgery.json'), JSON.stringify(rt28, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 't10-avoid-bleeding-oral-anticoagulation.json'), JSON.stringify(t10, null, 2), 'utf8');

console.log('Successfully generated rt27, rt28, and t10 for esc-revasc-2018');
