import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import useService from "../../hooks/useService";

import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import Select from "../../components/Select";
import DatePicker from "../../components/DatePicker";
import SingleImageInput from "../../components/SingleImageInput";
import Modal from "../../components/Modal/Modal";
import Message from "../../components/Message";
import styles from "./styles.module.css";
import { useId } from "react";
import { notify, ToastContainer } from "../../utils/toast";
import GoBackArrow from "../../components/GoBackArrow/GoBackArrow";
import MassiveImageLoader from "../../components/MassiveImageLoader/MassiveImageLoader";
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
      navigate('/community', {
        state: {
          toast: true
        }
      })
    }
    if (save.error) notify('error', toastId);

    const disable = disableUserResult ?? { response: null }

    if (disable.response) {
      navigate('/community', {
        state: {
          toast: true
        }
      })
    }
    if (disable.error) notify('error', toastId);
  }, [getUserResult?.response, saveUserResult?.response, saveUserResult?.error, disableUserResult?.response, disableUserResult?.error]);



  function handleBack() {

    if (!isNew && getUserResult?.response !== state) {
      setGoBack(true);
      setShouldShowModal(true)
      return
    }
    navigate("/community")
  }

  return (
    <div className={styles["container"]}>
      {console.log(state)}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveUser({ ...state, hireDate: !state.hireDate ? null : format(state.hireDate, "yyyy-MM-dd") })
          setGoBack(true);
        }}
      >

        <div className={styles["title-row"]}>
          <GoBackArrow
            handleBack={handleBack}></GoBackArrow>
          <h2>
            {isNew
              ? "Nuovo utente"
              : getUserResult.response
                ? `Modifica ${getUserResult.response.firstName} ${getUserResult.response.lastName}`
                : ""}
          </h2>
          <button type="submit" className="success-button">
            Salva Modifiche
          </button>
        </div>
        {(isNew || getUserResult.response) && (
          <div className={styles["inputs-container"]}>
            <div className={styles["images"]}>
              <SingleImageInput
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
            <div>
              <div className={styles["text-row"]}>
                <Input
                  placeholder="Nome"
                  name="firstName"
                  value={state.firstName}
                  onChange={(e) =>
                    setState((p) => ({ ...p, firstName: e.target.value }))
                  }
                />
                <Input
                  placeholder="Cognome"
                  name="lastName"
                  value={state.lastName}
                  onChange={(e) =>
                    setState((p) => ({ ...p, lastName: e.target.value }))
                  }
                />
              </div>
              <div className={styles["text-row"]}>
                <DatePicker
                  placeholder="Data di assunzione"
                  value={state.hireDate}
                  onChange={(hireDate) => setState((p) => ({ ...p, hireDate }))}
                />
                <Select
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
                    checked={state.picOnSite}
                    onChange={(e) => {
                      setState((p) => ({ ...p, picOnSite: e.target.checked }));
                    }}
                    label="Mostra sul sito: "
                  />
                </div>

              </div>
              {isNew ? "" : <button className="primary-button"
                onClick={(e) => {
                  e.preventDefault();
                  setShouldShowModal(true)
                }}>Disabilita</button>}
            </div>
          </div>
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
  );
};

export default User;
