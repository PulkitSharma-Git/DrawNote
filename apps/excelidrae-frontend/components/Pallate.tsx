import { useState } from "react";

interface PallateProps {
  colors?: { name: string; value: string }[];
  onColorSelect?: (color: string) => void;
}

export default function Pallate({
  colors = [
    { name: "red-500", value: "#EF4444" },
    { name: "green-500", value: "#22C55E" },
    { name: "blue-500", value: "#3B82F6" },
    { name: "white", value: "#FFFFFF" }
  ],
  onColorSelect,
}: PallateProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 20, y: 100 });

  // Drag logic attached only to this handle
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = pos.x;
    const startTop = pos.y;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({
        x: startLeft + e.clientX - startX,
        y: startTop + e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleSelect = (colorName: string) => {
    setSelected(colorName);
    if (onColorSelect) onColorSelect(colorName);
  };

  return (
    <div
      className="absolute flex flex-col items-center gap-2 p-3 rounded-2xl
                 backdrop-blur-md bg-white/20 border border-white/30 shadow-xl"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Drag handle (invisible or small bar at the top) */}
      <div
        className="w-full h-4 cursor-move mb-1"
        onMouseDown={handleMouseDown}
      />

      {/* Color circles */}
      <div className="flex items-center gap-2">
        {colors.map((color) => (
          <div
            key={color.name}
            onClick={() => handleSelect(color.name)}
            className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
              selected === color.name ? "border-white" : "border-transparent"
            }`}
            style={{ backgroundColor: color.value }}
          />
        ))}
      </div>
    </div>
  );
}
