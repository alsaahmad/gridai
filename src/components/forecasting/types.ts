// Types for all forecasting data from backend
export interface PredictionData {
  current_load: number;
  predicted_load: number;
  spike_detected?: boolean;
  spike_percent?: number;
  peak_expected?: boolean;
}

export interface RiskData {
  load: number;
  capacity: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  risk_score: number; // 0-100 (% of capacity)
}

export interface BlackoutData {
  probability: number;
  level: string;
}

export interface SustainabilityData {
  renewable_percentage: number;
  predicted_emission: number;
  co2_saved: number;
  reduction_potential: number;
}

export interface SeasonalData {
  month: number;
  peak_season: string;
  monthly_risk_score: number;
  weekly_pattern: string;
}

export interface TheftData {
  current_load: number;
  previous_load: number;
  theft_risk: 'LOW' | 'MEDIUM' | 'HIGH' | string;
}

export interface LiveData {
  timestamp: string;
  zone: string;
  household_load: number;
  solar_generation: number;
  grid_load: number;
  temperature: number;
}

// Aggregated data bundle passed to subsections
export interface ForecastBundle {
  prediction: PredictionData | null;
  risk: RiskData | null;
  blackout?: BlackoutData | null;
  sustain: SustainabilityData | null;
  seasonal?: SeasonalData | null;
  theft: TheftData | null;
  live: LiveData | null;
  lastUpdated: Date | null;
  isLoading: boolean;
  errors: Record<string, string>;
  renewable?: any; // compatibility
}
