import React, { useEffect, useState } from 'react';
import fetchApi from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { LogInValidation } from '../../config/validation';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const LoginPage = () => {
    const navigate = useNavigate();
    const auth = localStorage.getItem('auth');
    // const [formData, setFormData] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (auth) {
            navigate("/");
        }
    }, [])

    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            const response = await fetchApi({ url: `${BASE_URL}/login`, method: 'POST', data: values })

            if (response.status === 200) {
                localStorage.setItem("auth", response.token)
                localStorage.setItem("data", response.data)
                toast.success(response.message)
                navigate("/");
            } else {
                toast.error(response.message)
                
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Log In</h1>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <Formik
                    initialValues={{ user_email: '', user_pass: '' }}
                    validationSchema={LogInValidation}
                    onSubmit={(values) => !loading && handleSubmit(values)}
                >
                    {formik => (
                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="user_email" className="block text-gray-700 font-medium mb-1">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    name="user_email"
                                    id="user_email"
                                    value={formik.user_email}
                                    onChange={formik.handleChange}
                                    onFocus={formik.handleBlur}
                                    required
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                {formik.touched["user_email"] && formik.errors["user_email"] && (
                                    <p className="text-md text-red-600">{formik.errors["user_email"]}</p>
                                )}
                            </div>

                            <div className='relative'>
                                <label htmlFor="user_pass" className="block text-gray-700 font-medium mb-1">
                                    Password
                                </label>
                                <input
                                    type={show ? "text" : "password"}
                                    name="user_pass"
                                    id="user_pass"
                                    value={formik.user_pass}
                                    onChange={formik.handleChange}
                                    onFocus={formik.handleBlur}
                                    required
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                {show ?
                                    <FaEye onClick={() => setShow(pre => !pre)} className='absolute right-4 top-9 text-3xl cursor-pointer' /> :
                                    <FaEyeSlash onClick={() => setShow(pre => !pre)} className='absolute right-4 top-9 text-3xl cursor-pointer' />
                                }
                                {formik.touched["user_pass"] && formik.errors["user_pass"] && (
                                    <p className="text-md text-red-600">{formik.errors["user_pass"]}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded-lg font-medium transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LoginPage;