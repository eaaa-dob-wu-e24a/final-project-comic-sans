import Button from "./ui/button";

export default function EventDetail({ event }) {
  return (
    <div>
      <div className="flex place-content-between">
        <h1 className="text-xl font-bold">Title: {event?.Title}</h1>
        <div className="flex flex-row gap-2">
          <p className="place-self-center text-2xl font-bold">
            Join code: {event?.JoinCode}{" "}
          </p>
          <Button>Share</Button>
        </div>
      </div>

      <div className="flex place-content-between mt-2">
        <p className="text-primary font-bold">
          Location: {event?.Location || "DummyLocation"}
        </p>
        <p>Created by {event?.UserName || "DummyUser"}</p>
      </div>
      <h2 className="text-primary font-bold">Description </h2>

      <div className="shadow-md p-4 rounded-xl">
        <p> {event?.Description}</p>
      </div>
    </div>
  );
}
