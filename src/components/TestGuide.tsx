import React, { useState, useMemo } from 'react';
import { Search, Activity, ArrowLeft, X, AlertCircle, HelpCircle, FileText } from 'lucide-react';
import { TestItem, Language } from '../types';
import { TESTS_DATA, TEST_CATEGORIES } from '../data/testsData';

interface TestGuideProps {
  language: Language;
}

export const TestGuide: React.FC<TestGuideProps> = ({ language }) => {
  const isUrdu = language === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);

  const filteredTests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TESTS_DATA.filter(test => {
      const matchesCat = selectedCategory === 'All' || test.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;

      const matchesName = test.name.toLowerCase().includes(q) || test.nameUr.includes(q);
      const matchesAbbr = test.abbreviation ? test.abbreviation.toLowerCase().includes(q) : false;
      const matchesWhy = test.whyPerformed.toLowerCase().includes(q) || test.whyPerformedUr.includes(q);
      const matchesMeasures = test.whatItMeasures.toLowerCase().includes(q);

      return matchesName || matchesAbbr || matchesWhy || matchesMeasures;
    });
  }, [searchQuery, selectedCategory]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      
      {/* Educational Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 rounded-xl p-4 flex items-start gap-3">
        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
          <span className="font-semibold block sm:inline">
            {isUrdu ? 'لیبارٹری اور تشخیصی گائیڈ:' : 'Diagnostic Lab Reference:'}
          </span>{' '}
          {isUrdu
            ? 'یہ گائیڈ آپ کو یہ سمجھنے میں مدد دیتی ہے کہ ڈاکٹر نے کون سا ٹیسٹ کیوں تجویز کیا اور اس کے کیا معنی ہیں۔ لیب رپورٹس کو ہمیشہ ڈاکٹر کے ساتھ مل کر سمجھیں۔'
            : 'This guide explains what routine medical tests measure, why doctors request them, and helpful questions to ask during your consultation.'}
        </div>
      </div>

      {/* If a test is selected, show detail view matching screenshot tests.png */}
      {selectedTest ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-section-open">
          
          {/* Back Button */}
          <button
            onClick={() => setSelectedTest(null)}
            id="back-to-tests-list-btn"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isUrdu ? 'تمام ٹیسٹوں کی فہرست پر واپس جائیں' : 'Back to Test Guide'}</span>
          </button>

          {/* Header Title */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 mb-2 inline-block">
              {isUrdu ? selectedTest.categoryUr : selectedTest.category}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isUrdu ? selectedTest.nameUr : selectedTest.name}
            </h2>
            {isUrdu && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{selectedTest.name}</p>
            )}
          </div>

          {/* SECTION: WHAT THE TEST IS (Matching screenshot tests.png) */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isUrdu ? 'یہ ٹیسٹ کیا ہے' : 'WHAT THE TEST IS'}
            </h3>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {isUrdu ? selectedTest.whatTheTestIsUr : selectedTest.whatTheTestIs}
            </p>
          </div>

          {/* SECTION: WHY IT MAY BE PERFORMED */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isUrdu ? 'یہ ٹیسٹ کیوں کروایا جاتا ہے' : 'WHY IT MAY BE PERFORMED'}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {isUrdu ? selectedTest.whyPerformedUr : selectedTest.whyPerformed}
            </p>
          </div>

          {/* SECTION: WHAT IT MEASURES */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isUrdu ? 'یہ ٹیسٹ کن چیزوں کی پیمائش کرتا ہے' : 'WHAT IT MEASURES'}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {isUrdu ? selectedTest.whatItMeasuresUr : selectedTest.whatItMeasures}
            </p>
          </div>

          {/* SECTION: GENERAL MEANING OF RESULTS */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isUrdu ? 'نتائج کے عمومی معنی' : 'GENERAL MEANING OF RESULTS'}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {isUrdu ? selectedTest.generalMeaningUr : selectedTest.generalMeaning}
            </p>
          </div>

          {/* SECTION: FACTORS THAT MAY AFFECT RESULTS (Chips) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isUrdu ? 'نتائج پر اثر انداز ہونے والے عوامل' : 'FACTORS THAT MAY AFFECT RESULTS'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(isUrdu ? selectedTest.factorsAffectingUr : selectedTest.factorsAffecting).map((factor, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-700"
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>

          {/* SECTION: QUESTIONS TO ASK A HEALTHCARE PROFESSIONAL (Bullets) */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{isUrdu ? 'ڈاکٹر سے پوچھنے کے لیے ضروری سوالات' : 'QUESTIONS TO ASK A HEALTHCARE PROFESSIONAL'}</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {(isUrdu ? selectedTest.questionsToAskUr : selectedTest.questionsToAsk).map((q, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* Test List & Search Directory */
        <div className="space-y-6">
          
          {/* Search Bar Header */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isUrdu ? 'عام میڈیکل ٹیسٹ گائیڈ' : 'Common Medical Tests Guide'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {isUrdu
                  ? 'ٹیسٹ کا نام (جیسے CBC, ECG, شوگر, LFT, Creatinine) لکھ کر تلاش کریں'
                  : 'Search by test name or abbreviation (e.g. CBC, ECG, HbA1c, LFT, Chest X-Ray)'}
              </p>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                id="test-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isUrdu ? 'ٹیسٹ تلاش کریں (مثلاً ECG, CBC, HbA1c, LFT, ایکسرے)...' : 'Search test (e.g. ECG, CBC, HbA1c, LFT, Creatinine, X-Ray)...'}
                className="w-full pl-11 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
                {isUrdu ? 'کیٹیگری:' : 'Category:'}
              </span>
              {TEST_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  id={`test-cat-btn-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 dark:bg-cyan-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              {isUrdu
                ? `${filteredTests.length} ٹیسٹ گائیڈز دستیاب ہیں`
                : `Showing ${filteredTests.length} diagnostic test guides`}
            </span>
            {searchQuery && (
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Filtered by: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          {/* Grid of Test Cards */}
          {filteredTests.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                {isUrdu ? 'کوئی ٹیسٹ نہیں ملا' : 'No medical tests matched your search'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {isUrdu
                  ? 'برائے مہربانی نام یا مخفف (جیسے CBC, ECG) سے تلاش کریں۔'
                  : 'Try searching by common acronym (e.g. CBC, ECG, RFT, LFT).'}
              </p>
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTests.map((test, idx) => (
                <div
                  key={test.id}
                  onClick={() => setSelectedTest(test)}
                  id={`test-card-${test.id}`}
                  className={`reveal-on-scroll stagger-${(idx % 6) + 1} bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/70 shadow-3xs">
                        {isUrdu ? test.categoryUr : test.category}
                      </span>
                      {test.abbreviation && (
                        <span className="text-xs font-black italic text-cyan-800 dark:text-cyan-300 bg-cyan-100/70 dark:bg-cyan-950/80 border border-cyan-200/80 dark:border-cyan-800/80 px-2 py-0.5 rounded shadow-3xs">
                          {test.abbreviation}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-base">
                        {isUrdu ? test.nameUr : test.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 line-clamp-2 leading-relaxed">
                        {isUrdu ? test.whatTheTestIsUr : test.whatTheTestIs}
                      </p>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        {isUrdu ? 'مقصد' : 'Why performed'}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
                        {isUrdu ? test.whyPerformedUr : test.whyPerformed}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                    <span>{isUrdu ? 'مکمل تشخیصی رہنمائی دیکھیں' : 'View Test Guide'}</span>
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
