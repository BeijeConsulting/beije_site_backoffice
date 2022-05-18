import { useState, useRef, useEffect } from "react";

export default function useStorage(key, defaultValue, session) {
  const storage = useRef(session ? sessionStorage : localStorage);

  const [state, setState] = useState(
    JSON.parse(storage.current.getItem(key)) || defaultValue
  );

  useEffect(() => {
    if (!state && storage.current.getItem(key)) storage.current.removeItem(key);
    else if (state) storage.current.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
