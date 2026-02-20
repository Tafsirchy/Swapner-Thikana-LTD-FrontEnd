import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompareBar from "@/components/shared/CompareBar";
import PushNotificationManager from "@/components/shared/PushNotificationManager";
import StructuredData from "@/components/seo/StructuredData";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { AuthProvider } from "@/context/AuthContext";
import SmoothScroll from "@/components/shared/SmoothScroll";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import NextTopLoader from 'nextjs-toploader';

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "Shwapner Thikana Ltd - Your Dream Address",
  description: "Excellence in luxury real estate. Find your dream home with Shwapner Thikana Ltd.",
  openGraph: {
    title: "Shwapner Thikana Ltd",
    description: "Excellence in luxury real estate.",
    url: "https://shwapner-thikana.com",
    siteName: "Shwapner Thikana Ltd",
    images: [
      {
        url: "https://shwapner-thikana.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shwapner Thikana Ltd",
    description: "Excellence in luxury real estate.",
    images: ["https://shwapner-thikana.com/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://shwapner-thikana.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} font-sans antialiased text-zinc-100 bg-royal-deep`}>
        <NextTopLoader 
          color="#D4AF37"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #D4AF37,0 0 5px #D4AF37"
        />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:p-4 focus:bg-white focus:text-black focus:font-bold focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:shadow-xl transition-transform"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <PushNotificationManager>
            <StructuredData type="Organization" />
            <StructuredData type="WebSite" />
            <ErrorBoundary message="We are unable to load the application. Please refresh or contact support.">
              {/* Fixed elements outside SmoothScroll to prevent stacking context issues */}
              <Navbar />
              
              {/* Only wrap scrollable content in SmoothScroll */}
              <SmoothScroll>
                <main id="main-content" className="min-h-screen">
                  {children}
                </main>
                <Footer />
              </SmoothScroll>
              
              {/* Fixed overlay elements outside scroll wrapper */}
              <CompareBar />
            </ErrorBoundary>
          </PushNotificationManager>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0F172A',
                color: '#F59E0B',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '0px',
                padding: '16px',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
