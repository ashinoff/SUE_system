import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useDesktopStore } from '../store/useDesktopStore.js'
import { AUTH_DISABLED } from '../auth/keycloak.js'

/* Центр уведомлений. Сейчас уведомления добавляются вручную (для теста).
   Дальше сюда подключается WebSocket к сервису уведомлений — см. README,
   раздел «Уведомления». */
export default function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const notifications = useDesktopStore((s) => s.notifications)
  const markAllRead = useDesktopStore((s) => s.markAllRead)
  const pushNotification = useDesktopStore((s) => s.pushNotification)
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="notif">
      <button className="iconbtn" onClick={() => setOpen((o) => !o)} title="Уведомления">
        <Bell size={18} />
        {unread > 0 && <span className="notif__count">{unread}</span>}
      </button>

      {open && (
        <div className="notif__panel" onMouseLeave={() => setOpen(false)}>
          <div className="notif__head">
            <strong>Уведомления</strong>
            <button className="link" onClick={markAllRead}>
              Прочитать все
            </button>
          </div>

          <div className="notif__list">
            {notifications.length === 0 && <p className="notif__empty">Пока пусто</p>}
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notif__item ${n.read ? '' : 'notif__item--unread'}`}
              >
                <span className="notif__app">{n.app || 'Система'}</span>
                <span className="notif__text">{n.text}</span>
              </div>
            ))}
          </div>

          {AUTH_DISABLED && (
            <button
              className="btn btn--ghost notif__test"
              onClick={() =>
                pushNotification({ app: 'СИЗ-контроль', text: 'Подошёл срок поверки СИЗ' })
              }
            >
              + тестовое уведомление
            </button>
          )}
        </div>
      )}
    </div>
  )
}
