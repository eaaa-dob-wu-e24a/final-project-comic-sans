"use client";  // This directive is necessary for the client-side rendering.

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import Button from "./button";

export default function JoinForm() {
  const [joinCode, setJoinCode] = useState(""); // State for join code
  const [error, setError] = useState(null); // State for error messages
  const [eventData, setEventData] = useState(null); // State for event data

  const joinEvent = process.env.NEXT_PUBLIC_API_URL + '/api/event/code?joincode=' + joinCode.toUpperCase();
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    setError(null); // Reset any previous errors
    setEventData(null); // Clear previous event data

    try {
      // Fetch the event data from the backend
      const response = await fetch(joinEvent, {
        method: "GET",
        credentials: "include", // Include cookies for authentication if needed
      });

      if (!response.ok) {
        // Handle errors from the backend
        const errorData = await response.json();
        setError(errorData.Error || "Failed to fetch the event.");
        return;
      }

      // Parse the event data
      const data = await response.json();
      setEventData(data); // Save the event data in state

      // After successful event fetch, redirect to the event page
      router.push(`/join/${joinCode.toUpperCase()}`); // Redirect to the event's page

    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col">
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          placeholder="JX6S7YA1"
          maxLength={8}
          className="rounded-full h-14 w-full text-background uppercase font-semibold text-4xl py-2 px-8"
          name="joincode"
          id="joincode"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)} // Update state with input value
        />
        <Button className="mt-[-3.125rem] h-11 mb-6 mr-2 place-self-end relative" type="submit">
          Join
        </Button>
      </form>

      {/* Display Error */}
      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}

      {/* Display Event Data (Optional) */}
      {eventData && (
        <div className="mt-6 p-4 border rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">{eventData.Name}</h2>
          <p className="text-gray-700 mt-2">{eventData.Description}</p>
          <ul className="mt-4">
            {eventData.EventDates.map((date) => (
              <li key={date.PK_ID} className="mt-2">
                <strong>Date:</strong> {new Date(date.DateTimeStart).toLocaleString()} -{" "}
                {new Date(date.DateTimeEnd).toLocaleString()}
                <ul className="ml-4 mt-1">
                  {date.UserVotes.map((vote) => (
                    <li key={vote.VoteID}>
                      {vote.UserName}: {vote.Status}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
