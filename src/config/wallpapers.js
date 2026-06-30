/* ════════════════════════════════════════════════════════════════
   ОБОИ РАБОЧЕГО СТОЛА (пресеты)
   value — любой CSS-фон (градиент/цвет/url). Подставляется в токен
   --wallpaper во время выполнения (см. useDesktopStore + Desktop).
   Чтобы добавить обои — добавь объект в массив. id первого пресета
   должен совпадать с DEFAULT_WALLPAPER.
   ════════════════════════════════════════════════════════════════ */
export const WALLPAPERS = [
  {
    id: 'indigo-night',
    name: 'Индиго',
    value:
      'radial-gradient(circle at 28% 18%, #2b3a67 0%, #1b2440 55%, #131a30 100%)',
  },
  {
    id: 'aurora',
    name: 'Аврора',
    value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  },
  {
    id: 'sunset',
    name: 'Закат',
    value: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)',
  },
  {
    id: 'forest',
    name: 'Лес',
    value: 'linear-gradient(160deg, #134e5e 0%, #71b280 100%)',
  },
  {
    id: 'graphite',
    name: 'Графит',
    value: 'linear-gradient(180deg, #232526 0%, #414345 100%)',
  },
  {
    id: 'violet',
    name: 'Фиолет',
    value: 'radial-gradient(circle at 70% 20%, #5b2a86 0%, #2d1b4e 55%, #160f2b 100%)',
  },
]

export const DEFAULT_WALLPAPER = 'indigo-night'
