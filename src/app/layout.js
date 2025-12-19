import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import ThemeProvider from "@/components/providers/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "MathMentor AI - Your Personal AI Mathematics Tutor",
  description: "Master mathematics with AI-powered guidance. Snap problems, get Socratic hints, and learn step-by-step from Grade 1 to College.",
  keywords: ["math tutor", "AI education", "mathematics learning", "online tutoring", "calculus", "algebra"],
  openGraph: {
    title: "MathMentor AI - Your Personal AI Mathematics Tutor",
    description: "Master mathematics with AI-powered guidance. Snap problems, get Socratic hints, and learn step-by-step.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
