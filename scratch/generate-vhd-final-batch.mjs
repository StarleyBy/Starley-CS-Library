import fs from 'fs';
import path from 'path';

const outDir = 'data/guidelines/aha-vhd-2020';

const files = {};

// rt54: Recommendations for Medical Therapy for IE
files['rt54-medical-therapy-for-ie.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt54-medical-therapy-for-ie',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 54',
  title: {
    en: 'Recommendations for Medical Therapy for IE',
    ru: 'Рекомендации по медикаментозной терапии инфекционного эндокардита'
  },
  tags: [
    'vhd',
    'ie',
    'infective-endocarditis',
    'medical-therapy',
    'antibiotics',
    'anticoagulation',
    'substance-use'
  ],
  sections: [
    {
      id: 'sec-medical-therapy-for-ie',
      title: {
        en: 'Medical Therapy for IE',
        ru: 'Медикаментозная терапия инфекционного эндокардита'
      },
      rows: [
        {
          id: 'r01-appropriate-antibiotic-therapy-after-blood-cultures',
          text: {
            en: 'In patients with IE, appropriate antibiotic therapy should be initiated and continued after blood cultures are obtained, with guidance from antibiotic sensitivity data and the infectious disease experts on the MDT.',
            ru: 'У пациентов с ИЭ адекватная антибактериальная терапия должна быть начата и продолжена после взятия образцов для посева крови с учетом данных об антибиотикочувствительности и рекомендаций экспертов по инфекционным болезням в составе мультидисциплинарной команды (MDT).'
          },
          class: 'I',
          level: 'B-NR',
          refs: [1, 2, 3, 4, 5, 6, 7]
        },
        {
          id: 'r02-drug-use-referral-opioid-substitution-therapy',
          text: {
            en: 'Patients with suspected or confirmed IE associated with drug use should be referred to addiction treatment for opioid substitution therapy.',
            ru: 'Пациенты с подозрением на ИЭ или подтвержденным ИЭ, связанным с употреблением инъекционных наркотиков, должны быть направлены на наркологическое лечение для проведения опиоидной заместительной терапии.'
          },
          class: 'I',
          level: 'B-R',
          refs: [8, 9, 10]
        },
        {
          id: 'r03-cerebral-embolism-stroke-temporary-discontinue-anticoagulation',
          text: {
            en: 'In patients with IE and with evidence of cerebral embolism or stroke, regardless of the other indications for anticoagulation, it is reasonable to temporarily discontinue anticoagulation.',
            ru: 'У пациентов с ИЭ и признаками церебральной эмболии или инсульта, независимо от наличия других показаний к антикоагулянтной терапии, целесообразно временно прекратить прием антикоагулянтов.'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
        },
        {
          id: 'r04-left-sided-ie-stable-switch-oral-antibiotic-therapy',
          text: {
            en: 'In patients with left-sided IE caused by streptococcus, *Enterococcus faecalis*, *S. aureus*, or coagulase-negative staphylococci deemed stable by the MDT after initial intravenous antibiotics, a change to oral antibiotic therapy may be considered if TEE before the switch to oral therapy shows no paravalvular infection, if frequent and appropriate follow-up can be assured by the care team, and if a follow-up TEE can be performed 1 to 3 days before the completion of the antibiotic course.',
            ru: 'У пациентов с левосторонним ИЭ, вызванным стрептококками, *Enterococcus faecalis*, *S. aureus* или коагулазонегативными стафилококками, признанных мультидисциплинарной командой (MDT) стабильными после начального курса внутривенной антибиотикотерапии, может быть рассмотрен переход на пероральную антибактериальную терапию, если ЧП-ЭхоКГ перед переходом не выявляет паравальвулярного распространения инфекции, команда врачей может обеспечить тщательное наблюдение, а контрольная ЧП-ЭхоКГ может быть выполнена за 1–3 дня до завершения курса антибиотиков.'
          },
          class: 'IIb',
          level: 'B-R',
          refs: [25]
        },
        {
          id: 'r05-vka-at-time-of-ie-temporary-discontinuation',
          text: {
            en: 'In patients receiving VKA anticoagulation at the time of IE diagnosis, temporary discontinuation of VKA anticoagulation may be considered.',
            ru: 'У пациентов, принимающих антагонисты витамина К (АВК/VKA) на момент установления диагноза ИЭ, может быть рассмотрена временная отмена терапии АВК.'
          },
          class: 'IIb',
          level: 'B-NR',
          refs: [13, 26, 27, 28, 29, 30, 31, 32, 33, 34]
        },
        {
          id: 'r06-known-vhd-no-antibiotics-before-blood-cultures-unexplained-fever',
          text: {
            en: 'Patients with known VHD should not receive antibiotics before blood cultures are obtained for unexplained fever.',
            ru: 'Пациенты с установленными клапанными пороками сердца не должны получать антибактериальную терапию до забора крови на гемокультуру (посев крови) при лихорадке неясного генеза.'
          },
          class: 'III-harm',
          level: 'C-LD',
          refs: [22, 35, 36]
        }
      ]
    }
  ],
  source: {
    expectedRows: 6
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// t25: Major and Minor Criteria in the Modified Duke Criteria for the Diagnosis of IE
files['t25-major-minor-modified-duke-criteria-ie.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.t25-major-minor-modified-duke-criteria-ie',
  guidelineId: 'aha-vhd-2020',
  type: 'grid',
  number: 'Table 25',
  title: {
    en: 'Major and Minor Criteria in the Modified Duke Criteria for the Diagnosis of IE',
    ru: 'Большие и малые критерии в модифицированных критериях Дьюка (Modified Duke Criteria) для диагностики инфекционного эндокардита'
  },
  tags: [
    'vhd',
    'ie',
    'infective-endocarditis',
    'duke-criteria',
    'major-criteria',
    'minor-criteria',
    'blood-cultures',
    'echocardiogram'
  ],
  columns: [
    {
      id: 'category',
      title: {
        en: 'Criterion Type',
        ru: 'Тип критерия'
      }
    },
    {
      id: 'definition',
      title: {
        en: 'Definition and Manifestations',
        ru: 'Определение и клинические проявления'
      }
    }
  ],
  rows: [
    {
      id: 'row-major-blood-culture',
      cells: [
        {
          text: {
            en: 'Major criteria: Blood culture positive for IE',
            ru: 'Большие критерии: Положительная гемокультура (посев крови) на ИЭ'
          }
        },
        {
          text: {
            en: '**Typical microorganisms consistent with IE from 2 separate blood cultures:**\n• *Viridans streptococci*, *Streptococcus bovis*, HACEK group (*Haemophilus* spp, *Actinobacillus actinomycetemcomitans*, *Cardiobacterium hominis*, *Eikenella* spp, and *Kingella kingae*), *S. aureus*; or community-acquired enterococci, in the absence of a primary focus; or\n\n**Microorganisms consistent with IE from persistently positive blood culture results, defined as follows:**\n• At least 2 positive culture results of blood samples drawn 12 h apart; or\n• All of 3 or most of ≥4 separate culture samples of blood (with first and last samples drawn at least 1 h apart);\n\n**Single positive blood culture result for *Coxiella burnetii* or antiphase I IgG antibody titer >1:800**',
            ru: '**Типичные для ИЭ микроорганизмы, выделенные из 2 раздельных посевов крови:**\n• Зеленящие стрептококки (*Viridans streptococci*), *Streptococcus bovis*, бактерии группы HACEK (*Haemophilus* spp., *Actinobacillus actinomycetemcomitans*, *Cardiobacterium hominis*, *Eikenella* spp., *Kingella kingae*), *S. aureus*; или внебольничные энтерококки при отсутствии первичного очага инфекции; или\n\n**Микроорганизмы, ассоциированные с ИЭ, выделенные из повторно положительных посевов крови:**\n• Не менее 2 положительных результатов посева крови, взятых с интервалом 12 часов; или\n• Все 3 или большинство из ≥4 отдельных посевов крови (первый и последний забор с интервалом не менее 1 часа);\n\n**Однократный положительный посев крови на *Coxiella burnetii* или титр антител IgG к антигенам I фазы >1:800**'
          }
        }
      ]
    },
    {
      id: 'row-major-endocardial',
      cells: [
        {
          text: {
            en: 'Major criteria: Evidence of endocardial involvement',
            ru: 'Большие критерии: Доказательства поражения эндокарда'
          }
        },
        {
          text: {
            en: '**Echocardiogram positive for IE defined as follows:**\n• Oscillating intracardiac mass on valve or supporting structures, in the path of regurgitant jets, or on implanted material in the absence of an alternative anatomic explanation\n• Abscess; or\n• New partial dehiscence of prosthetic valve\n• New valvular regurgitation (worsening or changing of preexisting murmur not sufficient)',
            ru: '**Положительные эхокардиографические признаки ИЭ:**\n• Осциллирующее внутрисердечное образование (вегетация) на клапане или поддерживающих структурах, на пути регургитирующей струи или на имплантированном материале при отсутствии альтернативного анатомического объяснения;\n• Абсцесс; или\n• Вновь возникшая частичная дегисценция (расхождение швов) клапанного протеза;\n• Вновь возникшая клапанная регургитация (нарастания или изменения уже существовавшего шума недостаточно)'
          }
        }
      ]
    },
    {
      id: 'row-minor-predisposition',
      cells: [
        {
          text: {
            en: 'Minor criteria: Predisposition',
            ru: 'Малые критерии: Предрасположенность'
          }
        },
        {
          text: {
            en: 'Predisposition, predisposing heart condition, or injection drug use',
            ru: 'Предрасположенность: предшествующее кардиальное заболевание/порок сердца или инъекционное употребление наркотиков'
          }
        }
      ]
    },
    {
      id: 'row-minor-fever',
      cells: [
        {
          text: {
            en: 'Minor criteria: Fever',
            ru: 'Малые критерии: Лихорадка'
          }
        },
        {
          text: {
            en: 'Fever, temperature >38°C (100.4°F)',
            ru: 'Лихорадка с температурой тела >38,0°C'
          }
        }
      ]
    },
    {
      id: 'row-minor-vascular',
      cells: [
        {
          text: {
            en: 'Minor criteria: Vascular phenomena',
            ru: 'Малые критерии: Сосудистые феномены'
          }
        },
        {
          text: {
            en: 'Vascular phenomena, major arterial emboli, septic pulmonary infarcts, mycotic aneurysm, intracranial hemorrhage, conjunctival hemorrhages, and Janeway lesions',
            ru: 'Сосудистые феномены: эмболии крупных артерий, септические инфаркты легких, микотические аневризмы, внутричерепные кровоизлияния, кровоизлияния в конъюнктиву и пятна Джейнуэя'
          }
        }
      ]
    },
    {
      id: 'row-minor-immunological',
      cells: [
        {
          text: {
            en: 'Minor criteria: Immunological phenomena',
            ru: 'Малые критерии: Иммунологические феномены'
          }
        },
        {
          text: {
            en: 'Immunological phenomena: glomerulonephritis, Osler\'s nodes, Roth\'s spots, and rheumatoid factor',
            ru: 'Иммунологические феномены: гломерулонефрит, узелки Ослера, пятна Рота и ревматоидный фактор'
          }
        }
      ]
    },
    {
      id: 'row-minor-microbiological',
      cells: [
        {
          text: {
            en: 'Minor criteria: Microbiological evidence',
            ru: 'Малые критерии: Микробиологические доказательства'
          }
        },
        {
          text: {
            en: 'Microbiological evidence: positive blood culture but does not meet a major criterion as noted above* or serological evidence of active infection with organism consistent with IE',
            ru: 'Микробиологические данные: положительный посев крови, не соответствующий большому критерию*, или серологические маркеры активной инфекции, вызванной типичным для ИЭ возбудителем'
          }
        }
      ]
    }
  ],
  footnotes: {
    a: {
      en: '*Excludes single positive cultures for coagulase-negative staphylococci and organisms that do not cause IE. IE indicates infective endocarditis; IgG, immunoglobulin G; and spp, species. Adapted from Durack DT, et al., and Kupferwasser LI, et al.',
      ru: '*Исключая единичные положительные посевы на коагулазонегативные стафилококки и микроорганизмы, не вызывающие ИЭ. ИЭ — инфекционный эндокардит; IgG — иммуноглобулин G; spp. — виды. Адаптировано из Durack DT, et al., и Kupferwasser LI, et al.'
    }
  },
  source: {
    expectedRows: 7
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt55: Recommendations for Intervention for IE
files['rt55-intervention-for-ie.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt55-intervention-for-ie',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 55',
  title: {
    en: 'Recommendations for Intervention for IE',
    ru: 'Рекомендации по хирургическому и инвазивному лечению инфекционного эндокардита'
  },
  tags: [
    'vhd',
    'ie',
    'infective-endocarditis',
    'surgery',
    'heart-valve-team',
    'heart-failure',
    'abscess',
    'stroke',
    'vegetation'
  ],
  sections: [
    {
      id: 'sec-intervention-for-ie',
      title: {
        en: 'Intervention for IE',
        ru: 'Хирургическое и инвазивное лечение инфекционного эндокардита'
      },
      rows: [
        {
          id: 'r01-timing-surgical-intervention-heart-valve-team',
          text: {
            en: 'Decisions about the timing of surgical intervention for IE should be made by a Heart Valve Team.',
            ru: 'Решения о сроках хирургического вмешательства при ИЭ должны приниматься мультидисциплинарной клапанной командой (Heart Valve Team).'
          },
          class: 'I',
          level: 'B-NR',
          refs: [1, 2, 3, 4, 5, 6]
        },
        {
          id: 'r02-valve-dysfunction-hf-early-surgery',
          text: {
            en: 'In patients with IE who present with valve dysfunction resulting in symptoms of HF, early surgery (during initial hospitalization and before completion of a full therapeutic course of antibiotics) is indicated.',
            ru: 'У пациентов с ИЭ и клапанной дисфункцией, приводящей к развитию симптомов сердечной недостаточности, показано раннее хирургическое вмешательство (во время первичной госпитализации до завершения полного терапевтического курса антибиотикотерапии).'
          },
          class: 'I',
          level: 'B-NR',
          refs: [7, 8, 9, 10]
        },
        {
          id: 'r03-left-sided-ie-s-aureus-fungal-resistant-organisms-early-surgery',
          text: {
            en: 'In patients with left-sided IE caused by *S. aureus*, a fungal organism, or other highly resistant organisms, early surgery (during initial hospitalization and before completion of a full therapeutic course of antibiotics) is indicated.',
            ru: 'У пациентов с левосторонним ИЭ, вызванным *S. aureus*, грибковыми возбудителями или другими высокорезистентными микроорганизмами, показано раннее хирургическое вмешательство (во время первичной госпитализации до завершения полного терапевтического курса антибиотикотерапии).'
          },
          class: 'I',
          level: 'B-NR',
          refs: [7, 8, 15, 28, 29, 30, 31, 32, 33, 34, 35]
        },
        {
          id: 'r04-ie-heart-block-abscess-penetrating-lesions-early-surgery',
          text: {
            en: 'In patients with IE complicated by heart block, annular or aortic abscess, or destructive penetrating lesions, early surgery (during initial hospitalization and before completion of a full therapeutic course of antibiotics) is indicated.',
            ru: 'У пациентов с ИЭ, осложнившимся блокадой сердца, абсцессом фиброзного кольца или корня аорты, либо деструктивными проникающими поражениями, показано раннее хирургическое вмешательство (во время первичной госпитализации до завершения полного терапевтического курса антибиотикотерапии).'
          },
          class: 'I',
          level: 'B-NR',
          refs: [7, 8, 36, 37, 38, 39, 40, 41, 42, 43, 44]
        },
        {
          id: 'r05-persistent-infection-fever-bacteremia-early-surgery',
          text: {
            en: 'In patients with IE and evidence of persistent infection as manifested by persistent bacteremia or fevers lasting >5 days after onset of appropriate antimicrobial therapy, early surgery (during initial hospitalization and before completion of a full therapeutic course of antibiotics) for IE is indicated.',
            ru: 'У пациентов с ИЭ и признаками персистирующей инфекции, проявляющейся персистирующей бактериемией или лихорадкой продолжительностью >5 дней после начала адекватной антибактериальной терапии, показано раннее хирургическое вмешательство (во время первичной госпитализации до завершения полного терапевтического курса антибиотикотерапии).'
          },
          class: 'I',
          level: 'B-NR',
          refs: [7, 8, 15, 23, 28, 45, 46, 47, 48]
        },
        {
          id: 'r06-implanted-cardiac-device-complete-removal',
          text: {
            en: 'In all patients with definite endocarditis and an implanted cardiac electronic device, complete removal of the pacemaker or defibrillator systems, including all leads and the generator, is indicated.',
            ru: 'У всех пациентов с определенным эндокардитом и имплантированным сердечным электронным устройством показано полное удаление системы кардиостимулятора или дефибриллятора, включая все электроды и генератор.'
          },
          class: 'I',
          level: 'B-NR',
          refs: [49, 50, 51, 52, 53, 54, 55]
        },
        {
          id: 'r07-pve-relapsing-infection-surgery',
          text: {
            en: 'For patients with prosthetic valve endocarditis and relapsing infection (defined as recurrence of bacteremia after a complete course of appropriate antibiotics and subsequent negative blood culture results) without other identifiable source of infection, surgery is recommended.',
            ru: 'У пациентов с эндокардитом протезированного клапана (PVE) и рецидивирующей инфекцией (определяемой как возобновление бактериемии после завершения полного курса адекватных антибиотиков и последующих отрицательных посевов крови) при отсутствии иного идентифицируемого источника инфекции рекомендуется хирургическое лечение.'
          },
          class: 'I',
          level: 'C-LD',
          refs: [7]
        },
        {
          id: 'r08-recurrent-endocarditis-iv-drug-use-addiction-medicine',
          text: {
            en: 'In patients with recurrent endocarditis and continued intravenous drug use, consultation with addiction medicine is recommended to discuss the long-term prognosis for the patient\'s refraining from actions that risk reinfection before repeat surgical intervention is considered.',
            ru: 'У пациентов с рецидивирующим эндокардитом и продолжающимся инъекционным употреблением наркотиков рекомендуется консультация специалиста по аддиктологии/наркологии для оценки отдаленного прогноза и готовности пациента отказаться от действий, создающих риск повторного инфицирования, до рассмотрения вопроса о повторном хирургическом вмешательстве.'
          },
          class: 'I',
          level: 'C-LD',
          refs: [56, 57, 58, 59, 60]
        },
        {
          id: 'r09-recurrent-emboli-persistent-vegetations-early-surgery',
          text: {
            en: 'In patients with IE who present with recurrent emboli and persistent vegetations despite appropriate antibiotic therapy, early surgery (during initial hospitalization and before completion of a full therapeutic course of antibiotics) is reasonable.',
            ru: 'У пациентов с ИЭ, у которых возникают рецидивирующие эмболии и сохраняются вегетации, несмотря на адекватную антибактериальную терапию, целесообразно проведение раннего хирургического вмешательства (во время первичной госпитализации до завершения полного терапевтического курса антибиотикотерапии).'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [12, 61, 62, 63, 64, 65, 66]
        },
        {
          id: 'r10-native-left-sided-vegetations-greater-10mm-early-surgery',
          text: {
            en: 'In patients with native left-sided valve endocarditis who exhibit mobile vegetations >10 mm in length (with or without clinical evidence of embolic phenomenon), early surgery (during initial hospitalization and before completion of a full therapeutic course of antibiotics) may be considered.',
            ru: 'У пациентов с эндокардитом нативного клапана левых отделов сердца с подвижными вегетациями длиной >10 мм (с клиническими признаками эмболического феномена или без них) может быть рассмотрено раннее хирургическое вмешательство (во время первичной госпитализации до завершения полного терапевтического курса антибиотикотерапии).'
          },
          class: 'IIb',
          level: 'B-NR',
          refs: [22, 61, 62, 63, 67]
        },
        {
          id: 'r11-stroke-no-hemorrhage-surgery-without-delay',
          text: {
            en: 'In patients with IE and an indication for surgery who have suffered a stroke but have no evidence of intracranial hemorrhage or extensive neurological damage, operation without delay may be considered.',
            ru: 'У пациентов с ИЭ и показаниями к операции, перенесших инсульт без признаков внутричерепного кровоизлияния или обширного неврологического дефицита, может быть рассмотрено проведение операции без задержки.'
          },
          class: 'IIb',
          level: 'B-NR',
          refs: [68, 69, 70, 71]
        },
        {
          id: 'r12-major-stroke-hemorrhage-delay-surgery-4-weeks',
          text: {
            en: 'For patients with IE and major ischemic stroke with extensive neurological damage or intracranial hemorrhage, if the patient is hemodynamically stable, delaying valve surgery for at least 4 weeks may be considered.',
            ru: 'У пациентов с ИЭ и обширным ишемическим инсультом с выраженным неврологическим дефицитом либо внутричерепным кровоизлиянием при гемодинамической стабильности может быть рассмотрена отсрочка операции на клапане не менее чем на 4 недели.'
          },
          class: 'IIb',
          level: 'B-NR',
          refs: [68, 71]
        }
      ]
    }
  ],
  source: {
    expectedRows: 12
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt56: Recommendations for Initial Management of Women With VHD Before and During Pregnancy
files['rt56-initial-management-women-with-vhd-before-during-pregnancy.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt56-initial-management-women-with-vhd-before-during-pregnancy',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 56',
  title: {
    en: 'Recommendations for Initial Management of Women With VHD Before and During Pregnancy',
    ru: 'Рекомендации по начальному ведению женщин с клапанными пороками сердца до и во время беременности'
  },
  tags: [
    'vhd',
    'pregnancy',
    'pre-pregnancy',
    'counseling',
    'heart-valve-team',
    'tte',
    'exercise-testing'
  ],
  sections: [
    {
      id: 'sec-initial-management-women-vhd-pregnancy',
      title: {
        en: 'Initial Management of Women With VHD Before and During Pregnancy',
        ru: 'Начальное ведение женщин с пороками сердца до и во время беременности'
      },
      rows: [
        {
          id: 'r01-suspected-vhd-pre-pregnancy-evaluation-tte',
          text: {
            en: 'Women with suspected valve disease who are considering pregnancy should undergo a clinical evaluation and TTE before pregnancy.',
            ru: 'Женщинам с подозрением на клапанный порок сердца, планирующим беременность, до ее наступления следует пройти клиническое обследование и ТТ-ЭхоКГ.'
          },
          class: 'I',
          level: 'B-NR',
          refs: [1, 2, 3, 4, 5]
        },
        {
          id: 'r02-severe-vhd-pre-pregnancy-counseling-cardiologist',
          text: {
            en: 'Women with severe valve disease (Stages C and D) who are considering pregnancy should undergo pre-pregnancy counseling by a cardiologist with expertise in managing women with VHD during pregnancy.',
            ru: 'Женщинам с тяжелыми клапанными пороками сердца (стадии C и D), планирующим беременность, следует пройти преконцепционное консультирование у кардиолога с опытом ведения женщин с пороками сердца во время беременности.'
          },
          class: 'I',
          level: 'B-NR',
          refs: [1, 2, 3, 4, 5]
        },
        {
          id: 'r03-severe-vhd-pregnancy-tertiary-center-heart-valve-team',
          text: {
            en: 'Pregnant women with severe valve disease (Stages C and D) should be monitored in a tertiary-care center with a dedicated Heart Valve Team of cardiologists, surgeons, anesthesiologists, and maternal-fetal medicine obstetricians with expertise in the management of high-risk cardiac conditions during pregnancy.',
            ru: 'Беременные женщины с тяжелыми пороками сердца (стадии C и D) должны наблюдаться в специализированном высокотехнологичном центре с привлечением специализированной клапанной команды (Heart Valve Team), включающей кардиологов, кардиохирургов, анестезиологов и акушеров-гинекологов по материнско-плодовой медицине с опытом ведения кардиальной патологии высокого риска.'
          },
          class: 'I',
          level: 'B-NR',
          refs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 'r04-asymptomatic-severe-vhd-exercise-testing-before-pregnancy',
          text: {
            en: 'In asymptomatic women with severe valve disease (Stage C1) who are considering pregnancy, exercise testing is reasonable before pregnancy for risk assessment.',
            ru: 'У бессимптомных женщин с тяжелым пороком сердца (стадия C1), планирующих беременность, целесообразно проведение нагрузочного тестирования до беременности для стратификации риска.'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [3, 4, 5, 11, 13, 14, 15]
        }
      ]
    }
  ],
  source: {
    expectedRows: 4
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt57: Recommendations for Medical Therapy of Pregnant Women With VHD
files['rt57-medical-therapy-pregnant-women-with-vhd.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt57-medical-therapy-pregnant-women-with-vhd',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 57',
  title: {
    en: 'Recommendations for Medical Therapy of Pregnant Women With VHD',
    ru: 'Рекомендации по медикаментозной терапии беременных женщин с клапанными пороками сердца'
  },
  tags: [
    'vhd',
    'pregnancy',
    'medical-therapy',
    'beta-blockers',
    'diuretics',
    'acei-contraindicated',
    'arb-contraindicated'
  ],
  sections: [
    {
      id: 'sec-medical-therapy-pregnant-women-vhd',
      title: {
        en: 'Medical Therapy of Pregnant Women With VHD',
        ru: 'Медикаментозная терапия беременных с клапанными пороками сердца'
      },
      rows: [
        {
          id: 'r01-pregnant-vhd-beta-blockers-heart-rate-arrhythmias',
          text: {
            en: 'In pregnant women with VHD, beta-blocker medications are reasonable as required for heart rate control or treatment of arrhythmias.',
            ru: 'У беременных женщин с клапанными пороками сердца прием бета-адреноблокаторов целесообразен при необходимости контроля частоты сердечных сокращений или лечения аритмий.'
          },
          class: 'IIa',
          level: 'C-LD',
          refs: [1, 2, 3, 4]
        },
        {
          id: 'r02-pregnant-vhd-hf-symptoms-diuretics',
          text: {
            en: 'In pregnant women with VHD and HF symptoms (Stage D), diuretic medications are reasonable if needed for volume overload.',
            ru: 'У беременных женщин с клапанными пороками сердца и симптомами сердечной недостаточности (стадия D) целесообразно применение диуретиков при признаках объемной перегрузки.'
          },
          class: 'IIa',
          level: 'C-LD',
          refs: [7, 8]
        },
        {
          id: 'r03-pregnant-vhd-ace-inhibitors-arbs-harm',
          text: {
            en: 'In pregnant women with VHD, ACE inhibitors and ARBs should not be given because of fetal risk.',
            ru: 'Беременным женщинам с клапанными пороками сердца ингибиторы АПФ и блокаторы рецепторов ангиотензина (БРА) назначать нельзя из-за фетотоксического риска для плода.'
          },
          class: 'III-harm',
          level: 'B-NR',
          refs: [6, 9, 10, 11]
        }
      ]
    }
  ],
  source: {
    expectedRows: 3
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt58: Recommendations for Pre-Pregnancy Intervention in Women With VHD
files['rt58-pre-pregnancy-intervention-women-with-vhd.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt58-pre-pregnancy-intervention-women-with-vhd',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 58',
  title: {
    en: 'Recommendations for Pre-Pregnancy Intervention in Women With VHD',
    ru: 'Рекомендации по вмешательствам до наступления беременности у женщин с клапанными пороками сердца'
  },
  tags: [
    'vhd',
    'pregnancy',
    'pre-pregnancy',
    'intervention',
    'pmbc',
    'bioprosthetic-vs-mechanical',
    'aortic-stenosis',
    'mitral-stenosis',
    'mitral-repair'
  ],
  sections: [
    {
      id: 'sec-pre-pregnancy-intervention-women-vhd',
      title: {
        en: 'Pre-Pregnancy Intervention in Women With VHD',
        ru: 'Вмешательства до наступления беременности у женщин с клапанными пороками'
      },
      rows: [
        {
          id: 'r01-symptomatic-severe-vhd-intervention-before-pregnancy',
          text: {
            en: 'In symptomatic women with severe VHD who are considering pregnancy, intervention before pregnancy is recommended on the basis of standard indications.',
            ru: 'У женщин с симптомами тяжелого клапанного порока сердца, планирующих беременность, рекомендуется выполнение вмешательства до наступления беременности на основании стандартных показаний.'
          },
          class: 'I',
          level: 'B-NR',
          refs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        },
        {
          id: 'r02-valve-choice-shared-decision-making-mechanical-vs-bioprosthetic',
          text: {
            en: 'In women who require a valve intervention before pregnancy, the choice of prosthetic valve should be based on a shared decision-making process that accounts for the patient\'s values and preferences, including discussion of the risks of mechanical valves during pregnancy and the reduced durability of bioprosthetic valves in young women.',
            ru: 'У женщин, нуждающихся в протезировании клапана до наступления беременности, выбор типа протеза должен основываться на процессе совместного принятия решений с учетом ценностей и предпочтений пациентки, включая обсуждение рисков механических протезов при беременности и сниженной долговечности биологических протезов у молодых женщин.'
          },
          class: 'I',
          level: 'C-EO'
        },
        {
          id: 'r03-asymptomatic-severe-rheumatic-ms-pmbc-before-pregnancy',
          text: {
            en: 'In asymptomatic women with severe rheumatic MS (mitral valve area ≤1.5 cm^2, Stage C1) who are considering pregnancy, PMBC at a Comprehensive Valve Center is reasonable before pregnancy for those who have favorable valve morphology.',
            ru: 'У бессимптомных женщин с тяжелым ревматическим митральным стенозом (площадь отверстия митрального клапана ≤1,5 см², стадия C1), планирующих беременность, при благоприятной морфологии клапана целесообразно выполнение чрескожной митральной баллонной комиссуротомии (PMBC) в экспертном кардиохирургическом центре (Comprehensive Valve Center) до наступления беременности.'
          },
          class: 'IIa',
          level: 'C-LD',
          refs: [1, 2, 3, 4, 5, 12, 13]
        },
        {
          id: 'r04-women-childbearing-age-bioprosthetic-preferred-over-mechanical',
          text: {
            en: 'In women of childbearing age who require valve replacement, bioprosthetic valves are preferred over mechanical valves because of the increased maternal and fetal risks of mechanical heart valves in pregnancy.',
            ru: 'У женщин детородного возраста, нуждающихся в протезировании клапана, биологические протезы предпочтительнее механических из-за повышенного риска материнских и перинатальных осложнений при наличии механических клапанов во время беременности.'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [14]
        },
        {
          id: 'r05-asymptomatic-severe-as-intervention-before-pregnancy',
          text: {
            en: 'In asymptomatic women with severe AS (aortic velocity ≥4.0 m/s or mean pressure gradient ≥40 mm Hg, Stage C) who are considering pregnancy, valve intervention before pregnancy is reasonable.',
            ru: 'У бессимптомных женщин с тяжелым аортальным стенозом (скорость кровотока на аортальном клапане ≥4,0 м/с или средний градиент давления ≥40 мм рт. ст., стадия C), планирующих беременность, вмешательство на клапане до наступления беременности целесообразно.'
          },
          class: 'IIa',
          level: 'C-EO'
        },
        {
          id: 'r06-asymptomatic-severe-as-medical-management-avoid-prosthesis',
          text: {
            en: 'In asymptomatic women with severe AS (aortic velocity ≥4.0 m/s or mean pressure gradient ≥40 mm Hg, Stage C1) who are considering pregnancy, do not meet COR 1 criteria for intervention, and have a preconception evaluation confirming the absence of symptoms (including normal exercise stress testing and serum BNP measurements), medical management during pregnancy may be considered to avoid prosthetic valve replacement.',
            ru: 'У бессимптомных женщин с тяжелым аортальным стенозом (скорость на аортальном клапане ≥4,0 м/с или средний градиент давления ≥40 мм рт. ст., стадия C1), планирующих беременность, не имеющих показаний класса 1 к вмешательству, при подтверждении отсутствия симптомов до зачатия (включая нормальные результаты нагрузочной пробы и нормальный уровень BNP в сыворотке), может быть рассмотрено консервативное ведение во время беременности во избежание имплантации клапанного протеза.'
          },
          class: 'IIb',
          level: 'C-EO'
        },
        {
          id: 'r07-asymptomatic-severe-mr-valve-repair-before-pregnancy',
          text: {
            en: 'In asymptomatic women with severe MR (Stage C1) and a valve suitable for repair who are considering pregnancy, valve repair before pregnancy at a Comprehensive Valve Center may be considered but only after detailed discussion with the patient about the risks and benefits of the surgery and its effect on future pregnancies.',
            ru: 'У бессимптомных женщин с тяжелой митральной регургитацией (стадия C1) и анатомией клапана, пригодной для реконструкции, планирующих беременность, пластика митрального клапана в экспертном центре (Comprehensive Valve Center) до наступления беременности может быть рассмотрена, но только после подробного обсуждения с пациенткой рисков и преимуществ операции и ее влияния на течение будущих беременностей.'
          },
          class: 'IIb',
          level: 'C-EO'
        }
      ]
    }
  ],
  source: {
    expectedRows: 7
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt59: Recommendations for Intervention During Pregnancy in Women With VHD
files['rt59-intervention-during-pregnancy-women-with-vhd.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt59-intervention-during-pregnancy-women-with-vhd',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 59',
  title: {
    en: 'Recommendations for Intervention During Pregnancy in Women With VHD',
    ru: 'Рекомендации по выполнению вмешательств во время беременности у женщин с клапанными пороками сердца'
  },
  tags: [
    'vhd',
    'pregnancy',
    'intervention-during-pregnancy',
    'aortic-stenosis',
    'pmbc',
    'valve-surgery-pregnancy',
    'harm'
  ],
  sections: [
    {
      id: 'sec-intervention-during-pregnancy-women-vhd',
      title: {
        en: 'Intervention During Pregnancy in Women With VHD',
        ru: 'Вмешательства во время беременности у женщин с клапанными пороками'
      },
      rows: [
        {
          id: 'r01-pregnant-severe-as-hemodynamic-deterioration-hf-intervention',
          text: {
            en: 'In pregnant women with severe AS (mean pressure gradient ≥40 mm Hg, Stage D), valve intervention during pregnancy is reasonable if there is hemodynamic deterioration or if there are NYHA class III or IV HF symptoms.',
            ru: 'У беременных женщин с тяжелым аортальным стенозом (средний градиент давления ≥40 мм рт. ст., стадия D) вмешательство на клапане во время беременности целесообразно при ухудшении гемодинамики или появлении симптомов сердечной недостаточности III или IV функционального класса по NYHA.'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [1, 2, 3, 4, 5, 6, 7]
        },
        {
          id: 'r02-pregnant-severe-rheumatic-ms-symptomatic-pmbc',
          text: {
            en: 'In pregnant women with severe rheumatic MS (mitral valve area ≤1.5 cm^2, Stage D) and with valve morphology favorable for PMBC who remain symptomatic with NYHA class III or IV HF symptoms despite medical therapy, PMBC is reasonable during pregnancy if it is performed at a Comprehensive Valve Center.',
            ru: 'У беременных женщин с тяжелым ревматическим митральным стенозом (площадь митрального отверстия ≤1,5 см², стадия D) и морфологией клапана, благоприятной для PMBC, сохраняющих симптомы СН III или IV класса по NYHA, несмотря на медикаментозную терапию, выполнение PMBC целесообразно во время беременности, если вмешательство проводится в экспертном клапанном центре (Comprehensive Valve Center).'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [8, 9, 10, 11, 12]
        },
        {
          id: 'r03-pregnant-severe-regurgitation-nyha-iv-valve-surgery',
          text: {
            en: 'In pregnant women with severe valve regurgitation and with NYHA class IV HF symptoms (Stage D) refractory to medical therapy, valve surgery is reasonable during pregnancy.',
            ru: 'У беременных женщин с тяжелой клапанной регургитацией и симптомами СН IV функционального класса по NYHA (стадия D), рефрактерными к медикаментозной терапии, хирургическое вмешательство на клапане целесообразно во время беременности.'
          },
          class: 'IIa',
          level: 'C-LD',
          refs: [13, 14, 15, 16]
        },
        {
          id: 'r04-pregnant-vhd-valve-surgeries-harm-without-severe-refractory-hf',
          text: {
            en: 'In pregnant women with VHD, valve surgeries should not be performed in the absence of severe HF symptoms refractory to medical therapy.',
            ru: 'У беременных женщин с клапанными пороками сердца операции на клапанах не должны проводиться при отсутствии тяжелых симптомов сердечной недостаточности, рефрактерных к медикаментозной терапии.'
          },
          class: 'III-harm',
          level: 'C-LD',
          refs: [13, 14, 15, 16]
        }
      ]
    }
  ],
  source: {
    expectedRows: 4
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt60: Recommendations for Initial Management of Prosthetic Heart Valves in Pregnant Women
files['rt60-initial-management-prosthetic-valves-pregnant-women.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt60-initial-management-prosthetic-valves-pregnant-women',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 60',
  title: {
    en: 'Recommendations for Initial Management of Prosthetic Heart Valves in Pregnant Women',
    ru: 'Рекомендации по первичному ведению беременных женщин с протезированными клапанами сердца'
  },
  tags: [
    'vhd',
    'pregnancy',
    'prosthetic-valves',
    'mechanical-valves',
    'pre-pregnancy-assessment',
    'tee',
    'valve-obstruction'
  ],
  sections: [
    {
      id: 'sec-initial-management-prosthetic-valves-pregnant',
      title: {
        en: 'Initial Management of Prosthetic Heart Valves in Pregnant Women',
        ru: 'Первичное ведение протезированных клапанов у беременных'
      },
      rows: [
        {
          id: 'r01-prosthetic-valve-pre-pregnancy-assessment-echo',
          text: {
            en: 'Women with a prosthetic valve should undergo pre-pregnancy assessment, including echocardiography, by a cardiologist with expertise in managing women with VHD during pregnancy.',
            ru: 'Женщинам с клапанным протезом до наступления беременности следует пройти обследование, включая эхокардиографию, у кардиолога с опытом ведения женщин с пороками сердца во время беременности.'
          },
          class: 'I',
          level: 'C-EO'
        },
        {
          id: 'r02-mechanical-prosthesis-monitoring-tertiary-center-mdt',
          text: {
            en: 'Pregnant women with a mechanical prosthesis should be monitored in a tertiary-care center with a dedicated MDT of cardiologists, surgeons, anesthesiologists, and maternal-fetal medicine obstetricians with expertise in the management of high-risk cardiac conditions during pregnancy.',
            ru: 'Беременные женщины с механическим протезом клапана должны наблюдаться в высокотехнологичном центре третьего уровня со специализированной мультидисциплинарной командой кардиологов, кардиохирургов, анестезиологов и акушеров по материнско-плодовой медицине с опытом ведения беременности высокого сердечно-сосудистого риска.'
          },
          class: 'I',
          level: 'C-EO',
          refs: [1, 2, 3]
        },
        {
          id: 'r03-mechanical-valves-counseling-high-risk-pregnancy',
          text: {
            en: 'Women with mechanical heart valves considering pregnancy should be counselled that pregnancy is high risk and that there is no anticoagulation strategy that is consistently safe for the mother and baby.',
            ru: 'Женщины с механическими клапанами сердца, планирующие беременность, должны быть проконсультированы о том, что беременность сопряжена с высоким риском и что не существует стратегии антикоагуляции, полностью безопасной одновременно для матери и плода.'
          },
          class: 'I',
          level: 'B-NR',
          refs: [3, 4, 5, 6]
        },
        {
          id: 'r04-mechanical-prosthetic-valve-obstruction-embolism-tee',
          text: {
            en: 'Pregnant women with a mechanical prosthetic valve who have prosthetic valve obstruction or experience an embolic event should undergo a TEE.',
            ru: 'Беременным женщинам с механическим протезом клапана при развитии обструкции протеза или тромбоэмболического события показано проведение чреспищеводной эхокардиографии (ЧП-ЭхоКГ/TEE).'
          },
          class: 'I',
          level: 'B-NR',
          refs: [7, 8, 9]
        }
      ]
    }
  ],
  source: {
    expectedRows: 4
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt61: Recommendations for Anticoagulation for Pregnant Women With Mechanical Prosthetic Heart Valves
files['rt61-anticoagulation-pregnant-women-mechanical-prosthetic-valves.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt61-anticoagulation-pregnant-women-mechanical-prosthetic-valves',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 61',
  title: {
    en: 'Recommendations for Anticoagulation for Pregnant Women With Mechanical Prosthetic Heart Valves',
    ru: 'Рекомендации по антикоагулянтной терапии у беременных женщин с механическими протезами клапанов сердца'
  },
  tags: [
    'vhd',
    'pregnancy',
    'mechanical-prosthetic-valves',
    'anticoagulation',
    'warfarin',
    'lmwh',
    'anti-xa',
    'ufh',
    'delivery',
    'harm'
  ],
  sections: [
    {
      id: 'sec-anticoagulation-pregnant-women-mechanical-valves',
      title: {
        en: 'Anticoagulation for Pregnant Women With Mechanical Prosthetic Heart Valves',
        ru: 'Антикоагулянтная терапия у беременных с механическими клапанами'
      },
      rows: [
        {
          id: 'r01-pregnant-mechanical-therapeutic-anticoagulation-monitoring',
          text: {
            en: 'Pregnant women with mechanical prostheses should receive therapeutic anticoagulation with frequent monitoring during pregnancy.',
            ru: 'Беременные женщины с механическими протезами клапанов должны получать терапевтическую антикоагулянтную терапию с частым лабораторным мониторингом на протяжении всей беременности.'
          },
          class: 'I',
          level: 'B-NR',
          refs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        {
          id: 'r02-cannot-maintain-monitoring-counseled-against-pregnancy',
          text: {
            en: 'Women with mechanical heart valves who cannot maintain therapeutic anticoagulation with frequent monitoring should be counseled against pregnancy.',
            ru: 'Женщинам с механическими клапанами сердца, которые не могут поддерживать терапевтический уровень антикоагуляции с регулярным контролем, следует рекомендовать воздержаться от беременности.'
          },
          class: 'I',
          level: 'B-NR',
          refs: [7, 8, 10, 11, 12, 13]
        },
        {
          id: 'r03-shared-decision-making-anticoagulation-strategy-vka-vs-heparins',
          text: {
            en: 'Women with mechanical heart valves and their providers should use shared decision-making to choose an anticoagulation strategy for pregnancy. Women should be informed that VKA during pregnancy is associated with the lowest likelihood of maternal complications but the highest likelihood of miscarriage, fetal death, and congenital abnormalities, particularly if taken during the first trimester and if the warfarin dose exceeds 5 mg/d.',
            ru: 'Женщины с механическими клапанами сердца и их врачи должны использовать процесс совместного принятия решений при выборе стратегии антикоагуляции на период беременности. Пациентки должны быть проинформированы о том, что терапия АВК (варфарином) во время беременности сопряжена с наименьшей вероятностью материнских тромботических осложнений, но с максимальным риском выкидыша, гибели плода и врожденных пороков развития, особенно при приеме в первом триместре и если доза варфарина превышает 5 мг/сутки.'
          },
          class: 'I',
          level: 'B-NR',
          refs: [3, 4, 5, 6, 11, 14, 15]
        },
        {
          id: 'r04-warfarin-switch-lmwh-ufh-1-week-before-delivery',
          text: {
            en: 'Pregnant women with mechanical valve prostheses who are on warfarin should switch to twice-daily LMWH (with a target anti-Xa level of 0.8 U/mL to 1.2 U/mL at 4 to 6 hours after dose) or intravenous UFH (with an activated partial thromboplastin time [aPTT] 2 times control) at least 1 week before planned delivery.',
            ru: 'Беременные женщины с механическими протезами клапанов, принимающие варфарин, должны быть переведены на двукратное введение НМГ (с целевым уровнем анти-Ха от 0,8 до 1,2 МЕ/мл через 4–6 часов после инъекции) или внутривенный НФГ (с поддержанием АЧТВ в 2 раза выше контроля) не менее чем за 1 неделю до планируемого родоразрешения.'
          },
          class: 'I',
          level: 'C-LD',
          refs: [3, 6, 11, 14, 15, 16, 17, 18, 19, 20]
        },
        {
          id: 'r05-lmwh-switch-ufh-36-hours-before-delivery',
          text: {
            en: 'Pregnant women with mechanical valve prostheses who are on LMWH should switch to UFH (with an aPTT 2 times control) at least 36 hours before planned delivery.',
            ru: 'Беременные женщины с механическими протезами клапанов, получающие НМГ, должны быть переведены на внутривенный НФГ (с поддержанием АЧТВ в 2 раза выше контроля) не менее чем за 36 часов до планируемого родоразрешения.'
          },
          class: 'I',
          level: 'C-LD',
          refs: [19, 20, 21]
        },
        {
          id: 'r06-stop-ufh-6-hours-before-vaginal-delivery',
          text: {
            en: 'Pregnant women with valve prostheses should stop UFH at least 6 hours before planned vaginal delivery.',
            ru: 'Беременным женщинам с клапанными протезами инфузию НФГ следует прекратить не менее чем за 6 часов до планируемых вагинальных родов.'
          },
          class: 'I',
          level: 'C-LD',
          refs: [19, 20, 21]
        },
        {
          id: 'r07-labor-vka-cesarean-after-reversal',
          text: {
            en: 'If labor begins or urgent delivery is required in a woman therapeutically anticoagulated with a VKA, cesarean section should be performed after reversal of anticoagulation.',
            ru: 'При начале родовой деятельности или необходимости экстренного родоразрешения у женщины, находящейся на терапевтической антикоагуляции АВК, следует выполнить кесарево сечение после реверсии антикоагулянтного эффекта.'
          },
          class: 'I',
          level: 'C-LD',
          refs: [3, 22, 23]
        },
        {
          id: 'r08-warfarin-le-5mg-continuation-reasonable',
          text: {
            en: 'For pregnant women with mechanical prostheses who require a dose of warfarin ≤5 mg/d to maintain a therapeutic INR, continuation of warfarin for all 3 trimesters is reasonable after full discussion with the patient about risks and benefits.',
            ru: 'У беременных женщин с механическими протезами, которым требуется доза варфарина ≤5 мг/сут для поддержания терапевтического МНО, продолжение приема варфарина на протяжении всех трех триместров целесообразно после детального обсуждения с пациенткой соотношения пользы и рисков.'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [3, 6, 11, 14, 15, 22, 24, 25]
        },
        {
          id: 'r09-warfarin-gt-5mg-lmwh-first-trimester-then-warfarin',
          text: {
            en: 'For pregnant women with mechanical prostheses who require >5 mg/d of warfarin to achieve a therapeutic INR, dose-adjusted LMWH (with a target anti-Xa level of 0.8 to 1.2 U/mL at 4 to 6 hours after dose) at least 2 times per day during the first trimester, followed by warfarin during the second and third trimesters, is reasonable.',
            ru: 'У беременных женщин с механическими протезами, которым требуется доза варфарина >5 мг/сут для терапевтического МНО, назначение титруемого по дозе НМГ (с целевым анти-Ха 0,8–1,2 МЕ/мл через 4–6 часов после введения) не менее 2 раз в сутки в первом триместре с последующим приемом варфарина во втором и третьем триместрах является целесообразным.'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [3, 6, 11, 14, 25]
        },
        {
          id: 'r10-warfarin-gt-5mg-ufh-first-trimester-if-lmwh-unavailable',
          text: {
            en: 'For pregnant women with mechanical prostheses who require a dose of warfarin >5 mg/d to achieve a therapeutic INR, and for whom dose-adjusted LMWH is unavailable, dose-adjusted continuous intravenous UFH during the first trimester (with aPTT 2 times control), followed by warfarin for the second and third trimesters, is reasonable.',
            ru: 'У беременных женщин с механическими протезами, которым требуется доза варфарина >5 мг/сут для терапевтического МНО, при недоступности мониторируемого НМГ, целесообразно проведение постоянной внутривенной инфузии титруемого НФГ в первом триместре (с поддержанием АЧТВ в 2 раза выше контроля) с последующим переходом на варфарин во втором и третьем триместрах.'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [3, 6, 11, 14]
        },
        {
          id: 'r11-hemodynamically-stable-obstructive-thrombosis-fibrinolysis',
          text: {
            en: 'For hemodynamically stable pregnant women with obstructive left-sided mechanical valve thrombosis, it is reasonable to manage with slow-infusion, low-dose fibrinolytic therapy.',
            ru: 'У гемодинамически стабильных беременных женщин с обструктивным тромбозом механического протеза клапана левых камер сердца целесообразно проведение низкодозовой медленной инфузии тромболитической терапии.'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [26]
        },
        {
          id: 'r12-warfarin-gt-5mg-lmwh-all-3-trimesters-considered',
          text: {
            en: 'For pregnant women with mechanical prostheses who require a warfarin dose >5 mg/d to achieve a therapeutic INR, dose-adjusted LMWH (with a target anti-Xa level of 0.8 to 1.2 U/mL at 4 to 6 hours after dose) at least 2 times per day for all 3 trimesters may be considered.',
            ru: 'У беременных женщин с механическими протезами, которым требуется доза варфарина >5 мг/сут для достижения терапевтического МНО, может быть рассмотрено назначение дозо-адаптированного НМГ (целевой уровень анти-Ха 0,8–1,2 МЕ/мл через 4–6 ч после введения) не менее 2 раз в сутки на протяжении всех 3 триместров.'
          },
          class: 'IIb',
          level: 'B-NR',
          refs: [3, 6, 10, 14, 27]
        },
        {
          id: 'r13-warfarin-le-5mg-lmwh-first-trimester-considered',
          text: {
            en: 'For pregnant women with mechanical prostheses who require a dose of warfarin ≤5 mg/d to maintain a therapeutic INR, dose-adjusted LMWH at least 2 times per day during the first trimester, followed by warfarin for the second and third trimesters, may be considered.',
            ru: 'У беременных женщин с механическими протезами, требующих дозы варфарина ≤5 мг/сут для терапевтического МНО, может быть рассмотрено применение дозо-контролируемого НМГ не менее 2 раз в день в первом триместре с последующим приемом варфарина во втором и третьем триместрах.'
          },
          class: 'IIb',
          level: 'B-NR',
          refs: [3, 4, 5, 6, 8, 14, 16, 22]
        },
        {
          id: 'r14-aspirin-addition-if-indicated',
          text: {
            en: 'For pregnant women with mechanical prostheses, aspirin 75 to 100 mg daily may be considered, in addition to anticoagulation, if needed for other indications.',
            ru: 'У беременных женщин с механическими протезами клапанов в дополнение к антикоагулянтной терапии может быть рассмотрено назначение аспирина в дозе 75–100 мг в сутки при наличии сопутствующих показаний.'
          },
          class: 'IIb',
          level: 'B-NR',
          refs: [28]
        },
        {
          id: 'r15-lmwh-harm-without-anti-xa-monitoring',
          text: {
            en: 'For pregnant women with mechanical prostheses, LMWH should not be administered unless anti-Xa levels are monitored 4 to 6 hours after administration and dose is adjusted according to levels.',
            ru: 'У беременных женщин с механическими протезами клапанов НМГ не должен применяться без регулярного контроля пиковой активности анти-Ха через 4–6 часов после введения и обязательной коррекции дозы по полученным результатам.'
          },
          class: 'III-harm',
          level: 'B-NR',
          refs: [8, 9, 10, 16, 27]
        },
        {
          id: 'r16-dabigatran-contraindicated-mechanical-valves',
          text: {
            en: 'For patients with mechanical valve prostheses, anticoagulation with the direct thrombin inhibitor, dabigatran, should not be administered.',
            ru: 'У пациентов с механическими протезами клапанов антикоагулянтная терапия прямым ингибитором тромбина дабигатраном противопоказана и не должна назначаться.'
          },
          class: 'III-harm',
          level: 'B-R',
          refs: [29]
        },
        {
          id: 'r17-doacs-anti-xa-not-recommended-mechanical-valves',
          text: {
            en: 'The use of anti-Xa direct oral anticoagulants with mechanical heart valves in pregnancy has not been assessed and is not recommended.',
            ru: 'Применение прямых пероральных ингибиторов фактора Ха (ПОАК) при механических протезах клапанов во время беременности не исследовалось и не рекомендуется (противопоказано).'
          },
          class: 'III-harm',
          level: 'C-EO',
          refs: [30, 31, 32]
        }
      ]
    }
  ],
  source: {
    expectedRows: 17
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt62: Recommendations for Management of CAD in Patients Undergoing Valve Surgery
files['rt62-management-cad-patients-undergoing-valve-surgery.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt62-management-cad-patients-undergoing-valve-surgery',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 62',
  title: {
    en: 'Recommendations for Management of CAD in Patients Undergoing Valve Surgery',
    ru: 'Рекомендации по ведению ИБС у пациентов, которым планируется хирургическое вмешательство на клапанах сердца'
  },
  tags: [
    'vhd',
    'cad',
    'valve-surgery',
    'coronary-angiography',
    'ct-angiography',
    'cabg'
  ],
  sections: [
    {
      id: 'sec-management-cad-valve-surgery',
      title: {
        en: 'Management of CAD in Patients Undergoing Valve Surgery',
        ru: 'Ведение сопутствующей ИБС у пациентов перед операцией на клапанах'
      },
      rows: [
        {
          id: 'r01-invasive-coronary-angiography-before-valve-intervention',
          text: {
            en: 'In patients with symptoms of angina, objective evidence of ischemia, decreased LV systolic function, history of CAD, or coronary risk factors (including men >40 years of age and postmenopausal women), invasive coronary angiography is indicated before valve intervention.',
            ru: 'У пациентов с симптомами стенокардии, объективными признаками ишемии, сниженной систолической функцией ЛЖ, анамнезом ИБС или факторами коронарного риска (включая мужчин старше 40 лет и женщин в постменопаузе) перед вмешательством на клапане показана инвазивная коронарография.'
          },
          class: 'I',
          level: 'C-LD',
          refs: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        {
          id: 'r02-chronic-severe-secondary-mr-invasive-angiography',
          text: {
            en: 'In patients with chronic severe secondary MR, invasive coronary angiography should be performed as part of the evaluation.',
            ru: 'У пациентов с хронической тяжелой вторичной митральной регургитацией инвазивная коронарография должна выполняться как обязательная часть диагностического обследования.'
          },
          class: 'I',
          level: 'C-LD',
          refs: [9, 10, 11]
        },
        {
          id: 'r03-coronary-cta-low-intermediate-probability',
          text: {
            en: 'In selected patients with a low to intermediate pretest probability of CAD, contrast-enhanced coronary CT angiography is reasonable to exclude the presence of significant obstructive CAD.',
            ru: 'У отдельных пациентов с низкой или промежуточной предтестовой вероятностью ИБС целесообразно выполнение КТ-коронарографии с контрастированием для исключения гемодинамически значимого обструктивного поражения коронарных артерий.'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [12, 13, 14, 15, 16, 17, 18]
        },
        {
          id: 'r04-significant-proximal-cad-concomitant-cabg',
          text: {
            en: 'In patients undergoing valve repair or replacement with significant proximal CAD (≥70% reduction in luminal diameter in major coronary arteries or ≥50% reduction in luminal diameter in the left main coronary artery and/or physiologically significance), CABG is reasonable for selective patients.',
            ru: 'У пациентов, которым выполняется пластика или протезирование клапана, при наличии гемодинамически значимого проксимального поражения коронарных артерий (сужение просвета магистральных артерий ≥70%, либо сужение ствола ЛКА ≥50%, и/или функциональная значимость по данным физиологических тестов), сопутствующее выполнение КШ (CABG) целесообразно.'
          },
          class: 'IIa',
          level: 'C-LD',
          refs: [19, 20]
        }
      ]
    }
  ],
  source: {
    expectedRows: 4
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt63: Recommendations for Management of CAD in Patients Undergoing TAVI
files['rt63-management-cad-patients-undergoing-tavi.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt63-management-cad-patients-undergoing-tavi',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 63',
  title: {
    en: 'Recommendations for Management of CAD in Patients Undergoing TAVI',
    ru: 'Рекомендации по ведению ИБС у пациентов, которым выполняется TAVI'
  },
  tags: [
    'vhd',
    'cad',
    'tavi',
    'tavr',
    'pci',
    'coronary-ct',
    'syntax-score',
    'savr-cabg'
  ],
  sections: [
    {
      id: 'sec-management-cad-patients-undergoing-tavi',
      title: {
        en: 'Management of CAD in Patients Undergoing TAVI',
        ru: 'Ведение сопутствующей ИБС у пациентов перед TAVI'
      },
      rows: [
        {
          id: 'r01-tavi-coronary-cta-or-invasive-angiogram',
          text: {
            en: 'In patients undergoing TAVI, 1) contrast-enhanced coronary CT angiography (in patients with a low pretest probability for CAD) or 2) an invasive coronary angiogram is recommended to assess coronary anatomy and guide revascularization.',
            ru: 'У пациентов, которым планируется TAVI, рекомендуется проведение: 1) КТ-коронарографии с контрастированием (при низкой предтестовой вероятности ИБС) либо 2) инвазивной коронарографии для детальной оценки анатомии коронарного русла и планирования реваскуляризации.'
          },
          class: 'I',
          level: 'C-EO'
        },
        {
          id: 'r02-tavi-significant-left-main-proximal-cad-pci-before-tavi',
          text: {
            en: 'In patients undergoing TAVI with significant left main or proximal CAD with or without angina, revascularization by PCI before TAVI is reasonable.',
            ru: 'У пациентов перед проведением TAVI со значимым стенозом ствола ЛКА или проксимальных отделов коронарных артерий (со стенокардией или без нее) реваскуляризация миокарда методом ЧКВ (PCI) до процедуры TAVI целесообразна.'
          },
          class: 'IIa',
          level: 'C-LD',
          refs: [1, 2]
        },
        {
          id: 'r03-as-complex-cad-syntax-gt-33-savr-cabg-preferred',
          text: {
            en: 'In patients with significant AS and significant CAD (luminal reduction >70% diameter, fractional flow reserve <0.8, instantaneous wave-free ratio <0.89) consisting of complex bifurcation left main and/or multivessel CAD with a SYNTAX (Synergy Between Percutaneous Coronary Intervention With Taxus and Cardiac Surgery) score >33, SAVR and CABG are reasonable and preferred over TAVI and PCI.',
            ru: 'У пациентов со значимым аортальным стенозом и гемодинамически значимой ИБС (стеноз >70% диаметра, FFR <0,8, iFR <0,89), включающей сложное бифуркационное поражение ствола ЛКА и/или многососудистое поражение с оценкой по шкале SYNTAX >33 баллов, проведение открытого протезирования аортального клапана и КШ (SAVR + CABG) целесообразно и предпочтительнее по сравнению с TAVI и ЧКВ.'
          },
          class: 'IIa',
          level: 'C-LD',
          refs: [3, 4]
        }
      ]
    }
  ],
  source: {
    expectedRows: 3
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt64: Recommendations for Intervention for AF in Patients With VHD
files['rt64-intervention-af-patients-with-vhd.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt64-intervention-af-patients-with-vhd',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 64',
  title: {
    en: 'Recommendations for Intervention for AF in Patients With VHD',
    ru: 'Рекомендации по инвазивному и хирургическому лечению фибрилляции предсердий у пациентов с клапанными пороками сердца'
  },
  tags: [
    'vhd',
    'af',
    'atrial-fibrillation',
    'maze-procedure',
    'pulmonary-vein-isolation',
    'la-appendage',
    'harm'
  ],
  sections: [
    {
      id: 'sec-intervention-af-patients-vhd',
      title: {
        en: 'Intervention for AF in Patients With VHD',
        ru: 'Вмешательства при фибрилляции предсердий у пациентов с клапанными пороками'
      },
      rows: [
        {
          id: 'r01-vhd-af-surgical-intervention-discuss-arrhythmia-surgery',
          text: {
            en: 'In patients with VHD and AF for whom surgical intervention is planned, the potential symptomatic benefits and additional procedural risks of adjunctive arrhythmia surgery at the time of cardiac valvular surgery should be discussed with the patient.',
            ru: 'У пациентов с клапанными пороками сердца и ФП, которым планируется хирургическое вмешательство, следует обсудить с пациентом потенциальную клиническую пользу и дополнительные периоперационные риски сопутствующей хирургической аблации аритмии во время операции на клапане.'
          },
          class: 'I',
          level: 'C-LD',
          refs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        },
        {
          id: 'r02-symptomatic-af-valvular-surgery-pvi-or-maze',
          text: {
            en: 'For symptomatic patients with paroxysmal or persistent AF who are undergoing valvular surgery, surgical pulmonary vein isolation or a maze procedure can be beneficial to reduce symptoms and prevent recurrent arrhythmias.',
            ru: 'У пациентов с симптомами пароксизмальной или персистирующей ФП, которым выполняется хирургическое вмешательство на клапане, хирургическая изоляция легочных вен или процедура «лабиринт» (Maze) приносит пользу для облегчения симптомов и профилактики рецидивов аритмии.'
          },
          class: 'IIa',
          level: 'B-R',
          refs: [1, 2, 12, 13, 14, 15]
        },
        {
          id: 'r03-af-afl-valvular-surgery-laa-ligation-excision',
          text: {
            en: 'For patients with AF or atrial flutter who are undergoing valve surgery, LA appendage ligation/excision is reasonable to reduce the risk of thromboembolic events.',
            ru: 'У пациентов с ФП или трепетанием предсердий, переносящих операцию на клапанах, лигирование или резекция ушка левого предсердия (УЛП) целесообразны для снижения риска тромбоэмболических осложнений.'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [16, 17, 18, 19]
        },
        {
          id: 'r04-la-surgical-ablation-laa-anticoagulation-at-least-3-months',
          text: {
            en: 'In patients undergoing LA surgical ablation of atrial arrhythmias and/or LA appendage ligation/excision, anticoagulation therapy is reasonable for at least 3 months after the procedure.',
            ru: 'У пациентов, перенесших хирургическую аблацию предсердных аритмий в левом предсердии и/или резекцию/лигирование ушка левого предсердия, проведение антикоагулянтной терапии целесообразно в течение не менее 3 месяцев после операции.'
          },
          class: 'IIa',
          level: 'B-NR',
          refs: [20, 21, 22]
        },
        {
          id: 'r05-without-atrial-arrhythmias-laa-occlusion-harmful',
          text: {
            en: 'For patients without atrial arrhythmias who are undergoing valvular surgery, LA appendage occlusion/exclusion/amputation is potentially harmful.',
            ru: 'У пациентов без предсердных аритмий, которым выполняется операция на клапанах, окклюзия, исключение или ампутация ушка левого предсердия потенциально вредны (не показаны).'
          },
          class: 'III-harm',
          level: 'B-NR',
          refs: [23]
        }
      ]
    }
  ],
  source: {
    expectedRows: 5
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt65: Recommendation for Diagnosis in Patients With VHD Undergoing Noncardiac Surgery
files['rt65-diagnosis-patients-vhd-undergoing-noncardiac-surgery.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt65-diagnosis-patients-vhd-undergoing-noncardiac-surgery',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 65',
  title: {
    en: 'Recommendation for Diagnosis in Patients With VHD Undergoing Noncardiac Surgery',
    ru: 'Рекомендация по диагностике у пациентов с клапанными пороками сердца перед внесердечными операциями'
  },
  tags: [
    'vhd',
    'noncardiac-surgery',
    'preoperative-evaluation',
    'echocardiography',
    'diagnosis'
  ],
  sections: [
    {
      id: 'sec-diagnosis-vhd-noncardiac-surgery',
      title: {
        en: 'Diagnosis in Patients With VHD Undergoing Noncardiac Surgery',
        ru: 'Диагностика у пациентов с пороками сердца перед внесердечными операциями'
      },
      rows: [
        {
          id: 'r01-preoperative-echocardiography-suspected-moderate-severe-vhd',
          text: {
            en: 'In patients with clinically suspected moderate or greater degrees of valvular stenosis or regurgitation who are undergoing noncardiac surgery, preoperative echocardiography is recommended.',
            ru: 'У пациентов с клиническим подозрением на умеренную или более выраженную степень клапанного стеноза или регургитации, которым предстоит внесердечная операция, рекомендуется предоперационное эхокардиографическое исследование.'
          },
          class: 'I',
          level: 'C-EO'
        }
      ]
    }
  ],
  source: {
    expectedRows: 1
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt66: Recommendation for Management of the Symptomatic Patient With VHD Undergoing Noncardiac Surgery
files['rt66-management-symptomatic-patient-vhd-noncardiac-surgery.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt66-management-symptomatic-patient-vhd-noncardiac-surgery',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 66',
  title: {
    en: 'Recommendation for Management of the Symptomatic Patient With VHD Undergoing Noncardiac Surgery',
    ru: 'Рекомендация по ведению пациентов с симптомами клапанных пороков сердца перед внесердечными операциями'
  },
  tags: [
    'vhd',
    'noncardiac-surgery',
    'symptomatic-vhd',
    'intervention-before-noncardiac'
  ],
  sections: [
    {
      id: 'sec-management-symptomatic-patient-vhd-noncardiac',
      title: {
        en: 'Management of the Symptomatic Patient With VHD Undergoing Noncardiac Surgery',
        ru: 'Ведение симптомных пациентов с пороками сердца перед внесердечными операциями'
      },
      rows: [
        {
          id: 'r01-symptomatic-vhd-intervention-before-elective-noncardiac-surgery',
          text: {
            en: 'In patients who meet standard indications for intervention for VHD (replacement and repair) on the basis of symptoms and disease severity, intervention should be performed before elective noncardiac surgery to reduce perioperative risk if possible, depending on the urgency and risk of the noncardiac procedure.',
            ru: 'У пациентов, соответствующих стандартным показаниям к вмешательству на клапане сердца (протезирование или пластика) по тяжести симптомов и порока, вмешательство следует выполнить до плановой внесердечной операции для снижения периоперационного риска, если это возможно в зависимости от срочности и риска планируемого некардиального вмешательства.'
          },
          class: 'I',
          level: 'C-EO',
          refs: [1]
        }
      ]
    }
  ],
  source: {
    expectedRows: 1
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// rt67: Recommendations for Management of the Asymptomatic Patient With VHD Undergoing Noncardiac Surgery
files['rt67-management-asymptomatic-patient-vhd-noncardiac-surgery.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.rt67-management-asymptomatic-patient-vhd-noncardiac-surgery',
  guidelineId: 'aha-vhd-2020',
  type: 'recommendations',
  number: 'Recommendation Table 67',
  title: {
    en: 'Recommendations for Management of the Asymptomatic Patient With VHD Undergoing Noncardiac Surgery',
    ru: 'Рекомендации по ведению бессимптомных пациентов с клапанными пороками сердца перед внесердечными операциями'
  },
  tags: [
    'vhd',
    'noncardiac-surgery',
    'asymptomatic-vhd',
    'aortic-stenosis',
    'mitral-stenosis',
    'mitral-regurgitation',
    'aortic-regurgitation'
  ],
  sections: [
    {
      id: 'sec-management-asymptomatic-patient-vhd-noncardiac',
      title: {
        en: 'Management of the Asymptomatic Patient With VHD Undergoing Noncardiac Surgery',
        ru: 'Ведение бессимптомных пациентов с пороками сердца перед внесердечными операциями'
      },
      rows: [
        {
          id: 'r01-asymptomatic-moderate-severe-as-elective-noncardiac-surgery',
          text: {
            en: 'In asymptomatic patients with moderate or greater degrees of AS and normal LV systolic function, it is reasonable to perform elective noncardiac surgery.',
            ru: 'У бессимптомных пациентов с умеренной или тяжелой степенью аортального стеноза и сохранной систолической функцией ЛЖ выполнение плановой внесердечной операции целесообразно.'
          },
          class: 'IIa',
          level: 'B-R',
          refs: [1, 2, 3]
        },
        {
          id: 'r02-asymptomatic-moderate-severe-ms-elective-noncardiac-surgery',
          text: {
            en: 'In asymptomatic patients with moderate or greater degrees of rheumatic MS with less than severe pulmonary hypertension (pulmonary artery systolic pressure <50 mm Hg), it is reasonable to perform elective noncardiac surgery.',
            ru: 'У бессимптомных пациентов с умеренным или тяжелым ревматическим митральным стенозом без выраженной легочной гипертензии (систолическое давление в легочной артерии <50 мм рт. ст.) выполнение плановой внесердечной операции целесообразно.'
          },
          class: 'IIa',
          level: 'C-EO'
        },
        {
          id: 'r03-asymptomatic-moderate-severe-mr-elective-noncardiac-surgery',
          text: {
            en: 'In asymptomatic patients with moderate or greater degrees of MR and normal LV systolic function with less than severe pulmonary hypertension (pulmonary artery systolic pressure <50 mm Hg), it is reasonable to perform elective noncardiac surgery.',
            ru: 'У бессимптомных пациентов с умеренной или тяжелой митральной регургитацией, нормальной систолической функцией ЛЖ и отсутствием выраженной легочной гипертензии (систолическое давление в легочной артерии <50 мм рт. ст.) выполнение плановой внесердечной операции целесообразно.'
          },
          class: 'IIa',
          level: 'C-LD',
          refs: [4, 5, 6, 7]
        },
        {
          id: 'r04-asymptomatic-moderate-severe-ar-elective-noncardiac-surgery',
          text: {
            en: 'In asymptomatic patients with moderate or greater degrees of AR and normal LV systolic function, it is reasonable to perform elective noncardiac surgery.',
            ru: 'У бессимптомных пациентов с умеренной или тяжелой аортальной регургитацией и нормальной систолической функцией ЛЖ выполнение плановой внесердечной операции целесообразно.'
          },
          class: 'IIa',
          level: 'C-LD',
          refs: [8]
        }
      ]
    }
  ],
  source: {
    expectedRows: 4
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

// t26: Evidence Gaps and Future Directions for Patients With VHD
files['t26-evidence-gaps-future-directions-vhd.json'] = {
  schemaVersion: 1,
  id: 'aha-vhd-2020.t26-evidence-gaps-future-directions-vhd',
  guidelineId: 'aha-vhd-2020',
  type: 'grid',
  number: 'Table 26',
  title: {
    en: 'Evidence Gaps and Future Directions for Patients With VHD',
    ru: 'Пробелы в доказательной базе и перспективные направления исследований у пациентов с клапанными пороками сердца'
  },
  tags: [
    'vhd',
    'evidence-gaps',
    'future-directions',
    'research',
    'tavi',
    'antithrombotic',
    'prevention'
  ],
  columns: [
    {
      id: 'domain',
      title: {
        en: 'Evidence Gaps',
        ru: 'Пробелы в доказательной базе'
      }
    },
    {
      id: 'directions',
      title: {
        en: 'Future Directions',
        ru: 'Перспективные направления исследований'
      }
    }
  ],
  rows: [
    {
      id: 'row-stage-a-disease-mechanisms',
      cells: [
        {
          text: {
            en: '**Identification of patients at risk and valve disease prevention (Stage A)**\nDisease mechanisms',
            ru: '**Выявление пациентов группы риска и профилактика клапанных пороков (Стадия A)**\nМеханизмы развития заболевания'
          }
        },
        {
          text: {
            en: 'Basic science to identify specific targets for medical therapy',
            ru: 'Фундаментальные исследования для определения специфических терапевтических мишеней медикаментозной терапии'
          }
        }
      ]
    },
    {
      id: 'row-stage-a-rheumatic-heart-disease',
      cells: [
        {
          text: {
            en: 'Rheumatic heart disease',
            ru: 'Ревматическая болезнь сердца'
          }
        },
        {
          text: {
            en: 'Primary and secondary prevention',
            ru: 'Первичная и вторичная профилактика ревматизма и клапанных поражений'
          }
        }
      ]
    },
    {
      id: 'row-stage-a-calcific-valve-disease',
      cells: [
        {
          text: {
            en: 'Calcific valve disease',
            ru: 'Кальцинирующие пороки клапанов'
          }
        },
        {
          text: {
            en: '• Identification of patients at risk\n• Risk factor intervention\n• Prevention of disease initiation',
            ru: '• Выявление пациентов группы риска\n• Вмешательство на модифицируемые факторы риска\n• Предотвращение инициации кальциноза и дегенерации створок'
          }
        }
      ]
    },
    {
      id: 'row-stage-b-disease-mechanisms',
      cells: [
        {
          text: {
            en: '**Medical therapy for progressive valve disease (Stage B)**\nDisease mechanisms',
            ru: '**Медикаментозная терапия прогрессирующего клапанного порока (Стадия B)**\nМеханизмы прогрессирования заболевания'
          }
        },
        {
          text: {
            en: 'Basic science to identify specific targets to slow or reverse disease progression',
            ru: 'Фундаментальные исследования для поиска мишеней замедления или обратного развития прогрессирования порока'
          }
        }
      ]
    },
    {
      id: 'row-stage-b-medical-intervention',
      cells: [
        {
          text: {
            en: 'Medical intervention',
            ru: 'Фармакотерапевтическое вмешательство'
          }
        },
        {
          text: {
            en: 'Targeted therapy using advanced imaging endpoints to study disease mechanisms',
            ru: 'Таргетная терапия с использованием передовых визуализирующих конечных точек для изучения патогенетических механизмов'
          }
        }
      ]
    },
    {
      id: 'row-stage-b-ventricular-vascular-interactions',
      cells: [
        {
          text: {
            en: 'Ventricular and vascular interactions',
            ru: 'Взаимодействие желудочков и сосудистого русла'
          }
        },
        {
          text: {
            en: '• Dynamic interplay between valve disease severity and changes in ventricular anatomy and function\n• Modulation of ventricular and vascular dysfunction in patients with VHD',
            ru: '• Динамическое взаимодействие между тяжестью клапанного порока и ремоделированием анатомии/функции желудочков\n• Модуляция желудочковой и сосудистой дисфункции у пациентов с пороками сердца'
          }
        }
      ]
    },
    {
      id: 'row-stage-c-measures-severity',
      cells: [
        {
          text: {
            en: '**Optimal timing of intervention (Stage C)**\nImproved measures of disease severity',
            ru: '**Оптимальные сроки вмешательства (Стадия C)**\nСовершенствование критериев тяжести заболевания'
          }
        },
        {
          text: {
            en: '• Validation of newer measures of LV size (eg, volumes instead of dimension) and function (eg, strain) for timing of intervention decisions\n• Evaluation of nonimaging parameters (serum markers and other novel approaches)',
            ru: '• Валидация новых параметров размера ЛЖ (объемы вместо линейных размеров) и функции (глобальная продольная деформация / strain) для принятия решений о сроках вмешательства\n• Оценка невизуализирующих параметров (биомаркеры сыворотки крови и новые подходы)'
          }
        }
      ]
    },
    {
      id: 'row-stage-c-timing-intervention',
      cells: [
        {
          text: {
            en: 'Timing of intervention',
            ru: 'Сроки проведения вмешательства'
          }
        },
        {
          text: {
            en: '• Timing of intervention in asymptomatic patients with valve regurgitation\n• Intervention for asymptomatic severe AS\n• Intervention for moderate AS with LV dysfunction\n• Identification of patients with secondary MR who benefit from intervention',
            ru: '• Сроки вмешательства у бессимптомных пациентов с клапанной регургитацией\n• Вмешательство при бессимптомном тяжелом аортальном стенозе\n• Вмешательство при умеренном аортальном стенозе с дисфункцией ЛЖ\n• Выявление подгрупп пациентов с вторичной МР, получающих максимальную пользу от вмешательства'
          }
        }
      ]
    },
    {
      id: 'row-stage-c-patient-centered-research',
      cells: [
        {
          text: {
            en: 'Patient-centered research',
            ru: 'Пациент-центрированные исследования'
          }
        },
        {
          text: {
            en: 'Involvement of patients in identifying research questions, study design, and definition of outcomes',
            ru: 'Привлечение пациентов к формированию научных вопросов, дизайну клинических исследований и определению ключевых исходов'
          }
        }
      ]
    },
    {
      id: 'row-stage-c-diverse-patient-groups',
      cells: [
        {
          text: {
            en: 'Inclusion of diverse patient groups',
            ru: 'Включение разнообразных групп пациентов'
          }
        },
        {
          text: {
            en: 'Adequate representation of diverse patient populations in RCTs for VHD',
            ru: 'Адекватное представительство гетерогенных популяций пациентов в рандомизированных контролируемых исследованиях (РКИ) по порокам сердца'
          }
        }
      ]
    },
    {
      id: 'row-stage-c-decision-aids',
      cells: [
        {
          text: {
            en: 'Decision aids',
            ru: 'Инструменты поддержки принятия решений'
          }
        },
        {
          text: {
            en: '• Development and validation of improved decision aids for shared decision-making with patients\n• Implementation and validation of decision algorithms for physicians and Heart Valve Teams',
            ru: '• Разработка и валидация усовершенствованных инструментов для совместного принятия решений с пациентами\n• Внедрение и валидация алгоритмов принятия решений для врачей и мультидисциплинарных клапанных команд'
          }
        }
      ]
    },
    {
      id: 'row-stage-d-prosthetic-valves',
      cells: [
        {
          text: {
            en: '**Intervention options and long-term management (Stage D)**\nImproved prosthetic valves',
            ru: '**Варианты вмешательств и длительное ведение (Стадия D)**\nУсовершенствование клапанных протезов'
          }
        },
        {
          text: {
            en: '• Durability of TAVI valves\n• Nonthrombogenic durable surgical and transcatheter valves',
            ru: '• Долговечность транскатетерных клапанов TAVI\n• Создание нетромбогенных и долговечных хирургических и транскатетерных протезов'
          }
        }
      ]
    },
    {
      id: 'row-stage-d-antithrombotic-therapy',
      cells: [
        {
          text: {
            en: 'Optimal antithrombotic therapy',
            ru: 'Оптимальная антитромботическая терапия'
          }
        },
        {
          text: {
            en: '• Alternatives to VKA anticoagulation for mechanical valves\n• Management of anticoagulation during pregnancy\n• Optimal antithrombotic therapy after TAVI',
            ru: '• Альтернативы терапии АВК (варфарином) для механических протезов\n• Ведение антикоагулянтной терапии во время беременности\n• Оптимальные режимы антитромботической терапии после TAVI'
          }
        }
      ]
    },
    {
      id: 'row-stage-d-medical-therapy-after-avr',
      cells: [
        {
          text: {
            en: 'Medical therapy after AVR',
            ru: 'Медикаментозная терапия после протезирования аортального клапана (AVR)'
          }
        },
        {
          text: {
            en: '• Medical therapy to address ventricular and vascular function\n• Optimal blood pressure targets after valve intervention',
            ru: '• Медикаментозное лечение для оптимизации функции желудочков и сосудистого русла\n• Оптимальные целевые уровни артериального давления после вмешательств на клапанах'
          }
        }
      ]
    },
    {
      id: 'row-stage-d-procedural-risk',
      cells: [
        {
          text: {
            en: 'Lower procedural risk',
            ru: 'Снижение процедурного риска'
          }
        },
        {
          text: {
            en: '• Approaches to lower surgical morbidity and mortality rates\n• Prevention of postoperative AF\n• Noninvasive approaches for correction of valve dysfunction',
            ru: '• Подходы к снижению хирургической заболеваемости и летальности\n• Профилактика послеоперационной фибрилляции предсердий\n• Неинвазивные методы коррекции дисфункции клапанов'
          }
        }
      ]
    },
    {
      id: 'row-stage-d-prevention-complications',
      cells: [
        {
          text: {
            en: 'Prevention of complications',
            ru: 'Профилактика осложнений'
          }
        },
        {
          text: {
            en: '• Approaches to avoid need for permanent pacing after SAVR or TAVI\n• Better prevention, diagnosis and treatment of endocarditis\n• Better prevention of thromboembolic events',
            ru: '• Подходы к предотвращению потребности в постоянной электрокардиостимуляции (ЭКС) после SAVR или TAVI\n• Улучшение профилактики, диагностики и лечения эндокардита\n• Повышение эффективности профилактики тромбоэмболических осложнений'
          }
        }
      ]
    },
    {
      id: 'row-stage-d-promoting-equity',
      cells: [
        {
          text: {
            en: 'Promoting equity',
            ru: 'Обеспечение равного доступа к медицинской помощи'
          }
        },
        {
          text: {
            en: '• Identify and address disparities in outcomes and survival across diverse patient populations\n• Develop novel, cost-effective approaches for long-term management in rural settings\n• Expand access to therapies for valvular dysfunction',
            ru: '• Выявление и устранение неравенства в исходах и выживаемости среди различных групп пациентов\n• Разработка новых экономически эффективных подходов к длительному наблюдению в отдаленных/сельских районах\n• Расширение доступности современных методов лечения клапанной дисфункции'
          }
        }
      ]
    }
  ],
  footnotes: {
    a: {
      en: 'AF indicates atrial fibrillation; AS, aortic stenosis; AVR, aortic valve replacement; LV, left ventricular; MR, mitral regurgitation; RCT, randomized controlled trial; SAVR, surgical aortic valve replacement; TAVI, transcatheter aortic valve implantation; VHD, valvular heart disease; and VKA, vitamin K antagonist.',
      ru: 'AF/ФП — фибрилляция предсердий; AS/АС — аортальный стеноз; AVR/ПАК — протезирование аортального клапана; LV/ЛЖ — левый желудочек; MR/МР — митральная регургитация; RCT/РКИ — рандомизированное контролируемое исследование; SAVR — хирургическое протезирование аортального клапана; TAVI — транскатетерная имплантация аортального клапана; VHD — клапанные пороки сердца; VKA/АВК — антагонист витамина К.'
    }
  },
  source: {
    expectedRows: 17
  },
  i18nStatus: {
    ru: 'reviewed'
  }
};

for (const [filename, content] of Object.entries(files)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
  console.log(`Wrote ${filePath} (${content.type}, rows: ${content.sections ? content.sections.reduce((acc, s) => acc + s.rows.length, 0) : content.rows.length})`);
}
