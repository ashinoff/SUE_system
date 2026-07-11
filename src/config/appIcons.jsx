/* Инлайн-SVG плитки приложений (без картинок). Каждая — скруглённый квадрат
   с фирменной заливкой и белым глифом; заполняет всю плитку иконки
   (класс app-icon__img задаёт размер/скругление, а бейдж становится
   прозрачным через :has в app.css). */

// «Светлячок» (Учёт ПУ) — тёплый→холодный градиент, белая молния.
export function SvetTile(props) {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <defs>
        <linearGradient id="svetGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#feda75" />
          <stop offset="0.35" stopColor="#fa7e1e" />
          <stop offset="0.6" stopColor="#d62976" />
          <stop offset="0.85" stopColor="#962fbf" />
          <stop offset="1" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#svetGrad)" />
      <path fill="#fff" transform="translate(88 88) scale(14)" d="M13 2 3 14 12 14 11 22 21 10 12 10 13 2Z" />
    </svg>
  )
}

// «СИЗ-контроль» — красная плитка, белый щит с галочкой.
export function SizTile(props) {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <defs>
        <linearGradient id="sizGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ef4444" />
          <stop offset="1" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#sizGrad)" />
      <g transform="translate(88 88) scale(14)" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 11l2 2 4-4" />
      </g>
    </svg>
  )
}
