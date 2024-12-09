import React, { useEffect, useState } from 'react'
import fetchApi from '../../../utils/helper';
import { AiOutlineLoading } from 'react-icons/ai';
import Modal from 'react-modal';
import ImageUploader from '../../shared/image-uploader';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import { IoCloseCircleOutline } from 'react-icons/io5';
import deleteImage from '../../../utils/deleteImage';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const AboutUs = () => {
    const [aboutUsData, setAboutUsData] = useState({
        aboutUs_imageUrl: {
            public_id: "",
            image_url: ""
        }
    })
    const [loadingMainData, setLoadingMainData] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [newData, setNewData] = useState({
        aboutUs_title: "",
        aboutUs_description: "",
        aboutUs_imageUrl: {
            public_id: "",
            image_url: ""
        }
    })

    useEffect(() => {
        fetchData();
    }, [])


    const fetchData = async () => {
        setLoadingMainData(true)
        try {
            const response = await fetchApi({
                url: `${BASE_URL}/aboutUs`,
                method: "GET",
            });
            setAboutUsData(response.data[0]);
            console.log(response.data[0]);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingMainData(false);
        }
    }


    const openModal = () => {
        setNewData(aboutUsData);
        setIsOpen(true);
    }

    const handleChangeAboutUs = async (e) => {
        e.preventDefault();
        const payload = {
            ...newData,
            aboutUs_imageUrl: {
                public_id: newData.aboutUs_imageUrl.public_id,
                image_url: newData.aboutUs_imageUrl.secure_url || newData.aboutUs_imageUrl.image_url
            }
        }
        setLoading(true);
        try {
            const response = await fetchApi({ url: `${BASE_URL}/aboutUs`, isAuthRequired: true, method: "PUT", data: payload });

            if (response.status === 200) {
                // toast.success("About Added Successfully");
                fetchData();
            }
        } catch (error) {
            toast.error("error to update");
        } finally {
            setIsOpen(false);
            setLoading(false);
        }
    }

    return (
        <>
            <div className="text-right">
                <button
                    className="mb-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={openModal}
                >
                    Change About Us
                </button>
            </div>


            <div className="p-6 bg-gray-100">
                {loadingMainData ? (
                    <>
                        <div>
                            <div className="h-8 bg-gray-200 w-1/4 mb-4 rounded animate-pulse"></div>
                            <div className="w-full block lg:hidden items-center gap-10 bg-gray-50 p-6 rounded-lg shadow-lg">
                                {/* Image Skeleton */}
                                <div className="w-1/2 text-center mx-auto">
                                    <div className="w-full h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                                </div>
                                {/* Text Skeleton */}
                                <div className="mt-4 space-y-4">
                                    <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
                                    <div className="h-6 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="w-full hidden lg:flex items-center gap-10 bg-gray-50 p-6 rounded-lg shadow-lg">
                                {/* Text Skeleton */}
                                <div className="w-2/3 space-y-4">
                                    <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
                                    <div className="h-6 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                    <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                </div>

                                {/* Image Skeleton */}
                                <div className="w-1/3 h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold py-3">{aboutUsData.aboutUs_title}</h2>
                        <div className="w-full hidden lg:flex items-center gap-10 bg-gray-50 p-6 rounded-lg shadow-lg">
                            {/* Text Section */}
                            <div className="w-2/3">
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    {/* <div
                                        dangerouslySetInnerHTML={aboutUsData.aboutUs_description}
                                    /> */}
                                    {/* {aboutUsData.aboutUs_description} */}
                                    <div
                                        className="text-lg text-gray-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: aboutUsData.aboutUs_description }}
                                    />
                                </p>
                            </div>

                            {/* Image Section */}
                            <div className="w-1/3">
                                <img
                                    src={aboutUsData.aboutUs_imageUrl.image_url}
                                    alt="About Us"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="w-full block lg:hidden items-center gap-10 bg-gray-50 p-6 rounded-lg shadow-lg">
                            {/* <!-- Image Section --> */}
                            <div className="w-1/2 text-center mx-auto">
                                <img
                                    src={aboutUsData.aboutUs_imageUrl.image_url}
                                    alt="About Us"
                                    className="w-full object-cover rounded-lg"
                                />
                            </div>
                            {/* <!-- Text Section --> */}
                            <div className="">
                                <div
                                    className="text-lg text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: aboutUsData.aboutUs_description }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>


            <Modal
                isOpen={isOpen}
                ariaHideApp={false}
                // onRequestClose={() => setIsOpen(false)}
                className="animate-[modalDialogAnimation_0.2s_ease-in-out] [animation-fill-mode:forwards] bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] mx-auto my-20 p-8 "
                overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-scroll z-50"
            >
                <div className="bg-white rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Change About Us</h2>
                    <form onSubmit={handleChangeAboutUs}>
                        <input
                            type="text"
                            placeholder="Name"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newData.aboutUs_title}
                            onChange={(e) => setNewData({ ...newData, aboutUs_title: e.target.value })}
                        />
                        <ReactQuill
                            theme="snow"
                            onChange={(value) => {
                                setNewData((pre) => ({
                                    ...pre,
                                    aboutUs_description: value,
                                }));
                            }}
                            className="border border-gray-300 overflow-hidden rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 "
                            value={newData.aboutUs_description}
                        />
                        <ImageUploader setItem={setNewData} givenName={"aboutUs_imageUrl"} setLoading={setLoading} />
                        {newData.aboutUs_imageUrl && (newData.aboutUs_imageUrl.image_url || newData.aboutUs_imageUrl.secure_url) &&
                            <div className='flex items-center relative w-40 mb-3'>
                                <img
                                    className=''
                                    src={newData.aboutUs_imageUrl.image_url || newData.aboutUs_imageUrl.secure_url}
                                    onError={(e) => {
                                        e.target.src = 'assets/images/placeholder.png';
                                    }}
                                />
                                <IoCloseCircleOutline
                                    onClick={async () => {
                                        const response = await deleteImage({ data: { public_id: [newData.aboutUs_imageUrl.public_id] } });
                                        // console.log(response)
                                        if (response.status === 200) {
                                            setNewData(pre => ({ ...pre, aboutUs_imageUrl: {} }))
                                        }
                                    }}
                                    className='absolute top-0 right-0 text-2xl cursor-pointer' />
                            </div>}
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
                                ) : "Change About Us"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default AboutUs