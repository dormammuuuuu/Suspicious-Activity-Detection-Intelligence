import React from 'react'

const UserList = () => {
   return (
      <div >
         <div className="container relative overflow-x-auto sm:rounded-lg">
            <div className="p-5 text-lg font-bold text-left text-gray-900 bg-white flex items-center justify-between">
               <div className="inline-block">
                  List of Faces
                  <p className="mt-1 text-sm font-normal text-gray-500 ">
                     {/* {% if users %} */}
                     This is the list of all the faces registered at the system.
                     {/* {% else %} */}
                     There are no faces registered at the system.
                     {/* {% endif %} */}
                  </p>
               </div>
               <button type="button" id="add-user"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Add
                  User</button>
            </div>
            {/* {% if users %} */}
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
                  {/* {% for user in users %} */}
                  <tr className="user-item bg-white border-b cursor-pointer hover:bg-gray-300 hover:bg-opacity-50"
                     data-name="{{user}}">
                     <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">

                     </th>
                     <td className="px-6 py-4 text-right">
                        <button data-name="{{ user }}" href="#"
                           className="user-delete font-medium text-red-600 hover:underline">Delete</button>
                     </td>
                  </tr>
                  {/* {% endfor %} */}
               </tbody>
            </table>
            {/* {% endif %} */}
         </div>


         <div id="add-user-modal"
            className="fixed hidden top-0 left-0 right-0 z-50 w-full items-center justify-center bg-gray-400 bg-opacity-50 backdrop-blur-sm p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
            <div className="relative w-full h-full max-w-md md:h-auto">

               <div className="relative bg-white rounded-lg shadow">
                  <button type="button"
                     className="absolute close-button  top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                     data-modal-hide="authentication-modal">
                     <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                           d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                           clip-rule="evenodd"></path>
                     </svg>
                     <span className="sr-only">Close modal</span>
                  </button>

                  <div className="px-6 py-6 lg:px-8">
                     <h3 className="mb-4 text-xl font-medium text-gray-900">Register New User
                     </h3>
                     <p className="mb-4 font-sm text-gray-500">Please note that the user's name cannot be modified after
                        it has been saved.</p>
                     <div>
                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900">
                           Name</label>
                        {/* <input type="text" name="name" id="name"
                           className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                           placeholder="John Doe" required> */}
                     </div>
                     <button type="submit" id="add-user-submit"
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create
                        User</button>
                  </div>
               </div>
            </div>
         </div>



      </div>
   )
}

export default UserList