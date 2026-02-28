# ─── Stage 1: Build the React frontend ──────────────────────────────────────
FROM node:20-slim AS frontend-builder

WORKDIR /app

# Copy package files and install Node deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source and build it
COPY . .
RUN npm run build
# Output is at /app/backend/static


# ─── Stage 2: Python backend with Pathway ────────────────────────────────────
FROM python:3.11-slim

# Install system dependencies needed by Pathway's native extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    make \
    libffi-dev \
    libssl-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Copy requirements and install Python packages (including Pathway)
COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the backend source files
COPY backend/ .

# Copy the built frontend static files from Stage 1
COPY --from=frontend-builder /app/backend/static ./static

# Railway assigns $PORT dynamically
ENV PORT=8005
EXPOSE 8005

# Start FastAPI with uvicorn — reads $PORT from environment
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
