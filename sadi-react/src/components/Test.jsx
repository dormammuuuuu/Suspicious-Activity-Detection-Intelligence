import React from 'react'
import axios from 'axios'

const Test = () => {

    const handleClick = async () => {
        try {
            axios.get('http://localhost:5000/api/data')
                .then(res => {
                    console.log(res.data)
                })
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div>
            <button onClick={handleClick}>Click</button>
        </div>
    )
}

export default Test