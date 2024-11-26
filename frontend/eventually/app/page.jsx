import Link from "next/link";

export default function Home() {
  return (
    <main className="relative top-0 min-h-screen pt-36 bg-[url('/background1.svg')] bg-top bg-no-repeat flex flex-col items-center justify-start text-white">
      <h1 className="font-[family-name:var(--font-dancing-script)] text-7xl mb-4">
        Eventually
      </h1>
      <p className="text-lg mb-6">Let’s make it happen..eventually.</p>
      <Link
        href="/login/"
        className="border p-2 rounded-full bg-white text-black"
      >
        Placeholder Login Button
      </Link>
    </main>
  );
}
