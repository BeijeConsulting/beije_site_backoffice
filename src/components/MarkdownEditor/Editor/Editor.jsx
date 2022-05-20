import { forwardRef } from "react";
import styles from "./Editor.module.css";

const Editor = forwardRef(({ text, setText }, ref) => {
  return (
    <textarea
      ref={ref}
      value={text}
      className={styles.editor}
      onChange={(e) => {
        setText(e.target.value);
      }}
    ></textarea>
  );
});

export default Editor;
