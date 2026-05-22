import { useRef, useState, useEffect, useCallback } from 'react'
import './MainCanvas.css'

const LABEL_EMOJI = {
  'apple': '🍎',
  'airplane': '✈️',
  'axe': '🪓',
  'angel': '👼',
  'The Great Wall of China': '🏯',
  'ambulance': '🚑',
  'alarm clock': '⏰',
  'aircraft carrier': '🛳️',
  'The Mona Lisa': '🖼️',
  'The Eiffel Tower': '🗼',
  'cat': '🐱',
  'cactus': '🌵',
  'popsicle': '🍦',
  'bicycle': '🚲',
  'helicopter': '🚁',
  'zebra': '🦓',
  'windmill': '🌀',
  'knife': '🔪',
  'house plant': '🪴',
  'mouse': '🐭',
}

const LABEL_VI = {
  'apple': 'Quả táo',
  'airplane': 'Máy bay',
  'axe': 'Cái rìu',
  'angel': 'Thiên thần',
  'The Great Wall of China': 'Vạn Lý Trường Thành',
  'ambulance': 'Xe cứu thương',
  'alarm clock': 'Đồng hồ báo thức',
  'aircraft carrier': 'Tàu sân bay',
  'The Mona Lisa': 'Nàng Mona Lisa',
  'The Eiffel Tower': 'Tháp Eiffel',
  'cat': 'Con mèo',
  'cactus': 'Cây xương rồng',
  'popsicle': 'Que kem',
  'bicycle': 'Xe đạp',
  'helicopter': 'Trực thăng',
  'zebra': 'Con ngựa vằn',
  'windmill': 'Cối xay gió',
  'knife': 'Con dao',
  'house plant': 'Cây trong nhà',
  'mouse': 'Con chuột',
}

export default function MainCanvas() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState(null)
  const [top3, setTop3] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#222'
    ctx.lineWidth = 16
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    if (e.touches) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const predictNow = useCallback(() => {
    const canvas = canvasRef.current
    canvas.toBlob(async (blob) => {
      const formData = new FormData()
      formData.append('image', blob, 'drawing.jpg')
      try {
        const res = await fetch('http://127.0.0.1:5000/predict', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.top5) {
          setTop3(data.top5.slice(0, 3))
          setShowPopup(true)
        }
      } catch {
        // silent fail
      }
    }, 'image/jpeg')
  }, [])

  const schedulePredict = useCallback(() => {
    setShowPopup(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(predictNow, 800)
  }, [predictNow])

  const startDrawing = (e) => {
    e.preventDefault()
    setShowPopup(false)
    const pos = getPos(e, canvasRef.current)
    setIsDrawing(true)
    setLastPos(pos)
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    setLastPos(pos)
    schedulePredict()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setLastPos(null)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setTop3([])
    setShowPopup(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }

  return (
    <div className="main-canvas-wrapper">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="main-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <button onClick={clearCanvas} className="main-btn-clear">🗑️ Xóa</button>

      {showPopup && top3.length > 0 && (
        <div className="main-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="main-popup" onClick={e => e.stopPropagation()}>
            <p className="main-popup-title">🤔 Mình đoán bạn đang vẽ...</p>
            <div className="main-popup-cards">
              {top3.map((item, i) => (
                <div key={i} className={`main-popup-card ${i === 0 ? 'main-popup-card-top' : ''}`}>
                  <span className="main-popup-emoji">{LABEL_EMOJI[item.label] || '🎨'}</span>
                  <span className="main-popup-name">{LABEL_VI[item.label] || item.label}</span>
                </div>
              ))}
            </div>
            <button className="main-popup-close" onClick={() => setShowPopup(false)}>Tiếp tục vẽ ✏️</button>
          </div>
        </div>
      )}
    </div>
  )
}
