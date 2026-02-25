const API_BASE_URL = 'http://localhost:8005';

export async function fetchMapData() {
  const response = await fetch(`${API_BASE_URL}/map`);
  return response.json();
}

export async function fetchWeatherData() {
  const response = await fetch(`${API_BASE_URL}/weather`);
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}

export async function fetchLiveData() {
  const response = await fetch(`${API_BASE_URL}/live-data`);
  return response.json();
}

/**
 * Aggregates data from multiple backend endpoints to satisfy the ForecastBundle structure
 * expected by the AIForecasting page.
 */
export async function fetchPredictions() {
  const [predRes, riskRes, sustainRes, liveRes] = await Promise.all([
    fetch(`${API_BASE_URL}/predictions`).then(r => r.json()),
    fetch(`${API_BASE_URL}/risk`).then(r => r.json()),
    fetch(`${API_BASE_URL}/sustainability`).then(r => r.json()),
    fetch(`${API_BASE_URL}/live-data`).then(r => r.json()),
  ]);

  return {
    prediction: {
      current_load: predRes.current_load ?? 0,
      predicted_load: predRes.predicted_load ?? 0,
      spike_detected: (predRes.predicted_load / predRes.current_load) > 1.2,
    },
    risk: {
      load: predRes.current_load ?? 0,
      capacity: 200, // Matching backend default
      risk_level: riskRes.risk_level ?? 'LOW',
      risk_score: (riskRes.risk_score ?? 0) * 100, // assume score is decimal from pathway
    },
    sustainability: {
      renewable_percentage: sustainRes.renewable_percentage ?? 0,
      co2_saved: (predRes.current_load ?? 0) * 0.45, // realistic mock estimation
      predicted_emission: (predRes.predicted_load ?? 0) * 0.52,
    },
    live: liveRes,
    lastUpdated: new Date().toISOString()
  };
}

export async function fetchRiskData() {
  const response = await fetch(`${API_BASE_URL}/risk`);
  return response.json();
}

export async function fetchAlerts() {
  const response = await fetch(`${API_BASE_URL}/alerts`);
  return response.json();
}

export async function fetchSustainability() {
  const response = await fetch(`${API_BASE_URL}/sustainability`);
  return response.json();
}

export async function fetchTheftData() {
  const response = await fetch(`${API_BASE_URL}/theft`);
  return response.json();
}

// ─── AI Forecasting backend (port 8005) ──────────────────────────────────────

async function safeJsonFetch(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchPredictionV2() {
  return fetchPredictions();
}

export async function fetchForecastV2() {
  return fetchPredictions();
}

export async function fetchLatestSnapshot() {
  return fetchLiveData();
}
