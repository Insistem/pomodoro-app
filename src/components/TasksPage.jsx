import React, { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'

export default function TasksPage({ tasks, addTask, completeTask, deleteTask }) {
  const [name, setName] = useState('')
  const [estimated, setEstimated] = useState(1)

  function handleAdd() {
    if (!name.trim()) return
    addTask(name.trim(), estimated)
    setName('')
    setEstimated(1)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="page tasks-page">
      <h2 className="page-title">任务列表</h2>

      {/* 添加任务 */}
      <div className="add-task-row">
        <input
          className="task-input"
          placeholder="添加新任务..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="estimated-wrap">
          <span className="est-label">🍅</span>
          <input
            type="number"
            className="est-input"
            min={1}
            max={20}
            value={estimated}
            onChange={(e) => setEstimated(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
        <button className="add-btn" onClick={handleAdd}>
          <Plus size={18} />
        </button>
      </div>

      {/* 任务列表 */}
      <div className="task-list">
        {tasks.length === 0 && (
          <p className="empty-tip">暂无任务，添加一个开始专注吧 🍅</p>
        )}
        {tasks.map((task) => (
          <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
            <button
              className="task-check"
              onClick={() => completeTask(task.id)}
              title={task.done ? '标记未完成' : '标记完成'}
            >
              {task.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>
            <div className="task-info">
              <span className="task-name">{task.name}</span>
              <span className="task-progress">
                {task.actual}/{task.estimated} 🍅
              </span>
            </div>
            <button
              className="task-delete"
              onClick={() => deleteTask(task.id)}
              title="删除"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* 统计摘要 */}
      {tasks.length > 0 && (
        <div className="tasks-summary">
          <span>共 {tasks.length} 个任务</span>
          <span>已完成 {tasks.filter((t) => t.done).length} 个</span>
          <span>总计 {tasks.reduce((a, t) => a + t.estimated, 0)} 🍅</span>
        </div>
      )}
    </div>
  )
}
