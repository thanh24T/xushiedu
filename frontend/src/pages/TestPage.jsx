import { Link } from 'react-router-dom'
import DrawingCanvas from '../components/DrawingCanvas'

export default function TestPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '12px 24px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '14px', color: '#2f80ed' }}>← Trang chủ</Link>
        <span style={{ fontSize: '14px', color: '#888' }}>🧪 Trang test model</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px' }}>
        <h2 style={{ marginBottom: '24px', color: '#333' }}>Test Model</h2>
        <DrawingCanvas />
      </div>
    </div>
  )
}
