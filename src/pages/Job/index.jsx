import { useState, useEffect, useId } from "react";

// navigation
import { useNavigate, useParams } from "react-router-dom";

// date format
import { format } from "date-fns";
import { todayWithTime } from "../../utils/date";

// hooks custom
import useService from "../../hooks/useService";

// utils
import { notify, ToastContainer } from '../../utils/toast';
import { checkIsQuickSave, navigateWithNotify } from "../../utils/utils";

// components
import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import Select from "../../components/Select";
import MDEditor from "../../components/MDEditor";
import Modal from "../../components/Modal/Modal";
import Message from "../../components/Message";
import FieldsetBeije from "../../components/FieldsetBeije";
import CardContainerMemo from "../../components/CardContainer";
import SaveContainerMemo from "../../components/SaveContainer";
import ActiveOrDisable from "../../components/ActiveOrDisable";
import DetailsHeader from "../../components/DetailsHeader";

// style
import styles from "./styles.module.css";

const emptyState = {
  title_it: "",
  description_it: "",
  title_en: "-",
  description_en: "-",
  type: "full stack",
  mode: "remote",
  date_creation: todayWithTime(),
  academy: false,
  disable_date: null,
  lang: "it",
};

let isQuickSave = false;

const Job = ({ isNew }) => {

  const { id } = useParams();
  const toastId = useId();

  const [state, setState] = useState(emptyState);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [goBack, setGoBack] = useState(false);

  const navigate = useNavigate();

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
      if (!isQuickSave) navigateWithNotify(navigate, '/jobs');
      if (isQuickSave) notify("success", toastId);
      setState(save.response);
    }
    if (save.error) notify('error', toastId, save.error.data.message);

    const disableOrActive = disableOrActiveResult ?? { response: null };

    if (disableOrActive.response) {
      navigateWithNotify(navigate, '/jobs');
    }
    if (disableOrActive.error) notify('error', toastId);

  }, [getJobResult?.response, saveJobResult?.response, saveJobResult?.error, disableOrActiveResult?.response, disableOrActiveResult?.error, state.lang]);

  const handleSubmitJob = (e) => {  // Controllo se è un salvataggio rapido o no e setto la variabile isQuickSave. Dopo di che faccio la chiamata api
    e.preventDefault();

    isQuickSave = checkIsQuickSave(isQuickSave, e.target?.name);

    saveJob({
      ...state,
      date_creation: isNew ? todayWithTime() : format(state.date_creation, "yyyy-MM-dd'T'HH:mm"),
      lang: null
    });
  }

  const handleBack = () => {
    if (getJobResult?.response !== state) {
      setGoBack(true)
      setShouldShowModal(true)
      return
    }
    navigate("/jobs")
  }

  return (
    <div className={styles["container"]}>
      <form>
        <DetailsHeader
          handleBack={handleBack}
          onSubmit={handleSubmitJob}
          isNew={isNew}
          title={state.lang === "it" ? state.title_it : state.title_en}
        />

        {(isNew || getJobResult.response) && (
          <>
            <FieldsetBeije>
              <div className={styles["input-container"]}>
                <CardContainerMemo head="Input" style={{ width: "50%" }}>

                  <Input
                    style={{ width: "100%", marginTop: "2rem" }}
                    placeholder="Titolo"
                    name="title"
                    value={state.lang === "it" ? state.title_it : state.title_en}
                    onChange={(e) => {
                      if (state.lang === "it") setState((p) => ({ ...p, title_it: e.target.value }));
                      setState((p) => ({ ...p, title_en: e.target.value }))
                    }}
                  />

                  <Select
                    style={{ maxWidth: "none", marginTop: "2rem", zIndex: 4 }}
                    value={state.type}
                    label="Posizione"
                    options={[
                      { value: "front end", label: "Front end" },
                      { value: "back end", label: "Back end" },
                      { value: "full stack", label: "Full stack" },
                      { value: state.lang === "it" ? "Insegnate academy" : "Academy teacher", label: state.lang === "it" ? "Insegnante" : "Teacher" },
                      { value: "mobile", label: "Mobile" },
                    ]}
                    onChange={(type) => setState((p) => ({ ...p, type }))}
                  />

                  <Select
                    style={{ maxWidth: "none", marginTop: "2rem", zIndex: 3 }}
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

                  <Select
                    style={{ maxWidth: "none", marginTop: "2rem" }}
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

                  <Checkbox
                    style={{ marginTop: "2rem" }}
                    checked={state.academy}
                    onChange={(e) => {
                      setState((p) => ({ ...p, academy: e.target.checked }));
                    }}
                    label="Academy: "
                  />
                </CardContainerMemo>
              </div>
              <MDEditor
                value={state.lang === "it" ? state.description_it : state.description_en}
                onChange={(e) => {
                  if (state.lang === "it") setState((p) => ({ ...p, description_it: e.target.value }));
                  setState((p) => ({ ...p, description_en: e.target.value }))
                }}
              />
              <div className="fxc">
                <ActiveOrDisable disableDate={state.disable_date} isNew={isNew} setModal={setShouldShowModal} />
                <SaveContainerMemo onSubmit={handleSubmitJob} isNew={isNew} />
              </div>
            </FieldsetBeije>
          </>
        )}
      </form>
      <Modal
        shouldShow={shouldShowModal}
        goBack={goBack}
        path={"/jobs"}
        actions={{
          save: () => { saveJob({ ...state, date_creation: isNew ? todayWithTime() : format(state.date_creation, "yyyy-MM-dd'T'HH:mm"), lang: null }) },
          disable: () => { disableOrActiveJob(); }
        }}
        setModal={setShouldShowModal}
        setGoBack={setGoBack}

      >
        <Message message={goBack ? "Non hai Salvato, Vuoi salvare?" : "Sicur* di Procedere?"} />
      </Modal>
      {
        saveJobResult?.error !== null || saveJobResult.response && <ToastContainer />
      }

    </div>
  );
};

export default Job;
