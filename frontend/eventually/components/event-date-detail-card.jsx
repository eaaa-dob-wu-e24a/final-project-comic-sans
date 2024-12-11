import Checkbox from "./ui/checkbox";
import EventAvatar from "./event-detail-avatar";

export default function EventDateDetailCard({
  eventDates,
  pendingSelections,
  onPendingSelection,
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
      <p className="text-primary font-bold mb-4 text-lg">Select Your Times:</p>
      <ul className="flex flex-row flex-wrap w-full gap-4">
        {eventDates.map((date, index) => {
          const selected = pendingSelections[index];
          const selectedClasses =
            "bg-gradient-to-r from-gradientstart to-gradientend text-white border-none shadow-md";
          const unselectedClasses = "bg-white text-black border-gradientstart";

          const startDate = formatDate(date.DateTimeStart);
          const endDate = formatDate(date.DateTimeEnd);

          return (
            <div key={index} className="w-64 mb-4">
              <li
                className={`flex flex-col items-center h-48 w-64 border p-4 rounded-lg cursor-pointer ${
                  selected ? selectedClasses : unselectedClasses
                }`}
                onClick={() => onPendingSelection(index)}
              >
                <div className="flex flex-col items-center">
                  <p
                    className={`text-4xl font-bold ${
                      selected ? "text-white" : "text-primary"
                    }`}
                  >
                    {startDate.day}
                  </p>
                  <p
                    className={`font-bold ${
                      selected ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {startDate.month}
                  </p>
                  <p
                    className={`font-bold mb-3 ${
                      selected ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {startDate.year}
                  </p>
                  <p className={`font-bold ${selected ? "text-white" : ""}`}>
                    {startDate.time} - {endDate.time}
                  </p>
                  <Checkbox id={`checkbox-${index}`} checked={selected} />
                </div>
              </li>

              {/* Participants List */}
              <div className="mt-4 ml-2 text-sm relative group">
                <h3>
                  Currently {date.UserVotes.length} participant
                  {date.UserVotes.length !== 1 && "s"}...
                </h3>

                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg p-2 hidden group-hover:block">
                  <ul className="space-y-2">
                    {date.UserVotes.map((vote, i) => (
                      <li key={i} className="flex items-center">
                        <EventAvatar
                          className="w-8 h-8"
                          variant="small"
                          user={{
                            name: vote.UserName,
                            imagePath: vote.UserImagePath,
                          }}
                        />
                        <span className="ml-2 truncate text-sm">
                          {vote.FK_User !== null &&
                          vote.FK_User === loggedInUser.userId
                            ? `${vote.UserName} (you)`
                            : vote.UserName}
                        </span>
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
