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
      selected={selectedDates[0]?.date || null} // pick the first as a 'selected' date if desired
      highlightDates={[
        {
          "react-datepicker__day--selected": selectedDates.map(
            (item) => item.date
          ),
        },
      ]}
      onSelect={(date) => handleDateSelect(date)}
      minDate={getCurrentDate()} // Prevent selecting past dates
      showFullMonthYearPicker // Ensure only the current month is shown
      calendarStartDay={1}
    />
  );
}
