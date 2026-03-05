import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasPage({ params }: {
  params: Promise<{ roomId: string }>
}) {
  const resolvedParams = await params;
  const roomId = resolvedParams.roomId;
  return <RoomCanvas roomId={roomId} />;
}