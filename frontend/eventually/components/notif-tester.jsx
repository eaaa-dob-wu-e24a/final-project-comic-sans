"use client";
import { useNotif } from "./notif-context";
import Button from "./ui/button";

export default function NotifTester() {
    const notif = useNotif()
    const handleClick = ()=>{
        notif?.send('This is a slightly longer test message to check for styling when the box gets bigger :D');
    }
    return (
        <div className="mx-auto w-fit my-12"><Button onClick={handleClick}>Send notification</Button></div>
    )
}