import Link from "next/link";
import Button from "@/components/ui/button";
import JoinForm from "@/components/ui/joinform";
import GradientCurve from "@/components/gradientcurve";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
        <div className="bg-gradient-to-r from-gradientstart to-gradientend pb-0">
          {/* Hero Section */}
          <section className="max-w-lg mx-auto flex flex-col justify-center text-white place-content-center text-center px-6">
            <h1 className="font-[family-name:var(--font-dancing-script)] mt-16 md:mt-24 lg:mt-24 text-7xl md:text-8xl lg:text-8xl">
              Eventually
            </h1>
            <p className="text-md my-4 font-semibold md:text-2xl lg:text-2xl">
              Let’s make it happen.. eventually.
            </p>
            <JoinForm />
            <p className="text-sm mt-4 md:text-md lg:text-md">
              Join an event with a code now, no account required. Or make an
              account for more features.
            </p>
          </section>
        </div>

        <GradientCurve className="max-h-20 md:max-h-32 lg:max-h-32" />

        {/* Event Creation Section */}
        <section className="text-center mt-8 md:mt-12 lg:mt-12 mx-auto max-w-lg px-4">
          <h2 className="font-bold text-md my-4 md:text-2xl lg:text-2xl">
            Want to create <span className="text-primary">your own</span> event?
          </h2>
          <p className="text-sm mb-6 md:text-md lg:text-md">
            Schedule an event with your friends, family, co-workers, or anyone
            else. For free.
          </p>
          <Link href="/create">
            <Button label="CREATE" className="mb-8 w-1/2 md:w-auto lg:w-auto">
              CREATE
            </Button>
          </Link>
        </section>

        {/* Dynamic Section Below the Gradient Curve */}
        <section className="flex-grow bg-page-background" />
    </main>
  );
}
