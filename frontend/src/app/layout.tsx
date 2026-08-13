import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/store/theme";

export const metadata: Metadata = {
  title: "NeuroTrace AI | Dyslexia Handwriting Screening Platform",
  description:
    "Production Full-Stack Dyslexia Screening and GradCAM Explainability System.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/25 selection:text-foreground">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 min-h-[calc(100vh-3.5rem)]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
