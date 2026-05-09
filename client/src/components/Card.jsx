export default function Card({ children, className = '' }) {
  return (
    <div className={`cyber-card p-6 ${className}`}>
      {children}
    </div>
  );
}
