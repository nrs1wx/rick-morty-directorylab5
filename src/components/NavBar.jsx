import { Link, NavLink } from "react-router-dom";
import { NAV_LINKS } from "../constants.js";

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          Rick and Morty
        </Link>
        <nav aria-label="Main navigation">
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
