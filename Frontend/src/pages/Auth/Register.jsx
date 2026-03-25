import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../api/authApi'
import useAuthStore from '../../stores/authStore'

export default function Register() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await register(form)
      loginStore(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Dang ky that bai.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Tao tai khoan CinePass</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            id="username"
            type="text"
            placeholder="Ten nguoi dung"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            id="reg-email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            id="reg-password"
            type="password"
            placeholder="Mat khau"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Dang xu ly...' : 'Dang ky'}
          </button>
        </form>
        <p>
          Da co tai khoan? <Link to="/dang-nhap">Dang nhap</Link>
        </p>
      </div>
    </div>
  )
}
