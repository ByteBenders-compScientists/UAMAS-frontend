import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import LayoutController from "@/components/LayoutController";
import { ThemeProvider } from "@/context/ThemeContext";

const outfit = Outfit({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  variable: "--font-outfit",
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
      <body className={`${outfit.variable} font-sans antialiased`}>
        <ThemeProvider>
          <LayoutController>{children}</LayoutController>
        </ThemeProvider>
      </body>
    </html>
  );
}