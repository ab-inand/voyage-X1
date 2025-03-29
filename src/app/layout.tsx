import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/ui/Footer";
import BackToEarth from "@/components/ui/BackToEarth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoyageX - Explore Beyond Reality",
  description: "Next-generation travel platform with immersive 3D experiences and AI-powered recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}>
        <main className="flex-grow">
          {children}
        </main>
        <div className="relative">
          <BackToEarth />
          <Footer />
        </div>
      </body>
    </html>
  );
}
