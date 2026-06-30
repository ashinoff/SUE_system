import Keycloak from 'keycloak-js'

/* Конфиг Keycloak берётся из переменных окружения (.env / .env.production).
   Чтобы запустить оболочку ЛОКАЛЬНО без Keycloak — поставь
   VITE_AUTH_DISABLED=true: тогда оболочка пустит тестового пользователя
   и можно сразу смотреть и крутить интерфейс. */

export const AUTH_DISABLED = import.meta.env.VITE_AUTH_DISABLED === 'true'

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT || 'web-desktop',
})

/* Тестовый пользователь для режима AUTH_DISABLED.
   roles совпадают с тем, что мы фильтруем в config/apps.js. */
export const MOCK_USER = {
  id: 'dev-user-0001',
  name: 'Тестовый пользователь',
  email: 'dev@platform.local',
  roles: ['admin', 'siz_user'],
  token: 'dev-token',
}
