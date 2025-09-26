import React from "react";
import { ProjectCard } from "@/components/ProjectCard";
import PacManGame from "@/components/PacManGame";

export default function Index() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur bg-background/60 border-b">
        <div className="container flex h-16 items-center justify-between">
          <a href="#top" className="text-2xl font-extrabold tracking-tight text-primary text-neon animate-glow">Charminar Family</a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#predicts" className="hover:text-primary transition">Predicts</a>
            <a href="#events" className="hover:text-primary transition">Events</a>
            <a href="#game" className="hover:text-primary transition">Game</a>
          </nav>
        </div>
      </header>

      <main id="top" className="">
        {/* Hero */}
        <section className="relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_20%_20%,hsla(var(--primary),0.15),transparent),radial-gradient(40%_40%_at_80%_0%,hsla(var(--accent),0.15),transparent)]" />
          <div className="container py-16 md:py-24">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-neon animate-glow">
                  Welcome to <span className="text-primary">Charminar Family</span>
                </h1>
                <p className="mt-4 text-muted-foreground max-w-prose">
                  Three interactive blocks — a live project, a coming-soon experience, and a fully playable retro Pac-Man inspired game. Designed to be responsive, fast, and professional with bold, arcade-style energy.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm text-xs md:text-sm">
                  <div className="rounded-lg border px-3 py-2 neon-border bg-background/70">Dev Patel</div>
                  <div className="rounded-lg border px-3 py-2 neon-border bg-background/70">Hana parvez</div>
                  <div className="rounded-lg border px-3 py-2 neon-border bg-background/70">Pratyush Kaushal</div>
                  <div className="rounded-lg border px-3 py-2 neon-border bg-background/70">Shiven Mahajan</div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-secondary/10 to-accent/20 blur-2xl rounded-3xl animate-flicker" />
                <div className="relative aspect-[4/3] rounded-3xl border neon-border bg-card/60 grid place-items-center">
                  <div className="text-center p-6">
                    <div className="text-7xl md:text-8xl animate-bounce select-none">🕹️</div>
                    <div className="mt-3 text-sm text-muted-foreground">Arcade vibes, modern build</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="predicts" className="container py-10 md:py-14">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <ProjectCard
              title="Charminar Predicts"
              subtitle="Live Project"
              description="Explore predictions and insights. Deployed and ready."
              href="https://charminarpredicts.netlify.app/"
              cta="Open"
            />

            <ProjectCard
              id="events"
              title="Charminar Events"
              subtitle="Coming Soon"
              description="Stay tuned for upcoming events and experiences."
              href={null}
              comingSoon
            />

            <ProjectCard
              id="game"
              title="Charminar Game"
              subtitle="Pac-Man (Retro)"
              description="Classic Pac-Man style maze with dots, 4 ghosts, score, and lives. Responsive and embeddable."
              href={null}
            >
              <PacManGame />
            </ProjectCard>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-8 text-xs text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} Charminar Family</span>
          <span className="opacity-80">Built with love for arcade classics</span>
        </div>
      </footer>
    </div>
  );
}
