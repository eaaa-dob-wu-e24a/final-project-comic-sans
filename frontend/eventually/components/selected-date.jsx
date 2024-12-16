"use client";

import React, { useState, useRef, useEffect } from "react";

export default function SelectedDate({
  date,
  timeSlots,
  dateIndex,
  addTimeSlot,
  removeTimeSlot,
  handleTimeSlotChange,
  getDisabledTimes,
  allTimes,
  isPastTime,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

  const disabledTimes = getDisabledTimes();

  const handleTimeClick = (time, timeIndex) => {
    handleTimeSlotChange(dateIndex, timeIndex, "startTime", time);
    setDropdownOpen(null);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleDropdownOpen = (timeIndex) => {
    setDropdownOpen(dropdownOpen === timeIndex ? null : timeIndex);

    if (dropdownOpen !== timeIndex) {
      setTimeout(() => {
        if (dropdownRef.current) {
          const noonIndex = allTimes.findIndex((time) => time === "12:00");
          const noonElement = dropdownRef.current.children[noonIndex];
          if (noonElement) {
            const dropdownHeight = dropdownRef.current.clientHeight;
            const noonOffset = noonElement.offsetTop;
            dropdownRef.current.scrollTop =
              noonOffset - dropdownHeight / 7 + noonElement.offsetHeight / 2;
          }
        }
      }, 0);
    }
  };

  return (
    <div className="flex flex-col overflow-visible py-2 px-4 rounded-lg shadow-sm border border-secondary w-full">
      {timeSlots.map((timeSlot, timeIndex) => (
        <div
          key={timeIndex}
          className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-2 md:gap-4 lg:gap-4 w-full"
        >
          {timeIndex === 0 && (
            <div className="flex flex-row lg:flex-col items-start justify-start">
              <span className="text-base mr-2 md:text-sm font-semibold text-foreground">
                {date.toLocaleDateString("en-GB", { weekday: "short" })}
              </span>
              <span className="text-primary font-bold text-base md:text-lg">
                {date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-1 relative md:ml-auto lg:ml-auto">
            <div className="flex flex-col items-start">
              {timeIndex === 0 && (
                <label
                  htmlFor={`startTime-${dateIndex}-${timeIndex}`}
                  className="text-xs text-foreground"
                >
                  Start time
                </label>
              )}
              <input
                id={`startTime-${dateIndex}-${timeIndex}`}
                type="time"
                className="rounded-full min-w-24 border px-2 py-1 text-sm text-dark focus:outline-none focus:border-primary cursor-pointer"
                value={timeSlot.startTime}
                readOnly
                onClick={() => handleDropdownOpen(timeIndex)}
              />
              {dropdownOpen === timeIndex && (
                <ul
                  ref={dropdownRef}
                  className={`absolute z-10 ${
                    timeIndex === 0 ? "mt-3.5" : "mt-3.75"
                  } max-h-40 w-28 overflow-y-scroll border rounded-lg bg-white text-dark shadow-lg`}
                >
                  {allTimes.map((time) => (
                    <li
                      key={time}
                      data-time={time}
                      onClick={() =>
                        !isPastTime(time) &&
                        !disabledTimes.includes(time) &&
                        handleTimeClick(time, timeIndex)
                      }
                      className={`px-4 py-2 text-sm cursor-pointer ${
                        disabledTimes.includes(time) || isPastTime(time)
                          ? "text-gray-400 cursor-not-allowed"
                          : "hover:bg-primary hover:text-white"
                      }`}
                    >
                      {time}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col items-start">
              {timeIndex === 0 && (
                <label
                  htmlFor={`duration-${dateIndex}-${timeIndex}`}
                  className="text-xs text-foreground"
                >
                  Duration
                </label>
              )}
              <select
                id={`duration-${dateIndex}-${timeIndex}`}
                className="block min-w-20 rounded-full border px-2 py-1 text-sm text-dark leading-5 focus:outline-none focus:border-primary"
                value={timeSlot.duration}
                onChange={(e) => {
                  const numericValue = parseInt(e.target.value, 10);
                  if (!isNaN(numericValue)) {
                    handleTimeSlotChange(
                      dateIndex,
                      timeIndex,
                      "duration",
                      numericValue
                    );
                  }
                }}
                required
              >
                {[...Array(5)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}h
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="flex items-center justify-center text-white rounded-full w-6 h-6"
              onClick={() => removeTimeSlot(dateIndex, timeIndex)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 44 48"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.66675 48C7.20008 48 5.94497 47.4782 4.90141 46.4347C3.85786 45.3911 3.33519 44.1351 3.33341 42.6667V8H0.666748V2.66667H14.0001V0H30.0001V2.66667H43.3334V8H40.6667V42.6667C40.6667 44.1333 40.145 45.3893 39.1014 46.4347C38.0579 47.48 36.8019 48.0018 35.3334 48H8.66675ZM35.3334 8H8.66675V42.6667H35.3334V8ZM14.0001 37.3333H19.3334V13.3333H14.0001V37.3333ZM24.6667 37.3333H30.0001V13.3333H24.6667V37.3333Z" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      <span
        className="mt-0 self-end text-foreground font-bold cursor-pointer hover:underline text-sm"
        onClick={() => addTimeSlot(dateIndex)}
      >
        + Add times
      </span>
    </div>
  );
}
