import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../redux/userSlice';
import axios from 'axios'
import { showToast } from '../helpers/showToast';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/userFetch';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt } from "react-icons/fa";




const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

	const dispatch = useDispatch();
  const navigate = useNavigate()
  const {data: userData, loading, error} = useFetch('/api/user/current-user',
    {method: 'GET', credentials: 'include'}
  )
  
  const currentUser = userData?.data
  console.log(currentUser);
  
    


  async function handleLogout(){
      try {
        const response = await axios.post('/api/user/logout')
  
        const data = response.data
        if(data.success) {
          dispatch(removeUser())
          showToast('success',data.message)
          navigate('/sign-in')
          return;
        }
        showToast('error', data.message)
      } catch (error) {
        console.log(error.message)
        showToast("error", error.message)
      }
    }
    


  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex text-sm bg-gray-800 rounded-full focus:ring-gray-3000 "
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="sr-only">Open user menu</span>
        <img
          className="w-8 h-8 rounded-full"
          src={currentUser?.avatar || <FaUserAlt />}
          alt="user photo"
        />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-44 bg-white divide-y divide-gray-400 rounded-lg shadow-sm">
        <div className="px-4 py-3 text-sm text-gray-900 ">
          <div>{currentUser?.username}</div>
          <div className="font-medium truncate">{currentUser?.email}</div>
        </div>
        <ul className="text-md text-black" aria-labelledby="dropdownUserAvatarButton">
          <li>
            <Link 
              to={'/profile'}
              className="block px-4 py-2 hover:bg-gray-400">
              My Profile
            </Link>
          </li>
          <li>
            <Link to={'/change-password'} className="block px-4 py-2 hover:bg-gray-400">
              Change Password
            </Link>
          </li>
        </ul>
        <div className="py-2">
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-sm text-left hover:bg-red-500 w-full"
          >
            Logout
          </button>
        </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
