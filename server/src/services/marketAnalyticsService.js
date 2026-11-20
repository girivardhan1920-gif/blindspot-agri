import { HISTORICAL_PRICE_SERIES, SEASONAL_PATTERNS } from '../data/mandiData.js';

export function getPriceTrends(crop = "Tomato", days = 30) {
  // Normalize crop name
  const matchedCrop = Object.keys(HISTORICAL_PRICE_SERIES).find(
    c => c.toLowerCase() === crop.toLowerCase()
  ) || "Tomato";

  const series = HISTORICAL_PRICE_SERIES[matchedCrop] || HISTORICAL_PRICE_SERIES["Tomato"];
  const currentPrice = series[series.length - 1].price;
  const startPrice = series[0].price;

  const priceDiff = currentPrice - startPrice;
  const percentChange = Math.round((priceDiff / startPrice) * 1000) / 10;

  // Calculate volatility (standard deviation of daily returns)
  const prices = series.map(s => s.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  const volatilityPct = Math.round((stdDev / mean) * 1000) / 10;

  let trendDirection = "STABLE";
  if (percentChange >= 3) trendDirection = "UPWARD";
  else if (percentChange <= -3) trendDirection = "DOWNWARD";

  return {
    crop: matchedCrop,
    period: `${days} Days`,
    currentPrice,
    startPrice,
    changeAbsolute: priceDiff,
    changePercent: percentChange,
    trendDirection,
    volatilityIndex: `${volatilityPct}%`,
    volatilityRating: volatilityPct > 8 ? "High" : volatilityPct > 4 ? "Moderate" : "Low",
    highestPeriodPrice: maxPrice,
    lowestPeriodPrice: minPrice,
    summary: `${matchedCrop} prices ${percentChange >= 0 ? "increased" : "decreased"} by ${Math.abs(percentChange)}% over the last ${days} days across verified APMC mandis.`,
    dataPoints: series,
    dataSource: "Verified APMC Mandi Historical Arrivals & Modal Price Archives (Agmarknet / DMI)",
    lastUpdated: new Date().toISOString()
  };
}

export function getDemandSupplyAnalysis(crop = "Tomato") {
  const matchedCrop = Object.keys(HISTORICAL_PRICE_SERIES).find(
    c => c.toLowerCase() === crop.toLowerCase()
  ) || "Tomato";

  const series = HISTORICAL_PRICE_SERIES[matchedCrop] || HISTORICAL_PRICE_SERIES["Tomato"];
  const currentArrivals = series[series.length - 1].arrivals;
  const baselineArrivals = series[0].arrivals;
  const arrivalDeltaPct = Math.round(((currentArrivals - baselineArrivals) / baselineArrivals) * 100);

  let supply = "MEDIUM";
  if (arrivalDeltaPct < -10) supply = "LOW";
  else if (arrivalDeltaPct > 10) supply = "HIGH";

  let demand = "HIGH";
  let pressure = "UPWARD";
  let rationale = "";

  if (supply === "LOW") {
    demand = "HIGH";
    pressure = "UPWARD";
    rationale = `Daily market arrivals dropped by ${Math.abs(arrivalDeltaPct)}% while baseline consumption demand remains steady across major urban consuming centers. This constrained inflow is generating upward price pressure.`;
  } else if (supply === "HIGH") {
    demand = "MEDIUM";
    pressure = "DOWNWARD";
    rationale = `Daily market arrivals surged by ${arrivalDeltaPct}% due to ongoing peak harvesting. High inventory accumulation at terminal yards is creating downward price pressure.`;
  } else {
    demand = "MEDIUM";
    pressure = "STABLE";
    rationale = `Market arrivals and daily consumption dispatches are evenly matched. Trade liquidity remains steady with minimal day-to-day fluctuation.`;
  }

  return {
    crop: matchedCrop,
    demand,
    supply,
    marketPressure: pressure,
    arrivalVolumeMt: currentArrivals,
    arrivalDeltaPct,
    rationale,
    notice: "Estimated demand signal based on available market indicators (daily mandi arrivals, price velocity & urban absorption).",
    dataSource: "DMI Agmarknet Market Arrivals Daily Registry",
    lastUpdated: new Date().toISOString()
  };
}

export function getSeasonalAnalysis(crop = "Tomato") {
  const matchedCrop = Object.keys(SEASONAL_PATTERNS).find(
    c => c.toLowerCase() === crop.toLowerCase()
  ) || "Tomato";

  const pattern = SEASONAL_PATTERNS[matchedCrop] || SEASONAL_PATTERNS["Tomato"];

  return {
    ...pattern,
    dataSource: "Historical 5-Year Mandi Seasonality Indices (ICAR & National Horticulture Board)",
    lastUpdated: new Date().toISOString(),
    notice: "Historical pattern analysis represents multi-year empirical averages. Does not guarantee current season price realization."
  };
}

export function getPriceForecast(crop = "Tomato", weatherRisk = "low") {
  const matchedCrop = Object.keys(HISTORICAL_PRICE_SERIES).find(
    c => c.toLowerCase() === crop.toLowerCase()
  ) || "Tomato";

  const series = HISTORICAL_PRICE_SERIES[matchedCrop] || HISTORICAL_PRICE_SERIES["Tomato"];
  const currentPrice = series[series.length - 1].price;
  const demandSignal = getDemandSupplyAnalysis(crop);

  let expectedDeltaPct = 0;
  let direction = "STABLE";
  let confidence = "Moderate";

  if (demandSignal.marketPressure === "UPWARD") {
    expectedDeltaPct = weatherRisk === "high" ? 8.5 : 5.2;
    direction = "UP";
    confidence = "Moderate to High";
  } else if (demandSignal.marketPressure === "DOWNWARD") {
    expectedDeltaPct = -4.5;
    direction = "DOWN";
    confidence = "Moderate";
  } else {
    expectedDeltaPct = 1.0;
    direction = "STABLE";
    confidence = "Moderate";
  }

  const projectedMid = Math.round(currentPrice * (1 + expectedDeltaPct / 100));
  const band = Math.round(currentPrice * 0.05); // +/- 5% uncertainty band

  const minExpected = projectedMid - band;
  const maxExpected = projectedMid + band;

  return {
    crop: matchedCrop,
    forecastHorizon: "7–10 Days",
    currentModalPrice: currentPrice,
    expectedDirection: direction,
    expectedRange: `₹${minExpected.toLocaleString('en-IN')} – ₹${maxExpected.toLocaleString('en-IN')}`,
    expectedMin: minExpected,
    expectedMax: maxExpected,
    confidenceLevel: confidence,
    drivers: [
      `Arrival volume trajectory: ${demandSignal.supply} supply at terminal mandis`,
      `Seasonal historical window: ${SEASONAL_PATTERNS[matchedCrop]?.seasonalHighMonths.join(', ') || 'Normal'} tendency`,
      `Weather impact factor: ${weatherRisk.toUpperCase()} risk index`
    ],
    disclaimer: "Forecast only — actual market prices may differ based on unexpected weather disruptions, sudden interstate inflows, or policy changes.",
    generatedAt: new Date().toISOString()
  };
}
