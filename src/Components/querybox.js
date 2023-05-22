import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import socket from '../sockets/socket';

const QueryBox = ({ setData }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on('hello', data => {
      setData(data.text);
    });

    return () => {
      socket.off('queryResults');
    };
  }, [setData]);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);

      const body = {
        query: query,
      };

      await axios
        .post('http://localhost:5001/query', body)
        .then((response) => {
          console.log(response.data);
          console.log('typeof: ' + typeof response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          setLoading(false);
          setQuery('');
        });


    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div id='textbox'>
          <input
            type='text'
            placeholder='Enter a query'
            id='query-input'
            value={query}
            onChange={handleQueryChange}
          />
          <button type='submit' id='submit-button' disabled={loading || !query}
          className={loading || !query ? 'loading' : ''}
          >
            
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QueryBox;

