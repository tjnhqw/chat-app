import type { Metadata } from "next";
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { Inter } from "next/font/google";
import Loading from '~/components/ui/Loading';
import { TooltipProvider } from '~/components/ui/tooltip';
import { ThemeProvider } from '~/components/ui/theme/theme-provider';
import { Toaster } from '~/components/ui/sonner';

import "./globals.css";
import ConvexClientProvider from '~/providers/ConvexClientProvider';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Chat App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkLoading>
              <div className='flex w-screen h-screen items-center justify-center'>
                <Loading size={100} />
              </div>
            </ClerkLoading>
            <ClerkLoaded>

              <TooltipProvider>
                {children}
              </TooltipProvider>
              <Toaster richColors />
            </ClerkLoaded>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
