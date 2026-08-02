"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PageLayout from "@/components/layout/PageLayout";
import Rooms from "@/components/dashboard/Rooms";
import Room from "@/components/dashboard/Room";
import RoomSkeleton from "@/components/dashboard/RoomSkeleton";
import EmptyState from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import NewRoomModal from "@/components/dashboard/NewRoomModal";
import DeleteRoomModal from "@/components/dashboard/DeleteRoomModal";
import { HTTP_BACKEND } from "@/config";
import { AnimatePresence } from "framer-motion";
import UndoToast from "@/components/dashboard/UndoToast";

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
  const [roomToConfirm, setRoomToConfirm] = useState<RoomType | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    room: RoomType;
    index: number;
  } | null>(null);
  const pendingDeleteRef = useRef<{
    room: RoomType;
    index: number;
  } | null>(null);

  useEffect(() => {
    pendingDeleteRef.current = pendingDelete;
  }, [pendingDelete]);

  const executeDelete = async (room: RoomType, originalIndex?: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${HTTP_BACKEND}/room/${room.id}`, {
        headers: { Authorization: token },
      });
    } catch (e) {
      console.error("Failed to delete room:", e);
      alert(`Failed to delete room "${room.slug}". Please try again.`);
      setRooms((prev) => {
        if (prev.some((r) => String(r.id) === String(room.id))) {
          return prev;
        }
        if (originalIndex !== undefined) {
          const next = [...prev];
          next.splice(originalIndex, 0, room);
          return next;
        }
        return [...prev, room];
      });
    }
  };

  const executeDeleteRef = useRef(executeDelete);
  useEffect(() => {
    executeDeleteRef.current = executeDelete;
  }, [executeDelete]);

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

    return () => {
      // Commit pending delete on unmount
      if (pendingDeleteRef.current) {
        executeDeleteRef.current(pendingDeleteRef.current.room, pendingDeleteRef.current.index);
      }
    };
  }, [router]);

  const handleDeleteRoom = (roomId: string) => {
    // If there is already a pending delete, commit it immediately!
    if (pendingDeleteRef.current) {
      executeDelete(pendingDeleteRef.current.room, pendingDeleteRef.current.index);
    }

    const index = rooms.findIndex((r) => String(r.id) === String(roomId));
    if (index === -1) return;

    const roomToDelete = rooms[index];
    setPendingDelete({ room: roomToDelete, index });
    setRooms((prev) => prev.filter((r) => String(r.id) !== String(roomId)));
  };

  const handleTimeout = () => {
    if (pendingDelete) {
      executeDelete(pendingDelete.room, pendingDelete.index);
      setPendingDelete(null);
    }
  };

  const handleUndo = () => {
    if (pendingDelete) {
      setRooms((prev) => {
        const next = [...prev];
        next.splice(pendingDelete.index, 0, pendingDelete.room);
        return next;
      });
      setPendingDelete(null);
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
            onDelete={() => setRoomToConfirm(room)}
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
        <section 
          className="h-[50vw] pt-10 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        
        >{renderRooms()}</section>

        {/* New Room Modal */}
        <NewRoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Delete Room Modal */}
        <DeleteRoomModal
          isOpen={!!roomToConfirm}
          onClose={() => setRoomToConfirm(null)}
          onConfirm={() => {
            if (roomToConfirm) {
              handleDeleteRoom(String(roomToConfirm.id));
              setRoomToConfirm(null);
            }
          }}
          roomname={roomToConfirm?.slug ?? ""}
        />

        {/* Undo Toast */}
        <AnimatePresence>
          {pendingDelete && (
            <UndoToast
              key={pendingDelete.room.id}
              roomname={pendingDelete.room.slug}
              onTimeout={handleTimeout}
              onUndo={handleUndo}
              duration={5000}
            />
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
