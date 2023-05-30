import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Layout, UserFaceRegistrationModal } from '..';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

import { div } from '@tensorflow/tfjs';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDelete, setSelectedDelete] = useState([]);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/view')
      .then(response => {
        console.log(response.data);
        setUsers(response.data);
      });
  }, []);


  const deleteUser = (name) => {
    axios.post('http://localhost:5000/api/users/delete', { name: name }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log(response.data);
      setUsers(users.filter(user => user !== name));
    });
  }

  const toggleDelete = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach(checkbox => {
      checkbox.classList.toggle('hidden')
      checkbox.checked = false
    });
    setSelectedDelete([]);
  }

  const deleteToggle = (index) => {
    let checkbox = index.target.id.split("-")[1]
    if (selectedDelete.includes(checkbox)) {
      setSelectedDelete(selectedDelete.filter(item => item !== checkbox));
    } else {
      setSelectedDelete([...selectedDelete, checkbox]);
    }
  }

  return (
    <Layout>
      <div className='flex justify-between items-center p-2'>
        <div>
          <p className="font-semibold">List of Faces</p>
        </div>
        <div className='flex gap-2'>
          <button type="button" id="add-user"
            className="flex gap-2 items-center text-green-500 bg-green-50 focus:ring-4 focus:ring-green-300 font-medium rounded-xl text-base px-5 py-2.5"
            onClick={() => setActiveModal('add-user')}>
            <MdPersonAddAlt1 />
            <span>Add</span>
          </button>
          <button type="button" id="add-user"
            className="flex gap-2 items-center text-rose-500 bg-rose-100 focus:ring-4 focus:ring-rose-300 font-medium rounded-xl text-base px-5 py-2.5"
            onClick={toggleDelete}>
            <FaTrash />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {users.length > 0 ? (
        <div className='w-full overflow-hidden space-y-2'>
          {users.map((user, index) => (
            <div key={index} className="text-base select-none px-4 py-4 rounded-xl cursor-pointer hover:bg-violet-50 flex items-center gap-5">
              <input className='hidden' type="checkbox" id={"user-" + index} onChange={(e) => deleteToggle(e)} />
              <label htmlFor={"user-" + index} className=" font-medium text-gray-900 whitespace-nowrap">
                {user}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center h-fill'>
          <p>No user found</p>
        </div>
      )}

      {selectedDelete.length > 0 &&
        <button className='absolute right-10 bottom-10 z-30 bg-blue-500 text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 px-4 py-3 rounded-xl'>
          Delete Selected
        </button>
      }

      {activeModal &&
        <UserFaceRegistrationModal closeModal={closeModal} users={users} />
      }
    </Layout>
  )
};

export default UserList