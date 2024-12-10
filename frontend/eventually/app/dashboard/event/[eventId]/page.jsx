"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EventDetail from "@/components/event-detail";
import EventDateDetailCard from "@/components/event-date-detail-card";

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState({
    userId: null,
    username: "",
    imagePath: "",
  });

  const [pendingSelections, setPendingSelections] = useState([]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/check_session`,
          { method: "GET", credentials: "include" }
        );
        const userData = await res.json();

        setLoggedInUser({
          userId: userData.user.id,
          username: userData.user.name,
          imagePath: userData.user.imagePath,
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

          const eventDatesWithVotes = data.EventDates.map((date) => {
            const userVoted = date.UserVotes.some(
              (vote) =>
                parseInt(vote.FK_User, 10) === parseInt(loggedInUser.userId, 10)
            );
            return { ...date, selected: userVoted };
          });

          setEvent({ ...data, EventDates: eventDatesWithVotes });
          setPendingSelections(
            eventDatesWithVotes.map((date) => date.selected)
          );
          setLoading(false);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchEventData();
  }, [eventId, loggedInUser.userId]);

  // Handle local selection changes
  const handlePendingSelection = (index) => {
    setPendingSelections((prev) =>
      prev.map((selected, i) => (i === index ? !selected : selected))
    );
  };

  // Confirm selections and update the backend
  const confirmSelections = async () => {
    try {
      const updatedEventDates = [...event.EventDates];

      for (let i = 0; i < updatedEventDates.length; i++) {
        const date = updatedEventDates[i];
        const wasSelected = date.selected;
        const isSelected = pendingSelections[i];

        if (wasSelected !== isSelected) {
          const url = isSelected
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/vote/create`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/vote/delete`;

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              eventId,
              dateId: date.PK_ID,
              userId: loggedInUser.userId, // Null for non-logged-in users
              username: loggedInUser.userId
                ? loggedInUser.username
                : usernameInput,
            }),
          });

          if (!res.ok) throw new Error("Failed to update vote");

          // Update UserVotes based on server response
          if (isSelected) {
            date.UserVotes.push({
              FK_User: loggedInUser.userId || null,
              UserName: loggedInUser.userId
                ? loggedInUser.username
                : usernameInput,
            });
          } else {
            date.UserVotes = date.UserVotes.filter(
              (vote) =>
                parseInt(vote.FK_User, 10) !== parseInt(loggedInUser.userId, 10)
            );
          }

          updatedEventDates[i] = { ...date, selected: isSelected };
        }
      }

      setEvent({ ...event, EventDates: updatedEventDates });
    } catch (err) {
      console.error("Failed to confirm selections:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <section className="max-w-6xl mx-auto flex flex-col gap-4 bg-background p-6 my-12 rounded-2xl shadow-md">
        <EventDetail event={event} />
        <EventDateDetailCard
          eventDates={event.EventDates}
          pendingSelections={pendingSelections}
          onPendingSelection={handlePendingSelection}
          loggedInUser={loggedInUser}
        />
        {/* MAYBE TODO ADD conditional rendering if only for non logged in users */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-bold">
            Enter Your Name:
          </label>
          <input
            id="username"
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full mt-2"
            placeholder="Your name"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={confirmSelections}
            className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark active:bg-primary-light"
          >
            Confirm Selections
          </button>
        </div>
      </section>
    </main>
  );
}
