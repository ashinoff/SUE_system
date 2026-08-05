import { createContext, useEffect, useState, useCallback } from 'react'
import { keycloak, AUTH_DISABLED, MOCK_USER } from './keycloak.js'

export const AuthContext = createContext(null)

// Страховочный таймаут инициализации Keycloak. Если init() зависает
// (например, silent-SSO iframe не отвечает после долгого простоя сайта),
// по истечении времени принудительно выходим из «Загрузка…».
const INIT_TIMEOUT_MS = 12_000

function userFromKeycloak(kc) {
  const t = kc.tokenParsed || {}
  return {
    id: kc.subject,                       // постоянный id пользователя (claim sub)
    name: t.name || t.preferred_username, // имя
    email: t.email,
    roles: t.realm_access?.roles || [],   // роли из Keycloak
    token: kc.token,                      // JWT для запросов / передачи приложениям
  }
}

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Режим без Keycloak: сразу пускаем тестового пользователя
    if (AUTH_DISABLED) {
      setUser(MOCK_USER)
      setAuthenticated(true)
      setReady(true)
      return
    }

    let cancelled = false

    // Что бы ни случилось с keycloak.init() — зависший silent-SSO iframe,
    // недоступный сервер после долгого простоя — через INIT_TIMEOUT_MS
    // выходим из «Загрузка…» и показываем экран входа. Кнопка «Войти»
    // не должна залипать навсегда.
    const initTimer = setTimeout(() => {
      if (cancelled) return
      try { keycloak.clearToken() } catch { /* noop */ }
      setAuthenticated(false)
      setReady(true)
    }, INIT_TIMEOUT_MS)

    keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        // Не держим фоновый session-check iframe: после долгого простоя он
        // залипает и вешает оболочку. Свежесть токена обеспечивает updateToken.
        checkLoginIframe: false,
      })
      .then((auth) => {
        if (cancelled) return
        setAuthenticated(auth)
        if (auth) setUser(userFromKeycloak(keycloak))
        // Не аутентифицирован — чистим возможный протухший токен из хранилища.
        else { try { keycloak.clearToken() } catch { /* noop */ } }
      })
      .catch(() => {
        if (cancelled) return
        // Ошибка/таймаут проверки сессии — сбрасываем протухшее состояние.
        try { keycloak.clearToken() } catch { /* noop */ }
        setAuthenticated(false)
      })
      .finally(() => {
        if (cancelled) return
        clearTimeout(initTimer)
        // ready ставим ВСЕГДА — и на успехе, и на ошибке (аналог finally).
        setReady(true)
      })

    // Автоматическое обновление токена до истечения. Если refresh-токен тоже
    // протух после простоя — updateToken отклонится; тогда чистим сессию и
    // уводим на повторный вход, а не зависаем с мёртвым токеном.
    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(30)
        .then(() => {
          setUser((u) => (u ? { ...u, token: keycloak.token } : u))
        })
        .catch(() => {
          try { keycloak.clearToken() } catch { /* noop */ }
          setAuthenticated(false)
          setUser(null)
        })
    }

    return () => {
      cancelled = true
      clearTimeout(initTimer)
    }
  }, [])

  const login = useCallback(() => { if (!AUTH_DISABLED) keycloak.login() }, [])
  const logout = useCallback(() => { if (!AUTH_DISABLED) keycloak.logout() }, [])

  return (
    <AuthContext.Provider value={{ ready, authenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
