import Link from "next/link";
import { Button } from "~/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <h2 className="mb-2 text-2xl font-bold">404 - Page Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="default">Go home</Button>
          </Link>
          <Link href="/github">
            <Button variant="outline">View analytics</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
