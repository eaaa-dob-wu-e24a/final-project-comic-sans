import Link from "next/link";
import Button from "@/components/ui/button";
import JoinForm from "@/components/ui/joinform";
import GradientCurve from "@/components/gradientcurve";
import ComponentTest from "@/components/component-test";
import NotifTester from "@/components/notif-tester";

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-r from-gradientstart to-gradientend pb-0">
        <section className="max-w-lg mx-auto flex flex-col text-white place-content-center text-center  ">
          <h1 className="font-[family-name:var(--font-dancing-script)] text-8xl mt-28">
            Eventually
          </h1>
          <p className="text-2xl my-6 font-semibold">
            Let’s make it happen.. eventually.
          </p>
          <JoinForm></JoinForm>
          <p>
            Join an event with a code now, no account required. Or make an
            account for more features.
          </p>
        </section>
      </div>
      <GradientCurve></GradientCurve>

      <section className="text-center mt-12 mx-auto max-w-lg">
        <h2 className="font-bold text-2xl my-4">
          Want to create <span className="text-primary">your own</span> event?
        </h2>
        <p className="text-md mb-8">
          Schedule an event with your friends, family, co-workers, or anyone
          else. For free.
        </p>
        <Link href="/createEvent">
          <Button label="CREATE" className="mb-12">CREATE</Button>
        </Link>
      </section>
      <NotifTester></NotifTester>
    </>
  );
}
