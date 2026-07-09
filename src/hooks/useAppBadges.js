import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../auth/useAuth.js'
import { APPS } from '../config/apps.js'

/* Бейджи уведомлений на иконках приложений.

   Для каждого приложения с `badge: true` платформа опрашивает его бэкенд:
       GET  ${app.url}/api/platform/badge
       Authorization: Bearer <актуальный Keycloak-токен>
   и ждёт ответ вида { "count": N }.

   Любая ошибка (сеть / 401 / таймаут / не-JSON) — тихо: бейдж просто не
   показываем (count 0), никаких ошибок в UI.

   Обновление: при загрузке, каждые 60 секунд и при возврате фокуса на
   вкладку (visibilitychange). Возвращает объект { [appId]: count }. */

const REFRESH_MS = 60_000
const FETCH_TIMEOUT_MS = 8_000

const BADGED_APPS = APPS.filter(
  (a) => a.badge && a.url && a.url !== 'about:blank'
)

export function useAppBadges() {
  const { user } = useAuth()
  const token = user?.token
  const [badges, setBadges] = useState({}) // { [appId]: count }

  const fetchOne = useCallback(async (app, tkn) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
      const base = app.url.replace(/\/+$/, '')
      const res = await fetch(`${base}/api/platform/badge`, {
        headers: { Authorization: `Bearer ${tkn}` },
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      const data = await res.json()
      const count = Number(data?.count) || 0
      setBadges((b) => (b[app.id] === count ? b : { ...b, [app.id]: count }))
    } catch {
      // Тихо: при любой ошибке бейдж не показываем.
      setBadges((b) => (b[app.id] ? { ...b, [app.id]: 0 } : b))
    } finally {
      clearTimeout(timer)
    }
  }, [])

  const refreshAll = useCallback(() => {
    if (!token) return
    BADGED_APPS.forEach((app) => fetchOne(app, token))
  }, [token, fetchOne])

  useEffect(() => {
    if (!token) return
    refreshAll()
    const interval = setInterval(refreshAll, REFRESH_MS)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refreshAll()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [token, refreshAll])

  return badges
}
