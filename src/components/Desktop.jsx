import { useEffect } from 'react'
import { useAuth } from '../auth/useAuth.js'
import { appsForRoles } from '../config/apps.js'
import { WALLPAPERS, DEFAULT_WALLPAPER } from '../config/wallpapers.js'
import { useDesktopStore } from '../store/useDesktopStore.js'
import { useAppBadges } from '../hooks/useAppBadges.js'
import TopBar from './TopBar.jsx'
import Dock from './Dock.jsx'
import WindowFrame from './WindowFrame.jsx'
import AppIcon from './AppIcon.jsx'
import CalendarWidget from './CalendarWidget.jsx'

export default function Desktop() {
  const { user } = useAuth()
  const apps = appsForRoles(user?.roles)
  const badges = useAppBadges()
  const windows = useDesktopStore((s) => s.windows)
  const openApp = useDesktopStore((s) => s.openApp)
  const wallpaper = useDesktopStore((s) => s.wallpaper)

  // Применяем выбранные обои к токену --wallpaper (фон стола, входа, boot).
  useEffect(() => {
    const wp =
      WALLPAPERS.find((w) => w.id === wallpaper) ||
      WALLPAPERS.find((w) => w.id === DEFAULT_WALLPAPER)
    if (wp) document.documentElement.style.setProperty('--wallpaper', wp.value)
  }, [wallpaper])

  return (
    <div className="desktop">
      <TopBar />

      <main className="desktop__surface">
        <CalendarWidget />
        <div className="icon-grid">
          {apps.map((app) => {
            const count = badges[app.id] || 0
            return (
              <button
                key={app.id}
                className="app-icon"
                onClick={() => openApp(app)}
                title={`Открыть «${app.name}»`}
              >
                <span className="app-icon__badge">
                  <AppIcon app={app} size={28} />
                  {count > 0 && (
                    <span className="app-icon__notif" aria-label={`Уведомлений: ${count}`}>
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </span>
                <span className="app-icon__label">{app.name}</span>
              </button>
            )
          })}
        </div>

        {windows.map((w) => (
          <WindowFrame key={w.id} win={w} />
        ))}
      </main>

      <Dock apps={apps} />
    </div>
  )
}
