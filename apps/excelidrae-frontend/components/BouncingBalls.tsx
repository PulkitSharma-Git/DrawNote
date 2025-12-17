"use client";

import { useEffect, useRef } from "react";

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  el?: HTMLDivElement;
};

export default function BouncingBalls() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<HTMLDivElement[]>([]);
  const ballsData = useRef<Ball[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const BALL_COUNT = 8;
    const MAX_SPEED = 1.4;
    const GRAVITY = 0.0008;
    const COLORS = [
      "#FF6B6B", // Red
      "#FFD93D", // Yellow
      "#4D96FF", // Blue
      "#FF6FF7", // Pink
      "#FFA500", // Orange
      "#8E44AD", // Purple
      "#00FFFF", // Cyan
    ];

    // Initialize balls with random positions across the container
    ballsData.current = Array.from({ length: BALL_COUNT }).map(() => ({
      x: Math.random() * container.offsetWidth,
      y: Math.random() * container.offsetHeight,
      vx: (Math.random() - 0.5) * MAX_SPEED,
      vy: (Math.random() - 0.5) * MAX_SPEED,
      size: 12 + Math.random() * 18,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let raf: number;

    const animate = () => {
      const bounds = container.getBoundingClientRect();

      ballsData.current.forEach((ball, i) => {
        // Gravity
        ball.vy += GRAVITY;

        // Move
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Edge collision
        if (ball.x <= 0 || ball.x + ball.size >= bounds.width) {
          ball.vx *= -1;
          glow(ballsRef.current[i], ball.color);
        }
        if (ball.y <= 0 || ball.y + ball.size >= bounds.height) {
          ball.vy *= -1;
          glow(ballsRef.current[i], ball.color);
        }

        // Apply transform and style
        const el = ballsRef.current[i];
        if (el) {
          el.style.width = `${ball.size}px`;
          el.style.height = `${ball.size}px`;
          el.style.backgroundColor = ball.color;
          el.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
        }
      });

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-[1] pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) ballsRef.current[i] = el;
          }}
          className="absolute rounded-full blur-[2px] transition-shadow duration-200"
        />
      ))}
    </div>
  );
}

// Glow effect on collision
function glow(el?: HTMLDivElement, color?: string) {
  if (!el || !color) return;
  el.style.boxShadow = `0 0 18px ${color}`;
  setTimeout(() => {
    if (el) el.style.boxShadow = "none";
  }, 150);
}
