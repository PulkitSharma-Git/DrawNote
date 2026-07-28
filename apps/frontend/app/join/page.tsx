"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PageLayout from "@/components/layout/PageLayout";
import Rooms from "@/components/dashboard/Rooms";
import Room from "@/components/dashboard/Room";
import RoomSkeleton from "@/components/dashboard/RoomSkeleton";
import EmptyState from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import NewRoomModal from "@/components/dashboard/NewRoomModal";
import { HTTP_BACKEND } from "@/config";

interface RoomType {
  id: string | number;
  slug: string;
}

type Status = "loading" | "error" | "success";

export default function JoinPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/signin");
      return;
    }

    axios
      .get(`${HTTP_BACKEND}/getRooms`, { headers: { Authorization: token } })
      .then(({ data }) => {
        setRooms(data.rooms ?? []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [router]);

  const handleDeleteRoom = async (roomId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${HTTP_BACKEND}/room/${roomId}`, {
        headers: { Authorization: token },
      });
      setRooms((prev) => prev.filter((r) => String(r.id) !== String(roomId)));
    } catch (e) {
      console.error("Failed to delete room:", e);
      alert("Failed to delete room. Please try again.");
    }
  };

  const renderRooms = () => {
    if (status === "loading")
      return (
        <Rooms>
          {Array.from({ length: 6 }).map((_, idx) => (
            <RoomSkeleton key={idx} />
          ))}
        </Rooms>
      );
    if (status === "error")
      return (
        <p className="text-center text-sm text-red-400 py-10">
          Failed to fetch rooms. Please try again.
        </p>
      );
    if (rooms.length === 0)
      return <EmptyState />;
    return (
      <Rooms>
        {rooms.map((room) => (
          <Room
            key={room.id}
            roomId={String(room.id)}
            roomname={room.slug}
            onClick={() => router.push(`/canvas/${room.id}`)}
            onDelete={handleDeleteRoom}
          />
        ))}
      </Rooms>
    );
  };

  return (
    <PageLayout>
      <div className="pt-28 pb-20 max-w-6xl mx-auto px-6 relative z-10">
        {/* Header & Actions */}
        <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Your Rooms
          </h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="!py-2.5 !px-5 text-sm"
          >
            <span className="text-base font-bold mr-1">+</span> New Room
          </Button>
        </div>


        {/* Rooms List */}
        <section>{renderRooms()}</section>

        {/* New Room Modal */}
        <NewRoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </PageLayout>
  );
}
