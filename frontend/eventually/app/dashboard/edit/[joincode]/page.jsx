"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useNotif } from "@/components/notif-context";
import EventUpdateForm from "@/components/event-update-form";
import GradientCurve from "@/components/gradientcurve";

export default function UpdateEventPage() {
  const { joincode } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const notif = useNotif();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/event/code/?joincode=${joincode}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch event data.");

        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event data:", err);
        notif.send("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [joincode, notif]);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="flex flex-col min-h-screen bg-sitebackground">
      {/* Header with GradientCurve */}
      <GradientCurve className={"max-h-24"}>
        <div className="max-w-6xl mx-auto flex">
          <h1 className="font-bold text-2xl mx-auto max-w-6xl pb-12 text-white">
            Update Event
          </h1>
        </div>
      </GradientCurve>
      {event ? (
        <EventUpdateForm event={event} />
      ) : (
        <p>Event not found. Please check the joincode.</p>
      )}
    </main>
  );
}