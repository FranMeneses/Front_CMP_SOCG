import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ApolloProviderWrapper from "@/components/ApolloProviderWrapper";
import { DataProvider } from "@/context/DataContext";
import AuthProvider from "@/components/AuthProvider"; // <-- Importa tu AuthProvider
import ReactQueryProvider from "@/components/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SISTEMA DE PLANIFICACIÓN, CONTROL Y GESTIÓN",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ApolloProviderWrapper>
            <DataProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </DataProvider>
          </ApolloProviderWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  );
}