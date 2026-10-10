import { BodySystemItem } from '../types';

export const BODY_SYSTEMS_DATA: BodySystemItem[] = [
  {
    id: 'brain',
    name: 'Brain & Nervous System',
    nameUr: 'دماغ اور اعصابی نظام',
    tagline: 'The command center for thoughts, movement, senses, and voluntary functions.',
    taglineUr: 'سوچ، احساسات، یادداشت اور جسم کی تمام حرکات کا کنٹرول سینٹر۔',
    iconName: 'Brain',
    description: 'The brain and nervous system control sensory processing, muscle coordination, emotions, reasoning, and involuntary functions like heart rate and breathing.',
    descriptionUr: 'دماغ اعصاب کے ذریعے جسم کے ہر عضو تک پیغامات پہنچاتا ہے اور سوچ، دیکھنا، سننا اور بولنا ممکن بناتا ہے۔',
    primaryOrgans: ['Cerebrum (Thinking & Memory)', 'Cerebellum (Balance & Movement)', 'Brainstem (Vital Rhythms)', 'Spinal Cord & Peripheral Nerves'],
    primaryOrgansUr: ['دماغی پرت (یادداشت اور سوچ)', 'چھوٹا دماغ (توازن)', 'حرام مغز اور اعصاب'],
    commonIssues: ['Tension and Migraine Headaches', 'Sleep disturbances and chronic stress', 'Nerve impingement (Sciatica)', 'Vertigo and balance issues'],
    commonIssuesUr: ['دردِ شقیقہ (مائیگرین) اور عام سر درد', 'نیند کی کمی اور بے چینی', 'اعصابی کھچاؤ'],
    warningSigns: [
      'Sudden severe weakness or numbness on one side of face or body',
      'Sudden loss of speech or difficulty finding words',
      'The "worst headache of your life" appearing in seconds',
      'Unexplained loss of consciousness or seizures'
    ],
    warningSignsUr: [
      'چہرے یا جسم کے ایک طرف اچانک کمزوری یا سن ہونا (فالج کی علامت)',
      'اچانک بولنے میں شدید رکاوٹ',
      'زندگی کا شدید ترین اچانک سر درد',
      'بے ہوشی یا جھٹکے لگنا'
    ],
    careTips: [
      'Prioritize 7 to 8 hours of quality sleep to clear cellular waste from brain tissue.',
      'Stay mentally active with puzzles, reading, and learning new skills.',
      'Keep blood pressure and blood sugar strictly managed to protect cerebral arteries.'
    ],
    careTipsUr: [
      'روزانہ 7 سے 8 گھنٹے کی پرسکون نیند لیں تاکہ دماغ تازہ دم رہے۔',
      'بلڈ پریشر اور شوگر کو قابو میں رکھیں تاکہ دماغی رگیں محفوظ رہیں۔'
    ]
  },
  {
    id: 'heart',
    name: 'Heart & Circulatory System',
    nameUr: 'دل اور دورانِ خون کا نظام',
    tagline: 'Pumps oxygen-rich blood, nutrients, and life through 60,000 miles of vessels.',
    taglineUr: 'پورے جسم میں آکسیجن اور غذائیت سے بھرپور خون پہنچانے والا پمپنگ سسٹم۔',
    iconName: 'Heart',
    description: 'A muscular pump that beats approximately 100,000 times daily, distributing oxygenated blood to every tissue and organ.',
    descriptionUr: 'ایک پٹھوں والا عضو جو روزانہ ایک لاکھ بار دھڑکتا ہے اور ہر عضو تک تازہ خون پہنچاتا ہے۔',
    primaryOrgans: ['Heart (Atria & Ventricles)', 'Arteries (Carrying oxygen out)', 'Veins (Returning blood to lungs)', 'Capillaries (Micro-exchange)'],
    primaryOrgansUr: ['دل کے چار خانے', 'شریانیں (صاف خون کی نالیاں)', 'وریدیں'],
    commonIssues: ['High Blood Pressure (Hypertension)', 'Coronary Artery Disease (Plaque build-up)', 'Arrhythmias (Irregular heart rhythm)', 'Heart Failure'],
    commonIssuesUr: ['ہائی بلڈ پریشر', 'شریانوں کی تنگی اور رکاوٹ', 'دل کی دھڑکن کی بے قاعدگی'],
    warningSigns: [
      'Crushing chest tightness or pressure that radiates to left arm or jaw',
      'Sudden breathlessness with minimal exertion or when lying flat',
      'Unexplained cold sweat with nausea and lightheadedness',
      'Fainting spells during physical activity'
    ],
    warningSignsUr: [
      'سینے میں شدید گھٹن یا دباؤ جو بائیں بازو یا جبڑے میں پھیلے',
      'تھوڑی سی محنت پر شدید سانس پھولنا',
      'ٹھنڈے پسینے کے ساتھ چکر آنا اور متلی ہونا'
    ],
    careTips: [
      'Engage in 150 minutes of moderate aerobic exercise (like brisk walking) weekly.',
      'Limit deep-fried items, trans-fats, and heavy salt intake.',
      'Check blood pressure and lipid panels at least once a year.'
    ],
    careTipsUr: [
      'ہفتے میں کم از کم 150 منٹ چہل قدمی یا معتدل ورزش کریں۔',
      'چکنائی، تلی ہوئی اشیاء اور نمک کا زیادہ استعمال ترک کریں۔'
    ]
  },
  {
    id: 'lungs',
    name: 'Lungs & Respiratory System',
    nameUr: 'پھیپھڑے اور نظامِ تنفس',
    tagline: 'Breathes in vital oxygen and expels carbon dioxide with every breath.',
    taglineUr: 'ہر سانس کے ساتھ زندگی بخش آکسیجن فراہم کرنے اور فاسد گیسوں کا اخراج کرنے والا نظام۔',
    iconName: 'Wind',
    description: 'Extracts oxygen from inhaled air into the bloodstream and eliminates carbon dioxide via branching bronchial airways and alveoli.',
    descriptionUr: 'ہوا سے آکسیجن حاصل کر کے خون میں شامل کرتا ہے اور کاربن ڈائی آکسائیڈ کو باہر نکالتا ہے۔',
    primaryOrgans: ['Lungs (Left & Right lobes)', 'Trachea (Windpipe)', 'Bronchi & Bronchioles', 'Alveoli (Microscopic air sacs)', 'Diaphragm'],
    primaryOrgansUr: ['دائیں اور بائیں پھیپھڑے', 'سانس کی نالی', 'ہوا کی باریک تھیلیاں', 'ڈایافرام'],
    commonIssues: ['Asthma (Airway inflammation & bronchospasm)', 'Chronic Obstructive Pulmonary Disease (COPD)', 'Bronchitis and Pneumonia', 'Seasonal pollen allergies and smog irritation'],
    commonIssuesUr: ['دمہ اور سانس کی نالیوں کی سوزش', 'نمونیا اور سینے کا انفیکشن', 'سموگ اور الرجی کے اثرات'],
    warningSigns: [
      'Severe difficulty catching breath or inability to speak full sentences',
      'Bluish or grayish lips, fingernails, or tongue',
      'Coughing up fresh red blood',
      'Stridor (high-pitched wheezing sound on inhaling)'
    ],
    warningSignsUr: [
      'سانس لینے میں شدید دشواری یا جملہ پورا نہ بول سکنا',
      'ہونٹوں یا ناخنوں کا نیلا پڑ جانا (آکسیجن کی کمی)',
      'کھانسی کے ساتھ خون آنا'
    ],
    careTips: [
      'STRICTLY avoid all cigarette, sheesha, and vape smoke—both active and passive.',
      'Wear high-filtration masks (N95) during urban winter smog spikes.',
      'Practice slow deep diaphragmatic breathing daily to expand lung capacity.'
    ],
    careTipsUr: [
      'تمباکو نوشی اور شیشہ کے دھوئیں سے مکمل پرہیز کریں۔',
      'موسمِ سرما میں سموگ اور گردوغبار کے دوران ماسک استعمال کریں۔'
    ]
  },
  {
    id: 'digestive',
    name: 'Digestive System',
    nameUr: 'نظامِ انہضام (معدہ اور آنتیں)',
    tagline: 'Breaks down nutrients, fuels your energy, and houses 70% of your immune defenses.',
    taglineUr: 'خوراک کو ہضم کر کے جسم کو توانائی فراہم کرنے اور قوتِ مدافعت کا مرکز۔',
    iconName: 'Utensils',
    description: 'A 30-foot tract spanning the mouth, esophagus, stomach, liver, pancreas, and intestines that digests food, absorbs nutrients, and eliminates solid waste.',
    descriptionUr: 'منہ، خوراک کی نالی، معدہ، جگر، لبلبہ اور آنتوں پر مشتمل نظام جو خوراک سے توانائی نکالتا ہے۔',
    primaryOrgans: ['Stomach (Acid & enzymes)', 'Small Intestine (Nutrient absorption)', 'Large Intestine & Colon (Water reclamation)', 'Liver & Gallbladder', 'Pancreas'],
    primaryOrgansUr: ['معدہ (تیزاب اور انزائمز)', 'چھوٹی آنت', 'بڑی آنت', 'جگر اور پتہ', 'لبلبہ'],
    commonIssues: ['GERD and Acid Reflux', 'Irritable Bowel Syndrome (IBS)', 'Stomach and Duodenal Ulcers', 'Gallstones and Fatty Liver'],
    commonIssuesUr: ['معدے کی جلن اور تیزابیت', 'بدہضمی اور گیس', 'معدے کے السر', 'پتے کی پتھری'],
    warningSigns: [
      'Black tarry stools or vomiting material resembling coffee grounds (internal bleeding)',
      'Yellowing of skin or eyes (jaundice)',
      'Unexplained rapid weight loss without dieting',
      'Difficulty or severe pain when swallowing food'
    ],
    warningSignsUr: [
      'کالے رنگ کے پاخانے یا قے میں خون (معدے میں خون بہنے کی علامت)',
      'آنکھوں یا جلد کا پیلا ہونا (یرقان)',
      'کھانا نگلنے میں شدید دشواری یا درد'
    ],
    careTips: [
      'Eat plenty of dietary fiber from fresh vegetables, lentils (daal), and whole wheat.',
      'Avoid overeating late at night; allow at least 2.5 hours between dinner and sleeping.',
      'Drink clean, boiled, or filtered water to prevent waterborne infections.'
    ],
    careTipsUr: [
      'غذا میں فائبر (سبزیاں، دالیں اور چھلکے والے اناج) وافر مقدار میں شامل کریں۔',
      'رات سونے سے کم از کم 2 گھنٹے پہلے کھانا کھا لیں۔',
      'ہمیشہ ابلا ہوا یا صاف فلٹر شدہ پانی پئیں۔'
    ]
  },
  {
    id: 'bones',
    name: 'Bones & Musculoskeletal System',
    nameUr: 'ہڈیاں، جوڑ اور پٹھے',
    tagline: 'Provides structural framework, shields organs, and enables fluid locomotion.',
    taglineUr: 'جسم کو مضبوط ڈھانچہ، اعضاء کو تحفظ اور حرکت کی صلاحیت دینے والا نظام۔',
    iconName: 'Shield',
    description: 'Comprising 206 bones, joints, cartilage, tendons, and over 600 muscles that support the body and protect vital internal organs.',
    descriptionUr: '206 ہڈیوں، جوڑوں اور پٹھوں پر مشتمل نظام جو جسم کو سہارا دیتا ہے اور حرکت ممکن بناتا ہے۔',
    primaryOrgans: ['Skeleton (206 Bones)', 'Joints (Knees, Hips, Spine, Shoulders)', 'Cartilage & Ligaments', 'Skeletal Muscles'],
    primaryOrgansUr: ['ڈھانچے کی ہڈیاں', 'جوڑ (گھٹنے، کولہے، ریڑھ کی ہڈی)', 'پٹھے اور پٹیاں'],
    commonIssues: ['Osteoarthritis (Degenerative joint wear)', 'Osteopenia & Osteoporosis (Bone thinning)', 'Lower back muscle strain', 'Vitamin D and Calcium deficiency'],
    commonIssuesUr: ['جوڑوں کا درد (گھٹنے اور مہرے)', 'ہڈیوں کا کمزور یا بھربھرا ہونا', 'کمر درد', 'وٹامن ڈی اور کیلشیم کی کمی'],
    warningSigns: [
      'Inability to bear weight on a leg after a fall or twist',
      'Joint that is hot to the touch, red, and swollen with fever (septic arthritis)',
      'Loss of bladder or bowel control accompanying severe back pain (cauda equina)',
      'Visible deformity after an injury or impact'
    ],
    warningSignsUr: [
      'گرنے کے بعد پاؤں یا ٹانگ پر وزن ڈالنے سے قاصر ہونا',
      'جوڑ کا شدید سرخ، گرم اور بخار کے ساتھ سوجنا',
      'کمر کے درد کے ساتھ پیشاب یا رفع حاجت کے کنٹرول میں خرابی'
    ],
    careTips: [
      'Get 15-20 minutes of mid-morning sun exposure for natural Vitamin D synthesis.',
      'Include calcium-rich foods like milk, yogurt, leafy greens, and sesame seeds.',
      'Incorporate weight-bearing exercises like walking or stair climbing to strengthen bone density.'
    ],
    careTipsUr: [
      'وٹامن ڈی کے حصول کے لیے صبح کی دھوپ میں کچھ وقت گزاریں۔',
      'دودھ، دہی اور کیلشیم والی غذائیں خوراک میں شامل کریں۔',
      'ہڈیوں کی مضبوطی کے لیے روزانہ چہل قدمی کریں۔'
    ]
  }
];
