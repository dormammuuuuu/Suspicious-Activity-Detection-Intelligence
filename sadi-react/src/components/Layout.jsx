import React from 'react'

const Layout = ( props ) => {
  const { children } = props;
  return (
    <div className='h-fill p-5 relative'>
        <div className="relative overflow-x-auto h-full">
            <div className="p-5 text-left text-gray-900 flex flex-col">
                { children }
            </div>
        </div>
    </div>
  )
}

export default Layout