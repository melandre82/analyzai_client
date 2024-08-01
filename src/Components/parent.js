import React, { useState, useEffect, useRef } from 'react';
import QueryBox from './querybox';
import ResponseBox from './responsebox';
import UploadedFiles from './uploadedFiles.js';
import { io } from 'socket.io-client';
import axios from 'axios';
import { auth } from '../conf/firebase';

const ParentComponent = () => {
  const [data, setData] = useState(null);
  const [textToBeHighlighted, setTextToBeHighlighted] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentResponse, setCurrentResponse] = useState({ type: 'server', text: [] });
  const [currentFileName, setCurrentFileName] = useState(null);
  const [user, setUser] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
    // add unsubscribe if user changes
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      console.log('Establishing WebSocket connection...');
      socketRef.current = io(process.env.REACT_APP_SERVER_URL);

      socketRef.current.on('connect', () => {
        console.log('WebSocket Connected');
      });

      socketRef.current.on('responseStart', () => {
        console.log('responseStart event received');
        setCurrentResponse({ type: 'server', text: [] });
      });

      socketRef.current.on('newToken', (data) => {
        console.log('newToken event received:', data);
        setCurrentResponse(prevResponse => ({
          type: 'server',
          text: [...prevResponse.text, data.token],
        }));
      });
    }

    // Cleanup function to disconnect and remove event listeners
    return () => {
      if (socketRef.current) {
        console.log('Disconnecting WebSocket...');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (currentFileName && user) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.post('http://localhost:6060/chat-history', {
            uid: user.uid,
            documentId: currentFileName,
          });
          const transformedMessages = response.data.map(message => ({
            type: message.role === 'user' ? 'user' : 'server',
            text: message.message,
          }));
          setMessages(transformedMessages);
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };
      fetchChatHistory();
    }
  }, [currentFileName, user]);

  const handleUserMessageSubmit = (userMessage) => {
    if (currentResponse.text.length > 0) {
      setMessages(prevMessages => [...prevMessages, currentResponse]);
      setCurrentResponse({ type: 'server', text: [] });
    }
    setMessages(prevMessages => [
      ...prevMessages,
      { type: 'user', text: userMessage },
    ]);
  };

  return (
    <div>
      <QueryBox
        setData={setData}
        setTextToBeHighlighted={setTextToBeHighlighted}
        onSubmit={handleUserMessageSubmit}
        currentFileName={currentFileName}
        user={user}
      />
      <ResponseBox
        data={data}
        messages={messages}
        currentResponse={currentResponse}
      />
      <UploadedFiles
        textToBeHighlighted={textToBeHighlighted}
        setCurrentFileName={setCurrentFileName}
      />
    </div>
  );
};

export default ParentComponent;