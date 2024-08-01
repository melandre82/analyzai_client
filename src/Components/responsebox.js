import React from 'react'

const ResponseBox = ({ messages, currentResponse }) => {
  return (
    <div className='box-container'>
      {messages.map((message, index) => (
        <div key={index} className={`box-content ${message.type}`}>
          {message.text}
        </div>
      ))}
      {currentResponse.text.length > 0 && (
        <div className={`box-content ${currentResponse.type}`}>
          {currentResponse.text.join(' ')}
        </div>
      )}
    </div>
  )
}

export default ResponseBox