import { ShieldCheck, BarChart3, Zap, Activity } from 'lucide-react'
import { SvetTile, SizTile, ResmTile, AnomalyTile } from './appIcons.jsx'

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
    id: 'siz',
    name: 'СИЗ',
    icon: ShieldCheck,
    iconSvg: SizTile,
    url: import.meta.env.VITE_APP_SIZ_URL || 'https://siz-control-ashinoff.amvera.io',
    roles: ['siz-user', 'admin'],
    badge: true,
    window: { width: 1100, height: 720 },
  },
  {
    id: 'reports',
    name: 'Отчёты',
    icon: BarChart3,
    iconUrl: '/apps/reports.png',
    url: 'about:blank',
    roles: ['admin'],
    badge: false,
    window: { width: 960, height: 640 },
  },
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
    url: import.meta.env.VITE_APP_RESM_URL || 'https://res-management-ashinoff.amvera.io',
    roles: ['resm-user', 'admin'],
    badge: true,
    window: { width: 1200, height: 760 },
  },
  {
    // Streamlit-инструмент анализа аномального потребления. Своей авторизации
    // и бэкенда нет — роль гейтит только показ иконки на рабочем столе, сам
    // URL открыт (инструмент stateless, данные не сохраняются). ?embed=true —
    // штатный режим встраивания Streamlit (прячет своё меню/футер в iframe).
    id: 'anomaly',
    name: 'Анализ потребления',
    icon: Activity,
    iconSvg: AnomalyTile,
    url: import.meta.env.VITE_APP_ANOMALY_URL || 'https://energy-audit-ashinoff.amvera.io/?embed=true',
    roles: ['anomaly-user', 'admin'],
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
