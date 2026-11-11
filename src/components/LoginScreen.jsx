import { useEffect, useRef } from 'react'
import { useAuth } from '../auth/useAuth.js'
import PlatformLogo from './PlatformLogo.jsx'
import LoginLightning from './LoginLightning.jsx'
import '../theme/login.css'

/* Экран входа: тёмный фон, за курсором движется свет и проявляется сетка,
   из темноты бьют молнии (LoginLightning), карточка — тёмное стекло и слегка
   наклоняется за курсором. Стили — theme/login.css, цвета — токены --login-*. */
export default function LoginScreen() {
  const { login } = useAuth()
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

  return (
    <div className="login login--fx" ref={rootRef}>
      <div className="login__glow" aria-hidden="true" />
      <div className="login__grid" aria-hidden="true" />
      <LoginLightning pointer={pointer} />
      <div className="login__card" ref={cardRef}>
        <PlatformLogo animated className="login__logo" />
        <h1 className="login__title">Платформа</h1>
        <p className="login__subtitle">Единый вход во все приложения</p>
        <button className="btn btn--primary login__btn" onClick={login}>
          Войти
        </button>
      </div>
    </div>
  )
}
