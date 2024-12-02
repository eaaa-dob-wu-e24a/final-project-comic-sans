export default function Button({
  children,
  className,
  type = "button",
  onClick,
  variant = "primary",
}) {
  const baseStyles =
    "text-white text-m font-bold py-2 px-8 uppercase rounded-full shadow-md hover:cursor-pointer";
  const variants = {
    primary: "bg-primary hover:bg-primary-hover",
    secondary: "bg-secondary hover:bg-secondary-hover transition-all duration-200r"
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
