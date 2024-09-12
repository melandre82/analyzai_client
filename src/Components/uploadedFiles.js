/* eslint-disable */
import { useState, useEffect, useCallback } from 'react'
// eslint-disable-next-line
import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { auth, firestore } from '../conf/firebase'
// eslint-disable-next-line
import { onSnapshot, doc, collection } from 'firebase/firestore'

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import '../CSS/uploadedFiles.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

/**
 *
 * @param root0
 * @param root0.textToBeHighlighted
 * @param root0.setCurrentFileName
 */
export default function UploadedFiles ({ textToBeHighlighted, setCurrentFileName }) {
  const [files, setFiles] = useState([])
  const [currentFile, setCurrentFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.5)
  const [renderedPageNumber, setRenderedPageNumber] = useState(null)
  const [renderedScale, setRenderedScale] = useState(null)
  const [inputValue, setInputValue] = useState(pageNumber)
  const [extractedPDFText, setExtractedPDFText] = useState()
  const [searchInput, setSearchInput] = useState('')


  const user = auth.currentUser

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
        if (!a.creationDate) return 1; 
        if (!b.creationDate) return -1;
        return b.creationDate - a.creationDate
      })

      setFiles(newFiles)
    })

    return () => unsubscribe()
  }, [])

  /**
   *
   * @param root0
   * @param root0.numPages
   */
  function onDocumentLoadSuccess ({ numPages }) {
    setNumPages(numPages)
  }

  /**
   *
   * @param offset
   */
  function changePage (offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  /**
   *
   */
  function previousPage () {
    changePage(-1)
  }

  /**
   *
   */
  function nextPage () {
    changePage(1)
  }

  /**
   *
   * @param offset
   */
  function changeScale (offset) {
    setScale((prevScale) => prevScale + offset)
  }

  /**
   *
   */
  function decreaseScale () {
    changeScale(-0.1)
  }

  /**
   *
   */
  function increaseScale () {
    changeScale(0.1)
  }

  /**
   *
   */
  function resetScale () {
    setScale(1.5)
  }

  useEffect(() => {
    setInputValue(pageNumber)
  }, [pageNumber])

  /**
   *
   * @param e
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  /**
   *
   * @param e
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newPageNumber = parseInt(e.target.value)
      if (newPageNumber >= 1 && newPageNumber <= numPages) {
        setPageNumber(newPageNumber)
        e.target.blur()
      } else {
        setInputValue(pageNumber)
      }
    }
  }

  /**
   *
   * @param texts
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

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value.toLowerCase())
  }

  const filteredFiles = files.filter(file =>
    file.fileName.toLowerCase().includes(searchInput)
  )

  const isLoading = renderedPageNumber !== pageNumber || renderedScale !== scale

  return (
    <div>
      <div className='navigation-box'>
        <div className='navigation'>
          <div className='page-number'>
            <input
              type='text'
              value={inputValue}
              onClick={(event) => {console.log(event) 
                event.target.select()}}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <span> / {numPages || '-'}</span>
          </div>
          <button
            type='button'
            className='previous'
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            &lt;
          </button>{' '}
          <button
            type='button'
            className='next'
            disabled={pageNumber >= numPages}
            onClick={nextPage}
          >
            &gt;
          </button>
          <button type='button' className='reset' onClick={resetScale}>
            {Math.round((scale * 100) / 1.5)}%
          </button>
          <button
            type='button'
            className='minus'
            disabled={scale <= 0.5}
            onClick={decreaseScale}
          >
            -
          </button>{' '}
          <input
            type='range'
            min='0.5'
            max='5'
            value={scale}
            onChange={(event) => {  console.log('Event:', event);
              console.log('Event Target Value:', event.target.value);
              setScale(Number(event.target.value));
            }}
            step='0.2'
          />{' '}
          <button
            type='button'
            className='plus'
            disabled={scale >= 5}
            onClick={increaseScale}
          >
            +
          </button>
        </div>
      </div>
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
                    console.log('File clicked: ', file.id)
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
              {isLoading && renderedPageNumber && renderedScale ? (
                <Page
                  key={`prev-${pageNumber}-${scale}-${textToBeHighlighted}`}
                  className='prevPage'
                  pageNumber={renderedPageNumber}
                  scale={renderedScale}
                  width={400}
                  onGetTextSuccess={(text) => formatText(text)}
                />
              ) : null}
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
