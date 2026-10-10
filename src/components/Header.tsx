import React, { useState, useEffect, useRef } from 'react';
import { Stethoscope, Globe, Menu, X, AlertCircle, Sun, Moon, Monitor, Palette, Check, RotateCcw } from 'lucide-react';
import { Language, NavTab, AppearanceMode } from '../types';
import { useTheme, ACCENT_OPTIONS, getReadableForeground } from '../context/ThemeContext';

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
  const [themePanelOpen, setThemePanelOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const themePanelRef = useRef<HTMLDivElement | null>(null);

  const {
    appearance,
    isDark,
    accent,
    customColor,
    activeAccentHex,
    toggleTheme,
    setAppearance,
    setAccent,
    setCustomColor,
    resetThemeCustomization
  } = useTheme();

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

  // Close theme panel on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themePanelRef.current && !themePanelRef.current.contains(event.target as Node)) {
        setThemePanelOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setThemePanelOpen(false);
      }
    };

    if (themePanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [themePanelOpen]);

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

  const appearanceOptions: { id: AppearanceMode; labelEn: string; labelUr: string; icon: React.ReactNode }[] = [
    { id: 'light', labelEn: 'Light', labelUr: 'لائٹ', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'dark', labelEn: 'Dark', labelUr: 'ڈارک', icon: <Moon className="w-3.5 h-3.5" /> },
    { id: 'system', labelEn: 'System', labelUr: 'سسٹم', icon: <Monitor className="w-3.5 h-3.5" /> }
  ];

  const themeTooltip = isDark
    ? (isUrdu ? 'لائٹ موڈ میں تبدیل کریں (Switch to light mode)' : 'Switch to light mode')
    : (isUrdu ? 'ڈارک موڈ میں تبدیل کریں (Switch to dark mode)' : 'Switch to dark mode');

  const logoForeground = getReadableForeground(activeAccentHex);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors duration-300 relative">
      {/* Dynamic Scroll Progress Bar - Animates as user moves or scrolls down */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-100 dark:bg-slate-800 overflow-hidden z-50 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 transition-all duration-150 ease-out shadow-xs"
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
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-sm shadow-cyan-500/20 group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all duration-300 group-hover:shadow-md group-hover:shadow-cyan-500/30"
              style={{ color: logoForeground }}
            >
              <Stethoscope className="w-5 h-5 transition-transform group-hover:rotate-12 duration-300" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white block leading-tight">
                {isUrdu ? (
                  <>میڈی نووا <span className="font-extrabold italic text-cyan-600 dark:text-cyan-400">اے آئی</span></>
                ) : (
                  <>MediNova <span className="font-extrabold italic text-cyan-600 dark:text-cyan-400">AI</span></>
                )}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold tracking-wide block">
                {isUrdu ? 'صحت رہنمائی پلیٹ فارم' : 'Intelligence That Cares.'}
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Primary Navigation">
            {navItems.map(item => {
              const active = currentTab === item.id ||
                (item.id === 'symptom-checker' && currentTab === 'symptoms') ||
                (item.id === 'report-analyzer' && currentTab === 'reports');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none cursor-pointer active:scale-95 ${
                    active
                      ? 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 font-extrabold border border-cyan-200/90 dark:border-cyan-800/80 shadow-2xs scale-[1.02]'
                      : 'text-slate-700 dark:text-slate-300 font-semibold hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:scale-[1.01]'
                  }`}
                >
                  <span>{isUrdu ? item.labelUr : item.labelEn}</span>
                  {item.isAi && (
                    <span className={`text-[10px] uppercase font-extrabold italic tracking-wider px-1.5 py-0.5 rounded shadow-3xs transition-transform duration-200 ${
                      active
                        ? 'bg-cyan-200/80 dark:bg-cyan-900 text-cyan-900 dark:text-cyan-200 scale-105'
                        : 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/70'
                    }`}>
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Quick Theme Toggle, Theme Customizer Panel, Language Toggle, Emergency & Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick 1-Click Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              id="theme-toggle-btn"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={themeTooltip}
              className="inline-flex items-center justify-center p-2 border border-slate-200/90 dark:border-slate-700 shadow-2xs text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500/60 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none cursor-pointer active:scale-95"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-600 transition-transform duration-300 hover:-rotate-12 shrink-0" />
              )}
            </button>

            {/* Theme & Accent Customizer Dropdown Trigger */}
            <div className="relative" ref={themePanelRef}>
              <button
                type="button"
                onClick={() => setThemePanelOpen(prev => !prev)}
                id="theme-customizer-btn"
                aria-expanded={themePanelOpen}
                aria-haspopup="dialog"
                aria-label={isUrdu ? 'تھیم اور رنگ تبدیل کریں' : 'Customize website theme and accent color'}
                title={isUrdu ? 'تھیم اور ایکسینٹ کلر کسٹمائزر' : 'Theme & Accent Color Customizer'}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border border-slate-200/90 dark:border-slate-700 shadow-2xs text-xs sm:text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500/60 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none cursor-pointer active:scale-95"
              >
                <Palette className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="hidden sm:inline">{isUrdu ? 'تھیم' : 'Theme'}</span>
                <span
                  className="w-3 h-3 rounded-full border border-white dark:border-slate-900 shadow-2xs shrink-0"
                  style={{ backgroundColor: activeAccentHex }}
                  aria-hidden="true"
                />
              </button>

              {/* Compact Theme Customizer Panel */}
              {themePanelOpen && (
                <div
                  role="dialog"
                  aria-label={isUrdu ? 'تھیم کسٹمائزر پینل' : 'Theme Customization Panel'}
                  id="theme-customizer-panel"
                  className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-4 sm:p-5 z-50 space-y-4 animate-scale-in"
                >
                  {/* Panel Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <span>{isUrdu ? 'تھیم اور رنگ کی ترتیبات' : 'Appearance & Accent Theme'}</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {isUrdu
                          ? 'لائٹ/ڈارک موڈ اور ایکسینٹ رنگ آزادانہ منتخب کریں'
                          : 'Independently customize light/dark mode & accent color'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setThemePanelOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      aria-label="Close theme customizer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 1. Appearance Mode Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
                      {isUrdu ? 'ظاہری موڈ (Appearance Mode)' : '1. Appearance Mode'}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/70 dark:border-slate-700">
                      {appearanceOptions.map(opt => {
                        const isSelected = appearance === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            id={`appearance-mode-${opt.id}`}
                            onClick={() => setAppearance(opt.id)}
                            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-300 shadow-xs border border-slate-200/80 dark:border-slate-700'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {opt.icon}
                            <span>{isUrdu ? opt.labelUr : opt.labelEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Accent Color Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                        {isUrdu ? 'ایکسینٹ کلر (Accent Color)' : '2. Brand Accent Color'}
                      </label>
                      <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300">
                        {accent === 'custom'
                          ? `Custom (${customColor.toUpperCase()})`
                          : ACCENT_OPTIONS.find(a => a.id === accent)?.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {ACCENT_OPTIONS.map(option => {
                        const isSelected = accent === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            id={`accent-color-${option.id}`}
                            onClick={() => setAccent(option.id)}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/60 text-slate-900 dark:text-white ring-1 ring-cyan-500'
                                : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span
                                className="w-4 h-4 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-2xs"
                                style={{ backgroundColor: option.previewHex }}
                              />
                              <span className="truncate">{isUrdu ? option.nameUr : option.name}</span>
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />}
                          </button>
                        );
                      })}

                      {/* Custom Color Picker Option */}
                      <label
                        htmlFor="custom-accent-color-input"
                        className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          accent === 'custom'
                            ? 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/60 text-slate-900 dark:text-white ring-1 ring-cyan-500'
                            : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <input
                            id="custom-accent-color-input"
                            type="color"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="w-4 h-4 rounded-full border-0 p-0 bg-transparent cursor-pointer shrink-0"
                            aria-label="Choose custom accent color"
                          />
                          <span className="truncate">{isUrdu ? 'اپنا رنگ' : 'Custom Color'}</span>
                        </span>
                        {accent === 'custom' && <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />}
                      </label>
                    </div>
                  </div>

                  {/* Active Combination Preview & Reset */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {isDark ? '🌙 Dark' : '☀️ Light'} +{' '}
                      <strong className="text-cyan-600 dark:text-cyan-400">
                        {accent === 'custom' ? customColor : ACCENT_OPTIONS.find(a => a.id === accent)?.name}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={resetThemeCustomization}
                      id="reset-theme-btn"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{isUrdu ? 'ری سیٹ' : 'Reset'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Button */}
            <div className="relative inline-block text-left">
              <button
                type="button"
                onClick={() => onToggleLanguage(isUrdu ? 'en' : 'ur')}
                id="language-toggle-btn"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border border-slate-200/90 dark:border-slate-700 shadow-2xs text-xs sm:text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none cursor-pointer"
                title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
              >
                <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>{isUrdu ? 'اردو' : 'English'}</span>
                <span className="hidden md:inline text-xs text-slate-400 dark:text-slate-400 font-normal">
                  {isUrdu ? '(EN)' : '(اردو)'}
                </span>
              </button>
            </div>

            {/* Emergency Hotline Button */}
            <button
              onClick={() => handleNavClick('emergency')}
              id="header-rescue-1122-btn"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 hover:border-red-300 dark:hover:border-red-700 text-xs font-bold rounded-lg border border-red-200/90 dark:border-red-800/80 shadow-2xs transition-all focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>Rescue 1122</span>
            </button>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fade-in">
          {/* Mobile Quick Appearance + Accent Bar */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                {isUrdu ? 'تھیم اور رنگ' : 'Theme & Accent'}
              </span>
              <div className="flex items-center gap-1">
                {appearanceOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAppearance(opt.id)}
                    className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer ${
                      appearance === opt.id
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {opt.icon}
                    <span>{isUrdu ? opt.labelUr : opt.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {ACCENT_OPTIONS.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAccent(option.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 border cursor-pointer ${
                    accent === option.id
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950 text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: option.previewHex }} />
                  <span>{option.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map(item => {
              const active = currentTab === item.id ||
                (item.id === 'symptom-checker' && currentTab === 'symptoms') ||
                (item.id === 'report-analyzer' && currentTab === 'reports');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    active 
                      ? 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 font-bold border border-cyan-200/70 dark:border-cyan-800/80' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <span>{isUrdu ? item.labelUr : item.labelEn}</span>
                  {item.isAi ? (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-900/80 text-cyan-800 dark:text-cyan-200">
                      AI
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/70">
                      {isUrdu ? 'آزاد' : 'Independent'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
