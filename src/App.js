import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import QueryBox from './Components/querybox';
import Header from './Components/header';


function App() {
  return (
    <div className="App">
      <main>
        <QueryBox />
      </main>
    </div>
  );
}

export default App;
