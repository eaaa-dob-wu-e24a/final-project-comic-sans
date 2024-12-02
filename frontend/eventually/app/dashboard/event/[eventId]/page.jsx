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
            credentials: "include", // Include credentials to maintain session
          }
        );
        const userData = await res.json();

        // Map the response to match the loggedInUser state structure
        setLoggedInUser({
          userId: userData.user.id, // Map 'id' to 'userId'
          username: userData.user.name, // Map 'name' to 'username'
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, []);

  // Helper function to check if the logged-in user voted for a date
  const userHasVoted = (userVotes, userId) => {
    return userVotes.some((vote) => vote.FK_User == userId);
  };

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      if (eventId && loggedInUser.userId !== null) {
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
                  credentials: "include", // Include credentials for session
                }
              );
              const votesData = await resVotes.json();

              // Check if the logged-in user has voted for this date
              const userVoted = userHasVoted(
                votesData.UserVotes || [],
                loggedInUser.userId
              );

              // Filter out the logged-in user's vote for display
              const filteredVotes = (votesData.UserVotes || []).filter(
                (vote) => vote.FK_User !== loggedInUser.userId
              );

              return {
                ...date,
                UserVotes: filteredVotes, // Exclude logged-in user's vote from display
                selected: userVoted, // Mark tile as selected if the user voted
              };
            });

            const eventDatesWithVotes = await Promise.all(votesPromises);

            setEvent((prevEvent) => ({
              ...prevEvent,
              ...data,
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
  }, [eventId, loggedInUser.userId]);

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
        credentials: "include", // Include credentials to maintain session
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
        ? [
            ...selectedDate.UserVotes,
            { UserName: "You", FK_User: loggedInUser.userId },
          ]
        : selectedDate.UserVotes.filter(
            (vote) => vote.FK_User !== loggedInUser.userId
          );

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
    <main className="pt-20">
      <section className="max-w-6xl mx-auto my-8">
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
                        <li key={i}>
                          {loggedInUser.userId == vote.FK_User
                            ? "You"
                            : vote.UserName}
                        </li>
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
    </main>
  );
}
