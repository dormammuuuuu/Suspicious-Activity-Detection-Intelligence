import React from 'react'

const InputBox = (props) => {
    return (
        <div className='flex flex-col gap-2 mb-2'>
            <label htmlFor={props.label} className='text-slate-600'>{props.label}</label>
            <input
                type={props.type}
                placeholder={props.placeholder}
                className="p-2 border border-indigo-200 rounded-lg bg-violet-50 focus:outline-indigo-500"
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
