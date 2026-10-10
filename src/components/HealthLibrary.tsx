import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Clock, ArrowLeft, X, Droplet, Heart, Shield, Activity, Sparkles } from 'lucide-react';
import { LibraryArticle, Language } from '../types';
import { LIBRARY_ARTICLES, LIBRARY_CATEGORIES } from '../data/libraryData';

interface HealthLibraryProps {
  language: Language;
}

export const HealthLibrary: React.FC<HealthLibraryProps> = ({ language }) => {
  const isUrdu = language === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<LibraryArticle | null>(null);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return LIBRARY_ARTICLES.filter(art => {
      const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;

      const matchesTitle = art.title.toLowerCase().includes(q) || art.titleUr.includes(q);
      const matchesExcerpt = art.excerpt.toLowerCase().includes(q) || art.excerptUr.includes(q);
      const matchesContent = art.content.some(c => c.toLowerCase().includes(q)) ||
                             art.contentUr.some(c => c.includes(q));

      return matchesTitle || matchesExcerpt || matchesContent;
    });
  }, [searchQuery, selectedCategory]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Conditions':
        return <Droplet className="w-4 h-4 text-red-500 fill-red-500/20" />;
      case 'Infectious':
        return <Shield className="w-4 h-4 text-amber-500" />;
      case 'Emergency':
        return <Activity className="w-4 h-4 text-rose-500" />;
      default:
        return <Heart className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* If article selected, show full reader view matching screenshot library-article.png */}
      {selectedArticle ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6 max-w-3xl mx-auto animate-section-open">
          
          {/* Back button matching "← Health Library" in screenshot */}
          <button
            onClick={() => setSelectedArticle(null)}
            id="back-to-library-list-btn"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>←</span>
            <span>{isUrdu ? 'صحت لائبریری پر واپس جائیں' : 'Health Library'}</span>
          </button>

          {/* Badge with Icon matching screenshot library-article.png */}
          <div className="flex items-center gap-2 pt-2">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              {getCategoryIcon(selectedArticle.category)}
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-100">
              {isUrdu ? selectedArticle.categoryUr : selectedArticle.category}
            </span>
          </div>

          {/* Main Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {isUrdu ? selectedArticle.titleUr : selectedArticle.title}
            </h1>
            {isUrdu && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
                {selectedArticle.title}
              </p>
            )}
            
            {/* Reading Time */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{isUrdu ? selectedArticle.readTimeUr : selectedArticle.readTime}</span>
            </div>
          </div>

          {/* Article Body Paragraphs */}
          <div className="space-y-4 text-slate-700 leading-relaxed text-base sm:text-lg border-t border-slate-100 pt-6">
            {(isUrdu ? selectedArticle.contentUr : selectedArticle.content).map((para, idx) => (
              <p key={idx}>
                {para}
              </p>
            ))}
          </div>

          {/* Key Takeaways Box */}
          <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 mt-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>{isUrdu ? 'اہم نکات کا خلاصہ' : 'KEY TAKEAWAYS'}</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {(isUrdu ? selectedArticle.keyTakeawaysUr : selectedArticle.keyTakeaways).map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 mt-2 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* Library Articles Directory */
        <div className="space-y-6">
          
          {/* Header & Search */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isUrdu ? 'صحت عامہ لائبریری' : 'Health & Wellness Library'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {isUrdu
                  ? 'مستند اور آسان فہم مضامین برائے ذیابیطس، بلڈ پریشر، ڈینگی، لو سے بچاؤ اور غذائیت'
                  : 'Clear, plain-language medical articles on diabetes, hypertension, dengue fever, summer heatstroke, and heart health.'}
              </p>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                id="library-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isUrdu ? 'مضمون تلاش کریں (مثلاً ذیابیطس، شوگر، بلڈ پریشر، ڈینگی)...' : 'Search articles (e.g. diabetes, hypertension, dengue, heatstroke, heart)...'}
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
              {LIBRARY_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  id={`library-cat-btn-${cat.toLowerCase()}`}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? (isUrdu ? 'تمام' : 'All') :
                   cat === 'Conditions' ? (isUrdu ? 'بیماریاں' : 'Conditions') :
                   cat === 'Infectious' ? (isUrdu ? 'متعدی امراض' : 'Infectious') :
                   cat === 'Emergency' ? (isUrdu ? 'ہنگامی دیکھ بھال' : 'Emergency') :
                   (isUrdu ? 'تندرستی' : 'Wellness')}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {isUrdu
                ? `${filteredArticles.length} مضامین دستیاب ہیں`
                : `Showing ${filteredArticles.length} articles`}
            </span>
            {searchQuery && (
              <span className="font-medium text-slate-700">
                Filtered by: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          {/* Grid of Articles */}
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">
                {isUrdu ? 'کوئی مضمون نہیں ملا' : 'No articles matched your search'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                {isUrdu ? 'مختلف الفاظ سے سرچ کر کے دیکھیں۔' : 'Try searching for terms like diabetes, pressure, or dengue.'}
              </p>
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, idx) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  id={`article-card-${article.id}`}
                  className={`reveal-on-scroll stagger-${(idx % 6) + 1} bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-cyan-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200/80 flex items-center gap-1.5 shadow-3xs">
                        {getCategoryIcon(article.category)}
                        <span>{isUrdu ? article.categoryUr : article.category}</span>
                      </span>
                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isUrdu ? article.readTimeUr : article.readTime}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors text-base leading-snug">
                        {isUrdu ? article.titleUr : article.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 line-clamp-3 leading-relaxed">
                        {isUrdu ? article.excerptUr : article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600 group-hover:text-cyan-700">
                    <span>{isUrdu ? 'مضمون پڑھیں' : 'Read Article'}</span>
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
