import React from 'react';

const App = ({ children }) => {
  return (
    <div className="main-container">
      <div className="container-fluid">
        {children}
      </div>
    </div>
  );
};

export default App;
