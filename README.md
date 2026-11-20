# BlindSpot Agri (బ్లైండ్‌స్పాట్ అగ్రి)
> **“See the problem. Predict the market. Sell smarter.”**
> AI-Powered Agriculture Intelligence Platform for Indian Smallholder Farmers.

---

## 🌾 Overview
**BlindSpot Agri** is a production-quality, responsive full-stack agriculture intelligence web platform engineered to empower smallholder farmers across India. It connects real-time government mandi market feeds, numerical meteorology, computer vision plant pathology, and net-margin transportation economics into a single actionable decision engine: **“WHAT SHOULD I DO TODAY?”**.

---

## 🚀 Live Host Link & Quick Start

To launch and open the application:

1. **Install dependencies (if not already installed):**
   ```bash
   npm --prefix server install
   npm --prefix client install
   ```

2. **Build frontend assets:**
   ```bash
   npm run build:client
   ```

3. **Start the Production Unified Server:**
   ```bash
   npm start
   ```

4. **Open in your browser:**
   - **Main Farmer Application:** [http://localhost:5000](http://localhost:5000)
   - **Admin & All Crop Prices Portal:** [http://localhost:5000/#admin](http://localhost:5000/#admin) (or click the **Admin & Mandi Master** button in the header)
   - **Development Vite Server with HMR:** [http://localhost:5173](http://localhost:5173) (run `npm run dev:client`)

---

## 🔑 Key Modules & Architecture

### 1. Landing Page
- Modern AgTech startup branding (`BlindSpot Agri`).
- Immediate call-to-actions: *Get Started*, *Explore Market*, *Scan Crop*.
- Interactive module showcase cards for all 8 intelligence capabilities.

### 2. Farmer Onboarding & GPS Detection
- Farmer profile configuration: Name, Village, District, State, Primary Crop, Farm Size (Acres), and Available Harvest (Quintals).
- Dual language selection: **English** and **తెలుగు (Telugu)**.
- GPS Geolocation integration calculating road distances to nearby APMC mandis.

### 3. Core Dashboard: “WHAT SHOULD I DO TODAY?”
- Multi-factor synthesis analyzing live Open-Meteo weather risk, 30-day price trends, arrival pressure, and transport expenses.
- Clear action verdicts: `SELL NOW`, `WAIT & MONITOR`, or `COMPARE MARKETS`.
- Plain-language farmer summary in English and native Telugu script.

### 4. AI Crop Health Scanner
- Upload or sample leaf pathology detection with Computer Vision.
- Precise HTML5 Canvas bounding box highlights pinpointing necrotic lesions and chlorosis rings.
- Severity classification (`Low` / `Medium` / `High`), confidence score, visible symptoms, next steps, and weekly comparison history.
- Mandatory medical disclaimer: *"AI-detected visual symptoms. Possible condition only. Consult a local KVK agricultural officer for confirmation."*

### 5. Hyperlocal Weather Intelligence
- Direct live telemetry with **Open-Meteo High-Resolution Numerical Meteorological Model (ECMWF/GFS)**.
- Temperature, apparent temperature, relative humidity, 24-hour rain probability, and sustained wind velocity.
- Physics-based agro warnings:
  - *Heavy Rain & Waterlogging Risk*
  - *High Humidity Fungal / Blight Risk*
  - *Extreme Heat Stress Warning*
  - *Strong Wind Lodging Risk*

### 6. Live APMC Mandi Market Prices
- Verifiable daily trade data aligned with **Agmarknet & data.gov.in** schema.
- Filterable by State, District, Crop, Commodity, and Market Yard.
- Displays Minimum Price, Maximum Price, Modal Price (₹/quintal), Market Arrivals (Metric Tonnes), and exact update timestamp.

### 7. Price Trends & Volatility
- Interactive Recharts area chart covering 7-day, 30-day, and 90-day timelines.
- Statistical volatility index and peak/trough historical analysis.

### 8. Demand & Supply Intelligence
- Mandi arrival volume tracking against baseline consumption.
- Net market pressure indicators (`UPWARD` / `STABLE` / `DOWNWARD`) with economic rationale.

### 9. 12-Month Seasonal Pattern Engine
- Multi-year empirical monthly average price curve.
- Highlights seasonal peak windows and harvest gluts.

### 10. AI Price Forecast
- Projected price ranges (₹X–₹Y) over 7-10 day horizons.
- Key telemetry drivers and required disclaimer: *"Forecast only — actual market prices may differ."*

### 11. Nearby Markets & GPS Map Discovery
- Geospatial mapping of verified APMC yards, NABARD-registered FPOs, and cooperative procurement hubs.
- Haversine freight distance matrix and real contact desks.

### 12. Buyer Net-Return Calculator
- Farmer inputs Crop, Quantity (qtl), and Quality Grade.
- Computes Gross Revenue minus estimated freight haulage (₹4.2/km/qtl) minus APMC cess to determine the **Highest Estimated Net Return**.

### 13. Sell Smart Decision Engine
- Deep multi-factor synthesis weighing perishable shelf-life vs price momentum.

### 14. Telugu & English AI Farmer Assistant
- Bilingual chatbot supporting voice synthesis (reads replies aloud in Telugu and English via Web Speech API) and microphone speech input.
- Answers questions about pesticide dosages, mandi price queries, and harvest timing.

### 15. Agronomic Crop Dossiers
- Comprehensive production guides for Tomato, Onion, Chilli, Cotton, Rice, Wheat, Potato, Turmeric, Maize, and Groundnut.
- Citing ICAR, PJTSAU, and ANGRAU scientific protocols.

### 16. Admin & All Crop Prices Control Center
- **Live API Diagnostics:** Latency (ms), HTTP status, and API key statuses for Open-Meteo, data.gov.in, Google Gemini AI, and OSM.
- **All Crop Prices Master Database:** Search, filter by state/category, and edit live modal prices or add new mandi records.
- **Government Data Sync Trigger:** Force refresh from data.gov.in or touch verified master records.
- **CSV Data Export:** One-click download of all mandi records for agricultural reporting.
- **Demo Mode Toggle:** Clearly flags demo datasets for hackathon presentations without polluting real-time telemetry.

---

## 🔒 Environment Variables (`server/.env`)

```env
PORT=5000
DATA_GOV_IN_API_KEY=your_datagov_api_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
DEMO_MODE=false
NODE_ENV=production
```

---

## 📜 Ethical Data Charter
- **Zero Fake Data Policy:** Never hardcodes fabricated prices or invented buyers.
- **Honest Fallbacks:** If an API endpoint is unavailable, displays an explicit *"Data unavailable"* or verified cached baseline rather than pseudo-data.
