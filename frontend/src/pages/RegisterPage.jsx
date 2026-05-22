import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './RegisterPage.css'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Đăng ký thất bại')
        return
      }
      navigate('/')
    } catch {
      setError('Không kết nối được server')
    }
  }

  return (
    <div className="reg-bg">
      {/* Header */}
      <div className="reg-header">
        <Link to="/" className="reg-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a0785a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </Link>
        <div className="reg-steps">
          <span className="reg-step active" />
          <span className="reg-step" />
        </div>
      </div>

      {/* Title */}
      <div className="reg-title-wrap">
        <h1 className="reg-title">Bắt đầu nào!</h1>
        <p className="reg-subtitle">Tạo tài khoản để cùng bé khám phá</p>
      </div>

      {/* Form card */}
      <form className="reg-card" onSubmit={handleSubmit}>
        <h2 className="reg-card-title">Thông tin phụ huynh</h2>

        <div className="reg-field">
          <label className="reg-label">Email</label>
          <input
            type="email"
            placeholder="Địa chỉ email của bạn"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="reg-input"
            required
          />
        </div>

        <div className="reg-field">
          <label className="reg-label">Mật khẩu</label>
          <div className="reg-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu an toàn"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="reg-input"
              required
            />
            <button type="button" className="reg-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a0785a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a0785a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="reg-field">
          <label className="reg-label">Xác nhận mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="reg-input"
            required
          />
        </div>

        {error && <p className="reg-error">{error}</p>}
      </form>

      {/* Submit button */}
      <div className="reg-footer">
        <button className="reg-btn" onClick={handleSubmit}>
          Tiếp tục
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
