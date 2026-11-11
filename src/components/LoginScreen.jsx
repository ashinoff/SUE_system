import { useAuth } from '../auth/useAuth.js'
import PlatformLogo from './PlatformLogo.jsx'

export default function LoginScreen() {
  const { login } = useAuth()
  return (
    <div className="login">
      <div className="login__card">
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
