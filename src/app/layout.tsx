import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import AuthWrapper from "@/components/auth-wrapper";
import { Footer, Header } from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DropSync - Instant File Sharing",
  description: "Secure file sharing through QR codes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Toaster richColors />
            <Footer />
          </ThemeProvider>
        </AuthWrapper>
      </body>
    </html>
  );
}
