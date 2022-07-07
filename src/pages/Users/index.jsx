import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import locale from "date-fns/locale/it";
import { useEffect, useState } from "react";
import useService from "../../hooks/useService";

import Table from "../../components/Table";
import Loader from "../../components/Loader";
import styles from "./styles.module.css";
import Select from "../../components/Select";

const initState = {
  active: "all",
  picOnSite: "all",
}

const Users = () => {

  const [state, setState] = useState(initState);
  const navigate = useNavigate();

  const [{ response, error, loading }, getUsers] = useService(`/team/admin/users/LastName/${state.active}/${state.picOnSite}`);



  useEffect(() => {
    console.log('state', state)
    getUsers();
  }, [state.active, state.picOnSite])

  return (
    response ?


      <div className={styles["container"]}>
        {console.log('res', response)}
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
                value={state.picOnSite}
                label={"Immagine onsite"}
                options={[
                  { value: "all", label: "Tutti" },
                  { value: "yes", label: "Si" },
                  { value: "no", label: "No" },
                ]}
                onChange={(picOnSite) => setState((p) => ({ ...p, picOnSite }))} />
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
                  { firstName, lastName, hireDate, picImage, picOnSite, id, disableDate }

                ) => ({
                  id: id,
                  firstName,
                  lastName,
                  hireDate: hireDate
                    ? format(hireDate, "dd MMMM yyyy", { locale })
                    : "",
                  picOnSite,
                  active: disableDate ? false : true

                })
              )}
              actionLabel="Modifica"
              onAction={(record) => navigate(record.id.toString())}
              formatDimension={250}
            />
          )}
        </div>
      </div>
      :
      <Loader />
  );
};

export default Users;
