import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const links = [
    { href: "/footer/term-condition", name: "Term & Condition" },
    { href: "/footer/privacy-policy", name: "Privacy & Policy" },
    { href: "/footer/address", name: "Address" },
    { href: "/footer/follow-us", name: "Follow Us" },
    { href: "/footer/contact-us", name: "Contact Us" },
    { href: "/footer/about-us", name: "About Us" },
]

const Footer = () => {
    return (
        <>
            <nav className="bg-gray-100 border-b border-gray-300 mb-5 overflow-x-auto 
                        [&::-webkit-scrollbar]:h-2
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-gray-300
                        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                <ul className="flex space-x-6 py-3 px-4 whitespace-nowrap">
                    {links.map((e, i) => (
                        <li key={i}>
                            <NavLink
                                to={e.href}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'text-blue-600 font-semibold'
                                        : 'text-gray-600 hover:text-blue-500'
                                }
                            >
                                {e.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <Outlet />
        </>
    )
}

export default Footer