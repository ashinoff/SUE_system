import { useEffect, useRef } from 'react'

/* Молнии на экране входа (canvas поверх тёмного фона, под карточкой).
   Раз в 1,5–4 с из-за верхнего края бьёт разряд с ветвлениями и вспышкой;
   чаще всего — в сторону курсора. Клик по фону — молния в точку клика.
   Цвета — токены --login-bolt-* из tokens.css. Вкладка скрыта — не рисуем;
   prefers-reduced-motion — молний нет. */
export default function LoginLightning({ pointer }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const css = getComputedStyle(document.documentElement)
    const core = css.getPropertyValue('--login-bolt-core').trim()
    const glow = css.getPropertyValue('--login-bolt-glow').trim()

    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Ломаная разряда: деление отрезка пополам со случайным сдвигом середины.
    const path = (x1, y1, x2, y2, spread) => {
      let pts = [[x1, y1], [x2, y2]]
      for (let level = 0; level < 7; level++) {
        const next = [pts[0]]
        for (let i = 1; i < pts.length; i++) {
          const [ax, ay] = pts[i - 1]
          const [bx, by] = pts[i]
          next.push(
            [(ax + bx) / 2 + (Math.random() - 0.5) * spread, (ay + by) / 2 + (Math.random() - 0.5) * spread * 0.3],
            [bx, by],
          )
        }
        pts = next
        spread /= 2
      }
      return pts
    }

    const bolts = []
    let flash = 0
    const strike = (tx, ty) => {
      const sx = tx + (Math.random() - 0.5) * w * 0.4
      const main = path(sx, -20, tx, ty, Math.max(120, Math.hypot(tx - sx, ty) * 0.35))
      const branches = []
      const count = 2 + Math.floor(Math.random() * 4)
      for (let k = 0; k < count; k++) {
        const [bx, by] = main[Math.floor(main.length * (0.2 + Math.random() * 0.6))]
        branches.push(path(bx, by, bx + (Math.random() - 0.5) * 280, by + 60 + Math.random() * 220, 90))
      }
      bolts.push({ main, branches, life: 1 })
      flash = 1
    }

    const draw = (pts, width, alpha) => {
      ctx.globalAlpha = Math.max(0, alpha)
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
      ctx.stroke()
    }

    let nextAt = performance.now() + 900
    let raf = 0
    const frame = (t) => {
      raf = requestAnimationFrame(frame)
      if (document.hidden) return
      if (!reduce && t > nextAt) {
        const p = pointer.current
        const toCursor = p && Math.random() < 0.55
        strike(
          toCursor ? p.x + (Math.random() - 0.5) * 80 : Math.random() * w,
          toCursor ? p.y : h * (0.45 + Math.random() * 0.5),
        )
        nextAt = t + 1500 + Math.random() * 2500
      }

      ctx.clearRect(0, 0, w, h)
      if (flash > 0) {
        ctx.globalAlpha = flash * 0.1
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, w, h)
        flash = flash > 0.02 ? flash * 0.82 : 0
      }

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i]
        // в первые кадры разряд «дрожит», как настоящая молния
        const a = b.life * (b.life > 0.6 && Math.random() < 0.3 ? 0.35 : 1)
        ctx.strokeStyle = glow
        ctx.shadowColor = glow
        ctx.shadowBlur = 24
        draw(b.main, 6, a * 0.5)
        b.branches.forEach((br) => draw(br, 3, a * 0.32))
        ctx.strokeStyle = core
        ctx.shadowBlur = 8
        draw(b.main, 1.8, a)
        b.branches.forEach((br) => draw(br, 1, a * 0.7))
        b.life -= 0.035
        if (b.life <= 0) bolts.splice(i, 1)
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    }
    raf = requestAnimationFrame(frame)

    const onDown = (e) => {
      if (reduce || e.target.closest?.('button, a, input')) return
      strike(e.clientX, e.clientY)
    }
    window.addEventListener('pointerdown', onDown)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [pointer])

  return <canvas ref={ref} className="login__bolts" aria-hidden="true" />
}
