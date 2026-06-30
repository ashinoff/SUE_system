import { create } from 'zustand'

/* Глобальное состояние рабочего стола: открытые окна и уведомления.
   Менеджер окон: открыть/закрыть/свернуть/сфокусировать/переместить. */

let zCounter = 100 // счётчик z-index, чтобы поднимать активное окно наверх

export const useDesktopStore = create((set, get) => ({
  windows: [],        // [{ id, appId, title, url, x, y, width, height, minimized, z }]
  notifications: [],  // [{ id, app, text, read, time }]

  openApp: (app) => {
    const existing = get().windows.find((w) => w.appId === app.id)
    if (existing) {
      get().restoreWindow(existing.id)
      get().focusWindow(existing.id)
      return
    }
    zCounter += 1
    const offset = get().windows.length * 28
    set((s) => ({
      windows: [
        ...s.windows,
        {
          id: `${app.id}-${Date.now()}`,
          appId: app.id,
          title: app.name,
          url: app.url,
          x: 80 + offset,
          y: 24 + offset,
          width: app.window?.width || 960,
          height: app.window?.height || 640,
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

  minimizeWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    })),

  restoreWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: false } : w)),
    })),

  updateWindow: (id, patch) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    })),

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
