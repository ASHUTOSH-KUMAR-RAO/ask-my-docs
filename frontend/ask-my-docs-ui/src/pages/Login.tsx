import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: '#13131f',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          display: 'flex',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          height: '580px',
        }}
      >
        {/* Left — Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            width: '42%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '40px',
            backgroundColor: '#0f0f1a',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Grid Pattern */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4ade80" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Glow */}
          <div
            style={{
              position: 'absolute',
              top: '35%',
              left: '25%',
              width: '220px',
              height: '220px',
              background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
            <img src="/chat.jpg" alt="logo" style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }} />
            <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '15px' }}>Ask My Docs</span>
          </div>

          {/* Bottom Text */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 700, lineHeight: 1.4, marginBottom: '20px' }}>
              "Your documents hold the answers. We help you find them."
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                '✦ Hybrid BM25 + Vector Search',
                '✦ Citation Enforced Answers',
                '✦ Enterprise Grade RAG',
              ].map((f, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  style={{ color: '#6B7280', fontSize: '13px' }}
                >
                  {f}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right — Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            width: '58%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px',
            backgroundColor: '#1c1c2e',
          }}
        >
          <h1 style={{ color: '#FFFFFF', fontSize: '36px', fontWeight: 700, marginBottom: '6px' }}>
            Login
          </h1>
          <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '32px' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#4ade80', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#6B7280', fontSize: '12px', fontWeight: 500 }}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                style={{
                  backgroundColor: '#12122a',
                  border: '1px solid #2A2A3A',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  caretColor: '#4ade80',
                  width: '100%',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#4ade80')}
                onBlur={(e) => (e.target.style.borderColor = '#2A2A3A')}
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#6B7280', fontSize: '12px', fontWeight: 500 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{
                    backgroundColor: '#12122a',
                    border: '1px solid #2A2A3A',
                    borderRadius: '12px',
                    padding: '14px 44px 14px 16px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    caretColor: '#4ade80',
                    width: '100%',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#4ade80')}
                  onBlur={(e) => (e.target.style.borderColor = '#2A2A3A')}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#6B7280',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#6B7280', fontSize: '12px', cursor: 'pointer' }}>
                  Forgot password?
                </span>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02, opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4ade80, #16a34a)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Login
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
