import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoalStrkr | Pro Intelligence",
  description: "Global football analysis and live scores.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#111F35] text-white`}>
        <Navbar />
        
        {/* CHANGED: Increased padding to 'pt-32' to fix the header cut-off */}
        <main className="flex-grow w-full pt-32">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}