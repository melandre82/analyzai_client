import logo from './logo.svg'
import './App.css'
import React from 'react'
import ReactDOM from 'react-dom'
import QueryBox from './Components/querybox'
import Header from './Components/header'
import ResponseBox from './Components/responsebox'
import FileUpload from './Components/fileupload'
import ParentComponent from './Components/parent'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <div className='App'>
      <main>
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='dark'
        />
        <FileUpload />
        <ParentComponent />
        {/* <FileUpload/>
        <ResponseBox/>
        <QueryBox /> */}
      </main>
    </div>
  )
}

export default App
