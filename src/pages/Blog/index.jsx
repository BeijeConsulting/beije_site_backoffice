import { useState, useEffect, useId } from "react";

// router & format
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

// hooks & utils
import useService from "../../hooks/useService";
import { notify, ToastContainer } from "../../utils/toast";
import { todayWithTime } from "../../utils/date";

// components
import Input from "../../components/Input";
import MDEditor from "../../components/MDEditor";
import SingleImageInput from "../../components/SingleImageInput";
import Select from "../../components/Select";
import Modal from "../../components/Modal/Modal";
import Message from "../../components/Message";
import DetailsHeader from "../../components/DetailsHeader";
// import Hashtags from "../../components/Hashtags";
import Permalink from "../../components/Permalink";
import MultipleImageInput from "../../components/MultipleImageInput";

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

// const imageState = {
//   blog_id: null,
//   description: "",
//   desktop: "",
//   mobile: "",
//   original: "",
//   tablet: "",
//   thumbnail: ""
// }
let id = null;

const Blog = ({ isNew }) => {

  const params = useParams();
  const toastId = useId();

  const idToUse = id ? id : params.id;

  const [state, setState] = useState(emptyState);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [goBack, setGoBack] = useState(false)

  const navigate = useNavigate();

  // api
  const [getBlogResult, getBlog] = useService(`/blog/id/${idToUse}`);

  // const [hashtagsResult, getHashtags] = useService(`/blog_hashtag/blog/${idToUse}`); Hashtag logic has been suspended  14/07/22

  const [saveBlogResult, saveBlog] = useService(isNew ? "/admin/blog" : `/admin/blog/id/${idToUse}`, {
    method: isNew ? "post" : "put",
  });

  const [saveImageResult, saveImage] = useService("/site_image", {
    method: "post"
  });

  const [getBlogWithPermalinkRes, getBlogPermalink] = useService(`admin/blog/${state.translate_blog_permalink}`);

  const [putBlogPermalinkRes, putBlogPermalink] = useService(`admin/blog/${state.permalink}`, { method: "put" });

  const [disableOrActiveResult, disableOrActiveBlog] = useService(state.disableDate ?
    `/admin/blog/re_activate/${id}` : `/admin/blog/delete/${idToUse}`, {
    method: state.disableDate ? "put" : "delete"
  })

  useEffect(() => {
    if (!isNew) {
      getBlog()
      // getHashtags()
    }
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
      navigate('/blogs', {
        state: {
          toast: true
        }
      })
    }
    if (disableOrActive.error) notify('error', toastId);

    return () => (id = null);

  }, [getBlogResult?.response, saveBlogResult?.response, saveBlogResult?.error, getBlogWithPermalinkRes.response]);

  const handleSubmitPost = (e) => {
    e.preventDefault();
    saveBlog(
      {
        ...state,
        create_datetime: isNew ? todayWithTime() : format(state.create_datetime, "yyyy-MM-dd'T'HH:mm"),
        translate_blog_permalink: isNew ? state.permalink : state.translate_blog_permalink
      });
  }

  const handleSetLanguage = (language) => {
    !isNew && getBlogPermalink();
    setState((p) => ({ ...p, language }))
  }

  const handleBack = () => {
    if (getBlogResult?.response !== state) {
      setGoBack(true);
      setShouldShowModal(true)
      return
    }
    navigate("/blogs")
  }

  return (
    <div className={styles["container"]}>
      <form>
        <DetailsHeader handleBack={handleBack} isNew={isNew} title={state.title} handleSubmit={handleSubmitPost} />

        {(isNew || getBlogResult.response) && (
          <>
            <div className={styles["images"]}>
              <SingleImageInput
                aspectRatio="1"
                style={{ maxWidth: "30%" }}
                label="Cover_img"
                value={state.cover_img}
                onChange={(cover_img) => {
                  setState((p) => ({ ...p, cover_img }));
                }}
              />

              <div style={{ display: "flex" }}
              >

                <MultipleImageInput state={[state, setState]} />
              </div>

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
                <Permalink state={state} setState={setState} />
              </div>

              <div className={styles["inputs-row"]}>
                {
                  !isNew &&
                  <button className="primary-button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShouldShowModal(true)
                    }}>{state.disable_date ? "Riattiva" : "Disabilita"}</button>
                }
              </div>

              {/* <Hashtags hashtagList={hashtagsResult} /> */}
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
        goBack={goBack}
        path={"/blogs"}
        actions={{
          save: () => { saveBlog({ ...state, create_datetime: isNew ? todayWithTime() : format(state.create_datetime, "yyyy-MM-dd'T'HH:mm") }) },
          disable: () => { disableOrActiveBlog(); }
        }}
        setModal={setShouldShowModal}
        setGoBack={setGoBack}

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