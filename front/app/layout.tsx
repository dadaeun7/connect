import type { Metadata } from "next";
import { AuthProvider } from "../components/provider/AuthProvider";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/ThemeProvider";
import ThemeBtn from "@/components/share/ThemeBtn";

export const metadata: Metadata = {
  title: "connect",
  description: "We Suggest you to Workflows",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
