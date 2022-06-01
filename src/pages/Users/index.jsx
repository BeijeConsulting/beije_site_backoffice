import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import locale from "date-fns/locale/it";
import { useEffect } from "react";
import useService from "../../hooks/useService";

import Table from "../../components/Table";

import styles from "./styles.module.css";

const Users = () => {
  const [{ response, error, loading }, getUsers] = useService("/team/users");

  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={styles["container"]}>
      <div className={styles["wrapper"]}>
        <div className={styles["header"]}>
          <h1>Community</h1>
          <Link to="new" className="primary-button">
            + Nuovo utente
          </Link>
        </div>
        {response && (
          <Table
            headers={[
              "ID",
              "Nome",
              "Cognome",
              "Data di assunzione",
              "Immagini",
            ]}
            records={response.team.map(
              (
                { firstName, lastName, hireDate, picImage, picImageThumbnail },
                i
              ) => ({
                id: i + 1,
                firstName,
                lastName,
                hireDate: hireDate
                  ? format(hireDate, "dd MMMM yyyy", { locale })
                  : "",
                hasImage: !!picImage && !!picImageThumbnail,
              })
            )}
            actionLabel="Modifica"
            onAction={(record) => navigate(record.id.toString())}
          />
        )}
      </div>
    </div>
  );
};

export default Users;
