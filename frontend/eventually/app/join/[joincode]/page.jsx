"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EventDetail from "@/components/event-detail";
import EventDateDetailCard from "@/components/event-date-detail-card";

export default function JoinEventPage() {
    const { joincode } = useParams(); // Extract joincode from the URL
    console.log("Join code from URL:", joincode); // Debug joincode value

    const [event, setEvent] = useState(null);
    const [eventId, setEventId] = useState(null); // Store eventId separately
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
                        credentials: "include", // Ensure cookies are sent
                    }
                );
                const userData = await res.json();

                setLoggedInUser({
                    userId: userData.user.id,
                    username: userData.user.name,
                });
                console.log("Logged-in user:", userData);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        };

        fetchUserData();
    }, []);

    // Fetch event data based on joincode
    useEffect(() => {
        const fetchEventData = async () => {
            if (joincode && loggedInUser.userId !== null) {
                try {
                    console.log(
                        "Fetching event data from:",
                        `${process.env.NEXT_PUBLIC_API_URL}/api/event/code/${joincode}`
                    );

                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/event/code/${joincode}`, // Path-based URL
                        {
                            method: "GET",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                        }
                    );

                    if (!res.ok) {
                        const error = await res.json();
                        console.error("Error from backend:", error);
                        throw new Error(error.Error || "Failed to fetch event data.");
                    }

                    const data = await res.json();
                    console.log("Event data fetched:", data);

                    if (!data || !data.EventDates) {
                        console.error("Invalid event data received:", data);
                        throw new Error("Event data is invalid.");
                    }

                    // Store eventId from response
                    setEventId(data.PK_ID);

                    // Recalculate selected state
                    const eventDatesWithVotes = data.EventDates.map((date) => {
                        const userVoted = date.UserVotes.some(
                            (vote) =>
                                parseInt(vote.FK_User, 10) ===
                                parseInt(loggedInUser.userId, 10)
                        );
                        return { ...date, selected: userVoted };
                    });

                    setEvent({ ...data, EventDates: eventDatesWithVotes });
                    setLoading(false);
                } catch (err) {
                    console.error("Error fetching event data:", err);
                }
            }
        };

        fetchEventData();
    }, [joincode, loggedInUser.userId]);

    // Handle date click logic
    const handleEventClick = async (index) => {
        const selectedDate = event.EventDates[index];
        const isCurrentlySelected = selectedDate.selected;

        try {
            const url = isCurrentlySelected
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/vote/delete`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/vote/create`;

            console.log("Submitting vote with eventId:", eventId);

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Send credentials to server
                body: JSON.stringify({
                    eventId, // Use eventId retrieved from join endpoint
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
                        parseInt(vote.FK_User, 10) !==
                        parseInt(loggedInUser.userId, 10)
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
            console.error("Error updating vote:", err);
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
