import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motion — AI Life Coach",
  description: "Your AI-powered life coach. Goals, calendar, and clarity in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
