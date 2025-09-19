import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "./providers/auth-context";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyPost",
  description: "System zgłaszania i recenzowania artykułów naukowych",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="pl">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100`}
      >
      <AuthProvider>
        <NavBar /> {/* NavBar ma dostęp do useAuth */}
        <main className="container mx-auto p-4">{children}</main>
      </AuthProvider>
      </body>
      </html>
  );
}
