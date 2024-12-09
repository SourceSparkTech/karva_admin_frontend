import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineLoading } from "react-icons/ai"

const ConfirmationModal = ({ setShow, width, type, handleSubmit, data = null }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const values = {
        delete_cat: {
            title: "Delete Categories",
            message: "Are you sure you want to delete this Categories?",
            button: "Delete",
            color: "bg-red-600",
            colorHover: "hover:bg-red-500",
            rounded: "bg-red-100",
        },
        delete_sub_cat: {
            title: "Delete Sub Categories",
            message: "Are you sure you want to delete this Sub Categories?",
            button: "Delete",
            color: "bg-red-600",
            colorHover: "hover:bg-red-500",
            rounded: "bg-red-100",
        },
        delete_blog: {
            title: "Delete Blog",
            message: "Are you sure you want to delete this Blog?",
            button: "Delete",
            color: "bg-red-600",
            colorHover: "hover:bg-red-500",
            rounded: "bg-red-100",
        },
        delete_product: {
            title: "Delete Product",
            message: "Are you sure you want to delete this Product?",
            button: "Delete",
            color: "bg-red-600",
            colorHover: "hover:bg-red-500",
            rounded: "bg-red-100",
        },
        delete_brand: {
            title: "Delete Brand",
            message: "Are you sure you want to delete this Brand?",
            button: "Delete",
            color: "bg-red-600",
            colorHover: "hover:bg-red-500",
            rounded: "bg-red-100",
        },

        logOut: {
            title: "Log out account",
            message: "Are you sure you want to Log Out your account?",
            button: "Log out",
            color: "bg-red-600",
            colorHover: "hover:bg-red-500",
            rounded: "bg-red-100",
        },
    }

    const handleOperation = async () => {
        setLoading(true);
        if (type === "logOut") {
            localStorage.removeItem("auth");
            navigate("/log-in");
            // toast.success("Log Out Successfully");
        } else {
            await handleSubmit(data);
        }
        setShow(false);
        setLoading(false);
    }

    return (
        <>
            <div className={`fixed inset-0 flex items-center justify-center p-5 z-[99]`}>
                {/* Overlay */}
                <div
                    onClick={() => setShow(false)}
                    className={`absolute inset-0 animate-[modalOverlayAnimation_0.2s_ease-in-out] bg-black bg-opacity-70 backdrop-blur-sm [animation-fill-mode:forwards]`}
                ></div>

                {/* Modal Content */}
                <div
                    className={`animate-[modalDialogAnimation_0.2s_ease-in-out] [animation-fill-mode:forwards] pointer-events-auto relative w-auto transform-none opacity-100 translate-y-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px] ${width} `}
                >
                    <div className="px-8 py-6 shadow-2xl rounded-xl pointer-events-auto relative flex flex-col bg-white text-gray-800">
                        {/* Modal Title */}
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {values[type].title}
                            </h3>
                        </div>

                        {/* Modal Message */}
                        <div className="flex items-center justify-center mb-4">
                            <h5 className="text-lg leading-normal font-roboto">
                                {values[type].message}
                            </h5>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end pt-4">
                            <div className='flex gap-4'>
                                <button
                                    onClick={() => setShow(false)}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-1 text-lg font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                                >
                                    No
                                </button>
                                <button
                                    onClick={handleOperation}
                                    disabled={loading}
                                    className={`${values[type].color} ${values[type].colorHover} inline-flex items-center justify-center gap-2 px-8 py-1 text-lg font-medium text-white rounded-lg shadow-md  transition-all`}
                                >
                                    {loading ? (
                                        <div className='animate-spin'>
                                            <AiOutlineLoading />
                                        </div>
                                    ) : ("Yes")
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmationModal