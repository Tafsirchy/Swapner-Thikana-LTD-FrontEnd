import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompareBar from "@/components/shared/CompareBar";
import PushNotificationManager from "@/components/shared/PushNotificationManager";
import StructuredData from "@/components/seo/StructuredData";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { AuthProvider } from "@/context/AuthContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "shwapner Thikana Ltd - Your Dream Address",
  description: "Excellence in luxury real estate. Find your dream home with shwapner Thikana Ltd.",
  openGraph: {
    title: "shwapner Thikana Ltd",
    description: "Excellence in luxury real estate.",
    url: "https://shwapner-thikana.com",
    siteName: "shwapner Thikana Ltd",
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
    title: "shwapner Thikana Ltd",
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
      <body className={`${lato.variable} ${playfair.variable} font-sans antialiased text-zinc-100 bg-royal-deep`}>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <AuthProvider>
          <PushNotificationManager>
            <StructuredData type="Organization" />
            <StructuredData type="WebSite" />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <CompareBar />
          </PushNotificationManager>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0F172A',
                color: '#F59E0B',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
