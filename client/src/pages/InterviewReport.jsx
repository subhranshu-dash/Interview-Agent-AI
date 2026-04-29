import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { serverurl } from '../App'
import { FaArrowLeft, FaDownload } from 'react-icons/fa'
import jsPDF from 'jspdf'

function InterviewReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const getReport = async () => {
      try {
        const result = await axios.get(serverurl + `/api/interview/report/${id}`, {
          withCredentials: true
        })
        setReport(result.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    getReport()
  }, [id])

  // ✅ jsPDF only — no html2canvas, no oklch error
  const downloadPDF = () => {
    setDownloading(true)
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      let y = 20

      const checkNewPage = (neededSpace = 20) => {
        if (y + neededSpace > 270) {
          pdf.addPage()
          y = 20
        }
      }

      // ── Title
      pdf.setFillColor(16, 185, 129)
      pdf.rect(0, 0, pageWidth, 18, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Interview Performance Report', pageWidth / 2, 12, { align: 'center' })
      y = 28

      // ── Overall Scores
      pdf.setTextColor(30, 30, 30)
      pdf.setFontSize(13)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Overall Performance', 14, y)
      y += 8

      const scores = [
        { label: 'Final Score', value: report.finalScore },
        { label: 'Confidence', value: report.confidence },
        { label: 'Communication', value: report.communication },
        { label: 'Correctness', value: report.correctness },
      ]

      scores.forEach((s, i) => {
        const x = 14 + i * 46
        pdf.setFillColor(240, 253, 244)
        pdf.roundedRect(x, y, 42, 18, 3, 3, 'F')
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')

        const val = s.value ?? 0
        if (val >= 7) pdf.setTextColor(16, 185, 129)
        else if (val >= 4) pdf.setTextColor(234, 179, 8)
        else pdf.setTextColor(239, 68, 68)

        pdf.text(String(val), x + 21, y + 8, { align: 'center' })
        pdf.setFontSize(7)
        pdf.setTextColor(100, 100, 100)
        pdf.setFont('helvetica', 'normal')
        pdf.text(s.label, x + 21, y + 14, { align: 'center' })
      })
      y += 28

      // ── Divider
      pdf.setDrawColor(200, 200, 200)
      pdf.line(14, y, pageWidth - 14, y)
      y += 8

      // ── Question Wise
      pdf.setFontSize(13)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(30, 30, 30)
      pdf.text('Question Wise Analysis', 14, y)
      y += 8

      report.questionwiseScore?.forEach((q, index) => {
        checkNewPage(60)

        // Question header
        pdf.setFillColor(249, 250, 251)
        pdf.roundedRect(14, y, pageWidth - 28, 8, 2, 2, 'F')
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(100, 100, 100)
        pdf.text(`Question ${index + 1}`, 18, y + 5.5)

        // Score badge
        const score = q.score ?? 0
        if (score >= 7) pdf.setTextColor(16, 185, 129)
        else if (score >= 4) pdf.setTextColor(234, 179, 8)
        else pdf.setTextColor(239, 68, 68)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`Score: ${score}/10`, pageWidth - 18, y + 5.5, { align: 'right' })
        y += 12

        // Question text
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(40, 40, 40)
        const questionLines = pdf.splitTextToSize(q.question || '', pageWidth - 28)
        checkNewPage(questionLines.length * 5 + 10)
        pdf.text(questionLines, 14, y)
        y += questionLines.length * 5 + 4

        // Mini scores
        checkNewPage(16)
        const miniScores = [
          { label: 'Confidence', value: q.confidence ?? 0 },
          { label: 'Communication', value: q.communication ?? 0 },
          { label: 'Correctness', value: q.correctness ?? 0 },
        ]
        miniScores.forEach((ms, mi) => {
          const mx = 14 + mi * 60
          pdf.setFillColor(240, 253, 244)
          pdf.roundedRect(mx, y, 55, 12, 2, 2, 'F')
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'bold')
          const v = ms.value
          if (v >= 7) pdf.setTextColor(16, 185, 129)
          else if (v >= 4) pdf.setTextColor(234, 179, 8)
          else pdf.setTextColor(239, 68, 68)
          pdf.text(String(v), mx + 27, y + 6, { align: 'center' })
          pdf.setFontSize(7)
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(100, 100, 100)
          pdf.text(ms.label, mx + 27, y + 10, { align: 'center' })
        })
        y += 16

        // Feedback
        if (q.feedback) {
          checkNewPage(20)
          pdf.setFillColor(236, 253, 245)
          const feedbackLines = pdf.splitTextToSize(`Feedback: ${q.feedback}`, pageWidth - 36)
          pdf.roundedRect(14, y, pageWidth - 28, feedbackLines.length * 5 + 6, 2, 2, 'F')
          pdf.setFontSize(8)
          pdf.setFont('helvetica', 'italic')
          pdf.setTextColor(5, 150, 105)
          pdf.text(feedbackLines, 18, y + 5)
          y += feedbackLines.length * 5 + 10
        }

        // Divider between questions
        pdf.setDrawColor(220, 220, 220)
        pdf.line(14, y, pageWidth - 14, y)
        y += 6
      })

      // ── Footer
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Generated by AI Interview Agent', pageWidth / 2, 287, { align: 'center' })

      pdf.save(`Interview_Report_${id}.pdf`)
    } catch (error) {
      console.log("PDF error:", error)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-emerald-50'>
        <p className='text-gray-500 text-lg animate-pulse'>Loading report...</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-emerald-50'>
        <p className='text-red-500 text-lg'>Report not found.</p>
      </div>
    )
  }

  const scoreColor = (score) => {
    if (score >= 7) return 'text-emerald-600'
    if (score >= 4) return 'text-yellow-500'
    return 'text-red-500'
  }

  const scoreBg = (score) => {
    if (score >= 7) return 'bg-emerald-100 text-emerald-600'
    if (score >= 4) return 'bg-yellow-100 text-yellow-600'
    return 'bg-red-100 text-red-500'
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-10'>
      <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>

        {/* Header */}
        <div className='mb-6 flex items-center justify-between flex-wrap gap-4'>
          <div className='flex items-start gap-4'>
            <button
              onClick={() => navigate("/history")}
              className='mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
              <FaArrowLeft className='text-gray-600' />
            </button>
            <div>
              <h1 className='text-3xl font-bold text-gray-800'>Interview Report</h1>
              <p className='text-gray-500'>Detailed performance analysis</p>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className='flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-3 rounded-2xl shadow-md hover:opacity-90 transition font-semibold disabled:opacity-60'>
            <FaDownload size={16} />
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
        </div>

        {/* Overall Score Card */}
        <div className='bg-white rounded-3xl shadow-md p-8 mb-6'>
          <h2 className='text-xl font-bold text-gray-700 mb-6'>Overall Performance</h2>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {[
              { label: "Final Score", value: report.finalScore },
              { label: "Confidence", value: report.confidence },
              { label: "Communication", value: report.communication },
              { label: "Correctness", value: report.correctness },
            ].map((item, i) => (
              <div key={i} className='bg-gray-50 rounded-2xl p-4 text-center border border-gray-100'>
                <p className={`text-3xl font-bold ${scoreColor(item.value)}`}>{item.value}</p>
                <p className='text-xs text-gray-500 mt-1'>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Question Wise Score */}
        <div className='space-y-4'>
          <h2 className='text-xl font-bold text-gray-700 mb-2'>Question Wise Analysis</h2>
          {report.questionwiseScore?.map((q, index) => (
            <div key={index} className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
              <div className='flex justify-between items-start flex-wrap gap-2 mb-3'>
                <p className='text-sm font-semibold text-gray-400'>Question {index + 1}</p>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${scoreBg(q.score)}`}>
                  Score: {q.score}/10
                </span>
              </div>
              <p className='text-gray-800 font-medium mb-4'>{q.question}</p>
              <div className='grid grid-cols-3 gap-3 mb-4'>
                {[
                  { label: "Confidence", value: q.confidence },
                  { label: "Communication", value: q.communication },
                  { label: "Correctness", value: q.correctness },
                ].map((s, i) => (
                  <div key={i} className='bg-gray-50 rounded-xl p-3 text-center'>
                    <p className={`text-xl font-bold ${scoreColor(s.value)}`}>{s.value}</p>
                    <p className='text-xs text-gray-400'>{s.label}</p>
                  </div>
                ))}
              </div>
              {q.feedback && (
                <div className='bg-emerald-50 border border-emerald-100 rounded-xl p-4'>
                  <p className='text-sm font-semibold text-emerald-700 mb-1'>💬 Feedback</p>
                  <p className='text-sm text-gray-600'>{q.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className='mt-8 flex gap-4'>
          <button
            onClick={() => navigate("/history")}
            className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-2xl shadow-md hover:opacity-90 transition font-semibold'>
            Back to History
          </button>
          <button
            onClick={() => navigate("/")}
            className='flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-2xl shadow-md hover:shadow-lg transition font-semibold'>
            New Interview
          </button>
        </div>

      </div>
    </div>
  )
}

export default InterviewReport