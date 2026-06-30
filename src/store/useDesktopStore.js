import { create } from 'zustand'
import { DEFAULT_WALLPAPER } from '../config/wallpapers.js'

/* Глобальное состояние рабочего стола: открытые приложения, уведомления,
   выбранные обои.

   Модель окон — как в iOS: приложение всегда раскрыто на весь экран,
   мини-окон нет. «Свернуть» убирает приложение в док (оно остаётся
   запущенным), повторный клик по доку или по иконке снова открывает
   его на весь экран. «Закрыть» завершает приложение. */

const WALLPAPER_KEY = 'platform.wallpaper'

function loadWallpaper() {
  try {
    return localStorage.getItem(WALLPAPER_KEY) || DEFAULT_WALLPAPER
  } catch {
    return DEFAULT_WALLPAPER
  }
}

// Окна лежат поверх дока и панели; счётчик растёт при фокусе, чтобы
// активное приложение всплывало над остальными.
let zCounter = 1100

export const useDesktopStore = create((set, get) => ({
  windows: [],        // [{ id, appId, title, url, minimized, z }]
  notifications: [],  // [{ id, app, text, read, time }]
  wallpaper: loadWallpaper(),

  openApp: (app) => {
    const existing = get().windows.find((w) => w.appId === app.id)
    if (existing) {
      // Уже запущено — просто вернуть на весь экран и сфокусировать.
      get().restoreWindow(existing.id)
      get().focusWindow(existing.id)
      return
    }
    zCounter += 1
    set((s) => ({
      windows: [
        ...s.windows,
        {
          id: `${app.id}-${Date.now()}`,
          appId: app.id,
          title: app.name,
          url: app.url,
          minimized: false,
          z: zCounter,
        },
      ],
    }))
  },

  closeWindow: (id) =>
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),

  focusWindow: (id) => {
    zCounter += 1
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, z: zCounter } : w)),
    }))
  },

  // Свернуть в док (приложение остаётся запущенным, просто скрыто).
  minimizeWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    })),

  // Снова показать на весь экран.
  restoreWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: false } : w)),
    })),

  // ── Обои рабочего стола ──
  setWallpaper: (id) => {
    try {
      localStorage.setItem(WALLPAPER_KEY, id)
    } catch {
      /* приватный режим / недоступный localStorage — просто не сохраняем */
    }
    set({ wallpaper: id })
  },

  // ── Уведомления ──
  pushNotification: (n) =>
    set((s) => ({
      notifications: [
        { id: Date.now() + Math.random(), read: false, time: new Date(), ...n },
        ...s.notifications,
      ],
    })),

  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

  clearNotifications: () => set({ notifications: [] }),
}))
