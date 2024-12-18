"use client";
import React, { useState } from "react";
import { useNotif } from "./notif-context";
import Button from "./ui/button";
import SelectedDate from "@/components/selected-date";
import FormLabel from "@/components/ui/formlabel";
import Input from "@/components/ui/input";
import DateAndTimeSelector from "@/components/date-time-selector";
import { useRouter } from "next/navigation";

export default function EventUpdateForm({ event }) {

  const router = useRouter();

  const notif = useNotif();
  const initialDates = (event?.EventDates || []).map((item) => {
    return {
      date: new Date(item.DateTimeStart), // Convert to Date object
      timeSlots: [
        {
          startTime: new Date(item.DateTimeStart)
            .toISOString()
            .substring(11, 16), // Extract only "HH:mm" from ISO string
          duration: "1", // Placeholder duration
        },
      ],
    };
  });

  const [selectedDates, setSelectedDates] = useState(initialDates);

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

    // Flatten the selectedDates to match the expected payload format
    const formattedProposedDates = selectedDates.flatMap((item) => {
      const { date, timeSlots } = item;

      return timeSlots.map(({ startTime, duration }) => {
        const localDateTimeString = `${date.toISOString().split("T")[0]}T${startTime}:00`; // "YYYY-MM-DDTHH:mm:SS"

        const startDateTime = new Date(localDateTimeString);
        let endDateTime = new Date(startDateTime);

        // Adjust for duration
        if (duration === "all-day") {
          endDateTime.setHours(24, 0, 0, 0); // End of day
        } else {
          endDateTime.setHours(endDateTime.getHours() + parseInt(duration, 10));
        }

        // Return formatted start and end times
        return {
          start: startDateTime.toISOString().slice(0, 19).replace("T", " "),
          end: endDateTime.toISOString().slice(0, 19).replace("T", " "),
        };
      });
    });

    const payload = {
      ID: event.PK_ID, // Explicitly set ID
      ...formValues,
      ProposedDates: formattedProposedDates,
    };

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/event/update/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      notif.send("Event updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating event:", error);
      setData({ error: error.message });
      notif.send("Failed to update event.");
    }
  };

  const handleDeleteEvent = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/event/delete/",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ID: event.PK_ID }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete event. Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Event deleted successfully:", responseData);

      alert("Event deleted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again later.");
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
            <DateAndTimeSelector
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
            />
          </div>
        </div>
        <div className="pb-6 mx-4 flex gap-4 justify-center flex-col md:flex-row lg:flex-row">
          <Button variant="secondary" type="submit">
            Update Event
          </Button>
          <Button onClick={handleDeleteEvent} variant="secondaryoutline">
            Delete Event
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
