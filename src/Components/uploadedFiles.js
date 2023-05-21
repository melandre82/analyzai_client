import React, { useState, useEffect } from 'react';
import localForage from 'localforage';
import { Document, Page, pdfjs } from 'react-pdf';
import '../CSS/uploadedFiles.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function UploadedFiles() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  
// fetch files from indexedDB
  useEffect(() => {
    localForage.iterate((value, key) => {
      setFiles(files => [...files, { name: key, file: value }]);
    });
  }, []);
  
  return (
    <div className="uploaded-files-container">
      <ul className="file-list">
        {files.map(({ name, file }, index) => (
          <li key={index} onClick={() => setCurrentFile(file)}>
            <img class="icon" src={(require('../icons/icons8-pdf-96.png'))} alt="Icon" /> {name}
          </li>
        ))}
      </ul>
      {currentFile && (
        <div className="pdf-viewer">
          <Document file={currentFile}>
            <Page pageNumber={1} />
          </Document>
        </div>
      )}
    </div>
  );
}

export default UploadedFiles;

