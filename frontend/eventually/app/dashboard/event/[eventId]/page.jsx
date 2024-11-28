"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState({
    userId: null,
    username: "",
  });

  // Fetch the logged-in user's data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/check_session`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const userData = await res.json();
        setLoggedInUser(userData);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, []);

  // Fetch event data
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

              return { ...date, UserVotes: votesData.UserVotes || [] };
            });

            const eventDatesWithVotes = await Promise.all(votesPromises);

            setEvent((prevEvent) => ({
              ...prevEvent,
              EventDates: eventDatesWithVotes,
            }));
          } else {
            setEvent(data);
          }

          setLoading(false);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchEventData();
  }, [eventId]);

  if (loading) return <p>Loading...</p>;

  // Handle voting for a date
  const handleEventClick = async (index) => {
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
        credentials: "include",
        body: JSON.stringify({
          eventId: eventId,
          dateId: selectedDate.PK_ID,
          userId: loggedInUser.userId,
          username: loggedInUser.username,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update vote");
      }

      // Update UI dynamically
      const updatedUserVotes = selectedDate.selected
        ? [...selectedDate.UserVotes, { UserName: "You" }]
        : selectedDate.UserVotes.filter((vote) => vote.UserName !== "You");

      setEvent({
        ...event,
        EventDates: updatedDates.map((date, i) =>
          i === index ? { ...date, UserVotes: updatedUserVotes } : date
        ),
      });
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
        <ul className="flex flex-row flex-wrap w-full gap-4">
          {event?.EventDates?.map((date, index) => (
            <li
              key={index}
              className={`flex flex-col items-center w-64 border p-4 rounded-lg shadow-md cursor-pointer ${
                date.selected
                  ? "bg-green-500 text-white"
                  : "bg-white text-black"
              }`}
              // sets your vote
              onClick={() => handleEventClick(index)}
            >
              <div>
                <p>Start: {date.DateTimeStart}</p>
                <p>End: {date.DateTimeEnd}</p>
              </div>
              <div className="mt-4 text-sm">
                {/* Display the users who voted for this date */}
                <h3 className="font-bold">Voted Users:</h3>
                {date.UserVotes.length > 0 ? (
                  <ul className="list-disc ml-4">
                    {date.UserVotes.map((vote, i) => (
                      <li key={i}>{vote.UserName}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No votes yet</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
