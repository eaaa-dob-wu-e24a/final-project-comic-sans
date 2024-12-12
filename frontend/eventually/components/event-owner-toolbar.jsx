import Button from "./ui/button";
import FormLabel from "./ui/formlabel";
import { useNotif } from "./notif-context";

export default function EditEvent({ id, dates }) {
    const eventID = id;
    const notif = useNotif();

    // extract only the list of dates
    const datesArray = dates.map((obj, index) => ({
        PK_ID: obj.PK_ID,
        DateTimeStart: obj.DateTimeStart
    }));

    const url = process.env.NEXT_PUBLIC_API_URL + "/api/event/update/";

    const handleSubmit = async () => {
        const selector = document.getElementById("selection");
        const data = {
            ID: eventID,
            FinalDate: selector.value
        }
        try {
            const response = await fetch(url, {
                method: "PATCH",
                credentials: "include", // Include cookies for session handling
                body: JSON.stringify(data),
              })
              notif?.send("Final date updated!")
        } catch (error) {
            notif?.send("Failed to update final date")
        }
    }

  return (
    <section className="max-w-6xl mx-auto flex flex-col gap-4 bg-background p-6 my-12 rounded-2xl shadow-md">
      <div className="flex flex-row place-content-between w-full flex-wrap-reverse gap-4 place-items-center">
        <FormLabel variant="lg">Select Final Date</FormLabel>
        <Button>Edit Event</Button>
      </div>
      <div className="flex flex-row sm:flex-wrap md:flex-nowrap w-full gap-4 max-w-xl">
        <select id="selection" className="min-w-28 sm:min-w-96 md:w-full text-black rounded-full px-2">
            <option value="0">none</option>
            {datesArray.map((date) => 
                (<option key={date.PK_ID} value={date.DateTimeStart}>{date.DateTimeStart}</option>)
            )}
            
        </select>
        <Button onClick={handleSubmit}>Confirm</Button>
      </div>
    </section>
  );
}
