import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import axios from 'axios'
import { setUserData } from './Redux/userSlice'
import { useDispatch } from "react-redux"
import Interviewpage from './pages/Interviewpage'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'

// ✅ FIX: export serverurl sahi jagah pe — imports ke baad
export const serverurl = "https://interview-agent-ai.onrender.com"

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const getuser = async () => {
      try {
        const result = await axios.get(serverurl + "/api/user/current-user", {
          withCredentials: true
        })
        dispatch(setUserData(result.data))
        console.log(result.data)
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getuser()
  }, [dispatch])

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
      <Route path='/interview' element={<Interviewpage />} />
      <Route path='/history' element={<InterviewHistory />} />
      <Route path='/pricing' element={<Pricing />} />
      {/* ✅ FIX: sirf ek report route — /report/:id */}
      <Route path='/report/:id' element={<InterviewReport />} />
    </Routes>
  )
}

export default App
