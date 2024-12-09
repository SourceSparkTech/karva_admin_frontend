import React, { useEffect, useRef, useState } from 'react'
import fetchApi from '../../utils/helper';
import Modal from 'react-modal';
import ReactQuill from 'react-quill';
import ColourPage from './color-page';
import SizePage from './size-page';
import ReactSwitch from 'react-switch';
import { toast } from 'react-toastify';
import { AiOutlineLoading } from 'react-icons/ai';
import ConfirmationModal from '../shared/confirmation-modal/ConfirmationModal';
import ImageUploader from '../shared/image-uploader';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import { IoCloseCircleOutline } from 'react-icons/io5';
import deleteImage from '../../utils/deleteImage';
import PaginationComponent from '../pagination';
import { FaEye } from 'react-icons/fa6';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const Products = () => {
    const [products, setProducts] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [newProductData, setNewProductData] = useState({
        prd_name: "",
        prd_desc: "",
        prd_gender: "",
        prd_brand_name: "",
        prd_price: "",
        prd_category: "",
        prd_sub_category: "",
        prd_discount_percentage: "",
        prd_delivery_charges: "",
        prd_overall_quantity: "",
        prd_out_of_stock: false
    })
    const [totalCategory, setTotalCategory] = useState([])
    const [totalBrand, setTotalBrand] = useState([])
    const [selectedSubCat, setSelectedSubCat] = useState([])
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [isDeleteConfOpen, setIsDeleteConfOpen] = useState(false);
    const [editId, setEditId] = useState("");
    const [isLoadingMainProduct, setIsLoadingMainProduct] = useState(false)
    const [productImages, setProductImages] = useState([])
    const [viewConf, setViewConf] = useState(false)
    const [viewProduct, setViewProduct] = useState({
        prd_name: "",
        prd_desc: "",
        prd_gender: "",
        prd_brand_name: "",
        prd_price: "",
        prd_category: "",
        prd_sub_category: "",
        prd_discount_percentage: "",
        prd_delivery_charges: "",
        prd_overall_quantity: "",
        prd_out_of_stock: false,
        prd_sizes: [],
        prd_colors: [],
        prd_img: [],
    })

    const [data, setData] = useState([])
    const [search, setSearch] = useState("")
    const currentPageRef = useRef(1);
    const itemsPerPage = 10;
    const mainProductInput = useRef(null);

    useEffect(() => {
        let timer
        if (search) {
            timer = setTimeout(() => {
                handleSearch();
            }, 500);
        } else {
            fetchData({
                limit: itemsPerPage,
                page: currentPageRef.current,
            });
        }
        return () => clearTimeout(timer);
    }, [search.trim()]);

    const fetchData = async (pageObj) => {
        setIsLoadingMainProduct(true);
        try {
            const response = await fetchApi({
                url: `${BASE_URL}/product/all`,
                method: "POST",
                isAuthRequired: true,
                data: pageObj,
            });
            if (response.status === 200) {
                setProducts(response.data.products);
                setData(response.data);
                // setItemOffset(itemsPerPage * currentPageRef.current - 5)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingMainProduct(false);
        }
    };

    // const fetchProductData = async () => {
    //     setIsLoadingMainProduct(true);
    //     try {
    //         const response = await fetchApi({
    //             url: `${BASE_URL}/product/all`,
    //             body: JSON.stringify({}),
    //             method: "POST",
    //         });
    //         setProducts(response.data.products);
    //         // console.log(response);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setIsLoadingMainProduct(false);
    //     }
    // }

    useEffect(() => {
        handleFetchCategory();
        handleFetchBrand();
        isOpen ? document.body.style.overflow = "hidden" : document.body.style.overflow = "auto";
    }, []);

    const truncateContent = (content, length = 200) => {
        if (!content) return '';
        const truncated = content.length > length ? content.substring(0, length) + '...' : content;
        return truncated;
    };

    const handleChangeProductData = (e) => {
        const { name, value } = e.target
        setNewProductData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleFetchCategory = async () => {
        try {
            const res = await fetchApi({ url: `${BASE_URL}/category`, method: "GET" });
            setTotalCategory(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFetchBrand = async () => {
        try {
            const res = await fetchApi({ url: `${BASE_URL}/brand`, method: "GET" });
            setTotalBrand(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectSubCategory = (e) => {
        const { value } = e.target;
        const selectedCat = totalCategory.find((cats) => cats?.cat_name === value);
        setSelectedSubCat(selectedCat?.subcategories || []);
    }

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (newProductData.prd_name.trim() === "" || newProductData.prd_brand_name.trim() === "" || newProductData.prd_desc.trim() === "") {
            alert("Please enter value properly");
            return;
        }

        const newPostData = {
            ...newProductData,
            prd_discount_price: newProductData.prd_discount_percentage ? newProductData.prd_price - (newProductData.prd_price * newProductData.prd_discount_percentage) / 100 : newProductData.prd_price,
            prd_sizes: [...sizes],
            prd_colors: [...colors],
            prd_img: productImages,
        }
        setLoadingAdd(true);
        // if(newProductData)
        try {
            let response = await fetchApi({
                url: editId !== "" ? `${BASE_URL}/product/${editId}` : `${BASE_URL}/product`,
                method: editId !== "" ? "PUT" : "POST",
                isAuthRequired: true,
                data: newPostData
            })
            if (response.status == 200) {
                toast.success(response.message);
                fetchData({
                    limit: itemsPerPage,
                    page: currentPageRef.current,
                });
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingAdd(false);
            handleCancelModal();
            setEditId("");
        }
    }

    const handleCancelModal = () => {
        setIsOpen(false);
        setNewProductData({ prd_name: "", prd_desc: "", prd_gender: "", prd_brand_name: "", prd_price: "", prd_category: "", prd_sub_category: "", prd_discount_percentage: "", prd_delivery_charges: "", prd_overall_quantity: "", prd_out_of_stock: false })
        setSizes([]);
        setColors([]);
    }

    const handleDeleteProduct = async () => {
        try {
            let response = await fetchApi({ url: `${BASE_URL}/product/${deleteId}`, method: 'DELETE', isAuthRequired: true })
            if (response.status == 200) {
                toast.success("Product Delete successfully");
                fetchData({
                    limit: itemsPerPage,
                    page: currentPageRef.current,
                });
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDeleteId("");
        }
    }

    const token = localStorage.getItem("auth");

    async function uploadImages(image) {
        setLoadingAdd(true);
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
            setLoadingAdd(false);
        }
    }

    const handleChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadResponse = await uploadImages(file);
        setProductImages((prev) => ([...prev, { image_url: uploadResponse.secure_url, public_id: uploadResponse.public_id }]));
    };

    const handlePageClick = async (event) => {
        const newOffset = (event.selected * itemsPerPage) % products.totalProducts;
        // setItemOffset(newOffset);

        const newPage = Number(event.selected + 1);
        if (newPage !== currentPageRef.current) {
            // Check if the selected page is different from the current page
            const pageObj = search
                ? { limit: itemsPerPage, page: newPage, search }
                : { limit: itemsPerPage, page: newPage };
            fetchData(pageObj);
            // setLoading(true);
            currentPageRef.current = newPage;
        }
    }

    const handleSearch = async () => {
        setIsLoadingMainProduct(true);
        try {
            const response = await fetchApi({
                url: `${BASE_URL}/product/search`,
                method: "POST",
                isAuthRequired: true,
                data: { query: search },
            });
            if (response.status === 200) {
                setProducts(response.data);
                setData(response.data);
                // setItemOffset(itemsPerPage * currentPageRef.current - 5)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingMainProduct(false);
        }
    }

    return (
        <>
            <div className="mb-8">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                    <h2 className="text-lg font-bold text-gray-800">Products</h2>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                        onClick={() => {
                            setIsOpen(true)
                            setNewProductData({ prd_name: "", prd_desc: "", prd_gender: "", prd_brand_name: "", prd_price: "", prd_category: "", prd_sub_category: "", prd_discount_percentage: "", prd_delivery_charges: "", prd_overall_quantity: "", prd_out_of_stock: false })
                            setColors([]);
                            setSizes([]);
                            setProductImages([]);
                            setEditId("");
                            setDeleteId("");
                        }}
                    >
                        Add Products
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Products by Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-5 border-b text-left text-sm font-semibold">Sr No.</th>
                                <th className="py-3 px-5 border-b text-left text-sm font-semibold">Product Name</th>
                                <th className="py-3 px-5 border-b text-left text-sm font-semibold">Product Description</th>
                                <th className="py-3 px-5 border-b text-left text-sm font-semibold">Product Category</th>
                                <th className="py-3 px-5 border-b text-left text-sm font-semibold">Product Brand</th>
                                <th className="py-3 px-5 border-b text-center text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingMainProduct ? (
                                // Skeleton Loader
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse bg-gray-100">
                                        <td className="py-3 px-5 border-b">
                                            <div className="h-4 bg-gray-300 rounded w-8 mx-auto"></div>
                                        </td>
                                        <td className="py-3 px-5 border-b">
                                            <div className="h-4 bg-gray-300 rounded w-32"></div>
                                        </td>
                                        <td className="py-3 px-5 border-b">
                                            <div className="h-4 bg-gray-300 rounded w-full max-w-[250px]"></div>
                                        </td>
                                        <td className="py-3 px-5 border-b">
                                            <div className="h-4 bg-gray-300 rounded w-24"></div>
                                        </td>
                                        <td className="py-3 px-5 border-b">
                                            <div className="h-4 bg-gray-300 rounded w-20"></div>
                                        </td>
                                        <td className="py-3 px-5 border-b text-center">
                                            <div className="flex gap-3 justify-center">
                                                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : products.length > 0 ? (
                                // Render Product Rows
                                products.map((pro, index) => (
                                    <tr className="hover:bg-gray-100 transition duration-200 border-t" key={index}>
                                        <td className="py-3 px-5 border-b text-gray-700 text-center text-sm">{(data.currentPage * 10 - 10) + (index + 1)}</td>
                                        <td className="py-3 px-5 border-b text-gray-700 text-sm">{pro?.prd_name}</td>
                                        <td className="py-3 px-5 border-b max-w-[250px] overflow-hidden whitespace-nowrap text-ellipsis text-gray-700 text-sm">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: truncateContent(pro?.prd_desc),
                                                }}
                                            />
                                        </td>
                                        <td className="py-3 px-5 border-b text-gray-700 text-sm">{pro?.prd_category}</td>
                                        <td className="py-3 px-5 border-b text-gray-700 text-sm">{pro?.prd_brand_name}</td>
                                        <td className="py-3 px-5 border-b text-center">
                                            <div className="flex gap-3 justify-center">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 text-xl"
                                                    onClick={() => {
                                                        setIsOpen(true);
                                                        setNewProductData({ ...pro, prd_overall_quantity: pro.prd_sizes.length > 0 ? "" : pro.prd_overall_quantity });
                                                        setColors(pro.prd_colors);
                                                        setSizes(pro.prd_sizes);
                                                        setEditId(pro._id);
                                                        setProductImages(pro.prd_img);
                                                    }}
                                                >
                                                    <BiEdit />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="text-red-600 hover:text-red-800 text-xl"
                                                    onClick={() => {
                                                        setIsDeleteConfOpen(true);
                                                        setDeleteId(pro._id);
                                                    }}
                                                >
                                                    <MdDelete />
                                                </button>
                                                <button
                                                    className="text-green-600 hover:text-green-800 text-xl"
                                                    onClick={() => {
                                                        setViewProduct(pro);
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
                                // No Products Available Message
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="py-4 text-center text-gray-600 bg-gray-50"
                                    >
                                        No products available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PaginationComponent handlePageClick={handlePageClick} endOffset={data.totalPages} />


            <Modal
                isOpen={isOpen}
                ariaHideApp={false}
                // onRequestClose={() => setIsOpen(false)}
                className="animate-[modalDialogAnimation_0.2s_ease-in-out] [animation-fill-mode:forwards] bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] mx-auto my-20 p-8 "
                overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-scroll z-50"
            >
                <h2 className="text-2xl font-bold mb-4">Create Product</h2>
                <form onSubmit={handleAddProduct}>
                    <div className='w-[100%]'>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Product Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                placeholder='Enter Product Name'
                                name='prd_name'
                                onChange={handleChangeProductData}
                                value={newProductData.prd_name}
                            />
                        </div>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Product Description</label>
                            <ReactQuill
                                type="text"
                                className="w-full border border-gray-300 rounded"
                                placeholder='Enter product description'
                                name='prd_desc'
                                onChange={(value) => {
                                    setNewProductData((prevBlog) => ({
                                        ...prevBlog,
                                        prd_desc: value,
                                    }));
                                }}
                                value={newProductData.prd_desc}
                            />
                        </div>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Main Category</label>
                            <select
                                className='w-full px-4 py-2 border border-gray-300 rounded'
                                name="prd_category"
                                value={newProductData.prd_category}
                                onChange={(e) => {
                                    handleSelectSubCategory(e);
                                    handleChangeProductData(e);
                                }}
                            >
                                <option value={'Main'}>Category</option>
                                {totalCategory &&
                                    totalCategory?.map((cat, index) => (
                                        <option key={index} value={cat?.cat_name}>{cat?.cat_name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Sub Category</label>
                            <select
                                className='w-full px-4 py-2 border border-gray-300 rounded'
                                name="prd_sub_category"
                                value={newProductData.prd_sub_category}
                                onChange={handleChangeProductData}
                            >
                                <option value={'sub'}>Category</option>
                                {selectedSubCat &&
                                    selectedSubCat?.map((subcat, index) => (
                                        <option key={index} value={subcat?.sub_cat_name}>{subcat?.sub_cat_name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Brand</label>
                            <select
                                className='w-full px-4 py-2 border border-gray-300 rounded'
                                name="prd_brand_name"
                                value={newProductData.prd_brand_name}
                                onChange={handleChangeProductData}
                            >
                                <option value={'sub'}>brand</option>
                                {totalBrand &&
                                    totalBrand?.map((brand, index) => (
                                        <option key={index} value={brand?.brand_name}>{brand?.brand_name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Gender</label>
                            <select
                                className='w-full px-4 py-2 border border-gray-300 rounded'
                                name="prd_gender"
                                value={newProductData.prd_gender}
                                onChange={handleChangeProductData}
                            >
                                <option value={'select gender'}>select gender</option>
                                <option value={'Male'}>Male</option>
                                <option value={'Female'}>Female</option>
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Product Price</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                placeholder='Enter product price'
                                name='prd_price'
                                onChange={handleChangeProductData}
                                value={newProductData.prd_price}
                            />
                        </div>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Discount(%)</label>
                            <div className='flex justify-between gap-3'>
                                <input
                                    type="number"
                                    className="w-9/12 px-4 py-2 border border-gray-300 rounded"
                                    placeholder='Enter discount amount'
                                    name='prd_discount_percentage'
                                    onChange={handleChangeProductData}
                                    value={newProductData.prd_discount_percentage}
                                />
                                <input
                                    type="text"
                                    disabled={true}
                                    className='w-3/12 px-4 py-2 bg-gray-200 border border-gray-300 rounded'
                                    value={newProductData.prd_discount_percentage ? newProductData.prd_price - (newProductData.prd_price * newProductData.prd_discount_percentage) / 100 : newProductData.prd_price} />
                            </div>
                        </div>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Delivery Charge</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                placeholder='Enter delivery charge'
                                name='prd_delivery_charges'
                                onChange={handleChangeProductData}
                                value={newProductData.prd_delivery_charges}
                            />
                        </div>
                        <div className='mb-4'>
                            <label className="block text-gray-700">Quantity</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                placeholder='Enter Quantity'
                                name='prd_overall_quantity'
                                disabled={sizes.length > 0}
                                min={0}
                                onChange={handleChangeProductData}
                                value={sizes.length > 0 || newProductData.prd_overall_quantity}
                            />
                        </div>
                        <SizePage sizes={sizes} setSizes={setSizes} newProductData={newProductData} />
                        <ColourPage colors={colors} setColors={setColors} productImages={productImages} />

                        <div className="mb-4">
                            <input type='file' className='hidden' ref={mainProductInput} onChange={handleChange} />
                            <label className="block text-gray-700">Add Image</label>
                            <div className="mb-4 flex justify-between">
                                <button
                                    disabled={colors.length > 0}
                                    onClick={() => mainProductInput.current.click()}
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mb-3"
                                >
                                    Add Image
                                </button>
                                {
                                    productImages.length > 0 &&
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const response = await deleteImage({ data: { public_id: [productImages.map(e => e.public_id)] } });
                                            // console.log(response)
                                            if (response.status === 200) {
                                                setProductImages([])
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
                                {productImages.length > 0 &&
                                    <div className='flex items-center w-full gap-2'>
                                        {productImages.map((e, i) => (
                                            <div key={i} className='relative w-1/2 md:w-1/4 border border-black p-2'>
                                                <img className='w-full' src={e.image_url} />
                                                <IoCloseCircleOutline
                                                    onClick={async () => {
                                                        const response = await deleteImage({ data: { public_id: [e.public_id] } });
                                                        // console.log(response)
                                                        if (response.status === 200) {
                                                            setProductImages((pre) => pre.filter(ele => ele.public_id !== e.public_id))
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
                        <label className="block text-gray-700">Is Product Out Of Stock</label>
                        <ReactSwitch
                            checked={newProductData?.prd_out_of_stock}
                            onChange={() => {
                                setNewProductData(prevData => ({
                                    ...prevData,
                                    prd_out_of_stock: !prevData.prd_out_of_stock
                                }));
                            }}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={15}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={10}
                            width={28}
                            className="react-switch"
                        />

                        <div className='w-[100%] flex justify-end'>
                            <div className='flex items-center gap-3'>
                                <button type="button" className='px-4 py-1 rounded border-[2px] border-black text-black'
                                    onClick={() => {
                                        setIsOpen(false)
                                        handleCancelModal();
                                    }}
                                >Cancel</button>
                                <button type='submit' className='px-4 py-2 rounded bg-black text-white'>
                                    {loadingAdd ? (
                                        <div className='animate-spin'>
                                            <AiOutlineLoading />
                                        </div>
                                    ) : editId !== "" ? "Edit" : "Create"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={viewConf}
                ariaHideApp={false}
                // onRequestClose={() => setViewConf(false)}
                className="animate-[modalDialogAnimation_0.2s_ease-in-out] [animation-fill-mode:forwards] bg-white rounded-lg shadow-lg w-[90%] sm:w-[70%] mx-auto my-20 p-6"
                overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-scroll z-50"
            >
                {/* Close Button */}
                <div
                    onClick={() => setViewConf(false)}
                    className="absolute top-4 right-4 text-3xl cursor-pointer text-black duration-300 hover:text-white hover:bg-black rounded-full p-1"
                >
                    <IoCloseCircleOutline />
                </div>

                {/* Content */}
                <div className="bg-white p-4">
                    <h2 className="text-3xl font-bold mb-6 text-center">
                        {viewProduct.prd_name}
                    </h2>

                    {/* Product Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Product Description */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <div
                                className="py-3 px-4 border rounded-md bg-gray-50 text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: viewProduct.prd_desc }}
                            />
                        </div>

                        {/* Product Images */}
                        {viewProduct.prd_img.length > 0 ? (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Images</h3>
                                <div className="flex gap-2 overflow-x-auto">
                                    {viewProduct.prd_img?.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img.image_url}
                                            onError={(e) =>
                                                (e.target.src = "assets/images/placeholder.png")
                                            }
                                            alt={`Product ${index + 1}`}
                                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-md object-cover border border-gray-300 shadow-sm"
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Available Colors</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {viewProduct.prd_colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className="p-4 border rounded-lg shadow-md"
                                            style={{
                                                backgroundColor: color.out_of_stock
                                                    ? "#f8d7da"
                                                    : "#d1e7dd",
                                                borderColor: color.out_of_stock
                                                    ? "#f5c6cb"
                                                    : "#badbcc",
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Color Indicator */}
                                                <div
                                                    className="w-8 h-8 rounded-full border"
                                                    style={{ backgroundColor: color.color_code }}
                                                />
                                                <div>
                                                    <p className="text-sm font-bold">
                                                        {color.color_name}
                                                    </p>
                                                    {color.out_of_stock ? (
                                                        <span className="text-red-600 text-xs font-semibold">
                                                            Out of Stock
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-600 text-xs font-semibold">
                                                            In Stock
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Color Images */}
                                            <div className="flex gap-2 mt-3 overflow-x-auto">
                                                {color.image.map((img, i) => (
                                                    <img
                                                        key={i}
                                                        src={img.image_url}
                                                        alt={`Color ${index + 1} - Image ${i + 1}`}
                                                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-md object-cover border border-gray-300 shadow-sm"
                                                        onError={(e) =>
                                                        (e.target.src =
                                                            "assets/images/placeholder.png")
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Additional Information */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-700">
                                    <strong>Brand:</strong> {viewProduct.prd_brand_name}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Category:</strong> {viewProduct.prd_category}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Sub-category:</strong> {viewProduct.prd_sub_category}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-700">
                                    <strong>Price:</strong> ₹{viewProduct.prd_price}
                                </p>
                                {viewProduct.prd_sizes.length > 0 && <p className="text-gray-700">
                                    <strong>Available Sizes:</strong>{" "}
                                    {viewProduct.prd_sizes.map((size) => (
                                        <span
                                            key={size.number}
                                            className={`inline-block px-2 py-1 text-sm border rounded-md mr-2 ${size.ou_of_stock
                                                ? "bg-red-200 border-red-400 text-red-600"
                                                : "bg-green-200 border-green-400 text-green-600"
                                                }`}
                                        >
                                            {size.number}
                                        </span>
                                    ))}
                                </p>}
                                <p className="text-gray-700">
                                    <strong>Total Quantity:</strong> {viewProduct.prd_overall_quantity}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    {/* <div className="mt-6 text-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                        >
                            Close
                        </button>
                    </div> */}
                </div>
            </Modal>

            {isDeleteConfOpen && <ConfirmationModal setShow={setIsDeleteConfOpen} width="w-auto" type="delete_product" handleSubmit={handleDeleteProduct} />}
        </>
    )
}

export default Products;