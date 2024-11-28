import React from "react";
import { useState, useEffect } from "react";
import DateCard from "./event-date-card";
import Link from "next/link";
import Image from "next/image";

export default function UserEventList(id) {
  const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/events";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setEvents(data.events);
        } else {
          console.log("no data yet.");
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto flex flex-col gap-4 bg-background p-6 my-12 rounded-2xl">
      <div className="flex place-content-between align-center flex-row">
        <h2 className="text-xl font-bold">Your Events</h2>
        <Link href="/dashboard/event" className="flex flex-row gap-2 font-bold">
          All your events
          <Image
            alt="arrow"
            src="arrow.svg"
            width={16}
            height={16}
            className="-rotate-90"
          ></Image>
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-row  gap-4">
          {events.map((event) => (
            <Link href={`dashboard/event/${event.PK_ID}`} key={event.PK_ID}>
              <DateCard
                time={event.EventDates[0]?.DateTimeStart}
                title={event.Title}
                key={event.PK_ID}
              />
            </Link>
          ))}
        </ul>
      )}
    </section>
  );
}
