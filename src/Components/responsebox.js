import React from 'react';

const ResponseBox = ({ messages, currentResponse }) => {
  return (
    <div className='box-container'>
      {messages.map((message, index) => (
        <div key={index} className={`box-content ${message.type}`}>
          {message.text}
        </div>
      ))}
      <div className={`box-content ${currentResponse.type}`}>
        {currentResponse.text}
      </div>
    </div>
  );
};

export default ResponseBox;
