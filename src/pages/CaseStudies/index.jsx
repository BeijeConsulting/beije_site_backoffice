import React, { useEffect, useState, useId } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import locale from "date-fns/locale/it";
import { format } from "date-fns/esm";

// hooks
import useService from '../../hooks/useService';
import { notify, ToastContainer } from '../../utils/toast';

// components
import Loader from '../../components/Loader';
import Select from '../../components/Select';
import Table from '../../components/Table';
import CardContainerMemo from '../../components/CardContainer';
import FieldsetBeije from '../../components/FieldsetBeije';

// styles
import styles from "./styles.module.css";

const initState = {
  lang: "it",
  active: "yes"
}

function CaseStudies() {
  const [state, setState] = useState(initState);

  const [{ response }, getCaseStudies] =
    useService(`/admin/case_study/${state.lang}/${state.active}`);

  const toastId = useId();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getCaseStudies();
    if (location.state !== null) {
      notify("success", toastId);
    }
  }, [state.lang, state.active]);

  return (
    response ?
      <div className={styles["container"]}>
        <div className={styles["wrapper"]}>
          <div className={styles["header"]}>

            <h1>Case Studies</h1>

            <Link to="new" className="primary-button">
              + Nuovo Case Study
            </Link>
          </div>

          <FieldsetBeije>
            <CardContainerMemo head="Filtri" style={{ flexDirection: "row", marginBottom: "6rem", alignItems: "end" }}>
              <Select
                value={state.lang}
                label="Lingua"
                options={[
                  { value: "it", label: "Italiano" },
                  { value: "en", label: "Inglese" },
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
                  { value: "no", label: "Non attivi" }
                ]}
                onChange={(active) => {
                  setState((p) => ({ ...p, active }))
                }}
              />
            </CardContainerMemo>

            <Table
              headers={[
                "ID",
                "Titolo",
                "Sottotitolo",
                "Data di creazione",
              ]}
              records={response.map(
                ({
                  id,
                  title,
                  subtitle,
                  createDate,
                }) => ({
                  id,
                  title,
                  subtitle,
                  createDate: format(createDate, "dd MMMM yyyy", { locale }),
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

export default CaseStudies
