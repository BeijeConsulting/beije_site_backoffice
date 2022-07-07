import { useState, useEffect } from "react";

// router & format
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

// hooks
import useService from "../../hooks/useService";

// components
import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import MDEditor from "../../components/MDEditor";

// styles
import styles from "./styles.module.css";

const emptyState = {
  title: "",
  subtitle: "",
  language: "",
  description: "",
  images: [],
  author: "",
  createDateTime: format(Date.now(), "yyyy-MM-dd"),
  cover_img: "",
  permalink: "",
};


const Blog = ({ isNew }) => {

  const { id } = useParams();

  const [state, setState] = useState(emptyState);

  const navigate = useNavigate();

  // api
  const [getBlogResult, getBlog] = useService(`/blog/id/${id}`);

  const [saveBlogResult, saveBlog] = useService("/blog", {
    method: "post",
  });

  const [updateBlogResult, updateBlog] = useService(`/blog/id/${id}`, {
    method: "put",
  });

  useEffect(() => {
    if (!isNew) getBlog()
  }, []);

  useEffect(() => {
    const { response } = getBlogResult ?? { response: null };
    if (response) {
      setState(response);
    }
  }, [getBlogResult?.response]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNew) {
      await saveBlog({ ...state, createDateTime: new Date(state.createDateTime).getTime() });
      navigate('/blogs', {
        state: {
          toast: saveBlogResult.error === null ? true : false
        }
      })
    } else {
      await updateBlog({ ...state });
      navigate('/blogs', {
        state: {
          toast: updateBlogResult.response ? true : false
        }
      })
    }
  }

  return (
    <div className={styles["container"]}>
      <form
        onSubmit={handleSubmit}
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
    </div>
  );
};

export default Blog;