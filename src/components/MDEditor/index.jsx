import { useRef } from "react";
import { Converter } from "showdown";

import boldIcon from "../../assets/images/icons/bold.png";
import italicIcon from "../../assets/images/icons/italic.png";
import underlineIcon from "../../assets/images/icons/underline.png";
import listIcon from "../../assets/images/icons/list.png";
import orderedListIcon from "../../assets/images/icons/ordered-list.png";
import linkIcon from "../../assets/images/icons/link.png";
import styles from "./styles.module.css";

const converter = new Converter({
  simpleLineBreaks: true,
  simplifiedAutoLink: true,
  noHeaderId: true,
});

function getValueSnippets(textarea) {
  const { selectionStart, selectionEnd, value } = textarea;
  return [
    value.substring(0, selectionStart),
    value.substring(selectionStart, selectionEnd).split("\n"),
    value.substring(selectionEnd),
  ];
}

const MDEditor = ({ value, onChange }) => {
  const ref = useRef(null);
  return (
    <div className={styles["container"]}>
      <div className={styles["toolbar"]}>
        <button
          type="button"
          onClick={() => {
            const [start, snippets, end] = getValueSnippets(ref.current);
            const transformed = snippets.map((s) => `**${s}**`).join("\n");
            onChange({
              target: {
                value: `${start}${transformed}${end}`,
              },
            });
          }}
        >
          <img src={boldIcon} />
        </button>
        <button
          type="button"
          onClick={() => {
            const [start, snippets, end] = getValueSnippets(ref.current);
            const transformed = snippets.map((s) => `_${s}_`).join("\n");
            onChange({
              target: {
                value: `${start}${transformed}${end}`,
              },
            });
          }}
        >
          <img src={italicIcon} />
        </button>
        <button
          type="button"
          onClick={() => {
            const [start, snippets, end] = getValueSnippets(ref.current);
            const transformed = snippets.map((s) => `<u>${s}</u>`).join("\n");
            onChange({
              target: {
                value: `${start}${transformed}${end}`,
              },
            });
          }}
        >
          <img src={underlineIcon} />
        </button>
        <button
          type="button"
          onClick={() => {
            const [start, snippets, end] = getValueSnippets(ref.current);
            const transformed = snippets.map((s) => `- ${s}`).join("\n");
            onChange({
              target: {
                value: `${start}${transformed}${end}`,
              },
            });
          }}
        >
          <img src={listIcon} />
        </button>
        <button
          type="button"
          onClick={() => {
            const [start, snippets, end] = getValueSnippets(ref.current);
            const transformed = snippets
              .map((s, i) => `${i + 1}. ${s}`)
              .join("\n");
            onChange({
              target: {
                value: `${start}${transformed}${end}`,
              },
            });
          }}
        >
          <img src={orderedListIcon} />
        </button>
        <button
          type="button"
          onClick={() => {
            const [start, snippets, end] = getValueSnippets(ref.current);
            const link = prompt("Inserisci il link");
            if (link) {
              const transformed = snippets
                .map((s) => `[${s}](${link})`)
                .join("\n");
              onChange({
                target: {
                  value: `${start}${transformed}${end}`,
                },
              });
            }
          }}
        >
          <img src={linkIcon} />
        </button>
      </div>
      <textarea
        ref={ref}
        value={value}
        className={styles["editor"]}
        onChange={onChange}
      ></textarea>
      <div
        className={styles["preview"]}
        dangerouslySetInnerHTML={{ __html: converter.makeHtml(value) }}
      ></div>
    </div>
  );
};

export default MDEditor;
