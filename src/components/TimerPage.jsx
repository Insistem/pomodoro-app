import React from 'react'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import TimerRing from './TimerRing'
import { MODES } from '../hooks/useTimer'

const MODE_TABS = [
  { key: MODES.WORK, label: '专注' },
  { key: MODES.SHORT_BREAK, label: '短休息' },
  { key: MODES.LONG_BREAK, label: '长休息' },
]

export default function TimerPage({ timer, tasks, onIncrementTask }) {
  const { mode, modeLabel, timeString, progress, isRunning, sessionCount, start, pause, reset, switchMode, skipSession } = timer
  const activeTask = tasks.find((t) => !t.done) ?? null

  return (
    <div className="page timer-page">
      {/* 模式切换标签 */}
      <div className="mode-tabs">
        {MODE_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`mode-tab ${mode === tab.key ? 'active' : ''}`}
            onClick={() => switchMode(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 环形计时器 */}
      <TimerRing
        timeString={timeString}
        progress={progress}
        mode={mode}
        isRunning={isRunning}
      />

      {/* 番茄计数 */}
      <div className="session-dots">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`dot ${i < (sessionCount % 4 || (sessionCount > 0 && sessionCount % 4 === 0 ? 4 : 0)) ? 'filled' : ''}`}
          />
        ))}
      </div>
      <p className="session-count">今日已完成 {sessionCount} 个番茄</p>

      {/* 当前任务 */}
      {activeTask && (
        <div className="current-task">
          <span className="current-task-label">当前任务</span>
          <span className="current-task-name">{activeTask.name}</span>
          <span className="current-task-count">
            {activeTask.actual}/{activeTask.estimated} 🍅
          </span>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="controls">
        <button className="ctrl-round" onClick={reset} title="重置">
          <RotateCcw size={20} />
        </button>
        <button
          className={`ctrl-main ${isRunning ? 'running' : ''}`}
          onClick={isRunning ? pause : start}
        >
          {isRunning ? <Pause size={28} /> : <Play size={28} />}
        </button>
        <button className="ctrl-round" onClick={skipSession} title="跳过">
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  )
}
