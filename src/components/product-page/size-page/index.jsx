import React, { useState } from 'react'
import ReactSwitch from 'react-switch';
import Products from '..';

const SizePage = ({ sizes, setSizes, newProductData }) => {
    const [showInput, setShowInput] = useState(false);
    const [newSize, setNewSize] = useState({ number: "", quantity: "", ou_of_stock: false });

    const handleAddSize = () => {
        if (newSize.number && newSize.quantity) {
            setSizes([...sizes, newSize]);
            setNewSize({ number: "", quantity: "", ou_of_stock: false });
            setShowInput(false);
        }
    };

    const handleCancel = () => {
        setNewSize({ number: "", quantity: "", ou_of_stock: false });
        setShowInput(false);
    };

    return (
        <>
            <div className="mb-4 border-b border-gray-400">
                <label className="block text-gray-700">Size</label>

                <div className="mb-4">
                    <button
                        type="button"
                        disabled={newProductData.prd_overall_quantity !== ""}
                        onClick={() => setShowInput(true)}
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mb-3"
                    >
                        Add Size
                    </button>

                    {showInput && (
                        <div className="mb-4">
                            <div className="mb-2">
                                <input
                                    type="text"
                                    placeholder="Size"
                                    value={newSize.size}
                                    onChange={(e) =>
                                        setNewSize({ ...newSize, number: Number(e.target.value) })
                                    }
                                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded block mb-2"
                                />
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={newSize.quantity}
                                    onChange={(e) =>
                                        setNewSize({ ...newSize, quantity: e.target.value })
                                    }
                                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded block mb-2"
                                />
                                <label className="block text-gray-700">Is Product Out Of Stock</label>
                                <ReactSwitch
                                    checked={newSize.ou_of_stock}
                                    onChange={() => {
                                        setNewSize(prevData => ({
                                            ...prevData,
                                            ou_of_stock: !prevData.ou_of_stock
                                        }));
                                    }}
                                    onColor="#86d3ff"
                                    onHandleColor="#2693e6"
                                    handleDiameter={15}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                    height={10}
                                    width={28}
                                    className="react-switch"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleAddSize}
                                    className="text-green-500 hover:text-green-600 font-semibold"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="text-red-500 hover:text-red-600 font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {sizes.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Added Sizes:</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sizes.map((s, index) => (
                                    <div
                                        key={index}
                                        className=" items-center bg-gray-50 p-2 rounded shadow-sm border border-gray-200"
                                    >
                                        <div className='flex justify-between'>
                                            <span className="text-gray-700 font-medium">
                                                Size: {s.number}
                                            </span>
                                            <span className="text-gray-500">Qty: {s.quantity}</span>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700">Is Product Out Of Stock</label>
                                            <ReactSwitch
                                                disabled={true}
                                                onChange={() => { }}
                                                checked={s.ou_of_stock}
                                                onColor="#86d3ff"
                                                onHandleColor="#2693e6"
                                                handleDiameter={15}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                                height={10}
                                                width={28}
                                                className="react-switch"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSizes((pre) => pre.filter((e, i) => i !== index && e))
                                            }} className='text-red-600'>
                                            remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default SizePage