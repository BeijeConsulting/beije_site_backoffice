import { useState, useEffect, useId, useCallback } from "react";

// router & format
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

// hooks & utils
import useService from "../../hooks/useService";
import { notify, ToastContainer } from "../../utils/toast";
import { todayWithTime } from "../../utils/date";
import { permalink } from "../../utils/utils";
import { handleRequestsModal } from "../../utils/modal";

// components
import Input from "../../components/Input";
import MDEditor from "../../components/MDEditor";
import GoBackArrow from "../../components/GoBackArrow/GoBackArrow";
import SingleImageInput from "../../components/SingleImageInput";
import Select from "../../components/Select";
import Modal from "../../components/Modal/Modal";
import Message from "../../components/Message";

// styles
import styles from "./styles.module.css";


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
  translate_blog_permalink: null
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
let id = null;
let goBack = false;

const Blog = ({ isNew }) => {

  const params = useParams();
  const toastId = useId();

  const [state, setState] = useState(emptyState);
  const [shouldShowModal, setShouldShowModal] = useState(false);

  const navigate = useNavigate();
  const navigateModal = useCallback(()=>{navigate("/blogs")},[])


  // api
  const [getBlogResult, getBlog] = useService(`/blog/id/${id ? id : params.id}`);

  const [saveBlogResult, saveBlog] = useService(isNew ? "/admin/blog" : `/admin/blog/id/${id ? id : params.id}`, {
    method: isNew ? "post" : "put",
  });

  const [saveImageResult, saveImage] = useService("/fileupload", {
    method: "post"
  });

  const [getBlogWithPermalinkRes, getBlogPermalink] = useService(`/blog/${state.translate_blog_permalink}`);

  const [disableOrActiveResult, disableOrActiveBlog] = useService(state.disableDate ?
    `/admin/blog/re_activate/${id}` : `/admin/blog/delete/${id ? id : params.id}`, {
    method: state.disableDate ? "put" : "delete"
  })

  useEffect(() => {
    if (!isNew) getBlog()
    id = params.id;
  }, []);

  useEffect(() => {
    const { response } = getBlogResult ?? { response: null };
    if (response) {
      setState(response);
    }

    const responsePermalink = getBlogWithPermalinkRes ?? { response: null };
    if (responsePermalink.response) {
      id = responsePermalink.response.id
      setState(responsePermalink.response);
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

    const disableOrActive = disableOrActiveResult ?? { response: null };

    if (disableOrActive.response) {
      navigate('/jobs', {
        state: {
          toast: true
        }
      })
    }
    if (disableOrActive.error) notify('error', toastId);

    return () => (id = null, goBack = false);

  }, [getBlogResult?.response, saveBlogResult?.response, saveBlogResult?.error, getBlogWithPermalinkRes.response]);

  const handleSubmitPost = (e) => {
    e.preventDefault();
    saveBlog(
      {
        ...state,
        create_datetime: isNew ? todayWithTime() : format(state.create_datetime, "yyyy-MM-dd'T'HH:mm"),
        cover_img: null,
        translate_blog_permalink: isNew ? state.permalink : state.translate_blog_permalink
      });
  }

  const handleSetLanguage = (language) => {
    !isNew && getBlogPermalink();
    setState((p) => ({ ...p, language }))
  }

  function onClickYes() {
    if (goBack) {
      saveCaseStudy({ ...state, createDateTime: isNew ? todayWithTime() : format(state.createDateTime, "yyyy-MM-dd'T'HH:mm") });
      goBack = false;
    }

    disableOrActiveBlog();
  }

  const handleBack = () => {
    if (getBlogResult?.response !== state) {
      goBack = true;
      setShouldShowModal(true)
      return
    }
    navigate("/jobs")
  }

  return (
    <div className={styles["container"]}>
      <form
        onSubmit={handleSubmitPost}
      >
        <div className={styles["title-row"]}>
          <GoBackArrow handleBack={handleBack} />

          <h2>
            {isNew
              ? "Nuovo post"
              : getBlogResult.response
                ? `Modifica ${state.title}`
                : ""}
          </h2>
          <button type="submit" className="primary-button">
            Salva
          </button>
        </div>
        {(isNew || getBlogResult.response) && (
          <>
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
              <div className={styles["container"]}>

                <div className={styles["inputs-row"]}>
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Titolo"
                    name="title"
                    value={state.title}
                    onChange={(e) =>
                      setState((p) => ({ ...p, title: e.target.value }))
                    }
                  />

                  <Input
                    style={{ width: "100%" }}
                    placeholder="Sottotitolo"
                    name="subtitle"
                    value={state.subtitle}
                    onChange={(e) =>
                      setState((p) => ({ ...p, subtitle: e.target.value }))
                    }
                  />
                </div>
                <div className={styles["inputs-row"]}>

                  <Input
                    style={{ width: "100%" }}
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
                    onChange={handleSetLanguage}
                  />
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Permalink"
                    name="permalink"
                    value={state.permalink}
                    onChange={(e) =>
                      setState((p) => ({ ...p, permalink: permalink(e.target.value) }))
                    }
                  />
                </div>


                <div className={styles["inputs-row"]}>
                  {
                    !isNew &&
                    <button className="primary-button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShouldShowModal(true)
                      }}>{state.disable_date ? "Riattiva" : "Disabilità"}</button>
                  }
                </div>

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
      <Modal
        shouldShow={shouldShowModal}
        onRequestClose={handleRequestsModal(goBack ? "goback": "no", onClickYes, setShouldShowModal, navigateModal)}
        onRequestYes={handleRequestsModal("yes", onClickYes, setShouldShowModal)}
      >
        <Message message={goBack ? "Non hai Salvato, Vuoi salvare?" : "Sicur* di Procedere?"} />
      </Modal>
      {
        saveBlogResult?.error && <ToastContainer />
      }
    </div>
  );
};

export default Blog;