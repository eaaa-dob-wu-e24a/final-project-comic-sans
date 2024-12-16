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
      <div className="flex flex-col sm:flex-row place-content-between">
        <h1 className="text-2xl font-bold">{event?.Title}</h1>
        <div className="flex flex-row gap-2 mt-2 sm:mt-0 sm:w-auto w-full">
          <p className="place-self-left text-lg sm:text-2xl font-bold sm:w-auto w-2/3">
            Join code: {event?.JoinCode}{" "}
          </p>
          <Button
            onClick={handleShare}
            className="sm:w-auto sm:ml-2 w-auto self-center"
          >
            {" "}
            Share
          </Button>
        </div>
      </div>

      <div className="flex place-content-between mt-2">
        <p className="text-primary font-bold text-lg flex flex-nowrap gap-2 break-all">
          <Image
            src={"/locpin.svg"}
            height={28}
            width={28}
            alt="Map pin icon"
          ></Image>
          {event?.Location || "DummyLocation"}
        </p>
        <p className="text-center break-all">
          Created by {event?.UserName || "DummyUser"}
        </p>
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
