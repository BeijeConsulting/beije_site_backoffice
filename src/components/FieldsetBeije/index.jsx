import { memo } from 'react';
import logo from "../../assets/images/logo-colored.svg";

import styles from "./styles.module.css";

const FieldsetBeije = memo(({ children }) => {
  return (
    <fieldset className={styles['fieldSet']}>
      <legend>
        <img className={styles["logo"]} src={logo} alt="Logo Beije" />
      </legend>
      {children}
    </fieldset>
  )
})



export default FieldsetBeije;
