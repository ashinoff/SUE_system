import { useState } from 'react'

/* Иконка приложения на столе и в доке.
   Если у приложения задан `iconUrl` (картинка-ярлычок из public/apps/) —
   показываем её; если файл не найден — мягко откатываемся на lucide-иконку
   из поля `icon`. Если `iconUrl` нет — просто рендерим lucide-иконку. */
export default function AppIcon({ app, size = 28 }) {
  const [imgFailed, setImgFailed] = useState(false)
  const Fallback = app.icon

  if (app.iconUrl && !imgFailed) {
    return (
      <img
        src={app.iconUrl}
        width={size}
        height={size}
        alt=""
        onError={() => setImgFailed(true)}
        style={{ objectFit: 'contain', display: 'block' }}
      />
    )
  }

  return Fallback ? <Fallback size={size} /> : null
}
