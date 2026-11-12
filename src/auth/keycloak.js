import Keycloak from 'keycloak-js'

/* Конфиг Keycloak берётся из переменных окружения (.env / .env.production).
   Чтобы запустить оболочку ЛОКАЛЬНО без Keycloak — поставь
   VITE_AUTH_DISABLED=true: тогда оболочка пустит тестового пользователя
   и можно сразу смотреть и крутить интерфейс. */

export const AUTH_DISABLED = import.meta.env.VITE_AUTH_DISABLED === 'true'

const KC_URL = (import.meta.env.VITE_KEYCLOAK_URL || '').replace(/\/+$/, '')
const KC_REALM = import.meta.env.VITE_KEYCLOAK_REALM
const KC_CLIENT = import.meta.env.VITE_KEYCLOAK_CLIENT || 'web-desktop'
const OIDC = `${KC_URL}/realms/${KC_REALM}/protocol/openid-connect`

/* Экземпляр keycloak-js можно инициализировать только один раз, поэтому
   на каждую сессию (вход из формы или восстановление после перезагрузки)
   создаётся новый. keycloak-js здесь только хранит и продлевает токены —
   страница входа Keycloak пользователю не показывается. */
export const createKeycloak = () => new Keycloak({ url: KC_URL, realm: KC_REALM, clientId: KC_CLIENT })

/* Вход логином и паролем из нашей формы (OAuth Direct Access Grant).
   У клиента web-desktop в Keycloak должна быть включена галочка
   «Direct access grants». Пароль уходит только в Keycloak и нигде не хранится. */
const LOGIN_TIMEOUT_MS = 15_000

function loginError(data) {
  const text = `${data?.error || ''} ${data?.error_description || ''}`.toLowerCase()
  if (text.includes('not fully set up')) {
    return 'Учётная запись не настроена до конца (например, требуется сменить пароль). Обратитесь к администратору.'
  }
  if (text.includes('disabled')) return 'Учётная запись отключена. Обратитесь к администратору.'
  if (text.includes('direct access')) return 'Вход из формы не разрешён в Keycloak (Direct access grants).'
  if (data?.error === 'invalid_grant') return 'Неверный логин или пароль.'
  return 'Не удалось войти. Попробуйте ещё раз.'
}

export async function passwordLogin(username, password) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), LOGIN_TIMEOUT_MS)
  let response
  try {
    response = await fetch(`${OIDC}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'password', client_id: KC_CLIENT, scope: 'openid', username, password }),
      signal: controller.signal,
    })
  } catch {
    throw new Error('Нет связи с сервером входа. Проверьте подключение и попробуйте ещё раз.')
  } finally {
    clearTimeout(timer)
  }
  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.access_token) throw new Error(loginError(data))
  return { token: data.access_token, refreshToken: data.refresh_token, idToken: data.id_token }
}

/* Завершение сессии в Keycloak без перехода на его страницу. */
export async function revokeSession(refreshToken) {
  if (!refreshToken) return
  try {
    await fetch(`${OIDC}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: KC_CLIENT, refresh_token: refreshToken }),
    })
  } catch { /* сессия всё равно истечёт сама */ }
}

/* Токены сессии храним в браузере, чтобы вход переживал перезагрузку
   страницы (раньше это делала cookie на странице Keycloak). */
const STORE_KEY = 'platform.auth.v1'

export function loadTokens() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
    return saved?.token && saved?.refreshToken ? saved : null
  } catch {
    return null
  }
}

export function saveTokens(kc) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ token: kc.token, refreshToken: kc.refreshToken, idToken: kc.idToken }))
  } catch { /* приватный режим — вход просто не переживёт перезагрузку */ }
}

export function clearTokens() {
  try { localStorage.removeItem(STORE_KEY) } catch { /* noop */ }
}

/* Тестовый пользователь для режима AUTH_DISABLED.
   roles совпадают с тем, что мы фильтруем в config/apps.js. */
export const MOCK_USER = {
  id: 'dev-user-0001',
  name: 'Тестовый пользователь',
  email: 'dev@platform.local',
  roles: ['admin', 'siz_user'],
  token: 'dev-token',
}
