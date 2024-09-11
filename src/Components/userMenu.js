import React, { useState, useEffect, useRef } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../conf/firebase'
import '../CSS/userMenu.css'
import axios from 'axios'

/**
 * The user menu component.
 *
 * @returns {React.JSX.Element} The user menu component.
 */
const UserMenu = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [username, setUsername] = useState('')
  const userMenuRef = useRef(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [enteredEmail, setEnteredEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const user = auth.currentUser
    console.log(user)

    if (user) {
      setUsername(user.email || 'User')
    }
  }, [])

  /**
   * Logs the user out.
   *
   */
  const logout = async () => {
    await signOut(auth)
  }

  /**
   * Handles the click on the delete account button.
   *
   */
  const handleDeleteAccount = () => {
    setIsModalVisible(true)
  }

  /**
   * Prompts the user to confirm the account deletion.
   *
   */
  const confirmDeleteAccount = async () => {
    const user = auth.currentUser
    if (user && enteredEmail === user.email) {
      try {
        await axios.post('http://localhost:6060/delete-user', { uid: user.uid })
        setIsModalVisible(false)
        await signOut(auth)
      } catch (error) {
        console.error('Error deleting account:', error)
        alert('Failed to delete account. Please try again.')
      }
    } else if (enteredEmail !== user.email) {
      setErrorMessage('Email does not match.')
    } else {
      setErrorMessage('An error occurred. Please try again in a moment.')
    }
  }

  /**
   * Handles the click outside the user menu.
   *
   * @param {React.MouseEvent} event The event.
   */
  const handleClickOutside = (event) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setIsDropdownVisible(false)
    }
  }

  /**
   * Handles the cancel button click.
   *
   */
  const handleCancel = () => {
    setIsModalVisible(false)
    setEnteredEmail('')
    setErrorMessage('')
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="user-menu" ref={userMenuRef}>
      <div className="user-icon" onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
        👤
      </div>
      <div className={`dropdown-menu ${isDropdownVisible ? 'visible' : ''}`}>
        <div className="dropdown-item static-text">Logged in as {username}</div>
        <button className="dropdown-item" onClick={handleDeleteAccount}>Delete Account</button>
        <button className="dropdown-item" onClick={logout}>Sign Out</button>
      </div>

      {isModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Account Deletion</h2>
            <p> Enter your email [{username}] to confirm account deletion. This cannot be undone. </p>
            <input
              type="email"
              placeholder="Email"
              value={enteredEmail}
              onChange={(e) => setEnteredEmail(e.target.value)}
            />
             {errorMessage && <p className='auth-error' >{errorMessage}</p>}

            <button class='delete-button' onClick={confirmDeleteAccount}>Confirm</button>
            <button class='cancel-button' onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
