import React, { useRef, useState } from 'react';
import fetchApi from '../../../utils/helper';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const ImageUploader = ({ setItem, givenName, setLoading }) => {
    const token = localStorage.getItem("auth");
    // const fileInputRef = useRef(null);

    async function uploadImages(image) {
        setLoading(true);
        try {
            const newForm = new FormData();
            newForm.append("file", image);

            const response = await axios.post(`${BASE_URL}/image`, newForm, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            const res = response.data;
            // if (res.status === 200) {
            //     if (fileInputRef.current) {
            //         fileInputRef.current.value = ""; // Reset file input
            //     }
            // }
            return res?.data;
        } catch (error) {
            console.error("Image upload failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadResponse = await uploadImages(file);
        setItem((prev) => ({ ...prev, [givenName]: uploadResponse }));
    };


    return (
        <>
            <input
                type="file"
                name="file"
                accept="image/*"
                // ref={fileInputRef}
                className='border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400'
                onChange={handleChange}
            />
        </>
    );
};

export default ImageUploader;
