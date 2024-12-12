"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DateCard from "./event-date-card";
import Arrow from "./ui/arrow";
import Loading from "./ui/loading-spinner";

export default function VotedEventList({ maxEvents }) {
  const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/votes/";
  const urlSingle = process.env.NEXT_PUBLIC_API_URL + "/api/event/";

  const [events, setEvents] = useState([]); // Store events fetched from the API
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  const router = useRouter();

  useEffect(() => {
    fetch(url, {
      method: "GET",
      credentials: "include", // Include cookies for authentication
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.events) {
          console.log(data.events.length + " events found.");
          // Limit events if maxEvents is passed
          if (maxEvents && data.events.length > maxEvents) {
            const limitedEvents = data.events.slice(-maxEvents);
            setEvents(limitedEvents);
          } else {
            setEvents(data.events);
          }
        } else {
          console.log("No events found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setError("Failed to fetch events.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <section className="mx-auto flex flex-col gap-4 bg-background p-6 my-12 rounded-2xl shadow-md">
      <div className="flex place-content-between align-center flex-row">
        <h2 className="text-xl font-bold">Participating Events</h2>
        {maxEvents && maxEvents > 0 ? (
          <Link
            href="/dashboard/event/participating"
            className="flex flex-row gap-2 font-bold"
          >
            All
            <Arrow className="-rotate-90 mt-1"></Arrow>
          </Link>
        ) : (
          <div></div>
        )}
      </div>
      <ul className="flex flex-wrap flex-row gap-4">
        {events.map((event) => (
          <DateCard
            time={
              event.FinalDate
                ? event.FinalDate
                : event.EventDates[0]?.DateTimeStart
            }
            title={event.Title}
            key={event.EventID}
            id={event.EventID}
            joincode={event.JoinCode}
          />
        ))}
      </ul>
    </section>
  );
}
