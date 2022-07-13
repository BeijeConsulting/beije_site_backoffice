import React, { useEffect, useState, useId } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { format } from 'date-fns/esm';
import locale from "date-fns/locale/it";

// hooks
import useService from '../../hooks/useService';
import { notify , ToastContainer} from '../../utils/toast';

// components
import Loader from '../../components/Loader';
import Select from '../../components/Select';
import Table from '../../components/Table';

// styles
import styles from "./styles.module.css";


const initState = {
  lang: "it",
}

function CaseStudies() {
  const [state, setState] = useState(initState);
  
  const [{ response }, getCaseStudies] =
    useService(`/admin/casestudies/${state.lang}`);

  const toastId = useId();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getCaseStudies();
    if (location.state !== null) {
      notify("success", toastId);
    }
  }, [state.lang]);



  return (
    response ?
      <div className={styles["container"]}>
        <div className={styles["wrapper"]}>
          <div className={styles["header"]}>

            <h1>Case Studies</h1>

            <Select
              value={state.lang}
              label="Lingua"
              options={[
                { value: "it", label: "Italiano" },
                { value: "en", label: "Inglese" },
              ]}
              onChange={(lang) => {
                setState((p) => ({ ...p, lang }))}}
            />

            <Link to="new" className="primary-button">
              + Nuovo Case Study
            </Link>
          </div>
          <Table
            headers={[
              "ID",
              "Titolo",
              "Sottotitolo",
              // "Visibile",
            ]}
            records={response.map(
              ({
                id,
                title,
                subtitle,
                // disableDate,
              }) => ({
                id,
                title,
                subtitle,
                // disableDate: state.disableDate ? (
                //   <span>&#x2713;</span>
                // ) : (
                //   <span>&times;</span>
                // )
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

export default CaseStudies
