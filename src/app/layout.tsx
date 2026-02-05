import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoalStrkr | Football Intelligence",
  description: "Global news and live scores.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      {/* min-h-screen + flex-col is the required foundation */}
      <body className={`${inter.className} min-h-screen flex flex-col bg-white overflow-x-hidden`}>
        <Navbar />
        
        {/* 'flex-grow' ensures this div fills all space above the footer */}
        <main className="flex-grow w-full">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}