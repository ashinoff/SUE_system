import { useState, useRef, useEffect } from 'react'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

// Календарь в верхней панели: кнопка с текущей датой, по клику — поповер с
// полным месяцем (сегодняшний день подсвечен). Пролистывание месяцев ‹ ›.
export default function CalendarWidget() {
  const now = new Date()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const ref = useRef(null)

  // Закрываем поповер по клику вне него.
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const firstDay = new Date(view.year, view.month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7 // неделя с понедельника
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const isToday = (d) =>
    d && view.year === now.getFullYear() && view.month === now.getMonth() && d === now.getDate()

  const shift = (delta) => setView((v) => {
    const m = v.month + delta
    if (m < 0) return { year: v.year - 1, month: 11 }
    if (m > 11) return { year: v.year + 1, month: 0 }
    return { ...v, month: m }
  })

  return (
    <div className="cal" ref={ref}>
      <button className="cal__btn" onClick={() => setOpen((o) => !o)} title="Календарь">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>{now.getDate()} {MONTHS[now.getMonth()].toLowerCase()}</span>
      </button>

      {open && (
        <div className="cal__pop">
          <div className="cal__head">
            <button className="cal__nav" onClick={() => shift(-1)} aria-label="Предыдущий месяц">‹</button>
            <span className="cal__title">{MONTHS[view.month]} {view.year}</span>
            <button className="cal__nav" onClick={() => shift(1)} aria-label="Следующий месяц">›</button>
          </div>
          <div className="cal__grid">
            {WEEKDAYS.map((w) => <span key={w} className="cal__wd">{w}</span>)}
            {cells.map((d, i) => (
              <span
                key={i}
                className={'cal__day' + (isToday(d) ? ' cal__day--today' : '') + (d === null ? ' cal__day--empty' : '')}
              >
                {d || ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
