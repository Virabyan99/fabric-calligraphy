import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CanvasProvider } from "./context/CanvasContext"; // Import the provider
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap the children with CanvasProvider */}
        <CanvasProvider>{children}</CanvasProvider>
      </body>
    </html>
  );
}
