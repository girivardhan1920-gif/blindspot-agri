import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CloudRain, 
  TrendingUp, 
  TrendingDown, 
  Bug, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import { getLiveWeather, getPriceTrends, getDemandSupplyAnalysis } from '../api/client';

interface AlertsPageProps {
  language: Language;
  crop: string;
  latitude: number;
  longitude: number;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ language, crop, latitude, longitude }) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const text = t[language];

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const [weather, trends, demandSupply] = await Promise.all([
          getLiveWeather(latitude, longitude, crop),
          getPriceTrends(crop, 30),
          getDemandSupplyAnalysis(crop)
        ]);

        const list = [...(weather.alerts || [])];

        // Market Price movement alert
        if (Math.abs(trends.changePercent) >= 5) {
          list.push({
            id: 'alert-price-01',
            type: `Major Market Price Movement (${trends.changePercent >= 0 ? '+' : ''}${trends.changePercent}%)`,
            typeTe: `మార్కెట్ ధరలో గణనీయమైన మార్పు (${trends.changePercent}%)`,
            severity: Math.abs(trends.changePercent) >= 10 ? 'HIGH' : 'MEDIUM',
            reason: `${crop} modal price moved by ₹${trends.changeAbsolute} over the last 30 days across APMC benchmark yards.`,
            reasonTe: `గత 30 రోజుల్లో ధర ₹${trends.changeAbsolute} మేర మార్పు చెందింది.`,
            recommendedAction: trends.changePercent >= 0 
              ? "Review nearby buyer net realizations. High modal rate provides favorable cash-in window."
              : "Consider selling immediate mature harvest to avoid holding losses, or utilize ventilated storage.",
            recommendedActionTe: "ధర పెరుగుదల ఉన్నందున సమీప మార్కెట్లలో రేట్లు పరిశీలించి లాభం పొందండి.",
            timestamp: new Date().toISOString(),
            source: "Agmarknet Historical Time-Series Core"
          });
        }

        // Market Arrival changes alert
        if (Math.abs(demandSupply.arrivalDeltaPct) >= 15) {
          list.push({
            id: 'alert-arrival-02',
            type: `Significant Market Arrival Velocity Shift (${demandSupply.arrivalDeltaPct}%)`,
            typeTe: `మార్కెట్ రాకలో పెద్ద మార్పు (${demandSupply.arrivalDeltaPct}%)`,
            severity: 'MEDIUM',
            reason: demandSupply.rationale,
            reasonTe: "మార్కెట్లకు పంట రాకలో మార్పుల వల్ల ధరలపై ఒత్తిడి నెలకొంది.",
            recommendedAction: "Check arrival volumes before hiring freight transport to terminal markets.",
            recommendedActionTe: "రవాణా ఖర్చులను సరిచూసుకుని మార్కెట్‌కు సరుకును తరలించండి.",
            timestamp: new Date().toISOString(),
            source: "DMI Agmarknet Daily Trade Registrars"
          });
        }

        setAlerts(list);
      } catch (err) {
        console.warn("Alerts fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [crop, latitude, longitude]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Real-Time Agro & Market Telemetry Warnings</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? "వ్యవసాయ & మార్కెట్ హెచ్చరికలు (Alert System)" : "Live Agricultural & Market Alerts"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Alert → Trigger Reason → Recommended Action → Timestamp → Verified Data Source.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
          {alerts.length} Active System Notifications
        </span>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((a) => (
            <div 
              key={a.id}
              className={`p-6 rounded-2xl border shadow-sm space-y-3 transition ${
                a.severity === 'HIGH'
                  ? 'bg-rose-50/70 border-rose-300'
                  : 'bg-amber-50/70 border-amber-300'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                    a.severity === 'HIGH' ? 'text-rose-600' : 'text-amber-600'
                  }`} />
                  <h3 className="text-base font-black text-slate-900">
                    {language === 'te' ? a.typeTe : a.type}
                  </h3>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                  a.severity === 'HIGH' 
                    ? 'bg-rose-200 text-rose-900' 
                    : 'bg-amber-200 text-amber-900'
                }`}>
                  {a.severity} SEVERITY
                </span>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed">
                <strong>Trigger Reason:</strong> {language === 'te' ? a.reasonTe : a.reason}
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-800">
                <strong className="text-emerald-700 block mb-0.5">Recommended Farmer Action:</strong>
                {language === 'te' ? a.recommendedActionTe : a.recommendedAction}
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/50">
                <span className="font-medium">Data Source: {a.source}</span>
                <span>Triggered: {new Date(a.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-slate-500 space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Critical Agro Hazards Active</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Weather risk, arrival spikes, and price shifts for {crop} are currently within safe operating bands.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
