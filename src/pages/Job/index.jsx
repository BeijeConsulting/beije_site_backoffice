import { useState, useEffect, useId, useCallback } from "react";

// navigation
import { useNavigate, useParams } from "react-router-dom";

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
import GoBackArrow from "../../components/GoBackArrow/GoBackArrow";

// style
import styles from "./styles.module.css";
import DetailsHeader from "../../components/DetailsHeader";

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

let goBack = false;

const Job = ({ isNew }) => {

  const { id } = useParams();
  const toastId = useId();

  const [state, setState] = useState(emptyState);
  const [shouldShowModal, setShouldShowModal] = useState(false);

  const navigate = useNavigate();
  const navigateModal = useCallback(() => { navigate("/jobs") }, [])


  const [getJobResult, getJob] = useService(`admin/job_application/${id}`);

  const [saveJobResult, saveJob] = useService(isNew ? "/admin/job_application" : `/admin/job_application/${id}`, {
    method: isNew ? "post" : "put",
  });

  const [disableOrActiveResult, disableOrActiveJob] = useService(state.disable_date ?
    `/admin/job_application/re_activate/${id}` : `/admin/job_application/delete/${id}`, {
    method: state.disable_date ? "put" : "delete"
  })

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

    const disableOrActive = disableOrActiveResult ?? { response: null };

    if (disableOrActive.response) {
      navigate('/jobs', {
        state: {
          toast: true
        }
      })
    }
    if (disableOrActive.error) notify('error', toastId);

    return () => goBack = false;

  }, [getJobResult?.response, saveJobResult?.response, saveJobResult?.error, disableOrActiveResult?.response, disableOrActiveResult?.error]);

  const handleSubmitJob = (e) => {
    e.preventDefault();
    saveJob({ ...state, date_creation: isNew ? todayWithTime() : format(state.date_creation, "yyyy-MM-dd'T'HH:mm") });
  }

  function onClickYes() {
    if (goBack) {
      saveJob({ ...state, date_creation: isNew ? todayWithTime() : format(state.date_creation, "yyyy-MM-dd'T'HH:mm") });
      goBack = false;
    }

    disableOrActiveJob();
  }

  const handleBack = () => {
    if (getJobResult?.response !== state) {
      goBack = true;
      setShouldShowModal(true)
      return
    }
    navigate("/jobs")
  }

  return (
    <div className={styles["container"]}>
      <form
        onSubmit={handleSubmitJob}
      >
        <DetailsHeader handleBack={handleBack} isNew={isNew} title={state.title_it} />

        {(isNew || getJobResult.response) && (
          <>
            <div className={styles["input-container"]}>

              {/* <div className={styles["inputs-row"]}> */}
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
                    }}>{state.disable_date ? "Riattiva" : "Disabilità"}</button>
                }
              {/* </div> */}
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
        onRequestClose={handleRequestsModal(goBack ? "goback" : "no", onClickYes, setShouldShowModal, navigateModal)}
        onRequestYes={handleRequestsModal("yes", onClickYes, setShouldShowModal)}
      >
        <Message message={goBack ? "Non hai Salvato, Vuoi salvare?" : "Sicur* di Procedere?"} />
      </Modal>
      {
        saveJobResult?.error && <ToastContainer />
      }

      {
        disableOrActiveResult?.response && <ToastContainer />
      }
    </div>
  );
};

export default Job;
