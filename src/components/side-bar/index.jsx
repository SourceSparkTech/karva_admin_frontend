import React, { useState } from 'react'
import BrandLogo from '../../assests/KARV LOGO-1.png'
import { BiCategory, BiMenu } from "react-icons/bi";
import { FaProductHunt } from "react-icons/fa6";
import { FaBlogger } from "react-icons/fa";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../shared/confirmation-modal/ConfirmationModal';
import { SiBrandfolder } from 'react-icons/si';
import { LuFootprints } from "react-icons/lu";
import { IoHomeSharp } from 'react-icons/io5';

const SideBar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isConfOpen, setIsConfOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const activePath = location.pathname;

    const menuItems = [
        { path: '/category', label: 'Category', icon: <BiCategory /> },
        { path: '/products', label: 'Products', icon: <FaProductHunt /> },
        { path: '/blogs', label: 'Blogs', icon: <FaBlogger /> },
        { path: '/brand', label: 'Brand', icon: <SiBrandfolder /> },
        { path: '/home-change', label: 'Home page changes', icon: <IoHomeSharp /> },
        { path: '/footer', label: 'Footer', icon: <LuFootprints /> },
    ];

    // const handleLogOut = () => {
    //     localStorage.removeItem('auth');
    //     navigate('/log-in');
    // }

    return (
        <>
            {/* Toggle Button for Mobile */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-10 md:hidden p-2 bg-gray-200  rounded-lg"
            >
                {/* <SVG src="/assets/icons/menu.svg" className="w-6 h-6" /> */}
                <BiMenu />
            </button>


            <aside className={`fixed top-0 left-0 z-20 h-full bg-white shadow-lg transition-all duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 w-64 p-4`}>
                <h2 className="text-center text-2xl font-semibold mb-4 text-black">Admin Panel</h2>
                <div className="flex justify-center mb-6">
                    <Link to="/">
                        <img src={BrandLogo} alt="Brand Logo" className="w-[65px] h-[50px] rounded-full" />
                    </Link>
                </div>

                <div className="">
                    {/* Menu Items */}
                    <div className="space-y-3 mb-10">
                        {menuItems.map((item) => (
                            <Link onClick={() => setIsSidebarOpen(!isSidebarOpen)} key={item.path} to={item.path}>
                                <div
                                    className={`my-2 flex items-center gap-3 px-4 py-2 rounded-lg transition-all cursor-pointer ${activePath.includes(item.path)
                                        ? 'bg-black text-white'
                                        : 'hover:bg-gray-200 text-gray-800'
                                        }`}
                                >
                                    {item.icon}
                                    <p>{item.label}</p>
                                </div>
                            </Link>
                        ))}

                    </div>

                    {/* Logout */}
                    <div onClick={() => setIsConfOpen(true)} className="text-xl flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 cursor-pointer hover:text-red-700 hover:font-bold transition-all">
                        <MdLogout />
                        <p>Logout</p>
                    </div>
                </div>
            </aside>

            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-5 md:hidden"
                ></div>
            )}
            {isConfOpen && <ConfirmationModal setShow={setIsConfOpen} width="w-auto" type="logOut" />}
        </>
    );
};

export default SideBar;