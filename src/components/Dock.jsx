import { useDesktopStore } from '../store/useDesktopStore.js'

/* Док — как таскбар: показывает ТОЛЬКО открытые приложения (у которых есть окно),
   с SVG-иконками (lucide). Нет открытых окон — док пуст и скрыт (.dock:empty).
   Картинки-ярлычки тут не используем — они только на рабочем столе. */
export default function Dock({ apps }) {
  const windows = useDesktopStore((s) => s.windows)
  const focusWindow = useDesktopStore((s) => s.focusWindow)
  const restoreWindow = useDesktopStore((s) => s.restoreWindow)

  const openApps = apps.filter((app) => windows.some((w) => w.appId === app.id))

  return (
    <nav className="dock">
      {openApps.map((app) => {
        const Icon = app.icon
        const win = windows.find((w) => w.appId === app.id)
        return (
          <button
            key={app.id}
            className="dock__item dock__item--active"
            title={app.name}
            onClick={() => {
              restoreWindow(win.id)
              focusWindow(win.id)
            }}
          >
            <Icon size={24} />
          </button>
        )
      })}
    </nav>
  )
}
