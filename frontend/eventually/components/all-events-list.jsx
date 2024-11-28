"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DateCard from "./event-date-card";
import Arrow from "./ui/arrow";


export default function AllEventList({maxEvents}) {
  const url = process.env.NEXT_PUBLIC_API_URL + "/api/event/events";
  const urlSingle = process.env.NEXT_PUBLIC_API_URL + "/api/event/";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleEventClick = async (eventId) => {
    try {
      const response = await fetch(`${urlSingle}/id/${eventId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data && data.EventDates) {
        console.log(
          data.EventDates.length + " dates found for event " + eventId
        );
        router.push(`/dashboard/event/${eventId}`, {
          state: { dates: data.EventDates },
        });
      } else {
        console.log("no dates found for event " + eventId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // if a max events variable is passed, only show that amount
          console.log(data.events.length + " events found.");
          if (maxEvents && data.events.length > maxEvents) {
            const limitedEvents = data.events.slice(-maxEvents);
            setEvents(limitedEvents);
          } else {
            setEvents(data.events);
          }
        } else {
          console.log("no data yet.");
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto flex flex-col gap-4 bg-background p-6 my-12 rounded-2xl shadow-md">
      <div className="flex place-content-between align-center flex-row">
        <h2 className="text-xl font-bold">Participating Events</h2>
        <Link href="/dashboard/event" className="flex flex-row gap-2 font-bold">
          All
          <Arrow className="-rotate-90 mt-1"></Arrow>
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-wrap flex-row gap-4">
          {events.map((event) => (
            <DateCard
              time={
                event.FinalDate
                  ? event.FinalDate
                  : event.EventDates[0]?.DateTimeStart
              }
              title={event.Title}
              key={event.PK_ID}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
