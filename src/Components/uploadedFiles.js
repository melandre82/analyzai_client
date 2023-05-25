// import { useState, useEffect } from 'react'
// import { pdfjs, Document, Page } from 'react-pdf'
// import localForage from 'localforage'
// import 'react-pdf/dist/esm/Page/TextLayer.css'

// import '../CSS/uploadedFiles.css'

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

// // solution from https://codesandbox.io/s/react-pdf-prevent-flash-with-scale-nse51l?file=/src/App.js:0-2717

// export default function UploadedFiles() {
//   const [files, setFiles] = useState([])
//   const [currentFile, setCurrentFile] = useState(null)
//   const [numPages, setNumPages] = useState(null)
//   const [pageNumber, setPageNumber] = useState(1)
//   const [scale, setScale] = useState(1.5)
//   const [renderedPageNumber, setRenderedPageNumber] = useState(null)
//   const [renderedScale, setRenderedScale] = useState(null)
//   const [inputValue, setInputValue] = useState(pageNumber);


//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages)
//   }

//   function changePage(offset) {
//     setPageNumber((prevPageNumber) => prevPageNumber + offset)
//   }

//   function previousPage() {
//     changePage(-1)
//   }

//   function nextPage() {
//     changePage(1)
//   }

//   function changeScale(offset) {
//     setScale((prevScale) => prevScale + offset)
//   }

//   function decreaseScale() {
//     changeScale(-0.1)
//   }

//   function increaseScale() {
//     changeScale(0.1)
//   }

//   function resetScale() {
//     setScale(1.5)
//   }

//   useEffect(() => {
//     setInputValue(pageNumber);
//   }, [pageNumber]);

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   }

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       const newPageNumber = parseInt(e.target.value);
//       if (newPageNumber >= 1 && newPageNumber <= numPages) {
//         setPageNumber(newPageNumber);
//         e.target.blur();
//       } else {
//         setInputValue(pageNumber);  // Reset inputValue if it's not valid
//       }
//     }
  
//   }

//   useEffect(() => {
//     localForage.iterate((value, key) => {
//       setFiles((files) => [...files, { name: key, file: value }])
//     })
//   }, [])

//   const isLoading = renderedPageNumber !== pageNumber || renderedScale !== scale

//   return (
//     <div>
//       <div className='navigation-box'>
//         <div className='navigation'>
//           {/* <div className='page-controller'> */}
//           {/* <div className='page-number'>
//               <p>
//                 {pageNumber || (numPages ? 1 : '--')} / {numPages || '--'}
//               </p>
//             </div> */}
//          <div className='page-number'>
//             <input
//               type="text"
//               value={inputValue}
//               onClick={(event) => event.target.select()}
//               onChange={handleInputChange}
//               onKeyPress={handleKeyPress}
//             />
//             <span> / {numPages || '-'}</span>
//             {/* <span> / {99999 || '-'}</span> */}
//           </div>
//           <button
//             type='button'
//             className='previous'
//             disabled={pageNumber <= 1}
//             onClick={previousPage}
//           >
//             &lt;
//           </button>{' '}
//           <button
//             type='button'
//             className='next'
//             disabled={pageNumber >= numPages}
//             onClick={nextPage}
//           >
//             &gt;
//           </button>
//           {/* </div> */}
//           {/* <div className='size-control'> */}
//           <button type='button' className='reset' onClick={resetScale}>
//             {Math.round((scale * 100) / 1.5)}%
//           </button>
//           <button
//             type='button'
//             className='minus'
//             disabled={scale <= 1}
//             onClick={decreaseScale}
//           >
//             -
//           </button>{' '}
//           <input
//             type='range'
//             min='1'
//             max='3'
//             value={scale}
//             onChange={(event) => setScale(Number(event.target.value))}
//             step='0.1'
//           />{' '}
//           <button
//             type='button'
//             className='plus'
//             disabled={scale >= 3}
//             onClick={increaseScale}
//           >
//             +
//           </button>
//           {/* </div> */}
//         </div>
//       </div>
//       <div className='uploaded-files-container'>
//         <div className='file-bar'>
//           <ul className='file-list'>
//             {files.map(({ name, file }, index) => (
//               <li key={index} onClick={() => setCurrentFile(file)}>
//                 <img
//                   className='icon'
//                   src={require('../icons/icons8-pdf-96.png')}
//                   alt='Icon'
//                 />{' '}
//                 {name}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {currentFile && (
//           <div className='pdf-viewer'>
//             <Document file={currentFile} onLoadSuccess={onDocumentLoadSuccess}>
//               {isLoading && renderedPageNumber && renderedScale ? (
//                 <Page
//                   key={renderedPageNumber + '@' + renderedScale}
//                   className='prevPage'
//                   renderTextLayer={true}
//                   pageNumber={renderedPageNumber}
//                   scale={renderedScale}
//                   width={400}
//                 />
//               ) : null}
//               <Page
//                 key={pageNumber + '@' + scale}
//                 pageNumber={pageNumber}
//                 renderTextLayer={true}
//                 onRenderSuccess={() => {
//                   setRenderedPageNumber(pageNumber)
//                   setRenderedScale(scale)
//                 }}
//                 scale={scale}
//                 width={400}
//               />
//             </Document>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

import { useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { auth } from '../conf/firebase';
import { onSnapshot, doc, collection } from "firebase/firestore";
import { firestore } from '../conf/firebase';


import '../CSS/uploadedFiles.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

export default function UploadedFiles() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [renderedPageNumber, setRenderedPageNumber] = useState(null);
  const [renderedScale, setRenderedScale] = useState(null);
  const [inputValue, setInputValue] = useState(pageNumber);


  const user = auth.currentUser



  
  useEffect(() => {
    const userId = user.uid;
    const filesRef = collection(firestore, "users", userId, "files");
    const unsubscribe = onSnapshot(filesRef, snapshot => {
      const newFiles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      setFiles(newFiles);
    });
  
    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

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
    setInputValue(pageNumber);
  }, [pageNumber]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newPageNumber = parseInt(e.target.value);
      if (newPageNumber >= 1 && newPageNumber <= numPages) {
        setPageNumber(newPageNumber);
        e.target.blur();
      } else {
        setInputValue(pageNumber);  // Reset inputValue if it's not valid
      }
    }
  }

  const isLoading = renderedPageNumber !== pageNumber || renderedScale !== scale;

  return (
    <div>
      <div className='navigation-box'>
        <div className='navigation'>
          <div className='page-number'>
            <input
              type="text"
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
            disabled={scale <= 1}
            onClick={decreaseScale}
          >
            -
          </button>{' '}
          <input
            type='range'
            min='1'
            max='3'
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
            step='0.1'
          />{' '}
          <button
            type='button'
            className='plus'
            disabled={scale >= 3}
            onClick={increaseScale}
          >
            +
          </button>
        </div>
      </div>
      <div className='uploaded-files-container'>
        <div className='file-bar'>
          <ul className='file-list'>
            {files.map(file => (
              <li key={file.id} onClick={() => setCurrentFile(file.downloadURL)}>
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
                  key={renderedPageNumber + '@' + renderedScale}
                  className='prevPage'
                  renderTextLayer={true}
                  pageNumber={renderedPageNumber}
                  scale={renderedScale}
                  width={400}
                />
              ) : null}
              <Page
                key={pageNumber + '@' + scale}
                pageNumber={pageNumber}
                renderTextLayer={true}
                onRenderSuccess={() => {
                  setRenderedPageNumber(pageNumber)
                  setRenderedScale(scale)
                }}
                scale={scale}
                width={400}
              />
            </Document>
          </div>
        )}
      </div>
    </div>
  );
}

