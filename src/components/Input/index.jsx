import { useState, useRef, useId, useEffect } from "react";
import styles from "./styles.module.css";

const Input = ({ placeholder, type = "text", style, ...props }) => {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const inputRef = useRef(null);
  const prevStateRef = useRef(showPassword);

  useEffect(() => {
    if (prevStateRef.current !== showPassword) {
      inputRef.current.focus();
      prevStateRef.current = showPassword;
    }
  }, [showPassword]);

  return (
    <label htmlFor={id} style={style} className={styles["label"]}>
      <input
        id={id}
        ref={inputRef}
        type={type === "password" && showPassword ? "text" : type}
        placeholder=" "
        size={30}
        className={styles["input"]}
        {...props}
      />
      <span className={styles["placeholder"]}>{placeholder}</span>
      {type === "password" && (
        <button
          type="button"
          className={styles["show-password"]}
          onClick={() => {
            setShowPassword((p) => !p);
          }}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      )}
    </label>
  );
};

export default Input;
