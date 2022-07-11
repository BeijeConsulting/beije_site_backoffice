import { Link, useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import locale from "date-fns/locale/it";
import { useEffect, useState, useId } from "react";
import useService from "../../hooks/useService";
import Table from "../../components/Table";
import Loader from "../../components/Loader";
import styles from "./styles.module.css";
import Select from "../../components/Select";
import useStorage from "../../hooks/useStorage";
import { notify, ToastContainer } from "../../utils/toast";

const initState = {
  archive_date: "all",
  picOnSite: "all",
}

const Users = () => {
  const [state, setState] = useState(initState);
  const location = useLocation();
  const navigate = useNavigate();

  const url =
    `/team/admin/users/LastName/${state.archive_date}/${state.picOnSite}`
  const toastId = useId();

  const [{ response, error, loading }, getUsers] = useService(url);
  useEffect(() => {
    getUsers();
    console.log('res', response)
    if (location.state !== null) {
      notify("success", toastId)
    }
  }, [state.archive_date, state.picOnSite])

  return (
    response ?

      <div className={styles["container"]}>
        {console.log(response)}
        <div className={styles["wrapper"]}>
          <div className={styles["header"]}>
            <h1>Community</h1>
            <div className={styles["selectContainer"]}>
              <Select
                value={state.archive_date}
                label={"Utenti visibili"}
                options={[
                  { value: "all", label: "Tutti" },
                  { value: "yes", label: "visibili" },
                  { value: "no", label: "Non visibili" },
                ]}
                onChange={(archive_date) => setState((p) => ({ ...p, archive_date }))} />
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
                  { firstName, lastName, hireDate, picImage, picOnSite, id, archive_date }

                ) => ({
                  id: id,
                  firstName,
                  lastName,
                  hireDate: hireDate
                    ? format(hireDate, "dd MMMM yyyy", { locale })
                    : "Non pervenuta",
                  picOnSite,
                  archive_date: archive_date ? false : true

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
