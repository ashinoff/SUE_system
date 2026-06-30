import { useEffect, useState } from 'react'

export default function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  return <span className="clock">{time}</span>
}
