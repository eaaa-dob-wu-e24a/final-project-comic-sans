import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function DateCard({ time, title }) {
  // convert time to date class to use methods on it
  const cardTime = new Date(time);

  //set the day/date/month variables by processing time
  const day = cardTime.toLocaleString("default", {
    weekday: "short",
  });
  const date = cardTime.toLocaleString("default", {
    day: "2-digit",
  });
  const month = cardTime
    .toLocaleString("default", {
      month: "short",
    })
    .toUpperCase();

  // if no time variable was passed, show the other card variant
  let showDate = true;
  if (!time || date.length > 3) {
    showDate = false;
  }

  // if the title is too long to fit the card, reduce it and append dots
  function truncateString(str) {
    return str.slice(0, Math.min(16, str.length)) + "...";
  }
  let newTitle = title;
  if (title.length > 20) {
    newTitle = truncateString(title);
  }
  // split the classes for the main card so its easier to read
  const classes =
    "text-center group min-h-44 min-w-32 bg-gradient-to-r from-gradientstart to-gradientend text-foreground rounded-2xl shadow-lg flex flex-col basis-32 grow shrink-0 place-content-center max-w-lg relative hover:cursor-pointer h-full";
  const beforeClasses =
    "before:bg-background before:content-[''] before:inset-[1px] before:absolute before:rounded-2xl hover:before:opacity-0"; // remember to set z-index on content, otherwise it goes behind the pseudo-element

  if (showDate == true) {
    return (
      <li className={`${classes} ${beforeClasses}`}>
        <div className="flex flex-col absolute top-4 w-full z-10 group-hover:text-white">
          <p className="text-sm font-bold opacity-60">{time ? day : ""}</p>
          <p className="text-gradientend my-[-0.25rem] text-4xl font-bold group-hover:text-white">
            {time ? date : " "}
          </p>
          <p className="font-bold  opacity-60 text-lg">
            {time ? month : <div className="my-8">No date set</div>}
          </p>
        </div>

        <p className="mx-auto absolute bottom-4 w-full px-4 font-bold text-lg z-10 group-hover:text-white">
          {newTitle}
        </p>
      </li>
    );
  } else {
    return (
      <li className={`${classes} ${beforeClasses}`}>
        {/* <div className="flex flex-col place-items-center z-10 group-hover:text-white">

          <p className="font-bold  opacity-60 text-lg">No date set</p>
        </div> */}
        <p className="mx-auto font-bold text-xl z-10 group-hover:text-white">
          {newTitle}
        </p>
        <div
          className="mx-auto absolute place-self-center bottom-2 z-10 flex flex-row gap-2 group-hover:text-white"
          href="/dashboard/"
        >
          <p>Share link</p>
          <Image
            src="share.svg"
            width={12}
            height={12}
            alt="share icon"
          ></Image>
        </div>
      </li>
    );
  }
}
