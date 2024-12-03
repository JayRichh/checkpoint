"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface FooterLink {
  href: string;
  label: string;
  external: boolean;
}

const footerSections: Record<string, FooterLink[]> = {
  social: [
    { href: "https://github.com/jayrichh", label: "GitHub", external: true },
    { href: "https://jayrich.dev", label: "Portfolio", external: true },
  ],
  legal: [
    { href: "/privacy", label: "Privacy", external: false },
    { href: "/terms", label: "Terms", external: false },
  ],
  resources: [
    { href: "https://github.com", label: "GitHub", external: true },
    { href: "/github", label: "Analytics", external: false },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40">
      <div className="w-full max-w-[1920px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {Object.entries(footerSections).map(([section, links]) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              <h3 className="text-sm font-medium text-foreground/80 capitalize">
                {section}
              </h3>
              <div className="flex flex-col gap-2">
                {links.map(({ href, label, external }) => (
                  external ? (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      key={href}
                      href={href}
                      className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  )
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="pt-4 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <span className="text-sm text-foreground/60">
            © {currentYear} Checkpoint by{" "}
            <a
              href="https://jayrich.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              jayrichh
            </a>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground/60">
              Made with precision
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
