import { useEffect, useState, useRef } from "react";
import { Converter } from "showdown";
import styles from "./MarkdownEditor.module.css";

import Editor from "./Editor";
import Preview from "./Preview";
import Toolbar from "./Toolbar";

const converter = new Converter({
  emoji: true,
  noHeaderId: true,
  simplifiedAutoLink: true,
  simpleLineBreaks: true,
  smoothLivePreview: true,
});

const MarkdownEditor = ({ value = "", onChange }) => {
  const [text, setText] = useState("");
  const [html, setHtml] = useState("");

  const [selection, setSelection] = useState([]);

  const editorRef = useRef(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    setHtml(converter.makeHtml(text));
    if (onChange) {
      onChange(text);
    }
  }, [text]);

  useEffect(() => {
    const [start, end] = selection;
    editorRef.current.selectionStart = start;
    editorRef.current.selectionEnd = end;
    editorRef.current.focus();
  }, [selection]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.editorContainer}>
        <Toolbar
          editorElement={editorRef?.current}
          onAction={(start, end, value) => {
            setText(
              (prev) => prev.substring(0, start) + value + prev.substring(end)
            );
            setSelection([start, start + value.length]);
          }}
        />
        <Editor ref={editorRef} text={text} setText={setText} />
      </div>
      <Preview html={html} />
    </div>
  );
};

export default MarkdownEditor;
