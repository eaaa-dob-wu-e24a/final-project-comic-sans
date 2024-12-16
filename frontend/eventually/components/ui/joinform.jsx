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
    <div className="max-w-md mx-auto flex flex-col mt-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          placeholder="JX6S7Y"
          maxLength={6}
          className="rounded-full h-12 md:h-14 lg:h-14 w-full text-dark uppercase font-semibold text-2xl py-2 px-4 md:px-8 lg:px-8 md:text-3xl lg:text-3xl focus:border-secondary focus:ring-1 focus:ring-secondary focus:bg-white/80 focus:outline-none"
          name="joincode"
          id="joincode"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())} // Automatically convert input to uppercase
        />
        <Button
          className=" mt-[-2.70rem] first-letter: md:mt-[-3.125rem] lg:mt-[-3.125rem] h-10 md:h-11 lg:h-11 md:mb-4 lg:mb-4 mr-1 md:mr-2 lg:mr-2 place-self-end relative"
          type="submit"
          disabled={loading || joinCode.length !== 8} // Disable button when loading or joinCode is invalid
        >
          {loading ? "Loading..." : "Join"}
        </Button>
      </form>

      {/* Display Error */}
      {error && <div className="text-white mt-4 text-center">{error}</div>}
    </div>
  );
}
