import React from "react";
import Calendar from "@/components/calendar";
import SelectedDate from "@/components/selected-date";
import FormLabel from "@/components/ui/formlabel";

export default function DateAndTimeSelector({ selectedDates, setSelectedDates }) {
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

    const allTimes = generateTimeOptions(); // All times for the entire day

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
                    timeSlots: [{ startTime: defaultStartTime, duration: "1" }], // Initial time slot as string
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
                    // If not found, fallback to noon
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
                }

                return {
                    ...dateItem,
                    timeSlots: [
                        ...dateItem.timeSlots,
                        { startTime: defaultStartTime, duration: "1" }, // Set duration as string
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

    const handleTimeSlotChange = (dateIndex, timeIndex, field, value) => {
        const updatedDates = selectedDates.map((dateItem, idx) => {
            if (idx === dateIndex) {
                const updatedTimeSlots = dateItem.timeSlots.map((timeItem, tIdx) =>
                    tIdx === timeIndex
                        ? { ...timeItem, [field]: value } // Always set as string
                        : timeItem
                );
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

    return (
        <>
            <h2 className="font-bold text-2xl mb-4">Add Times</h2>
            <div className="calendar-container flex flex-col lg:flex-row gap-10">
                {/* Calendar */}
                <div className="w-full lg:w-1/2 align-center">
                    <p className="text-lg font-medium mb-2">Select Dates</p>
                    <Calendar
                        selectedDates={selectedDates}
                        handleDateSelect={handleDateSelect}
                    />
                </div>
                {/* Selected Dates */}
                <section className="w-full">
                    <FormLabel variant="lg">Selected Dates</FormLabel>
                    {selectedDates.length === 0 && (
                        <p className="text-gray-500">No dates selected.</p>
                    )}
                    <div className="flex flex-col w-full space-y-2.5 my-1 mx-1">
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
        </>
    );
}
