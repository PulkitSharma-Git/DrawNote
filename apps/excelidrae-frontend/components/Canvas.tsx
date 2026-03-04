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

export type Tool = "circle" | "rect" | "pencil" | "line" | "text" | "move" | "diamond";
export type Color = "red-500" | "green-500" | "blue-500" | "white";

const TOOLS: { id: Tool; icon: React.ReactNode; label: string }[] = [
  { id: "rect",    icon: <FaRegSquare className="size-5" />,    label: "Rectangle" },
  { id: "circle",  icon: <FaRegCircle className="size-5" />,    label: "Circle"    },
  { id: "diamond", icon: <BsDiamond className="size-5" />,      label: "Diamond"   },
  { id: "pencil",  icon: <GiStraightPipe className="size-5" />, label: "Pencil"    },
  { id: "line",    icon: <GoDash className="size-5" />,         label: "Line"      },
  { id: "text",    icon: <IoText className="size-5" />,         label: "Text"      },
  { id: "move",    icon: <BiMove className="size-5" />,         label: "Move"      },
];

export function Canvas({ socket, roomId }: { socket: WebSocket; roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selected, setSelected] = useState<Tool>("circle");
  const [selectColor, setselectColor] = useState<Color>("white");

  // Init game
  useEffect(() => {
    if (!canvasRef.current) return;
    const g = new Game(canvasRef.current, roomId, socket);
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
    </div>
  );
}