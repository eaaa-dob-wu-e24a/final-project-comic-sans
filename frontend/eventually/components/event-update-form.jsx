"use client";
import React, { useState } from "react";
import { useNotif } from "./notif-context";
import Button from "./ui/button";
import SelectedDate from "@/components/selected-date";
import Calendar from "@/components/calendar";

import FormLabel from "@/components/ui/formlabel";
import Input from "@/components/ui/input";

export default function EventUpdateForm({ event }) {
  const notif = useNotif();
  const [formValues, setFormValues] = useState({
    Title: event?.Title || "",
    Description: event?.Description || "",
    UserName: event?.UserName || "",
    Location: event?.Location || "",
  });
  const [data, setData] = useState(null); // State to store response or errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = process.env.NEXT_PUBLIC_API_URL + "/api/event/update/";
    const payload = {
      ID: event.ID, // Ensure the correct event ID is sent
      ...formValues,
    };

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      notif.send("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      setData({ error: error.message });
      notif.send("Failed to update event.");
    }
  };

  return (
    <>
      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl w-full mx-auto p-4 lg:p-8 flex flex-col space-y-8"
      >
        <div className="bg-background p-6 lg:px-32 py-8 rounded-xl drop-shadow">
          <div className="event-details-container flex flex-col space-y-6">
            <h2 className="font-bold text-2xl">Update Details</h2>
            <div>
              <FormLabel htmlFor="Title" variant="lg">
                Event Name
              </FormLabel>
              <Input
                id="Title"
                name="Title"
                type="text"
                value={formValues.Title}
                onChange={handleChange}
                placeholder="Enter a new title..."
                maxLength="30"
                className="border border-secondary-10 w-full"
              />
            </div>
            <div>
              <FormLabel htmlFor="userName" variant="lg">
                Organiser
              </FormLabel>
              <Input
                id="userName"
                name="userName"
                type="text"
                value={formValues.UserName}
                onChange={handleChange}
                placeholder="Who is organising this event?"
                className="border border-secondary-10 w-full"
              />
            </div>
            <div>
              <FormLabel htmlFor="Location" variant="lg">
                Location
              </FormLabel>
              <Input
                id="Location"
                name="Location"
                type="text"
                value={formValues.Location}
                onChange={handleChange}
                placeholder="Enter a new location..."
                className="border border-secondary-10 w-full"
              />
            </div>
            <div>
              <FormLabel htmlFor="Description" variant="lg">
                Description
              </FormLabel>
              <textarea
                id="Description"
                name="Description"
                className="rounded-full shadow-cardshadow text-dark py-2 px-4 w-full focus:border-secondary focus:ring-1 focus:ring-secondary focus:bg-white/80 focus:outline-none"
                value={formValues.Description}
                onChange={handleChange}
                placeholder="Update your description..."
                maxLength="500"
              />
            </div>

            {/* -------------------------------------------------Selected Dates--------------------------------------------------------- */}
            <section className="w-full">
              <FormLabel variant="lg">Selected Dates</FormLabel>
              {selectedDates.length === 0 && (
                <p className="text-gray-500">No dates selected.</p>
              )}
              <div className="flex flex-col h-full w-full space-y-2.5 overflow-y-auto max-h-96 my-1 mx-1">
                {selectedDates.map((item, dateIndex) => (
                  <SelectedDate
                    key={dateIndex}
                    date={item.date}
                    timeSlots={item.timeSlots}
                    dateIndex={dateIndex}
                    addTimeSlot={addTimeSlot}
                    removeTimeSlot={removeTimeSlot}
                    handleTimeSlotChange={handleTimeSlotChange}
                    getDisabledTimes={() => getDisabledTimes(dateIndex)}
                    allTimes={allTimes}
                    isPastTime={(time) => isPastTime(time, item.date)}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
        <div className="flex justify-center">
          <Button variant="secondary" type="submit" className="w-48">
            Update Event
          </Button>
        </div>
        {data && (
          <div className="mt-4">
            {data.error ? (
              <p className="text-red-500">Error: {data.error}</p>
            ) : (
              <p className="text-green-500">
                Success: {data.message || "Event updated successfully!"}
              </p>
            )}
          </div>
        )}
      </form>
    </>
  );
}
