import React, { useState, useContext, useEffect } from 'react'
import { useCallback } from 'react'

// Use the context API to share data between components
const url = 'http://localhost:5000/api/json'
const AppContext = React.createContext()


const AppProvider = ({ children }) => {
   const [loading, setLoading] = useState(true)
   const [samplePassData, setSamplePassData] = useState("Jelo pogi!")
   // Use state to store the data

   // fetch data from the API and store it in the state 
   //     usecallback to prevent infinite loop
   //     try and catch to handle errors

   // use effect to fetch data when the component mounts

   return (
      <AppContext.Provider value={
         {
            loading,
            samplePassData,
         }
      }>
         {children}
      </AppContext.Provider>
   )
}

export const useGlobalContext = () => {
   return useContext(AppContext)
}

export { AppContext, AppProvider }