import { useId } from "react";
import styles from "./Checkbox.module.css";

const Checkbox = ({ checked, label, onChange }) => {
  const id = useId();

  return (
    <div className={styles.container}>
      <label
        className={`${styles.checkbox} ${checked ? styles.checked : ""}`}
        htmlFor={id}
      >
        <input
          id={id}
          hidden
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            const { checked } = e.target;
            onChange(checked);
          }}
        />
      </label>
      <span>{label}</span>
    </div>
  );
};

export default Checkbox;
