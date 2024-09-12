// eslint-disable-next-line
import logo from './logo.svg'
import './App.css'
import React from 'react'
// eslint-disable-next-line
import ReactDOM from 'react-dom'
// eslint-disable-next-line
import QueryBox from './Components/querybox'
// eslint-disable-next-line
import Header from './Components/header'
// eslint-disable-next-line
import ResponseBox from './Components/responsebox'
// eslint-disable-next-line
import FileUpload from './Components/fileupload'
// eslint-disable-next-line
import ParentComponent from './Components/parent'
// eslint-disable-next-line
import { ToastContainer } from 'react-toastify'
// eslint-disable-next-line
import UploadedFiles from './Components/uploadedFiles'
// eslint-disable-next-line
import UserAuth from './Components/user-auth'
// eslint-disable-next-line
import ProtectedRoute from './Components/protected-route'
// eslint-disable-next-line
import LogoutButton from './Components/logout'
// eslint-disable-next-line
import UserMenu from './Components/userMenu'

/**
 * The main app component.
 *
 * @returns {React.JSX.Element} The main app component.
 */
function App () {
  return (
    <div className='App'>
      <main>
        <UserAuth />
        <ProtectedRoute>
          <header className="app-header">
            <FileUpload />
            <div className="user-menu-container">
              <UserMenu />
            </div>
          </header>
          <UploadedFiles />
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

          <ParentComponent />
        </ProtectedRoute>
      </main>
    </div>
  )
}

export default App
