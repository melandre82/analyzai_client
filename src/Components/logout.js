import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../conf/firebase';
import '.././CSS/logoutButton.css';

function LogoutButton() {
  const logout = async () => {
    await signOut(auth);
  }

  return (
    <button className="logout-button" onClick={logout}>Sign Out</button>
  )
}

export default LogoutButton;
