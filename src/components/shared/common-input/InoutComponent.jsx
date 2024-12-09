import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

const InputComponent = ({ label, name, placeholder, type, formik = false }) => {
    const [show, setShow] = useState(false);
    const { handleChange, handleBlur, values, errors, touched } = formik;

    return (
        <div className='relative'>
            <div className="mb-4">
                <label htmlFor={name}>{label}</label>
                <input
                    type={show ? "text" : type}
                    name={name}
                    id={name}
                    onChange={handleChange}
                    onFocus={handleBlur}
                    value={values[name]}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 border border-gray-300 rounded" />
            </div>
            {type === "password" && (
                show ?
                    <FaEye onClick={() => setShow(pre => !pre)} className='absolute right-4 top-11 text-2xl cursor-pointer' /> :
                    <FaEyeSlash onClick={() => setShow(pre => !pre)} className='absolute right-4 top-11 text-2xl cursor-pointer' />
            )}
            {
                touched[name] && errors[name] && (
                    <p className="text-md text-red-600">{errors[name]}</p>
                )
            }
        </div>
    )
}

export default InputComponent;