import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Layout, UserFaceRegistrationModal } from '..';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { HiOutlineTrash } from 'react-icons/hi';


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDelete, setSelectedDelete] = useState(['angelo']);
  const closeModal = () => setActiveModal(null);




  const handleSelect = (idx) => {
    if (selectedDelete.includes(idx)) {
      setSelectedDelete(selectedDelete.filter(selectedIdx => selectedIdx !== idx));
    } else {
      setSelectedDelete([...selectedDelete, idx]);
    }
  }
  const getUserNames = () => {
    return selectedDelete.map(idx => users[idx].name);
  };

  const trashFace = () => {
    const userNames = getUserNames();
    // console.log('userNames', userNames);

    deleteUsers(userNames);
    setSelectedDelete([]);
  }

  const deleteUsers = (names) => {
    axios.post('http://localhost:5000/api/users/delete', { names: names }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      // console.log(response.data);
      setUsers(users.filter(user => !names.includes(user.name)));
    });
  }

  const getFaceUsers = () => {
    axios.get('http://localhost:5000/api/users/view')
      .then(response => {
        // console.log(response.data);
        setUsers(response.data);
      });

  }
  useEffect(() => {
    getFaceUsers()
  }, []);
  useEffect(() => {
    getFaceUsers()
  }, [activeModal]);

  return (
    <Layout>
      <div className='flex justify-between  text-sgray-400'>
        <h1 className="text-lg font-bold text-sgray-400 py-1 px-2">List of Users</h1>
        <div className='flex gap-x-3'>
          {selectedDelete.length > 0 &&
            <button type="button" id="delete-user"
              className="flex gap-2 items-center text-error border border-error focus:ring-1 focus:ring-error font-semibold rounded-xl text-base px-3 py-1.5 transition duration-300  ease-in-out  hover:scale-105 hover:bg-error-alt"
              onClick={trashFace}>
              <HiOutlineTrash className='text-xl flex items-center justify-center' />
              <span>Delete face</span>
            </button>
          }

          <button type="button" id="add-user"
            className="flex gap-2 items-center text-sblue border border-sblue focus:ring-2 font-semibold rounded-lg text-base px-3 py-1.5 transition duration-300  ease-in-out  hover:scale-105 hover:bg-sblue-alt-hover"
            onClick={() => setActiveModal('add-user')}>
            <MdPersonAddAlt1 className='text-xl flex items-center justify-center' />
            <span>Add user</span>
          </button>
        </div>
      </div>


      {
        users.length > 0 ? (
          <div className='w-full overflow-hidden flex justify-center flex-wrap gap-2'>
            {users.map((user, idx) => (
              <div
                key={user.name}
                className={`flex flex-col text-base select-none px-4 pt-4 pb-2 rounded-xl cursor-pointer ${selectedDelete.includes(idx) ? 'bg-blue-100' : 'hover:bg-blue-50'} items-start`}
                onClick={() => handleSelect(idx)}
              >
                <div className='w-56 h-56 overflow-hidden rounded-xl'>
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover scale-105 overflow-hidden"
                  />
                </div>
                <p
                  htmlFor={"user-" + user.id}
                  className="font-medium text-sgray-400 capitalize whitespace-nowrap pl-2 pt-2"
                >
                  {user.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <p className='text-3xl text-sgray'>No user found</p>
          </div>
        )
      }



      {
        activeModal &&
        <UserFaceRegistrationModal closeModal={closeModal} users={users} />
      }
    </Layout >
  )
};

export default UserList