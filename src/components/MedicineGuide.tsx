import React, { useState, useMemo } from 'react';
import { Search, Pill, ShieldAlert, ArrowLeft, X, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { MedicineItem, Language } from '../types';
import { MEDICINES_DATA, MEDICINE_CATEGORIES } from '../data/medicinesData';

interface MedicineGuideProps {
  language: Language;
}

export const MedicineGuide: React.FC<MedicineGuideProps> = ({ language }) => {
  const isUrdu = language === 'ur';

  // 1. Search input connected to state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineItem | null>(null);

  // 2. Filtering logic (matches generic name, brands, uses, category, urdu)
  const filteredMedicines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MEDICINES_DATA.filter(med => {
      const matchesCat = selectedCategory === 'All' || med.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;

      const matchesGeneric = med.genericName.toLowerCase().includes(q) || med.genericNameUr.includes(q);
      const matchesBrand = med.brandExamples.some(b => b.toLowerCase().includes(q));
      const matchesUses = med.commonUses.some(u => u.toLowerCase().includes(q)) || 
                          med.commonUsesUr.some(u => u.includes(q));
      const matchesWhat = med.whatItIs.toLowerCase().includes(q);

      return matchesGeneric || matchesBrand || matchesUses || matchesWhat;
    });
  }, [searchQuery, selectedCategory]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      
      {/* Educational Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          <span className="font-semibold block sm:inline">
            {isUrdu ? 'اہم طبی نوٹ:' : 'Medical Educational Disclaimer:'}
          </span>{' '}
          {isUrdu
            ? 'میڈی نووا ادویات گائیڈ صرف تعلیمی آگاہی کے لیے ہے۔ ہم خوراک (dosing) نہیں بتاتے اور نہ ہی خود سے دوا تجویز کرتے ہیں۔ دوا لینے سے پہلے ہمیشہ ڈاکٹر یا فارماسسٹ سے رجوع کریں۔'
            : 'Medi Nova AI provides educational reference only. We never provide dosage amounts or prescribe medicines. Always consult a qualified doctor or licensed pharmacist before taking any medication.'}
        </div>
      </div>

      {/* If a medicine is selected, show detail view matching screenshot medicine.png */}
      {selectedMedicine ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-section-open">
          
          {/* Back Button */}
          <button
            onClick={() => setSelectedMedicine(null)}
            id="back-to-medicines-list-btn"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isUrdu ? 'تمام ادویات کی فہرست پر واپس جائیں' : 'Back to Medicine Guide'}</span>
          </button>

          {/* Header Title */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {isUrdu ? selectedMedicine.categoryUr : selectedMedicine.category}
              </span>
              {selectedMedicine.isPrescription ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                  {isUrdu ? 'صرف ڈاکٹر کے نسخے پر' : 'Prescription Required (Rx)'}
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {isUrdu ? 'عام دستیاب (OTC)' : 'Over-the-Counter (OTC)'}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isUrdu ? selectedMedicine.genericNameUr : selectedMedicine.genericName}
            </h2>
            {isUrdu && (
              <p className="text-sm text-slate-500 mt-0.5">{selectedMedicine.genericName}</p>
            )}
          </div>

          {/* SECTION: WHAT IT IS (Matching screenshot medicine.png) */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isUrdu ? 'یہ دوا کیا ہے' : 'WHAT IT IS'}
            </h3>
            <p className="text-base text-slate-700 leading-relaxed font-normal">
              {isUrdu ? selectedMedicine.whatItIsUr : selectedMedicine.whatItIs}
            </p>
          </div>

          {/* SECTION: COMMON BRAND EXAMPLES (PAKISTAN) chips */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isUrdu ? 'عام برانڈ کے نام (پاکستان)' : 'COMMON BRAND EXAMPLES (PAKISTAN)'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedMedicine.brandExamples.map(brand => (
                <span
                  key={brand}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full border border-slate-200/60 transition-colors"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* SECTION: COMMON USES */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isUrdu ? 'عام استعمالات' : 'COMMON USES'}
            </h3>
            <ul className="space-y-1.5">
              {(isUrdu ? selectedMedicine.commonUsesUr : selectedMedicine.commonUses).map((use, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SECTION: HOW IT GENERALLY WORKS */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isUrdu ? 'یہ دوا کیسے اثر کرتی ہے' : 'HOW IT GENERALLY WORKS'}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {isUrdu ? selectedMedicine.howItWorksUr : selectedMedicine.howItWorks}
            </p>
          </div>

          {/* SECTION: COMMON SIDE EFFECTS */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isUrdu ? 'عام ممکنہ ضمنی اثرات' : 'COMMON SIDE EFFECTS'}
            </h3>
            <ul className="space-y-1.5">
              {(isUrdu ? selectedMedicine.sideEffectsUr : selectedMedicine.sideEffects).map((effect, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                  <span>{effect}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SECTION: PRECAUTIONS */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>{isUrdu ? 'حفاظتی تدابیر' : 'PRECAUTIONS & WARNINGS'}</span>
            </h3>
            <ul className="space-y-1 text-xs sm:text-sm text-slate-600">
              {(isUrdu ? selectedMedicine.precautionsUr : selectedMedicine.precautions).map((prec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  <span>{prec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* Medicine Search & Cards Directory */
        <div className="space-y-6">
          
          {/* Search Bar Header */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isUrdu ? 'ادویات گائیڈ (پاکستان)' : 'Pakistan Medicine Guide'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {isUrdu
                  ? 'جینیرک نام، برانڈ کا نام (جیسے پیناڈول، بروفین، رائزک) یا علامات سے سرچ کریں'
                  : 'Search by generic name, brand name (Panadol, Brufen, Risek, Augmentin), or symptom'}
              </p>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                id="medicine-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isUrdu ? 'دوا کا نام تلاش کریں (مثلاً Panadol, Brufen, Risek, بخار)...' : 'Search medicine (e.g. Panadol, Brufen, Risek, Augmentin, fever)...'}
                className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 mr-1">
                {isUrdu ? 'کیٹیگری:' : 'Category:'}
              </span>
              {MEDICINE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  id={`medicine-cat-btn-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {isUrdu
                ? `${filteredMedicines.length} ادویات دستیاب ہیں`
                : `Showing ${filteredMedicines.length} educational medicine guides`}
            </span>
            {searchQuery && (
              <span className="font-medium text-slate-700">
                Filtered by: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          {/* Grid of Medicine Cards */}
          {filteredMedicines.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
              <Pill className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">
                {isUrdu ? 'کوئی دوا نہیں ملی' : 'No medicines matched your search'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                {isUrdu
                  ? 'برائے مہربانی اسپیلنگ چیک کریں یا عام برانڈ نام (جیسے Panadol, Brufen) سے تلاش کریں۔'
                  : 'Check the spelling or try searching for a brand name like Panadol, Brufen, or Risek.'}
              </p>
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMedicines.map((med, idx) => (
                <div
                  key={med.id}
                  onClick={() => setSelectedMedicine(med)}
                  id={`medicine-card-${med.id}`}
                  className={`reveal-on-scroll stagger-${(idx % 6) + 1} bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-cyan-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/60 shadow-3xs">
                        {isUrdu ? med.categoryUr : med.category}
                      </span>
                      {med.isPrescription ? (
                        <span className="text-[10px] font-black italic px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 shadow-3xs">
                          Rx
                        </span>
                      ) : (
                        <span className="text-[10px] font-black italic px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-3xs">
                          OTC
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors text-base">
                        {isUrdu ? med.genericNameUr : med.genericName}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-2 leading-relaxed">
                        {isUrdu ? med.whatItIsUr : med.whatItIs}
                      </p>
                    </div>

                    {/* Brands Preview */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        {isUrdu ? 'پاکستان میں برانڈز' : 'Brand Examples'}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {med.brandExamples.map(b => (
                          <span
                            key={b}
                            className="text-[11px] font-bold italic px-2.5 py-0.5 bg-slate-100 hover:bg-cyan-50 text-slate-800 hover:text-cyan-900 rounded-md transition-colors"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600 group-hover:text-cyan-700">
                    <span>{isUrdu ? 'تفصیلات اور رہنمائی دیکھیں' : 'View Educational Details'}</span>
                    <span className="group-hover:translate-x-1.5 transition-transform duration-200 font-extrabold">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
