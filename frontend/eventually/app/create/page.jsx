"use client"; // Ensure this is the very first line

import React, { useState, useEffect, useContext } from "react";
import GradientCurve from "@/components/gradientcurve";
import Calendar from "@/components/calendar";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import FormLabel from "@/components/ui/formlabel";
import SelectedDate from "@/components/selected-date";
import { AuthContext } from "@/contexts/authcontext";

export default function CreateEvent() {
  const { user } = useContext(AuthContext);

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

  useEffect(() => {
    if (user) {
      setUserName(user.name); // Set the username from AuthContext
    }
    fetchJoinCode(); // Fetch join code
  }, [user]);

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

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${String(hour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}`;
        times.push(time);
      }
    }
    return times;
  };

  const isPastTime = (time, date) => {
    const [hour, minute] = time.split(":").map(Number);
    const now = new Date();
    const selectedDate = new Date(date);
    selectedDate.setHours(hour, minute, 0, 0);
    return selectedDate < now;
  };

  const allTimes = generateTimeOptions(); // All times for the entire day

  // Calculate the next available time slot
  const getNextAvailableTime = () => {
    const now = new Date();
    const nextMinutes = Math.ceil(now.getMinutes() / 15) * 15; // Round up to the nearest 15 minutes
    if (nextMinutes === 60) {
      now.setHours(now.getHours() + 1, 0, 0, 0);
    } else {
      now.setMinutes(nextMinutes, 0, 0);
    }
    const hour = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hour}:${minutes}`;
  };

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
      const defaultStartTime = isToday(date) ? getNextAvailableTime() : "12:00"; // Next slot for today, 12:00 otherwise
      updatedDates = [
        ...selectedDates,
        {
          date: date,
          timeSlots: [{ startTime: defaultStartTime, duration: 1 }], // Initial time slot
        },
      ];
    }

    // Sort the dates in ascending order
    updatedDates.sort((a, b) => a.date - b.date);

    setSelectedDates(updatedDates);
  };

const addTimeSlot = (dateIndex) => {
  const updatedDates = selectedDates.map((dateItem, idx) => {
    if (idx === dateIndex) {
      let defaultStartTime = isToday(dateItem.date)
        ? getNextAvailableTime()
        : "12:00";

      const disabledTimes = getDisabledTimes(dateIndex);

      // Find index of defaultStartTime in allTimes
      let startIndex = allTimes.findIndex((t) => t === defaultStartTime);
      if (startIndex === -1) {
        // If somehow not found, fallback to noon as start
        startIndex = allTimes.findIndex((t) => t === "12:00");
      }

      // Iterate forward from startIndex to find the next available time slot
      let foundTime = null;
      for (let i = startIndex; i < allTimes.length; i++) {
        const candidate = allTimes[i];
        if (
          !isPastTime(candidate, dateItem.date) &&
          !disabledTimes.includes(candidate)
        ) {
          foundTime = candidate;
          break;
        }
      }

      // If we found a suitable time, use it; otherwise defaultStartTime remains what it was
      if (foundTime) {
        defaultStartTime = foundTime;
      } else {
        // If no future time is available, for now, leave defaultStartTime as is (even if it's not allowed),
      }

      return {
        ...dateItem,
        timeSlots: [
          ...dateItem.timeSlots,
          { startTime: defaultStartTime, duration: 1 },
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
  const getDisabledTimes = (dateIndex) => {
    const allTimes = selectedDates[dateIndex]?.timeSlots.map(
      (slot) => slot.startTime
    );
    return allTimes || [];
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Flatten the selectedDates to individual time slots
    const formattedProposedDates = selectedDates.flatMap((item) => {
      const { date, timeSlots } = item;

      // Log the original date object
      return timeSlots.map(({ startTime, duration }) => {
        const localDateTimeString = `${date.toLocaleDateString(
          "en-CA"
        )}T${startTime}:00`; // "YYYY-MM-DD" format

        const startDateTime = new Date(localDateTimeString);

        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(endDateTime.getHours() + parseInt(duration, 10));

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

        return {
          start: startLocalTime,
          end: endLocalTime,
        };
      });
    });

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
}
