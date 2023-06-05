import React, { useContext } from 'react'
// import { useCallback } from 'react'

// Use the context API to share data between components
// const API_ENDPOINT = 'http://localhost:5000/api/'
const AppContext = React.createContext()


const AppProvider = ({ children }) => {
   // const [loading, setLoading] = useState(true)
   // const [samplePassData, setSamplePassData] = useState("Jelo pogi!")
   // Use state to store the data

   // fetch data from the API and store it in the state
   //     usecallback to prevent infinite loop
   //     try and catch to handle errors

   //! SAMPLE CODE

   // const [username, setUsername] = useState("");
   // const [password, setPassword] = useState("");
   // const [firstname, setFirstname] = useState("");
   // const [lastname, setLastname] = useState("");
   // const [email, setEmail] = useState("");
   // const [number, setNumber] = useState("");
   // const [confPassword, setConfPassword] = useState("");
   // const [error, setError] = useState("");
   // const [message, setMessage] = useState("");
   // const [loading, setLoading] = useState(false);

   // const handleLogin = async () => {
   //   try {
   //     setLoading(true);
   //     const res = await axios.post(`${BASE_URL}/api/login`, {
   //       username,
   //       password,
   //     });
   //     setLoading(false);
   //     if (res.data.status === "success") {
   //       Cookies.set("token", res.data.token, { expires: 3600 });
   //       window.location.href = "/dashboard";
   //     } else {
   //       setError(res.data.error);
   //       setMessage(res.data.message);
   //     }
   //   } catch (error) {
   //     setLoading(false);
   //     console.error(error);
   //   }
   // };

   // const handleSetup = async () => {
   //   try {
   //     loadingRef.current.continuousStart();
   //     const res = await axios.post(`${BASE_URL}/api/setup`, {
   //       firstname,
   //       lastname,
   //       email,
   //       number,
   //       username,
   //       password,
   //       confirmpassword,
   //     });
   //     loadingRef.current.complete();
   //     console.log(JSON.stringify(res.data, null, 2));
   //     if (res.data.status === "success") {
   //       console.log("Success");
   //       window.location.href = "/login";
   //     } else {
   //       console.log("Failed");
   //       setError(res.data.error);
   //     }
   //   } catch (error) {
   //     loadingRef.current.complete();
   //     console.log("Catched");
   //   }
   // };


   // use effect to fetch data when the component mounts

   return (
      <AppContext.Provider value={
         {
            // loading,
            // samplePassData,
         }
      }>
         {children}
      </AppContext.Provider>
   )
}

export const useStateContext = () => {
   return useContext(AppContext)
}

export { AppContext, AppProvider }