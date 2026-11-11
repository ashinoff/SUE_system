/* Логотип Платформы: тёмная плитка, три светлых квадрата (приложения)
   и молния. Цвета — токены --logo-* в tokens.css.
   animated — на экране входа: квадраты появляются по очереди, затем «бьёт»
   молния; дальше квадраты изредка пробегают волной, а молния мерцает. */
export default function PlatformLogo({ animated = false, className = '' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`plogo${animated ? ' plogo--animated' : ''} ${className}`}
      role="img"
      aria-label="Платформа"
    >
      <rect className="plogo__tile" width="100" height="100" rx="24" />
      <rect className="plogo__sq plogo__sq--1" x="14" y="14" width="31" height="31" rx="9" />
      <rect className="plogo__sq plogo__sq--2" x="55" y="14" width="31" height="31" rx="9" />
      <rect className="plogo__sq plogo__sq--3" x="14" y="55" width="31" height="31" rx="9" />
      <path
        className="plogo__bolt"
        d="M77 56 59 75H70.5L65.5 87 84 67.5H72.5Z"
      />
    </svg>
  )
}
