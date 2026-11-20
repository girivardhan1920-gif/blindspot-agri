import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquareText, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User, 
  Bot, 
  RefreshCw,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import { askAssistant } from '../api/client';

interface AiAssistantPageProps {
  language: Language;
  crop: string;
  latitude: number;
  longitude: number;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantPage: React.FC<AiAssistantPageProps> = ({
  language,
  crop,
  latitude,
  longitude
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: language === 'te'
        ? `నమస్కారం! నేను మీ బ్లైండ్‌స్పాట్ అగ్రి AI సహాయకుడిని. మీ ${crop} పంట ధరలు, సమీప మార్కెట్లలో నికర లాభం, తెగుళ్ల నివారణ లేదా వాతావరణం గురించి నన్ను అడగవచ్చు.`
        : `Hello! I am your BlindSpot Agri AI Assistant. Ask me about ${crop} mandi prices, buyer net returns, weather warnings, or pest remedies in Telugu or English!`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const text = t[language];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = language === 'te' ? [
    "నా టమాటా పంటను ఇప్పుడు అమ్మాలా?",
    "నేటి మార్కెట్ ధర ఎంత?",
    "రాబోయే 2 రోజుల్లో వర్షం పడుతుందా?",
    "ఆకుమచ్చ తెగులు నివారణ ఏమిటి?",
    "బోయిన్‌పల్లి మార్కెట్‌కు రవాణా ఖర్చు ఎంత?"
  ] : [
    "Should I sell my tomato crop now or hold?",
    "What is today's modal price for my crop?",
    "Is rain forecasted in the next 48 hours?",
    "What spray should I use for leaf spots?",
    "Which nearby buyer offers the highest net return?"
  ];

  const handleSend = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await askAssistant({
        query: q,
        language: language,
        crop,
        lat: latitude,
        lon: longitude
      });

      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: res.reply || "Sorry, I could not process your query right now.",
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, assistantMsg]);
      // Auto-read aloud if speech synthesis is supported
      speakText(assistantMsg.text, assistantMsg.id);
    } catch (err) {
      console.warn("Assistant query error:", err);
      setMessages(prev => [...prev, {
        id: `asst-err-${Date.now()}`,
        sender: 'assistant',
        text: language === 'te' 
          ? "సమాధానం పొందడంలో సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి." 
          : "Unable to retrieve response. Please check your connection and try again.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Text-to-Speech (TTS)
  const speakText = (content: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (speakingId === msgId) {
      setSpeakingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(content);
    // If text contains Telugu characters
    if (/[\u0C00-\u0C7F]/.test(content)) {
      utterance.lang = 'te-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Speech-to-Text (STT) Microphone
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Voice & Text Agro-Advisory Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? "తెలుగు AI రైతు సహాయకుడు" : "Telugu & English AI Farmer Assistant"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Conversational assistance for APMC mandi rates, disease identification, and selling decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            {language === 'te' ? "భాష: తెలుగు (Telugu)" : "Language: English"}
          </span>
        </div>
      </div>

      {/* Chat Messages Frame */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                  isUser ? 'bg-slate-800' : 'bg-teal-600'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>

                  <div className={`flex items-center gap-2 text-[10px] text-slate-400 ${isUser ? 'justify-end' : ''}`}>
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className="text-teal-600 hover:text-teal-700 flex items-center gap-0.5"
                        title="Read aloud"
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3 h-3 text-rose-500 animate-pulse" />
                            <span className="text-rose-500 font-bold">Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span>AI analyzing live agricultural data...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">
            Suggested:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-xs whitespace-nowrap transition border border-slate-200"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition ${
              isListening 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="Speak using Microphone (Web Speech)"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder={language === 'te' ? "మీ ప్రశ్నను ఇక్కడ అడగండి (ఉదా: నా టమాటా పంటను ఇప్పుడు అమ్మాలా?)..." : "Type your question here..."}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || loading}
            className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
