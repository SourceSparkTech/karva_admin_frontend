import React, { useRef, useState } from 'react'
import ReactSwitch from 'react-switch';
import ImageUploader from '../../shared/image-uploader';
import { IoCloseCircleOutline } from 'react-icons/io5';
import deleteImage from '../../../utils/deleteImage';
import axios from 'axios';
import { AiOutlineLoading } from 'react-icons/ai';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const ColourPage = ({ colors, setColors, productImages }) => {
    const [showInputColor, setShowInputColor] = useState(false);
    const [newColor, setNewColor] = useState({ color_name: "", color_code: "#000000", out_of_stock: false, image: [] });
    const [loading, setLoading] = useState(false);
    const mainProductInput = useRef();

    const token = localStorage.getItem("auth");

    const handleAddColor = () => {
        if (newColor.color_name) {
            setColors([...colors, newColor]);
            setNewColor({ color_name: "", color_code: "#000000", out_of_stock: false, image: [] });
            setShowInputColor(false);
        }
    };

    const handleCancelColour = () => {
        setNewColor({ color_name: "", color_code: "#000000", out_of_stock: false, image: [] });
        setShowInputColor(false);
    };

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
        // setNewColor((prev) => ({...prev, prev.image : [...prev.image, { image_url: uploadResponse.secure_url, public_id: uploadResponse.public_id }]}));
        setNewColor(pre => ({ ...pre, image: [...pre.image, { image_url: uploadResponse.secure_url, public_id: uploadResponse.public_id }] }))
    };

    return (
        <>
            <div className="mb-4 border-b border-gray-400">
                <label className="block text-gray-700">Color & Image</label>

                <div className="mb-4">
                    <button
                        type="button"
                        disabled={productImages.length > 0}
                        onClick={() => setShowInputColor(true)}
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mb-3"
                    >
                        Add Color
                    </button>

                    {showInputColor && (
                        <div className="mb-4">
                            <div className="mb-2">
                                <div className='w-full md:w-1/2  flex justify-between gap-1'>
                                    <input
                                        type="text"
                                        placeholder="Color Name"
                                        value={newColor.color_name}
                                        onChange={(e) => setNewColor({ ...newColor, color_name: e.target.value })}
                                        className="w-10/12 p-2 border border-gray-300 rounded block mb-2"
                                    />
                                    {/* input */}
                                    <input
                                        type="color"
                                        value={newColor.color_code}
                                        onChange={(e) => setNewColor({ ...newColor, color_code: e.target.value })}
                                        className="h-11 w-11 p-1 border border-gray-300 rounded block mb-2"
                                    />
                                </div>
                                <label className="block text-gray-700">Is Product Out Of Stock</label>
                                <ReactSwitch
                                    checked={newColor.out_of_stock}
                                    onChange={() => {
                                        setNewColor(prevData => ({
                                            ...prevData,
                                            out_of_stock: !prevData.out_of_stock
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
                                {/* <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded block mb-2"
                                /> */}
                                <div className="mb-4">
                                    <input type='file' className='hidden' ref={mainProductInput} onChange={handleChange} />
                                    {/* <label className="block text-gray-700">Add Image</label> */}
                                    <div className="mb-4 flex justify-between">
                                        <button
                                            disabled={colors.length > 0}
                                            onClick={() => mainProductInput.current.click()}
                                            type="button"
                                            className="text-blue-500 hover:text-blue-600 my-3 font-bold"
                                        >
                                            Add Image
                                        </button>
                                        {
                                            newColor.image.length > 0 &&
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    const response = await deleteImage({ data: { public_id: [newColor.image.map(e => e.public_id)] } });
                                                    // console.log(response)
                                                    if (response.status === 200) {
                                                        setNewColor({ ...newColor, image: [] })
                                                    }
                                                }}
                                                className="text-red-500 hover:text-red-600 font-semibold"
                                            >
                                                delete all image
                                            </button>
                                        }
                                    </div>
                                    <div className="">
                                        {newColor.image.length > 0 &&
                                            <div className='flex items-center w-full gap-2'>
                                                {newColor.image.map((e, i) => (
                                                    <div key={i} className='relative w-1/2 md:w-1/4 border border-black p-2'>
                                                        <img className='w-full' src={e.image_url} />
                                                        <IoCloseCircleOutline
                                                            onClick={async () => {
                                                                const response = await deleteImage({ data: { public_id: [e.public_id] } });
                                                                // console.log(response)
                                                                if (response.status === 200) {
                                                                    setNewColor((pre) => ({ ...pre, image: pre.image.filter(ele => ele.public_id !== e.public_id) }))
                                                                    // setNewBlog({...newBlog, blog_image: "" })
                                                                }
                                                            }}
                                                            className='absolute top-1 right-1 text-2xl cursor-pointer' />
                                                    </div>
                                                ))}
                                            </div>
                                        }
                                    </div>
                                </div>
                                {/* <ImageUploader setItem={setNewColor} givenName={"image"} setLoading={setLoading} />
                                {(newColor.image.secure_url || newColor.image.image_url) &&
                                    <div className='flex items-center relative w-40'>
                                        <img
                                            className=''
                                            src={newColor.image.secure_url || newColor.image.image_url}
                                            onError={(e) => {
                                                e.target.src = 'assets/images/placeholder.png';
                                            }}
                                        />
                                        <IoCloseCircleOutline
                                            onClick={async () => {
                                                const response = await deleteImage({ data: { public_id: [newColor.image.public_id] } });
                                                // console.log(response)
                                                if (response.status === 200) {
                                                    setNewColor({ ...newColor, image: "" })
                                                }
                                            }}
                                            className='absolute top-0 right-0 text-2xl cursor-pointer' />
                                    </div>
                                } */}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleAddColor}
                                    className="text-green-500 hover:text-green-600 font-semibold"
                                >
                                    {loading ? (
                                        <div className='animate-spin'>
                                            <AiOutlineLoading />
                                        </div>
                                    ) : "Add"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelColour}
                                    className="text-red-500 hover:text-red-600 font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {colors.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Added Colors:</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 p-2 rounded shadow-sm border border-gray-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded"
                                                style={{ backgroundColor: color.color_code }}
                                            ></div>
                                            <span className="text-gray-700 font-medium">{color.color_name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            {color.image && (
                                                color.image.map((ele, index) => (
                                                    <img
                                                        key={index}
                                                        src={ele.secure_url || ele.image_url}
                                                        onError={(e) => {
                                                            e.target.src = 'assets/images/placeholder.png';
                                                        }}
                                                        alt={`Color ${color.color_name}`}
                                                        className="mt-2 w-24 object-contain rounded"
                                                    />
                                                ))
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700">Is Product Out Of Stock</label>
                                            <ReactSwitch
                                                checked={color.out_of_stock}
                                                disabled={true}
                                                onChange={() => { }}
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
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setColors((prev) => prev.filter((_, i) => i !== index));
                                            }}
                                            className="text-red-600 mt-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ColourPage