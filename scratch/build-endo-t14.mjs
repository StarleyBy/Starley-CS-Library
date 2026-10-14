import fs from 'fs';
import path from 'path';

const rtFiles = [
  { file: 'rt01-dental-prophylaxis.json', titleEn: 'Recommendations for antibiotic prophylaxis in patients with cardiovascular diseases undergoing oro-dental procedures at increased risk of infective endocarditis', titleRu: 'Рекомендации по антибиотикопрофилактике у пациентов с сердечно-сосудистыми заболеваниями при стоматологических процедурах с повышенным риском инфекционного эндокардита' },
  { file: 'rt02-prevention-high-risk.json', titleEn: 'Recommendations for infective endocarditis prevention in high-risk patients', titleRu: 'Рекомендации по профилактике инфекционного эндокардита у пациентов высокого риска' },
  { file: 'rt03-prevention-cardiac-procedures.json', titleEn: 'Recommendations for infective endocarditis prevention in cardiac procedures', titleRu: 'Рекомендации по профилактике инфекционного эндокардита при кардиологических вмешательствах' },
  { file: 'rt04-endocarditis-team.json', titleEn: 'Recommendations for the Endocarditis Team', titleRu: 'Рекомендации по мультидисциплинарной «Команде по эндокардиту»' },
  { file: 'rt05-echocardiography.json', titleEn: 'Recommendations for the role of echocardiography in infective endocarditis', titleRu: 'Рекомендации по роли эхокардиографии при инфекционном эндокардите' },
  { file: 'rt06-ct-nuclear-mri.json', titleEn: 'Recommendations for the role of computed tomography, nuclear imaging, and magnetic resonance in infective endocarditis', titleRu: 'Рекомендации по роли компьютерной томографии, радионуклидной визуализации и магнитно-резонансной томографии при инфекционном эндокардите' },
  { file: 'rt07-oral-streptococci.json', titleEn: 'Recommendations for antibiotic treatment of infective endocarditis due to oral streptococci and Streptococcus gallolyticus group', titleRu: 'Рекомендации по антибактериальной терапии инфекционного эндокардита, вызванного оральными стрептококками и группой Streptococcus gallolyticus' },
  { file: 'rt08-staphylococcus.json', titleEn: 'Recommendations for antibiotic treatment of infective endocarditis due to Staphylococcus spp.', titleRu: 'Рекомендации по антибактериальной терапии инфекционного эндокардита, вызванного Staphylococcus spp.' },
  { file: 'rt09-enterococcus.json', titleEn: 'Recommendations for antibiotic treatment of infective endocarditis due to Enterococcus spp.', titleRu: 'Рекомендации по антибактериальной терапии инфекционного эндокардита, вызванного Enterococcus spp.' },
  { file: 'rt11-outpatient-antibiotic-treatment.json', titleEn: 'Recommendations for outpatient antibiotic treatment of infective endocarditis', titleRu: 'Рекомендации по амбулаторной антибактериальной терапии инфекционного эндокардита' },
  { file: 'rt12-surgical-indications.json', titleEn: 'Recommendations for the main indications of surgery in infective endocarditis (native valve endocarditis and prosthetic valve endocarditis)', titleRu: 'Рекомендации по основным показаниям к хирургическому лечению инфекционного эндокардита (эндокардит нативного и протезированного клапанов)' },
  { file: 'rt13-neurological-complications.json', titleEn: 'Recommendations for the treatment of neurological complications of infective endocarditis', titleRu: 'Рекомендации по лечению неврологических осложнений инфекционного эндокардита' },
  { file: 'rt15-musculoskeletal-manifestations.json', titleEn: 'Recommendations for patients with musculoskeletal manifestations of infective endocarditis', titleRu: 'Рекомендации для пациентов с мышечно-скелетными проявлениями инфекционного эндокардита' },
  { file: 'rt16-preoperative-coronary-anatomy.json', titleEn: 'Recommendations for pre-operative coronary anatomy assessment in patients requiring surgery for infective endocarditis', titleRu: 'Рекомендации по предоперационной оценке анатомии коронарных артерий у пациентов, нуждающихся в хирургическом лечении инфекционного эндокардита' },
  { file: 'rt17-surgery-timing-neurological.json', titleEn: 'Indications and timing of cardiac surgery after neurological complications in active infective endocarditis', titleRu: 'Показания и сроки кардиохирургического вмешательства после неврологических осложнений при активном инфекционном эндокардите' },
  { file: 'rt18-post-discharge-follow-up.json', titleEn: 'Recommendations for post-discharge follow-up', titleRu: 'Рекомендации по диспансерному наблюдению после выписки из стационара' },
  { file: 'rt19-prosthetic-valve-endocarditis.json', titleEn: 'Recommendations for prosthetic valve endocarditis', titleRu: 'Рекомендации при инфекционном эндокардите протезированного клапана' },
  { file: 'rt20-cied-endocarditis.json', titleEn: 'Recommendations for cardiovascular implanted electronic device-related infective endocarditis', titleRu: 'Рекомендации при инфекционном эндокардите, ассоциированном с имплантируемыми электронными сердечно-сосудистыми устройствами' },
  { file: 'rt21-right-sided-surgery.json', titleEn: 'Recommendations for the surgical treatment of right-sided infective endocarditis', titleRu: 'Рекомендации по хирургическому лечению правостороннего инфекционного эндокардита' },
  { file: 'rt22-antithrombotic-therapy.json', titleEn: 'Recommendations for the use of antithrombotic therapy in infective endocarditis', titleRu: 'Рекомендации по применению антитромботической терапии при инфекционном эндокардите' }
];

let globalRowCount = 0;
const sections = [];

rtFiles.forEach((item) => {
  const filePath = path.join('data', 'guidelines', 'esc-endo-2023', item.file);
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

const table14 = {
  schemaVersion: 1,
  id: 'esc-endo-2023.t14-what-to-do',
  guidelineId: 'esc-endo-2023',
  number: 'Table 14 (What to do)',
  type: 'recommendations',
  title: {
    en: "Table 14 — 'What to do' and 'What not to do'",
    ru: "Таблица 14 — «Что делать» и «Чего не делать» (Ключевые рекомендации I и III классов)"
  },
  tags: [
    'endocarditis',
    'what-to-do',
    'what-not-to-do',
    'summary',
    'class-i',
    'class-iii'
  ],
  sections: sections
};

fs.writeFileSync(
  path.join('data', 'guidelines', 'esc-endo-2023', 't14-what-to-do.json'),
  JSON.stringify(table14, null, 2),
  'utf8'
);
console.log('Successfully generated t14-what-to-do.json: ' + sections.length + ' sections, ' + globalRowCount + ' rows.');
