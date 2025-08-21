import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Fahmie Farhan Music | Epic Orchestral & Malay Gamelan Composer",
  description: "Fahmie Farhan is a Malaysian composer specializing in epic orchestral stock music and modern interpretations of Malay gamelan. Discover his cinematic compositions and cultural works.",
  keywords: ["Fahmie Farhan", "composer", "orchestral music", "Malay gamelan", "cinematic music", "epic music", "Malaysian composer", "stock music"],
  authors: [{ name: "Fahmie Farhan Music" }],
  openGraph: {
    title: "Fahmie Farhan Music | Epic Orchestral & Malay Gamelan Composer",
    description: "Discover the cinematic compositions and cultural works of Malaysian composer Fahmie Farhan.",
    url: "https://fahmiefarhan.com",
    siteName: "Fahmie Farhan Music",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fahmie Farhan Music | Epic Orchestral & Malay Gamelan Composer",
    description: "Discover the cinematic compositions and cultural works of Malaysian composer Fahmie Farhan.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cinzel.variable} ${inter.variable} antialiased bg-deep-black text-text-white`}
      >
        {/* Global Particles */}
        <Particles />
        
        <Navigation />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
