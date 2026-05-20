import React, { useState, useEffect, useCallback } from 'react'
import TitleBar from './components/TitleBar'
import TimerPage from './components/TimerPage'
import TasksPage from './components/TasksPage'
import SettingsPage from './components/SettingsPage'
import StatsPage from './components/StatsPage'
import { useTimer, MODES } from './hooks/useTimer'
import { useSound } from './hooks/useSound'
import { useSettings, useStats, useTasks } from './store/useStore'
import { Timer, ListTodo, BarChart2, Settings } from 'lucide-react'

const TABS = [
  { key: 'timer', label: '计时', Icon: Timer },
  { key: 'tasks', label: '任务', Icon: ListTodo },
  { key: 'stats', label: '统计', Icon: BarChart2 },
  { key: 'settings', label: '设置', Icon: Settings },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('timer')
  const [settings, setSettings] = useSettings()
  const [stats, recordPomodoro] = useStats()
  const { tasks, addTask, completeTask, deleteTask, incrementTaskActual } = useTasks()
  const { playWorkEnd, playBreakEnd } = useSound(settings.soundEnabled)

  const handleSessionComplete = useCallback(({ mode, nextMode, sessionCount }) => {
    const isWork = mode === MODES.WORK
    const title = isWork ? '专注时间结束！' : '休息结束！'
    const body = isWork
      ? `第 ${sessionCount} 个番茄完成，开始休息吧 🌿`
      : '休息结束，继续专注吧 💪'

    if (isWork) {
      playWorkEnd()
    } else {
      playBreakEnd()
    }

    if (settings.notifyEnabled && window.electronAPI) {
      window.electronAPI.notify(title, body)
    }
  }, [playWorkEnd, playBreakEnd, settings.notifyEnabled])

  const handlePomodoroComplete = useCallback(() => {
    recordPomodoro()
    // 给第一个未完成任务 +1 实际番茄数
    const activeTask = tasks.find((t) => !t.done)
    if (activeTask) incrementTaskActual(activeTask.id)
  }, [recordPomodoro, tasks, incrementTaskActual])

  const timer = useTimer({
    settings,
    onSessionComplete: handleSessionComplete,
    onPomodoroComplete: handlePomodoroComplete,
  })

  // 同步托盘标题
  useEffect(() => {
    if (window.electronAPI) {
      const trayText = timer.isRunning
        ? `🍅 ${timer.timeString}`
        : `🍅`
      window.electronAPI.updateTray(trayText)
    }
    // 更新页面标题
    document.title = timer.isRunning
      ? `${timer.timeString} — ${timer.modeLabel}`
      : '番茄时钟'
  }, [timer.timeString, timer.isRunning, timer.modeLabel])

  const theme = settings.theme

  return (
    <div className={`app ${theme}`}>
      <TitleBar theme={theme} />

      <div className="content">
        {activeTab === 'timer' && (
          <TimerPage
            timer={timer}
            tasks={tasks}
            onIncrementTask={incrementTaskActual}
          />
        )}
        {activeTab === 'tasks' && (
          <TasksPage
            tasks={tasks}
            addTask={addTask}
            completeTask={completeTask}
            deleteTask={deleteTask}
          />
        )}
        {activeTab === 'stats' && <StatsPage stats={stats} />}
        {activeTab === 'settings' && (
          <SettingsPage settings={settings} setSettings={setSettings} />
        )}
      </div>

      {/* 底部导航栏 */}
      <nav className="bottom-nav">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`nav-btn ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
