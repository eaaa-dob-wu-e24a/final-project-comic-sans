"use client";
import { useParams } from "next/navigation";
import EventUpdateForm from "@/components/event-update-form";

export default function Page() {
  const { eventid } = useParams();
  return (
    <main>
      <EventUpdateForm id={eventid} />
    </main>
  );
}
