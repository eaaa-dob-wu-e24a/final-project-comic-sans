"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useNotif } from "@/components/notif-context";
import EventUpdateForm from "@/components/event-update-form";

export default function UpdateEventPage() {
  const { joincode } = useParams(); // Extract joincode from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const notif = useNotif();

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      if (joincode) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/event/code/?joincode=${joincode}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );

          if (!res.ok) {
            throw new Error("Failed to fetch event data.");
          }

          const data = await res.json();
          setEvent(data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching event data:", err);
          notif.send("Failed to load event details.");
        }
      }
    };

    fetchEventData();
  }, [joincode, notif]);

  // Handle event updates
  const handleUpdate = async (updatedEvent) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/event/update/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedEvent),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        notif.send(`Failed to update event: ${errorData.message}`);
        return;
      }

      notif.send("Event updated successfully!");
    } catch (err) {
      console.error("Error updating event:", err);
      notif.send("An error occurred while updating the event.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      {event ? (
        <EventUpdateForm event={event} onUpdate={handleUpdate} />
      ) : (
        <p>Event not found.</p>
      )}
    </main>
  );
}
