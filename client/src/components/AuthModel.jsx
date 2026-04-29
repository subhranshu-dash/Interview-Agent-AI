import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaTimesCircle } from "react-icons/fa";
import Auth from '../pages/Auth';

function AuthModel({ onClose }) {

  const { userData } = useSelector((state) => state.user)

  useEffect(() => {
    if (userData) {
      onClose()
    }
  }, [userData, onClose])

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm px-4'>
      
      <div className='relative w-full max-w-md bg-white rounded-xl p-6 shadow-lg'>

        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-600 hover:text-black'
        >
          <FaTimesCircle size={20} />
        </button>

        {/* Auth Form */}
        <Auth isModel={true} />

      </div>

    </div>
  )
}

export default AuthModel