import axios from "axios";
import { RiRobot3Fill } from "react-icons/ri";
import { HiOutlineSparkles } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react";
import { auth, provider } from '../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import { setUserData } from "../redux/USerSlice";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import { useEffect } from "react";

/*
  Requires in index.css:
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*/

const GlowOrb = ({ className }) => (
  <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
)

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  console.log(userData)

  useEffect(()=>{
    if(userData?.data){
      navigate('/')
    }
  },[userData])

  const handleGoogleAuth = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/google`,
        { name: user.displayName, email: user.email },
        { withCredentials: true }
      );
      dispatch(setUserData(response.data));
      if (response.data.message === "User authenticated successfully") {
        navigate("/");
      }
    } catch (e) {
      dispatch(setUserData(null));
      console.log(e);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden"
      style={{ background: '#06050f', fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(109,40,217,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(59,130,246,0.12),transparent)]" />
        {/* <GlowOrb className="w-[500px] h-[500px] top-[-150px] left-1/2 -translate-x-1/2 bg-violet-700/20" />
        <GlowOrb className="w-[280px] h-[280px] bottom-[-60px] right-[-40px] bg-blue-600/10" /> */}
      </div>

      {/* Grid */}
      {/* <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
          opacity: 0.03,
        }}
      /> */}

      {/* <AnimatedBackground /> */}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm rounded-3xl p-8 overflow-hidden"
        style={{
          background: 'rgba(14,10,35,0.92)',
          border: '1px solid rgba(167,139,250,0.18)',
        //   boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <AnimatedBackground />
        {/* top glow line */}
        <div
          className="absolute top-0 left-1/4 right-1/4 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.6),transparent)' }}
        />

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div
            className="p-2 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              boxShadow: '0 0 16px rgba(124,58,237,0.45)',
            }}
          >
            <RiRobot3Fill size={18} color="#fff" />
          </div>
          <span
            className="text-white font-bold text-base"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            MockMate.AI
          </span>
        </div>

        {/* Headline */}
        <div className="text-center mb-3">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl font-bold text-white leading-snug mb-3"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Your AI Interview
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Coach Awaits
            </span>
          </motion.h1>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              border: '1px solid rgba(167,139,250,0.25)',
              background: 'rgba(124,58,237,0.12)',
            }}
          >
            <HiOutlineSparkles size={12} className="text-violet-400" />
            <span className="text-violet-300 text-xs font-medium">AI Smart Interview</span>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-center text-sm leading-relaxed mb-8 mt-4"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          Sign in to start AI-powered mock interviews, track your
          progress, and unlock detailed performance insights.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <span className="text-white/20 text-xs">sign in with</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Google button */}
        <motion.button
          onClick={handleGoogleAuth}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex justify-center items-center gap-3 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(167,139,250,0.35)'
            e.currentTarget.style.background = 'rgba(124,58,237,0.12)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          }}
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>

        {/* Footer note */}
        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.18)' }}>
          By continuing, you agree to our{' '}
          <span className="text-violet-400/60 cursor-pointer hover:text-violet-400 transition-colors">
            Terms of Service
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;