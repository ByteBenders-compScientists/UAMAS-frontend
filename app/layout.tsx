import type { Metadata } from "next";
import { Funnel_Display } from "next/font/google";
import "./globals.css";
import LayoutController from "@/components/LayoutController";
import { ThemeProvider } from "@/context/ThemeContext";

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-funnel-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Intellimark",
  description:
    "An AI-powered platform for lecturers and students in universities and colleges to enhance CTL and student engagement with automated assessment and performance tracking.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${funnelDisplay.variable} ${funnelDisplay.className} antialiased`}>
        <ThemeProvider>
          <LayoutController>{children}</LayoutController>
        </ThemeProvider>
      </body>
    </html>
  );
}