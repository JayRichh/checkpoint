import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "GitHub Analytics - Checkpoint",
    description: "View your GitHub contribution analytics and repository statistics.",
    openGraph: {
      title: "GitHub Analytics - Checkpoint",
      description: "View your GitHub contribution analytics and repository statistics.",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/og-github.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "GitHub Analytics - Checkpoint",
      description: "View your GitHub contribution analytics and repository statistics.",
      images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-github.png`],
    },
  };
}
