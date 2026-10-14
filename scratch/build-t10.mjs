import fs from 'fs';
import path from 'path';

const rtFiles = [
  { file: 'rt01-history-ecg.json', titleEn: 'Recommendations for history taking, risk factor assessment, and resting electrocardiogram in individuals with suspected chronic coronary syndrome', titleRu: 'Рекомендации по сбору анамнеза, оценке факторов риска и ЭКГ покоя у лиц с подозрением на хронический коронарный синдром' },
  { file: 'rt02-biochemistry.json', titleEn: 'Recommendations for basic biochemistry in the initial diagnostic management of individuals with suspected chronic coronary syndrome', titleRu: 'Рекомендации по базовым биохимическим исследованиям при первичной диагностике у лиц с подозрением на хронический коронарный синдром' },
  { file: 'rt03-pretest-likelihood.json', titleEn: 'Recommendations for estimating, adjusting and reclassifying the likelihood of obstructive atherosclerotic coronary artery disease in the initial diagnostic management of individuals with suspected chronic coronary syndrome', titleRu: 'Рекомендации по оценке, модификации и реклассификации вероятности обструктивной ИБС при первичной диагностике у лиц с подозрением на хронический коронарный синдром' },
  { file: 'rt04-resting-tte-cmr.json', titleEn: 'Recommendations for resting transthoracic ultrasound and cardiac magnetic resonance imaging in the initial diagnostic management of individuals with suspected chronic coronary syndrome', titleRu: 'Рекомендации по трансторакальной ЭхоКГ покоя и МРТ сердца при первичной диагностике у лиц с подозрением на хронический коронарный синдром' },
  { file: 'rt05-exercise-ecg.json', titleEn: 'Recommendations for the use of exercise ECG in the initial diagnostic management of individuals with suspected chronic coronary syndrome', titleRu: 'Рекомендации по применению нагрузочной ЭКГ при первичной диагностике у лиц с подозрением на хронический коронарный синдром' },
  { file: 'rt07-ambulatory-ecg.json', titleEn: 'Recommendations for ambulatory ECG monitoring in the initial diagnostic management of individuals with suspected chronic coronary syndrome', titleRu: 'Рекомендации по амбулаторному мониторированию ЭКГ при первичной диагностике у лиц с подозрением на хронический коронарный синдром' },
  { file: 'rt08-ccta.json', titleEn: 'Recommendations for non-invasive anatomical imaging tests in the initial diagnostic management of individuals with suspected chronic coronary syndrome—coronary computed tomography angiography, if available, and supported by local expertise', titleRu: 'Рекомендации по неинвазивным анатомическим визуализирующим тестам при первичной диагностике у лиц с подозрением на ХКС — КТ-коронарография при наличии и подтвержденном опыте центра' },
  { file: 'rt09-stress-echocardiography.json', titleEn: 'Recommendations for non-invasive tests in the initial diagnostic management of individuals with suspected chronic coronary syndrome—stress echocardiography, if available, and supported by local expertise', titleRu: 'Рекомендации по неинвазивным тестам при первичной диагностике у лиц с подозрением на ХКС — стресс-эхокардиография при наличии и подтвержденном опыте центра' },
  { file: 'rt10-spect-pet-cmr.json', titleEn: 'Recommendations for non-invasive functional myocardial imaging tests in the initial diagnostic management of individuals with suspected chronic coronary syndrome—resting and stress single-photon emission computed tomography/positron emission tomography—cardiac magnetic resonance imaging, if available, and supported by local expertise', titleRu: 'Рекомендации по неинвазивным функциональным тестам визуализации миокарда при первичной диагностике у лиц с подозрением на ХКС — ОФЭКТ/ПЭТ покоя и нагрузки — МРТ сердца при наличии и подтвержденном опыте центра' },
  { file: 'rt11-ica-indications.json', titleEn: 'Recommendations for invasive coronary angiography in individuals with suspected obstructive coronary artery disease', titleRu: 'Рекомендации по проведению инвазивной коронарографии у лиц с подозрением на обструктивную ишемическую болезнь сердца' },
  { file: 'rt12-functional-assessment.json', titleEn: 'Recommendations for functional assessment of epicardial artery stenosis severity during invasive coronary angiography to guide revascularization', titleRu: 'Рекомендации по функциональной оценке степени тяжести стенозов эпикардиальных артерий во время инвазивной коронарографии для определения тактики реваскуляризации' },
  { file: 'rt13-initial-test-selection.json', titleEn: 'Recommendations for selection of initial diagnostic tests in individuals with suspected chronic coronary syndrome', titleRu: 'Рекомендации по выбору первоначальных диагностических тестов у лиц с подозрением на хронический коронарный синдром' },
  { file: 'rt14-high-risk-definition.json', titleEn: 'Recommendations for definition of high risk of adverse events', titleRu: 'Рекомендации по определению высокого риска неблагоприятных сердечно-сосудистых событий' },
  { file: 'rt15-lifestyle-interventions.json', titleEn: 'Recommendations for cardiovascular risk reduction, lifestyle changes, and exercise interventions in patients with established chronic coronary syndrome', titleRu: 'Рекомендации по снижению сердечно-сосудистого риска, модификации образа жизни и программам физических тренировок у пациентов с установленным ХКС' },
  { file: 'rt16-antianginal-drugs.json', titleEn: 'Recommendations for antianginal drugs in patients with chronic coronary syndrome', titleRu: 'Рекомендации по антиангинальным препаратам у пациентов с хроническим коронарным синдромом' },
  { file: 'rt17-antithrombotic-therapy.json', titleEn: 'Recommendations for antithrombotic therapy in patients with chronic coronary syndrome', titleRu: 'Рекомендации по антитромботической терапии у пациентов с хроническим коронарным синдромом' },
  { file: 'rt18-lipid-lowering.json', titleEn: 'Recommendations for lipid-lowering drugs in patients with chronic coronary syndrome', titleRu: 'Рекомендации по гиполипидемической терапии у пациентов с хроническим коронарным синдромом' },
  { file: 'rt19-sglt2-glp1.json', titleEn: 'Recommendations for sodium–glucose cotransporter 2 inhibitors and/or glucagon-like peptide-1 receptor agonists in patients with chronic coronary syndrome', titleRu: 'Рекомендации по ингибиторам SGLT2 и/или агонистам рецепторов GLP-1 у пациентов с хроническим коронарным синдромом' },
  { file: 'rt21-acei-arb.json', titleEn: 'Recommendations for angiotensin-converting enzyme inhibitors in patients with chronic coronary syndrome', titleRu: 'Рекомендации по ингибиторам ангиотензинпревращающего фермента у пациентов с хроническим коронарным синдромом' },
  { file: 'rt22-revascularization.json', titleEn: 'Recommendations for revascularization in patients with chronic coronary syndrome', titleRu: 'Рекомендации по реваскуляризации миокарда у пациентов с хроническим коронарным синдромом' },
  { file: 'rt23-revascularization-mode.json', titleEn: 'Recommendations for mode of revascularization in patients with chronic coronary syndrome', titleRu: 'Рекомендации по выбору метода реваскуляризации у пациентов с хроническим коронарным синдромом' },
  { file: 'rt24-ccs-and-heart-failure.json', titleEn: 'Recommendations for management of chronic coronary syndrome patients with chronic heart failure', titleRu: 'Рекомендации по ведению пациентов с хроническим коронарным синдромом и хронической сердечной недостаточностью' },
  { file: 'rt25-anoca-inoca.json', titleEn: 'Recommendations for diagnosis and management of patients with angina with non-obstructive coronary arteries/ischaemia with non-obstructive coronary arteries', titleRu: 'Рекомендации по диагностике и ведению пациентов со стенокардией/ишемией при необструктивном поражении коронарных артерий' },
  { file: 'rt26-special-patient-groups.json', titleEn: 'Recommendations for older, female, high bleeding risk, comorbid, and socially/geographically diverse patients', titleRu: 'Рекомендации для пожилых, женщин, пациентов с высоким риском кровотечений, коморбидных и социально/географически разнообразных групп пациентов' },
  { file: 'rt27-cad-screening-asymptomatic.json', titleEn: 'Recommendations for screening for coronary artery disease in asymptomatic individuals', titleRu: 'Рекомендации по скринингу ишемической болезни сердца у бессимптомных лиц' },
  { file: 'rt28-adherence-lifestyle-changes.json', titleEn: 'Recommendations for adherence to medical therapy and lifestyle changes', titleRu: 'Рекомендации по приверженности к медикаментозной терапии и изменению образа жизни' },
  { file: 'rt29-disease-progression.json', titleEn: 'Recommendations for diagnosis of disease progression in patients with established chronic coronary syndrome', titleRu: 'Рекомендации по диагностике прогрессирования заболевания у пациентов с установленным хроническим коронарным синдромом' },
  { file: 'rt30-revascularization-failure.json', titleEn: 'Recommendations for treatment of revascularization failure', titleRu: 'Рекомендации по лечению неэффективности (несостоятельности) реваскуляризации' },
  { file: 'rt31-refractory-angina.json', titleEn: 'Recommendations for recurrent or refractory angina/ischaemia', titleRu: 'Рекомендации при рецидивирующей или рефрактерной стенокардии/ишемии' }
];

let globalRowCount = 0;
const sections = [];

rtFiles.forEach((item) => {
  const filePath = path.join('data', 'guidelines', 'esc-ccs-2024', item.file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const rows = [];
  data.sections.forEach((sec) => {
    sec.rows.forEach((r) => {
      if (r.class === 'I' || r.class === 'III') {
        globalRowCount++;
        const rowId = 'r' + String(globalRowCount).padStart(2, '0');
        rows.push({
          id: rowId,
          text: r.text,
          class: r.class,
          level: r.level
        });
      }
    });
  });
  if (rows.length > 0) {
    sections.push({
      id: 'sec-' + item.file.replace('.json', ''),
      title: {
        en: item.titleEn,
        ru: item.titleRu
      },
      rows: rows
    });
  }
});

const table10 = {
  schemaVersion: 1,
  id: 'esc-ccs-2024.t10-what-to-do',
  guidelineId: 'esc-ccs-2024',
  number: 'Table 10 (What to do)',
  type: 'recommendations',
  title: {
    en: "Table 10 — 'What to do' and 'What not to do'",
    ru: "Таблица 10 — «Что делать» и «Чего не делать» (Ключевые рекомендации I и III классов)"
  },
  tags: [
    'ccs',
    'what-to-do',
    'what-not-to-do',
    'summary',
    'class-i',
    'class-iii'
  ],
  sections: sections
};

fs.writeFileSync(
  path.join('data', 'guidelines', 'esc-ccs-2024', 't10-what-to-do.json'),
  JSON.stringify(table10, null, 2),
  'utf8'
);
console.log('Successfully generated t10-what-to-do.json: ' + sections.length + ' sections, ' + globalRowCount + ' rows.');
