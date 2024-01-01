//! FOR SEO PURPOSE.
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Code Flow",
  description:
    "Code Flow is social media platform where you can share your thoughts about coding and discuss about the problem you have!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
