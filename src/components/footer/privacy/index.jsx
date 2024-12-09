import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import fetchApi from '../../../utils/helper';
import { AiOutlineLoading } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { FaEye } from 'react-icons/fa6';
import { IoCloseCircleOutline } from 'react-icons/io5';
import ReactQuill from 'react-quill';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const Privacy = () => {
    const [privacyData, setPrivacyData] = useState([])
    const [isloadingMainData, setIsLoadingMainData] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPrivacy, setNewPrivacy] = useState({})
    const [loading, setLoading] = useState(false);
    const [allData, setAllData] = useState({})
    const [viewConf, setViewConf] = useState(false)
    const [viewData, setViewData] = useState({})

    useEffect(() => {
        fetchBrandData();
    }, [])

    const openModal = () => {
        setNewPrivacy({ privacy_title: allData[0] && allData[0].privacy_title, privacy_description: privacyData })
        setIsModalOpen(true);
    }

    const fetchBrandData = async () => {
        setIsLoadingMainData(true)
        try {
            const response = await fetchApi({
                url: `${BASE_URL}/privacy`,
                method: "GET",
            });
            setPrivacyData(response.data[0].privacy_description);
            setAllData(response.data)
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingMainData(false);
        }
    }

    const handleAddPrivacy = async (e) => {
        e.preventDefault();
        // if (newBrand.brand_name.trim() === "" || newBrand.brand_description.trim() === "" || newBrand.brand_imageUrl.length === 0) {
        //     alert("Please enter all details");
        //     return;
        // }
        setLoading(true);
        try {
            const response = await fetchApi({ url: `${BASE_URL}/privacy`, isAuthRequired: true, method: "PUT", data: newPrivacy });

            if (response.status === 200) {
                toast.success("Privacy Added Successfully");
                // setNewBrand({ brand_name: "", brand_description: "", brand_imageUrl: "" });
                fetchBrandData();
                // setContent("");
            }
        } catch (error) {
            toast.error("error to update");
        } finally {
            setIsModalOpen(false);
            setLoading(false);
            // setEditId("");
        }
    }

    return (
        <>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">
                        {isloadingMainData ? (
                            <div className="animated-pulse">
                                <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
                            </div>
                        ) : (allData[0] && allData[0].privacy_title)}
                    </h2>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={openModal}
                    >
                        Change Privacy
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-5 border border-gray-400 text-left text-sm font-semibold">Sr No.</th>
                                <th className="py-3 px-5 border border-gray-400 text-left text-sm font-semibold">Privacy Title</th>
                                <th className="py-3 px-5 border border-gray-400 text-left text-sm font-semibold">Privacy Description</th>
                                {/* <th className="py-3 px-5 border border-gray-400 text-center text-sm font-semibold">Image</th> */}
                                <th className="py-3 px-5 border border-gray-400 text-center text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isloadingMainData ? (
                                // Skeleton Loader
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse bg-white">
                                        <td className="py-3 px-5 border border-gray-300 text-center">
                                            <div className="h-4 bg-gray-300 rounded w-8 mx-auto"></div>
                                        </td>
                                        <td className="py-3 px-5 border border-gray-300">
                                            <div className="h-4 bg-gray-300 rounded w-32"></div>
                                        </td>
                                        <td className="py-3 px-5 border border-gray-300 max-w-[250px]">
                                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                                        </td>
                                        <td className="py-3 px-5 border border-gray-300 text-center">
                                            <div className="flex gap-3 justify-center">
                                                <div className="h-4 bg-gray-300 rounded w-12"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : privacyData.length > 0 ? (
                                privacyData.map((privacy, index) => (
                                    <tr className="bg-white hover:bg-gray-50 transition duration-200" key={index}>
                                        <td className="py-3 px-5 border border-gray-300 text-center text-sm">{index + 1}</td>
                                        <td className="py-3 px-5 border border-gray-300 text-sm font-medium">
                                            {privacy.title}
                                        </td>
                                        <td className="py-3 px-5 border border-gray-300 text-sm">
                                            {privacy.desc && <div
                                                dangerouslySetInnerHTML={{
                                                    __html: privacy.desc.length > 50
                                                        ? `${privacy?.desc.slice(0, 50)}...`
                                                        : privacy?.desc,
                                                }}
                                            />}
                                            {/* {privacy.desc} */}
                                        </td>
                                        <td className="py-3 px-5 border border-gray-300 text-center">
                                            <div className="flex gap-3 justify-center">
                                                <button
                                                    className="text-green-600 hover:text-green-800 text-xl"
                                                    onClick={() => {
                                                        setViewData(privacy)
                                                        setViewConf(true);
                                                    }}
                                                >
                                                    <FaEye />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="py-4 text-center text-gray-600 bg-gray-50"
                                    >
                                        No Privacy Policy available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


            </div>

            {/* Add brand Modal */}
            <Modal
                isOpen={isModalOpen}
                ariaHideApp={false}
                // onRequestClose={() => setIsModalOpen(false)}
                className="animate-[modalDialogAnimation_0.2s_ease-in-out] [animation-fill-mode:forwards] bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] mx-auto my-20 p-8 "
                overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-scroll z-50"
            >
                <div className="bg-white rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Change Privacy</h2>
                    <form onSubmit={handleAddPrivacy}>
                        <input
                            type="text"
                            placeholder="Name"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newPrivacy.privacy_title}
                            onChange={(e) => setNewPrivacy({ ...newPrivacy, privacy_title: e.target.value })}
                        />
                        <button
                            type='button'
                            onClick={() => {
                                // console.log(newPrivacy.privacy_description[-1])
                                // if(newPrivacy.privacy_description[-1] && newPrivacy.privacy_description[-1].title !== "" && newPrivacy.privacy_description[-1].desc !== ""){
                                setNewPrivacy({ ...newPrivacy, privacy_description: [...newPrivacy.privacy_description, { title: "", desc: "" }] })
                                // }
                            }}
                            className='bg-blue-600 hover:bg-blue-800 text-white py-1 px-3 rounded-lg text-md mb-3'>Add Privacy</button>
                        {newPrivacy.privacy_description && newPrivacy.privacy_description.map((e, i) => (
                            <div key={i}>
                                <div className='flex justify-between'>
                                    <p className='text-blue-700 my-2'>Privacy - {i + 1}</p>
                                    <button
                                        onClick={() => setNewPrivacy({ ...newPrivacy, privacy_description: newPrivacy.privacy_description.filter((ele, index) => index !== i && ele) })}
                                        className='text-red-500 hover:text-red-600 hover:font-bold'
                                        type="button">
                                        delete
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={newPrivacy.privacy_description[i].title}
                                    onChange={(e) => setNewPrivacy({ ...newPrivacy, privacy_description: newPrivacy.privacy_description.map((ele, index) => index === i ? { ...ele, title: e.target.value } : ele) })}
                                />
                                <textarea
                                    placeholder="Description"
                                    className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={newPrivacy.privacy_description[i].desc}
                                    onChange={(e) => setNewPrivacy({ ...newPrivacy, privacy_description: newPrivacy.privacy_description.map((ele, index) => index === i ? { ...ele, desc: e.target.value } : ele) })}
                                />
                                {/* <ReactQuill
                                    theme="snow"
                                    onChange={(value) => {
                                        setNewPrivacy((prevbrand) => ({
                                            ...prevbrand,
                                            desc: value,
                                        }));
                                    }}
                                    className="border border-gray-300 overflow-hidden rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 "
                                    value={newPrivacy.privacy_description[i].desc}
                                /> */}
                            </div>
                        ))}
                        <div className='flex justify-between'>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-lg mr-2"
                                onClick={() => {
                                    setIsModalOpen(false)
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
                                ) : "Change Privacy"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>


            <Modal
                isOpen={viewConf}
                ariaHideApp={false}
                // onRequestClose={() => setViewConf(false)}
                className="animate-[modalDialogAnimation_0.2s_ease-in-out] [animation-fill-mode:forwards] bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] mx-auto my-20 p-4"
                overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-scroll z-50"
            >
                <div className="relative w-full h-full">
                    <div onClick={() => setViewConf(false)} className='absolute top-0 right-0 text-4xl cursor-pointer text-black duration-300 hover:text-white hover:bg-black rounded-full'>
                        <IoCloseCircleOutline />
                    </div>
                </div>
                <div className="bg-white p-2">
                    <h2 className="text-2xl font-bold mb-4 text-center">Privacy Details</h2>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">Privacy Title</h3>
                        <p className="text-gray-700">{viewData.title}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">Privacy Content</h3>
                        <div className="py-2 px-4 border ">
                            <div dangerouslySetInnerHTML={{ __html: (viewData.desc) }} />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Privacy;