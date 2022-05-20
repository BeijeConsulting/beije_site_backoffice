import React from "react"
import { Link, Outlet } from "react-router-dom";
import layout_style from './GeneralLayout.module.css';
import logo from '../assets/images/logo-white.svg'

const GeneralLayout = () => {
  const doLogout = () => {
    window.localStorage.removeItem("tk");
  }
  return (
    <>
      <header
        className={layout_style.header}
      >
        <div
          className={layout_style.container}
        >
          <img
            alt="logo beije"
            src={logo}
          />
          <nav
            className={layout_style.topNav}
          >
            <Link to="/job">Job Offer</Link>
            <Link to="/job">Blog</Link>
            <Link to="/job">Community</Link>
            <Link to="/community">Team</Link>
            <Link to="/community">Case studies</Link>
            <Link
              to="/Login"
              onClick={doLogout}
            >
              LOGOUT
            </Link>
          </nav>
        </div>

      </header>
      <main>
        <Outlet />
      </main>
      {/* <footer>

      </footer> */}
    </>
  )
}

export default GeneralLayout