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

// «РЭС-менеджмент» (контроль уровня напряжения) — зелёно-бирюзовый градиент,
// белая «пульс»-линия (мониторинг напряжения).
export function ResmTile(props) {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <defs>
        <linearGradient id="resmGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22c55e" />
          <stop offset="1" stopColor="#0e7490" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#resmGrad)" />
      <g transform="translate(88 88) scale(14)" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </g>
    </svg>
  )
}

// «Анализ потребления» (энергоаудит) — индиго-градиент, белая лупа над
// ломаной линией потребления (поиск аномалий).
export function AnomalyTile(props) {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <defs>
        <linearGradient id="anomalyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#anomalyGrad)" />
      <g transform="translate(88 88) scale(14)" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 17l4-5 3 3 4-7" />
        <circle cx="17" cy="9" r="3.4" />
        <line x1="19.6" y1="11.6" x2="22" y2="14" />
      </g>
    </svg>
  )
}

// «Опрос ПУ» (аналитика собираемости, ПО «Пирамида») — фиолетовый градиент,
// белая ступенчатая пирамида (отсылка к «Пирамиде») с сигнальной дугой опроса.
export function OprosTile(props) {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <defs>
        <linearGradient id="oprosGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="0.55" stopColor="#4c1d95" />
          <stop offset="1" stopColor="#0b0a12" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#oprosGrad)" />
      <g transform="translate(88 88) scale(14)" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5 20.5 20.5 3.5 20.5Z" />
        <path d="M7.6 12.2H16.4" />
        <path d="M5.1 16.4H18.9" />
      </g>
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

// «Тараканьи бега» — рыже-коричневый градиент, белый таракан (вид сверху)
// с усами и лапками.
export function TarakanyTile(props) {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <defs>
        <linearGradient id="tarakanyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#92400e" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#tarakanyGrad)" />
      <g transform="translate(88 88) scale(14)" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.6 5.2C9 3 7.5 2 5.5 1.6M13.4 5.2C15 3 16.5 2 18.5 1.6" />
        <path d="M8.6 10.5 5 9.2 3.2 6.8M8.4 14 4.4 14.2 2.6 16.4M9 17.4 6 20.6 6.4 22.6" />
        <path d="M15.4 10.5 19 9.2 20.8 6.8M15.6 14 19.6 14.2 21.4 16.4M15 17.4 18 20.6 17.6 22.6" />
      </g>
      <g transform="translate(88 88) scale(14)" fill="#fff">
        <ellipse cx="12" cy="6.6" rx="2.4" ry="1.9" />
        <ellipse cx="12" cy="14.6" rx="3.9" ry="6.4" />
      </g>
      <path transform="translate(88 88) scale(14)" d="M12 9.2V20.6" stroke="#b45309" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  )
}
