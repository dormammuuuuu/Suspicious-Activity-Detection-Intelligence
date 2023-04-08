import React from 'react'
import classNames from 'classnames'

const Button = (props) => {
    const classes = classNames('bg-indigo-500 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded-xl', props.className)
    return (
        <div>
            <button className={classes} onClick={props.onClick}>
                {props.label}
            </button>
        </div>
    )
}

export default Button
