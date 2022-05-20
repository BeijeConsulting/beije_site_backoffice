import { useState, useEffect } from "react";
import useService from "../../hooks/useService";

import ImageInput from "../ImageInput";
import TextInput from "../TextInput";
import Select from "../Select";
import Checkbox from "../Checkbox";

import styles from "./UserDetail.module.css";

const UserDetail = () => {
  const [state, setState] = useState({
    name: "",
    surname: "",
    email: "",
    profilePic: "",
    thumbnail: "",
    role: "",
    hiringDate: "",
    showOnSite: true,
    enabled: true,
  });
  // const [{ response, loading, error }, exec] = useService("/teams");

  // useEffect(() => {
  //   exec();
  // }, []);

  function handleInputTextChange(e) {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(state);
  }

  return (
    <form className={styles.userDetailCard} onSubmit={handleSubmit}>
      <div className={styles.userDetailInputs}>
        <div className={styles.container}>
          <TextInput
            name="name"
            placeholder="Nome"
            value={state.name}
            onChange={handleInputTextChange}
          />
          <TextInput
            name="surname"
            placeholder="Cognome"
            value={state.surname}
            onChange={handleInputTextChange}
          />
          <TextInput
            name="email"
            type="email"
            placeholder="Email"
            value={state.email}
            onChange={handleInputTextChange}
          />
          <TextInput
            name="hiringDate"
            placeholder="Data di assunzione"
            value={state.hiringDate}
            onChange={handleInputTextChange}
          />
          <Select
            placeholder="Ruolo"
            options={[
              { value: "Frontend", label: "Frontend" },
              { value: "Backend", label: "Backend" },
            ]}
          />
          <div style={{ display: "flex", gap: "2rem", marginTop: "auto" }}>
            <Checkbox
              checked={state.showOnSite}
              label="Mostra foto sul sito"
              onChange={(checked) => {
                setState((prev) => ({ ...prev, showOnSite: checked }));
              }}
            />
            <Checkbox
              label="Utente abilitato"
              checked={state.enabled}
              onChange={(checked) => {
                setState((prev) => ({ ...prev, enabled: checked }));
              }}
            />
          </div>
        </div>
        <div className={styles.container}>
          <ImageInput
            aspectRatio="1"
            defaultImage={state.profilePic}
            label="Immagine del profilo"
            style={{ width: "215px" }}
            onImageChange={(img) => {
              setState((prev) => ({ ...prev, profilePic: img || "" }));
            }}
          />
          <ImageInput
            aspectRatio="1"
            defaultImage={state.thumbnail || state.profilePic}
            label="Thumbnail"
            style={{ width: "130px", alignSelf: "end" }}
            onImageChange={(img) => {
              setState((prev) => ({ ...prev, thumbnail: img?.content || "" }));
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className={styles.btn}>Salva</button>
      </div>
    </form>
  );
};

export default UserDetail;
