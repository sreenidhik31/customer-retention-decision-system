import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Retention Decision System",
  description: "Churn intervention app built with Next.js and FastAPI",
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