import "./sidebar.css";

import {
  LogOut,
} from "lucide-react";
import { useLogout } from "ra-core";
import { NavLink } from "react-router-dom";
import { sidebarNavigation } from "@widgets/sidebar/navigation.ts";
import ChupapoLogo from "../../shared/logos/chupapo-logo.tsx";



export default function Sidebar() {
  const logout = useLogout();

  return (
    <aside className="sidebar">
      <NavLink className="sidebar__brand" to="/overview" aria-label="Chupapo Admin">
        <div className="sidebar__logo-container">
          <ChupapoLogo className="sidebar__brand-logo" />
          <span className="sidebar__brand-name">Chupapo</span>
        </div>
      </NavLink>

      <nav className="sidebar__navigation">
        <ul className="sidebar__list">
          {sidebarNavigation.map(({ label, icon: Icon, path }) => (
            <li key={label}>
              <NavLink
                className={({ isActive }) =>
                  `sidebar__item${isActive ? " sidebar__item--active" : ""}`
                }
                to={path}
              >
                <Icon aria-hidden="true" strokeWidth={1.8} />
                <span className="sidebar__item-label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__profile" aria-label="Профиль администратора">
          <div className="sidebar__avatar" aria-hidden="true">AD</div>
          <div className="sidebar__profile-copy">
            <strong>ADMIN</strong>
          </div>
        </div>

        <button
          className="sidebar__item"
          type="button"
          onClick={() => void logout()}
          aria-label="Выйти"
        >
          <LogOut aria-hidden="true" strokeWidth={1.8} />
          <span className="sidebar__item-label">Выйти</span>
        </button>
      </div>
    </aside>
  );
}
