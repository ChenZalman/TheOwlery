import React, { useState } from "react";

const SearchPostsModal = ({
  open,
  onClose,
  onSearch,
  searchResults,
  loading,
  searchText,
  setSearchText
}) => {
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (searchText.trim()) {
      onSearch();
      setHasSearched(true);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Search Posts in group by Text</h2>
        <input
          type="text"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="Enter post text..."
          className="w-full px-4 py-2 rounded mb-4 border border-gray-700 bg-gray-800 text-white"
          autoFocus
        />
        <div className="flex justify-end gap-2 mb-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-bold"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {hasSearched && (
          searchResults && searchResults.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gold">Results:</h3>
              <ul className="space-y-3">
                {searchResults.map(post => (
                  <li key={post._id} className="bg-gray-800 p-3 rounded text-white border border-gray-700">
                    <div className="font-bold mb-1">{post.text}</div>
                    <div className="text-sm text-gray-400">By: {post.userName || 'Unknown User'}</div>
                    <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-gray-400">No posts found.</div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchPostsModal;
