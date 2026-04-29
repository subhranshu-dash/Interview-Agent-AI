import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { serverurl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'


function InterviewHistory() {
    // ✅ FIX 1: useState([]) — undefined ki jagah empty array
    const [interviews, setInterviews] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(serverurl + "/api/interview/get-interview", { withCredentials: true })
                console.log(result.data)
                setInterviews(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getMyInterviews()
    }, [])


    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-10'>
            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>
                {/* ✅ FIX 2: bg-linear-to-br → bg-gradient-to-br, 90w → 90vw */}
                <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
                    <button
                        onClick={() => navigate("/")}
                        className='mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
                        <FaArrowLeft className='text-gray-600' />
                    </button>

                    <div>
                        <h1 className='text-3xl font-bold flex-nowrap text-gray-800'>
                            Interview History
                        </h1>
                        <p className='text-gray-500'>
                            Track your past interviews and performance reports
                        </p>
                    </div>
                </div>

                {interviews.length === 0 ?
                    <div className='bg-white p-10 rounded-2xl shadow text-center'>
                        <p className='text-gray-500'>
                            No interviews found. Start your first interview.
                        </p>
                    </div>
                    :
                    // ✅ FIX 3: interviews.map() lagaya — data show hoga
                    <div className='grid gap-3'>
                        {interviews.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(`/report/${item._id}`)}
                                className='bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100'>

                                <div className='flex justify-between items-center flex-wrap gap-2'>
                                    <div>
                                        <h2 className='text-lg font-semibold text-gray-800'>{item.role}</h2>
                                        <p className='text-sm text-gray-500'>{item.experience} • {item.mode}</p>
                                    </div>

                                    <div className='text-right'>
                                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status === "completed"
                                            ? "bg-emerald-100 text-emerald-600"
                                            : "bg-yellow-100 text-yellow-600"
                                            }`}>
                                            {item.status}
                                        </span>
                                        {item.finalScore !== undefined && (
                                            <p className='text-sm text-gray-500 mt-1'>Score: {item.finalScore}</p>
                                        )}
                                    </div>
                                </div>

                                <p className='text-xs text-gray-400 mt-3'>
                                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "short", year: "numeric"
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}

export default InterviewHistory