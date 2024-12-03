import { ErrorBoundary } from "~/components/error-boundary";
import { Container } from "~/components/ui/Container";

export default function GitHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <Container>
        <div className="min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </Container>
    </ErrorBoundary>
  );
}
