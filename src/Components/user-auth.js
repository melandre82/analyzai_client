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
  const [authMode, setAuthMode] = useState('landing')
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [user, setUser] = useState({})
  const [authError, setAuthError] = useState('');


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const register = async () => {
    if (!registerEmail || !registerPassword) {
      setAuthError('Please fill out both email and password fields.');
      return;
    }
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      setAuthError('');
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  const login = async () => {
    if (!loginEmail || !loginPassword) {
      setAuthError('Please fill out both email and password fields.');
      return;
    }
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      setAuthError('');
    } catch (error) {
      handleAuthError(error);
    }
  };
  
  const handleAuthError = (error) => {
    let errorMessage = '';
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email format.';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Email is already in use.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password needs to be at least 6 characters.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Invalid email or password.';
        break;
      default:
        errorMessage = 'An unknown error occurred.';
    }
    setAuthError(errorMessage);
  };
  

  const renderLandingCard = () => (
    <div className='card'>
      <h2>Welcome to AnalyzAI</h2>
      <button className='button-field' onClick={() => { setAuthMode('register'); setAuthError(''); }}>
        Register
      </button>
      <button className='button-field' onClick={() => { setAuthMode('login'); setAuthError(''); }}>
        Login
      </button>
    </div>
  );
  
  const renderRegisterCard = () => (
    <div className='card'>
      <h3 className='title'>Register User</h3>
      <input
        className='input-field'
        name='email'
        type='email'  
        placeholder='Email...'
        autoComplete='email'
        onChange={(event) => setRegisterEmail(event.target.value)}
      />
      <div className='password-container'>
        <input
          className='input-field'
          name='new-password'
          autoComplete='new-password'
          type={showRegisterPassword ? 'text' : 'password'}
          placeholder='Password...'
          onChange={(event) => setRegisterPassword(event.target.value)}
        />
        <span
          className='toggle-password'
          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
        >
          {showRegisterPassword ? '🙈' : '👁️'}
        </span>
      </div>
      {authError && <p className='auth-error' >{authError}</p>}
      <button className='button-field' onClick={register}>
        Create User
      </button>
      <button className='button-field back-button' onClick={() => { setAuthMode('landing'); setAuthError(''); }}>
        Back
      </button>
    </div>
  );
  
  const renderLoginCard = () => (
    <div className='card'>
      <h3 className='title'>Login</h3>
      <input
        className='input-field'
        placeholder='Email...'
        name='email'
        type='email'
        onChange={(event) => setLoginEmail(event.target.value)}
      />
      <div className='password-container'>
        <input
          className='input-field'
          name='current-password'
          autoComplete='current-password'
          type={showLoginPassword ? 'text' : 'password'}
          placeholder='Password...'
          onChange={(event) => setLoginPassword(event.target.value)}
        />
        <span
          className='toggle-password'
          onClick={() => setShowLoginPassword(!showLoginPassword)}
        >
          {showLoginPassword ? '🙈' : '👁️'}
        </span>
      </div>
      {authError && <p className='auth-error' >{authError}</p>}
      <button className='button-field' onClick={login}>
        Login
      </button>
      <button className='button-field back-button' onClick={() => { setAuthMode('landing'); setAuthError(''); }}>
        Back
      </button>
    </div>
  );

  if (user) {
    return null
  }

  return (
    <div className='login-page'>
      <div className='login-card'>
        {authMode === 'landing' && renderLandingCard()}
        {authMode === 'register' && renderRegisterCard()}
        {authMode === 'login' && renderLoginCard()}
      </div>
    </div>
  )
}

export default UserAuth
