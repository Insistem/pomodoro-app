import React from 'react'
import { Minus, X } from 'lucide-react'

export default function TitleBar({ theme }) {
  const isElectron = !!window.electronAPI

  return (
    <div className={`title-bar ${theme}`}>
      <div className="title-bar-drag">
        <span className="title-text">🍅 番茄时钟</span>
      </div>
      {isElectron && (
        <div className="title-bar-controls">
          <button
            className="ctrl-btn minimize"
            onClick={() => window.electronAPI.minimizeWindow()}
            title="最小化"
          >
            <Minus size={12} />
          </button>
          <button
            className="ctrl-btn close"
            onClick={() => window.electronAPI.closeWindow()}
            title="关闭到托盘"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  )
}
