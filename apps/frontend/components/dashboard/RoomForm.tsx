"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FaSpinner } from "react-icons/fa";

type Tab = "create" | "join";

export function RoomForm() {
  const roomRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const value = roomRef.current?.value.trim();

    if (!value) {
      setError(
        tab === "create"
          ? "Room name cannot be empty."
          : "Room ID cannot be empty.",
      );
      return;
    }

    if (tab === "create" && (value.length < 3 || value.length > 20)) {
      setError("Room name must be between 3 and 20 characters long.");
      return;
    }

    setError("");

    // Guard: localStorage.getItem returns null if the user isn't logged in.
    // Without this check, axios sends the literal string "null" as the token,
    // which causes jwt.verify to throw "jwt malformed" → "Failed to create room".
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/signin");
      return;
    }

    setLoading(true);

    try {
      if (tab === "create") {
        // POST /room requires a valid JWT in the Authorization header.
        // The backend middleware will reject the request with 401 if it's missing or invalid.
        const { data } = await axios.post(
          `${HTTP_BACKEND}/room`,
          { name: value },
          { headers: { authorization: token } },
        );

        router.push(`/canvas/${data.roomId}`);
      } else {
        // Join flow: validate the room ID is a number before hitting the API
        const numericId = Number(value);

        if (isNaN(numericId)) {
          setError("Room ID must be a valid number.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(`${HTTP_BACKEND}/room/${numericId}`);

        if (!data.room) {
          setError("Room not found.");
          setLoading(false);
          return;
        }

        router.push(`/canvas/${data.room.id}`);
      }
    } catch {
      setError(
        tab === "create"
          ? "Failed to create room."
          : "Error checking room.",
      );
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30 p-8 space-y-6">
      {/* Tabs */}
      <div className="flex rounded-xl bg-white/[0.04] border border-white/10 p-1">
        {(["create", "join"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setError("");
              if (roomRef.current) roomRef.current.value = "";
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${tab === t ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
          >
            {t === "create" ? "Create Room" : "Join Room"}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          {tab === "create" ? "Create a new room" : "Join an existing room"}
        </h2>
        <p className="text-sm text-white/40">
          {tab === "create"
            ? "Start a shared canvas and invite your team"
            : "Enter the room ID to jump straight in"}
        </p>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <Input
          ref={roomRef}
          type="text"
          placeholder={tab === "create" ? "Room name" : "Room ID"}
          disabled={loading}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      {/* CTA */}
      <Button
        onClick={handleSubmit}
        className="w-full h-11 disabled:opacity-60"
      >
        {loading ? (
          <FaSpinner className="animate-spin" />
        ) : tab === "create" ? (
          "Create Room →"
        ) : (
          "Join Room →"
        )}
      </Button>
    </div>
  );
}
