import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import QueryBox from './Components/querybox';
import Header from './Components/header';
import ResponseBox from './Components/responsebox';
import FileUpload from './Components/fileupload';


function App() {
  return (
    <div className="App">
      <main>
        <FileUpload/>
        <ResponseBox/>
        <QueryBox />
      </main>
    </div>
  );
}

export default App;
