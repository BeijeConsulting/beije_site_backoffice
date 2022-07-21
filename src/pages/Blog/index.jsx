import { useState, useEffect, useId, useCallback } from "react";

// router & format
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

// hooks & utils
import useService from "../../hooks/useService";
import { notify, ToastContainer } from "../../utils/toast";
import { todayWithTime } from "../../utils/date";
import { checkIsQuickSave, navigateWithNotify, permalink } from "../../utils/utils";

// components
import Input from "../../components/Input";
import MDEditor from "../../components/MDEditor";
import SingleImageInput from "../../components/SingleImageInput";
import Select from "../../components/Select";
import Modal from "../../components/Modal/Modal";
import Message from "../../components/Message";
import DetailsHeader from "../../components/DetailsHeader";
import Permalink from "../../components/Permalink";
import CardContainerMemo from "../../components/CardContainer";
import MassiveImageLoader from "../../components/MassiveImageLoader/MassiveImageLoader";
// import Hashtags from "../../components/Hashtags";
// import ActiveOrDisable from "../../components/ActiveOrDisable";

// styles
import styles from "./styles.module.css";
import SaveContainerMemo from "../../components/SaveContainer";
import FieldsetBeije from "../../components/FieldsetBeije";

const emptyState = {
  title: "",
  subtitle: "",
  language: "it",
  description: "",
  type: "blog",
  images: [],
  author: "",
  create_datetime: format(Date.now(), "yyyy-MM-dd"),
  cover_img: null,
  permalink: "",
  translate_blog_permalink: null,
  video_path: null
};

const imageState = {
  description: "",
  file_base64: "",
  name: "",
  type: "",
  blogId: null,
}
let id = null;
let timeout;
let isQuickSave = false;

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

  const [engResult, createEngBlog] = useService("/admin/blog", {
    method: "post",
  });

  const [getBlogWithPermalinkRes, getBlogPermalink] = useService(`admin/blog/${state.translate_blog_permalink}`);

  const [disableOrActiveResult, disableOrActiveBlog] = useService(state.disableDate ?
    `/admin/blog/re_activate/${idToUse}` : `/admin/blog/delete/${idToUse}`, {
    method: state.disableDate ? "put" : "delete"
  })

  const [uploadImgRes, postImg] = useService("/upload/img", {
    method: "post"
  });

  async function checkImages(id) {
    let newArray = state.images.filter((image) => !image.startsWith("https"));

    if (newArray.length > 0) {

      newArray.map(async (img) => {
        await postImg({ ...imageState, file_base64: img, blogId: isNew ? id : idToUse });
        // newState.images.shift();
      })
      if(!isQuickSave) navigateWithNotify(navigate, "/blogs");
    }

    if (!state.cover_img.startsWith("https")) {
      // if(!state.cover_img.startsWith("https")) return;
      await postImg({
        ...imageState,
        file_base64: state.cover_img,
        blogId: isNew ? id : idToUse,
        type: "cover_img"
      });
      // if(!isQuickSave) navigateWithNotify(navigate, "/blogs");
      if(!isQuickSave) navigate("/blogs", {state: {toast: true}});
    }
    navigateWithNotify(navigate, "/blogs");
  }

  useEffect(() => {
    if (!isNew) {
      getBlog()
      // getHashtags()
    }
    id = params.id;
  }, []);

  useEffect(() => {  //si gestiscono tutti i risultati delle chiamate e si vanno a mostrare dei popup o aggiornare i dati oltre alla navigazione

    const newState = Object.assign({}, state);

    const { response } = getBlogResult ?? { response: null };
    if (response) setState(response);

    const responsePermalink = getBlogWithPermalinkRes ?? { response: null };
    if (responsePermalink.response) {
      id = responsePermalink.response.id
      setState(responsePermalink.response);
    }

    const save = saveBlogResult ?? { response: null };

    if (save.response) {
      if (state.images.length === 0 && !isQuickSave) navigateWithNotify(navigate, '/blogs');

      checkImages(save.response.id);

      // if (!isQuickSave) navigateWithNotify(navigate, '/blogs');
      if (isQuickSave) {
        notify("success", toastId)
        setState(save.response);
      }
    };

    if (save.error) notify(`error`, toastId, save.error.message);

    const uploadImg = uploadImgRes ?? { response: null };

    if (newState.images.length === 0 && uploadImg.response) navigateWithNotify(navigate, '/blogs');

    if (uploadImg.error) {
      notify('error', toastId, uploadImg.error.message);
    }

    const disableOrActive = disableOrActiveResult ?? { response: null };

    if (disableOrActive.response) {
      navigateWithNotify(navigate, '/blogs');
    }
    if (disableOrActive.error) notify('error', toastId, disableOrActive.error.message);

    const createEngBLog = engResult ?? { response: null };
    if (createEngBLog.response) {
      id = engResult.response.id;
      setState(engResult.response);
    }

    return () => {
      id = null;
      clearTimeout(timeout)
    };

  }, [getBlogResult?.response, saveBlogResult?.response, saveBlogResult?.error, getBlogWithPermalinkRes.response, disableOrActiveResult.response, disableOrActiveResult.error, engResult.response]);

  const handleSubmitPost = useCallback((e) => {
    e.preventDefault();

    isQuickSave = checkIsQuickSave(isQuickSave, e.target?.name);

    saveBlog(
      {
        ...state,
        create_datetime: isNew ? todayWithTime() : format(state.create_datetime, "yyyy-MM-dd'T'HH:mm"),
        cover_img: null,
        images: [],
        permalink: state.permalink === "" ? permalink(state.title) : state.permalink,
        translate_blog_permalink: isNew ? null : state.translate_blog_permalink,
        type: isNew ? "blog" : null
      });

  }, [state]);

  const handleSetLanguage = (language) => {
    (!isNew && language === "eng") && createEngBlog({
      ...state,
      id: null,
      create_datetime: null,
      cover_img: null,
      images: [],
      permalink: state.permalink,
      translate_blog_permalink: state.permalink,
      type: "blog",
      language: "eng",
    });

    if (!isNew && state.translate_blog_permalink !== null) getBlogPermalink();
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

  const SetImages = (images) => {
    setState({...state, images})
  }

  return (
    <div className={styles["container-bg"]}>
      <form>
        <DetailsHeader handleBack={handleBack} isNew={isNew} title={isNew ? "Post" : state.title} onSubmit={handleSubmitPost} />

        {(isNew || getBlogResult.response) && (
          <>
            <FieldsetBeije>
              <div className={styles["flex-container"]}>

                <CardContainerMemo head={"Input"} style={{ marginRight: "2rem" }}>
                  <Input
                    style={{ width: "100%", marginTop: 20 }}
                    placeholder="Titolo"
                    name="title"
                    value={state.title}
                    onChange={(e) =>
                      setState((p) => ({ ...p, title: e.target.value }))
                    }
                  />

                  <Input
                    style={{ width: "100%", marginTop: 20 }}
                    placeholder="Sottotitolo"
                    name="subtitle"
                    value={state.subtitle}
                    onChange={(e) =>
                      setState((p) => ({ ...p, subtitle: e.target.value }))
                    }
                  />

                  <Input
                    style={{ width: "100%", marginTop: 20 }}
                    placeholder="Autore"
                    name="title"
                    value={state.author}
                    onChange={(e) =>
                      setState((p) => ({ ...p, author: e.target.value }))
                    }
                  />

                  <Permalink state={state} setState={setState} title={"title"} />

                  <Select
                    style={{ maxWidth: "none", marginTop: "2rem" }}
                    value={state.language}
                    label="Lingua"
                    options={isNew ? [
                      { value: "it", label: "italiano" },
                      { value: "it", label: "Crea versione Inglese" },
                    ] : [
                      { value: "it", label: "Italiano" },
                      { value: "eng", label: state.translate_blog_permalink === null ? "Crea versione Inglese" : "Inglese" },
                    ]
                    }
                    onChange={handleSetLanguage}
                  />
                </CardContainerMemo>

                <CardContainerMemo head={"Cover image"}>
                  <SingleImageInput
                    aspectRatio="1"
                    style={{ maxWidth: "100%" }}
                    label=""
                    value={state.cover_img}
                    onChange={(cover_img) => {
                      setState((p) => ({ ...p, cover_img }));
                    }}
                  />
                </CardContainerMemo>

                {/* <CardContainerMemo head={"Actions"}> */}
                {/* <ActiveOrDisable style={{ width: "20%", alignSelf: "end" }} disableDate={state.disable_date} isNew={isNew} setModal={setShouldShowModal} /> */}

                {/* <Hashtags hashtagList={hashtagsResult} /> */}
                {/* </CardContainerMemo>   */}
              </div>

              <MDEditor
                value={state.description}
                onChange={(e) =>
                  setState((p) => ({ ...p, description: e.target.value }))
                }
              />

              <CardContainerMemo head={"Images"}>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                  <MassiveImageLoader states={[state.images, SetImages]} />
                </div>
              </CardContainerMemo>

              <SaveContainerMemo onSubmit={handleSubmitPost} isNew={isNew} />
            </FieldsetBeije>
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
        saveBlogResult?.error !== null || saveBlogResult.response && <ToastContainer />
      }
    </div>
  );
};

export default Blog;