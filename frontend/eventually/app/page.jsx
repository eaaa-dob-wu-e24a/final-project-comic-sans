import Link from "next/link";
export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-r from-gradientstart to-gradientend pb-0">
        <section className="max-w-lg mx-auto flex flex-col text-white place-content-center text-center  ">
          <h1 className="font-[family-name:var(--font-dancing-script)] text-8xl mt-28">
            Eventually
          </h1>
          <p className="text-2xl my-6 font-semibold">Let’s make it happen..eventually.</p>
          <form action=""
          className="max-w-md mx-auto flex flex-col"
          >
            <input
              type="text"
              placeholder="JX6S7Y"
              maxLength={6}
              className="rounded-full h-14 w-full text-background uppercase font-semibold text-4xl py-2 px-8"
              name="joincode"
              id="joincode"
            />
            <button className="mt-[-3.125rem] h-11 mb-6 mr-2 place-self-end relative bg-primary text-xl font-bold py-2 px-8  uppercase rounded-full shadow-md">Join</button>
          </form>
          <p>
            Join an event with a code now, no account required. Or make an
            account for more features.
          </p>
        </section>
      </div>
      <div className="curve-gradient"></div>

      <section className="text-center mt-12 mx-auto max-w-lg">
        <h2 className="font-bold text-2xl my-4">
          Want to create <span className="text-primary">your own</span> event?
        </h2>
        <p className="text-md mb-12">
          Schedule an event with your friends, family, co-workers, or anyone
          else. For free.
        </p>
        <button className="bg-primary text-white text-xl font-bold py-2 px-8  uppercase rounded-full shadow-md">
          Create
        </button>
      </section>
    </>
  );
}
