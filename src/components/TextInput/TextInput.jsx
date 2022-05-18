import styles from "./TextInput.module.css";

const TextInput = ({
  placeholder = "",
  value = "",
  type = "text",
  ...props
}) => {
  return (
    <div className={styles.inputWrapper}>
      <input value={value} type={type} placeholder=" " {...props} />
      <span>{placeholder}</span>
    </div>
  );
};

export default TextInput;
