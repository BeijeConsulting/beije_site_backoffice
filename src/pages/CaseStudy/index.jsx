import { useState, useEffect, useId } from "react";

// router & format
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";


// hooks & utils
import useService from "../../hooks/useService";
import { notify, ToastContainer } from "../../utils/toast";
import { todayWithTime } from "../../utils/date";
import { checkIsQuickSave, getResponse, navigateWithNotify, permalink } from "../../utils/utils";


// components
import Input from "../../components/Input";
import MDEditor from "../../components/MDEditor";
import SingleImageInput from "../../components/SingleImageInput";
import Select from "../../components/Select";
import Modal from "../../components/Modal/Modal";
import Message from "../../components/Message";
import DetailsHeader from "../../components/DetailsHeader";
import Permalink from "../../components/Permalink";
import { HexColorPicker } from "react-colorful";
import FieldsetBeije from "../../components/FieldsetBeije";
import CardContainerMemo from "../../components/CardContainer";
import SaveContainerMemo from "../../components/SaveContainer";
// import ActiveOrDisable from "../../components/ActiveOrDisable";

// styles
import './styles.module.css';
import styles from "./styles.module.css";

const emptyState = {
  title: "",
  subtitle: "",
  language: "it",
  description: "",
  logo: null,
  backgroundColor: "",
  permalink: "",
  translateCasePermalink: "",
  createDate: "",
  disableDate: null
};

let id = null;
let isQuickSave = false;

const CaseStudy = ({ isNew }) => {

  const params = useParams();
  const toastId = useId();
  const idToUse = id ? id : params.id; // id da usare come parametro per chiamate o props componenti

  const [state, setState] = useState(emptyState);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [goBack, setGoBack] = useState(false)
  const [isColor, setIsColor] = useState(false)

  const navigate = useNavigate();

  //* api
  const [getCaseStudyResult, getCaseStudy] = useService(`/admin/casestudy/${idToUse}`);

  const [saveCaseStudyResult, saveCaseStudy] = useService(isNew ? "/admin/casestudy" : `/admin/casestudy/${idToUse}`, {
    method: isNew ? "post" : "put",
  });

  const [getCaseStudyLinkRes, getCaseStudyWithLink] = useService(`/admin/casestudy/permalink/${state.translateCasePermalink}`);

  const [disableOrActiveResult, disableOrActiveCaseStudy] = useService(state.disableDate ?
    `/admin/casestudy/re_activate/${idToUse}` : `/admin/casestudy/delete/${idToUse}`, {
    method: state.disableDate ? "put" : "delete"
  })
  // * fine api

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
      if (!isQuickSave) navigateWithNotify(navigate, '/case-studies');
      if (isQuickSave) notify("success", toastId);
      setState(save.response);
    }

    if (save.error) notify('error', toastId, save.error.data.message);

    const disableOrActive = getResponse(disableOrActiveResult);

    if (disableOrActive.response) navigateWithNotify(navigate, "/case-studies");

    if (disableOrActive.error) notify('error', toastId);

    return () => (id = null);

  },
    [getCaseStudyResult?.response, saveCaseStudyResult.response, saveCaseStudyResult.error,
    getCaseStudyLinkRes.response, disableOrActiveResult.response, disableOrActiveResult.error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    isQuickSave = checkIsQuickSave(isQuickSave, e.target?.name);

    saveCaseStudy(
      {
        ...state,
        createDate: isNew ? todayWithTime() : format(state.createDate, "yyyy-MM-dd'T'HH:mm"),
        permalink: state.permalink === "" ? permalink(state.title) : state.permalink,
        translateCasePermalink: null,
        logo: isNew ? null : state.logo
      });
  }

  const handleSetLanguage = (language) => {
    !isNew && getCaseStudyWithLink();
    setState((p) => ({ ...p, language }));
  }


  const handleBack = () => {
    if (getCaseStudyResult?.response !== state) {
      setGoBack(true);
      setShouldShowModal(true);
      return
    }
    navigate("/case-studies");
  }

  return (
    <div className={styles["container-bg"]}>
      <form>
        <DetailsHeader handleBack={handleBack} onSubmit={handleSubmit} isNew={isNew} title={state.title} />

        {(isNew || getCaseStudyResult.response) && (
          <>
            <FieldsetBeije>
              <div className={styles["container"]}>
                <CardContainerMemo head={"Input"}>
                  <Input
                    style={{ width: "100%", marginTop: 20 }}
                    placeholder="Titolo"
                    name="title"
                    value={state.title}
                    onChange={(e) =>
                      setState((p) => ({ ...p, title: e.target.value }))
                    }
                  />

                  <Input
                    style={{ width: "100%", marginTop: 20 }}
                    placeholder="Sottotitolo"
                    name="subtitle"
                    value={state.subtitle}
                    onChange={(e) =>
                      setState((p) => ({ ...p, subtitle: e.target.value }))
                    }
                  />

                  <Permalink state={state} setState={setState} title="title" />

                  <Select
                    style={{ maxWidth: "none", marginTop: "2rem" }}
                    value={state.language}
                    label="Lingua"
                    options={[
                      { value: "it", label: "italiano" },
                      { value: "en", label: "Inglese" },
                    ]}
                    onChange={handleSetLanguage}
                  />
                </CardContainerMemo>
                <CardContainerMemo head={"Logo"}>
                  <SingleImageInput
                    idProp={idToUse}
                    isNew={isNew}
                    type="case_study"
                    aspectRatio="1"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                    value={state.logo}
                    onChange={(logo) => {
                      setState((p) => ({ ...p, logo }));
                    }}
                  />
                </CardContainerMemo>
              </div>
              <div className="fxc">
                <CardContainerMemo head={"Colore sfondo"} style={{ width: "50%", minHeight: "300px", backgroundColor: state.backgroundColor }}>

                  <div className={styles["inputs-row"]}>
                    <button className="secondary-button mb" onClick={e => {
                      e.preventDefault();
                      setIsColor(!isColor)
                    }}
                    >
                      {isColor ? "Chiudi" : "Scegli colore di sfondo"}
                    </button>
                    {
                      isColor &&
                      <section>
                        <HexColorPicker color={state.backgroundColor} onChange={(e) => {
                          setState({ ...state, backgroundColor: e })
                        }} />
                      </section>
                    }
                  </div>
                </CardContainerMemo>
              </div>
              <MDEditor
                value={state.description}
                onChange={(e) =>
                  setState((p) => ({ ...p, description: e.target.value }))
                }
              />

              <div className="fxc">
                {/* <ActiveOrDisable disableDate={state.disableDate} isNew={isNew} setModal={setShouldShowModal} /> */}
                <SaveContainerMemo onSubmit={handleSubmit} isNew={isNew} />
              </div>
            </FieldsetBeije>
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

      {saveCaseStudyResult.error !== null &&
        <ToastContainer />
      }

      {
        (isQuickSave && saveCaseStudyResult.response) &&
        <ToastContainer />
      }
    </div>
  );
};

export default CaseStudy;