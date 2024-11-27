export default function GradientCurve({ children, className }) {
  return (
    <div className={`curve-gradient grid place-items-center ${className}`}>
      {children}
    </div>
  );
}
