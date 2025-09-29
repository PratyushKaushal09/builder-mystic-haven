import { ProjectCard } from "@/components/ProjectCard";
import { AppLayout } from "@/components/Layout";

export default function Index() {
  return (
    <AppLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_20%_20%,hsla(var(--primary),0.15),transparent),radial-gradient(40%_40%_at_80%_0%,hsla(var(--accent),0.15),transparent)]" />
        <div className="container py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                Welcome to <span className="text-primary">Charminar</span>
              </h1>
              <p className="mt-4 text-muted-foreground max-w-prose">
                Welcome to Charminar — a modern, data-driven experience blending
                clean design with real-time predictions and events.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm text-xs md:text-sm">
                <div className="rounded-lg border px-3 py-2 neon-border bg-background/70">
                  Dev Patel
                </div>
                <div className="rounded-lg border px-3 py-2 neon-border bg-background/70">
                  Hana Parvez
                </div>
                <div className="rounded-lg border px-3 py-2 neon-border bg-background/70">
                  Pratyush Kaushal
                </div>
                <div className="rounded-lg border px-3 py-2 neon-border bg-background/70">
                  Shiven Mahajan
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 items-center">
                <a
                  href="#predicts"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 font-semibold shadow-sm hover:brightness-110 transition"
                >
                  Explore
                </a>
                <a
                  href="/#events"
                  className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 neon-border hover:-translate-y-0.5 transition"
                >
                  Events
                </a>
                <audio
                  loop
                  preload="none"
                  src="https://cdn.pixabay.com/audio/2021/09/02/audio_36f2d2f9f0.mp3?filename=wind-ambient-6424.mp3"
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="relative">
              <div
                className="absolute -inset-6 blur-2xl rounded-3xl animate-flicker"
                style={{
                  backgroundImage:
                    "linear-gradient(to right top, rgba(255, 229, 61, 0.2), rgba(0, 225, 255, 0.1), rgba(255, 77, 166, 0.2))",
                }}
              />
              <div className="relative aspect-square md:aspect-[4/3] rounded-3xl border neon-border bg-card/60 overflow-hidden grid place-items-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F4c67ae0c37e44840ae94a8f6987e9980%2F39f585d43bb34501811c6b832f28f516?format=webp&width=800"
                  alt="Charminar illustration"
                  className="w-full h-full object-contain md:object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        {/* wind overlay */}
        <div className="wind-flow animate-wind" />
        {/* moving waves */}
        <div className="pointer-events-none absolute -bottom-1 left-0 right-0 h-24 opacity-60">
          <div
            className="absolute inset-x-0 bottom-6 h-10 animate-wave-right"
            aria-hidden
          >
            <svg
              className="w-[200%] h-full"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C150,60 350,60 600,0 C850,-60 1050,-60 1200,0 L1200,120 L0,120 Z"
                fill="hsl(var(--secondary) / 0.22)"
              />
            </svg>
          </div>
          <div
            className="absolute inset-x-0 bottom-0 h-10 animate-wave-right-slow"
            aria-hidden
          >
            <svg
              className="w-[200%] h-full"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C150,60 350,60 600,0 C850,-60 1050,-60 1200,0 L1200,120 L0,120 Z"
                fill="hsl(var(--accent) / 0.16)"
              />
            </svg>
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
        </div>
      </section>
    </AppLayout>
  );
}
