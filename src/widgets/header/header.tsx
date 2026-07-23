import "./header.css";
import UserIcon from "@icons/user-icon.tsx";

export default function Header() {
  return (
    <header className="header">
      <button className="header__user-button">
        <UserIcon className="header__user-icon" />
      </button>

    </header>
  );
}