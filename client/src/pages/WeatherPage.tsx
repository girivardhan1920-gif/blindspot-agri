import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  CloudRain, 
  AlertTriangle, 
  Sun, 
  ShieldCheck, 
  MapPin, 
  RefreshCw,
  Compass,
  ThermometerSun
} from 'lucide-react';
import { Language, WeatherData } from '../types';
import { t } from '../translations';
import { getLiveWeather } from '../api/client';

interface WeatherPageProps {
  language: Language;
  latitude: number;
  longitude: number;
  crop: string;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({ language, latitude, longitude, crop }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const text = t[language];

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const data = await getLiveWeather(latitude, longitude, crop);
      setWeather(data);
    } catch (err) {
      console.warn("Weather load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [latitude, longitude, crop]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">
            <CloudSun className="w-4 h-4" />
            <span>Open-Meteo High-Resolution Live Forecast</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? "నిజ-సమయ వాతావరణ సమాచారం & పంట ప్రమాదాలు" : "Hyperlocal Weather Intelligence"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Coordinates: {latitude.toFixed(3)}°N, {longitude.toFixed(3)}°E</span>
            <span>•</span>
            <span>Crop Context: <strong className="text-emerald-700">{crop}</strong></span>
          </p>
        </div>

        <button
          onClick={fetchWeather}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? "Updating..." : "Refresh Live Feed"}</span>
        </button>
      </div>

      {/* Current Conditions Card */}
      {weather && (
        <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-sky-800/40 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Main Temperature & Condition */}
            <div className="lg:col-span-5 space-y-2">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider">
                {language === 'te' ? "ప్రస్తుత వాతావరణం" : "Current Observation"}
              </span>
              <div className="flex items-baseline gap-4 mt-2">
                <span className="text-6xl sm:text-7xl font-black tracking-tight">
                  {weather.current.temperature}°C
                </span>
                <span className="text-sm text-slate-300 font-medium">
                  Feels like {weather.current.apparentTemperature}°C
                </span>
              </div>
              <p className="text-lg font-bold text-sky-200">
                {language === 'te' ? weather.current.conditionTe : weather.current.condition}
              </p>
              <p className="text-xs text-slate-400">
                Source: {weather.source} • Updated: {new Date(weather.lastUpdated).toLocaleTimeString()}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  <span>Humidity</span>
                </div>
                <div className="text-xl font-bold">{weather.current.humidity}%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Moisture level</div>
              </div>

              <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  <span>24h Rain Prob</span>
                </div>
                <div className="text-xl font-bold">{weather.current.rainProbability24h}%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Precipitation risk</div>
              </div>

              <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Wind className="w-3.5 h-3.5 text-teal-400" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-xl font-bold">{weather.current.windSpeed} km/h</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Sustained gusts</div>
              </div>

              <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <ThermometerSun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Crop Risk</span>
                </div>
                <div className="text-xl font-bold text-amber-300">
                  {weather.alerts.length > 0 ? "Alert Active" : "Safe"}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{weather.alerts.length} Warnings</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Physics-Based Crop Alert Warnings (Requirement 5) */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          {language === 'te' ? "పంట-నిర్దిష్ట వాతావరణ ప్రమాద హెచ్చరికలు" : "Physics-Based Crop Hazard Warnings"}
        </h3>

        {weather?.alerts && weather.alerts.length > 0 ? (
          <div className="space-y-3">
            {weather.alerts.map((alert) => (
              <div 
                key={alert.id}
                className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <h4 className="text-sm font-extrabold text-amber-900">
                      {language === 'te' ? alert.typeTe : alert.type}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-200 text-amber-900">
                    {alert.severity} SEVERITY
                  </span>
                </div>

                <p className="text-xs text-amber-900 leading-relaxed">
                  <strong>Trigger Reason:</strong> {language === 'te' ? alert.reasonTe : alert.reason}
                </p>

                <div className="p-3 bg-white/80 rounded-xl text-xs text-slate-800 border border-amber-200">
                  <strong className="text-emerald-800">Recommended Farmer Action:</strong>{" "}
                  {language === 'te' ? alert.recommendedActionTe : alert.recommendedAction}
                </div>

                <div className="flex items-center justify-between text-[11px] text-amber-800/80 pt-1">
                  <span>Source: {alert.source}</span>
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-slate-600 space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Severe Agro-Weather Hazards Detected</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Current humidity, wind, and precipitation parameters for {crop} in your region fall within standard safe biological tolerances.
            </p>
          </div>
        )}
      </div>

      {/* 7-Day Interactive Forecast Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          {language === 'te' ? "7-రోజుల వాతావరణ అంచనా" : "7-Day High-Resolution Forecast"}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather?.forecast.map((day) => (
            <div 
              key={day.date}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-2"
            >
              <span className="text-xs font-bold text-slate-800 block">
                {day.dayName}
              </span>
              <span className="text-[11px] text-slate-400 block">{day.date}</span>

              <div className="text-base font-black text-slate-900 my-1">
                {day.maxTemp}° / <span className="text-slate-400 text-xs font-normal">{day.minTemp}°</span>
              </div>

              <div className="text-xs font-semibold text-emerald-700 truncate">
                {language === 'te' ? day.conditionTe : day.condition}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] text-blue-600 font-bold">
                <Droplets className="w-3 h-3 text-blue-500" />
                <span>{day.rainProb}% rain</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
