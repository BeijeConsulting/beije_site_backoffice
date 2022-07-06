import styles from "./styles.module.css";

const Table = ({ headers, records, onAction, actionLabel, formatDimension }) => {
  return (
    <div className={styles["container"]}>
      <div
        style={{
          gridTemplateColumns: `repeat(${headers.length}, ${formatDimension}px) ${actionLabel ? "120px" : ""
            }`,
        }}
        className={styles["headers"]}
      >
        {headers.map((h) => (
          <p key={h}>{h}</p>
        ))}
        {actionLabel ? <p></p> : ""}
      </div>
      <div className={styles["row-container"]}>
        {records.map((r) => (
          <div
            key={JSON.stringify(r)}
            style={{
              gridTemplateColumns: `repeat(${headers.length}, ${formatDimension}px) ${actionLabel ? "120px" : ""
                }`,
            }}
            className={styles["row"]}
          >
            {Object.entries(r).map(([k, v]) => (
              <p key={k}>
                {typeof v === "boolean" ? (
                  v ? (
                    <span>&#x2713;</span>
                  ) : (
                    <span>&times;</span>
                  )
                ) : (
                  v
                )}
              </p>
            ))}
            <button
              className={styles["action-btn"]}
              onClick={() => onAction(r)}
            >
              {actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
