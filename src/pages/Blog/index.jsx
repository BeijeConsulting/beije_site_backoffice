import { useState, useEffect, useId } from "react";

// router & format
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

// hooks & utils
import useService from "../../hooks/useService";
import { notify, ToastContainer } from "../../utils/toast";


// components
import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import MDEditor from "../../components/MDEditor";

// styles
import styles from "./styles.module.css";
import SingleImageInput from "../../components/SingleImageInput";

const emptyState = {
  title: "",
  subtitle: "",
  language: "",
  description: "",
  images: [],
  author: "",
  create_datetime: format(Date.now(), "yyyy-MM-dd"),
  cover_img: "",
  permalink: "",
};


const Blog = ({ isNew }) => {

  const { id } = useParams();
  const toastId = useId();

  const [state, setState] = useState(emptyState);

  const navigate = useNavigate();

  // api
  const [getBlogResult, getBlog] = useService(`/blog/id/${id}`);

  const [saveBlogResult, saveBlog] = useService(isNew ? "/blog" : `/blog/${id}`, {
    method: isNew ? "post" : "put",
  });

  useEffect(() => {
    if (!isNew) getBlog()
  }, []);

  useEffect(() => {
    const { response } = getBlogResult ?? { response: null };
    if (response) {
      console.log(response);
      setState(response);
    }

    const save = saveBlogResult ?? { response: null };
    if (save.response) {
      navigate('/jobs', {
        state: {
          toast: true
        }
      })
    }
    if (save.error) notify('error', toastId);

  }, [getBlogResult?.response, saveBlogResult?.response, saveBlogResult?.error]);

  const handleSubmitPost = (e) => {
    e.preventDefault();
    saveBlog({ ...state, create_datetime: format(isNew ? Date.now() : state.create_datetime, "yyyy-MM-dd HH:mm") });
  }

  return (
    <div className={styles["container"]}>
      <form
        onSubmit={handleSubmitPost}
      >
        <div className={styles["title-row"]}>
          <Link
            to="/blogs"
            style={{
              fontSize: "200%",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            &larr;
          </Link>
          <h2>
            {isNew
              ? "Nuovo post"
              : getBlogResult.response
                ? `Modifica ${getBlogResult.response.title}`
                : ""}
          </h2>
          <button type="submit" className="primary-button">
            Salva
          </button>
        </div>
        {(isNew || getBlogResult.response) && (
          <>
            <div className={styles["inputs-row"]}>
              <div className={styles["images"]}>
                <SingleImageInput
                  aspectRatio="1"
                  style={{ maxWidth: "200px" }}
                  label="Cover_img"
                  value={state.cover_img}
                  onChange={(cover_img) => {
                    setState((p) => ({ ...p, cover_img }));
                  }}
                />

                <SingleImageInput
                  aspectRatio="1"
                  style={{ maxWidth: "200px" }}
                  label="Images"
                  value={state.images}
                  onChange={(images) => {
                    setState((p) => ({ ...p, images }));
                  }}
                />
              </div>

              <Input
                style={{ width: "40%" }}
                placeholder="Titolo"
                name="title"
                value={state.title}
                onChange={(e) =>
                  setState((p) => ({ ...p, title: e.target.value }))
                }
              />

              <Input
                style={{ width: "40%" }}
                placeholder="Autore"
                name="title"
                value={state.author}
                onChange={(e) =>
                  setState((p) => ({ ...p, author: e.target.value }))
                }
              />

              {
                !isNew &&
                <Checkbox
                  checked={state.disable_date}
                  onChange={(e) => {
                    setState((p) => ({ ...p, disable_date: e.target.checked }));
                  }}
                  label="Visibile: "
                />
              }
            </div>
            <MDEditor
              value={state.description}
              onChange={(e) =>
                setState((p) => ({ ...p, description: e.target.value }))
              }
            />
          </>
        )}
      </form>
      {
        saveBlogResult?.error && <ToastContainer />
      }
    </div>
  );
};

export default Blog;