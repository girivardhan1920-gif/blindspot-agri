export type Language = 'en' | 'te';

export interface FarmerProfile {
  name: string;
  state: string;
  district: string;
  village: string;
  crop: string;
  farmSizeAcres: number;
  quantityAvailableQuintals: number;
  language: Language;
  latitude: number;
  longitude: number;
  hasLocationPermission: boolean;
}

export interface MandiPriceRecord {
  id: string;
  crop: string;
  commodity: string;
  category: string;
  variety: string;
  state: string;
  district: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  arrivals: number;
  arrivalsUnit: string;
  trend7d: number;
  lastUpdated: string;
  source: string;
  verified: boolean;
  lat: number;
  lon: number;
}

export interface WeatherData {
  status: string;
  source: string;
  lastUpdated: string;
  location: {
    latitude: number;
    longitude: number;
    elevation: number;
    timezone: string;
  };
  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
    rainProbability24h: number;
    condition: string;
    conditionTe: string;
    icon: string;
    weatherCode: number;
  };
  alerts: Array<{
    id: string;
    type: string;
    typeTe: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    reason: string;
    reasonTe: string;
    recommendedAction: string;
    recommendedActionTe: string;
    timestamp: string;
    source: string;
  }>;
  forecast: Array<{
    date: string;
    dayName: string;
    minTemp: number;
    maxTemp: number;
    rainProb: number;
    rainSumMm: number;
    windMaxKm: number;
    condition: string;
    conditionTe: string;
    icon: string;
  }>;
}

export interface ProductRecommendation {
  id: string;
  brandName: string;
  genericName: string;
  company: string;
  badge: string;
  category: string;
  dosePerPump: string;
  dosePerPumpTe?: string;
  approxPrice: string;
  instructions: string;
  instructionsTe?: string;
}

export interface PumpSpecs {
  standardPumpSize: string;
  pumpsPerAcre: string;
  bestSprayingTime: string;
  bestSprayingTimeTe?: string;
}

export interface ScanResult {
  id: string;
  crop: string;
  cropTe: string;
  problemCategory?: string;
  problemCategoryTe?: string;
  possibleDisease: string;
  possibleDiseaseTe: string;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
  affectedRegion: string;
  simpleExplanation?: string;
  simpleExplanationTe?: string;
  rootCause?: string;
  rootCauseTe?: string;
  yieldRisk?: string;
  yieldRiskTe?: string;
  treatmentCostEst?: string;
  treatmentCostEstTe?: string;
  pumpSpecs?: PumpSpecs;
  suggestedProducts?: ProductRecommendation[];
  practicalTips?: string[];
  practicalTipsTe?: string[];
  boundingBoxes: Array<{
    label: string;
    ymin: number;
    xmin: number;
    ymax: number;
    xmax: number;
    color: string;
  }>;
  visibleSymptoms: string[];
  visibleSymptomsTe: string[];
  solutions?: {
    immediateChemical?: Array<{
      name: string;
      nameTe?: string;
      dosage: string;
      dosageTe?: string;
      timing?: string;
      timingTe?: string;
      action?: string;
    }>;
    organicBio?: Array<{
      name: string;
      nameTe?: string;
      dosage: string;
      dosageTe?: string;
      method?: string;
    }>;
    culturalAgronomic?: string[];
    culturalAgronomicTe?: string[];
    soilNutritionRecovery?: string[];
    soilNutritionRecoveryTe?: string[];
  };
  recommendedSteps: string[];
  recommendedStepsTe: string[];
  prevention: string;
  preventionTe: string;
  scannedAt: string;
  source: string;
  disclaimer: string;
}

export interface BuyerOption {
  id: string;
  name: string;
  type: string;
  location: string;
  distanceKm: number;
  offeredPricePerQtl: number;
  quantityQuintals: number;
  grossRevenue: number;
  transportEstimate: number;
  marketCharges: number;
  estimatedNetRevenue: number;
  netReturnPerQuintal: number;
  marketChargesPct: number;
  contact: string;
  source: string;
}

export interface SmartSellingData {
  crop: string;
  decision: 'SELL NOW' | 'WAIT & MONITOR' | 'COMPARE MARKETS';
  badgeColor: string;
  summaryHeadline: string;
  explanation: string;
  teluguExplanation: string;
  whatShouldIDoToday: {
    crop: string;
    headline: string;
    decision: string;
    summary: string;
    summaryTe: string;
    topMarket: string;
    expectedNetReturn: string;
    disclaimer: string;
    timestamp: string;
  };
  metrics: {
    currentPrice: number;
    priceTrendPercent: number;
    demandLevel: string;
    supplyLevel: string;
    marketPressure: string;
    forecastRange: string;
    weatherRisk: string;
    bestNearbyMarket: string;
  };
  weatherSummary: {
    temp: number;
    rainProb: number;
    alertsCount: number;
  };
  buyerComparison: {
    crop: string;
    quantityQuintals: number;
    qualityGrade: string;
    bestOption: BuyerOption;
    recommendation: string;
    disclaimer: string;
    options: BuyerOption[];
    generatedAt: string;
  };
}
