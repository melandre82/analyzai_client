import React, { useState, useEffect, useRef } from 'react'
// eslint-disable-next-line
import QueryBox from './querybox'
// eslint-disable-next-line
import ResponseBox from './responsebox'
// eslint-disable-next-line
import UploadedFiles from './uploadedFiles.js'
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

  const socketRef = useRef(null)

  useEffect(() => {
    auth.onAuthStateChanged(setUser)
  }, [])

  useEffect(() => {
    if (!socketRef.current) {
      console.log('Establishing WebSocket connection...')
      socketRef.current = io(process.env.REACT_APP_SERVER_URL)

      socketRef.current.on('connect', () => {
        console.log('WebSocket Connected')
      })

      socketRef.current.on('newToken', (data) => {
        console.log('newToken event received:', data)
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
        console.log('Disconnecting WebSocket...')
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

  return (
    <div>
      <QueryBox
        setData={setData}
        setTextToBeHighlighted={setTextToBeHighlighted}
        onSubmit={handleUserMessageSubmit}
        currentFileName={currentFileName}
        user={user}
      />
      <ResponseBox
        data={data}
        messages={messages[currentFileName] || []}
      />
      <UploadedFiles
        textToBeHighlighted={textToBeHighlighted}
        setCurrentFileName={setCurrentFileName}
      />
    </div>
  )
}

export default ParentComponent
