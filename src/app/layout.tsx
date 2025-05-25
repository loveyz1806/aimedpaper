import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "AI医疗论文研究进展交互式仪表盘",
  description: "可视化和探索全球范围内AI在医疗领域学术论文的研究进展",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className={`h-full ${inter.variable}`}>
      <body className={`font-sans h-full antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
