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
import { todayWithTime } from "../../utils/date";
import Select from "../../components/Select";

const emptyState = {
  title: "",
  subtitle: "",
  language: "",
  description: "",
  images: [],
  author: "",
  create_datetime: format(Date.now(), "yyyy-MM-dd"),
  cover_img: null,
  permalink: "",
};

const imageState = {
  blog_id: null,
  description: "",
  desktop: "",
  mobile: "",
  original: "",
  tablet: "",
  thumbnail: ""
}

const Blog = ({ isNew }) => {

  const { id } = useParams();
  const toastId = useId();

  const [state, setState] = useState(emptyState);

  const navigate = useNavigate();

  // api
  const [getBlogResult, getBlog] = useService(`/blog/id/${id}`);

  const [saveBlogResult, saveBlog] = useService(isNew ? "/admin/blog" : `/admin/blog/id/${id}`, {
    method: isNew ? "post" : "put",
  });

  const [saveImageResult, saveImage] = useService("/site_image", {
    method: "post"
  })

  useEffect(() => {
    if (!isNew) getBlog()
  }, []);

  useEffect(() => {
    const { response } = getBlogResult ?? { response: null };
    if (response) {
      // console.log(response);
      setState(response);
    }

    const save = saveBlogResult ?? { response: null };
    if (save.response) {
      navigate('/blogs', {
        state: {
          toast: true
        }
      })
    }
    if (save.error) notify('error', toastId);

  }, [getBlogResult?.response, saveBlogResult?.response, saveBlogResult?.error]);

  const handleSubmitPost = (e) => {
    e.preventDefault();
    console.log(state);
    saveBlog({ ...state, create_datetime: isNew ? todayWithTime() : format(state.create_datetime, "yyyy-MM-dd'T'HH:mm"), permalink: isNew ? `${state.title}-${toastId}` : state.permalink, cover_img: null });
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
                  style={{ maxWidth: "300px" }}
                  label="Cover_img"
                  value={state.cover_img}
                  onChange={(cover_img) => {
                    setState((p) => ({ ...p, cover_img }));
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >

                  <SingleImageInput
                    aspectRatio="1"
                    style={{ maxWidth: "200px" }}
                    label="Images"
                    value={state.images}
                    onChange={(images) => {
                      saveImage({
                        blog_id: id,
                        description: "prova",
                        desktop: images,
                        mobile: images,
                        original: images,
                        tablet: images,
                        thumbnail: images
                      })
                      setState((p) => ({ ...p, images }));
                    }}
                  />
                </div>


              </div>
              <div className={styles["text-row"]}>

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
                  placeholder="Sottotitolo"
                  name="subtitle"
                  value={state.subtitle}
                  onChange={(e) =>
                    setState((p) => ({ ...p, subtitle: e.target.value }))
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

                <Select
                  value={state.language}
                  label="Lingua"
                  options={[
                    { value: "it", label: "italiano" },
                    { value: "eng", label: "Inglese" },
                  ]}
                  onChange={(language) => setState((p) => ({ ...p, language }))}
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