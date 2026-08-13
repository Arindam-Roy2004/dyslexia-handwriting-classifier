export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://frontend-five-flame-71.vercel.app",
];

export function isAllowedBrowserOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }
  // Allow all Vercel preview and production deployments
  if (origin.endsWith(".vercel.app")) {
    return true;
  }
  return false;
}
