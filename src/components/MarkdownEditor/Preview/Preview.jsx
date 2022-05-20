import styles from "./Preview.module.css";

const Preview = ({ html }) => {
  return (
    <div
      className={styles.preview}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
};

export default Preview;
