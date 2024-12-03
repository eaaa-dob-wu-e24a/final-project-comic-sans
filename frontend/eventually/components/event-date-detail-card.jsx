import Checkbox from "./ui/checkbox";

export default function EventDateDetailCard({
  eventDates,
  onDateClick,
  loggedInUser, //userID and username
}) {
  const formatDate = (dateString) => {
    console.log(eventDates);

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
              <div className="mt-4 ml-2 text-sm relative group">
                <h3>Currently {date.UserVotes.length} participants... </h3>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg p-2 hidden group-hover:block">
                  <ul>
                    {date.UserVotes.map((vote, i) => (
                      <li key={i}>
                        {vote.FK_User == loggedInUser.userId
                          ? vote.UserName + " (you)"
                          : vote.UserName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
