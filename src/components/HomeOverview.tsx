import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Pill,
  Activity,
  BookOpen,
  Brain,
  PhoneCall,
  Stethoscope,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Plus
} from 'lucide-react';
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
    if (
      q.includes('hospital') ||
      q.includes('clinic') ||
      q.includes('doctor') ||
      q.includes('hosp') ||
      q.includes('اسلام آباد') ||
      q.includes('ہسپتال') ||
      q.includes('لاہور') ||
      q.includes('کراچی')
    ) {
      onNavigate('finder');
    } else if (
      q.includes('test') ||
      q.includes('cbc') ||
      q.includes('ecg') ||
      q.includes('lft') ||
      q.includes('rft') ||
      q.includes('blood') ||
      q.includes('ٹیسٹ') ||
      q.includes('ایکسرے')
    ) {
      onNavigate('tests');
    } else if (
      q.includes('panadol') ||
      q.includes('brufen') ||
      q.includes('risek') ||
      q.includes('paracetamol') ||
      q.includes('medicine') ||
      q.includes('tablet') ||
      q.includes('دوا')
    ) {
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
      icon: <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      badgeEn: 'OpenStreetMap • Live',
      badgeUr: 'اوپن اسٹریٹ میپ • فعال',
      isCategoryB: true,
      color: 'hover:border-emerald-400 dark:hover:border-emerald-500'
    },
    {
      id: 'medicines',
      titleEn: 'Medicine Guide',
      titleUr: 'ادویات گائیڈ (پاکستان)',
      descEn: 'Uses, brand examples (Panadol, Brufen, Risek), mechanisms & side effects. Works without OpenAI.',
      descUr: 'عام ادویات، پاکستانی برانڈز اور احتیاطی تدابیر۔ اوپن اے آئی کے بغیر مکمل فعال۔',
      icon: <Pill className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      badgeEn: 'Search & Filters Ready',
      badgeUr: 'سرچ اور فلٹرز تیار',
      isCategoryB: true,
      color: 'hover:border-blue-400 dark:hover:border-blue-500'
    },
    {
      id: 'tests',
      titleEn: 'Diagnostic Test Guide',
      titleUr: 'تشخیصی ٹیسٹ گائیڈ',
      descEn: 'CBC, ECG, HbA1c, LFT, Chest X-Rays: what they measure and doctor questions. Zero OpenAI needed.',
      descUr: 'سی بی سی، ای سی جی، شوگر، ایکسرے اور ایل ایف ٹی کے مقاصد اور معنی۔ بغیر اوپن اے آئی۔',
      icon: <Activity className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
      badgeEn: 'Search & Ranges Ready',
      badgeUr: 'سرچ اور رینجز تیار',
      isCategoryB: true,
      color: 'hover:border-cyan-400 dark:hover:border-cyan-500'
    },
    {
      id: 'library',
      titleEn: 'Health Library',
      titleUr: 'صحت عامہ لائبریری',
      descEn: 'Bilingual evidence-based articles on diabetes, hypertension, dengue, heatstroke & nutrition.',
      descUr: 'ذیابیطس، بلڈ پریشر، ڈینگی، لو اور متوازن غذا پر اردو اور انگلش مضامین۔',
      icon: <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      badgeEn: 'Articles & Read Times',
      badgeUr: 'مضامین اور مطالعہ',
      isCategoryB: true,
      color: 'hover:border-indigo-400 dark:hover:border-indigo-500'
    },
    {
      id: 'body-systems',
      titleEn: 'Body System Explorer',
      titleUr: 'انسانی جسم کا معائنہ',
      descEn: 'Interactive exploration of Brain, Heart, Lungs, Digestive system, and Bones with red flags.',
      descUr: 'دماغ، دل، پھیپھڑوں، معدہ اور ہڈیوں کی کارکردگی اور علامات کا معلوماتی جائزہ۔',
      icon: <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      badgeEn: 'Interactive 5 Systems',
      badgeUr: '5 بنیادی نظام',
      isCategoryB: true,
      color: 'hover:border-purple-400 dark:hover:border-purple-500'
    },
    {
      id: 'assistant',
      titleEn: 'AI Assistant',
      titleUr: 'اے آئی ہیلتھ اسسٹنٹ',
      descEn: 'Conversational health queries. Displays proper OpenAI billing/credits status card when credits are inactive.',
      descUr: 'صحت کے متعلق سوالات۔ اوپن اے آئی کریڈٹ ختم ہونے کی صورت میں واضح پیغام دکھاتا ہے۔',
      icon: <Stethoscope className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      badgeEn: 'OpenAI Dependent',
      badgeUr: 'اوپن اے آئی پر منحصر',
      isCategoryB: false,
      color: 'hover:border-rose-400 dark:hover:border-rose-500'
    }
  ];

  return (
    <div className="relative isolate space-y-10 sm:space-y-12 overflow-hidden animate-fade-in">
      {/* =====================================================================
          AMBIENT HEALTHCARE & AI NETWORK BACKGROUND LAYER
          Adapts automatically to Light/Dark Mode & User's Selected Accent Color
          ===================================================================== */}
      <div
        className="pointer-events-none select-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Soft Ambient Accent Radial Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/8 dark:bg-cyan-400/10 blur-3xl" />
        <div className="absolute top-1/3 -right-28 w-[28rem] h-[28rem] rounded-full bg-cyan-600/6 dark:bg-cyan-500/8 blur-3xl" />

        {/* Subtle AI & Healthcare Connected Nodes SVG Network (Desktop/Tablet) */}
        <svg
          className="hidden sm:block absolute top-4 left-0 w-full h-[540px] text-cyan-600/12 dark:text-cyan-400/14"
          viewBox="0 0 1200 540"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Connected Neural / Clinical Telemetry Lines */}
          <g stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 6">
            <line x1="80" y1="70" x2="230" y2="140" />
            <line x1="230" y1="140" x2="170" y2="270" />
            <line x1="230" y1="140" x2="410" y2="95" />
            <line x1="980" y1="60" x2="1110" y2="155" />
            <line x1="1110" y1="155" x2="1030" y2="285" />
            <line x1="860" y1="120" x2="980" y2="60" />
            <line x1="860" y1="120" x2="1030" y2="285" />
          </g>

          {/* Pulsing AI Healthcare Network Nodes */}
          <circle cx="80" cy="70" r="4.5" fill="currentColor" className="animate-node-pulse" />
          <circle cx="230" cy="140" r="6" fill="currentColor" className="animate-node-pulse animation-delay-200" />
          <circle cx="170" cy="270" r="4" fill="currentColor" className="animate-node-pulse animation-delay-400" />
          <circle cx="410" cy="95" r="5" fill="currentColor" className="animate-node-pulse animation-delay-100" />
          <circle cx="860" cy="120" r="5" fill="currentColor" className="animate-node-pulse animation-delay-300" />
          <circle cx="980" cy="60" r="6" fill="currentColor" className="animate-node-pulse" />
          <circle cx="1110" cy="155" r="4.5" fill="currentColor" className="animate-node-pulse animation-delay-200" />
          <circle cx="1030" cy="285" r="5.5" fill="currentColor" className="animate-node-pulse animation-delay-400" />

          {/* Subtle Background Heartbeat ECG Waveform Line */}
          <path
            d="M 0 430 L 340 430 L 365 412 L 385 448 L 410 370 L 435 480 L 458 402 L 480 430 L 840 430 L 865 415 L 885 445 L 910 378 L 935 475 L 958 408 L 980 430 L 1200 430"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-ecg-trace"
          />
        </svg>

        {/* Floating Subtle Medical Crosses & Healthcare Icons in Periphery */}
        <div className="hidden md:flex absolute top-24 right-8 w-9 h-9 rounded-xl border border-cyan-500/15 dark:border-cyan-400/15 bg-cyan-500/5 items-center justify-center text-cyan-600/25 dark:text-cyan-400/25 animate-float-slow">
          <Plus className="w-5 h-5" />
        </div>
        <div className="hidden lg:flex absolute top-[34rem] left-4 w-8 h-8 rounded-lg border border-cyan-500/15 dark:border-cyan-400/15 bg-cyan-500/5 items-center justify-center text-cyan-600/20 dark:text-cyan-400/20 animate-float-reverse">
          <Plus className="w-4 h-4" />
        </div>
        <div className="hidden lg:flex absolute top-[38rem] right-6 w-10 h-10 rounded-full border border-cyan-500/15 dark:border-cyan-400/15 bg-cyan-500/5 items-center justify-center text-cyan-600/20 dark:text-cyan-400/20 animate-float-diagonal">
          <HeartPulse className="w-5 h-5" />
        </div>
      </div>

      {/* =====================================================================
          1. TOP BRAND IDENTITY & SLOGAN AT THE START
          Features soft entrance animation for MediNova AI heading,
          elegant reveal animation for "Intelligence That Cares.",
          and subtle animated medical cross & ECG telemetry backdrop.
          ===================================================================== */}
      <section className="reveal-on-scroll is-revealed pt-2 pb-1" aria-label="Brand Introduction">
        <div className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-center sm:text-left gap-6 bg-gradient-to-r from-cyan-50/85 via-white to-cyan-100/50 dark:from-slate-900 dark:via-slate-900/95 dark:to-cyan-950/60 p-6 sm:p-8 rounded-3xl border border-cyan-200/80 dark:border-cyan-800/60 shadow-xs transition-all duration-300 hover:shadow-md">
          {/* Decorative Background Medical Crosses & Neural Rings inside Brand Banner */}
          <svg
            className="pointer-events-none select-none absolute right-0 top-0 h-full w-80 text-cyan-600/10 dark:text-cyan-400/12"
            viewBox="0 0 320 200"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="240" cy="100" r="78" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
            <circle cx="240" cy="100" r="112" stroke="currentColor" strokeWidth="1" />
            {/* Medical Cross Symbol */}
            <g className="animate-float-slow" fill="currentColor">
              <rect x="62" y="24" width="6" height="22" rx="2" />
              <rect x="54" y="32" width="22" height="6" rx="2" />
            </g>
            <g className="animate-float-reverse" fill="currentColor">
              <rect x="278" y="142" width="6" height="20" rx="2" />
              <rect x="271" y="149" width="20" height="6" rx="2" />
            </g>
          </svg>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10 flex-1">
            {/* Animated Brand Emblem with Stethoscope */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 text-white flex items-center justify-center shadow-md shadow-cyan-500/30 ring-4 ring-cyan-100/90 dark:ring-cyan-900/60 shrink-0 animate-float">
              <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 animate-heartbeat" />
            </div>

            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100/90 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200 text-xs font-bold tracking-tight shadow-3xs">
                <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>
                  {isUrdu ? 'پاکستان کے لیے ڈیزائن شدہ صحت و رہنمائی پلیٹ فارم' : 'Bilingual Health Navigation for Pakistan'}
                </span>
              </div>

              {/* Soft Entrance Animation for MediNova AI Heading */}
              <h1 className="animate-heading-entrance text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {isUrdu ? (
                  <>
                    میڈی نووا <span className="font-black italic text-cyan-600 dark:text-cyan-400">اے آئی</span>
                  </>
                ) : (
                  <>
                    MediNova{' '}
                    <span className="font-black italic bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 dark:from-cyan-300 dark:via-cyan-400 dark:to-cyan-500 bg-clip-text text-transparent">
                      AI
                    </span>
                  </>
                )}
              </h1>

              {/* Elegant Reveal Animation for the Slogan */}
              <p className="animate-slogan-reveal text-lg sm:text-xl font-bold italic text-cyan-800 dark:text-cyan-300 tracking-wide">
                {isUrdu ? (
                  <>
                    “<span className="font-black italic">Intelligence That Cares.</span>” — «
                    <span className="font-black italic">ذہانت جو خیال رکھتی ہے۔</span>»
                  </>
                ) : (
                  <>
                    “<span className="font-black italic">Intelligence That Cares.</span>”
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Subtle Right-Side Animated Clinical Telemetry & ECG Badge (Tablet/Desktop) */}
          <div
            className="hidden md:flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/75 backdrop-blur-xs border border-cyan-200/70 dark:border-cyan-800/60 shadow-2xs relative z-10 shrink-0 animate-float-slow"
            aria-hidden="true"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200/80 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <HeartPulse className="w-5 h-5 animate-heartbeat" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  {isUrdu ? 'اے آئی طبی معاونت' : 'Clinical AI & OSM Telemetry'}
                </span>
              </div>
              {/* Mini Animated ECG Waveform */}
              <svg className="w-36 h-6 text-cyan-600 dark:text-cyan-400" viewBox="0 0 160 28" fill="none">
                <path
                  d="M 2 14 L 38 14 L 46 8 L 54 20 L 64 3 L 74 25 L 82 11 L 90 14 L 158 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-ecg-trace"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. HERO SEARCH & GUIDANCE SECTION
          Includes subtle AI network patterns, ECG heartbeat wave, and a clean,
          modern vector illustration of a Doctor with Stethoscope & AI Care HUD.
          ===================================================================== */}
      <section
        className="reveal-on-scroll relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white p-6 sm:p-10 lg:p-12 shadow-lg border border-slate-800 dark:border-slate-700/80"
        aria-label="Hero Search Section"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none animate-pulse-subtle" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none animate-pulse-subtle" />

        {/* Subtle Background AI Network & Heartbeat Waveform inside Hero */}
        <svg
          className="pointer-events-none select-none absolute inset-0 w-full h-full text-cyan-400/10"
          viewBox="0 0 1200 420"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 0 370 L 260 370 L 285 352 L 305 388 L 330 315 L 355 405 L 378 348 L 400 370 L 760 370 L 785 352 L 805 388 L 830 320 L 855 402 L 878 350 L 900 370 L 1200 370"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-ecg-trace"
          />
        </svg>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Copy & Universal Search Input */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>
                {isUrdu
                  ? 'پاکستان کے لیے ڈیزائن شدہ صحت و رہنمائی پلیٹ فارم'
                  : 'Bilingual Health Navigation for Pakistan'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              {isUrdu ? (
                'صحت اور علاج کے بارے میں رہنمائی حاصل کریں'
              ) : (
                <>
                  Reliable Health Information,{' '}
                  <span className="font-bold italic text-cyan-300">OpenStreetMap</span> Finder &amp; Guides
                </>
              )}
            </h2>

            <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
              {isUrdu ? (
                <>
                  ہسپتال، کلینکس، ادویات اور ٹیسٹوں کی تفصیلات مفت دیکھیں —{' '}
                  <span className="font-bold italic text-cyan-300">اوپن اے آئی</span> کریڈٹس کے بغیر 100% فعال۔
                </>
              ) : (
                <>
                  Search verified hospitals on <span className="font-bold italic text-cyan-300">OpenStreetMap</span>, check
                  Pakistan brand medicines, and understand diagnostic tests — fully functional with or without{' '}
                  <span className="font-bold italic text-cyan-300">OpenAI</span> credits.
                </>
              )}
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
                  placeholder={
                    isUrdu
                      ? 'دوا، ٹیسٹ، ہسپتال یا مضمون کا نام تلاش کریں...'
                      : 'Search medicine (Panadol), test (ECG), hospital, or topic...'
                  }
                  className="w-full pl-12 pr-28 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white dark:focus:bg-slate-900 text-white focus:text-slate-900 dark:focus:text-white border border-white/25 focus:border-cyan-400 rounded-2xl text-sm font-semibold placeholder-slate-300 focus:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all shadow-inner"
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

          {/* Right Column: Clean Vector Illustration of Doctor with Stethoscope & AI Healthcare Nodes */}
          <div
            className="hidden lg:flex lg:col-span-5 items-center justify-center relative pointer-events-none select-none"
            aria-hidden="true"
          >
            <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
              {/* Outer AI Neural Network Ring */}
              <div className="absolute inset-2 rounded-full border border-cyan-400/20 bg-cyan-500/5 backdrop-blur-[2px] animate-pulse-subtle" />
              <div className="absolute inset-8 rounded-full border border-dashed border-cyan-300/25" />

              {/* Floating Medical Cross Badge (Top Left) */}
              <div className="absolute top-4 left-4 px-3 py-2 rounded-2xl bg-slate-900/80 border border-cyan-400/35 shadow-lg flex items-center gap-2 animate-float-slow">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="text-[10px] leading-tight">
                  <span className="font-extrabold text-white block">Verified Care</span>
                  <span className="text-cyan-300">8 Major Cities</span>
                </div>
              </div>

              {/* Floating AI Diagnostic Pulse Badge (Bottom Right) */}
              <div className="absolute bottom-4 right-2 px-3.5 py-2 rounded-2xl bg-slate-900/85 border border-cyan-400/35 shadow-lg flex items-center gap-2.5 animate-float-reverse">
                <HeartPulse className="w-5 h-5 text-cyan-400 animate-heartbeat" />
                <div className="text-[10px] leading-tight">
                  <span className="font-extrabold text-white block">AI Triage &amp; Guides</span>
                  <span className="text-emerald-300">24/7 Ready</span>
                </div>
              </div>

              {/* Central Vector Illustration: Medical Professional / Doctor with Stethoscope & AI Nodes */}
              <svg
                className="w-64 h-64 text-cyan-400 animate-float"
                viewBox="0 0 260 260"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* AI Network Connection Lines Around Doctor */}
                <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="3 4">
                  <line x1="40" y1="75" x2="88" y2="95" />
                  <line x1="220" y1="75" x2="172" y2="95" />
                  <line x1="46" y1="185" x2="78" y2="160" />
                  <line x1="214" y1="185" x2="182" y2="160" />
                </g>
                <circle cx="40" cy="75" r="4" fill="currentColor" className="animate-node-pulse" />
                <circle cx="220" cy="75" r="4.5" fill="currentColor" className="animate-node-pulse animation-delay-200" />
                <circle cx="46" cy="185" r="3.5" fill="currentColor" className="animate-node-pulse animation-delay-400" />
                <circle cx="214" cy="185" r="4" fill="currentColor" className="animate-node-pulse animation-delay-100" />

                {/* Soft Halo Behind Doctor */}
                <circle cx="130" cy="128" r="76" fill="currentColor" fillOpacity="0.1" />
                <circle cx="130" cy="128" r="76" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />

                {/* Doctor Shoulders & Lab Coat Silhouette */}
                <path
                  d="M68 214C68 179 94 156 130 156C166 156 192 179 192 214"
                  fill="#0f172a"
                  fillOpacity="0.85"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Medical Coat Lapels & Scrub V-Neck */}
                <path
                  d="M108 158L130 192L152 158"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M130 192V214" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

                {/* Doctor Head & Professional Silhouette */}
                <circle
                  cx="130"
                  cy="104"
                  r="30"
                  fill="#0f172a"
                  fillOpacity="0.9"
                  stroke="currentColor"
                  strokeWidth="2.2"
                />

                {/* Draped Medical Stethoscope Around Doctor's Neck */}
                <path
                  d="M102 158C100 182 108 198 122 200"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M158 158C160 180 152 194 142 196"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Stethoscope Chestpiece (Diaphragm) */}
                <circle cx="144" cy="198" r="7" fill="currentColor" stroke="#ffffff" strokeWidth="2.2" />
                <circle cx="144" cy="198" r="2.5" fill="#ffffff" />
                {/* Stethoscope Binaural Tubing */}
                <path
                  d="M98 164C92 174 92 188 102 196"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="103" cy="197" r="3.5" fill="#ffffff" />

                {/* Medical Cross Pin on Doctor's Coat */}
                <g transform="translate(94, 174)">
                  <rect x="4" y="0" width="4" height="12" rx="1" fill="currentColor" />
                  <rect x="0" y="4" width="12" height="4" rx="1" fill="currentColor" />
                </g>

                {/* Live ECG Heartbeat Overlay Bar Across Bottom of Illustration */}
                <rect
                  x="64"
                  y="214"
                  width="132"
                  height="24"
                  rx="12"
                  fill="#0f172a"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                />
                <path
                  d="M 76 226 L 106 226 L 112 220 L 118 232 L 125 216 L 132 235 L 138 223 L 144 226 L 184 226"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-ecg-trace"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. CATEGORY SEPARATION CLARIFICATION BANNER
          ===================================================================== */}
      <section
        className="reveal-on-scroll bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all duration-300 hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-md"
        aria-label="Architecture Status"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-100/90 dark:border-cyan-800/70 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-pulse-subtle" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isUrdu ? (
                <>
                  آزادانہ سروسز (<span className="font-extrabold italic text-cyan-700 dark:text-cyan-400">Category B</span>) بغیر کسی اے پی آئی کے فعال ہیں
                </>
              ) : (
                <>
                  Zero-Dependency Architecture (<span className="font-extrabold italic text-cyan-700 dark:text-cyan-400">Category B</span>)
                </>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed max-w-2xl">
              {isUrdu ? (
                <>
                  ہیلتھ کیئر فائنڈر (<span className="font-bold italic">OSM</span>)، میڈیسن گائیڈ، ٹیسٹ گائیڈ اور لائبریری مکمل فعال ہیں۔
                </>
              ) : (
                <>
                  Healthcare Finder, Medicine Guide, Test Guide, Health Library, and Body Systems Explorer operate independently with full search.
                </>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('finder')}
          id="home-open-finder-quick-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-cyan-600 hover:bg-black dark:hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shrink-0 transition-all duration-200 shadow-2xs hover:shadow-md active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          <span>{isUrdu ? 'ہیلتھ کیئر فائنڈر کھولیں' : 'Open Healthcare Finder'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* =====================================================================
          4. FEATURE NAVIGATION CARDS GRID
          ===================================================================== */}
      <section className="reveal-on-scroll space-y-5" aria-label="Platform Features">
        <div className="flex items-center justify-between px-1 border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isUrdu ? 'پلیٹ فارم کے شعبہ جات' : 'Explore Platform Features'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              {isUrdu ? 'تمام شعبے تلاش کے لیے تیار ہیں' : 'Quick direct access to verified tools and guides'}
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-3xs flex items-center gap-1.5">
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
              className={`reveal-on-scroll stagger-${(idx % 6) + 1} bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 ${card.color} hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group space-y-4`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-2xs group-hover:scale-110 group-hover:bg-cyan-50/50 dark:group-hover:bg-cyan-950/50 transition-all duration-300">
                    {card.icon}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-full border shadow-3xs ${
                      card.isCategoryB
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
                        : 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/80'
                    }`}
                  >
                    {isUrdu ? card.badgeUr : card.badgeEn}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {isUrdu ? card.titleUr : card.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1.5 leading-relaxed">
                    {isUrdu ? card.descUr : card.descEn}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                <span className="font-bold">{isUrdu ? 'شعبہ کھولیں' : 'Open Section'}</span>
                <span className="font-extrabold group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          5. EMERGENCY QUICK ACTION BANNER
          ===================================================================== */}
      <section
        className="reveal-on-scroll bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/40 border border-red-200/90 dark:border-red-900/70 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs transition-all duration-300 hover:shadow-md"
        aria-label="Emergency Callout"
      >
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/30 animate-pulse-subtle">
            <PhoneCall className="w-6 h-6 animate-heartbeat" />
          </div>
          <div>
            <h4 className="font-extrabold text-red-950 dark:text-red-200 text-base sm:text-lg">
              {isUrdu ? (
                <>
                  طبی ایمرجنسی میں ریسکیو <span className="font-black italic">1122</span> پر کال کریں
                </>
              ) : (
                <>
                  Medical Emergency? Call Rescue <span className="font-black italic">1122</span>
                </>
              )}
            </h4>
            <p className="text-xs sm:text-sm text-red-800 dark:text-red-300 font-semibold mt-0.5">
              {isUrdu
                ? 'پاکستان میں ایمبولینس اور فوری ریسکیو کے لیے مفت ہیلپ لائن'
                : 'Toll-free emergency medical response service throughout Pakistan.'}
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
            className="px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/80 text-xs font-bold rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
          >
            Emergency Directory
          </button>
        </div>
      </section>
    </div>
  );
};
