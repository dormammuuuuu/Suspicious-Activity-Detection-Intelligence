import React from 'react'

const Logo = () => {
    return (
        <div className="flex items-center justify-center gap-1">

            {/* The logo */}
            <svg width="43" height="43" viewBox="0 0 43 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.9787 49.8785L2.87537 55.8866L0.914883 31.5142L12.2857 40.9231L10.9787 49.8785Z" fill="url(#paint0_linear_7_547)"/>
                <path d="M26.4012 17.2307L12.8085 17.4226L14.1155 19.7246H25.4863L26.4012 17.2307Z" fill="url(#paint1_linear_7_547)"/>
                <path d="M41.0395 6.12146L33.3283 12.4696L37.6413 16.0972C42.0328 14.2834 41.8673 8.38867 41.0395 6.12146Z" fill="url(#paint2_linear_7_547)"/>
                <path d="M43 0L9.54105 1.47368L2.3526 9.52227L9.54105 17.004H12.6778C12.6778 17.004 22.9815 16.7773 26.4012 16.7773C31.5564 16.7773 36.4651 17.004 36.4651 17.004L32.4134 13.4899H17.2523V11.6761H32.4134L40.2553 5.32794L43 0Z" fill="url(#paint3_linear_7_547)"/>
                <path d="M24.0486 20.1781H15.8146L25.4863 36.3887L13.2857 40.8097L12.0243 49.7652C12.0243 49.7652 24.0528 44.6465 36.4651 39.7895L24.0486 20.1781Z" fill="url(#paint4_linear_7_547)"/>
                <defs>
                    <linearGradient id="paint0_linear_7_547" x1="14.1155" y1="4.08096" x2="41.621" y2="12.4885" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#3D73FF"/>
                        <stop offset="1" stop-color="#66E3FF"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_7_547" x1="11.3708" y1="6.2958" x2="37.9745" y2="15.9062" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#3D73FF"/>
                        <stop offset="1" stop-color="#66E3FF"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_7_547" x1="33.0669" y1="11.7895" x2="43.076" y2="13.2882" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#25323E"/>
                        <stop offset="0.0001" stop-color="#041552"/>
                        <stop offset="1" stop-color="#4DD4FF"/>
                    </linearGradient>
                    <linearGradient id="paint3_linear_7_547" x1="11.2401" y1="4.19433" x2="38.7456" y2="12.6018" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#3D73FF"/>
                        <stop offset="1" stop-color="#66E3FF"/>
                    </linearGradient>
                    <linearGradient id="paint4_linear_7_547" x1="11.2401" y1="4.19433" x2="38.7456" y2="12.6018" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#3D73FF"/>
                        <stop offset="1" stop-color="#66E3FF"/>
                    </linearGradient>
                </defs>
            </svg>

            <span className='text-2xl font-bold text-indigo-500'>SADI</span>
        </div>
    )
}

export default Logo