"use client";
import { RoomForm } from "@/components/RoomForm";
import PageLayout from "@/components/PageLayout";

export default function JoinPage() {
  return (
    <PageLayout>
        <div className="pt-24">
        <RoomForm />
        </div>

    </PageLayout>
  );
}
