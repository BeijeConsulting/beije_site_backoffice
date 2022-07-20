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
import FieldsetBeije from "../../components/FieldsetBeije";
import CardContainerMemo from "../../components/CardContainer";

const initState = {
  picImage: "all",
  picOnSite: "all",
}

const Users = () => {
  const [state, setState] = useState(initState);
  const location = useLocation();
  const navigate = useNavigate();

  const url =
    `/team/admin/users/LastName/${state.picImage}/${state.picOnSite}`
  const toastId = useId();

  const [{ response, error, loading }, getUsers] = useService(url);
  useEffect(() => {
    getUsers();
    console.log('res', response)
    if (location.state !== null) {
      notify("success", toastId)
    }
  }, [state.picImage, state.picOnSite])

  return (
    response ?

      <div className={styles["container"]}>
        <div className={styles["wrapper"]}>
          <div className={styles["header"]}>
            <h1>Community</h1>

            <Link to="new" className="primary-button">
              + Nuovo utente
            </Link>
          </div>
          <FieldsetBeije>
            <CardContainerMemo head="Filtri" style={{ flexDirection: "row", marginBottom: "6rem", alignItems: "end" }}>
              <Select
                value={state.picImage}
                label={"Immagine presente"}
                options={[
                  { value: "all", label: "Tutti" },
                  { value: "yes", label: "visibili" },
                  { value: "no", label: "Non visibili" },
                ]}
                onChange={(picImage) => setState((p) => ({ ...p, picImage }))} />
              <Select
                value={state.picOnSite}
                label={"Visibile onsite"}
                options={[
                  { value: "all", label: "Tutti" },
                  { value: "yes", label: "Si" },
                  { value: "no", label: "No" },
                ]}
                onChange={(picOnSite) => setState((p) => ({ ...p, picOnSite }))} />
            </CardContainerMemo>
            <Table
              headers={[
                "ID",
                "Nome",
                "Cognome",
                "Data di assunzione",
                "Immagine",
                "Visibile"
              ]}
              records={response.team.map(
                (
                  { firstName, lastName, hireDate, picImage, picOnSite, id }

                ) => ({
                  id: id,
                  firstName,
                  lastName,
                  hireDate: hireDate
                    ? format(hireDate, "dd MMMM yyyy", { locale })
                    : "Non pervenuta",
                  picImage: picImage ? true : false,
                  picOnSite

                })
              )}
              actionLabel="Modifica"
              onAction={(record) => navigate(record.id.toString())}
              formatDimension={200}
            />
          </FieldsetBeije>
        </div>
        <ToastContainer />
      </div>
      :
      <Loader />
  );
};

export default Users;
