import React from 'react'
import { RiRobot3Fill } from 'react-icons/ri'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'

const footerLinks = [
  {
    heading: 'Product',
    links: ['Start Interview', 'View History', 'Dashboard', 'Pricing'],
  },
  {
    heading: 'Modes',
    links: ['Technical Interview', 'HR Interview', 'Full Mock Interview', 'Behavioural Interview'],
  },
  
]

const Footer = () => {
  return (
    <footer
      className="relative w-full border-t border-white/[0.06] mt-10"
      style={{ background: 'rgba(6,5,15,0.95)', fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)' }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">

        {/* ── top row ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">

          {/* brand col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="p-2 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  boxShadow: '0 0 18px rgba(124,58,237,0.4)',
                }}
              >
                <RiRobot3Fill size={20} color="#fff" />
              </div>
              <span
                className="text-white text-lg font-bold"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                MockMate.AI
              </span>
            </div>

            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-7">
              Your AI-powered interview coach. Practice technical, HR, and mock
              interviews with realistic questions, get instant feedback, and build
              confidence for your next opportunity.
            </p>

            {/* social icons */}
            {/* <div className="flex items-center gap-3">
              {[
                { icon: <FaGithub size={16} />, label: 'GitHub' },
                { icon: <FaTwitter size={16} />, label: 'Twitter' },
                { icon: <FaLinkedin size={16} />, label: 'LinkedIn' },
                { icon: <HiOutlineMail size={16} />, label: 'Email' },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all duration-200 group"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)'
                    e.currentTarget.style.background = 'rgba(124,58,237,0.15)'
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(124,58,237,0.25)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div> */}
          </div>

          {/* link cols */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4
                className="text-white/90 text-xs font-semibold tracking-[0.2em] uppercase mb-5"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/35 text-sm hover:text-white/80 transition-colors duration-200 cursor-pointer"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── divider ── */}
        <div className="w-full h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

        {/* ── bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} MockMate.AI — All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/25 text-xs hover:text-white/50 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer