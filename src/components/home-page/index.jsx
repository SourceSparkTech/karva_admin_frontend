import React from 'react';
import SideBar from '../side-bar/index'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';


const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4780 },
    { name: 'May', sales: 5890 },
    { name: 'Jun', sales: 4390 },
    { name: 'Jul', sales: 5490 },
    { name: 'Aug', sales: 6000 },
];


const topProductsData = [
    { name: 'Product 1', sales: 2400 },
    { name: 'Product 2', sales: 4567 },
    { name: 'Product 3', sales: 1398 },
    { name: 'Product 4', sales: 9800 },
    { name: 'Product 5', sales: 3908 },
];


const newCustomers = 78;

const HomePage = () => {
    return (
        <div>
            <h1 className="text-center font-[600] text-[30px] mb-6">Dashboard</h1>

            <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">New Customers</h2>
                    <p className="text-4xl font-semibold text-blue-600">{newCustomers}</p>
                </div>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-md mb-10">
                <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Top Products</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProductsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HomePage;
