"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { NotifContext } from "../notif-context";

function useTimeout(callbackFunction) {
    const savedCallback = useRef(callbackFunction);

    useEffect(() => {
        savedCallback.current = callbackFunction;
    }, [callbackFunction]);

    useEffect(() => {
       const functionId = setTimeout(() => savedCallback.current(), 3000);
       return () => clearTimeout(functionId);
    }, []);


}

export default function Notif({ message, close }) {
    useTimeout(()=>{
        close();
    });

  return (
    <div className={`notification flex flex-col relative bg-gradient-to-r from-gradientstart to-gradientend rounded-xl overflow-hidden bg-background min-w-48 shadow-lg max-w-96 z-20 before:bg-background before:content-[''] before:inset-[1px] before:absolute before:rounded-xl before:-z-10 transition-all duration-300`}>
      <div className="py-4 px-4 flex flex-row gap-4">
        <p>{message}</p>
        <button onClick={close} className="bg-gray-500/10 p-2 text-foreground text-xl rounded-md text-center h-8 relative place-items-center flex flex-row opacity-60 hover:opacity-100 hover:bg-secondary group">
         ✕
        </button>
      </div>
    </div>
  );
}

export function NotifProvider({ children }) {
    const [notifs, setNotifs] = useState([]);

    function sendNotif(message) {
        const newNotif = {
            id: Date.now(),
            message: message,
        };
        setNotifs((notifs) => [...notifs, newNotif]);
    }

    function closeNotif(id) {
        setNotifs((prev) => prev.filter((notif) => notif.id !== id));
    }

    const contextValue = useMemo(()=>({
        send: sendNotif,
        close: closeNotif
    }), [])



    return (
        <>
        <NotifContext.Provider value={contextValue}>
            {children}
            <div className="fixed bottom-12 right-12 z-50 flex flex-col-reverse gap-4">
            {notifs && notifs.map(notif => {
                return (
                <Notif key={notif.id} message={notif.message} close={() => closeNotif(notif.id)}></Notif>
            )})}</div>
        </NotifContext.Provider>
        </>
    )
}