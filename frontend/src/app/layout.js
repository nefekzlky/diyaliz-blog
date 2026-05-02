import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '../components/Header';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "Diyaliz Blog",
  description: "Diyaliz deneyimleri ve paylaşımları için minimalist blog",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="tr" 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header /> 
        {children}
      </body>
    </html>
  );
}