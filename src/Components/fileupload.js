import React, { useState, useRef } from 'react'
import axios from 'axios'
import '../App.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import localForage from 'localforage'
import { auth } from '../conf/firebase'

/**
 * The FileUpload component.
 *
 * @returns {React.JSX.Element} The FileUpload component.
 */
const FileUpload = () => {
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  const user = auth.currentUser

  /**
   * Handles the file change event and sets the selected file.
   *
   * @param {React.ChangeEvent} event The event.
   */
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    setFile(selectedFile)
  }

  /**
   * Handles the file upload.
   *
   */
  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('uid', user.uid)

    try {
      if (!file) {
        return
      }

      const responsePromise = axios.post(
        `${process.env.REACT_APP_SERVER_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      toast.promise(responsePromise, {
        pending: 'Uploading file...',
        success: {
          /**
           * Renders the success message.
           *
           * @returns {string} The success message.
           */
          render: () => {
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
            setFile(null)
            return 'File uploaded successfully!'
          },
          icon: '👍',
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        },
        error: {
          render: 'Failed to upload file.',
          icon: '😭',
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        }
      })

      await localForage.setItem(file.name, file) // this is not needed anymore
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Handles the click event.
   *
   */
  const handleClick = () => {
    if (!file) {
      fileInputRef.current.click()
    } else {
      handleUpload()
    }
  }

  return (
    <div className='upload-container'>
      <div className='file-box'>
        {file
          ? (
          <>
            <span className='file-icon'>📄</span>
            <span>{file.name}</span>
          </>
            )
          : (
          <span>No file chosen</span>
            )}
      </div>
      <button onClick={handleClick} className='upload-button1'>
        {file ? 'Upload' : 'Choose File'}
      </button>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden-input'
        accept='application/pdf'
        hidden
      />
    </div>
  )
}

export default FileUpload
