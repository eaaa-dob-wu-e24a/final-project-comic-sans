
"use client"; // Ensure this is the very first line

import React, { useState, useEffect, useContext } from "react";
import GradientCurve from "@/components/gradientcurve";
import Calendar from "@/components/calendar";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import FormLabel from "@/components/ui/formlabel";
import SelectedDate from "@/components/selected-date";
import { AuthContext } from "@/contexts/authcontext";

const CreateEvent = () => {
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
      const defaultStartTime = isToday(date) ? getNextAvailableTime() : "12:00"; 
      updatedDates = [
        ...selectedDates,
        {
          date: date,
          timeSlots: [{ startTime: defaultStartTime, duration: 1 }],
        },
      ];
    }

    updatedDates.sort((a, b) => a.date - b.date);

    setSelectedDates(updatedDates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedProposedDates = selectedDates.flatMap((item) => {
      const { date, timeSlots } = item;

      return timeSlots.map(({ startTime, duration }) => {
        const localDateTimeString = `${date.toLocaleDateString(
          "en-CA"
        )}T${startTime}:00`;

        const startDateTime = new Date(localDateTimeString);

        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(endDateTime.getHours() + parseInt(duration, 10));

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
      joinCode,
      userName,
      proposedDates: formattedProposedDates,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage({
          success: true,
          message: "Event created successfully!",
        });
        fetchJoinCode();
        setSelectedDates([]);
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
      <GradientCurve className={"max-h-24"}>
        <div className="max-w-6xl mx-auto flex">
          <h1 className="font-bold text-2xl mx-auto max-w-6xl pb-12 text-white">
            Create Event
          </h1>
        </div>
      </GradientCurve>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl w-full mx-auto p-4 lg:p-8 flex flex-col space-y-8"
      >
        {/* Add Form Content */}
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
