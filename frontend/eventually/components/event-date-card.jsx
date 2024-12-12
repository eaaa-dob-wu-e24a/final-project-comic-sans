import Link from "next/link";
import { useCallback } from "react";
import { useNotif } from "@/components/notif-context";

export default function DateCard({ time, title, id, joinCode }) {
  const notif = useNotif();

  // convert time to date class to use methods on it
  const cardTime = time ? new Date(time) : null;

  //set the day/date/month variables by processing time
  let day, date, month;
  if (cardTime) {
    day = cardTime.toLocaleString("default", { weekday: "short" });
    date = cardTime.toLocaleString("default", { day: "2-digit" });
    month = cardTime
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
  }

  // if no time variable was passed, show the other card variant
  let showDate = true;
  if (!time || !date || date.length > 3) {
    showDate = false;
  }

  // if the title is too long to fit the card, reduce it and append dots
  function truncateString(str) {
    return (
      str.slice(0, Math.min(16, str.length)) + (str.length > 20 ? "..." : "")
    );
  }
  let newTitle = title;
  if (title.length > 20) {
    newTitle = truncateString(title);
  }
  // split the classes for the main card so its easier to read
  const classes =
    "text-center group min-h-44 min-w-40 bg-gradient-to-r from-gradientstart to-gradientend text-foreground rounded-2xl shadow-md flex flex-col basis-32 grow shrink-0 place-content-center max-w-lg relative hover:cursor-pointer h-full";
  const beforeClasses =
    "before:bg-background before:content-[''] before:inset-[1px] before:absolute before:rounded-2xl hover:before:opacity-0"; // remember to set z-index on content, otherwise it goes behind the pseudo-element

  // Copy link functionality
  const copyLink = useCallback(() => {
    const shareURL = `https://final-project-comic-sans-fork.vercel.app/join/${joinCode}`;
    navigator.clipboard.writeText(shareURL).then(() => {
      notif?.send("Event link copied to clipboard!");
    });
  }, [joinCode, notif]);

  if (showDate) {
    // If final date/time is set, show date variant
    return (
      <Link href={`/dashboard/event/${id}`} className={`${classes}`}>
        <li className={`${classes} ${beforeClasses}`}>
          <div className="flex flex-col absolute top-4 w-full z-10 group-hover:text-white">
            <p className="text-sm font-bold opacity-60">{time ? day : ""}</p>
            <p className="text-gradientend my-[-0.25rem] text-4xl font-bold group-hover:text-white">
              {time ? date : " "}
            </p>
            <p className="font-bold opacity-60 text-lg">
              {time ? month : <div className="my-8">No date set</div>}
            </p>
          </div>

          <p className="mx-auto absolute bottom-4 w-full px-4 break-words font-bold text-lg z-10 group-hover:text-white">
            {newTitle}
          </p>
        </li>
      </Link>
    );
  } else {
    // No final date set - show no-date variant with share link button
    return (
      <Link href={`/dashboard/event/${id}`} className={`${classes}`}>
        <li className={`${classes} ${beforeClasses}`}>          <p className="mx-auto font-bold text-xl z-10 break-words group-hover:text-white">
            {newTitle}
          </p>

          {/* Replace old share link text with a clickable button that copies the link */}
          <div
            className="mx-2 my-2 bottom-0 z-10 flex flex-row justify-center group-hover:text-white"
            href="/dashboard/"
          >
            <div className="absolute bottom-0 w-full z-10">
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation on button click
                  copyLink();
                }}
                className="flex items-center gap-2 justify-center bg-secondary-10 text-white py-2 w-full rounded-b-2xl hover:bg-secondary"
              >
                {/* Icon from new code */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="white"
                >
                  <path d="M672.22-100q-44.91 0-76.26-31.41-31.34-31.41-31.34-76.28 0-6 4.15-29.16L284.31-404.31q-14.46 15-34.36 23.5t-42.64 8.5q-44.71 0-76.01-31.54Q100-435.39 100-480q0-44.61 31.3-76.15 31.3-31.54 76.01-31.54 22.74 0 42.64 8.5 19.9 8.5 34.36 23.5l284.46-167.08q-2.38-7.38-3.27-14.46-.88-7.08-.88-15.08 0-44.87 31.43-76.28Q627.49-860 672.4-860t76.25 31.44Q780-797.13 780-752.22q0 44.91-31.41 76.26-31.41 31.34-76.28 31.34-22.85 0-42.5-8.69Q610.15-662 595.69-677L311.23-509.54q2.38 7.39 3.27 14.46.88 7.08.88 15.08t-.88 15.08q-.89 7.07-3.27 14.46L595.69-283q14.46-15 34.12-23.69 19.65-8.69 42.5-8.69 44.87 0 76.28 31.43Q780-252.51 780-207.6t-31.44 76.25Q717.13-100 672.22-100Z" />
                </svg>
                Share link
              </button>
            </div>
          </div>
        </li>
      </Link>
    );
  }
}
