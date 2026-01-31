"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SiSpinrilla } from "react-icons/si";

import PageLayout from "@/components/PageLayout";
import { RoomForm } from "@/components/RoomForm";
import Rooms from "@/components/Rooms";
import Room from "@/components/Room";
import { HTTP_BACKEND } from "@/config";

interface RoomType {
  id: string;
  slug: string;
}

export default function JoinPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${HTTP_BACKEND}/getRooms`, {
          headers: { Authorization: token },
        });
        setRooms(data.rooms ?? []);
      } catch {
        setError("Failed to fetch rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <PageLayout>
      <main className="pt-24 pb-20">
        {/* Room Form */}
        <section className="mb-12 flex justify-center">
          <RoomForm />
        </section>

        {/* Rooms List */}
        <section className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-50 mb-6">
            Your Rooms
          </h2>

          {loading && (
            <div className="flex justify-center py-10">
              <SiSpinrilla className="text-gray-50 text-3xl animate-spin" />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-center py-6">{error}</p>
          )}

          {!loading && !error && (
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
          )}
        </section>
      </main>
    </PageLayout>
  );
}
