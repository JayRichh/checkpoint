import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { Navigation } from "~/components/Navigation";
import { Providers } from "~/components/providers";
import { getAppUrl } from "~/utils/env";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Checkpoint - GitHub Analytics",
  description: "Track your GitHub commitment and analyze your code contributions.",
  openGraph: {
    title: "Checkpoint - GitHub Analytics",
    description: "Track your GitHub commitment and analyze your code contributions.",
    url: getAppUrl(),
    siteName: "Checkpoint",
    images: [
      {
        url: `${getAppUrl()}/og.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkpoint - GitHub Analytics",
    description: "Track your GitHub commitment and analyze your code contributions.",
    images: [`${getAppUrl()}/og.png`],
  },
};

async function getGitHubClientId() {
  return headers().get("x-github-client-id") || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = await getGitHubClientId();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="github-client-id" content={clientId} />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
