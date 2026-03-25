import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../api/authApi'
import useAuthStore from '../../stores/authStore'

export default function Login() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form)
      loginStore(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Dang nhap that bai.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Dang nhap CinePass</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            id="password"
            type="password"
            placeholder="Mat khau"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Dang xu ly...' : 'Dang nhap'}
          </button>
        </form>
        <p>
          Chua co tai khoan? <Link to="/dang-ky">Dang ky ngay</Link>
        </p>
      </div>
    </div>
  )
}
