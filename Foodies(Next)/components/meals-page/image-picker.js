'use client';

import { useRef, useState } from 'react';
import styles from './image-picker.module.css';

import Image from 'next/image';

export default function ImagePicker({label}){
    const imageInput = useRef();
    const [pickedImage, setPickedImage] = useState();

    const handleClick = () => {
        imageInput.current.click()
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        
        if(!file){
            setPickedImage(null)
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPickedImage(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }

    return (
        <div className={styles.picker}>
            <label htmlFor='image'>{label}</label>
            <div className={styles.controls}>
                <div className={styles.preview}>
                    {!pickedImage && <p>No image picked</p>}
                    {pickedImage && <Image src={pickedImage} alt='Picked image' fill/>}
                </div>
                <input 
                    className={styles.input}
                    type='file'
                    id='image' 
                    name='image'
                    accept='image/png, image/jpeg'
                    ref={imageInput}
                    onChange={handleImageChange}
                />
                <button 
                    className={styles.button} 
                    type='button'
                    onClick={handleClick}
                >
                    Pick an image
                </button>
            </div>
        </div>
    )
}