import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useId } from "react";
import useService from "../../hooks/useService";
import Table from "../../components/Table";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import styles from "./styles.module.css";
import Loader from "../../components/Loader";
import Select from "../../components/Select";
import { useState } from "react";

const initState = {
  academy: "all",
  active: "all",
}

const Jobs = () => {

  const [state, setState] = useState(initState);
  const location = useLocation();

  console.log('toast', location);

  const toastId = useId();

  const notify = (type, message) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
      toastId
    })
  }

  const [{ response, error, loading }, getJobs] =
    useService("/job_applications");

  const navigate = useNavigate();

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    location?.state?.toast === true ? notify("success", "success") : notify("error", "qualcosa è andato storto")
  }, []);

  return (
    response ?
      <div className={styles["container"]}>
        <div className={styles["wrapper"]}>
          <div className={styles["header"]}>

            <h1>Offerte di lavoro</h1>

            <Select
              value={state.active} //aggiungere stato per il valore
              label="Attivi"
              options={[
                { value: "all", label: "Tutti" },
                { value: "yes", label: "Attivi" },
                { value: "no", label: "Non attivi" },
              ]}
              onChange={(active) => setState((p) => ({ ...p, active }))}
            />

            <Select
              value={state.academy} //aggiungere stato per il valore
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
          {response && (
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
          )}
        </div>
        <ToastContainer />
      </div>
      :
      <Loader />
  );
};

export default Jobs;
