import type { Metadata } from "next";
import { AuthProvider } from "../components/provider/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "connect",
  description: "We Suggest you to Workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`font-gothic h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
