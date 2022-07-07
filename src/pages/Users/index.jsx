import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import locale from "date-fns/locale/it";
import { useEffect, useState } from "react";
import useService from "../../hooks/useService";

import Table from "../../components/Table";

import styles from "./styles.module.css";
import Select from "../../components/Select";

const initState = {
  active: "all",
  hasImage: "all"
}

const Users = () => {
  const [{ response, error, loading }, getUsers] = useService("/team/users");
  const [state, setState] = useState(initState);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={styles["container"]}>
      <div className={styles["wrapper"]}>
        <div className={styles["header"]}>
          <h1>Community</h1>
          <div className={styles["selectContainer"]}>
            <Select
              value={state.active}
              label={"Utenti visibili"}
              options={[
                { value: "all", label: "Tutti" },
                { value: "yes", label: "visibili" },
                { value: "no", label: "Non visibili" },
              ]}
              onChange={(active) => setState((p) => ({ ...p, active }))} />
            <Select
              value={state.hasImage}
              label={"Immagine onsite"}
              options={[
                { value: "all", label: "Tutti" },
                { value: "yes", label: "Si" },
                { value: "no", label: "No" },
              ]}
              onChange={(hasImage) => setState((p) => ({ ...p, hasImage }))} />
          </div>
          <Link to="new" className="primary-button">
            + Nuovo utente
          </Link>
        </div>
        {response && (
          <Table
            headers={[
              "ID",
              "Nome",
              "Cognome",
              "Data di assunzione",
              "Immagini",
              "Visibile"
            ]}
            records={response.team.map(
              (
                { firstName, lastName, hireDate, picImage, picOnSite },
                i
              ) => ({
                id: i + 1,
                firstName,
                lastName,
                hireDate: hireDate
                  ? format(hireDate, "dd MMMM yyyy", { locale })
                  : "",
                hasImage: !!picImage,
                picOnSite
              })
            )}
            actionLabel="Modifica"
            onAction={(record) => navigate(record.id.toString())}
            formatDimension={250}
          />
        )}
      </div>
    </div>
  );
};

export default Users;
