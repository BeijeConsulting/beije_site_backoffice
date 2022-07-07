import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useId, useState } from "react";
import useService from "../../hooks/useService";
import Table from "../../components/Table";
import { notify, ToastContainer } from "../../utils/toast";


import styles from "./styles.module.css";
import Loader from "../../components/Loader";
import Select from "../../components/Select";

const initState = {
  academy: "all",
  active: "all",
}

const Jobs = () => {

  const [state, setState] = useState(initState);

  const location = useLocation();
  const toastId = useId();

  const [{ response }, getJobs] =
    useService(`/admin/job_applications/${state.academy}`);

  const navigate = useNavigate();

  useEffect(() => {
    getJobs();
  }, [state.academy]);

  useEffect(() => {
    if (location.state !== null) {
      location.state?.toast === true ? notify("success", toastId) : notify("error", toastId)
    }
  }, []);

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
                "Visibile",
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
                  disable_date,
                }) => ({
                  id,
                  title_it,
                  type,
                  date_creation,
                  mode: mode.charAt(0).toUpperCase() + mode.slice(1),
                  visible: !disable_date,
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
