import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation } from "react-router-dom";
import { BreadcrumbStepper } from './'
import { IoClose } from 'react-icons/io5'
import { HiOutlineInformationCircle } from 'react-icons/hi'
import { IoIosArrowDown } from 'react-icons/io'

const SADI_API_URL = 'http://localhost:5000/api'


const Modal = ({ closeModal }) => {
  let location = useLocation();

  const [newUser, setNewUser] = useState('');
  const [showError, setShowError] = useState(false); //Todo: add error handling
  const [newUserErrorText, setNewUserErrorText] = useState('')
  const [progressCount, setProgressCount] = useState(0);
  const [showDropDown, setshowDropDown] = useState(false)
  const [vidSrc, setVidSrc] = useState('');
  const [showScanner, setShowScanner] = useState(false);



  const handleNewUserInput = () => {
    const namePattern = /^[a-zA-Z\s]*$/;
    const characterLimit = 40;
    if (!namePattern.test(newUser)) {
      setShowError(true);
      setNewUserErrorText("Name can only contain letters.");
    } else if (newUser.length > characterLimit) {
      setShowError(true);
      setNewUserErrorText("Do your parents love you? What if your teacher ask you to write your name in paper back to back how many century you will finish it? Name must not exceed in 40 characters long");

    } else {
      setShowError(false);
      setNewUserErrorText('')
    }
    console.log(newUserErrorText)
  }


  const handleRegisterBtn = () => {
    if (newUser.length == 0) {
      setShowError(true);
      setNewUserErrorText("Name field cannot be empty");
    } else if (showError) {
      //Todo: add eror message
      setShowError(true);
      setNewUserErrorText('There is an error!')
    } else {
      setProgressCount(1)
    }
  }

  const handleStartVideoBtn = async () => {
    setShowScanner((prevState) => !prevState)
    try {
      console.log(`url api: ${SADI_API_URL}/scanner/${newUser}`)
      console.log(`url fixed: http://localhost:5000/api/scanner/${newUser}`)
      console.log('vidSrc', vidSrc)
      setVidSrc(`${SADI_API_URL}/scanner/${newUser}`);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDropDownBtn = () => {
    setshowDropDown(!showDropDown);
  }

  useEffect(() => {
    handleNewUserInput()
  }, [newUser, setNewUser])

  useEffect(() => {
    console.log(newUser)
  }, [newUser])



  return (
    <div
      id="add-user-modal"
      className="fixed flex top-0 left-0 right-0 z-50 w-full items-center justify-center
       bg-gray-400 bg-opacity-50 backdrop-blur-sm p-4 overflow-x-hidden overflow-y-auto
        md:inset-0 h-modal md:h-full "
    >

      <div className="relative w-full h-full max-w-4xl  md:h-auto">
        <div className="relative bg-white rounded-lg shadow  h-[642px]">
          <button type="button"
            onClick={closeModal}
            className="absolute close-button top-3 right-2.5 text-gray-400 bg-transparent
             hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex 
              items-center"
            data-modal-hide="authentication-modal">
            <IoClose className="w-6 h-6" />
            <span className="sr-only">Close modal</span>
          </button>

          <div className="px-6 py-9 lg:px-8 h-full">
            <BreadcrumbStepper />
            {progressCount === 0 &&
              <div className='md:w-5/6 md:mx-auto  h-4/5 '>
                <div class="bg-blue-50 border-t-4 border-blue-300 rounded-md text-gray-900 px-2 py-1 shadow-sm mx-14" role="alert">
                  <div class="flex">
                    <div class="py-1">
                      <HiOutlineInformationCircle className='h-6 w-6 text-blue-500 mr-4' />
                    </div>
                    <div>
                      <p class="font-bold">Register New User</p>
                      <p class="text-sm">
                        Please note that the user's name cannot be modified after it has been saved.
                      </p>
                    </div>
                  </div>
                </div>


                <div className='flex justify-center flex-col items-center py-28 '>
                  <div className='w-full md:w-3/6 pt-7'>
                    <label className='relative cursor-pointer mb-4 input-txt-bg'>
                      <input type="text"
                        id="name"
                        name="name"
                        placeholder="Input name"
                        required
                        className='h-10 px-4 py-4  w-full  text-base  bg-gray-100 leading-tight text-gray-700  border-gray-200 border-[1px] rounded-lg border-opacity-50 outline-none focus:border-indigo-500
                       focus:bg-white placeholder-gray-300 placeholder-opacity-0 transition duration-200  '
                        value={newUser}
                        onChange={(e) => setNewUser(e.target.value)} />
                      <span className='text-base  text-gray-600  text-opacity-80 bg-gray-100 absolute left-5 top-[-2px] px-1 transition duration-200 input-text '>Name</span>
                      {showError && <p class="text-red-500 pl-2 pt-1  text-center text-xs italic">{newUserErrorText}</p>}

                    </label>
                  </div>
                  <div className="flex justify-center items-center sm:my-5 ">
                    <button
                      type="button"
                      className="py-2 px-4 w-72 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                      onClick={handleRegisterBtn}>
                      Register
                    </button>
                  </div>
                </div>
              </div>
            }
            {progressCount === 1 &&
              <div className='flex flex-col items-center md:w-5/6 md:mx-auto  h-4/5 mt-2'>
                <div class="bg-blue-50 border-t-4 border-blue-300 rounded-b text-gray-900 px-2 py-1 shadow-sm mx-10" role="alert">
                  <div class="flex">
                    <div class="py-1">
                      <HiOutlineInformationCircle className='h-6 w-6 text-blue-500 mr-4' />
                    </div>
                    <div>
                      <p class="font-bold">Face Registration</p>
                      <p class="text-sm">   Please register your face to set up the device.
                        By doing so, the device will know that you are the owner and it will only respond to your face,
                        ensuring better accuracy and security.
                      </p>
                    </div>
                  </div>
                </div>

                <figure class="h-[300px] mt-4 mb-5">
                  {
                    showScanner ?
                      <img
                        key={location.pathname}
                        src={vidSrc}
                        alt="Webcam Video"
                        class="w-auto max-h-full rounded-lg object-cover drop-shadow-lg "

                      /> :
                      <img
                        src="https://flowbite.com/docs/images/examples/image-3@2x.jpg"
                        alt="Webcam Video"
                        class="w-auto max-h-full rounded-lg object-cover  drop-shadow-lg"

                      />
                  }

                  {/* <figcaption class="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                    Webcam Stream
                  </figcaption> */}
                </figure>
                <div className='relative'>
                  <button
                    id="dropdownRadioBgHoverButton"
                    data-dropdown-toggle="dropdownRadioBgHover"
                    class=" relative text-blue-600 bg-transparent w-72 border-blue-600 border-[1px] hover:bg-gray-100 focus:ring-4 focus:outline-none
                   focus:ring-blue-100 font-medium rounded-lg text-sm px-4 
                py-2.5 text-center inline-flex items-center "
                    type="button"
                    onClick={handleDropDownBtn}
                  >
                    Choose Video Source
                    <IoIosArrowDown className=' absolute right-4   w-4 h-4 ml-2' />
                  </button>

                  {/* <!-- Dropdown menu --> */}
                  {showDropDown &&
                    <div id="dropdownRadioBgHover" class="z-10 w-72 absolute bg-white divide-y divide-gray-100 rounded-lg shadow ">
                      <ul class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioBgHoverButton">
                        <li>
                          <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <input
                              id="default-radio-4"
                              type="radio"
                              value=""
                              name="default-radio"
                              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700
                         dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label for="default-radio-4" class="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Default radio</label>
                          </div>
                        </li>
                        <li>
                          <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <input
                              checked
                              id="default-radio-5"
                              type="radio"
                              value=""
                              name="default-radio"
                              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700
                        dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label for="default-radio-5" class="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Checked state</label>
                          </div>
                        </li>
                        <li>
                          <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <input id="default-radio-6"
                              type="radio"
                              value=""
                              name="default-radio"
                              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700
                        dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label for="default-radio-6" class="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Default radio</label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  }
                </div>


                <button
                  type="button"
                  className="z-0 py-2 px-4 w-72 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-500 m-3"
                  onClick={handleStartVideoBtn}>
                  Start Face Registration
                </button>

              </div>
            }
            {
              progressCount === 2 && <div>Done</div>
            }
          </div>

        </div>
      </div>
    </div >

  )
}

export default Modal

