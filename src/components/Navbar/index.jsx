import { NavLink } from "react-router-dom";
import styles from "./styles.module.css";
import logoWhite from "../../assets/images/logo-white.svg";

const Navbar = () => {
  return (
    <nav className={styles["nav"]}>
      <NavLink className={styles["logo"]} to="/">
        <img src={logoWhite} />
      </NavLink>
      <ul role="list" className={styles["menu"]}>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? styles["active"] : "")}
            to="/jobs"
          >
            Offerte di lavoro
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? styles["active"] : "")}
            to="/blog"
          >
            Blog
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? styles["active"] : "")}
            to="/case-study"
          >
            Case study
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? styles["active"] : "")}
            to="/events"
          >
            Eventi
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? styles["active"] : "")}
            to="/community"
          >
            Community
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
