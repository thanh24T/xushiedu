import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import congrats from '../../pics/animation/congrats.png'
import './ResultPage.css'

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

const FUN_FACTS = {
  'apple': 'Táo có hơn 7.500 giống khác nhau trên thế giới!',
  'airplane': 'Máy bay đầu tiên bay được vào năm 1903 bởi anh em nhà Wright!',
  'cat': 'Mèo ngủ trung bình 12-16 tiếng mỗi ngày!',
  'bicycle': 'Xe đạp được phát minh năm 1817 và không có bàn đạp!',
  'helicopter': 'Trực thăng có thể bay lùi, bay ngang và đứng yên trên không!',
  'zebra': 'Mỗi con ngựa vằn có hoa văn sọc hoàn toàn khác nhau!',
  'cactus': 'Xương rồng có thể sống hàng trăm năm trong sa mạc!',
  'mouse': 'Chuột có thể nhảy cao gấp 18 lần chiều cao cơ thể!',
  'default': 'Bạn đã vẽ rất giỏi! Tiếp tục luyện tập nhé!'
}

export default function ResultPage() {
  const { id, itemLabel } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const drawingDataUrl = location.state?.drawingDataUrl
  const userName = location.state?.userName || 'Bé yêu'
  const label = decodeURIComponent(itemLabel)
  const labelVi = LABEL_VI[label] || label
  const funFact = FUN_FACTS[label] || FUN_FACTS['default']

  return (
    <div className="result-page">
      {/* Left - drawing card */}
      <div className="result-card">
        <div className="result-drawing-wrap">
          {drawingDataUrl
            ? <img src={drawingDataUrl} alt="drawing" className="result-drawing" />
            : <div className="result-drawing-placeholder">🎨</div>
          }
          <p className="result-username">{userName}</p>
        </div>
      </div>

      {/* Right - info */}
      <div className="result-info">
        {/* AI Discovered badge */}
        <p className="result-ai-label">✦ AI DISCOVERED</p>
        <div className="result-badge">
          <span className="result-badge-stars">✦ ✧</span>
          <span className="result-badge-name">{labelVi}</span>
          <span className="result-badge-stars">✦</span>
          <span className="result-badge-en">({label})</span>
        </div>

        {/* Fun fact card */}
        <div className="result-fact-card">
          <img src={congrats} alt="mascot" className="result-mascot" />
          <p className="result-fact">"{funFact}"</p>
        </div>

        {/* Buttons */}
        <div className="result-btns">
          <button
            className="result-btn-retry"
            onClick={() => navigate(`/lessons/${id}/${encodeURIComponent(label)}`)}
          >
            <RotateCcw size={16} />
            Vẽ Lại
          </button>
          <button
            className="result-btn-next"
            onClick={() => navigate(`/lessons/${id}`)}
          >
            → Bài Tiếp Theo
          </button>
        </div>
      </div>
    </div>
  )
}
