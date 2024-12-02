"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EventDetail from "@/components/event-detail";
import EventDateDetailCard from "@/components/event-date-detail-card";

export default function EventPage() {
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

  //fetch event data
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

          // Check if the logged-in user voted for each date
          const eventDatesWithVotes = data.EventDates.map((date) => {
            const userVoted = date.UserVotes.some(
              (vote) => vote.FK_User == loggedInUser.userId
            );
            return { ...date, selected: userVoted };
          });

          setEvent({ ...data, EventDates: eventDatesWithVotes });
          setLoading(false);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchEventData();
  }, [eventId, loggedInUser.userId]);

  // Define handleEventClick
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
          eventId,
          dateId: selectedDate.PK_ID,
          userId: loggedInUser.userId,
          username: loggedInUser.username,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update vote");
      }

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

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <section className="max-w-6xl mx-auto flex flex-col gap-4 bg-background p-6 my-12 rounded-2xl shadow-md">
        <EventDetail event={event} />
        <div>
          <EventDateDetailCard
            eventDates={event.EventDates}
            onDateClick={handleEventClick}
            loggedInUser={loggedInUser}
          />
        </div>
      </section>
    </main>
  );
}
