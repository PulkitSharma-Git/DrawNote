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
  <div className="
    relative max-w-md mx-auto
    rounded-xl
    bg-white/8 backdrop-blur-xl
    border border-white/15
    shadow-md
  ">
    <div className="flex flex-col gap-5 p-7">

      {/* Heading */}
      <div className="flex flex-col gap-1 text-center">
        <h2 className="
          text-xl font-bold tracking-tight
          text-transparent bg-clip-text
          bg-gradient-to-r
          from-orange-400 via-red-500 to-blue-500
        ">
          Join or Create a Room
        </h2>
        <p className="text-sm text-white/60">
          Create a shared canvas and start collaborating
        </p>
      </div>

      {/* Input */}
      <Input1
        ref={roomRef}
        type="text"
        placeholder="Room name"
        className="
          w-full
          rounded-md
          bg-white/5
          border border-white/20
          px-3 py-2
          text-white
          placeholder-white/40
          focus:border-orange-400/50
          focus:ring-0
        "
      />

      {/* Button */}
      <Button
        onClick={createRoomHandler}
        className="
          w-full rounded-md
          bg-gradient-to-r
          from-orange-400 via-red-500 to-blue-500
          text-white
          font-semibold
          text-sm
          py-2.5
          hover:opacity-90
          transition
        "
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <SiSpinrilla className="animate-spin text-base" />
            Creating…
          </div>
        ) : (
          "Create Room"
        )}
      </Button>

    </div>
  </div>
);

}
