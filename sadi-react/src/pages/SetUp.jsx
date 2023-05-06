import React, { useState } from 'react'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import axios from 'axios'

const Setup = () => {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [number, setNumber] = useState('')
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [error, setError] = useState('');

    const handleFirstnameChange = (event) => {
        setFirstname(event.target.value);
    }

    const handleLastnameChange = (event) => {
        setLastname(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleNumberChange = (event) => {
        setNumber(event.target.value);
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleConfPasswordChange = (event) => {
        setConfPassword(event.target.value)
    }


    const handleSetup = async () => {
        try {
            axios.post('http://localhost:5000/api/setup', {
                firstname: firstname,
                lastname: lastname,
                email: email,
                number: number,
                username: username,
                password: password,
                confirmpassword: confPassword,
            }).then(res => {
                console.log(JSON.stringify(res.data, null, 2));
                if (res.data.status === 'success') {
                    console.log('Success')
                    window.location.href = '/login'
                } else {
                    console.log('Failed')
                    setError(res.data.error)
                }
            })
        } catch (error) {
            console.log("Catched")
        }
    }


    return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <div className="flex flex-col h-full w-full shadow-md bg-gradient-to-tr from-indigo-500 to-cyan-300 sm:h-fit sm:rounded-xl sm:max-w-md ">
                <div className='flex grow items-center justify-center sm:h-48'>
                    <h1 className='text-white text-3xl font-medium'>SADI</h1>
                </div>
                <div className='p-6 rounded-tl-3xl rounded-tr-3xl bg-white'>
                    <InputBox label='First Name' type='text' name='firstname' onChange={handleFirstnameChange} error={error.firstname} />
                    <InputBox label='Last Name' type='text' name='lastname' onChange={handleLastnameChange} error={error.lastname} />
                    <InputBox label='Email' type='email' name='email' onChange={handleEmailChange} error={error.email} />
                    <InputBox label='Mobile no.' type='text' name='number' onChange={handleNumberChange} error={error.number} />
                    <InputBox label='Username' type='text' name='username' onChange={handleUsernameChange} error={error.username} />
                    <InputBox label='Password' type='password' name='password' onChange={handlePasswordChange} error={error.password} />
                    <InputBox label='Confirm Password' type='password' name='confirmpassword' onChange={handleConfPasswordChange} error={error.confirmpassword} />
                    <Button className='w-full mt-5 bg-indigo-500' label='Set Up' onClick={handleSetup} />
                </div>
            </div>
        </div>
    )
}

export default Setup