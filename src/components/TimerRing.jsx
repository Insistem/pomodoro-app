import React from 'react'

const SIZE = 240
const STROKE = 11
const RADIUS = (SIZE - STROKE) / 2 - 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const MODE_COLORS = {
  work: '#ff6b5b',
  shortBreak: '#4ecb8e',
  longBreak: '#5b9cf6',
}

const MODE_GLOWS = {
  work: 'rgba(255,107,91,0.55)',
  shortBreak: 'rgba(78,203,142,0.55)',
  longBreak: 'rgba(91,156,246,0.55)',
}

export default function TimerRing({ timeString, progress, mode, isRunning }) {
  const offset = CIRCUMFERENCE * (1 - progress)
  const color = MODE_COLORS[mode] ?? '#ff6b5b'
  const glow = MODE_GLOWS[mode] ?? 'rgba(255,107,91,0.55)'

  return (
    <div className="timer-ring-container">
      <svg width={SIZE} height={SIZE} className="timer-svg">
        <defs>
          <filter id="ring-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* 轨道环 */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        {/* 进度环 */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          filter={isRunning ? 'url(#ring-glow)' : undefined}
          style={{
            transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease',
            filter: isRunning ? `drop-shadow(0 0 7px ${glow})` : undefined,
          }}
        />
      </svg>
      <div className="timer-center">
        <div className={`timer-time ${isRunning ? 'running' : ''}`}>{timeString}</div>
      </div>
    </div>
  )
}
