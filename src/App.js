import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import QueryBox from './Components/querybox';
import Header from './Components/header';
import ResponseBox from './Components/responsebox';
import FileUpload from './Components/fileupload';
import ParentComponent from './Components/parent';


function App() {
  return (
    <div className="App">
      <main>
        <FileUpload/>
        <ParentComponent/>
        {/* <FileUpload/>
        <ResponseBox/>
        <QueryBox /> */}
      </main>
    </div>
  );
}

export default App;
