import React, { useRef } from 'react'
import Navbar from '../components/Navbar'
import AnimatedBackground from '../components/AnimatedBackground'
import { useSelector } from 'react-redux'
import { HiOutlineSparkles } from "react-icons/hi2";
import { motion, useScroll, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import aiFeatures from '../utils/features'
import aiInterviewFeatures from '../utils/advanceFeature'
import firstFourInterviewModes from '../utils/interviewmodes'
import Footer from '../components/Footer';



const GlowDivider = () => (
  <div className="relative my-27 flex items-center">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
    <div className="mx-4 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_4px_rgba(167,139,250,0.5)]" />
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
  </div>
);

function Home() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    
    <div
      className="relative min-h-screen"
      style={{ fontFamily: '"DM Sans", sans-serif', background: '#06050f' }}
    >
      <AnimatedBackground />
      <Navbar />

     
      <div className="relative z-10">
        <AnimatedBackground />
         <motion.section
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 pt-6 pb-10 text-center"
        >
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 backdrop-blur-md text-violet-300 text-sm font-medium tracking-wide"
          >
            <HiOutlineSparkles size={14} />
            Elevate your interview skills with{' '}
            <span className="text-white font-semibold">MockMate.AI</span>
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold leading-[1.08] tracking-tight max-w-4xl"
            style={{ fontFamily: "'Syne', sans-serif", color: '#f0eaff' }}
          >
            Practice real interviews.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #f0abfc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Get instant AI feedback.
            </span>
          </motion.h1>

          {/* sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-white/50 max-w-xl leading-relaxed"
          >
            Simulate real interview experiences, identify your weaknesses,
            and build confidence with AI-driven insights.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-4 mt-10"
          >
            <button
              onClick={() => navigate('/interview')}
              className="relative group px-7 py-3.5 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300"
              style={{
                fontFamily: "'Syne', sans-serif",
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                boxShadow: '0 0 30px rgba(124,58,237,0.45)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Interview
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-violet-500 to-indigo-500" />
            </button>

            <button
              onClick={() => navigate('/history')}
              className="px-7 py-3.5 rounded-xl font-medium text-white/70 hover:text-white border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              View History
            </button>
          </motion.div>

          {/* scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-10 flex flex-col items-center gap-2"
          >
            <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
            />
          </motion.div>
        </motion.section>

        <div className="max-w-6xl mx-auto px-6">
          <GlowDivider />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center text-white/30 text-xs tracking-[0.3em] uppercase mb-14"
          >
            What MockMate brings to the table
          </motion.p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-10">
            {aiFeatures.slice(0, 3).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ scale: 1.04, rotate: 0 }}
                className="relative p-7 w-80 max-w-[90%] rounded-2xl cursor-default transition-all duration-300 group"
                style={{
                  background: 'linear-gradient(145deg, rgba(124,58,237,0.12), rgba(79,70,229,0.07))',
                  border: '1px solid rgba(167,139,250,0.18)',
                  backdropFilter: 'blur(16px)',
                  rotate: index === 0 ? '-4deg' : index === 1 ? '3deg' : '-2deg',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                  marginTop: index === 1 ? '-24px' : undefined,
                }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 40px rgba(139,92,246,0.15)' }} />

                <div className="text-3xl mb-4">{item.icon}</div>
                <h3
                  className="text-white text-lg font-semibold mb-2"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">{item.description}</p>

                <div className="absolute top-4 right-4 w-6 h-6 rounded-full border border-violet-500/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 opacity-60" />
                </div>
              </motion.div>
            ))}
          </div>

          <GlowDivider />

          <div className="mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">Under the hood</p>
              <h2
                className="text-4xl md:text-5xl font-bold text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Advanced AI{' '}
                <span
                  style={{
                    background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Capabilities
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {aiInterviewFeatures.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="relative p-7 rounded-2xl group cursor-default overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(15,10,40,0.9), rgba(30,20,60,0.6))',
                    border: '1px solid rgba(167,139,250,0.15)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* left accent bar */}
                  <div
                    className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'linear-gradient(to bottom, #7c3aed, #3b82f6)' }}
                  />

                  {/* ghost number */}
                  <span
                    className="absolute top-5 right-6 text-5xl font-bold opacity-[0.06] select-none"
                    style={{ fontFamily: "'Syne', sans-serif", color: '#a78bfa' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h3
                    className="text-white text-xl font-semibold mb-3 pl-5"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed pl-5 mb-3">{item.description}</p>
                  <p className="text-violet-300/70 text-sm pl-5 font-medium">{item.whatLearned}</p>
                </motion.div>
              ))}
            </div>
          </div>

         
          <GlowDivider />

          <div className="mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">Choose your challenge</p>
              <h2
                className="text-4xl md:text-5xl font-bold text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Interview{' '}
                <span
                  style={{
                    background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Formats
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {firstFourInterviewModes.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="relative p-6 rounded-2xl cursor-pointer group overflow-hidden"
                  style={{
                    background: 'linear-gradient(160deg, rgba(20,12,50,0.95), rgba(12,8,30,0.9))',
                    border: '1px solid rgba(167,139,250,0.12)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* hover radial glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.2), transparent 70%)' }}
                  />

                  {/* ghost index */}
                  <span
                    className="text-5xl font-bold opacity-[0.07] absolute top-3 right-4 select-none"
                    style={{ fontFamily: "'Syne', sans-serif", color: '#a78bfa' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="flex items-center gap-2 mb-5">
                    <div
                      className="w-2.5 h-2.5 rounded-full group-hover:scale-125 transition-transform duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                        boxShadow: '0 0 8px rgba(167,139,250,0.7)',
                      }}
                    />
                    <span className="text-white/25 text-xs tracking-widest uppercase">Mode {index + 1}</span>
                  </div>

                  <h3
                    className="text-white text-base font-bold mb-4 relative z-10"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {item.title}
                  </h3>

                  <div className="w-8 h-px bg-gradient-to-r from-violet-500/50 to-transparent mb-4" />

                  <p className="text-white/40 text-sm leading-relaxed relative z-10 group-hover:text-white/60 transition-colors duration-300">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center gap-1 text-violet-400/40 group-hover:text-violet-400 transition-colors duration-300 text-xs font-medium">
                    <span>Select format</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;