//! FOR SEO PURPOSE AND NONINFRINGEMENT.
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import ProviderAuth from "@/lib/ProviderAuth";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProviderAuth>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ProviderAuth>
  );
}
