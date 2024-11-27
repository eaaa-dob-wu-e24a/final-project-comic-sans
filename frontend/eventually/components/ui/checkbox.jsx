export default function Checkbox() {
  return (
    <label className="h-8 m-8 w-8">
      <input type="checkbox" name="" id="" className="hidden" />
      <span className="bg-transparent h-8 w-8 absolute rounded-full border-2 border-slate-500 hover:cursor-pointer"></span>
    </label>
  );
}
