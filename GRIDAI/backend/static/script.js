const API_BASE = window.location.origin;

// Chart instance
let loadChart;
const maxDataPoints = 20;
const chartData = {
    labels: [],
    datasets: [{
        label: 'Grid Load (kW)',
        data: [],
        borderColor: '#00f2ff',
        backgroundColor: 'rgba(0, 242, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0
    }]
};

function initChart() {
    const ctx = document.getElementById('loadChart').getContext('2d');
    loadChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: false },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#a0a0a0' }
                }
            },
            plugins: {
                legend: { display: false }
            },
            animation: { duration: 0 }
        }
    });
}

function updateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleString();
}

async function fetchWeather() {
    try {
        const response = await fetch(`${API_BASE}/weather`);
        const data = await response.json();
        
        const widget = document.getElementById('weather-widget');
        if (data.error) {
            widget.innerHTML = `<span style="color: grey">Weather unavailable</span>`;
            return;
        }
        
        widget.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px">
                <span>📍 ${data.city}</span>
                <span>🌡️ ${data.temperature}°C</span>
                <span style="text-transform: capitalize">☁️ ${data.weather}</span>
                <span>💧 ${data.humidity}%</span>
            </div>
        `;
    } catch (e) {
        console.error("Weather fetch failed", e);
    }
}

async function updateDashboard() {
    try {
        // Fetch Parallel
        const [liveRes, predRes, riskRes, sustRes, mapRes, alertRes] = await Promise.all([
            fetch(`${API_BASE}/live-data`),
            fetch(`${API_BASE}/predictions`),
            fetch(`${API_BASE}/risk`),
            fetch(`${API_BASE}/sustainability`),
            fetch(`${API_BASE}/map`),
            fetch(`${API_BASE}/alerts`)
        ]);

        const live = await liveRes.json();
        const pred = await predRes.json();
        const risk = await riskRes.json();
        const sust = await sustRes.json();
        const map = await mapRes.json();
        const alerts = await alertRes.json();

        // Update stats
        document.getElementById('load-value').textContent = `${live.grid_load} kW`;
        document.getElementById('solar-value').textContent = `${live.solar_generation} kW`;
        document.getElementById('prediction-value').textContent = pred.predicted_load;
        document.getElementById('renewable-percent').textContent = sust.renewable_percentage;
        document.getElementById('co2-value').textContent = sust.co2_saved;
        
        const riskEl = document.getElementById('risk-level');
        riskEl.textContent = risk.risk_level;
        riskEl.className = `stat-value ${risk.risk_level}`;
        document.getElementById('risk-score').textContent = `Score: ${risk.risk_score}/100`;

        // Update Chart
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        
        chartData.labels.push(timeStr);
        chartData.datasets[0].data.push(live.grid_load);
        
        if (chartData.labels.length > maxDataPoints) {
            chartData.labels.shift();
            chartData.datasets[0].data.shift();
        }
        loadChart.update();

        // Update Zones
        const zoneList = document.getElementById('zone-list');
        zoneList.innerHTML = map.map(zone => `
            <div class="zone-item">
                <span class="zone-dot" style="background: ${zone.color}"></span>
                <span class="zone-name">${zone.zone}</span>
                <span class="zone-load">${zone.load} kW</span>
            </div>
        `).join('');

        // Update Alerts
        const alertsContainer = document.getElementById('alerts-container');
        const alertBadge = document.getElementById('alert-badge');
        
        if (alerts.alerts && alerts.alerts.length > 0) {
            alertBadge.textContent = alerts.alerts.length;
            alertBadge.style.display = 'block';
            alertsContainer.innerHTML = alerts.alerts.map(a => `
                <div class="alert-item">
                    <span>${a}</span>
                </div>
            `).join('');
        } else {
            alertBadge.style.display = 'none';
            alertsContainer.innerHTML = '<div class="no-alerts">No active threats detected. System is stable.</div>';
        }

    } catch (e) {
        console.error("Dashboard update failed", e);
    }
}

// Initialize
initChart();
updateTime();
fetchWeather();
setInterval(updateTime, 1000);
setInterval(updateDashboard, 2000);
setInterval(fetchWeather, 300000); // 5 min
updateDashboard();
