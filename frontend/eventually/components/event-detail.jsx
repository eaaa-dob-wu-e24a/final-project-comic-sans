import Button from "./ui/button";
import { useNotif } from "./notif-context";

export default function EventDetail({ event }) {
  const notif = useNotif();
  const handleShare = () => {
    const link = `https://final-project-comic-sans-fork.vercel.app/join/${event?.JoinCode}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        notif?.send("Link copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy the link: ", err);
        notif?.send("Failed to copy the link. Please try again.");
      });
  };

  return (
    <div>
      <div className="flex place-content-between">
        <h1 className="text-xl font-bold">{event?.Title}</h1>
        <div className="flex flex-row gap-2">
          <p className="place-self-center text-2xl font-bold">
            Join code: {event?.JoinCode}{" "}
          </p>
          <Button onClick={handleShare}>Share</Button>
        </div>
      </div>

      <div className="flex place-content-between mt-2">
        <p className="text-primary font-bold text-lg">
          Location: {event?.Location || "DummyLocation"}
        </p>
        <p>Created by {event?.UserName || "DummyUser"}</p>
      </div>
      <h2 className="text-primary font-bold text-lg">Description </h2>

      <div className="shadow-md p-4 rounded-xl">
        <p>{event?.Description}</p>
      </div>
    </div>
  );
}
