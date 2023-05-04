import React from 'react'

const AccountSettingsInputField = (props) => {
  const { label, type, name, disabled } = props;
  return (
    <div className='flex flex-col gap-y-2'>
        <label className="text-black/80 text-neutral-400" htmlFor={name}>{label}</label>
        <input className="border-none bg-violet-50 disabled:bg-transparent rounded-md" type={type} name={name} id={name} disabled={disabled} />
    </div>
  )
}

export default AccountSettingsInputField