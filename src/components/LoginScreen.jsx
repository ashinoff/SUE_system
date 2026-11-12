import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth/useAuth.js'
import PlatformLogo from './PlatformLogo.jsx'
import LoginLightning from './LoginLightning.jsx'
import '../theme/login.css'
import '../theme/login-form.css'

/* Экран входа: тёмный фон, за курсором движется свет и проявляется сетка,
   из темноты бьют молнии (LoginLightning), карточка — тёмное стекло и слегка
   наклоняется за курсором. Стили — theme/login.css, цвета — токены --login-*.
   Логин и пароль вводятся прямо здесь и уходят в Keycloak в фоне
   (AuthProvider.login) — страница Keycloak пользователю не показывается. */
export default function LoginScreen() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const rootRef = useRef(null)
  const cardRef = useRef(null)
  const pointer = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    let x = window.innerWidth / 2
    let y = window.innerHeight * 0.4
    let raf = 0
    const apply = () => {
      raf = 0
      root.style.setProperty('--mx', `${x}px`)
      root.style.setProperty('--my', `${y}px`)
      const card = cardRef.current
      const r = card?.getBoundingClientRect()
      if (r) {
        const dx = (x - (r.left + r.width / 2)) / window.innerWidth
        const dy = (y - (r.top + r.height / 2)) / window.innerHeight
        card.style.setProperty('--tilt-x', `${(-dy * 10).toFixed(2)}deg`)
        card.style.setProperty('--tilt-y', `${(dx * 10).toFixed(2)}deg`)
      }
    }
    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      pointer.current = { x, y }
      if (!raf) raf = requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    if (!username.trim() || !password) { setError('Введите логин и пароль.'); return }
    setBusy(true)
    setError('')
    try {
      await login(username.trim(), password)
      // При успехе App сам переключится на рабочий стол — форма размонтируется.
    } catch (err) {
      setError(err.message || 'Не удалось войти.')
      setPassword('')
      setBusy(false)
    }
  }

  return (
    <div className="login login--fx" ref={rootRef}>
      <div className="login__glow" aria-hidden="true" />
      <div className="login__grid" aria-hidden="true" />
      <LoginLightning pointer={pointer} />
      <div className="login__card" ref={cardRef}>
        <PlatformLogo animated className="login__logo" />
        <h1 className="login__title">Платформа</h1>
        <p className="login__subtitle">Единый вход во все приложения</p>
        <form className="login-form" onSubmit={submit} noValidate>
          <label className="login-form__field">
            Логин
            <input
              className="login-form__input"
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck="false"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={busy}
            />
          </label>
          <label className="login-form__field">
            Пароль
            <input
              className="login-form__input"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
            />
          </label>
          {error && <p className="login-form__error" role="alert">{error}</p>}
          <button type="submit" className="btn btn--primary login__btn" disabled={busy}>
            {busy ? 'Входим…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
