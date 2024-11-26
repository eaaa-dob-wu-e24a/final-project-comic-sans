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
          }
    })
    .then(response => response.json())
    .then(data => {
        if(data) {
            console.log(data.events.length + " events found.");
            setEvents(data.events);
        } else {
            console.log("no data yet.")
        }
    })
    .catch(error => console.log(error))
    .finally(() => setLoading(false));

  }, [])

  return (
    <section className="mx-auto flex flex-col">
        <div>
      <h2>Your Events</h2>
        </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-row  gap-2">
            {events.map(event => (
                <li className="bg-white rounded-2xl text-black p-4 shadow-md flex basis-0 grow shrink-0 place-content-center" key={event.PK_ID}>
                    <p>{event.Title}</p>
                    <p>{event.FinalDate}</p>
                </li>
            ))}
        </ul>
      )
      }
    </section>
  );
}
