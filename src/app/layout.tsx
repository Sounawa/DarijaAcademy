import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DarijaAcademy - Apprendre le Darija Marocain",
  description:
    "Apprenez le darija marocain avec 12 niveaux progressifs allant de A1 à B1. Mini-cours interactifs, vocabulaire, phrases, grammaire et quiz.",
  keywords: [
    "Darija",
    "Maroc",
    "arabe marocain",
    "apprendre darija",
    "langue marocaine",
    "A1",
    "B1",
  ],
  authors: [{ name: "DarijaAcademy" }],
  openGraph: {
    title: "DarijaAcademy - Apprendre le Darija Marocain",
    description:
      "12 niveaux progressifs pour maîtriser le darija marocain. De l'alphabet aux conversations avancées.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
