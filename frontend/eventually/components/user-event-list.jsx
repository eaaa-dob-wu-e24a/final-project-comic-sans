import React, { useState, useEffect } from "react";
import DateCard from "./event-date-card";
import Link from "next/link";
import Arrow from "./ui/arrow";
import Loading from "./ui/loading-spinner";
import Button from "./ui/button"; // Import the Button component

export default function UserEventList({ maxEvents }) {
  const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/events/";

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
      <div className="flex place-content-between items-center flex-row">
        <h2 className="text-xl font-bold">Your Events</h2>
        {maxEvents && maxEvents > 0 ? (
          <Link
            href="/dashboard/event"
            className="flex flex-row gap-2 font-bold"
          >
            All
            <Arrow className="-rotate-90 mt-1" />
          </Link>
        ) : (
          <div></div>
        )}
      </div>
      {loading ? (
        <Loading />
      ) : events.length > 0 ? (
        <ul className="flex flex-row flex-wrap gap-4">
          {events.map((event) => {
            // If FinalDate is present, show the date card variant
            // If not, show the no-date card variant
            const cardTime = event.FinalDate || null; // If null, DateCard shows no-date variant

            return (
              <DateCard
                time={cardTime}
                title={event.Title}
                key={event.PK_ID}
                id={event.PK_ID}
                joincode={event.JoinCode}
              />
            );
          })}
        </ul>
      ) : (
        // When there are no events
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <p className="text-lg text-foreground">No events yet, create one!</p>
          <Link href="/create">
            <Button variant="primary">Create</Button>
          </Link>
        </div>
      )}
    </section>
  );
}
