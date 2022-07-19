import GoBackArrow from "../GoBackArrow/GoBackArrow";
// import PropTypes from "prop-types";
import styles from './styles.module.css';

function DetailsHeader({ handleBack, isNew, title }) {
  return (
    <div className={styles["title-row"]}>
      <div style={{display: "flex", alignItems: "center"}}>
        <GoBackArrow handleBack={handleBack} />

        <h2>
          {
            isNew ?
              `nuovo ${title}`
              : `Modifica ${title}`
          }
        </h2>
      </div>
    </div>
  )
}

DetailsHeader.defaultProps = {
  title: ""
}

export default DetailsHeader;
