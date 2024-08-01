import React from 'react';

const ResponseBox = ({ messages }) => {
  // This function aggregates consecutive server messages into single messages
  const aggregateMessages = (messages) => {
    return messages.reduce((acc, message, index, array) => {
      const lastMessage = acc[acc.length - 1];
      if (lastMessage && lastMessage.type === 'server') {
        lastMessage.text = lastMessage.text || '';
      }
      if (lastMessage && message.type === 'server' && lastMessage.type === 'server') {
        lastMessage.text += (lastMessage.text ? '' : '') + message.text;
      } else {
        acc.push({ ...message, text: message.text || '' });
      }
      return acc;
    }, []);
  };

  const aggregatedMessages = aggregateMessages(messages);

  return (
    <div className='box-container'>
      {aggregatedMessages.map((message, index) => (
        <div key={index} className={`box-content ${message.type}`}>
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default ResponseBox;