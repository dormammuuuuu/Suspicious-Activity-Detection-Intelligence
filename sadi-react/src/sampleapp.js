/// connect to flask api


import React, { useState, useEffect } from 'react';

function App() {
   const [data, setData] = useState([{}])
   // // Todo: fix function
   // const fetchData = async () => {
   //   const response = await fetch('http://localhost:5000/api/data');
   //   const data = await response.json();
   //   setData(data);
   // };


   // useEffect(() => {
   //   // fetchData()
   //   fetch('http://localhost:5000/api/data')
   //     .then(res => res.json())
   //     .then(data => {
   //       setData(data)
   //     })
   //     .catch(err => {
   //       console.log(err);
   //     });
   //   console.log(data)
   // }, [])


   return (
      <div className="App">
         <h1 className="text-5xl font-bold underline">
            Test React Flask App
         </h1>
      </div>
   );
}

export default App;
