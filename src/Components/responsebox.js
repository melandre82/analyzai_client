import React, { useEffect, useRef, useState } from 'react';

const ResponseBox = ({ messages }) => {
  const boxRef = useRef(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  // This function aggregates consecutive server messages into single messages
  const aggregateMessages = (messages) => {
    return messages.reduce((acc, message) => {
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

  useEffect(() => {
    const box = boxRef.current;

    const handleScroll = () => {
      // Check if the user has scrolled up
      if (box.scrollTop + box.clientHeight < box.scrollHeight) {
        setUserScrolledUp(true);
      } else {
        setUserScrolledUp(false);
      }
    };

    box.addEventListener('scroll', handleScroll);

    return () => {
      box.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    // Scroll to the bottom if the user is not actively scrolling up
    if (!userScrolledUp) {
      box.scrollTop = box.scrollHeight;
    }
  }, [messages, userScrolledUp]);

  return (
    <div className='box-container' ref={boxRef}>
      {aggregatedMessages.map((message, index) => (
        <div key={index} className={`box-content ${message.type}`}>
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default ResponseBox;