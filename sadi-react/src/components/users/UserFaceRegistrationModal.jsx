import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";

import { HiOutlineInformationCircle } from 'react-icons/hi'
import { IoIosArrowDown } from 'react-icons/io'
import { BreadcrumbStepper, StepTwoUserFaceRegistration, CloseModalButton, StepOneInputName } from '../'


const SADI_API_URL = 'http://localhost:5000/api'

const UserFaceRegistrationModal = ({ closeModal, users }) => {
  let location = useLocation();
  const [newFaceUser, setNewFaceUser] = useState('');
  const [error, setError] = useState({})
  const [progressCount, setProgressCount] = useState(0);
  const [showDropDown, setshowDropDown] = useState(false)
  const [vidSrc, setVidSrc] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleNewUserInput = (event) => {
    setNewFaceUser(event.target.value);
    const namePattern = /^[a-zA-Z\s]*$/;
    const characterLimit = 40;
    if (!namePattern.test(newFaceUser)) {
      setError({ userFace: "Name can only contain letters." });
    } else if (newFaceUser.length > characterLimit) {
      setError({ userFace: "Name must not exceed 40 characters." });
    } else {
      setError('')
    }
    console.log(newFaceUser)
    console.log("error", error)
  }


  const handleRegisterBtn = () => {
    if (newFaceUser.length === 0) {
      setError({ userFace: 'Please enter your name' });
    } else if (error) {
    } else if (users.includes(newFaceUser)) {
      setError({ userFace: "This face is already registered." });
    } else {
      setProgressCount(1)
    }
  }

  const handleStartVideoBtn = async () => {
    setShowScanner((prevState) => !prevState)
    try {
      console.log(`url api: ${SADI_API_URL}/scanner/${newFaceUser}`)
      console.log(`url fixed: http://localhost:5000/api/scanner/${newFaceUser}`)
      console.log('vidSrc', vidSrc)
      setVidSrc(`${SADI_API_URL}/scanner/${newFaceUser}`);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDropDownBtn = () => {
    setshowDropDown(!showDropDown);
  }

  const registerUserFace = () => {
    // registerUserAPI(userData);
    // increment the step
    progressCount(2);
  }


  return (
    <div
      id="add-user-modal"
      className="fixed flex top-0 left-0 right-0 z-50 w-full items-center justify-center
       bg-gray-400 bg-opacity-50 backdrop-blur-sm p-4 overflow-x-hidden overflow-y-auto
        md:inset-0 h-modal md:h-full "
    >

      <div className="relative w-full h-full max-w-4xl  md:h-auto">
        <div className="relative bg-white rounded-lg shadow  h-[642px]">
          <CloseModalButton closeModal={closeModal} />

          <div className="px-6 py-9 lg:px-8 h-full ">
            <BreadcrumbStepper />
            <div className='flex justify-center   h-full w-full relative'>
              {/* {progressCount === 0 && */}
              <StepOneInputName
                newFaceUser={newFaceUser}
                handleNewUserInput={handleNewUserInput}
                handleRegisterBtn={handleRegisterBtn}
                error={error}
                progressCount={progressCount}
              />
              {/* // } */}
              {/* {progressCount === 1 && */}
              <StepTwoUserFaceRegistration
                registerUserFace={registerUserFace}
                faceRegisterName={newFaceUser}
                progressCount={progressCount}
              />

              {/* } */}
              {
                progressCount === 2 && <div>Done</div>
              }
            </div>
          </div>

        </div>
      </div>
    </div >

  )
}

export default UserFaceRegistrationModal