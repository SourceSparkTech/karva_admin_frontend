import React, { useState, useEffect } from 'react';
import fetchApi from '../../utils/helper';
import ConfirmationModal from '../shared/confirmation-modal/ConfirmationModal';
import { toast } from 'react-toastify';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiEdit, BiPlus } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { FaChevronDown, FaEye } from 'react-icons/fa6';
import Modal from 'react-modal';
import ImageUploader from '../shared/image-uploader';
import { IoCloseCircleOutline } from 'react-icons/io5';
import deleteImage from '../../utils/deleteImage';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

function CategoryAdd() {
    const [isLoadingMainData, setIsLoadingMainData] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        image: '',
    });
    const [newSubCategory, setNewSubCategory] = useState({
        name: '',
        description: '',
        mainCategory: '',
        image_url: ''
    });
    const [selectedCat, setSelectedCat] = useState("");
    const [isDeleteConfOpen, setIsDeleteConfOpen] = useState(false);
    const [deleteCatId, setDeleteCatId] = useState("");
    const [isSubCatDeleteConfOpen, setIsSubCatDeleteConfOpen] = useState(false);
    const [deleteSubCatId, setDeleteSubCatId] = useState({ cat_id: "", subcat_id: "" })
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedSubCat, setSelectedSubCat] = useState("");
    const [isEditCat, setIsEditCat] = useState("");
    const [isEditSubCat, setIsEditSubCat] = useState({ cat_id: "", sub_cat_id: "" })
    const [viewCat, setViewCat] = useState({
        cat_name: "",
        cat_description: "",
        cat_imageUrl: {
            public_id: "",
            image_url: ""
        }
    });
    const [viewConfSubCat, setViewConfSubCat] = useState(false);
    const [viewSubCat, setViewSubCat] = useState({
        sub_cat_name: "",
        sub_cat_imageUrl: {
            public_id: "",
            image_url: ""
        },
        main_cat: ""
    },)
    const [viewConf, setViewConf] = useState(false);


    const toggleCategory = (categoryId) => {
        setActiveCategory(activeCategory === categoryId ? null : categoryId);
    };

    const fetchCatData = async () => {
        setIsLoadingMainData(true);
        try {
            const response = await fetchApi({
                url: `${BASE_URL}/category`,
                method: "GET",
            });
            setCategories(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingMainData(false);
        }
    }

    useEffect(() => {
        isModalOpen ? document.body.style.overflow = "hidden" : document.body.style.overflow = "auto";
        fetchCatData();
    }, []);

    const handleCategoryAdd = async (e) => {
        e.preventDefault();
        if (newCategory.name.trim() === "" || newCategory.image.length === 0) {
            alert("Please input all the field")
            return;
        }
        setLoading(true);
        const newPayload = {
            cat_name: newCategory.name,
            cat_description: newCategory.description,
            cat_imageUrl: {
                public_id: newCategory.image.public_id,
                image_url: newCategory.image.secure_url || newCategory.image.image_url
            },
            subcategories: [],
        };
        try {
            const response = await fetchApi({
                url: isEditCat !== "" ? `${BASE_URL}/category/${isEditCat}` : `${BASE_URL}/category`,
                method: isEditCat !== "" ? 'PUT' : "POST",
                isAuthRequired: true,
                data: newPayload
            });
            if (response.status === 200) {
                fetchCatData();
                toast.success("Added Successfully");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsModalOpen(false);
            setNewCategory({ name: '', description: '', image: '' });
            setLoading(false);
            setIsEditCat("");
        }
    };

    const handleDeleteCategory = async (cat_id) => {
        try {
            const response = await fetchApi({ url: `${BASE_URL}/category/${cat_id}`, method: 'DELETE', isAuthRequired: true });
            if (response.status === 200) {
                toast.success('Delete category')
                fetchCatData();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleSubCategoryAdd = async (e) => {
        e.preventDefault();
        if (newSubCategory.name.trim() === "" || newSubCategory.image_url.length === 0) {
            alert("Please input all the field")
            return;
        }
        const newPayload = isEditSubCat.cat_id !== "" ? {
            cat_id: isEditSubCat.cat_id,
            sub_cat_id: isEditSubCat.sub_cat_id,
            data: {
                sub_cat_name: newSubCategory.name,
                sub_cat_description: newSubCategory.description,
                sub_cat_imageUrl: {
                    image_url: newSubCategory.image_url.secure_url || newSubCategory.image_url.image_url,
                    public_id: newSubCategory.image_url.public_id
                }
            }
        } : {
            cat_name: selectedCat.cat_name,
            cat_description: selectedCat.cat_description,
            cat_imageUrl: {
                image_url: selectedCat.cat_imageUrl.image_url,
                public_id: selectedCat.cat_imageUrl.public_id
            },
            subCategory: {
                sub_cat_name: newSubCategory.name,
                sub_cat_description: newSubCategory.description,
                sub_cat_imageUrl: {
                    image_url: newSubCategory.image_url.secure_url || newSubCategory.image_url.image_url,
                    public_id: newSubCategory.image_url.public_id
                }
            }
        }
        setLoading(true);
        try {
            let response = await fetchApi({
                url: `${BASE_URL}/subCategory`,
                isAuthRequired: true,
                data: newPayload,
                method: isEditSubCat.cat_id !== "" ? "PUT" : "POST"
            })
            if (response.status === 200) {
                toast.success("Added Successfully");
                fetchCatData();
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubCategoryModalOpen(false);
            setNewSubCategory({ name: '', description: '', mainCategory: '', image_url: '' });
            setLoading(false);
            setIsEditSubCat({ cat_id: "", sub_cat_id: "" })
        }
    };

    const handleDeleteSubCat = async ({ cat_id, subcat_id }) => {
        const newPayload = {
            cat_id: cat_id,
            subcat_id: subcat_id
        }
        try {
            let response = await fetchApi({ url: `${BASE_URL}/subcategory`, method: "DELETE", isAuthRequired: true, data: newPayload });
            if (response.status === 200) {
                fetchCatData();
                toast.success("Deleted successfully");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsDeleteConfOpen(false);
        }
    }

    const handleClose = () => {
        setLoading(false);
        setNewCategory({ name: '', description: '', image: '' });
        setIsModalOpen(false)
        setIsEditCat("");
        setIsSubCategoryModalOpen(false)
        setNewSubCategory({ name: '', description: '', mainCategory: '', image_url: '' });
        setIsEditSubCat({ cat_id: "", sub_cat_id: "" })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-extrabold text-gray-800">Categories</h1>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    onClick={() => {
                        setIsModalOpen(true)
                        setNewCategory({
                            name: '',
                            description: '',
                            image: '',
                        })
                    }}
                >
                    Add Category
                </button>
            </div>

            <div className="">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 shadow-md">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="border border-gray-400 py-3 px-5 text-left text-sm font-semibold">Sr No.</th>
                                <th className="border border-gray-400 py-3 px-5 text-left text-sm font-semibold">Category Name</th>
                                <th className="border border-gray-400 py-3 px-5 text-center text-sm font-semibold">Image</th>
                                <th className="border border-gray-400 py-3 px-5 text-center text-sm font-semibold">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingMainData ? (
                                // Skeleton Loader Rows
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse bg-white">
                                        <td className="border border-gray-300 py-3 px-5 text-center">
                                            <div className="h-4 bg-gray-300 rounded w-10 mx-auto"></div>
                                        </td>
                                        <td className="border border-gray-300 py-3 px-5">
                                            <div className="h-4 bg-gray-300 rounded w-32"></div>
                                        </td>
                                        <td className="border border-gray-300 py-3 px-5 text-center">
                                            <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto"></div>
                                        </td>
                                        <td className="border border-gray-300 py-3 px-5 text-center">
                                            <div className="flex gap-2 justify-center">
                                                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                                <div className="w-24 h-8 bg-gray-300 rounded"></div>
                                                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : categories.length > 0 ? (
                                categories.map((category, index) => (
                                    <React.Fragment key={category._id}>
                                        {/* Category Row */}
                                        <tr className="bg-white hover:bg-gray-50 transition duration-200">
                                            <td className="border border-gray-300 py-3 px-5 text-center text-sm font-medium">
                                                {index + 1}
                                            </td>
                                            <td className="border border-gray-300 py-3 px-5 text-sm font-medium">
                                                {category.cat_name}
                                            </td>
                                            <td className="border border-gray-300 py-3 px-5 text-center">
                                                <img
                                                    src={category.cat_imageUrl.image_url}
                                                    onError={(e) => {
                                                        e.target.src = 'assets/images/placeholder.png';
                                                    }}
                                                    alt={category.cat_name}
                                                    className="w-12 h-12 rounded-full object-cover mx-auto shadow-sm"
                                                />
                                            </td>
                                            <td className="border border-gray-300 py-3 px-5 text-center">
                                                <div className="flex gap-3 justify-center">
                                                    <button
                                                        onClick={() => {
                                                            setIsModalOpen(true);
                                                            setNewCategory({
                                                                name: category.cat_name,
                                                                description: category.cat_description,
                                                                image: category.cat_imageUrl,
                                                            });
                                                            setIsEditCat(category._id);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 text-2xl"
                                                    >
                                                        <BiEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsDeleteConfOpen(true);
                                                            setDeleteCatId(category._id);
                                                        }}
                                                        className="text-red-600 hover:text-red-800 text-2xl"
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsSubCategoryModalOpen(true);
                                                            setSelectedSubCat(category.cat_name);
                                                            const selectedCat = categories.find(
                                                                (cats) => cats?.cat_name === category.cat_name
                                                            );
                                                            setSelectedCat(selectedCat);
                                                            setNewSubCategory({
                                                                name: '',
                                                                description: '',
                                                                mainCategory: category.cat_name,
                                                                image_url: '',
                                                            });
                                                        }}
                                                        className="md:hidden inline-block bg-green-600 hover:bg-green-700 text-white p-1 rounded-md text-lg"
                                                    >
                                                        <BiPlus />
                                                    </button>
                                                    <button
                                                        className="text-green-600 hover:text-green-800 text-xl"
                                                        onClick={() => {
                                                            setViewCat(category);
                                                            setViewConf(true);
                                                        }}
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsSubCategoryModalOpen(true);
                                                            setSelectedSubCat(category.cat_name);
                                                            const selectedCat = categories.find(
                                                                (cats) => cats?.cat_name === category.cat_name
                                                            );
                                                            setSelectedCat(selectedCat);
                                                            setNewSubCategory({
                                                                name: '',
                                                                description: '',
                                                                mainCategory: category.cat_name,
                                                                image_url: '',
                                                            });
                                                        }}
                                                        className="hidden md:inline-block bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                                                    >
                                                        Add Subcategory
                                                    </button>
                                                    <button
                                                        onClick={() => toggleCategory(category._id)}
                                                        className="text-gray-600 hover:text-gray-800"
                                                    >
                                                        <FaChevronDown
                                                            className={`transition-transform ${activeCategory === category._id ? 'rotate-180' : ''
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Subcategory Rows */}
                                        {activeCategory === category._id &&
                                            (category.subcategories.length > 0 ? (
                                                category.subcategories.map((subcat, subIndex) => (
                                                    <tr
                                                        key={subcat._id}
                                                        className="bg-gray-50 hover:bg-gray-100 transition duration-200"
                                                    >
                                                        <td className="border border-gray-300 py-3 px-5 text-center text-sm">
                                                            {index + 1}.{subIndex + 1}
                                                        </td>
                                                        <td className="border border-gray-300 py-3 px-5 text-sm text-gray-700">
                                                            {subcat.sub_cat_name}
                                                        </td>
                                                        <td className="border border-gray-300 py-3 px-5 text-center">
                                                            <img
                                                                src={subcat.sub_cat_imageUrl.image_url}
                                                                onError={(e) => {
                                                                    e.target.src = 'assets/images/placeholder.png';
                                                                }}
                                                                alt={subcat.sub_cat_name}
                                                                className="w-10 h-10 rounded-full object-cover mx-auto"
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 py-3 px-5 text-center">
                                                            <div className="flex gap-3 justify-center">
                                                                <button
                                                                    onClick={() => {
                                                                        const selectedCat = categories.find(
                                                                            (cats) => cats?.cat_name === category.cat_name
                                                                        );
                                                                        setSelectedCat(selectedCat);
                                                                        setIsSubCategoryModalOpen(true);
                                                                        setIsEditSubCat({
                                                                            cat_id: category._id,
                                                                            sub_cat_id: subcat._id,
                                                                        });
                                                                        setNewSubCategory({
                                                                            name: subcat.sub_cat_name,
                                                                            description: subcat.sub_cat_description,
                                                                            mainCategory: category.cat_name,
                                                                            image_url: subcat.sub_cat_imageUrl,
                                                                        });
                                                                        setSelectedSubCat(category.cat_name);
                                                                    }}
                                                                    className="text-blue-600 hover:text-blue-800 text-lg"
                                                                >
                                                                    <BiEdit />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setIsSubCatDeleteConfOpen(true);
                                                                        setDeleteSubCatId({
                                                                            cat_id: category._id,
                                                                            subcat_id: subcat._id,
                                                                        });
                                                                    }}
                                                                    className="text-red-600 hover:text-red-800 text-lg"
                                                                >
                                                                    <MdDelete />
                                                                </button>
                                                                <button
                                                                    className="text-green-600 hover:text-green-800 text-xl"
                                                                    onClick={() => {
                                                                        setViewSubCat({ ...subcat, main_cat: category.cat_name });
                                                                        setViewConfSubCat(true);
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
                                                        colSpan="4"
                                                        className="text-center py-4 text-gray-600 bg-gray-50"
                                                    >
                                                        No Subcategories Available
                                                    </td>
                                                </tr>
                                            ))}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center py-4 text-gray-600 bg-gray-50"
                                    >
                                        No Categories Available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Category Modal */}
            <Modal
                isOpen={isModalOpen}
                ariaHideApp={false}
                // onRequestClose={handleClose}
                className="animate-[modalDialogAnimation_0.2s_ease-in-out] [animation-fill-mode:forwards] bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] mx-auto my-20 p-8 "
                overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-scroll z-50"
            >
                {/* <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> */}
                <div className="bg-white">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Category</h2>
                    <form onSubmit={handleCategoryAdd}>
                        <input
                            type="text"
                            placeholder="Name"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        />
                        <div>
                            <ImageUploader setItem={setNewCategory} givenName={"image"} setLoading={setLoading} />
                            {(newCategory.image.secure_url || newCategory.image.image_url) &&
                                <div className='flex items-center relative w-40'>
                                    <img
                                        className=''
                                        src={newCategory.image.secure_url || newCategory.image.image_url}
                                        onError={(e) => {
                                            e.target.src = 'assets/images/placeholder.png';
                                        }}
                                    />
                                    <IoCloseCircleOutline
                                        onClick={async () => {
                                            const response = await deleteImage({ data: { public_id: [newCategory.image.public_id] } });
                                            // console.log(response)
                                            if (response.status === 200) {
                                                setNewCategory({ ...newCategory, image: "" })
                                            }
                                        }}
                                        className='absolute top-0 right-0 text-2xl cursor-pointer' />
                                </div>
                            }
                        </div>
                        <div className='flex justify-between'>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-lg mr-2"
                                onClick={handleClose}
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
                                ) : (isEditCat !== "" ? "Edit Category" : "Add Category")}
                            </button>
                        </div>
                    </form>
                </div>
                {/* </div> */}
            </Modal>
            {/* )} */}

            {/* Add Subcategory Modal */}
            {/* {isSubCategoryModalOpen && ( */}
            <Modal
                isOpen={isSubCategoryModalOpen}
                ariaHideApp={false}
                // onRequestClose={handleClose}
                className="animate-[modalDialogAnimation_0.2s_ease-in-out] [animation-fill-mode:forwards] bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] mx-auto my-20 p-8 "
                overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-scroll z-50"
            >
                <div className="bg-white">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Subcategory</h2>
                    <form onSubmit={handleSubCategoryAdd}>
                        <div
                            className="bg-gray-300 border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            {selectedSubCat}
                        </div>
                        <input
                            type="text"
                            placeholder="Name"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={newSubCategory.name}
                            onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                        />
                        {/* <input
                            type="text"
                            placeholder="Image URL"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newSubCategory.image_url}
                            onChange={(e) => setNewSubCategory({ ...newSubCategory, image_url: e.target.value })}
                        /> */}
                        <ImageUploader setItem={setNewSubCategory} givenName={"image_url"} setLoading={setLoading} />
                        {(newSubCategory.image_url.secure_url || newSubCategory.image_url.image_url) &&
                            <div className='flex items-center relative w-40'>
                                <img
                                    className=''
                                    onError={(e) => {
                                        e.target.src = 'assets/images/placeholder.png';
                                    }}
                                    src={newSubCategory.image_url.secure_url || newSubCategory.image_url.image_url}
                                />
                                <IoCloseCircleOutline
                                    onClick={async () => {
                                        const response = await deleteImage({ data: { public_id: [newSubCategory.image_url.public_id] } });
                                        // console.log(response)
                                        if (response.status === 200) {
                                            setNewSubCategory({ ...newSubCategory, image_url: "" })
                                        }
                                    }}
                                    className='absolute top-0 right-0 text-2xl cursor-pointer' />
                            </div>
                        }
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-lg mr-2"
                                type='button'
                                onClick={handleClose}
                            >
                                Close
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-6 rounded-lg"
                                type='submit'
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className='animate-spin'>
                                        <AiOutlineLoading />
                                    </div>
                                ) : (isEditSubCat.cat_id !== "" ? "Edit Subcategory" : "Add Subcategory")
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
            {/* )} */}

            {/* Category Show */}
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
                {<div className="bg-white p-2">
                    <h2 className="text-2xl font-bold mb-4 text-center">Category Details</h2>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">Category Name</h3>
                        <p className="text-gray-700">{viewCat.cat_name}</p>
                    </div>

                    {viewCat.cat_description !== "" && <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">Category description</h3>
                        <div className="py-2 px-4 border ">
                            <div dangerouslySetInnerHTML={{ __html: (viewCat.cat_description) }} />
                        </div>
                    </div>}

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">Category Image</h3>
                        <img
                            src={viewCat.cat_imageUrl.image_url}
                            onError={(e) => {
                                e.target.src = 'assets/images/placeholder.png';
                            }}
                            alt="Blog"
                            className="h-32 w-32 rounded-lg object-cover border border-gray-300"
                        />
                    </div>
                </div>}
            </Modal>


            {/* Sub Category Show */}
            <Modal
                isOpen={viewConfSubCat}
                ariaHideApp={false}
                // onRequestClose={() => setViewConfSubCat(false)}
                className="animate-[modalDialogAnimation_0.2s_ease-in-out] [animation-fill-mode:forwards] bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] mx-auto my-20 p-4"
                overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-scroll z-50"
            >
                <div className="relative w-full h-full">
                    <div onClick={() => setViewConfSubCat(false)} className='absolute top-0 right-0 text-4xl cursor-pointer text-black duration-300 hover:text-white hover:bg-black rounded-full'>
                        <IoCloseCircleOutline />
                    </div>
                </div>
                {<div className="bg-white p-2">
                    <h2 className="text-2xl font-bold mb-4 text-center">Category Details</h2>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">Main category Name</h3>
                        <p className="text-gray-700">{viewSubCat.main_cat}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">Sub category Name</h3>
                        <p className="text-gray-700">{viewSubCat.sub_cat_name}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">Category Image</h3>
                        <img
                            src={viewSubCat.sub_cat_imageUrl.image_url}
                            onError={(e) => {
                                e.target.src = 'assets/images/placeholder.png';
                            }}
                            alt="Blog"
                            className="h-32 w-32 rounded-lg object-cover border border-gray-300"
                        />
                    </div>
                </div>}
            </Modal>

            {isDeleteConfOpen && <ConfirmationModal setShow={setIsDeleteConfOpen} width={"w-auto"} type="delete_cat" handleSubmit={handleDeleteCategory} data={deleteCatId} />}
            {isSubCatDeleteConfOpen && <ConfirmationModal setShow={setIsSubCatDeleteConfOpen} width={"w-auto"} type="delete_sub_cat" handleSubmit={handleDeleteSubCat} data={deleteSubCatId} />}
        </div >

    );
}

export default CategoryAdd;