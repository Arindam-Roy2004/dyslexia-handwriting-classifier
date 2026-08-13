# 🧠 NeuroTrace AI: Dyslexia Handwriting Screening Platform

> **Full-Stack Architecture**: PyTorch ML Vision Engine (`model.py`, `gradcam.py`), TypeScript Express REST API, and Next.js 15 Editorial Interface.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│             Next.js 15 Client (Port 3000)              │
│  - HTML5 Responsive Drawing Canvas                     │
│  - Image Upload & Scanning Surface                     │
│  - Dual-Layer GradCAM Attention Heatmap Viewer         │
│  - Segmented 5-Step Classification Progress Meters     │
│  - Light / Dark Mode Support                           │
└───────────────────────────┬────────────────────────────┘
                            │ (REST API)
                            ▼
┌────────────────────────────────────────────────────────┐
│           Node.js & Express Backend (Port 5001)        │
│  - Joi DTO Validation & Middleware Layer               │
│  - Stroke Telemetry & Jitter Analysis Engine           │
│  - Structured Diagnostic Report Formulator             │
└───────────────────────────┬────────────────────────────┘
                            │ (Inference Bridge)
                            ▼
┌────────────────────────────────────────────────────────┐
│          Python PyTorch ML Engine (`backend/ml/`)      │
│  - `model.py`: EfficientNet-B0 Backbone (3-Class)      │
│  - `preprocessing.py`: Otsu Binarization & SquarePad   │
│  - `gradcam.py`: 2D Gradient Class Activation Mapping  │
│  - `inference.py`: Standardized Inference Runner       │
└────────────────────────────────────────────────────────┘
```

---

## 📂 Modular Project Structure

```
project snbose/
├── backend/
│   ├── ml/                                # Python PyTorch Machine Learning Engine
│   │   ├── model.py                       # EfficientNet-B0 architecture + custom classification head
│   │   ├── preprocessing.py               # ExtractCharacter, NormalizeInk (Otsu), SquarePad
│   │   ├── gradcam.py                     # GradCAM 2D class activation generator
│   │   ├── inference.py                   # PyTorch CLI / JSON inference runner
│   │   └── requirements.txt               # PyTorch, Torchvision, OpenCV, Pillow, NumPy
│   │
│   ├── models/                            # Place trained .pth model weights here
│   │
│   ├── src/                               # TypeScript Express API (OOP & SOLID Patterns)
│   │   ├── app.ts                         # Express server with security, CORS, & route mounting
│   │   ├── common/                        # Middlewares (upload, validate, error, security) & DTOs
│   │   └── modules/
│   │       └── assessment/                # Assessment Controller, Service, & DTOs
│   ├── server.ts
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── frontend/                              # Next.js 15 / React 19 Editorial Frontend
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx                 # Root layout with ThemeProvider
    │   │   ├── page.tsx                   # Centered, symmetrical screening dashboard
    │   │   └── globals.css                # Reference design tokens & custom utility classes
    │   ├── components/
    │   │   ├── navbar.tsx                 # Brand navbar with light/dark toggle
    │   │   ├── footer.tsx                 # Clean editorial footer
    │   │   ├── handwriting-canvas.tsx     # Canvas drawing component with stroke guides
    │   │   ├── file-upload-zone.tsx       # Drag-and-drop worksheet scan uploader
    │   │   ├── heatmap-overlay.tsx        # GradCAM dual-layer explainability viewer
    │   │   └── ui/                        # Card, Button, Badge
    │   ├── store/
    │   │   └── theme.tsx                  # Light / Dark theme context provider
    │   └── lib/
    │       └── api.ts                     # Type-safe API client
    └── package.json
```

---

## 🚀 Running Locally

### 1. Start Backend API
```bash
cd backend
npm install
npm run dev
```
*(Runs on `http://localhost:5001` • Health check: `http://localhost:5001/health`)*

### 2. Start Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:3000`)*

---

## 🎙️ Your Exact Interview Defense Talking Points

> *"The Machine Learning core is implemented in **Python with PyTorch and OpenCV** (`model.py`, `preprocessing.py`, `gradcam.py`), utilizing an EfficientNet-B0 backbone with a custom linear classification head for 3-class handwriting analysis (`Normal`, `Reversal`, `Corrected`). My responsibility was the **Full-Stack & Systems Engineering**: I built the **TypeScript Express API** using Joi DTO validation and SOLID design patterns to manage inference workflows, engineered an **interactive Next.js 15 canvas UI** with dual-layer GradCAM stroke explainability, and containerized the system with Docker."*
