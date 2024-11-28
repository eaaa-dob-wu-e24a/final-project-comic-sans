import Link from "next/link";

export default function DateCard({ time, title, id }) {
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
    "text-center group min-h-44 min-w-32 bg-gradient-to-r from-gradientstart to-gradientend text-foreground rounded-2xl shadow-md flex flex-col basis-32 grow shrink-0 place-content-center max-w-lg relative hover:cursor-pointer h-full";
  const beforeClasses =
    "before:bg-background before:content-[''] before:inset-[1px] before:absolute before:rounded-2xl hover:before:opacity-0"; // remember to set z-index on content, otherwise it goes behind the pseudo-element

  if (showDate == true) {
    return (<Link href={`/dashboard/event/${id}`} className={`${classes}`}>
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
      </li></Link>
    );
  } else {
    return (
      <Link href={`/dashboard/event/${id}`} className={`${classes}`}>
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 23 23"
            className="fill-foreground mt-1 group-hover:fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.625 22.75C16.6875 22.75 15.8906 22.4219 15.2344 21.7656C14.5781 21.1094 14.25 20.3125 14.25 19.375V19.375C14.25 18.8954 14.0643 18.4299 13.65 18.1881L7.50232 14.6001C6.86688 14.2292 6.0724 14.3599 5.39062 14.6365V14.6365C4.99688 14.7963 4.575 14.8757 4.125 14.875C3.1875 14.875 2.39062 14.5469 1.73438 13.8906C1.07813 13.2344 0.75 12.4375 0.75 11.5C0.75 10.5625 1.07813 9.76562 1.73438 9.10938C2.39062 8.45313 3.1875 8.125 4.125 8.125C4.575 8.125 4.99688 8.20488 5.39062 8.36463V8.36463C6.07222 8.64116 6.86647 8.77099 7.50175 8.40022L14.0009 4.60715C14.1971 4.49263 14.2814 4.25995 14.2646 4.03337V4.03337C14.2556 3.91187 14.2507 3.77575 14.25 3.625C14.25 2.6875 14.5781 1.89062 15.2344 1.23438C15.8906 0.578125 16.6875 0.25 17.625 0.25C18.5625 0.25 19.3594 0.578125 20.0156 1.23438C20.6719 1.89062 21 2.6875 21 3.625C21 4.5625 20.6719 5.35938 20.0156 6.01562C19.3594 6.67187 18.5625 7 17.625 7C17.175 7 16.7531 6.92013 16.3594 6.76038V6.76038C15.6778 6.48384 14.8835 6.35401 14.2483 6.72478L7.75024 10.5172C7.55337 10.6321 7.46838 10.8655 7.4865 11.0927V11.0927C7.49625 11.215 7.50075 11.3508 7.5 11.5C7.49925 11.6492 7.49475 11.7854 7.4865 11.9084V11.9084C7.47133 12.1346 7.55363 12.368 7.74944 12.4823L14.2482 16.2752C14.8833 16.6459 15.6775 16.515 16.3594 16.2396V16.2396C16.7531 16.0806 17.175 16.0007 17.625 16C18.5625 16 19.3594 16.3281 20.0156 16.9844C20.6719 17.6406 21 18.4375 21 19.375C21 20.3125 20.6719 21.1094 20.0156 21.7656C19.3594 22.4219 18.5625 22.75 17.625 22.75Z"
            />
          </svg>
        </div>
      </li>
      </Link>
    );
  }
}
