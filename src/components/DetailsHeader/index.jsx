import GoBackArrow from "../GoBackArrow/GoBackArrow";
// import PropTypes from "prop-types";
import styles from './styles.module.css';

function DetailsHeader({ handleBack, isNew, title, onSubmit }) {
  return (
    <div className={styles["title-row"]}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <GoBackArrow handleBack={handleBack} />

        <h2>
          {
            isNew ?
              `Nuovo ${title}`
              : `Modifica ${title}`
          }
        </h2>
      </div>
      {
        !isNew &&
        <button
          name="quickSave"
          type="submit"
          className="success-button"
          onClick={onSubmit}
        >
          Salvataggio rapido
        </button>
      }
    </div>
  )
}

DetailsHeader.defaultProps = {
  title: ""
}

export default DetailsHeader;
