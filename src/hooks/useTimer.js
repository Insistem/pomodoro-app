import { useState, useEffect, useRef, useCallback } from 'react'

export const MODES = {
  WORK: 'work',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak',
}

const MODE_LABELS = {
  [MODES.WORK]: '专注',
  [MODES.SHORT_BREAK]: '短休息',
  [MODES.LONG_BREAK]: '长休息',
}

export function useTimer({ settings, onSessionComplete, onPomodoroComplete }) {
  const [mode, setMode] = useState(MODES.WORK)
  const [secondsLeft, setSecondsLeft] = useState(settings.workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(0) // 完成的番茄数

  const intervalRef = useRef(null)
  const modeRef = useRef(mode)
  const secondsRef = useRef(secondsLeft)

  modeRef.current = mode
  secondsRef.current = secondsLeft

  const getDuration = useCallback(
    (m) => {
      if (m === MODES.WORK) return settings.workDuration * 60
      if (m === MODES.SHORT_BREAK) return settings.shortBreak * 60
      return settings.longBreak * 60
    },
    [settings.workDuration, settings.shortBreak, settings.longBreak]
  )

  // 当设置改变时重置当前模式的时长（仅当未运行）
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(getDuration(mode))
    }
  }, [settings.workDuration, settings.shortBreak, settings.longBreak])

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
  }, [])

  const handleSessionEnd = useCallback(() => {
    stop()
    const currentMode = modeRef.current

    if (currentMode === MODES.WORK) {
      const newCount = sessionCount + 1
      setSessionCount(newCount)
      onPomodoroComplete?.()

      const nextMode =
        newCount % settings.sessionsUntilLong === 0
          ? MODES.LONG_BREAK
          : MODES.SHORT_BREAK

      onSessionComplete?.({ mode: currentMode, nextMode, sessionCount: newCount })
      setMode(nextMode)
      setSecondsLeft(getDuration(nextMode))
    } else {
      const nextMode = MODES.WORK
      onSessionComplete?.({ mode: currentMode, nextMode, sessionCount })
      setMode(nextMode)
      setSecondsLeft(getDuration(nextMode))
    }
  }, [sessionCount, settings.sessionsUntilLong, getDuration, stop, onPomodoroComplete, onSessionComplete])

  const start = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          // 用 setTimeout 避免在 setState 内部触发复杂副作用
          setTimeout(() => handleSessionEnd(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [isRunning, handleSessionEnd])

  const pause = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    stop()
    setSecondsLeft(getDuration(mode))
  }, [stop, getDuration, mode])

  const switchMode = useCallback(
    (newMode) => {
      stop()
      setMode(newMode)
      setSecondsLeft(getDuration(newMode))
    },
    [stop, getDuration]
  )

  const skipSession = useCallback(() => {
    handleSessionEnd()
  }, [handleSessionEnd])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const totalSeconds = getDuration(mode)
  const progress = (totalSeconds - secondsLeft) / totalSeconds

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return {
    mode,
    modeLabel: MODE_LABELS[mode],
    timeString,
    secondsLeft,
    totalSeconds,
    progress,
    isRunning,
    sessionCount,
    start,
    pause,
    reset,
    switchMode,
    skipSession,
  }
}
