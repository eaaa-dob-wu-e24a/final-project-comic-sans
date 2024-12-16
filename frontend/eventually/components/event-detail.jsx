import Button from "./ui/button";
import { useNotif } from "./notif-context";
import Image from "next/image";

export default function EventDetail({ event }) {
  const notif = useNotif();
  const handleShare = () => {
    const link = `https://eventually-api.nikolajhoeegjensen.com/qr/?join=${event?.JoinCode}`;
    window.location.href = link;
  };

  return (
    <div>
      <div className="flex place-content-between">
        <h1 className="text-2xl font-bold">{event?.Title}</h1>
        <div className="flex flex-row gap-2">
          <p className="place-self-center text-2xl font-bold">
            Join code: {event?.JoinCode}{" "}
          </p>
          <Button onClick={handleShare}>Share</Button>
        </div>
      </div>

      <div className="flex place-content-between mt-2">
        <p className="text-primary font-bold text-lg flex flex-nowrap gap-2">
          <Image
            src={"/locpin.svg"}
            height={28}
            width={28}
            alt="Map pin icon"
          ></Image>
          {event?.Location || "DummyLocation"}
        </p>
        <p>Created by {event?.UserName || "DummyUser"}</p>
      </div>
      <h2 className="text-primary font-bold text-lg flex flex-nowrap gap-2 mt-4">
        <Image
          src={"/desc.svg"}
          height={28}
          width={28}
          alt="Map pin icon"
        ></Image>
        Description
      </h2>

      <div className="shadow-md p-4 rounded-xl">
        <p>{event?.Description}</p>
      </div>
    </div>
  );
}
