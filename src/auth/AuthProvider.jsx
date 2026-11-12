import { createContext, useEffect, useState, useCallback, useRef } from 'react'
import {
  createKeycloak, passwordLogin, revokeSession,
  loadTokens, saveTokens, clearTokens,
  AUTH_DISABLED, MOCK_USER,
} from './keycloak.js'

export const AuthContext = createContext(null)

// Страховочный таймаут восстановления сессии. Если Keycloak не отвечает,
// по истечении времени выходим из «Загрузка…» на экран входа.
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

/* Вход — через нашу форму (LoginScreen), страница Keycloak не показывается.
   Токены получаем по логину/паролю (passwordLogin), а продлевает их
   keycloak-js: init({ token, refreshToken }) без onLoad — никаких редиректов.
   Токены лежат в localStorage, поэтому вход переживает перезагрузку. */
export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const kcRef = useRef(null)

  const signedOut = useCallback(() => {
    kcRef.current = null
    clearTokens()
    setAuthenticated(false)
    setUser(null)
  }, [])

  // Поднять сессию keycloak-js из готовых токенов (после входа или из хранилища).
  // init() сразу продлевает токен (updateToken(-1)) — заодно проверка, что
  // сессия в Keycloak ещё жива.
  const startSession = useCallback((tokens) => {
    const kc = createKeycloak()
    kcRef.current = kc
    kc.onAuthRefreshSuccess = () => {
      if (kcRef.current !== kc) return
      saveTokens(kc)
      setUser((u) => (u ? { ...u, token: kc.token } : u))
    }
    // Продление до истечения. Если refresh-токен протух после простоя —
    // чистим сессию и показываем экран входа, а не висим с мёртвым токеном.
    kc.onTokenExpired = () => {
      kc.updateToken(30).catch(() => { if (kcRef.current === kc) signedOut() })
    }
    return kc
      .init({ ...tokens, pkceMethod: 'S256', checkLoginIframe: false })
      .then((auth) => {
        if (kcRef.current !== kc) return false
        if (!auth) { signedOut(); return false }
        saveTokens(kc)
        setUser(userFromKeycloak(kc))
        setAuthenticated(true)
        return true
      })
      .catch(() => {
        if (kcRef.current === kc) signedOut()
        return false
      })
  }, [signedOut])

  useEffect(() => {
    // Режим без Keycloak: сразу пускаем тестового пользователя
    if (AUTH_DISABLED) {
      setUser(MOCK_USER)
      setAuthenticated(true)
      setReady(true)
      return
    }
    const saved = loadTokens()
    if (!saved) { setReady(true); return }

    let cancelled = false
    // Что бы ни случилось с восстановлением сессии — выходим из «Загрузка…».
    const initTimer = setTimeout(() => {
      if (cancelled) return
      signedOut()
      setReady(true)
    }, INIT_TIMEOUT_MS)
    startSession(saved).finally(() => {
      if (cancelled) return
      clearTimeout(initTimer)
      setReady(true)
    })
    return () => {
      cancelled = true
      clearTimeout(initTimer)
    }
  }, [startSession, signedOut])

  // Возвращает промис; при ошибке бросает Error с понятным текстом для формы.
  const login = useCallback(async (username, password) => {
    if (AUTH_DISABLED) return
    const tokens = await passwordLogin(username, password)
    const ok = await startSession(tokens)
    if (!ok) throw new Error('Не удалось открыть сессию. Попробуйте ещё раз.')
  }, [startSession])

  const logout = useCallback(() => {
    if (AUTH_DISABLED) return
    const refreshToken = kcRef.current?.refreshToken
    signedOut()
    void revokeSession(refreshToken)
  }, [signedOut])

  return (
    <AuthContext.Provider value={{ ready, authenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
