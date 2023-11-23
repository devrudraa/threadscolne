import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "@/styles/globals.css";
import Providers from "@/lib/providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-dark-1 dark text-white min-h-screen`}
      >
        <NextTopLoader color="#877EFF" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
