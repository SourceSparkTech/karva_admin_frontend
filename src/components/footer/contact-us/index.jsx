import React, { useEffect, useState } from "react";
import fetchApi from "../../../utils/helper";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const ContactUs = () => {
    const [data, setData] = useState([]);
    const [loadingMainData, setLoadingMainData] = useState(false);

    useEffect(() => {
        fetchData();
    }, [])


    const fetchData = async () => {
        setLoadingMainData(true);
        try {
            const response = await fetchApi({
                url: `${BASE_URL}/contact`,
                method: "GET",
                isAuthRequired: true
            });
            setData(response.data)
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingMainData(false);
        }
    }

    return (
        <div className="p-4 bg-gray-100">
            <h1 className="text-2xl font-bold text-center mb-6">Contact Us Messages</h1>
            <div className="grid gap-6">
                {loadingMainData
                    ? Array(4) // Display 5 skeletons while loading
                        .fill("")
                        .map((_, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-md rounded-lg p-6 border border-gray-300 animate-pulse"
                            >
                                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))
                    : data.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white shadow-md rounded-lg p-6 border border-gray-300"
                        >
                            <h2 className="text-xl font-semibold text-gray-700">
                                {item.contactUs_fname} {item.contactUs_lname}
                            </h2>
                            <p className="text-sm text-gray-500">{item.contactUs_email}</p>
                            <p className="mt-2">
                                <span className="font-medium text-gray-700">Subject: </span>
                                {item.contactUs_subject}
                            </p>
                            <p className="mt-2">
                                <span className="font-medium text-gray-700">Message: </span>
                                {item.contactUs_msg}
                            </p>
                            <p className="text-sm text-gray-400 mt-4">
                                Created At: {new Date(item.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ContactUs;
