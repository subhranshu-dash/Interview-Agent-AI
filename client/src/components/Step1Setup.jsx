import React, { useState } from 'react'
import { motion } from 'motion/react'
import { FaUserTie, FaBriefcase, FaFileUpload, FaMicrophone, FaChartLine } from "react-icons/fa";
import axios from "axios"
import { serverurl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../Redux/userSlice';

function Step1Setup({ onStart }) {

  // ✅ FIXED state names
  const {userData} = useSelector((state)=>state.user)
  const dispatch = useDispatch()
  const [role, setRole] = useState("")
  const [experience, setExperience] = useState("")
  const [mode, setMode] = useState("Technical")
  const [resumefile, setResumefile] = useState(null)
  const [loading ,setLoading] =useState(false)
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [resumeText, setResumeText] = useState("")
  const [analysisisDone, setAnalysisDone] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  // ✅ FIXED function
  const handelUploadResume = async () => {
    if (!resumefile || analyzing) return

    setAnalyzing(true)

    const formdata = new FormData()
    formdata.append("resume", resumefile)

    try {
      const result = await axios.post(
        serverurl + "/api/interview/resume",
        formdata,
        { withCredentials: true }
      )

      console.log(result.data)

      // ✅ FIXED mapping
      setRole(result.data.role || "")
      setExperience(result.data.experience || "")
      setProjects(result.data.projects || [])
      setSkills(result.data.skills || [])
      setResumeText(result.data.resumeText || "")

      setAnalysisDone(true)
    } catch (error) {
      console.log(error)
    } finally {
      setAnalyzing(false)
    }
  }

   const handelStart=async()=>{
    setLoading(true)
    try{
    const result = await axios.post(
  serverurl + "/api/interview/generate-question",
  
  { 
    role,
    experience,
    skills,
    mode
  },
  { withCredentials: true }
)
console.log("INTERVIEW DATA:", result.data)
    if(userData){
      dispatch(setUserData({...userData ,credits :result.data.creditsLeft}))
    }
    setLoading(false)

    onStart(result.data)


    }catch(error){
     console.log(error)
     setLoading(false)
    }
   }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4'
    >
      <div className='w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden'>

        {/* LEFT */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className='bg-gradient-to-br from-green-50 to-green-100 p-12'
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Start your AI Interview
          </h2>

          <div className='space-y-5'>
            {[
              { icon: <FaUserTie />, text: "Choose Role & Experience" },
              { icon: <FaMicrophone />, text: "Smart Voice Interview" },
              { icon: <FaChartLine />, text: "Performance Analytics" },
            ].map((item, index) => (
              <motion.div key={index}
                whileHover={{ scale: 1.03 }}
                className='flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm'>
                <span className='text-green-600 text-xl'>{item.icon}</span>
                <span className='text-gray-700'>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className='p-12'
        >
          <h2 className='text-3xl font-bold text-gray-800 mb-8'>
            Interview Setup
          </h2>

          <div className='space-y-6'>

            {/* Role */}
            <div className='relative'>
              <FaUserTie className='absolute top-4 left-4 text-gray-400' />
              <input
                type='text'
                placeholder='Enter role'
                className='w-full pl-12 py-3 border rounded-xl'
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            {/* Experience */}
            <div className='relative'>
              <FaBriefcase className='absolute top-4 left-4 text-gray-400' />
              <input
                type='text'
                placeholder='Experience'
                className='w-full pl-12 py-3 border rounded-xl'
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            {/* Mode */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className='w-full py-3 px-4 border rounded-xl'
            >
              <option value="Technical">Technical</option>
              <option value="HR">HR</option>
            </select>

            {/* Upload */}
            {!analysisisDone && (
              <div
                onClick={() => document.getElementById("resumeUpload").click()}
                className='border-2 border-dashed p-8 text-center cursor-pointer rounded-xl'
              >
                <FaFileUpload className='text-4xl mx-auto mb-3 text-green-600' />

                <input
                  type="file"
                  id="resumeUpload"
                  hidden
                  onChange={(e) => setResumefile(e.target.files[0])}
                />

                <p>
                  {resumefile ? resumefile.name : "Upload Resume"}
                </p>

                {resumefile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handelUploadResume()
                    }}
                    className='mt-4 bg-black text-white px-5 py-2 rounded'
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </button>
                )}
              </div>
            )}

            {/* RESULT */}
            {analysisisDone && (
              <div className='bg-gray-50 p-5 rounded-xl space-y-4'>

                <h3 className='font-semibold'>Resume Analysis</h3>

                {projects.length > 0 && (
                  <div>
                    <p className='font-medium'>Projects:</p>
                    <ul className='list-disc ml-5'>
                      {projects.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <p className='font-medium'>Skills:</p>
                    <div className='flex flex-wrap gap-2'>
                      {skills.map((s, i) => (
                        <span key={i} className='bg-green-100 px-3 py-1 rounded-full'>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Button */}
            <motion.button
             onClick={handelStart}
              disabled={!role || !experience||loading}
              whileHover={{scale:1.03}}
              whileTap={{scale:0.95}}
              className='w-full bg-green-600 text-white py-3 rounded-full'
            >
              { loading ? "Starting...":"Start Interview"}
            </motion.button>

          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Step1Setup