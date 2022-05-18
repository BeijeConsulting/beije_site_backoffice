import { useEffect, useCallback, useReducer } from "react";

let readers = [];
let aborted;

function generateRandomIds(files, results) {
  const ids = results.map((r) => r.id);
  return files.map((file) => {
    let id;
    do {
      id = Math.floor(Math.random() * files.length * 100);
    } while (ids.includes(id));
    ids.push(id);
    return { id, file };
  });
}

function reducer(state, { type, payload }) {
  const newState = state.filter((s) => s.id !== payload?.id);
  const currentItem = state.find((s) => s.id === payload?.id);
  switch (type) {
    case "START":
      return [
        ...newState,
        { id: payload.id, progress: 0, content: null, error: false },
      ];
    case "PROGRESS":
      return [...newState, { ...currentItem, progress: payload.progress }];
    case "END":
      return [...newState, { ...currentItem, content: payload.content }];
    case "ERROR":
      return [...newState, { ...currentItem, error: true }];
    case "DELETE":
      return newState;
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

function read(id, file, dispatch) {
  const reader = new FileReader();
  readers.push(reader);
  reader.addEventListener("loadstart", () => {
    if (!aborted) dispatch({ type: "START", payload: { id } });
  });
  reader.addEventListener("progress", (e) => {
    if (!aborted) {
      dispatch({
        type: "PROGRESS",
        payload: { id, progress: e.loaded / e.total },
      });
    }
  });
  reader.addEventListener("loadend", (e) => {
    if (!aborted) {
      dispatch({
        type: "END",
        payload: { id, content: e.target.result },
      });
    }
  });
  reader.addEventListener("error", () => {
    if (!aborted) dispatch({ type: "ERROR", payload: { id } });
  });
  reader.readAsDataURL(file);
}

export default function useFileReader() {
  const [results, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    aborted = false;
    () => {
      readers.forEach((reader) => {
        if (reader.readyState === 1) {
          aborted = true;
          reader.abort();
        }
      });
    };
  }, []);

  const readFiles = useCallback((filesList) => {
    const files = generateRandomIds([...filesList], results);
    files.forEach(({ id, file }) => read(id, file, dispatch));
  }, []);

  const deleteFile = useCallback(
    ({ id }) => {
      dispatch({ type: "DELETE", payload: { id } });
    },
    [results]
  );

  const updateFile = useCallback(({ id }, file) => {
    read(id, file, dispatch);
  }, []);

  const setDefaults = useCallback(
    (defaults) => {
      if (results.length) {
        dispatch({ type: "CLEAR" });
      }

      const defaultsWithId = generateRandomIds(defaults, results);
      console.log(defaultsWithId);
      defaultsWithId.forEach(({ id, file }) => {
        dispatch({ type: "END", payload: { id, content: file } });
      });
    },
    [results]
  );

  return [results, { setDefaults, readFiles, deleteFile, updateFile }];
}
