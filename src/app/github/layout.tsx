import { Metadata } from "next";
import { ErrorBoundary } from "~/components/error-boundary";
import { Container } from "~/components/ui/Container";
import { Suspense } from "react";
import { LoadingState } from "~/components/loading-state";

export const metadata: Metadata = {
  title: "GitHub Analytics",
  description: "View your GitHub activity, contributions, and development insights.",
  openGraph: {
    title: "GitHub Analytics | Checkpoint",
    description: "View your GitHub activity, contributions, and development insights.",
    images: [{
      url: "og.png",
      width: 1200,
      height: 630,
      alt: "GitHub Analytics Dashboard"
    }],
  },
  twitter: {
    title: "GitHub Analytics | Checkpoint",
    description: "View your GitHub activity, contributions, and development insights.",
    images: ["og.png"],
  }
};

export default function GitHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <Container size="ultra" className="py-8 md:py-12">
        <div className="min-h-[calc(100vh-5rem)]">
          <Suspense fallback={<LoadingState />}>
            {children}
          </Suspense>
        </div>
      </Container>
    </ErrorBoundary>
  );
}
