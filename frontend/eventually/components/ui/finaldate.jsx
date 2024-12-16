export default function FinalDate({ date }) {
  const dateRaw = new Date(date);

  const dateFormatted = dateRaw.toDateString();
  const hrs = dateRaw.getHours();
  const mins = dateRaw.getMinutes();
  const time = dateRaw.toLocaleTimeString();
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-0 bg-gradient-to-r from-gradientstart to-gradientend p-4 my-0 rounded-2xl shadow-md ">
      <p className="text-white text-lg text-center my-0 py-0">Scheduled for</p>
      <p className="text-white text-lg text-center">
        <span className="font-bold">{dateFormatted} </span>at{" "}
        <span className="font-bold">{time}</span>
      </p>
    </div>
  );
}
