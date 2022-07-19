import React from 'react'
import styles from './styles.module.css';
import { useId } from "react";
import MultipleImageInput from '../MultipleImageInput';

export default function MassiveImageLoader({ onChange, states }) {
    const id = useId();
    console.log('st', states)
    return (
        <div className={styles['image-loader-container']} >
            <div className={styles["actions-container"]}>
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
            <MultipleImageInput
                states={states}></MultipleImageInput>
        </div>
    )
}
