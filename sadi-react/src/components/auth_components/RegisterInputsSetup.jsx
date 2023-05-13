import React, { useState } from 'react';
import { InputBox, Button } from '../';

const RegisterInputsSetup = ({ registerUserCredentials, error }) => {
   const [firstname, setFirstname] = useState('');
   const [lastname, setLastname] = useState('');
   const [email, setEmail] = useState('');
   const [number, setNumber] = useState('');
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');

   const handleFirstnameChange = (event) => {
      setFirstname(event.target.value);
   };

   const handleLastnameChange = (event) => {
      setLastname(event.target.value);
   };

   const handleEmailChange = (event) => {
      setEmail(event.target.value);
   };

   const handleNumberChange = (event) => {
      setNumber(event.target.value);
   };

   const handleUsernameChange = (event) => {
      setUsername(event.target.value);
   };

   const handlePasswordChange = (event) => {
      setPassword(event.target.value);
   };

   const handleStoreData = () => {
      const userData = {
         firstname: firstname,
         lastname: lastname,
         email: email,
         number: number,
         username: username,
         password: password,
         // confirmpassword: confPassword,
      };

      // Call the function with the userData object
      registerUserCredentials(userData);
   };

   return (
      <div className='w-full h-full '>
         <div className='flex gap-5'>
            <InputBox label="First Name" type="text" name="firstname" onChange={handleFirstnameChange} error={error.firstname} />
            <InputBox label="Last Name" type="text" name="lastname" onChange={handleLastnameChange} error={error.lastname} />
         </div>
         <InputBox label="Email" type="email" name="email" onChange={handleEmailChange} error={error.email} />
         <InputBox label="Username" type="text" name="username" onChange={handleUsernameChange} error={error.username} />
         <InputBox label="Password" type="password" name="password" onChange={handlePasswordChange} error={error.password} />
         <InputBox label="Mobile no." type="text" name="number" onChange={handleNumberChange} error={error.number} />
         <div className="absolute bottom-0 right-0">
            <Button className="w-32 mt-3 bg-sblue hover:bg-blue-700 text-white" label="NEXT" onClick={handleStoreData} />
         </div>
      </div>
   );
};

export default RegisterInputsSetup;






