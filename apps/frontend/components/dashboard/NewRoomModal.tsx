"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FaSpinner } from "react-icons/fa";
import CustomModal from "../ui/CustomModal";

interface NewRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "create" | "join";

export default function NewRoomModal({ isOpen, onClose }: NewRoomModalProps) {
  const roomRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [tab, setTab] = useState<TabType>("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTabChange = (targetTab: TabType) => {
    setTab(targetTab);
    setError("");
    if (roomRef.current) {
      roomRef.current.value = "";
    }
  };

  const handleClose = () => {
    setError("");
    if (roomRef.current) {
      roomRef.current.value = "";
    }
    onClose();
  };

  async function handleSubmit(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }

    const value = roomRef.current?.value.trim();
    if (!value) {
      setError(
        tab === "create"
          ? "Room name cannot be empty."
          : "Room ID cannot be empty.",
      );
      return;
    }
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/signin");
      return;
    }

    setLoading(true);

    try {
      if (tab === "create") {
        const { data } = await axios.post(
          `${HTTP_BACKEND}/room`,
          { name: value },
          { headers: { authorization: token } },
        );
        router.push(`/canvas/${data.roomId}`);
      } else {
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
        tab === "create" ? "Failed to create room." : "Error checking room.",
      );
      setLoading(false);
    }
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create or Join Room"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="grid grid-cols-2 rounded-xl bg-white/[0.04] border border-white/10 p-1">
          <button
            type="button"
            onClick={() => handleTabChange("create")}
            className={`py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              tab === "create"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("join")}
            className={`py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              tab === "join"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            Join
          </button>
        </div>

        {/* Tab Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {tab === "create" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Room Name
                </label>
                <Input
                  ref={roomRef}
                  type="text"
                  placeholder="e.g. Team Planning"
                  disabled={loading}
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" className="w-full h-11 disabled:opacity-60">
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Create Room"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Room ID
                </label>
                <Input
                  ref={roomRef}
                  type="text"
                  placeholder="e.g. 42"
                  disabled={loading}
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" className="w-full h-11 disabled:opacity-60">
                {loading ? <FaSpinner className="animate-spin" /> : "Join Room"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </CustomModal>
  );
}
