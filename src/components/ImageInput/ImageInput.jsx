import { useId, useEffect, useRef } from "react";
import useFileReader from "../../hooks/useFileReader";
import styles from "./ImageInput.module.css";

const ImageInput = ({
  defaultImage,
  onImageChange,
  style,
  label,
  aspectRatio = "16/9",
}) => {
  const [images, reader] = useFileReader();
  const selectedImage = images[0];

  const inputRef = useRef(null);
  const inputId = useId();

  useEffect(() => {
    if (defaultImage) {
      reader.setDefaults([defaultImage]);
    }
  }, [defaultImage]);

  useEffect(() => {
    if (selectedImage?.content && inputRef.current.value) {
      inputRef.current.value = "";
    }
    if (onImageChange) {
      onImageChange(selectedImage?.content);
    }
  }, [selectedImage]);

  return (
    <div
      className={`${styles.container} ${
        selectedImage?.content ? styles.withImage : ""
      }`}
      style={{ aspectRatio, ...style }}
      onDragOver={(e) => {
        e.preventDefault();
        e.target.classList.add(styles.dragover);
        e.dataTransfer.effectAllowed = "copy";
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.target.classList.remove(styles.dragover);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.target.classList.remove(styles.dragover);
        const file = e.dataTransfer.files[0];
        if (selectedImage) reader.updateFile(selectedImage, file);
        else reader.readFiles([file]);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && selectedImage) {
          reader.deleteFile(selectedImage);
        }
      }}
    >
      <p className={styles.infoText}>{label}</p>
      <label className={styles.uploadButton} htmlFor={inputId}>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            if (selectedImage) reader.updateFile(selectedImage, file);
            else reader.readFiles([file]);
          }}
        />
        <span>{!selectedImage?.content ? "+ Carica" : "Modifica"}</span>
      </label>
      <img
        src={
          selectedImage?.content ||
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        }
        alt=""
        className={`${styles.selectedImage} ${
          selectedImage?.content ? styles.uploaded : ""
        }`}
      />
    </div>
  );
};

export default ImageInput;
