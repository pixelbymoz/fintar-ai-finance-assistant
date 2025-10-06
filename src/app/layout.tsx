import type { Metadata } from "next";
import { Open_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import GlobalChatLauncher from "@/components/GlobalChatLauncher";
import { Analytics } from "@vercel/analytics/next";

const openSans = Open_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fintar",
  description: "AI-powered business finance tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${openSans.variable} ${geistMono.variable} antialiased`}>
          {children}
          <GlobalChatLauncher />
          <Analytics />
          <Toaster
            position="top-center"
            closeButton
            richColors
            offset={12}
            toastOptions={{
              classNames: {
                toast: "sm:max-w-[420px] max-w-[95vw]",
                title: "text-foreground",
                description: "text-muted-foreground",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
