// Palette.tsx
"use client";
import { useState } from "react";

const DEFAULT_COLORS = [
  { name: "white", value: "#FFFFFF" },
  { name: "red-500", value: "#EF4444" },
  { name: "green-500", value: "#22C55E" },
  { name: "blue-500", value: "#3B82F6" },
];

interface PaletteProps {
  colors?: { name: string; value: string }[];
  onColorSelect?: (color: string) => void;
  selectedThickness: number;
  onThicknessSelect: (thickness: number) => void;
}

export default function Palette({
  colors = DEFAULT_COLORS,
  onColorSelect,
  selectedThickness,
  onThicknessSelect,
}: PaletteProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0].name);
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

  const handleColorSelect = (name: string) => {
    setSelectedColor(name);
    onColorSelect?.(name);
  };

  return (
    <div
      className="absolute z-50 flex flex-col gap-4 p-3.5 rounded-2xl bg-[#0b0d12]/85 backdrop-blur-md border border-white/10 shadow-2xl shadow-black/60 w-44"
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
        <div className="w-8 h-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors" />
      </div>

      {/* Colors Section */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorSelect(color.name)}
              title={color.name}
              className={`w-7 h-7 rounded-full border-2 transition-all duration-150
                ${
                  selectedColor === color.name
                    ? "border-white scale-110 shadow-lg"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </div>

      {/* Thickness Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl p-1">
          {[
            { label: "Thin", val: 2 },
            { label: "Med", val: 5 },
            { label: "Thick", val: 10 },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => onThicknessSelect(item.val)}
              title={item.label}
              className={`flex items-center justify-center rounded-lg w-10 h-8 transition-all ${
                selectedThickness === item.val
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              <div className="w-6 bg-current rounded-full" style={{ height: `${item.val}px` }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
