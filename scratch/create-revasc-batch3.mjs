import fs from 'fs';
import path from 'path';

const baseDir = 'd:/IT sandbox/Starley-CS-Library/data/guidelines/esc-revasc-2018';

// 1. t06-syntax-score-calculation.json
// Table 6 Guide for calculating the SYNTAX score
const t06 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.t06-syntax-score-calculation",
  "guidelineId": "esc-revasc-2018",
  "number": "Table 6",
  "title": {
    "en": "Guide for calculating the SYNTAX score",
    "ru": "Руководство по расчету шкалы SYNTAX score"
  },
  "type": "grid",
  "columns": [
    { "id": "step", "title": { "en": "Steps", "ru": "Шаг" } },
    { "id": "variable", "title": { "en": "Variable assessed", "ru": "Оцениваемый параметр" } },
    { "id": "description", "title": { "en": "Description", "ru": "Описание и баллы" } }
  ],
  "rows": [
    {
      "id": "step1",
      "cells": [
        { "text": { "en": "Step 1", "ru": "Шаг 1" } },
        { "text": { "en": "Dominance", "ru": "Тип доминирования" } },
        {
          "text": {
            "en": "The weight of individual coronary segments varies according to coronary artery dominance (right or left). Co-dominance does not exist as an option in the SYNTAX score.",
            "ru": "Весовой коэффициент отдельных коронарных сегментов варьирует в зависимости от типа доминирования кровообращения (правый или левый). Сбалансированный тип (ко-доминирование) в шкале SYNTAX не предусмотрен."
          }
        }
      ]
    },
    {
      "id": "step2",
      "cells": [
        { "text": { "en": "Step 2", "ru": "Шаг 2" } },
        { "text": { "en": "Coronary segment", "ru": "Коронарный сегмент" } },
        {
          "text": {
            "en": "The diseased coronary segment directly affects the score as each coronary segment is assigned a weight depending on its location, ranging from 0.5 (i.e. the posterolateral branch) to 6 (i.e. left main in case of left dominance). Weighting factors: Left main (+5 for right, +6 for left dominance); LAD proximal (+3.5), mid (+2.5), apical (+1); Circumflex proximal (+1.5 for right, +2.5 for left dominance), obtuse marginal (+1), posterolateral (+0.5); RCA proximal (+1), mid (+1), distal (+1), PDA (+1 for right dominance).",
            "ru": "Пораженный коронарный сегмент напрямую влияет на суммарный балл, так как каждому сегменту присвоен весовой коэффициент в зависимости от локализации — от 0,5 (заднебоковая ветвь) до 6 (ствол ЛКА при левом типе доминирования). Весовые коэффициенты: ствол ЛКА (+5 при правом, +6 при левом типе); ПМЖВ проксимальный (+3,5), средний (+2,5), верхушечный (+1); ОВ проксимальный (+1,5 при правом, +2,5 при левом типе), ВТК (+1), заднебоковая ветвь (+0,5); ПКА проксимальный (+1), средний (+1), дистальный (+1), ЗМЖВ (+1 при правом типе)."
          }
        }
      ]
    },
    {
      "id": "step3",
      "cells": [
        { "text": { "en": "Step 3", "ru": "Шаг 3" } },
        { "text": { "en": "Diameter stenosis", "ru": "Процент стеноза по диаметру" } },
        {
          "text": {
            "en": "The score of each diseased coronary segment is multiplied by two in case of a stenosis 50–99% and by five in case of total occlusion.\nIn case of total occlusion, additional points will be added as follows:\n• Age >3 months or unknown: +1\n• Blunt stump: +1\n• Bridging: +1\n• First segment visible distally: +1 per non-visible segment\n• Side branch at the occlusion: +1 if <1.5 mm diameter; +1 if both <1.5 mm and ≥1.5 mm diameter; +0 if ≥1.5 mm diameter (i.e. bifurcation lesion)",
            "ru": "Балл каждого пораженного сегмента умножается на 2 при стенозе 50–99% и на 5 при полной окклюзии (100%).\nПри полной окклюзии начисляются дополнительные баллы:\n• Давность окклюзии >3 месяцев или неизвестна: +1\n• Тупая культя (blunt stump): +1\n• Мостовидные коллатерали (bridging): +1\n• Первый дистально визуализируемый сегмент: +1 за каждый невизуализируемый сегмент\n• Боковая ветвь в зоне окклюзии: +1 если диаметр <1,5 мм; +1 если присутствуют обе (<1,5 мм и ≥1,5 мм); +0 если ≥1,5 мм (т.е. бифуркационное поражение)"
          }
        }
      ]
    },
    {
      "id": "step4",
      "cells": [
        { "text": { "en": "Step 4", "ru": "Шаг 4" } },
        { "text": { "en": "Trifurcation lesion", "ru": "Трифуркационное поражение" } },
        {
          "text": {
            "en": "The presence of a trifurcation lesion adds additional points based on the number of diseased segments:\n• 1 segment: +3\n• 2 segments: +4\n• 3 segments: +5\n• 4 segments: +6",
            "ru": "Наличие трифуркационного поражения добавляет баллы в зависимости от числа пораженных сегментов:\n• 1 сегмент: +3\n• 2 сегмента: +4\n• 3 сегмента: +5\n• 4 сегмента: +6"
          }
        }
      ]
    },
    {
      "id": "step5",
      "cells": [
        { "text": { "en": "Step 5", "ru": "Шаг 5" } },
        { "text": { "en": "Bifurcation lesion", "ru": "Бифуркационное поражение" } },
        {
          "text": {
            "en": "The presence of a bifurcation lesion adds additional points based on the type of bifurcation according to the Medina classification:\n• Medina 1,0,0 / 0,1,0 / 1,1,0: +1\n• Medina 1,1,1 / 0,0,1 / 1,0,1 / 0,1,1: +2\nMoreover, the presence of a bifurcation angle <70° adds one additional point (+1).",
            "ru": "Наличие бифуркационного поражения добавляет баллы в зависимости от типа по классификации Medina:\n• Medina 1,0,0 / 0,1,0 / 1,1,0: +1\n• Medina 1,1,1 / 0,0,1 / 1,0,1 / 0,1,1: +2\nКроме того, наличие бифуркационного угла <70° добавляет еще один балл (+1)."
          }
        }
      ]
    },
    {
      "id": "step6",
      "cells": [
        { "text": { "en": "Step 6", "ru": "Шаг 6" } },
        { "text": { "en": "Aorto-ostial lesion", "ru": "Аорто-устьевое поражение" } },
        {
          "text": {
            "en": "The presence of aorto-ostial lesion segments adds one additional point (+1).",
            "ru": "Наличие аорто-устьевого поражения сегментов добавляет один балл (+1)."
          }
        }
      ]
    },
    {
      "id": "step7",
      "cells": [
        { "text": { "en": "Step 7", "ru": "Шаг 7" } },
        { "text": { "en": "Severe tortuosity", "ru": "Выраженная извитость" } },
        {
          "text": {
            "en": "The presence of severe tortuosity proximal of the diseased segment adds two additional points (+2).",
            "ru": "Наличие выраженной извитости проксимальнее пораженного сегмента добавляет два балла (+2)."
          }
        }
      ]
    },
    {
      "id": "step8",
      "cells": [
        { "text": { "en": "Step 8", "ru": "Шаг 8" } },
        { "text": { "en": "Lesion length", "ru": "Протяженность поражения" } },
        {
          "text": {
            "en": "Lesion length >20 mm adds one additional point (+1).",
            "ru": "Протяженность поражения >20 мм добавляет один балл (+1)."
          }
        }
      ]
    },
    {
      "id": "step9",
      "cells": [
        { "text": { "en": "Step 9", "ru": "Шаг 9" } },
        { "text": { "en": "Calcification", "ru": "Кальциноз" } },
        {
          "text": {
            "en": "The presence of heavy calcification adds two additional points (+2).",
            "ru": "Наличие выраженного кальциноза добавляет два балла (+2)."
          }
        }
      ]
    },
    {
      "id": "step10",
      "cells": [
        { "text": { "en": "Step 10", "ru": "Шаг 10" } },
        { "text": { "en": "Thrombus", "ru": "Тромбоз" } },
        {
          "text": {
            "en": "The presence of thrombus adds one additional point (+1).",
            "ru": "Наличие внутрисосудистого тромба добавляет один балл (+1)."
          }
        }
      ]
    },
    {
      "id": "step11",
      "cells": [
        { "text": { "en": "Step 11", "ru": "Шаг 11" } },
        { "text": { "en": "Diffuse disease / small vessels", "ru": "Диффузное поражение / сосуды малого диаметра" } },
        {
          "text": {
            "en": "The presence of diffusely diseased and narrowed segments distal to the lesion (i.e. when at least 75% of the length of the segment distal to the lesion has a vessel diameter <2 mm) adds one point per segment number (+1 per segment).",
            "ru": "Наличие диффузно пораженных и суженных сегментов дистальнее поражения (т.е. когда как минимум на 75% длины сегмента диаметр сосуда <2 мм) добавляет один балл за каждый такой сегмент (+1 за сегмент)."
          }
        }
      ]
    }
  ]
};

// 2. rt05-choice-cabg-vs-pci-criteria.json
// Recommendations on criteria for the choice between coronary artery bypass grafting and percutaneous coronary intervention
const rt05 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt05-choice-cabg-vs-pci-criteria",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 5",
  "title": {
    "en": "Recommendations on criteria for the choice between coronary artery bypass grafting and percutaneous coronary intervention",
    "ru": "Рекомендации по критериям выбора между коронарным шунтированием и чрескожным коронарным вмешательством"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-surgical-risk",
      "title": {
        "en": "Assessment of surgical risk (referring to prediction of outcomes)",
        "ru": "Оценка хирургического риска (в отношении прогнозирования исходов)"
      },
      "rows": [
        {
          "id": "r_surg_01",
          "text": {
            "en": "It is recommended that the STS score is calculated to assess in-hospital or 30 day mortality, and in-hospital morbidity after CABG.",
            "ru": "Рекомендуется рассчитывать оценку по шкале STS для прогнозирования госпитальной или 30-дневной летальности и госпитальных осложнений после КШ."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_surg_02",
          "text": {
            "en": "Calculation of the EuroSCORE II score may be considered to assess in-hospital mortality after CABG.",
            "ru": "Расчет шкалы EuroSCORE II может быть рассмотрен для оценки госпитальной летальности после КШ."
          },
          "class": "IIb",
          "level": "B"
        }
      ]
    },
    {
      "id": "sec-cad-complexity",
      "title": {
        "en": "Assessment of CAD complexity",
        "ru": "Оценка анатомической сложности поражения коронарного русла"
      },
      "rows": [
        {
          "id": "r_compl_01",
          "text": {
            "en": "In patients with LM or multivessel disease, it is recommended that the SYNTAX score is calculated to assess the anatomical complexity of CAD and the long-term risk of mortality and morbidity after PCI.",
            "ru": "У пациентов с поражением ствола ЛКА или многососудистым поражением рекомендуется рассчитывать шкалу SYNTAX для оценки анатомической сложности ИБС и долгосрочного риска смертности и осложнений после ЧКВ."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_compl_02",
          "text": {
            "en": "When considering the decision between CABG and PCI, completeness of revascularization should be prioritized.",
            "ru": "При выборе между КШ и ЧКВ приоритет должен отдаваться достижению полноты реваскуляризации миокарда."
          },
          "class": "IIa",
          "level": "B"
        }
      ]
    }
  ]
};

// 3. rt06-revasc-type-scad.json
// Recommendation for the type of revascularization in patients with stable coronary artery disease with suitable coronary anatomy for both procedures and low predicted surgical mortality
const rt06 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt06-revasc-type-scad",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 6",
  "title": {
    "en": "Recommendation for the type of revascularization in patients with stable coronary artery disease with suitable coronary anatomy for both procedures and low predicted surgical mortality",
    "ru": "Рекомендации по выбору метода реваскуляризации у пациентов со стабильной ИБС при анатомии, подходящей для обоих вмешательств, и низком расчетном хирургическом риске"
  },
  "type": "grid",
  "columns": [
    { "id": "extent", "title": { "en": "Recommendations according to extent of CAD", "ru": "Рекомендации в зависимости от распространенности ИБС" } },
    { "id": "cabg_class", "title": { "en": "CABG Class", "ru": "КШ Класс" } },
    { "id": "cabg_level", "title": { "en": "CABG Level", "ru": "КШ Уровень" } },
    { "id": "pci_class", "title": { "en": "PCI Class", "ru": "ЧКВ Класс" } },
    { "id": "pci_level", "title": { "en": "PCI Level", "ru": "ЧКВ Уровень" } }
  ],
  "rows": [
    {
      "id": "sec_1vd",
      "kind": "section",
      "cells": [
        { "text": { "en": "One-vessel CAD", "ru": "Однососудистое поражение" }, "colspan": 5 }
      ]
    },
    {
      "id": "r_1vd_no_plad",
      "cells": [
        { "text": { "en": "Without proximal LAD stenosis.", "ru": "Без проксимального стеноза ПМЖВ." } },
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        { "text": { "en": "C", "ru": "C" } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "C", "ru": "C" } }
      ]
    },
    {
      "id": "r_1vd_plad",
      "cells": [
        { "text": { "en": "With proximal LAD stenosis.", "ru": "С проксимальным стенозом ПМЖВ." } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } }
      ]
    },
    {
      "id": "sec_2vd",
      "kind": "section",
      "cells": [
        { "text": { "en": "Two-vessel CAD", "ru": "Двухсосудистое поражение" }, "colspan": 5 }
      ]
    },
    {
      "id": "r_2vd_no_plad",
      "cells": [
        { "text": { "en": "Without proximal LAD stenosis.", "ru": "Без проксимального стеноза ПМЖВ." } },
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        { "text": { "en": "C", "ru": "C" } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "C", "ru": "C" } }
      ]
    },
    {
      "id": "r_2vd_plad",
      "cells": [
        { "text": { "en": "With proximal LAD stenosis.", "ru": "С проксимальным стенозом ПМЖВ." } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "B", "ru": "B" } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "C", "ru": "C" } }
      ]
    },
    {
      "id": "sec_lm",
      "kind": "section",
      "cells": [
        { "text": { "en": "Left main CAD", "ru": "Поражение ствола левой коронарной артерии" }, "colspan": 5 }
      ]
    },
    {
      "id": "r_lm_low",
      "cells": [
        { "text": { "en": "Left main disease with low SYNTAX score (0–22).", "ru": "Поражение ствола ЛКА с низким баллом SYNTAX (0–22)." } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } }
      ]
    },
    {
      "id": "r_lm_mid",
      "cells": [
        { "text": { "en": "Left main disease with intermediate SYNTAX score (23–32).", "ru": "Поражение ствола ЛКА со средним баллом SYNTAX (23–32)." } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } },
        { "text": { "en": "IIa", "ru": "IIa" }, "tone": "yellow" },
        { "text": { "en": "A", "ru": "A" } }
      ]
    },
    {
      "id": "r_lm_high",
      "cells": [
        { "text": { "en": "Left main disease with high SYNTAX score (≥33) (PCI should be considered if Heart Team has concern about surgical risk or if patient refuses CABG).", "ru": "Поражение ствола ЛКА с высоким баллом SYNTAX (≥33) (ЧКВ следует рассмотреть, если у Heart Team есть опасения относительно хирургического риска или пациент отказывается от КШ)." } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } },
        { "text": { "en": "III", "ru": "III" }, "tone": "red" },
        { "text": { "en": "B", "ru": "B" } }
      ]
    },
    {
      "id": "sec_3vd_nondiab",
      "kind": "section",
      "cells": [
        { "text": { "en": "Three-vessel CAD without diabetes mellitus", "ru": "Трехсосудистое поражение без сахарного диабета" }, "colspan": 5 }
      ]
    },
    {
      "id": "r_3vd_nondiab_low",
      "cells": [
        { "text": { "en": "Three-vessel disease with low SYNTAX score (0–22).", "ru": "Трехсосудистое поражение с низким баллом SYNTAX (0–22)." } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } }
      ]
    },
    {
      "id": "r_3vd_nondiab_high",
      "cells": [
        { "text": { "en": "Three-vessel disease with intermediate or high SYNTAX score (>22) (PCI should be considered if Heart Team has concern about surgical risk or if patient refuses CABG).", "ru": "Трехсосудистое поражение со средним или высоким баллом SYNTAX (>22) (ЧКВ следует рассмотреть, если у Heart Team есть опасения относительно хирургического риска или пациент отказывается от КШ)." } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } },
        { "text": { "en": "III", "ru": "III" }, "tone": "red" },
        { "text": { "en": "A", "ru": "A" } }
      ]
    },
    {
      "id": "sec_3vd_diab",
      "kind": "section",
      "cells": [
        { "text": { "en": "Three-vessel CAD with diabetes mellitus", "ru": "Трехсосудистое поражение с сахарным диабетом" }, "colspan": 5 }
      ]
    },
    {
      "id": "r_3vd_diab_low",
      "cells": [
        { "text": { "en": "Three-vessel disease with low SYNTAX score (0–22).", "ru": "Трехсосудистое поражение с низким баллом SYNTAX (0–22)." } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } },
        { "text": { "en": "IIb", "ru": "IIb" }, "tone": "orange" },
        { "text": { "en": "A", "ru": "A" } }
      ]
    },
    {
      "id": "r_3vd_diab_high",
      "cells": [
        { "text": { "en": "Three-vessel disease with intermediate or high SYNTAX score (>22) (PCI should be considered if Heart Team has concern about surgical risk or if patient refuses CABG).", "ru": "Трехсосудистое поражение со средним или высоким баллом SYNTAX (>22) (ЧКВ следует рассмотреть, если у Heart Team есть опасения относительно хирургического риска или пациент отказывается от КШ)." } },
        { "text": { "en": "I", "ru": "I" }, "tone": "green" },
        { "text": { "en": "A", "ru": "A" } },
        { "text": { "en": "III", "ru": "III" }, "tone": "red" },
        { "text": { "en": "A", "ru": "A" } }
      ]
    }
  ]
};

// 4. t07-favours-pci-vs-cabg.json
// Figure 3 Aspects to be considered by the Heart Team for decision-making between percutaneous coronary intervention and coronary artery bypass grafting among patients with stable multivessel and/or left main coronary artery disease
const t07 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.t07-favours-pci-vs-cabg",
  "guidelineId": "esc-revasc-2018",
  "number": "Figure 3",
  "title": {
    "en": "Aspects to be considered by the Heart Team for decision-making between PCI and CABG in stable multivessel and/or left main CAD",
    "ru": "Факторы, учитываемые командой Heart Team при выборе между ЧКВ и КШ у пациентов со стабильным многососудистым поражением и/или поражением ствола ЛКА"
  },
  "type": "grid",
  "columns": [
    { "id": "category", "title": { "en": "Category", "ru": "Категория" } },
    { "id": "favours_pci", "title": { "en": "Favours PCI", "ru": "В пользу ЧКВ" } },
    { "id": "favours_cabg", "title": { "en": "Favours CABG", "ru": "В пользу КШ" } }
  ],
  "rows": [
    {
      "id": "r_clinical",
      "cells": [
        { "text": { "en": "Clinical characteristics", "ru": "Клинические характеристики" } },
        {
          "text": {
            "en": "• Presence of severe co-morbidity (not adequately reflected by scores)\n• Advanced age/frailty/reduced life expectancy\n• Restricted mobility and conditions that affect the rehabilitation process",
            "ru": "• Наличие тяжелой сопутствующей патологии (недостаточно отраженной в шкалах)\n• Старческий возраст / старческая астения (хрупкость) / снижение ожидаемой продолжительности жизни\n• Ограниченная подвижность и состояния, затрудняющие процесс послеоперационной реабилитации"
          }
        },
        {
          "text": {
            "en": "• Diabetes\n• Reduced LV function (EF ≤35%)\n• Contraindication to DAPT\n• Recurrent diffuse in-stent restenosis",
            "ru": "• Сахарный диабет\n• Сниженная функция ЛЖ (ФВ ≤35%)\n• Противопоказания к ДАТТ\n• Рецидивирующий диффузный рестеноз внутри стента"
          }
        }
      ]
    },
    {
      "id": "r_anatomical",
      "cells": [
        { "text": { "en": "Anatomical and technical aspects", "ru": "Анатомические и технические аспекты" } },
        {
          "text": {
            "en": "• MVD with SYNTAX score 0–22\n• Anatomy likely resulting in incomplete revascularization with CABG due to poor quality or missing conduits\n• Severe chest deformation or scoliosis\n• Sequelae of chest radiation\n• Porcelain aorta (consider no-touch off-pump CABG in case of porcelain aorta)",
            "ru": "• Многососудистое поражение с баллом SYNTAX 0–22\n• Анатомия, с высокой вероятностью приводящая к неполной реваскуляризации при КШ из-за плохого качества или отсутствия подходящих кондуитов\n• Тяжелая деформация грудной клетки или сколиоз\n• Последствия лучевой терапии органов грудной клетки\n• Фарфоровая аорта (при фарфоровой аорте рассмотреть КШ на работающем сердце без манипуляций на аорте — no-touch off-pump)"
          }
        },
        {
          "text": {
            "en": "• MVD with SYNTAX score ≥23\n• Anatomy likely resulting in incomplete revascularization with PCI\n• Severely calcified coronary artery lesions limiting lesion expansion",
            "ru": "• Многососудистое поражение с баллом SYNTAX ≥23\n• Анатомия, с высокой вероятностью приводящая к неполной реваскуляризации при ЧКВ\n• Выраженно кальцинированные поражения коронарных артерий, препятствующие адекватному раскрытию стента"
          }
        }
      ]
    },
    {
      "id": "r_concomitant",
      "cells": [
        { "text": { "en": "Need for concomitant interventions", "ru": "Потребность в сопутствующих вмешательствах" } },
        {
          "text": {
            "en": "None",
            "ru": "Отсутствует"
          }
        },
        {
          "text": {
            "en": "• Ascending aortic pathology with indication for surgery\n• Concomitant cardiac surgery",
            "ru": "• Патология восходящей аорты с показаниями к операции\n• Необходимость сопутствующего кардиохирургического вмешательства (например, клапанная хирургия)"
          }
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(baseDir, 't06-syntax-score-calculation.json'), JSON.stringify(t06, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt05-choice-cabg-vs-pci-criteria.json'), JSON.stringify(rt05, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt06-revasc-type-scad.json'), JSON.stringify(rt06, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 't07-favours-pci-vs-cabg.json'), JSON.stringify(t07, null, 2), 'utf8');

console.log('Successfully generated t06, rt05, rt06, and t07 for esc-revasc-2018');
