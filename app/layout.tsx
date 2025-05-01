import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Figtree } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StoryVoice",
  description: "A podcast platform for creators to share their stories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${plusJakartaSans.variable} ${figtree.variable} font-figtree antialiased bg-slate-100 dark:bg-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
