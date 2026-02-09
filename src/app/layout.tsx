import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese" as any],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin", "vietnamese" as any],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "vietnamese" as any],
});

export const metadata: Metadata = {
  title: "FinTrack - Quản lý tài chính cá nhân",
  description: "Hệ thống quản lý thu chi chuyên nghiệp và hiệu quả.",
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${roboto.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
