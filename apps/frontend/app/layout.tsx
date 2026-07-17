import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ServerStatusCard from "@/components/ServerStatusCard";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "DrawNote",
  description: "A real-time collaborative whiteboard for teams, creators, and fast-moving ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className={`${jakarta.className} antialiased`}>
        {children}
        <ServerStatusCard />
      </body>
    </html>
  );
}