import { useEffect, useState } from "react";
import caretIcon from "../../assets/images/icons/down-caret.png";
import styles from "./Select.module.css";

const Select = ({ placeholder, value, onChange, options = [] }) => {
  const [selected, setSelected] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <button
      className={`${styles.selector} ${isOpen ? styles.open : ""}`}
      onFocus={() => {
        setIsOpen(true);
      }}
      onBlur={() => {
        setIsOpen(false);
      }}
    >
      <span
        className={`${styles.placeholder} ${
          selected ? styles.placeholderUp : ""
        }`}
      >
        {placeholder}
      </span>
      <span>{selected?.label}</span>
      <i className={styles.caret}>
        <img src={caretIcon} alt="" />
      </i>
      <ul
        role="list"
        className={`${styles.options} ${isOpen ? styles.optionsVisible : ""}`}
      >
        {options.map((o) => (
          <li
            key={o.value}
            className={selected?.value === o.value ? styles.selected : ""}
            onClick={(e) => {
              setSelected(o);
              e.target.parentElement.parentElement.blur();
              if (onChange) onChange(o);
            }}
          >
            {o.label}
          </li>
        ))}
      </ul>
    </button>
  );
};

export default Select;
