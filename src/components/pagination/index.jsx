import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import ReactPaginate from 'react-paginate';

function PaginationComponent({ handlePageClick, endOffset, currentPage = 1 }) {
    return (
        <div className="flex justify-center w-full my-4">
            <div className="bg-white shadow-md rounded-lg py-3 px-4">
                <ReactPaginate
                    breakLabel={'...'}
                    nextLabel={
                        <FaChevronRight className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" />
                    }
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={2}
                    pageCount={endOffset}
                    previousLabel={
                        <FaChevronLeft className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" />
                    }
                    initialPage={currentPage - 1}
                    renderOnZeroPageCount={null}
                    className="flex space-x-2 items-center"
                    activeClassName="bg-blue-500 text-white border-blue-500"
                    activeLinkClassName="bg-blue-500 text-white rounded-md px-3 py-2 font-bold shadow-sm"
                    pageClassName="rounded-md"
                    pageLinkClassName="px-3 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-500 transition duration-200"
                    previousClassName="rounded-l-md"
                    previousLinkClassName="flex items-center px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-200 font-bold"
                    nextClassName="rounded-r-md"
                    nextLinkClassName="flex items-center px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-200 font-bold"
                    breakClassName="px-3 py-2 text-gray-500"
                    breakLinkClassName="px-3 py-2 text-gray-500"
                />
            </div>
        </div>
    );
}

export default PaginationComponent;
