import React, { useState, useEffect } from 'react'
import Layout from '../Layout'
import AccountSettingsInputField from './AccountSettingsInputField'
import { MdEdit } from 'react-icons/md';
import axios from 'axios'
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:5000/api'
const AccountSettings = () => {
    const [editPersonInfo, setEditPersonInfo] = useState(true);
    const [editChangePass, setEditChangePass] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const editToggle = () => {
        setEditPersonInfo(!editPersonInfo);
    };

    const changePassToggle = () => {
        setEditChangePass(!editChangePass);
    }

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
            
            setEditPersonInfo(true);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };


    

    const handleSaveChangePass = async () => {
        try {
            console.log(oldPassword, newPassword, confirmPassword)
            const user_id = Cookies.get('user_id'); // Replace with the actual user_id value
            const url = `${API_BASE_URL}/update-password/${user_id}`;
            const response = await axios.post(url, {
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            });
            console.log(response.data);
            setEditChangePass(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    return (
        <Layout>
            <div className='flex justify-between items-center p-2  text-sgray-400'>
                <div>
                    <p className="font-semibold">Change Account Settings</p>
                </div>
                {/* <button type="button" id="add-user"
                    className="flex gap-2 items-center text-sblue border border-sblue focus:ring-2  font-medium rounded-xl text-base px-5 py-2.5 transition duration-300  ease-in-out  hover:scale-105 hover:bg-sblue-alt-hover"
                    onClick={editToggle}>
                    <MdEdit />
                    <span>Edit</span>
                </button> */}
            </div>
            <div className='w-full overflow-hidden p-5 '>
                <div className='mb-10 flex justify-between items-center '>
                    <p className='font-semibold  text-sgray-400'>{!editPersonInfo && "Edit "}Personal Information</p>
                    <button type="button" id="add-user"
                    className="flex gap-2 items-center text-sblue border border-sblue focus:ring-2  font-medium rounded-xl text-base px-5 py-2.5 transition duration-300  ease-in-out  hover:scale-105 hover:bg-sblue-alt-hover"
                    onClick={editToggle}>
                    <MdEdit />
                    <span>Edit</span>
                </button>
                </div>
                <div className='grid grid-cols-3 gap-10 gap-y-10'>
                    <AccountSettingsInputField name="firstname" type="text" label="First Name" disabled={editPersonInfo} value={firstname} onChange={setFirstname} />
                    <AccountSettingsInputField name="lastname" type="text" label="Last Name" disabled={editPersonInfo} value={lastname} onChange={setLastname} />
                    <AccountSettingsInputField name="username" type="text" label="Username" disabled={editPersonInfo} value={username} onChange={setUsername} />
                    <AccountSettingsInputField name="email" type="email" label="Email" disabled={editPersonInfo} value={email} onChange={setEmail} />
                    <AccountSettingsInputField name="mobile" type="text" label="Mobile Number" disabled={editPersonInfo} value={number} onChange={setNumber} />
                    <span></span>
                </div>
                {!editPersonInfo &&
                <button onClick={handleSave} className='absolute right-10 bottom-10 z-30 bg-sblue text-white hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 px-4 py-3 rounded-xl'>
                    Save Changes
                </button>
                }
                 <div className='mb-10 flex justify-between items-center'>
                    <p className='font-semibold  text-sgray-400'>{!editChangePass && "Change "}Password</p>
                    <button type="button" id="add-user"
                        className="flex gap-2 items-center text-sblue border border-sblue focus:ring-2  font-medium rounded-xl text-base px-5 py-2.5 transition duration-300  ease-in-out  hover:scale-105 hover:bg-sblue-alt-hover"
                        onClick={changePassToggle}>
                        <MdEdit />
                        <span>Edit</span>
                    </button>
                </div>
                <div className='grid grid-cols-3 gap-10 gap-y-10'>
                  {editChangePass && (
                        <>  
                            <AccountSettingsInputField name="password-old" type="password" label="Old Password" disabled={!editChangePass} value={oldPassword} onChange={setOldPassword} />
                            <AccountSettingsInputField name="password-new" type="password" label="New Password" disabled={!editChangePass} value={newPassword} onChange={setNewPassword} />
                            <AccountSettingsInputField name="password-confirmation" type="password" label="Confirm Password" disabled={!editChangePass}  value={confirmPassword} onChange={setConfirmPassword}/>
                        </>
                    )}
                </div>
                {editChangePass && (
                    <button onClick={handleSaveChangePass} className='absolute right-10 bottom-10 z-30 bg-sblue text-white hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 px-4 py-3 rounded-xl'>
                        Save Changes
                    </button>
                )}
            </div>
        </Layout>
    )
}

export default AccountSettings