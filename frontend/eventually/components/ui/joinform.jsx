"use client"; // This directive is necessary for the client-side rendering.

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import Button from "./button";

export default function JoinForm() {
  const [joinCode, setJoinCode] = useState(""); // State for join code
  const [error, setError] = useState(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator

  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    // Reset state
    setError(null);
    setLoading(true);

    try {
      // Construct the API endpoint
      const joinEvent = `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/event/code/?joincode=${joinCode.toUpperCase()}`;

      // Fetch the event data
      const response = await fetch(joinEvent, {
        method: "GET",
        credentials: "include", // Include cookies for authentication if needed
      });

      if (!response.ok) {
        // Handle errors from the backend
        const errorData = await response.json();
        setError(errorData.Error || "Failed to fetch the event.");
        setLoading(false);
        return;
      }

      // Parse the event data
      const data = await response.json();
      console.log("Event data fetched:", data); // Debug fetched data

      // Redirect to the event's page after successful fetch
      router.push(`/join/${joinCode.toUpperCase()}`);
    } catch (err) {
      console.error("Error during join process:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
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
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())} // Automatically convert input to uppercase
        />
        <Button
          className="mt-[-3.125rem] h-11 mb-6 mr-2 place-self-end relative"
          type="submit"
          disabled={loading || joinCode.length !== 8} // Disable button when loading or joinCode is invalid
        >
          {loading ? "Loading..." : "Join"}
        </Button>
      </form>

      {/* Display Error */}
      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
    </div>
  );
}
