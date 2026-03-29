import type { Metadata } from "next";
import { Readex_Pro } from "next/font/google";
import "./globals.css";


const readexPro = Readex_Pro({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Queens",
  description: "Practice LinkedIn Queens puzzles.",
  applicationName: "Queens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${readexPro.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
