import React, { useState, useEffect } from 'react'
import '../App.css'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import socket from '../sockets/socket'
import { auth } from '../conf/firebase'

const QueryBox = ({ onSubmit, setData, setTextToBeHighlighted, currentFileName, user }) => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // const user = auth.currentUser

  useEffect(() => {
    // console.log('Received user in QueryBox:', user) // Debugging log
  }, [user])


  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      setLoading(true)

      if ( currentFileName !== null ) {

      const body = {
        query: query,
        uid: user.uid,
        currentFileName: currentFileName
      }

      onSubmit(query)

      await axios
        .post('http://localhost:6060/query', body)
        .then((response) => {
          console.log(response.data)
          // setTextToBeHighlighted(response.data.sourceDocuments[0].pageContent)
          
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
        .finally(() => {
          setLoading(false)
          setQuery('')
        })

      } else {
        console.log('No file selected')
      }
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
          <button
            type='submit'
            id='submit-button'
            disabled={loading || !query}
            className={loading || !query ? 'loading' : ''}
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default QueryBox
