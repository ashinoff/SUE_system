import { useState } from 'react'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

// Календарь-виджет прямо на рабочем столе (справа сверху): всегда развёрнут,
// виден весь месяц, сегодняшний день подсвечен. Листание месяцев ‹ ›.
export default function CalendarWidget() {
  const now = new Date()
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() })

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
    <div className="deskcal">
      <div className="deskcal__head">
        <button className="deskcal__nav" onClick={() => shift(-1)} aria-label="Предыдущий месяц">‹</button>
        <span className="deskcal__title">{MONTHS[view.month]} {view.year}</span>
        <button className="deskcal__nav" onClick={() => shift(1)} aria-label="Следующий месяц">›</button>
      </div>
      <div className="deskcal__grid">
        {WEEKDAYS.map((w) => <span key={w} className="deskcal__wd">{w}</span>)}
        {cells.map((d, i) => (
          <span
            key={i}
            className={'deskcal__day' + (isToday(d) ? ' deskcal__day--today' : '') + (d === null ? ' deskcal__day--empty' : '')}
          >
            {d || ''}
          </span>
        ))}
      </div>
    </div>
  )
}
