"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EventDetail from "@/components/event-detail";
import EventDateDetailCard from "@/components/event-date-detail-card";

export default function EventPage() {
    const { joincode } = useParams(); // Get joincode from URL
    const router = useRouter(); // For handling redirection
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState({
        userId: null,
        username: "",
    });
    const [error, setError] = useState(null); // For handling errors (invalid session, event not found)

    // Fetch the logged-in user's data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/check_session`, {
                    method: "GET",
                    credentials: "include", // Include credentials for session
                });

                if (!res.ok) {
                    // Handle error if user is not authenticated
                    setError("Please log in to join an event.");
                    return;
                }

                const userData = await res.json();
                setLoggedInUser({
                    userId: userData.user.id,
                    username: userData.user.name,
                });
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setError("An error occurred. Please try again later.");
            }
        };

        fetchUserData();
    }, []);

    // Fetch event data based on the joincode
    useEffect(() => {
        if (!joincode) {
            setError("Event not found.");
            return;
        }

        const fetchEventData = async () => {
            if (joincode && loggedInUser.userId !== null) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event/code?joincode=${joincode}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });

                    if (!res.ok) {
                        // Handle the case where the event is not found
                        setError("No event found with the provided join code.");
                        return;
                    }

                    const data = await res.json();

                    // Update event data with selected state for dates
                    const eventDatesWithVotes = data.EventDates.map((date) => {
                        const userVoted = date.UserVotes.some(
                            (vote) => parseInt(vote.FK_User, 10) === parseInt(loggedInUser.userId, 10)
                        );
                        return { ...date, selected: userVoted };
                    });

                    setEvent({ ...data, EventDates: eventDatesWithVotes });
                    setLoading(false);
                } catch (err) {
                    console.error("Failed to fetch event data:", err);
                    setError("Failed to load event details.");
                }
            }
        };

        fetchEventData();
    }, [joincode, loggedInUser.userId]);

    // Handle voting on event dates
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
                    eventId: event.PK_ID, // Use event's PK_ID for voting
                    dateId: selectedDate.PK_ID,
                    userId: loggedInUser.userId,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update vote");
            }

            // Update the event dates with the new vote state
            const updatedUserVotes = isCurrentlySelected
                ? selectedDate.UserVotes.filter(
                    (vote) =>
                        parseInt(vote.FK_User, 10) !== parseInt(loggedInUser.userId, 10)
                )
                : [
                    ...selectedDate.UserVotes,
                    { UserName: loggedInUser.username, FK_User: loggedInUser.userId },
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
            setError("Failed to vote on the date.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>; // Show error if there's any issue

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
