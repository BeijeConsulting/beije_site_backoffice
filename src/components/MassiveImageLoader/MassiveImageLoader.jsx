import React, { useEffect } from 'react'
import styles from './styles.module.css';
import { useId } from "react";
import MultipleImageInput from '../MultipleImageInput';

let imageInserted = []
let isBlogMassive = false
export default function MassiveImageLoader({ states, idDelete, type }) {
    const [state, setState] = states;
    const id = useId();


    useEffect(() => {
        return () => { imageInserted = [], isBlogMassive = false }
    }, [])

    const insertMutipleImages = (images) => {
        const imagesNew = [...images].filter((element) => {

            return (!imageInserted.some((imageName) => {

                return imageName === element.name
            }))
                && element.type.includes("image")
        })

        state.length > 0 ? setState([...state, ...imagesNew]) : setState([...imagesNew])
        imageInserted = [...imageInserted, ...imagesNew.map((image) => {
            return image.name
        })]
        isBlogMassive = true
    }

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
                            insertMutipleImages(e.dataTransfer.files)

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
                                insertMutipleImages(e.target.files)
                            }}
                        ></input>
                        <label className={styles["upload-btn"]} htmlFor={id}>
                            <span>{"Carica"}</span>
                        </label>
                    </div>

                </div>
                <div className={styles['images-container']}>
                    <MultipleImageInput
                        type={type}
                        isBlogMassive={isBlogMassive}
                        id={idDelete}
                        savedImage={imageInserted}
                        states={states}></MultipleImageInput>
                </div>
            </div>
        </div >
    )
}
