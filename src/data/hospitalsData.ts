import { HealthcareFacility } from '../types';

export const VERIFIED_FACILITIES: HealthcareFacility[] = [
  {
    id: 'isb-dental-intl',
    name: 'Islamabad International Dental Hospital and College',
    nameUr: 'اسلام آباد انٹرنیشنل ڈینٹل ہسپتال اینڈ کالج',
    type: 'hospital',
    address: 'Service Road East G-7, اسلام آباد',
    addressUr: 'سروس روڈ ایسٹ G-7، اسلام آباد',
    city: 'Islamabad',
    lat: 33.7058,
    lon: 73.0652,
    phone: '+92 51 2891781',
    hasEmergency: true,
    openHours: '24/7 Emergency & Outpatient'
  },
  {
    id: 'pims-islamabad',
    name: 'Pakistan Institute of Medical Sciences (PIMS)',
    nameUr: 'پاکستان انسٹیٹیوٹ آف میڈیکل سائنسز (پمز)',
    type: 'emergency',
    address: 'G-8/3, Islamabad',
    addressUr: 'جی ایٹ تھری، اسلام آباد',
    city: 'Islamabad',
    lat: 33.7032,
    lon: 73.0531,
    phone: '+92 51 9261170',
    hasEmergency: true,
    openHours: '24/7 Full Emergency & Trauma Center'
  },
  {
    id: 'shifa-intl-isb',
    name: 'Shifa International Hospital',
    nameUr: 'شفا انٹرنیشنل ہسپتال',
    type: 'hospital',
    address: 'Pitras Bukhari Road, H-8/4, Islamabad',
    addressUr: 'پطرس بخاری روڈ، H-8/4، اسلام آباد',
    city: 'Islamabad',
    lat: 33.6811,
    lon: 73.0645,
    phone: '+92 51 8463000',
    hasEmergency: true,
    openHours: '24/7 Tertiary Care Emergency'
  },
  {
    id: 'poly-clinic-isb',
    name: 'Federal Government Polyclinic Hospital',
    nameUr: 'فیڈرل گورنمنٹ پولی کلینک ہسپتال',
    type: 'hospital',
    address: 'Luqman Hakeem Road, G-6/2, Islamabad',
    addressUr: 'لقمان حکیم روڈ، G-6/2، اسلام آباد',
    city: 'Islamabad',
    lat: 33.7225,
    lon: 73.0815,
    phone: '+92 51 9218300',
    hasEmergency: true,
    openHours: '24/7 Emergency'
  },
  {
    id: 'ali-medical-isb',
    name: 'Ali Medical Centre',
    nameUr: 'علی میڈیکل سینٹر',
    type: 'clinic',
    address: 'Kohistan Road, F-8 Markaz, Islamabad',
    addressUr: 'کوہستان روڈ، ایف ایٹ مرکز، اسلام آباد',
    city: 'Islamabad',
    lat: 33.7142,
    lon: 73.0366,
    phone: '+92 51 8090200',
    hasEmergency: false,
    openHours: '08:00 AM - 11:00 PM'
  },
  {
    id: 'maroof-isb',
    name: 'Maroof International Hospital',
    nameUr: 'معروف انٹرنیشنل ہسپتال',
    type: 'hospital',
    address: '10th Avenue, F-10 Markaz, Islamabad',
    addressUr: 'ٹینتھ ایونیو، ایف ٹین مرکز، اسلام آباد',
    city: 'Islamabad',
    lat: 33.6934,
    lon: 73.0118,
    phone: '+92 51 2222920',
    hasEmergency: true,
    openHours: '24/7 Emergency'
  },
  {
    id: 'd-watson-f6',
    name: 'D. Watson Pharmacy & Emergency Chemist',
    nameUr: 'ڈی واٹسن فارمیسی',
    type: 'pharmacy',
    address: 'Super Market, F-6 Markaz, Islamabad',
    addressUr: 'سپر مارکیٹ، ایف سکس مرکز، اسلام آباد',
    city: 'Islamabad',
    lat: 33.7314,
    lon: 73.0694,
    phone: '+92 51 2601700',
    hasEmergency: false,
    openHours: '24 Hours Open'
  },
  {
    id: 'holy-family-rwp',
    name: 'Holy Family Hospital',
    nameUr: 'ہولی فیملی ہسپتال',
    type: 'emergency',
    address: 'Satellite Town, Rawalpindi',
    addressUr: 'سیٹلائٹ ٹاؤن، راولپنڈی',
    city: 'Rawalpindi',
    lat: 33.6338,
    lon: 73.0712,
    phone: '+92 51 9290321',
    hasEmergency: true,
    openHours: '24/7 Public Emergency & Trauma'
  },
  {
    id: 'cmh-rawalpindi',
    name: 'Combined Military Hospital (CMH) Rawalpindi',
    nameUr: 'کمبائنڈ ملٹری ہسپتال (سی ایم ایچ) راولپنڈی',
    type: 'hospital',
    address: 'Mall Road, Rawalpindi Cantt',
    addressUr: 'مال روڈ، راولپنڈی کینٹ',
    city: 'Rawalpindi',
    lat: 33.5939,
    lon: 73.0532,
    phone: '+92 51 5565150',
    hasEmergency: true,
    openHours: '24/7 Emergency'
  },
  {
    id: 'mayo-hospital-lhr',
    name: 'Mayo Hospital',
    nameUr: 'میو ہسپتال',
    type: 'emergency',
    address: 'Hospital Road, Anarkali, Lahore',
    addressUr: 'ہسپتال روڈ، انارکلی، لاہور',
    city: 'Lahore',
    lat: 31.5721,
    lon: 74.3168,
    phone: '+92 42 99211100',
    hasEmergency: true,
    openHours: '24/7 Emergency Trauma Center'
  },
  {
    id: 'shaukat-khanum-lhr',
    name: 'Shaukat Khanum Memorial Cancer Hospital',
    nameUr: 'شوکت خانم کینسر ہسپتال',
    type: 'hospital',
    address: '7A Block R-3, Johar Town, Lahore',
    addressUr: 'جوہر ٹاؤن، لاہور',
    city: 'Lahore',
    lat: 31.4645,
    lon: 74.2691,
    phone: '+92 42 35905000',
    hasEmergency: true,
    openHours: '24/7 Emergency'
  },
  {
    id: 'services-hospital-lhr',
    name: 'Services Hospital Lahore',
    nameUr: 'سروسز ہسپتال لاہور',
    type: 'hospital',
    address: 'Jail Road, Shadman, Lahore',
    addressUr: 'جیل روڈ، شادمان، لاہور',
    city: 'Lahore',
    lat: 31.5398,
    lon: 74.3359,
    phone: '+92 42 99203402',
    hasEmergency: true,
    openHours: '24/7 Emergency'
  },
  {
    id: 'aga-khan-khi',
    name: 'Aga Khan University Hospital (AKUH)',
    nameUr: 'آغا خان یونیورسٹی ہسپتال',
    type: 'hospital',
    address: 'National Stadium Road, Karachi',
    addressUr: 'نیشنل اسٹیڈیم روڈ، کراچی',
    city: 'Karachi',
    lat: 24.8924,
    lon: 67.0747,
    phone: '+92 21 111911911',
    hasEmergency: true,
    openHours: '24/7 Dedicated Emergency Services'
  },
  {
    id: 'jpmc-karachi',
    name: 'Jinnah Postgraduate Medical Centre (JPMC)',
    nameUr: 'جناح ہسپتال (جے پی ایم سی) کراچی',
    type: 'emergency',
    address: 'Rafiqui Shaheed Road, Karachi Cantt',
    addressUr: 'رفیقی شہید روڈ، کراچی کینٹ',
    city: 'Karachi',
    lat: 24.8517,
    lon: 67.0457,
    phone: '+92 21 99201300',
    hasEmergency: true,
    openHours: '24/7 Public Trauma Center'
  },
  {
    id: 'indus-hospital-khi',
    name: 'The Indus Hospital',
    nameUr: 'انڈس ہسپتال',
    type: 'hospital',
    address: 'Korangi Crossing, Karachi',
    addressUr: 'کورنگی کراسنگ، کراچی',
    city: 'Karachi',
    lat: 24.8291,
    lon: 67.1215,
    phone: '+92 21 111111880',
    hasEmergency: true,
    openHours: '24/7 Free Emergency Healthcare'
  },
  {
    id: 'lrh-peshawar',
    name: 'Lady Reading Hospital (LRH)',
    nameUr: 'لیڈی ریڈنگ ہسپتال (ایل آر ایچ)',
    type: 'emergency',
    address: 'PTCL Colony, Peshawar',
    addressUr: 'پی ٹی سی ایل کالونی، پشاور',
    city: 'Peshawar',
    lat: 34.0084,
    lon: 71.5786,
    phone: '+92 91 9211430',
    hasEmergency: true,
    openHours: '24/7 Emergency & Burn Center'
  },
  {
    id: 'sandeman-quetta',
    name: 'Civil Hospital / Sandeman Provincial Hospital',
    nameUr: 'سول ہسپتال کوئٹہ',
    type: 'emergency',
    address: 'Jinnah Road, Quetta',
    addressUr: 'جناح روڈ، کوئٹہ',
    city: 'Quetta',
    lat: 30.1873,
    lon: 67.0099,
    phone: '+92 81 9202021',
    hasEmergency: true,
    openHours: '24/7 Emergency'
  }
];

export const PAKISTAN_CITIES = [
  { name: 'Islamabad', lat: 33.6844, lon: 73.0479 },
  { name: 'Rawalpindi', lat: 33.5651, lon: 73.0169 },
  { name: 'Lahore', lat: 31.5204, lon: 74.3587 },
  { name: 'Karachi', lat: 24.8607, lon: 67.0011 },
  { name: 'Peshawar', lat: 34.0151, lon: 71.5249 },
  { name: 'Quetta', lat: 30.1798, lon: 66.9750 },
  { name: 'Multan', lat: 30.1575, lon: 71.5249 },
  { name: 'Faisalabad', lat: 31.4504, lon: 73.1350 }
];

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
