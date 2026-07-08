import { useState } from 'react'

/* Иконка приложения на столе и в доке.
   Если у приложения задан `iconUrl` (картинка-ярлычок из public/apps/) —
   показываем её; если файл не найден — мягко откатываемся на lucide-иконку
   из поля `icon`. Если `iconUrl` нет — просто рендерим lucide-иконку. */
export default function AppIcon({ app, size = 28 }) {
  const [imgFailed, setImgFailed] = useState(false)
  const Fallback = app.icon

  if (app.iconUrl && !imgFailed) {
    // Картинка заполняет всю плитку (размеры/скругление — из CSS .app-icon__img).
    return (
      <img
        className="app-icon__img"
        src={app.iconUrl}
        alt=""
        onError={() => setImgFailed(true)}
      />
    )
  }

  return Fallback ? <Fallback size={size} /> : null
}
