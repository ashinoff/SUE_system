import { LogOut } from 'lucide-react'
import { useAuth } from '../auth/useAuth.js'
import Clock from './Clock.jsx'
import CalendarWidget from './CalendarWidget.jsx'
import WallpaperMenu from './WallpaperMenu.jsx'
import NotificationCenter from './NotificationCenter.jsx'

export default function TopBar() {
  const { user, logout } = useAuth()
  return (
    <header className="topbar">
      <div className="topbar__left">
        <span className="topbar__brand">Платформа</span>
      </div>
      <div className="topbar__right">
        <Clock />
        <CalendarWidget />
        <WallpaperMenu />
        <NotificationCenter />
        <div className="topbar__user">
          <span className="topbar__user-name">{user?.name}</span>
          <button className="iconbtn" title="Выйти" onClick={logout}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
