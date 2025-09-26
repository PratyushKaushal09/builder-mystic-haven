import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

type Props = {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  href?: string | null;
  cta?: string;
  comingSoon?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export function ProjectCard({
  id,
  title,
  subtitle,
  description,
  href,
  cta = "Open",
  comingSoon,
  children,
  className,
}: Props) {
  const isInternal = href && !/^https?:/i.test(href);
  const Wrapper: any =
    href && !comingSoon ? (isInternal ? Link : "a") : ("div" as const);
  const wrapperProps: any =
    href && !comingSoon
      ? isInternal
        ? { to: href }
        : { href, target: "_blank", rel: "noreferrer noopener" }
      : {};

  return (
    <Wrapper
      id={id}
      {...(wrapperProps as any)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card/70 p-5 backdrop-blur transition transform",
        "hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20",
        "neon-border",
        comingSoon ? "opacity-80" : "",
        className,
      )}
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition" />
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-secondary/70">
            {subtitle}
          </div>
          <h3 className="text-xl font-extrabold text-foreground drop-shadow-sm text-neon animate-glow">
            {title}
          </h3>
        </div>
        {!comingSoon && href ? (
          <span className="inline-flex items-center gap-1 text-sm text-secondary group-hover:text-primary transition">
            {cta} <ExternalLink className="size-4" />
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-full px-3 py-1 animate-flicker">
            Coming Soon
          </span>
        )}
      </div>
      {description ? (
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      ) : null}
      {children ? (
        <div className="relative rounded-lg border border-border/60 bg-background/60 p-2 md:p-3">
          {children}
        </div>
      ) : null}
    </Wrapper>
  );
}
