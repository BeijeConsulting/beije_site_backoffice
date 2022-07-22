import { useState, useEffect, useId, useCallback } from "react";

// router & format
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

// hooks & utils
import useService from "../../hooks/useService";
import { notify, ToastContainer } from "../../utils/toast";
import { todayWithTime } from "../../utils/date";
import { checkIsQuickSave, getResponse, navigateWithNotify, permalink } from "../../utils/utils";
import { imagesApi } from "../../config/axios.config";

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
import FieldsetBeije from "../../components/FieldsetBeije";
import SaveContainerMemo from "../../components/SaveContainer";
import Loader from "../../components/Loader";
// import Hashtags from "../../components/Hashtags";
// import ActiveOrDisable from "../../components/ActiveOrDisable";

// styles
import styles from "./styles.module.css";

const emptyState = {
    title: "",
    subtitle: "",
    language: "it",
    description: "",
    type: "event", //qui deve essere event
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
let isQuickSave = false;
let timeout;
let isImage = false;

const Event = ({ isNew }) => {

    const params = useParams();
    const toastId = useId();

    const idToUse = id ? id : params.id;

    const [state, setState] = useState(emptyState);
    const [shouldShowModal, setShouldShowModal] = useState(false);
    const [goBack, setGoBack] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // api
    const [getEventResult, getEvent] = useService(`/event/id/${idToUse}`);

    const [saveEventResult, saveEvent] = useService(isNew ? "/admin/event" : `/admin/event/id/${idToUse}`, {
        method: isNew ? "post" : "put",
    });

    const [engResult, createEngEvent] = useService("/admin/event", {
        method: "post",
    });

    const [getEventWithPermalinkRes, getEventPermalink] = useService(`admin/event/${state.translate_blog_permalink}`);

    const [disableOrActiveResult, disableOrActiveEvent] = useService(state.disableDate ?
        `/admin/event/re_activate/${idToUse}` : `/admin/event/delete/${idToUse}`, {
        method: state.disableDate ? "put" : "delete"
    })

    async function checkImages(id) {
        isImage = true;
        let res;
        let newArray = state.images.filter((image) => !image.startsWith("https"));

        if (newArray.length === 0 && state.cover_img.startsWith("https")) setLoading(false);

        if (newArray.length > 0) {
            res = await Promise.all(newArray.map((img) => {
                return imagesApi("/upload/img", { ...imageState, file_base64: img, eventId: isNew ? id : idToUse }, "post")
            })).catch(err => notify("error", toastId, err.message))
        }

        if (state.cover_img.startsWith("data")) {
            res = await imagesApi("/upload/img", {
                ...imageState,
                file_base64: state.cover_img,
                eventId: isNew ? id : idToUse,
                type: "cover_img"
            }, "post")
        }

        if (res && isQuickSave) {
            timeout = setTimeout(() => {
                getEvent();
                notify("success", toastId);
                setLoading(false)
            }, 1000);
        }

        if (res && !isQuickSave) navigateWithNotify(navigate, "/events");
    }

    const mountEffect = () => {
        if (!isNew) {
            getEvent()
            // getHashtags()
        }
        setLoading(false);
        id = params.id;
    }

    const updateEffect = () => {  //si gestiscono tutti i risultati delle chiamate e si vanno a mostrare dei popup o aggiornare i dati oltre alla navigazione
        const { response } = getResponse(getEventResult);
        if (response) {
            setLoading(false);
            setState(response);
        }

        const responsePermalink = getResponse(getEventWithPermalinkRes);
        if (responsePermalink.response) {
            id = responsePermalink.response.id
            setState(responsePermalink.response);
        }

        const save = getResponse(saveEventResult);
        if (save.response) {

            if (state.images.length === 0 && !isQuickSave) navigateWithNotify(navigate, '/events');

            setLoading(true);

            checkImages(save.response.id);
        };

        if (save.error) notify(`error`, toastId, save.error.message);

        const disableOrActive = getResponse(disableOrActiveResult);

        if (disableOrActive.response) {
            navigateWithNotify(navigate, '/events');
        }
        if (disableOrActive.error) notify('error', toastId, disableOrActive.error.message);

        const createEngEvent = getResponse(engResult);
        if (createEngEvent.response) {
            id = engResult.response.id;
            setState(engResult.response);
        }

        return () => {
            id = null;
            isImage = false;
            clearTimeout(timeout);
        };
    }

    useEffect(mountEffect, []); // recupera i dati nel casso di una put e setta a false il loader; entra una sola volta 

    useEffect(updateEffect, [
        getEventResult.response, saveEventResult.response, saveEventResult.error,
        getEventWithPermalinkRes.response, disableOrActiveResult.response,
        disableOrActiveResult.error, engResult.response
    ]);

    const handleSubmitPost = useCallback((e) => {
        e.preventDefault();

        isQuickSave = checkIsQuickSave(isQuickSave, e.target?.name);

        saveEvent(
            {
                ...state,
                create_datetime: isNew ? todayWithTime() : format(state.create_datetime, "yyyy-MM-dd'T'HH:mm"),
                cover_img: null,
                images: [],
                permalink: state.permalink === "" ? permalink(state.title) : state.permalink,
                translate_blog_permalink: isNew ? null : state.translate_blog_permalink,
                type: isNew ? "event" : null
            });

    }, [state]);

    const handleSetLanguage = (language) => {
        (!isNew && language === "eng") && createEngEvent({
            ...state,
            id: null,
            create_datetime: null,
            cover_img: null,
            images: [],
            permalink: state.permalink,
            translate_blog_permalink: state.permalink,
            type: "event",
            language: "eng",
        });

        if (!isNew && state.translate_blog_permalink !== null) getEventPermalink();
        setState((p) => ({ ...p, language }))
    }

    const handleBack = () => {
        if (getEventResult?.response !== state) {
            setGoBack(true);
            setShouldShowModal(true)
            return
        }
        navigate("/events")
    }

    const setImages = (images) => {
        setState({ ...state, images: images })
    }

    return (
        <div className={styles["container-bg"]}>
            <form>
                {/* dovrai modificare il title di DetailsHeader */}
                <DetailsHeader handleBack={handleBack} isNew={isNew} title={isNew ? "Post" : state.title} onSubmit={handleSubmitPost} />

                {loading ? <Loader isImage={isImage} /> :
                    (
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
                                            idProp={idToUse}
                                            type="cover_img"
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

                                        <MassiveImageLoader states={[state.images, setImages]} idDelete={idToUse} type="eventId" />
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
                path={"/events"}
                actions={{
                    save: () => { saveEvent({ ...state, create_datetime: isNew ? todayWithTime() : format(state.create_datetime, "yyyy-MM-dd'T'HH:mm") }) },
                    disable: () => { disableOrActiveEvent(); }
                }}
                setModal={setShouldShowModal}
                setGoBack={setGoBack}

            >
                <Message message={goBack ? "Non hai Salvato, Vuoi salvare?" : "Sicur* di Procedere?"} />
            </Modal>

            {
                saveEventResult.error !== null || (isQuickSave && saveEventResult.response) &&
                <ToastContainer />
            }
        </div>
    );
};

export default Event;