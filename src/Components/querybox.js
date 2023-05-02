import React, { useState } from 'react'
import '../App.css'

const QueryBox = () => {
  const [query, setQuery] = useState('')

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('Query:'  + query)

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
