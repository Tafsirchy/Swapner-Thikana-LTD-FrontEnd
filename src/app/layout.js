import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Swapner Thikana Ltd | Premium Real Estate Development",
  description: "Bangladesh's most trusted real estate company. Discover luxury properties, premium apartments, and development projects across Dhaka with Swapner Thikana Ltd.",
  keywords: "swapner thikana, real estate bangladesh, luxury properties dhaka, premium apartments, real estate development, property investment",
  authors: [{ name: "Swapner Thikana Ltd" }],
  openGraph: {
    title: "Swapner Thikana Ltd | Premium Real Estate",
    description: "Your trusted partner in finding dream properties",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
