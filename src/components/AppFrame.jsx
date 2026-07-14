import { useEffect, useRef } from 'react'
import { useAuth } from '../auth/useAuth.js'

/* Окно приложения = iframe с самим приложением.
   Оболочка отправляет приложению Keycloak-токен через postMessage:
       { type: 'platform-auth', token: '<JWT>' }
   Токен уходит двумя путями:
   1) по пингу готовности от приложения ({ type: 'siz-ready' } / { type: 'app-ready' }) —
      гарантирует доставку, даже если onLoad сработал раньше, чем приложение
      повесило свой message-слушатель;
   2) на onLoad айфрейма — как запасной путь. */
export default function AppFrame({ win }) {
  const { user } = useAuth()
  const ref = useRef(null)

  let appOrigin = null
  try { appOrigin = new URL(win.url).origin } catch { /* about:blank и пр. */ }

  const sendToken = () => {
    if (!appOrigin) return
    ref.current?.contentWindow?.postMessage(
      { type: 'platform-auth', token: user?.token },
      appOrigin
    )
  }

  // Ответ на пинг готовности приложения — гарантирует доставку токена, даже если
  // слушатель приложения ещё не был повешен в момент onLoad айфрейма.
  useEffect(() => {
    const onMessage = (e) => {
      if (!appOrigin || e.origin !== appOrigin) return
      if (e.source !== ref.current?.contentWindow) return
      if (e.data?.type === 'siz-ready' || e.data?.type === 'app-ready') sendToken()
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [appOrigin, user?.token])

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
      onLoad={sendToken}
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-modals"
    />
  )
}
