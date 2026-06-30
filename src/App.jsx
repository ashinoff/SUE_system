import { useAuth } from './auth/useAuth.js'
import LoginScreen from './components/LoginScreen.jsx'
import Desktop from './components/Desktop.jsx'

export default function App() {
  const { ready, authenticated } = useAuth()

  if (!ready) return <div className="boot">Загрузка…</div>
  if (!authenticated) return <LoginScreen />
  return <Desktop />
}
