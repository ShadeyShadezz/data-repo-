// layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Agentic Data Quality",
  description: "Lightweight client-first data quality analysis",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="site-header">
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 700, color: "var(--color-text)" }}>
              Agentic Data Quality
            </div>

            {/* NAVIGATION */}
            <nav className="flex space-x-3">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Home
              </Link>

              <Link
                href="/upload"
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Upload
              </Link>

              <Link
                href="/preview"
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Preview
              </Link>

              <Link
                href="/results"
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Results
              </Link>

              <Link
                href="/insights"
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Insights
              </Link>
            </nav>
          </div>
        </header>

        <main className="main">
          <div className="container">{children}</div>
        </main>
      </body>
    </html>
  );
}
