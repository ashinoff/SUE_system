import { ShieldCheck, Boxes, BarChart3, Zap } from 'lucide-react'

/* ════════════════════════════════════════════════════════════════
   РЕЕСТР ПРИЛОЖЕНИЙ
   Чтобы добавить приложение — добавь объект в массив APPS.
   ────────────────────────────────────────────────────────────────
   id     — уникальный идентификатор
   name   — подпись под иконкой и заголовок окна
   icon   — компонент иконки из lucide-react (https://lucide.dev/icons).
            Используется как запасной вариант, если нет/не загрузился iconUrl.
   iconUrl— (необязательно) путь к картинке-ярлычку в public/apps/,
            напр. '/apps/siz.png'. Если задан — показывается вместо lucide-иконки;
            если файла нет — мягкий откат на icon.
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
    name: 'СИЗ-контроль',
    icon: ShieldCheck,
    iconUrl: '/apps/siz.png',
    url: import.meta.env.VITE_APP_SIZ_URL || 'https://siz-control-ashinoff.amvera.io',
    roles: ['siz-user', 'admin'],
    badge: true,
    window: { width: 1100, height: 720 },
  },
  {
    id: 'sklad',
    name: 'Склад',
    icon: Boxes,
    iconUrl: '/apps/sklad.png',
    url: 'about:blank',
    roles: [],
    badge: false,
    window: { width: 960, height: 640 },
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
    iconUrl: '/apps/svet.png',
    url: import.meta.env.VITE_APP_SVET_URL || 'https://uchet-pu-amvera-ashinoff.amvera.io',
    roles: ['svet-user', 'admin'],
    badge: true,
    window: { width: 1200, height: 760 },
  },
]

/* Оставляет только те приложения, что доступны пользователю по ролям. */
export function appsForRoles(userRoles = []) {
  return APPS.filter(
    (a) => a.roles.length === 0 || a.roles.some((r) => userRoles.includes(r))
  )
}
