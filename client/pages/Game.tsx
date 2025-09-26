import React from "react";
import PacManGame from "@/components/PacManGame";
import { AppLayout } from "@/components/Layout";
import { Link } from "react-router-dom";

export default function Game() {
  return (
    <AppLayout>
      <section className="container py-10 md:py-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-neon animate-glow">
              Charminar Game
            </h1>
            <p className="text-muted-foreground mt-2">
              Use WASD or Arrow Keys. Press R to restart after Game Over.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 neon-border hover:-translate-y-0.5 transition"
          >
            ← Back Home
          </Link>
        </div>
        <div className="grid">
          <PacManGame />
        </div>
      </section>
    </AppLayout>
  );
}
