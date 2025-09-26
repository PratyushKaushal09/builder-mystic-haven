import React from "react";
import { Link, NavLink } from "react-router-dom";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur bg-background/60 border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary text-neon animate-glow">Charminar Family</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="/#predicts" className="hover:text-primary transition">Predicts</a>
            <a href="/#events" className="hover:text-primary transition">Events</a>
            <NavLink to="/game" className={({isActive}) => (isActive ? "text-primary" : "hover:text-primary transition")}>Game</NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="container py-8 text-xs text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} Charminar Family</span>
          <span className="opacity-80">Built with love for arcade classics</span>
        </div>
      </footer>
    </div>
  );
}
