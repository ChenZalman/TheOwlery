import React, { useRef, useState } from "react";
import axios from "axios";

const CLOUDINARY_Name = process.env.REACT_APP_CLOUDINARY_NAME;

const AddCoverPhoto = ({ onClose, onSave }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("upload_preset", "UploadToCloud");
    data.append("folder", "cover");
    try {
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_Name}/image/upload`;
      const res = await axios.post(cloudinaryUrl, data);
      setUploading(false);
      if (onSave) onSave(res.data.secure_url, res.data.public_id);
      if (onClose) onClose();
    } catch (err) {
      setUploading(false);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative" style={{backgroundColor:" #1C1E21"}}>
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-purple-900">Upload Cover Photo</h2>
        <div className="flex flex-col items-center" style={{backgroundColor:" #1C1E21"}}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-60 object-cover rounded mb-4"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded mb-4 text-gray-400" style={{backgroundColor:" #1C1E21"}}>
              No photo selected
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            className="mb-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={uploading}
          >
            Choose Photo
          </button>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 disabled:opacity-60"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCoverPhoto;