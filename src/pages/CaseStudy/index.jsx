import { useState, useEffect, useId } from "react";

// router & format
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";


// hooks & utils
import useService from "../../hooks/useService";
import { notify, ToastContainer } from "../../utils/toast";
import { permalink } from "../../utils/utils";
import { todayWithTime } from "../../utils/date";

// components
import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import MDEditor from "../../components/MDEditor";
import SingleImageInput from "../../components/SingleImageInput";
import Select from "../../components/Select";

// styles
import styles from "./styles.module.css";
import { handleRequestsModal } from "../../utils/modal";
import Modal from "../../components/Modal/Modal";
import Message from "../../components/Message";

const emptyState = {
  title: "",
  subtitle: "",
  language: "",
  description: "",
  logo: "",
  backgroundColor: "",
  permalink: "",
  translateCasePermalink: "",
  createDateTime: null,
  disableDate: null
};

const imageState = {
  blog_id: null,
  description: "",
  desktop: "",
  mobile: "",
  original: "",
  tablet: "",
  thumbnail: ""
}
let id = null;
let goBack = false;


const CaseStudy = ({ isNew }) => {

  const params = useParams();
  const toastId = useId();

  const [state, setState] = useState(emptyState);
  const [shouldShowModal, setShouldShowModal] = useState(false);


  const navigate = useNavigate();

  // api
  const [getCaseStudyResult, getCaseStudy] = useService(`/casestudy/${id ? id : params.id}`);

  const [saveCaseStudyResult, saveCaseStudy] = useService(isNew ? "/casestudy" : `/casestudy/${id}`, {
    method: isNew ? "post" : "put",
  });

  const [saveImageResult, saveImage] = useService("/fileupload", {
    method: "post"
  })

  const [getCaseStudyLinkRes, getCaseStudyWithLink] = useService(`/casestudy/permalink/${state.translateCasePermalink}`);

  const [disableOrActiveResult, disableOrActiveCaseStudy] = useService(state.disableDate ?
    `/casestudy/re_activate/${id}` : `/casestudy/delete/${id}`, {
    method: state.disableDate ? "put" : "delete"
  })

  useEffect(() => {
    if (!isNew) getCaseStudy()
    id = params.id;
  }, []);

  useEffect(() => {
    const { response } = getCaseStudyResult ?? { response: null };
    if (response) {
      setState(response);
    }

    const responsePermalink = getCaseStudyLinkRes ?? { response: null };
    if (responsePermalink.response) {
      console.log(responsePermalink.response);
      id = responsePermalink.response.id
      setState(responsePermalink.response);
    }

    const save = saveCaseStudyResult ?? { response: null };
    if (save.response) {
      navigate('/case-studies', {
        state: {
          toast: true
        }
      })
    }
    if (save.error) notify('error', toastId);

  }, [getCaseStudyResult?.response, saveCaseStudyResult?.response, saveCaseStudyResult?.error, getCaseStudyLinkRes.response]);

  const handleSubmitPost = (e) => {
    e.preventDefault();
    saveCaseStudy(
      {
        ...state,
        // createDateTime: isNew ? todayWithTime() : format(state.createDateTime, "yyyy-MM-dd'T'HH:mm"),
        createDateTime: isNew ? todayWithTime() : state.createDateTime,
        translateCasePermalink: isNew ? state.permalink : state.translateCasePermalink
      });
  }

  const handleSetLanguage = (language) => {
    !isNew && getCaseStudyWithLink();
    setState((p) => ({ ...p, language }))
  }

  
  function onClickYes() {
    if (goBack) {
      saveCaseStudy({ ...state, createDateTime: isNew ? todayWithTime() : format(state.createDateTime, "yyyy-MM-dd'T'HH:mm") });
      goBack = false;
    }

    disableOrActiveCaseStudy();
  }

  return (
    <div className={styles["container"]}>
      <form
        onSubmit={handleSubmitPost}
      >
        <div className={styles["title-row"]}>
          <Link
            to="/case-studies"
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
              ? "Nuovo case study"
              : getCaseStudyResult.response
                ? `Modifica ${state.title}`
                : ""}
          </h2>
          <button type="submit" className="primary-button">
            Salva
          </button>
        </div>
        {(isNew || getCaseStudyResult.response) && (
          <>
            <div className={styles["images"]}>
              <SingleImageInput
                aspectRatio="1"
                style={{ maxWidth: "200px" }}
                label="Logo"
                value={state.logo}
                onChange={(logo) => {
                  setState((p) => ({ ...p, logo }));
                }}
              />
              <div className={styles["container"]}>
                <div className={styles["inputs-row"]}>
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Titolo"
                    name="title"
                    value={state.title}
                    onChange={(e) =>
                      setState((p) => ({ ...p, title: e.target.value }))
                    }
                  />

                  <Input
                    style={{ width: "100%" }}
                    placeholder="Sottotitolo"
                    name="subtitle"
                    value={state.subtitle}
                    onChange={(e) =>
                      setState((p) => ({ ...p, subtitle: e.target.value }))
                    }
                  />
                  <Input
                    style={{ width: "100%" }}
                    placeholder="BackgroundColor"
                    name="backgroundColor"
                    value={state.backgroundColor}
                    onChange={(e) =>
                      setState((p) => ({ ...p, backgroundColor: e.target.value }))
                    }
                  />
                </div>
                <div className={styles["inputs-row"]}>

                  <Select
                    value={state.language}
                    label="Lingua"
                    options={[
                      { value: "it", label: "italiano" },
                      { value: "en", label: "Inglese" },
                    ]}
                    onChange={handleSetLanguage}
                  />
                  <Input
                    style={{ width: "30%" }}
                    placeholder="Permalink"
                    name="permalink"
                    value={state.permalink}
                    onChange={(e) =>
                      setState((p) => ({ ...p, permalink: permalink(e.target.value) }))
                    }
                  />
                </div>
                <div className={styles["inputs-row"]}>
                  {
                    !isNew &&
                    <button className="primary-button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShouldShowModal(true)
                      }}>{state.disableDate ? "Riattiva" : "Disabilità"}</button>
                  }
                </div>
              </div>
            </div>
            <MDEditor
              value={state.description}
              onChange={(e) =>
                setState((p) => ({ ...p, description: e.target.value }))
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
        <Message message={goBack ? "Non hai Salvato, Vuoi salvare?" : "Sicur* di Procedere?"} />
      </Modal>
      {
        saveCaseStudyResult?.error && <ToastContainer />
      }
    </div>
  );
};

export default CaseStudy;