"use client";
import React, { useState } from "react";

export default function EventUpdateForm({ id }) {
  const [data, setData] = useState(null); // State to store response data or errors
  const eventID = id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = process.env.NEXT_PUBLIC_API_URL + "/api/event/update/";
    const formValues = {
      ID: eventID,
      Title: document.getElementById("newtitle").value,
      Description: document.getElementById("newdesc").value,
      Location: document.getElementById("newloc").value,
    };

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
        credentials: "include", // Send cookies with the request if needed for session-based auth
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData); // Store the response in state
      console.log("Event updated successfully:", responseData);
    } catch (error) {
      console.error("Error updating event:", error);
      setData({ error: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col mx-auto max-w-96">
      <label htmlFor="newtitle">Title</label>
      <input
        id="newtitle"
        name="newtitle"
        type="text"
        placeholder="Enter a new title..."
        required
      />

      <label htmlFor="newdesc">Description</label>
      <input
        id="newdesc"
        name="newdesc"
        type="text"
        placeholder="Update your description..."
        required
      />

      <label htmlFor="newloc">Location</label>
      <input
        id="newloc"
        name="newloc"
        type="text"
        placeholder="Enter a new location..."
        required
      />

      <button
        type="submit"
        className="border border-slate-300 bg-slate-600 py-4 my-4"
      >
        Update
      </button>

      {data && (
        <div className="mt-4">
          {data.error ? (
            <p className="text-red-500">Error: {data.error}</p>
          ) : (
            <p className="text-green-500">Success: {data.message}</p>
          )}
        </div>
      )}
    </form>
  );
}
