export default function Button({ children, className }) {
  return (
    <button className={`${className} bg-primary text-white text-xl font-bold py-2 px-8  uppercase rounded-full shadow-md hover:cursor-pointer`}>
      {children}
    </button>
  );
}
