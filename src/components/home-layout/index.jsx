import React, { useEffect } from 'react'
import SideBar from '../side-bar'
import { Outlet, useNavigate } from 'react-router-dom'

const HomeLayout = () => {
    const auth = localStorage.getItem('auth');
    const navigate = useNavigate();
    useEffect(() => {
        if(!auth){
            navigate("/log-in");
        }
    }, [])


    return (
        <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-100 text-black transition-colors duration-300">
            <SideBar />
            {/* <div className="w-[20%]">
            </div> */}
            <div className="h-full md:mt-0 mt-10 md:ml-64 p-5 rounded-lg">
                <Outlet />
            </div>
        </div>
    )
}

export default HomeLayout