import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useService from "../../hooks/useService";
import Table from "../../components/Table";

import styles from "./styles.module.css";
import Loader from "../../components/Loader";
import Select from "../../components/Select";
import { useState } from "react";

const initState = {
  academy: "all",
  active: "all",
}

const Blogs = () => {

  const [state, setState] = useState(initState);

  const [{ response, error, loading }, getBlogs] =
    useService("/blogs");

  const navigate = useNavigate();

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    response ?
      <div className={styles["container"]}>
        {console.log(response)}
        <div className={styles["wrapper"]}>
          <div className={styles["header"]}>

            <h1>Posts</h1>

            {/* <Select
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
            /> */}
            <Link to="new" className="primary-button">
              + Nuovo Post
            </Link>
          </div>
          {response && (
            <Table
              headers={[
                "ID",
                "Titolo",
                "Autore",
                "Data di creazione",
              ]}
              records={response.map(
                ({
                  id,
                  title,
                  author,
                  createDateTime,
                }) => ({
                  id,
                  title,
                  author,
                  createDateTime: `${createDateTime.dayOfMonth}/${createDateTime.monthValue}/${createDateTime.year}`,
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

export default Blogs;
