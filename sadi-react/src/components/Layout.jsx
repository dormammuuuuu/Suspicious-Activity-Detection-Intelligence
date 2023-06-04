import React from 'react'

const Layout = (props) => {
  const { children } = props;
  return (
    <div className='h-full relative'>
      <div className="relative h-full w-full">
        {children}
      </div>
    </div>
  )
}

export default Layout