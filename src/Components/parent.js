import React, { useState, useEffect, useRef } from 'react'
// eslint-disable-next-line
import QueryBox from './querybox'
// eslint-disable-next-line
import ResponseBox from './responsebox'
// eslint-disable-next-line
import UploadedFiles from './uploadedFiles.js'
// eslint-disable-next-line
import Navigation from '../Components/navigation.js'
import { io } from 'socket.io-client'
import axios from 'axios'
import { auth } from '../conf/firebase'

/**
 * The parent component.
 *
 * @returns {React.JSX.Element} The parent component.
 */
const ParentComponent = () => {
  const [data, setData] = useState(null)
  const [textToBeHighlighted, setTextToBeHighlighted] = useState('')
  const [messages, setMessages] = useState({})
  const [currentFileName, setCurrentFileName] = useState(null)
  const [user, setUser] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.5)
  const [inputValue, setInputValue] = useState('')

  const socketRef = useRef(null)

  useEffect(() => {
    auth.onAuthStateChanged(setUser)
  }, [])

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_SERVER_URL)

      socketRef.current.on('newToken', (data) => {
        const { currentFileName, token } = data
        setMessages(prevMessages => {
          const messagesForFile = prevMessages[currentFileName] || []
          return {
            ...prevMessages,
            [currentFileName]: [...messagesForFile, { type: 'server', text: token }]
          }
        })
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect')
        socketRef.current.off('newToken')
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (currentFileName && user) {
      /**
       * Fetches the chat history.
       *
       */
      const fetchChatHistory = async () => {
        try {
          const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/chat-history`, {
            uid: user.uid,
            documentId: currentFileName
          })
          // This function transforms the messages to the format expected by the ResponseBox component
          const transformedMessages = response.data.map(message => ({
            type: message.role === 'user' ? 'user' : 'server',
            text: message.message
          }))
          setMessages(prevMessages => ({
            ...prevMessages,
            [currentFileName]: transformedMessages
          }))
        } catch (error) {
          console.error('Error fetching chat history:', error)
        }
      }
      fetchChatHistory()
    }
  }, [currentFileName, user])

  /**
   * Handles the user message submission.
   *
   * @param {object} userMessage The user message.
   */
  const handleUserMessageSubmit = (userMessage) => {
    setMessages(prevMessages => {
      const messagesForFile = prevMessages[currentFileName] || []
      return {
        ...prevMessages,
        [currentFileName]: [...messagesForFile, { type: 'user', text: userMessage }]
      }
    })
  }

  /**
   * Changes the page number.
   *
   * @param {number} offset The offset.
   */
  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  /**
   * Changes to the previous page.
   *
   */
  const previousPage = () => {
    changePage(-1)
  }

  /**
   * Changes to the next page.
   *
   */
  const nextPage = () => {
    changePage(1)
  }

  /**
   * Changes the scale of the document.
   *
   * @param {number} offset The offset.
   */
  const changeScale = (offset) => {
    setScale((prevScale) => prevScale + offset)
  }

  /**
   * Decreases the scale of the document.
   *
   */
  const decreaseScale = () => {
    changeScale(-0.1)
  }

  /**
   * Increases the scale of the document.
   *
   */
  const increaseScale = () => {
    changeScale(0.1)
  }

  /**
   * Resets the scale of the document.
   *
   */
  const resetScale = () => {
    setScale(1.5)
  }

  /**
   * Handles the input change event.
   *
   * @param {Event} e The event of the input change.
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  /**
   * Handles the key press event.
   *
   * @param {Event} e The event of the key press.
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

  return (
    <div>
      {typeof setInputValue === 'function'
        ? (
          // for some reason the prop functions were not initialized
          // when being passed, this is probably not a good fix but seems to work
        <UploadedFiles
          textToBeHighlighted={textToBeHighlighted}
          setCurrentFileName={setCurrentFileName}
          numPages={numPages}
          setNumPages={setNumPages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          scale={scale}
          setScale={setScale}
          inputValue={inputValue}
          setInputValue={setInputValue}
          previousPage={previousPage}
          nextPage={nextPage}
          resetScale={resetScale}
          decreaseScale={decreaseScale}
          increaseScale={increaseScale}
          handleInputChange={handleInputChange}
          handleKeyPress={handleKeyPress}
        />
          )
        : null}

      <ResponseBox
        data={data}
        messages={messages[currentFileName] || []}
      />

      <footer className='app-footer'>
        <Navigation
          numPages={numPages}
          pageNumber={pageNumber}
          scale={scale}
          inputValue={inputValue}
          setInputValue={setInputValue}
          previousPage={previousPage}
          nextPage={nextPage}
          resetScale={resetScale}
          decreaseScale={decreaseScale}
          increaseScale={increaseScale}
          handleInputChange={handleInputChange}
          handleKeyPress={handleKeyPress}
          setScale={setScale}
        />
         <QueryBox
          setData={setData}
          setTextToBeHighlighted={setTextToBeHighlighted}
          onSubmit={handleUserMessageSubmit}
          currentFileName={currentFileName}
          user={user}
        />
      </footer>
    </div>
  )
}

export default ParentComponent
