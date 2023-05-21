import React from 'react'
import { Logov2 } from '../SvgAssets'

const HeaderSetup = ({ stepperLabel }) => {
   return (
      <div className='w-full flex flex-col justify-start items-start mb-5'>
         <Logov2 />
         <h1 className='text-sblue mb-3 mt-5 text-2xl font-semibold'>Register Account</h1>
         <h2 className='text-black text-base font-semibold'>Step {stepperLabel.toString()} of 3</h2>
      </div>
   )
}

export default HeaderSetup