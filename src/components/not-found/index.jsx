import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-indigo-600">404</h1>
                <p className="text-2xl font-semibold text-gray-800 mt-4">
                    Oops! Page not found.
                </p>
                <p className="mt-2 text-gray-600">
                    Sorry, the page you're looking for doesn't exist.
                </p>
                <div className="mt-6">
                    <Link
                        to="/"
                        className="px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300"
                    >
                        Back to Home
                    </Link>
                </div>
                <div className="mt-10">
                    <img
                        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                        alt="Not Found Illustration"
                        className="w-72 mx-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default NotFound;