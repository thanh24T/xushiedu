import { Link } from 'react-router-dom'
import MainCanvas from '../components/MainCanvas'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home">
      <div className="home-header">
        <h1 className="home-title">🎨 Vẽ cùng AI!</h1>
        <p className="home-subtitle">Hãy vẽ một thứ gì đó nhé!</p>
        <Link to="/test" className="test-link">🧪 Test</Link>
      </div>
      <div className="home-content">
        <MainCanvas />
      </div>
    </div>
  )
}
