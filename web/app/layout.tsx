import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLUBA — Beyond Heat. Defined by Origin.",
  description:
    "Single-origin whole dried chilies. Labeled by region, species, and harvest year. Each pod reflects soil, altitude, and drying method.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
