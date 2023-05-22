import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import QueryBox from './querybox'

const ResponseBox = () => {
  const [messages, setMessages] = useState([])
  const [currentResponse, setCurrentResponse] = useState({ text: '' })


  const messageEl = useRef(null);

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [])

  useEffect(() => {

  


    const socket = io(process.env.REACT_APP_SERVER_URL)

    socket.on('responseStart', () => {
      // Start a new response
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

  const handleUserMessageSubmit = (userMessage) => {
    // Save the current server response before adding the user message
    if (currentResponse.text.length > 0) {
      setMessages((prevMessages) => [...prevMessages, currentResponse])
    }
    // Start a new response for the server
    setCurrentResponse({ type: 'server', text: [] })

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', text: userMessage },
    ])
  }

 

  return (
    <div>
      <div className='box-container' ref={messageEl}>
        {messages.map((message, index) => (
          <div key={index} className={`box-content ${message.type}`}>
            {message.text}
          </div>
        ))}
        <div className={`box-content ${currentResponse.type}`}>
          {currentResponse.text}
        </div>
      </div>
      <QueryBox onSubmit={handleUserMessageSubmit} />
    </div>
  )
}

export default ResponseBox
