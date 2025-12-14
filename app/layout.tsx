import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Import styling global (Tailwind)
import Navbar from "@/components/Navbar"; // Import Navbar agar muncul di semua halaman

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eventify - Booking App",
  description: "Aplikasi booking event kampus terbaik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navbar ditaruh di sini agar selalu muncul di atas content */}
        <Navbar />
        
        {/* children adalah halaman yang sedang dibuka (Home, Login, Dashboard, dll) */}
        {children}
      </body>
    </html>
  );
}