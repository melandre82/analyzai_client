// socket.js
import { io } from 'socket.io-client'

const socket = io(`${process.env.REACT_APP_SERVER_URL}`)

socket.on('connect', () => {
  console.log('Connected to the server')
})

export default socket
