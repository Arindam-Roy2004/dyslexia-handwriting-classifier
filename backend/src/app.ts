import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import assessmentRoute from "./modules/assessment/assessment.routes.js";
import { errorHandler } from "./common/middleware/error.middleware.js";
import { sanitizeBody } from "./common/middleware/security.middleware.js";
import { isAllowedBrowserOrigin } from "./common/config/origins.js";

const app = express();

app.set("trust proxy", 1);

const helmetMiddleware = typeof helmet === "function" ? helmet : (helmet as any).default || helmet;
app.use(
  helmetMiddleware({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }),
);

// Permissive CORS for smooth Vercel <-> Render communication
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedBrowserOrigin(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive fallback
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());
app.use(sanitizeBody);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "neurotrace-dyslexia-api",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "neurotrace-dyslexia-api",
    message: "NeuroTrace Dyslexia Screening API is operational.",
  });
});

// Core Dyslexia Assessment Module
app.use("/api/assessment", assessmentRoute);

app.use(errorHandler);

export default app;
