import React from 'react';
import { Link } from 'react-router';

const App = ({children}) => {
  return (
    <div className="main-container">
      <div className="container">
        {children}
      </div>
    </div>
  )
}

export default App;
