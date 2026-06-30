import { useAuth } from '../auth/useAuth.js'

export default function LoginScreen() {
  const { login } = useAuth()
  return (
    <div className="login">
      <div className="login__card">
        <div className="login__logo">П</div>
        <h1 className="login__title">Платформа</h1>
        <p className="login__subtitle">Единый вход во все приложения</p>
        <button className="btn btn--primary login__btn" onClick={login}>
          Войти
        </button>
      </div>
    </div>
  )
}
