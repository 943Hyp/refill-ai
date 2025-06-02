import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Refill AI - Free AI Image Generation",
  description: "Create stunning AI-generated images in seconds with Refill AI. 100% free, no registration, no login required",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientBody>
          {children}
          <Toaster />
        </ClientBody>
      </body>
    </html>
  );
}
