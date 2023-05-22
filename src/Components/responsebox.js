// import React, { useState, useEffect } from 'react'
// import '../App.css'
// import socket from '../sockets/socket'

// const ResponseBox = ({ data }) => {
//   const [text, setText] = useState('')

//   useEffect(() => {
//     const fetchText = async () => {
//       try {
//         setText(data)
//       } catch (error) {
//         console.error('Error fetching text:', error)
//       }
//     }

//     fetchText()

//     // socket.on('connect', () => {
//     //   console.log('Hello from the server via WS!');
//     // });
//   },)

//   return (
//     <div className='box-container'>
//       <div className='box-content'>{text}</div>
//     </div>
//   )
// }

// export default ResponseBox


import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const ResponseBox = () => {
  const [text, setText] = useState('')

  useEffect(() => {

    const socket = io(process.env.REACT_APP_SERVER_URL)


    socket.on('newToken', (data) => {
      console.log('Received data:', data);
      setText(prevText => prevText + data);
    });

    return () => socket.disconnect()
  }, [io])

  return (
    <div className='box-container'>
      <div className='box-content'>{text}</div>
    </div>
  )
}

export default ResponseBox

