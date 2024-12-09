import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const links = [
    { href: "/home-change/banner", name: "Banner" },
    { href: "/home-change/gallery", name: "Gallery" },
]


const HomeChangeBanner = () => {
    return (
        <>
            <nav className="bg-gray-100 border-b border-gray-300 mb-5">
                <ul className="flex space-x-6 py-3">
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

export default HomeChangeBanner