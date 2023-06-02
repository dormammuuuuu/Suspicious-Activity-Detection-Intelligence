import React, { useState, useEffect } from 'react'
import Layout from '../Layout'
import AccountSettingsInputField from './AccountSettingsInputField'
import { MdEdit } from 'react-icons/md';
import axios from 'axios'
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:5000/api'
const AccountSettings = () => {
    const [edit, setEdit] = useState(true);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');


    const editToggle = () => {
        setEdit(!edit);
    };

    useEffect(() => {
        // Fetch user data from the API
        const fetchUserData = async () => {
            try {
                const user_id = Cookies.get('user_id'); // Replace with the actual user_id value
                const url = `${API_BASE_URL}/get-details/${user_id}`;
                const response = await axios.get(url);
                setFirstname(response.data.firstname);
                setLastname(response.data.lastname);
                setUsername(response.data.username);
                setEmail(response.data.email);
                setNumber(response.data.number);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        try {
            const user_id = Cookies.get('user_id'); // Replace with the actual user_id value
            const url = `${API_BASE_URL}/update-details/${user_id}`;
            const response = await axios.post(url, {
                firstname: firstname,
                lastname: lastname,
                username: username,
                email: email,
                number: number
            });
            console.log(response.data);
            setEdit(true);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <Layout>
            <div className='flex justify-between items-center p-2  text-sgray-400'>
                <div>
                    <p className="font-semibold">Change Account Settings</p>
                </div>
                <button type="button" id="add-user"
                    className="flex gap-2 items-center text-sblue border border-sblue focus:ring-2  font-medium rounded-xl text-base px-5 py-2.5 transition duration-300  ease-in-out  hover:scale-105 hover:bg-sblue-alt-hover"
                    onClick={editToggle}>
                    <MdEdit />
                    <span>Edit</span>
                </button>
            </div>
            <div className='w-full overflow-hidden p-5'>
                <div className='mb-10'>
                    <p className='font-semibold  text-sgray-400'>{!edit && "Edit "}Personal Information</p>
                </div>
                <div className='grid grid-cols-3 gap-10 gap-y-10'>
                    <AccountSettingsInputField name="firstname" type="text" label="First Name" disabled={edit} value={firstname} onChange={setFirstname} />
                    <AccountSettingsInputField name="lastname" type="text" label="Last Name" disabled={edit} value={lastname} onChange={setLastname} />
                    <AccountSettingsInputField name="username" type="text" label="Username" disabled={edit} value={username} onChange={setUsername} />
                    <AccountSettingsInputField name="email" type="email" label="Email" disabled={edit} value={email} onChange={setEmail} />
                    <AccountSettingsInputField name="mobile" type="text" label="Mobile Number" disabled={edit} value={number} onChange={setNumber} />
                    <span></span>
                    {!edit &&
                        <>
                            <AccountSettingsInputField name="password" type="password" label="Password" disabled={edit} />
                            <AccountSettingsInputField name="password-confirmation" type="password" label="Confirm Password" disabled={edit} />
                        </>
                    }

                </div>
            </div>
            {!edit &&
                <button onClick={handleSave} className='absolute right-10 bottom-10 z-30 bg-sblue text-white hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 px-4 py-3 rounded-xl'>
                    Save Changes
                </button>
            }
        </Layout>
    )
}

export default AccountSettings