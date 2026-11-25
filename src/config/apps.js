import { BarChart3, Zap, Activity, Sprout } from 'lucide-react'
import { SvetTile, ResmTile, SphereTile, RazvitieTile } from './appIcons.jsx'

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
    badge: true, // новые отметки монтёров у инженеров РИРУ (/api/platform/badge)
    window: { width: 1440, height: 900 },
  },
  {
    // «Развитие» (бывшие «Тараканьи бега», репозиторий tarakany, Amvera msk1 razvitie):
    // разделы Тараканьи бега / Тестирование / Задачи, за успехи — монетки. Вход по
    // токену платформы (platform-auth + пинг app-ready), сервер проверяет подпись
    // и берёт ФИО для ника. id и роль tarakany-user прежние — выданные роли работают.
    id: 'tarakany',
    name: 'Развитие',
    icon: Sprout,
    iconSvg: RazvitieTile,
    url: import.meta.env.VITE_APP_TARAKANY_URL || 'https://razvitie-ashinoff.msk1.amvera.tech',
    roles: ['tarakany-user', 'admin'],
    badge: false,
    window: { width: 1280, height: 800 },
  },
]

/* Все иконки рабочего стола видны всем вошедшим (решение владельца 24.11.2026).
   Что человеку можно внутри приложения, решает само приложение (свои роли и права).
   Вернуть показ по ролям Keycloak — SHOW_ALL_APPS = false (роли в APPS не удалены). */
const SHOW_ALL_APPS = true

export function appsForRoles(userRoles = []) {
  if (SHOW_ALL_APPS) return APPS
  return APPS.filter(
    (a) => a.roles.length === 0 || a.roles.some((r) => userRoles.includes(r))
  )
}
