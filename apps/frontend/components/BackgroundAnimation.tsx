"use client";
import { useEffect, useRef } from "react";

const COLORS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF6FF7", "#FFA500", "#8E44AD"];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

// ── Types ──────────────────────────────────────────────────────────────────────

type Ball = {
  x: number; y: number;
  vx: number; vy: number;
  size: number; color: string;
};

type ShapeType = "circle" | "square" | "triangle";
type Shape = {
  type: ShapeType;
  size: number;
  x: number; y: number;
  vx: number; vy: number;
  rotate: number; vr: number;
  color: string; outline: boolean;
};

// ── Constants ──────────────────────────────────────────────────────────────────

const BALL_COUNT = 8;
const SHAPE_COUNT = 18;
const GRAVITY = 0.0008;
const SHAPE_TYPES: ShapeType[] = ["circle", "square", "triangle"];

// ── Glow on collision ──────────────────────────────────────────────────────────

function flashGlow(el: HTMLDivElement, color: string) {
  el.style.boxShadow = `0 0 16px ${color}`;
  setTimeout(() => { el.style.boxShadow = "none"; }, 150);
}

// ── Style appliers (called once on init for static props) ─────────────────────

function initBallEl(el: HTMLDivElement, ball: Ball) {
  el.style.position = "absolute";
  el.style.borderRadius = "50%";
  el.style.filter = "blur(2px)";
  el.style.backgroundColor = ball.color;
  el.style.width = `${ball.size}px`;
  el.style.height = `${ball.size}px`;
}

function initShapeEl(el: HTMLDivElement, shape: Shape) {
  el.style.position = "absolute";
  const { type, size, color, outline } = shape;
  const fill = outline ? "transparent" : color;
  const border = outline ? `2px solid ${color}` : "none";

  if (type === "circle") {
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.borderRadius = "50%";
    el.style.backgroundColor = fill;
    el.style.border = border;
    el.style.filter = "blur(2px)";
  } else if (type === "square") {
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.backgroundColor = fill;
    el.style.border = border;
    el.style.filter = "blur(1.5px)";
  } else {
    el.style.width = "0";
    el.style.height = "0";
    el.style.borderLeft = `${size / 2}px solid transparent`;
    el.style.borderRight = `${size / 2}px solid transparent`;
    el.style.borderBottom = outline ? `${size}px solid transparent` : `${size}px solid ${color}`;
    if (outline) el.style.boxShadow = `inset 0 0 0 2px ${color}`;
    el.style.filter = "blur(1.5px)";
  }
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function BackgroundAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballEls = useRef<HTMLDivElement[]>([]);
  const shapeEls = useRef<HTMLDivElement[]>([]);
  const balls = useRef<Ball[]>([]);
  const shapes = useRef<Shape[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let bounds = container.getBoundingClientRect();
    const onResize = () => { bounds = container.getBoundingClientRect(); };
    window.addEventListener("resize", onResize);

    // Init balls
    balls.current = Array.from({ length: BALL_COUNT }, () => ({
      x: rand(0, bounds.width),
      y: rand(0, bounds.height),
      vx: rand(-0.7, 0.7),
      vy: rand(-0.7, 0.7),
      size: rand(12, 30),
      color: pick(COLORS),
    }));
    balls.current.forEach((b, i) => initBallEl(ballEls.current[i]!, b));

    // Init shapes
    shapes.current = Array.from({ length: SHAPE_COUNT }, () => ({
      type: pick(SHAPE_TYPES),
      size: rand(16, 80),
      x: rand(0, bounds.width),
      y: rand(0, bounds.height),
      vx: rand(-0.75, 0.75),
      vy: rand(-0.75, 0.75),
      rotate: rand(0, 360),
      vr: rand(-1, 1),
      color: pick(COLORS),
      outline: Math.random() < 0.5,
    }));
    shapes.current.forEach((s, i) => initShapeEl(shapeEls.current[i]!, s));

    let raf: number;

    const animate = () => {
      // Balls
      balls.current.forEach((ball, i) => {
        ball.vy += GRAVITY;
        ball.x += ball.vx;
        ball.y += ball.vy;
        const el = ballEls.current[i]!;
        if (ball.x <= 0 || ball.x + ball.size >= bounds.width) { ball.vx *= -1; flashGlow(el, ball.color); }
        if (ball.y <= 0 || ball.y + ball.size >= bounds.height) { ball.vy *= -1; flashGlow(el, ball.color); }
        el.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
      });

      // Shapes
      shapes.current.forEach((shape, i) => {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotate += shape.vr;
        if (shape.x <= 0 || shape.x + shape.size >= bounds.width) shape.vx *= -1;
        if (shape.y <= 0 || shape.y + shape.size >= bounds.height) shape.vy *= -1;
        shapeEls.current[i]!.style.transform = `translate(${shape.x}px, ${shape.y}px) rotate(${shape.rotate}deg)`;
      });

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-[1] pointer-events-none">
      {Array.from({ length: BALL_COUNT }, (_, i) => (
        <div key={`ball-${i}`} ref={(el) => { if (el) ballEls.current[i] = el; }} />
      ))}
      {Array.from({ length: SHAPE_COUNT }, (_, i) => (
        <div key={`shape-${i}`} ref={(el) => { if (el) shapeEls.current[i] = el; }} />
      ))}
    </div>
  );
}