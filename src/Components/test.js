import { useState, useEffect } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import localForage from 'localforage'



import '../CSS/uploadedFiles.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

// export default function UploadedFiles() {
  const [files, setFiles] = useState([])
  const [currentFile, setCurrentFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [renderedPageNumber, setRenderedPageNumber] = useState(null)
  const [renderedScale, setRenderedScale] = useState(null)

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

  useEffect(() => {
    localForage.iterate((value, key) => {
      setFiles((files) => [...files, { name: key, file: value }])
    })
  }, [])

  const isLoading = renderedPageNumber !== pageNumber || renderedScale !== scale

  return (
    <div className='App'>
      <div>
        <p>
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </p>
        <button type='button' disabled={pageNumber <= 1} onClick={previousPage}>
          Previous
        </button>{' '}
        <button
          type='button'
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          Next
        </button>
        <p>Scale {scale}</p>
        <button type='button' disabled={scale <= 0.5} onClick={decreaseScale}>
          -
        </button>{' '}
        0.5{' '}
        <input
          type='range'
          min='0.5'
          max='2'
          value={scale}
          onChange={(event) => setScale(Number(event.target.value))}
          step='0.1'
        />{' '}
        2{' '}
        <button type='button' disabled={scale >= 2} onClick={increaseScale}>
          +
        </button>
      </div>
      <Document file={mypdf} onLoadSuccess={onDocumentLoadSuccess}>
        {isLoading && renderedPageNumber && renderedScale ? (
          <Page
            key={renderedPageNumber + '@' + renderedScale}
            className='prevPage'
            pageNumber={renderedPageNumber}
            scale={renderedScale}
            width={400}
          />
        ) : null}
        <Page
          key={pageNumber + '@' + scale}
          pageNumber={pageNumber}
          onRenderSuccess={() => {
            setRenderedPageNumber(pageNumber)
            setRenderedScale(scale)
          }}
          scale={scale}
          width={400}
        />
      </Document>
    </div>
  )
}
