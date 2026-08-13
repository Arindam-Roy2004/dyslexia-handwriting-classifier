FROM node:20-bookworm-slim AS base

# Install Python 3, pip, and required system libraries for OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Stage 1: Build TypeScript backend
FROM base AS builder

COPY backend/package*.json backend/tsconfig.json ./
RUN npm ci

COPY backend/src ./src
COPY backend/server.ts ./
RUN npm run build

# Stage 2: Production Runner
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

# Install Python ML dependencies (CPU PyTorch for fast build & low memory footprint)
COPY backend/ml/requirements.txt ./ml/
RUN pip3 install --no-cache-dir --break-system-packages \
    torch torchvision --index-url https://download.pytorch.org/whl/cpu \
    && pip3 install --no-cache-dir --break-system-packages \
    opencv-python-headless pillow numpy

COPY backend/package*.json ./
RUN npm ci --only=production

# Copy compiled backend code, ML scripts, and models
COPY --from=builder /app/dist ./dist
COPY backend/ml ./ml
COPY backend/models ./models

EXPOSE 5001

CMD ["node", "dist/server.js"]
