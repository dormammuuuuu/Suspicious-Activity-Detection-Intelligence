import React from 'react'

const InputCheckBox = (props) => {
    return (
        <div className='flex flex-row gap-2 mb-5'>
            <input
                type={props.type}
                placeholder={props.placeholder}
                className="p-2 border border-indigo-200 rounded-lg bg-violet-50 focus:outline-indigo-500"
                name={props.name}
            />
            <label htmlFor={props.name} className='text-slate-600 text-xs'>{props.label}</label>
        </div>
    )
}

export default InputCheckBox   
