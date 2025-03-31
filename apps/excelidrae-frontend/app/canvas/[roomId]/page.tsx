import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasPage({ params }: {
  params: Promise<{ roomId: string }>
}) {
  // Since params is a Promise, need to await it
  const resolvedParams = await params;
  const roomId = resolvedParams.roomId;
  console.log(roomId);
  return <RoomCanvas roomId={roomId} />;
}