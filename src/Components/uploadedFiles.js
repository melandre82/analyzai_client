import React, { useState, useEffect, useRef } from 'react'
import localForage from 'localforage'
import { Document, Page, pdfjs } from 'react-pdf'
import '../CSS/uploadedFiles.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

function UploadedFiles() {
  const [files, setFiles] = useState([])
  const [currentFile, setCurrentFile] = useState(null)
  const [scale, setScale] = useState(1)

  // fetch files from indexedDB
  useEffect(() => {
    localForage.iterate((value, key) => {
      setFiles((files) => [...files, { name: key, file: value }])
    })
  }, [])

  const handleZoomChange = (e) => {
    setScale(e.target.value)
  }

  return (
    <div className='uploaded-files-container'>
      <div className='file-bar'>
        <ul className='file-list'>
          {files.map(({ name, file }, index) => (
            <li key={index} onClick={() => setCurrentFile(file)}>
              <img
                class='icon'
                src={require('../icons/icons8-pdf-96.png')}
                alt='Icon'
              />{' '}
              {name}
            </li>
          ))}
        </ul>
      </div>

      <div className='zoom-slider'>
        <input
          type='range'
          min='0.5'
          max='2'
          step='0.1'
          value={scale}
          onChange={handleZoomChange}
        />
      </div>

      {currentFile && (
        <div className='pdf-viewer'>
          <Document file={currentFile}>
            <Page pageNumber={1} scale={scale} />
          </Document>
        </div>
      )}
    </div>
  )
}

export default UploadedFiles

