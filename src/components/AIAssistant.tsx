import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Stethoscope, Send, RefreshCw, AlertTriangle, FileText, Sparkles, 
  ArrowRight, CheckCircle2, User, Bot, ShieldCheck, Square, RotateCcw, Zap 
} from 'lucide-react';
import { ChatMessage, Language, NavTab } from '../types';

interface AIAssistantProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ language, onNavigate }) => {
  const isUrdu = language === 'ur';

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: isUrdu
        ? 'خوش آمدید! میں میڈی نووا اے آئی ہیلتھ اسسٹنٹ ہوں۔ آپ مجھ سے کسی بیماری، علامات، ادویات، لیب ٹیسٹ یا عمومی صحت کے بارے میں کوئی بھی سوال پوچھ سکتے ہیں۔'
        : 'Welcome! I am Medi Nova AI Health Assistant. You can ask me any question about symptoms, medications, diagnostic tests, nutrition, or everyday health.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Streaming states
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [streamingEmergency, setStreamingEmergency] = useState(false);
  const [firstTokenLatency, setFirstTokenLatency] = useState<number | null>(null);
  const [totalStreamDuration, setTotalStreamDuration] = useState<number | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');

  // Refs for cancellation and auto-scroll
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef<boolean>(true);

  // Check for emergency keywords in English, Urdu, or Roman Urdu
  const checkEmergencyPhrases = useCallback((text: string): boolean => {
    const t = text.toLowerCase();
    const emergencyTerms = [
      'chest pain', 'heart attack', 'cannot breathe', "can't breathe", 'shortness of breath',
      'severe bleeding', 'unconscious', 'fainted', 'stroke', 'face drooping',
      'dil ka daura', 'saans nahi aa rahi', 'khoon nikal raha hai', 'behosh', 'chati me dard',
      'چھاتی میں درد', 'سانس بند', 'بے ہوش', 'دل کا دورہ', 'خون بہہ رہا ہے'
    ];
    return emergencyTerms.some(term => t.includes(term));
  }, []);

  // Track if user is scrolled near bottom
  useEffect(() => {
    const handleWindowScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 180;
      isNearBottomRef.current = scrollPosition >= threshold;
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  // Auto-scroll when new tokens arrive (only if already near bottom)
  const scrollToBottomIfNear = useCallback((smooth = false) => {
    if (isNearBottomRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottomIfNear(false);
  }, [streamedText, isThinking, scrollToBottomIfNear]);

  // Clean up in-flight requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Stop current streaming generation
  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    // If an existing stream is running, cleanly abort it before starting new request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMsgId = Date.now().toString();
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Immediately show user message & clear input
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLastQuery(query);
    setErrorState(null);
    setIsStreaming(true);
    setIsThinking(true);
    setStreamedText('');
    setFirstTokenLatency(null);
    setTotalStreamDuration(null);

    const isEmergency = checkEmergencyPhrases(query);
    setStreamingEmergency(isEmergency);

    const startTime = Date.now();
    let accumulatedText = '';
    let receivedFirstChunk = false;

    // Ensure view scrolls to show newly added user message
    isNearBottomRef.current = true;
    setTimeout(() => scrollToBottomIfNear(true), 60);

    try {
      // Connect to the high-speed SSE streaming endpoint
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          history: messages.map(m => ({ id: m.id, role: m.role, text: m.text }))
        }),
        signal: controller.signal
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let streamBuffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split('\n');
        streamBuffer = lines.pop() || ''; // retain incomplete line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;

          const dataPayload = trimmed.slice(6).trim();
          if (!dataPayload) continue;

          try {
            const parsed = JSON.parse(dataPayload);
            if (parsed.type === 'chunk' && typeof parsed.text === 'string') {
              if (!receivedFirstChunk) {
                receivedFirstChunk = true;
                const ttft = Date.now() - startTime;
                setFirstTokenLatency(ttft);
                setIsThinking(false);
              }
              accumulatedText += parsed.text;
              setStreamedText(accumulatedText);
            } else if (parsed.type === 'done') {
              // Generation completed successfully
            } else if (parsed.type === 'error') {
              throw new Error(parsed.error || 'Server stream issue');
            }
          } catch (e: any) {
            if (e.message !== 'Unexpected end of JSON input') {
              console.debug('SSE parse notice:', e);
            }
          }
        }
      }

      const duration = Date.now() - startTime;
      setTotalStreamDuration(duration);

      // Finalize the streamed response into the persistent message log
      const finalReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: accumulatedText.trim() || (isUrdu ? 'آپ کے سوال کا جائزہ لے لیا گیا ہے۔' : 'Your inquiry has been reviewed.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergencyAlert: isEmergency,
        latencyMs: duration
      };

      setMessages(prev => [...prev, finalReply]);
      setStreamedText('');
    } catch (err: any) {
      const isAbort = err.name === 'AbortError';

      if (isAbort) {
        // User deliberately clicked Stop Generating
        if (accumulatedText.trim()) {
          const interruptedReply: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            text: accumulatedText.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isEmergencyAlert: isEmergency,
            isInterrupted: true,
            latencyMs: Date.now() - startTime
          };
          setMessages(prev => [...prev, interruptedReply]);
        }
      } else {
        console.warn('Chat stream network notice, applying resilient safety guidance:', err);
        setErrorState(err.message || 'Connection interrupted');

        // Immediate resilient clinical guidance so the user is never left without safety advice
        const fallbackReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: isUrdu
            ? `### میڈی نووا اے آئی طبی جائزہ
آپ کے سوال کا شکریہ۔ برائے مہربانی درج ذیل عمومی طبی رہنما اصولوں پر عمل کریں:
1. **طبی نگہداشت:** پانی اور مائعات کا وافر استعمال رکھیں اور علامات کا بغور مشاہدہ کریں۔
2. **ڈاکٹر سے رابطہ:** اگر بخار، شدید درد یا سانس کی تنگی ہو تو قریبی کلینک یا ہسپتال رجوع کریں۔
3. **ہنگامی صورتحال:** فوری **ریسکیو 1122** پر کال کریں۔`
            : `### Medi Nova AI Clinical Guidance
Thank you for your inquiry. Here is evidence-based clinical guidance:
1. **Supportive Care**: Maintain proper hydration, rest, and monitor your symptoms closely.
2. **Medication & Tests**: You can review our Pakistan Medicine Guide and Diagnostic Test Guide for common indications and reference ranges.
3. **Medical Follow-up**: If symptoms are persistent, worsening, or severe, consult a licensed physician. In case of acute medical distress, dial **Rescue 1122** immediately.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEmergencyAlert: isEmergency,
          latencyMs: Date.now() - startTime
        };

        setMessages(prev => [...prev, fallbackReply]);
      }
      setStreamedText('');
    } finally {
      setIsStreaming(false);
      setIsThinking(false);
      abortControllerRef.current = null;
    }
  };

  const renderFormattedContent = (content: string) => {
    // Render markdown headings, bold text, and bullet lists cleanly
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-bold text-slate-900 dark:text-white text-sm mt-3 mb-1.5">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('#### ')) {
        return <h5 key={idx} className="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-2 mb-1">{line.replace('#### ', '')}</h5>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-slate-700 dark:text-slate-300 my-0.5 leading-relaxed">
            {formatBold(line.substring(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 my-1 leading-relaxed pl-1">
            {formatBold(line)}
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed my-1">
          {formatBold(line)}
        </p>
      );
    });
  };

  const formatBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" ref={chatContainerRef}>
      
      {/* Active AI Status Banner */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/60 dark:to-blue-950/50 border border-cyan-200/90 dark:border-cyan-800/70 rounded-2xl p-4 flex items-center justify-between text-xs text-cyan-900 dark:text-cyan-200 shadow-2xs animate-fade-in-up">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 animate-pulse-subtle" />
          <span className="font-extrabold">
            {isUrdu ? (
              <>میڈی نووا <span className="font-black italic text-cyan-700 dark:text-cyan-400">اے آئی</span> فعال ہے:</>
            ) : (
              <>Medi Nova <span className="font-black italic text-cyan-700 dark:text-cyan-400">AI</span> High-Speed Stream Active:</>
            )}
          </span>
          <span className="hidden sm:inline text-slate-700 dark:text-slate-300 font-medium">
            {isUrdu ? 'ریئل ٹائم اسٹریمنگ اور فوری طبی رہنمائی کے لیے تیار ہے۔' : 'Sub-second streaming clinical assistant ready for your health inquiries.'}
          </span>
        </div>
        <button
          onClick={() => onNavigate('finder')}
          className="text-cyan-700 dark:text-cyan-400 font-extrabold hover:underline shrink-0 ml-2 hover:translate-x-0.5 transition-transform cursor-pointer"
        >
          {isUrdu ? 'ہسپتال تلاش کریں →' : 'Find Care →'}
        </button>
      </div>

      {/* Hero Intro Header */}
      <div className="text-center py-2 space-y-2 animate-fade-in-up animation-delay-100">
        <div className="w-14 h-14 rounded-full bg-cyan-600 text-white flex items-center justify-center mx-auto shadow-md animate-float">
          <Stethoscope className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isUrdu ? (
            <>آج میڈی نووا <span className="font-black italic text-cyan-600 dark:text-cyan-400">اے آئی</span> آپ کی کیا مدد کر سکتا ہے؟</>
          ) : (
            <>How can Medi Nova <span className="font-black italic text-cyan-600 dark:text-cyan-400">AI</span> help you today?</>
          )}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm max-w-md mx-auto">
          {isUrdu
            ? 'کسی بیماری، ٹیسٹ، دوا، علامات یا ہسپتال تلاش کرنے کے بارے میں دریافت کریں۔'
            : 'Ask about a condition, a test, a medicine, your symptoms, or finding care.'}
        </p>
      </div>

      {/* Emergency & Disclaimer card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4 animate-fade-in-up animation-delay-200 transition-all hover:shadow-md">
        <div className="p-4 rounded-xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/70 space-y-1.5">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-extrabold text-sm">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{isUrdu ? 'پیشہ ورانہ طبی امداد کب حاصل کریں' : 'When to seek professional care'}</span>
          </div>
          <p className="text-xs sm:text-sm text-blue-950 dark:text-blue-100 font-medium leading-relaxed">
            {isUrdu
              ? <>براہ کرم فوری طور پر پیشہ ورانہ طبی مدد حاصل کریں۔ اگر یہ کوئی ہنگامی صورتحال ہے تو فوری ریسکیو <span className="font-black italic">1122</span> (پاکستان) پر کال کریں یا قریبی ایمرجنسی وارڈ میں جائیں۔</>
              : <>Please prioritise getting professional medical help now. If this may be an emergency, call Rescue <span className="font-black italic">1122</span> (Pakistan) or go to the nearest emergency department.</>}
          </p>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-center sm:text-left">
          {isUrdu
            ? 'یہ صرف عمومی طبی معلومات کے لیے ہے، یہ پیشہ ورانہ تشخیص یا علاج نہیں ہے۔ برائے مہربانی مستند ڈاکٹر سے مشورہ کریں۔'
            : 'This is general health information, not medical advice, diagnosis or treatment. Please consult a qualified healthcare professional.'}
        </p>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-4 pt-2">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end items-start gap-2.5 animate-fade-in-up">
                <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-xs text-sm max-w-md shadow-xs leading-relaxed font-semibold">
                  {msg.text}
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5 shadow-3xs">
                  <User className="w-4 h-4" />
                </div>
              </div>
            );
          }

          // Emergency Alert message
          if (msg.isEmergencyAlert) {
            return (
              <div key={msg.id} className="flex justify-start items-start gap-2.5 animate-fade-in-up">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 flex items-center justify-center shrink-0 mt-0.5 shadow-3xs">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="p-5 rounded-2xl rounded-tl-xs bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 text-red-950 dark:text-red-100 max-w-xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-red-900 dark:text-red-200 font-extrabold text-sm">
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse-subtle" />
                      <span>{isUrdu ? 'فوری ایمرجنسی انتباہ' : 'Emergency Attention Advised'}</span>
                    </div>
                    {msg.latencyMs && (
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-md flex items-center gap-1 border border-red-100 dark:border-red-800">
                        <Zap className="w-2.5 h-2.5 text-amber-500" />
                        {(msg.latencyMs / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                  <div>
                    {renderFormattedContent(msg.text)}
                  </div>
                  {msg.isInterrupted && (
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 italic bg-white/60 dark:bg-slate-900/60 px-2 py-1 rounded">
                      {isUrdu ? '(صارف کی طرف سے جواب روکا گیا)' : '(Response stopped by user)'}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-red-200 dark:border-red-800/70">
                    <a
                      href="tel:1122"
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs active:scale-95 transition-all"
                    >
                      Call Rescue <span className="font-black italic">1122</span>
                    </a>
                    <button
                      onClick={() => onNavigate('finder')}
                      className="text-xs font-bold text-red-800 dark:text-red-300 hover:underline cursor-pointer"
                    >
                      Find Emergency Hospital →
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // Normal assistant answer
          return (
            <div key={msg.id} className="flex justify-start items-start gap-2.5 animate-fade-in-up">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 p-5 rounded-2xl rounded-tl-xs text-sm max-w-xl shadow-xs leading-relaxed space-y-2">
                <div>
                  {renderFormattedContent(msg.text)}
                </div>
                {msg.isInterrupted && (
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200/60 dark:border-slate-700">
                    {isUrdu ? '(صارف کی طرف سے جواب روکا گیا)' : '(Response stopped by user)'}
                  </div>
                )}
                {msg.latencyMs && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                      <Zap className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      {isUrdu ? `جواب کا دورانیہ: ${(msg.latencyMs / 1000).toFixed(1)} سیکنڈ` : `Response streamed in ${(msg.latencyMs / 1000).toFixed(1)}s`}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Active Streaming Message */}
        {isStreaming && (
          <div className="flex justify-start items-start gap-2.5 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>

            {isThinking ? (
              // Thinking phase: waiting for the first token
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-5 py-4 rounded-2xl rounded-tl-xs text-xs flex items-center gap-3 shadow-2xs">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-600 dark:text-cyan-400 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800 dark:text-slate-100">
                    {isUrdu ? 'میڈی نووا اے آئی طبی جائزہ لے رہا ہے...' : 'Medi Nova AI is analyzing clinical context...'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isUrdu ? 'پہلا جواب چند لمحوں میں تیار ہو رہا ہے' : 'Connecting to high-speed inference engine'}
                  </p>
                </div>
                <button
                  onClick={handleStopGenerating}
                  className="ml-auto px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors flex items-center gap-1"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Stop</span>
                </button>
              </div>
            ) : (
              // Progressive token streaming phase
              <div className={`p-5 rounded-2xl rounded-tl-xs text-sm max-w-xl shadow-xs leading-relaxed space-y-2 border ${
                streamingEmergency 
                  ? 'bg-red-50/80 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-950 dark:text-red-100' 
                  : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200'
              }`}>
                {/* Live stream speed banner & stop shortcut */}
                <div className="flex items-center justify-between pb-1 text-[11px] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 font-semibold text-cyan-700 dark:text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                    <span>Streaming live</span>
                    {firstTokenLatency && (
                      <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">
                        (first token: {(firstTokenLatency / 1000).toFixed(2)}s)
                      </span>
                    )}
                  </span>
                  <button
                    onClick={handleStopGenerating}
                    className="px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/70 rounded border border-rose-200 dark:border-rose-800 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Stop stream"
                  >
                    <Square className="w-2.5 h-2.5 fill-current" />
                    <span>Stop</span>
                  </button>
                </div>

                {/* Progressive content with active blinking cursor */}
                <div>
                  {renderFormattedContent(streamedText)}
                  <span className="inline-block w-1.5 h-4 bg-cyan-600 dark:bg-cyan-400 animate-pulse ml-0.5 align-middle rounded-xs" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Retry option if an error was encountered */}
        {errorState && !isStreaming && (
          <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{isUrdu ? 'کنکشن میں وقفہ آیا۔ آپ دوبارہ کوشش کر سکتے ہیں۔' : 'Network pause occurred. You can retry your request.'}</span>
            </div>
            {lastQuery && (
              <button
                onClick={() => handleSendMessage(lastQuery)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shrink-0 shadow-3xs cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isUrdu ? 'دوبارہ کوشش' : 'Retry'}</span>
              </button>
            )}
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Suggested Prompts for Quick Testing */}
      <div className="space-y-2 pt-2 animate-fade-in-up animation-delay-300">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          {isUrdu ? 'عام پوچھے جانے والے سوالات:' : 'Suggested questions to test:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            { en: 'What are some good foods to eat for heart health?', ur: 'دل کی صحت کے لیے بہترین غذائیں کون سی ہیں؟' },
            { en: 'How does Paracetamol (Panadol) work and what is the safe limit?', ur: 'پیناڈول (پیراسیٹامول) کیسے کام کرتی ہے اور محفوظ حد کیا ہے؟' },
            { en: 'What does elevated WBC count mean on a CBC blood test?', ur: 'سی بی سی بلڈ ٹیسٹ میں سفید خلیات زیادہ ہونے کا کیا مطلب ہے؟' },
            { en: 'What are the main symptoms of Dengue fever in Pakistan?', ur: 'پاکستان میں ڈینگی بخار کی بنیادی علامات کیا ہیں؟' }
          ].map((sugg, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(isUrdu ? sugg.ur : sugg.en)}
              disabled={isStreaming}
              className="p-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs text-left text-slate-800 dark:text-slate-200 font-semibold transition-all duration-200 flex items-center justify-between group shadow-3xs hover:shadow-xs hover:border-cyan-300 dark:hover:border-cyan-600 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <span className="line-clamp-1">{isUrdu ? sugg.ur : sugg.en}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Message Input Box & Stop/Send Controls */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-2 focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:border-cyan-500 transition-all">
        <input
          type="text"
          id="assistant-chat-input"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isStreaming) {
              handleSendMessage();
            } else if (e.key === 'Escape' && isStreaming) {
              handleStopGenerating();
            }
          }}
          placeholder={isUrdu ? 'علامات، ادویات، ٹیسٹ یا صحت کے بارے میں کوئی بھی سوال پوچھیں...' : 'Ask anything about symptoms, medicines, tests, nutrition, or care...'}
          className="flex-1 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 bg-transparent focus:outline-none"
        />

        {/* Toggle between Send and Stop button */}
        {isStreaming ? (
          <button
            onClick={handleStopGenerating}
            id="assistant-stop-btn"
            className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all duration-200 shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Stop generation (Esc)"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Stop</span>
          </button>
        ) : (
          <button
            onClick={() => handleSendMessage()}
            id="assistant-send-btn"
            disabled={!inputQuery.trim()}
            className="p-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl disabled:opacity-40 transition-all duration-200 shadow-xs active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            title="Send message (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

