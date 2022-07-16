import { useState, useEffect, useId } from "react";

// router & format
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";


// hooks & utils
import useService from "../../hooks/useService";
import { notify, ToastContainer } from "../../utils/toast";
import { todayWithTime } from "../../utils/date";

// components
import Input from "../../components/Input";
import MDEditor from "../../components/MDEditor";
import SingleImageInput from "../../components/SingleImageInput";
import Select from "../../components/Select";
import Modal from "../../components/Modal/Modal";
import Message from "../../components/Message";
import DetailsHeader from "../../components/DetailsHeader";
import Permalink from "../../components/Permalink";

// styles
import './styles.module.css';
import styles from "./styles.module.css";
import ActiveOrDisable from "../../components/ActiveOrDisable";
import { HexColorPicker } from "react-colorful";

const emptyState = {
  title: "",
  subtitle: "",
  language: "",
  description: "",
  logo: "",
  backgroundColor: "",
  permalink: "",
  translateCasePermalink: "",
  createDate: "",
  disableDate: null
};

let id = null;

const CaseStudy = ({ isNew }) => {

  const params = useParams();
  const toastId = useId();
  const idToUse = id ? id : params.id;

  const [state, setState] = useState(emptyState);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [goBack, setGoBack] = useState(false)
  const [isColor, setIsColor] = useState(false)

  const navigate = useNavigate();

  // api
  const [getCaseStudyResult, getCaseStudy] = useService(`/admin/casestudy/${idToUse}`);

  const [saveCaseStudyResult, saveCaseStudy] = useService(isNew ? "/admin/casestudy" : `/admin/casestudy/${idToUse}`, {
    method: isNew ? "post" : "put",
  });

  const [getCaseStudyLinkRes, getCaseStudyWithLink] = useService(`/admin/casestudy/permalink/${state.translateCasePermalink}`);

  const [disableOrActiveResult, disableOrActiveCaseStudy] = useService(state.disableDate ?
    `/admin/casestudy/re_activate/${idToUse}` : `/admin/casestudy/delete/${idToUse}`, {
    method: state.disableDate ? "put" : "delete"
  })

  function getResponse(apiCall) {
    return apiCall ?? { response: null }
  }

  useEffect(() => {
    if (!isNew) { getCaseStudy() }
    id = params.id;
  }, []);

  useEffect(() => {
    const { response } = getResponse(getCaseStudyResult);
    if (response) {
      setState(response);
    }

    const responsePermalink = getResponse(getCaseStudyLinkRes);
    if (responsePermalink.response) {
      id = responsePermalink.response.id
      setState(responsePermalink.response);
    }

    const save = getResponse(saveCaseStudyResult);
    if (save.response) {
      navigate('/case-studies', {
        state: {
          toast: true
        }
      })
    }
    if (save.error) notify('error', toastId);

    const disableOrActive = getResponse(disableOrActiveResult);

    if (disableOrActive.response) {
      navigate('/case-studies', {
        state: {
          toast: true
        }
      })
    }
    if (disableOrActive.error) notify('error', toastId);

    return () => (id = null);

  },
    [getCaseStudyResult?.response, saveCaseStudyResult?.response, saveCaseStudyResult?.error,
    getCaseStudyLinkRes.response, disableOrActiveResult.response, disableOrActiveResult.error]);

  const handleSubmitPost = (e) => {
    e.preventDefault();
    saveCaseStudy(
      {
        ...state,
        createDate: isNew ? todayWithTime() : format(state.createDate, "yyyy-MM-dd'T'HH:mm"),
        translateCasePermalink: isNew ? state.permalink : state.translateCasePermalink
      });
  }

  const handleSetLanguage = (language) => {
    !isNew && getCaseStudyWithLink();
    setState((p) => ({ ...p, language }))
  }


  const handleBack = () => {
    if (getCaseStudyResult?.response !== state) {
      setGoBack(true)
      setShouldShowModal(true)
      return
    }
    navigate("/case-studies")
  }

  return (
    <div className={styles["container"]}>
      <form
        onSubmit={handleSubmitPost}
      >
        <DetailsHeader handleBack={handleBack} isNew={isNew} title={state.title} />

        {(isNew || getCaseStudyResult.response) && (
          <>
            <div className={styles["images"]}>
              <SingleImageInput
                aspectRatio="1"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
                label="Logo"
                value={state.logo}
                onChange={(logo) => {
                  setState((p) => ({ ...p, logo }));
                }}
              />
              <div className={styles["container"]}>
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

                <Select
                  value={state.language}
                  label="Lingua"
                  options={[
                    { value: "it", label: "italiano" },
                    { value: "en", label: "Inglese" },
                  ]}
                  onChange={handleSetLanguage}
                />
              </div>
              <div className={styles["container"]}>

                <div className={styles["inputs-row"]}>
                  <button className="secondary-button mb" onClick={e => {
                    e.preventDefault();
                    setIsColor(!isColor)
                  }}
                  >
                    {isColor ? "Chiudi" : "Scegli colore di sfondo"}
                  </button>
                  <div className={styles["square"]} style={{ backgroundColor: state.backgroundColor }}></div>
                </div>
                {
                  isColor &&
                  <section>
                    <HexColorPicker color={state.backgroundColor} onChange={(e) => {
                      setState({ ...state, backgroundColor: e })
                    }} />
                  </section>
                }

                <Permalink state={state} setState={setState} />
                <ActiveOrDisable disableDate={state.disableDate} isNew={isNew} setModal={setShouldShowModal} />
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
        goBack={goBack}
        path={"/case-studies"}
        actions={{
          save: () => { saveCaseStudy({ ...state, createDate: isNew ? todayWithTime() : format(state.createDate, "yyyy-MM-dd'T'HH:mm") }) },
          disable: () => { disableOrActiveCaseStudy() }
        }}
        setModal={setShouldShowModal}
        setGoBack={setGoBack}

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