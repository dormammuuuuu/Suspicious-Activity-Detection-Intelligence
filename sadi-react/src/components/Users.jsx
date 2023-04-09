import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Modal } from './';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
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

  return (
    <div >
      <div className="relative overflow-x-auto">
        <div className="p-5 text-lg font-bold text-left text-gray-900 flex items-center justify-between">
          <div className="inline-block">
            List of Faces
            <p className="mt-1 text-sm font-normal text-gray-500 ">
              {users.length > 0 ? (
                "This is the list of all the faces registered at the system."
              ) : (
                "There are no faces registered at the system."
              )}
            </p>
          </div>
          <button type="button" id="add-user"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            onClick={() => setActiveModal('add-user')}>
            Add User
          </button>
        </div>
        {users.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-500">

            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="user-item border-b cursor-pointer hover:bg-gray-300 hover:bg-opacity-50"
                  data-name="">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {user}
                  </th>
                  <td className="px-6 py-4 text-right">
                    <button data-name="" href="#"
                      className="user-delete font-medium text-red-600 hover:underline" onClick={() => deleteUser(user)}>Delete</button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        ) : (
          <div className='bg-red-400 p-5 bg-opacity-40 text-red-500 border border-red-500 rounded-lg text-center mx-5 my-5'>
            <p>No user found</p>
          </div>
        )}
      </div>

      {activeModal &&
        <Modal closeModal={closeModal} />


      }
    </div>
  )
};

export default UserList