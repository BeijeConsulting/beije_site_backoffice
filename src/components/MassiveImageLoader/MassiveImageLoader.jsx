import React from 'react'
import styles from './styles.module.css';
import { useId } from "react";
import MultipleImageInput from '../MultipleImageInput';

export default function MassiveImageLoader({ onChange, states, savedImage }) {
    const id = useId();
    console.log('st', states)
    return (
        <div className={styles['image-loader-container']} >
            <div className={styles["actions-container"]}>
                <div>
                    <div
                        style={{ maxWidth: "400px" }}
                        className={styles["container"]}
                        onDragOver={(e) => {
                            console.log('dragOver')
                            e.preventDefault();
                            e.dataTransfer.effectAllowed = "copy";
                            e.target.classList.add(styles["dragging"]);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.target.classList.remove(styles["dragging"]);
                        }}
                        onDrop={(e) => {
                            console.log('drop', e)
                            e.target.classList.remove(styles["dragging"]);
                            e.preventDefault();
                            onChange(e.dataTransfer.files)

                        }}
                    >
                        <p className={styles["info-text"]}>
                            Carica un'immagine con il pulsante qui sotto o trascinandola nell'area
                            tratteggiata.
                        </p>
                        <input
                            className="hidden"
                            id={id}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                e.preventDefault();
                                onChange(e.target.files)
                            }}
                        ></input>
                        <label className={styles["upload-btn"]} htmlFor={id}>
                            <span>{"Carica"}</span>
                        </label>
                    </div>

                </div>
                <div className={styles['images-container']}>
                    <MultipleImageInput
                        savedImage={savedImage}
                        states={states}></MultipleImageInput>
                </div>
            </div>
        </div >
    )
}
