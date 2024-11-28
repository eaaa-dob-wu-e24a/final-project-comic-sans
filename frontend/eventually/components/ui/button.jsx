export default function Button({ children, className, type, onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} bg-primary text-white text-m font-bold py-2 px-8 uppercase rounded-full shadow-md hover:cursor-pointer`}
    >
      {children}
    </button>
  );
}
