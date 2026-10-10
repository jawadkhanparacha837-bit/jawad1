import React, { useState, useMemo } from 'react';
import { PhoneCall, AlertTriangle, MapPin, ShieldAlert, Building2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Language, NavTab, SupportedCity } from '../types';
import {
  PAKISTAN_CITIES,
  VERIFIED_FACILITIES,
  getEmergencyContactsForCity
} from '../data/hospitalsData';

interface EmergencyContactsProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ language, onNavigate }) => {
  const isUrdu = language === 'ur';
  const [selectedCityFilter, setSelectedCityFilter] = useState<'All' | SupportedCity>('All');

  const emergencyServices = useMemo(
    () => getEmergencyContactsForCity(selectedCityFilter),
    [selectedCityFilter]
  );

  const hospitalEmergencyDesks = useMemo(() => {
    return VERIFIED_FACILITIES.filter(fac => {
      if (fac.type !== 'hospital' || !fac.hasEmergency) return false;
      if (selectedCityFilter === 'All') return true;
      return fac.city.toLowerCase() === selectedCityFilter.toLowerCase();
    });
  }, [selectedCityFilter]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* High-visibility Warning Notice */}
      <div className="p-6 bg-red-600 dark:bg-red-700 text-white rounded-2xl shadow-sm space-y-2 text-center sm:text-left animate-fade-in-up">
        <div className="flex items-center justify-center sm:justify-start gap-2 font-extrabold text-lg">
          <ShieldAlert className="w-6 h-6 shrink-0 animate-pulse-subtle" />
          <span>
            {isUrdu ? (
              <>اہم انتباہ: یہ سروس ایمرجنسی ڈسپیچر نہیں ہے</>
            ) : (
              <>Important: MediNova <span className="font-black italic">AI</span> is NOT an emergency dispatch service</>
            )}
          </span>
        </div>
        <p className="text-sm text-red-100 font-medium leading-relaxed">
          {isUrdu
            ? 'اگر آپ یا آپ کے کسی عزیز کو سینے میں شدید درد، سانس کی شدید تنگی، بے ہوشی، یا شدید خون بہنے کی شکایت ہے تو فوراً نیچے دیے گئے سرکاری ریسکیو اور ایمبولینس نمبرز (1122 یا 115) پر کال کریں۔ عام ہسپتال کے استقبالیہ نمبر کو ایمبولینس سروس نہ سمجھیں۔'
            : 'If you or someone around you is experiencing chest pain, severe difficulty breathing, sudden paralysis, profuse bleeding, or loss of consciousness, call an official emergency ambulance service (1122 or 115) immediately. Do not confuse general hospital reception numbers with emergency ambulance dispatch.'}
        </p>
      </div>

      {/* City / Service Area Selector */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {isUrdu ? 'شہر یا علاقے کے مطابق ہنگامی خدمات منتخب کریں' : 'Filter Verified Emergency Services by City'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isUrdu
                ? 'تصدیق شدہ قومی ہیلپ لائنز، ایمبولینس سروسز اور 24/7 ہسپتال ایمرجنسی ڈیسک'
                : 'Clearly distinguishes National Emergency Helplines, Ambulance Services, and 24/7 Hospital Emergency Desks.'}
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/70 px-3 py-1 rounded-full border border-cyan-200/70 dark:border-cyan-800">
            {selectedCityFilter === 'All' ? 'All Pakistan' : `${selectedCityFilter} Area`}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedCityFilter('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCityFilter === 'All'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isUrdu ? 'تمام شہر (All)' : 'All Cities'}
          </button>
          {PAKISTAN_CITIES.map(city => (
            <button
              key={city.name}
              type="button"
              onClick={() => setSelectedCityFilter(city.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCityFilter === city.name
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isUrdu ? city.nameUr : city.name}
            </button>
          ))}
        </div>
      </div>

      {/* 1. National & Regional Emergency Ambulance / Rescue Services */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 px-1">
          {isUrdu
            ? '1. ہنگامی ایمبولینس، ریسکیو اور قومی ہیلپ لائنز'
            : '1. Emergency Ambulance, Rescue & National Helplines'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyServices.map((item, idx) => (
            <div
              key={item.id}
              className={`reveal-on-scroll is-revealed stagger-${(idx % 4) + 1} p-5 sm:p-6 rounded-2xl border ${item.borderColor} ${item.bgColor} flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border border-black/5 dark:border-white/10">
                    {isUrdu ? item.categoryLabelUr : item.categoryLabel}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Verified: {item.lastVerified}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {isUrdu ? item.nameUr : item.name}
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {isUrdu ? item.descriptionUr : item.description}
                </p>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 pt-1">
                  <p>
                    <strong>{isUrdu ? 'دائرہ کار:' : 'Coverage:'}</strong>{' '}
                    {isUrdu ? item.coverageAreaUr : item.coverageArea}
                  </p>
                  <p className="flex items-center gap-1">
                    <strong>{isUrdu ? 'ماخذ:' : 'Source:'}</strong>{' '}
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-cyan-600 inline-flex items-center gap-0.5"
                    >
                      <span>{item.sourceName}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/10">
                <span className={`text-3xl font-black italic ${item.textColor} tracking-tight`}>
                  {item.number}
                </span>
                <a
                  href={`tel:${item.number}`}
                  id={`call-btn-${item.number}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer border border-transparent dark:border-slate-700"
                >
                  <PhoneCall className="w-4 h-4 animate-heartbeat" />
                  <span>{isUrdu ? 'فوری کال کریں' : `Call ${item.number}`}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Verified 24/7 Hospital Emergency Departments */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>
                {isUrdu
                  ? '2. تصدیق شدہ 24/7 ہسپتال ایمرجنسی ڈیپارٹمنٹس'
                  : '2. Verified 24/7 Hospital Emergency Departments'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isUrdu
                ? 'ہسپتال کے ایمرجنسی ڈیسک کے نمبرز۔ ایمبولینس بلانے کے لیے اوپر دیے گئے 1122 یا 115 پر کال کریں۔'
                : 'Direct hospital ER contact numbers. Note: Call 1122 or 115 above if you need an ambulance dispatched to your location.'}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {hospitalEmergencyDesks.length} Verified ERs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {hospitalEmergencyDesks.map(hosp => (
            <div
              key={hosp.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border border-cyan-200/70 dark:border-cyan-800">
                    {hosp.city} • {hosp.locality}
                  </span>
                  <span className="text-[10px] font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
                    24/7 ER Verified ({hosp.lastVerified})
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isUrdu && hosp.nameUr ? hosp.nameUr : hosp.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {hosp.emergencyDetails || hosp.address}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                {hosp.emergencyPhone ? (
                  <a
                    href={`tel:${hosp.emergencyPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>ER: {hosp.emergencyPhone}</span>
                  </a>
                ) : (
                  <span className="text-slate-400">ER number unavailable</span>
                )}
                {hosp.lat !== undefined && hosp.lon !== undefined && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lon}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-cyan-700 dark:text-cyan-400 hover:underline"
                  >
                    <span>Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Direct Link to find nearby Emergency ERs */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up animation-delay-200 hover:shadow-md transition-all">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
            {isUrdu ? 'قریبی 24/7 ایمرجنسی ہسپتال کا نقشہ دیکھیں' : 'Locate 24/7 Hospital Emergency Departments on Map'}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            {isUrdu ? (
              <>اوپن اسٹریٹ میپ پر قریبی سرکاری و نجی ٹراما سینٹرز اور ان کا درست فاصلہ تلاش کریں۔</>
            ) : (
              <>
                Use the interactive <span className="font-bold italic text-cyan-700 dark:text-cyan-400">OpenStreetMap</span> Healthcare Finder to calculate straight-line distances to nearby emergency facilities.
              </>
            )}
          </p>
        </div>
        <button
          onClick={() => onNavigate('finder')}
          id="emergency-goto-finder-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition-all active:scale-95 shrink-0 shadow-xs cursor-pointer hover:shadow-sm"
        >
          <MapPin className="w-4 h-4" />
          <span>{isUrdu ? 'نقشہ کھولیں' : 'Open Healthcare Map'}</span>
        </button>
      </div>
    </div>
  );
};
