import Button from "./ui/button";
import FormLabel from "./ui/formlabel";

export default function EditEvent() {
  return (
    <section className="max-w-6xl mx-auto flex flex-col gap-4 bg-background p-6 my-12 rounded-2xl shadow-md">
      <div className="flex flex-row place-content-between w-full flex-wrap-reverse gap-4 place-items-center">
        <FormLabel variant="lg">Select Final Date</FormLabel>
        <Button>Edit Event</Button>
      </div>
      <div className="flex flex-row sm:flex-wrap md:flex-nowrap w-full gap-4 max-w-xl">
        <select className="min-w-28 sm:min-w-96 md:w-full text-black rounded-full px-2">
            <option value="test 1">a</option>
            <option value="test 2">b</option>
            <option value="test 3">c</option>
            <option value="test 4">d</option>
        </select>
        <Button>Confirm</Button>
      </div>
    </section>
  );
}
