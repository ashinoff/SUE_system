import { BarChart3, Zap, Activity, Bug } from 'lucide-react'
import { SvetTile, ResmTile, SphereTile, TarakanyTile } from './appIcons.jsx'

/* ════════════════════════════════════════════════════════════════
   РЕЕСТР ПРИЛОЖЕНИЙ
   Чтобы добавить приложение — добавь объект в массив APPS.
   ────────────────────────────────────────────────────────────────
   id     — уникальный идентификатор
   name   — подпись под иконкой и заголовок окна
   icon   — компонент иконки из lucide-react (https://lucide.dev/icons).
            Запасной вариант, если нет iconSvg/iconUrl.
   iconSvg— (рекомендуется) инлайн-SVG плитка приложения из ./appIcons.jsx
            (без картинок — вектор, заполняет всю плитку). В приоритете.
   iconUrl— (легаси, необязательно) путь к картинке в public/apps/. Если задан
            и нет iconSvg — показывается картинка; при ошибке — откат на icon.
   url    — адрес приложения (откроется в окне через iframe)
   roles  — какие роли видят иконку. Пустой массив = видно всем.
            ВАЖНО: это фильтр ТОЛЬКО для интерфейса. Настоящую проверку
            прав обязано делать само приложение на своём бэкенде —
            клиенту верить нельзя.
   badge  — есть ли у приложения бэкенд с эндпоинтом /api/platform/badge
            (счётчик уведомлений). true — платформа опрашивает его и рисует
            красный кружок на иконке; false — приложение-заглушка без API.
   window — размер окна по умолчанию
   ════════════════════════════════════════════════════════════════ */
export const APPS = [
  {
    id: 'svet',
    name: 'Светлячок',
    icon: Zap,
    iconSvg: SvetTile,
    url: import.meta.env.VITE_APP_SVET_URL || 'https://uchet-pu-amvera-ashinoff.amvera.io',
    roles: ['svet-user', 'admin'],
    badge: true,
    window: { width: 1200, height: 760 },
  },
  {
    id: 'resm',
    name: 'Мониторинг напряжения',
    icon: BarChart3,
    iconSvg: ResmTile,
    url: import.meta.env.VITE_APP_RESM_URL || 'https://res-management-ashinoff.msk1.amvera.tech',
    roles: ['resm-user', 'admin'],
    badge: true,
    window: { width: 1200, height: 760 },
  },
  {
    // «ЭнергоСфера» (репозиторий EnergySphere, Amvera Miami, проект tp-approval).
    // Единое приложение из 4 модулей: анализ потребления (заменил отдельный
    // «Анализатор ПУ · ТП»), поиск потребителя, инструкция РИРУ, акты ТП.
    // Вход — токен платформы (platform-auth + app-ready); роль и РЭС
    // пользователю назначают в админке самой Сферы. sphere-user гейтит иконку.
    id: 'sphere',
    name: 'ЭнергоСфера',
    icon: Activity,
    iconSvg: SphereTile,
    url: import.meta.env.VITE_APP_SPHERE_URL || 'https://tp-approval-ashinoff.mia0.amvera.tech',
    roles: ['sphere-user', 'admin'],
    badge: false,
    window: { width: 1440, height: 900 },
  },
  {
    // «Тараканьи бега» — онлайн-гонка на скорость печати (репозиторий tarakany,
    // Node/Express + Socket.IO, Amvera waw0). Своей авторизации нет: по токену
    // платформы игра лишь подставляет имя пользователя в ник (platform-auth +
    // пинг app-ready). Роль tarakany-user гейтит только показ иконки.
    id: 'tarakany',
    name: 'Тараканьи бега',
    icon: Bug,
    iconSvg: TarakanyTile,
    url: import.meta.env.VITE_APP_TARAKANY_URL || 'https://tarakan-race-2-ashinoff.waw0.amvera.tech',
    roles: ['tarakany-user', 'admin'],
    badge: false,
    window: { width: 1280, height: 800 },
  },
]

/* Оставляет только те приложения, что доступны пользователю по ролям. */
export function appsForRoles(userRoles = []) {
  return APPS.filter(
    (a) => a.roles.length === 0 || a.roles.some((r) => userRoles.includes(r))
  )
}
