// pages/loginsite.js
"use client";
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import UserEventList from "@/components/user-event-list";
import { AuthContext } from "../authcontext";

const LoginSite = () => {
  const router = useRouter();
  const { user, setUser, loading } = useContext(AuthContext); // Use AuthContext
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true); // State for event loading

  // Fetch events for the logged-in user
  const fetchEvents = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/events";
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include", // Include cookies for session handling
      });
      const data = await response.json();

      if (data.status === "success") {
        setEvents(data.events);
      } else {
        setError(data.message || "Failed to fetch events.");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("An error occurred while fetching events.");
    } finally {
      setLoadingEvents(false); // Set loading to false after fetch completes
    }
  };

  useEffect(() => {
    // Wait for auth status to be determined
    if (loading) {
      return; // Don't proceed if still loading auth status
    }

    if (!user) {
      // If not logged in, redirect to login page
      router.push("/login");
    } else {
      // If logged in, fetch the user's events
      fetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]); // Dependencies include user and loading

  // Logout function
  const handleLogout = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/logout";
    await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setUser(null); // Clear user state in context
    router.push("/login"); // Redirect to login page
  };

  // Handle loading state
  if (loading || loadingEvents) {
    return (
      <main className="pt-20">
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  // Render nothing if user is not logged in (redirect should happen)
  if (!user) {
    return null;
  }

  return (
    <main className="pt-20">
      <div className="flex justify-between items-center p-5 bg-gray-100 rounded-lg shadow-md">
        <h1 className="m-0 text-2xl text-gray-800">
          Hello, {user.name}, your email is {user.email}
        </h1>
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {/* Pass events and error to UserEventList component */}
      <UserEventList events={events} error={error} />
    </main>
  );
};

export default LoginSite;
