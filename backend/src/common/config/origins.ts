const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
];

export function isAllowedBrowserOrigin(origin: string): boolean {
  if (DEFAULT_ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  const customClientUrl = process.env.CLIENT_URL;
  if (customClientUrl && origin === customClientUrl) {
    return true;
  }

  // Allow vercel / preview origins in non-strict development
  if (origin.endsWith(".vercel.app") || origin.includes("localhost")) {
    return true;
  }

  return false;
}
