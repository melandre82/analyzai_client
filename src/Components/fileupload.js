// // FileUpload.js
// import React, { useState } from 'react';
// import '../App.css';

// const FileUpload = () => {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   return (
//     <div className="upload-container">
//       <div className="file-box">
//         {file ? (
//           <>
//             <span className="file-icon">📄</span>
//             <span>{file.name}</span>
//           </>
//         ) : (
//           <span>No file uploaded</span>
//         )}
//       </div>
//       <button type='submit' id='submit-button1'>
//             Upload
//           </button>
//       <input
//         type="file"
//         id="file-input"
//         onChange={handleFileChange}
//         className="hidden-input"
//         accept="*"
//         hidden
//       />
//     </div>
//   );
// };

// export default FileUpload;
// FileUpload.js
import React, { useState, useRef } from 'react';
import '../App.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="upload-container">
      <div className="file-box">
        {file ? (
          <>
            <span className="file-icon">📄</span>
            <span>{file.name}</span>
          </>
        ) : (
          <span>No file uploaded</span>
        )}
      </div>
      <button onClick={handleClick} className="upload-button1">
        Upload
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden-input"
        accept="*"
        hidden
      />
    </div>
  );
};

export default FileUpload;
