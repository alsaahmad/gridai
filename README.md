# ⚡ GridAI Central

AI-powered Smart Grid Monitoring & Forecasting Platform — real-time energy intelligence built with **Pathway**, **FastAPI**, and **React + Vite**.

---

## 🏗️ Architecture

```
Browser (React + Vite : 8080)
        ↕  REST / polling every 5 s
FastAPI Backend (port 8005)
        ↕
Pathway Streaming Engine (background thread)
        ↕
Mock Data Generator → /live-data, /map, /sustainability, /predictions, /risk
```

---

## 📂 Project Structure

```
abcd/
├── backend/              ← FastAPI + Pathway (Python)
│   ├── main.py           ← FastAPI app, CORS, routes
│   ├── stream.py         ← Pathway worker + mock data generator
│   ├── prediction.py     ← Load prediction logic
│   ├── risk.py           ← Risk score calculation
│   ├── sustainability.py ← CO₂ / renewable metrics
│   ├── map.py            ← Zone map data
│   ├── weather.py        ← OpenWeatherMap integration
│   ├── theft.py          ← Theft detection logic
│   └── requirements.txt  ← Python dependencies
├── src/                  ← React frontend (Vite + TypeScript)
│   ├── pages/            ← Landing, Dashboard, Monitoring, AI Forecasting …
│   ├── components/       ← UI components (monitoring, forecasting, layout)
│   ├── context/          ← AuthContext (mock auth for prototype)
│   ├── hooks/            ← useRealtimeData (aggregates backend data)
│   └── services/         ← apiService.ts (all fetch calls to port 8005)
├── start-all.ps1         ← One-command launch script (Windows + WSL)
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| WSL 2 | Ubuntu-24.04 |
| Python | 3.12 (inside WSL) |

### 1 — Install backend dependencies (WSL)

```bash
# Inside WSL Ubuntu-24.04
cd /mnt/c/Users/<you>/path/to/abcd/backend
python3 -m venv venv_wsl
./venv_wsl/bin/pip install -r requirements.txt
```

### 2 — Install frontend dependencies (Windows)

```powershell
npm install
```

### 3 — Run everything

```powershell
npm run dev:all
```

This opens two processes:
- **Backend** → WSL: `http://localhost:8005`
- **Frontend** → Vite: `http://localhost:8080`

---

## 🔌 Backend API Endpoints

| Endpoint | Description |
|---|---|
| `GET /live-data` | Latest Pathway-processed grid snapshot |
| `GET /predictions` | Current + predicted load |
| `GET /risk` | Risk score & level (HIGH / MEDIUM / LOW) |
| `GET /sustainability` | Renewable % + CO₂ saved |
| `GET /map` | Zone-level map data (4 Delhi zones) |
| `GET /alerts` | Active grid alerts |
| `GET /weather` | OpenWeatherMap data |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + TypeScript + Vite
- Tailwind CSS + custom glassmorphism design system
- Framer Motion animations
- Recharts (charts) + React-Leaflet (map)
- Lucide React icons

**Backend**
- FastAPI + Uvicorn
- **Pathway** — real-time streaming & processing engine
- Python threading for background generator → Pathway → API

---

## 📊 Key Features

- 🔴 **Live Pathway Stream** — real-time grid data processed through Pathway pipelines
- 🗺️ **Interactive Zone Map** — 4 Delhi grid zones with risk color coding
- 🤖 **AI Forecasting** — predicted load, spike detection, risk scoring
- 🌿 **Sustainability Metrics** — renewable %, CO₂ savings
- 🔐 **Auth** — prototype mock auth (no backend required)
- 📱 **Responsive** — works on all screen sizes

---

## ⚠️ Notes

- Pathway requires **Linux** (Python 3.10–3.12). Use WSL on Windows.
- The `backend_old/` folder is an archived version — do not modify.
- Weather uses OpenWeatherMap API (key configured in `weather.py`).
