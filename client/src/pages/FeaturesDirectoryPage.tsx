import React, { useState } from 'react';
import { 
  Scan, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Lightbulb, 
  Users, 
  ShieldCheck, 
  CloudSun, 
  MessageSquareText, 
  Database, 
  Sprout, 
  AlertTriangle, 
  FileText, 
  Compass, 
  UserCheck, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  Sparkles,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';

interface FeaturesDirectoryPageProps {
  language: Language;
  setCurrentView: (view: string) => void;
}

export const FeaturesDirectoryPage: React.FC<FeaturesDirectoryPageProps> = ({ language, setCurrentView }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const features = [
    {
      id: 'scanner',
      path: '/scanner',
      category: 'ai',
      categoryName: 'AI & Diagnostics',
      categoryNameTe: 'AI & పంట రక్షణ',
      title: 'AI Crop Health Scanner & Spray Guide',
      titleTe: 'AI పంట ఆరోగ్య స్కానర్ & స్ప్రే గైడ్',
      desc: 'Multimodal vision model diagnosing leaf disease lesions with bounding boxes, 16-liter knapsack spray pump dosages, and commercial market brand remedies.',
      descTe: 'ఆకు ఫోటో తీస్తే AI తెగులును గుర్తించి, షాపులో దొరికే మందుల పేర్లు మరియు 16 లీటర్ల పంపు మోతాదును తెలియజేస్తుంది.',
      icon: Scan,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Google Gemini Vision + Agronomy Engine',
      points: [
        'Visible abnormality bounding box highlighting',
        'Exact dosage per 16L spray pump (e.g. 40g / 2 matchboxes)',
        'Direct WhatsApp sharing to local fertilizer shop'
      ]
    },
    {
      id: 'prices',
      path: '/prices',
      category: 'market',
      categoryName: 'Market Intelligence',
      categoryNameTe: 'మార్కెట్ విశ్లేషణ',
      title: 'Live Mandi Market Prices',
      titleTe: 'ప్రత్యక్ష మార్కెట్ ధరలు (Mandi Prices)',
      desc: 'Real-time verified APMC mandi prices directly synchronized from official Agmarknet & data.gov.in databases across Indian states.',
      descTe: 'భారత ప్రభుత్వ Agmarknet నుండి ధృవీకరించబడిన లైవ్ మార్కెట్, కనిష్ట, గరిష్ట మరియు మోడల్ ధరల సమగ్ర సమాచారం.',
      icon: DollarSign,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Agmarknet / DMI Official Data',
      points: [
        'Modal, Minimum & Maximum price per Quintal',
        'State, District, Mandi, and Crop filters',
        'Official timestamp & provenance verification'
      ]
    },
    {
      id: 'trends',
      path: '/trends',
      category: 'market',
      categoryName: 'Market Intelligence',
      categoryNameTe: 'మార్కెట్ విశ్లేషణ',
      title: 'Price Trends & Volatility Analytics',
      titleTe: 'ధరల ట్రెండ్స్ & హెచ్చుతగ్గులు (Price Trends)',
      desc: 'Historical 7, 30, and 90-day time-series analytics calculating precise percentage delta, volatility indices, and all-time highs/lows.',
      descTe: 'గత 7, 30, 90 రోజుల్లో ధరల హెచ్చుతగ్గుల చార్టులు, మార్పు శాతం మరియు గరిష్ట/కనిష్ట విశ్లేషణ.',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
      badge: 'Historical Time-Series ML',
      points: [
        'Interactive Recharts time-series visualization',
        'Volatility assessment (Low / Moderate / High)',
        'Price delta % computed from verified historical data'
      ]
    },
    {
      id: 'demand-supply',
      path: '/demand-supply',
      category: 'market',
      categoryName: 'Market Intelligence',
      categoryNameTe: 'మార్కెట్ విశ్లేషణ',
      title: 'Demand & Supply Intelligence Layer',
      titleTe: 'డిమాండ్ & సరఫరా విశ్లేషణ (Demand & Supply)',
      desc: 'Tracks daily market arrival volumes against historical consumption to generate demand levels, supply levels, and upward/downward pressure signals.',
      descTe: 'మార్కెట్లకు పంట రాక (Arrivals) పరిమాణాన్ని బట్టి డిమాండ్, సరఫరా మరియు ధరల ఒత్తిడిని విశ్లేషిస్తుంది.',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-600',
      badge: 'Arrivals & Elasticity Model',
      points: [
        'Arrival volumes in Metric Tonnes',
        'Market pressure gauge (UPWARD / STABLE / DOWNWARD)',
        'Clear economic reasoning for market direction'
      ]
    },
    {
      id: 'seasonal',
      path: '/seasonal',
      category: 'market',
      categoryName: 'Market Intelligence',
      categoryNameTe: 'మార్కెట్ విశ్లేషణ',
      title: 'Seasonal Pattern & Monthly Cycle Engine',
      titleTe: 'కాలానుగుణ ధరల నమూనాలు (Seasonal Patterns)',
      desc: 'Multi-year calendar month price cycle analyzer highlighting historical peak months, off-season windows, and harvest dip periods.',
      descTe: 'సంవత్సరంలో ఏ నెలల్లో గరిష్ట ధరలు ఉంటాయో, ఏ నెలల్లో మార్కెట్లో పంట ఎక్కువగా వస్తుందో చారిత్రక విశ్లేషణ.',
      icon: Calendar,
      color: 'from-rose-500 to-red-600',
      badge: 'Multi-Year Seasonality Model',
      points: [
        'Month-by-month historical baseline prices',
        'Seasonal high vs seasonal low identification',
        'Distinctly separated from short-term forecasts'
      ]
    },
    {
      id: 'forecast',
      path: '/forecast',
      category: 'market',
      categoryName: 'Market Intelligence',
      categoryNameTe: 'మార్కెట్ విశ్లేషణ',
      title: 'AI Price Forecast & Uncertainty Range',
      titleTe: 'ధరల ముందస్తు అంచనా (Price Forecast)',
      desc: 'Machine learning forecasting combining historical velocity, arrival volume deltas, seasonal cycles, and weather risks into a 7-day expected range.',
      descTe: 'గత ధరలు, మార్కెట్ రాక మరియు వాతావరణాన్ని సమీకరించి రాబోయే 7 రోజుల్లో ధరల దిశను అంచనా వేస్తుంది.',
      icon: Lightbulb,
      color: 'from-yellow-500 to-amber-600',
      badge: 'ML Multi-Factor Forecasting',
      points: [
        '7-day estimated price range (₹ Min - ₹ Max)',
        'Direction indicator (UP / STABLE / DOWN)',
        'Prominent non-guaranteed financial disclaimer'
      ]
    },
    {
      id: 'buyers',
      path: '/buyers',
      category: 'trade',
      categoryName: 'Sales & Trade Access',
      categoryNameTe: 'అమ్మకాలు & కొనుగోలుదారులు',
      title: 'Nearby Buyers & Mandis Discovery',
      titleTe: 'సమీప కొనుగోలుదారులు & మార్కెట్లు',
      desc: 'GPS-mapped directory of verified APMC yards, NABARD registered Farmer Producer Organizations (FPOs), and food processing hubs with distance metrics.',
      descTe: 'మీ పొలానికి సమీపంలోని ధృవీకరించబడిన ప్రభుత్వ మార్కెట్లు, FPOలు మరియు వ్యాపారుల వివరాలు.',
      icon: Users,
      color: 'from-emerald-600 to-teal-700',
      badge: 'SFAC / NABARD / APMC Registry',
      points: [
        'Exact road distance from farmer GPS coordinates',
        'Zero fake numbers — verified official APMC and FPOs only',
        'Current offered rates and trade contact details'
      ]
    },
    {
      id: 'comparison',
      path: '/comparison',
      category: 'trade',
      categoryName: 'Sales & Trade Access',
      categoryNameTe: 'అమ్మకాలు & కొనుగోలుదారులు',
      title: 'Buyer Net Revenue & Logistics Calculator',
      titleTe: 'మార్కెట్ల నికర లాభం పోలిక (Net Revenue)',
      desc: 'Calculates Gross Revenue minus Estimated Transportation costs minus Mandi cess to rank selling destinations by Highest Estimated Net Return.',
      descTe: 'ధర నుండి రవాణా ఖర్చులు, మార్కెట్ ఫీజులను మినహాయించి నికరంగా రైతు చేతికి ఏ మార్కెట్లో ఎక్కువ డబ్బు వస్తుందో పోలుస్తుంది.',
      icon: ShieldCheck,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Logistics Net Revenue Optimizer',
      points: [
        'Dynamic quantity and distance-based haulage estimation',
        'Comparison table sorted by highest net payout',
        'Identifies when a nearby lower price beats a far mandi'
      ]
    },
    {
      id: 'sell-smart',
      path: '/sell-smart',
      category: 'trade',
      categoryName: 'Sales & Trade Access',
      categoryNameTe: 'అమ్మకాలు & కొనుగోలుదారులు',
      title: 'Smart Selling Recommendation Engine',
      titleTe: 'స్మార్ట్ విక్రయ సిఫార్సు (SELL SMART)',
      desc: 'Dedicated decision synthesis combining current price, trend momentum, storage shelf life, weather risk, and buyer returns into actionable verdict.',
      descTe: 'ధర, వాతావరణం, రవాణా మరియు నిల్వ సామర్థ్యాన్ని సమీకరించి "ఇప్పుడే అమ్మాలా? వేచి చూడాలా?" అని స్పష్టంగా చెబుతుంది.',
      icon: ShieldCheck,
      color: 'from-emerald-700 to-green-900',
      badge: 'Core Synthesis Verdict Engine',
      points: [
        'Clear verdict: SELL NOW / WAIT & MONITOR / COMPARE MARKETS',
        'Storage risk penalty & perishability decay factor',
        'Plain-language Telugu & English reasoning'
      ]
    },
    {
      id: 'weather',
      path: '/weather',
      category: 'weather',
      categoryName: 'Field & Meteorological',
      categoryNameTe: 'వాతావరణం & పొలం రక్షణ',
      title: 'Hyperlocal Weather & Agronomic Alerts',
      titleTe: 'హైపర్‌లోకల్ వాతావరణం & పంట ప్రమాదాలు',
      desc: 'High-resolution meteorological feeds via Open-Meteo providing temperature, rain probability, humidity, wind, 7-day forecast, and crop risk rules.',
      descTe: 'గంటల వారీ వర్షపాతం, తేమ, గాలి వేగం మరియు భారీ వర్షం, అధిక ఉష్ణోగ్రత వల్ల పంటకు వచ్చే ప్రమాదాల ముందస్తు సూచన.',
      icon: CloudSun,
      color: 'from-sky-500 to-blue-600',
      badge: 'Open-Meteo High-Resolution Feed',
      points: [
        'Automated GPS coordinate telemetry',
        'Crop-specific thresholds (Heavy rain, Heat stress, Fungal humidity)',
        'Zero invented alerts — strictly physics-based readings'
      ]
    },
    {
      id: 'assistant',
      path: '/assistant',
      category: 'ai',
      categoryName: 'AI & Diagnostics',
      categoryNameTe: 'AI & పంట రక్షణ',
      title: 'Telugu AI Farmer Assistant (రైతు మిత్రుడు)',
      titleTe: 'తెలుగు AI రైతు మిత్రుడు (Voice & Chat)',
      desc: 'Bilingual conversational advisor fluent in native Telugu and English. Answer questions about mandi prices, pest control, spraying, or selling timing.',
      descTe: 'రైతులు తమ సందేహాలను తెలుగులో టైప్ చేసి లేదా మాట్లాడి వ్యవసాయ సలహాలు మరియు మార్కెట్ ధరలు తెలుసుకోవచ్చు.',
      icon: MessageSquareText,
      color: 'from-teal-600 to-emerald-800',
      badge: 'Telugu NLP + Domain Agronomy Assistant',
      points: [
        'Full support for native Telugu script (తెలుగు)',
        'Voice audio read-aloud via browser SpeechSynthesis',
        'Context-aware answers tailored to your selected crop'
      ]
    },
    {
      id: 'crops',
      path: '/crops',
      category: 'weather',
      categoryName: 'Field & Meteorological',
      categoryNameTe: 'వాతావరణం & పొలం రక్షణ',
      title: 'Crop Agronomic Profiles & Cultivation Guide',
      titleTe: 'పంటల సమగ్ర సాగు సమాచారం (Crop Profiles)',
      desc: 'In-depth agronomic profiles for major Indian crops covering growing seasons, water requirements, soil pH, common pests, and storage guidelines.',
      descTe: 'ప్రధాన పంటల సాగు కాలం, నీటి యాజమాన్యం, తెగుళ్లు, నిల్వ మరియు మార్కెట్ లక్షణాల పూర్తి గైడ్.',
      icon: Sprout,
      color: 'from-green-600 to-emerald-700',
      badge: 'ICAR & SAU Agronomic Reference',
      points: [
        'Growing stages, critical irrigation windows, and harvest signs',
        'Common regional pest and disease thresholds',
        'Storage considerations and shelf-life ratings'
      ]
    },
    {
      id: 'alerts',
      path: '/alerts',
      category: 'weather',
      categoryName: 'Field & Meteorological',
      categoryNameTe: 'వాతావరణం & పొలం రక్షణ',
      title: 'Real-Time Crop Risk & Market Notifications',
      titleTe: 'వాతావరణ & మార్కెట్ హెచ్చరికలు (Alerts)',
      desc: 'Unified notification hub monitoring sudden weather events, severe price drops or spikes, and major arrival fluctuations.',
      descTe: 'భారీ వర్షాలు, మార్కెట్ ధరల్లో పెద్ద మార్పులు మరియు తెగుళ్ల ప్రమాదాలపై తక్షణ హెచ్చరికలు.',
      icon: AlertTriangle,
      color: 'from-amber-600 to-rose-600',
      badge: 'Multi-Stream Event Listener',
      points: [
        'Classified by urgency: CRITICAL / WARNING / ADVISORY',
        'Includes explicit recommended farmer action for each alert',
        'Full timestamp and data source provenance'
      ]
    },
    {
      id: 'dashboard',
      path: '/dashboard',
      category: 'system',
      categoryName: 'Platform & Management',
      categoryNameTe: 'సిస్టమ్ & నిర్వహణ',
      title: 'Farmer Daily Summary Dashboard',
      titleTe: 'రైతు సమగ్ర డ్యాష్‌బోర్డ్ (Dashboard)',
      desc: 'The central operational cockpit aggregating today’s crop health, live price, 30-day trend, weather risk, and the flagship "WHAT SHOULD I DO TODAY?" card.',
      descTe: 'రైతు కోసం అన్ని వివరాలను ఒకేచోట చూపే ప్రధాన డ్యాష్‌బోర్డ్ — "ఈరోజు నేను ఏమి చేయాలి?" అనే AI సిఫార్సు.',
      icon: Compass,
      color: 'from-emerald-600 to-teal-800',
      badge: 'Central Farmer Cockpit',
      points: [
        'Flagship "WHAT SHOULD I DO TODAY?" synthesis card',
        'One-click summary of prices, weather, and nearby markets',
        'Quick links to all deep-dive individual pages'
      ]
    },
    {
      id: 'onboarding',
      path: '/onboarding',
      category: 'system',
      categoryName: 'Platform & Management',
      categoryNameTe: 'సిస్టమ్ & నిర్వహణ',
      title: 'Farmer Profile & GPS Onboarding',
      titleTe: 'రైతు ప్రొఫైల్ & జీపీఎస్ నమోదు (Onboarding)',
      desc: 'Step-by-step onboarding collecting farmer name, state, district, village, crop, farm size, available quintals, language, and GPS permission.',
      descTe: 'రైతు పేరు, గ్రామం, పంట రకం, దిగుబడి పరిమాణం మరియు సమీప మార్కెట్ల కోసం జీపీఎస్ లొకేషన్ సెటప్.',
      icon: UserCheck,
      color: 'from-blue-600 to-teal-700',
      badge: 'GPS & Profile Configurator',
      points: [
        'Browser GPS coordinate auto-detection',
        'Language preference: English / Telugu',
        'Configures personalized dashboard metrics'
      ]
    },
    {
      id: 'sources',
      path: '/sources',
      category: 'system',
      categoryName: 'Platform & Management',
      categoryNameTe: 'సిస్టమ్ & నిర్వహణ',
      title: 'Verified Data Sources & Transparency',
      titleTe: 'అధికారిక డేటా వనరుల పారదర్శకత (Data Sources)',
      desc: 'Public audit directory detailing every API and institutional dataset powering BlindSpot Agri, ensuring zero fake or fabricated numbers.',
      descTe: 'ఈ అప్లికేషన్‌లో ఉపయోగించిన ప్రతి ప్రభుత్వ API, వాతావరణ సర్వర్ మరియు వ్యవసాయ సంస్థల అధికారిక లింకులు.',
      icon: FileText,
      color: 'from-slate-700 to-slate-900',
      badge: 'Open Government Data Audit',
      points: [
        'Direct URLs to Agmarknet, data.gov.in, and Open-Meteo',
        'Update frequencies and synchronization details',
        'Complete transparency for hackathon jury evaluation'
      ]
    },
    {
      id: 'admin',
      path: '/admin',
      category: 'system',
      categoryName: 'Platform & Management',
      categoryNameTe: 'సిస్టమ్ & నిర్వహణ',
      title: 'Admin & System Control Center',
      titleTe: 'అడ్మిన్ & ఏపీఐ స్థితి (Admin Center)',
      desc: 'Developer and administrator control center showing live API health status, sync triggers, latency monitors, demo mode toggles, and mandi price records.',
      descTe: 'సిస్టమ్ ఆరోగ్యం, ఏపీఐ రెస్పాన్స్ సమయం, ప్రభుత్వ డేటా సింక్ మరియు డెమో మోడ్ టోగుల్ చేసే అడ్మిన్ ప్యానెల్.',
      icon: Database,
      color: 'from-slate-800 to-zinc-950',
      badge: 'DevOps & API Health Monitor',
      points: [
        'Live health and latency for Weather, Market, and AI APIs',
        'Manual Agmarknet sync trigger',
        'Add/Edit mandi price records with instant live updates'
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Pages (17)', labelTe: 'అన్ని పేజీలు (17)' },
    { id: 'ai', label: 'AI & Diagnostics', labelTe: 'AI & పంట రక్షణ' },
    { id: 'market', label: 'Market Intelligence', labelTe: 'మార్కెట్ విశ్లేషణ' },
    { id: 'trade', label: 'Sales & Buyers', labelTe: 'అమ్మకాలు & మార్కెట్లు' },
    { id: 'weather', label: 'Weather & Agronomy', labelTe: 'వాతావరణం & సాగు' },
    { id: 'system', label: 'System & Admin', labelTe: 'సిస్టమ్ & అడ్మిన్' }
  ];

  const filteredFeatures = features.filter(f => {
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.titleTe.includes(searchQuery) ||
      f.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          <Layers className="w-3.5 h-3.5" />
          <span>Independent Standalone Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          {language === 'te' 
            ? "ప్రతి ఫీచర్‌కు ఒక ప్రత్యేక పేజీ & యుఆర్‌ఎల్" 
            : "Separate Dedicated Page for Every Feature"}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {language === 'te'
            ? "బ్లైండ్‌స్పాట్ అగ్రిలోని ప్రతి ఫీచర్ తన సొంత పూర్తి స్థాయి పేజీ, ప్రత్యేక URL మరియు ప్రత్యక్ష డేటా కనెక్షన్లతో స్వతంత్రంగా పనిచేస్తుంది. క్రింది కార్డులలో ఏదైనా క్లిక్ చేసి ఆ ప్రత్యేక పేజీని తెరవండి."
            : "Every feature of BlindSpot Agri operates as its own dedicated standalone page with direct URL routing, live verified APIs, and specialized analytics. Click any card below to launch that specific page."}
        </p>

        {/* Quick Search & Category Filters */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'te' ? "ఫీచర్ లేదా పేజీ పేరును వెతకండి..." : "Search feature by name, topic, or /route..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {language === 'te' ? cat.labelTe : cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              onClick={() => setCurrentView(feat.id)}
              className="group bg-white rounded-3xl p-6 border-2 border-slate-200/90 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Header Row: Icon, Route Badge & Category */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[11px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 block">
                      {feat.path}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                      {language === 'te' ? feat.categoryNameTe : feat.categoryName}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                    {language === 'te' ? feat.titleTe : feat.title}
                  </h3>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                    {feat.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'te' ? feat.descTe : feat.desc}
                </p>

                {/* Bullet Points */}
                <ul className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                  {feat.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 font-bold text-xs transition duration-200 flex items-center justify-center gap-2 border border-slate-200 group-hover:border-emerald-600 shadow-sm"
                >
                  <span>{language === 'te' ? "ఈ ప్రత్యేక పేజీ తెరవండి" : "Open Dedicated Page"}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete URL Routing Sitemap Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">
            {language === 'te' ? "డైరెక్ట్ యుఆర్‌ఎల్ రూటింగ్ మ్యాప్ (Direct URL Routes)" : "Direct URL Route Sitemap"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            You can type any of these exact paths directly in your browser address bar to visit each separate page.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Feature Name</th>
                <th className="py-3 px-4">Direct Browser URL</th>
                <th className="py-3 px-4">Data Source / Engine</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {features.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {language === 'te' ? f.titleTe : f.title}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                    http://localhost:5000{f.path}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {f.badge}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setCurrentView(f.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold transition inline-flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
