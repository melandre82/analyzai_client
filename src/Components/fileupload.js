import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../App.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    console.log('Sending file:', file);

    try {
      console.log(`${process.env.REACT_APP_SERVER_URL}/upload`)
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const handleClick = () => {
    if (!file) {
      fileInputRef.current.click();
    } else {
      handleUpload();
    }
  };

  return (
    <div className='upload-container'>
      <div className='file-box'>
        {file ? (
          <>
            <span className='file-icon'>📄</span>
            <span>{file.name}</span>
          </>
        ) : (
          <span>No file uploaded</span>
        )}
      </div>
      <button onClick={handleClick} className='upload-button1'>
        {file ? 'Upload' : 'Choose File'}
      </button>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden-input'
        accept='application/pdf'
        hidden
      />
    </div>
  );
};

export default FileUpload;

