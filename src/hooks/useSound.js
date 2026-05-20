import { useCallback } from 'react'

// 用 Web Audio API 合成提示音，无需外部音频文件
function createBeep(audioCtx, frequency, duration, type = 'sine', gain = 0.3) {
  const osc = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()
  osc.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime)
  gainNode.gain.setValueAtTime(gain, audioCtx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)
  osc.start()
  osc.stop(audioCtx.currentTime + duration)
}

let audioCtx = null

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

export function useSound(enabled) {
  const playWorkEnd = useCallback(() => {
    if (!enabled) return
    try {
      const ctx = getAudioCtx()
      // 三声递升提示音
      setTimeout(() => createBeep(ctx, 523, 0.2), 0)
      setTimeout(() => createBeep(ctx, 659, 0.2), 250)
      setTimeout(() => createBeep(ctx, 784, 0.4), 500)
    } catch {}
  }, [enabled])

  const playBreakEnd = useCallback(() => {
    if (!enabled) return
    try {
      const ctx = getAudioCtx()
      setTimeout(() => createBeep(ctx, 784, 0.2), 0)
      setTimeout(() => createBeep(ctx, 659, 0.2), 250)
      setTimeout(() => createBeep(ctx, 523, 0.4), 500)
    } catch {}
  }, [enabled])

  return { playWorkEnd, playBreakEnd }
}
