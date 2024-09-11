import React, { useState, useEffect } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../conf/firebase.js'
import '.././App.css'
// import FileUpload from '../Components/fileupload'
// import ParentComponent from '../Components/parent'
// import { ToastContainer } from 'react-toastify'
// import UploadedFiles from '../Components/uploadedFiles'

/**
 * The protected route component.
 *
 * @param {React.ComponentProps} root0 The component props.
 * @param {React.PropsWithChildren}root0.children The children to render.
 * @returns {React.JSX.Element} The protected route component.
 */
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return unsubscribe
  }, [])

  if (!user) return null

  return children
}

export default ProtectedRoute
