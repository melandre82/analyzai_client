// eslint-disable-next-line
import React, { useState, useEffect, useRef } from 'react'
// eslint-disable-next-line
import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { auth, firestore } from '../conf/firebase'
import { onSnapshot, collection } from 'firebase/firestore'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import '../CSS/uploadedFiles.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

/**
 * The UploadedFiles component.
 *
 * @param {React.ComponentProps} root0 The component props.
 * @param {string} root0.textToBeHighlighted The text to be highlighted.
 * @param {Function} root0.setCurrentFileName The setCurrentFileName function.
 * @param {Function} root0.setNumPages The setNumPages function.
 * @param {number} root0.pageNumber The page number.
 * @param {Function} root0.setPageNumber The setPageNumber function.
 * @param {number} root0.scale The scale.
 * @param {Function} root0.setScale The setScale function.
 * @param {Function} root0.setInputValue The setInputValue function.
 * @returns {React.JSX.Element} The UploadedFiles component.
 */
export default function UploadedFiles ({
  textToBeHighlighted,
  setCurrentFileName,
  setNumPages,
  pageNumber,
  setPageNumber,
  scale,
  setScale,
  setInputValue

}) {
  const [files, setFiles] = useState([])
  const [currentFile, setCurrentFile] = useState(null)
  const [renderedPageNumber, setRenderedPageNumber] = useState(null)
  const [renderedScale, setRenderedScale] = useState(null)
  const [setExtractedPDFText] = useState()
  const [searchInput, setSearchInput] = useState('')

  const user = auth.currentUser

  useEffect(() => {
    if (typeof setInputValue === 'function') {
      setInputValue(pageNumber)
    }
  }, [pageNumber, setInputValue])

  useEffect(() => {
    const userId = user.uid
    const filesRef = collection(firestore, 'users', userId, 'files')
    const unsubscribe = onSnapshot(filesRef, (snapshot) => {
      const newFiles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      // sort by last created first
      newFiles.sort((a, b) => {
        if (!a.creationDate) return 1
        if (!b.creationDate) return -1
        return b.creationDate - a.creationDate
      })

      setFiles(newFiles)
    })

    return () => unsubscribe()
  }, [])

  /**
   * Handles the document load success event.
   *
   * @param {object} root0 The parameter object.
   * @param {number} root0.numPages The number of pages in the document.
   */
  function onDocumentLoadSuccess ({ numPages }) {
    setNumPages(numPages)
  }

  /**
   * Formats the text extracted from the PDF.
   *
   * @param {object} texts The text items extracted from the PDF.
   */
  function formatText (texts) {
    let textFinal = ''
    for (let i = 0; i < texts.items.length; i++) {
      textFinal += texts.items[i].str
    }
    setExtractedPDFText(textFinal)
  }

  /**
   * Resets the viewer state.
   *
   */
  function resetViewerState () {
    setPageNumber(1)
    setScale(1.5)
    setRenderedPageNumber(null)
    setRenderedScale(null)
    setExtractedPDFText(null)
  }

  /**
   * Handles the search change event.
   *
   * @param {Event} e  The event of the search change.
   */
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value.toLowerCase())
  }

  const filteredFiles = files.filter(file =>
    file.fileName.toLowerCase().includes(searchInput)
  )

  const isLoading = renderedPageNumber !== pageNumber || renderedScale !== scale

  return (
    <div>
      <div className='uploaded-files-container'>
        <div className='file-bar-container'>
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
            className="search-field"
          />
          <div className='file-bar'>
            <ul className='file-list'>
              {filteredFiles.map((file) => (
                <li
                  key={file.id}
                  onClick={() => {
                    setCurrentFile(file.downloadURL)
                    setCurrentFileName(file.id)
                    resetViewerState()
                  }}
                >
                  <img
                    className='icon'
                    src={require('../icons/icons8-pdf-96.png')}
                    alt='Icon'
                  />{' '}
                  {file.fileName}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {currentFile && (
          <div className='pdf-viewer'>
            <Document file={currentFile} onLoadSuccess={onDocumentLoadSuccess}>
              {isLoading && renderedPageNumber && renderedScale
                ? (
                <Page
                  key={`prev-${pageNumber}-${scale}-${textToBeHighlighted}`}
                  className='prevPage'
                  pageNumber={renderedPageNumber}
                  scale={renderedScale}
                  width={400}
                  onGetTextSuccess={(text) => formatText(text)}
                />
                  )
                : null}
              <Page
                key={`current-${pageNumber}-${scale}-${textToBeHighlighted}`}
                pageNumber={pageNumber}
                onRenderSuccess={() => {
                  setRenderedPageNumber(pageNumber)
                  setRenderedScale(scale)
                }}
                scale={scale}
                onGetTextSuccess={(text) => formatText(text)}
                width={400}
              />
            </Document>
          </div>
        )}
      </div>
    </div>
  )
}
