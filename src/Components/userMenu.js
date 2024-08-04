import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../conf/firebase';
import '../CSS/userMenu.css';

function UserMenu() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [username, setUsername] = useState('');
  const userMenuRef = useRef(null);

  useEffect(() => {
    const user = auth.currentUser;
    console.log(user);

    if (user) {
      setUsername(user.email || 'User'); 
    }
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const handleClickOutside = (event) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="user-menu"
      ref={userMenuRef}
    >
      <div
        className="user-icon"
        onClick={() => setIsDropdownVisible(!isDropdownVisible)}
      >
        👤
      </div>
      <div className={`dropdown-menu ${isDropdownVisible ? 'visible' : ''}`}>
        <div className="dropdown-item static-text">Logged in as {username}</div>
        <button className="dropdown-item" onClick={logout}>Sign Out</button>
      </div>
    </div>
  );
}

export default UserMenu;