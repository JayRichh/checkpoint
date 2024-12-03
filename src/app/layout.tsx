import localFont from "next/font/local";
import { Inter } from 'next/font/google';
import { headers } from "next/headers";
import { Navigation } from "~/components/Navigation";
import { Footer } from "~/components/Footer";
import { GradientBackground } from "~/components/ui/GradientBackground";
import { Providers } from "~/components/providers";
import { getAppUrl } from "~/utils/env";
import { Metadata } from "next";
import "./globals.css";
import { cn } from "~/utils/cn";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  display: 'swap',
  preload: true,
  adjustFontFallback: "Arial",
});

async function getGitHubClientId() {
  const resolvedHeaders = await headers();
  return resolvedHeaders.get("x-github-client-id") || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
}

export async function generateMetadata(): Promise<Metadata> {
  const appUrl = getAppUrl();
  const clientId = await getGitHubClientId();
  const description = "Track your GitHub commitment and analyze your code contributions.";
  
  return {
    metadataBase: new URL(appUrl),
    title: {
      default: "Checkpoint - GitHub Analytics",
      template: "%s | Checkpoint"
    },
    description,
    applicationName: "Checkpoint",
    keywords: ["GitHub", "Analytics", "Contributions", "Developer", "Dashboard"],
    authors: [{ name: "Checkpoint Team" }],
    openGraph: {
      title: "Checkpoint - GitHub Analytics",
      description,
      url: "./",
      siteName: "Checkpoint",
      images: [{
        url: "og.png",
        width: 1200,
        height: 630,
        alt: "Checkpoint - GitHub Analytics"
      }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Checkpoint - GitHub Analytics",
      description,
      images: ["og.png"],
    },
    other: {
      "github-client-id": clientId
    }
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={cn(
        inter.variable,
        geistMono.variable,
        "antialiased"
      )}
    >
      <body className="font-sans bg-background text-foreground custom-scrollbar min-h-screen overflow-x-hidden">
        <Providers>
          <GradientBackground 
            variant="default" 
            className="fixed inset-0 -z-10"
          />

          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
