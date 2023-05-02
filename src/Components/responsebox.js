
import React, { useState, useEffect } from 'react';
import '../App.css';

const ResponseBox = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await fetch('restapi');
        const data = await response.json();
        setText(data.text);
      } catch (error) {
        console.error('Error fetching text:', error);
      }
    };

    fetchText();
  }, []);

  return (
    <div className="box-container">
      <div className="box-content">{text}</div>
    </div>
  );
};

export default ResponseBox;
