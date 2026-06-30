import { useDesktopStore } from '../store/useDesktopStore.js'

export default function Dock({ apps }) {
  const windows = useDesktopStore((s) => s.windows)
  const openApp = useDesktopStore((s) => s.openApp)
  const focusWindow = useDesktopStore((s) => s.focusWindow)
  const restoreWindow = useDesktopStore((s) => s.restoreWindow)

  return (
    <nav className="dock">
      {apps.map((app) => {
        const Icon = app.icon
        const win = windows.find((w) => w.appId === app.id)
        return (
          <button
            key={app.id}
            className={`dock__item ${win ? 'dock__item--active' : ''}`}
            title={app.name}
            onClick={() => {
              if (win) {
                restoreWindow(win.id)
                focusWindow(win.id)
              } else {
                openApp(app)
              }
            }}
          >
            <Icon size={24} />
          </button>
        )
      })}
    </nav>
  )
}
