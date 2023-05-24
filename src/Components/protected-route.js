import React, { useState, useEffect } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../conf/firebase.js'
import '.././App.css'
import FileUpload from '../Components/fileupload'
import ParentComponent from '../Components/parent'
import { ToastContainer } from 'react-toastify'
import UploadedFiles from '../Components/uploadedFiles'

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return unsubscribe
  }, [])

  if (!user) return null

  return children;
}

export default ProtectedRoute
