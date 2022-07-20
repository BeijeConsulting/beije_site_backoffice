import { useId } from "react";
import styles from "./styles.module.css";

const Checkbox = ({ label = "", onChange, checked, style, ...props }) => {
  const id = useId();
  return (
    <label style={{ ...style }} className={styles["wrapper"]} htmlFor={id}>
      <input className="hidden" type="checkbox" id={id} {...props}
        onChange={onChange}
        checked={checked} />
      <span className={styles["label"]}>{label}</span>
      <span className={styles["checkbox"]}></span>
    </label>
  );
};

export default Checkbox;
