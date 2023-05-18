import React, { useState } from 'react'
import '../App.css'
import axios from 'axios'

const QueryBox = ({ setData }) => {
  const [query, setQuery] = useState('')

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()

      const body = {
        query: query,
      }

      await axios
        .post('http://localhost:5001/query', body)
        .then((response) => {
          console.log(response.data)
          console.log('typeof: ' + typeof response.data)
          setData(response.data.text);
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
      console.log('Query:' + query)
    } catch (error) {
      console.log(error)
    }
  }

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
          <button type='submit' id='submit-button'>
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default QueryBox
