import { useEffect, useState, useId } from "react";
import styles from "./Checkbox.module.css";

const Checkbox = ({ checked, label, onChange }) => {
  const [ch, setCh] = useState(false);
  const id = useId();

  useEffect(() => {
    setCh(checked);
  }, [checked]);

  return (
    <div className={styles.container}>
      <label
        className={`${styles.checkbox} ${ch ? styles.checked : ""}`}
        htmlFor={id}
      >
        <input
          id={id}
          hidden
          type="checkbox"
          checked={ch}
          onChange={(e) => {
            const { checked } = e.target;
            setCh(checked);
            if (onChange) onChange(checked);
          }}
        />
      </label>
      <span>{label}</span>
    </div>
  );
};

export default Checkbox;
