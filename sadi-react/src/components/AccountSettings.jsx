import React, { useState } from 'react'
import Layout from './Layout'
import AccountSettingsInputField from './AccountSettingsInputField'
import { MdEdit } from 'react-icons/md';



const AccountSettings = () => {
    const [edit, setEdit] = useState(true);

    const editToggle = () => {
        setEdit(!edit);
    }

    return (
        <Layout>
            <div className='flex justify-between items-center p-2'>
                <div>
                    <p className="font-semibold">Change Account Settings</p>
                </div>
                <button type="button" id="add-user"
                    className="flex gap-2 items-center text-gray-500 bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-base px-5 py-2.5"
                    onClick={editToggle}>
                        <MdEdit />
                        <span>Edit</span>
                </button>
            </div>
            <div className='w-full overflow-hidden p-5'>
                <div className='mb-10'>
                    <p className='font-semibold'>{ !edit && "Edit " }Personal Information</p>
                </div>
                <div className='grid grid-cols-3 gap-10 gap-y-10'>
                    <AccountSettingsInputField name="firstname" type="text" label="First Name" disabled={edit}/>
                    <AccountSettingsInputField name="lastname" type="text" label="Last Name" disabled={edit}/>
                    <AccountSettingsInputField name="username" type="text" label="Username" disabled={edit}/>
                    <AccountSettingsInputField name="email" type="email" label="Email" disabled={edit}/>
                    <AccountSettingsInputField name="mobile" type="number" label="Mobile Number" disabled={edit}/>
                    <span></span>
                    { !edit &&
                        <>
                            <AccountSettingsInputField name="password" type="password" label="Password" disabled={edit} />
                            <AccountSettingsInputField name="password-confirmation" type="password" label="Confirm Password" disabled={edit} />
                        </>
                    }
                </div>
            </div>
        </Layout>
    )
}

export default AccountSettings