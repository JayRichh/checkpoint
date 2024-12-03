import type { Metadata } from "next";
import { getAppUrl } from "~/utils/env";

export const metadata: Metadata = {
  title: "GitHub Analytics - Checkpoint",
  description: "View your GitHub contribution analytics and repository statistics.",
  openGraph: {
    title: "GitHub Analytics - Checkpoint",
    description: "View your GitHub contribution analytics and repository statistics.",
    images: [
      {
        url: `${getAppUrl()}/og-github.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Analytics - Checkpoint",
    description: "View your GitHub contribution analytics and repository statistics.",
    images: [`${getAppUrl()}/og-github.png`],
  },
};
