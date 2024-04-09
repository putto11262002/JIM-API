import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { Header } from "../components/header";
import Footer from "../components/footer";

const roboto = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "J.I.M. Modeling Agency",
  description:
    "Elevate your modeling career in Thailand with our premier agency. Join us for diverse opportunities in fashion, commercial, and editorial sectors. Unlock your potential today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body
        className={cn("font-sans antialiased bg-background", roboto.variable)}
      >
        <Header />
        <div className="h-14"></div>
        <main className=" min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
