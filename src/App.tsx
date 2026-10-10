import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeOverview } from './components/HomeOverview';
import { HealthcareFinder } from './components/HealthcareFinder';
import { MedicineGuide } from './components/MedicineGuide';
import { TestGuide } from './components/TestGuide';
import { HealthLibrary } from './components/HealthLibrary';
import { BodySystemExplorer } from './components/BodySystemExplorer';
import { AIAssistant } from './components/AIAssistant';
import { SymptomChecker } from './components/SymptomChecker';
import { ReportAnalyzer } from './components/ReportAnalyzer';
import { EmergencyContacts } from './components/EmergencyContacts';
import { ThemeProvider } from './context/ThemeContext';
import { NavTab, Language } from './types';
import { Stethoscope, ChevronUp } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [showBackToTop, setShowBackToTop] = useState(false);

  const isUrdu = language === 'ur';

  const handleTabChange = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Track scroll position for Back-To-Top button & scroll-triggered reveal
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

      // Trigger reveal for elements in viewport as user moves or scrolls down
      const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed), .reveal-on-scroll-scale:not(.is-revealed)');
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight * 0.92) {
          el.classList.add('is-revealed');
        }
      });
    };

    // Immediate check on mount & tab change
    handleScroll();
    const timer = setTimeout(handleScroll, 120);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentTab]);

  return (
    <ThemeProvider>
      <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-100 selection:text-cyan-900 dark:selection:bg-cyan-900 dark:selection:text-cyan-100 transition-colors duration-300 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
        
        {/* Universal Navigation Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={handleTabChange}
          language={language}
          onToggleLanguage={() => setLanguage(l => (l === 'en' ? 'ur' : 'en'))}
        />

        {/* Main Content Container with smooth section open animation */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 transition-all duration-300">
          <div key={currentTab} className="animate-section-open space-y-6">
            {currentTab === 'home' && (
              <HomeOverview
                language={language}
                onNavigate={handleTabChange}
              />
            )}

            {/* CATEGORY B: Works 100% WITHOUT OpenAI */}
            {currentTab === 'finder' && (
              <HealthcareFinder
                language={language}
              />
            )}

            {currentTab === 'medicines' && (
              <MedicineGuide
                language={language}
              />
            )}

            {currentTab === 'tests' && (
              <TestGuide
                language={language}
              />
            )}

            {currentTab === 'library' && (
              <HealthLibrary
                language={language}
              />
            )}

            {currentTab === 'body-systems' && (
              <BodySystemExplorer
                language={language}
              />
            )}

            {/* CATEGORY A: Explicit OpenAI credit dependency */}
            {currentTab === 'assistant' && (
              <AIAssistant
                language={language}
                onNavigate={handleTabChange}
              />
            )}

            {(currentTab === 'symptoms' || currentTab === 'symptom-checker') && (
              <SymptomChecker
                language={language}
                onNavigate={handleTabChange}
              />
            )}

            {(currentTab === 'reports' || currentTab === 'report-analyzer') && (
              <ReportAnalyzer
                language={language}
                onNavigate={handleTabChange}
              />
            )}

            {/* Emergency Helplines */}
            {currentTab === 'emergency' && (
              <EmergencyContacts
                language={language}
                onNavigate={handleTabChange}
              />
            )}
          </div>
        </main>

        {/* Floating Back to Top Button - Appears when scrolling down */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={isUrdu ? 'اوپر جائیں' : 'Scroll to top'}
            className="fixed bottom-6 right-6 z-50 p-3.5 bg-slate-900/90 dark:bg-cyan-600/95 hover:bg-black dark:hover:bg-cyan-500 text-white rounded-2xl shadow-lg border border-slate-700/80 dark:border-cyan-400/40 backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in-up cursor-pointer flex items-center justify-center group"
            title={isUrdu ? 'اوپر جائیں' : 'Scroll to top'}
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-200" />
          </button>
        )}

        {/* Global Architectural & Medical Footer */}
        <footer className="border-t border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16 py-12 shadow-xs animate-fade-in transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10">
              
              {/* Column 1: Brand & Purpose */}
              <div className="space-y-4 md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white flex items-center justify-center font-bold shadow-xs transition-transform duration-300 hover:scale-105">
                    <Stethoscope className="w-5 h-5 animate-pulse-subtle" />
                  </div>
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight">
                      Medi Nova <span className="font-black italic text-cyan-600 dark:text-cyan-400">AI</span>
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/80 shadow-3xs">
                      Decoupled Architecture
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-lg">
                  {isUrdu
                    ? <>میڈی نووا <span className="font-black italic">اے آئی</span> — پاکستان میں مریضوں اور عوام کے لیے مستند طبی معلومات اور <span className="font-bold italic">اوپن اسٹریٹ میپ</span> پر ہسپتال تلاش کرنے کا آزادانہ پلیٹ فارم۔</>
                    : <>Medi Nova <span className="font-black italic">AI</span> is an independent health navigation tool designed to assist patients in Pakistan with open geospatial healthcare maps, verified local medicine details, and diagnostic guides.</>}
                </p>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Data sources: <span className="font-semibold italic">OpenStreetMap</span> contributors, <span className="font-semibold italic">Overpass API</span>, <span className="font-semibold italic">Nominatim</span> Geocoding, Drug Regulatory guidelines.
                </div>
              </div>

              {/* Column 2: Category B (Free/Active) */}
              <div className="space-y-3">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Independent Features (Zero <span className="font-bold italic text-cyan-700 dark:text-cyan-400">OpenAI</span>)
                </h5>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  <li>
                    <button onClick={() => setCurrentTab('finder')} className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline transition-all duration-200 text-left cursor-pointer hover:translate-x-0.5">
                      • Healthcare Finder (<span className="font-bold italic">OpenStreetMap</span>)
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCurrentTab('medicines')} className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline transition-all duration-200 text-left cursor-pointer hover:translate-x-0.5">
                      • Pakistan Medicine Guide
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCurrentTab('tests')} className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline transition-all duration-200 text-left cursor-pointer hover:translate-x-0.5">
                      • Diagnostic Test Guide
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCurrentTab('library')} className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline transition-all duration-200 text-left cursor-pointer hover:translate-x-0.5">
                      • Public Health Library
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCurrentTab('body-systems')} className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline transition-all duration-200 text-left cursor-pointer hover:translate-x-0.5">
                      • Body System Explorer
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 3: Category A & Emergency */}
              <div className="space-y-3">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Emergency &amp; <span className="font-extrabold italic text-cyan-600 dark:text-cyan-400">AI</span>
                </h5>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  <li>
                    <a href="tel:1122" className="text-red-600 dark:text-red-400 font-bold hover:underline transition-all duration-200 flex items-center gap-1 hover:translate-x-0.5 cursor-pointer">
                      • Rescue <span className="font-black italic">1122</span> Helpline
                    </a>
                  </li>
                  <li>
                    <a href="tel:115" className="text-amber-700 dark:text-amber-400 font-bold hover:underline transition-all duration-200 flex items-center gap-1 hover:translate-x-0.5 cursor-pointer">
                      • Edhi Ambulance <span className="font-black italic">115</span>
                    </a>
                  </li>
                  <li>
                    <button onClick={() => setCurrentTab('assistant')} className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline transition-all duration-200 text-left cursor-pointer hover:translate-x-0.5">
                      • <span className="font-bold italic">AI</span> Health Assistant
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCurrentTab('symptoms')} className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline transition-all duration-200 text-left cursor-pointer hover:translate-x-0.5">
                      • Symptom Assessment
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCurrentTab('reports')} className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline transition-all duration-200 text-left cursor-pointer hover:translate-x-0.5">
                      • Lab Report Analyzer
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Medical Disclaimer Banner */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-4">
              <p className="text-center sm:text-left font-medium leading-relaxed max-w-3xl">
                <strong className="text-slate-800 dark:text-slate-200 font-bold">Medical Disclaimer:</strong> This application is for educational and navigation purposes only. It is not a diagnostic device and does not prescribe medication or substitute for professional clinical judgment. Always consult a licensed doctor.
              </p>
              <div className="shrink-0 flex items-center gap-4 text-slate-500 dark:text-slate-400 font-semibold">
                <span>&copy; {new Date().getFullYear()} Medi Nova <span className="font-extrabold italic text-cyan-600 dark:text-cyan-400">AI</span></span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
