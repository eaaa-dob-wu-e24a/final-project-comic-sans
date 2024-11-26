import React from "react";

export default function DateCard({ time, title} ) {
    const cardTime = new Date(time);
    console.log(time);
  return (
    <li
      className="bg-white rounded-2xl text-black p-4 shadow-md flex flex-col basis-0 grow shrink-0 place-content-center">
      <div className="flex flex-col place-items-center">
        <p className="text-sm font-bold opacity-60">
          {time
            ? new Date(time).toLocaleString(
                "default",
                {
                  weekday: "long",
                }
              )
            : "N/A"}
        </p>
        <p className="text-gradientend my-[-0.25rem] text-4xl font-bold">
          {time
            ? new Date(time).toLocaleString(
                "default",
                {
                  day: "2-digit",
                }
              )
            : "N/A"}
        </p>
        <p className="font-bold  opacity-60 text-lg">
          {time
            ? new Date(time)
                .toLocaleString("default", {
                  month: "short",
                })
                .toUpperCase()
            : "N/A"}
        </p>
      </div>

      <p className="mx-auto font-bold text-2xl capitalize">{title}</p>
    </li>
  );
}
