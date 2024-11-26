import React from "react";
import { useState, useEffect } from "react";
import DateCard from "./event-date-card";

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
    <section className="mx-auto flex flex-col">
      <div>
        <h2>Your Events</h2>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-row  gap-4">
          {events.map((event) => (
            <DateCard time={event.EventDates[0]?.DateTimeStart} title={event.Title} key={event.PK_ID} />        
          ))}
        </ul>
      )}
    </section>
  );
}
