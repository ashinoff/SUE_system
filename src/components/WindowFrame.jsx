import { Rnd } from 'react-rnd'
import { X, Minus } from 'lucide-react'
import { useDesktopStore } from '../store/useDesktopStore.js'
import AppFrame from './AppFrame.jsx'

export default function WindowFrame({ win }) {
  const closeWindow = useDesktopStore((s) => s.closeWindow)
  const minimizeWindow = useDesktopStore((s) => s.minimizeWindow)
  const focusWindow = useDesktopStore((s) => s.focusWindow)
  const updateWindow = useDesktopStore((s) => s.updateWindow)

  if (win.minimized) return null

  return (
    <Rnd
      className="window"
      style={{ zIndex: win.z }}
      size={{ width: win.width, height: win.height }}
      position={{ x: win.x, y: win.y }}
      minWidth={360}
      minHeight={240}
      bounds="parent"
      dragHandleClassName="window__bar"
      onMouseDown={() => focusWindow(win.id)}
      onDragStop={(e, d) => updateWindow(win.id, { x: d.x, y: d.y })}
      onResizeStop={(e, dir, ref, delta, pos) =>
        updateWindow(win.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: pos.x,
          y: pos.y,
        })
      }
    >
      <div className="window__chrome">
        <div className="window__bar">
          <span className="window__title">{win.title}</span>
          <div className="window__actions">
            <button
              className="window__btn"
              onClick={() => minimizeWindow(win.id)}
              title="Свернуть"
            >
              <Minus size={14} />
            </button>
            <button
              className="window__btn window__btn--close"
              onClick={() => closeWindow(win.id)}
              title="Закрыть"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="window__body">
          <AppFrame win={win} />
        </div>
      </div>
    </Rnd>
  )
}
