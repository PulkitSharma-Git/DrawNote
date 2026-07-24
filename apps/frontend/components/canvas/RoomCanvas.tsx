"use client";
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { FaSpinner } from "react-icons/fa";

import { useRouter } from "next/navigation";

type Status = "connecting" | "connected" | "error";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<Status>("connecting");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/signin");
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join_room", roomId }));
      setSocket(ws);
      setStatus("connected");
    };

    ws.onerror = () => setStatus("error");
    ws.onclose = () => setStatus("error");

    return () => {
      ws.close();
    };
  }, [roomId]);

  if (status === "connecting")
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0d12] gap-3">
        <FaSpinner className="text-white/30 text-2xl animate-spin" />
        <p className="text-sm text-white/30">Connecting to room…</p>
      </div>
    );

  if (status === "error")
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0d12] gap-3">
        <p className="text-sm text-red-400">
          Failed to connect. Please refresh or rejoin the room.
        </p>
      </div>
    );

  return <Canvas roomId={roomId} socket={socket!} />;
}
