"use client";
import React from "react";

export default function EventUpdateForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/event/update/";
    let formValues = {};
    try {
      response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(formValues),
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col mx-auto max-w-96">
      <label htmlFor="eventid">Event ID to update (placeholder)</label>
      <input id="eventid" name="eventid" type="number" />

      <label htmlFor="newtitle">Title</label>
      <input
        id="newtitle"
        name="newtitle"
        type="text"
        placeholder="Enter a new title..."
      />

      <label htmlFor="newdesc">Description</label>
      <input
        id="newdesc"
        name="newdesc"
        type="text"
        placeholder="Update your description..."
      />

      <label htmlFor="newloc">Location</label>
      <input
        id="newloc"
        name="newloc"
        type="text"
        placeholder="Enter a new location..."
      />

      <button
        type="submit"
        className="border border-slate-300 bg-slate-600 py-4 my-4"
      >
        Update
      </button>
    </form>
  );
}
