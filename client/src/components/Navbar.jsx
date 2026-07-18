import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AnimatePresence, motion } from 'motion/react'
import { RiRobot3Fill } from "react-icons/ri"
import { RiMoneyRupeeCircleLine } from "react-icons/ri"
import { HiOutlineHome, HiOutlineChartBar, HiOutlineMicrophone, HiOutlineSparkles } from 'react-icons/hi2'
import { useNavigate, useLocation } from 'react-router-dom'
import { setUserData } from '../redux/USerSlice'
import axios from 'axios'

/*
  Requires in index.css:
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*/

const NAV_LINKS = [
  { label: 'Home',            path: '/',          icon: HiOutlineHome },
  { label: 'Dashboard',       path: '/dashboard', icon: HiOutlineChartBar },
  { label: 'Start Interview', path: '/interview', icon: HiOutlineMicrophone },
  { label: 'AI Feedback',     path: '/feedback',  icon: HiOutlineSparkles },
]

/* ── small reusable popup wrapper ── */
const Popup = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: -8, scale: 0.97 }}
    animate={{ opacity: 1, y: 0,  scale: 1 }}
    exit={{    opacity: 0, y: -8, scale: 0.97 }}
    transition={{ duration: 0.18, ease: 'easeOut' }}
    className={`absolute z-50 ${className}`}
    style={{
      background: 'linear-gradient(160deg, rgba(20,12,50,0.97), rgba(10,6,28,0.97))',
      border: '1px solid rgba(167,139,250,0.18)',
      backdropFilter: 'blur(24px)',
      borderRadius: '16px',
      boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
    }}
  >
    {children}
  </motion.div>
)

const Navbar = () => {
  const { userData } = useSelector((state) => state.user)
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const location    = useLocation()

  const [showCreditsPopup, setShowCreditsPopup] = useState(false)
  const [showUserPopup,    setShowUserPopup]    = useState(false)
  const [scrolled,         setScrolled]         = useState(false)

  /* close popups on outside click */
  const navRef = useRef(null)
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setShowCreditsPopup(false)
        setShowUserPopup(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* blur navbar on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await axios(import.meta.env.VITE_SERVER_URL + '/api/auth/logout', { withCredentials: true })
      dispatch(setUserData(null))
      setShowCreditsPopup(false)
      setShowUserPopup(false)
    } catch (e) {
      console.log(e)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-40 flex justify-between items-center px-6 py-3 transition-all duration-300"
      style={{
        fontFamily: "S,yne, sans-serif",
        background: 'transparent' ,
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.05)'
          : '1px solid transparent',
      }}
    >
      {/* ── Logo ── */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div
          className="p-2 rounded-xl transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            boxShadow: '0 0 14px rgba(124,58,237,0.35)',
          }}
        >
          <RiRobot3Fill size={18} color="#fff" />
        </div>
        <span
          className="font-bold text-white text-base"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          MockMate.AI
        </span>
      </div>

      {/* ── Nav links pill ── */}
      <div
        className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {NAV_LINKS.map(({ label, path, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm transition-all duration-200"
            style={{
              color: isActive(path) ? '#fff' : 'rgba(255,255,255,0.45)',
              background: isActive(path)
                ? 'rgba(124,58,237,0.25)'
                : 'transparent',
              fontWeight: isActive(path) ? 500 : 400,
            }}
            onMouseEnter={e => {
              if (!isActive(path)) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
              if (!isActive(path)) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            }}
            onMouseLeave={e => {
              if (!isActive(path)) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
              if (!isActive(path)) e.currentTarget.style.background = 'transparent'
            }}
          >
            {isActive(path) && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'rgba(124,58,237,0.22)',
                  border: '1px solid rgba(167,139,250,0.25)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Icon size={14} style={{ position: 'relative', zIndex: 1 }} />
            <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
          </button>
        ))}
      </div>

      {/* ── Right section ── */}
      <div className="flex items-center gap-2">

        {/* Credits button */}
        <div className="relative">
          <button
            onClick={() => { setShowCreditsPopup(false); setShowUserPopup(prev => !prev) }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm transition-all duration-200"
            style={{
              color: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(167,139,250,0.35)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
            }}
          >
            <RiMoneyRupeeCircleLine size={17} />
            <span className="font-medium">{userData?.data?.credits ?? 0}</span>
          </button>

          <AnimatePresence>
            {showUserPopup && (
              <Popup className="right-0 top-[calc(100%+10px)] w-64 p-5">
                {/* glow top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.5),transparent)' }} />

                <p className="text-white/50 text-xs tracking-widest uppercase mb-1">Credits</p>
                <p className="text-white text-3xl font-bold mb-1" style={{ fontFamily: "'Syne',sans-serif" }}>
                  {userData?.data?.credits ?? 0}
                </p>
                <p className="text-white/40 text-xs mb-5">remaining interviews available</p>

                <div className="w-full h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(((userData?.data?.credits ?? 0) / 20) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, #7c3aed, #60a5fa)',
                    }}
                  />
                </div>

                <p className="text-white/40 text-xs mb-4">Running low? Top up to keep practising.</p>
                <button
                  onClick={() => { navigate('/pricing'); setShowUserPopup(false) }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                    boxShadow: '0 0 20px rgba(124,58,237,0.35)',
                    fontFamily: "'Syne',sans-serif",
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 28px rgba(124,58,237,0.55)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.35)'}
                >
                  Add Credits → 
                </button>
              </Popup>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar / Get Started */}
        <div className="relative">
          {userData?.data ? (
            <button
              onClick={() => { setShowUserPopup(false); setShowCreditsPopup(prev => !prev) }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                boxShadow: '0 0 14px rgba(124,58,237,0.35)',
                fontFamily: "'Syne',sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 22px rgba(124,58,237,0.6)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 14px rgba(124,58,237,0.35)'}
            >
              {(userData?.data?.name?.charAt(0) || 'P').toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                boxShadow: '0 0 18px rgba(124,58,237,0.4)',
                fontFamily: "'Syne',sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 28px rgba(124,58,237,0.6)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 18px rgba(124,58,237,0.4)'}
            >
              Get Started
            </button>
          )}

          <AnimatePresence>
            {showCreditsPopup && (
              <Popup className="right-0 top-[calc(100%+10px)] w-64 p-5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.5),transparent)' }} />

                {/* avatar row */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                      fontFamily: "'Syne',sans-serif",
                    }}
                  >
                    {(userData?.data?.name?.charAt(0) || 'P').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Syne',sans-serif" }}>
                      {userData?.data?.name}
                    </p>
                    <p className="text-white/40 text-xs">{userData?.data?.email || 'Signed in'}</p>
                  </div>
                </div>

                <div className="w-full h-px mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />

                <button
                  onClick={() => { navigate('/feedback'); setShowCreditsPopup(false) }}
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white mb-2 transition-all duration-200 text-left px-3"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  📋 &nbsp;See Report
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left px-3"
                  style={{
                    background: 'rgba(220,38,38,0.1)',
                    border: '1px solid rgba(220,38,38,0.2)',
                    color: 'rgba(252,165,165,0.85)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(220,38,38,0.18)'
                    e.currentTarget.style.color = '#fca5a5'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(220,38,38,0.1)'
                    e.currentTarget.style.color = 'rgba(252,165,165,0.85)'
                  }}
                >
                  ↩ &nbsp;Sign out
                </button>
              </Popup>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar