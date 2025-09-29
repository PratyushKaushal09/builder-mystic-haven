import React from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { AppLayout } from "@/components/Layout";

export default function Index() {
  return (
    <AppLayout>
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_20%_20%,hsla(var(--primary),0.15),transparent),radial-gradient(40%_40%_at_80%_0%,hsla(var(--accent),0.15),transparent)]" />
        <div className="container py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-neon animate-glow">
                Welcome to{" "}
                <span className="text-primary">Charminar Family</span>
              </h1>
              <p className="mt-4 text-muted-foreground max-w-prose">
                Three interactive blocks — a live project, a coming-soon
                experience, and a fully playable retro Pac-Man inspired game.
                Designed to be responsive, fast, and professional with bold,
                arcade-style energy.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm text-xs md:text-sm">
                <div className="rounded-lg border px-3 py-2 neon-border bg-background/70">
                  Dev Patel
                </div>
                <div className="rounded-lg border px-3 py-2 neon-border bg-background/70">
                  Hana parvez
                </div>
                <div className="rounded-lg border px-3 py-2 neon-border bg-background/70">
                  Pratyush Kaushal
                </div>
                <div className="rounded-lg border px-3 py-2 neon-border bg-background/70">
                  Shiven Mahajan
                </div>
              </div>
              <div className="mt-6">
                <a
                  href="/game"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 font-semibold shadow-[0_0_25px_hsla(var(--primary),0.35)] hover:brightness-110 transition animate-floaty"
                >
                  Play Pac‑Man
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-secondary/10 to-accent/20 blur-2xl rounded-3xl animate-flicker" />
              <div className="relative aspect-[4/3] rounded-3xl border neon-border bg-card/60 grid place-items-center">
                <div className="text-center p-6">
                  <div className="text-7xl md:text-8xl animate-bounce select-none">
                    🕹️
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    Arcade vibes, modern build
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            subtitle="Live Project"
            description="Discover upcoming events and experiences."
            href="https://zenith-space-charminar-events.netlify.app/"
            cta="Open"
          />

          <ProjectCard
            id="game"
            title="Charminar Game"
            subtitle="Pac-Man (Retro)"
            description="Classic Pac-Man style maze with dots, 4 ghosts, score, and lives."
            href="/game"
            cta="Play"
          />
        </div>
      </section>
    </AppLayout>
  );
}
