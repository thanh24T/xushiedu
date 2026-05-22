import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import fighting from '../../pics/animation/fighting.png'
import './DashboardPage.css'

const LABEL_VI = {
  'apple': 'Quả táo', 'airplane': 'Máy bay', 'axe': 'Cái rìu', 'angel': 'Thiên thần',
  'The Great Wall of China': 'Vạn Lý Trường Thành', 'ambulance': 'Xe cứu thương',
  'alarm clock': 'Đồng hồ báo thức', 'aircraft carrier': 'Tàu sân bay',
  'The Mona Lisa': 'Nàng Mona Lisa', 'The Eiffel Tower': 'Tháp Eiffel',
  'cat': 'Con mèo', 'cactus': 'Cây xương rồng', 'popsicle': 'Que kem',
  'bicycle': 'Xe đạp', 'helicopter': 'Trực thăng', 'zebra': 'Ngựa vằn',
  'windmill': 'Cối xay gió', 'knife': 'Con dao', 'house plant': 'Cây trong nhà',
  'mouse': 'Con chuột',
}

const LABEL_EMOJI = {
  'apple': '🍎', 'airplane': '✈️', 'cat': '🐱', 'bicycle': '🚲',
  'ambulance': '🚑', 'helicopter': '🚁', 'zebra': '🦓', 'mouse': '🐭',
  'cactus': '🌵', 'popsicle': '🍦', 'windmill': '🌀', 'knife': '🔪',
  'axe': '🪓', 'angel': '👼', 'alarm clock': '⏰', 'aircraft carrier': '🛳️',
  'The Eiffel Tower': '🗼', 'The Great Wall of China': '🏯',
  'The Mona Lisa': '🖼️', 'house plant': '🪴',
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) { setLoading(false); return }

    fetch(`http://127.0.0.1:5000/progress/${user.id}`)
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const chartData = stats?.chart || []
  const recentActivities = stats?.recent || []

  return (
    <div className="dash-layout">
      <Sidebar />
      <div className="dash-body">
        <Navbar />
        <main className="dash-main">
          <h2 className="dash-section-title">Learning Progress</h2>
          <p className="dash-section-sub">Analysis for current period.</p>

          {/* Stats */}
          <div className="dash-stats">
            <div className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: '#ede9fe' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div>
                <p className="dash-stat-label">VOCABULARY SIZE</p>
                <p className="dash-stat-value">
                  {loading ? '...' : `${stats?.vocab_size ?? 0} Từ vựng`}
                </p>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: '#ffe4e6' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
                </svg>
              </div>
              <div>
                <p className="dash-stat-label">MOTOR SKILLS</p>
                <p className="dash-stat-value">
                  {loading ? '...' : `${stats?.motor_score ?? 0}/100 Điểm`}
                </p>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: '#fce7f3' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/><path d="M12 8h.01"/>
                </svg>
              </div>
              <div>
                <p className="dash-stat-label">COGNITIVE ENGAGEMENT</p>
                <p className="dash-stat-value">
                  {loading ? '...' : `${stats?.engagement ?? 0}% Tương tác`}
                </p>
              </div>
            </div>
          </div>

          {/* Chart + Recent */}
          <div className="dash-bottom">
            <div className="dash-chart-card">
              <p className="dash-chart-title">Biểu đồ Phát triển Từ vựng (6 tháng qua)</p>
              <div style={{ overflowX: 'auto' }}>
              <ResponsiveContainer width={Math.max(300, (stats?.chart?.length || 2) * 80)} height={200}>
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#aaa', fontSize: 12 }} />
                  <YAxis hide domain={[0, dataMax => Math.max(dataMax + 3, 5)]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#c05010"
                    strokeWidth={3}
                    connectNulls={false}
                    dot={{ fill: '#fff', stroke: '#c05010', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              </div>
            </div>

            <div className="dash-recent-card">
              <p className="dash-chart-title">Recent Activities</p>
              <div className="dash-activities">
                {recentActivities.length === 0 && !loading && (
                  <p style={{ color: '#bbb', fontSize: 13 }}>Chưa có hoạt động nào</p>
                )}
                {recentActivities.map((item, i) => (
                  <div key={i} className="dash-activity-item">
                    <div className="dash-activity-emoji">
                      {LABEL_EMOJI[item.label] || '🎨'}
                    </div>
                    <div className="dash-activity-info">
                      <p className="dash-activity-label">{LABEL_VI[item.label] || item.label}</p>
                      <p className="dash-activity-desc">
                        {item.is_correct ? '✅ Đúng' : '❌ Sai'} · {item.tries} lần thử
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <div className="dash-mascot-wrap">
          <img src={fighting} alt="mascot" className="dash-mascot" />
        </div>
      </div>
    </div>
  )
}
