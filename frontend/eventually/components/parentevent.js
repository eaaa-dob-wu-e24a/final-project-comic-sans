// Server Component
import EventUpdateForm from "@/components/event-update-form";

export default async function ParentComponent() {
  const data = await fetchData();
  return <EventUpdateForm data={data} />;
}
