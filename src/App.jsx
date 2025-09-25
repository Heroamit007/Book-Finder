import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [book, setBook] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get('https://openlibrary.org/search.json?title={bookTitle}')
      .then(response => {
        setBook(response.data.docs);
        setFilteredBooks(response.data.docs);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = search.trim().toLowerCase();
    if (query === "") {
      setFilteredBooks(book);
      return;
    }
    const result = book.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.author_name?.some((author) => author.toLowerCase().includes(query))
    );
    setFilteredBooks(result);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Book Finder</h1>
      
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex mb-3 max-w-lg mx-auto">
        <input
          type="text"
          name="search"
          className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter book title or author"
          onChange={handleSearch}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
          Search
        </button>
      </form>

      {/* Book Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">First Published Year</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Publisher</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b border-gray-200">{item.title}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{item.author_name ? item.author_name.join(", ") : "N/A"}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{item.first_publish_year || "N/A"}</td>
                  {/* <td className="px-6 py-4 border-b border-gray-200">{item.publisher ? item.publisher.join(", ") : "N/A"}</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
