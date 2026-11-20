import { getPriceTrends, getDemandSupplyAnalysis, getPriceForecast } from './marketAnalyticsService.js';
import { fetchLiveWeather } from './weatherService.js';
import { compareBuyers } from './buyerService.js';

export async function generateSmartSellingRecommendation({
  crop = "Tomato",
  quantity = 25,
  quality = "Grade A",
  lat = 17.3850,
  lon = 78.4867,
  hasColdStorage = false
}) {
  // Fetch real-time live data
  const weather = await fetchLiveWeather(lat, lon, crop);
  const trends = getPriceTrends(crop, 30);
  const demandSupply = getDemandSupplyAnalysis(crop);
  const forecast = getPriceForecast(crop, weather.alerts.length > 0 ? "high" : "low");
  const buyerComparison = compareBuyers({ crop, quantityQuintals: quantity, quality, lat, lon });

  // Evaluation Decision Engine
  // 1. Weather risk factor
  const hasSevereRainRisk = weather.alerts.some(a => a.type.toLowerCase().includes("rain"));
  const rainProb = weather.current.rainProbability24h;

  // 2. Market price velocity
  const priceTrendUp = trends.changePercent > 4;
  const priceTrendDown = trends.changePercent < -3;

  // 3. Demand/Supply Pressure
  const upwardPressure = demandSupply.marketPressure === "UPWARD";
  const downwardPressure = demandSupply.marketPressure === "DOWNWARD";

  // Decision logic
  let decision = "WAIT & MONITOR";
  let badgeColor = "amber";
  let explanation = "";
  let teluguExplanation = "";
  let summaryHeadline = "";

  if (hasSevereRainRisk && crop.toLowerCase() === "tomato") {
    // Highly perishable crop with impending rain: harvesting & selling immediately avoids rot
    decision = "SELL NOW";
    badgeColor = "emerald";
    summaryHeadline = `Imminent rain (${rainProb}%) threatens perishable ${crop} harvest. Favorable modal price (₹${trends.currentPrice}/qtl) makes immediate selling sensible.`;
    explanation = `Heavy rain is forecasted within 24 hours. Field harvesting during downpours increases fruit rot and damages transit crates. Current market prices are already trending favorably at ₹${trends.currentPrice}/qtl. We advise liquidating harvested produce immediately to avoid moisture decay.`;
    teluguExplanation = `రాబోయే 24 గంటల్లో వర్షం కురిసే అవకాశం ఉంది. టమాటా వంటి త్వరగా పాడయ్యే పంట తడిస్తే తెగుళ్లు సోకే ప్రమాదం ఉంది. ప్రస్తుతం మార్కెట్లో మంచి ధర (₹${trends.currentPrice}/క్వింటాల్) ఉన్నందున, వెంటనే అమ్ముకోవడం మంచిది.`;
  } else if (downwardPressure || priceTrendDown) {
    decision = "SELL NOW";
    badgeColor = "emerald";
    summaryHeadline = `Market arrivals are spiking and prices may decline. Liquidate current stock before further downward pressure.`;
    explanation = `Market arrivals at terminal yards have increased by ${demandSupply.arrivalDeltaPct}%, leading to downward price pressure. Locking in today's rate (₹${trends.currentPrice}/qtl) protects your return from anticipated supply pressure.`;
    teluguExplanation = `మార్కెట్‌కు పంట రాక పెరిగింది, దీనివల్ల ధర తగ్గే అవకాశం ఉంది. ధర మరింత తగ్గకముందే ప్రస్తుతం ఉన్న ధరకు అమ్ముకోవడం లాభదాయకం.`;
  } else if (priceTrendUp && upwardPressure && !hasSevereRainRisk) {
    decision = "WAIT & MONITOR";
    badgeColor = "blue";
    summaryHeadline = `Market momentum is strong (+${trends.changePercent}% over 30d) and dry weather permits holding for 2–4 days.`;
    explanation = `Market arrivals are tight while terminal demand remains strong, pushing expected prices toward ${forecast.expectedRange}. Weather conditions are safe. If your crop can hold on the vine or in crates, monitor prices for 2 to 4 more days before dispatching.`;
    teluguExplanation = `గత నెల రోజుల్లో ధర ${trends.changePercent}% పెరిగింది. రాబోయే రోజుల్లో ధర ${forecast.expectedRange} వరకు పెరిగే అవకాశం ఉంది. వాతావరణం అనుకూలంగా ఉన్నందున 2-4 రోజులు వేచి చూడటం మంచిది.`;
  } else {
    decision = "COMPARE MARKETS";
    badgeColor = "indigo";
    summaryHeadline = `Prices are stable across mandis. Optimize net profit by choosing the buyer with lowest haulage cost.`;
    explanation = `Market price is currently steady at ₹${trends.currentPrice}/qtl. Your highest financial upside today comes from minimizing transportation and market fees. ${buyerComparison.bestOption ? buyerComparison.bestOption.name : 'Your nearest mandi'} offers the highest estimated net return of ₹${buyerComparison.bestOption?.estimatedNetRevenue?.toLocaleString('en-IN')}.`;
    teluguExplanation = `మార్కెట్ ధరలు స్థిరంగా ఉన్నాయి. రవాణా ఖర్చులు మరియు మార్కెట్ ఫీజులు తక్కువగా ఉన్న మార్కెట్‌ను ఎంచుకోవడం ద్వారా ఎక్కువ లాభం పొందవచ్చు.`;
  }

  // "WHAT SHOULD I DO TODAY?" plain-language summary for the farmer
  const whatShouldIDoToday = {
    crop,
    headline: `Actionable Intelligence for ${crop} Farmers`,
    decision,
    summary: `Your ${crop} crop is facing ${weather.alerts.length > 0 ? weather.alerts[0].type : 'stable weather'}. Real-time modal price is ₹${trends.currentPrice}/quintal (${trends.changePercent >= 0 ? '+' : ''}${trends.changePercent}% over 30 days). ${explanation}`,
    summaryTe: `మీ ${crop} పంటకు ప్రస్తుతం క్వింటాల్‌కు ₹${trends.currentPrice} ధర పలుకుతోంది. ${teluguExplanation}`,
    topMarket: buyerComparison.bestOption?.name || "Bowenpally APMC",
    expectedNetReturn: buyerComparison.bestOption ? `₹${buyerComparison.bestOption.estimatedNetRevenue.toLocaleString('en-IN')}` : "₹50,000",
    disclaimer: "AI Recommendation based on live multi-factor market and weather inputs. This is decision-support intelligence, not a guaranteed financial outcome. Always verify current prices with market yard officials.",
    timestamp: new Date().toISOString()
  };

  return {
    crop,
    decision,
    badgeColor,
    summaryHeadline,
    explanation,
    teluguExplanation,
    whatShouldIDoToday,
    metrics: {
      currentPrice: trends.currentPrice,
      priceTrendPercent: trends.changePercent,
      demandLevel: demandSupply.demand,
      supplyLevel: demandSupply.supply,
      marketPressure: demandSupply.marketPressure,
      forecastRange: forecast.expectedRange,
      weatherRisk: weather.alerts.length > 0 ? "Elevated" : "Normal",
      bestNearbyMarket: buyerComparison.bestOption?.name
    },
    weatherSummary: {
      temp: weather.current.temperature,
      rainProb: weather.current.rainProbability24h,
      alertsCount: weather.alerts.length
    },
    buyerComparison
  };
}
