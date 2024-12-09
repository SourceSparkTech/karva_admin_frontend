import React, { useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import Modal from 'react-modal';
import fetchApi from '../../../utils/helper';
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const Address = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingMainData, setLoadingMainData] = useState(false);
    const [newData, setNewData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        whatsapp: "",
    })

    useEffect(() => {
        fetchData();
    }, [])


    const fetchData = async () => {
        setLoadingMainData(true);
        try {
            const response = await fetchApi({
                url: `${BASE_URL}/shop-address`,
                method: "GET",
            });
            setData(response.data[0])
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingMainData(false);
        }
    }

    const openModal = () => {
        setNewData(data);
        setIsOpen(true);
    }

    const handleChangeAddress = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetchApi({ url: `${BASE_URL}/shop-address`, isAuthRequired: true, method: "PUT", data: newData });

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

    return (
        <>
            <div className="text-right">
                <button
                    className="mb-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={openModal}
                >
                    Change Address
                </button>
            </div>

            <div className="mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
                {loadingMainData ? (
                    // Skeleton Loader
                    <div className="animate-pulse space-y-6">
                        {/* Title Skeleton */}
                        <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto"></div>

                        <div className="space-y-4">
                            {/* Skeleton for Email */}
                            <div className="flex items-center space-x-4">
                                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                                <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
                            </div>

                            {/* Skeleton for Phone */}
                            <div className="flex items-center space-x-4">
                                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                                <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
                            </div>

                            {/* Skeleton for Address */}
                            <div className="flex items-center space-x-4">
                                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                            </div>

                            {/* Skeleton for WhatsApp */}
                            <div className="flex items-center space-x-4">
                                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                                <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Main Content
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 text-center">{data.name}</h2>
                        <div className="space-y-4">
                            {/* Email */}
                            <div className="flex items-center space-x-4">
                                <FaEnvelope className="text-blue-600 text-xl" />
                                <p className="text-gray-700 text-sm md:text-base">
                                    <a
                                        href={`mailto:${data.email}`}
                                        className="hover:text-blue-500 underline"
                                    >
                                        {data.email}
                                    </a>
                                </p>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center space-x-4">
                                <FaPhoneAlt className="text-green-600 text-xl" />
                                <p className="text-gray-700 text-sm md:text-base">
                                    <a
                                        href={`tel:${data.phone}`}
                                        className="hover:text-green-500 underline"
                                    >
                                        {data.phone}
                                    </a>
                                </p>
                            </div>

                            {/* Address */}
                            <div className="flex items-center space-x-4">
                                <FaMapMarkerAlt className="text-red-600 text-xl" />
                                <p className="text-gray-700 text-sm md:text-base">{data.address}</p>
                            </div>

                            {/* WhatsApp */}
                            <div className="flex items-center space-x-4">
                                <FaWhatsapp className="text-green-500 text-xl" />
                                <p className="text-gray-700 text-sm md:text-base">
                                    <a
                                        href={`https://wa.me/${data.whatsapp}`}
                                        className="hover:text-green-600 underline"
                                    >
                                        {data.whatsapp}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </>
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Change Address</h2>
                    <form onSubmit={handleChangeAddress}>
                        <input
                            type="text"
                            placeholder="Name"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newData.name}
                            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newData.email}
                            onChange={(e) => setNewData({ ...newData, email: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Mobile number"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newData.phone}
                            onChange={(e) => setNewData({ ...newData, phone: e.target.value })}
                        />
                        <textarea
                            placeholder="Enter Address"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newData.address}
                            onChange={(e) => setNewData({ ...newData, address: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Whatsapp number"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newData.whatsapp}
                            onChange={(e) => setNewData({ ...newData, whatsapp: e.target.value })}
                        />
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
                                ) : "Change Address"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default Address;
