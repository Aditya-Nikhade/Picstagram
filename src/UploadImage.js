import React, { useState } from 'react'
import db, {  storage } from './firebase'
import { ref, uploadBytesResumable,  getDownloadURL } from "firebase/storage";
import { Firestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import "./uploadimage.css"

export default function UploadImage({handledUpload,username}) {


    const [caption, setCaption] = useState("")
    const [url, setURL] = useState("")
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)

    const funct = ()=>{
        handledUpload()
    }

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    const chooseFile = ()=>{
        let a = document.getElementById("file_upload");
        a.click();
    }
    const handleUpload = () => {

        if(image){
        const storageRef = ref(storage, `images/${image?.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion

        uploadTask.on(
            "state_changed", (snapshot) => {
                const progression = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progression);
            }, (error) => {
                // Handle the error here
                alert("Error uploading file:", error);
            }, () => {
            
                getDownloadURL(storageRef).then((url)=>{
                    addDoc(collection(db,"Posts"),{
                        timestamp: serverTimestamp(Firestore.FieldValue),
                        caption: caption,
                        imageURL: url,
                        username: username,
                        likes: 0
                    })
                })
                setProgress(0);
                setCaption("");
                setImage(null)
            }
        );}
    };
    
    return (
        <div className='upload_container'>
            <div className='upload_image'>
                <progress className='upload_progress' value={progress} max="100"/>
                <input type='text' id='caption' placeholder='caption...' value={caption} onChange={(e) => setCaption(e.target.value)} />
                <input type='file' id='file_upload' onChange={handleChange} hidden />
                <div className='buttons'>
                    <button className='upload_button_container' onClick={chooseFile}>Choose</button>
                    <button className="upload_button_container" onClick={handleUpload}>Upload</button>
                    <button className='upload_button_container' onClick={funct}>Cancel</button>
                </div>
            </div>
        </div>
        
    )
};