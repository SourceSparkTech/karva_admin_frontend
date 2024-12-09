import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import fetchApi from '../../utils/helper';
import ConfirmationModal from '../shared/confirmation-modal/ConfirmationModal';
import { AiOutlineLoading } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { FaEye } from 'react-icons/fa6';
import { IoCloseCircleOutline } from 'react-icons/io5';
import ImageUploader from '../shared/image-uploader';
import deleteImage from '../../utils/deleteImage';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const BrandPage = () => {
    const [isLoadingMainBrand, setIsLoadingMainBrand] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [brandData, setBrandData] = useState([]);
    const [isDeleteBrandConfOpen, setIsDeleteBrandConfOpen] = useState(false);
    const [deleteId, setDeleteId] = useState("")
    const [newBrand, setNewBrand] = useState({ brand_name: "", brand_description: "", brand_imageUrl: "" })
    const [loading, setLoading] = useState(false)
    const [editId, setEditId] = useState("")
    const [content, setContent] = useState("");
    const [viewBrand, setViewBrand] = useState({
        brand_imageUrl: {
            public_id: "",
            image_url: ""
        },
    });
    const [viewConf, setViewConf] = useState(false)

    const fetchBrandData = async () => {
        setIsLoadingMainBrand(true)
        try {
            const response = await fetchApi({
                url: `${BASE_URL}/brand`,
                method: "GET",
            });
            setBrandData(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingMainBrand(false);
        }
    }

    useEffect(() => {
         isModalOpen ? document.body.style.overflow = "hidden" : document.body.style.overflow = "auto";
        fetchBrandData();
    }, []);

    const openModal = () => {
        setNewBrand({ brand_name: "", brand_description: "", brand_imageUrl: "" });
        setIsModalOpen(true);
    }

    const handleDeleteBrand = async () => {
        try {
            let response = await fetchApi({ url: `${BASE_URL}/brand/${deleteId}`, method: 'DELETE', isAuthRequired: true })
            if (response.status === 200) {
                fetchBrandData();
            }
        } catch (error) {

        }
    }


    const handleBrandAdd = async (e) => {
        e.preventDefault();
        if (newBrand.brand_name.trim() === "" || newBrand.brand_description.trim() === "" || newBrand.brand_imageUrl.length === 0) {
            alert("Please enter all details");
            return;
        }
        setLoading(true);
        try {
            const newPayload = {
                brand_name: newBrand.brand_name,
                brand_description: newBrand.brand_description,
                brand_imageUrl: {
                    image_url: newBrand.brand_imageUrl.secure_url || newBrand.brand_imageUrl.image_url,
                    public_id: newBrand.brand_imageUrl.public_id
                },
            };
            const response = await fetchApi({ url: editId !== "" ? `${BASE_URL}/brand/${editId}` : `${BASE_URL}/brand`, isAuthRequired: true, method: editId !== "" ? "PUT" : "POST", data: newPayload });

            if (response.status === 200) {
                toast.success("Brand Added Successfully");
                setNewBrand({ brand_name: "", brand_description: "", brand_imageUrl: "" });
                setIsModalOpen(false);
                fetchBrandData();
                setContent("");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setEditId("");
        }
    }

    return (
        <>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Brand</h2>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={openModal}
                    >
                        Add Brand
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-5 border border-gray-400 text-left text-sm font-semibold">Sr No.</th>
                                <th className="py-3 px-5 border border-gray-400 text-left text-sm font-semibold">Brand Title</th>
                                <th className="py-3 px-5 border border-gray-400 text-left text-sm font-semibold">Brand Content</th>
                                <th className="py-3 px-5 border border-gray-400 text-center text-sm font-semibold">Image</th>
                                <th className="py-3 px-5 border border-gray-400 text-center text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingMainBrand ? (
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
                                            <div className="h-10 w-10 bg-gray-300 rounded"></div>
                                        </td>
                                        <td className="py-3 px-5 border border-gray-300 text-center">
                                            <div className="flex gap-3 justify-center">
                                                <div className="h-4 bg-gray-300 rounded w-12"></div>
                                                <div className="h-4 bg-gray-300 rounded w-12"></div>
                                                <div className="h-4 bg-gray-300 rounded w-12"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : brandData.length > 0 ? (
                                brandData.map((brand, index) => (
                                    <tr className="bg-white hover:bg-gray-50 transition duration-200" key={index}>
                                        <td className="py-3 px-5 border border-gray-300 text-center text-sm">{index + 1}</td>
                                        <td className="py-3 px-5 border border-gray-300 text-sm font-medium">
                                            {brand.brand_name.length > 30 ? `${brand?.brand_name.slice(0, 30)}...` : brand?.brand_name}
                                        </td>
                                        <td className="py-3 px-5 border border-gray-300 text-sm">
                                            {brand.brand_description && <div
                                                dangerouslySetInnerHTML={{
                                                    __html: brand.brand_description.length > 50
                                                        ? `${brand?.brand_description.slice(0, 50)}...`
                                                        : brand?.brand_description,
                                                }}
                                            />}
                                        </td>
                                        <td className="py-3 px-5 border border-gray-300 text-center">
                                            <img
                                                src={brand.brand_imageUrl.image_url}
                                                onError={(e) => {
                                                    e.target.src = 'assets/images/placeholder.png';
                                                }}
                                                alt="brand"
                                                className="h-12 w-12 object-cover rounded-full mx-auto shadow-sm"
                                            />
                                        </td>
                                        <td className="py-3 px-5 border border-gray-300 text-center">
                                            <div className="flex gap-3 justify-center">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 text-xl"
                                                    onClick={() => {
                                                        setIsModalOpen(true);
                                                        setEditId(brand._id);
                                                        setNewBrand(brand);
                                                        setContent(brand.brand_description);
                                                    }}
                                                >
                                                    <BiEdit />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800 text-xl"
                                                    onClick={() => {
                                                        setIsDeleteBrandConfOpen(true);
                                                        setDeleteId(brand._id);
                                                    }}
                                                >
                                                    <MdDelete />
                                                </button>
                                                <button
                                                    className="text-green-600 hover:text-green-800 text-xl"
                                                    onClick={() => {
                                                        setViewBrand(brand);
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
                                        No brands available
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Add brand</h2>
                    <form onSubmit={handleBrandAdd}>
                        <input
                            type="text"
                            placeholder="Name"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newBrand.brand_name}
                            onChange={(e) => setNewBrand({ ...newBrand, brand_name: e.target.value })}
                        />
                        <ReactQuill
                            theme="snow"
                            onChange={(value) => {
                                setNewBrand((prevbrand) => ({
                                    ...prevbrand,
                                    brand_description: value,
                                }));
                            }}
                            className="border border-gray-300 overflow-hidden rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 "
                            value={newBrand.brand_description}
                        />
                        {/* <input
                            type="text"
                            placeholder="Image URL"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newBrand.brand_imageUrl}
                            onChange={(e) => setNewBrand({ ...newBrand, brand_imageUrl: e.target.value })}
                        /> */}
                        <ImageUploader setItem={setNewBrand} givenName={"brand_imageUrl"} setLoading={setLoading} />
                        {(newBrand.brand_imageUrl.secure_url || newBrand.brand_imageUrl.image_url) &&
                            <div className='flex items-center relative w-40'>
                                <img className='' src={newBrand.brand_imageUrl.secure_url || newBrand.brand_imageUrl.image_url} />
                                <IoCloseCircleOutline
                                    onClick={async () => {
                                        const response = await deleteImage({ data: { public_id: [newBrand.brand_imageUrl.public_id] } });
                                        // console.log(response)
                                        if (response.status === 200) {
                                            setNewBrand({ ...newBrand, brand_imageUrl: "" })
                                        }
                                    }}
                                    className='absolute top-0 right-0 text-2xl cursor-pointer' />
                            </div>
                        }
                        <div className='flex justify-between'>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-lg mr-2"
                                onClick={() => {
                                    setNewBrand({ brand_name: "", brand_description: "", brand_imageUrl: "" });
                                    setIsModalOpen(false)
                                    setContent("");
                                    setEditId("");
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
                                ) : editId === "" ? "Add brand" : "Edit brand"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Show brand Modal */}
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
                    <h2 className="text-2xl font-bold mb-4 text-center">brand Details</h2>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">brand Title</h3>
                        <p className="text-gray-700">{viewBrand.brand_name}</p>
                    </div>

                    {viewBrand.brand_description && viewBrand.brand_description.length > 0 && <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">brand Content</h3>
                        <div className="py-2 px-4 border ">
                            <div dangerouslySetInnerHTML={{ __html: (viewBrand.brand_description) }} />
                        </div>
                    </div>}

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">brand Image</h3>
                        <img
                            src={viewBrand.brand_imageUrl.image_url}
                            onError={(e) => {
                                e.target.src = 'assets/images/placeholder.png';
                            }}
                            alt="brand"
                            className="h-32 w-32 rounded-lg object-cover border border-gray-300"
                        />
                    </div>
                </div>
            </Modal>

            {isDeleteBrandConfOpen && <ConfirmationModal setShow={setIsDeleteBrandConfOpen} width="w-auto" type="delete_brand" handleSubmit={handleDeleteBrand} />}
        </>
    )
}

export default BrandPage