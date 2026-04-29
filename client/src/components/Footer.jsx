import React from 'react'
import { BsRobot } from 'react-icons/bs'

function Footer() {
  return (
    <footer className="bg-[#f3f3f3] px-4 py-10">
      
      <div className="w-full max-w-6xl mx-auto bg-white rounded-[24px] shadow-sm border border-gray-200 py-8 px-6 text-center">
        
        {/* Logo + Title */}
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={16} />
          </div>
          <h2 className="font-semibold text-lg">Interview Agent.AI</h2>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
          AI-powered interview preparation platform designed to improve 
          communication skills, technical depth and professional confidence.
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Text */}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Interview Agent.AI. All rights reserved.
        </p>

      </div>

    </footer>
  )
}

export default Footer