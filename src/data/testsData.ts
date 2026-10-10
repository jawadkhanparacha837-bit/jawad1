import { TestItem } from '../types';

export const TESTS_DATA: TestItem[] = [
  {
    id: 'ecg',
    name: 'Electrocardiogram (ECG / EKG)',
    nameUr: 'الیکٹرو کارڈیوگرام (ای سی جی)',
    abbreviation: 'ECG',
    category: 'Cardiac & Imaging',
    categoryUr: 'دل اور امیجنگ',
    whatTheTestIs: 'Records the electrical activity of the heart over a few minutes.',
    whatTheTestIsUr: 'چند منٹوں میں دل کی برقی سرگرمی اور دھڑکن کے ردھم کو ریکارڈ کرنے والا ٹیسٹ۔',
    whyPerformed: 'Chest pain, palpitations, screening before surgery.',
    whyPerformedUr: 'سینے میں درد، دل کی غیر معمولی دھڑکن، سرجری سے پہلے معائنہ۔',
    whatItMeasures: 'Heart rhythm and electrical patterns.',
    whatItMeasuresUr: 'دل کی دھڑکن کی رفتار، ترتیب اور برقی سگنلز۔',
    generalMeaning: 'Can show rhythm problems or strain patterns; a normal ECG does not rule out every heart issue.',
    generalMeaningUr: 'دھڑکن کی بے قاعدگی یا دل کے پٹھوں پر دباؤ کی نشاندہی کرتا ہے؛ نارمل رپورٹ بھی ہر دل کی بیماری کو مکمل رد نہیں کرتی۔',
    factorsAffecting: ['Skin preparation', 'Movement', 'Electrode placement', 'Certain medications'],
    factorsAffectingUr: ['جلد کی صفائی', 'ٹیسٹ کے دوران ہلنا جلنا', 'الیکٹروڈ لگانے کی جگہ'],
    questionsToAsk: [
      'Does this need a Holter or stress test?',
      'Are my symptoms heart-related?',
      'Do my current medications alter my rhythm pattern?'
    ],
    questionsToAskUr: [
      'کیا مجھے 24 گھنٹے ہولٹر یا ایکو ٹیسٹ کی ضرورت ہے؟',
      'کیا میری یہ علامات دل کی تکلیف سے متعلق ہیں؟'
    ]
  },
  {
    id: 'cbc',
    name: 'Complete Blood Count (CBC)',
    nameUr: 'مکمل خون کا ٹیسٹ (سی بی سی)',
    abbreviation: 'CBC',
    category: 'Blood Tests',
    categoryUr: 'خون کے ٹیسٹ',
    whatTheTestIs: 'A foundational blood test that evaluates the cells circulating in your bloodstream.',
    whatTheTestIsUr: 'خون کے سرخ، سفید خلیات اور پلیٹ لیٹس کا جامع معائنہ۔',
    whyPerformed: 'Fatigue, unexplained fever, suspicion of infection, bleeding or bruising, dengue screening, anemia.',
    whyPerformedUr: 'غیر معمولی تھکاوٹ، بخار، ڈینگی کے شبہ میں پلیٹ لیٹس چیک کرنا، خون کی کمی۔',
    whatItMeasures: 'Hemoglobin (Hb), Red Blood Cells (RBC), White Blood Cells (WBC), Platelets, Hematocrit.',
    whatItMeasuresUr: 'ہیموگلوبن، سفید خلیات، سرخ خلیات، اور پلیٹ لیٹس۔',
    generalMeaning: 'High WBC suggests infection or inflammation; low platelets can indicate viral infections like dengue; low Hb indicates anemia.',
    generalMeaningUr: 'سفید خلیات زیادہ ہونا انفیکشن، پلیٹ لیٹس کم ہونا ڈینگی یا وائرل مرض، اور ہیموگلوبن کم ہونا اینیمیا ظاہر کرتا ہے۔',
    factorsAffecting: ['Dehydration or heavy hydration', 'Recent viral infections', 'Pregnancy', 'Smoking', 'Altitude'],
    factorsAffectingUr: ['پانی کی شدید کمی', 'حالیہ وائرل انفیکشن', 'تمباکو نوشی'],
    questionsToAsk: [
      'Is my hemoglobin level normal for my age and gender?',
      'If my platelet count is dropping, how frequently should we repeat it?',
      'Do I need an iron profile or vitamin B12 check?'
    ],
    questionsToAskUr: [
      'کیا میرا ہیموگلوبن ٹھیک ہے یا آئرن کی کمی ہے؟',
      'پلیٹ لیٹس کم ہونے پر دوبارہ ٹیسٹ کب کروانا چاہیے؟'
    ]
  },
  {
    id: 'hba1c',
    name: 'Hemoglobin A1c (HbA1c & Fasting Glucose)',
    nameUr: 'شوگر اور ایچ بی اے ون سی ٹیسٹ',
    abbreviation: 'HbA1c',
    category: 'Routine Screening',
    categoryUr: 'بنیادی اسکریننگ',
    whatTheTestIs: 'Measures the average blood glucose (sugar) level over the past 2 to 3 months.',
    whatTheTestIsUr: 'پچھلے دو سے تین مہینوں کی اوسط بلڈ شوگر کی سطح ناپنے والا معتبر ٹیسٹ۔',
    whyPerformed: 'Screening for prediabetes or diabetes; monitoring glycemic control in diagnosed patients.',
    whyPerformedUr: 'ذیابیطس کی تشخیص اور شوگر کے کنٹرول کا باقاعدہ معائنہ۔',
    whatItMeasures: 'The percentage of hemoglobin in red blood cells that has glucose attached to it.',
    whatItMeasuresUr: 'سرخ خلیات پر لگی گلوکوز کا تناسب (فیصد)۔',
    generalMeaning: 'Below 5.7% is normal; 5.7% to 6.4% indicates prediabetes; 6.5% or higher on two occasions indicates diabetes.',
    generalMeaningUr: '5.7% سے کم نارمل، 5.7% سے 6.4% پری ذیابیطس، اور 6.5% یا اس سے زیادہ ذیابیطس کی علامت ہے۔',
    factorsAffecting: ['Hemoglobin variants or thalassemia trait', 'Severe iron deficiency anemia', 'Recent blood transfusions'],
    factorsAffectingUr: ['تھیلیسیمیا کی علامات', 'خون کی شدید کمی', 'حالیہ خون لگوانا'],
    questionsToAsk: [
      'What should my individualized target HbA1c number be?',
      'How does my diet and daily step count affect this result?',
      'Should I repeat this test every 3 or 6 months?'
    ],
    questionsToAskUr: [
      'میری عمر اور صحت کے مطابق میرا ٹارگٹ کیا ہونا چاہیے؟',
      'یہ ٹیسٹ ہر 3 ماہ بعد دہرانا ہے یا 6 ماہ بعد؟'
    ]
  },
  {
    id: 'lipid-profile',
    name: 'Lipid Profile (Cholesterol Panel)',
    nameUr: 'لپڈ پروفائل (کولیسٹرول ٹیسٹ)',
    abbreviation: 'Lipids',
    category: 'Blood Tests',
    categoryUr: 'خون کے ٹیسٹ',
    whatTheTestIs: 'Measures various types of fats (lipids) in the blood to assess cardiovascular risk.',
    whatTheTestIsUr: 'خون میں کولیسٹرول اور مختلف چکنائیوں کی مقدار ناپنے والا ٹیسٹ۔',
    whyPerformed: 'Routine health checkup, high blood pressure, family history of heart disease, obesity.',
    whyPerformedUr: 'دل کے امراض کے خطرے کا اندازہ، ہائی بلڈ پریشر، خاندانی ہسٹری۔',
    whatItMeasures: 'Total Cholesterol, LDL ("bad" cholesterol), HDL ("good" cholesterol), Triglycerides.',
    whatItMeasuresUr: 'ٹوٹل کولیسٹرول، ایل ڈی ایل، ایچ ڈی ایل اور ٹرائی گلسرائیڈز۔',
    generalMeaning: 'Higher LDL and triglycerides increase arterial plaque buildup; higher HDL protects blood vessels.',
    generalMeaningUr: 'زیادہ ایل ڈی ایل شریانوں میں رکاوٹ کا سبب بنتا ہے جبکہ زیادہ ایچ ڈی ایل دل کی حفاظت کرتا ہے۔',
    factorsAffecting: ['Fasting duration (9-12 hours required for triglycerides)', 'Recent fatty meal', 'Alcohol', 'Acute illness'],
    factorsAffectingUr: ['ٹیسٹ سے قبل 10 سے 12 گھنٹے کا فاقہ ضروری ہے', 'چکنائی والی غذا'],
    questionsToAsk: [
      'What is my 10-year cardiovascular risk score?',
      'Can lifestyle changes suffice, or do I require a statin medication?',
      'Should I also check an ApoB or Lipoprotein(a)?'
    ],
    questionsToAskUr: [
      'کیا پرہیز اور ورزش کافی ہے یا دوا کی ضرورت ہے؟',
      'خوراک میں کن چکنائیوں سے پرہیز کرنا چاہیے؟'
    ]
  },
  {
    id: 'lft',
    name: 'Liver Function Tests (LFT)',
    nameUr: 'جگر کا ٹیسٹ (ایل ایف ٹی)',
    abbreviation: 'LFT',
    category: 'Organ Function',
    categoryUr: 'اعضاء کی کارکردگی',
    whatTheTestIs: 'A group of blood tests that check enzymes, proteins, and substances made by the liver.',
    whatTheTestIsUr: 'جگر کے انزائمز اور افعال کی درستگی جانچنے کا بلڈ ٹیسٹ۔',
    whyPerformed: 'Yellow eyes or skin (jaundice), abdominal swelling, fatty liver checks, hepatitis screening.',
    whyPerformedUr: 'یرقان، آنکھوں کا پیلا پن، ہیپاٹائٹس، فیٹی لیور یا دوا کے اثرات چیک کرنا۔',
    whatItMeasures: 'ALT (SGPT), AST (SGOT), Alkaline Phosphatase (ALP), Total Bilirubin, Direct Bilirubin, Albumin.',
    whatItMeasuresUr: 'ایس جی پی ٹی (ALT)، بلیروبن، الکلائن فاسفیٹیز، اور پروٹین۔',
    generalMeaning: 'Elevated ALT/AST indicate liver cell inflammation (such as hepatitis or fatty liver); high bilirubin causes jaundice.',
    generalMeaningUr: 'ایس جی پی ٹی زیادہ ہونا جگر پر سوزش یا چربی کی نشاندہی کرتا ہے۔',
    factorsAffecting: ['Strenuous muscular workout within 24h', 'Painkillers like paracetamol overdose', 'Hepatitis viruses'],
    factorsAffectingUr: ['شدید ورزش', 'پین کلرز کا زیادہ استعمال', 'وائرل انفیکشن'],
    questionsToAsk: [
      'Do elevated enzymes suggest fatty liver, viral hepatitis, or medication side effects?',
      'Is an ultrasound of the abdomen needed to look at the liver texture?',
      'Should we screen for Hepatitis B and C?'
    ],
    questionsToAskUr: [
      'کیا الٹراساؤنڈ کی ضرورت ہے؟',
      'کیا ہیپاٹائٹس بی اور سی کا ٹیسٹ کروانا چاہیے؟'
    ]
  },
  {
    id: 'rft',
    name: 'Renal Function Tests (RFT / Serum Creatinine)',
    nameUr: 'گردوں کا ٹیسٹ (کریٹینین اور آر ایف ٹی)',
    abbreviation: 'RFT',
    category: 'Organ Function',
    categoryUr: 'اعضاء کی کارکردگی',
    whatTheTestIs: 'Evaluates how effectively your kidneys are filtering waste products from the blood.',
    whatTheTestIsUr: 'گردوں کی فلٹریشن اور خون صاف کرنے کی صلاحیت معلوم کرنے والا ٹیسٹ۔',
    whyPerformed: 'High blood pressure, diabetes monitoring, swelling in feet or face, long-term NSAID painkiller use.',
    whyPerformedUr: 'ہائی بلڈ پریشر، پاؤں پر سوجن، شوگر کے مریضوں میں گردوں کی جانچ۔',
    whatItMeasures: 'Serum Creatinine, Blood Urea / BUN, Estimated Glomerular Filtration Rate (eGFR), Electrolytes.',
    whatItMeasuresUr: 'سیرم کریٹینین، یوریا اور ای جی ایف آر (eGFR)۔',
    generalMeaning: 'Higher creatinine or lower eGFR indicates reduced kidney filtration capacity.',
    generalMeaningUr: 'کریٹینین کی سطح زیادہ ہونا گردوں کی کارکردگی میں کمی کو ظاہر کرتا ہے۔',
    factorsAffecting: ['Severe dehydration', 'High meat intake previous day', 'Heavy weight lifting', 'Certain blood pressure drugs'],
    factorsAffectingUr: ['پانی کی شدید کمی', 'ٹیسٹ سے قبل گوشت کا زیادہ استعمال'],
    questionsToAsk: [
      'What is my estimated GFR (filtration rate)?',
      'Do my routine blood pressure or diabetes drugs need dose adjustments based on this result?',
      'Should we also check urine for microalbumin?'
    ],
    questionsToAskUr: [
      'گردوں کی فلٹریشن کی شرح (eGFR) کتنی ہے؟',
      'کیا پیشاب میں پروٹین کا ٹیسٹ کروانے کی ضرورت ہے؟'
    ]
  },
  {
    id: 'chest-xray',
    name: 'Chest X-Ray (CXR PA View)',
    nameUr: 'سینے کا ایکسرے',
    abbreviation: 'CXR',
    category: 'Cardiac & Imaging',
    categoryUr: 'دل اور امیجنگ',
    whatTheTestIs: 'A quick, non-invasive imaging test that produces images of the lungs, heart, ribs, and blood vessels.',
    whatTheTestIsUr: 'پھیپھڑوں، دل کے سائز اور پسلیوں کی تصویر لینے والا ریڈیوگرافک معائنہ۔',
    whyPerformed: 'Persistent cough lasting over 3 weeks, chest pain, shortness of breath, tuberculosis screening, pneumonia.',
    whyPerformedUr: 'تین ہفتوں سے زیادہ کھانسی، سانس کی تکلیف، ٹی بی یا نمونیا کا شبہ۔',
    whatItMeasures: 'Visual densities of lung fields, cardiac silhouette size, pleural space fluid or air.',
    whatItMeasuresUr: 'پھیپھڑوں کی صفائی، دل کی جسامت، اور چھاتی میں پانی یا ہوا کی موجودگی۔',
    generalMeaning: 'Can reveal fluid accumulation (effusion), lung consolidation (pneumonia or TB), or an enlarged heart silhouette.',
    generalMeaningUr: 'نمونیا، ٹی بی، پھیپھڑوں میں انفیکشن یا دل کے بڑے ہونے کی نشاندہی کرتا ہے۔',
    factorsAffecting: ['Deep inhalation during exposure', 'Rotation or posture during image capture', 'Jewelry or metallic clips'],
    factorsAffectingUr: ['ایکسرے کے وقت گہرا سانس اندر روکنا ضروری ہے'],
    questionsToAsk: [
      'Are the lung fields completely clear or is there an infection patch?',
      'Does my heart shadow appear enlarged?',
      'Does this require a follow-up high-resolution CT scan?'
    ],
    questionsToAskUr: [
      'کیا پھیپھڑوں میں کوئی داغ، نمونیا یا انفیکشن ہے؟',
      'کیا دل کا سائز نارمل ہے؟'
    ]
  },
  {
    id: 'urine-re',
    name: 'Urine Routine Examination (Urine R/E)',
    nameUr: 'پیشاب کا تفصیلی معائنہ (یورین آر ای)',
    abbreviation: 'Urine R/E',
    category: 'Routine Screening',
    categoryUr: 'بنیادی اسکریننگ',
    whatTheTestIs: 'Analyzes the physical, chemical, and microscopic properties of urine.',
    whatTheTestIsUr: 'پیشاب کے نمونے کا کیمیائی اور خوردبینی لیبارٹری معائنہ۔',
    whyPerformed: 'Burning urination, lower back pain, suspected urinary infection, kidney stones, diabetes check.',
    whyPerformedUr: 'پیشاب میں جلن یا درد، بار بار پیشاب آنا، گردے میں پتھری کا شبہ۔',
    whatItMeasures: 'Color, pH, Specific gravity, Pus cells (leukocytes), Red blood cells, Protein (albumin), Sugar, Crystals.',
    whatItMeasuresUr: 'پس سیلز (Pus cells)، خون کے خلیات، پروٹین، اور کرسٹلز۔',
    generalMeaning: 'Pus cells > 5 indicates a urinary tract infection (UTI); red blood cells can indicate kidney stones; protein indicates kidney stress.',
    generalMeaningUr: 'پس سیلز زیادہ ہونا انفیکشن، سرخ خلیات پتھری یا زخم، اور پروٹین گردے کے دباؤ کی علامت ہے۔',
    factorsAffecting: ['Clean-catch midstream collection technique is essential to avoid skin contamination', 'Menstruation in women'],
    factorsAffectingUr: ['درمیانی دھار کا صاف نمونہ لینا لازمی ہے'],
    questionsToAsk: [
      'Do the pus cell counts indicate a need for a urine culture and sensitivity test?',
      'Are there oxalate or uric acid crystals indicating kidney stones?',
      'Should I increase daily water intake?'
    ],
    questionsToAskUr: [
      'کیا اینٹی بائیوٹک شروع کرنے سے پہلے یورین کلچر کروانا چاہیے؟',
      'کیا رپورٹ میں گردے کی پتھری کے کرسٹلز ہیں؟'
    ]
  }
];

export const TEST_CATEGORIES = [
  'All',
  'Blood Tests',
  'Organ Function',
  'Cardiac & Imaging',
  'Routine Screening'
] as const;
