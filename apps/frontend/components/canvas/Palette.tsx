// Pallate.tsx
"use client";
import { useState } from "react";

const DEFAULT_COLORS = [
  { name: "white", value: "#FFFFFF" },
  { name: "red-500", value: "#EF4444" },
  { name: "green-500", value: "#22C55E" },
  { name: "blue-500", value: "#3B82F6" },
];

interface PallateProps {
  colors?: { name: string; value: string }[];
  onColorSelect?: (color: string) => void;
}

export default function Palette({
  colors = DEFAULT_COLORS,
  onColorSelect,
}: PallateProps) {
  const [selected, setSelected] = useState(colors[0].name);
  const [pos, setPos] = useState({ x: 20, y: 100 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX: startX, clientY: startY } = e;
    const { x: startLeft, y: startTop } = pos;

    const onMove = (e: MouseEvent) =>
      setPos({
        x: startLeft + e.clientX - startX,
        y: startTop + e.clientY - startY,
      });

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleSelect = (name: string) => {
    setSelected(name);
    onColorSelect?.(name);
  };

  return (
    <div
      className="absolute z-50 flex flex-col gap-2 p-2.5 rounded-2xl bg-[#0b0d12]/80 backdrop-blur-sm border border-white/10 shadow-xl shadow-black/40"
      style={{
        left: pos.x,
        top: pos.y,
        willChange: "transform",
        transform: `translateZ(0)`,
      }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className="w-full flex justify-center cursor-move pb-1"
      >
        <div className="w-6 h-1 rounded-full bg-white/20" />
      </div>

      {/* Colors */}
      <div className="flex flex-col gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => handleSelect(color.name)}
            title={color.name}
            className={`w-7 h-7 rounded-full border-2 transition-all duration-150
              ${
                selected === color.name
                  ? "border-white scale-110 shadow-lg"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            style={{ backgroundColor: color.value }}
          />
        ))}
      </div>
    </div>
  );
}
