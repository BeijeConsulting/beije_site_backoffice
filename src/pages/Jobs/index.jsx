import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useService from "../../hooks/useService";
import Table from "../../components/Table";

import styles from "./styles.module.css";
import Loader from "../../components/Loader";

const Jobs = () => {
  const [{ response, error, loading }, getJobs] =
    useService("/job_applications");

  const navigate = useNavigate();

  useEffect(() => {
    getJobs();
  }, []);

  return ( response ?
    <div className={styles["container"]}>
      {console.log(loading)}
      <div className={styles["wrapper"]}>
        <div className={styles["header"]}>
          <h1>Offerte di lavoro</h1>
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
                mode,
                visible: !disable_date,
                academy,
              })
            )}
            actionLabel="Modifica"
            onAction={(record) => navigate(record.id.toString())}
          />
        )}
      </div>
    </div>
    : 
    <Loader />
  );
};

export default Jobs;
