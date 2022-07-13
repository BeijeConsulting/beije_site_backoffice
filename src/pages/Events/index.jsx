import React, { useId, useState, useEffect } from 'react'

// router
import { Link, useNavigate, useLocation } from 'react-router-dom';

// hooks & components
import useService from "../../hooks/useService";
import Table from "../../components/Table";
import Loader from '../../components/Loader';
import { notify } from '../../utils/toast';

// style
import styles from "./styles.module.css";
import Select from "../../components/Select";
const initState = {
    lang: "it",
}

const Events = () => {

    const [state, setState] = useState(initState);

    const [{ response }, getEvents] =
        useService(`/communityL/${state.lang}`)

    const toastId = useId();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        getEvents();
        if (location.state !== null) {
            notify("success", toastId)
        }
    }, [state.lang])


    return (
        response ?
            <div className={styles["container"]}>
                {console.log(response)}
                <div className={styles["wrapper"]}>
                    <div className={styles["header"]}>
                        <h1>Eventi</h1>
                        <Select
                            value={state.lang}
                            label="Lingua"
                            options={[
                                { value: "it", label: "Italiano" },
                                { value: "eng", label: "Inglese" },
                            ]}
                            onChange={(lang) => {
                                console.log(lang);
                                setState((p) => ({ ...p, lang }))
                            }}
                        />
                        <Link to="new" className="primary-button">
                            + Nuovo Evento
                        </Link>
                    </div>
                    <Table
                        headers={[
                            "ID",
                            "Titolo",
                            "Descrizione"
                        ]}
                        records={response.map(
                            ({
                                id,
                                title,
                                description
                            }) => ({
                                id,
                                title,
                                description
                            })
                        )}
                        actionLabel="Modifica"
                        onAction={(record) => navigate(record.id.toString())}
                        formatDimension={300}
                    />
                </div>
            </div >
            :
            <Loader />
    )
}

export default Events