import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-brand-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-semibold">AI Student Support</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Fast, reliable academic guidance for students at Institution Name.
          </p>
        </div>
        <FooterColumn
          title="Product"
          links={[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how" },
            { label: "FAQs", href: "#faqs" },
          ]}
        />
        <FooterColumn
          title="Support"
          links={[
            { label: "Student Support", href: "/help", internal: true },
            { label: "FAQs", href: "/faqs", internal: true },
            { label: "Contact Support", href: "/help", internal: true },
          ]}
        />
        <FooterColumn
          title="Legal"
          links={[
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Use", href: "#" },
            { label: "Accessibility", href: "#" },
          ]}
        />
      </div>
      <div className="border-t">
        <div className="container-page py-5 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© 2026 AI-Powered Student Support System</span>
          <span>Institution Name</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; internal?: boolean }[];
}) {
  return (
    <div>
      <div className="text-sm font-medium">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) =>
          l.internal ? (
            <li key={l.label}>
              <Link to={l.href} className="hover:text-foreground">
                {l.label}
              </Link>
            </li>
          ) : (
            <li key={l.label}>
              <a href={l.href} className="hover:text-foreground">
                {l.label}
              </a>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
