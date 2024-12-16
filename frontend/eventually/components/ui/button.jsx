export default function Button({
  children,
  className,
  type = "button",
  onClick,
  variant = "primary",
}) {
  const baseStyles =
    "text-sm font-bold py-2 px-6 md:px-8 lg:px-8 uppercase rounded-full shadow-buttonshadow hover:cursor-pointer md:text-md lg:text-md";
  const variants = {
    primary:
      "bg-primary hover:bg-primary-hover text-white transition-all duration-200",
    secondary:
      "bg-secondary hover:bg-secondary-hover transition-all duration-200 text-white",
    primaryoutline:
      "bg-transparent border border-primary text-foreground hover:border-foreground",
    secondaryoutline:
      "bg-transparent border border-secondary text-foreground hover:border-foreground",
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
