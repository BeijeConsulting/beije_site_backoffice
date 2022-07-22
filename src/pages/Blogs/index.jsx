import { useEffect, useId, useState } from "react";
import locale from "date-fns/locale/it";
import { format } from "date-fns/esm";

// router
import { Link, useLocation, useNavigate } from "react-router-dom";

// hooks & components
import useService from "../../hooks/useService";
import Table from "../../components/Table";
import { notify, ToastContainer } from "../../utils/toast";
import Loader from "../../components/Loader";
import Select from "../../components/Select";
import FieldsetBeije from "../../components/FieldsetBeije";
import CardContainerMemo from "../../components/CardContainer";

// style
import styles from "./styles.module.css";

const initState = {
  lang: "it",
  active: "yes"
}

const Blogs = () => {

  const [state, setState] = useState(initState);

  const [{ response }, getBlogs] =
    useService(`/admin/blogs/${state.lang}/${state.active}`);

  const toastId = useId();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getBlogs();
    if (location.state !== null) {
      notify("success", toastId);
    }

  }, [state.lang, state.active]);



  return (
    response ?
      <div className={styles["container"]}>
        <div className={styles["wrapper"]}>

          <div className={styles["header"]}>
            <h1>Posts</h1>



            <Link to="new" className="primary-button">
              + Nuovo Post
            </Link>

          </div>
          <FieldsetBeije>
            <CardContainerMemo head="Filtri" style={{ flexDirection: "row", marginBottom: "6rem", alignItems: "end" }}>
              <Select
                value={state.lang}
                label="Lingua"
                options={[
                  { value: "it", label: "Italiano" },
                  { value: "eng", label: "Inglese" },
                ]}
                onChange={(lang) => {
                  setState((p) => ({ ...p, lang }))
                }}
              />

              <Select
                value={state.active}
                label="Attivi"
                options={[
                  { value: "all", label: "Tutti" },
                  { value: "yes", label: "Attivi" },
                  // { value: "no", label: "Non attivi" }
                ]}
                onChange={(active) => {
                  console.log(active);
                  setState((p) => ({ ...p, active }))
                }}
              />
            </CardContainerMemo>
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
          </FieldsetBeije>
        </div>
          <ToastContainer />
      </div>
      :
      <Loader />
  );
};

export default Blogs;
