import React, { useState, useEffect } from 'react'
import QueryBox from './querybox'
import ResponseBox from './responsebox'
import UploadedFiles from './uploadedFiles.js'
import { io } from 'socket.io-client'

const ParentComponent = () => {
  const [data, setData] = useState(null)
  const [textToBeHighlighted, setTextToBeHighlighted] = useState('')
  const [messages, setMessages] = useState([])
  const [currentResponse, setCurrentResponse] = useState({ text: '' })
  const [currentFileName, setCurrentFileName] = useState(null)


  // useEffect(() => {
  //   console.log('parent ' + highlightText)
  // }, [highlightText])

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_URL)

    console.log('from parent' + currentFileName)

    socket.on('responseStart', () => {
      setCurrentResponse({ type: 'server', text: [] })
    })

    socket.on('newToken', (data) => {
      console.log('Received data:', data)
      setCurrentResponse((prevResponse) => ({
        type: data.type,
        text: [...prevResponse.text, data.token],
      }))
    })

    return () => socket.disconnect()
  }, [])

  useEffect(() => {
    console.log('currentFileName has been updated to:', currentFileName);
  }, [currentFileName]); 

  const handleUserMessageSubmit = (userMessage) => {
    if (currentResponse.text.length > 0) {
      setMessages((prevMessages) => [...prevMessages, currentResponse])
    }
    setCurrentResponse({ type: 'server', text: [] })
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
