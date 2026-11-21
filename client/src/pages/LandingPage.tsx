import React from 'react';
import { 
  Sprout, 
  TrendingUp, 
  Scan, 
  CloudSun, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  MessageSquareText, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  Cpu, 
  MapPin,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface LandingPageProps {
  language: Language;
  setCurrentView: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ language, setCurrentView }) => {
  const text = t[language];

  const features = [
    {
      id: 'scanner',
      title: "AI Crop Health Scanner",
      titleTe: "AI పంట ఆరోగ్య స్కానర్",
      desc: "Instant leaf pathology detection via computer vision with bounding box symptom localization, severity scoring, and organic/chemical remedies.",
      descTe: "ఆకు ఫోటో తీసి అప్‌లోడ్ చేస్తే AI తెగులును గుర్తించి నివారణ మందులను సూచిస్తుంది.",
      icon: Scan,
      badge: "Vision AI",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: 'prices',
      title: "Live Market Prices",
      titleTe: "ప్రత్యక్ష మార్కెట్ ధరలు",
      desc: "Live APMC mandi prices directly verified from official Agmarknet & data.gov.in sources with modal, min, max prices and arrival volumes.",
      descTe: "భారత ప్రభుత్వం వారి Agmarknet నుండి ప్రతిరోజూ లైవ్ మార్కెట్ మరియు మోడల్ ధరల వివరాలు.",
      icon: DollarSign,
      badge: "Govt Verified",
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: 'trends',
      title: "Price Trends & Volatility",
      titleTe: "ధరల ట్రెండ్స్ & హెచ్చుతగ్గులు",
      desc: "Historical 7, 30, and 90-day time-series analysis showing precise price delta %, volatility index, and highest/lowest historical periods.",
      descTe: "గత 30 రోజుల్లో ధరల మార్పు శాతం, మార్కెట్ హెచ్చుతగ్గుల సమగ్ర చార్టులు.",
      icon: TrendingUp,
      badge: "Historical Analytics",
      color: "from-amber-500 to-orange-600"
    },
    {
      id: 'demand-supply',
      title: "Demand & Seasonal Analysis",
      titleTe: "డిమాండ్ & కాలానుగుణ విశ్లేషణ",
      desc: "Market arrival volume tracking vs consumption baselines with multi-year seasonal high/low patterns and market pressure signals.",
      descTe: "మార్కెట్లకు పంట రాక మరియు సంవత్సరంలో ఏ నెలల్లో గరిష్ట ధరలు ఉంటాయో విశ్లేషణ.",
      icon: BarChart3,
      badge: "Market Pressure",
      color: "from-purple-500 to-pink-600"
    },
    {
      id: 'buyers',
      title: "Nearby Buyers & Mandis",
      titleTe: "సమీప కొనుగోలుదారులు & మార్కెట్లు",
      desc: "GPS-driven discovery of verified APMC yards, NABARD-registered FPOs, and processing hubs with live distance calculation.",
      descTe: "మీ గ్రామానికి సమీపంలోని రిజిస్టర్డ్ మార్కెట్లు, FPOలు మరియు దూరం వివరాలు.",
      icon: Users,
      badge: "GPS Mapped",
      color: "from-emerald-600 to-green-700"
    },
    {
      id: 'weather',
      title: "Hyperlocal Weather Intelligence",
      titleTe: "హైపర్‌లోకల్ వాతావరణ సమాచారం",
      desc: "Open-Meteo high-resolution forecasts, rain probability, humidity, and physics-based crop warnings (heavy rain, heat stress, fungal risk).",
      descTe: "వర్షపాతం, ఉష్ణోగ్రత మరియు పంటకు వచ్చే వాతావరణ ప్రమాదాల ముందస్తు హెచ్చరికలు.",
      icon: CloudSun,
      badge: "Open-Meteo",
      color: "from-sky-500 to-blue-600"
    },
    {
      id: 'sell-smart',
      title: "Smart Selling Recommendation",
      titleTe: "స్మార్ట్ విక్రయ సిఫార్సు (SELL SMART)",
      desc: "Synthesizes price velocity, weather risk, transport haulage, and storage durability into an actionable verdict: SELL NOW, WAIT, or COMPARE.",
      descTe: "ధర, వాతావరణం మరియు రవాణా ఖర్చులను లెక్కించి ఎప్పుడు, ఎక్కడ అమ్మితే లాభమో చెప్పే AI వ్యవస్థ.",
      icon: ShieldCheck,
      badge: "Decision Engine",
      color: "from-rose-500 to-red-600"
    },
    {
      id: 'assistant',
      title: "Telugu AI Farmer Assistant",
      titleTe: "తెలుగు AI రైతు మిత్రుడు",
      desc: "Voice-friendly conversational assistant fluent in Telugu and English. Ask agronomy, mandi prices, or pest remedies in natural everyday language.",
      descTe: "మీ సందేహాలను తెలుగులో అడగండి, తక్షణమే సులభమైన వ్యవసాయ సలహాలు పొందండి.",
      icon: MessageSquareText,
      badge: "Voice & Telugu",
      color: "from-teal-500 to-emerald-700"
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 mt-4 shadow-2xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide backdrop-blur-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>BlindSpot Agri • Precision Agricultural Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            {language === 'te' ? text.heroTitle : (
              <>
                See the problem. Predict the market. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-300">
                  Sell smarter.
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {language === 'te' ? text.heroSubtitle : (
              "AI-powered intelligence for every stage of farming. Real APMC market data, computer vision leaf pathology, hyperlocal weather alerts, and net-profit buyer discovery — zero invented numbers."
            )}
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentView('onboarding')}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>{text.getStarted}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('prices')}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base border border-slate-700 transition flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>{text.exploreMarket}</span>
            </button>

            <button
              onClick={() => setCurrentView('scanner')}
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 font-semibold text-sm sm:text-base border border-emerald-500/30 transition flex items-center gap-2"
            >
              <Scan className="w-4 h-4" />
              <span>{text.scanCrop}</span>
            </button>

            <button
              onClick={() => setCurrentView('features')}
              className="px-5 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-sm sm:text-base border border-emerald-500/50 transition flex items-center gap-2 shadow-sm"
              title="View all 18 dedicated separate feature pages"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>{language === 'te' ? "అన్ని 18 ప్రత్యేక పేజీలు" : "All 18 Feature Pages"}</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 text-left">
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <div className="text-xl sm:text-2xl font-black text-white">100%</div>
              <div className="text-[11px] text-slate-400">Verified Govt & Agmarknet Feeds</div>
            </div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">92%+</div>
              <div className="text-[11px] text-slate-400">Vision Pathology Confidence</div>
            </div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <div className="text-xl sm:text-2xl font-black text-teal-300">Telugu + EN</div>
              <div className="text-[11px] text-slate-400">Bilingual Voice & Text Assistant</div>
            </div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <div className="text-xl sm:text-2xl font-black text-amber-300">Net Return</div>
              <div className="text-[11px] text-slate-400">Deducts Haulage & Mandi Charges</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              {language === 'te' ? "ప్రత్యేక మాడ్యూల్స్" : "Dedicated Standalone Pages"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {language === 'te' ? "రైతుల కోసం సమగ్ర మేధస్సు మాడ్యూల్స్" : "Comprehensive Agricultural Intelligence"}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {language === 'te' 
                ? "ప్రతి ఫీచర్‌కు దాని సొంత ప్రత్యేకా పేజీ మరియు ప్రత్యక్ష డేటా కలదు. ఏదైనా కార్డు క్లిక్ చేసి ఆ పేజీని నేరుగా తెరవండి."
                : "Every feature operates on its own dedicated page with live verified APIs. Click any card below to launch that specific page."}
            </p>
          </div>

          <button
            onClick={() => setCurrentView('features')}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Layers className="w-4 h-4" />
            <span>{language === 'te' ? "అన్ని 18 ప్రత్యేక పేజీల జాబితా" : "View All 18 Pages Catalog →"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => setCurrentView(feat.id)}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 block">
                        {feat.badge}
                      </span>
                      <span className="font-mono text-[9px] text-emerald-700 font-bold block mt-1">
                        /{feat.id}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition mb-2">
                    {language === 'te' ? feat.titleTe : feat.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'te' ? feat.descTe : feat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
                  <span>{language === 'te' ? "ఈ పేజీ తెరవండి" : "Open Dedicated Page"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Polish Flow Walkthrough Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800/40">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-4">
              Polished End-to-End User Flow
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
              {language === 'te' ? "టమాటా రైతు ఉదాహరణ: ఒకే ఒక్క క్లిక్‌తో సంపూర్ణ విశ్లేషణ" : "The Core Farmer Journey: From Field to Best Net Return"}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Farmer selects <strong className="text-emerald-300">Tomato</strong> → GPS automatically detects location → Live Open-Meteo telemetry checks rainfall & heat risk → Official Agmarknet modal prices load → 30-day historical trend analyzes price delta → Market arrivals compute supply pressure → Seasonal engine predicts monthly window → Nearby buyers ranked by net return → AI generates <strong className="text-white">“WHAT SHOULD I DO TODAY?”</strong>
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm shadow-md transition"
              >
                Launch Farmer Dashboard →
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition"
              >
                Open Admin Master Price Table
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
