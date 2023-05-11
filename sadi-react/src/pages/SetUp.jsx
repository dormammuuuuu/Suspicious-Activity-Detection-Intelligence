import React, { useState, useRef, useEffect } from 'react'
import LoadingBar from 'react-top-loading-bar'
import axios from 'axios'

import {
    HeaderSetup,
    RegisterInputsSetup,
    FaceRegistrationSetup,
    RegistrationDoneSetup
} from '../components'



const Setup = () => {
    const loadingRef = useRef(null)
    const [error, setError] = useState('');
    const [setupStep, setSetupStep] = useState(1);



    const registerUserAPI = async (userCredential) => {
        try {
            loadingRef.current.continuousStart();
            axios.post('http://localhost:5000/api/setup', userCredential).then(res => {
                loadingRef.current.complete();

                console.log(JSON.stringify(res.data, null, 2));
                if (res.data.status === 'success') {

                    console.log('Success')
                    setSetupStep(2);
                    // window.location.href = '/login'
                } else {

                    console.log('Failed')
                    setError(res.data.error)
                }

            })
        } catch (error) {
            loadingRef.current.complete();

            console.log("Catched")
        }
    }

    // STEP 1 BUTTON
    const registerUserCredentials = (userData) => {
        // registerUserAPI(userData);
        // increment the step
        setSetupStep(2);
    }

    // STEP 2 BUTTON
    const registerUserFace = () => {
        // registerUserAPI(userData);
        // increment the step
        setSetupStep(3);
    }

    return (
        <div className='flex items-center justify-center h-screen bg-sblue-alt'>
            <div className='flex flex-col items-center  max-w-lg w-full  h-[733px] px-9 py-7 rounded-lg bg-white relative overflow-hidden'>
                <LoadingBar
                    color='#6875F5'
                    ref={loadingRef}
                    height={5}
                    transitionTime={100}
                    containerStyle={{ position: 'absolute', top: '0', left: '0', width: '100%' }}
                />
                <HeaderSetup stepperLabel={setupStep} />

                <div className='flex items-center justify-center h-full w-full relative'>
                    {/* STEP 1 */}
                    <div
                        className={` transform duration-500 w-full   h-full transition-transform  ${setupStep === 1 ? 'translate-x-0' : '-translate-x-[512px]'
                            }`}
                    >
                        <RegisterInputsSetup registerUserCredentials={registerUserCredentials} error={error} />
                    </div>

                    {/* STEP 2 */}
                    <div
                        className={`absolute transform duration-500 w-full h-full transition-transform ${setupStep === 2 ? 'translate-x-0' : 'translate-x-[512px]'
                            }`}
                    >

                        <FaceRegistrationSetup registerUserFace={registerUserFace} />
                    </div>

                    {/* STEP 3 */}
                    <div
                        className={`transform transition-transform ${setupStep === 3 ? 'translate-x-0' : '-translate-x-[140%]'
                            }`}
                    >
                        {/* <RegisterInputsSetup registerUserCredentials={registerUserCredentials} error={error} /> */}
                        {/* <RegistrationDoneSetup /> */}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Setup