import { useState, useEffect, useCallback } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { auth } from '../conf/firebase'
import { onSnapshot, doc, collection } from 'firebase/firestore'
import { firestore } from '../conf/firebase'

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import '../CSS/uploadedFiles.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

export default function UploadedFiles({ textToBeHighlighted, setCurrentFileName }) {
  const [files, setFiles] = useState([])
  const [currentFile, setCurrentFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.5)
  const [renderedPageNumber, setRenderedPageNumber] = useState(null)
  const [renderedScale, setRenderedScale] = useState(null)
  const [inputValue, setInputValue] = useState(pageNumber)
  const [extractedPDFText, setExtractedPDFText] = useState()

  const user = auth.currentUser

  // Annotation



  function highlightPattern(text, pattern) {
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
    const regex = new RegExp(escapedPattern, 'gi');
    return text.replace(regex, (value) => `<mark>${value}</mark>`);
  }

  const textRenderer = useCallback(
    (textItem) => {

      let result = textItem.str
      // console.log('textItem.str: ' + textItem.str)
      if (extractedPDFText && extractedPDFText.includes(textToBeHighlighted)) {
        result = highlightPattern(textItem.str, textToBeHighlighted)
        // console.log('text to highlight: ', textToBeHighlighted)
        // console.log('text: , ' + extractedPDFText)
      }

      return result // return the output
    },
    [textToBeHighlighted, extractedPDFText]
  )

  //

  useEffect(() => {
    const userId = user.uid
    const filesRef = collection(firestore, 'users', userId, 'files')
    const unsubscribe = onSnapshot(filesRef, (snapshot) => {
      const newFiles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setFiles(newFiles)
    })

    // Clean up the subscription on unmount
    return () => unsubscribe()
  }, [])

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  function changeScale(offset) {
    setScale((prevScale) => prevScale + offset)
  }

  function decreaseScale() {
    changeScale(-0.1)
  }

  function increaseScale() {
    changeScale(0.1)
  }

  function resetScale() {
    setScale(1.5)
  }

  useEffect(() => {
    setInputValue(pageNumber)
  }, [pageNumber])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

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

  function formatText(texts) {
    let textFinal = ''
    for (let i = 0; i < texts.items.length; i++) {
      textFinal += texts.items[i].str
    }
    // console.log('extracted pdf text: ' + textFinal)
    setExtractedPDFText(textFinal)
  }

  const isLoading = renderedPageNumber !== pageNumber || renderedScale !== scale

  return (
    <div>
      <div className='navigation-box'>
        <div className='navigation'>
          <div className='page-number'>
            <input
              type='text'
              value={inputValue}
              onClick={(event) => event.target.select()}
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
            onChange={(event) => setScale(Number(event.target.value))}
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
        <div className='file-bar'>
          <ul className='file-list'>
            {files.map((file) => (
              <li
                key={file.id}
                onClick={() => {
                  setCurrentFile(file.downloadURL);
                  setCurrentFileName(file.id);
                  console.log('current file: ' + file.downloadURL);
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

        {currentFile && (
          <div className='pdf-viewer'>
            <Document file={currentFile} onLoadSuccess={onDocumentLoadSuccess}>
              {isLoading && renderedPageNumber && renderedScale ? (
                <Page
                  key={`${pageNumber}@${scale}@${textToBeHighlighted}`}
                  className='prevPage'
                  // renderTextLayer={true}
                  customTextRenderer={textRenderer}
                  pageNumber={renderedPageNumber}
                  scale={renderedScale}
                  width={400}
                  onGetTextSuccess={(text) => formatText(text)}
                />
              ) : null}
              <Page
                key={`${pageNumber}@${scale}@${textToBeHighlighted}`}
                pageNumber={pageNumber}
                // renderTextLayer={true}
                customTextRenderer={textRenderer}
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
