import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./index.css";
import BookTable from "./components/BookTable";
import Pagination from "./components/Pagination";

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 20; // show 20 books per page

  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  // Fetch books from API
  const fetchBooks = async (query = "book", page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://openlibrary.org/search.json?title=${query}&page=${page}`
      );
      setBooks(res.data.docs || []);

      // Calculate total pages based on API results
      const totalResults = res.data.numFound || 0;
      setTotalPages(Math.ceil(totalResults / booksPerPage));
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestions
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(
        `https://openlibrary.org/search.json?title=${query}&limit=5`
      );
      const docs = res.data.docs || [];
      const uniqueSuggestions = docs.map((book) => ({
        title: book.title,
        author: book.author_name?.join(", ") || "Unknown",
      }));
      setSuggestions(uniqueSuggestions);
      setHighlightedIndex(-1);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBooks("book", 1);
  }, []);

  // Fetch books when page changes
  useEffect(() => {
    fetchBooks(search || "book", currentPage);
  }, [currentPage]);

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks(search || "book", 1);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowSuggestions(true);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (title) => {
    setSearch(title);
    setCurrentPage(1);
    fetchBooks(title, 1);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSuggestionClick(suggestions[highlightedIndex].title);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-6">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight drop-shadow-md">
        📚 Book Finder
      </h1>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-10 relative"
      >
        <div className="relative w-full sm:w-96" ref={suggestionRef}>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for books..."
            className="p-3 w-full rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border border-gray-200 shadow-lg rounded-lg mt-1 z-20 max-h-60 overflow-y-auto">
              {suggestions.map((s, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(s.title)}
                  className={`px-4 py-2 cursor-pointer transition ${
                    highlightedIndex === index
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="font-medium">{s.title}</span>{" "}
                  <span className="text-gray-500 text-sm">by {s.author}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-md hover:from-red-600 hover:to-pink-600 transition font-semibold"
        >
          Search
        </button>
      </form>

      {/* Book Results */}
      <div className="max-w-6xl mx-auto">
        <BookTable docs={books.slice(0, booksPerPage)} loading={loading} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default App;
