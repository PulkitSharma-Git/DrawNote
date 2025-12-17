"use client";

import { useEffect, useRef } from "react";

type Shape = {
  type: "circle" | "square" | "triangle";
  size: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotate: number;
  vr: number;
  el?: HTMLDivElement;
  color: string;
  outline: boolean;
};

export default function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement[]>([]);
  const shapesData = useRef<Shape[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const types: Shape["type"][] = ["circle", "square", "triangle"];
    const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF6FF7", "#FFA500", "#8E44AD"];
    const SHAPE_COUNT = 18; // more shapes

    // Get container dimensions
    const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();

    // Initialize shapes across the full container area
    shapesData.current = Array.from({ length: SHAPE_COUNT }).map(() => ({
      type: types[Math.floor(Math.random() * types.length)],
      size: 16 + Math.random() * 64,
      x: Math.random() * containerWidth,
      y: Math.random() * containerHeight,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      rotate: Math.random() * 360,
      vr: (Math.random() - 0.5) * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      outline: Math.random() < 0.5, // 50% chance outline
    }));

    let raf: number;

    const animate = () => {
      const bounds = container.getBoundingClientRect();

      shapesData.current.forEach((shape, i) => {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotate += shape.vr;

        // Bounce off edges
        if (shape.x <= 0 || shape.x + shape.size >= bounds.width) shape.vx *= -1;
        if (shape.y <= 0 || shape.y + shape.size >= bounds.height) shape.vy *= -1;

        const el = shapesRef.current[i];
        if (!el) return;

        const borderWidth = shape.outline ? 2 : 0;
        const bgColor = shape.outline ? "transparent" : shape.color;
        const borderColor = shape.outline ? shape.color : "transparent";

        if (shape.type === "circle") {
          el.style.width = `${shape.size}px`;
          el.style.height = `${shape.size}px`;
          el.style.borderRadius = "50%";
          el.style.backgroundColor = bgColor;
          el.style.border = `${borderWidth}px solid ${borderColor}`;
          el.style.transform = `translate(${shape.x}px, ${shape.y}px) rotate(${shape.rotate}deg)`;
          el.style.filter = "blur(2px)";
        } else if (shape.type === "square") {
          el.style.width = `${shape.size}px`;
          el.style.height = `${shape.size}px`;
          el.style.backgroundColor = bgColor;
          el.style.border = `${borderWidth}px solid ${borderColor}`;
          el.style.transform = `translate(${shape.x}px, ${shape.y}px) rotate(${shape.rotate}deg)`;
          el.style.filter = "blur(1.5px)";
        } else if (shape.type === "triangle") {
          el.style.width = "0";
          el.style.height = "0";
          if (shape.outline) {
            el.style.borderLeft = `${shape.size / 2}px solid transparent`;
            el.style.borderRight = `${shape.size / 2}px solid transparent`;
            el.style.borderBottom = `${shape.size}px solid transparent`;
            el.style.boxShadow = `inset 0 0 0 2px ${shape.color}`;
          } else {
            el.style.borderLeft = `${shape.size / 2}px solid transparent`;
            el.style.borderRight = `${shape.size / 2}px solid transparent`;
            el.style.borderBottom = `${shape.size}px solid ${shape.color}`;
            el.style.boxShadow = "none";
          }
          el.style.transform = `translate(${shape.x}px, ${shape.y}px) rotate(${shape.rotate}deg)`;
          el.style.filter = "blur(1.5px)";
        }
      });

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-[1] pointer-events-none">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) shapesRef.current[i] = el;
          }}
          className="absolute"
        />
      ))}
    </div>
  );
}
