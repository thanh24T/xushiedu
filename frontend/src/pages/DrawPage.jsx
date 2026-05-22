import { useParams, Link } from 'react-router-dom'
import DrawingCanvas from '../components/DrawingCanvas'
import './DrawPage.css'

const LABEL_EMOJI = {
  'apple': '🍎', 'airplane': '✈️', 'axe': '🪓', 'angel': '👼',
  'The Great Wall of China': '🏯', 'ambulance': '🚑', 'alarm clock': '⏰',
  'aircraft carrier': '🛳️', 'The Mona Lisa': '🖼️', 'The Eiffel Tower': '🗼',
  'cat': '🐱', 'cactus': '🌵', 'popsicle': '🍦', 'bicycle': '🚲',
  'helicopter': '🚁', 'zebra': '🦓', 'windmill': '🌀', 'knife': '🔪',
  'house plant': '🪴', 'mouse': '🐭',
}

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

export default function DrawPage() {
  const { label } = useParams()
  const decoded = decodeURIComponent(label)

  return (
    <div className="draw-page">
      <div className="draw-header">
        <Link to="/" className="back-btn">← Quay lại</Link>
        <div className="draw-target">
          <span>Hãy vẽ: </span>
          <span className="draw-target-emoji">{LABEL_EMOJI[decoded]}</span>
          <span className="draw-target-name">{LABEL_VI[decoded] || decoded}</span>
        </div>
      </div>
      <div className="draw-content">
        <DrawingCanvas targetLabel={decoded} />
      </div>
    </div>
  )
}
