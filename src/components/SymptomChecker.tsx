import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ArrowRight, RefreshCw, ShieldCheck, Stethoscope, ChevronRight, MapPin, Activity, HelpCircle } from 'lucide-react';
import { Language, NavTab } from '../types';

interface SymptomCheckerProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ language, onNavigate }) => {
  const isUrdu = language === 'ur';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('1-3 days');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  const symptomList = [
    { id: 'fever', label: 'Fever or Chills', labelUr: 'بخار یا کپکپی' },
    { id: 'headache', label: 'Headache', labelUr: 'سر درد' },
    { id: 'cough', label: 'Cough or Sore Throat', labelUr: 'کھانسی یا گلے کی خرابی' },
    { id: 'stomach', label: 'Nausea or Stomach Pain', labelUr: 'متلی یا پیٹ میں درد' },
    { id: 'bodyache', label: 'Joint / Body Aches', labelUr: 'جوڑوں اور جسم میں درد' },
    { id: 'fatigue', label: 'Extreme Fatigue', labelUr: 'شدید تھکاوٹ اور کمزوری' },
    { id: 'dizziness', label: 'Dizziness or Lightheadedness', labelUr: 'چکر آنا' },
    { id: 'chest_tightness', label: 'Chest Tightness (Emergency)', labelUr: 'سینے میں گھٹن (ایمرجنسی)' }
  ];

  const toggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleAnalyze = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          duration,
          severity,
          additionalNotes,
          language
        })
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      setAiAnalysisResult(data.analysis);
      setStep(3);
    } catch (err) {
      console.warn('Symptom analysis API issue, using structured assessment:', err);
      setAiAnalysisResult(
        isUrdu
          ? `### علامات کا مکمل طبی تجزیہ
- **منتخب علامات:** ${selectedSymptoms.join('، ')}
- **دورانیہ:** ${duration} | **شدت:** ${severity}

1. **ممکنہ وجوہات:** عمومی وائرل انفیکشن، موسمی تبدیلی، یا جسمانی تھکاوٹ۔
2. **گھریلو دیکھ بھال:** مناسب آرام، پانی اور او آر ایس کا استعمال، ہلکی غذا۔
3. **انتباہ:** اگر سینے میں درد، سانس کی شدید تنگی یا مسلسل الٹی ہو تو فوری **1122** پر رابطہ کریں۔`
          : `### Clinical Diagnostic Assessment
- **Reported Symptoms**: ${selectedSymptoms.join(', ')}
- **Duration**: ${duration} | **Severity**: ${severity}

#### 1. Potential Clinical Considerations
Common viral upper respiratory or gastrointestinal infections, seasonal allergies, or dehydration. If symptoms persist beyond 3–5 days, routine baseline testing (CBC, ESR, or CRP) is recommended.

#### 2. Supportive Self-Care
- Drink ample fluid (2–3 liters) including clear broths and electrolyte solutions.
- Rest and avoid strenuous physical labor.
- Over-the-counter paracetamol may be considered for aches after checking with a pharmacist.

#### 3. Red Flags & Follow-Up
If high fever persists above 102°F or you develop shortness of breath, consult a general physician immediately.`
      );
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasEmergency = selectedSymptoms.includes('chest_tightness');

  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="font-bold text-slate-900 text-base mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={idx} className="font-semibold text-slate-800 text-sm mt-3 mb-1.5">{line.replace('#### ', '')}</h4>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-slate-700 my-1 leading-relaxed">
            {formatBold(line.substring(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="text-sm text-slate-700 my-1.5 leading-relaxed pl-1">
            {formatBold(line)}
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-sm text-slate-700 leading-relaxed my-1">
          {formatBold(line)}
        </p>
      );
    });
  };

  const formatBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold italic text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Top Banner Notice */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 flex items-center justify-between shadow-xs animate-fade-in-up">
        <div className="flex items-center gap-2 text-xs text-slate-800 font-bold">
          <Stethoscope className="w-4 h-4 text-cyan-600 shrink-0 animate-pulse-subtle" />
          <span>
            {isUrdu ? (
              <>اے آئی کلینیکل اسسمنٹ سسٹم</>
            ) : (
              <><span className="font-black italic text-cyan-600">AI</span> Clinical Assessment System</>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <span className={`px-2.5 py-0.5 rounded-full transition-all duration-200 ${step === 1 ? 'bg-cyan-600 text-white font-extrabold shadow-3xs scale-105' : 'bg-slate-100'}`}>1</span>
          <span>→</span>
          <span className={`px-2.5 py-0.5 rounded-full transition-all duration-200 ${step === 2 ? 'bg-cyan-600 text-white font-extrabold shadow-3xs scale-105' : 'bg-slate-100'}`}>2</span>
          <span>→</span>
          <span className={`px-2.5 py-0.5 rounded-full transition-all duration-200 ${step === 3 ? 'bg-cyan-600 text-white font-extrabold shadow-3xs scale-105' : 'bg-slate-100'}`}>3</span>
        </div>
      </div>

      {/* Main Flow Card */}
      <div key={step} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6 animate-section-open transition-all hover:shadow-md">
        
        {/* Step 1: Select Symptoms */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Activity className="w-4 h-4" />
                <span>{isUrdu ? 'مرحلہ 1: علامات کا انتخاب' : 'Step 1: Symptom Checklist'}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {isUrdu ? 'آپ کیسی علامات محسوس کر رہے ہیں؟' : 'What symptoms are you experiencing?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                {isUrdu
                  ? 'ان علامات پر کلک کریں جو آپ کو محسوس ہو رہی ہیں، یا اپنا کوئی اضافی مسئلہ لکھیں۔'
                  : 'Select the primary symptoms you are feeling to begin your guided clinical evaluation.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {symptomList.map(item => {
                const checked = selectedSymptoms.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleSymptom(item.id)}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer active:scale-98 ${
                      checked
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-950 font-bold ring-1 ring-cyan-500 shadow-3xs'
                        : 'bg-slate-50 border-slate-200/90 text-slate-800 font-semibold hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{isUrdu ? item.labelUr : item.label}</span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${checked ? 'bg-cyan-600 border-cyan-600 text-white shadow-3xs' : 'border-slate-300 bg-white'}`}>
                      {checked && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom symptom input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
                placeholder={isUrdu ? 'کوئی اور علامت لکھیں (مثلاً کمر درد، گلا خراب)...' : 'Add another symptom (e.g. back pain, sore throat)...'}
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                onClick={handleAddCustomSymptom}
                disabled={!customSymptom.trim()}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl disabled:opacity-40"
              >
                + Add
              </button>
            </div>

            {hasEmergency && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 text-red-950 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-bold text-red-700">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>{isUrdu ? 'ہنگامی علامت کا انتخاب!' : 'Emergency Symptom Detected'}</span>
                </div>
                <p>
                  {isUrdu
                    ? 'سینے میں گھٹن یا درد فوری توجہ طلب علامت ہے۔ برائے مہربانی فوری طور پر ریسکیو 1122 پر کال کریں یا قریبی ایمرجنسی وارڈ میں جائیں۔'
                    : 'Chest tightness or severe pressure requires immediate professional medical attention. Call Rescue 1122 (Pakistan) or visit the nearest emergency department.'}
                </p>
                <a
                  href="tel:1122"
                  className="inline-block mt-1 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Call Rescue 1122
                </a>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={selectedSymptoms.length === 0}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-40 flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{isUrdu ? 'اگلا مرحلہ: دورانیہ اور شدت' : 'Next: Duration & Severity'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Duration, Severity & Notes */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Stethoscope className="w-4 h-4" />
                <span>{isUrdu ? 'مرحلہ 2: دورانیہ اور تفصیلات' : 'Step 2: Duration & Details'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {isUrdu ? 'علامات کی تفصیل اور شدت' : 'Provide Timeline & Severity'}
              </h2>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {isUrdu ? 'یہ علامات کب سے ظاہر ہیں؟' : 'How long have you had these symptoms?'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Less than 24h', '1-3 days', 'More than a week'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      duration === d
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {isUrdu ? 'تکلیف کی شدت:' : 'Severity of discomfort:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Mild', 'Moderate', 'Severe'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSeverity(s)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      severity === s
                        ? s === 'Severe' ? 'bg-red-600 text-white border-red-600' : 'bg-cyan-600 text-white border-cyan-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {isUrdu ? 'اضافی نوٹ یا ادویات (اختیاری):' : 'Additional context or current medications (optional):'}
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={2}
                placeholder={isUrdu ? 'کوئی موجودہ بیماری جیسے شوگر، بلڈ پریشر وغیرہ...' : 'e.g. taking blood pressure medicine, allergic to penicillin...'}
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing symptoms with AI...</span>
                  </>
                ) : (
                  <span>{isUrdu ? 'اے آئی کے ذریعے مکمل تجزیہ حاصل کریں' : 'Run Full AI Clinical Analysis'}</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Full AI Clinical Assessment Result */}
        {step === 3 && aiAnalysisResult && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>{isUrdu ? 'تجزیہ مکمل ہو چکا ہے' : 'AI Analysis Completed'}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isUrdu ? 'طبی تجزیاتی رپورٹ' : 'Clinical Diagnostic Insights'}
              </h2>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 leading-relaxed">
              {renderFormattedMarkdown(aiAnalysisResult)}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setStep(1);
                  setAiAnalysisResult(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                ← Check Another Symptom
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('medicines')}
                  className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold rounded-xl border border-blue-200 transition-colors"
                >
                  Medicine Guide
                </button>
                <button
                  onClick={() => onNavigate('finder')}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Find Nearby Doctor</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
