export default function Checkbox() {
  return (
    <label className="block h-8 w-8 m-0 p-0">
      <input type="checkbox" name="" id="" className="h-8 w-8 hidden" />
      <div className="bg-transparent h-8 w-8 rounded-full border-2 border-slate-500 hover:cursor-pointer checked:border-red-600"></div>
    </label>
  );
}
