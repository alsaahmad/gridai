export interface MapZone {
  zone: string;
  lat: number;
  lon: number;       // backend uses 'lon' (not 'long')
  load: number;
  solar: number;
  renewable_percentage: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  theft_risk: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  color: string;
}

export interface LiveData {
  timestamp: string;
  zone: string;
  household_load: number;
  solar_generation: number;
  grid_load: number;
  temperature: number;
}

export interface SustainabilityData {
  renewable_percentage: number;
  co2_saved: number;
}
