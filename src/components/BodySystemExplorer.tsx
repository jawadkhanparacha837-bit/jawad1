import React, { useState } from 'react';
import { Brain, Heart, Wind, Utensils, Shield, AlertCircle, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { Language, BodySystemItem } from '../types';
import { BODY_SYSTEMS_DATA } from '../data/bodySystemsData';

interface BodySystemExplorerProps {
  language: Language;
}

export const BodySystemExplorer: React.FC<BodySystemExplorerProps> = ({ language }) => {
  const isUrdu = language === 'ur';
  const [selectedSystemId, setSelectedSystemId] = useState<string>('heart');

  const selectedSystem = BODY_SYSTEMS_DATA.find(s => s.id === selectedSystemId) || BODY_SYSTEMS_DATA[0];

  const getSystemIcon = (id: string, active: boolean) => {
    const cls = `w-6 h-6 ${active ? 'text-white' : 'text-slate-600'}`;
    switch (id) {
      case 'brain':
        return <Brain className={cls} />;
      case 'heart':
        return <Heart className={cls} />;
      case 'lungs':
        return <Wind className={cls} />;
      case 'digestive':
        return <Utensils className={cls} />;
      case 'bones':
        return <Shield className={cls} />;
      default:
        return <Activity className={cls} />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Heading */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {isUrdu ? 'انسانی اعضاء و جسمانی نظام ایکسپلورر' : 'Interactive Body System Explorer'}
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          {isUrdu
            ? 'جانیے کہ انسانی جسم کے اہم اعضاء کیسے کام کرتے ہیں، عام بیماریاں کیا ہیں اور کس وقت ڈاکٹر سے رجوع کرنا ضروری ہے۔'
            : 'Explore how vital organ systems work, common ailments to watch out for, and critical red flags that require specialist consultation.'}
        </p>

        {/* System Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
          {BODY_SYSTEMS_DATA.map(sys => {
            const active = selectedSystemId === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => setSelectedSystemId(sys.id)}
                id={`body-sys-btn-${sys.id}`}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  active
                    ? 'bg-cyan-600 border-cyan-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${active ? 'bg-white/20' : 'bg-white'}`}>
                  {getSystemIcon(sys.id, active)}
                </div>
                <span className="text-xs font-bold text-center leading-tight">
                  {isUrdu ? sys.nameUr.split(' ')[0] : sys.name.split('&')[0].trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed System Breakdown */}
      <div key={selectedSystem.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6 animate-section-open transition-all hover:shadow-md">
        
        {/* Title Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shadow-3xs">
              {getSystemIcon(selectedSystem.id, false)}
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {isUrdu ? selectedSystem.nameUr : selectedSystem.name}
              </h3>
              <p className="text-sm text-cyan-700 font-bold italic mt-0.5">
                {isUrdu ? selectedSystem.taglineUr : selectedSystem.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Overview description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isUrdu ? 'نظام کا تعارف و طریقہ کار' : 'HOW IT WORKS'}
          </h4>
          <p className="text-slate-700 text-base font-medium leading-relaxed">
            {isUrdu ? selectedSystem.descriptionUr : selectedSystem.description}
          </p>
        </div>

        {/* Primary Organs */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isUrdu ? 'بنیادی حصے اور اعضاء' : 'PRIMARY ORGANS & COMPONENTS'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {(isUrdu ? selectedSystem.primaryOrgansUr : selectedSystem.primaryOrgans).map((org, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-slate-100 hover:bg-cyan-50 text-slate-800 text-xs font-bold rounded-lg border border-slate-200/60 transition-colors"
              >
                {org}
              </span>
            ))}
          </div>
        </div>

        {/* Two Column Grid: Common Issues vs Warning Signs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Common Issues */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/90 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-600" />
              <span>{isUrdu ? 'عام شکایات و مسائل' : 'COMMON COMPLAINTS & ISSUES'}</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-700 font-medium">
              {(isUrdu ? selectedSystem.commonIssuesUr : selectedSystem.commonIssues).map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Red Flag Warning Signs */}
          <div className="p-5 bg-red-50/80 rounded-xl border border-red-200 space-y-3">
            <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 animate-heartbeat" />
              <span>{isUrdu ? 'فوری توجہ طلب خطرے کی علامات' : 'RED FLAG WARNING SIGNS'}</span>
            </h4>
            <ul className="space-y-2 text-sm text-red-950 font-semibold">
              {(isUrdu ? selectedSystem.warningSignsUr : selectedSystem.warningSigns).map((sign, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Daily Care & Longevity Tips */}
        <div className="p-5 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-2">
          <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isUrdu ? 'حفاظتی تدابیر اور مفید عادات' : 'EVIDENCE-BASED CARE HABITS'}</span>
          </h4>
          <ul className="space-y-1.5 text-sm text-emerald-950 font-medium">
            {(isUrdu ? selectedSystem.careTipsUr : selectedSystem.careTips).map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
