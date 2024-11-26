import Link from "next/link";
export default function Home() {
  return (
   <main>
      <h1 className="font-[family-name:var(--font-dancing-script)] text-6xl">Eventually</h1>
      <p>Let’s make it happen..eventually.</p>
      <Link href="/login/" className="border p-2 rounded-full">placeholder login button</Link>
   </main>
  );
}
