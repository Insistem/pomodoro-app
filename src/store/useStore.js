import { useState, useEffect } from 'react'

const STORAGE_KEY = 'pomodoro_state'

const defaultSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsUntilLong: 4,
  theme: 'dark',
  soundEnabled: true,
  notifyEnabled: true,
}

const defaultStats = {
  // { 'YYYY-MM-DD': count }
  history: {},
}

function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function useSettings() {
  const [settings, setSettingsRaw] = useState(() =>
    loadStorage('pomodoro_settings', defaultSettings)
  )

  function setSettings(updater) {
    setSettingsRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      saveStorage('pomodoro_settings', next)
      return next
    })
  }

  return [settings, setSettings]
}

export function useStats() {
  const [stats, setStatsRaw] = useState(() =>
    loadStorage('pomodoro_stats', defaultStats)
  )

  function recordPomodoro() {
    const today = new Date().toISOString().slice(0, 10)
    setStatsRaw((prev) => {
      const next = {
        ...prev,
        history: {
          ...prev.history,
          [today]: (prev.history[today] || 0) + 1,
        },
      }
      saveStorage('pomodoro_stats', next)
      return next
    })
  }

  return [stats, recordPomodoro]
}

export function useTasks() {
  const [tasks, setTasksRaw] = useState(() =>
    loadStorage('pomodoro_tasks', { list: [] }).list
  )

  function setTasks(updater) {
    setTasksRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveStorage('pomodoro_tasks', { list: next })
      return next
    })
  }

  function addTask(name, estimated = 1) {
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), name, estimated, actual: 0, done: false },
    ])
  }

  function completeTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function incrementTaskActual(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, actual: t.actual + 1 } : t))
    )
  }

  return { tasks, addTask, completeTask, deleteTask, incrementTaskActual }
}
