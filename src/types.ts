export type Language = 'en' | 'ur';

export type ThemeMode = 'light' | 'dark';

export type AppearanceMode = 'light' | 'dark' | 'system';

export type AccentColor =
  | 'default'
  | 'pink'
  | 'emerald'
  | 'blue'
  | 'purple'
  | 'teal'
  | 'orange'
  | 'custom';

export type NavTab = 
  | 'home'
  | 'assistant'
  | 'symptoms'
  | 'symptom-checker'
  | 'reports'
  | 'report-analyzer'
  | 'finder'
  | 'medicines'
  | 'tests'
  | 'library'
  | 'body-systems'
  | 'emergency';

export interface MedicineItem {
  id: string;
  genericName: string;
  genericNameUr: string;
  brandExamples: string[];
  category: string;
  categoryUr: string;
  whatItIs: string;
  whatItIsUr: string;
  commonUses: string[];
  commonUsesUr: string[];
  howItWorks: string;
  howItWorksUr: string;
  sideEffects: string[];
  sideEffectsUr: string[];
  precautions: string[];
  precautionsUr: string[];
  isPrescription: boolean;
}

export interface TestItem {
  id: string;
  name: string;
  nameUr: string;
  abbreviation?: string;
  category: string;
  categoryUr: string;
  whatTheTestIs: string;
  whatTheTestIsUr: string;
  whyPerformed: string;
  whyPerformedUr: string;
  whatItMeasures: string;
  whatItMeasuresUr: string;
  generalMeaning: string;
  generalMeaningUr: string;
  factorsAffecting: string[];
  factorsAffectingUr: string[];
  questionsToAsk: string[];
  questionsToAskUr: string[];
}

export interface LibraryArticle {
  id: string;
  slug: string;
  title: string;
  titleUr: string;
  category: string;
  categoryUr: string;
  readTime: string;
  readTimeUr: string;
  excerpt: string;
  excerptUr: string;
  content: string[];
  contentUr: string[];
  keyTakeaways: string[];
  keyTakeawaysUr: string[];
}

export interface FacilityDoctor {
  name: string;
  nameUr?: string;
  specialty: string;
  specialtyUr?: string;
  qualification?: string;
  schedule?: string;
}

export type SupportedCity =
  | 'Islamabad'
  | 'Rawalpindi'
  | 'Lahore'
  | 'Karachi'
  | 'Peshawar'
  | 'Quetta'
  | 'Multan'
  | 'Faisalabad';

export interface CityLocality {
  name: string;
  nameUr: string;
  lat: number;
  lon: number;
}

export interface CityInfo {
  name: SupportedCity;
  nameUr: string;
  province: string;
  lat: number;
  lon: number;
  localities: CityLocality[];
}

export interface HealthcareFacility {
  id: string;
  name: string;
  nameUr?: string;
  type: 'hospital' | 'clinic' | 'pharmacy';
  city: SupportedCity | string;
  locality: string;
  localityUr?: string;
  address: string;
  addressUr?: string;
  lat?: number;
  lon?: number;
  phone?: string;
  emergencyPhone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  ratingSource?: string;
  specialties: string[];
  specialtiesUr?: string[];
  openHours: string;
  openHoursUr?: string;
  opdTimings?: string;
  opdTimingsUr?: string;
  is24Hours?: boolean;
  hasEmergency: boolean;
  emergencyDetails?: string;
  emergencyDetailsUr?: string;
  doctors?: FacilityDoctor[];
  dataSource: string;
  lastVerified: string;
  distanceKm?: number;
  distanceSourceLabel?: string;
}

export interface EmergencyContactItem {
  id: string;
  name: string;
  nameUr: string;
  category: 'national' | 'ambulance' | 'hospital-er' | 'support';
  categoryLabel: string;
  categoryLabelUr: string;
  number: string;
  coverageArea: string;
  coverageAreaUr: string;
  cities: ('All' | SupportedCity)[];
  description: string;
  descriptionUr: string;
  sourceUrl: string;
  sourceName: string;
  lastVerified: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export interface BodySystemItem {
  id: string;
  name: string;
  nameUr: string;
  tagline: string;
  taglineUr: string;
  iconName: string;
  description: string;
  descriptionUr: string;
  primaryOrgans: string[];
  primaryOrgansUr: string[];
  commonIssues: string[];
  commonIssuesUr: string[];
  warningSigns: string[];
  warningSignsUr: string[];
  careTips: string[];
  careTipsUr: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  textUr?: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  isBillingError?: boolean;
  latencyMs?: number;
  isInterrupted?: boolean;
}
