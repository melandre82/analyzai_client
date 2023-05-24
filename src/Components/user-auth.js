import React, { useRef, useState, useEffect } from 'react'
import '../CSS/userAuth.css'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../conf/firebase'

// https://www.youtube.com/watch?v=9bXhf_TELP4

const UserAuth = () => {
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [user, setUser] = useState({})

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    // Return a cleanup function to be run on component unmount
    return () => {
      unsubscribe()
    }
  }, [])

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      )
      console.log(user)
    } catch (error) {
      console.log(error.message)
    }
  }

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      )
      console.log(user)
    } catch (error) {
      console.log(error.message)
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return !user ? (
    <div className='login-page'>
      <div className='login-card'>
        <div>
          <h3 className='title'> Register User </h3>
          <input
            className='input-field'
            placeholder='Email...'
            onChange={(event) => {
              setRegisterEmail(event.target.value)
            }}
          />
          <input
            className='input-field'
            placeholder='Password...'
            onChange={(event) => {
              setRegisterPassword(event.target.value)
            }}
          />

          <button className='button-field' onClick={register}>
            Create User
          </button>
        </div>

        <div>
          <h3 className='title'> Login </h3>
          <input
            className='input-field'
            placeholder='Email...'
            onChange={(event) => {
              setLoginEmail(event.target.value)
            }}
          />
          <input
            className='input-field'
            placeholder='Password...'
            onChange={(event) => {
              setLoginPassword(event.target.value)
            }}
          />

          <button className='button-field' onClick={login}>
            Login
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default UserAuth
