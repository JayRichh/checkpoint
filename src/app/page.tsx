import { Badge } from "../components/ui/Badge";
import { Container } from "../components/ui/Container";
import { Text } from "../components/ui/Text";
import { HomeActions } from "../components/HomeActions";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background-secondary">
      <Container>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,hsl(var(--brand)/0.1)_0%,transparent_100%)]" />
          
          <div className="relative max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Text 
                variant="h1" 
                gradient="primary"
              >
                Track Your GitHub Commitment
              </Text>
              <Text variant="body-lg" className="text-foreground-secondary max-w-2xl mx-auto">
                Visualize your GitHub activity, analyze code contributions, and track your development journey.
                Connect with GitHub to see your personalized dashboard.
              </Text>
            </div>
            <HomeActions />
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Contribution Analytics",
                description: "Interactive visualization of your GitHub activity with detailed contribution calendars."
              },
              {
                title: "Language Insights",
                description: "Comprehensive breakdown of programming languages across repositories."
              },
              {
                title: "Real-time Sync",
                description: "Always up-to-date with your latest GitHub activity and contributions."
              },
              {
                title: "Code Analytics",
                description: "Track lines of code, file counts, and project composition metrics."
              },
              {
                title: "Secure Access",
                description: "OAuth integration with GitHub for safe and secure data access."
              },
              {
                title: "Profile Sharing",
                description: "Share your GitHub stats and achievements with customizable public profiles."
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-background/80 border border-border/50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-background"
              >
                <Text variant="h3" className="text-foreground mb-2">
                  {feature.title}
                </Text>
                <Text variant="body" className="text-foreground-secondary">
                  {feature.description}
                </Text>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="pb-20">
          <div className="bg-background/80 border border-border/50 rounded-full py-4 px-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {["Next.js 15", "GitHub OAuth", "TypeScript", "Tailwind CSS", "Framer Motion"].map((tech) => (
                <Badge 
                  key={tech}
                  variant="secondary" 
                  size="md"
                  className="bg-background/80 hover:bg-background transition-colors duration-300"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
