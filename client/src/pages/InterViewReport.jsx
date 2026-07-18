import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AnimatedBackground from './AnimatedBackground';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Navbar from './Navbar';
import { jsPDF } from 'jspdf'
import { motion } from 'motion/react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const Step3InteviewREport = ({ report }) => {

  const { userData } = useSelector(s => s.user);
  const [reportGet, setReportGet] = useState(null);   // null = loading, {} = empty
  const [loading, setLoading] = useState(true);
  const userId = userData.data._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_SERVER_URL + `api/interview/report/${userId}`, { withCredentials: true })
        setReportGet(res.data.data)
      } catch (e) {
        console.log(e)
        setReportGet({})
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (!report) {

    const {
      finalScore = 0,
      confidence = 0,
      communication = 0,
      correctness = 0,
      questionWiseData = []
    } = reportGet || {};

    const questionScoreData = questionWiseData.map((item, i) => ({
      name: `Q${i + 1}`,
      score: item.score || 0
    }))

    const percentage = finalScore * 10;

    const skills = [
      { label: 'Confidence', value: confidence },
      { label: 'Communication', value: communication },
      { label: 'Correctness', value: correctness }
    ]

    let performanceText = '';
    let shortTagline = '';

    if (finalScore >= 8) {
      performanceText = 'Ready for job opportunity';
      shortTagline = 'Excellent clarity and structured response.';
    } else if (finalScore >= 5) {
      performanceText = 'Almost There';
      shortTagline = 'Good foundation, a little more polish needed.';
    } else if (finalScore >= 3) {
      performanceText = 'Needs Improvement';
      shortTagline = "Keep practicing — you're building the right skills.";
    } else {
      performanceText = 'Just Getting Started';
      shortTagline = 'Every expert was once a beginner. Keep going!';
    }

    const downloadPDF = () => {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const leftWidth = 120;
      const rightWidth = 60;
      const gap = 5;
      let currentY = 20;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(124, 88, 255);
      doc.text("Interview Feedback Report", margin, currentY);
      currentY += 10;

      doc.setDrawColor(200);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 10;

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Final Score: ${finalScore}/10`, margin, currentY); currentY += 6;
      doc.text(`Confidence: ${confidence}/10`, margin, currentY); currentY += 6;
      doc.text(`Communication: ${communication}/10`, margin, currentY); currentY += 6;
      doc.text(`Correctness: ${correctness}/10`, margin, currentY);
      currentY += 10;

      doc.setFont("helvetica", "bold");
      doc.text("Question Breakdown", margin, currentY);
      currentY += 8;

      questionWiseData.forEach((q, i) => {
        let startY = currentY;
        if (currentY > 260) { doc.addPage(); currentY = 20; startY = currentY; }

        const leftX = margin;
        const rightX = margin + leftWidth + gap;

        doc.setFont("helvetica", "bold");
        doc.setTextColor(80);
        doc.text(`Q${i + 1}`, leftX, startY);
        let leftY = startY + 5;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(0);
        const questionText = doc.splitTextToSize(q.question || "", leftWidth);
        doc.text(questionText, leftX, leftY);
        leftY += questionText.length * 5;

        doc.setFont("helvetica", "bold");
        doc.text("Answer:", leftX, leftY);
        leftY += 5;

        doc.setFont("helvetica", "normal");
        const answerText = doc.splitTextToSize(q.answer || "", leftWidth);
        doc.text(answerText, leftX, leftY);
        leftY += answerText.length * 5;

        let rightY = startY;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(124, 88, 255);
        doc.text("AI Feedback", rightX, rightY);
        rightY += 5;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(0);
        const feedbackText = doc.splitTextToSize(q.feedback || "", rightWidth);
        doc.text(feedbackText, rightX, rightY);
        rightY += feedbackText.length * 5;

        if (q.score >= 7) doc.setTextColor(34, 197, 94);
        else if (q.score >= 5) doc.setTextColor(234, 179, 8);
        else doc.setTextColor(239, 68, 68);

        doc.setFont("helvetica", "bold");
        doc.text(`Score: ${q.score ?? "N/A"}/10`, rightX, rightY);
        doc.setTextColor(0);
        currentY = Math.max(leftY, rightY) + 10;
      });

      doc.save("Interview_Report.pdf");
    };

    // ── Shared page shell (Navbar + background always visible) ──
    // Accepts optional `topAccent` prop to show the violet gradient line under the Navbar
    const Shell = ({ children, topAccent = false }) => (
      <div className="min-h-screen relative" style={{ fontFamily: 'Syne, sans-serif' }}>
        <Navbar />
        <AnimatedBackground />
        {children}
      </div>
    )

    // ── Loading state ──
    if (loading) {
      return (
        <Shell>
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
            <p className="text-gray-400 text-sm">Loading your report…</p>
          </div>
        </Shell>
      )
    }

    // ── Empty state — no interview data yet ──
    if (!reportGet || questionWiseData.length === 0) {
      return (
        <Shell>
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
              📋
            </div>
            <div>
              <p className="text-white font-semibold text-lg mb-1">No interview yet</p>
              <p className="text-gray-400 text-sm">Complete an interview to see your feedback report here.</p>
            </div>
          </div>
        </Shell>
      )
    }

    // ── Full report ──
    return (
      <Shell topAccent>
        <div className='relative'>
          <div
              className="absolute left-1/4 right-1/4 h-px z-10"
              style={{ marginTop: '-4px', background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.6),transparent)', top: 0 }}
            />
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-8 pt-6 pb-2">
          <div>
            <span className="block text-white/25 text-xs tracking-[0.25em] uppercase mb-1">
              Report
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              Interview Feedback{' '}
              <span style={{
                background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Report
              </span>
            </h1>
          </div>
          <button
            onClick={downloadPDF}
            className="self-start sm:self-auto shrink-0 px-4 py-2.5 rounded-lg font-bold text-sm text-white bg-[#7D58FF] hover:bg-[#6a46f0] active:scale-95 transition-all"
          >
            Download PDF
          </button>
        </div>

        {/* Main layout */}
        <div className="px-4 sm:px-6 lg:px-8 pb-14 mt-5 lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start space-y-5 lg:space-y-0">

          {/* Sidebar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5 lg:col-span-1">

            {/* Overall Performance */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-center p-5 rounded-2xl shadow-lg"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-sm sm:text-base text-[#9f9c9c] mb-4">Overall Performance</p>
              <div className="flex justify-center">
                <div className="w-24 h-24">
                  <CircularProgressbar
                    value={percentage}
                    text={`${finalScore}/10`}
                    styles={buildStyles({
                      textSize: "28px",
                      pathColor: "#a78bfa",
                      textColor: "#ffffff",
                      trailColor: "rgba(255,255,255,0.1)",
                    })}
                  />
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2">Out of 10</p>
              <p className="font-semibold text-white text-sm sm:text-base mt-3">{performanceText}</p>
              <p className="text-gray-400 text-xs mt-1">{shortTagline}</p>
            </motion.div>

            {/* Skill Evaluation */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="p-5 rounded-2xl shadow-lg"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-sm sm:text-base text-[#9f9c9c] mb-4">Skill Evaluation</p>
              <div className="space-y-4">
                {skills.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5 text-sm">
                      <span className="text-gray-400">{s.label}</span>
                      <span className="font-semibold text-[#9890FA]">{s.value}/10</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-700/60">
                      <div
                        className="bg-[#9890FA] h-full rounded-full transition-all duration-700"
                        style={{ width: `${(s.value || 0) * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Performance Trend */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="rounded-2xl p-4 sm:p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h3 className="text-sm sm:text-base font-semibold text-gray-200 mb-4">Performance Trend</h3>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={questionScoreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 11, fill: '#999' }} />
                    <YAxis domain={[0, 10]} stroke="#666" tick={{ fontSize: 11, fill: '#999' }} />
                    <Tooltip
                      contentStyle={{
                        background: '#1a1230',
                        border: '1px solid rgba(167,139,250,0.35)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 13,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#a78bfa"
                      strokeWidth={2.5}
                      dot={{ fill: '#a78bfa', r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#c4b5fd' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Question Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="rounded-2xl p-4 sm:p-6"
              style={{ background: "rgba(75,46,122,0.12)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h3 className="text-sm sm:text-base font-semibold text-gray-300 mb-5">Question Breakdown</h3>
              <div className="space-y-4">
                {questionWiseData.map((q, i) => {
                  const isWeak = q.score < 5;
                  return (
                    <div
                      key={i}
                      className={`p-4 sm:p-5 rounded-xl border transition-colors duration-300 ${
                        isWeak
                          ? "border-red-500/40 bg-red-500/5"
                          : "border-white/[0.06] bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-4">

                        {/* Question + Answer */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                            Question {i + 1}
                          </p>
                          <p className="font-semibold text-gray-200 text-sm leading-relaxed">
                            {q.question || "Question not available"}
                          </p>
                          <div className="mt-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Answer</p>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {q.answer || "Answer not available"}
                            </p>
                          </div>
                        </div>

                        {/* AI Feedback */}
                        <div className="w-full md:w-60 lg:w-64 shrink-0 bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/25 p-4 rounded-xl">
                          <p className="text-[10px] text-violet-400 font-semibold uppercase tracking-widest mb-2">
                            AI Feedback
                          </p>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {q.feedback || "No feedback available"}
                          </p>
                          <p className={`text-xs mt-3 font-bold ${
                            q.score >= 7 ? "text-green-400" : q.score >= 5 ? "text-yellow-400" : "text-red-400"
                          }`}>
                            Score: {q.score ?? "N/A"} / 10
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      
      </div>
      </Shell>
    )
  }

  // When `report` prop IS provided (live post-interview result)
  const {
    finalScore = 0,
    correctness = 0,
    communication = 0,
    confidence = 0,
    questionWiseData = []
  } = report;

  console.log(finalScore, correctness, communication, confidence, questionWiseData)

  return (
    <div>
      {/* render live report content here */}
    </div>
  )
}

export default Step3InteviewREport