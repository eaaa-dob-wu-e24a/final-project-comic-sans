import { useState, useEffect } from "react";

export default function Notification({ string }) {
  const [message, setMessage] = useState(string);
  let timeoutId;

  const visibleClasses = "-translate-x-12";
  const invisibleClasses = "translate-x-full";

  const [classes, setClasses] = useState(invisibleClasses);

  useEffect(() => {
    if (classes === invisibleClasses) {
        setClasses(visibleClasses);
        timeoutId = setTimeout(() => {
            setClasses(invisibleClasses);
          }, 4000);
    }
  }, [message]);

  const handleClick = () => {
    clearTimeout(timeoutId);
    setClasses(invisibleClasses);
    console.log("clicked");
  };


  const text = "Test message for testing purposes...";

  return (
    <div className={`flex translate-x- flex-col fixed bottom-12 right-0 bg-gradient-to-r from-gradientstart to-gradientend rounded-xl overflow-hidden bg-background min-w-48 shadow-lg max-w-96 z-20 before:bg-background before:content-[''] before:inset-[1px] before:absolute before:rounded-xl before:-z-10 transition-all duration-300 ${classes}`}>
      <div className="py-4 px-4 flex flex-row gap-4">
        <p>{text}</p>
        <button onClick={handleClick} className="bg-gray-500/10 p-4 rounded-md text-center h-9 relative place-items-center flex flex-row opacity-60 hover:opacity-100 hover:bg-secondary group">
          <div className="w-0.5 rounded-full h-4 bg-foreground place-self-center  rotate-45 group-hover:bg-white"></div>
          <div className="w-0.5 rounded-full h-4 bg-foreground place-self-center -ml-0.5 -rotate-45 group-hover:bg-white"></div>
        </button>
      </div>
    </div>
  );
}