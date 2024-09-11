import React, { useState } from 'react'
import '../App.css'
import axios from 'axios'
// eslint-disable-next-line
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
// eslint-disable-next-line
import socket from '../sockets/socket'
// eslint-disable-next-line
import { auth } from '../conf/firebase'

/**
 * The QueryBox component.
 *
 * @param {React.ComponentProps} root0 The component props.
 * @param {Function} root0.onSubmit The onSubmit function.
 * @param {Function} root0.setData The setData function.
 * @param {Function} root0.setTextToBeHighlighted The setTextToBeHighlighted function.
 * @param {string} root0.currentFileName The current file name.
 * @param {object} root0.user The user object.
 * @returns {React.JSX.Element} The QueryBox component.
 */
const QueryBox = ({ onSubmit, setData, setTextToBeHighlighted, currentFileName, user }) => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  // }, [user])

  /**
   * Handles the query change event and sets the query.
   *
   * @param {React.FormEvent} event The event of the query change.
   */
  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  /**
   * Handles the form submit event.
   *
   * @param {React.FormEvent} event The event of the form submit.
   */
  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      setLoading(true)

      if (currentFileName !== null) {
        const body = {
          query,
          uid: user.uid,
          currentFileName
        }

        onSubmit(query)

        await axios
          .post(`${process.env.REACT_APP_SERVER_URL}/query`, body)
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
