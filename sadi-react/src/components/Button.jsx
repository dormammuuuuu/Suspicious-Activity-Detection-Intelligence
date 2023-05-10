import React from 'react'
import classNames from 'classnames'

const Button = ({ className, onClick, label }) => {
    const classes = classNames('bg-sblue hover:bg-blue-700 text-white text-sm py-3 px-4 rounded-xl font-semibold', className)
    return (
        <div>
            <button className={classes} onClick={onClick}>
                {label}
            </button>
        </div>
    )
}

export default Button
