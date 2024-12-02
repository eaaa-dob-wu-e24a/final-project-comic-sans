import Checkbox from "./ui/checkbox";

export default function EventDateDetailCard({
  eventDates,
  onDateClick,
  loggedInUser,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(date),
      month: new Intl.DateTimeFormat("en-GB", { month: "long" }).format(date),
      year: new Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(date),
      time: new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date),
    };
  };

  return (
    <div>
      <p className="text-primary font-bold mb-4">Select Your Times:</p>
      <ul className="flex flex-row flex-wrap w-full gap-4">
        {eventDates.map((date, index) => {
          const selectedClasses =
            "bg-gradient-to-r from-gradientstart to-gradientend text-white border-none shadow-md";
          const unselectedClasses = "bg-white text-black border-gradientstart";

          const startDate = formatDate(date.DateTimeStart);
          const endDate = formatDate(date.DateTimeEnd);

          return (
            <div key={index} className="w-64">
              <li
                className={`flex flex-col items-center h-48 w-64 border p-4 rounded-lg cursor-pointer ${
                  date.selected ? selectedClasses : unselectedClasses
                }`}
                onClick={() => onDateClick(index)}
              >
                <div className="flex flex-col items-center">
                  <p
                    className={`text-4xl font-bold ${
                      date.selected ? "text-white" : "text-primary"
                    }`}
                  >
                    {startDate.day}
                  </p>
                  <p
                    className={`font-bold ${
                      date.selected ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {startDate.month}
                  </p>
                  <p
                    className={`font-bold mb-3 ${
                      date.selected ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {startDate.year}
                  </p>
                  <p
                    className={`font-bold ${date.selected ? "text-white" : ""}`}
                  >
                    {startDate.time} - {endDate.time}
                  </p>
                  {/* Pass checked and onChange props to the Checkbox */}
                  <Checkbox id={`checkbox-${index}`} checked={date.selected} />
                </div>
              </li>
              <div className="mt-4 text-sm">
                <h3 className="font-bold">Votes:</h3>
                {date.UserVotes.length > 0 ? (
                  <ul className="list-disc ml-4">
                    {date.UserVotes.map((vote, i) => (
                      <li key={i}>{vote.UserName}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No votes yet</p>
                )}
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
