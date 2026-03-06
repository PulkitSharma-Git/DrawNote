"use client";
import { Game } from "@/draw/Game";
import { useEffect, useRef, useState } from "react";
import { BarButton } from "./BarButton";
import { Bar } from "./Bar";
import Palette from "./Palette";
import { FaRegCircle, FaRegSquare } from "react-icons/fa";
import { GiStraightPipe } from "react-icons/gi";
import { GoDash } from "react-icons/go";
import { IoText } from "react-icons/io5";
import { BiMove } from "react-icons/bi";
import { BsDiamond } from "react-icons/bs";
import { MousePointer2, Eraser } from "lucide-react";

export type Tool = "circle" | "rect" | "pencil" | "line" | "text" | "move" | "diamond" | "select" | "eraser";
export type Color = "red-500" | "green-500" | "blue-500" | "white";

const TOOLS: { id: Tool; icon: React.ReactNode; label: string }[] = [
  { id: "select",  icon: <MousePointer2 className="size-5" />, label: "Select"    },
  { id: "rect",    icon: <FaRegSquare className="size-5" />,     label: "Rectangle" },
  { id: "circle",  icon: <FaRegCircle className="size-5" />,     label: "Circle"    },
  { id: "diamond", icon: <BsDiamond className="size-5" />,       label: "Diamond"   },
  { id: "pencil",  icon: <GiStraightPipe className="size-5" />,  label: "Pencil"    },
  { id: "line",    icon: <GoDash className="size-5" />,          label: "Line"      },
  { id: "text",    icon: <IoText className="size-5" />,          label: "Text"      },
  { id: "move",    icon: <BiMove className="size-5" />,          label: "Pan"       },
  { id: "eraser",  icon: <Eraser className="size-5" />,        label: "Eraser"    },
];

export function Canvas({ socket, roomId }: { socket: WebSocket; roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selected, setSelected] = useState<Tool>("circle");
  const [selectColor, setselectColor] = useState<Color>("white");
  const [zoom, setZoom] = useState(1);

  // Init game
  useEffect(() => {
    if (!canvasRef.current) return;
    const g = new Game(canvasRef.current, roomId, socket);
    g.onZoomChange = (z) => setZoom(z);
    setGame(g);
    return () => g.destroy();
  }, [roomId, socket]);

  // Sync tool + color
  useEffect(() => {
    game?.setTool(selected);
    game?.setColor(selectColor);
  }, [selected, selectColor, game]);

  // Resize canvas to fill viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b0d12]">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <Bar>
        {TOOLS.map(({ id, icon, label }) => (
          <BarButton
            key={id}
            icon={icon}
            label={label}
            activate={selected === id}
            onClick={() => setSelected(id)}
          />
        ))}
      </Bar>

      <Palette onColorSelect={(color) => setselectColor(color as Color)} />

      {/* Zoom UI */}
      <div className="absolute bottom-4 left-4 z-50 flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-[#0b0d12]/80 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/40">
        <button 
          className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 text-white/40 hover:text-white/80 hover:bg-white/10 font-bold"
          onClick={() => game?.setZoom(Math.max(0.1, zoom - 0.1))}
          title="Zoom Out"
        >
          -
        </button>
        <div 
           className="px-1 text-sm select-none cursor-pointer text-white/60 hover:text-white transition-colors w-12 text-center font-medium font-mono"
           onClick={() => game?.setZoom(1)}
           title="Reset Zoom"
        >
          {Math.round(zoom * 100)}%
        </div>
        <button 
          className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 text-white/40 hover:text-white/80 hover:bg-white/10 font-bold"
          onClick={() => game?.setZoom(Math.min(5, zoom + 0.1))}
          title="Zoom In"
        >
          +
        </button>
      </div>

    </div>
  );
}