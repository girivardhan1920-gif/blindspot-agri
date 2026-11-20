import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  dataGovInApiKey: process.env.DATA_GOV_IN_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  demoMode: process.env.DEMO_MODE === 'true' || false,
  nodeEnv: process.env.NODE_ENV || 'development',
  cacheTtlMs: 15 * 60 * 1000, // 15 minutes
};
