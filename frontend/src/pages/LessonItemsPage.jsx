import { useParams, useNavigate, Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { LESSONS } from '../data/lessons'
import Sidebar from '../components/Sidebar'
import './LessonItemsPage.css'

function ItemIcon({ name, color, size = 40 }) {
  const Icon = Icons[name] || Icons.Package
  return <Icon size={size} color={color} strokeWidth={1.8} />
}

export default function LessonItemsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lesson = LESSONS.find(l => l.id === id)

  if (!lesson) return <div>Không tìm thấy bài học</div>

  return (
    <div className="items-layout">
      <Sidebar />

      <main className="items-main">
        {/* Header */}
        <div className="items-header">
          <button className="items-back" onClick={() => navigate('/lessons')}>
            <Icons.ArrowLeft size={18} color="#a0785a" />
          </button>
          <div className="items-title-wrap">
            <ItemIcon name={lesson.iconName} color={lesson.iconColor} size={28} />
            <h2 className="items-title">{lesson.title}</h2>
          </div>
          <p className="items-sub">Chọn đồ vật bạn muốn vẽ!</p>
        </div>

        {/* Grid items */}
        <div className="items-grid">
          {lesson.items.map((item) => (
            <Link
              key={item.label}
              to={`/lessons/${id}/${encodeURIComponent(item.label)}`}
              className="item-card"
              style={{ borderColor: lesson.borderColor }}
            >
              <div className="item-icon-wrap" style={{ background: lesson.color }}>
                <ItemIcon name={item.iconName} color={lesson.iconColor} size={44} />
              </div>
              <p className="item-name">{item.name}</p>
              <p className="item-desc">{item.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
