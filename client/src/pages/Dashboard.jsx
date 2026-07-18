import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import AnimatedBackground from '../components/AnimatedBackground'
import { HiOutlineLightningBolt, HiOutlineChartBar, HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi'
import { RiRobot3Fill } from 'react-icons/ri'

/*
  Requires in index.css:
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*/

const GlowOrb = ({ className }) => (
    <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
)

const StatCard = ({ icon, label, value, sub, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="p-5 rounded-2xl flex flex-col gap-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
        <div className="flex items-center justify-between">
            <span className="text-white/30 text-xs uppercase tracking-widest">{label}</span>
            <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(167,139,250,0.2)' }}
            >
                {icon}
            </div>
        </div>
        <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</p>
        {sub && <p className="text-white/30 text-xs">{sub}</p>}
    </motion.div>
)

const Dashboard = ({ report }) => {
    console.log(report)
    const { userData ,userInterviewData} = useSelector(state => state.user)
    console.log(userInterviewData,userData)
    //const {userInterviewData} = useSelector(state => state.user);

    // console.log( "user slice -> ",userInterviewData)
    const navigate = useNavigate()
    const [interviewsReport, setInterviewsReport] = useState({})
    const [loading, setLoading] = useState(true)

    const name = userData?.data?.name || 'User'
    const credits = userData?.data?.credits ?? 0;

    useEffect(() => {
        console.log("Fetching interview history for userInterviewData:", userData,userInterviewData);
        const fetchHistory = async () => {
            try {

                const id = userData.data?._id;
                
                const res = await axios.get(

                    `${import.meta.env.VITE_SERVER_URL}/api/interview/get-interview`,
                     { withCredentials: true }
                );
                console.log(res)
                setInterviewsReport(res.data?.data.interviews);
                // setInterviewReport(res.data.data || []);

                // console.log("dashbora:",res.data.data)
                // console.log(interviews)
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [userData])

    const interviews = interviewsReport; // the interview question  array 
    const totalInterviews = interviewsReport.length
    // const avgScore = interviews.length
    //     ? Math.round(interviews.reduce((sum, i) => sum + (i.score || 0), 0) / interviews.length)
    //     : 0
    const avgScore = interviewsReport.finalScore;
    const lastMode = interviewsReport.mode?.toUpperCase();
    // console.log(lastMode)

    const difficultyColor = (d) => {
        if (!d) return 'rgba(255,255,255,0.3)'
        if (d === 'easy') return '#4ade80'
        if (d === 'medium') return '#fbbf24'
        return '#f87171'
    }

    const scoreColor = (s) => {
        if (!s) return '#a78bfa'
        if (s >= 80) return '#4ade80'
        if (s >= 50) return '#fbbf24'
        return '#f87171'
    }

    const callFeedback=(id)=>{
        console.log(id)
        navigate(`/feedback/${id}`)
    }

    return (
        <div
            className="relative min-h-screen"
            style={{ background: '#06050f', fontFamily: "'DM Sans', sans-serif" }}
        >
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(109,40,217,0.2),transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(59,130,246,0.1),transparent)]" />
                {/* <GlowOrb className="w-[500px] h-[500px] top-[-150px] left-1/2 -translate-x-1/2 bg-violet-700/15" /> */}
            </div>
            {/* <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
          opacity: 0.03,
        }}
      /> */}

            {/* <AnimatedBackground /> */}
            <Navbar />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                <AnimatedBackground />

                <div
                    className="absolute left-1/4 right-1/4 h-px z-10"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.6),transparent)', top: 0 }}
                />

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-10"
                >
                    <p className="text-white/25 text-xs tracking-[0.25em] uppercase mb-2">Dashboard</p>
                    <h1
                        className="text-3xl md:text-4xl font-bold text-white"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                        Welcome back,{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            {name.split(' ')[0]}
                        </span>
                    </h1>
                    <p className="text-white/35 text-sm mt-2">Here's your interview performance at a glance.</p>
                </motion.div>

                {/* ── Stat cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <StatCard
                        delay={0.1}
                        icon={<HiOutlineLightningBolt size={15} className="text-violet-400" />}
                        label="Interviews"
                        value={totalInterviews}
                        sub="Total sessions"
                    />
                    <StatCard
                        delay={0.25}
                        icon={<HiOutlineCheckCircle size={15} className="text-green-400" />}
                        label="Credits"
                        value={credits}
                        sub="Remaining"
                    />
                </div>

                {/* ── Start new interview CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-10 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    style={{
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.08))',
                        border: '1px solid rgba(167,139,250,0.2)',
                    }}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                boxShadow: '0 0 16px rgba(124,58,237,0.4)',
                            }}
                        >
                            <RiRobot3Fill size={18} color="#fff" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
                                Ready for your next session?
                            </p>
                            <p className="text-white/35 text-xs mt-0.5">Start a new AI-powered mock interview now.</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/interview')}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0"
                        style={{
                            fontFamily: "'Syne', sans-serif",
                            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                            boxShadow: '0 0 20px rgba(124,58,237,0.35)',
                        }}
                    >
                        Start Interview →
                    </motion.button>
                </motion.div>

                {/* ── Interview history ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="text-white/25 text-xs tracking-[0.2em] uppercase mb-1">History</p>
                            <h2
                                className="text-xl font-bold text-white"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                                Past Interviews
                            </h2>
                        </div>
                        <button
                            onClick={() => navigate('/history')}
                            className="text-violet-400/60 hover:text-violet-400 text-xs transition-colors duration-200"
                        >
                            View all →
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex gap-1.5">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-violet-400/40 animate-bounce"
                                        style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && interviews.length === 0 && (
                        <div
                            className="py-16 rounded-2xl flex flex-col items-center justify-center gap-3"
                            style={{ border: '1px dashed rgba(255,255,255,0.08)' }}
                        >
                            <RiRobot3Fill size={32} style={{ color: 'rgba(167,139,250,0.3)' }} />
                            <p className="text-white/30 text-sm">No interviews yet. Start your first one!</p>
                            <button
                                onClick={() => navigate('/interview')}
                                className="mt-2 text-xs text-violet-400/60 hover:text-violet-400 transition-colors"
                            >
                                Start Interview →
                            </button>
                        </div>
                    )}

                    {/* List */}
                    {!loading && interviews.length > 0 && (
                        <div className="flex flex-col gap-3">
                            {interviews.slice(0, 8).map((item, index) => (
                                <motion.div
                                    key={item._id || index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    className="flex items-center justify-between p-4 rounded-2xl group cursor-pointer transition-all duration-200"
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)'
                                        e.currentTarget.style.background = 'rgba(124,58,237,0.06)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                                    }}
                                > 
                                    {/* Left */}
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                                            style={{
                                                background: 'rgba(124,58,237,0.2)',
                                                border: '1px solid rgba(167,139,250,0.2)',
                                                fontFamily: "'Syne', sans-serif",
                                            }}
                                        >
                                            {String(index + 1).padStart(2, '0')}
                                        </div>
                                        <div>
                                            <p
                                                className="text-white/80 text-sm font-semibold capitalize"
                                                style={{ fontFamily: "'Syne', sans-serif" }}
                                            >
                                                {item.mode || 'Mock Interview'}
                                            </p>
                                            <p className="text-white/30 text-xs mt-0.5">
                                                {item.role || 'General'} •{' '}
                                                {item.createdAt
                                                    ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                    })
                                                    : '—'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="flex items-center gap-4">
                                        {item && (
                                            <span
                                                className="text-xs px-2 py-0.5 rounded-full capitalize hidden sm:block"
                                                style={{
                                                    color: difficultyColor(item.difficulty),
                                                    background: `${difficultyColor(item.difficulty)}18`,
                                                    border: `1px solid ${difficultyColor(item.difficulty)}40`,
                                                }}
                                            >
                                               
                                            </span>
                                        )}
                                        <span
                                            className="text-sm font-bold"
                                            style={{ color: scoreColor(item.score), fontFamily: "'Syne', sans-serif" }}
                                        >
                                           Score : {item.finalScore ? `${item.finalScore}` : '0'}
                                        </span>
                                        <span className="text-white/20 group-hover:text-white/50 transition-colors text-sm"onClick={()=>callFeedback(item._id)}>→</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )} 
                </motion.div>

            </div>
        </div>
    )
}

export default Dashboard