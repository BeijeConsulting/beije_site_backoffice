import { Converter } from "showdown";
import Editor from "react-markdown-editor-lite";

import "react-markdown-editor-lite/lib/index.css";

import styles from "./MDEditor.module.css";

const converter = new Converter({
  emoji: true,
  noHeaderId: true,
  simplifiedAutoLink: true,
  simpleLineBreaks: true,
  smoothLivePreview: true,
});

converter.setFlavor("allOn");

function handleEditorChange({ text, html }) {
  console.log(text, html);
}

const MDEditor = () => {
  return (
    <Editor
      style={{ height: "60vh" }}
      renderHTML={(text) => converter.makeHtml(text)}
      onChange={handleEditorChange}
      markdownClass={styles.editor}
      canView={{
        menu: true,
        md: true,
        html: true,
        fullScreen: false,
        hideMenu: false,
      }}
    />
  );
};

export default MDEditor;
