import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Agrasen Technologies | IT Consulting & Application Development",
  description:
    "Agrasen Technologies delivers innovative IT consulting, application development on QuickBase & Smartsheet, and strategic business solutions. Based in Orlando, FL with over 15 years of industry experience.",
  keywords: [
    "IT consulting",
    "application development",
    "QuickBase",
    "Smartsheet",
    "Orlando",
    "Florida",
    "web development",
    "business solutions",
    "digital transformation",
    "Agrasen Technologies",
  ],
  openGraph: {
    title: "Agrasen Technologies | IT Consulting & Application Development",
    description:
      "Innovative IT consulting, application development, and strategic business solutions with over 15 years of experience.",
    url: "https://agrasentechnologies.com",
    siteName: "Agrasen Technologies",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agrasen Technologies | IT Consulting & Application Development",
    description:
      "Innovative IT consulting, application development, and strategic business solutions with over 15 years of experience.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
        <script
          type="text/javascript"
          id="hs-script-loader"
          async
          defer
          src="//js-na1.hs-scripts.com/7145941.js"
        />
      </body>
    </html>
  );
}
