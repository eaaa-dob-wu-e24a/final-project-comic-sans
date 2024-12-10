export default function FormLabel({ htmlFor, children, className }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm text-foreground py-0.5 ${className}`}
    >
      {children}
    </label>
  );
}
