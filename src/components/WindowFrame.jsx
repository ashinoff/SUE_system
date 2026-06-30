import { useRef } from 'react'
import { useDesktopStore } from '../store/useDesktopStore.js'
import AppFrame from './AppFrame.jsx'

/* Окно приложения раскрыто на весь экран (модель iOS — мини-окон нет).
   Управление — три «кружка» в стиле macOS:
     🔴 закрыть   — завершить приложение
     🟡 свернуть  — убрать в док (приложение остаётся запущенным)
     🟢 на монитор — настоящий полный экран браузера (Fullscreen API) */
export default function WindowFrame({ win }) {
  const closeWindow = useDesktopStore((s) => s.closeWindow)
  const minimizeWindow = useDesktopStore((s) => s.minimizeWindow)
  const focusWindow = useDesktopStore((s) => s.focusWindow)
  const ref = useRef(null)

  if (win.minimized) return null

  const toggleFullscreen = () => {
    const el = ref.current
    if (!document.fullscreenElement) el?.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  return (
    <div
      ref={ref}
      className="app-window"
      style={{ zIndex: win.z }}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div className="app-window__bar">
        <div className="traffic">
          <button
            className="traffic__dot traffic__dot--close"
            onClick={() => closeWindow(win.id)}
            title="Закрыть"
            aria-label="Закрыть"
          />
          <button
            className="traffic__dot traffic__dot--min"
            onClick={() => minimizeWindow(win.id)}
            title="Свернуть в док"
            aria-label="Свернуть в док"
          />
          <button
            className="traffic__dot traffic__dot--full"
            onClick={toggleFullscreen}
            title="На весь монитор"
            aria-label="На весь монитор"
          />
        </div>
        <span className="app-window__title">{win.title}</span>
        <span className="app-window__spacer" />
      </div>
      <div className="app-window__body">
        <AppFrame win={win} />
      </div>
    </div>
  )
}
