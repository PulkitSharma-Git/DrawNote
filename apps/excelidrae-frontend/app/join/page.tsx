"use client";

import { useState, useEffect } from "react";
import { RoomForm } from "@/components/RoomForm";
import PageLayout from "@/components/PageLayout";
import Room from "@/components/Room";
import Rooms from "@/components/Rooms";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { SiSpinrilla } from "react-icons/si";
import { useRouter } from "next/navigation";

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
    async function fetchRooms() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${HTTP_BACKEND}/getRooms`, {
          headers: {
            Authorization: token,
          },
        });

        setRooms(response.data.rooms); // Assuming API returns { rooms: [...] }
      } catch (err) {
        setError("Failed to fetch rooms.");
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  return (
    <PageLayout>
      <div className="pt-24">
        <RoomForm />
      </div>

      <div className="text-transparent text-2xl font-bold pt-5 w-fit mx-auto 
                bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-blue-500">
                Your Rooms
      </div>

      
      <Rooms>
      {loading && (
      <div className="flex justify-center w-screen">
      <SiSpinrilla className="text-white text-4xl animate-spin" />
      </div>
        )}
        
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading &&
          !error &&
          
          rooms.map((room) => (
            <Room onClick={() => {
              router.push(`/canvas/${room.id}`)
            }} key={room.id} roomId={room.id} roomname={room.slug} />
          ))}
      </Rooms>
    </PageLayout>
  );
}
