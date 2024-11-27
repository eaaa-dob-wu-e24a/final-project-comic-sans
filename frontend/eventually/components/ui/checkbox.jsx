import Image from "next/image";

export default function Checkbox({ id }) {
  return (
    <label className="block h-8 w-8 m-0 p-0">
      <input
        type="checkbox"
        name={id}
        id={id}
        className="peer h-8 w-8 hidden"
      />
      <div className="bg-transparent h-8 w-8 rounded-full border-2 border-slate-500 hover:cursor-pointer peer-checked:border-white peer-checked:border-4 peer-checked:*:opacity-100 flex place-content-center">
        <Image
          width={16}
          height={16}
          src={"check.svg"}
          alt="checkmark"
          className="opacity-0 mx-auto my-auto"
        ></Image>
      </div>
    </label>
  );
}
