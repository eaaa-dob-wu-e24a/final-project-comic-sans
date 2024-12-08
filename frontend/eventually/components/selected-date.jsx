import React from "react";
import Input from "@/components/ui/input";

export default function SelectedDate ({
  date,
  timeSlots,
  dateIndex,
  addTimeSlot,
  removeTimeSlot,
  handleTimeSlotChange,
}) {
  return (
    <div className="flex flex-col py-2 px-4 rounded-lg shadow-sm bg-secondary-100 border border-secondary-10">
      {timeSlots.map((timeSlot, timeIndex) => (
        <div
          key={timeIndex}
          className="flex items-start justify-between gap-4 w-full"
        >
          {/* Date Header - Only for the First Time Slot */}
          {timeIndex === 0 && (
            <div className="flex flex-col items-start justify-start">
              <span className="text-sm font-semibold text-foreground">
                {date.toLocaleDateString("en-GB", {
                  weekday: "short",
                })}
              </span>
              <span className="text-secondary font-bold text-lg">
                {date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 ml-auto mb-1">
            {/* Start Time Input */}
            <div className="flex flex-col items-start">
              {timeIndex === 0 && (
                <label
                  htmlFor={`startTime-${dateIndex}`}
                  className="text-xs text-dark"
                >
                  Start time
                </label>
              )}
              <Input
                id={`startTime-${dateIndex}`}
                className="w-32 rounded-full border px-2 py-px text-sm text-dark leading-5 focus:outline-none focus:ring focus:border-primary"
                type="time"
                value={timeSlot.startTime}
                onChange={(e) =>
                  handleTimeSlotChange(
                    dateIndex,
                    timeIndex,
                    "startTime",
                    e.target.value
                  )
                }
                required
              />
            </div>

            {/* Duration Dropdown */}
            <div className="flex flex-col items-start">
              {timeIndex === 0 && (
                <label
                  htmlFor={`duration-${dateIndex}`}
                  className="text-xs text-dark"
                >
                  Duration
                </label>
              )}
              <select
                id={`duration-${dateIndex}`}
                className="block w-24 rounded-full border px-2 py-1 text-sm text-dark leading-5 focus:outline-none focus:ring focus:border-primary"
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

            {/* Delete Time Slot Button */}
            <button
              type="button"
              className="flex items-center justify-center text-white rounded-full w-6 h-6"
              onClick={() => removeTimeSlot(dateIndex, timeIndex)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 44 48"
                fill="dark"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.66675 48C7.20008 48 5.94497 47.4782 4.90141 46.4347C3.85786 45.3911 3.33519 44.1351 3.33341 42.6667V8H0.666748V2.66667H14.0001V0H30.0001V2.66667H43.3334V8H40.6667V42.6667C40.6667 44.1333 40.145 45.3893 39.1014 46.4347C38.0579 47.48 36.8019 48.0018 35.3334 48H8.66675ZM35.3334 8H8.66675V42.6667H35.3334V8ZM14.0001 37.3333H19.3334V13.3333H14.0001V37.3333ZM24.6667 37.3333H30.0001V13.3333H24.6667V37.3333Z" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {/* Add Times Link */}
      <span
        className="mt-0 self-end text-secondary font-bold cursor-pointer hover:underline text-sm"
        onClick={() => addTimeSlot(dateIndex)}
      >
        + Add times
      </span>
    </div>
  );
};
