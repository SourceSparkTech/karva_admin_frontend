import React, { useEffect, useRef, useState } from "react";
import fetchApi from "../../../utils/helper";
import Modal from "react-modal";
import { AiOutlineLoading } from "react-icons/ai";
import deleteImage from "../../../utils/deleteImage";
import { IoCloseCircleOutline } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const Gallery = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageData, setImageData] = useState([]);
    const [loadingMainData, setLoadingMainData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newData, setNewData] = useState([])
    const mainProductInput = useRef();

    useEffect(() => {
        fetchData();
    }, [])


    const fetchData = async () => {
        setLoadingMainData(true);
        try {
            const response = await fetchApi({
                url: `${BASE_URL}/gallery`,
                method: "GET",
            });
            setImageData(response.data[0].gallery_imageUrl);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingMainData(false);
        }
    }

    const openModal = () => {
        setNewData(imageData);
        setIsOpen(true);
    }

    const handleChangeGallery = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payloadData = {
            gallery_imageUrl: newData
        }

        try {
            const response = await fetchApi({ url: `${BASE_URL}/gallery`, isAuthRequired: true, method: "PUT", data: payloadData });
            if (response.status === 200) {
                toast.success("Privacy Added Successfully");
                fetchData();
            }
        } catch (error) {
            toast.error("error to update");
        } finally {
            setIsOpen(false);
            setLoading(false);
        }
    }


    const token = localStorage.getItem("auth");

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
        setNewData((prev) => ([...prev, { image_url: uploadResponse.secure_url, public_id: uploadResponse.public_id }]));
    };

    return (
        <>
            <div className="text-right">
                <button
                    className="mb-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={openModal}
                >
                    Change Gallery
                </button>
            </div>
            <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Image Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loadingMainData
                        ? // Skeleton Loader
                        Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="p-4 border rounded-md shadow-sm bg-gray-50 animate-pulse"
                            >
                                {/* Skeleton Image */}
                                <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                            </div>
                        ))
                        : // Actual Image Data
                        imageData.map((image) => (
                            <div
                                key={image.public_id}
                                className="p-4 border rounded-md shadow-sm bg-gray-50"
                            >
                                {/* Image */}
                                <img
                                    src={image.image_url}
                                    alt={image.public_id}
                                    className="w-full h-48 object-contain rounded-md mb-4"
                                />
                            </div>
                        ))}
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                ariaHideApp={false}
                // onRequestClose={() => setIsOpen(false)}
                className="animate-[modalDialogAnimation_0.2s_ease-in-out] [animation-fill-mode:forwards] bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] mx-auto my-20 p-8 "
                overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-scroll z-50"
            >
                <div className="bg-white rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Change Gallery</h2>
                    <form onSubmit={handleChangeGallery}>
                        <div className="mb-4">
                            <input type='file' className='hidden' ref={mainProductInput} onChange={handleChange} />
                            {/* <label className="block text-gray-700">Add Image</label> */}
                            <div className="mb-4 flex justify-between">
                                <button
                                    disabled={newData.length > 10}
                                    onClick={() => mainProductInput.current.click()}
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mb-3"
                                >
                                    Add Image
                                </button>
                                {
                                    newData.length > 0 &&
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const response = await deleteImage({ data: { public_id: [newData.map(e => e.public_id)] } });
                                            // console.log(response)
                                            if (response.status === 200) {
                                                setNewData([])
                                                // setNewBlog({ ...newBlog, blog_image: "" })
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-600 font-semibold"
                                    >
                                        delete all image
                                    </button>
                                }
                            </div>
                            <div className="">
                                {newData.length > 0 &&
                                    <div className='flex items-center w-full gap-2'>
                                        {newData.map((e, i) => (
                                            <div key={i} className='relative w-1/2 md:w-1/4 border border-black p-2'>
                                                <img className='w-full' src={e.image_url} />
                                                <IoCloseCircleOutline
                                                    onClick={async () => {
                                                        const response = await deleteImage({ data: { public_id: [e.public_id] } });
                                                        // console.log(response)
                                                        if (response.status === 200) {
                                                            setNewData((pre) => pre.filter(ele => ele.public_id !== e.public_id))
                                                            // setNewBlog({ ...newBlog, blog_image: "" })
                                                        }
                                                    }}
                                                    className='absolute top-1 right-1 text-2xl cursor-pointer' />
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                        {/* <input
                            type="text"
                            placeholder="Name"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newData.name}
                            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                        /> */}
                        <div className='flex justify-between'>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-lg mr-2"
                                onClick={() => {
                                    setIsOpen(false)
                                }}
                                type='button'
                            >
                                Close
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-6 rounded-lg text-md"
                                type='submit'
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className='animate-spin'>
                                        <AiOutlineLoading />
                                    </div>
                                ) : "Change Gallery"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default Gallery;
