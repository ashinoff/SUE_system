import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { useDesktopStore } from '../store/useDesktopStore.js'
import { WALLPAPERS } from '../config/wallpapers.js'

/* Меню выбора обоев рабочего стола. Пресеты — в config/wallpapers.js.
   Выбор сохраняется в localStorage (см. useDesktopStore.setWallpaper)
   и применяется к токену --wallpaper в Desktop. */
export default function WallpaperMenu() {
  const [open, setOpen] = useState(false)
  const wallpaper = useDesktopStore((s) => s.wallpaper)
  const setWallpaper = useDesktopStore((s) => s.setWallpaper)

  return (
    <div className="wall">
      <button className="iconbtn" onClick={() => setOpen((o) => !o)} title="Обои">
        <ImageIcon size={18} />
      </button>

      {open && (
        <div className="wall__panel" onMouseLeave={() => setOpen(false)}>
          <div className="wall__head">
            <strong>Обои рабочего стола</strong>
          </div>
          <div className="wall__grid">
            {WALLPAPERS.map((w) => (
              <button
                key={w.id}
                className={`wall__swatch ${
                  w.id === wallpaper ? 'wall__swatch--active' : ''
                }`}
                style={{ background: w.value }}
                title={w.name}
                aria-label={w.name}
                onClick={() => {
                  setWallpaper(w.id)
                  setOpen(false)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
