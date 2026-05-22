import { Bell, TableOfContents } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar">
      <span className="navbar-brand">XushiEdu</span>
      <div className="navbar-actions">
        <button className="navbar-icon-btn">
          <Bell size={20} color="#a0785a" />
        </button>
        <button className="navbar-icon-btn">
          <TableOfContents size={20} color="#a0785a" />
        </button>
      </div>
    </header>
  )
}
