// API Client connecting to the backend endpoints

const API_BASE = '/api';

export async function getLiveWeather(lat: number, lon: number, crop: string) {
  const res = await fetch(`${API_BASE}/weather?lat=${lat}&lon=${lon}&crop=${encodeURIComponent(crop)}`);
  if (!res.ok) throw new Error('Failed to fetch weather');
  return res.json();
}

export async function getMarketPrices(params: { crop?: string; state?: string; district?: string; market?: string } = {}) {
  const q = new URLSearchParams();
  if (params.crop) q.append('crop', params.crop);
  if (params.state) q.append('state', params.state);
  if (params.district) q.append('district', params.district);
  if (params.market) q.append('market', params.market);
  const res = await fetch(`${API_BASE}/market/prices?${q.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch market prices');
  return res.json();
}

export async function getAllCropsPrices(params: { crop?: string; state?: string; district?: string; category?: string; search?: string } = {}) {
  const q = new URLSearchParams();
  if (params.crop) q.append('crop', params.crop);
  if (params.state) q.append('state', params.state);
  if (params.district) q.append('district', params.district);
  if (params.category) q.append('category', params.category);
  if (params.search) q.append('search', params.search);
  const res = await fetch(`${API_BASE}/market/all-crops-prices?${q.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch all crop prices');
  return res.json();
}

export async function addOrUpdateAdminPrice(priceData: any) {
  const res = await fetch(`${API_BASE}/admin/prices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(priceData)
  });
  if (!res.ok) throw new Error('Failed to update price');
  return res.json();
}

export async function deleteAdminPrice(id: string) {
  const res = await fetch(`${API_BASE}/admin/prices/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete price');
  return res.json();
}

export async function triggerAdminSync() {
  const res = await fetch(`${API_BASE}/admin/sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to trigger sync');
  return res.json();
}

export async function getAdminOverview() {
  const res = await fetch(`${API_BASE}/admin/overview`);
  if (!res.ok) throw new Error('Failed to fetch admin overview');
  return res.json();
}

export async function getPriceTrends(crop: string, days: number = 30) {
  const res = await fetch(`${API_BASE}/market/trends?crop=${encodeURIComponent(crop)}&days=${days}`);
  if (!res.ok) throw new Error('Failed to fetch price trends');
  return res.json();
}

export async function getDemandSupplyAnalysis(crop: string) {
  const res = await fetch(`${API_BASE}/market/demand-supply?crop=${encodeURIComponent(crop)}`);
  if (!res.ok) throw new Error('Failed to fetch demand/supply analysis');
  return res.json();
}

export async function getSeasonalAnalysis(crop: string) {
  const res = await fetch(`${API_BASE}/market/seasonal?crop=${encodeURIComponent(crop)}`);
  if (!res.ok) throw new Error('Failed to fetch seasonal analysis');
  return res.json();
}

export async function getPriceForecast(crop: string, weatherRisk: string = 'low') {
  const res = await fetch(`${API_BASE}/market/forecast?crop=${encodeURIComponent(crop)}&weatherRisk=${weatherRisk}`);
  if (!res.ok) throw new Error('Failed to fetch price forecast');
  return res.json();
}

export async function getNearbyBuyers(crop: string, lat: number, lon: number) {
  const res = await fetch(`${API_BASE}/buyers/nearby?crop=${encodeURIComponent(crop)}&lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Failed to fetch nearby buyers');
  return res.json();
}

export async function compareBuyersApi(payload: { crop: string; quantityQuintals: number; quality: string; lat: number; lon: number }) {
  const res = await fetch(`${API_BASE}/buyers/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to compare buyers');
  return res.json();
}

export async function getSmartSellingRecommendation(params: { crop: string; quantity: number; quality: string; lat: number; lon: number; hasColdStorage?: boolean }) {
  const q = new URLSearchParams({
    crop: params.crop,
    quantity: String(params.quantity),
    quality: params.quality,
    lat: String(params.lat),
    lon: String(params.lon),
    hasColdStorage: String(params.hasColdStorage || false)
  });
  const res = await fetch(`${API_BASE}/recommendation/sell-smart?${q.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch selling recommendation');
  return res.json();
}

export async function analyzeCropImage(formData: FormData) {
  const res = await fetch(`${API_BASE}/vision/analyze`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to analyze crop image');
  return res.json();
}

export async function getScanHistory() {
  const res = await fetch(`${API_BASE}/vision/history`);
  if (!res.ok) throw new Error('Failed to fetch scan history');
  return res.json();
}

export async function askAssistant(payload: { query: string; language: string; crop: string; lat: number; lon: number }) {
  const res = await fetch(`${API_BASE}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to contact assistant');
  return res.json();
}

export async function getCropProfiles() {
  const res = await fetch(`${API_BASE}/crops`);
  if (!res.ok) throw new Error('Failed to fetch crop profiles');
  return res.json();
}

export async function getDataSources() {
  const res = await fetch(`${API_BASE}/sources`);
  if (!res.ok) throw new Error('Failed to fetch data sources');
  return res.json();
}
