export default function UserIcon({ className = "" }) {
  return (
    <svg
      className={`user-icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 21c0-3.866 3.134-7 7-7s7 3.134 7 7M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    </svg>
  );
}