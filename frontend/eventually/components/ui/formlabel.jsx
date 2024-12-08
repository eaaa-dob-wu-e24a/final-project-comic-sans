export default function FormLabel({
  htmlFor,
  children,
  className,
  variant = "sm",
}) {
  const sizeClass = variant === "lg" ? "text-lg" : "text-sm";

  return (
    <label
      htmlFor={htmlFor}
      className={`block ${sizeClass} text-foreground py-0.5 font-medium ${className}`}
    >
      {children}
    </label>
  );
}
