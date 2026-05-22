import { useEffect, useState } from 'react'
import { Lock } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import mascot from '../../pics/animation/achivements.png'
import './AchievementsPage.css'

const BADGES = [
  {
    id: 'artist',
    name: 'Họa sĩ nhí',
    emoji: '🎨',
    desc: 'Đã mở khóa',
    color: '#ff6b35',
    bg: '#2d1b00',
    condition: (stats) => stats.vocab_size >= 1,
    locked_desc: 'Vẽ 1 hình đầu tiên',
  },
  {
    id: 'animal_expert',
    name: 'Chuyên gia Động vật',
    emoji: '🦁',
    desc: 'Đã mở khóa',
    color: '#7c5cbf',
    bg: '#1a0a3d',
    condition: (stats) => stats.vocab_size >= 3,
    locked_desc: 'Vẽ đúng 3 động vật',
  },
  {
    id: 'math',
    name: 'Nhà Toán Học',
    emoji: '🔢',
    desc: null,
    color: '#aaa',
    bg: '#eee',
    condition: (stats) => stats.vocab_size >= 10,
    locked_desc: 'Cần thêm 5 bài',
  },
  {
    id: 'astronaut',
    name: 'Phi hành gia',
    emoji: '🚀',
    desc: null,
    color: '#aaa',
    bg: '#eee',
    condition: (stats) => stats.motor_score >= 80,
    locked_desc: 'Đạt cấp 10',
  },
]

export default function AchievementsPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) return
    fetch(`http://127.0.0.1:5000/progress/${user.id}`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  const stars = stats?.stars ?? 0
  const streak = stats?.streak ?? 0

  // Merge badge data từ API với config local (emoji, color...)
  const BADGE_CONFIG = {
    artist:        { emoji: '🎨', color: '#ff6b35', bg: '#2d1b00' },
    animal_expert: { emoji: '🦁', color: '#7c5cbf', bg: '#1a0a3d' },
    math:          { emoji: '🔢', color: '#aaa',    bg: '#eee' },
    astronaut:     { emoji: '🚀', color: '#aaa',    bg: '#eee' },
  }

  const badges = stats?.badges?.map(b => ({
    ...b,
    ...BADGE_CONFIG[b.id]
  })) || []

  return (
    <div className="ach-layout">
      <Sidebar />
      <div className="ach-body">
        <Navbar />
        <main className="ach-main">

          {/* Hero banner */}
          <div className="ach-hero">
            <div className="ach-hero-blobs">
              <div className="blob blob-pink" />
              <div className="blob blob-blue" />
            </div>
            <div className="ach-hero-text">
              <h2 className="ach-hero-title">Góc Thành Tích Của Bé</h2>
              <p className="ach-hero-sub">Cùng xem bé đã đạt được những gì nhé!</p>
            </div>
            <img src={mascot} alt="mascot" className="ach-mascot" />
          </div>

          {/* Stats row */}
          <div className="ach-stats">
            <div className="ach-stat-card">
              <div>
                <p className="ach-stat-title">Số sao tích lũy</p>
                <p className="ach-stat-sub">Tuyệt vời quá!</p>
              </div>
              <div className="ach-stat-value">
                <span>{stars}</span>
                <div className="ach-stat-icon star">⭐</div>
              </div>
            </div>
            <div className="ach-stat-card">
              <div>
                <p className="ach-stat-title">Chuỗi ngày vẽ</p>
                <p className="ach-stat-sub">Giữ vững phong độ nhé!</p>
              </div>
              <div className="ach-stat-value">
                <span>{streak}</span>
                <div className="ach-stat-icon fire">🔥</div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="ach-badges-section">
            <h3 className="ach-badges-title">
              <span className="ach-badges-icon">⊕</span>
              Bộ Sưu Tập Huy Hiệu
            </h3>
            <div className="ach-badges-grid">
              {badges.map(badge => (
                <div key={badge.id} className={`ach-badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}>
                  <div className="ach-badge-icon-wrap" style={{ background: badge.unlocked ? badge.bg : '#e8e8e8' }}>
                    {badge.unlocked
                      ? <span className="ach-badge-emoji">{badge.emoji}</span>
                      : <Lock size={24} color="#bbb" />
                    }
                  </div>
                  <p className="ach-badge-name">{badge.name}</p>
                  <p className={`ach-badge-desc ${badge.unlocked ? 'unlocked-text' : ''}`}>
                    {badge.unlocked ? 'Đã mở khóa' : badge.locked_desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
