"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventDetail() {
  const { eventId } = useParams(); // Correct way to get dynamic route parameters in App Router
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event/id/${eventId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setEvent(data);
          setLoading(false);
          console.log("Event data fetched:", data);
        })
        .catch((err) => console.error(err));
    }
  }, [eventId]);

  if (loading) return <p>Loading...</p>;

  const handleEventClick = (index) => {
    console.log("Event date clicked:", index);

    const updatedDates = event.EventDates.map((d, i) =>
      i === index ? { ...d, selected: !d.selected } : d
    );
    setEvent({ ...event, EventDates: updatedDates });
  };

  return (
    <section>
      <h1>Title: {event?.Title}</h1>
      <p>Description: {event?.Description}</p>
      <p>User Name: {event?.UserName || "DummyUser"}</p>
      <p>Location: {event?.Location || "DummyLocation"}</p>
      <div>
        <h2>Event Dates:</h2>
        <ul className="flex flex-row items-center w-full">
          {event?.EventDates?.map((date, index) => (
            <li
              key={index}
              className={`w-64 border p-4 my-2 text-center rounded-lg shadow-md cursor-pointer ${
                date.selected
                  ? "bg-green-500 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => handleEventClick(index)}
            >
              <p>Start: {date.DateTimeStart}</p>
              <p>End: {date.DateTimeEnd}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
