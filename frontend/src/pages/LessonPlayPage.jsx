import { useParams, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect, useCallback } from 'react'
import * as Icons from 'lucide-react'
import { LESSONS } from '../data/lessons'
import logo from '../../pics/logo/xushi_logo.png'
import './LessonPlayPage.css'

function ItemIcon({ name, color, size = 40 }) {
  const Icon = Icons[name] || Icons.Package
  return <Icon size={size} color={color} strokeWidth={1.8} />
}

const COLORS = ['#1a1a1a', '#e53935', '#1e88e5', '#43a047', '#fdd835']
const BRUSH_SIZES = [4, 10, 18]

export default function LessonPlayPage() {
  const { id, itemLabel } = useParams()
  const navigate = useNavigate()
  const lesson = LESSONS.find(l => l.id === id)
  const currentItem = lesson?.items.find(i => i.label === decodeURIComponent(itemLabel))

  const [status, setStatus] = useState('drawing')
  const [tries, setTries] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [finished, setFinished] = useState(false)
  const [color, setColor] = useState('#1a1a1a')
  const [brushSize, setBrushSize] = useState(1) // index 0,1,2
  const [history, setHistory] = useState([])

  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => { initCanvas() }, [itemLabel])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const opts = { passive: false }
    canvas.addEventListener('touchstart', startDrawing, opts)
    canvas.addEventListener('touchmove', draw, opts)
    canvas.addEventListener('touchend', stopDrawing, opts)
    return () => {
      canvas.removeEventListener('touchstart', startDrawing, opts)
      canvas.removeEventListener('touchmove', draw, opts)
      canvas.removeEventListener('touchend', stopDrawing, opts)
    }
  }, [isDrawing, lastPos, color, brushSize])

  const initCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#faf8f5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setStatus('drawing')
    setFeedback(null)
    setTries(0)
    setHistory([])
  }

  const saveHistory = () => {
    const canvas = canvasRef.current
    setHistory(h => [...h.slice(-19), canvas.toDataURL()])
  }

  const undo = () => {
    if (history.length === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const prev = history[history.length - 1]
    const img = new Image()
    img.onload = () => ctx.drawImage(img, 0, 0)
    img.src = prev
    setHistory(h => h.slice(0, -1))
  }

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if (e.touches) return {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const predictNow = useCallback(() => {
    const canvas = canvasRef.current
    canvas.toBlob(async (blob) => {
      const formData = new FormData()
      formData.append('image', blob, 'drawing.jpg')
      try {
        const res = await fetch('http://127.0.0.1:5000/predict', { method: 'POST', body: formData })
        const data = await res.json()
        if (!data.top5) return
        const top3Labels = data.top5.slice(0, 3).map(x => x.label)
        const isCorrect = top3Labels.includes(currentItem.label)
        setFeedback({ top3: data.top5.slice(0, 3), isCorrect })
        if (isCorrect) setStatus('correct')
        else { setStatus('wrong'); setTries(t => t + 1) }
      } catch { }
    }, 'image/jpeg')
  }, [currentItem])

  const schedulePredict = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(predictNow, 800)
  }, [predictNow])

  const startDrawing = (e) => {
    e.preventDefault()
    saveHistory()
    setStatus('drawing')
    setFeedback(null)
    const pos = getPos(e, canvasRef.current)
    setIsDrawing(true)
    setLastPos(pos)
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = color
    ctx.lineWidth = BRUSH_SIZES[brushSize]
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    setLastPos(pos)
    schedulePredict()
  }

  const goToResult = () => {
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL('image/png')

    // Lưu progress
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.id) {
      fetch('http://127.0.0.1:5000/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          label: currentItem.label,
          lesson_id: id,
          is_correct: true,
          tries: tries + 1
        })
      }).catch(() => {})
    }

    navigate(`/result/${id}/${encodeURIComponent(currentItem.label)}`, {
      state: { drawingDataUrl: dataUrl, userName: user.name || 'Bé yêu' }
    })
  }

  const stopDrawing = () => { setIsDrawing(false); setLastPos(null) }

  const clearCanvas = () => {
    saveHistory()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#faf8f5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setStatus('drawing')
    setFeedback(null)
  }

  if (!lesson || !currentItem) return <div>Không tìm thấy</div>

  if (finished) {
    return (
      <div className="play-finish">
        <div className="play-finish-card">
          <span className="play-finish-emoji">🎉</span>
          <h2>Tuyệt vời!</h2>
          <p>Bạn đã vẽ <strong>{currentItem.name}</strong> thành công!</p>
          <div className="play-finish-btns">
            <button onClick={() => { initCanvas(); setFinished(false) }} className="play-btn-retry">Vẽ lại</button>
            <button onClick={() => navigate(`/lessons/${id}`)} className="play-btn-back">Chọn đồ vật khác</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="play-page">
      {/* Top bar */}
      <div className="play-topbar">
        <button className="play-close" onClick={() => navigate(`/lessons/${id}`)}>
          <Icons.X size={18} color="#555" />
        </button>

        <div className="play-target-badge">
          <ItemIcon name={currentItem.iconName} color={lesson.iconColor} size={20} />
          <span>{currentItem.name}</span>
        </div>

        <div className="play-brand">
          <img src={logo} alt="logo" className="play-logo" />
          <span>Xushi</span>
        </div>
      </div>

      {/* Canvas area */}
      <div className="play-canvas-area">
        {/* Tool buttons top right */}
        <div className="play-tools-top">
          <button className="play-tool-btn" onClick={undo} title="Undo">
            <Icons.Undo2 size={18} color="#666" />
          </button>
          <button className="play-tool-btn" onClick={clearCanvas} title="Xóa">
            <Icons.Trash2 size={18} color="#666" />
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className="play-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {/* Feedback */}
        {status === 'correct' && (
          <div className="play-feedback correct">
            ✅ Đúng rồi! AI nhận ra <strong>{currentItem.name}</strong>
            <button onClick={goToResult} className="play-next-btn">Hoàn thành 🎉</button>
          </div>
        )}
        {status === 'wrong' && feedback && tries >= 2 && (
          <div className="play-feedback wrong">
            AI đoán: <strong>{feedback.top3[0]?.label}</strong>
            <button onClick={() => navigate(`/lessons/${id}`)} className="play-skip-btn">Thử đồ vật khác</button>
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      <div className="play-toolbar">
        {/* Color picker */}
        <div className="play-colors">
          {COLORS.map(c => (
            <button
              key={c}
              className={`play-color-btn ${color === c ? 'selected' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        {/* Brush sizes */}
        <div className="play-brushes">
          {BRUSH_SIZES.map((_, i) => (
            <button
              key={i}
              className={`play-brush-btn ${brushSize === i ? 'selected' : ''}`}
              onClick={() => setBrushSize(i)}
            >
              <div className="play-brush-dot" style={{
                width: 4 + i * 5,
                height: 4 + i * 5,
                background: color
              }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
