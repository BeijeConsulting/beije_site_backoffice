import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import useService from "../../hooks/useService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import Select from "../../components/Select";
import MDEditor from "../../components/MDEditor";

import styles from "./styles.module.css";
import { useId } from "react";

const emptyState = {
  title_it: "",
  description_it: "",
  title_en: "-",
  description_en: "-",
  type: "",
  mode: "",
  date_creation: format(Date.now(), "yyyy-MM-dd"),
  academy: false,
  disable_date: null,
  permalink: "",
};


const Blog = ({ isNew }) => {
  const { id } = useParams();
  const toastId = useId();
  const [state, setState] = useState(emptyState);

  const notify = (type, message) => {
    toast[type](message, { 
      position: toast.POSITION.TOP_CENTER,
      toastId
    })
  }

  const [getJobResult, getJob] = useService(`/job_application/${id}`);

  const [saveJobResult, saveJob] = useService("/job_application", {
    method: "post",
  });

  const [updateJobResult, updateJob] = useService(`/job_application/${id}`, {
    method: "put",
  });

  useEffect(() => {
    if (!isNew) getJob()
  }, []);
  
  useEffect(() => {
    const { response } = getJobResult ?? { response: null };
    if (response) {
      setState(response);
    }
  }, [getJobResult?.response]);

  return (
    <div className={styles["container"]}>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (isNew) saveJob(state).then(res => {
            if (res) notify('success', "Salvato!");
          }).catch(err => notify("error", `Qualcosa è andato storto: ${err?.message}`));

          else updateJob(state).then(res => {
            if (res) notify("success", "Aggiornato!");
          }).catch(err => notify("error", `Qualcosa è andato storto: ${err?.message}`));
        }}
      >
        <div className={styles["title-row"]}>
          <Link
            to="/jobs"
            style={{
              fontSize: "200%",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            &larr;
          </Link>
          <h2>
            {isNew
              ? "Nuova offerta di lavoro"
              : getJobResult.response
                ? `Modifica ${getJobResult.response.title_it}`
                : ""}
          </h2>
          <button type="submit" className="primary-button">
            Salva
          </button>
        </div>
        {(isNew || getJobResult.response) && (
          <>
            <div className={styles["inputs-row"]}>
              <Input
                style={{ width: "40%" }}
                placeholder="Titolo"
                name="title"
                value={state.title_it}
                onChange={(e) =>
                  setState((p) => ({ ...p, title_it: e.target.value }))
                }
              />
              <Input
                placeholder="Posizione"
                name="type"
                value={state.type}
                onChange={(e) =>
                  setState((p) => ({ ...p, type: e.target.value }))
                }
              />
              <Select
                value={state.mode}
                label="Sede"
                options={[
                  { value: "-", label: "vuoto" },
                  { value: "remote", label: "Da remoto" },
                  { value: "milan", label: "Milano" },
                  { value: "hybrid", label: "Ibrido" },
                ]}
                onChange={(mode) => setState((p) => ({ ...p, mode }))}
              />
              <Checkbox
                checked={state.academy}
                onChange={(e) => {
                  setState((p) => ({ ...p, academy: e.target.checked }));
                }}
                label="Academy: "
              />

              <Checkbox
                checked={state.disable_date}
                onChange={(e) => {
                  setState((p) => ({ ...p, disable_date: e.target.checked }));
                }}
                label="Visibile: "
              />
            </div>
            <MDEditor
              value={state.description_it}
              onChange={(e) =>
                setState((p) => ({ ...p, description_it: e.target.value }))
              }
            />
          </>
        )}
      </form>
      <ToastContainer />
    </div>
  );
};

export default Blog;
