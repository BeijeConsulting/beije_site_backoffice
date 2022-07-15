import { useId } from "react";
import styles from "./styles.module.css";

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      resolve({ content: e.target.result });
    });
    reader.addEventListener("error", () => {
      reject({ error: e.target.result });
    });
    reader.readAsDataURL(file);
  });
}

const SingleImageInput = ({ value, onChange, label, style, aspectRatio }) => {
  const id = useId();
  return (
    <div
      style={{ aspectRatio, ...style }}
      className={`${styles["container"]} ${value ? styles["with-value"] : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.effectAllowed = "copy";
        e.target.classList.add(styles["dragging"]);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.target.classList.remove(styles["dragging"]);
      }}
      onDrop={async (e) => {
        e.preventDefault();
        const { content, error } = await readFile(e.dataTransfer.files[0]);
        if (!error) {
          onChange(content);
        } else {
          onChange("");
        }
        e.target.classList.remove(styles["dragging"]);
      }}
    >
      {value && <img className={styles["result"]} src={value} alt="" />}
      <span className={styles["label"]}>{label}</span>
      <p className={styles["info-text"]}>
        Carica un'immagine con il pulsante qui sotto o trascinandola nell'area
        tratteggiata.
      </p>
      <div className={styles["actions-container"]}>
        <input
          className="hidden"
          id={id}
          type="file"
          accept="image/*"
          onChange={async (e) => {

            if (e.target.files[0].size > 499999) return
            const { content, error } = await readFile(e.target.files[0]);
            if (!error) {
              onChange(content);
            } else {
              onChange("");
            }
            e.target.value = "";
          }}
        />
        <label className={styles["upload-btn"]} htmlFor={id}>
          <span>{value ? "Modifica" : "Carica"}</span>
        </label>
        {value && (
          <button
            className={styles["delete-btn"]}
            onClick={() => {
              onChange("");
            }}
          >
            Elimina
          </button>
        )}
      </div>
    </div>
  );
};

export default SingleImageInput;
