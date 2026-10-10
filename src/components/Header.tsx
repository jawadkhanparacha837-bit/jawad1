import React, { useState, useEffect } from 'react';
import { Stethoscope, Globe, Menu, X, AlertCircle } from 'lucide-react';
import { Language, NavTab } from '../types';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isUrdu = language === 'ur';

  useEffect(() => {
    const handleScroll = () => {
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable > 0) {
        const progress = (window.scrollY / totalScrollable) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavTab; labelEn: string; labelUr: string; isAi?: boolean }[] = [
    { id: 'home', labelEn: 'Home', labelUr: 'ہوم' },
    { id: 'assistant', labelEn: 'AI Assistant', labelUr: 'اے آئی اسسٹنٹ', isAi: true },
    { id: 'symptom-checker', labelEn: 'Symptom Checker', labelUr: 'علامات کی جانچ', isAi: true },
    { id: 'report-analyzer', labelEn: 'Report Analyzer', labelUr: 'رپورٹ اینالائزر', isAi: true },
    { id: 'finder', labelEn: 'Healthcare Finder', labelUr: 'ہسپتال و کلینک تلاش کریں' },
    { id: 'medicines', labelEn: 'Medicine Guide', labelUr: 'ادویات گائیڈ' },
    { id: 'tests', labelEn: 'Test Guide', labelUr: 'ٹیسٹ گائیڈ' },
    { id: 'library', labelEn: 'Health Library', labelUr: 'صحت لائبریری' },
    { id: 'body-systems', labelEn: 'Body Systems', labelUr: 'انسانی جسم' },
    { id: 'emergency', labelEn: 'Emergency (1122)', labelUr: 'ایمرجنسی (1122)' }
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all duration-200 relative">
      {/* Dynamic Scroll Progress Bar - Animates as user moves or scrolls down */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-100 overflow-hidden z-50 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 transition-all duration-150 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl p-1 -ml-1 group text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20 group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all duration-300 group-hover:shadow-md group-hover:shadow-cyan-500/30">
              <Stethoscope className="w-5 h-5 transition-transform group-hover:rotate-12 duration-300" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                {isUrdu ? (
                  <>میڈی نووا <span className="font-extrabold italic text-cyan-600">اے آئی</span></>
                ) : (
                  <>MediNova <span className="font-extrabold italic text-cyan-600">AI</span></>
                )}
              </span>
              <span className="text-[11px] text-slate-600 font-semibold tracking-wide block">
                {isUrdu ? 'صحت رہنمائی پلیٹ فارم' : 'Health Information Platform'}
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navItems.map(item => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none cursor-pointer active:scale-95 ${
                    active
                      ? 'bg-cyan-50 text-cyan-800 font-extrabold border border-cyan-200/90 shadow-2xs scale-[1.02]'
                      : 'text-slate-700 font-semibold hover:text-slate-900 hover:bg-slate-100/90 hover:scale-[1.01]'
                  }`}
                >
                  <span>{isUrdu ? item.labelUr : item.labelEn}</span>
                  {item.isAi && (
                    <span className={`text-[10px] uppercase font-extrabold italic tracking-wider px-1.5 py-0.5 rounded shadow-3xs transition-transform duration-200 ${
                      active ? 'bg-cyan-200/80 text-cyan-900 scale-105' : 'bg-cyan-50 text-cyan-700 border border-cyan-200/60'
                    }`}>
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Language Toggle & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            {/* Language Selector Dropdown */}
            <div className="relative inline-block text-left">
              <button
                type="button"
                onClick={() => onToggleLanguage(isUrdu ? 'en' : 'ur')}
                id="language-toggle-btn"
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-200/90 shadow-2xs text-xs sm:text-sm font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
                title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
              >
                <Globe className="w-4 h-4 text-cyan-600" />
                <span>{isUrdu ? 'اردو' : 'English'}</span>
                <span className="text-xs text-slate-400 font-normal">
                  {isUrdu ? '(EN)' : '(اردو)'}
                </span>
              </button>
            </div>

            {/* Emergency Hotline Button */}
            <button
              onClick={() => handleNavClick('emergency')}
              id="header-rescue-1122-btn"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 text-xs font-bold rounded-lg border border-red-200/90 shadow-2xs transition-all focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
              <span>Rescue 1122</span>
            </button>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white/98 px-4 pt-3 pb-6 space-y-1 shadow-lg animate-fade-in">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            {isUrdu ? 'مینو' : 'Menu Navigation'}
          </div>
          {navItems.map(item => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                  active 
                    ? 'bg-cyan-50 text-cyan-800 font-bold border border-cyan-200/70' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{isUrdu ? item.labelUr : item.labelEn}</span>
                {item.isAi ? (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                    OpenAI
                  </span>
                ) : (
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {isUrdu ? 'آزاد' : 'Independent'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
