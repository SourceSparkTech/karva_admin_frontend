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

const BlogPage = () => {
    const [isLoadingMainBlog, setIsLoadingMainBlog] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blogData, setBlogData] = useState([]);
    const [isDeleteBlogConfOpen, setIsDeleteBlogConfOpen] = useState(false);
    const [deleteSlug, setDeleteSlug] = useState("")
    const [newBlog, setNewBlog] = useState({ blog_title: "", blog_content: "", blog_image: "" })
    const [loading, setLoading] = useState(false)
    const [editSlug, setEditSlug] = useState("")
    const [content, setContent] = useState("");
    const [viewBlog, setViewBlog] = useState({
        image: {
            public_id: "",
            image_url: ""
        },
    });
    const [viewConf, setViewConf] = useState(false)

    const fetchBlogData = async () => {
        setIsLoadingMainBlog(true)
        try {
            const response = await fetchApi({
                url: `${BASE_URL}/blogs`,
                method: "GET",
            });
            setBlogData(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingMainBlog(false);
        }
    }

    useEffect(() => {
        isModalOpen ? document.body.style.overflow = "hidden" : document.body.style.overflow = "auto";
        fetchBlogData();
    }, []);

    const openModal = () => {
        setNewBlog({ blog_title: "", blog_content: "", blog_image: "" });
        setIsModalOpen(true);
    }

    const handleDeleteBlog = async () => {
        try {
            let response = await fetchApi({ url: `${BASE_URL}/blogs/${deleteSlug}`, method: 'DELETE', isAuthRequired: true })
            if (response.status === 200) {
                fetchBlogData();
            }
        } catch (error) {

        }
    }


    const handleBlogAdd = async (e) => {
        e.preventDefault();
        if (newBlog.blog_title.trim() === "" || newBlog.blog_content.trim() === "" || newBlog.image.length === 0) {
            alert("Please enter all details");
            return;
        }
        setLoading(true);
        try {
            const newPayload = {
                title: newBlog.blog_title,
                content: newBlog.blog_content,
                image: {
                    image_url: newBlog.blog_image.secure_url || newBlog.blog_image.image_url,
                    public_id: newBlog.blog_image.public_id
                },
            };
            const response = await fetchApi({ url: editSlug !== "" ? `${BASE_URL}/blogs/${editSlug}` : `${BASE_URL}/blogs`, isAuthRequired: true, method: editSlug !== "" ? "PUT" : "POST", data: newPayload });

            if (response.status === 200) {
                toast.success("Blog Added Successfully");
                setNewBlog({ blog_title: "", blog_content: "", blog_image: "" });
                setIsModalOpen(false);
                fetchBlogData();
                setContent("");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setEditSlug("");
        }
    }

    return (
        <>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Blogs</h2>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={openModal}
                    >
                        Add Blog
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-5 border border-gray-400 text-left text-sm font-semibold">Sr No.</th>
                                <th className="py-3 px-5 border border-gray-400 text-left text-sm font-semibold">Blog Title</th>
                                <th className="py-3 px-5 border border-gray-400 text-left text-sm font-semibold">Blog Content</th>
                                <th className="py-3 px-5 border border-gray-400 text-center text-sm font-semibold">Image</th>
                                <th className="py-3 px-5 border border-gray-400 text-center text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingMainBlog ? (
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
                            ) : blogData.length > 0 ? (
                                blogData.map((blog, index) => (
                                    <tr className="bg-white hover:bg-gray-50 transition duration-200" key={index}>
                                        <td className="py-3 px-5 border border-gray-300 text-center text-sm">{index + 1}</td>
                                        <td className="py-3 px-5 border border-gray-300 text-sm font-medium">
                                            {blog.title.length > 30 ? `${blog?.title.slice(0, 30)}...` : blog?.title}
                                        </td>
                                        <td className="py-3 px-5 border border-gray-300 text-sm">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: blog.content.length > 50
                                                        ? `${blog?.content.slice(0, 50)}...`
                                                        : blog?.content,
                                                }}
                                            />
                                        </td>
                                        <td className="py-3 px-5 border border-gray-300 text-center">
                                            <img
                                                src={blog.image.image_url}
                                                onError={(e) => {
                                                    e.target.src = 'assets/images/placeholder.png';
                                                }}
                                                alt="Blog"
                                                className="h-12 w-12 object-cover rounded-full mx-auto shadow-sm"
                                            />
                                        </td>
                                        <td className="py-3 px-5 border border-gray-300 text-center">
                                            <div className="flex gap-3 justify-center">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 text-xl"
                                                    onClick={() => {
                                                        setIsModalOpen(true);
                                                        setEditSlug(blog.slug);
                                                        setNewBlog({
                                                            blog_title: blog.title,
                                                            blog_image: blog.image,
                                                            blog_content: blog.content,
                                                        });
                                                        setContent(blog.content);
                                                    }}
                                                >
                                                    <BiEdit />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800 text-xl"
                                                    onClick={() => {
                                                        setIsDeleteBlogConfOpen(true);
                                                        setDeleteSlug(blog.slug);
                                                    }}
                                                >
                                                    <MdDelete />
                                                </button>
                                                <button
                                                    className="text-green-600 hover:text-green-800 text-xl"
                                                    onClick={() => {
                                                        setViewBlog(blog);
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
                                        No blogs available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


            </div>

            {/* Add Blog Modal */}
            <Modal
                isOpen={isModalOpen}
                ariaHideApp={false}
                // onRequestClose={() => setIsModalOpen(false)}
                className="animate-[modalDialogAnimation_0.2s_ease-in-out] [animation-fill-mode:forwards] bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] mx-auto my-20 p-8 "
                overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-scroll z-50"
            >
                <div className="bg-white rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Blog</h2>
                    <form onSubmit={handleBlogAdd}>
                        <input
                            type="text"
                            placeholder="Name"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newBlog.blog_title}
                            onChange={(e) => setNewBlog({ ...newBlog, blog_title: e.target.value })}
                        />
                        <ReactQuill
                            theme="snow"
                            onChange={(value) => {
                                setNewBlog((prevBlog) => ({
                                    ...prevBlog,
                                    blog_content: value,
                                }));
                            }}
                            className="border border-gray-300 overflow-hidden rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 "
                            value={newBlog.blog_content}
                        />
                        {/* <input
                            type="text"
                            placeholder="Image URL"
                            className="border border-gray-300 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newBlog.blog_image}
                            onChange={(e) => setNewBlog({ ...newBlog, blog_image: e.target.value })}
                        /> */}
                        <ImageUploader setItem={setNewBlog} givenName={"blog_image"} setLoading={setLoading} />
                        {(newBlog.blog_image.secure_url || newBlog.blog_image.image_url) &&
                            <div className='flex items-center relative w-40'>
                                <img className='' src={newBlog.blog_image.secure_url || newBlog.blog_image.image_url} />
                                <IoCloseCircleOutline
                                    onClick={async () => {
                                        const response = await deleteImage({ data: { public_id: [newBlog.blog_image.public_id] } });
                                        // console.log(response)
                                        if (response.status === 200) {
                                            setNewBlog({ ...newBlog, blog_image: "" })
                                        }
                                    }}
                                    className='absolute top-0 right-0 text-2xl cursor-pointer' />
                            </div>
                        }
                        <div className='flex justify-between'>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-lg mr-2"
                                onClick={() => {
                                    setNewBlog({ blog_title: "", blog_content: "", blog_image: "" });
                                    setIsModalOpen(false)
                                    setContent("");
                                    setEditSlug("");
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
                                ) : editSlug === "" ? "Add Blog" : "Edit Blog"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Show Blog Modal */}
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
                    <h2 className="text-2xl font-bold mb-4 text-center">Blog Details</h2>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">Blog Title</h3>
                        <p className="text-gray-700">{viewBlog.title}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">Blog Content</h3>
                        <div className="py-2 px-4 border ">
                            <div dangerouslySetInnerHTML={{ __html: (viewBlog.content) }} />
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">Blog Image</h3>
                        <img
                            src={viewBlog.image.image_url}
                            onError={(e) => {
                                e.target.src = 'assets/images/placeholder.png';
                            }}
                            alt="Blog"
                            className="h-32 w-32 rounded-lg object-cover border border-gray-300"
                        />
                    </div>
                </div>
            </Modal>

            {isDeleteBlogConfOpen && <ConfirmationModal setShow={setIsDeleteBlogConfOpen} width="w-auto" type="delete_blog" handleSubmit={handleDeleteBlog} />}
        </>
    )
}

export default BlogPage