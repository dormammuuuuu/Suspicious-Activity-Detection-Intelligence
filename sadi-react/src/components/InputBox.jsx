import React from 'react'

const InputBox = (props) => {
    return (
        <div className='flex flex-col gap-2 mb-4'>
            <label htmlFor={props.label} className='text-neutral-600 text-sm'>{props.label}</label>
            <input
                type={props.type}
                placeholder={props.placeholder}
                className="p-2 border-none rounded-lg bg-violet-50 focus:outline-indigo-500 text-sm font-medium"
                name={props.name}
                onChange={props.onChange}
            />
            <p className='text-red-500 text-xs'>
                {props.error}
            </p>
        </div>
    )
}

export default InputBox
