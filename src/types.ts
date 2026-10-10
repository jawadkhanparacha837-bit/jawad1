export type Language = 'en' | 'ur';

export type NavTab = 
  | 'home'
  | 'assistant'
  | 'symptom-checker'
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

export interface HealthcareFacility {
  id: string;
  name: string;
  nameUr?: string;
  type: 'hospital' | 'clinic' | 'emergency' | 'pharmacy';
  address: string;
  addressUr?: string;
  city: string;
  lat: number;
  lon: number;
  phone?: string;
  hasEmergency: boolean;
  openHours?: string;
  distanceKm?: number;
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
