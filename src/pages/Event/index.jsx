
//react
import { useState, useEffect, useId } from "react";

//router_navigation
import { useNavigate, useParams } from "react-router-dom";

//api
import useService from "../../hooks/useService";

//utils
import { notify, ToastContainer } from "../../utils/toast";

//components
import GoBackArrow from '../../components/GoBackArrow/GoBackArrow'
import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import MDEditor from "../../components/MDEditor";
import Modal from "../../components/Modal/Modal";
import Message from "../../components/Message";
import SingleImageInput from "../../components/SingleImageInput";
import Permalink from "../../components/Permalink";

// styles
import styles from "./styles.module.css";
import Select from "../../components/Select";


const emptyState = {
    description: "",
    language: "",
    permalink: "",
    title: "",
    translate_community_permalink: "",
    videoPath: "",
    cover_img_id: "",
    disable_date: null

}
let id = null;
const Event = ({ isNew }) => {

    const navigate = useNavigate();
    const params = useParams();
    const toastId = useId();

    const idToUse = id ? id : params.id;

    const [state, setState] = useState(emptyState);
    const [shouldShowModal, setShouldShowModal] = useState(false);

    const [goBack, setGoBack] = useState(false)

    const [getCommunityResult, getCommunity] = useService(`/community/${idToUse}`);

    const [saveCommunityResult, saveCommunity] = useService(isNew ? "/community" : `/community/update/${idToUse}`, {
        method: isNew ? "post" : "put",
    });

    const [getCommuniytPermalinkResult, getCommuniyPermalink] = useService(`/community_permalink/${state.translate_community_permalink}`)

    useEffect(() => {
        if (!isNew) getCommunity()
        id = params.id;
    }, []);

    useEffect(() => {
        const { response } = getCommunityResult ?? { response: null };
        if (response) {
            console.log('state', response)
            setState(response);
        }

        const responsePermalink = getCommuniytPermalinkResult ?? { response: null };
        if (responsePermalink.response) {
            console.log('permalink', responsePermalink.response)
            id = responsePermalink.response.id
            setState(responsePermalink.response)
        }

        const save = saveCommunityResult ?? { response: null };
        if (save.response) {
            navigate('/events', {
                state: {
                    toast: true
                }
            })
        }
        if (save.error) notify('error', toastId);




        return () => (id = null);
    }, [getCommunityResult?.response, saveCommunityResult?.response, saveCommunityResult?.error, getCommuniytPermalinkResult.response]);


    const handleSbmitCommunity = (e) => {
        console.log('submit')
        e.preventDefault();
        saveCommunity({
            ...state, translate_community_permalink: isNew ? null : state.translate_community_permalink
        })
    }

    const handleSetLanguage = (language) => {
        !isNew && getCommuniyPermalink();
        setState((p) => ({ ...p, language }))
    }

    const handleBack = () => {

        if (getCommunityResult?.response !== state) {
            setGoBack(true);
            setShouldShowModal(true)
            return
        }
        navigate("/events")
    }
    return (
        <div className={styles["container"]}>
            {console.log(state, id)}
            <form
                onSubmit={handleSbmitCommunity}
            >
                <div className={styles["title-row"]}>
                    <GoBackArrow
                        handleBack={handleBack} />
                    <h2>
                        {isNew
                            ? "Nuovo evento"
                            : getCommunityResult.response
                                ? `Modifica ${state.title}`
                                : ""}
                    </h2>
                    <button type="submit" className="success-button">
                        Salva Modifiche
                    </button>
                </div>
                {(isNew || getCommunityResult.response) && (
                    <>
                        <div className={styles["inputs-container"]}>
                            <div className={styles["images"]}>
                                <SingleImageInput
                                    aspectRatio="1"
                                    style={{ maxWidth: "400px" }}
                                    label="Immagine profilo"
                                    value={state.cover_img_id}
                                    onChange={(cover_img_id) => {
                                        setState((p) => ({ ...p, cover_img_id }));
                                    }}
                                />
                            </div>

                            <div className={styles["text-row"]}>
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
                                    <Select
                                        value={state.language}
                                        label="Lingua"
                                        options={[
                                            { value: "it", label: "italiano" },
                                            { value: "eng", label: "Inglese" },
                                        ]}
                                        onChange={handleSetLanguage}
                                    />
                                    <Permalink state={state} setState={setState} title="title" />
                                </div>
                            </div>
                            <div className={styles["inputs-row"]}>
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
            <Modal
                shouldShow={shouldShowModal}
                goBack={goBack}
                path={"/events"}
                actions={{
                    save: () => { saveCommunity({ ...state, cover_img_id: null }) },
                    disable: () => { return }
                }}
                setModal={setShouldShowModal}
                setGoBack={setGoBack}

            >
                <Message message={goBack ? "Non hai Salvato, Vuoi salvare?" : "Sicur* di Procedere?"} />
            </Modal>
            {
                saveCommunityResult?.error && <ToastContainer />
            }
        </div>
    )
}


export default Event