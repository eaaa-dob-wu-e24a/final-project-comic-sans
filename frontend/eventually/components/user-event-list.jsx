import React from "react";
import { useState, useEffect } from "react";

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
          console.log(data.events[0].EventDates[0].DateTimeStart);
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
            <li
              className="bg-white rounded-2xl text-black p-4 shadow-md flex flex-col basis-0 grow shrink-0 place-content-center"
              key={event.PK_ID}
            >
              <div className="flex flex-col place-items-center">
                <p className="text-sm font-bold opacity-60">
                  {event.EventDates && event.EventDates.length > 0
                    ? new Date(
                        event.EventDates[0].DateTimeStart
                      ).toLocaleString("default", {
                        weekday: "long"
                      })
                    : "N/A"}
                </p>
                <p className="text-gradientend my-[-0.25rem] text-4xl font-bold">
                {event.EventDates && event.EventDates.length > 0
                    ? new Date(
                        event.EventDates[0].DateTimeStart
                      ).toLocaleString("default", {
                        day: "2-digit"
                      })
                    : "N/A"}
                </p>
                <p className="font-bold  opacity-60 text-lg">
                {event.EventDates && event.EventDates.length > 0
                    ? new Date(
                        event.EventDates[0].DateTimeStart
                      ).toLocaleString("default", {
                        month: "short"
                      })
                    : "N/A"}
                </p>
              </div>

              <p className="mx-auto font-bold text-2xl capitalize">
                {event.Title}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
