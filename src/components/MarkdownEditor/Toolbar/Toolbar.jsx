import styles from "./Toolbar.module.css";
import boldIcon from "../../../assets/images/icons/bold.png";
import italicIcon from "../../../assets/images/icons/italic.png";
import underlineIcon from "../../../assets/images/icons/underline.png";
import listIcon from "../../../assets/images/icons/list.png";
import orderedListIcon from "../../../assets/images/icons/ordered-list.png";
import linkIcon from "../../../assets/images/icons/link.png";

import editorLinkPopup from "../../../utils/editorLinkPopup";

const buttons = [
  {
    type: "bold",
    icon: boldIcon,
    markers: () => ["**", "**"],
  },
  {
    type: "italic",
    icon: italicIcon,
    markers: () => ["*", "*"],
  },
  {
    type: "underline",
    icon: underlineIcon,
    markers: () => ["<u>", "</u>"],
  },
  {
    type: "list",
    icon: listIcon,
    markers: () => ["\n- ", ""],
  },
  {
    type: "orderedList",
    icon: orderedListIcon,
    markers: (next) => [`${next}. `, ""],
  },
  {
    type: "link",
    icon: linkIcon,
    markers: (text, link) => [`[${text}](${link}`, ")"],
  },
];

const Toolbar = ({ editorElement, onAction }) => {
  return (
    <div className={styles.toolbar}>
      {buttons.map((btn) => (
        <button
          key={btn.type}
          onClick={async (e) => {
            if (editorElement) {
              const {
                value = "",
                selectionStart,
                selectionEnd,
              } = editorElement;
              const toEdit = value.substring(selectionStart, selectionEnd);
              const editSnippets = toEdit.split("\n");
              let edited;
              if (btn.type === "link") {
                const link = await editorLinkPopup(e.clientX, e.clientY);
                edited = editSnippets.map((s) => {
                  const [startMark, endMark] = btn.markers(s, link);
                  return s && link ? `${startMark}${endMark}` : s;
                });
              } else {
                edited = editSnippets.map((s, i) => {
                  const [startMark, endMark] = btn.markers(i + 1);
                  return s ? `${startMark}${s}${endMark}` : s;
                });
              }
              onAction(selectionStart, selectionEnd, edited.join("\n"));
            }
          }}
        >
          <img src={btn.icon} />
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
