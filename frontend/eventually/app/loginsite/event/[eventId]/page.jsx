"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      if (eventId) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/event/id/${eventId}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
          const data = await res.json();

          // Fetch votes for each event date
          if (data.EventDates && data.EventDates.length > 0) {
            const votesPromises = data.EventDates.map(async (date) => {
              const resVotes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/vote/read/${date.PK_ID}`,
                {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                }
              );
              const votesData = await resVotes.json();

              return { ...date, UserVotes: votesData.UserVotes || [] }; // Merge votes into the date
            });

            // Wait for all vote data to be fetched
            const eventDatesWithVotes = await Promise.all(votesPromises);

            // Update the event data with the combined event dates and votes
            setEvent((prevEvent) => ({
              ...prevEvent,
              EventDates: eventDatesWithVotes,
            }));
          } else {
            setEvent(data);
          }

          setLoading(false);
          console.log("Event data fetched:", data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchEventData();
  }, [eventId]);

  console.log("Event data:", event);

  if (loading) return <p>Loading...</p>;

  // Handle date selection logic
  const handleEventClick = async (index) => {
    console.log("Event date clicked:", index);

    const updatedDates = event.EventDates.map((d, i) =>
      i === index ? { ...d, selected: !d.selected } : d
    );

    const selectedDate = updatedDates[index];
    const url = selectedDate.selected
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/vote/create`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/vote/delete`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: eventId,
          dateId: selectedDate.PK_ID, // Use PK_ID for the backend
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update vote");
      }

      setEvent({ ...event, EventDates: updatedDates });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section>
      <h1>Title: {event?.Title}</h1>
      <p>Description: {event?.Description}</p>
      <p>User Name: {event?.UserName || "DummyUser"}</p>
      <p>Location: {event?.Location || "DummyLocation"}</p>
      <div>
        <h2>Event Dates:</h2>
        <ul className="flex flex-col items-start w-full">
          {event?.EventDates?.map((date, index) => (
            <li
              key={index}
              className={`w-full border p-4 my-2 rounded-lg shadow-md cursor-pointer ${
                date.selected
                  ? "bg-green-500 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => handleEventClick(index)}
            >
              <p>Start: {date.DateTimeStart}</p>
              <p>End: {date.DateTimeEnd}</p>
              <h3 className="mt-2 text-sm font-bold">Voted Users:</h3>
              {date.UserVotes.length > 0 ? (
                <ul className="ml-4 list-disc">
                  {date.UserVotes.map((vote, i) => (
                    <li key={i}>{vote.UserName}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No votes yet</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
