import fs from 'fs';
import path from 'path';

const baseDir = 'd:/IT sandbox/Starley-CS-Library/data/guidelines/esc-revasc-2018';

// 1. t11-high-risk-features-ischaemic.json
// Table 9 High-risk features for ischaemic events
const t11 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.t11-high-risk-features-ischaemic",
  "guidelineId": "esc-revasc-2018",
  "number": "Table 9",
  "title": {
    "en": "High-risk features for ischaemic events",
    "ru": "Факторы высокого риска ишемических событий"
  },
  "type": "grid",
  "columns": [
    { "id": "num", "title": { "en": "No.", "ru": "№" } },
    { "id": "feature", "title": { "en": "High-risk feature", "ru": "Критерий высокого риска" } }
  ],
  "rows": [
    {
      "id": "f01",
      "cells": [
        { "text": { "en": "1", "ru": "1" } },
        { "text": { "en": "Prior stent thrombosis on adequate antiplatelet therapy", "ru": "Тромбоз стента в анамнезе на фоне адекватной антитромбоцитарной терапии" } }
      ]
    },
    {
      "id": "f02",
      "cells": [
        { "text": { "en": "2", "ru": "2" } },
        { "text": { "en": "Stenting of the last remaining patent coronary artery", "ru": "Стентирование единственной сохранной коронарной артерии" } }
      ]
    },
    {
      "id": "f03",
      "cells": [
        { "text": { "en": "3", "ru": "3" } },
        { "text": { "en": "Diffuse multivessel disease, especially in diabetic patients", "ru": "Диффузное многососудистое поражение, особенно у пациентов с сахарным диабетом" } }
      ]
    },
    {
      "id": "f04",
      "cells": [
        { "text": { "en": "4", "ru": "4" } },
        { "text": { "en": "Chronic kidney disease (i.e. creatinine clearance <60 mL/min)", "ru": "Хроническая болезнь почек (клиренс креатинина <60 мл/мин)" } }
      ]
    },
    {
      "id": "f05",
      "cells": [
        { "text": { "en": "5", "ru": "5" } },
        { "text": { "en": "At least three stents implanted", "ru": "Имплантация трех и более стентов" } }
      ]
    },
    {
      "id": "f06",
      "cells": [
        { "text": { "en": "6", "ru": "6" } },
        { "text": { "en": "At least three lesions treated", "ru": "Лечение трех и более поражений" } }
      ]
    },
    {
      "id": "f07",
      "cells": [
        { "text": { "en": "7", "ru": "7" } },
        { "text": { "en": "Bifurcation with two stents implanted", "ru": "Бифуркационное поражение с имплантацией двух стентов" } }
      ]
    },
    {
      "id": "f08",
      "cells": [
        { "text": { "en": "8", "ru": "8" } },
        { "text": { "en": "Total stented length >60 mm", "ru": "Общая длина стентированного сегмента >60 мм" } }
      ]
    },
    {
      "id": "f09",
      "cells": [
        { "text": { "en": "9", "ru": "9" } },
        { "text": { "en": "Treatment of a chronic total occlusion", "ru": "Рекреанализация/лечение хронической тотальной окклюзии" } }
      ]
    },
    {
      "id": "f10",
      "cells": [
        { "text": { "en": "10", "ru": "10" } },
        { "text": { "en": "History of STEMI", "ru": "Инфаркт миокарда с подъемом сегмента ST в анамнезе" } }
      ]
    }
  ]
};

// 2. t12-unfavourable-profile-oac-antiplatelet.json
// Table 10 Unfavourable patient profile for a combination of oral anticoagulant and antiplatelet therapy
const t12 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.t12-unfavourable-profile-oac-antiplatelet",
  "guidelineId": "esc-revasc-2018",
  "number": "Table 10",
  "title": {
    "en": "Unfavourable patient profile for a combination of oral anticoagulant and antiplatelet therapy",
    "ru": "Неблагоприятный профиль пациента для комбинации перорального антикоагулянта и антитромбоцитарной терапии"
  },
  "type": "grid",
  "columns": [
    { "id": "num", "title": { "en": "No.", "ru": "№" } },
    { "id": "profile", "title": { "en": "Unfavourable characteristic", "ru": "Фактор неблагоприятного профиля" } }
  ],
  "rows": [
    {
      "id": "p01",
      "cells": [
        { "text": { "en": "1", "ru": "1" } },
        { "text": { "en": "Short life expectancy", "ru": "Низкая ожидаемая продолжительность жизни" } }
      ]
    },
    {
      "id": "p02",
      "cells": [
        { "text": { "en": "2", "ru": "2" } },
        { "text": { "en": "Ongoing malignancy", "ru": "Активное злокачественное новообразование" } }
      ]
    },
    {
      "id": "p03",
      "cells": [
        { "text": { "en": "3", "ru": "3" } },
        { "text": { "en": "Poor expected adherence", "ru": "Низкая ожидаемая приверженность лечению" } }
      ]
    },
    {
      "id": "p04",
      "cells": [
        { "text": { "en": "4", "ru": "4" } },
        { "text": { "en": "Poor mental status", "ru": "Сниженный когнитивный статус / деменция" } }
      ]
    },
    {
      "id": "p05",
      "cells": [
        { "text": { "en": "5", "ru": "5" } },
        { "text": { "en": "End-stage renal failure", "ru": "Терминальная почечная недостаточность" } }
      ]
    },
    {
      "id": "p06",
      "cells": [
        { "text": { "en": "6", "ru": "6" } },
        { "text": { "en": "Advanced age", "ru": "Старческий возраст" } }
      ]
    },
    {
      "id": "p07",
      "cells": [
        { "text": { "en": "7", "ru": "7" } },
        { "text": { "en": "Prior major bleeding / prior haemorrhagic stroke", "ru": "Большое кровотечение или геморрагический инсульт в анамнезе" } }
      ]
    },
    {
      "id": "p08",
      "cells": [
        { "text": { "en": "8", "ru": "8" } },
        { "text": { "en": "Chronic alcohol abuse", "ru": "Хроническое злоупотребление алкоголем" } }
      ]
    },
    {
      "id": "p09",
      "cells": [
        { "text": { "en": "9", "ru": "9" } },
        { "text": { "en": "Anaemia", "ru": "Анемия" } }
      ]
    },
    {
      "id": "p10",
      "cells": [
        { "text": { "en": "10", "ru": "10" } },
        { "text": { "en": "Clinically significant bleeding on dual antithrombotic therapy", "ru": "Клинически значимое кровотечение на фоне двойной антитромботической терапии" } }
      ]
    }
  ]
};

// 3. rt29-dapt-duration-oral-anticoagulation.json
// Dual antiplatelet therapy duration in patients with indication for oral anticoagulation
const rt29 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt29-dapt-duration-oral-anticoagulation",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 29",
  "title": {
    "en": "Dual antiplatelet therapy duration in patients with indication for oral anticoagulation",
    "ru": "Длительность антитромбоцитарной терапии у пациентов с показаниями к пероральным антикоагулянтам"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Antithrombotic therapy in patients requiring oral anticoagulation",
        "ru": "Антитромботическая терапия при показаниях к антикоагулянтам"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "It is recommended that periprocedural aspirin and clopidogrel are administered to patients undergoing coronary stent implantation.",
            "ru": "Рекомендуется перипроцедурное назначение ацетилсалициловой кислоты и клопидогрела пациентам, подвергающимся имплантации коронарного стента."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r02",
          "text": {
            "en": "In patients treated with coronary stent implantation, triple therapy with aspirin, clopidogrel, and an OAC should be considered for 1 month, irrespective of the type of stent used.",
            "ru": "У пациентов после стентирования тройную терапию (АСК, клопидогрел и ПОАК/АВК) следует рассмотреть на срок 1 месяц независимо от типа имплантированного стента."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r03",
          "text": {
            "en": "Triple therapy with aspirin, clopidogrel, and an OAC for longer than 1 month and up to 6 months should be considered in patients with high ischaemic risk due to ACS or other anatomical/procedural characteristics, which outweigh the bleeding risk.",
            "ru": "Тройную терапию (АСК, клопидогрел и ПОАК/АВК) на срок более 1 месяца (до 6 месяцев) следует рассмотреть у пациентов с высоким ишемическим риском вследствие ОКС или других анатомических/процедурных факторов, преобладающих над риском кровотечений."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r04",
          "text": {
            "en": "Dual therapy with clopidogrel 75 mg/day and an OAC should be considered as an alternative to 1-month triple antithrombotic therapy in patients in whom the bleeding risk outweighs the ischaemic risk.",
            "ru": "Двойную терапию клопидогрелом 75 мг/сут и ПОАК/АВК следует рассматривать как альтернативу 1-месячной тройной терапии у пациентов, чей риск кровотечений превышает ишемический риск."
          },
          "class": "IIa",
          "level": "A"
        },
        {
          "id": "r05",
          "text": {
            "en": "In patients with non-valvular AF requiring anticoagulation and antiplatelet treatment, a NOAC should be preferred over VKAs.",
            "ru": "У пациентов с неклапанной ФП, нуждающихся в сочетании антикоагулянтной и антитромбоцитарной терапии, прямым пероральным антикоагулянтам (ПОАК) следует отдавать предпочтение перед АВК."
          },
          "class": "IIa",
          "level": "A"
        },
        {
          "id": "r06",
          "text": {
            "en": "In patients with an indication for a VKA in combination with aspirin and/or clopidogrel, the dose intensity of the VKA should be carefully regulated with a target INR in the lower part of the recommended target range and time in the therapeutic range >65%.",
            "ru": "У пациентов с показаниями к АВК в комбинации с АСК и/или клопидогрелом дозу АВК следует тщательно титровать с ориентацией на нижнюю границу целевого диапазона МНО и временем в терапевтическом диапазоне >65%."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r07",
          "text": {
            "en": "Discontinuation of antiplatelet treatment in patients treated with OAC should be considered at 12 months.",
            "ru": "Отмену антитромбоцитарной терапии у пациентов, получающих пероральные антикоагулянты, следует рассмотреть через 12 месяцев после процедуры."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r08",
          "text": {
            "en": "When a NOAC is used in combination with aspirin and/or clopidogrel, the lowest approved dose effective for stroke prevention tested in AF trials should be considered (apixaban 5 mg or 2.5 mg b.i.d. if criteria met; dabigatran 110 mg b.i.d.; edoxaban 60 mg or 30 mg q.d. if criteria met; rivaroxaban 20 mg or 15 mg q.d. if CrCl 30–49 mL/min).",
            "ru": "При использовании ПОАК в комбинации с АСК и/или клопидогрелом следует рассмотреть применение наименьшей одобренной дозы, эффективной для профилактики инсульта при ФП (апиксабан 5 мг или 2,5 мг 2 раза/сут; дабигатран 110 мг 2 раза/сут; эдоксабан 60 мг или 30 мг/сут; ривароксабан 20 мг или 15 мг/сут при клиренсе 30–49 мл/мин)."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r09",
          "text": {
            "en": "When rivaroxaban is used in combination with aspirin and/or clopidogrel, rivaroxaban 15 mg q.d. may be used instead of rivaroxaban 20 mg q.d.",
            "ru": "При применении ривароксабана в комбинации с АСК и/или клопидогрелом доза ривароксабана 15 мг 1 раз в сутки может использоваться вместо дозы 20 мг 1 раз в сутки."
          },
          "class": "IIb",
          "level": "B"
        },
        {
          "id": "r10",
          "text": {
            "en": "When dabigatran is used in combination with aspirin or clopidogrel, a dose of 150 mg b.i.d. may be preferred over a dose of 110 mg b.i.d.",
            "ru": "При применении дабигатрана в комбинации с АСК или клопидогрелом доза 150 мг 2 раза в сутки может быть предпочтительнее дозы 110 мг 2 раза в сутки."
          },
          "class": "IIb",
          "level": "B"
        },
        {
          "id": "r11",
          "text": {
            "en": "The use of ticagrelor or prasugrel is not recommended as part of triple antithrombotic therapy with aspirin and an OAC.",
            "ru": "Применение тикагрелора или прасугрела в составе тройной антитромботической терапии с АСК и пероральным антикоагулянтом не рекомендуется."
          },
          "class": "III",
          "level": "C"
        }
      ]
    }
  ]
};

// 4. rt30-operator-institutional-volume.json
// Recommendations for operator/institutional volume in myocardial revascularization
const rt30 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt30-operator-institutional-volume",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 30",
  "title": {
    "en": "Recommendations for operator/institutional volume in myocardial revascularization",
    "ru": "Рекомендации по объемам вмешательств оператора и клиники при реваскуляризации миокарда"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-cabg",
      "title": {
        "en": "CABG volume",
        "ru": "Объем операций КШ"
      },
      "rows": [
        {
          "id": "r_cabg_01",
          "text": {
            "en": "It should be considered that CABG be performed at institutions with annual institutional volumes of ≥200 CABG cases.",
            "ru": "Следует рассмотреть выполнение КШ в клиниках с ежегодным объемом операций не менее 200 процедур КШ в год."
          },
          "class": "IIa",
          "level": "C"
        }
      ]
    },
    {
      "id": "sec-pci",
      "title": {
        "en": "PCI volume",
        "ru": "Объем процедур ЧКВ"
      },
      "rows": [
        {
          "id": "r_pci_01",
          "text": {
            "en": "It should be considered that PCI for ACS be performed by trained operators with annual volumes of ≥75 procedures at institutions performing ≥400 PCIs per year with an established 24 h/7 day service for the treatment of patients with ACS.",
            "ru": "Следует рассмотреть выполнение ЧКВ при ОКС подготовленными специалистами с индивидуальным объемом ≥75 процедур в год в центрах с общим объемом ≥400 ЧКВ в год и круглосуточной службой 24/7."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_pci_02",
          "text": {
            "en": "It should be considered that PCI for SCAD be performed by trained operators with annual volumes of ≥75 procedures at institutions performing ≥200 PCIs per year.",
            "ru": "Следует рассмотреть выполнение ЧКВ при стабильной ИБС подготовленными операторами с ежегодным объемом ≥75 процедур в клиниках, выполняющих ≥200 ЧКВ в год."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_pci_03",
          "text": {
            "en": "It should be considered that institutions with annual volumes of <400 PCIs collaborate in networks with higher-volume institutions (>400 PCIs per year), with shared written protocols and exchange of operators and support staff.",
            "ru": "Клиникам с годовым объемом <400 ЧКВ следует сотрудничать в единой сети с высокопоточными центрами (>400 ЧКВ в год), с общими письменными протоколами и обменом персоналом."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_pci_04",
          "text": {
            "en": "It should be considered that PCI for LM be performed by trained operators with an annual volume of ≥25 LM PCI cases per year.",
            "ru": "Следует рассмотреть выполнение ЧКВ на стволе левой коронарной артерии подготовленными операторами с годовым объемом вмешательств на стволе ЛКА не менее 25 процедур в год."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_pci_05",
          "text": {
            "en": "It should be considered that non-emergency high-risk PCI procedures—such as for LM disease, single remaining patent coronary artery, and complex chronic total occlusions—are only performed by adequately experienced operators at centres that have access to circulatory support and intensive care treatment.",
            "ru": "Неэкстренные ЧКВ высокого риска (поражение ствола ЛКА, стентирование единственной проходимой артерии, сложные хронические тотальные окклюзии) следует выполнять только опытными операторами в центрах с возможностью механической поддержки кровообращения и ОРИТ."
          },
          "class": "IIa",
          "level": "C"
        }
      ]
    }
  ]
};

// 5. rt31-training-myocardial-revascularization.json
// Recommendations for training in myocardial revascularization
const rt31 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt31-training-myocardial-revascularization",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 31",
  "title": {
    "en": "Recommendations for training in myocardial revascularization",
    "ru": "Рекомендации по профессиональной подготовке в области реваскуляризации миокарда"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-cabg-training",
      "title": {
        "en": "Training in CABG",
        "ru": "Подготовка по коронарному шунтированию"
      },
      "rows": [
        {
          "id": "r_cabg_tr_01",
          "text": {
            "en": "It is recommended that trainees in cardiac surgery and interventional cardiology follow a competency-driven residency programme with regular evaluation of progression.",
            "ru": "Рекомендуется, чтобы ординаторы и стажеры по кардиохирургии и интервенционной кардиологии обучались по компетентностно-ориентированным программам с регулярной оценкой динамики навыков."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_cabg_tr_02",
          "text": {
            "en": "It should be considered that trainees in cardiac surgery perform ≥200 CABG procedures under supervision before being independent.",
            "ru": "Следует рассмотреть выполнение стажерами по кардиохирургии не менее 200 операций КШ под контролем наставника до перехода к самостоятельной практике."
          },
          "class": "IIa",
          "level": "C"
        }
      ]
    },
    {
      "id": "sec-pci-training",
      "title": {
        "en": "Training in PCI",
        "ru": "Подготовка по чрескожным коронарным вмешательствам"
      },
      "rows": [
        {
          "id": "r_pci_tr_01",
          "text": {
            "en": "It should be considered that trainees in interventional cardiology perform ≥200 PCI procedures as first operator, with one-third of PCI procedures in emergency or ACS patients under supervision, before being independent.",
            "ru": "Следует рассмотреть выполнение интервенционными кардиологами не менее 200 процедур ЧКВ в качестве первого оператора (из них не менее одной трети при экстренных состояниях или ОКС) под курацией наставника до перехода к самостоятельной работе."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_pci_tr_02",
          "text": {
            "en": "It should be considered that trainees in interventional cardiology complete formal training according to a 1–2 year curriculum at institutions with ≥800 PCIs per year and an established 24 h/7 day service for the treatment of patients with ACS.",
            "ru": "Следует рассмотреть прохождение интервенционными кардиологами 1–2-годичной формальной программы подготовки в центрах с потоком ≥800 ЧКВ в год и круглосуточной службой 24/7 по лечению ОКС."
          },
          "class": "IIa",
          "level": "C"
        }
      ]
    }
  ]
};

// 6. rt32-outcome-registration-benchmarking.json
// Recommendations for outcome registration, monitoring, and benchmarking
const rt32 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt32-outcome-registration-benchmarking",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 32",
  "title": {
    "en": "Recommendations for outcome registration, monitoring, and benchmarking",
    "ru": "Рекомендации по регистрации исходов, мониторингу и сравнительной оценке качества (бенчмаркингу)"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Outcome registration, monitoring, and benchmarking",
        "ru": "Регистрация и бенчмаркинг исходов"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "It is recommended that specific quality performance measures for CABG are adopted at a national level to allow outcome monitoring and benchmarking.",
            "ru": "Рекомендуется принять на национальном уровне специфические индикаторы качества выполнения КШ для обеспечения мониторинга исходов и бенчмаркинга."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r02",
          "text": {
            "en": "It is recommended that national societies establish national databases on CABG practice and outcomes.",
            "ru": "Рекомендуется, чтобы национальные профессиональные медицинские общества создавали национальные регистры клинической практики и исходов КШ."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r03",
          "text": {
            "en": "It is recommended that CABG outcome data are reported by hospitals to national databases.",
            "ru": "Рекомендуется передача госпитальных данных об исходах КШ из клиник в национальные базы данных/регистры."
          },
          "class": "I",
          "level": "C"
        }
      ]
    }
  ]
};

// 7. rt33-follow-up-management-after-revasc.json
// Strategies for follow-up and management in patients after myocardial revascularization
const rt33 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt33-follow-up-management-after-revasc",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 33",
  "title": {
    "en": "Strategies for follow-up and management in patients after myocardial revascularization",
    "ru": "Стратегии наблюдения и ведения пациентов после реваскуляризации миокарда"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-general-follow-up",
      "title": {
        "en": "General follow-up and rehabilitation",
        "ru": "Общее наблюдение и реабилитация"
      },
      "rows": [
        {
          "id": "r_gen_01",
          "text": {
            "en": "After CABG or PCI for AMI, participation in a cardiac rehabilitation programme is recommended to improve patient outcomes.",
            "ru": "После КШ или ЧКВ по поводу острого инфаркта миокарда рекомендуется участие в программе кардиореабилитации для улучшения клинических исходов."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_gen_02",
          "text": {
            "en": "It is recommended that secondary prevention measures, including medical therapy and lifestyle changes, are started and reinforced after myocardial revascularization.",
            "ru": "Рекомендуется начинать и активно поддерживать меры вторичной профилактики, включая медикаментозную терапию и модификацию образа жизни, после реваскуляризации миокарда."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_gen_03",
          "text": {
            "en": "It is recommended that patients are re-evaluated after myocardial revascularization (e.g. at 3 months and thereafter, at least on an annual basis) in order to reassess symptoms and adherence to secondary prevention measures, and reinforce medical therapy and lifestyle changes when appropriate.",
            "ru": "Рекомендуется повторное обследование пациентов после реваскуляризации миокарда (например, через 3 месяца и далее как минимум ежегодно) для оценки симптомов, приверженности мерам вторичной профилактики и своевременной коррекции терапии и образа жизни."
          },
          "class": "I",
          "level": "C"
        }
      ]
    },
    {
      "id": "sec-symptomatic-patients",
      "title": {
        "en": "Symptomatic patients",
        "ru": "Симптомные пациенты"
      },
      "rows": [
        {
          "id": "r_symp_01",
          "text": {
            "en": "Coronary angiography is recommended in patients with intermediate- to high-risk findings at stress testing (ischaemia at low workload, early-onset ischaemia, inducible wall motion abnormality, or reversible perfusion defect in ≥10% of LV myocardium).",
            "ru": "Коронарография рекомендуется пациентам с признаками промежуточного или высокого риска при стресс-тестировании (ишемия при низкой нагрузке, раннее возникновение ишемии, индуцированные нарушения локальной сократимости или обратимый дефект перфузии ≥10% миокарда ЛЖ)."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_symp_02",
          "text": {
            "en": "An imaging stress test should be considered in patients with prior revascularization over stress ECG.",
            "ru": "Стресс-тест с визуализацией (стресс-ЭхоКГ, стресс-МРТ, ОФЭКТ/ПЭТ) следует рассмотреть у пациентов после реваскуляризации предпочтительнее нагрузочной стресс-ЭКГ."
          },
          "class": "IIa",
          "level": "B"
        }
      ]
    },
    {
      "id": "sec-asymptomatic-patients",
      "title": {
        "en": "Asymptomatic patients",
        "ru": "Асимптомные пациенты"
      },
      "rows": [
        {
          "id": "r_asymp_01",
          "text": {
            "en": "Surveillance by non-invasive imaging-based stress testing may be considered in high-risk patient subsets 6 months after revascularization.",
            "ru": "Контрольное неинвазивное визуализирующее стресс-тестирование может быть рассмотрено в подгруппах высокого риска через 6 месяцев после реваскуляризации."
          },
          "class": "IIb",
          "level": "C"
        },
        {
          "id": "r_asymp_02",
          "text": {
            "en": "After high-risk PCI (e.g. unprotected LM stenosis), late (3–12 months) surveillance angiography may be considered, irrespective of symptoms.",
            "ru": "После ЧКВ высокого риска (например, при стенозе незащищенного ствола ЛКА) может быть рассмотрена контрольная поздняя (через 3–12 месяцев) ангиография независимо от наличия симптомов."
          },
          "class": "IIb",
          "level": "C"
        },
        {
          "id": "r_asymp_03",
          "text": {
            "en": "Routine non-invasive imaging-based stress testing may be considered 1 year after PCI and >5 years after CABG.",
            "ru": "Рутинное неинвазивное визуализирующее стресс-тестирование может быть рассмотрено через 1 год после ЧКВ и более чем через 5 лет после КШ."
          },
          "class": "IIb",
          "level": "C"
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(baseDir, 't11-high-risk-features-ischaemic.json'), JSON.stringify(t11, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 't12-unfavourable-profile-oac-antiplatelet.json'), JSON.stringify(t12, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt29-dapt-duration-oral-anticoagulation.json'), JSON.stringify(rt29, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt30-operator-institutional-volume.json'), JSON.stringify(rt30, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt31-training-myocardial-revascularization.json'), JSON.stringify(rt31, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt32-outcome-registration-benchmarking.json'), JSON.stringify(rt32, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt33-follow-up-management-after-revasc.json'), JSON.stringify(rt33, null, 2), 'utf8');

console.log('Successfully generated t11, t12, rt29, rt30, rt31, rt32, and rt33 for esc-revasc-2018');
