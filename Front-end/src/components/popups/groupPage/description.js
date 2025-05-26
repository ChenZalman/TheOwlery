import React, { useState } from "react";

const DescriptionModal = ({ initialValue = "", onSave, onClose }) => {
  const [description, setDescription] = useState(initialValue);

  const handleSave = () => {
    if (onSave) onSave(description);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative" style={{ backgroundColor: "#1C1E21" }}>
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-purple-900">Edit Description</h2>
        <textarea 
          className="w-full h-32 p-3 border border-gray-300 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter group description..."
         style={{ backgroundColor: "#1C1E21" }}
        />
        <div className="flex justify-end gap-3 "style={{ backgroundColor: "#1C1E21" }}>
          <button
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800"
            onClick={handleSave}
            disabled={!description.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;