import { useEffect, useId, useState } from "react";

// router
import { Link, useLocation, useNavigate } from "react-router-dom";

// hooks & components
import useService from "../../hooks/useService";
import Table from "../../components/Table";
import { notify, ToastContainer } from "../../utils/toast";
import Loader from "../../components/Loader";
import locale from "date-fns/locale/it";
import { format } from "date-fns/esm";

// style
import styles from "./styles.module.css";
import Select from "../../components/Select";

const initState = {
  lang: "it",
}

const Blogs = () => {

  const [state, setState] = useState(initState);
  
  const [{ response }, getBlogs] =
    useService(`/blogs/${state.lang}`);

  const toastId = useId();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getBlogs();
    if (location.state !== null) {
      notify("success", toastId);
    }
  }, []);

  return (
    response ?
      <div className={styles["container"]}>
        {console.log(response)}
        <div className={styles["wrapper"]}>
          <div className={styles["header"]}>

            <h1>Posts</h1>

            <Select
              value={state.lang}
              label="Lingua"
              options={[
                { value: "it", label: "Italiano" },
                { value: "eng", label: "Inglese" },
              ]}
              onChange={(active) => {
                console.log(active);
                setState((p) => ({ ...p, active }))}}
            />

            <Link to="new" className="primary-button">
              + Nuovo Post
            </Link>
          </div>
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
                create_datetime,
              }) => ({
                id,
                title,
                author,
                create_datetime: format(create_datetime, "dd MMMM yyyy", { locale }),
              })
            )}
            actionLabel="Modifica"
            onAction={(record) => navigate(record.id.toString())}
            formatDimension={250}
          />
        </div>
        <ToastContainer />
      </div>
      :
      <Loader />
  );
};

export default Blogs;
