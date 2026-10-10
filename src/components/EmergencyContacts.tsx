import React from 'react';
import { PhoneCall, AlertTriangle, MapPin, ShieldAlert, HeartPulse, Building } from 'lucide-react';
import { Language, NavTab } from '../types';

interface EmergencyContactsProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ language, onNavigate }) => {
  const isUrdu = language === 'ur';

  const numbers = [
    {
      name: 'Rescue 1122 (Punjab, KPK, Gilgit, AJK)',
      nameUr: 'ریسکیو 1122 (پنجاب، کے پی کے، گلگت، کشمیر)',
      number: '1122',
      desc: 'Free primary emergency medical & ambulance service.',
      descUr: 'مفت ایمبولینس اور ہنگامی طبی امداد۔',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700'
    },
    {
      name: 'Edhi Ambulance Network (Pakistan-wide)',
      nameUr: 'ایدھی ایمبولینس نیٹ ورک (ملک بھر میں)',
      number: '115',
      desc: 'Nationwide volunteer emergency ambulance fleet.',
      descUr: 'ملک گیر ہنگامی ایمبولینس سروس۔',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700'
    },
    {
      name: 'Chhipa Ambulance (Sindh & Karachi)',
      nameUr: 'چھیپا ایمبولینس سروس (سندھ اور کراچی)',
      number: '1020',
      desc: 'Dedicated rapid emergency response ambulance service.',
      descUr: 'سندھ اور کراچی میں فوری ایمبولینس امداد۔',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700'
    },
    {
      name: 'Police Emergency',
      nameUr: 'پولیس ایمرجنسی ہیلپ لائن',
      number: '15',
      desc: 'Immediate law enforcement and crisis assistance.',
      descUr: 'پولیس ہنگامی مدد۔',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* High-visibility Warning Notice */}
      <div className="p-6 bg-red-600 text-white rounded-2xl shadow-sm space-y-2 text-center sm:text-left animate-fade-in-up">
        <div className="flex items-center justify-center sm:justify-start gap-2 font-extrabold text-lg">
          <ShieldAlert className="w-6 h-6 shrink-0 animate-pulse-subtle" />
          <span>
            {isUrdu ? (
              <>اہم انتباہ: یہ سروس ایمرجنسی ڈسپیچر نہیں ہے</>
            ) : (
              <>Important: Medi Nova <span className="font-black italic">AI</span> is NOT an emergency service</>
            )}
          </span>
        </div>
        <p className="text-sm text-red-100 font-medium leading-relaxed">
          {isUrdu
            ? 'اگر آپ یا آپ کے کسی عزیز کو سینے میں شدید درد، سانس کی شدید تنگی، بے ہوشی، یا شدید خون بہنے کی شکایت ہے تو فوراً نیچے دیے گئے ہنگامی نمبرز پر کال کریں۔'
            : 'If you or someone around you is experiencing chest pain, severe difficulty breathing, sudden paralysis, profuse bleeding, or loss of consciousness, do not use web search. Call emergency responders immediately.'}
        </p>
      </div>

      {/* Emergency Hotlines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {numbers.map((item, idx) => (
          <div
            key={idx}
            className={`reveal-on-scroll stagger-${(idx % 4) + 1} p-6 rounded-2xl border ${item.borderColor} ${item.bgColor} flex flex-col justify-between space-y-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
          >
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">
                {isUrdu ? item.nameUr : item.name}
              </h3>
              <p className="text-xs text-slate-700 font-medium">
                {isUrdu ? item.descUr : item.desc}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className={`text-3xl font-black italic ${item.textColor} tracking-tight`}>
                {item.number}
              </span>
              <a
                href={`tel:${item.number}`}
                id={`call-btn-${item.number}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 animate-heartbeat" />
                <span>{isUrdu ? 'کال کریں' : 'Call Now'}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Map Direct Link to find nearby Emergency ERs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up animation-delay-200 hover:shadow-md transition-all">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-extrabold text-slate-900 text-base">
            {isUrdu ? 'قریبی 24/7 ایمرجنسی ہسپتال کا نقشہ دیکھیں' : 'Locate 24/7 Hospital Emergency Departments'}
          </h4>
          <p className="text-xs text-slate-600 font-medium">
            {isUrdu
              ? <>اوپن اسٹریٹ میپ پر قریبی سرکاری و نجی ٹراما سینٹرز تلاش کریں۔</>
              : <>Use the interactive <span className="font-bold italic text-cyan-700">OpenStreetMap</span> Healthcare Finder to see nearest emergency facilities.</>}
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
