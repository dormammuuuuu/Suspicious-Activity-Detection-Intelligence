import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch('/')
  })
  return (
    <div className="App">
      <h1 className="text-5xl font-bold underline">
        Hello world!
      </h1>
    </div>
  );
}

export default App;
