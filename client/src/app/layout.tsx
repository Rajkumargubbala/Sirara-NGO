import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await axios.get(`${API_URL}/settings`);
    return {
      title: data.globalSeo?.metaTitle || "SITATRA Association | Empowering Communities",
      description: data.globalSeo?.metaDescription || "Official website of SITATRA Association.",
      openGraph: {
        images: [data.globalSeo?.ogImage || "/images/hero-banner.png"],
      },
    };
  } catch (error) {
    return {
      title: "SITATRA Association | Empowering Communities",
      description: "Official website of SITATRA Association.",
    };
  }
}

import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground antialiased transition-colors duration-300`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
