import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bizness - Intelligent MSME OS",
  description: "Operating System for MSMEs combining POS, Inventory, AI Analytics, and Multi-business management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


