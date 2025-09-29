// components/BookTable.jsx
import React from "react";

const BookTable = ({ docs, loading }) => {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left border-b text-gray-700">Title</th>
            <th className="py-3 px-4 text-left border-b text-gray-700">Author(s)</th>
            <th className="py-3 px-4 text-left border-b text-gray-700">First Publish Year</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="py-10 text-center">
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </td>
            </tr>
          ) : docs.length > 0 ? (
            docs.map((book, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 border-b text-gray-800 font-medium">
                  {book.title}
                </td>
                <td className="py-3 px-4 border-b text-gray-600">
                  {book.author_name?.join(", ") || "Unknown"}
                </td>
                <td className="py-3 px-4 border-b text-gray-600">
                  {book.first_publish_year || "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-6 text-center text-gray-500">
                No books found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
