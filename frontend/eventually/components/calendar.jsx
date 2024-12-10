"use client";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Calendar({ selectedDates, handleDateSelect }) {
  // Helper function to get the current date without time
  const getCurrentDate = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  };

  // Dynamically generate a unique key based on selectedDates
  const calendarKey = selectedDates
    .map((item) => item.date.getTime())
    .join(",");

  return (
    <DatePicker
      key={calendarKey} // Force re-render when selectedDates changes
      inline
      onSelect={(date) => handleDateSelect(date)}
      selected={null} // Disable single-date selection
      dayClassName={(date) =>
        selectedDates.some((item) => item.date.getTime() === date.getTime())
          ? "react-datepicker__day--selected" // Apply selected class
          : undefined
      }
      minDate={getCurrentDate()} // Prevent selecting past dates

      showFullMonthYearPicker // Ensure only the current month is shown
      calendarStartDay={1}
    />
  );
}
