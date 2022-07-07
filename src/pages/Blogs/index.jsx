import { useEffect, useId } from "react";

// router
import { Link, useLocation, useNavigate } from "react-router-dom";

// hooks & components
import useService from "../../hooks/useService";
import Table from "../../components/Table";
import { notify, ToastContainer } from "../../utils/toast";
import Loader from "../../components/Loader";

// style
import styles from "./styles.module.css";

const Blogs = () => {

  const [{ response }, getBlogs] =
    useService("/blogs");

  const toastId = useId();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getBlogs();
  }, []);

  useEffect(() => {
    if(location.state !== null){
      location.state?.toast === true ? notify("success", toastId) : notify("error", toastId)
    }
  }, []);

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
            <Table
              headers={[
                "ID",
                "Titolo",
                "Autore",
                // "Data di creazione",
              ]}
              records={response.map(
                ({
                  id,
                  title,
                  author,
                  // createDateTime,
                }) => ({
                  id,
                  title,
                  author,
                  // createDateTime: `${createDateTime.dayOfMonth} ${createDateTime.month.toLowerCase()} ${createDateTime.year}`,
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
