import React, { useState, useEffect } from 'react'
import '../App.css'

const ResponseBox = ({ data }) => {
  const [text, setText] = useState('')

  useEffect(() => {
    const fetchText = async () => {
      try {
        setText(data)
      } catch (error) {
        console.error('Error fetching text:', error)
      }
    }

    fetchText()
  },)

  return (
    <div className='box-container'>
      <div className='box-content'>{text}</div>
    </div>
  )
}

export default ResponseBox
