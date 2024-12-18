"use client";

import React, { useState, useEffect, useContext } from "react";
import GradientCurve from "@/components/gradientcurve";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import FormLabel from "@/components/ui/formlabel";
import DateAndTimeSelector from "@/components/date-time-selector";
import { AuthContext } from "@/contexts/authcontext";
import { useNotif } from "@/components/notif-context";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const notif = useNotif();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // State variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedDates, setSelectedDates] = useState([]); // Array of { date: Date, timeSlots: [{ startTime: string, duration: number }] }

  // API endpoints
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/event/create/";
  const joinCodeEndpoint =
    process.env.NEXT_PUBLIC_API_URL + "/api/code/generate/";

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
        let endDateTime;

        if (duration === "all-day") {
          // Set end time to midnight (00:00) of the same day
          endDateTime = new Date(startDateTime);
          endDateTime.setHours(24, 0, 0, 0); // 24:00:00.000 is equivalent to 00:00:00.000 of the next day
        } else {
          endDateTime = new Date(startDateTime);
          endDateTime.setHours(endDateTime.getHours() + parseInt(duration, 10));
        }

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
      joinCode,
      userName,
      proposedDates: formattedProposedDates,
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
        if (user && user.name) {
          // User is logged in
          const joinCode = data.joinCode;
          router.push(`/join/${joinCode}`); // Redirect to the event page
        } else {
          // User is not logged in
          notif?.send(
            "Event created! Remember to copy your event code to share it with others"
          );
        }
      } else {
        notif?.send("Failed to create the event");
      }
    } catch (error) {
      notif?.send("Network error: " + error.message);
      console.error("Network error:", error);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-sitebackground">
      {/* Header with GradientCurve */}
      <GradientCurve className={"max-h-24"}>
        <div className="max-w-6xl mx-auto flex">
          <h1 className=" font-bold text-2xl mx-auto max-w-6xl pb-12 text-white">
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
                className="rounded-2xl shadow-cardshadow text-dark py-2 px-4 w-full focus:border-secondary focus:ring-1 focus:ring-secondary focus:bg-white/80 focus:outline-none"
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
          <DateAndTimeSelector
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
          />
        </div>
        <div className="flex justify-center">
          <Button variant="secondary" type="submit" className="w-48">
            Create Event
          </Button>
        </div>
      </form>
    </main>
  );
}
