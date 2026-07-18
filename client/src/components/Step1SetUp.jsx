import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaUserTie, FaBriefcase, FaChevronDown } from 'react-icons/fa'
import { HiOutlineMicrophone, HiOutlineSparkles } from 'react-icons/hi'
import { FaChartLine } from 'react-icons/fa'
import { RiFileUploadFill, RiCheckboxCircleFill } from 'react-icons/ri'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { setInterviewData, setUserData } from '../redux/USerSlice'
import AnimatedBackground from './AnimatedBackground'
import Navbar from './Navbar'

const GlowOrb = ({ className }) => (
  <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
)

const features = [
  { icon: <FaUserTie size={14} className="text-violet-400" />,      title: 'Role & Experience',    desc: 'Questions tailored to your level and target role.' },
  { icon: <HiOutlineMicrophone size={14} className="text-blue-400" />, title: 'Smart Voice Interview', desc: 'Respond naturally just like a real interview.' },
  { icon: <FaChartLine size={13} className="text-fuchsia-400" />,    title: 'Performance Analysis',  desc: 'Instant AI feedback on every answer.' },
]

const Step1SetUp = ({ onStart }) => {
  const [role, setRole]                 = useState('')
  const [experience, setExperience]     = useState('')
  const [mode, setMode]                 = useState('')
  const [resumeFile, setResumeFile]     = useState(null)
  const [loading, setLoading]           = useState(false)
  const [projects, setProjects]         = useState([])
  const [skills, setSkills]             = useState([])
  const [resumeText, setResumeText]     = useState('')
  const [analysisDone, setAnalysisDone] = useState(false)
  const [analyzing, setAnalyzing]       = useState(false)
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return
    setAnalyzing(true)
    const formdata = new FormData()
    formdata.append('resume', resumeFile)
    try {
      const result = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/interview/resume-analyze', formdata, { withCredentials: true })
      setRole(result.data.data.role)
      setExperience(result.data.data.experience)
      setProjects(result.data?.data?.projects || [])
      setSkills(result.data?.data?.skills || [])
      setResumeText(result.data?.data?.resumeText || '')
      setAnalysisDone(true)
      console.log(result.data.data)
    } catch (e) {
      console.log(e.response?.data || e.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleStart = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_URL + '/api/interview/generate-questions',
        { role, experience, mode, resumeText, projects, skills },
        { withCredentials: true }
      )
      if (userData) dispatch(setUserData({ ...userData, credits: res.data.creditsLeft }))
        console.log("create interview",res.data.data); // interviewId
        dispatch(setInterviewData(res.data.data.interviewId));
        onStart(res.data.data)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const canStart = role && experience && mode && !loading

  const fieldStyle = {
    width: '100%',
    padding: '11px 14px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: 'white',
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  const onFocus = e => { e.target.style.borderColor = 'rgba(167,139,250,0.5)' }
  const onBlur  = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }

  return (
     <div
      className="relative min-h-screen"
      style={{ fontFamily: '"DM Sans", sans-serif', background: '#06050f' }}
    >
      <AnimatedBackground />
      <Navbar />

      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16">
        <AnimatedBackground />
        <div
          className="w-full max-w-5xl rounded-3xl overflow-hidden grid md:grid-cols-2"
          style={{
            border: '1px solid rgba(167,139,250,0.15)',
            // boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
          }}
        >
          {/* top glow line */}
          <div
            className="absolute left-1/4 right-1/4 h-px z-10"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.6),transparent)', top: 0 }}
          />

          {/* ── LEFT PANEL ── */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative p-5 flex flex-col justify-between overflow-hidden"
            style={{ background: 'linear-gradient(160deg,rgba(20,10,50,0.98),rgba(10,6,28,0.95))' }}
          >
            <div
              className="absolute right-0 top-12 bottom-12 w-px"
              style={{ background: 'linear-gradient(to bottom,transparent,rgba(167,139,250,0.2),transparent)' }}
            />

            <div>
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{ border: '1px solid rgba(167,139,250,0.25)', background: 'rgba(124,58,237,0.12)' }}
              >
                <HiOutlineSparkles size={11} className="text-violet-400" />
                <span className="text-violet-300 text-xs font-medium tracking-wide">AI-Powered</span>
              </div>

              <h2
                className="text-3xl font-bold leading-tight mb-3"
                style={{ fontFamily: "'Syne', sans-serif", color: '#f0eaff' }}
              >
                Start Your
                <br />
                <span style={{
                  background: 'linear-gradient(135deg,#a78bfa,#60a5fa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  AI Interview
                </span>
              </h2>

              <p className="text-white/38 text-sm leading-relaxed mb-10">
                Practice real scenarios powered by AI. Build communication, sharpen technical skills, and walk in with confidence.
              </p>

              <div className="flex flex-col gap-5">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.12 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(167,139,250,0.2)' }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <p className="text-white/82 text-sm font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>{f.title}</p>
                      <p className="text-white/30 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

                     
          </motion.div>

          {/* RIGHT PANEL  */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-10 flex flex-col justify-center"
            style={{ background: 'rgba(10,7,25,0.97)' }}
          >
            <h2
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Interview Setup
            </h2>
            <p className="text-white/32 text-sm mb-8">Fill in the details to get started.</p>

            <div className="flex flex-col gap-3">

              {/* Role */}
              <div className="relative">
                <FaUserTie size={13} className="absolute top-1/2 left-3.5 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.28)' }} />
                <input
                  type="text"
                  placeholder="Target role  (e.g. Frontend Engineer)"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{ ...fieldStyle, paddingLeft: 36 }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Experience */}
              <div className="relative">
                <FaBriefcase size={13} className="absolute top-1/2 left-3.5 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.28)' }} />
                <input
                  type="text"
                  placeholder="Years of experience"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  style={{ ...fieldStyle, paddingLeft: 36 }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Mode */}
              <div className="relative">
                <FaChevronDown size={10} className="absolute top-1/2 right-3.5 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.22)' }} />
                <select
                  value={mode}
                  onChange={e => setMode(e.target.value)}
                  style={{
                    ...fieldStyle,
                    appearance: 'none',
                    cursor: 'pointer',
                    color: mode ? 'white' : 'rgba(255,255,255,0.28)',
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                >
                  <option value="" style={{ background: '#06050f' }}>Select interview mode</option>
                  <option value="technical"   style={{ background: '#06050f', color: 'white' }}>Technical Interview</option>
                  <option value="hr"          style={{ background: '#06050f', color: 'white' }}>HR Interview</option>
                  <option value="behavioural" style={{ background: '#06050f', color: 'white' }}>Behavioural Interview</option>
                  <option value="full-mock"   style={{ background: '#06050f', color: 'white' }}>Full Mock Interview</option>
                </select>
              </div>

              {/* Resume upload / result */}
              <AnimatePresence mode="wait">
                {!analysisDone ? (
                  <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div
                      onClick={() => document.getElementById('resume-file').click()}
                      className="flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200"
                      style={{ border: '1px dashed rgba(255,255,255,0.1)' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(167,139,250,0.35)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    >
                      <RiFileUploadFill size={14} style={{ color: resumeFile ? '#a78bfa' : 'rgba(255,255,255,0.22)', flexShrink: 0 }} />
                      <span className="text-xs" style={{ color: resumeFile ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)' }}>
                        {resumeFile ? resumeFile.name : 'Upload resume'}
                      </span>
                      <input
                        type="file"
                        id="resume-file"
                        accept="application/pdf"
                        onChange={e => setResumeFile(e.target.files[0])}
                        className="hidden"
                      />
                    </div>

                    <AnimatePresence>
                      {resumeFile && (
                        <motion.button
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          onClick={e => { e.stopPropagation(); handleUploadResume() }}
                          disabled={analyzing}
                          className="w-full mt-2 py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
                          style={{
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'transparent',
                            color: 'rgba(255,255,255,0.5)',
                            cursor: analyzing ? 'not-allowed' : 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {analyzing ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="w-3 h-3 border border-white/20 border-t-white/60 rounded-full animate-spin" />
                              Analysing…
                            </span>
                          ) : 'Analyse Resume'}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3.5 rounded-xl"
                    style={{ border: '1px solid rgba(167,139,250,0.18)', background: 'rgba(124,58,237,0.06)' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <RiCheckboxCircleFill size={12} style={{ color: '#a78bfa' }} />
                      <span className="text-white/45 text-xs">Resume analysed</span>
                    </div>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {skills.map((s, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(167,139,250,0.18)', color: '#c4b5fd' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {projects.length > 0 && (
                      <ul className="space-y-1 mt-1">
                        {projects.map((p, i) => (
                          <li key={i} className="text-white/35 text-xs flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-violet-500/50 flex-shrink-0" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

              {/* Start button */}
              <motion.button
                onClick={handleStart}
                disabled={!canStart}
                whileTap={canStart ? { scale: 0.97 } : {}}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: canStart ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(255,255,255,0.05)',
                  color: canStart ? 'white' : 'rgba(255,255,255,0.15)',
                  boxShadow: canStart ? '0 0 24px rgba(124,58,237,0.35)' : 'none',
                  cursor: canStart ? 'pointer' : 'not-allowed',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Starting…
                  </span>
                ) : 'Start Interview'}
              </motion.button>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Step1SetUp