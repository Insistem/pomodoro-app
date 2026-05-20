import React, { useMemo } from 'react'

function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六']

export default function StatsPage({ stats }) {
  const today = new Date().toISOString().slice(0, 10)
  const todayCount = stats.history[today] || 0
  const totalCount = Object.values(stats.history).reduce((a, b) => a + b, 0)
  const last7 = getLast7Days()
  const maxCount = Math.max(...last7.map((d) => stats.history[d] || 0), 1)

  const weekTotal = last7.reduce((a, d) => a + (stats.history[d] || 0), 0)

  return (
    <div className="page stats-page">
      <h2 className="page-title">统计</h2>

      {/* 概览卡片 */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-num">{todayCount}</div>
          <div className="stat-label">今日番茄</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{weekTotal}</div>
          <div className="stat-label">本周番茄</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{totalCount}</div>
          <div className="stat-label">累计番茄</div>
        </div>
      </div>

      {/* 近7天柱状图 */}
      <div className="chart-section">
        <h3 className="section-title">近 7 天</h3>
        <div className="bar-chart">
          {last7.map((date) => {
            const count = stats.history[date] || 0
            const heightPct = (count / maxCount) * 100
            const dayOfWeek = new Date(date).getDay()
            const isToday = date === today
            return (
              <div key={date} className="bar-col">
                <div className="bar-label-top">{count > 0 ? count : ''}</div>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${isToday ? 'today' : ''}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <div className={`bar-day ${isToday ? 'today' : ''}`}>
                  {DAY_NAMES[dayOfWeek]}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 专注时间换算 */}
      <div className="focus-time">
        <span>今日专注时间约</span>
        <strong> {Math.round((todayCount * 25) / 60 * 10) / 10} 小时</strong>
      </div>
    </div>
  )
}
