export default function Input({ type, placeholder, id, maxLength, className, onChange}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`rounded-full text-background py-2 px-4 w-full focus:border-secondary focus:ring-1 focus:ring-secondary focus:bg-white/80 focus:outline-none ${className}`}
      name={id}
      id={id}
      onChange={onChange}
    />
  );
}
