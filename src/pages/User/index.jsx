import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import useService from "../../hooks/useService";

import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import Select from "../../components/Select";
import DatePicker from "../../components/DatePicker";
import SingleImageInput from "../../components/SingleImageInput";
import styles from "./styles.module.css";


const emptyState = {
  firstName: "",
  lastName: "",
  role: "",
  hireDate: "",
  picImage: "",
  picImageThumbnail: "",
  picOnSite: false,
  active: true
};

const User = ({ isNew }) => {
  const { id } = useParams();
  const [state, setState] = useState(emptyState);

  const [getUserResult, getUser] = useService(`/team/user/${id}`);

  const [saveUserResult, saveUser] = useService("/team/create-new-team-user", {
    method: "post",
  });

  useEffect(() => {
    if (!isNew) getUser();
  }, []);

  useEffect(() => {
    const { response } = getUserResult ?? { response: null };
    if (response) {
      setState(response);
    }
  }, [getUserResult.response]);

  return (
    <div className={styles["container"]}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveUser({ ...state, hireDate: new Date(state.hireDate).getTime() });
        }}
      >
        <div className={styles["title-row"]}>
          <Link
            to="/community"
            style={{
              fontSize: "200%",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            &larr;
          </Link>
          <h2>
            {isNew
              ? "Nuovo utente"
              : getUserResult.response
                ? `Modifica ${getUserResult.response.firstName} ${getUserResult.response.lastName}`
                : ""}
          </h2>
          <button type="submit" className="primary-button">
            Salva
          </button>
        </div>
        {(isNew || getUserResult.response) && (
          <div className={styles["inputs-container"]}>
            <div className={styles["images"]}>
              <SingleImageInput
                aspectRatio="1"
                style={{ maxWidth: "400px" }}
                label="Immagine profilo"
                value={state.picImage}
                onChange={(picImage) => {
                  setState((p) => {
                    let newState = { ...p, picImage };
                    if (picImage) newState.picImageThumbnail = picImage;
                    return newState;
                  });
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <SingleImageInput
                  aspectRatio="1"
                  style={{ maxWidth: "200px" }}
                  label="Thumbnail"
                  value={state.picImageThumbnail}
                  onChange={(picImageThumbnail) => {
                    setState((p) => ({ ...p, picImageThumbnail }));
                  }}
                />
                <div style={{ marginTop: "auto" }}>
                  <Checkbox
                    checked={state.picOnSite}
                    onChange={(e) => {
                      setState((p) => ({ ...p, picOnSite: e.target.checked }));
                    }}
                    label="Mostra sul sito: "
                  />
                </div>
              </div>
            </div>
            <div>
              <div className={styles["text-row"]}>
                <Input
                  placeholder="Nome"
                  name="firstName"
                  value={state.firstName}
                  onChange={(e) =>
                    setState((p) => ({ ...p, firstName: e.target.value }))
                  }
                />
                <Input
                  placeholder="Cognome"
                  name="lastName"
                  value={state.lastName}
                  onChange={(e) =>
                    setState((p) => ({ ...p, lastName: e.target.value }))
                  }
                />
              </div>
              <div className={styles["text-row"]}>
                <DatePicker
                  placeholder="Data di assunzione"
                  value={state.hireDate}
                  onChange={(hireDate) => setState((p) => ({ ...p, hireDate }))}
                />
                <Select
                  value={state.role}
                  label="Ruolo"
                  options={[
                    { value: "frontend", label: "Frontend" },
                    { value: "backend", label: "Backend" },
                    { value: "fullstack", label: "Fullstack" },
                    { value: "hr", label: "HR" },
                    { value: "marketing", label: "Marketing" },
                    { value: "admin", label: "Admin" },
                  ]}
                  onChange={(role) => setState((p) => ({ ...p, role }))}
                />
                <Checkbox
                  label="Visibile"
                  onChange={(e) => {
                    setState((p) => ({ ...p, active: e.target.checked }));
                  }}
                  checked={state.active} />
                {isNew ? "" : <button className="primary-button"
                  Onclick={console.log('disabilita utente')}>Disabilita</button>}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default User;
