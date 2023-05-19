// import React, { useState } from 'react'
// import '../App.css'
// import axios from 'axios'

// const QueryBox = ({ setData }) => {
//   const [query, setQuery] = useState('')

//   const handleQueryChange = (event) => {
//     setQuery(event.target.value)
//   }

//   const handleSubmit = async (event) => {
//     try {
//       event.preventDefault()

//       const body = {
//         query: query,
//       }

//       await axios
//         .post('http://localhost:5001/query', body)
//         .then((response) => {
//           console.log(response.data)
//           console.log('typeof: ' + typeof response.data)
//           setData(response.data.text);
//         })
//         .catch((error) => {
//           return console.error('Error fetching data:', error)
//         })

//         setQuery('')
//       // console.log('Query:' + query)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <div id='textbox'>
//           <input
//             type='text'
//             placeholder='Enter a query'
//             id='query-input'
//             value={query}
//             onChange={handleQueryChange}
//           />
//           <button type='submit' id='submit-button'>
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default QueryBox
import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const QueryBox = ({ setData }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setLoading(true); // Set loading to true to show the loading sign

      const body = {
        query: query,
      };

      await axios
        .post('http://localhost:5001/query', body)
        .then((response) => {
          console.log(response.data);
          console.log('typeof: ' + typeof response.data);
          setData(response.data.text);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          setLoading(false); // Set loading back to false after receiving the response
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
          <button type='submit' id='submit-button' disabled={loading}
          // disabled={loading}
          className={loading ? 'loading' : ''}
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

