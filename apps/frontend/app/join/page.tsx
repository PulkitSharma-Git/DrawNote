"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import PageLayout from "@/components/PageLayout";
import { RoomForm } from "@/components/RoomForm";
import Rooms from "@/components/Rooms";
import Room from "@/components/Room";
import { HTTP_BACKEND } from "@/config";

interface RoomType {
  id: string;
  slug: string;
}

type Status = "loading" | "error" | "success";

export default function JoinPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/signin"); return; }

    axios
      .get(`${HTTP_BACKEND}/getRooms`, { headers: { Authorization: token } })
      .then(({ data }) => { setRooms(data.rooms ?? []); setStatus("success"); })
      .catch(() => setStatus("error"));
  }, []);

  const renderRooms = () => {
    if (status === "loading") return (
      <div className="flex justify-center py-16">
        <FaSpinner className="text-white/40 text-2xl animate-spin" />
      </div>
    );
    if (status === "error") return (
      <p className="text-center text-sm text-red-400 py-10">Failed to fetch rooms. Please try again.</p>
    );
    if (rooms.length === 0) return (
      <p className="text-center text-sm text-white/30 py-10">No rooms yet — create one above to get started.</p>
    );
    return (
      <Rooms>
        {rooms.map((room) => (
          <Room
            key={room.id}
            roomId={room.id}
            roomname={room.slug}
            onClick={() => router.push(`/canvas/${room.id}`)}
          />
        ))}
      </Rooms>
    );
  };

  return (
    <PageLayout>
      <div className="pt-24 pb-20">
        {/* Room Form */}
        <section className="mb-12 flex justify-center">
          <RoomForm />
        </section>

        {/* Rooms List */}
        <section className="max-w-6xl mx-auto px-6">
          <h2 className="text-lg font-semibold text-white/80 mb-6">Your Rooms</h2>
          {renderRooms()}
        </section>
      </div>
    </PageLayout>
  );
}