import React from 'react'
import { useGlobalContext } from '../context'

const Documentation = () => {
   const { samplePassData } = useGlobalContext()

   console.log('samplePassData: ', samplePassData)

   return (
      <div>Documentation</div>
   )
}

export default Documentation