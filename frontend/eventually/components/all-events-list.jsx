"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AllEventList() {
  const url = process.env.NEXT_PUBLIC_API_URL + "/api/event/events";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // router.push(`/loginsite/event/${eventId}`);
  const handleEventClick = (eventId) => {
    fetch(`${url}/${eventId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.EventDates) {
          console.log(
            data.EventDates.length + " dates found for event " + eventId
          );
          router.push(`/loginsite/event/${eventId}`, {
            state: { dates: data.EventDates },
          });
        } else {
          console.log("no dates found for event " + eventId);
        }
      })
      .catch((error) => console.log(error));
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
          console.log(data.events.length + " events found.");

          setEvents(data.events);
        } else {
          console.log("no data yet.");
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto flex flex-col">
      <div>
        <h2 className="font-bold">Other Events</h2>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-row gap-2">
          {events.map((event) => (
            <li
              className="bg-lightblue rounded-2xl text-black p-4 shadow-md flex basis-0 grow shrink-0 place-content-center cursor-pointer"
              key={event.PK_ID}
              onClick={() => handleEventClick(event.PK_ID)}
            >
              <p>{event.Title}</p>
              <p>{event.FinalDate}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
