import { useState, useEffect, useId } from "react";

// navigation
import { Link, useNavigate, useParams } from "react-router-dom";

// date format
import { format } from "date-fns";
import { todayWithTime } from "../../utils/date";

// hooks custom
import useService from "../../hooks/useService";

// utils
import { notify, ToastContainer } from '../../utils/toast';
import { handleRequestsModal } from "../../utils/modal";

// components
import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import Select from "../../components/Select";
import MDEditor from "../../components/MDEditor";
import Modal from "../../components/Modal/Modal";
import Message from "../../components/Message";

// style
import styles from "./styles.module.css";

const emptyState = {
  title_it: "",
  description_it: "",
  title_en: "-",
  description_en: "-",
  type: "",
  mode: "",
  date_creation: todayWithTime(),
  academy: false,
  disable_date: null,
  permalink: "",
};

const Job = ({ isNew }) => {

  const { id } = useParams();
  const toastId = useId();

  const [state, setState] = useState(emptyState);
  const [shouldShowModal, setShouldShowModal] = useState(false);

  const navigate = useNavigate();

  const [getJobResult, getJob] = useService(`admin/job_application/${id}`);

  const [saveJobResult, saveJob] = useService(isNew ? "/admin/job_application" : `/admin/job_application/${id}`, {
    method: isNew ? "post" : "put",
  });



  useEffect(() => {
    if (!isNew) getJob()
  }, []);

  useEffect(() => {
    const { response } = getJobResult ?? { response: null };
    if (response) {
      setState(response);
    }

    const save = saveJobResult ?? { response: null };
    if (save.response) {
      navigate('/jobs', {
        state: {
          toast: true
        }
      })
    }
    if (save.error) notify('error', toastId);
  }, [getJobResult?.response, saveJobResult?.response, saveJobResult?.error]);

  const handleSubmitJob = (e) => {
    e.preventDefault();
    const date = new Date();
    saveJob({ ...state, date_creation: format(isNew ? todayWithTime() : state.date_creation, "yyyy-MM-dd'T'HH:mm") });
  }

  function onClickYes() {
    saveJob({ ...state, date_creation: format(isNew ? todayWithTime() : state.date_creation, "yyyy-MM-dd'T'HH:mm") });
  }

  return (
    <div className={styles["container"]}>
      <form
        onSubmit={handleSubmitJob}
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

              {
                !isNew &&
                <button className="primary-button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShouldShowModal(true)
                  }}>Disabilita</button>
              }
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
      <Modal
        shouldShow={shouldShowModal}
        onRequestClose={handleRequestsModal("no", onClickYes, setShouldShowModal)}
        onRequestYes={handleRequestsModal("yes", onClickYes, setShouldShowModal)}
      >
        <Message message={"Sicur* di Procedere?"} />
      </Modal>
      {
        saveJobResult?.error && <ToastContainer />
      }
    </div>
  );
};

export default Job;
