import React, { useState, useEffect } from 'react'
import QueryBox from './querybox'
import ResponseBox from './responsebox'
import UploadedFiles from './uploadedFiles.js'
import { io } from 'socket.io-client'
import axios from 'axios'
import { auth } from '../conf/firebase'


const ParentComponent = () => {
  const [data, setData] = useState(null)
  const [textToBeHighlighted, setTextToBeHighlighted] = useState('')
  const [messages, setMessages] = useState([])
  const [currentResponse, setCurrentResponse] = useState({ text: '' })
  const [currentFileName, setCurrentFileName] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // console.log('Auth state changed, user:', user) // Debugging log
      setUser(user)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])


  // useEffect(() => {
  //   console.log('parent ' + highlightText)
  // }, [highlightText])

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_URL)
  
    socket.on('responseStart', () => {
      setCurrentResponse({ type: 'server', text: [] })
    })
  
    socket.on('newToken', (data) => {
      setCurrentResponse((prevResponse) => ({
        type: 'server', 
        text: [...prevResponse.text, data.token],
      }))
    })
  
    return () => socket.disconnect()
  }, [currentFileName])
  // Fetch the chat history if the user or current file name changes

  useEffect(() => {
    if (currentFileName && user) {
      const fetchChatHistory = async () => {
        try {
          const body = {
            uid: user.uid,
            documentId: currentFileName,
          }
          const response = await axios.post('http://localhost:6060/chat-history', body)
          console.log(response.data)
          
          // Transform the server response to the format expected by ResponseBox
          const transformedMessages = response.data.map(message => ({
            type: message.role === 'user' ? 'user' : 'server', 
            text: message.message,
          }))
          
          setMessages(transformedMessages)
        } catch (error) {
          console.error('Error fetching chat history:', error)
        }
      }
      fetchChatHistory()
    }
  }, [currentFileName, user])



  const handleUserMessageSubmit = (userMessage) => {
    if (currentResponse.text.length > 0) {
      setMessages((prevMessages) => [...prevMessages, currentResponse])
      setCurrentResponse({ type: 'server', text: [] }) // Reset currentResponse
    }
    
    // Add the user's message to the messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', text: userMessage },
    ])
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
        messages={messages}
        currentResponse={currentResponse}
      />
      <UploadedFiles textToBeHighlighted={textToBeHighlighted} 
      setCurrentFileName={setCurrentFileName}
      />
    </div>
  )
}

export default ParentComponent
