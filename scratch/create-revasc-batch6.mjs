import fs from 'fs';
import path from 'path';

const baseDir = 'd:/IT sandbox/Starley-CS-Library/data/guidelines/esc-revasc-2018';

// 1. rt15-carotid-stenosis-cabg.json
// Recommendations on the management of carotid stenosis in patients undergoing coronary artery bypass grafting
const rt15 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt15-carotid-stenosis-cabg",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 15",
  "title": {
    "en": "Recommendations on the management of carotid stenosis in patients undergoing coronary artery bypass grafting",
    "ru": "Рекомендации по ведению стеноза сонной артерии у пациентов, подвергающихся коронарному шунтированию"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Management of carotid stenosis in CABG patients",
        "ru": "Тактика при стенозе сонных артерий у кандидатов на КШ"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "In patients scheduled for CABG, it is recommended that the indication (and if so the method and timing) for carotid revascularization be individualized after discussion within a multidisciplinary team, including a neurologist.",
            "ru": "У пациентов, запланированных на КШ, рекомендуется индивидуализировать показания (а также метод и сроки) к реваскуляризации сонных артерий после обсуждения в мультидисциплинарной команде с участием невролога."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r02",
          "text": {
            "en": "In patients scheduled for CABG, with recent (<6 months) history of TIA/stroke: carotid revascularization should be considered in patients with 50–99% carotid stenosis.",
            "ru": "У пациентов, запланированных на КШ, с недавним (<6 месяцев) анамнезом ТИА/инсульта: реваскуляризацию сонных артерий следует рассмотреть при стенозе сонной артерии 50–99%."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r03",
          "text": {
            "en": "In patients scheduled for CABG, with recent (<6 months) history of TIA/stroke: carotid revascularization with CEA should be considered as first choice in patients with 50–99% carotid stenosis.",
            "ru": "У пациентов, запланированных на КШ, с недавним (<6 месяцев) анамнезом ТИА/инсульта: каротидная эндартерэктомия (КЭЭ) должна рассматриваться как метод первого выбора при стенозе сонной артерии 50–99%."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r04",
          "text": {
            "en": "In patients scheduled for CABG, with recent (<6 months) history of TIA/stroke: carotid revascularization is not recommended in patients with carotid stenosis <50%.",
            "ru": "У пациентов, запланированных на КШ, с недавним (<6 месяцев) анамнезом ТИА/инсульта: реваскуляризация сонных артерий не рекомендуется при стенозе сонной артерии <50%."
          },
          "class": "III",
          "level": "C"
        },
        {
          "id": "r05",
          "text": {
            "en": "In neurologically asymptomatic patients scheduled for CABG: carotid revascularization may be considered in patients with bilateral 70–99% carotid stenosis or 70–99% carotid stenosis and contralateral occlusion.",
            "ru": "У неврологически асимптомных пациентов, запланированных на КШ: реваскуляризация сонных артерий может быть рассмотрена при двустороннем стенозе 70–99% либо стенозе 70–99% с контралатеральной окклюзией."
          },
          "class": "IIb",
          "level": "C"
        },
        {
          "id": "r06",
          "text": {
            "en": "In neurologically asymptomatic patients scheduled for CABG: carotid revascularization may be considered in patients with a 70–99% carotid stenosis, in the presence of one or more characteristics that may be associated with an increased risk of ipsilateral stroke (contralateral TIA/stroke, ipsilateral silent infarction on cerebral imaging, intraplaque haemorrhage or lipid-rich necrotic core on MRA, or high-risk ultrasound findings), in order to reduce stroke risk beyond the perioperative period.",
            "ru": "У неврологически асимптомных пациентов, запланированных на КШ: реваскуляризация сонных артерий может быть рассмотрена при стенозе сонной артерии 70–99% при наличии одного или более признаков повышенного риска ипсилатерального инсульта (контралатеральная ТИА/инсульт, ипсилатеральный «немой» инфаркт мозга при нейровизуализации, внутрибляшечное кровоизлияние или богатое липидами некротическое ядро на МРА либо признаки высокого риска по УЗИ), с целью снижения риска инсульта за пределами периоперационного периода."
          },
          "class": "IIb",
          "level": "C"
        },
        {
          "id": "r07",
          "text": {
            "en": "In neurologically asymptomatic patients scheduled for CABG: routine prophylactic carotid revascularization in patients with a 70–99% carotid stenosis is not recommended.",
            "ru": "У неврологически асимптомных пациентов, запланированных на КШ: рутинная профилактическая реваскуляризация сонных артерий при стенозе 70–99% не рекомендуется."
          },
          "class": "III",
          "level": "C"
        }
      ]
    }
  ]
};

// 2. rt16-stroke-prevention-cabg.json
// Preoperative strategies to reduce the incidence of stroke in patients undergoing coronary artery bypass grafting
const rt16 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt16-stroke-prevention-cabg",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 16",
  "title": {
    "en": "Preoperative strategies to reduce the incidence of stroke in patients undergoing coronary artery bypass grafting",
    "ru": "Предоперационные стратегии снижения частоты инсульта у пациентов, подвергающихся коронарному шунтированию"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Preoperative stroke reduction in CABG",
        "ru": "Предоперационная профилактика инсульта при КШ"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "In patients undergoing CABG, carotid DUS is recommended in patients with recent (<6 months) history of stroke/TIA.",
            "ru": "У пациентов, подвергающихся КШ, дуплексное ультразвуковое сканирование сонных артерий рекомендуется при недавнем (<6 месяцев) анамнезе инсульта/ТИА."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r02",
          "text": {
            "en": "In patients with no recent (<6 months) history of TIA/stroke, carotid DUS may be considered before CABG in the following cases: age ≥70 years, multivessel coronary artery disease, concomitant LEAD, or carotid bruit.",
            "ru": "У пациентов без недавнего (<6 месяцев) анамнеза ТИА/инсульта дуплексное ультразвуковое сканирование сонных артерий перед КШ может быть рассмотрено в следующих случаях: возраст ≥70 лет, многососудистое поражение коронарных артерий, сопутствующее заболевание артерий нижних конечностей или шум над сонными артериями."
          },
          "class": "IIb",
          "level": "B"
        },
        {
          "id": "r03",
          "text": {
            "en": "Screening for carotid stenosis is not indicated in patients requiring urgent CABG with no recent stroke/TIA.",
            "ru": "Скрининг стеноза сонных артерий не показан пациентам, требующим экстренного КШ, без недавнего инсульта/ТИА в анамнезе."
          },
          "class": "III",
          "level": "C"
        }
      ]
    }
  ]
};

// 3. rt17-repeat-revascularization.json
// Recommendations on repeat revascularization
const rt17 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt17-repeat-revascularization",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 17",
  "title": {
    "en": "Recommendations on repeat revascularization",
    "ru": "Рекомендации по повторной реваскуляризации"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-early-graft-failure",
      "title": {
        "en": "Early post-operative ischaemia and graft failure",
        "ru": "Ранняя послеоперационная ишемия и дисфункция шунта"
      },
      "rows": [
        {
          "id": "r_early_01",
          "text": {
            "en": "Coronary angiography post-CABG is recommended for patients with: symptoms of ischaemia and/or abnormal biomarkers suggestive of perioperative MI; ischaemic ECG changes indicating large area of risk; new significant wall motion abnormalities; or haemodynamic instability.",
            "ru": "Коронарография после КШ рекомендуется пациентам при наличии: симптомов ишемии и/или патологических биомаркеров, указывающих на периоперационный ИМ; ишемических изменений ЭКГ, свидетельствующих о большой зоне риска; новых выраженных нарушений локальной сократимости; либо гемодинамической нестабильности."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r_early_02",
          "text": {
            "en": "It is recommended that either emergency reoperation or PCI is decided upon by ad hoc consultation in the Heart Team, based on the feasibility of revascularization, area at risk, comorbidities, and clinical status.",
            "ru": "Рекомендуется принимать решение об экстренной повторной операции или ЧКВ на основании экстренного (ad hoc) консилиума Heart Team с учетом технической выполнимости реваскуляризации, зоны риска, коморбидности и клинического статуса."
          },
          "class": "I",
          "level": "C"
        }
      ]
    },
    {
      "id": "sec-disease-progression",
      "title": {
        "en": "Disease progression and late graft failure",
        "ru": "Прогрессирование заболевания и поздняя несостоятельность шунтов"
      },
      "rows": [
        {
          "id": "r_late_01",
          "text": {
            "en": "Repeat revascularization is indicated in patients with a large area of ischaemia or severe symptoms despite medical therapy.",
            "ru": "Повторная реваскуляризация показана пациентам с большой зоной ишемии или тяжелыми симптомами, несмотря на медикаментозную терапию."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_late_02",
          "text": {
            "en": "If considered safe, PCI should be considered as first choice over CABG.",
            "ru": "Если вмешательство признано безопасным, ЧКВ следует рассматривать как метод первого выбора по сравнению с КШ."
          },
          "class": "IIa",
          "level": "C"
        }
      ]
    },
    {
      "id": "sec-procedural-modalities-cabg",
      "title": {
        "en": "Procedural aspects of the revascularization modalities: CABG",
        "ru": "Процедурные аспекты методов реваскуляризации: КШ"
      },
      "rows": [
        {
          "id": "r_cabg_01",
          "text": {
            "en": "IMA is the conduit of choice for redo CABG in patients in whom the IMA was not used previously.",
            "ru": "Внутренняя грудная артерия (ВГА) является кондуитом выбора для повторного КШ у пациентов, у которых она не использовалась ранее."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_cabg_02",
          "text": {
            "en": "Redo CABG should be considered for patients without a patent IMA graft to the LAD.",
            "ru": "Повторное КШ следует рассмотреть у пациентов без функционирующего маммарокоронарного шунта к ПМЖВ."
          },
          "class": "IIa",
          "level": "B"
        }
      ]
    },
    {
      "id": "sec-procedural-modalities-pci",
      "title": {
        "en": "Procedural aspects of the revascularization modalities: PCI",
        "ru": "Процедурные аспекты методов реваскуляризации: ЧКВ"
      },
      "rows": [
        {
          "id": "r_pci_01",
          "text": {
            "en": "Distal protection devices should be considered for PCI of SVG lesions.",
            "ru": "Устройства дистальной защиты следует рассмотреть при ЧКВ на венозных шунтах (SVG)."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r_pci_02",
          "text": {
            "en": "PCI of the bypassed native artery should be considered over PCI of the bypass graft.",
            "ru": "ЧКВ на шунтированной нативной коронарной артерии следует рассматривать предпочтительнее ЧКВ на самом шунте."
          },
          "class": "IIa",
          "level": "C"
        }
      ]
    },
    {
      "id": "sec-restenosis",
      "title": {
        "en": "Restenosis",
        "ru": "Рестеноз"
      },
      "rows": [
        {
          "id": "r_rest_01",
          "text": {
            "en": "DES are recommended for the treatment of in-stent restenosis of BMS or DES.",
            "ru": "Стенты с лекарственным покрытием (DES) рекомендуются для лечения рестеноза внутри голометаллических стентов (BMS) или DES."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_rest_02",
          "text": {
            "en": "Drug-coated balloons are recommended for the treatment of in-stent restenosis of BMS or DES.",
            "ru": "Баллоны с лекарственным покрытием рекомендуются для лечения рестеноза внутри голометаллических стентов (BMS) или DES."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r_rest_03",
          "text": {
            "en": "In patients with recurrent episodes of diffuse in-stent restenosis, CABG should be considered by the Heart Team over a new PCI attempt.",
            "ru": "У пациентов с рецидивирующими эпизодами диффузного рестеноза внутри стента команде Heart Team следует рассмотреть КШ предпочтительнее новой попытки ЧКВ."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_rest_04",
          "text": {
            "en": "IVUS and/or OCT should be considered to detect stent-related mechanical problems leading to restenosis.",
            "ru": "ВСУЗИ и/или ОКТ следует рассмотреть для выявления связанных со стентом механических причин, приведших к рестенозу."
          },
          "class": "IIa",
          "level": "C"
        }
      ]
    }
  ]
};

// 4. rt18-ventricular-arrhythmias.json
// Recommendations for the prevention of ventricular arrhythmias by revascularization
const rt18 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt18-ventricular-arrhythmias",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 18",
  "title": {
    "en": "Recommendations for the prevention of ventricular arrhythmias by revascularization",
    "ru": "Рекомендации по профилактике желудочковых аритмий с помощью реваскуляризации"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Ventricular arrhythmias and revascularization",
        "ru": "Желудочковые аритмии и реваскуляризация"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "A primary PCI strategy is recommended in patients with resuscitated cardiac arrest and an ECG consistent with STEMI.",
            "ru": "Стратегия первичного ЧКВ рекомендуется пациентам после успешной реанимации при остановке сердца с признаками ИМпST на ЭКГ."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r02",
          "text": {
            "en": "Urgent angiography (and PCI if indicated) should be considered in patients with resuscitated cardiac arrest without diagnostic ST-segment elevation but with a high suspicion of ongoing myocardial ischaemia.",
            "ru": "Неотложную коронарографию (и ЧКВ при наличии показаний) следует рассмотреть у пациентов после успешной реанимации без диагностического подъема ST, но с высоким подозрением на продолжающуюся ишемию миокарда."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r03",
          "text": {
            "en": "In patients with electrical storm, urgent coronary angiography and revascularization (as required) should be considered.",
            "ru": "У пациентов с электрическим штормом следует рассмотреть проведение неотложной коронарографии и реваскуляризации (при необходимости)."
          },
          "class": "IIa",
          "level": "C"
        }
      ]
    }
  ]
};

// 5. rt19-atrial-fibrillation.json
// Recommendations for the prevention and treatment of atrial fibrillation in the setting of myocardial revascularization
const rt19 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt19-atrial-fibrillation",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 19",
  "title": {
    "en": "Recommendations for the prevention and treatment of atrial fibrillation in the setting of myocardial revascularization",
    "ru": "Рекомендации по профилактике и лечению фибрилляции предсердий в контексте реваскуляризации миокарда"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Prevention and treatment of AF in revascularization",
        "ru": "Профилактика и лечение ФП при реваскуляризации"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "Perioperative oral beta-blocker therapy is recommended for the prevention of post-operative AF after CABG surgery.",
            "ru": "Периоперационная терапия пероральными бета-блокаторами рекомендуется для профилактики послеоперационной ФП после операции КШ."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r02",
          "text": {
            "en": "Restoration of sinus rhythm by electrical cardioversion or antiarrhythmic drugs is recommended in post-operative AF with haemodynamic instability.",
            "ru": "Восстановление синусового ритма путем электрической кардиоверсии или антиаритмических препаратов рекомендуется при послеоперационной ФП с гемодинамической нестабильностью."
          },
          "class": "I",
          "level": "C"
        },
        {
          "id": "r03",
          "text": {
            "en": "Perioperative amiodarone should be considered as prophylactic therapy to prevent AF after CABG surgery.",
            "ru": "Периоперационное применение амиодарона следует рассмотреть в качестве профилактической терапии для предотвращения ФП после КШ."
          },
          "class": "IIa",
          "level": "A"
        },
        {
          "id": "r04",
          "text": {
            "en": "Long-term anticoagulation should be considered in patients with AF after CABG or PCI who are at risk of stroke, considering the individual stroke and bleeding risk.",
            "ru": "Длительную антикоагулянтную терапию следует рассмотреть у пациентов с ФП после КШ или ЧКВ, имеющих риск инсульта, с учетом индивидуального риска инсульта и кровотечений."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r05",
          "text": {
            "en": "Rate control and anticoagulation should be considered as the initial management of asymptomatic post-operative AF.",
            "ru": "Контроль частоты сердечных сокращений и антикоагулянтная терапия должны рассматриваться в качестве начальной тактики при бессимптомной послеоперационной ФП."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r06",
          "text": {
            "en": "Antiarrhythmic drugs should be considered for symptomatic post-operative AF after CABG or PCI in an attempt to restore sinus rhythm.",
            "ru": "Антиаритмические препараты следует рассмотреть при симптомной послеоперационной ФП после КШ или ЧКВ с целью восстановления синусового ритма."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r07",
          "text": {
            "en": "Surgical occlusion or exclusion of the LAA may be considered for stroke prevention in patients with AF undergoing CABG surgery.",
            "ru": "Хирургическая окклюзия или исключение ушка левого предсердия (УЛП) может быть рассмотрена для профилактики инсульта у пациентов с ФП, подвергающихся операции КШ."
          },
          "class": "IIb",
          "level": "B"
        }
      ]
    }
  ]
};

// 6. rt20-cabg-procedural-aspects.json
// Recommendations on procedural aspects of coronary artery bypass grafting
const rt20 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt20-cabg-procedural-aspects",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 20",
  "title": {
    "en": "Recommendations on procedural aspects of coronary artery bypass grafting",
    "ru": "Рекомендации по процедурным аспектам коронарного шунтирования"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-general",
      "title": {
        "en": "General considerations",
        "ru": "Общие положения"
      },
      "rows": [
        {
          "id": "r_gen_01",
          "text": {
            "en": "Complete myocardial revascularization is recommended.",
            "ru": "Рекомендуется полная реваскуляризация миокарда."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_gen_02",
          "text": {
            "en": "Minimization of aortic manipulation is recommended.",
            "ru": "Рекомендуется минимизация любых манипуляций на аорте."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_gen_03",
          "text": {
            "en": "Routine intraoperative graft flow measurement should be considered.",
            "ru": "Рутинную интраоперационную флоуметрию (измерение кровотока по шунтам) следует рассмотреть."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r_gen_04",
          "text": {
            "en": "CT scans of the ascending aorta should be considered in patients over 70 years of age and/or with signs of extensive generalized atherosclerosis.",
            "ru": "КТ восходящей аорты следует рассмотреть у пациентов старше 70 лет и/или с признаками распространенного генерализованного атеросклероза."
          },
          "class": "IIa",
          "level": "C"
        },
        {
          "id": "r_gen_05",
          "text": {
            "en": "Prior to aortic manipulation, epiaortic ultrasound should be considered to identify atheromatous plaques and select the optimal surgical strategy.",
            "ru": "Перед манипуляциями на аорте следует рассмотреть эпиаортальное УЗИ для выявления атероматозных бляшек и выбора оптимальной хирургической тактики."
          },
          "class": "IIa",
          "level": "C"
        }
      ]
    },
    {
      "id": "sec-conduit",
      "title": {
        "en": "Conduit selection",
        "ru": "Выбор кондуитов"
      },
      "rows": [
        {
          "id": "r_con_01",
          "text": {
            "en": "Arterial grafting with IMA to the LAD system is recommended.",
            "ru": "Рекомендуется артериальное шунтирование внутренней грудной артерией (ВГА) в бассейн ПМЖВ."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_con_02",
          "text": {
            "en": "An additional arterial graft should be considered in appropriate patients.",
            "ru": "Дополнительный артериальный шунт следует рассмотреть у подходящих пациентов."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r_con_03",
          "text": {
            "en": "The use of the radial artery is recommended over the saphenous vein in patients with high-grade coronary artery stenosis (particularly in patients with poor vein grafts; radial artery should not be used if previously catheterized, if Allen test is positive or if calcific degeneration is present).",
            "ru": "Использование лучевой артерии рекомендуется предпочтительнее подкожной вены у пациентов с тяжелым стенозом коронарных артерий (особенно при плохом качестве венозных шунтов; лучевая артерия не должна использоваться при предшествующей катетеризации, положительном тесте Аллена или кальцинозе)."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_con_04",
          "text": {
            "en": "BIMA grafting should be considered in patients who do not have a high risk of sternal wound infection (e.g. patients with diabetes mellitus, chronic obstructive pulmonary disease, previous mediastinal radiation, and obesity, particularly when multiples are present).",
            "ru": "Бимаммарокоронарное шунтирование (BIMA) следует рассмотреть у пациентов без высокого риска инфекции грудины (риск повышен при сахарном диабете, ХОБЛ, лучевой терапии средостения и ожирении, особенно при их сочетании)."
          },
          "class": "IIa",
          "level": "B"
        }
      ]
    },
    {
      "id": "sec-vessel-harvesting",
      "title": {
        "en": "Vessel harvesting",
        "ru": "Забор сосудистых трансплантатов"
      },
      "rows": [
        {
          "id": "r_harv_01",
          "text": {
            "en": "Skeletonized IMA dissection is recommended in patients with a high risk of sternal wound infection.",
            "ru": "Скелетированный забор ВГА рекомендуется у пациентов с высоким риском инфекции грудины."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_harv_02",
          "text": {
            "en": "Endoscopic vein harvesting, if performed by experienced surgeons, should be considered to reduce the incidence of wound complications.",
            "ru": "Эндоскопический забор вены при выполнении опытными хирургами следует рассмотреть для снижения частоты раневых осложнений."
          },
          "class": "IIa",
          "level": "A"
        },
        {
          "id": "r_harv_03",
          "text": {
            "en": "No-touch vein harvesting should be considered when an open technique is used.",
            "ru": "Методику «no-touch» («без прикосновения») следует рассмотреть при использовании открытой техники забора вены."
          },
          "class": "IIa",
          "level": "B"
        }
      ]
    },
    {
      "id": "sec-minimally-invasive",
      "title": {
        "en": "Minimally invasive techniques",
        "ru": "Малоинвазивные методики"
      },
      "rows": [
        {
          "id": "r_min_01",
          "text": {
            "en": "Off-pump CABG and preferably no-touch techniques on the ascending aorta, by experienced operators, are recommended in patients with significant atherosclerotic aortic disease.",
            "ru": "КШ на работающем сердце (off-pump) и предпочтительно методики без манипуляций на восходящей аорте (no-touch) опытными хирургами рекомендуются у пациентов с выраженным атеросклерозом аорты."
          },
          "class": "I",
          "level": "B"
        },
        {
          "id": "r_min_02",
          "text": {
            "en": "Off-pump CABG should be considered for subgroups of high-risk patients by experienced off-pump teams.",
            "ru": "КШ на работающем сердце следует рассмотреть в подгруппах пациентов высокого риска при наличии опытных off-pump хирургических бригад."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r_min_03",
          "text": {
            "en": "Where expertise exists, minimally invasive CABG through limited thoracic access should be considered in patients with isolated LAD lesions or in the context of hybrid revascularization.",
            "ru": "При наличии опыта миниинвазивное КШ через миниторакотомию следует рассмотреть у пациентов с изолированным поражением ПМЖВ или в рамках гибридной реваскуляризации."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r_min_04",
          "text": {
            "en": "Hybrid procedures, defined as consecutive or combined surgical and percutaneous revascularization, may be considered in specific patient subsets at experienced centres.",
            "ru": "Гибридные процедуры (последовательная или комбинированная хирургическая и чрескожная реваскуляризация) могут быть рассмотрены в специфических группах пациентов в опытных центрах."
          },
          "class": "IIb",
          "level": "B"
        }
      ]
    }
  ]
};

// 7. rt21-intravascular-imaging-optimization.json
// Recommendations on intravascular imaging for procedural optimization
const rt21 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt21-intravascular-imaging-optimization",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 21",
  "title": {
    "en": "Recommendations on intravascular imaging for procedural optimization",
    "ru": "Рекомендации по внутрисосудистой визуализации для оптимизации процедур"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Intravascular imaging for procedural optimization",
        "ru": "Внутрисосудистая визуализация для процедурной оптимизации"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "IVUS or OCT should be considered in selected patients to optimize stent implantation.",
            "ru": "ВСУЗИ или ОКТ следует рассмотреть у отдельных пациентов для оптимизации имплантации стента."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r02",
          "text": {
            "en": "IVUS should be considered to optimize treatment of unprotected left main lesions.",
            "ru": "ВСУЗИ следует рассмотреть для оптимизации вмешательства при поражениях незащищенного ствола левой коронарной артерии."
          },
          "class": "IIa",
          "level": "B"
        }
      ]
    }
  ]
};

// 8. rt22-stent-access-site.json
// Recommendations on choice of stent and access site
const rt22 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt22-stent-access-site",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 22",
  "title": {
    "en": "Recommendations on choice of stent and access site",
    "ru": "Рекомендации по выбору стента и сосудистого доступа"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Choice of stent and access site",
        "ru": "Выбор стента и доступа"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "DES are recommended over BMS for any PCI irrespective of: clinical presentation, lesion type, planned non-cardiac surgery, anticipated duration of DAPT, concomitant anticoagulant therapy.",
            "ru": "Стенты с лекарственным покрытием (DES) рекомендуются вместо голометаллических стентов (BMS) при любом ЧКВ независимо от: клинической картины, типа поражения, планируемой внесердечной операции, предполагаемой длительности ДАТТ или сопутствующей антикоагулянтной терапии."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r02",
          "text": {
            "en": "Radial access is recommended as the standard approach, unless there are overriding procedural considerations.",
            "ru": "Радиальный доступ рекомендуется в качестве стандартного подхода, за исключением случаев, когда процедурные особенности диктуют необходимость иного доступа."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r03",
          "text": {
            "en": "BRS are currently not recommended for clinical use outside of clinical studies.",
            "ru": "Биорезорбируемые скаффолды (BRS) в настоящее время не рекомендуются для клинического применения вне рамок клинических исследований."
          },
          "class": "III",
          "level": "C"
        }
      ]
    }
  ]
};

// 9. rt23-specific-lesion-subsets.json
// Recommendations on specific lesion subsets
const rt23 = {
  "schemaVersion": 1,
  "id": "esc-revasc-2018.rt23-specific-lesion-subsets",
  "guidelineId": "esc-revasc-2018",
  "number": "Rec Table 23",
  "title": {
    "en": "Recommendations on specific lesion subsets",
    "ru": "Рекомендации по специфическим типам поражений"
  },
  "type": "recommendations",
  "sections": [
    {
      "id": "sec-01",
      "title": {
        "en": "Specific lesion subsets",
        "ru": "Специфические анатомические подтипы поражений"
      },
      "rows": [
        {
          "id": "r01",
          "text": {
            "en": "Stent implantation in the main vessel only, followed by provisional balloon angioplasty with or without stenting of the side branch, is recommended for PCI of bifurcation lesions.",
            "ru": "Имплантация стента только в основной сосуд с последующей провизорной баллонной ангиопластикой со стентированием боковой ветви или без него рекомендуется при ЧКВ бифуркационных поражений."
          },
          "class": "I",
          "level": "A"
        },
        {
          "id": "r02",
          "text": {
            "en": "Percutaneous revascularization of CTOs should be considered in patients with angina resistant to medical therapy or with a large area of documented ischaemia in the territory of the occluded vessel.",
            "ru": "Чрескожную реваскуляризацию при хронических тотальных окклюзиях (ХТО) следует рассмотреть у пациентов со стенокардией, резистентной к медикаментозной терапии, или с большой площадью документированной ишемии в бассейне окклюзированной артерии."
          },
          "class": "IIa",
          "level": "B"
        },
        {
          "id": "r03",
          "text": {
            "en": "In true bifurcation lesions of the left main, the double-kissing crush technique may be preferred over provisional T-stenting.",
            "ru": "При истинных бифуркационных поражениях ствола левой коронарной артерии методика DK-crush может рассматриваться как предпочтительная по сравнению с провизорным T-стентированием."
          },
          "class": "IIb",
          "level": "B"
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(baseDir, 'rt15-carotid-stenosis-cabg.json'), JSON.stringify(rt15, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt16-stroke-prevention-cabg.json'), JSON.stringify(rt16, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt17-repeat-revascularization.json'), JSON.stringify(rt17, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt18-ventricular-arrhythmias.json'), JSON.stringify(rt18, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt19-atrial-fibrillation.json'), JSON.stringify(rt19, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt20-cabg-procedural-aspects.json'), JSON.stringify(rt20, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt21-intravascular-imaging-optimization.json'), JSON.stringify(rt21, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt22-stent-access-site.json'), JSON.stringify(rt22, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDir, 'rt23-specific-lesion-subsets.json'), JSON.stringify(rt23, null, 2), 'utf8');

console.log('Successfully generated rt15 through rt23 for esc-revasc-2018');
