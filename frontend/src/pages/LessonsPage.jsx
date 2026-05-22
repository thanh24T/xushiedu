import { Link, useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { LESSONS } from '../data/lessons'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './LessonsPage.css'

function LessonIcon({ name, color, size = 36 }) {
  const Icon = Icons[name] || Icons.Package
  return <Icon size={size} color={color} strokeWidth={1.8} />
}

export default function LessonsPage() {
  const navigate = useNavigate()

  return (
    <div className="lessons-layout">
      <Sidebar />

      <div className="lessons-body">
        <Navbar />
        <main className="lessons-main">
        <h2 className="lessons-title">Bài học</h2>
        <p className="lessons-sub">Chọn chủ đề bạn muốn luyện tập hôm nay!</p>

        <div className="lessons-grid">
          {LESSONS.map(lesson => (
            <Link
              key={lesson.id}
              to={`/lessons/${lesson.id}`}
              className="lesson-card"
              style={{ background: lesson.color, borderColor: lesson.borderColor }}
            >
              <div className="lesson-icon-wrap" style={{ background: lesson.color }}>
                <LessonIcon name={lesson.iconName} color={lesson.iconColor} size={36} />
              </div>
              <div>
                <p className="lesson-name">{lesson.title}</p>
                <p className="lesson-count">{lesson.items.length} đồ vật</p>
              </div>
              <Icons.ChevronRight size={18} color="#aaa" style={{ marginLeft: 'auto' }} />
            </Link>
          ))}
        </div>
      </main>
      </div>
    </div>
  )
}
