import React from "react";

export default function DateCard({ time, title }) {
  const cardTime = new Date(time);

  const beforeClasses = "before:bg-background before:content-[''] before:inset-[1px] before:absolute before:rounded-2xl hover:before:opacity-0 hover:before:transition-all before:duration-500 hover:before:duration-500" // remember to set z-index on content, otherwise it goes behind the pseudo-element

  console.log(time);
  return (
    <li className={`bg-gradient-to-r from-gradientstart to-gradientend text-foreground rounded-2xl p-4 shadow-lg flex flex-col basis-0 grow shrink-0 place-content-center max-w-48 relative hover:cursor-pointer ${beforeClasses}`}>
      <div className="flex flex-col place-items-center z-10">
        <p className="text-sm font-bold opacity-60">
          {time
            ? new Date(time).toLocaleString("default", {
                weekday: "long",
              })
            : "N/A"}
        </p>
        <p className="text-gradientend my-[-0.25rem] text-4xl font-bold">
          {time
            ? new Date(time).toLocaleString("default", {
                day: "2-digit",
              })
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

      <p className="mx-auto font-bold text-2xl capitalize z-10">{title}</p>
    </li>
  );
}
