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
    imagePath: "", // Added imagePath to store the user's avatar path
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

        setLoggedInUser({
          userId: userData.user.id,
          username: userData.user.name,
          imagePath: userData.user.imagePath, // Ensure avatar is captured
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, []);

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      if (eventId && loggedInUser.userId !== null) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/event/id/?id=${eventId}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
          const data = await res.json();

          // Recalculate selected state
          const eventDatesWithVotes = data.EventDates.map((date) => {
            const userVoted = date.UserVotes.some(
              (vote) =>
                parseInt(vote.FK_User, 10) === parseInt(loggedInUser.userId, 10)
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

  // Handle event date selection
  const handleEventClick = async (index) => {
    const selectedDate = event.EventDates[index];
    const isCurrentlySelected = selectedDate.selected;

    try {
      const url = isCurrentlySelected
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/vote/delete`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/vote/create`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          eventId,
          dateId: selectedDate.PK_ID,
          userId: loggedInUser.userId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update vote");
      }

      // Update the UserVotes array and selected state
      const updatedUserVotes = isCurrentlySelected
        ? selectedDate.UserVotes.filter(
            (vote) =>
              parseInt(vote.FK_User, 10) !== parseInt(loggedInUser.userId, 10)
          )
        : [
            ...selectedDate.UserVotes,
            {
              UserName: loggedInUser.username,
              FK_User: loggedInUser.userId,
              UserImagePath: loggedInUser.imagePath,
            },
          ];

      const updatedDates = event.EventDates.map((date, i) =>
        i === index
          ? {
              ...date,
              UserVotes: updatedUserVotes,
              selected: !isCurrentlySelected,
            }
          : date
      );

      setEvent({ ...event, EventDates: updatedDates });
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
