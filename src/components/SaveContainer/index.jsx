import React from 'react';
import styles from "./styles.module.css";

function SaveContainer({ isNew, onSubmit }) {

  return (
    <div className={styles["save-container"]}>
      {/* <button type="submit" className="success-button"
        onClick={onSubmit}>
        Salvataggio rapido
      </button> */}

      <button type="submit" className="success-button"
        onClick={onSubmit}>
        {isNew ? "Salva" : "Salva modifiche"}
      </button>
    </div>
  )
}

const SaveContainerMemo = React.memo(SaveContainer);

export default SaveContainerMemo;
