import React from 'react'
import { Bell, Volume2, Moon, Sun } from 'lucide-react'

function NumberSetting({ label, value, min, max, onChange }) {
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <div className="number-control">
        <button onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <span className="number-val">{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  )
}

function ToggleSetting({ label, icon: Icon, value, onChange }) {
  return (
    <div className="setting-row">
      <span className="setting-label">
        <Icon size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
        {label}
      </span>
      <button
        className={`toggle-btn ${value ? 'on' : 'off'}`}
        onClick={() => onChange(!value)}
      >
        {value ? '开' : '关'}
      </button>
    </div>
  )
}

export default function SettingsPage({ settings, setSettings }) {
  function update(key, val) {
    setSettings((prev) => ({ ...prev, [key]: val }))
  }

  return (
    <div className="page settings-page">
      <h2 className="page-title">设置</h2>

      <div className="settings-section">
        <h3 className="section-title">时长 (分钟)</h3>
        <NumberSetting
          label="专注时长"
          value={settings.workDuration}
          min={1}
          max={60}
          onChange={(v) => update('workDuration', v)}
        />
        <NumberSetting
          label="短休息"
          value={settings.shortBreak}
          min={1}
          max={30}
          onChange={(v) => update('shortBreak', v)}
        />
        <NumberSetting
          label="长休息"
          value={settings.longBreak}
          min={1}
          max={60}
          onChange={(v) => update('longBreak', v)}
        />
        <NumberSetting
          label="长休息间隔 (番茄数)"
          value={settings.sessionsUntilLong}
          min={2}
          max={8}
          onChange={(v) => update('sessionsUntilLong', v)}
        />
      </div>

      <div className="settings-section">
        <h3 className="section-title">提醒</h3>
        <ToggleSetting
          label="声音提醒"
          icon={Volume2}
          value={settings.soundEnabled}
          onChange={(v) => update('soundEnabled', v)}
        />
        <ToggleSetting
          label="系统通知"
          icon={Bell}
          value={settings.notifyEnabled}
          onChange={(v) => update('notifyEnabled', v)}
        />
      </div>

      <div className="settings-section">
        <h3 className="section-title">外观</h3>
        <div className="setting-row">
          <span className="setting-label">主题</span>
          <div className="theme-toggle">
            <button
              className={settings.theme === 'dark' ? 'active' : ''}
              onClick={() => update('theme', 'dark')}
            >
              <Moon size={14} /> 深色
            </button>
            <button
              className={settings.theme === 'light' ? 'active' : ''}
              onClick={() => update('theme', 'light')}
            >
              <Sun size={14} /> 浅色
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
