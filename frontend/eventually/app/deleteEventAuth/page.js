"use client";
import React, { useState } from "react";

const DeleteEvent = () => {
  const [eventId, setEventId] = useState("");
  const url = process.env.NEXT_PUBLIC_API_URL + "/api/event/delete/id/";

  const handleDelete = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/event/delete`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID: eventId }), // Send ID in the request body
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        return;
      }

      const data = await response.json();
      if (data.message) {
        console.log("Event deleted successfully");
      } else {
        console.log("Failed to delete event:", data.Error);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Delete Event</h1>
      <input
        type="text"
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        placeholder="Enter event ID"
        className="border p-2 mb-4 w-full"
      />
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
      >
        Delete Event
      </button>
    </div>
  );
};

export default DeleteEvent;
