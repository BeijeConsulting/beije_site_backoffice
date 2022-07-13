
//react
import { useState, useEffect, useId } from "react";

//router_navigation
import { Link, useNavigate, useParams } from "react-router-dom";

//api
import useService from "../../hooks/useService";

//utils
import { notify, ToastContainer } from "../../utils/toast";

//components
import GoBackArrow from '../../components/GoBackArrow/GoBackArrow'
import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import MDEditor from "../../components/MDEditor";

// styles
import styles from "./styles.module.css";
import Select from "../../components/Select";
import { permalink } from "../../utils/utils";

const emptyState = {
    description: "",
    language: "it",
    permalink: "",
    title: "",
    translate_community_permalink: null,
    videoPath: null,
    cover_img_id: "",
    disable_date: null

}

let id = null;
const Event = ({ isNew }) => {

    const navigate = useNavigate();
    const params = useParams();
    const toastId = useId();

    const [state, setState] = useState(emptyState);

    const [getCommunityResult, getCommunity] = useService(`/community/${id ? id : params.id}`);

    const [saveCommunityResult, saveCommunity] = useService(isNew ? "/community" : `/community/${id}`, {
        method: isNew ? "post" : "put",
    });


    useEffect(() => {
        if (!isNew) getCommunity()
        id = params.id;
    }, []);

    useEffect(() => {
        const { response } = getCommunityResult ?? { response: null };
        if (response) {
            setState(response);
        }
        const save = getCommunityResult ?? { response: null };
        /*  if (save.response) {
             navigate('/events', {
                 state: {
                     toast: true
                 }
             })
         } */
        if (save.error) notify('error', toastId);

        return () => id = null;
    }, [getCommunityResult]
    )

    const handleSbmitCommunity = (e) => {
        e.preventDefault();
        saveCommunity({
            ...state
        })
    }

    const handleSetLanguage = (language) => {
        !isNew && getCommunityPermalink();
        setState((p) => ({ ...p, language }))
    }

    const handleBack = () => {

    }
    return (
        <div className={styles["container"]}>
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
                    <button type="submit" className="primary-button">
                        Salva
                    </button>
                </div>
                {(isNew || getCommunityResult.response) && (
                    <>
                        <div className={styles["images"]}>
                            {/* SingleImageInput */}
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
                saveCommunityResult?.error && <ToastContainer />
            }
        </div>
    )
}


export default Event