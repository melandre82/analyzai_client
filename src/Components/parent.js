import React, { useState, useEffect } from 'react'
import QueryBox from './querybox'
import ResponseBox from './responsebox'
import UploadedFiles from './uploadedFiles'
import { io } from 'socket.io-client'

// const ParentComponent = () => {
//   const [data, setData] = useState(null)
//   const [highlightText, setHighlightText] = useState('')
//   const [messages, setMessages] = useState([])

//   console.log('ParentComponent', setHighlightText);



//   return (
//     <div>
//       <QueryBox setData={setData} setHighlightText={setHighlightText} />
//       <ResponseBox data={data}  />
//       <UploadedFiles highlightText={highlightText}/>
//     </div>
//   )
// }

// export default ParentComponent

const ParentComponent = () => {
  const [data, setData] = useState(null);
  const [highlightText, setHighlightText] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentResponse, setCurrentResponse] = useState({ text: '' });

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_URL);

    socket.on('responseStart', () => {
      setCurrentResponse({ type: 'server', text: [] });
    });

    socket.on('newToken', (data) => {
      console.log('Received data:', data);
      setCurrentResponse((prevResponse) => ({
        type: data.type,
        text: [...prevResponse.text, data.token],
      }));
    });

    return () => socket.disconnect();
  }, []);

  const handleUserMessageSubmit = (userMessage) => {
    if (currentResponse.text.length > 0) {
      setMessages((prevMessages) => [...prevMessages, currentResponse]);
    }
    setCurrentResponse({ type: 'server', text: [] });
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', text: userMessage },
    ]);
  };

  return (
    <div>
      <QueryBox setData={setData} setHighlightText={setHighlightText} onSubmit={handleUserMessageSubmit} />
      <ResponseBox data={data} messages={messages} currentResponse={currentResponse} />
      <UploadedFiles highlightText={highlightText} />
    </div>
  );
};

export default ParentComponent;

