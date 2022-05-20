import { useEffect, useReducer, useRef, useCallback } from "react";
import useStorage from "./useStorage";
import axios from "../config/axios.config";

const initialState = {
  response: null,
  loading: false,
  error: null,
};

function reducer(_, { type, payload }) {
  switch (type) {
    case "REQUEST":
      return { ...initialState, loading: true };
    case "SUCCESS":
      return { ...initialState, response: payload };
    case "ERROR":
      return { ...initialState, error: payload };
  }
}

export default function useService(url, options = {}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [cache, setCache] = useStorage("cache", {}, true);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const execute = useCallback(
    async (params) => {
      const method = options.method?.toLowerCase() || "get";
      const signal = abortControllerRef.current.signal;
      if (options.cache && cache[url]) {
        dispatch({ type: "SUCCESS", payload: cache[url] });
      } else {
        dispatch({ type: "REQUEST" });
        try {
          const { data } = await axios[method](url,
            method !== "get" ? { ...params } : { params },
            { signal });
          dispatch({ type: "SUCCESS", payload: data });
          if (options.cache) setCache((prev) => ({ ...prev, [url]: data }));
        } catch (error) {
          if (!signal.aborted) {
            dispatch({ type: "ERROR", payload: error.response });
          }
        }
      }
    },
    [cache]
  );

  return [state, execute];
}
