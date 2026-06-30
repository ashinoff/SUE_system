import { useRef } from 'react'
import { useAuth } from '../auth/useAuth.js'

/* Окно приложения = iframe с самим приложением.
   После загрузки оболочка отправляет приложению токен через postMessage,
   чтобы оно опознало пользователя. Контракт сообщения:
       { type: 'platform-auth', token: '<JWT>' }
   На стороне приложения нужно слушать это сообщение, проверив origin
   (см. промт для СИЗ-контроля: docs/siz-integration-prompt.md). */
export default function AppFrame({ win }) {
  const { user } = useAuth()
  const ref = useRef(null)

  const handleLoad = () => {
    try {
      const origin = new URL(win.url).origin
      ref.current?.contentWindow?.postMessage(
        { type: 'platform-auth', token: user?.token },
        origin
      )
    } catch {
      /* about:blank и прочие невалидные URL — просто пропускаем */
    }
  }

  if (!win.url || win.url === 'about:blank') {
    return (
      <div className="app-frame app-frame--empty">
        Здесь откроется приложение.
        <br />
        Укажи его адрес в <code>src/config/apps.js</code>.
      </div>
    )
  }

  return (
    <iframe
      ref={ref}
      className="app-frame"
      src={win.url}
      title={win.title}
      onLoad={handleLoad}
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
    />
  )
}
