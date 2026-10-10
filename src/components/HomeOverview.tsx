import React, { useState } from 'react';
import { Search, MapPin, Pill, Activity, BookOpen, Brain, PhoneCall, Stethoscope, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Language, NavTab } from '../types';

interface HomeOverviewProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({ language, onNavigate }) => {
  const isUrdu = language === 'ur';
  const [universalSearch, setUniversalSearch] = useState('');

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = universalSearch.trim().toLowerCase();
    if (!q) return;

    // Smart route based on search query keywords
    if (q.includes('hospital') || q.includes('clinic') || q.includes('doctor') || q.includes('hosp') || q.includes('اسلام آباد') || q.includes('ہسپتال') || q.includes('لاہور') || q.includes('کراچی')) {
      onNavigate('finder');
    } else if (q.includes('test') || q.includes('cbc') || q.includes('ecg') || q.includes('lft') || q.includes('rft') || q.includes('blood') || q.includes('ٹیسٹ') || q.includes('ایکسرے')) {
      onNavigate('tests');
    } else if (q.includes('panadol') || q.includes('brufen') || q.includes('risek') || q.includes('paracetamol') || q.includes('medicine') || q.includes('tablet') || q.includes('دوا')) {
      onNavigate('medicines');
    } else {
      // Default to library or medicines
      onNavigate('library');
    }
  };

  const featureCards: {
    id: NavTab;
    titleEn: string;
    titleUr: string;
    descEn: string;
    descUr: string;
    icon: React.ReactNode;
    badgeEn: string;
    badgeUr: string;
    isCategoryB: boolean;
    color: string;
  }[] = [
    {
      id: 'finder',
      titleEn: 'Healthcare Finder',
      titleUr: 'ہیلتھ کیئر فائنڈر',
      descEn: 'Live OpenStreetMap of hospitals, clinics & pharmacies across Pakistan. 100% free, no OpenAI dependency.',
      descUr: 'اوپن اسٹریٹ میپ پر قریبی ہسپتال، کلینک اور فارمیسی تلاش کریں۔ اوپن اے آئی کے بغیر مکمل فعال۔',
      icon: <MapPin className="w-6 h-6 text-emerald-600" />,
      badgeEn: 'OpenStreetMap • Live',
      badgeUr: 'اوپن اسٹریٹ میپ • فعال',
      isCategoryB: true,
      color: 'hover:border-emerald-400'
    },
    {
      id: 'medicines',
      titleEn: 'Medicine Guide',
      titleUr: 'ادویات گائیڈ (پاکستان)',
      descEn: 'Uses, brand examples (Panadol, Brufen, Risek), mechanisms & side effects. Works without OpenAI.',
      descUr: 'عام ادویات، پاکستانی برانڈز اور احتیاطی تدابیر۔ اوپن اے آئی کے بغیر مکمل فعال۔',
      icon: <Pill className="w-6 h-6 text-blue-600" />,
      badgeEn: 'Search & Filters Ready',
      badgeUr: 'سرچ اور فلٹرز تیار',
      isCategoryB: true,
      color: 'hover:border-blue-400'
    },
    {
      id: 'tests',
      titleEn: 'Diagnostic Test Guide',
      titleUr: 'تشخیصی ٹیسٹ گائیڈ',
      descEn: 'CBC, ECG, HbA1c, LFT, Chest X-Rays: what they measure and doctor questions. Zero OpenAI needed.',
      descUr: 'سی بی سی، ای سی جی، شوگر، ایکسرے اور ایل ایف ٹی کے مقاصد اور معنی۔ بغیر اوپن اے آئی۔',
      icon: <Activity className="w-6 h-6 text-cyan-600" />,
      badgeEn: 'Search & Ranges Ready',
      badgeUr: 'سرچ اور رینجز تیار',
      isCategoryB: true,
      color: 'hover:border-cyan-400'
    },
    {
      id: 'library',
      titleEn: 'Health Library',
      titleUr: 'صحت عامہ لائبریری',
      descEn: 'Bilingual evidence-based articles on diabetes, hypertension, dengue, heatstroke & nutrition.',
      descUr: 'ذیابیطس، بلڈ پریشر، ڈینگی، لو اور متوازن غذا پر اردو اور انگلش مضامین۔',
      icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
      badgeEn: 'Articles & Read Times',
      badgeUr: 'مضامین اور مطالعہ',
      isCategoryB: true,
      color: 'hover:border-indigo-400'
    },
    {
      id: 'body-systems',
      titleEn: 'Body System Explorer',
      titleUr: 'انسانی جسم کا معائنہ',
      descEn: 'Interactive exploration of Brain, Heart, Lungs, Digestive system, and Bones with red flags.',
      descUr: 'دماغ، دل، پھیپھڑوں، معدہ اور ہڈیوں کی کارکردگی اور علامات کا معلوماتی جائزہ۔',
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      badgeEn: 'Interactive 5 Systems',
      badgeUr: '5 بنیادی نظام',
      isCategoryB: true,
      color: 'hover:border-purple-400'
    },
    {
      id: 'assistant',
      titleEn: 'AI Assistant',
      titleUr: 'اے آئی ہیلتھ اسسٹنٹ',
      descEn: 'Conversational health queries. Displays proper OpenAI billing/credits status card when credits are inactive.',
      descUr: 'صحت کے متعلق سوالات۔ اوپن اے آئی کریڈٹ ختم ہونے کی صورت میں واضح پیغام دکھاتا ہے۔',
      icon: <Stethoscope className="w-6 h-6 text-rose-600" />,
      badgeEn: 'OpenAI Dependent',
      badgeUr: 'اوپن اے آئی پر منحصر',
      isCategoryB: false,
      color: 'hover:border-rose-400'
    }
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      
      {/* 1. TOP BRAND IDENTITY & SLOGAN AT THE START */}
      <section className="reveal-on-scroll is-revealed pt-2 pb-1" aria-label="Brand Introduction">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 bg-gradient-to-r from-cyan-50/80 via-slate-50 to-blue-50/70 p-6 sm:p-8 rounded-3xl border border-cyan-200/80 shadow-xs transition-all duration-300 hover:shadow-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 text-white flex items-center justify-center shadow-md shadow-cyan-500/30 ring-4 ring-cyan-100/90 shrink-0 animate-float">
            <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 animate-heartbeat" />
          </div>
          
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100/90 border border-cyan-200 text-cyan-900 text-xs font-bold tracking-tight shadow-3xs">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>
                {isUrdu ? 'پاکستان کے لیے ڈیزائن شدہ صحت و رہنمائی پلیٹ فارم' : 'Bilingual Health Navigation for Pakistan'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {isUrdu ? (
                <>میڈی نووا <span className="font-black italic text-cyan-600">اے آئی</span></>
              ) : (
                <>MediNova <span className="font-black italic bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">AI</span></>
              )}
            </h1>

            <p className="text-lg sm:text-xl font-bold italic text-cyan-800 tracking-wide">
              {isUrdu ? (
                <>“<span className="font-black italic">Intelligence That Cares.</span>” — «<span className="font-black italic">ذہانت جو خیال رکھتی ہے۔</span>»</>
              ) : (
                <>“<span className="font-black italic">Intelligence That Cares.</span>”</>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 2. HERO SEARCH & GUIDANCE SECTION */}
      <section className="reveal-on-scroll relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white p-8 sm:p-12 shadow-lg border border-slate-800" aria-label="Hero Search Section">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none animate-pulse-subtle" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none animate-pulse-subtle" />

        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>
              {isUrdu ? 'پاکستان کے لیے ڈیزائن شدہ صحت و رہنمائی پلیٹ فارم' : 'Bilingual Health Navigation for Pakistan'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            {isUrdu 
              ? 'صحت اور علاج کے بارے میں رہنمائی حاصل کریں' 
              : <>Reliable Health Information, <span className="font-bold italic text-cyan-300">OpenStreetMap</span> Finder &amp; Guides</>}
          </h2>

          <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
            {isUrdu
              ? <>ہسپتال، کلینکس، ادویات اور ٹیسٹوں کی تفصیلات مفت دیکھیں — <span className="font-bold italic text-cyan-300">اوپن اے آئی</span> کریڈٹس کے بغیر 100% فعال۔</>
              : <>Search verified hospitals on <span className="font-bold italic text-cyan-300">OpenStreetMap</span>, check Pakistan brand medicines, and understand diagnostic tests — fully functional with or without <span className="font-bold italic text-cyan-300">OpenAI</span> credits.</>}
          </p>

          {/* Quick Universal Search Input */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                id="home-universal-search-input"
                value={universalSearch}
                onChange={(e) => setUniversalSearch(e.target.value)}
                placeholder={isUrdu ? 'دوا، ٹیسٹ، ہسپتال یا مضمون کا نام تلاش کریں...' : 'Search medicine (Panadol), test (ECG), hospital, or topic...'}
                className="w-full pl-12 pr-28 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 border border-white/25 focus:border-cyan-400 rounded-2xl text-sm font-semibold placeholder-slate-300 focus:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all shadow-inner"
              />
              <button
                type="submit"
                id="home-universal-search-btn"
                className="absolute right-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-white"
              >
                {isUrdu ? 'تلاش کریں' : 'Search'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. CATEGORY SEPARATION CLARIFICATION BANNER */}
      <section className="reveal-on-scroll bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all duration-300 hover:border-cyan-300 hover:shadow-md" aria-label="Architecture Status">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100/90 flex items-center justify-center text-cyan-600 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-cyan-600 animate-pulse-subtle" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {isUrdu ? (
                <>آزادانہ سروسز (<span className="font-extrabold italic text-cyan-700">Category B</span>) بغیر کسی اے پی آئی کے فعال ہیں</>
              ) : (
                <>Zero-Dependency Architecture (<span className="font-extrabold italic text-cyan-700">Category B</span>)</>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed max-w-2xl">
              {isUrdu
                ? <>ہیلتھ کیئر فائنڈر (<span className="font-bold italic">OSM</span>)، میڈیسن گائیڈ، ٹیسٹ گائیڈ اور لائبریری مکمل فعال ہیں۔</>
                : <>Healthcare Finder, Medicine Guide, Test Guide, Health Library, and Body Systems Explorer operate independently with full search.</>}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('finder')}
          id="home-open-finder-quick-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shrink-0 transition-all duration-200 shadow-2xs hover:shadow-md active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          <span>{isUrdu ? 'ہیلتھ کیئر فائنڈر کھولیں' : 'Open Healthcare Finder'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* 4. FEATURE NAVIGATION CARDS GRID */}
      <section className="reveal-on-scroll space-y-5" aria-label="Platform Features">
        <div className="flex items-center justify-between px-1 border-b border-slate-200/80 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isUrdu ? 'پلیٹ فارم کے شعبہ جات' : 'Explore Platform Features'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {isUrdu ? 'تمام شعبے تلاش کے لیے تیار ہیں' : 'Quick direct access to verified tools and guides'}
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-3xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All searches active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => onNavigate(card.id)}
              id={`home-card-${card.id}`}
              className={`reveal-on-scroll stagger-${(idx % 6) + 1} bg-white p-6 rounded-2xl border border-slate-200/90 ${card.color} hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group space-y-4`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-2xs group-hover:scale-110 group-hover:bg-cyan-50/50 transition-all duration-300">
                    {card.icon}
                  </div>
                  <span className={`text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-full border shadow-3xs ${
                    card.isCategoryB 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {isUrdu ? card.badgeUr : card.badgeEn}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-cyan-600 transition-colors">
                    {isUrdu ? card.titleUr : card.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5 leading-relaxed">
                    {isUrdu ? card.descUr : card.descEn}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-cyan-600 transition-colors">
                <span className="font-bold">{isUrdu ? 'شعبہ کھولیں' : 'Open Section'}</span>
                <span className="font-extrabold group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EMERGENCY QUICK ACTION BANNER */}
      <section className="reveal-on-scroll bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/90 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs transition-all duration-300 hover:shadow-md" aria-label="Emergency Callout">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/30 animate-pulse-subtle">
            <PhoneCall className="w-6 h-6 animate-heartbeat" />
          </div>
          <div>
            <h4 className="font-extrabold text-red-950 text-base sm:text-lg">
              {isUrdu ? (
                <>طبی ایمرجنسی میں ریسکیو <span className="font-black italic">1122</span> پر کال کریں</>
              ) : (
                <>Medical Emergency? Call Rescue <span className="font-black italic">1122</span></>
              )}
            </h4>
            <p className="text-xs sm:text-sm text-red-800 font-semibold mt-0.5">
              {isUrdu ? 'پاکستان میں ایمبولینس اور فوری ریسکیو کے لیے مفت ہیلپ لائن' : 'Toll-free emergency medical response service throughout Pakistan.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:1122"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
          >
            Call <span className="font-black italic">1122</span>
          </a>
          <button
            onClick={() => onNavigate('emergency')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
          >
            Emergency Directory
          </button>
        </div>
      </section>
    </div>
  );
};
