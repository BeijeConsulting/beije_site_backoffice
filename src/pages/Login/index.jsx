import { useEffect, useState } from "react";
import useService from "../../hooks/useService";

import Input from "../../components/Input";

import logo from "../../assets/images/logo-colored.svg";
import styles from "./styles.module.css";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState({ username: "", password: "" });
  const [{ response, error }, login] = useService("/signin", {
    method: "post",
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (error) alert("Credenziali errate");
    if (response) {
      navigate(location.state?.from || "/");
    }
  }, [response, error]);

  return (
    <div className={styles["container"]}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(state);
        }}
      >
        <fieldset style={{ border: "1px solid var(--grey-700)" }}>
          <legend>
            <img className={styles["logo"]} src={logo} alt="Logo Beije" />
          </legend>
          <div className={styles["fields"]}>
            <Input
              placeholder="Username"
              value={state.username}
              onChange={(e) => {
                setState((p) => ({ ...p, username: e.target.value }));
              }}
            />
            <Input
              placeholder="Password"
              type="password"
              value={state.password}
              onChange={(e) => {
                setState((p) => ({ ...p, password: e.target.value }));
              }}
            />
            <button type="submit" className="primary-button">
              Login
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
