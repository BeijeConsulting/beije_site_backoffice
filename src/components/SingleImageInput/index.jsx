import { useEffect, useId } from "react";
// hooks
import useService from "../../hooks/useService";
// axios
import { imagesApi } from "../../config/axios.config";
// style
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

const SingleImageInput = ({ value, onChange, label, style, aspectRatio, isBlogMassive, idProp, isCover, isNew, type, noEdit }) => {
  const id = useId();
  
  const [deleteImgResult, deleteImg] = useService(`/admin/${type === "blogId" ? "blog" : "event"}/delete_cover/${idProp}`, {
    method: "delete"
  })

  const [deleteLogoRes, deleteLogo] = useService(`/admin/casestudy/delete_logo/${idProp}`, {
    method: "put"
  })

  const [deleteImgProfileRes, deleteImgProfile] = useService(`/team/user/delete_img/${idProp}`, {
    method: "put"
  })

  const imageObj = {
    file_base64: null,
    name: value,
    type: null,
    description: value,
    [type]: idProp,
  }

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
              if(isCover) deleteImg();
              
              switch (type) {
                case "case_study":
                  deleteLogo();
                  break;

                case "user":
                  deleteImgProfile();
                  break;

                default:
                  (!isNew && !isCover) && imagesApi(`/admin/site_image/${type === "blogId" ? "blog" : "event"}/delete`, imageObj, "delete");
                  break;
              }
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
