import type { Metadata } from "next";
import { Oswald, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LOGOS } from "@/lib/logos";
import { AuthProvider } from "@/components/providers/auth-provider";

const fontSans = Oswald({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://lcsuplements.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "LC Suplements | Suplementos de alta calidad",
    template: "%s | LC Suplements",
  },
  description:
    "Proteínas, creatinas, vitaminas y suplementos alimenticios de la más alta calidad. Envíos a todo México. Paga con tarjeta, OXXO o transferencia.",
  keywords: [
    "suplementos alimenticios",
    "proteínas",
    "creatina",
    "vitaminas",
    "pre-workout",
    "suplementos México",
    "LC Suplements",
  ],
  authors: [{ name: "LC Suplements" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: APP_URL,
    siteName: "LC Suplements",
    title: "LC Suplements | Suplementos de alta calidad",
    description:
      "Proteínas, creatinas, vitaminas y suplementos alimenticios de la más alta calidad. Envíos a todo México.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LC Suplements | Suplementos de alta calidad",
    description:
      "Proteínas, creatinas, vitaminas y suplementos alimenticios de la más alta calidad. Envíos a todo México.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [{ url: LOGOS.markPng, type: "image/png" }],
    apple: LOGOS.markPng,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        fontSans.variable,
        fontMono.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
