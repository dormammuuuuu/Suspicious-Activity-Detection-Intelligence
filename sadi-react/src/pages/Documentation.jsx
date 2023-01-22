import React from 'react'
import { useStateContext } from '../context/StateContext'

const Documentation = () => {
   const { samplePassData } = useStateContext()

   console.log('samplePassData: ', samplePassData)

   return (
      <div>Documentation</div>
   )
}

export default Documentation