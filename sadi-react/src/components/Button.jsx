import React from 'react'
import classNames from 'classnames'

const Button = ({ className, onClick, label }) => {
    const classes = classNames(className, 'text-sm uppercase py-3 px-4 rounded-xl font-semibold')
    return (
        <div>
            <button className={classes} onClick={onClick}>
                {label}
            </button>
        </div>
    )
}

export default Button
