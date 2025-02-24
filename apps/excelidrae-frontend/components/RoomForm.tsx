"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { Button } from "@/components/Button";
import { Input1 } from "@/components/Input1";
import { SiSpinrilla } from "react-icons/si";

export function RoomForm() {
  const roomRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function createRoomHandler() {
    if (!roomRef.current || !roomRef.current.value.trim()) {
      alert("Room name cannot be empty");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      console.log(token);
      console.log(roomRef.current.value);

      const response = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: roomRef.current.value },
        { headers: { authorization: token } }
      );

      const roomId = response.data.roomId;
      console.log(roomId);
      router.push(`/canvas/${roomId}`);
    } catch (e) {
      console.log("Failed to create room: ", e);
    }
    setTimeout(() => setLoading(false), 1000);

  }

  return (
    <div className="flex flex-col items-center gap-6 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-lg max-w-md mx-auto">
      {/* Heading */}
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-blue-500">
        Join or Create a Room
      </h2>

      {/* Room Input */}
      <Input1 ref={roomRef} type="text" placeholder="Enter Room Name"/>

      {/* Action Button */}
      <Button onClick={createRoomHandler}>
        {loading ? (
          <div className="flex items-center gap-2">
            <SiSpinrilla className="animate-spin text-2xl" />
            Creating...
          </div>
        ) : (
          "Create Room"
        )}
      </Button>
    </div>
  );
}
