import React, { useEffect, useState } from 'react'
import fetchApi from '../../../utils/helper';
import Modal from "react-modal"
import { AiOutlineLoading } from 'react-icons/ai';
import ImageUploader from '../../shared/image-uploader';
import axios from 'axios';
import { IoCloseCircleOutline } from 'react-icons/io5';
import deleteImage from '../../../utils/deleteImage';
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const FollowUs = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [followUsData, setFollowUsData] = useState([])
    const [loadingMainData, setLoadingMainData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newData, setNewData] = useState([])

    useEffect(() => {
        fetchData();
    }, [])


    const fetchData = async () => {
        setLoadingMainData(true);
        try {
            const response = await fetchApi({
                url: `${BASE_URL}/follow`,
                method: "GET",
            });
            setFollowUsData(response.data[0].follow_details);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingMainData(false);
        }
    }

    const openModal = () => {
        setNewData(followUsData)
        setIsOpen(true);
    }

    const handleChangeFollowUs = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetchApi({ url: `${BASE_URL}/follow`, isAuthRequired: true, method: "PUT", data: { follow_details: newData } });

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
            return res?.data;
        } catch (error) {
            console.error("Image upload failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleChange = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadResponse = await uploadImages(file);
        const imageChange = { public_id: uploadResponse.public_id, image_url: uploadResponse.secure_url }
        setNewData(pre => pre.map((p, i) => i === index ? { ...p, image: imageChange } : p))
    };

    console.log(followUsData, newData)

    return (
        <>
            <div className="text-right">
                <button
                    className="mb-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={openModal}
                >
                    Change Follow Us
                </button>
            </div>

            <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Follow Us
                </h2>
                <div className="flex flex-wrap gap-6">
                    {followUsData.map((item) => (
                        <a
                            key={item._id}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center space-y-2 hover:scale-105 transform transition duration-200"
                        >
                            {/* Social Media Icon */}
                            <img
                                src={item.image.image_url}
                                alt={item.image.public_id}
                                className="w-16 h-16 object-cover rounded-full shadow-md"
                            />
                            {/* Platform Name or Description */}
                            {/* <p className="text-sm font-medium text-gray-600">{item.link}</p> */}
                        </a>
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
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Change Follow Us</h2>
                        <button className="text-blue-500 hover:text-blue-600 hover:font-semibold duration-300" onClick={() => setNewData(pre => [...pre, {}])}>Add new follow us</button>
                    </div>
                    <form onSubmit={handleChangeFollowUs}>
                        <div className="mb-4">
                            {newData.map((ele, index) => (
                                <div key={index}>
                                    <div className="flex justify-between">
                                        <p className="py-3">Follow - {index + 1}</p>
                                        <button onClick={() => setNewData(pre => pre.filter((e, i) => i !== index && e))} className="text-red-500 hover:text-red-600 hover:font-semibold duration-300">remove</button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={ele.link}
                                        onChange={(e) => {
                                            setNewData(pre => pre.map((p, i) => i === index ? { ...p, link: e.target.value } : p))
                                            // console.log(newData)
                                        }}
                                    />
                                    <input
                                        type="file"
                                        name="file"
                                        accept="image/*"
                                        // ref={fileInputRef}
                                        className='border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400'
                                        onChange={(e) => handleChange(e, index)}
                                    />

                                    {ele.image && ele.image.image_url && <div className='flex items-center relative w-40'>
                                        <img
                                            className=''
                                            src={ele.image.image_url}
                                            onError={(e) => {
                                                e.target.src = 'assets/images/placeholder.png';
                                            }}
                                        />
                                        <IoCloseCircleOutline
                                            onClick={async () => {
                                                const response = await deleteImage({ data: { public_id: [ele.image.public_id] } });
                                                // console.log(response)
                                                if (response.status === 200) {
                                                    setNewData(pre => pre.map((e, i) => i === index ? { ...e, image: {} } : e))
                                                }
                                            }}
                                            className='absolute top-0 right-0 text-2xl cursor-pointer' />
                                    </div>}
                                    {/* <ImageUploader /> */}
                                </div>
                            ))}
                        </div>
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
                                ) : "Change Follow Us"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default FollowUs