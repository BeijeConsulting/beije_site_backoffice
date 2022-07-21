import { useEffect, useId, useState } from "react";
import locale from "date-fns/locale/it";
import { format } from "date-fns/esm";

// navigate
import { Link, useLocation, useNavigate } from "react-router-dom";

// hooks and utils
import useService from "../../hooks/useService";
import { notify, ToastContainer } from "../../utils/toast";

// components
import Table from "../../components/Table";
import Loader from "../../components/Loader";
import Select from "../../components/Select";
import FieldsetBeije from "../../components/FieldsetBeije";
import CardContainerMemo from "../../components/CardContainer";

// style
import styles from "./styles.module.css";

const initState = {
  academy: "all",
  active: "yes",
}

const Jobs = () => {

  const [state, setState] = useState(initState);

  const location = useLocation();
  const toastId = useId();

  const [{ response }, getJobs] =
    useService((state.academy === "all" && state.active === "all") ? "admin/job_applications" : `/admin/job_applications/${state.academy}/${state.active}`);

  const navigate = useNavigate();

  useEffect(() => {
    getJobs();
    if (location.state !== null) {
      notify("success", toastId)
    }
  }, [state.academy, state.active]);

  return (
    response ?
      <div className={styles["container"]}>
        <div className={styles["wrapper"]}>
          <div className={styles["header"]}>

            <h1>Offerte di lavoro</h1>


            <Link to="new" className="primary-button">
              + Nuova offerta di lavoro
            </Link>
          </div>

          <FieldsetBeije>
            <CardContainerMemo head="Filtri" style={{ flexDirection: "row", marginBottom: "6rem", alignItems: "end" }}>
              <Select
                value={state.active}
                label="Attivi"
                options={[
                  { value: "all", label: "Tutti" },
                  { value: "yes", label: "Attivi" },
                  { value: "no", label: "Non attivi" },
                ]}
                onChange={(active) => setState((p) => ({ ...p, active }))}
              />

              <Select
                value={state.academy}
                label="Academy"
                options={[
                  { value: "all", label: "Tutti" },
                  { value: "yes", label: "Academy" },
                  { value: "no", label: "Non Academy" },
                ]}
                onChange={(academy) => setState((p) => ({ ...p, academy }))}
              />

            </CardContainerMemo>
            <Table
              headers={[
                "ID",
                "Titolo",
                "Tipologia",
                "Data di creazione",
                "Sede",
              ]}
              records={response.map(
                ({
                  id,
                  title_it,
                  type,
                  date_creation,
                  mode,
                }) => ({
                  id,
                  title_it,
                  type,
                  date_creation: format(date_creation, "dd MMMM yyyy", { locale }),
                  mode: mode.charAt(0).toUpperCase() + mode.slice(1),
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

export default Jobs;
