
import { useState, useEffect } from "react";
import { useId } from "react";
//navigation
import { useParams, useNavigate } from "react-router-dom";

// date format
import { format } from "date-fns";

//api
import useService from "../../hooks/useService";

//utils
import { notify, ToastContainer } from "../../utils/toast";
import { checkIsQuickSave, navigateWithNotify } from "../../utils/utils";

//components
import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import Select from "../../components/Select";
import DatePicker from "../../components/DatePicker";
import SingleImageInput from "../../components/SingleImageInput";
import Modal from "../../components/Modal/Modal";
import Message from "../../components/Message";
import styles from "./styles.module.css";
import Loader from "../../components/Loader";
import DetailsHeader from "../../components/DetailsHeader";
import FieldsetBeije from "../../components/FieldsetBeije";
import CardContainerMemo from "../../components/CardContainer";
import SaveContainerMemo from "../../components/SaveContainer";

const emptyState = {
  firstName: "",
  lastName: "",
  role: "",
  hireDate: "",
  picImage: null,
  picImageThumbnail: null,
  picOnSite: false,
};

let id = null;
let isQuickSave = false;

const User = ({ isNew }) => {


  const navigate = useNavigate();
  const params = useParams();
  const toastId = useId();
  id = params.id

  const [state, setState] = useState(emptyState);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [goBack, setGoBack] = useState(false)

  const [getUserResult, getUser] = useService(`team/user/${id}`);
  const [disableUserResult, disableUser] = useService(`/user/${id}`, {
    method: "delete"
  });
  const [saveUserResult, saveUser] = useService(isNew ? "/team/create-new-team-user" : `/team/user/${id}`, {
    method: isNew ? "post" : "put",
  }
  )
  useEffect(() => {
    if (!isNew) getUser();
  }, []);

  useEffect(() => {
    const { response } = getUserResult ?? { response: null };
    if (response) {
      setState(response);
    }
    const save = saveUserResult ?? { response: null };
    if (save.response) {
      if (!isQuickSave) navigateWithNotify(navigate, '/community');
      if (isQuickSave) notify("success", toastId);
      setState(save.response);
    }
    if (save.error) notify('error', toastId);

    const disable = disableUserResult ?? { response: null }

    if (disable.response) {
      navigateWithNotify(navigate, '/community');
    }
    if (disable.error) notify('error', toastId);

  }, [getUserResult?.response, saveUserResult?.response, saveUserResult?.error, disableUserResult?.response, disableUserResult?.error]);

  const handleSubmitUser = (e) => {
    e.preventDefault();
    saveUser({ ...state, hireDate: !state.hireDate ? null : format(state.hireDate, "yyyy-MM-dd") })
    setGoBack(true);
  }

  function handleBack() {
    if (!isNew && getUserResult?.response !== state) {
      setGoBack(true);
      setShouldShowModal(true)
      return
    }
    navigate("/community")
  }

  return (
    getUserResult?.response || isNew ?
      <div className={styles["container"]}>
        <form>
          <DetailsHeader
            handleBack={handleBack}
            onSubmit={handleSubmitUser}
            isNew={isNew}
            title={isNew ? "Utente" : `${getUserResult.response?.firstName} ${getUserResult.response?.lastName}`} />

          {(isNew || getUserResult.response) && (
            <>
              <FieldsetBeije>
                <div className={styles["inputs-container"]}>
                  <CardContainerMemo
                    style={{ justifyContent: 'center' }}>
                    <div className={styles["images"]}>
                      <SingleImageInput
                        idProp={id}
                        isNew={isNew}
                        type="user"
                        aspectRatio="1"
                        style={{ maxWidth: "400px" }}
                        label="Immagine profilo"
                        value={state.picImage}
                        onChange={(picImage) => {
                          setState((p) => {
                            let newState = { ...p, picImage };
                            /*  if (picImage) newState.picImageThumbnail = picImage; */
                            //Rimossa clonazione su thumbnail in data 14/07/2022
                            return newState;
                          });
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {/*  <SingleImageInput
                  aspectRatio="1"
                  style={{ maxWidth: "200px" }}
                  label="Thumbnail"
                  value={state.picImageThumbnail}
                  onChange={(picImageThumbnail) => {
                    setState((p) => ({ ...p, picImageThumbnail }));
                  }}
                /> */}
                      </div>
                    </div>
                  </CardContainerMemo>
                  <div className={styles["container"]}>
                    <CardContainerMemo head={"Input"}>
                      <Input
                        style={{ width: "100%", marginTop: 20 }}
                        placeholder="Nome"
                        name="firstName"
                        value={state.firstName}
                        onChange={(e) =>
                          setState((p) => ({ ...p, firstName: e.target.value }))
                        }
                      />
                      <Input
                        style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
                        placeholder="Cognome"
                        name="lastName"
                        value={state.lastName}
                        onChange={(e) =>
                          setState((p) => ({ ...p, lastName: e.target.value }))
                        }
                      />


                      <DatePicker
                        placeholder="Data di assunzione"
                        value={state.hireDate}
                        onChange={(hireDate) => setState((p) => ({ ...p, hireDate }))}
                      />
                      <Select
                        style={{ maxWidth: "none", marginTop: "2rem" }}
                        value={state.role}
                        label="Ruolo"
                        options={[
                          { value: "frontend", label: "Frontend" },
                          { value: "backend", label: "Backend" },
                          { value: "fullstack", label: "Fullstack" },
                          { value: "hr", label: "HR" },
                          { value: "marketing", label: "Marketing" },
                          { value: "admin", label: "Admin" },
                        ]}
                        onChange={(role) => setState((p) => ({ ...p, role }))}
                      />
                      <div style={{ marginTop: "auto" }}>
                        <Checkbox
                          style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
                          checked={state.picOnSite}
                          onChange={(e) => {
                            setState((p) => ({ ...p, picOnSite: e.target.checked }));
                          }}
                          label="Mostra sul sito: "
                        />



                        {isNew ? "" : <button className="primary-button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShouldShowModal(true)
                          }}>Disabilita</button>}

                      </div>
                    </CardContainerMemo>
                  </div>
                </div>
              </FieldsetBeije>
              <SaveContainerMemo onSubmit={handleSubmitUser} isNew={isNew} />
            </>
          )}
        </form>
        <Modal
          shouldShow={shouldShowModal}
          goBack={goBack}
          path={"/community"}
          actions={{
            save: () => { saveUser({ ...state, hireDate: !state.hireDate ? null : format(state.hireDate, "yyyy-MM-dd") }) },
            disable: () => { disableUser() }
          }}
          setModal={setShouldShowModal}
          setGoBack={setGoBack}

        >
          <Message message={goBack ? "Non hai Salvato, Vuoi salvare?" : "Sicur* di Procedere?"} />
        </Modal>
        {
          saveUserResult?.error !== null && <ToastContainer />
        }
        {
          disableUserResult?.response && <ToastContainer />
        }
      </div >
      :
      <Loader />
  );
};

export default User;
