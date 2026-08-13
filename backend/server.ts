import app from "./src/app.js";
import { ENV } from "./src/common/config/env.js";

const server = app.listen(ENV.PORT, () => {
  console.log(`🚀 NeuroTrace Dyslexia API running on http://localhost:${ENV.PORT}`);
  console.log(`📡 Environment: ${ENV.NODE_ENV}`);
  console.log(`🔗 Allowed Client: ${ENV.CLIENT_URL}`);
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing HTTP server...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, closing HTTP server...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});
