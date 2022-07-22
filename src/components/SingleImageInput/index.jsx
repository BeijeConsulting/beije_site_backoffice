import { useEffect, useId } from "react";
import styles from "./styles.module.css";
import useService from "../../hooks/useService";
import { imagesApi } from "../../config/axios.config";
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

const SingleImageInput = ({ value, onChange, label, style, aspectRatio, isBlogMassive, idProp, isNew, type, noEdit }) => {
  const id = useId();

  const [deleteImgResult, deleteImg] = useService(`/admin/blog/delete_cover/${idProp}`, {
    method: "delete"
  })

  useEffect(() => {
    if (isBlogMassive) {
      (async () => {
        const { content, error } = await readFile(value);
        if (!error) {
          onChange(content);
        }
      })()
    }
  }, [])
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
          multiple
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
        {!noEdit && <label className={styles["upload-btn"]} htmlFor={id}>
          <span>{value ? "Modifica" : "Carica"}</span>
        </label>}

        {value && (
          <button
            className={styles["delete-btn"]}
            onClick={(e) => {
              e.preventDefault();

              if (type === "cover_img") deleteImg();

              else !isNew && imagesApi("/admin/site_image/blog/delete", {
                file_base64: null,
                name: value,
                type: null,
                description: value,
                blogId: idProp,
                eventId: null
              }, "delete");

              onChange("", true);

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
