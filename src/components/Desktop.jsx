import { useAuth } from '../auth/useAuth.js'
import { appsForRoles } from '../config/apps.js'
import { useDesktopStore } from '../store/useDesktopStore.js'
import TopBar from './TopBar.jsx'
import Dock from './Dock.jsx'
import WindowFrame from './WindowFrame.jsx'

export default function Desktop() {
  const { user } = useAuth()
  const apps = appsForRoles(user?.roles)
  const windows = useDesktopStore((s) => s.windows)
  const openApp = useDesktopStore((s) => s.openApp)

  return (
    <div className="desktop">
      <TopBar />

      <main className="desktop__surface">
        <div className="icon-grid">
          {apps.map((app) => {
            const Icon = app.icon
            return (
              <button
                key={app.id}
                className="app-icon"
                onClick={() => openApp(app)}
                title={`Открыть «${app.name}»`}
              >
                <span className="app-icon__badge">
                  <Icon size={28} />
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
