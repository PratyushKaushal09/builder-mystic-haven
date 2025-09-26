import React, { useEffect, useRef, useState } from "react";

// Simple Pac-Man style game using canvas. Responsive and embeddable.
// Features: maze, dots, 4 ghosts (basic chase AI), score, lives, game over

type Vec = { x: number; y: number };

type Tile = "#" | "." | " " | "P" | "G";

const MAZE_RAW: string[] = [
  "###################",
  "#........#........#",
  "#.###.##.#.##.###.#",
  "#G#.......P.....#G#",
  "#.###.#.###.#.###.#",
  "#.....#...#.#.....#",
  "###.#.#####.#.#.###",
  "#...#...#...#...#.#",
  "#.#####.#.#####.#.#",
  "#.....G...G.....#.#",
  "#.#####.#.#####.#.#",
  "#.#...#...#...#...#",
  "#.#.#.#####.#.###.#",
  "#.....#...#.#.....#",
  "#.###.#.###.#.###.#",
  "#G#.............#G#",
  "#.###.##.#.##.###.#",
  "#........#........#",
  "###################",
];

const WALL: Tile = "#";
const DOT: Tile = ".";
const EMPTY: Tile = " ";
const PACMAN: Tile = "P";
const GHOST: Tile = "G";

const useAnimationFrame = (cb: (t: number) => void, running: boolean) => {
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (!running) return;
    let start: number | null = null;
    const loop = (t: number) => {
      if (start == null) start = t;
      cb(t - start);
      ref.current = requestAnimationFrame(loop);
    };
    ref.current = requestAnimationFrame(loop);
    return () => {
      if (ref.current != null) cancelAnimationFrame(ref.current);
    };
  }, [cb, running]);
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function manhattan(a: Vec, b: Vec) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export default function PacManGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Maze setup
  const maze = useRef<Tile[][]>([]);
  const cols = MAZE_RAW[0].length;
  const rows = MAZE_RAW.length;
  const tileSizeRef = useRef(16);

  const pacman = useRef({
    pos: { x: 0, y: 0 },
    dir: { x: 1, y: 0 },
    pending: { x: 1, y: 0 },
    speed: 6,
  });
  const ghosts = useRef(
    [] as { id: number; pos: Vec; dir: Vec; speed: number; color: string }[],
  );

  const dotsLeft = useRef(0);

  useEffect(() => {
    const parsed: Tile[][] = [];
    const gs: {
      id: number;
      pos: Vec;
      dir: Vec;
      speed: number;
      color: string;
    }[] = [];
    let p: Vec | null = null;
    let dotCount = 0;

    for (let y = 0; y < rows; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < cols; x++) {
        const ch = MAZE_RAW[y][x] as Tile;
        row.push(ch);
        if (ch === DOT) dotCount++;
        if (ch === PACMAN) p = { x, y };
        if (ch === GHOST)
          gs.push({
            id: gs.length,
            pos: { x, y },
            dir: { x: 1, y: 0 },
            speed: 5.5,
            color: ghostColor(gs.length),
          });
      }
      parsed.push(row);
    }

    // cleanup markers from maze for gameplay
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (parsed[y][x] === PACMAN || parsed[y][x] === GHOST)
          parsed[y][x] = DOT;
      }
    }

    maze.current = parsed;
    dotsLeft.current = dotCount + gs.length; // include replaced markers

    pacman.current.pos = p ?? { x: 1, y: 1 };
    pacman.current.dir = { x: 1, y: 0 };
    pacman.current.pending = { x: 1, y: 0 };

    ghosts.current = gs;
  }, []);

  // Resize observer for responsive canvas
  useEffect(() => {
    // initial size
    if (containerRef.current)
      setContainerWidth(containerRef.current.clientWidth);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver((entries) => {
            for (const e of entries) {
              setContainerWidth(e.contentRect.width);
            }
          })
        : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);
    return () => ro?.disconnect();
  }, []);

  // Input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w")
        pacman.current.pending = { x: 0, y: -1 };
      else if (k === "arrowdown" || k === "s")
        pacman.current.pending = { x: 0, y: 1 };
      else if (k === "arrowleft" || k === "a")
        pacman.current.pending = { x: -1, y: 0 };
      else if (k === "arrowright" || k === "d")
        pacman.current.pending = { x: 1, y: 0 };
      else if (k === "r" && gameOver) restart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver]);

  function ghostColor(i: number) {
    const colors = ["#ff4d4f", "#00e5ff", "#ff77ff", "#ffa64d"]; // red, cyan, pink, orange
    return colors[i % colors.length];
  }

  function isWall(v: Vec) {
    return maze.current[v.y]?.[v.x] === WALL;
  }

  function passable(v: Vec) {
    return maze.current[v.y]?.[v.x] !== WALL;
  }

  function centerOfTile(pos: Vec) {
    return { x: Math.round(pos.x), y: Math.round(pos.y) };
  }

  function tryTurn(entity: { pos: Vec; dir: Vec; pending: Vec }) {
    const center = { x: Math.round(entity.pos.x), y: Math.round(entity.pos.y) };
    const closeEnough =
      Math.abs(entity.pos.x - center.x) < 0.15 &&
      Math.abs(entity.pos.y - center.y) < 0.15;
    if (!closeEnough) return;
    const ahead = {
      x: center.x + entity.pending.x,
      y: center.y + entity.pending.y,
    };
    if (passable(ahead)) {
      entity.dir = { ...entity.pending };
      entity.pos = { x: center.x, y: center.y };
    }
  }

  function move(entity: { pos: Vec; dir: Vec; speed: number }, dt: number) {
    const next = {
      x: entity.pos.x + entity.dir.x * (dt * entity.speed),
      y: entity.pos.y + entity.dir.y * (dt * entity.speed),
    };
    // collision with walls
    const nextTile = { x: Math.round(next.x), y: Math.round(next.y) };
    if (passable(nextTile)) {
      entity.pos = next;
    } else {
      // try axis-wise movement to slide into center
      const testX = { x: Math.round(next.x), y: Math.round(entity.pos.y) };
      const testY = { x: Math.round(entity.pos.x), y: Math.round(next.y) };
      if (passable(testX)) entity.pos.x = next.x;
      if (passable(testY)) entity.pos.y = next.y;
    }
  }

  function restart() {
    setScore(0);
    setLives(3);
    setGameOver(false);

    // reset maze dots
    const parsed: Tile[][] = [];
    let dotCount = 0;
    let p: Vec | null = null;
    const gs: {
      id: number;
      pos: Vec;
      dir: Vec;
      speed: number;
      color: string;
    }[] = [];

    for (let y = 0; y < rows; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < cols; x++) {
        let ch = MAZE_RAW[y][x] as Tile;
        if (ch === PACMAN) p = { x, y };
        if (ch === GHOST)
          gs.push({
            id: gs.length,
            pos: { x, y },
            dir: { x: 1, y: 0 },
            speed: 5.5,
            color: ghostColor(gs.length),
          });
        if (ch === PACMAN || ch === GHOST) ch = DOT;
        row.push(ch);
        if (ch === DOT) dotCount++;
      }
      parsed.push(row);
    }

    maze.current = parsed;
    dotsLeft.current = dotCount;
    pacman.current.pos = p ?? { x: 1, y: 1 };
    pacman.current.dir = { x: 1, y: 0 };
    pacman.current.pending = { x: 1, y: 0 };
    ghosts.current = gs;
  }

  useAnimationFrame((elapsed) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || gameOver) return;

    const dt = 1 / 60; // fixed timestep

    // Dynamic tile size
    const tileSize = Math.max(10, Math.floor(containerWidth / cols));
    tileSizeRef.current = tileSize;

    const width = cols * tileSize;
    const height = rows * tileSize;
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }

    // Update
    tryTurn(pacman.current as any);
    move(pacman.current as any, dt);

    // eat dots
    const pTile = {
      x: Math.round(pacman.current.pos.x),
      y: Math.round(pacman.current.pos.y),
    };
    if (maze.current[pTile.y]?.[pTile.x] === DOT) {
      maze.current[pTile.y][pTile.x] = EMPTY;
      dotsLeft.current = Math.max(0, dotsLeft.current - 1);
      setScore((s) => s + 10);
    }

    // ghosts AI
    for (const g of ghosts.current) {
      // try to choose better direction at tile centers
      const center = centerOfTile(g.pos);
      const isCenter =
        Math.abs(g.pos.x - center.x) < 0.1 &&
        Math.abs(g.pos.y - center.y) < 0.1;
      if (isCenter) {
        const options: Vec[] = [
          { x: 1, y: 0 },
          { x: -1, y: 0 },
          { x: 0, y: 1 },
          { x: 0, y: -1 },
        ].filter((d) => !(d.x === -g.dir.x && d.y === -g.dir.y));
        const possible = options.filter((d) =>
          passable({ x: center.x + d.x, y: center.y + d.y }),
        );
        // biased toward Pac-Man
        possible.sort(
          (a, b) =>
            manhattan({ x: center.x + a.x, y: center.y + a.y }, pTile) -
            manhattan({ x: center.x + b.x, y: center.y + b.y }, pTile),
        );
        const rand = Math.random();
        const pick =
          possible[Math.floor(clamp(rand * 3, 0, possible.length - 1))] ||
          g.dir;
        g.dir = pick;
        g.pos = { ...center };
      }
      move(g, dt * 0.98);

      // collision with pacman
      const dx = (g.pos.x - pacman.current.pos.x) * tileSize;
      const dy = (g.pos.y - pacman.current.pos.y) * tileSize;
      const dist = Math.hypot(dx, dy);
      if (dist < tileSize * 0.6) {
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) {
            setGameOver(true);
          }
          return nl;
        });
        // reset positions slightly
        pacman.current.pos = { ...pTile };
        ghosts.current.forEach((gg, i) => {
          const home = MAZE_RAW.flatMap((r, y) =>
            r.split("").map((c, x) => ({ c, x, y })),
          ).find((t) => t.c === "G" && i-- === 0);
          gg.pos = home ? { x: home.x, y: home.y } : { x: 1, y: 1 };
          gg.dir = { x: 1, y: 0 };
        });
      }
    }

    // win condition
    if (dotsLeft.current <= 0) {
      setGameOver(true);
    }

    // Render
    ctx.fillStyle = "#0a0f1f";
    ctx.fillRect(0, 0, width, height);

    // maze
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const t = maze.current[y][x];
        const px = x * tileSize;
        const py = y * tileSize;
        if (t === WALL) {
          ctx.fillStyle = "#0e2a52";
          ctx.fillRect(px, py, tileSize, tileSize);
          ctx.strokeStyle = "#18a4ff";
          ctx.lineWidth = Math.max(2, tileSize * 0.12);
          ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
        } else if (t === DOT) {
          ctx.fillStyle = "#ffd24a";
          const r = Math.max(2, Math.floor(tileSize * 0.12));
          ctx.beginPath();
          ctx.arc(px + tileSize / 2, py + tileSize / 2, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // pac-man
    const mouthPhase = (Math.sin(elapsed / 80) + 1) / 2; // 0..1
    const mouthOpen = 0.1 + mouthPhase * 0.35;
    drawPacman(
      ctx,
      pacman.current.pos,
      pacman.current.dir,
      tileSize,
      mouthOpen,
    );

    // ghosts
    ghosts.current.forEach((g, i) => drawGhost(ctx, g.pos, tileSize, g.color));
  }, !gameOver);

  // draw helpers
  function drawPacman(
    ctx: CanvasRenderingContext2D,
    pos: Vec,
    dir: Vec,
    tile: number,
    open: number,
  ) {
    const cx = pos.x * tile + tile / 2;
    const cy = pos.y * tile + tile / 2;
    const r = tile * 0.45;
    const angle = Math.atan2(dir.y, dir.x);
    const start = angle + open;
    const end = angle - open;
    ctx.fillStyle = "#ffd24a";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end, false);
    ctx.closePath();
    ctx.fill();
    // eye
    ctx.fillStyle = "#1b213b";
    const ex = cx + Math.cos(angle - Math.PI / 2) * r * 0.4;
    const ey = cy + Math.sin(angle - Math.PI / 2) * r * 0.4;
    ctx.beginPath();
    ctx.arc(ex, ey, Math.max(1.5, tile * 0.06), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGhost(
    ctx: CanvasRenderingContext2D,
    pos: Vec,
    tile: number,
    color: string,
  ) {
    const x = pos.x * tile;
    const y = pos.y * tile;
    const w = tile;
    const h = tile;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.6, w * 0.45, Math.PI, 0);
    ctx.lineTo(x + w * 0.95, y + h * 0.95);
    ctx.lineTo(x + w * 0.8, y + h * 0.85);
    ctx.lineTo(x + w * 0.65, y + h * 0.95);
    ctx.lineTo(x + w * 0.5, y + h * 0.85);
    ctx.lineTo(x + w * 0.35, y + h * 0.95);
    ctx.lineTo(x + w * 0.2, y + h * 0.85);
    ctx.lineTo(x + w * 0.05, y + h * 0.95);
    ctx.closePath();
    ctx.fill();

    // eyes
    ctx.fillStyle = "#fff";
    const eyeR = Math.max(2, tile * 0.1);
    ctx.beginPath();
    ctx.arc(x + w * 0.4, y + h * 0.55, eyeR, 0, Math.PI * 2);
    ctx.arc(x + w * 0.6, y + h * 0.55, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1b213b";
    ctx.beginPath();
    ctx.arc(x + w * 0.45, y + h * 0.55, eyeR * 0.5, 0, Math.PI * 2);
    ctx.arc(x + w * 0.65, y + h * 0.55, eyeR * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // render overlay UI
  const scale = Math.max(0.85, Math.min(1.1, containerWidth / 600));

  return (
    <div ref={containerRef} className="relative w-full pixelated">
      <div className="absolute -inset-2 rounded-xl blur-2xl opacity-60 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 animate-glow" />
      <div className="relative rounded-xl overflow-hidden retro-scanlines">
        <canvas ref={canvasRef} className="w-full h-auto block" />
        <div className="pointer-events-none absolute left-3 top-3 flex gap-3 text-xs md:text-sm">
          <span
            className="inline-flex items-center gap-2 rounded-md bg-black/40 px-3 py-1.5 text-primary font-bold neon-border"
            style={{ transform: `scale(${scale})` }}
          >
            Score: {score}
          </span>
          <span
            className="inline-flex items-center gap-2 rounded-md bg-black/40 px-3 py-1.5 text-accent font-bold neon-border"
            style={{ transform: `scale(${scale})` }}
          >
            Lives: {lives}
          </span>
        </div>
        {gameOver && (
          <div className="absolute inset-0 grid place-items-center bg-black/70">
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-extrabold text-primary text-neon animate-flicker">
                Game Over
              </div>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">
                Press R to Restart
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground/80">
        Use WASD or Arrow Keys
      </div>
    </div>
  );
}
