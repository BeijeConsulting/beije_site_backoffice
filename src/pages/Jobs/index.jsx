import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useId, useState } from "react";
import useService from "../../hooks/useService";
import Table from "../../components/Table";
import { notify, ToastContainer } from "../../utils/toast";
import styles from "./styles.module.css";
import Loader from "../../components/Loader";
import Select from "../../components/Select";
import locale from "date-fns/locale/it";
import { format } from "date-fns/esm";

const initState = {
  academy: "all",
  active: "all",
}

const Jobs = () => {

  const [state, setState] = useState(initState);

  const location = useLocation();
  const toastId = useId();

  const [{ response }, getJobs] =
    useService((state.academy === "all" && state.active === "all") ? "/job_applications" : `/admin/job_applications/${state.academy}/${state.active}`);

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
            <Link to="new" className="primary-button">
              + Nuova offerta di lavoro
            </Link>
          </div>
          <Table
            headers={[
              "ID",
              "Titolo",
              "Tipologia",
              "Data di creazione",
              "Sede",
              // "Visibile",
              "Academy",
            ]}
            records={response.map(
              ({
                id,
                title_it,
                academy,
                type,
                date_creation,
                mode,
                // disable_date,
              }) => ({
                id,
                title_it,
                type,
                date_creation: format(date_creation, "dd MMMM yyyy", { locale }),
                mode: mode.charAt(0).toUpperCase() + mode.slice(1),
                // visible: format(disable_date, "dd MMMM yyyy", { locale }),
                academy,
              })
            )}
            actionLabel="Modifica"
            onAction={(record) => navigate(record.id.toString())}
            formatDimension={150}
          />
        </div>
        <ToastContainer />
      </div>
      :
      <Loader />
  );
};

export default Jobs;
