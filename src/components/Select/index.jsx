import styles from "./styles.module.css";

const Select = ({ value, onChange, label, options = [] }) => {
  return (
    <div tabIndex={0} role="listbox" className={styles["wrapper"]}>
      <div className={styles["select"]}>
        <span className={`${styles["label"]} ${value ? styles["up"] : ""}`}>
          {label}
        </span>
        <span className={styles["selected"]}>
          {options.find((o) => o.value === value)?.label}
        </span>
        <span className={styles["caret"]}></span>
      </div>
      <ul role="list" className={styles["options"]}>
        {options.map((o, key) => (
          <li
            key={`${key}-${o.value}`}
            role="listitem"
            className={o.value === value ? styles["item-selected"] : undefined}
            onClick={(e) => {
              onChange(o.value);
              e.target.parentElement.parentElement.blur();
            }}
          >
            {o.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;
