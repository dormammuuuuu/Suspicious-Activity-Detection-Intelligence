import React, { useState } from 'react'
import { FaExclamationCircle } from 'react-icons/fa'

const Input = ({ label, type, placeholder, name, onChange, error }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className='flex flex-col gap-1 mb-2 w-full'>
            <label
                htmlFor={name}
                className={` pl-1 text-sm ${isFocused ? 'text-blue-500' : 'text-sgray-400'} ${error ? 'text-error' : ''}`}
            >
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                className={`px-2 py-2 rounded-lg bg-sblue-alt focus:border-sblue focus:border-1 text-sm font-medium text-sgray-400 
                ${error ? 'border-error ' : 'border-none'}
                `}
                name={name}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}

            />
            <span className={`${!error && 'invisible'} flex items-center text-error text-xs gap-x-2 ml-1`}>
                <FaExclamationCircle />
                <p>{error}</p>
            </span>
        </div >
    );
};

export default Input;