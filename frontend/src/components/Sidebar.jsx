import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Trophy, History, HelpCircle, LogOut } from 'lucide-react'
import logo from '../../pics/animation/hello.png'
import './Sidebar.css'

export default function Sidebar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const name = user.name || 'bé'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="sidebar-greeting">
        <p className="sidebar-greeting-text">Chào mừng bé trở lại,</p>
        <p className="sidebar-greeting-name">{name}! </p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/home" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink to="/lessons" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={18} />
          Lessons
        </NavLink>
        <NavLink to="/achievements" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Trophy size={18} />
          Achievements
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <History size={18} />
          History
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/help" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <HelpCircle size={18} />
          Help
        </NavLink>
        <button className="sidebar-item sidebar-logout" onClick={() => navigate('/')}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
