import { ShieldCheck, Boxes, BarChart3 } from 'lucide-react'

/* ════════════════════════════════════════════════════════════════
   РЕЕСТР ПРИЛОЖЕНИЙ
   Чтобы добавить приложение — добавь объект в массив APPS.
   ────────────────────────────────────────────────────────────────
   id     — уникальный идентификатор
   name   — подпись под иконкой и заголовок окна
   icon   — компонент иконки из lucide-react (https://lucide.dev/icons)
   url    — адрес приложения (откроется в окне через iframe)
   roles  — какие роли видят иконку. Пустой массив = видно всем.
            ВАЖНО: это фильтр ТОЛЬКО для интерфейса. Настоящую проверку
            прав обязано делать само приложение на своём бэкенде —
            клиенту верить нельзя.
   window — размер окна по умолчанию
   ════════════════════════════════════════════════════════════════ */
export const APPS = [
  {
    id: 'siz',
    name: 'СИЗ-контроль',
    icon: ShieldCheck,
    url: import.meta.env.VITE_APP_SIZ_URL || 'https://siz-control-ashinoff.amvera.io',
    roles: ['siz-user', 'admin'],
    window: { width: 1100, height: 720 },
  },
  {
    id: 'sklad',
    name: 'Склад',
    icon: Boxes,
    url: 'about:blank',
    roles: [],
    window: { width: 960, height: 640 },
  },
  {
    id: 'reports',
    name: 'Отчёты',
    icon: BarChart3,
    url: 'about:blank',
    roles: ['admin'],
    window: { width: 960, height: 640 },
  },
]

/* Оставляет только те приложения, что доступны пользователю по ролям. */
export function appsForRoles(userRoles = []) {
  return APPS.filter(
    (a) => a.roles.length === 0 || a.roles.some((r) => userRoles.includes(r))
  )
}
