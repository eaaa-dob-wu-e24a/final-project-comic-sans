"use client"; // Ensure this is the very first line

import React, { useState, useEffect } from "react";
import GradientCurve from "@/components/gradientcurve";
import Calendar from "@/components/calendar";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import FormLabel from "@/components/ui/formlabel";
import SelectedDate from "@/components/selected-date";

const CreateEvent = () => {
  // State variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedDates, setSelectedDates] = useState([]); // Array of { date: Date, timeSlots: [{ startTime: string, duration: number }] }
  const [responseMessage, setResponseMessage] = useState(null);

  // API endpoints
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/event/create";
  const joinCodeEndpoint =
    process.env.NEXT_PUBLIC_API_URL + "/api/code/generate";
  const userSessionEndpoint =
    process.env.NEXT_PUBLIC_API_URL + "/api/user/check_session";

  const fetchUserSession = async () => {
    try {
      const response = await fetch(userSessionEndpoint, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (data.status === "success" && data.user) {
        setUserName(data.user.name); // Set the username if user is logged in
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
      // Leave userName as an empty string if fetching fails
    }
  };

  const fetchJoinCode = async () => {
    try {
      const response = await fetch(joinCodeEndpoint, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch join code.");
      }

      const data = await response.json();
      setJoinCode(data.code);
    } catch (error) {
      console.error("Error fetching join code:", error);
      setJoinCode("");
    }
  };

  // Fetch user session and join code on component mount
  useEffect(() => {
    fetchUserSession(); // Attempt to fetch user data
    fetchJoinCode(); // Fetch join code
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Flatten the selectedDates to individual time slots
    const formattedProposedDates = selectedDates.flatMap((item) => {
      const { date, timeSlots } = item;

      // Log the original date object
      console.log("Original Date Object:", date);

      return timeSlots.map(({ startTime, duration }) => {
        const localDateTimeString = `${date.toLocaleDateString(
          "en-CA"
        )}T${startTime}:00`; // "YYYY-MM-DD" format
        console.log("Local DateTime String:", localDateTimeString);

        const startDateTime = new Date(localDateTimeString);
        console.log("Adjusted Start DateTime Object:", startDateTime);

        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(endDateTime.getHours() + parseInt(duration, 10));
        console.log("Adjusted End DateTime Object:", endDateTime);

        // Format to save in local time format
        const startLocalTime = `${startDateTime.toLocaleDateString(
          "en-CA"
        )} ${startDateTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
        const endLocalTime = `${endDateTime.toLocaleDateString(
          "en-CA"
        )} ${endDateTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;

        console.log("Start Time (Local):", startLocalTime);
        console.log("End Time (Local):", endLocalTime);

        return {
          start: startLocalTime,
          end: endLocalTime,
        };
      });
    });

    console.log("Formatted Proposed Dates:", formattedProposedDates);

    const eventData = {
      title,
      description,
      location,
      joinCode, // Include the fetched join code
      userName,
      proposedDates: formattedProposedDates, // Now includes all time slots
    };

    console.log("Event Data to be Submitted:", eventData);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
        credentials: "include", // Send cookies with the request if needed for session-based auth
      });

      const data = await response.json();

      console.log("API Response Data:", data);

      if (response.ok) {
        setResponseMessage({
          success: true,
          message: "Event created successfully!",
        });
        fetchJoinCode(); // Fetch a new join code after creating the event
        setSelectedDates([]); // Reset selected dates after successful submission
        // Optionally, reset other form fields
        setTitle("");
        setDescription("");
        setLocation("");
        setUserName("");
      } else {
        setResponseMessage({
          success: false,
          message: data.error || "Failed to create event.",
        });
        console.error("Error creating event:", data.error);
      }
    } catch (error) {
      setResponseMessage({
        success: false,
        message: "Network error: " + error.message,
      });
      console.error("Network error:", error);
    }
  };

  // Handle date selection from the calendar
  const handleDateSelect = (date) => {
    // Check if the date is already in selectedDates
    const exists = selectedDates.some(
      (item) => item.date.getTime() === date.getTime()
    );

    let updatedDates;
    if (exists) {
      // If the date is already selected, remove it
      updatedDates = selectedDates.filter(
        (item) => item.date.getTime() !== date.getTime()
      );
    } else {
      // Add new date with an initial time slot
      updatedDates = [
        ...selectedDates,
        {
          date: date,
          timeSlots: [{ startTime: "12:00", duration: 1 }], // Initial time slot
        },
      ];
    }

    // Sort the dates in ascending order
    updatedDates.sort((a, b) => a.date - b.date);

    setSelectedDates(updatedDates);
  };

  // Add a new time slot to a specific date
  const addTimeSlot = (dateIndex) => {
    const updatedDates = selectedDates.map((dateItem, idx) => {
      if (idx === dateIndex) {
        return {
          ...dateItem,
          timeSlots: [
            ...dateItem.timeSlots,
            { startTime: "12:00", duration: 1 }, // Default values
          ],
        };
      }
      return dateItem;
    });
    setSelectedDates(updatedDates);
  };

  const removeTimeSlot = (dateIndex, timeIndex) => {
    const updatedDates = selectedDates.map((dateItem, idx) => {
      if (idx === dateIndex) {
        // Remove the specific time slot
        const updatedTimeSlots = dateItem.timeSlots.filter(
          (_, tIdx) => tIdx !== timeIndex
        );

        // Return updated date item or filter out if no time slots remain
        return updatedTimeSlots.length > 0
          ? { ...dateItem, timeSlots: updatedTimeSlots }
          : null; // Mark for removal
      }
      return dateItem;
    });

    // Filter out dates with no time slots left
    setSelectedDates(updatedDates.filter(Boolean));
  };

  // Handle changes in a specific time slot
  const handleTimeSlotChange = (dateIndex, timeIndex, field, value) => {
    const updatedDates = selectedDates.map((dateItem, idx) => {
      if (idx === dateIndex) {
        const updatedTimeSlots = dateItem.timeSlots.map((timeItem, tIdx) => {
          if (tIdx === timeIndex) {
            return { ...timeItem, [field]: value };
          }
          return timeItem;
        });
        return { ...dateItem, timeSlots: updatedTimeSlots };
      }
      return dateItem;
    });
    setSelectedDates(updatedDates);
  };

  return (
    <main className="flex flex-col min-h-screen bg-sitebackground">
      {/* Header with GradientCurve */}
      <GradientCurve className={"max-h-24"}>
        <div className="max-w-6xl mx-auto flex">
          <h1 className="font-bold text-2xl mx-auto max-w-6xl pb-12 text-white">
            Create Event
          </h1>
        </div>
      </GradientCurve>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl w-full mx-auto p-4 lg:p-8 flex flex-col space-y-8"
      >
        {/* Event Details Container */}
        <div className="bg-background p-6 lg:px-32 py-8 rounded-xl drop-shadow">
          <div className="event-details-container flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-2xl">Add Details</h2>
              {/* Join Code Section */}
              <div className="flex justify-end items-center">
                <div className="text-right text-2xl text-foreground font-bold flex flex-col items-end">
                  <p className="text-lg font-bold">JOIN CODE</p>
                  <p className="text-2xl font-bold text-primary">
                    {joinCode || "Fetching..."}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <FormLabel htmlFor="title" variant="lg">
                Event Name
              </FormLabel>
              <Input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to call the event?"
                maxLength="30"
                className="border border-secondary-10 w-full"
                required
              />
            </div>

            <div>
              <FormLabel htmlFor="userName" variant="lg">
                Organiser
              </FormLabel>
              <Input
                type="text"
                id="userName"
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Who is organising this event?"
                className="border border-secondary-10 w-full"
                required
              />
            </div>

            <div>
              <FormLabel htmlFor="location" variant="lg">
                Location
              </FormLabel>
              <Input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="border border-secondary-10 w-full"
                required
              />
            </div>

            <div>
              <FormLabel htmlFor="description" variant="lg">
                Description
              </FormLabel>
              <textarea
                id="description"
                name="description"
                className="leading-6 rounded-xl w-full mt-1 px-4 py-2 text-black border border-secondary-10 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                maxLength="500"
                required
              />
            </div>
          </div>
        </div>

        {/* Calendar and Selected Dates Container */}
        <div className="bg-background p-6 lg:px-32 py-8 rounded-xl drop-shadow">
          <h2 className="font-bold text-2xl mb-4">Add Times</h2>

          <div className="calendar-container flex flex-col lg:flex-row gap-10">
            {/* Calendar */}
            <div className="w-full lg:w-1/2">
              <p className="text-lg font-medium mb-2">Select Dates</p>
              <Calendar
                selectedDates={selectedDates}
                handleDateSelect={handleDateSelect}
              />
            </div>

            {/* -------------------------------------------------Selected Dates--------------------------------------------------------- */}
            <section className="w-full">
              <div>
                <FormLabel variant="lg">Selected Dates</FormLabel>
                {selectedDates.length === 0 && (
                  <p className="text-gray-500">No dates selected.</p>
                )}
              </div>

              <div className="w-full lg:w-full space-y-2.5 overflow-y-auto max-h-96 my-1 mx-1">
                {selectedDates.map((item, dateIndex) => (
                  <SelectedDate
                    key={dateIndex}
                    date={item.date}
                    timeSlots={item.timeSlots}
                    dateIndex={dateIndex}
                    addTimeSlot={addTimeSlot}
                    removeTimeSlot={removeTimeSlot}
                    handleTimeSlotChange={handleTimeSlotChange}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Response Message */}
        {responseMessage && (
          <div
            className={`mt-4 ${
              responseMessage.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {responseMessage.message}
          </div>
        )}

        {/* Create Event Button - Positioned Outside Both Containers */}
        <div className="flex justify-center">
          <Button variant="secondary" type="submit" className="w-48">
            Create Event
          </Button>
        </div>
      </form>
    </main>
  );
};

export default CreateEvent;
