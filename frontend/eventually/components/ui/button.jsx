export default function Button({
  children,
  className,
  type = "button",
  onClick,
  variant = "primary",
}) {
  const baseStyles =
    "text-m font-bold py-2 px-8 uppercase rounded-full shadow-buttonshadow hover:cursor-pointer sm: text-sm";
  const variants = {
    primary:
      "bg-primary hover:bg-primary-hover text-white transition-all duration-200",
    secondary:
      "bg-secondary hover:bg-secondary-hover transition-all duration-200 text-white",
    primaryoutline:
      "bg-transparent border border-primary text-foreground hover:border-white",
    secondaryoutline:
      "bg-transparent border border-secondary text-foreground hover:border-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
