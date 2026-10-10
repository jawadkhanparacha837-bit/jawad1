import { MedicineItem } from '../types';

export const MEDICINES_DATA: MedicineItem[] = [
  {
    id: 'paracetamol',
    genericName: 'Paracetamol (Acetaminophen)',
    genericNameUr: 'پیراسیٹامول',
    brandExamples: ['Panadol', 'Calpol', 'Febrol', 'Disprol'],
    category: 'Pain & Fever',
    categoryUr: 'درد اور بخار',
    whatItIs: 'A widely used over-the-counter medicine for pain and fever.',
    whatItIsUr: 'درد اور بخار کے لیے بڑے پیمانے پر استعمال ہونے والی ایک عام دوا۔',
    commonUses: ['Headache', 'Mild to moderate pain', 'Fever', 'Body aches from cold or flu'],
    commonUsesUr: ['سر درد', 'ہلکا سے درمیانہ درد', 'بخار', 'نزلہ زکام کی وجہ سے جسم میں درد'],
    howItWorks: 'It reduces pain and fever signals in the body, though its exact action is only partly understood.',
    howItWorksUr: 'یہ جسم میں درد اور بخار کے سگنلز کو کم کرتی ہے۔',
    sideEffects: [
      'Usually well tolerated at normal doses',
      'Rare allergic reactions',
      'Liver strain or damage if taken in excessive amounts or with other paracetamol products'
    ],
    sideEffectsUr: [
      'عام خوراک میں عام طور پر محفوظ ہے',
      'شاذ و نادر الرجی کا ردعمل',
      'زیادہ مقدار لینے سے جگر پر بوجھ یا نقصان کا خطرہ'
    ],
    precautions: [
      'Never exceed the recommended maximum daily dose (usually 4,000 mg in 24 hours for adults).',
      'Check other cold/flu remedies to ensure you are not accidentally doubling up on paracetamol.',
      'Consult a doctor if pain persists for more than 3 days or fever lasts more than 3 days.'
    ],
    precautionsUr: [
      'روزانہ کی زیادہ سے زیادہ خوراک سے تجاوز نہ کریں۔',
      'دیگر ادویات کے اجزاء لازمی چیک کریں تاکہ دوہری خوراک نہ ہو۔',
      'اگر بخار یا درد تین دن سے زیادہ رہے تو فوری ڈاکٹر سے رجوع کریں۔'
    ],
    isPrescription: false
  },
  {
    id: 'ibuprofen',
    genericName: 'Ibuprofen',
    genericNameUr: 'آئبوپروفین',
    brandExamples: ['Brufen', 'Advil', 'Motrin'],
    category: 'Pain & Fever',
    categoryUr: 'درد اور بخار',
    whatItIs: 'A non-steroidal anti-inflammatory drug (NSAID) used to relieve pain, swelling, and fever.',
    whatItIsUr: 'ایک اینٹی انفلیمیٹری دوا جو درد، سوزش اور بخار کو کم کرنے کے لیے استعمال ہوتی ہے۔',
    commonUses: ['Dental pain', 'Menstrual cramps', 'Joint and muscle inflammation', 'Fever'],
    commonUsesUr: ['دانت کا درد', 'جوڑوں اور پٹھوں کا درد', 'سوزش', 'بخار'],
    howItWorks: 'It blocks enzymes called COX-1 and COX-2 that produce prostaglandins—chemicals causing pain and swelling.',
    howItWorksUr: 'یہ ان کیمیکلز کو روکتی ہے جو جسم میں درد اور سوجن کا سبب بنتے ہیں۔',
    sideEffects: ['Stomach upset or heartburn', 'Nausea', 'Increased risk of stomach ulcers with prolonged use'],
    sideEffectsUr: ['معدے میں جلن یا تکلیف', 'متلی', 'طویل استعمال سے معدے کے السر کا خطرہ'],
    precautions: [
      'Always take with food or a glass of milk to protect your stomach lining.',
      'Avoid if you have a history of stomach ulcers, kidney disease, or severe asthma.',
      'Do not combine with other NSAIDs like aspirin or diclofenac without medical oversight.'
    ],
    precautionsUr: [
      'معدے کی حفاظت کے لیے ہمیشہ کھانے یا دودھ کے ساتھ لیں۔',
      'اگر معدے کا السر یا گردے کا مسئلہ ہو تو پرہیز کریں۔',
      'ڈاکٹر کے مشورے کے بغیر دیگر درد کش ادویات کے ساتھ نہ لیں۔'
    ],
    isPrescription: false
  },
  {
    id: 'omeprazole',
    genericName: 'Omeprazole',
    genericNameUr: 'اومیپرازول',
    brandExamples: ['Risek', 'Omega', 'Losec', 'Omepra'],
    category: 'Stomach & Digestion',
    categoryUr: 'معدہ اور ہاضمہ',
    whatItIs: 'A proton pump inhibitor (PPI) that decreases the amount of acid made in the stomach.',
    whatItIsUr: 'معدے میں تیزابیت کی پیداوار کو کم کرنے والی موثر دوا۔',
    commonUses: ['Gastroesophageal reflux (GERD)', 'Stomach ulcers', 'Heartburn and acid indigestion', 'Protection from NSAID stomach irritation'],
    commonUsesUr: ['معدے کی تیزابیت اور جلن', 'سینے کی جلن (GERD)', 'معدے کے زخم (السر)'],
    howItWorks: 'It works by shutting down the acid pumps (H+/K+ ATPase) in the lining of your stomach.',
    howItWorksUr: 'یہ معدے کی دیواروں میں تیزاب پیدا کرنے والے پمپس کو عارضی طور پر روکتی ہے۔',
    sideEffects: ['Headache', 'Abdominal discomfort or bloating', 'Mild diarrhea or constipation'],
    sideEffectsUr: ['سر درد', 'پیٹ میں معمولی تکلیف یا گیس', 'ہلکا اسہال یا قبض'],
    precautions: [
      'Best taken in the morning 30 to 60 minutes before breakfast.',
      'Long-term uninterrupted use can reduce magnesium and calcium absorption; speak with your physician.',
      'Do not crush or chew delayed-release capsules.'
    ],
    precautionsUr: [
      'ناشتے سے 30 سے 60 منٹ پہلے نہار منہ لینا بہترین ہے۔',
      'ڈاکٹر کے مشورے کے بغیر طویل عرصے تک مسلسل استعمال نہ کریں۔',
      'کیپسول کو چبائے بغیر پانی کے ساتھ نگلیں۔'
    ],
    isPrescription: true
  },
  {
    id: 'amoxicillin-clavulanate',
    genericName: 'Co-Amoxiclav (Amoxicillin + Clavulanic Acid)',
    genericNameUr: 'کو-ایموکسیکلیو (اگمنٹن)',
    brandExamples: ['Augmentin', 'Curam', 'Amoclav', 'Klavox'],
    category: 'Antibiotics',
    categoryUr: 'اینٹی بائیوٹکس',
    whatItIs: 'A broad-spectrum penicillin-class antibiotic combined with a beta-lactamase inhibitor.',
    whatItIsUr: 'بیکٹیریل انفیکشن کے خاتمے کے لیے ایک موثر اینٹی بائیوٹک دوا۔',
    commonUses: ['Respiratory tract infections (sinusitis, bronchitis)', 'Ear and throat infections', 'Skin and soft tissue infections', 'Urinary tract infections'],
    commonUsesUr: ['سانس کی نالی، گلے اور کان کا انفیکشن', 'سینے اور پھیپھڑوں کا بیکٹیریل انفیکشن', 'پیشاب کی نالی کا انفیکشن'],
    howItWorks: 'Amoxicillin prevents bacterial cell wall formation, while clavulanic acid prevents bacteria from neutralizing the antibiotic.',
    howItWorksUr: 'یہ بیکٹیریا کی حفاظتی دیوار کو توڑ کر انہیں ختم کرتی ہے۔',
    sideEffects: ['Loose stools or diarrhea', 'Nausea and stomach upset', 'Mild skin rash', 'Yeast overgrowth (thrush)'],
    sideEffectsUr: ['اسہال یا ڈائریا', 'متلی اور پیٹ کی خرابی', 'جلد پر خارش'],
    precautions: [
      'Antibiotics MUST only be taken under a valid doctor’s prescription.',
      'Always finish the exact prescribed course even if you feel completely better early.',
      'Do not take if you have a known penicillin allergy.'
    ],
    precautionsUr: [
      'اینٹی بائیوٹک صرف مستند ڈاکٹر کی ہدایات اور نسخے کے مطابق لیں۔',
      'بہتر محسوس ہونے کے باوجود کورس مکمل کرنا لازمی ہے۔',
      'اگر پینسلین سے الرجی ہو تو ہرگز استعمال نہ کریں۔'
    ],
    isPrescription: true
  },
  {
    id: 'metformin',
    genericName: 'Metformin Hydrochloride',
    genericNameUr: 'میٹفارمین',
    brandExamples: ['Glucophage', 'Neodipar', 'Diaformin'],
    category: 'Diabetes',
    categoryUr: 'ذیابیطس (شوگر)',
    whatItIs: 'The first-line oral medication for controlling high blood sugar in type 2 diabetes.',
    whatItIsUr: 'ٹائپ 2 شوگر کو کنٹرول کرنے والی سب سے بنیادی اور محفوظ دوا۔',
    commonUses: ['Management of Type 2 Diabetes Mellitus', 'Improves insulin sensitivity in Polycystic Ovary Syndrome (PCOS)'],
    commonUsesUr: ['ٹائپ 2 ذیابیطس میں بلڈ شوگر کنٹرول کرنا', 'انسولین کی حساسیت بہتر بنانا'],
    howItWorks: 'It reduces the amount of glucose produced by your liver and helps cells respond better to insulin.',
    howItWorksUr: 'یہ جگر سے شوگر کی پیداوار کم کرتی ہے اور خلیوں کو انسولین کے استعمال میں مدد دیتی ہے۔',
    sideEffects: ['Nausea, diarrhea, abdominal gas (most common in the first 2-3 weeks)', 'Metallic taste in the mouth'],
    sideEffectsUr: ['پیٹ کی خرابی یا گیس (ابتدائی دنوں میں)', 'منہ کا ذائقہ دھاتی ہونا'],
    precautions: [
      'Always take with or directly after your main meals to minimize stomach upset.',
      'Stay well hydrated and report severe fatigue or breathlessness immediately.',
      'Inform your doctor before any contrast dye scans or surgical procedures.'
    ],
    precautionsUr: [
      'معدے کی تکلیف سے بچنے کے لیے ہمیشہ کھانے کے ساتھ یا بعد میں لیں۔',
      'پانی وافر مقدار میں پئیں۔',
      'کسی بھی سرجری یا خصوصی ایکسرے سے قبل ڈاکٹر کو آگاہ کریں۔'
    ],
    isPrescription: true
  },
  {
    id: 'cetirizine',
    genericName: 'Cetirizine Hydrochloride',
    genericNameUr: 'سیٹیریزین',
    brandExamples: ['Rigix', 'Zyrtec', 'T-Day', 'Cetriz'],
    category: 'Allergies',
    categoryUr: 'الرجی',
    whatItIs: 'A second-generation antihistamine used to relieve seasonal and environmental allergy symptoms.',
    whatItIsUr: 'چھینکوں، خارش اور الرجی کی علامات کو روکنے والی دوا۔',
    commonUses: ['Allergic rhinitis (sneezing, runny nose, itchy eyes)', 'Hives (urticaria) and skin itching', 'Pollen and dust allergies'],
    commonUsesUr: ['چھینکیں، بہتی ناک اور آنکھوں کی خارش', 'جلد پر الرجی اور خارش', 'گردوغبار اور موسمی الرجی'],
    howItWorks: 'It selectively blocks histamine H1 receptors, preventing allergic reactions from triggering.',
    howItWorksUr: 'یہ جسم میں ہسٹامائن کے عمل کو روک کر الرجی کی علامات ختم کرتی ہے۔',
    sideEffects: ['Mild drowsiness (less than older antihistamines)', 'Dry mouth', 'Mild fatigue or headache'],
    sideEffectsUr: ['ہلکی غنودگی', 'منہ کا خشک ہونا', 'معمولی تھکاوٹ'],
    precautions: [
      'Although less sedating than first-generation allergy pills, use caution when driving until you know how it affects you.',
      'Avoid taking with alcohol or central nervous system depressants.',
      'Usually taken once daily in the evening.'
    ],
    precautionsUr: [
      'اگر غنودگی محسوس ہو تو گاڑی چلانے یا مشینری کے استعمال سے گریز کریں۔',
      'عام طور پر رات کے وقت روزانہ ایک بار لی جاتی ہے۔'
    ],
    isPrescription: false
  },
  {
    id: 'ors',
    genericName: 'Oral Rehydration Salts (ORS)',
    genericNameUr: 'او آر ایس (نمکول)',
    brandExamples: ['Nimkol', 'Hydrite', 'ORS Sachet'],
    category: 'Stomach & Digestion',
    categoryUr: 'معدہ اور ہاضمہ',
    whatItIs: 'A scientifically balanced mixture of clean salts and glucose used to treat and prevent dehydration.',
    whatItIsUr: 'پانی اور نمکیات کی کمی (ڈی ہائیڈریشن) کو دور کرنے والا حیات بخش محلول۔',
    commonUses: ['Diarrhea and vomiting in children and adults', 'Heat exhaustion and heavy sweating', 'Gastroenteritis dehydration prevention'],
    commonUsesUr: ['ہیضہ، اسہال اور الٹی میں نمکیات کی بحالی', 'گرمی اور پسینے کی زیادتی میں کمزوری دور کرنا'],
    howItWorks: 'The precise ratio of glucose and sodium activates the sodium-glucose cotransporter in the intestine, pulling water rapidly into the bloodstream.',
    howItWorksUr: 'یہ آنتوں کے ذریعے پانی اور ضروری نمکیات کو تیزی سے خون میں جذب کرتا ہے۔',
    sideEffects: ['Extremely safe when mixed in the correct volume of clean water', 'Nausea if gulped too fast'],
    sideEffectsUr: ['صحیح مقدار کے پانی میں حل کرنے پر مکمل محفوظ ہے'],
    precautions: [
      'Always mix the entire sachet in the EXACT volume of clean boiled/filtered water specified on the packet (usually 1 liter or 250ml).',
      'Never boil prepared ORS solution; discard any unused prepared solution after 24 hours.',
      'Sip slowly rather than drinking all at once to avoid triggering vomiting.'
    ],
    precautionsUr: [
      'پیکٹ پر درج پانی کی درست مقدار (عام طور پر ایک لیٹر) میں ہی حل کریں۔',
      'بنائے گئے محلول کو 24 گھنٹے سے زیادہ نہ رکھیں، تازہ بنائیں.',
      'ایک دم پینے کے بجائے گھونٹ گھونٹ کر کے پئیں۔'
    ],
    isPrescription: false
  },
  {
    id: 'salbutamol',
    genericName: 'Salbutamol (Albuterol)',
    genericNameUr: 'سالبوٹامول (وینٹولن)',
    brandExamples: ['Ventolin', 'Salbo', 'Aerolin'],
    category: 'Respiratory',
    categoryUr: 'سانس کی بیماریاں',
    whatItIs: 'A fast-acting bronchodilator inhaler used for quick relief of acute asthma symptoms and wheezing.',
    whatItIsUr: 'دمہ اور سانس کی تنگی میں فوری سکون دینے والا انہیلر۔',
    commonUses: ['Acute asthma attacks and wheezing', 'Shortness of breath due to COPD', 'Exercise-induced asthma prevention'],
    commonUsesUr: ['دمہ کا دورہ اور چھاتی کی گھرگھراہٹ', 'سانس کی شدید تنگی میں فوری آرام'],
    howItWorks: 'It relaxes the smooth muscles in the airways of your lungs within 5 to 15 minutes, allowing more air to flow in.',
    howItWorksUr: 'یہ پھیپھڑوں کی سانس کی نالیوں کو چند منٹوں میں کھول دیتا ہے۔',
    sideEffects: ['Shakiness or hand tremors', 'Increased heart rate (palpitations)', 'Headache'],
    sideEffectsUr: ['ہاتھوں کا کانپنا', 'دل کی دھڑکن تیز ہونا', 'سر درد'],
    precautions: [
      'This is a "rescue" inhaler, not a preventative steroid inhaler. If you need it more than 2-3 times a week, your asthma is not well controlled.',
      'Rinse your mouth after use if combined with steroid inhalers.',
      'If breathlessness does not improve within minutes, seek immediate emergency medical help.'
    ],
    precautionsUr: [
      'یہ ہنگامی وقت کے لیے ہے؛ اگر ہفتے میں کئی بار ضرورت پڑے تو ڈاکٹر سے رابطہ کریں۔',
      'اگر استعمال کے بعد بھی سانس نہ بحال ہو تو فوری ہسپتال جائیں۔'
    ],
    isPrescription: true
  },
  {
    id: 'losartan',
    genericName: 'Losartan Potassium',
    genericNameUr: 'لوسارٹن',
    brandExamples: ['Eziday', 'Cozaar', 'Cosart', 'Cardiostat'],
    category: 'Heart & Blood Pressure',
    categoryUr: 'دل اور بلڈ پریشر',
    whatItIs: 'An angiotensin II receptor blocker (ARB) used to lower high blood pressure and protect kidney function in diabetics.',
    whatItIsUr: 'ہائی بلڈ پریشر کو کنٹرول کرنے اور دل و گردوں کی حفاظت کی دوا۔',
    commonUses: ['Hypertension (high blood pressure)', 'Kidney protection in patients with type 2 diabetes and proteinuria', 'Lowering stroke risk in patients with heart disease'],
    commonUsesUr: ['ہائی بلڈ پریشر کا علاج', 'ذیابیطس کے مریضوں میں گردوں کی نگہداشت'],
    howItWorks: 'It blocks angiotensin II from binding to receptors, preventing blood vessels from constricting and narrowing.',
    howItWorksUr: 'یہ خون کی نالیوں کو کھلا اور پرسکون رکھتی ہے جس سے بلڈ پریشر کم ہوتا ہے۔',
    sideEffects: ['Dizziness or lightheadedness when standing up quickly', 'Fatigue', 'High potassium levels (hyperkalemia)'],
    sideEffectsUr: ['اچانک اٹھنے پر چکر آنا', 'تھکاوٹ', 'خون میں پوٹاشیم کی سطح بڑھنا'],
    precautions: [
      'Take at the same time every day with or without food.',
      'STRICTLY CONTRAINDICATED in pregnancy as it can harm the developing baby.',
      'Have your doctor regularly monitor your kidney function and potassium levels.'
    ],
    precautionsUr: [
      'روزانہ ایک ہی وقت پر پابندی سے لیں۔',
      'حمل کے دوران اس کا استعمال سخت ممنوع ہے۔',
      'گردوں کے ٹیسٹ وقتاً فوقتاً کرواتے رہیں۔'
    ],
    isPrescription: true
  }
];

export const MEDICINE_CATEGORIES = [
  'All',
  'Pain & Fever',
  'Stomach & Digestion',
  'Antibiotics',
  'Diabetes',
  'Allergies',
  'Respiratory',
  'Heart & Blood Pressure'
] as const;
