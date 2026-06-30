import { createContext, useEffect, useState, useCallback } from 'react'
import { keycloak, AUTH_DISABLED, MOCK_USER } from './keycloak.js'

export const AuthContext = createContext(null)

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

    keycloak
      .init({ onLoad: 'check-sso', pkceMethod: 'S256' })
      .then((auth) => {
        if (cancelled) return
        setAuthenticated(auth)
        if (auth) setUser(userFromKeycloak(keycloak))
        setReady(true)
      })
      .catch(() => setReady(true))

    // Автоматическое обновление токена до истечения
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).then(() => {
        setUser((u) => (u ? { ...u, token: keycloak.token } : u))
      })
    }

    return () => { cancelled = true }
  }, [])

  const login = useCallback(() => { if (!AUTH_DISABLED) keycloak.login() }, [])
  const logout = useCallback(() => { if (!AUTH_DISABLED) keycloak.logout() }, [])

  return (
    <AuthContext.Provider value={{ ready, authenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
