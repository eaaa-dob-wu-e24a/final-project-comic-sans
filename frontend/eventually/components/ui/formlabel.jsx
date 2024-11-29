export default function FormLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm text-foreground py-0.5"
    >
      {children}
    </label>
  );
}
