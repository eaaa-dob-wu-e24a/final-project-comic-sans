export default function Input({ type, placeholder, id, maxLength, className }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`rounded-full text-background py-2 px-4 ${className}`}
      name={id}
      id={id}
    />
  );
}
